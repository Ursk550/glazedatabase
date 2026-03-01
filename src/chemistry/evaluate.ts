// Evaluate UMF against limit formulas
import { UMF, UMFRatios } from './calcUMF';
import { LimitSet, OxideLimit } from './limits';
import { OxideKey } from './oxideDefinitions';

export type OxideStatus = 'low' | 'ok' | 'high' | 'not-present';

export interface OxideEvaluation {
  oxide: OxideKey;
  value: number;
  limit?: OxideLimit;
  status: OxideStatus;
  message: string;
}

export interface RatioEvaluation {
  name: string;
  value: number;
  min?: number;
  max?: number;
  status: OxideStatus;
  message: string;
}

export interface EvaluationResult {
  oxideEvaluations: OxideEvaluation[];
  ratioEvaluations: RatioEvaluation[];
  stabilityScore: number;
  overallMessage: string;
  warnings: string[];
  suggestions: string[];
}

// Evaluate a single oxide value against its limit
function evaluateOxide(
  oxide: OxideKey,
  value: number,
  limit?: OxideLimit
): OxideEvaluation {
  if (!limit) {
    return {
      oxide,
      value,
      status: 'not-present',
      message: 'No limit defined'
    };
  }

  if (value === 0) {
    if (limit.min > 0) {
      return {
        oxide,
        value,
        limit,
        status: 'low',
        message: `Missing ${oxide} (expected ${limit.min.toFixed(2)}-${limit.max.toFixed(2)})`
      };
    }
    return {
      oxide,
      value,
      limit,
      status: 'ok',
      message: 'Not required'
    };
  }

  if (value < limit.min) {
    const diff = ((limit.min - value) / limit.min) * 100;
    return {
      oxide,
      value,
      limit,
      status: 'low',
      message: `Low ${oxide}: ${value.toFixed(3)} (min ${limit.min.toFixed(2)}, ${diff.toFixed(0)}% below)`
    };
  }

  if (value > limit.max) {
    const diff = ((value - limit.max) / limit.max) * 100;
    return {
      oxide,
      value,
      limit,
      status: 'high',
      message: `High ${oxide}: ${value.toFixed(3)} (max ${limit.max.toFixed(2)}, ${diff.toFixed(0)}% above)`
    };
  }

  // In range
  let msg = `${oxide}: ${value.toFixed(3)} ✓`;
  if (limit.ideal !== undefined) {
    const deviation = Math.abs(value - limit.ideal);
    if (deviation < 0.05) {
      msg += ' (near ideal)';
    }
  }

  return {
    oxide,
    value,
    limit,
    status: 'ok',
    message: msg
  };
}

// Evaluate UMF against limit set
export function evaluateUMF(umf: UMF, ratios: UMFRatios, limitSet: LimitSet): EvaluationResult {
  const oxideEvaluations: OxideEvaluation[] = [];
  const ratioEvaluations: RatioEvaluation[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Evaluate fluxes
  Object.entries(umf.fluxes).forEach(([oxideKey, value]) => {
    const limit = limitSet.fluxes[oxideKey as OxideKey];
    oxideEvaluations.push(evaluateOxide(oxideKey as OxideKey, value || 0, limit));
  });

  // Evaluate intermediates
  Object.entries(umf.intermediates).forEach(([oxideKey, value]) => {
    const limit = limitSet.intermediates[oxideKey as OxideKey];
    oxideEvaluations.push(evaluateOxide(oxideKey as OxideKey, value || 0, limit));
  });

  // Evaluate glass formers
  Object.entries(umf.glassFormers).forEach(([oxideKey, value]) => {
    const limit = limitSet.glassFormers[oxideKey as OxideKey];
    oxideEvaluations.push(evaluateOxide(oxideKey as OxideKey, value || 0, limit));
  });

  // Evaluate ratios
  if (limitSet.ratios?.SiO2_Al2O3) {
    const limit = limitSet.ratios.SiO2_Al2O3;
    const value = ratios.SiO2_Al2O3;
    let status: OxideStatus = 'ok';
    let message = `SiO₂:Al₂O₃ = ${value.toFixed(2)}:1`;

    if (value < limit.min) {
      status = 'low';
      message += ` (low, min ${limit.min})`;
      suggestions.push('Increase silica or reduce alumina to improve ratio');
    } else if (value > limit.max) {
      status = 'high';
      message += ` (high, max ${limit.max})`;
      suggestions.push('Reduce silica or increase alumina to improve ratio');
    } else {
      message += ' ✓';
    }

    ratioEvaluations.push({
      name: 'SiO2:Al2O3',
      value,
      min: limit.min,
      max: limit.max,
      status,
      message
    });
  }

  // Calculate stability score (0-100)
  let score = 100;
  let issueCount = 0;

  oxideEvaluations.forEach(eval => {
    if (eval.status === 'low' || eval.status === 'high') {
      issueCount++;
      if (eval.limit) {
        const value = eval.value;
        const { min, max } = eval.limit;
        if (eval.status === 'low' && min > 0) {
          const deviation = ((min - value) / min) * 100;
          score -= Math.min(20, deviation / 5);
        } else if (eval.status === 'high') {
          const deviation = ((value - max) / max) * 100;
          score -= Math.min(20, deviation / 5);
        }
      }
    }
  });

  ratioEvaluations.forEach(eval => {
    if (eval.status === 'low' || eval.status === 'high') {
      score -= 10;
    }
  });

  score = Math.max(0, Math.round(score));

  // Generate overall message
  let overallMessage = '';
  if (score >= 90) {
    overallMessage = '✓ Excellent - Formula is well within limits';
  } else if (score >= 70) {
    overallMessage = '⚠ Good - Minor adjustments recommended';
  } else if (score >= 50) {
    overallMessage = '⚠ Fair - Several issues detected';
  } else {
    overallMessage = '✗ Poor - Significant issues, reformulation recommended';
  }

  // Generate warnings
  const lowOxides = oxideEvaluations.filter(e => e.status === 'low');
  const highOxides = oxideEvaluations.filter(e => e.status === 'high');

  if (lowOxides.length > 0) {
    warnings.push(`${lowOxides.length} oxide(s) below recommended range`);
  }
  if (highOxides.length > 0) {
    warnings.push(`${highOxides.length} oxide(s) above recommended range`);
  }

  // Specific glaze behavior warnings
  const silica = umf.glassFormers.SiO2 || 0;
  const alumina = umf.intermediates.Al2O3 || 0;

  if (silica < (limitSet.glassFormers.SiO2?.min || 0)) {
    warnings.push('Low silica may cause glaze to be underfired or too fluid');
  }
  if (alumina < (limitSet.intermediates.Al2O3?.min || 0)) {
    warnings.push('Low alumina may cause poor durability and crazing');
  }
  if (alumina > (limitSet.intermediates.Al2O3?.max || 0)) {
    warnings.push('High alumina may cause matte surface or underfiring');
  }

  return {
    oxideEvaluations,
    ratioEvaluations,
    stabilityScore: score,
    overallMessage,
    warnings,
    suggestions
  };
}
