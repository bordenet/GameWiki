# Documentation Templates

## Purpose

This directory contains documentation templates for projects created with Genesis. These templates provide comprehensive documentation structure for architecture, deployment, development, and testing.

## Contents

### Core Documentation

1. **`SHELL_SCRIPT_STANDARDS-template.md`** (✅ Complete)
   - Shell script design patterns
   - Running timer implementation
   - Help and verbose mode requirements
   - Common library usage
   - Reference implementations

2. **`TESTING-template.md`** (✅ Complete)
   - Testing strategy and requirements
   - Unit, integration, and E2E tests
   - AI mock mode implementation
   - Coverage requirements (85% minimum)
   - Test writing guidelines

### Subdirectories

- **`architecture/`** - Architecture documentation templates
- **`deployment/`** - Deployment guides and procedures
- **`development/`** - Development setup and guidelines

## Usage

### For AI Assistants

When creating a new project:
1. Copy `SHELL_SCRIPT_STANDARDS-template.md` → `docs/SHELL_SCRIPT_STANDARDS.md`
2. Copy `TESTING-template.md` → `docs/TESTING.md`
3. Replace all `{{VARIABLES}}` with project-specific values
4. Create architecture docs from `architecture/` templates
5. Create deployment docs from `deployment/` templates
6. Create development docs from `development/` templates

### For Manual Use

1. Navigate to template subdirectory
2. Copy template file to your project's `docs/` directory
3. Remove `-template` suffix
4. Replace variables with actual values
5. Customize content as needed

## Template Variables

Common variables used in documentation templates:

- `{{PROJECT_NAME}}` - Project name (lowercase, hyphenated)
- `{{PROJECT_TITLE}}` - Project title (display name)
- `{{PROJECT_DESCRIPTION}}` - One-line project description
- `{{GITHUB_USER}}` - GitHub username
- `{{GITHUB_REPO}}` - GitHub repository name
- `{{GITHUB_PAGES_URL}}` - GitHub Pages URL
- `{{DEPLOY_FOLDER}}` - Deployment folder (docs/ or web/)
- `{{PHASE_COUNT}}` - Number of workflow phases
- `{{ENABLE_BACKEND}}` - Backend enabled flag
- `{{ENABLE_CODECOV}}` - Codecov enabled flag

## Documentation Standards

All documentation must follow the standards in `../../05-QUALITY-STANDARDS.md`:

### Writing Style
- ✅ Clear, factual statements
- ✅ Professional tone
- ✅ Specific, measurable claims
- ❌ No hyperbolic language ("amazing", "revolutionary")
- ❌ No unsubstantiated claims ("production-grade", "enterprise-ready")
- ❌ No marketing speak

### Structure
- Clear headings and hierarchy
- Table of contents for long documents
- Code examples with syntax highlighting
- Links to related documentation
- Version information and last updated date

### Accessibility
- Descriptive link text (not "click here")
- Alt text for images
- Proper heading hierarchy (h1 → h2 → h3)
- Code blocks with language specification

## Quality Checklist

Before committing documentation:
- [ ] All variables replaced with actual values
- [ ] All hyperlinks validated
- [ ] Code examples tested
- [ ] Spelling and grammar checked
- [ ] No hyperbolic language
- [ ] Professional tone throughout
- [ ] Proper heading hierarchy
- [ ] Table of contents added (if >500 lines)

## Related Documentation

- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`
- **Customization Guide**: `../../03-CUSTOMIZATION-GUIDE.md`

## Maintenance

When adding new documentation templates:
1. Create template file with `-template.md` suffix
2. Add template variables where appropriate
3. Update this README.md
4. Add to `../../01-AI-INSTRUCTIONS.md` if essential
5. Verify markdown linting passes
6. Add to `../../SUMMARY.md`

