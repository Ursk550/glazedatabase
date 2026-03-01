// Limits Panel Component - displays limit checks and evaluation
import React from 'react';
import type { EvaluationResult } from '../chemistry/evaluate';

interface LimitsPanelProps {
  evaluation?: EvaluationResult;
}

export const LimitsPanel: React.FC<LimitsPanelProps> = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div className="limits-panel">
        <h2>Limit Formula Check</h2>
        <p className="info-message">Enter a recipe and select firing range to see limit checks</p>
      </div>
    );
  }

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'ok': return '✓';
      case 'low': return '↓';
      case 'high': return '↑';
      default: return '-';
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'ok': return 'status-ok';
      case 'low': return 'status-low';
      case 'high': return 'status-high';
      default: return 'status-none';
    }
  };

  const getScoreClass = (score: number): string => {
    if (score >= 90) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-fair';
    return 'score-poor';
  };

  return (
    <div className="limits-panel">
      <h2>Limit Formula Check</h2>

      {/* Stability Score */}
      <div className={`stability-score ${getScoreClass(evaluation.stabilityScore)}`}>
        <div className="score-value">{evaluation.stabilityScore}</div>
        <div className="score-label">Stability Score</div>
        <div className="score-message">{evaluation.overallMessage}</div>
      </div>

      {/* Warnings */}
      {evaluation.warnings.length > 0 && (
        <div className="warnings-section">
          <h3>⚠ Warnings</h3>
          <ul>
            {evaluation.warnings.map((warning, i) => (
              <li key={i} className="warning">{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Oxide Evaluations */}
      <div className="evaluations-section">
        <h3>Oxide Checks</h3>
        <table className="evaluation-table">
          <thead>
            <tr>
              <th>Oxide</th>
              <th>Value</th>
              <th>Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.oxideEvaluations
              .filter(e => e.value > 0 || e.status === 'low')
              .map((oxideEval, i) => (
                <tr key={i} className={getStatusClass(oxideEval.status)}>
                  <td>{oxideEval.oxide}</td>
                  <td>{oxideEval.value.toFixed(3)}</td>
                  <td>
                    {oxideEval.limit ? 
                      `${oxideEval.limit.min.toFixed(2)} - ${oxideEval.limit.max.toFixed(2)}` : 
                      '-'
                    }
                  </td>
                  <td className="status-cell">
                    <span className="status-icon">{getStatusIcon(oxideEval.status)}</span>
                    {oxideEval.status !== 'ok' && oxideEval.status !== 'not-present' && (
                      <span className="status-text">{oxideEval.status}</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Ratio Evaluations */}
      {evaluation.ratioEvaluations.length > 0 && (
        <div className="evaluations-section">
          <h3>Ratio Checks</h3>
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Ratio</th>
                <th>Value</th>
                <th>Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.ratioEvaluations.map((ratioEval, i) => (
                <tr key={i} className={getStatusClass(ratioEval.status)}>
                  <td>{ratioEval.name}</td>
                  <td>{ratioEval.value.toFixed(2)} : 1</td>
                  <td>
                    {ratioEval.min && ratioEval.max ? 
                      `${ratioEval.min.toFixed(0)} - ${ratioEval.max.toFixed(0)}` : 
                      '-'
                    }
                  </td>
                  <td className="status-cell">
                    <span className="status-icon">{getStatusIcon(ratioEval.status)}</span>
                    {ratioEval.status !== 'ok' && (
                      <span className="status-text">{ratioEval.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Suggestions from evaluation */}
      {evaluation.suggestions.length > 0 && (
        <div className="quick-suggestions">
          <h3>Quick Tips</h3>
          <ul>
            {evaluation.suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
