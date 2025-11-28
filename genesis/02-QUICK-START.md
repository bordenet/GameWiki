# Genesis Quick Start Guide

**For Humans**: This is a human-readable quick start. For AI instructions, see `01-AI-INSTRUCTIONS.md`.

---

## What is Genesis?

Genesis is a **project template system** that lets you create new AI-assisted workflow applications (like the Product Requirements Assistant) in under 2 hours.

**Use Cases**:
- One-Pager document generator
- Meeting notes assistant
- Code review helper
- Design critique tool
- Any multi-phase AI workflow

---

## Quick Start (5 Minutes)

### Option 1: With AI Assistant (Recommended)

1. **Copy Genesis to new directory**:
   ```bash
   mkdir my-new-project
   cp -r genesis/* my-new-project/
   cd my-new-project
   ```

2. **Open with AI assistant** (Claude, Cursor, etc.):
   ```
   "I want to create a new project from the Genesis template system.
   Please read 01-AI-INSTRUCTIONS.md and help me set it up."
   ```

3. **Answer AI's questions** about your project

4. **Wait for AI to complete setup** (~30-60 minutes)

5. **Visit your GitHub Pages URL** to see your app!

---

### Option 2: Manual Setup

1. **Copy Genesis**:
   ```bash
   mkdir my-new-project
   cp -r genesis/* my-new-project/
   cd my-new-project
   ```

2. **Edit configuration**:
   ```bash
   # Create config file
   cp templates/config.template.json config.json
   
   # Edit config.json with your project details
   nano config.json
   ```

3. **Run generation script**:
   ```bash
   ./scripts/generate-project.sh
   ```

4. **Initialize git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from Genesis"
   ```

5. **Create GitHub repo**:
   ```bash
   gh repo create username/my-new-project --public --source=. --remote=origin
   git push -u origin main
   ```

6. **Enable GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: `main`, Folder: `/docs`
   - Save

7. **Visit your app**:
   ```
   https://username.github.io/my-new-project/
   ```

---

## What You Get

### ✅ Complete Web Application
- 100% client-side (no server needed)
- IndexedDB storage (50MB-10GB capacity)
- Dark mode support
- Responsive design
- Export/import functionality

### ✅ GitHub Pages Deployment
- Automatic deployment on push
- Custom domain support
- HTTPS enabled
- CDN-backed (fast worldwide)

### ✅ CI/CD Pipeline
- Automated testing
- Code coverage tracking
- Pre-commit hooks
- Release automation

### ✅ Professional Documentation
- README with badges
- Architecture docs
- Deployment guides
- Contributing guidelines

### ✅ Development Tools
- Setup scripts (macOS, Linux, Windows)
- Validation scripts
- Pre-commit hooks
- Common shell library

---

## Examples

### Minimal Project
See `examples/minimal/` for the simplest possible project.

**Features**:
- Single-phase workflow
- Basic web UI
- No backend
- ~50 files

**Time to deploy**: <30 minutes

---

### One-Pager Assistant
See `examples/one-pager/` for a complete example.

**Features**:
- 2-phase workflow (Draft → Review)
- Scoring system (1-10)
- Feedback generation
- Professional UI
- ~100 files

**Time to deploy**: <1 hour

---

## Customization

### Change Workflow Phases

Edit `config.json`:
```json
{
  "workflow": {
    "phases": [
      {
        "number": 1,
        "name": "Your Phase Name",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/phase1.txt"
      }
    ]
  }
}
```

### Change Deployment Target

Edit `config.json`:
```json
{
  "deployment": {
    "branch": "main",
    "folder": "docs",  // or "web"
    "auto_deploy": true
  }
}
```

### Enable Backend

Edit `config.json`:
```json
{
  "architecture": {
    "enable_backend": true
  }
}
```

Then run:
```bash
./scripts/generate-backend.sh
```

---

## Troubleshooting

### GitHub Pages shows 404
- Check Settings → Pages is enabled
- Verify source folder is correct (docs/ or web/)
- Wait 1-2 minutes for deployment

### Web app is blank
- Open browser console (F12)
- Check for JavaScript errors
- Verify all files deployed correctly

### CI pipeline fails
- Check GitHub Actions tab
- Review error logs
- Verify all secrets are set

---

## Next Steps

1. **Customize prompts**: Edit files in `prompts/`
2. **Update branding**: Edit `docs/index.html` and `docs/css/styles.css`
3. **Add features**: See `03-CUSTOMIZATION-GUIDE.md`
4. **Deploy**: Push to GitHub, enable Pages

---

## Support

- **Documentation**: See `docs/` folder
- **Examples**: See `examples/` folder
- **Issues**: Check `integration/DEVELOPMENT_PROTOCOLS.md`

---

**Ready to create your first project?** 🚀

Choose Option 1 (with AI) for the easiest experience!

