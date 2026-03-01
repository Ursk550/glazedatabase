// Type definitions for materials and oxide analysis

export type OxideKey = 
  | 'SiO2' 
  | 'Al2O3' 
  | 'B2O3' 
  | 'CaO' 
  | 'MgO' 
  | 'K2O' 
  | 'Na2O' 
  | 'Li2O' 
  | 'ZnO' 
  | 'Fe2O3' 
  | 'TiO2' 
  | 'P2O5' 
  | 'MnO'
  | 'BaO'
  | 'SrO';

export interface OxideAnalysis {
  SiO2?: number;
  Al2O3?: number;
  B2O3?: number;
  CaO?: number;
  MgO?: number;
  K2O?: number;
  Na2O?: number;
  Li2O?: number;
  ZnO?: number;
  Fe2O3?: number;
  TiO2?: number;
  P2O5?: number;
  MnO?: number;
  BaO?: number;
  SrO?: number;
  LOI?: number; // Loss on ignition
}

export interface Material {
  id?: number;
  name: string;
  description?: string;
  oxideAnalysis: OxideAnalysis;
  loi?: number; // Loss on ignition percentage
}

export interface RecipeLine {
  materialId?: number;
  materialName: string;
  percentWeight: number;
}

export interface Recipe {
  id?: number;
  name: string;
  description?: string;
  lines: RecipeLine[];
  firingRange?: 'low-fire' | 'cone6' | 'cone10';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestLog {
  id?: number;
  recipeId?: number;
  recipeName: string;
  testDate: Date;
  firingTemp: number;
  cone?: string;
  notes: string;
  images?: Blob[];
  imageRefs?: string[];
}
