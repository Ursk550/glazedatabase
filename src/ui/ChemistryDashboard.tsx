// Chemistry Dashboard Component - displays oxide analysis, UMF, and ratios
import React from 'react';
import { OxideWeights } from '../chemistry/calcOxides';
import { UMF, UMFRatios } from '../chemistry/calcUMF';
import { ALL_OXIDES, OXIDE_NAMES } from '../chemistry/oxideDefinitions';

interface ChemistryDashboardProps {
  oxideWeights?: OxideWeights;
  moles?: Record<string, number>;
  umf?: UMF;
  ratios?: UMFRatios;
}

export const ChemistryDashboard: React.FC<ChemistryDashboardProps> = ({
  oxideWeights,
  moles,
  umf,
  ratios
}) => {
  if (!oxideWeights || !umf || !ratios) {
    return (
      <div className="chemistry-dashboard">
        <p className="info-message">Enter a recipe to see chemistry calculations</p>
      </div>
    );
  }

  const formatNumber = (value: number | undefined, decimals: number = 3): string => {
    if (value === undefined || value === 0) return '-';
    return value.toFixed(decimals);
  };

  const getOxidePercent = (oxide: string): number => {
    const weight = oxideWeights.oxides[oxide as keyof typeof oxideWeights.oxides] || 0;
    return oxideWeights.total > 0 ? (weight / oxideWeights.total) * 100 : 0;
  };

  return (
    <div className="chemistry-dashboard">
      <h2>Chemistry Analysis</h2>

      <div className="dashboard-grid">
        {/* Oxide Weights */}
        <div className="dashboard-section">
          <h3>Oxide Weights</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Oxide</th>
                <th>Weight (g)</th>
                <th>Weight %</th>
              </tr>
            </thead>
            <tbody>
              {ALL_OXIDES.map(oxide => {
                const weight = oxideWeights.oxides[oxide] || 0;
                const percent = getOxidePercent(oxide);
                if (weight === 0) return null;
                return (
                  <tr key={oxide}>
                    <td>{oxide}</td>
                    <td>{formatNumber(weight, 2)}</td>
                    <td>{formatNumber(percent, 2)}%</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td><strong>Total</strong></td>
                <td><strong>{formatNumber(oxideWeights.total, 2)}</strong></td>
                <td><strong>100.00%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Moles */}
        {moles && (
          <div className="dashboard-section">
            <h3>Moles</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Oxide</th>
                  <th>Moles</th>
                </tr>
              </thead>
              <tbody>
                {ALL_OXIDES.map(oxide => {
                  const moleValue = moles[oxide] || 0;
                  if (moleValue === 0) return null;
                  return (
                    <tr key={oxide}>
                      <td>{oxide}</td>
                      <td>{formatNumber(moleValue, 4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* UMF */}
        <div className="dashboard-section umf-section">
          <h3>Unity Molecular Formula (UMF)</h3>
          
          <div className="umf-group">
            <h4>Fluxes (RO + R₂O) = 1.0</h4>
            <table className="data-table">
              <tbody>
                {Object.entries(umf.fluxes).map(([oxide, value]) => (
                  <tr key={oxide}>
                    <td>{oxide}</td>
                    <td>{formatNumber(value, 3)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{formatNumber(umf.fluxTotal, 3)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="umf-group">
            <h4>Intermediates (R₂O₃)</h4>
            <table className="data-table">
              <tbody>
                {Object.entries(umf.intermediates).map(([oxide, value]) => (
                  <tr key={oxide}>
                    <td>{oxide}</td>
                    <td>{formatNumber(value, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="umf-group">
            <h4>Glass Formers (RO₂)</h4>
            <table className="data-table">
              <tbody>
                {Object.entries(umf.glassFormers).map(([oxide, value]) => (
                  <tr key={oxide}>
                    <td>{oxide}</td>
                    <td>{formatNumber(value, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Ratios */}
        <div className="dashboard-section">
          <h3>Key Ratios</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <td>SiO₂ : Al₂O₃</td>
                <td className="ratio-value">
                  {formatNumber(ratios.SiO2_Al2O3, 2)} : 1
                </td>
              </tr>
              <tr>
                <td>SiO₂ : Flux</td>
                <td className="ratio-value">
                  {formatNumber(ratios.SiO2_flux, 2)} : 1
                </td>
              </tr>
              <tr>
                <td>Al₂O₃ : Flux</td>
                <td className="ratio-value">
                  {formatNumber(ratios.Al2O3_flux, 2)} : 1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
