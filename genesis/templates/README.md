# Genesis Templates

## Purpose

This directory contains all template files used to generate new projects from Genesis. Each template file uses variable substitution (e.g., `{{PROJECT_NAME}}`) to customize the generated project.

## 🔧 How to Use Templates

### Step 1: Copy Template Files

Copy template files to your project root, removing the `-template` suffix:

```bash
# Example:
cp genesis/templates/web-app/index-template.html index.html
cp genesis/templates/scripts/setup-macos-web-template.sh scripts/setup-macos.sh
```

### Step 2: Replace Template Variables

**CRITICAL**: You MUST replace ALL `{{VARIABLES}}` with actual values!

**Option A: Manual (Recommended for first time)**
- Use your editor's find/replace feature
- Search for `{{PROJECT_NAME}}` and replace with actual name
- Repeat for all variables (see list below)

**Option B: Automated (Advanced)**
```bash
# macOS/BSD sed (note the '' after -i):
sed -i '' 's/{{PROJECT_NAME}}/one-pager/g' **/*.{js,sh,md,json,html}

# Linux sed:
sed -i 's/{{PROJECT_NAME}}/one-pager/g' **/*.{js,sh,md,json,html}
```

**Verification:**
```bash
# Check for unreplaced variables:
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=genesis
# Should return NO results!
```

## Directory Structure

### Core Templates

- **`project-structure/`** - Project root files (README, CONTRIBUTING, LICENSE, etc.)
- **`web-app/`** - Web application templates (HTML, CSS, JavaScript)
- **`scripts/`** - Shell script templates (setup, validation, utilities)
- **`docs/`** - Documentation templates (architecture, deployment, development)
- **`github/`** - GitHub-specific files (workflows, issue templates)
- **`git-hooks/`** - Git hook templates (pre-commit, pre-push)
- **`hooks/`** - Additional hook templates
- **`backend/`** - Backend API templates (optional, for future use)

## Template Variable System

All templates use double-brace syntax for variables:

### Project Identity
- `{{PROJECT_NAME}}` - Lowercase project name (e.g., "one-pager-assistant")
- `{{PROJECT_TITLE}}` - Display title (e.g., "One-Pager Assistant")
- `{{PROJECT_DESCRIPTION}}` - One-line description
- `{{HEADER_EMOJI}}` - Header emoji
- `{{FAVICON_EMOJI}}` - Favicon emoji

### GitHub
- `{{GITHUB_USER}}` - GitHub username
- `{{GITHUB_REPO}}` - Repository name
- `{{GITHUB_PAGES_URL}}` - Full GitHub Pages URL

### Workflow
- `{{PHASE_COUNT}}` - Number of workflow phases
- `{{PHASE_N_NAME}}` - Name of phase N
- `{{PHASE_N_AI}}` - AI model for phase N
- `{{WORKFLOW_DESCRIPTION}}` - Workflow description

### Architecture
- `{{ENABLE_BACKEND}}` - Backend enabled (true/false)
- `{{ENABLE_CODECOV}}` - Codecov enabled (true/false)
- `{{ENABLE_DESKTOP_CLIENTS}}` - Desktop clients enabled (true/false)
- `{{DEPLOY_FOLDER}}` - Deployment folder (docs/ or web/)

## File Naming Convention

All template files use the `-template` suffix:
- `README-template.md` → `README.md`
- `index-template.html` → `index.html`
- `setup-macos-template.sh` → `setup-macos.sh`

## Conditional Sections

Templates support conditional sections using HTML-style comments:

```html
<!-- IF {{ENABLE_BACKEND}} -->
Backend-specific content here
<!-- END IF -->
```

The AI assistant or generation script removes these sections if the condition is false.

## Usage

1. **AI Assistant**: Read `../01-AI-INSTRUCTIONS.md` for step-by-step guidance
2. **Manual**: Copy template files, replace variables, remove `-template` suffix
3. **Script**: Use generation script (future enhancement)

## Template Categories

### Essential (Always Used)
- `project-structure/README-template.md`
- `project-structure/gitignore-template`
- `web-app/index-template.html`
- `web-app/js/storage-template.js`
- `web-app/js/workflow-template.js`
- `scripts/setup-macos-template.sh`
- `scripts/lib/common-template.sh`
- `github/workflows/ci-template.yml`
- `github/workflows/lint-template.yml`
- `git-hooks/pre-commit-template`

### Optional (Conditional)
- `backend/*` - Only if `{{ENABLE_BACKEND}}` is true
- `project-structure/CONTRIBUTING-template.md` - Recommended for open source
- `docs/architecture/*` - Recommended for complex projects
- `docs/deployment/*` - Recommended for production deployments

## Quality Standards

All templates must meet the standards defined in `../05-QUALITY-STANDARDS.md`:
- No hyperbolic language
- Clear, factual statements
- Proper error handling
- Accessibility features
- Security best practices
- 85% code coverage (for code templates)

## Related Documentation

- **Master Plan**: `../00-GENESIS-PLAN.md`
- **AI Instructions**: `../01-AI-INSTRUCTIONS.md`
- **Quality Standards**: `../05-QUALITY-STANDARDS.md`
- **Customization Guide**: `../03-CUSTOMIZATION-GUIDE.md`

## Maintenance

When adding new templates:
1. Use `-template` suffix
2. Add template variables where appropriate
3. Update this README.md
4. Update `../01-AI-INSTRUCTIONS.md` if template is essential
5. Add tests for template (if applicable)
6. Verify template passes linting
7. Document in `../SUMMARY.md`

