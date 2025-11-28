# {{PROJECT_TITLE}} - Deployment Guide

This guide covers all deployment options for {{PROJECT_TITLE}}.

---

## Deployment Options

### 1. GitHub Pages (Recommended)
- **Cost**: Free
- **Setup Time**: 5 minutes
- **Best For**: Public projects, simple deployment
- **Guide**: [GitHub Pages Deployment](GITHUB-PAGES-template.md)

### 2. Local Development
- **Cost**: Free
- **Setup Time**: 2 minutes
- **Best For**: Development, testing
- **Guide**: See below

---

## Quick Start: Local Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required
- No server required

### Steps

1. **Clone repository**:
   ```bash
   git clone https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}.git
   cd {{GITHUB_REPO}}
   ```

2. **Open in browser**:
   ```bash
   # macOS
   open {{DEPLOY_FOLDER}}/index.html
   
   # Linux
   xdg-open {{DEPLOY_FOLDER}}/index.html
   
   # Windows
   start {{DEPLOY_FOLDER}}/index.html
   ```

3. **Start using**:
   - Create new project
   - Follow {{PHASE_COUNT}}-phase workflow
   - Data saves to browser IndexedDB

**That's it!** No build step, no server, no configuration.

---

## Production Deployment: GitHub Pages

### Initial Setup

1. **Configure GitHub Pages**:
   ```
   Repository Settings → Pages → Source:
   - Branch: main
   - Folder: /{{DEPLOY_FOLDER}}
   ```

2. **Wait for deployment** (1-2 minutes)

3. **Access your site**:
   ```
   {{GITHUB_PAGES_URL}}
   ```

### Automated Deployment

Every push to `main` automatically deploys via GitHub Actions.

**Workflow**: `.github/workflows/deploy-web.yml`

**Trigger**: Changes to `{{DEPLOY_FOLDER}}/` directory

**Duration**: ~30 seconds

---

## Environment Configuration

### Setup .env (Optional)

For local backend development (if applicable):

```bash
# Copy template
cp .env.example .env

# Edit values
nano .env
```

### Required Variables

```bash
# Code Coverage (for CI/CD)
CODECOV_TOKEN=your_codecov_token_here
```

### Optional Variables

```bash
# Backend (if using Go backend)
BACKEND_PORT=8080
BACKEND_HOST=localhost

# Frontend (if using Streamlit)
FRONTEND_PORT=8501
FRONTEND_HOST=localhost

# Logging
LOG_LEVEL=INFO
DEBUG=false
```

---

## Verification Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] All assets load (CSS, JS)
- [ ] No console errors (F12 → Console)
- [ ] IndexedDB works (create/save project)
- [ ] Dark mode toggle works
- [ ] Export/import works
- [ ] Mobile responsive (test on phone)
- [ ] HTTPS enabled (production only)

---

## Troubleshooting

### Site Not Loading

**Symptom**: 404 error or blank page

**Solutions**:
1. Check GitHub Pages settings (correct branch/folder)
2. Verify `{{DEPLOY_FOLDER}}/index.html` exists
3. Wait 2-3 minutes for propagation
4. Check Actions tab for deployment errors

### Assets Not Loading

**Symptom**: Unstyled page, console errors

**Solutions**:
1. Check browser console (F12)
2. Verify all file paths are relative
3. Clear browser cache (Ctrl+Shift+R)
4. Check `.gitignore` isn't excluding files

### IndexedDB Not Working

**Symptom**: Data not persisting

**Solutions**:
1. Check browser console for errors
2. Verify HTTPS enabled (required for IndexedDB)
3. Test in incognito mode
4. Check browser compatibility

### Performance Issues

**Symptom**: Slow loading, laggy UI

**Solutions**:
1. Check network tab (F12 → Network)
2. Verify CDN assets loading
3. Check for large project data
4. Test in different browser

---

## Security Considerations

### HTTPS
- **Required**: For IndexedDB to work
- **GitHub Pages**: Automatically enabled
- **Local**: Not required for localhost

### Content Security Policy

Add to `{{DEPLOY_FOLDER}}/index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.tailwindcss.com; 
               style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;">
```

### Data Privacy
- All data stored locally in browser
- No server communication
- No analytics or tracking
- User controls all data

---

## Monitoring

### GitHub Actions

Monitor deployments:
```
https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions
```

### Deployment Status

Check status badge in README:
```markdown
![Deploy](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/workflows/Deploy%20Web%20App/badge.svg)
```

---

## Rollback

If deployment breaks:

### Option 1: Revert Commit
```bash
git revert HEAD
git push origin main
```

### Option 2: Deploy Previous Version
```bash
git checkout <previous-commit>
git push origin main --force
```

### Option 3: Manual Fix
```bash
# Fix locally
# Test thoroughly
git add .
git commit -m "fix: deployment issue"
git push origin main
```

---

## Related Documentation

- [GitHub Pages Setup](GITHUB-PAGES-template.md)
- [Custom Domain Setup](CUSTOM-DOMAIN-template.md)
- [CI/CD Pipeline](CI-CD-template.md)
- [Architecture](../architecture/ARCHITECTURE-template.md)

