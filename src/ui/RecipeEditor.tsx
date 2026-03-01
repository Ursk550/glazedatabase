// Recipe Editor Component
import React, { useState, useEffect } from 'react';
import { RecipeLine, Material } from '../materials/materialTypes';
import { MaterialsRepo } from '../materials/materialsRepo';
import { normalizeRecipe, validateRecipe } from '../chemistry/calcRecipe';

interface RecipeEditorProps {
  recipe: RecipeLine[];
  onRecipeChange: (recipe: RecipeLine[]) => void;
  firingRange?: 'low-fire' | 'cone6' | 'cone10';
  onFiringRangeChange: (range: 'low-fire' | 'cone6' | 'cone10') => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({
  recipe,
  onRecipeChange,
  firingRange = 'cone6',
  onFiringRangeChange
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editingLines, setEditingLines] = useState<RecipeLine[]>(recipe);

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    setEditingLines(recipe);
  }, [recipe]);

  const loadMaterials = async () => {
    await MaterialsRepo.initializeDefaultMaterials();
    const allMaterials = await MaterialsRepo.getAll();
    setMaterials(allMaterials);
  };

  const handleLineChange = (index: number, field: 'materialName' | 'percentWeight', value: string | number) => {
    const newLines = [...editingLines];
    if (field === 'percentWeight') {
      newLines[index].percentWeight = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      newLines[index].materialName = value as string;
    }
    setEditingLines(newLines);
    onRecipeChange(newLines);
  };

  const handleAddLine = () => {
    const newLines = [...editingLines, { materialName: '', percentWeight: 0 }];
    setEditingLines(newLines);
    onRecipeChange(newLines);
  };

  const handleRemoveLine = (index: number) => {
    const newLines = editingLines.filter((_, i) => i !== index);
    setEditingLines(newLines);
    onRecipeChange(newLines);
  };

  const handleNormalize = () => {
    const normalized = normalizeRecipe(editingLines);
    setEditingLines(normalized.lines);
    onRecipeChange(normalized.lines);
  };

  const validation = validateRecipe(editingLines);
  const total = editingLines.reduce((sum, line) => sum + line.percentWeight, 0);

  return (
    <div className="recipe-editor">
      <div className="editor-header">
        <h2>Recipe Editor</h2>
        <div className="firing-range-selector">
          <label>
            Firing Range:
            <select 
              value={firingRange} 
              onChange={(e) => onFiringRangeChange(e.target.value as 'low-fire' | 'cone6' | 'cone10')}
            >
              <option value="low-fire">Low Fire (Cone 06-04)</option>
              <option value="cone6">Cone 6</option>
              <option value="cone10">Cone 10</option>
            </select>
          </label>
        </div>
      </div>

      <div className="recipe-lines">
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Weight %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingLines.map((line, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    list="materials-list"
                    value={line.materialName}
                    onChange={(e) => handleLineChange(index, 'materialName', e.target.value)}
                    placeholder="Select material..."
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={line.percentWeight}
                    onChange={(e) => handleLineChange(index, 'percentWeight', e.target.value)}
                    step="0.1"
                    min="0"
                  />
                </td>
                <td>
                  <button onClick={() => handleRemoveLine(index)} className="btn-remove">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total:</strong></td>
              <td>
                <strong className={Math.abs(total - 100) > 0.1 ? 'total-warning' : 'total-ok'}>
                  {total.toFixed(2)}%
                </strong>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <datalist id="materials-list">
          {materials.map((material) => (
            <option key={material.id || material.name} value={material.name} />
          ))}
        </datalist>

        <div className="editor-actions">
          <button onClick={handleAddLine} className="btn-add">
            + Add Material
          </button>
          <button 
            onClick={handleNormalize} 
            className="btn-normalize"
            disabled={total === 0}
          >
            Normalize to 100%
          </button>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div className="validation-errors">
          <h4>Errors:</h4>
          <ul>
            {validation.errors.map((error, i) => (
              <li key={i} className="error">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="validation-warnings">
          <h4>Warnings:</h4>
          <ul>
            {validation.warnings.map((warning, i) => (
              <li key={i} className="warning">{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
