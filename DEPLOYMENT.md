# Deployment Guide

## GlazeBalance Deployment to GitHub Pages

This application is automatically deployed to GitHub Pages using GitHub Actions.

### Live URL

Once deployed, the app will be available at:
**https://ursk550.github.io/glazedatabase/**

### Automatic Deployment

The app automatically deploys when:
- Code is pushed to the `main` branch
- The workflow can also be manually triggered from the Actions tab

### Deployment Process

1. **GitHub Actions Workflow**: `.github/workflows/deploy.yml`
   - Triggers on push to `main` branch
   - Runs tests to ensure quality
   - Builds the production bundle
   - Deploys to GitHub Pages

2. **Build Configuration**: `vite.config.ts`
   - Base path set to `/glazedatabase/`
   - Ensures assets load correctly on GitHub Pages

### Manual Deployment Steps

If you need to deploy manually:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run preview
   ```

3. **Deploy**:
   - The GitHub Actions workflow handles deployment automatically
   - Or use the "Actions" tab on GitHub to manually trigger deployment

### GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Source: Select "GitHub Actions"
3. The workflow will automatically deploy on the next push

### Deployment Configuration

- **Base URL**: `/glazedatabase/` (configured in `vite.config.ts`)
- **Build output**: `dist/` directory
- **Node version**: 20.x
- **Package manager**: npm

### Troubleshooting

**Build Fails**:
- Check that all tests pass: `npm run test:run`
- Verify dependencies: `npm install`
- Check build locally: `npm run build`

**Assets not loading**:
- Verify base path in `vite.config.ts` matches repository name
- Check that paths in `dist/index.html` start with `/glazedatabase/`

**Deployment doesn't trigger**:
- Ensure GitHub Actions workflow file exists: `.github/workflows/deploy.yml`
- Check GitHub Actions permissions in repository settings
- Verify GitHub Pages is set to use "GitHub Actions" as source

### Environment Variables

This app runs entirely client-side and uses IndexedDB for storage.
No backend or environment variables are required.

### Offline Functionality

The app works offline after the first visit because:
- All assets are loaded on initial visit
- Data is stored in browser IndexedDB
- No external API calls required

### Performance

- Initial load: ~330 KB (gzipped: ~103 KB)
- Subsequent loads: Cached by browser
- Offline-capable after first load

### Security

- All data stored locally in browser
- No server-side processing
- No external API calls
- HTTPS served via GitHub Pages

---

For more information about the app, see:
- [GlazeBalance README](./GLAZEBALANCE_README.md)
- [Development Notes](./DEVELOPMENT_NOTES.md)
