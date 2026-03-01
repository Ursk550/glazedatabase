// Test Log Component - for recording firing tests
import React, { useState, useEffect } from 'react';
import type { TestLog } from '../materials/materialTypes';
import { db } from '../materials/db';

interface TestLogProps {
  recipeId?: number;
  recipeName: string;
}

export const TestLogComponent: React.FC<TestLogProps> = ({ recipeId, recipeName }) => {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLog, setNewLog] = useState<Partial<TestLog>>({
    recipeName,
    testDate: new Date(),
    firingTemp: 2232,
    cone: '6',
    notes: ''
  });

  useEffect(() => {
    loadLogs();
  }, [recipeId]);

  const loadLogs = async () => {
    if (recipeId) {
      const allLogs = await db.testLogs.where('recipeId').equals(recipeId).toArray();
      setLogs(allLogs);
    } else {
      const allLogs = await db.testLogs.toArray();
      setLogs(allLogs.filter(log => log.recipeName === recipeName));
    }
  };

  const handleAddLog = async () => {
    if (!newLog.notes || newLog.notes.trim() === '') {
      alert('Please enter notes for this test');
      return;
    }

    const logToSave: TestLog = {
      recipeId,
      recipeName,
      testDate: newLog.testDate || new Date(),
      firingTemp: newLog.firingTemp || 0,
      cone: newLog.cone || '',
      notes: newLog.notes,
      imageRefs: []
    };

    await db.testLogs.add(logToSave);
    await loadLogs();
    setIsAdding(false);
    setNewLog({
      recipeName,
      testDate: new Date(),
      firingTemp: 2232,
      cone: '6',
      notes: ''
    });
  };

  const handleDeleteLog = async (id: number) => {
    if (confirm('Delete this test log?')) {
      await db.testLogs.delete(id);
      await loadLogs();
    }
  };

  return (
    <div className="test-log">
      <h2>Firing Test Logs</h2>

      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="btn-add">
          + Add Test Log
        </button>
      )}

      {isAdding && (
        <div className="log-form">
          <h3>New Test Log</h3>
          <div className="form-group">
            <label>Recipe Name:</label>
            <input type="text" value={recipeName} disabled />
          </div>
          <div className="form-group">
            <label>Test Date:</label>
            <input
              type="date"
              value={newLog.testDate?.toISOString().split('T')[0]}
              onChange={(e) => setNewLog({ ...newLog, testDate: new Date(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Firing Temperature (°F):</label>
            <input
              type="number"
              value={newLog.firingTemp}
              onChange={(e) => setNewLog({ ...newLog, firingTemp: parseInt(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Cone:</label>
            <input
              type="text"
              value={newLog.cone}
              onChange={(e) => setNewLog({ ...newLog, cone: e.target.value })}
              placeholder="e.g., 6, 10, 04"
            />
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <textarea
              value={newLog.notes}
              onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
              placeholder="Describe the results: color, surface, fit, etc."
              rows={5}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddLog} className="btn-save">
              Save Log
            </button>
            <button onClick={() => setIsAdding(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="logs-list">
          <h3>Previous Tests</h3>
          {logs.map((log) => (
            <div key={log.id} className="log-card">
              <div className="log-header">
                <div className="log-date">
                  {log.testDate.toLocaleDateString()}
                </div>
                <button 
                  onClick={() => log.id && handleDeleteLog(log.id)}
                  className="btn-delete-small"
                >
                  ✕
                </button>
              </div>
              <div className="log-details">
                <div className="log-detail">
                  <strong>Temperature:</strong> {log.firingTemp}°F
                </div>
                <div className="log-detail">
                  <strong>Cone:</strong> {log.cone}
                </div>
              </div>
              <div className="log-notes">
                {log.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {logs.length === 0 && !isAdding && (
        <p className="info-message">No test logs yet. Add one to track firing results!</p>
      )}
    </div>
  );
};
