// Suggestions Panel Component - displays adjustment suggestions
import React, { useState } from 'react';
import { Suggestion } from '../chemistry/suggestions';
import { RecipeLine } from '../materials/materialTypes';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  onApplySuggestion: (newRecipe: RecipeLine[]) => void;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  suggestions,
  onApplySuggestion
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (suggestions.length === 0) {
    return (
      <div className="suggestions-panel">
        <h2>Adjustment Suggestions</h2>
        <p className="info-message">Enter a recipe to see adjustment suggestions</p>
      </div>
    );
  }

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleApply = (suggestion: Suggestion) => {
    if (confirm(`Apply suggestion: ${suggestion.title}?\n\nThis will modify your current recipe.`)) {
      onApplySuggestion(suggestion.newRecipe);
    }
  };

  return (
    <div className="suggestions-panel">
      <h2>Adjustment Suggestions</h2>
      <p className="suggestions-intro">
        These are heuristic suggestions based on typical glaze behavior. 
        Always test before using in production.
      </p>

      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-card">
            <div className="suggestion-header" onClick={() => toggleExpanded(index)}>
              <h3>{suggestion.title}</h3>
              <button className="expand-btn">
                {expandedIndex === index ? '▼' : '▶'}
              </button>
            </div>

            <div className="suggestion-description">
              {suggestion.description}
            </div>

            {expandedIndex === index && (
              <div className="suggestion-details">
                <div className="rationale">
                  <h4>Rationale</h4>
                  <p>{suggestion.rationale}</p>
                </div>

                <div className="adjustments">
                  <h4>Recipe Changes</h4>
                  <table className="adjustments-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Current %</th>
                        <th>New %</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestion.adjustments.map((adj, i) => (
                        <tr key={i}>
                          <td>{adj.materialName}</td>
                          <td>{adj.originalPercent.toFixed(1)}%</td>
                          <td>{adj.newPercent.toFixed(1)}%</td>
                          <td className={adj.change > 0 ? 'change-positive' : 'change-negative'}>
                            {adj.change > 0 ? '+' : ''}{adj.change.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {suggestion.newUMF && (
                  <div className="umf-comparison">
                    <h4>UMF Comparison</h4>
                    <div className="umf-groups">
                      <div className="umf-group">
                        <h5>Fluxes</h5>
                        {Object.entries(suggestion.newUMF.fluxes).map(([oxide, value]) => (
                          <div key={oxide} className="umf-value">
                            {oxide}: {value.toFixed(3)}
                          </div>
                        ))}
                      </div>
                      <div className="umf-group">
                        <h5>Intermediates</h5>
                        {Object.entries(suggestion.newUMF.intermediates).map(([oxide, value]) => (
                          <div key={oxide} className="umf-value">
                            {oxide}: {value.toFixed(3)}
                          </div>
                        ))}
                      </div>
                      <div className="umf-group">
                        <h5>Glass Formers</h5>
                        {Object.entries(suggestion.newUMF.glassFormers).map(([oxide, value]) => (
                          <div key={oxide} className="umf-value">
                            {oxide}: {value.toFixed(3)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="tradeoffs">
                  <h4>⚠ Tradeoffs</h4>
                  <ul>
                    {suggestion.tradeoffs.map((tradeoff, i) => (
                      <li key={i}>{tradeoff}</li>
                    ))}
                  </ul>
                </div>

                <div className="suggestion-actions">
                  <button 
                    onClick={() => handleApply(suggestion)}
                    className="btn-apply"
                  >
                    Apply This Suggestion
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
