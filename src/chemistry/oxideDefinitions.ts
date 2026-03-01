// Oxide definitions and molar masses
import { OxideKey } from '../materials/materialTypes';

// Molar masses in g/mol
export const OXIDE_MOLAR_MASSES: Record<OxideKey, number> = {
  SiO2: 60.08,
  Al2O3: 101.96,
  B2O3: 69.62,
  CaO: 56.08,
  MgO: 40.30,
  K2O: 94.20,
  Na2O: 61.98,
  Li2O: 29.88,
  ZnO: 81.39,
  Fe2O3: 159.69,
  TiO2: 79.87,
  P2O5: 141.94,
  MnO: 70.94,
  BaO: 153.33,
  SrO: 103.62
};

// Flux oxides (RO and R2O) used for UMF normalization
export const FLUX_OXIDES: OxideKey[] = [
  'CaO',
  'MgO',
  'K2O',
  'Na2O',
  'Li2O',
  'ZnO',
  'BaO',
  'SrO'
];

// Glass former oxides
export const GLASS_FORMERS: OxideKey[] = [
  'SiO2',
  'B2O3'
];

// Intermediate/amphoteric oxides
export const INTERMEDIATES: OxideKey[] = [
  'Al2O3',
  'Fe2O3',
  'TiO2'
];

// All oxide keys in typical display order
export const ALL_OXIDES: OxideKey[] = [
  'SiO2',
  'Al2O3',
  'B2O3',
  'CaO',
  'MgO',
  'K2O',
  'Na2O',
  'Li2O',
  'ZnO',
  'BaO',
  'SrO',
  'Fe2O3',
  'TiO2',
  'P2O5',
  'MnO'
];

// Get oxide category
export function getOxideCategory(oxide: OxideKey): 'flux' | 'glass-former' | 'intermediate' {
  if (FLUX_OXIDES.includes(oxide)) return 'flux';
  if (GLASS_FORMERS.includes(oxide)) return 'glass-former';
  if (INTERMEDIATES.includes(oxide)) return 'intermediate';
  return 'intermediate';
}

// Get oxide name/description
export const OXIDE_NAMES: Record<OxideKey, string> = {
  SiO2: 'Silica',
  Al2O3: 'Alumina',
  B2O3: 'Boric Oxide',
  CaO: 'Calcium Oxide',
  MgO: 'Magnesium Oxide',
  K2O: 'Potassium Oxide',
  Na2O: 'Sodium Oxide',
  Li2O: 'Lithium Oxide',
  ZnO: 'Zinc Oxide',
  Fe2O3: 'Iron Oxide',
  TiO2: 'Titanium Oxide',
  P2O5: 'Phosphorus Oxide',
  MnO: 'Manganese Oxide',
  BaO: 'Barium Oxide',
  SrO: 'Strontium Oxide'
};
