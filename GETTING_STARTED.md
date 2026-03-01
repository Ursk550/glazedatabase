# 🎯 Getting Started with GlazeBalance

Welcome! This guide will help you view and use the GlazeBalance app step by step.

## 🌐 Option 1: View the Live Deployed Version (Easiest!)

The app is **already deployed and running** on GitHub Pages. You can access it right now:

### **👉 [https://ursk550.github.io/glazedatabase/](https://ursk550.github.io/glazedatabase/)**

**That's it!** Just click the link above and you'll see the live app running in your browser.

#### What You'll See:
- The GlazeBalance app interface
- Recipe editor for creating glaze formulations
- Tabs for Chemistry, Limits, Suggestions, and Test Logs
- Sample materials already loaded (Silica, Kaolin, Feldspar, etc.)
- All features work offline after the first visit

#### How It Works:
- The app runs entirely in your browser
- All data is stored locally in IndexedDB (your browser's database)
- No server required - it's a "local-first" application
- Works offline after you visit it once

---

## 💻 Option 2: Run It Locally on Your Computer

If you want to make changes or develop the app further, you can run it on your local machine.

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Step-by-Step Instructions:

#### 1. Install Dependencies
First, open a terminal in the project directory and install the required packages:

```bash
npm install
```

This will download all necessary dependencies (~50MB). Takes about 1-2 minutes.

#### 2. Start the Development Server

```bash
npm run dev
```

You should see output like:
```
VITE v7.3.1  ready in 423 ms

➜  Local:   http://localhost:5173/glazedatabase/
➜  Network: use --host to expose
➜  press h + enter to show help
```

#### 3. Open in Your Browser

Copy the Local URL from the terminal output (usually `http://localhost:5173/glazedatabase/`) and paste it into your web browser.

**Important**: Make sure to include the `/glazedatabase/` at the end of the URL!

#### 4. The App Should Now Be Running!

You should see the GlazeBalance app with:
- Recipe editor interface
- Chemistry calculator tabs
- Sample materials pre-loaded

#### 5. Making Changes

When running locally in dev mode:
- Any changes you make to the code will automatically reload in the browser
- You can edit files in `src/` to modify the app
- Press `Ctrl+C` in the terminal to stop the dev server

---

## 🧪 Testing the App

To verify everything works correctly:

```bash
npm run test
```

This runs all 8 unit tests. You should see all tests passing ✓

---

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 📋 Quick Reference

| Action | Command |
|--------|---------|
| **View live app** | https://ursk550.github.io/glazedatabase/ |
| **Run locally** | `npm run dev` |
| **Run tests** | `npm run test` |
| **Build for production** | `npm run build` |
| **Preview build** | `npm run preview` |

---

## 🆘 Troubleshooting

### Dev Server Shows Blank Page
- Make sure you're visiting `http://localhost:5173/glazedatabase/` (with `/glazedatabase/` at the end)
- Check the browser console (F12) for errors

### Port 5173 Already in Use
- Stop any other Vite dev servers running
- Or use: `npm run dev -- --port 3000` to use a different port

### Installation Fails
- Make sure you have Node.js 18 or higher: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Live Site Shows 404
- The live site should work immediately at https://ursk550.github.io/glazedatabase/
- If it doesn't, check the Actions tab in GitHub to verify deployment succeeded

---

## 📖 Next Steps

Once you have the app running:

1. **Learn the features**: See [GLAZEBALANCE_README.md](./GLAZEBALANCE_README.md) for detailed usage guide
2. **Understand deployment**: See [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md) for deployment info
3. **Dive into development**: See [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) for architecture details

---

## 🎉 You're All Set!

You now know how to:
- ✅ Access the live deployed version
- ✅ Run the app locally for development
- ✅ Test your changes
- ✅ Build for production

Happy glazing! 🎨
