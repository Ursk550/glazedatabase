# 🎨 GlazeBalance - Ceramic Glaze Chemistry Calculator

A local-first web application for ceramic glaze formulation and analysis. Calculate oxide totals, Unity Molecular Formula (UMF), evaluate against limit formulas, and get smart adjustment suggestions.

## 🌐 Live Demo

**Try it now**: [https://ursk550.github.io/glazedatabase/](https://ursk550.github.io/glazedatabase/)

The app runs entirely in your browser and works offline after the first visit!

## 🎯 New Here? Start Here!

**[👉 Getting Started Guide](./GETTING_STARTED.md)** - Step-by-step instructions to view the app (live or locally)

## 📚 Documentation

- **[Getting Started](./GETTING_STARTED.md)** - ⭐ **Start here!** View the app step-by-step
- **[GlazeBalance User Guide](./GLAZEBALANCE_README.md)** - Features and usage
- **[Deployment Quick Start](./DEPLOYMENT_QUICKSTART.md)** - Deploy in 5 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment documentation
- **[Development Notes](./DEVELOPMENT_NOTES.md)** - Developer guide

## 🚀 Quick Start

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

## ✨ Key Features

- 🧪 **Chemistry Calculations** - Oxide weights, moles, UMF with flux normalization
- 📊 **Limit Formulas** - Compare against Low Fire, Cone 6, Cone 10 standards
- 💡 **Smart Suggestions** - Heuristic adjustments with before/after comparison
- 💾 **Offline-First** - Uses IndexedDB, works without internet
- 📤 **Import/Export** - Save and share recipes as JSON
- 🔬 **Test Logs** - Track firing results

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Dexie.js (IndexedDB wrapper)
- Vitest (testing)

## 📦 Deployment

This app is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Deploy**:
   - Push to `main` branch
   - GitHub Actions automatically builds and deploys

See [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) for detailed instructions.

## 🧪 Testing

```bash
npm run test        # Watch mode
npm run test:run    # Run once
```

8 unit tests covering oxide and UMF calculations with real glaze recipes.

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure tests pass before submitting PRs.

---

Built for potters, by developers who care about ceramic arts 🎨

