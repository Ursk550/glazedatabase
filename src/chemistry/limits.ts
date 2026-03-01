// Limit formula ranges for different firing ranges
import { type OxideKey } from './oxideDefinitions';

export interface OxideLimit {
  min: number;
  max: number;
  ideal?: number;
}

export interface LimitSet {
  name: string;
  description: string;
  firingRange: 'low-fire' | 'cone6' | 'cone10';
  tempRange: string;
  fluxes: Partial<Record<OxideKey, OxideLimit>>;
  intermediates: Partial<Record<OxideKey, OxideLimit>>;
  glassFormers: Partial<Record<OxideKey, OxideLimit>>;
  ratios?: {
    SiO2_Al2O3?: { min: number; max: number; ideal?: number };
  };
}

// Default limit sets based on typical glaze formulas
export const DEFAULT_LIMITS: Record<string, LimitSet> = {
  'low-fire': {
    name: 'Low Fire',
    description: 'Cone 06-04 (1830-1945°F / 1000-1060°C)',
    firingRange: 'low-fire',
    tempRange: '1830-1945°F',
    fluxes: {
      CaO: { min: 0.1, max: 0.4, ideal: 0.25 },
      MgO: { min: 0, max: 0.2, ideal: 0.1 },
      K2O: { min: 0, max: 0.3, ideal: 0.15 },
      Na2O: { min: 0.1, max: 0.6, ideal: 0.4 },
      Li2O: { min: 0, max: 0.3, ideal: 0.1 },
      ZnO: { min: 0, max: 0.3, ideal: 0.1 },
      BaO: { min: 0, max: 0.3, ideal: 0 },
      SrO: { min: 0, max: 0.2, ideal: 0 }
    },
    intermediates: {
      Al2O3: { min: 0.05, max: 0.25, ideal: 0.15 },
      Fe2O3: { min: 0, max: 0.1, ideal: 0 },
      TiO2: { min: 0, max: 0.1, ideal: 0 }
    },
    glassFormers: {
      SiO2: { min: 1.5, max: 3.0, ideal: 2.2 },
      B2O3: { min: 0.2, max: 1.0, ideal: 0.5 }
    },
    ratios: {
      SiO2_Al2O3: { min: 6, max: 15, ideal: 10 }
    }
  },
  'cone6': {
    name: 'Cone 6',
    description: 'Cone 5-6 (2185-2232°F / 1196-1222°C)',
    firingRange: 'cone6',
    tempRange: '2185-2232°F',
    fluxes: {
      CaO: { min: 0.3, max: 0.7, ideal: 0.5 },
      MgO: { min: 0, max: 0.35, ideal: 0.15 },
      K2O: { min: 0.1, max: 0.4, ideal: 0.25 },
      Na2O: { min: 0.1, max: 0.4, ideal: 0.25 },
      Li2O: { min: 0, max: 0.3, ideal: 0 },
      ZnO: { min: 0, max: 0.3, ideal: 0.1 },
      BaO: { min: 0, max: 0.5, ideal: 0 },
      SrO: { min: 0, max: 0.3, ideal: 0 }
    },
    intermediates: {
      Al2O3: { min: 0.2, max: 0.5, ideal: 0.35 },
      Fe2O3: { min: 0, max: 0.15, ideal: 0 },
      TiO2: { min: 0, max: 0.15, ideal: 0 }
    },
    glassFormers: {
      SiO2: { min: 2.5, max: 4.5, ideal: 3.5 },
      B2O3: { min: 0, max: 0.7, ideal: 0.3 }
    },
    ratios: {
      SiO2_Al2O3: { min: 5, max: 12, ideal: 8 }
    }
  },
  'cone10': {
    name: 'Cone 10',
    description: 'Cone 9-10 (2300-2381°F / 1260-1305°C)',
    firingRange: 'cone10',
    tempRange: '2300-2381°F',
    fluxes: {
      CaO: { min: 0.4, max: 0.8, ideal: 0.6 },
      MgO: { min: 0, max: 0.4, ideal: 0.2 },
      K2O: { min: 0.1, max: 0.4, ideal: 0.25 },
      Na2O: { min: 0, max: 0.3, ideal: 0.15 },
      Li2O: { min: 0, max: 0.2, ideal: 0 },
      ZnO: { min: 0, max: 0.25, ideal: 0 },
      BaO: { min: 0, max: 0.6, ideal: 0 },
      SrO: { min: 0, max: 0.4, ideal: 0 }
    },
    intermediates: {
      Al2O3: { min: 0.25, max: 0.6, ideal: 0.4 },
      Fe2O3: { min: 0, max: 0.2, ideal: 0 },
      TiO2: { min: 0, max: 0.2, ideal: 0 }
    },
    glassFormers: {
      SiO2: { min: 3.0, max: 5.5, ideal: 4.0 },
      B2O3: { min: 0, max: 0.5, ideal: 0 }
    },
    ratios: {
      SiO2_Al2O3: { min: 5, max: 11, ideal: 8 }
    }
  }
};

// Get limit set by firing range
export function getLimitSet(firingRange: 'low-fire' | 'cone6' | 'cone10'): LimitSet {
  return DEFAULT_LIMITS[firingRange];
}

// Get all available limit sets
export function getAllLimitSets(): LimitSet[] {
  return Object.values(DEFAULT_LIMITS);
}
