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

