# Same-LLM Adversarial Configuration

## Overview

The Same-LLM Adversarial system maintains adversarial tension in multi-phase workflows when corporate deployments use a single LLM provider (e.g., LibreChat, corporate AI endpoints).

## Problem Statement

### Standard Multi-LLM Workflow
- **Phase 1**: Claude (helpful, comprehensive approach)
- **Phase 2**: Gemini (analytical, skeptical approach)
- **Phase 3**: Claude (synthesis of both perspectives)

### Corporate Deployment Challenge
When using LibreChat or single LLM endpoints:
- **Risk**: Phase 2 becomes "review and improve" instead of adversarial alternative
- **Impact**: Loss of adversarial tension that drives quality improvements
- **Result**: Degraded output quality

## Solution

Automatic detection of same-LLM configurations with Gemini personality simulation to maintain adversarial tension.

## Detection Methods

### 1. Provider/Model Match
```javascript
PHASE1_PROVIDER=anthropic
PHASE1_MODEL=claude-3-sonnet
PHASE2_PROVIDER=anthropic
PHASE2_MODEL=claude-3-sonnet
```

### 2. URL Match (LibreChat)
```javascript
PHASE1_URL=https://librechat.company.com/api/chat
PHASE2_URL=https://librechat.company.com/api/chat
```

### 3. Endpoint Match (Local Deployment)
```javascript
PHASE1_ENDPOINT=http://localhost:3000/api
PHASE2_ENDPOINT=http://localhost:3000/api
```

## Prompt Augmentation Strategy

### Critical Discovery: Forget Clause Issue

**Problem**: Phase 2 prompts often contain "forget all previous" clauses that nullify prepended instructions.

**Solution**: Two strategies based on prompt content:

#### Strategy 1: Replacement (for prompts with forget clauses)
```javascript
if (containsForgetClause(originalPrompt)) {
    // Replace entire prompt with Gemini-enhanced version
    return createReplacementGeminiPrompt();
}
```

#### Strategy 2: Prepending (for safe prompts)
```javascript
else {
    // Safe to prepend Gemini personality
    return `${geminiPersonality}\n\n${originalPrompt}\n\n${reminder}`;
}
```

### Forget Clause Patterns Detected
- "forget all previous"
- "ignore previous"
- "start fresh"
- "new session"
- "clear context"

## Gemini Personality Simulation

### Behavioral Profile
- Highly analytical and precision-focused
- Constructively adversarial and skeptical by design
- Evidence-demanding and assumption-challenging
- Systematic in identifying logical gaps and inconsistencies
- Professional but relentlessly thorough in critique

### Key Instructions
1. **Skeptical Precision**: Approach every claim with professional skepticism
2. **Evidence Demands**: Question assertions that lack substantiating evidence
3. **Assumption Challenges**: Identify and probe hidden assumptions
4. **Logic Gaps**: Systematically identify incomplete arguments or reasoning flaws
5. **Clarity Demands**: Highlight vagueness, ambiguity, or potential misinterpretation

## Quality Validation

### Adversarial Effectiveness Metrics

```javascript
const metrics = qualityValidator.validateAdversarialTension(phase1Output, phase2Output);

// Returns:
{
    differenceScore: 0.45,           // 0-1, higher = more different
    adversarialLanguageCount: 7,     // Count of adversarial phrases
    challengeCount: 5,               // Count of direct challenges
    isEffectivelyAdversarial: true   // Overall assessment
}
```

### Effectiveness Criteria
- **Difference Score**: ≥0.3 (at least 30% semantic difference)
- **Adversarial Language**: ≥3 phrases (however, challenge, unclear, etc.)
- **Challenge Count**: ≥2 direct challenges (Why does...? What evidence...?)

## Usage Example

```javascript
import {
    ConfigurationManager,
    AdversarialPromptAugmenter,
    AdversarialQualityValidator
} from './js/same-llm-adversarial.js';

// 1. Detect configuration
const configManager = new ConfigurationManager();
const config = configManager.detectConfiguration();

if (config.isSameLLM) {
    console.log(`Same LLM detected via ${config.detectionMethod}`);
    console.log(`Deployment type: ${config.deploymentType}`);
    
    // 2. Augment Phase 2 prompt
    const augmenter = new AdversarialPromptAugmenter();
    const augmentedPrompt = augmenter.generateGeminiStylePrompt(originalPhase2Prompt);
    
    // 3. Execute Phase 2 with augmented prompt
    const phase2Output = await executeLLM(augmentedPrompt, phase1Output);
    
    // 4. Validate adversarial tension
    const validator = new AdversarialQualityValidator();
    const metrics = validator.validateAdversarialTension(phase1Output, phase2Output);
    
    if (!metrics.isEffectivelyAdversarial) {
        console.warn('Low adversarial tension detected');
    }
}
```

## Deployment Types Detected

| Type | Description | Example |
|------|-------------|---------|
| `librechat` | LibreChat deployment | URL contains "librechat" |
| `local_deployment` | Local LLM server | URL contains "localhost" |
| `corporate_single_endpoint` | Corporate AI gateway | Same URL for both phases |
| `same_provider` | Same provider, different models | anthropic/claude-3-sonnet vs anthropic/claude-3-opus |
| `multi_provider` | Different providers | anthropic vs google |

## Testing

### Test Coverage
- **24 tests** covering all detection methods, augmentation strategies, and quality validation
- **96.36% statement coverage**, **89.83% branch coverage**

### Run Tests
```bash
npm test -- same-llm-adversarial.test.js
```

## Benefits

1. **Corporate Deployment Support**: Works with LibreChat and single-endpoint deployments
2. **Quality Preservation**: Maintains adversarial tension even with same LLM
3. **Automatic Detection**: No manual configuration required
4. **Validated Effectiveness**: Quality metrics ensure adversarial tension is maintained

## References

- Design Spec: Based on one-pager implementation
- Research: Perplexity.ai analysis of LLM behavioral profiles
- Validation: 24 comprehensive tests with 96%+ coverage

