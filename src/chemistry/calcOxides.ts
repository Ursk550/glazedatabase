// Calculate total oxide weights from recipe and materials
import { RecipeLine, Material, OxideAnalysis } from '../materials/materialTypes';
import { ALL_OXIDES, OxideKey } from './oxideDefinitions';

export interface OxideWeights {
  oxides: OxideAnalysis;
  total: number;
}

export interface CalcOxidesResult {
  oxideWeights: OxideWeights;
  errors: string[];
}

// Calculate oxide weights from recipe
export function calcOxides(
  recipe: RecipeLine[],
  materials: Material[]
): CalcOxidesResult {
  const errors: string[] = [];
  const oxideWeights: OxideAnalysis = {};

  // Build material lookup map
  const materialMap = new Map<string, Material>();
  materials.forEach(m => {
    materialMap.set(m.name.toLowerCase(), m);
    if (m.id !== undefined) {
      materialMap.set(m.id.toString(), m);
    }
  });

  // Calculate contribution from each recipe line
  recipe.forEach((line, index) => {
    // Try to find material by name first, then by ID if available
    let material = materialMap.get(line.materialName.toLowerCase());
    
    if (!material && line.materialId !== undefined) {
      material = materialMap.get(line.materialId.toString());
    }

    if (!material) {
      errors.push(`Material not found: ${line.materialName} (line ${index + 1})`);
      return;
    }

    if (!material.oxideAnalysis) {
      errors.push(`Material ${material.name} has no oxide analysis (line ${index + 1})`);
      return;
    }

    // Add contribution from this material
    ALL_OXIDES.forEach(oxideKey => {
      const oxidePercent = material.oxideAnalysis[oxideKey] || 0;
      if (oxidePercent > 0) {
        const contribution = (line.percentWeight * oxidePercent) / 100;
        oxideWeights[oxideKey] = (oxideWeights[oxideKey] || 0) + contribution;
      }
    });
  });

  // Calculate total
  const total = ALL_OXIDES.reduce((sum, key) => sum + (oxideWeights[key] || 0), 0);

  return {
    oxideWeights: {
      oxides: oxideWeights,
      total
    },
    errors
  };
}

// Normalize oxide weights to 100%
export function normalizeOxideWeights(oxideWeights: OxideAnalysis): OxideAnalysis {
  const total = ALL_OXIDES.reduce((sum, key) => sum + (oxideWeights[key] || 0), 0);
  
  if (total === 0) return oxideWeights;

  const normalized: OxideAnalysis = {};
  ALL_OXIDES.forEach(key => {
    if (oxideWeights[key]) {
      normalized[key] = (oxideWeights[key]! / total) * 100;
    }
  });

  return normalized;
}

// Get oxide weight percentage
export function getOxidePercent(oxideWeights: OxideWeights, oxide: OxideKey): number {
  if (oxideWeights.total === 0) return 0;
  return ((oxideWeights.oxides[oxide] || 0) / oxideWeights.total) * 100;
}
