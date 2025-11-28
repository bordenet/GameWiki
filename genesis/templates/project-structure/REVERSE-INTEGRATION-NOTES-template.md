# Reverse-Integration Notes for {{PROJECT_NAME}}

**Purpose**: Track improvements that should be reverse-integrated back to Genesis

**Instructions for AI Assistants**:
- When you reference product-requirements-assistant or one-pager to solve a problem, **CREATE A NOTE HERE**
- When you discover a pattern missing from Genesis, **CREATE A NOTE HERE**
- When you fix a bug that Genesis should prevent, **CREATE A NOTE HERE**
- Share this file with Genesis maintainer after project completion

---

## Template for New Notes

```markdown
## REVERSE-INTEGRATION NOTE #[NUMBER]

**Date**: YYYY-MM-DD
**Created By**: [AI Assistant / Human Developer]
**Issue**: [What problem did you encounter?]
**Solution**: [How did you solve it by referencing the implementations?]
**Reference**: [Link to specific file/line in product-requirements-assistant or one-pager]
**Genesis Gap**: [What's missing from Genesis that caused this?]
**Recommendation**: [What should be added/updated in Genesis?]
**Files to Update**: [List Genesis files that need changes]
**Priority**: [CRITICAL / HIGH / MEDIUM / LOW]
**Estimated Effort**: [Small / Medium / Large]
```

---

## Example Note (DELETE THIS AFTER READING)

```markdown
## REVERSE-INTEGRATION NOTE #1

**Date**: 2025-11-21
**Created By**: AI Assistant (Claude)
**Issue**: Dark mode toggle didn't work after initial Genesis setup
**Solution**: Referenced product-requirements-assistant/docs/index.html lines 9-15 to add Tailwind config
**Reference**: https://github.com/bordenet/product-requirements-assistant/blob/main/docs/index.html#L9-L15
**Genesis Gap**: Genesis templates were missing the critical Tailwind `darkMode: 'class'` configuration
**Recommendation**: Add Tailwind config to all HTML templates in genesis/templates/web-app/
**Files to Update**: 
  - genesis/templates/web-app/index-template.html
  - genesis/examples/hello-world/index.html
  - genesis/docs/WORKFLOW-ARCHITECTURE.md (add dark mode section)
**Priority**: CRITICAL
**Estimated Effort**: Small (already fixed in commit 814bfef)
```

---

## Notes for {{PROJECT_NAME}}

<!-- Add your notes below this line -->


