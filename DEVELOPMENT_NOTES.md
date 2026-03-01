# GlazeBalance Development Notes

## Project Structure

```
glazedatabase/
├── src/
│   ├── materials/           # Data models and persistence
│   │   ├── materialTypes.ts      # TypeScript types/interfaces
│   │   ├── defaultMaterials.json # 11 pre-loaded materials
│   │   ├── db.ts                 # Dexie database setup
│   │   ├── materialsRepo.ts      # Materials CRUD operations
│   │   └── recipesRepo.ts        # Recipes CRUD operations
│   │
│   ├── chemistry/           # Pure calculation functions
│   │   ├── oxideDefinitions.ts   # Oxide data and constants
│   │   ├── calcRecipe.ts         # Recipe normalization/validation
│   │   ├── calcOxides.ts         # Oxide weight calculations
│   │   ├── calcUMF.ts            # UMF calculations
│   │   ├── limits.ts             # Limit formula definitions
│   │   ├── evaluate.ts           # UMF evaluation against limits
│   │   ├── suggestions.ts        # Adjustment suggestions engine
│   │   ├── calcOxides.test.ts    # Unit tests
│   │   └── calcUMF.test.ts       # Unit tests
│   │
│   ├── ui/                  # React components
│   │   ├── RecipeEditor.tsx      # Recipe input interface
│   │   ├── ChemistryDashboard.tsx# Chemistry display
│   │   ├── LimitsPanel.tsx       # Limits checking display
│   │   ├── SuggestionsPanel.tsx  # Adjustment suggestions
│   │   └── TestLog.tsx           # Firing test logging
│   │
│   ├── App.tsx              # Main application
│   ├── App.css              # Application styles
│   └── main.tsx             # React entry point
│
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── GLAZEBALANCE_README.md   # User documentation
```

## Key Technical Details

### TypeScript Configuration
- Uses `verbatimModuleSyntax: true`
- Requires `import type` for type-only imports
- Strict type checking enabled

### Chemistry Calculations
All chemistry functions are **pure** and **deterministic**:
- `calcOxides()`: Materials + percentages → oxide weights
- `calcMoles()`: Oxide weights → moles
- `calcUMF()`: Moles → Unity Molecular Formula (fluxes = 1.0)
- `evaluateUMF()`: UMF + limits → evaluation with score
- `generateSuggestions()`: Current UMF → 3 adjustment suggestions

### Database Schema (Dexie/IndexedDB)
- `materials`: ++id, name (pre-loaded with 11 default materials)
- `recipes`: ++id, name, firingRange, createdAt
- `testLogs`: ++id, recipeId, testDate

### Testing
- Framework: Vitest
- Test files: `*.test.ts` in chemistry/
- Run: `npm run test`
- 8 tests covering oxide and UMF calculations

## Development Workflow

1. **Start dev server**: `npm run dev`
   - Runs on http://localhost:5173
   - Hot module replacement enabled

2. **Run tests**: `npm run test` or `npm run test:run`
   - Runs unit tests with Vitest
   - Uses happy-dom for DOM simulation

3. **Build for production**: `npm run build`
   - TypeScript compilation + Vite build
   - Output to `dist/`

4. **Lint**: `npm run lint`
   - ESLint with TypeScript support

## Known Patterns

### Material Loading
Materials must be initialized before calculations:
```typescript
await MaterialsRepo.initializeDefaultMaterials();
const materials = await MaterialsRepo.getAll();
```

### Recipe Calculations
Always check if materials are loaded:
```typescript
const oxideResult = materials.length > 0 
  ? calcOxides(recipe, materials)
  : { oxideWeights: { oxides: {}, total: 0 }, errors: ['Loading...'] };
```

### Error Handling
Chemistry functions return errors array:
```typescript
const result = calcOxides(recipe, materials);
if (result.errors.length > 0) {
  // Handle errors
}
```

## Future Enhancement Ideas

1. **Materials Database**
   - Add more materials
   - Material substitution suggestions
   - Custom material creation UI

2. **Chemistry**
   - Expansion coefficient calculations
   - Color prediction (basic)
   - Cost calculations

3. **UI**
   - Batch scaling calculator
   - Print-friendly recipe cards
   - Chart visualizations

4. **Collaboration**
   - Export to common formats (Insight, HyperGlaze)
   - QR code sharing
   - Cloud sync (optional)

## Troubleshooting

### TypeScript Errors
- Ensure type-only imports use `import type`
- Check that all interfaces are properly exported

### Database Not Loading
- Check browser console for IndexedDB errors
- Clear browser storage if corrupted
- Verify MaterialsRepo.initializeDefaultMaterials() is called

### Build Failures
- Run `npm install` to ensure dependencies
- Check TypeScript version compatibility
- Verify all imports are correct

## Resources

- Ceramic glaze chemistry: "The Potter's Dictionary" by Frank and Janet Hamer
- UMF calculations: Digital Fire (digitalfire.com)
- Material data: Glazy.org
