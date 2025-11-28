# Genesis Examples

## ⚠️ IMPORTANT: Examples are for REFERENCE ONLY

**DO NOT copy files from examples/** - use `genesis/templates/` instead!

## Purpose

This directory contains complete example projects created using Genesis templates. These examples demonstrate how to use Genesis to create different types of AI-assisted workflow applications.

**Examples are for STUDYING, not COPYING:**
- ✅ **Study the code** to understand patterns
- ✅ **Run locally** to see how they work
- ✅ **Reference** when you have questions
- ❌ **DO NOT copy files** from here to your project
- ❌ **Use `genesis/templates/`** for copying files instead

**Why?** Examples may be outdated or customized for specific use cases. Templates are the source of truth.

## Examples

### 1. Minimal Example (`minimal/`)

**Purpose**: Simplest possible Genesis project - single-phase workflow

**Features**:
- 1-phase workflow
- Single AI model (Claude Sonnet 4.5)
- Basic UI
- No backend
- Minimal dependencies

**Use Case**: Quick prototypes, simple AI-assisted tasks

**Files**:
- `web/index.html` - Main web app
- `web/js/app.js` - Application logic
- `scripts/setup-macos.sh` - Setup script
- `docs/README.md` - Documentation

**To Run**:
```bash
cd minimal/web
python3 -m http.server 8000
# Open http://localhost:8000
```

### 2. One-Pager Example (`one-pager/`)

**Purpose**: Complete 3-phase workflow for creating one-page documents

**Features**:
- 3-phase workflow (Draft → Review → Finalize)
- Multiple AI models (Claude, Gemini)
- Complete UI with dark mode
- Export to Markdown
- Full documentation

**Use Case**: Creating one-pagers, briefs, summaries

**Files**:
- `web/` - Complete web application
- `scripts/` - Setup and validation scripts
- `docs/` - Full documentation
- `prompts/` - Prompt templates

**To Run**:
```bash
cd one-pager
./scripts/setup-macos.sh
cd web
python3 -m http.server 8000
# Open http://localhost:8000
```

## How to Use Examples

### As Learning Material

1. **Read the code**: Examples show best practices
2. **Compare to templates**: See how templates are customized
3. **Run locally**: Test the examples yourself
4. **Modify**: Experiment with changes

### As Starting Points

1. **Copy example**: `cp -r examples/one-pager my-project`
2. **Customize**: Modify for your use case
3. **Rename**: Update project name throughout
4. **Deploy**: Push to GitHub, enable Pages

### As Test Cases

1. **Validation**: Examples verify Genesis templates work
2. **Regression testing**: Changes to Genesis should not break examples
3. **Documentation**: Examples demonstrate features

## Example Comparison

| Feature | Minimal | One-Pager |
|---------|---------|-----------|
| Phases | 1 | 3 |
| AI Models | 1 (Claude) | 2 (Claude, Gemini) |
| Dark Mode | ❌ | ✅ |
| Export | ❌ | ✅ |
| Documentation | Basic | Complete |
| Tests | ❌ | ✅ |
| CI/CD | ❌ | ✅ |
| Complexity | Low | Medium |
| Setup Time | 5 min | 15 min |
| Lines of Code | ~200 | ~800 |

## Creating New Examples

To add a new example:

1. **Create directory**: `mkdir examples/my-example`
2. **Use Genesis**: Follow `../01-AI-INSTRUCTIONS.md`
3. **Customize**: Tailor to specific use case
4. **Test**: Verify everything works
5. **Document**: Add README.md
6. **Update this file**: Add to examples list

## Quality Standards

All examples must meet these standards:

### Functionality
- ✅ All features work as documented
- ✅ No console errors
- ✅ Handles edge cases gracefully
- ✅ Mobile responsive

### Code Quality
- ✅ Passes all linting (shellcheck, eslint)
- ✅ No TODO comments
- ✅ Proper error handling
- ✅ Clear variable names

### Documentation
- ✅ README.md in root
- ✅ Setup instructions
- ✅ Usage examples
- ✅ Architecture overview

### Testing
- ✅ Tested on macOS
- ✅ Tested in Chrome, Firefox, Safari
- ✅ Tested on mobile
- ✅ All scripts tested

## Related Documentation

- **Genesis Plan**: `../00-GENESIS-PLAN.md`
- **AI Instructions**: `../01-AI-INSTRUCTIONS.md`
- **Templates**: `../templates/README.md`
- **Quality Standards**: `../05-QUALITY-STANDARDS.md`

## Maintenance

When updating examples:
1. Test all functionality
2. Update documentation
3. Verify linting passes
4. Update screenshots (if any)
5. Update this README
6. Update `../SUMMARY.md`

## Future Examples

Planned examples (not yet implemented):
- **Multi-model**: 5-phase workflow with different AI models per phase
- **Backend-enabled**: Example with optional backend API
- **Desktop-client**: Example with Electron wrapper
- **Mobile-first**: Example optimized for mobile devices

