# Reference Implementations

**⚠️ CRITICAL: Study these BEFORE implementing ANY Genesis project!**

The reference implementations contain ALL the answers to common questions:
- How dark mode toggle works (Tailwind config)
- How prompts are structured and loaded
- How form data flows through phases
- How deployment scripts work (compact mode)
- How setup scripts work (fast, resumable)
- How defensive coding is implemented

**DO NOT skip this step!** Studying the reference implementations will save hours of debugging.

## 1. Product Requirements Assistant (3-Phase PRD Generator)
**Repository**: https://github.com/bordenet/product-requirements-assistant
**Live Demo**: https://bordenet.github.io/product-requirements-assistant/

### What to Study:
1. **Workflow Architecture** (`js/workflow.js`):
   - 3-phase workflow with mixed mock/manual modes
   - Phase 1: Mock mode (AI in-app)
   - Phase 2: Manual mode (user copies to Gemini)
   - Phase 3: Mock mode (AI in-app)

2. **Prompt Management** (`prompts/` directory):
   - Prompts stored as markdown files
   - Loaded asynchronously via fetch API
   - Template variable replacement: `{variableName}`

3. **Form-to-Prompt Pattern** (`js/app.js` - renderPhase1Form):
   - Phase 1 presents a form
   - Form fields map to document template sections
   - Validation before prompt generation
   - Form data stored in project.formData

4. **Template Abstraction** (`templates/` directory):
   - Document template stored separately from code
   - Easy to modify without touching JavaScript
   - Template structure guides form field design

5. **Defensive Coding**:
   - Input validation and sanitization
   - Error handling for missing data
   - User-friendly error messages
   - Graceful degradation

### Key Files to Review:

#### 🎨 **Dark Mode (CRITICAL - Always Broken Without This!)**
- **`docs/index.html`** (lines 9-15) - ⭐ **Tailwind dark mode configuration**
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
      tailwind.config = {
          darkMode: 'class'
      }
  </script>
  ```
  **WHY**: Without this, dark mode toggle won't work (Tailwind defaults to 'media' mode)

- **`docs/js/app.js`** (lines 145-165) - ⭐ **Dark mode toggle functions**
  - `loadTheme()` - Load saved theme on page load (prevents flash)
  - `toggleTheme()` - Toggle between light/dark mode
  - Event listener setup for theme-toggle button

#### 📋 **Workflow Architecture**
- `js/workflow.js` - Phase definitions, prompt generation, data flow
- `js/app.js` - UI rendering, form handling, phase transitions
- `prompts/phase1.md` - Example prompt with template variables
- `templates/prd-template.md` - Document structure
- `tests/workflow.test.js` - How to test async prompt loading

#### 🚀 **Deployment & Setup Scripts**
- **`scripts/deploy-web.sh`** - ⭐ **REFERENCE IMPLEMENTATION for compact mode deployment**
  - Compact mode (single line updates, no spam)
  - Quality gates (lint, test, coverage)
  - Git output redirection in compact mode
  - Running timer display

- **`scripts/setup-macos.sh`** - ⭐ **REFERENCE IMPLEMENTATION for setup scripts**
  - Fast, resumable setup (~5-10 seconds on subsequent runs)
  - Smart caching (only installs missing packages)
  - Compact mode output
  - Force reinstall flag (`-f`)

- **`scripts/setup-linux.sh`** - Linux setup script example
- **`scripts/setup-windows-wsl.sh`** - Windows WSL setup script example
- **`scripts/setup-codecov.sh`** - Code coverage setup example

#### 🎯 **UI Patterns**
- **Related Projects Dropdown** (`docs/index.html` lines 37-53)
  - Lightning bolt icon button
  - Dropdown menu with related tools
  - Click outside to close

- **Privacy Notice** (`docs/index.html` lines 54-74)
  - Dismissible banner
  - Stored in localStorage
  - Blue info styling

## 2. One-Pager Assistant (3-Phase One-Pager Generator)
**Repository**: https://github.com/bordenet/one-pager
**Live Demo**: https://bordenet.github.io/one-pager/

### What to Study:
- Same 3-phase workflow pattern as PRD Assistant
- Different document template (one-pager vs PRD)
- 9 form fields mapping to one-pager sections
- Example of adapting the pattern to different document types

## 3. Hello World (2-Phase Simple Example)
**Location**: `genesis/examples/hello-world/`

### What to Study:
- Simpler 2-phase workflow
- Basic project structure
- Minimal viable implementation
- Good starting point for understanding the basics

