# Genesis Deployment Guide

**Purpose**: Step-by-step guide for deploying projects created with Genesis templates.

---

## Quick Deploy (GitHub Pages)

### Prerequisites

- GitHub account
- Git installed locally
- Project created from Genesis templates

### Steps

#### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: {{PROJECT_TITLE}}"

# Create GitHub repo (using GitHub CLI)
gh repo create {{GITHUB_REPO}} --public --source=. --remote=origin --push

# OR manually:
# 1. Go to https://github.com/new
# 2. Create repository named {{GITHUB_REPO}}
# 3. Follow instructions to push existing repository
```

#### 2. Enable GitHub Pages

**Option A: Using GitHub CLI**
```bash
gh api repos/{{GITHUB_USER}}/{{GITHUB_REPO}}/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/{{DEPLOY_FOLDER}}
```

**Option B: Using GitHub Web UI**
1. Go to repository Settings
2. Scroll to "Pages" section
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/{{DEPLOY_FOLDER}}`
4. Click "Save"

#### 3. Wait for Deployment

```bash
# Check deployment status
gh run list --limit 1

# View deployment
gh run view --log
```

Your site will be live at: **{{GITHUB_PAGES_URL}}**

---

## Local Development

### Serve Locally

```bash
# Option 1: Python (recommended)
cd {{DEPLOY_FOLDER}}
python3 -m http.server 8000
# Open http://localhost:8000

# Option 2: Node.js
npx http-server {{DEPLOY_FOLDER}} -p 8000

# Option 3: PHP
cd {{DEPLOY_FOLDER}}
php -S localhost:8000
```

### Test Before Deploy

```bash
# Validate HTML
npx html-validate {{DEPLOY_FOLDER}}/index.html

# Check for broken links
npx broken-link-checker http://localhost:8000

# Test in multiple browsers
open -a "Google Chrome" http://localhost:8000
open -a "Safari" http://localhost:8000
open -a "Firefox" http://localhost:8000
```

---

## CI/CD Setup

### GitHub Actions (Automatic Deployment)

The Genesis templates include a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**File**: `.github/workflows/deploy-web.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '{{DEPLOY_FOLDER}}'
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Enable workflow**:
```bash
# Workflow is automatically enabled when you push to GitHub
git push origin main

# Manually trigger workflow
gh workflow run deploy-web.yml
```

---

## Custom Domain (Optional)

### Setup Custom Domain

1. **Add CNAME file**:
   ```bash
   echo "{{CUSTOM_DOMAIN}}" > {{DEPLOY_FOLDER}}/CNAME
   git add {{DEPLOY_FOLDER}}/CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**:
   - Add CNAME record: `www` → `{{GITHUB_USER}}.github.io`
   - Add A records for apex domain:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Enable HTTPS**:
   - Go to repository Settings → Pages
   - Check "Enforce HTTPS"

---

## Alternative Hosting

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir={{DEPLOY_FOLDER}} --prod
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod {{DEPLOY_FOLDER}}
```

### Cloudflare Pages

1. Go to Cloudflare Pages dashboard
2. Connect GitHub repository
3. Set build settings:
   - Build command: (none)
   - Build output directory: `{{DEPLOY_FOLDER}}`
4. Deploy

---

## Troubleshooting

### Site Not Loading

**Check deployment status**:
```bash
gh run list --limit 5
gh run view --log
```

**Common issues**:
- GitHub Pages not enabled → Enable in Settings
- Wrong folder selected → Should be `/{{DEPLOY_FOLDER}}`
- 404 errors → Check file paths are relative

### IndexedDB Not Working

**Common issues**:
- HTTPS required → GitHub Pages provides HTTPS automatically
- Private browsing → IndexedDB disabled in private mode
- Storage quota exceeded → Export and clear old projects

### Dark Mode Not Working

**Check**:
- Tailwind CSS loaded → View page source, check CDN link
- Browser supports `prefers-color-scheme` → Update browser
- Custom CSS loaded → Check `styles.css` path

---

## Performance Optimization

### Enable Caching

Add to `{{DEPLOY_FOLDER}}/_headers`:
```
/*
  Cache-Control: public, max-age=3600
  
/*.js
  Cache-Control: public, max-age=31536000
  
/*.css
  Cache-Control: public, max-age=31536000
```

### Minify Assets (Optional)

```bash
# Minify CSS
npx csso {{DEPLOY_FOLDER}}/css/styles.css -o {{DEPLOY_FOLDER}}/css/styles.min.css

# Minify JS
npx terser {{DEPLOY_FOLDER}}/js/*.js -o {{DEPLOY_FOLDER}}/js/bundle.min.js
```

---

## Monitoring

### Check Site Status

```bash
# Check if site is up
curl -I {{GITHUB_PAGES_URL}}

# Check response time
curl -w "@-" -o /dev/null -s {{GITHUB_PAGES_URL}} <<'EOF'
time_total: %{time_total}s\n
EOF
```

### Analytics (Optional)

Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

**Need help?** See [GitHub Pages documentation](https://docs.github.com/en/pages)

