// Tests for UMF calculations
import { describe, it, expect } from 'vitest';
import { calcUMF, calcUMFRatios, verifyFluxUnity } from './calcUMF';
import { calcOxides } from './calcOxides';
import type { Material, RecipeLine } from '../materials/materialTypes';

describe('calcUMF', () => {
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
        Na2O: 3.0,
        CaO: 0.3
      }
    }
  ];

  it('should calculate UMF for Leach 4321 recipe', () => {
    // Leach 4321: 40% Feldspar, 30% Silica, 20% Whiting, 10% Kaolin
    const recipe: RecipeLine[] = [
      { materialName: 'Custer Feldspar', percentWeight: 40 },
      { materialName: 'Silica', percentWeight: 30 },
      { materialName: 'Whiting', percentWeight: 20 },
      { materialName: 'EPK Kaolin', percentWeight: 10 }
    ];

    const oxideResult = calcOxides(recipe, testMaterials);
    const umfResult = calcUMF(oxideResult.oxideWeights.oxides);

    expect(umfResult.errors).toHaveLength(0);
    expect(umfResult.umf.fluxTotal).toBe(1.0);

    // Verify flux unity
    expect(verifyFluxUnity(umfResult.umf)).toBe(true);

    // Check that fluxes sum to 1.0
    const fluxSum = Object.values(umfResult.umf.fluxes)
      .reduce((sum, val) => sum + (val || 0), 0);
    expect(fluxSum).toBeCloseTo(1.0, 2);

    // Typical Leach 4321 UMF values (approximate)
    // CaO should be dominant flux (around 0.7)
    expect(umfResult.umf.fluxes.CaO).toBeGreaterThan(0.6);
    expect(umfResult.umf.fluxes.CaO).toBeLessThan(0.8);

    // Al2O3 should be around 0.3-0.4
    expect(umfResult.umf.intermediates.Al2O3).toBeGreaterThan(0.25);
    expect(umfResult.umf.intermediates.Al2O3).toBeLessThan(0.45);

    // SiO2 should be around 3.0-4.0
    expect(umfResult.umf.glassFormers.SiO2).toBeGreaterThan(2.5);
    expect(umfResult.umf.glassFormers.SiO2).toBeLessThan(4.5);
  });

  it('should calculate UMF ratios correctly', () => {
    const recipe: RecipeLine[] = [
      { materialName: 'Custer Feldspar', percentWeight: 40 },
      { materialName: 'Silica', percentWeight: 30 },
      { materialName: 'Whiting', percentWeight: 20 },
      { materialName: 'EPK Kaolin', percentWeight: 10 }
    ];

    const oxideResult = calcOxides(recipe, testMaterials);
    const umfResult = calcUMF(oxideResult.oxideWeights.oxides);
    const ratios = calcUMFRatios(umfResult.umf);

    // SiO2:Al2O3 ratio should be in reasonable range (5-12 for most glazes)
    expect(ratios.SiO2_Al2O3).toBeGreaterThan(5);
    expect(ratios.SiO2_Al2O3).toBeLessThan(12);

    // SiO2:flux ratio
    expect(ratios.SiO2_flux).toBeGreaterThan(2);
    expect(ratios.SiO2_flux).toBeLessThan(5);
  });

  it('should handle recipe with no flux oxides', () => {
    const recipe: RecipeLine[] = [
      { materialName: 'Silica', percentWeight: 50 },
      { materialName: 'EPK Kaolin', percentWeight: 50 }
    ];

    const oxideResult = calcOxides(recipe, testMaterials);
    const umfResult = calcUMF(oxideResult.oxideWeights.oxides);

    expect(umfResult.errors.length).toBeGreaterThan(0);
    expect(umfResult.errors[0]).toContain('Flux total is zero');
  });

  it('should calculate UMF for a low-fire boron glaze', () => {
    const boronMaterials: Material[] = [
      ...testMaterials,
      {
        name: 'Ferro Frit 3134',
        oxideAnalysis: {
          SiO2: 57.0,
          B2O3: 14.5,
          Al2O3: 10.5,
          CaO: 16.5,
          Na2O: 1.5
        }
      }
    ];

    const recipe: RecipeLine[] = [
      { materialName: 'Ferro Frit 3134', percentWeight: 80 },
      { materialName: 'EPK Kaolin', percentWeight: 10 },
      { materialName: 'Silica', percentWeight: 10 }
    ];

    const oxideResult = calcOxides(recipe, boronMaterials);
    const umfResult = calcUMF(oxideResult.oxideWeights.oxides);

    expect(umfResult.errors).toHaveLength(0);
    expect(verifyFluxUnity(umfResult.umf)).toBe(true);

    // Boron should be present in glass formers
    expect(umfResult.umf.glassFormers.B2O3).toBeGreaterThan(0);
  });
});
