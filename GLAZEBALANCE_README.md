# GlazeBalance

🎨 Ceramic Glaze Chemistry Calculator - A local-first web application for glaze formulation and analysis.

## 🌐 Live Demo

**Try it now**: [https://ursk550.github.io/glazedatabase/](https://ursk550.github.io/glazedatabase/)

The app runs entirely in your browser and works offline after the first visit!

## Features

- **Recipe Management**: Create, edit, and save glaze recipes with material percentages
- **Chemistry Analysis**: Automatic calculation of:
  - Oxide weights and percentages
  - Molecular formulas (moles)
  - Unity Molecular Formula (UMF) with flux normalization
  - Key ratios (SiO2:Al2O3, etc.)
- **Limit Formula Checks**: Compare glazes against standard limit formulas for:
  - Low Fire (Cone 06-04)
  - Cone 6
  - Cone 10
- **Smart Suggestions**: Get heuristic adjustment suggestions for:
  - Increasing durability
  - More glossy surface
  - More matte surface
  - Reducing crazing risk
  - Increasing melt
- **Test Logs**: Record firing tests with notes and track results
- **Import/Export**: Save and share recipes and materials as JSON files
- **Offline-First**: Uses IndexedDB for local storage - works without internet

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Usage

1. **Recipe Editor**: 
   - Add materials and their percentages
   - Use the autocomplete to select from available materials
   - Click "Normalize to 100%" to adjust recipe totals
   - Select the appropriate firing range

2. **Chemistry Tab**: 
   - View oxide weights and percentages
   - See molar calculations
   - Review UMF (Unity Molecular Formula)
   - Check key ratios

3. **Limits Tab**: 
   - See how your glaze compares to standard limit formulas
   - View stability score (0-100)
   - Review warnings and suggestions

4. **Suggestions Tab**: 
   - Get adjustment recommendations
   - See before/after UMF comparisons
   - Review tradeoffs for each suggestion
   - Apply suggestions directly to your recipe

5. **Test Logs**: 
   - Record firing test results
   - Track temperature, cone, and observations

6. **Import/Export**: 
   - Save recipes as JSON files
   - Share recipes with others
   - Export your materials database

## Default Materials

The app comes with these materials pre-loaded:
- Silica
- EPK Kaolin
- Ball Clay
- Whiting
- Dolomite
- Wollastonite
- Nepheline Syenite
- Custer Feldspar
- Ferro Frit 3134
- Ferro Frit 3124
- Gerstley Borate

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Dexie** - IndexedDB wrapper for offline storage
- **Vitest** - Testing framework

## Testing

The chemistry engine is thoroughly tested with real glaze recipes:
- Leach 4321 (classic cone 6 base)
- Low-fire boron glazes
- High-fire stoneware recipes

Run tests with:
```bash
npm run test
```

## Important Notes

⚠️ **Disclaimer**: This tool provides heuristic calculations for educational purposes. Always test glazes thoroughly before production use. Glaze chemistry is complex and results may vary based on:
- Raw material variations
- Firing conditions
- Clay body composition
- Kiln atmosphere

The suggestions are based on general glaze chemistry principles and should be used as starting points for testing, not as guaranteed solutions.

## Contributing

Contributions are welcome! Please ensure tests pass before submitting PRs.

## License

MIT

## Acknowledgments

Built for potters, by potters. Based on traditional ceramic chemistry principles and modern web technologies.
