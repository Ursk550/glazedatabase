// Tests for oxide calculations
import { describe, it, expect } from 'vitest';
import { calcOxides, normalizeOxideWeights } from './calcOxides';
import type { Material, RecipeLine } from '../materials/materialTypes';

describe('calcOxides', () => {
  const testMaterials: Material[] = [
    {
      name: 'Silica',
      oxideAnalysis: {
        SiO2: 99.5
      }
    },
    {
      name: 'EPK Kaolin',
      oxideAnalysis: {
        SiO2: 46.3,
        Al2O3: 38.5
      }
    },
    {
      name: 'Whiting',
      oxideAnalysis: {
        CaO: 56.0
      }
    },
    {
      name: 'Custer Feldspar',
      oxideAnalysis: {
        SiO2: 68.5,
        Al2O3: 17.0,
        K2O: 10.0,
        Na2O: 3.0
      }
    }
  ];

  it('should calculate oxide weights for a simple recipe', () => {
    const recipe: RecipeLine[] = [
      { materialName: 'Silica', percentWeight: 50 },
      { materialName: 'Whiting', percentWeight: 50 }
    ];

    const result = calcOxides(recipe, testMaterials);

    expect(result.errors).toHaveLength(0);
    expect(result.oxideWeights.oxides.SiO2).toBeCloseTo(49.75, 2); // 50 * 99.5 / 100
    expect(result.oxideWeights.oxides.CaO).toBeCloseTo(28.0, 2); // 50 * 56.0 / 100
  });

  it('should calculate oxide weights for Leach 4321 cone 6 recipe', () => {
    // Leach 4321 base recipe: 40% Feldspar, 30% Silica, 20% Whiting, 10% Kaolin
    const recipe: RecipeLine[] = [
      { materialName: 'Custer Feldspar', percentWeight: 40 },
      { materialName: 'Silica', percentWeight: 30 },
      { materialName: 'Whiting', percentWeight: 20 },
      { materialName: 'EPK Kaolin', percentWeight: 10 }
    ];

    const result = calcOxides(recipe, testMaterials);

    expect(result.errors).toHaveLength(0);
    
    // Expected oxide weights (approximate)
    // SiO2: 40*0.685 + 30*0.995 + 10*0.463 = 27.4 + 29.85 + 4.63 = 61.88
    expect(result.oxideWeights.oxides.SiO2).toBeGreaterThan(60);
    expect(result.oxideWeights.oxides.SiO2).toBeLessThan(63);
    
    // Al2O3: 40*0.17 + 10*0.385 = 6.8 + 3.85 = 10.65
    expect(result.oxideWeights.oxides.Al2O3).toBeGreaterThan(10);
    expect(result.oxideWeights.oxides.Al2O3).toBeLessThan(11);
    
    // CaO: 20*0.56 = 11.2
    expect(result.oxideWeights.oxides.CaO).toBeGreaterThan(11);
    expect(result.oxideWeights.oxides.CaO).toBeLessThan(12);
    
    // K2O: 40*0.10 = 4.0
    expect(result.oxideWeights.oxides.K2O).toBeCloseTo(4.0, 1);
    
    // Na2O: 40*0.03 = 1.2
    expect(result.oxideWeights.oxides.Na2O).toBeCloseTo(1.2, 1);
  });

  it('should return error for missing material', () => {
    const recipe: RecipeLine[] = [
      { materialName: 'NonExistent Material', percentWeight: 100 }
    ];

    const result = calcOxides(recipe, testMaterials);

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('not found');
  });

  it('should normalize oxide weights to 100%', () => {
    const oxideWeights = {
      SiO2: 50,
      Al2O3: 25,
      CaO: 25
    };

    const normalized = normalizeOxideWeights(oxideWeights);

    expect(normalized.SiO2).toBeCloseTo(50, 1);
    expect(normalized.Al2O3).toBeCloseTo(25, 1);
    expect(normalized.CaO).toBeCloseTo(25, 1);
  });
});
