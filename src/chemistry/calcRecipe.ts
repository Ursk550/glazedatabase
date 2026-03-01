// Recipe calculations - normalize and validate recipes
import { RecipeLine } from '../materials/materialTypes';

export interface NormalizedRecipe {
  lines: RecipeLine[];
  totalWeight: number;
  isNormalized: boolean;
}

export interface RecipeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Normalize recipe to 100%
export function normalizeRecipe(lines: RecipeLine[]): NormalizedRecipe {
  if (lines.length === 0) {
    return {
      lines: [],
      totalWeight: 0,
      isNormalized: false
    };
  }

  const totalWeight = lines.reduce((sum, line) => sum + line.percentWeight, 0);
  
  if (totalWeight === 0) {
    return {
      lines,
      totalWeight: 0,
      isNormalized: false
    };
  }

  const normalizedLines = lines.map(line => ({
    ...line,
    percentWeight: (line.percentWeight / totalWeight) * 100
  }));

  return {
    lines: normalizedLines,
    totalWeight: 100,
    isNormalized: true
  };
}

// Validate recipe
export function validateRecipe(lines: RecipeLine[]): RecipeValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length === 0) {
    errors.push('Recipe must have at least one material');
  }

  // Check for negative or zero weights
  lines.forEach((line, index) => {
    if (line.percentWeight <= 0) {
      errors.push(`Line ${index + 1} (${line.materialName}): weight must be positive`);
    }
    if (!line.materialName || line.materialName.trim() === '') {
      errors.push(`Line ${index + 1}: material name is required`);
    }
  });

  // Check for duplicate materials
  const materialNames = lines.map(l => l.materialName.toLowerCase());
  const duplicates = materialNames.filter((name, index) => 
    materialNames.indexOf(name) !== index
  );
  if (duplicates.length > 0) {
    warnings.push(`Duplicate materials found: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Calculate total
  const total = lines.reduce((sum, line) => sum + line.percentWeight, 0);
  if (Math.abs(total - 100) > 0.1) {
    warnings.push(`Recipe total is ${total.toFixed(2)}% (not 100%)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Get recipe total weight
export function getRecipeTotal(lines: RecipeLine[]): number {
  return lines.reduce((sum, line) => sum + line.percentWeight, 0);
}

// Scale recipe to target total
export function scaleRecipe(lines: RecipeLine[], targetTotal: number): RecipeLine[] {
  const currentTotal = getRecipeTotal(lines);
  if (currentTotal === 0) return lines;
  
  const scaleFactor = targetTotal / currentTotal;
  return lines.map(line => ({
    ...line,
    percentWeight: line.percentWeight * scaleFactor
  }));
}
