# GitHub Pages Deployment Guide

This guide explains how to deploy {{PROJECT_TITLE}} to GitHub Pages.

---

## Prerequisites

- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] `{{DEPLOY_FOLDER}}/` directory contains web app
- [ ] All tests passing

---

## Deployment Steps

### 1. Configure GitHub Pages

1. Go to repository settings:
   ```
   https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings/pages
   ```

2. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/{{DEPLOY_FOLDER}}`

3. Click "Save"

4. Wait 1-2 minutes for deployment

5. Visit your site:
   ```
   {{GITHUB_PAGES_URL}}
   ```

### 2. Verify Deployment

Check that:
- [ ] Site loads correctly
- [ ] All assets load (CSS, JS)
- [ ] No console errors
- [ ] IndexedDB works
- [ ] Dark mode toggle works
- [ ] Export/import works

### 3. Configure Custom Domain (Optional)

If you have a custom domain:

1. Add CNAME file to `{{DEPLOY_FOLDER}}/`:
   ```bash
   echo "your-domain.com" > {{DEPLOY_FOLDER}}/CNAME
   ```

2. Configure DNS:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `{{GITHUB_USER}}.github.io`

3. Enable HTTPS in repository settings

---

## Automated Deployment

### GitHub Actions Workflow

The `.github/workflows/deploy-web.yml` workflow automatically deploys on push to `main`:

```yaml
name: Deploy Web App

on:
  push:
    branches: [ main ]
    paths:
      - '{{DEPLOY_FOLDER}}/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./{{DEPLOY_FOLDER}}
```

**How it works**:
1. Triggered on push to `main` (when `{{DEPLOY_FOLDER}}/` changes)
2. Checks out code
3. Deploys `{{DEPLOY_FOLDER}}/` to `gh-pages` branch
4. GitHub Pages serves from `gh-pages` branch

---

## Troubleshooting

### Site Not Loading

**Problem**: 404 error or blank page

**Solutions**:
1. Check GitHub Pages settings (correct branch and folder)
2. Verify `{{DEPLOY_FOLDER}}/index.html` exists
3. Wait 2-3 minutes for propagation
4. Check Actions tab for deployment errors

### Assets Not Loading

**Problem**: CSS/JS not loading, console errors

**Solutions**:
1. Check file paths are relative (not absolute)
2. Verify all files are in `{{DEPLOY_FOLDER}}/`
3. Check `.gitignore` isn't excluding files
4. Clear browser cache

### IndexedDB Not Working

**Problem**: Data not persisting

**Solutions**:
1. Check browser console for errors
2. Verify HTTPS is enabled (required for IndexedDB)
3. Check browser compatibility
4. Test in incognito mode

### Custom Domain Not Working

**Problem**: Custom domain shows 404

**Solutions**:
1. Verify CNAME file exists in `{{DEPLOY_FOLDER}}/`
2. Check DNS propagation (can take 24-48 hours)
3. Verify DNS records are correct
4. Enable "Enforce HTTPS" in settings

---

## Performance Optimization

### Enable Caching

Add `.nojekyll` file to `{{DEPLOY_FOLDER}}/`:
```bash
touch {{DEPLOY_FOLDER}}/.nojekyll
```

This disables Jekyll processing and improves deployment speed.

### Compress Assets

GitHub Pages automatically compresses assets with gzip.

### Use CDN for Dependencies

Already configured - Tailwind CSS loads from CDN.

---

## Monitoring

### Check Deployment Status

1. Go to Actions tab:
   ```
   https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions
   ```

2. Look for "Deploy Web App" workflow

3. Check for green checkmark (success) or red X (failure)

### View Deployment Logs

1. Click on workflow run
2. Click on job name
3. Expand steps to see logs

---

## Rollback

If deployment breaks the site:

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

1. Fix the issue locally
2. Test thoroughly
3. Push fix to `main`

---

## Security

### HTTPS

- Always enabled on GitHub Pages
- Required for IndexedDB
- Enforced automatically

### Content Security Policy

Add to `{{DEPLOY_FOLDER}}/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.tailwindcss.com; 
               style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;">
```

---

## Related Documentation

- [Deployment Overview](DEPLOYMENT-template.md)
- [Custom Domain Setup](CUSTOM-DOMAIN-template.md)
- [CI/CD Pipeline](CI-CD-template.md)
- [Troubleshooting](TROUBLESHOOTING-template.md)

