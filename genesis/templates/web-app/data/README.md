# Data Templates

## Purpose

This directory contains data templates including prompt templates and configuration data.

## Contents

**`prompts-template.js`** - Prompt templates for each workflow phase

## Prompt Templates

The prompts file exports prompt templates for each phase:

```javascript
export const prompts = {
  phase1: {
    name: '{{PHASE_1_NAME}}',
    template: `Your prompt template here with {{VARIABLES}}`
  },
  phase2: {
    name: '{{PHASE_2_NAME}}',
    template: `Your prompt template here with {{VARIABLES}}`
  }
};
```

## Variable Substitution

Prompts support variable substitution:

- `{{PROJECT_NAME}}` - Project name
- `{{USER_INPUT}}` - User input from form
- `{{PREVIOUS_PHASE_OUTPUT}}` - Output from previous phase
- Custom variables as needed

## Usage

Import and use prompts:

```javascript
import { prompts } from './data/prompts.js';

const prompt = prompts.phase1.template
  .replace('{{PROJECT_NAME}}', projectName)
  .replace('{{USER_INPUT}}', userInput);
```

## Best Practices

### Do's ✅
- Keep prompts clear and specific
- Include examples in prompts
- Use consistent variable naming
- Test prompts with actual AI models
- Version prompts when changing

### Don'ts ❌
- Don't hardcode project-specific data
- Don't make prompts too long
- Don't forget to escape special characters
- Don't include sensitive data

## Related Documentation

- **Web App Templates**: `../../README.md`
- **AI Instructions**: `../../../../01-AI-INSTRUCTIONS.md`

