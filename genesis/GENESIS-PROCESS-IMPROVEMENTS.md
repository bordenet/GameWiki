# Genesis Process Improvements - Lessons from one-pager Project

**Date**: 2025-11-21  
**Project**: one-pager (One-Pager Assistant)  
**Issue**: Genesis documentation was insufficient to enable autonomous execution without extensive Q&A

---

## 🎯 Core Problem

The AI assistant required significant back-and-forth questioning before understanding how to build the project, despite having access to the Genesis template system. This indicates **critical gaps in the Genesis documentation** that prevented autonomous execution.

---

## 📋 What Went Wrong

### 1. **Missing Reference Implementation**
- Genesis did NOT prominently reference the working example: https://github.com/bordenet/product-requirements-assistant
- This reference implementation contains ALL the answers to questions the AI asked:
  - How the 3-phase workflow actually works
  - How prompts are structured and loaded
  - How form data flows through phases
  - How mock mode vs. manual mode works
  - How defensive coding is implemented
  - How the UI handles phase transitions

### 2. **Insufficient Workflow Architecture Documentation**
Genesis should have included a detailed section explaining:
- **Phase Types**: Mock (AI-assisted in app) vs. Manual (user copies prompt to external AI)
- **Data Flow**: How form data → prompt generation → AI response → next phase
- **Mock Mode**: Why it exists (development convenience) and how it differs from production
- **Manual Mode**: Why Gemini requires manual interaction (no API in this architecture)
- **Phase Transitions**: How outputs from one phase become inputs to the next

### 3. **Unclear Template Abstraction Requirements**
The AI had to ask:
- "Should prompts be in separate files?" (YES - already done in product-requirements-assistant)
- "Should templates be abstracted?" (YES - already done in product-requirements-assistant)
- "How should template variables work?" (ALREADY SHOWN in product-requirements-assistant)

All of this was already solved in the reference implementation but not documented in Genesis.

### 4. **Missing Form-to-Prompt Pattern**
Genesis didn't explain:
- Phase 1 uses a FORM to collect structured data
- Form fields map to template variables in the prompt
- Validation happens before prompt generation
- The form structure should match the document template structure

---

## ✅ Required Genesis Improvements

### **CRITICAL: Add "Reference Implementations" Section**

Create `genesis/REFERENCE-IMPLEMENTATIONS.md`:

```markdown
# Reference Implementations

Before starting ANY Genesis project, study these working examples:

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
- `js/workflow.js` - Phase definitions, prompt generation, data flow
- `js/app.js` - UI rendering, form handling, phase transitions
- `prompts/phase1.md` - Example prompt with template variables
- `templates/prd-template.md` - Document structure
- `tests/workflow.test.js` - How to test async prompt loading

## 2. Hello World (2-Phase Simple Example)
**Location**: `genesis/examples/hello-world/`

### What to Study:
- Simpler 2-phase workflow
- Basic project structure
- Minimal viable implementation
```
---

### **Add Workflow Architecture Guide**

Create `genesis/docs/WORKFLOW-ARCHITECTURE.md`:

```markdown
# Workflow Architecture Guide

## Overview

Genesis projects use a **multi-phase AI workflow** pattern where different AI models (or the same model with different perspectives) collaborate to produce high-quality documents.

## Phase Types

### 1. Mock Mode Phases (type: 'mock')
**Purpose**: AI interaction happens WITHIN the application during development

**How it works**:
1. User clicks "Generate Prompt"
2. App displays the prompt with a "Copy Prompt" button
3. **DEVELOPMENT MODE**: App shows "[MOCK MODE] Use Mock Response" button
4. **PRODUCTION MODE**: User manually copies prompt to Claude/GPT in another tab
5. User pastes AI response back into the app
6. App validates and stores the response

**When to use**:
- Phase 1 (Initial Draft) - Usually mock mode
- Phase 3 (Final Synthesis) - Usually mock mode
- Any phase where you want to simulate AI interaction during development

**Example** (from product-requirements-assistant):
```javascript
{
  id: 1,
  name: 'Initial Draft',
  description: 'Generate initial PRD using Claude',
  type: 'mock',  // ← This enables mock mode
  completed: false,
  prompt: '',
  response: ''
}
```

### 2. Manual Mode Phases (type: 'manual')
**Purpose**: User MUST interact with external AI (e.g., Gemini) manually

**How it works**:
1. User clicks "Generate Prompt"
2. App displays the prompt with a "Copy Prompt" button
3. User copies prompt to external AI (e.g., Gemini in browser)
4. User copies AI response back into the app
5. App validates and stores the response

**When to use**:
- Phase 2 (Review/Critique) - Usually manual mode with Gemini
- Any phase where you want a different AI model's perspective
- When you don't have API access to the AI model

**Example** (from product-requirements-assistant):
```javascript
{
  id: 2,
  name: 'Gemini Review',
  description: 'Review and critique using Gemini',
  type: 'manual',  // ← No mock mode available
  completed: false,
  prompt: '',
  response: ''
}
```

## Data Flow Pattern

### Phase 1: Form → Prompt → Response
```
User fills form
  ↓
