# Genesis Prompt Templates

This directory contains prompt templates for the 3-phase AI-assisted workflow.

## Files

- **phase1-template.md** - Initial draft generation prompt
- **phase2-template.md** - Review and refinement prompt  
- **phase3-template.md** - Final synthesis prompt

## How to Use

### 1. Copy Templates to Your Project

```bash
mkdir -p prompts
cp genesis/templates/prompts/phase1-template.md prompts/phase1.md
cp genesis/templates/prompts/phase2-template.md prompts/phase2.md
cp genesis/templates/prompts/phase3-template.md prompts/phase3.md
```

### 2. Customize for Your Document Type

Each template has customization instructions at the top. Replace:

- `{{DOCUMENT_TYPE}}` - Your document type (e.g., "PRD", "One-Pager", "Design Doc")
- `{{PHASE_1_AI}}` - AI for phase 1 (e.g., "Claude Sonnet 4.5")
- `{{PHASE_2_AI}}` - AI for phase 2 (e.g., "Gemini 2.5 Pro")
- `{{PHASE_3_AI}}` - AI for phase 3 (e.g., "Claude Sonnet 4.5")
- `{{PROJECT_TITLE}}` - Your project title
- `{{GITHUB_PAGES_URL}}` - Your GitHub Pages URL

### 3. Customize Form Fields

Update the template variables in phase1-template.md to match your form fields:

```markdown
**Document Title:** {title}
**Problems to Address:** {problems}
**Additional Context:** {context}
```

Change these to match your actual form field IDs.

### 4. Customize Document Structure

Update the document structure in phase1-template.md to match your needs. The default structure is for PRDs, but you can customize it for any document type.

## Reference Implementations

Study these working examples:

- **product-requirements-assistant** (PRIMARY): https://github.com/bordenet/product-requirements-assistant/tree/main/prompts
- **one-pager** (SECONDARY): https://github.com/bordenet/one-pager

## Why 3 Phases?

**Phase 1: Initial Draft (Mock Mode)**
- User fills out form with structured inputs
- AI generates initial draft based on inputs
- Fast iteration with structured data
- Runs 100% client-side

**Phase 2: Review & Critique (Manual Mode)**
- User copies Phase 1 output
- User pastes into external AI (different perspective)
- AI provides critique and improvements
- User copies improved version back

**Phase 3: Final Synthesis (Mock Mode)**
- Takes Phase 1 draft + Phase 2 critique
- AI synthesizes final polished document
- Best of both worlds
- Runs 100% client-side

## Tips

1. **Use Different AIs**: Phase 1 and 3 use same AI, Phase 2 uses different AI for fresh perspective
2. **Keep Prompts in Sync**: If you change document structure, update all 3 phase prompts
3. **Test Thoroughly**: Generate a few documents to verify prompts work as expected
4. **Iterate**: Refine prompts based on actual usage and feedback

## Need Help?

See the reference implementations for working examples of how to structure prompts for different document types.

