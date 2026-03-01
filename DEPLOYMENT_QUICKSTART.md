# 🚀 Quick Start: Deploy GlazeBalance to GitHub Pages

This guide will help you deploy the GlazeBalance app to GitHub Pages in just a few minutes.

## Prerequisites

✅ You have this repository on GitHub  
✅ You have push access to the repository  
✅ You have merged the deployment configuration to the `main` branch

## Step 1: Enable GitHub Pages (One-Time Setup)

1. Go to your repository on GitHub: https://github.com/Ursk550/glazedatabase

2. Click on **Settings** (top menu)

3. Scroll down and click on **Pages** (left sidebar)

4. Under "Build and deployment":
   - **Source**: Select **"GitHub Actions"**
   - (No need to select a branch - the workflow handles it)

5. Click **Save** (if needed)

## Step 2: Trigger Deployment

### Option A: Automatic (Recommended)
- Simply push to the `main` branch
- The GitHub Actions workflow will automatically:
  - Run tests
  - Build the app
  - Deploy to GitHub Pages

### Option B: Manual Trigger
1. Go to the **Actions** tab in your repository
2. Click on "Deploy GlazeBalance to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

## Step 3: Verify Deployment

1. Go to the **Actions** tab
2. You should see a workflow run in progress
3. Wait for it to complete (usually 2-3 minutes)
4. Green checkmark = successful deployment ✅

## Step 4: Access Your App

Your app is now live at:
### 🌐 https://ursk550.github.io/glazedatabase/

- First visit downloads all assets (~330 KB)
- Works offline after first visit
- All data stored locally in browser

## Troubleshooting

### ❌ Workflow Fails
**Check the Actions tab for error details**

Common issues:
- Tests failing → Fix tests and push again
- Build errors → Check build locally with `npm run build`
- Permission issues → Check repository settings

### ❌ Page shows 404
**Wait a few minutes after first deployment**

If still 404:
1. Check GitHub Pages settings (should be "GitHub Actions")
2. Verify workflow completed successfully
3. Check that base path in `vite.config.ts` is `/glazedatabase/`

### ❌ Assets not loading
**Clear browser cache and try again**

Check:
- Base URL in `vite.config.ts` matches repository name
- Paths in `dist/index.html` start with `/glazedatabase/`

## Testing Locally

Before deployment, test locally:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Visit the local URL shown (usually http://localhost:4173/glazedatabase/)

## Updating the Deployed App

Every time you push to `main` branch:
1. Tests run automatically
2. If tests pass, build runs
3. New version deploys to GitHub Pages
4. Live site updates automatically

## Advanced: Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS settings at your domain provider:
   ```
   Type: CNAME
   Name: www (or @)
   Value: ursk550.github.io
   ```

3. In GitHub Pages settings, enter your custom domain

## Features

✅ Automatic deployment on push to main  
✅ Tests run before deployment  
✅ Zero-downtime deployments  
✅ HTTPS enabled by default  
✅ Works offline after first visit  
✅ CDN-backed (fast worldwide)  

## Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed information
- See [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) for development info
- Review GitHub Actions logs for deployment issues

---

**That's it!** Your app is now deployed and accessible worldwide 🎉
