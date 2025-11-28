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

