// Generate adjustment suggestions for glaze recipes
import { RecipeLine, Material } from '../materials/materialTypes';
import { UMF, calcUMFRatios } from './calcUMF';
import { calcOxides } from './calcOxides';
import { calcUMF } from './calcUMF';
import { normalizeRecipe } from './calcRecipe';

export type AdjustmentGoal = 
  | 'increase-durability'
  | 'more-glossy'
  | 'more-matte'
  | 'reduce-crazing'
  | 'increase-melt';

export interface RecipeAdjustment {
  materialName: string;
  originalPercent: number;
  newPercent: number;
  change: number;
}

export interface Suggestion {
  goal: AdjustmentGoal;
  title: string;
  description: string;
  rationale: string;
  adjustments: RecipeAdjustment[];
  newRecipe: RecipeLine[];
  newUMF?: UMF;
  tradeoffs: string[];
}

// Helper to find material in recipe
function findMaterialInRecipe(recipe: RecipeLine[], materialName: string): RecipeLine | undefined {
  return recipe.find(line => 
    line.materialName.toLowerCase().includes(materialName.toLowerCase())
  );
}

// Helper to adjust material percentage
function adjustMaterial(
  recipe: RecipeLine[],
  materialName: string,
  changeAmount: number
): RecipeLine[] {
  const newRecipe = [...recipe];
  const existing = newRecipe.find(line => 
    line.materialName.toLowerCase().includes(materialName.toLowerCase())
  );

  if (existing) {
    existing.percentWeight += changeAmount;
  } else {
    newRecipe.push({
      materialName,
      percentWeight: Math.abs(changeAmount)
    });
  }

  return newRecipe.filter(line => line.percentWeight > 0.1);
}