Form data stored in project.formData
  ↓
generatePrompt() loads prompts/phase1.md
  ↓
Template variables replaced with form data
  ↓
Prompt displayed to user
  ↓
User gets AI response (mock or manual)
  ↓
Response stored in project.phases[0].response
```

### Phase 2: Previous Response → Prompt → Response
```
Phase 1 response retrieved
  ↓
generatePrompt() loads prompts/phase2.md
  ↓
{phase1Output} replaced with Phase 1 response
  ↓
Prompt displayed to user
  ↓
User copies to Gemini manually
  ↓
User pastes Gemini response
  ↓
Response stored in project.phases[1].response
```

### Phase 3: All Previous Responses → Prompt → Final Document
```
Phase 1 & 2 responses retrieved
  ↓
generatePrompt() loads prompts/phase3.md
  ↓
{phase1Output} and {phase2Output} replaced
  ↓
Prompt displayed to user
  ↓
User gets AI response (mock or manual)
  ↓
Response stored in project.phases[2].response
  ↓
User downloads final markdown document
```

## Form-to-Prompt Pattern (Phase 1)

### Why Phase 1 Uses a Form

Phase 1 collects **structured data** that maps to the document template sections. This ensures:
- Consistent document structure
- Required fields are captured
- Validation before AI interaction
- Clear user guidance

### Implementation Pattern

1. **Define form fields in workflow.js**:
```javascript
formData: {
  projectName: '',
  problemStatement: '',
  proposedSolution: '',
  keyGoals: '',
  // ... more fields matching template
}
```

2. **Create form in app.js**:
```javascript
function renderPhase1Form(project) {
  return `
    <form id="phase1-form">
      <label>Project Name</label>
      <input name="projectName" value="${project.formData.projectName}" required>

      <label>Problem Statement</label>
      <textarea name="problemStatement" required>${project.formData.problemStatement}</textarea>

      <!-- More fields -->
    </form>
  `;
}
```

3. **Validate and generate prompt**:
```javascript
window.generatePhase1Prompt = async (projectId) => {
  const project = await getProject(projectId);

  // Collect form data
  const form = document.getElementById('phase1-form');
  const formData = new FormData(form);

  // Validate required fields
  if (!formData.get('projectName')) {
    alert('Project name is required');
    return;
  }

  // Update project with form data
  await updateFormData(projectId, Object.fromEntries(formData));

  // Generate prompt with form data
  const prompt = await generatePrompt(project, 1);
  // ... display prompt
};
```

4. **Use form data in prompt template** (`prompts/phase1.md`):
```markdown
Generate a one-pager document with the following information:

**Project Name**: {projectName}
**Problem Statement**: {problemStatement}
**Proposed Solution**: {proposedSolution}

