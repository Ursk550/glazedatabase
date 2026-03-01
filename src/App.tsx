import { useState, useEffect } from 'react';
import './App.css';
import { RecipeEditor } from './ui/RecipeEditor';
import { ChemistryDashboard } from './ui/ChemistryDashboard';
import { LimitsPanel } from './ui/LimitsPanel';
import { SuggestionsPanel } from './ui/SuggestionsPanel';
import { TestLogComponent } from './ui/TestLog';
import { RecipeLine, Material, Recipe } from './materials/materialTypes';
import { MaterialsRepo } from './materials/materialsRepo';
import { RecipesRepo } from './materials/recipesRepo';
import { calcOxides } from './chemistry/calcOxides';
import { calcUMF, calcUMFRatios } from './chemistry/calcUMF';
import { getLimitSet } from './chemistry/limits';
import { evaluateUMF } from './chemistry/evaluate';
import { generateSuggestions } from './chemistry/suggestions';

function App() {
  const [recipe, setRecipe] = useState<RecipeLine[]>([
    { materialName: 'Custer Feldspar', percentWeight: 40 },
    { materialName: 'Silica', percentWeight: 30 },
    { materialName: 'Whiting', percentWeight: 20 },
    { materialName: 'EPK Kaolin', percentWeight: 10 }
  ]);
  const [firingRange, setFiringRange] = useState<'low-fire' | 'cone6' | 'cone10'>('cone6');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipeName, setRecipeName] = useState('Leach 4321 Base');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'chemistry' | 'limits' | 'suggestions' | 'tests'>('editor');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await MaterialsRepo.initializeDefaultMaterials();
    const allMaterials = await MaterialsRepo.getAll();
    setMaterials(allMaterials);
    const recipes = await RecipesRepo.getAll();
    setSavedRecipes(recipes);
  };

  // Calculate chemistry
  const oxideResult = calcOxides(recipe, materials);
  const umfResult = calcUMF(oxideResult.oxideWeights.oxides);
  const ratios = calcUMFRatios(umfResult.umf);
  const limitSet = getLimitSet(firingRange);
  const evaluation = oxideResult.errors.length === 0 && umfResult.errors.length === 0
    ? evaluateUMF(umfResult.umf, ratios, limitSet)
    : undefined;
  const suggestions = oxideResult.errors.length === 0 && umfResult.errors.length === 0
    ? generateSuggestions(recipe, materials, umfResult.umf)
    : [];

  const handleSaveRecipe = async () => {
    const name = prompt('Recipe name:', recipeName);
    if (name) {
      const recipeToSave: Recipe = {
        name,
        lines: recipe,
        firingRange
      };
      await RecipesRepo.create(recipeToSave);
      setRecipeName(name);
      const recipes = await RecipesRepo.getAll();
      setSavedRecipes(recipes);
      alert('Recipe saved!');
    }
  };

  const handleLoadRecipe = async () => {
    const recipes = await RecipesRepo.getAll();
    if (recipes.length === 0) {
      alert('No saved recipes');
      return;
    }
    const recipeList = recipes.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
    const choice = prompt(`Select recipe:\n${recipeList}\n\nEnter number:`);
    if (choice) {
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < recipes.length) {
        const selected = recipes[index];
        setRecipe(selected.lines);
        setRecipeName(selected.name);
        if (selected.firingRange) {
          setFiringRange(selected.firingRange);
        }
      }
    }
  };

  const handleExportRecipe = () => {
    const recipeData = {
      name: recipeName,
      lines: recipe,
      firingRange,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(recipeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipeName.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const handleImportRecipe = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const data = JSON.parse(text);
          setRecipe(data.lines);
          setRecipeName(data.name || 'Imported Recipe');
          if (data.firingRange) {
            setFiringRange(data.firingRange);
          }
        } catch (err) {
          alert('Error importing recipe: ' + err);
        }
      }
    };
    input.click();
  };

  const handleExportMaterials = async () => {
    const materials = await MaterialsRepo.exportMaterials();
    const dataStr = JSON.stringify(materials, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'materials_export.json';
    link.click();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 GlazeBalance</h1>
        <p className="subtitle">Ceramic Glaze Chemistry Calculator</p>
        <div className="recipe-name-display">
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="recipe-name-input"
            placeholder="Recipe name..."
          />
        </div>
      </header>

      <nav className="main-nav">
        <button 
          className={activeTab === 'editor' ? 'active' : ''}
          onClick={() => setActiveTab('editor')}
        >
          Recipe
        </button>
        <button 
          className={activeTab === 'chemistry' ? 'active' : ''}
          onClick={() => setActiveTab('chemistry')}
        >
          Chemistry
        </button>
        <button 
          className={activeTab === 'limits' ? 'active' : ''}
          onClick={() => setActiveTab('limits')}
        >
          Limits
        </button>
        <button 
          className={activeTab === 'suggestions' ? 'active' : ''}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
        <button 
          className={activeTab === 'tests' ? 'active' : ''}
          onClick={() => setActiveTab('tests')}
        >
          Test Logs
        </button>
      </nav>

      <div className="toolbar">
        <button onClick={handleSaveRecipe} className="btn-toolbar">💾 Save</button>
        <button onClick={handleLoadRecipe} className="btn-toolbar">📂 Load</button>
        <button onClick={handleExportRecipe} className="btn-toolbar">📤 Export Recipe</button>
        <button onClick={handleImportRecipe} className="btn-toolbar">📥 Import Recipe</button>
        <button onClick={handleExportMaterials} className="btn-toolbar">📦 Export Materials</button>
      </div>

      <main className="app-main">
        {activeTab === 'editor' && (
          <RecipeEditor
            recipe={recipe}
            onRecipeChange={setRecipe}
            firingRange={firingRange}
            onFiringRangeChange={setFiringRange}
          />
        )}

        {activeTab === 'chemistry' && (
          <ChemistryDashboard
            oxideWeights={oxideResult.oxideWeights}
            moles={umfResult.moles}
            umf={umfResult.umf}
            ratios={ratios}
          />
        )}

        {activeTab === 'limits' && (
          <LimitsPanel evaluation={evaluation} />
        )}

        {activeTab === 'suggestions' && (
          <SuggestionsPanel
            suggestions={suggestions}
            onApplySuggestion={setRecipe}
          />
        )}

        {activeTab === 'tests' && (
          <TestLogComponent recipeName={recipeName} />
        )}

        {(oxideResult.errors.length > 0 || umfResult.errors.length > 0) && (
          <div className="calculation-errors">
            <h3>⚠ Calculation Errors</h3>
            {oxideResult.errors.map((err, i) => (
              <div key={i} className="error">{err}</div>
            ))}
            {umfResult.errors.map((err, i) => (
              <div key={i} className="error">{err}</div>
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          <strong>Disclaimer:</strong> This tool provides heuristic calculations for educational purposes. 
          Always test glazes thoroughly before production use. Glaze chemistry is complex and results may vary.
        </p>
      </footer>
    </div>
  );
}

export default App;
