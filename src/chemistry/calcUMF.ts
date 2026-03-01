// Calculate Unity Molecular Formula (UMF) from oxide weights
import { OxideAnalysis } from '../materials/materialTypes';
import { OXIDE_MOLAR_MASSES, FLUX_OXIDES, ALL_OXIDES, OxideKey } from './oxideDefinitions';

export interface UMF {
  fluxes: OxideAnalysis;
  intermediates: OxideAnalysis;
  glassFormers: OxideAnalysis;
  fluxTotal: number;
}

export interface CalcUMFResult {
  umf: UMF;
  moles: OxideAnalysis;
  errors: string[];
}

// Calculate moles from oxide weights
export function calcMoles(oxideWeights: OxideAnalysis): OxideAnalysis {
  const moles: OxideAnalysis = {};

  ALL_OXIDES.forEach(oxideKey => {
    const weight = oxideWeights[oxideKey] || 0;
    if (weight > 0) {
      const molarMass = OXIDE_MOLAR_MASSES[oxideKey];
      moles[oxideKey] = weight / molarMass;
    }
  });

  return moles;
}

// Calculate UMF from oxide weights
export function calcUMF(oxideWeights: OxideAnalysis): CalcUMFResult {
  const errors: string[] = [];

  // Step 1: Calculate moles
  const moles = calcMoles(oxideWeights);

  // Step 2: Calculate flux total
  const fluxTotal = FLUX_OXIDES.reduce((sum, oxideKey) => {
    return sum + (moles[oxideKey] || 0);
  }, 0);

  if (fluxTotal === 0) {
    errors.push('Flux total is zero - cannot calculate UMF. Recipe must contain flux oxides (CaO, MgO, K2O, Na2O, etc.)');
    return {
      umf: {
        fluxes: {},
        intermediates: {},
        glassFormers: {},
        fluxTotal: 0
      },
      moles,
      errors
    };
  }

  // Step 3: Normalize to unity (flux total = 1.0)
  const umfFluxes: OxideAnalysis = {};
  const umfIntermediates: OxideAnalysis = {};
  const umfGlassFormers: OxideAnalysis = {};

  ALL_OXIDES.forEach(oxideKey => {
    const moleValue = moles[oxideKey] || 0;
    if (moleValue > 0) {
      const umfValue = moleValue / fluxTotal;

      if (FLUX_OXIDES.includes(oxideKey)) {
        umfFluxes[oxideKey] = umfValue;
      } else if (oxideKey === 'SiO2' || oxideKey === 'B2O3') {
        umfGlassFormers[oxideKey] = umfValue;
      } else {
        umfIntermediates[oxideKey] = umfValue;
      }
    }
  });

  return {
    umf: {
      fluxes: umfFluxes,
      intermediates: umfIntermediates,
      glassFormers: umfGlassFormers,
      fluxTotal: 1.0
    },
    moles,
    errors
  };
}

// Calculate key ratios
export interface UMFRatios {
  SiO2_Al2O3: number;
  SiO2_flux: number;
  Al2O3_flux: number;
  expansion?: number; // Calculated expansion coefficient estimate
}

export function calcUMFRatios(umf: UMF): UMFRatios {
  const silica = umf.glassFormers.SiO2 || 0;
  const alumina = umf.intermediates.Al2O3 || 0;
  const fluxTotal = umf.fluxTotal;

  return {
    SiO2_Al2O3: alumina > 0 ? silica / alumina : silica > 0 ? Infinity : 0,
    SiO2_flux: fluxTotal > 0 ? silica / fluxTotal : silica > 0 ? Infinity : 0,
    Al2O3_flux: fluxTotal > 0 ? alumina / fluxTotal : alumina > 0 ? Infinity : 0
  };
}

// Get total of specific oxide group
export function getGroupTotal(oxides: OxideAnalysis): number {
  return Object.values(oxides).reduce((sum, val) => sum + (val || 0), 0);
}

// Verify flux unity (should be ~1.0)
export function verifyFluxUnity(umf: UMF): boolean {
  const calculatedFluxTotal = getGroupTotal(umf.fluxes);
  return Math.abs(calculatedFluxTotal - 1.0) < 0.01;
}