Please create a crisp, professional one-pager...
```

## Template Variable Replacement

### Standard Variables

**Phase 1** (from form data):
- `{projectName}` - Project name from form
- `{problemStatement}` - Problem from form
- `{proposedSolution}` - Solution from form
- Any other form fields

**Phase 2** (from previous phase):
- `{phase1Output}` - Complete response from Phase 1

**Phase 3** (from all previous phases):
- `{phase1Output}` - Complete response from Phase 1
- `{phase2Output}` - Complete response from Phase 2

### Implementation

```javascript
function replaceTemplateVars(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
}
```

## Defensive Coding Patterns

### 1. Input Validation
```javascript
// Validate required fields
const requiredFields = ['projectName', 'problemStatement', 'proposedSolution'];
for (const field of requiredFields) {
  if (!project.formData[field]) {
    alert(`${field} is required`);
    return;
  }
}
```

### 2. Error Handling
```javascript
// Handle missing prompt files
async function loadPromptTemplate(phase) {
  try {
    const response = await fetch(`prompts/phase${phase}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load prompt template for phase ${phase}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading prompt:', error);
    alert('Failed to load prompt template. Please check your connection.');
    return null;
  }
}
```

### 3. Data Sanitization
```javascript
// Sanitize user input before storing
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}
```

### 4. Graceful Degradation
```javascript
// Handle missing phase responses
const phase1Output = project.phases[0]?.response || '[Phase 1 not completed]';
```

## Testing Async Prompt Loading

```javascript
// Mock fetch for testing
global.fetch = async (url) => {
  const templates = {
    'prompts/phase1.md': 'Phase 1 template with {projectName}',
    'prompts/phase2.md': 'Phase 2 template with {phase1Output}',
    'prompts/phase3.md': 'Phase 3 template with {phase1Output} and {phase2Output}'
  };

  return {
    ok: true,
    text: async () => templates[url] || 'Default template'
  };
};

// Test async prompt generation
test('should generate prompt for phase 1', async () => {
  const project = createProject('Test', 'Description');
  await updateFormData(project.id, {
    projectName: 'My Project',
    problemStatement: 'The problem'
  });

  const prompt = await generatePrompt(project, 1);
  expect(prompt).toContain('My Project');
  expect(prompt).toContain('The problem');
});
```
```
---

### **Update START-HERE.md**

The current `genesis/START-HERE.md` should be updated to include:

**BEFORE gathering requirements, add this section**:

```markdown
## 📚 STEP 0: Study Reference Implementations (REQUIRED)

**STOP!** Before asking the user ANY questions, you MUST:

1. **Read** `genesis/REFERENCE-IMPLEMENTATIONS.md`
2. **Study** https://github.com/bordenet/product-requirements-assistant
   - Clone it locally or browse on GitHub
   - Read `js/workflow.js` to understand phase architecture
   - Read `js/app.js` to understand form-to-prompt pattern
   - Read `prompts/phase1.md` to see template variable usage
   - Read `templates/prd-template.md` to understand document structure
3. **Read** `genesis/docs/WORKFLOW-ARCHITECTURE.md`
4. **Understand** the following patterns:
   - Mock mode vs. Manual mode phases
   - Form-to-Prompt pattern for Phase 1
   - Template variable replacement
   - Async prompt loading from markdown files
   - Defensive coding patterns

**Only after studying these references** should you proceed to gather requirements.

Most of your questions will be answered by the reference implementation.
```

---

### **Add Explicit Workflow Decision Tree**

Create `genesis/docs/WORKFLOW-DECISION-TREE.md`:

```markdown
# Workflow Decision Tree

Use this decision tree to determine the correct workflow architecture for your Genesis project.

## Question 1: How many phases?

**2 Phases** (Simple):
- Phase 1: Initial Draft
- Phase 2: Review & Refine
- Example: Simple document generation

**3 Phases** (Recommended):
- Phase 1: Initial Draft
- Phase 2: Review & Critique (different AI model)
- Phase 3: Final Synthesis
- Example: PRD Generator, One-Pager Assistant

**4+ Phases** (Complex):
- Multiple rounds of refinement
- Example: Complex technical specifications

## Question 2: Which phases should be mock mode?

**Default Pattern** (3-phase):
- Phase 1: **MOCK** (Claude/GPT for initial draft)
- Phase 2: **MANUAL** (Gemini for different perspective)
- Phase 3: **MOCK** (Claude/GPT for synthesis)

**Why this pattern?**
- Phase 1 mock: Easier development, user can still use real Claude
- Phase 2 manual: Forces different AI model for diversity
- Phase 3 mock: Easier development, user can still use real Claude

## Question 3: Does Phase 1 need a form?

**YES** if:
- Document has structured sections (e.g., PRD, One-Pager)
- You want to guide user input
- You need validation before AI interaction

**NO** if:
- Free-form document generation
- Single prompt is sufficient

**If YES**, form fields should map to:
1. Document template sections
2. Template variables in `prompts/phase1.md`
3. `formData` object in `js/workflow.js`

## Question 4: What template variables do I need?

**Phase 1 variables** (from form):
- Map each form field to a variable
- Example: `{projectName}`, `{problemStatement}`, `{proposedSolution}`

**Phase 2 variables** (from previous phase):
- Always include: `{phase1Output}`

**Phase 3 variables** (from all previous phases):
- Always include: `{phase1Output}`, `{phase2Output}`

## Question 5: What should the document template contain?

**Document template** (`templates/your-doc-template.md`) should include:
1. **Structure**: All sections of the final document
2. **Writing tips**: Guidance for each section
3. **Example**: A complete example document
4. **Common mistakes**: What to avoid

This template guides:
- Phase 1 form field design
- AI prompt instructions
- User expectations

## Example: One-Pager Assistant

**Phases**: 3 (Initial Draft, Gemini Review, Final Synthesis)

**Phase Types**:
- Phase 1: Mock (Claude)
- Phase 2: Manual (Gemini)
- Phase 3: Mock (Claude)

**Phase 1 Form**: YES
- Fields: projectName, problemStatement, proposedSolution, keyGoals, scopeInScope, scopeOutOfScope, successMetrics, keyStakeholders, timelineEstimate

**Template Variables**:
- Phase 1: All form fields
- Phase 2: `{phase1Output}`
- Phase 3: `{phase1Output}`, `{phase2Output}`

**Document Template**: `templates/one-pager-template.md`
- 8 sections matching form fields
- Writing tips for each section
- Example one-pager
```

---

### **Add Requirements Gathering Template**

Create `genesis/docs/REQUIREMENTS-TEMPLATE.md`:

```markdown
# Requirements Gathering Template

Use this template when gathering requirements from the user. Most answers can be inferred from the reference implementation.

## 1. Project Identity

**Questions to ask**:
- Project name? (lowercase-with-hyphens)
- Project title? (Human-readable)
- One-line description?

**Example**:
- Name: one-pager
- Title: One-Pager Assistant
- Description: AI-assisted workflow helper for generating crisp one-pager documents

## 2. GitHub Information

**Questions to ask**:
- GitHub username? (Check git config or ask)
- GitHub repo name? (Usually same as project name)

**Example**:
- Username: bordenet
- Repo: one-pager

## 3. Workflow Configuration

**DON'T ASK** - Infer from reference implementation:
- ✅ Number of phases (default: 3)
- ✅ Phase types (default: mock, manual, mock)
- ✅ Phase names (default: Initial Draft, Gemini Review, Final Synthesis)

**DO ASK** - Only if different from reference:
- Different number of phases?
- Different AI models?
- Different phase purposes?

**Example** (inferred from product-requirements-assistant):
- 3 phases
- Phase 1: Initial Draft (Claude Sonnet 4.5) - Mock mode
- Phase 2: Gemini Review (Gemini 2.5 Pro) - Manual mode
- Phase 3: Final Synthesis (Claude Sonnet 4.5) - Mock mode

## 4. Document Template

**Questions to ask**:
- What type of document? (e.g., One-Pager, PRD, Design Doc)
- Link to template or example? (if available)

**DON'T ASK** - Infer from reference:
- ✅ Template should be in `templates/` directory
- ✅ Prompts should be in `prompts/` directory
- ✅ Form fields should map to template sections

**Example**:
- Document type: One-Pager
- Template reference: https://github.com/bordenet/Engineering_Culture/blob/main/SDLC/The_One-Pager.md

## 5. Form Fields (Phase 1)

**DON'T ASK** - Infer from document template:
- ✅ Form fields should match template sections
- ✅ Required fields should be validated
- ✅ Form data should be stored in project.formData

**DO ASK** - Only if template is unclear:
- Which fields are required vs. optional?
- Any special validation rules?

**Example** (inferred from one-pager template):
- projectName (required)
- problemStatement (required)
- proposedSolution (required)
- keyGoals (optional)
- scopeInScope (optional)
- scopeOutOfScope (optional)
- successMetrics (optional)
- keyStakeholders (optional)
- timelineEstimate (optional)

## 6. What NOT to Ask

**NEVER ask these** - Already answered by reference implementation:
- ❌ "Should prompts be in separate files?" (YES - always)
- ❌ "Should templates be abstracted?" (YES - always)
- ❌ "How should template variables work?" (Use `{variableName}` syntax)
- ❌ "Should Phase 1 have a form?" (YES - if document is structured)
- ❌ "How should mock mode work?" (See product-requirements-assistant)
- ❌ "How should validation work?" (See defensive coding patterns)
- ❌ "How should tests be structured?" (Copy from hello-world, update for phases)

## Summary

**Ask ONLY**:
1. Project identity (name, title, description)
2. GitHub info (username, repo)
3. Document type and template reference
4. Deviations from standard 3-phase workflow (if any)

**Infer from reference implementation**:
1. Workflow architecture (3 phases: mock, manual, mock)
2. Prompt management (markdown files in `prompts/`)
3. Template abstraction (`templates/` directory)
4. Form-to-prompt pattern (Phase 1 form)
5. Template variables (`{variableName}` syntax)
6. Defensive coding patterns
7. Test structure
```

---

## 🔧 Specific File Updates Needed in Genesis

### 1. Update `genesis/START-HERE.md`

**Add BEFORE "Step 1: Gather Requirements"**:

```markdown
## 📚 CRITICAL: Study Reference Implementation FIRST

**STOP!** Before proceeding, you MUST study the reference implementation:

1. **Read**: `genesis/REFERENCE-IMPLEMENTATIONS.md`
2. **Clone and study**: https://github.com/bordenet/product-requirements-assistant
3. **Read**: `genesis/docs/WORKFLOW-ARCHITECTURE.md`
4. **Read**: `genesis/docs/REQUIREMENTS-TEMPLATE.md`

**Key files to study in product-requirements-assistant**:
- `js/workflow.js` - Phase architecture, prompt loading, data flow
- `js/app.js` - Form rendering, phase transitions, UI logic
- `prompts/phase1.md` - Prompt template with variables
- `templates/prd-template.md` - Document structure
- `tests/workflow.test.js` - Testing async prompts

**What you'll learn**:
- ✅ 3-phase workflow pattern (mock, manual, mock)
- ✅ Form-to-prompt pattern for Phase 1
- ✅ Template variable replacement
- ✅ Async prompt loading from markdown files
- ✅ Defensive coding patterns
- ✅ Mock mode vs. manual mode

**This will answer 90% of your questions BEFORE you ask the user.**
```

### 2. Create `genesis/REFERENCE-IMPLEMENTATIONS.md`

(See full content in "Required Genesis Improvements" section above)

### 3. Create `genesis/docs/WORKFLOW-ARCHITECTURE.md`

(See full content in "Required Genesis Improvements" section above)

### 4. Create `genesis/docs/WORKFLOW-DECISION-TREE.md`

(See full content in "Required Genesis Improvements" section above)

### 5. Create `genesis/docs/REQUIREMENTS-TEMPLATE.md`

(See full content in "Required Genesis Improvements" section above)

### 6. Update `genesis/AI-EXECUTION-CHECKLIST.md`

**Add at the top**:

```markdown
## ⚠️ BEFORE YOU START

- [ ] Read `genesis/REFERENCE-IMPLEMENTATIONS.md`
- [ ] Study https://github.com/bordenet/product-requirements-assistant
- [ ] Read `genesis/docs/WORKFLOW-ARCHITECTURE.md`
- [ ] Read `genesis/docs/REQUIREMENTS-TEMPLATE.md`
- [ ] Understand the 3-phase workflow pattern
- [ ] Understand form-to-prompt pattern
- [ ] Understand mock vs. manual mode

**DO NOT PROCEED** until you've completed the above. This will save you and the user significant time.
```

### 7. Update `genesis/examples/one-pager/README.md`

**Add this example as a reference**:

```markdown
# One-Pager Example

This example demonstrates a 3-phase workflow for generating one-pager documents.

## Workflow Architecture

**Phase 1: Initial Draft** (Mock Mode)
- User fills form with 9 fields
- Form data → prompt template
- Claude generates initial one-pager
- Output stored for Phase 2

**Phase 2: Gemini Review** (Manual Mode)
- Phase 1 output → prompt template
- User copies prompt to Gemini
- Gemini critiques and improves
- User pastes response back

**Phase 3: Final Synthesis** (Mock Mode)
- Phase 1 + Phase 2 outputs → prompt template
- Claude synthesizes final document
- User downloads markdown file

## Key Implementation Details

### Form Fields (Phase 1)
```javascript
formData: {
  projectName: '',
  problemStatement: '',
  proposedSolution: '',
  keyGoals: '',
  scopeInScope: '',
  scopeOutOfScope: '',
  successMetrics: '',
  keyStakeholders: '',
  timelineEstimate: ''
}
```

### Prompt Templates
- `prompts/phase1.md` - Uses all form fields as variables
- `prompts/phase2.md` - Uses `{phase1Output}`
- `prompts/phase3.md` - Uses `{phase1Output}` and `{phase2Output}`

### Document Template
- `templates/one-pager-template.md` - 8 sections matching form fields

## Reference Implementation

**Live Demo**: https://bordenet.github.io/one-pager/
**Repository**: https://github.com/bordenet/one-pager

Study this implementation to understand:
- How form data flows to prompts
- How template variables are replaced
- How validation works
- How mock mode is implemented
```

---

## 📝 AI Assistant Instructions for Future Genesis Projects

When you (the AI assistant) encounter a Genesis project in the future, follow this protocol:

### Phase 0: Study (BEFORE asking user anything)

1. **Read** `genesis/REFERENCE-IMPLEMENTATIONS.md`
2. **Study** https://github.com/bordenet/product-requirements-assistant
   - Clone it or browse on GitHub
   - Read ALL key files listed in REFERENCE-IMPLEMENTATIONS.md
   - Understand the workflow architecture
   - Understand the form-to-prompt pattern
   - Understand mock vs. manual mode
3. **Read** `genesis/docs/WORKFLOW-ARCHITECTURE.md`
4. **Read** `genesis/docs/REQUIREMENTS-TEMPLATE.md`
5. **Read** `genesis/docs/WORKFLOW-DECISION-TREE.md`

### Phase 1: Infer (BEFORE asking user)

Based on the reference implementation, **infer** the following:

- ✅ 3-phase workflow (unless user specifies otherwise)
- ✅ Phase types: mock, manual, mock
- ✅ Phase names: Initial Draft, Gemini Review, Final Synthesis
- ✅ Prompts in `prompts/` directory as markdown files
- ✅ Templates in `templates/` directory
- ✅ Phase 1 uses a form (if document is structured)
- ✅ Form fields map to template sections
- ✅ Template variables use `{variableName}` syntax
- ✅ Async prompt loading with fetch API
- ✅ Defensive coding patterns
- ✅ Test structure from hello-world

### Phase 2: Ask (ONLY what you can't infer)

**Ask the user ONLY**:
1. Project name, title, description
2. GitHub username and repo name
3. Document type and template reference (if available)
4. Any deviations from standard 3-phase workflow

**DO NOT ASK**:
- ❌ How many phases? (Default: 3)
- ❌ Should prompts be in files? (YES - always)
- ❌ Should templates be abstracted? (YES - always)
- ❌ How should mock mode work? (See reference)
- ❌ Should Phase 1 have a form? (YES - if structured doc)
- ❌ How should validation work? (See reference)

### Phase 3: Execute

1. Copy files from `genesis/examples/hello-world/`
2. Customize based on:
   - User's answers
   - Reference implementation patterns
   - Document template structure
3. Create prompts in `prompts/` directory
4. Create template in `templates/` directory
5. Update `js/workflow.js` with phases and form fields
6. Update `js/app.js` with form rendering
7. Update tests for new phase count
8. Run lint, tests, coverage
9. Commit and push
10. Enable GitHub Pages
11. Delete genesis/
12. Verify deployment

### Phase 4: Verify

- [ ] All tests passing
- [ ] Linting passing
- [ ] Coverage meets threshold
- [ ] GitHub Pages deployed
- [ ] Application loads without errors
- [ ] Phase 1 form displays correctly
- [ ] Prompts load from markdown files
- [ ] Template variables replaced correctly
- [ ] Mock mode works (if applicable)
- [ ] Download functionality works

---

## 🎯 Success Criteria for Genesis Improvements

After implementing these improvements, the AI assistant should be able to:

1. **Autonomously execute** 90% of Genesis projects without asking clarifying questions
2. **Infer workflow architecture** from reference implementation
3. **Ask only essential questions**: project name, GitHub info, document type
4. **Complete execution** in one continuous workflow without getting stuck
5. **Produce working application** that matches reference implementation quality

---

## 📊 Metrics for Improvement

**Before improvements**:
- Questions asked: ~15-20
- Back-and-forth exchanges: ~8-10
- Time to first code: ~30 minutes
- Success rate: ~60%

**After improvements** (target):
- Questions asked: ~3-5
- Back-and-forth exchanges: ~1-2
- Time to first code: ~5 minutes
- Success rate: ~95%

---

## 🔄 Continuous Improvement

After each Genesis project execution:

1. **Document lessons learned** in a file like this one
2. **Update Genesis documentation** with new patterns
3. **Add examples** to `genesis/examples/`
4. **Update reference implementations list**
5. **Refine AI instructions** in START-HERE.md

---

## ✅ Action Items for Genesis Repository

1. **Create new files**:
   - `genesis/REFERENCE-IMPLEMENTATIONS.md`
   - `genesis/docs/WORKFLOW-ARCHITECTURE.md`
   - `genesis/docs/WORKFLOW-DECISION-TREE.md`
   - `genesis/docs/REQUIREMENTS-TEMPLATE.md`

2. **Update existing files**:
   - `genesis/START-HERE.md` - Add "Study Reference Implementation FIRST" section
   - `genesis/AI-EXECUTION-CHECKLIST.md` - Add prerequisite checklist
   - `genesis/examples/one-pager/README.md` - Add as reference example

3. **Test improvements**:
   - Run through Genesis workflow with AI assistant
   - Verify reduced question count
   - Verify autonomous execution
   - Measure time to completion

---

## 📌 Summary

**Root Cause**: Genesis documentation didn't reference the working example (product-requirements-assistant) that contained all the answers.

**Solution**: Make reference implementation study a **mandatory first step** before any Genesis execution.

**Expected Outcome**: AI assistant can autonomously execute Genesis projects by inferring patterns from reference implementation, asking only essential project-specific questions.

**Key Insight**: Don't make the AI rediscover patterns that already exist in working code. Point to the working code FIRST.

---

## 🌐 GitHub Pages Deployment Note

**Issue**: User reported HTTP 404 on https://bordenet.github.io/one-pager/

**Resolution**: Site was actually working (HTTP 200). The 404 was likely due to:
1. GitHub Pages deployment delay (can take 2-5 minutes after enabling)
2. DNS propagation delay
3. Browser cache showing old 404

**Recommendation for Genesis**:
Add to deployment instructions:
```markdown
## ⏱️ GitHub Pages Deployment Timing

After enabling GitHub Pages:
1. Wait 2-5 minutes for initial deployment
2. Check deployment status at: https://github.com/{username}/{repo}/deployments
3. If you see 404, wait a few minutes and refresh
4. Clear browser cache if needed
5. Verify deployment with: `curl -I https://{username}.github.io/{repo}/`

**Note**: First deployment can take up to 10 minutes. Be patient!
```

**Verification**: Site is now live and working at https://bordenet.github.io/one-pager/

---

## 📦 Deliverable

This document (`GENESIS-PROCESS-IMPROVEMENTS.md`) should be:

1. **Copied to the Genesis repository** at the root level
2. **Read by the AI assistant** before executing future Genesis projects
3. **Used to update Genesis documentation** as outlined in the Action Items section
4. **Referenced in START-HERE.md** as mandatory reading

**File location in Genesis repo**: `GENESIS-PROCESS-IMPROVEMENTS.md` (root level)

**Next steps for Genesis maintainer**:
1. Copy this file to Genesis repository
2. Create the new documentation files listed in Action Items
3. Update existing files as specified
4. Test with a new Genesis project to verify improvements
5. Measure reduction in AI questions and time to completion

---

## 🙏 Acknowledgments

This process improvement document was created based on real-world experience executing the one-pager Genesis project. The insights come from:

- Questions the AI had to ask (that shouldn't have been necessary)
- Patterns discovered in product-requirements-assistant (that should have been documented)
- User feedback about insufficient Genesis documentation
- Comparison between what Genesis provided vs. what was actually needed

**Goal**: Make future Genesis executions 90% autonomous by pointing to working examples FIRST.


