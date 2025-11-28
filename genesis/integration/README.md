# Starter-Kit Integration

This directory contains files from the [bordenet/scripts starter-kit](https://github.com/bordenet/scripts/tree/main/starter-kit), integrated into the Genesis template system.

## Files Included

- `SAFETY_NET.md` - Comprehensive guide to automated safety mechanisms
- `DEVELOPMENT_PROTOCOLS.md` - Critical protocols for AI-assisted development
- `PROJECT_SETUP_CHECKLIST.md` - Step-by-step checklist for new projects
- `SHELL_SCRIPT_STANDARDS.md` - Shell script style guide
- `CODE_STYLE_STANDARDS.md` - Cross-language style guide
- `common.sh` - Reusable shell script library

## How These Are Used in Genesis

### SAFETY_NET.md
Referenced in:
- `templates/docs/development/CLAUDE-template.md` (Pre-commit hooks section)
- `templates/hooks/pre-commit-template` (Implementation)
- `01-AI-INSTRUCTIONS.md` (Setup guidance)

### DEVELOPMENT_PROTOCOLS.md
Referenced in:
- `templates/docs/development/CLAUDE-template.md` (AI protocols section)
- `01-AI-INSTRUCTIONS.md` (AI behavior guidelines)

### PROJECT_SETUP_CHECKLIST.md
Referenced in:
- `01-AI-INSTRUCTIONS.md` (Setup steps)
- `02-QUICK-START.md` (Manual setup option)

### common.sh
Used in:
- `templates/scripts/lib/common-template.sh` (Base library)
- All script templates (sourced for utilities)

### SHELL_SCRIPT_STANDARDS.md
Referenced in:
- `templates/scripts/` (All shell scripts follow these standards)
- `03-CUSTOMIZATION-GUIDE.md` (Script customization)

### CODE_STYLE_STANDARDS.md
Referenced in:
- `templates/project-structure/CONTRIBUTING-template.md` (Style guide section)
- `templates/docs/development/CLAUDE-template.md` (Code quality section)

## Origin

These files were copied from the [bordenet/scripts](https://github.com/bordenet/scripts) repository on 2025-11-20.

**Original Location**: `https://github.com/bordenet/scripts/tree/main/starter-kit`

## License

MIT License - Copyright (c) 2025 Matt J Bordenet

## Updates

To update these files with the latest from starter-kit:

```bash
# Fetch latest versions
curl -o SAFETY_NET.md https://raw.githubusercontent.com/bordenet/scripts/main/starter-kit/SAFETY_NET.md
curl -o DEVELOPMENT_PROTOCOLS.md https://raw.githubusercontent.com/bordenet/scripts/main/starter-kit/DEVELOPMENT_PROTOCOLS.md
curl -o PROJECT_SETUP_CHECKLIST.md https://raw.githubusercontent.com/bordenet/scripts/main/starter-kit/PROJECT_SETUP_CHECKLIST.md
curl -o common.sh https://raw.githubusercontent.com/bordenet/scripts/main/starter-kit/common.sh
```

