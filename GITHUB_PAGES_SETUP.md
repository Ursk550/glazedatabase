# 🌐 GitHub Pages Setup Guide

This guide will help you fix the 404 error and get your GlazeBalance app deployed to GitHub Pages.

## 🔴 Current Issue

If you're seeing this error when visiting https://ursk550.github.io/glazedatabase/:

```
404 - There isn't a GitHub Pages site here.
```

This means **GitHub Pages is not enabled yet** in your repository settings.

## ✅ How to Fix It

Follow these steps to enable GitHub Pages and deploy your app:

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: **https://github.com/Ursk550/glazedatabase**

2. Click on **⚙️ Settings** at the top of the page

3. In the left sidebar, scroll down and click on **📄 Pages**

4. Under "**Build and deployment**" section:
   - **Source**: Select **"GitHub Actions"** from the dropdown
   - (Do NOT select "Deploy from a branch" - we're using GitHub Actions instead)

5. Click **Save** (if a save button appears)

### Step 2: Verify Pages is Enabled

You should now see a message like:
```
Your site is ready to be published at https://ursk550.github.io/glazedatabase/
```

### Step 3: Trigger a Deployment

Since the deployment workflow already ran once (and failed because Pages wasn't enabled), you need to trigger it again:

**Option A: Push to Main Branch** (Easiest)
- Merge your current PR to the `main` branch
- The workflow will automatically run and deploy

**Option B: Manual Trigger**
1. Go to the **Actions** tab in your repository
2. Click on "Deploy GlazeBalance to GitHub Pages" workflow
3. Click the **Run workflow** button (top right)
4. Select **main** branch
5. Click **Run workflow**

### Step 4: Wait for Deployment

1. Go to the **Actions** tab to monitor progress
2. Wait for the workflow to complete (usually 2-3 minutes)
3. Look for a green ✅ checkmark

### Step 5: Access Your App!

Once deployment succeeds, visit:
### 🌐 **https://ursk550.github.io/glazedatabase/**

The app should now be live! 🎉

---

## 🔧 Troubleshooting

### ❌ "Not Found" Error When Enabling Pages
- Make sure you have admin access to the repository
- Check that the repository is public (Pages doesn't work on private repos without GitHub Pro)

### ❌ Workflow Still Fails After Enabling Pages
1. Check the Actions tab for error details
2. Make sure the workflow is using the `main` branch
3. Wait a few minutes after enabling Pages, then try again

### ❌ Site Shows 404 After Successful Deployment
1. Wait 5-10 minutes (first deployment can be slow)
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Try visiting in an incognito/private window
4. Check that the base path in `vite.config.ts` is `/glazedatabase/`

### ❌ Assets Not Loading (Blank Page)
1. Open browser console (F12) to check for errors
2. Verify paths in the deployed HTML start with `/glazedatabase/`
3. Clear cache and try again

---

## 📊 How to Check Deployment Status

### Check Workflow Status
1. Go to **Actions** tab
2. Look for "Deploy GlazeBalance to GitHub Pages" runs
3. Click on a run to see details
4. ✅ Green = Success, ❌ Red = Failed

### Check What's Deployed
1. Go to **Settings** → **Pages**
2. You'll see "Your site is live at https://ursk550.github.io/glazedatabase/"
3. Click the URL to visit the site

---

## 🎯 Summary

To deploy your app:

1. ✅ **Enable GitHub Pages** in Settings → Pages → Source: "GitHub Actions"
2. ✅ **Trigger deployment** by pushing to main or running workflow manually
3. ✅ **Wait** for Actions workflow to complete
4. ✅ **Visit** https://ursk550.github.io/glazedatabase/

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) - Deployment overview
- [GETTING_STARTED.md](./GETTING_STARTED.md) - How to run the app locally

---

**Need More Help?**

If you're still having issues after following this guide:
1. Check the Actions tab for specific error messages
2. Review the [Troubleshooting](#-troubleshooting) section above
3. Open an issue in the repository with the error details