// Generate suggestions based on current UMF
export function generateSuggestions(
  recipe: RecipeLine[],
  materials: Material[],
  currentUMF: UMF
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const silica = currentUMF.glassFormers.SiO2 || 0;
  const alumina = currentUMF.intermediates.Al2O3 || 0;
  const boron = currentUMF.glassFormers.B2O3 || 0;

  // Suggestion 1: Increase Durability (add alumina)
  const durabilitySuggestion = generateDurabilitySuggestion(recipe, materials, alumina);
  if (durabilitySuggestion) suggestions.push(durabilitySuggestion);

  // Suggestion 2: More Glossy (increase silica, reduce alumina)
  const glossySuggestion = generateGlossySuggestion(recipe, materials, silica, alumina);
  if (glossySuggestion) suggestions.push(glossySuggestion);

  // Suggestion 3: More Matte (increase alumina)
  const matteSuggestion = generateMatteSuggestion(recipe, materials, alumina);
  if (matteSuggestion) suggestions.push(matteSuggestion);

  // Suggestion 4: Reduce Crazing (increase silica)
  const crazingSuggestion = generateCrazingSuggestion(recipe, materials, silica);
  if (crazingSuggestion) suggestions.push(crazingSuggestion);

  // Suggestion 5: Increase Melt (add flux)
  const meltSuggestion = generateMeltSuggestion(recipe, materials, boron);
  if (meltSuggestion) suggestions.push(meltSuggestion);

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

function generateDurabilitySuggestion(
  recipe: RecipeLine[],
  materials: Material[],
  currentAlumina: number
): Suggestion | null {
  // Add kaolin or other clay to increase alumina
  let newRecipe = [...recipe];
  const adjustments: RecipeAdjustment[] = [];

  // Try to find EPK or kaolin in recipe
  const kaolin = findMaterialInRecipe(recipe, 'kaolin') || findMaterialInRecipe(recipe, 'EPK');
  
  if (kaolin) {
    const originalPercent = kaolin.percentWeight;
    const newPercent = originalPercent + 5;
    newRecipe = adjustMaterial(newRecipe, kaolin.materialName, 5);
    adjustments.push({
      materialName: kaolin.materialName,
      originalPercent,
      newPercent,
      change: 5
    });
  } else {
    // Add new EPK
    newRecipe.push({ materialName: 'EPK Kaolin', percentWeight: 5 });
    adjustments.push({
      materialName: 'EPK Kaolin',
      originalPercent: 0,
      newPercent: 5,
      change: 5
    });
  }

  // Reduce flux proportionally (reduce feldspar if present)
  const feldspar = findMaterialInRecipe(recipe, 'feldspar');
  if (feldspar && feldspar.percentWeight > 5) {
    const originalPercent = feldspar.percentWeight;
    const newPercent = originalPercent - 5;
    newRecipe = adjustMaterial(newRecipe, feldspar.materialName, -5);
    adjustments.push({
      materialName: feldspar.materialName,
      originalPercent,
      newPercent,
      change: -5
    });
  }

  const normalized = normalizeRecipe(newRecipe);
  const newOxides = calcOxides(normalized.lines, materials);
  const newUMFResult = calcUMF(newOxides.oxideWeights.oxides);

  return {
    goal: 'increase-durability',
    title: 'Increase Durability',
    description: 'Add alumina to improve hardness and scratch resistance',
    rationale: `Current Al₂O₃: ${currentAlumina.toFixed(3)}. Adding clay increases alumina, which improves glaze hardness, reduces crazing, and increases chemical durability.`,
    adjustments,
    newRecipe: normalized.lines,
    newUMF: newUMFResult.umf,
    tradeoffs: [
      'May reduce gloss and create more matte surface',
      'Slightly increases firing temperature needs',
      'May slow down melting'
    ]
  };
}

function generateGlossySuggestion(
  recipe: RecipeLine[],
  materials: Material[],
  currentSilica: number,
  currentAlumina: number
): Suggestion | null {
  let newRecipe = [...recipe];
  const adjustments: RecipeAdjustment[] = [];

  // Add silica
  const silica = findMaterialInRecipe(recipe, 'silica');
  if (silica) {
    const originalPercent = silica.percentWeight;
    const newPercent = originalPercent + 3;
    newRecipe = adjustMaterial(newRecipe, silica.materialName, 3);
    adjustments.push({
      materialName: silica.materialName,
      originalPercent,
      newPercent,
      change: 3
    });
  } else {
    newRecipe.push({ materialName: 'Silica', percentWeight: 3 });
    adjustments.push({
      materialName: 'Silica',
      originalPercent: 0,
      newPercent: 3,
      change: 3
    });
  }

  // Reduce clay/kaolin
  const kaolin = findMaterialInRecipe(recipe, 'kaolin') || findMaterialInRecipe(recipe, 'clay');
  if (kaolin && kaolin.percentWeight > 3) {
    const originalPercent = kaolin.percentWeight;
    const newPercent = originalPercent - 3;
    newRecipe = adjustMaterial(newRecipe, kaolin.materialName, -3);
    adjustments.push({
      materialName: kaolin.materialName,
      originalPercent,
      newPercent,
      change: -3
    });
  }

  const normalized = normalizeRecipe(newRecipe);
  const newOxides = calcOxides(normalized.lines, materials);
  const newUMFResult = calcUMF(newOxides.oxideWeights.oxides);

  return {
    goal: 'more-glossy',
    title: 'Increase Gloss',
    description: 'Adjust silica:alumina ratio for glossier surface',
    rationale: `Current SiO₂: ${currentSilica.toFixed(3)}, Al₂O₃: ${currentAlumina.toFixed(3)}. Increasing silica and reducing alumina creates a smoother, glossier melt.`,
    adjustments,
    newRecipe: normalized.lines,
    newUMF: newUMFResult.umf,
    tradeoffs: [
      'May slightly increase crazing risk',
      'Reduces hardness and durability',
      'May make glaze slightly more runny'
    ]
  };
}

function generateMatteSuggestion(
  recipe: RecipeLine[],
  materials: Material[],
  currentAlumina: number
): Suggestion | null {
  let newRecipe = [...recipe];
  const adjustments: RecipeAdjustment[] = [];

  // Add kaolin for matte surface
  const kaolin = findMaterialInRecipe(recipe, 'kaolin') || findMaterialInRecipe(recipe, 'EPK');
  if (kaolin) {
    const originalPercent = kaolin.percentWeight;
    const newPercent = originalPercent + 6;
    newRecipe = adjustMaterial(newRecipe, kaolin.materialName, 6);
    adjustments.push({
      materialName: kaolin.materialName,
      originalPercent,
      newPercent,
      change: 6
    });
  } else {
    newRecipe.push({ materialName: 'EPK Kaolin', percentWeight: 6 });
    adjustments.push({
      materialName: 'EPK Kaolin',
      originalPercent: 0,
      newPercent: 6,
      change: 6
    });
  }

  // Reduce silica
  const silica = findMaterialInRecipe(recipe, 'silica');
  if (silica && silica.percentWeight > 6) {
    const originalPercent = silica.percentWeight;
    const newPercent = originalPercent - 6;
    newRecipe = adjustMaterial(newRecipe, silica.materialName, -6);
    adjustments.push({
      materialName: silica.materialName,
      originalPercent,
      newPercent,
      change: -6
    });
  }

  const normalized = normalizeRecipe(newRecipe);
  const newOxides = calcOxides(normalized.lines, materials);
  const newUMFResult = calcUMF(newOxides.oxideWeights.oxides);

  return {
    goal: 'more-matte',
    title: 'Create Matte Surface',
    description: 'Increase alumina for matte, satin finish',
    rationale: `Current Al₂O₃: ${currentAlumina.toFixed(3)}. Increasing alumina creates micro-crystals during cooling, producing a matte surface.`,
    adjustments,
    newRecipe: normalized.lines,
    newUMF: newUMFResult.umf,
    tradeoffs: [
      'May require higher firing temperature',
      'Surface may be less smooth',
      'Could be more difficult to clean'
    ]
  };
}

function generateCrazingSuggestion(
  recipe: RecipeLine[],
  materials: Material[],
  currentSilica: number
): Suggestion | null {
  let newRecipe = [...recipe];
  const adjustments: RecipeAdjustment[] = [];

  // Add silica to reduce expansion
  const silica = findMaterialInRecipe(recipe, 'silica');
  if (silica) {
    const originalPercent = silica.percentWeight;
    const newPercent = originalPercent + 4;
    newRecipe = adjustMaterial(newRecipe, silica.materialName, 4);
    adjustments.push({
      materialName: silica.materialName,
      originalPercent,
      newPercent,
      change: 4
    });
  } else {
    newRecipe.push({ materialName: 'Silica', percentWeight: 4 });
    adjustments.push({
      materialName: 'Silica',
      originalPercent: 0,
      newPercent: 4,
      change: 4
    });
  }

  // Reduce high-expansion flux if present (sodium)
  const nepheline = findMaterialInRecipe(recipe, 'nepheline');
  if (nepheline && nepheline.percentWeight > 4) {
    const originalPercent = nepheline.percentWeight;
    const newPercent = originalPercent - 4;
    newRecipe = adjustMaterial(newRecipe, nepheline.materialName, -4);
    adjustments.push({
      materialName: nepheline.materialName,
      originalPercent,
      newPercent,
      change: -4
    });
  }

  const normalized = normalizeRecipe(newRecipe);
  const newOxides = calcOxides(normalized.lines, materials);
  const newUMFResult = calcUMF(newOxides.oxideWeights.oxides);

  return {
    goal: 'reduce-crazing',
    title: 'Reduce Crazing Risk',
    description: 'Lower thermal expansion to prevent crazing',
    rationale: `Current SiO₂: ${currentSilica.toFixed(3)}. Increasing silica and reducing high-expansion fluxes lowers the glaze expansion coefficient, reducing crazing.`,
    adjustments,
    newRecipe: normalized.lines,
    newUMF: newUMFResult.umf,
    tradeoffs: [
      'May require slightly higher firing temperature',
      'Could make glaze less fluid',
      'May create more matte surface'
    ]
  };
}

function generateMeltSuggestion(
  recipe: RecipeLine[],
  materials: Material[],
  currentBoron: number
): Suggestion | null {
  let newRecipe = [...recipe];
  const adjustments: RecipeAdjustment[] = [];

  // Add flux (boron frit or feldspar)
  const frit = findMaterialInRecipe(recipe, 'frit') || findMaterialInRecipe(recipe, '3134');
  if (frit) {
    const originalPercent = frit.percentWeight;
    const newPercent = originalPercent + 5;
    newRecipe = adjustMaterial(newRecipe, frit.materialName, 5);
    adjustments.push({
      materialName: frit.materialName,
      originalPercent,
      newPercent,
      change: 5
    });
  } else {
    newRecipe.push({ materialName: 'Ferro Frit 3134', percentWeight: 5 });
    adjustments.push({
      materialName: 'Ferro Frit 3134',
      originalPercent: 0,
      newPercent: 5,
      change: 5
    });
  }

  // Reduce refractory material
  const kaolin = findMaterialInRecipe(recipe, 'kaolin');
  if (kaolin && kaolin.percentWeight > 5) {
    const originalPercent = kaolin.percentWeight;
    const newPercent = originalPercent - 5;
    newRecipe = adjustMaterial(newRecipe, kaolin.materialName, -5);
    adjustments.push({
      materialName: kaolin.materialName,
      originalPercent,
      newPercent,
      change: -5
    });
  }

  const normalized = normalizeRecipe(newRecipe);
  const newOxides = calcOxides(normalized.lines, materials);
  const newUMFResult = calcUMF(newOxides.oxideWeights.oxides);

  return {
    goal: 'increase-melt',
    title: 'Increase Melt',
    description: 'Lower melting point for better flow',
    rationale: `Current B₂O₃: ${currentBoron.toFixed(3)}. Adding flux reduces melting temperature and improves glaze flow and surface quality.`,
    adjustments,
    newRecipe: normalized.lines,
    newUMF: newUMFResult.umf,
    tradeoffs: [
      'May increase running/dripping',
      'Could increase crazing tendency',
      'May reduce durability slightly'
    ]
  };
}
