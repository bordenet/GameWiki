# Minimal Project Example

This is the **simplest possible project** you can create with Genesis.

---

## What You Get

- Single-phase workflow
- Basic web UI
- IndexedDB storage
- GitHub Pages deployment
- ~50 files total

**Time to deploy**: <30 minutes

---

## Configuration

```json
{
  "project": {
    "name": "my-minimal-app",
    "title": "My Minimal App",
    "description": "A minimal AI-assisted workflow application",
    "version": "0.1.0"
  },
  "github": {
    "user": "your-username",
    "repo": "my-minimal-app"
  },
  "workflow": {
    "type": "single-phase",
    "phases": [
      {
        "number": 1,
        "name": "Generate",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/generate.txt"
      }
    ]
  },
  "architecture": {
    "enable_backend": false,
    "enable_desktop_clients": false,
    "enable_codecov": false,
    "enable_pre_commit_hooks": false,
    "storage_type": "indexeddb"
  },
  "deployment": {
    "folder": "docs",
    "auto_deploy": true
  }
}
```

---

## Features

✅ Create new projects  
✅ Single AI workflow phase  
✅ Export to Markdown  
✅ Dark mode  
✅ Responsive design  

❌ No backend  
❌ No desktop clients  
❌ No code coverage  
❌ No pre-commit hooks  
❌ No multi-phase workflow  

---

## Quick Start

```bash
# Copy Genesis
mkdir my-minimal-app
cp -r genesis/* my-minimal-app/
cd my-minimal-app

# Tell AI to use minimal config
# "Please create a minimal project using examples/minimal/README.md as reference"

# Wait for AI to complete setup

# Visit your app
open https://your-username.github.io/my-minimal-app/
```

---

## File Structure

```
my-minimal-app/
├── docs/
│   ├── index.html
│   ├── js/
│   │   ├── app.js
│   │   ├── storage.js
│   │   └── ui.js
│   └── css/
│       └── styles.css
├── prompts/
│   └── generate.txt
├── .github/workflows/
│   └── deploy-web.yml
├── README.md
├── LICENSE
└── .gitignore
```

**Total**: ~15 files

---

## Customization

### Change AI Model

Edit `prompts/generate.txt` to target different AI model.

### Add More Phases

Edit config.json:
```json
{
  "workflow": {
    "type": "multi-phase",
    "phases": [
      { "number": 1, "name": "Draft", ... },
      { "number": 2, "name": "Review", ... }
    ]
  }
}
```

### Enable Features

Edit config.json:
```json
{
  "architecture": {
    "enable_codecov": true,
    "enable_pre_commit_hooks": true
  }
}
```

---

## Next Steps

Once you have the minimal app working:

1. **Add features**: Enable backend, codecov, etc.
2. **Customize UI**: Edit CSS and HTML
3. **Add phases**: Convert to multi-phase workflow
4. **Add prompts**: Create more sophisticated prompts

See `examples/one-pager/` for a more complete example.

---

**Perfect for**: Learning Genesis, quick prototypes, simple workflows

