# Project Structure Templates

## Purpose

This directory contains templates for project root files - the essential files that define project identity, contribution guidelines, and licensing.

## Contents

### Core Files

1. **`README-template.md`** (✅ Complete)
   - Main project README
   - Badges (CI/CD, coverage, license, release)
   - Quick start guide
   - Features overview
   - Architecture description
   - Usage examples
   - Contributing guidelines link

2. **`CONTRIBUTING-template.md`** (✅ Complete)
   - Contribution guidelines
   - Code of conduct
   - Development setup
   - Pull request process
   - Code style standards
   - Testing requirements
   - Review process

3. **`gitignore-template`** (✅ Complete)
   - Git ignore patterns
   - Node.js patterns
   - Python patterns
   - macOS patterns
   - IDE patterns
   - Build artifacts
   - Sensitive files

## Template Variables

All templates use these variables:

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
- `{{WORKFLOW_DESCRIPTION}}` - Brief workflow description

### Features
- `{{ENABLE_CODECOV}}` - Codecov enabled (true/false)
- `{{ENABLE_BACKEND}}` - Backend enabled (true/false)
- `{{DEPLOY_FOLDER}}` - Deployment folder (docs/ or web/)

## Usage

### For AI Assistants

When creating a new project:

1. Copy `README-template.md` → `README.md`
2. Copy `CONTRIBUTING-template.md` → `CONTRIBUTING.md`
3. Copy `gitignore-template` → `.gitignore`
4. Replace all `{{VARIABLES}}` with actual values
5. Remove conditional sections if needed
6. Customize as appropriate

### For Manual Use

```bash
# Copy templates to project root
cp genesis/templates/project-structure/README-template.md README.md
cp genesis/templates/project-structure/CONTRIBUTING-template.md CONTRIBUTING.md
cp genesis/templates/project-structure/gitignore-template .gitignore

# Replace variables (example using sed)
sed -i '' 's/{{PROJECT_TITLE}}/My Project/g' README.md
sed -i '' 's/{{GITHUB_USER}}/myusername/g' README.md

# Review and customize
vim README.md
```

## README.md Structure

The README template includes:

### Header
- Project title with emoji
- Badges (CI/CD, coverage, license, release)
- One-line description
- Link to live demo

### Quick Start
- Web app link (primary)
- Local development setup (secondary)

### Features
- Key features list
- Workflow description
- AI integration details

### How It Works
- Workflow overview
- Phase descriptions
- Example usage

### Architecture
- Frontend stack
- Storage solution
- Styling approach
- Deployment method

### Documentation
- Links to detailed docs
- API reference (if applicable)
- Troubleshooting guide

### Contributing
- Link to CONTRIBUTING.md
- Quick contribution guide

### License
- License type
- Copyright notice

## CONTRIBUTING.md Structure

The CONTRIBUTING template includes:

### Welcome
- Thank contributors
- Set expectations

### Code of Conduct
- Professional behavior
- Inclusive environment

### Getting Started
- Fork repository
- Clone locally
- Install dependencies
- Run tests

### Development Workflow
- Create branch
- Make changes
- Write tests
- Run linting
- Commit changes
- Push and create PR

### Code Standards
- Style guide
- Linting requirements
- Testing requirements
- Documentation requirements

### Pull Request Process
- PR template
- Review process
- Merge criteria

## .gitignore Patterns

The gitignore template includes:

### Node.js
- `node_modules/`
- `npm-debug.log`
- `package-lock.json` (optional)

### Python
- `__pycache__/`
- `*.pyc`
- `.venv/`
- `venv/`

### macOS
- `.DS_Store`
- `.AppleDouble`

### IDEs
- `.vscode/`
- `.idea/`
- `*.swp`

### Build
- `dist/`
- `build/`
- `*.log`

### Sensitive
- `.env`
- `*.key`
- `secrets/`

## Quality Standards

All project structure files must meet these standards:

### README.md
- ✅ Clear, concise description
- ✅ Working badges
- ✅ Accurate setup instructions
- ✅ No hyperbolic language
- ✅ Professional tone
- ✅ All links work

### CONTRIBUTING.md
- ✅ Clear contribution process
- ✅ Specific requirements
- ✅ Welcoming tone
- ✅ Code of conduct
- ✅ Contact information

### .gitignore
- ✅ Comprehensive patterns
- ✅ No false positives
- ✅ Comments for clarity
- ✅ Organized by category

## Related Documentation

- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`
- **Templates Index**: `../README.md`

## Maintenance

When modifying project structure templates:
1. Test in actual project
2. Verify all links work
3. Check badge URLs
4. Update this README
5. Update `../../SUMMARY.md`

