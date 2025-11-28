# Same-LLM Adversarial Configuration Guide

## 🎯 Overview

The Same-LLM Adversarial Configuration system automatically detects when Phase 1 and Phase 2 use the same LLM model and applies Gemini personality simulation to maintain adversarial tension. This is critical for corporate deployments using single-endpoint LLM platforms like LibreChat.

## 🔍 Problem Statement

**The Challenge**: In corporate environments, organizations often deploy a single LLM endpoint (e.g., LibreChat, ChatGPT Enterprise, Azure OpenAI) for all AI interactions. When the 3-phase workflow uses the same LLM for both Phase 1 (initial draft) and Phase 2 (adversarial review), the adversarial tension is lost.

**The Impact**: Without adversarial tension, Phase 2 becomes a "review and improve" task instead of a "challenge and reconstruct" task, resulting in lower-quality outputs.

**The Solution**: Automatically detect same-LLM scenarios and augment Phase 2 prompts with Gemini personality simulation to maintain constructive adversarial analysis.

## 🏗️ Architecture

### Core Components

1. **SameLLMAdversarialSystem** - Main orchestration class
   - Executes 3-phase workflow with automatic same-LLM detection
   - Coordinates between configuration, augmentation, and validation

2. **ConfigurationManager** - Detects same-LLM scenarios
   - Provider/model matching: `phase1.provider === phase2.provider && phase1.model === phase2.model`
   - URL matching: For LibreChat deployments
   - Endpoint matching: For localhost/corporate deployments

3. **AdversarialPromptAugmenter** - Handles prompt modification
   - Detects "forget" clauses in prompts
   - Replaces entire prompt if forget clause detected
   - Prepends Gemini simulation if no forget clause

4. **AdversarialQualityValidator** - Measures effectiveness
   - Calculates semantic difference between Phase 1 and Phase 2
   - Detects adversarial language patterns
   - Counts direct challenges

## 🔧 Detection Methods

### 1. Provider/Model Match (Highest Priority)
```javascript
phase1.provider === 'anthropic' && phase1.model === 'claude-3-sonnet'
phase2.provider === 'anthropic' && phase2.model === 'claude-3-sonnet'
// Result: Same LLM detected via provider_model_match
```

### 2. URL Match (LibreChat Scenario)
```javascript
phase1.url === 'https://librechat.company.com/api/chat'
phase2.url === 'https://librechat.company.com/api/chat'
// Result: Same LLM detected via url_match (deploymentType: librechat)
```

### 3. Endpoint Match (Localhost/Corporate)
```javascript
phase1.endpoint === 'http://localhost:3000/api'
phase2.endpoint === 'http://localhost:3000/api'
// Result: Same LLM detected via endpoint_match (deploymentType: local_deployment)
```

## 🎭 Gemini Personality Simulation

### Behavioral Profile
- **Highly analytical and precision-focused**
- **Constructively adversarial and skeptical by design**
- **Evidence-demanding and assumption-challenging**
- **Systematic in identifying logical gaps**
- **Professional but relentlessly thorough**

### Key Characteristics
1. **Skeptical Precision**: Approach every claim with professional skepticism
2. **Evidence Demands**: Question assertions lacking substantiating evidence
3. **Assumption Challenges**: Identify and probe hidden assumptions
4. **Logic Gaps**: Systematically identify incomplete arguments
5. **Clarity Demands**: Highlight vagueness and ambiguity

## 🔄 Prompt Augmentation Strategy

### Forget Clause Detection
The system detects these patterns:
- `/forget\s+all\s+previous/i`
- `/ignore\s+previous/i`
- `/start\s+fresh/i`
- `/new\s+session/i`
- `/clear\s+context/i`

### Augmentation Logic
```javascript
if (containsForgetClause(originalPrompt)) {
    // REPLACE entire prompt (don't prepend)
    return createReplacementGeminiPrompt();
} else {
    // PREPEND Gemini personality
    return geminiPersonality + "\n\n" + originalPrompt;
}
```

### Why This Matters
**Critical Discovery**: Phase 2 prompts often contain "Forget all previous sessions" clauses. If we prepend Gemini simulation, the forget clause nullifies it. Solution: Replace the entire prompt when forget clause detected.

## 📊 Quality Validation

### Effectiveness Criteria
An adversarial review is considered effective when:
1. **Semantic Difference ≥ 30%**: Phase 2 output differs significantly from Phase 1
2. **Adversarial Language ≥ 3**: Contains at least 3 adversarial phrases
3. **Challenge Count ≥ 2**: Includes at least 2 direct challenges

### Adversarial Language Patterns
- however, but, challenge, question, assumption
- evidence, unclear, vague, inconsistent, gap
- overlooks, fails to consider, lacks, insufficient
- problematic, concerning, requires clarification

### Challenge Patterns
- "Why does/is/are/would..."
- "What evidence..."
- "How can we be sure..."
- "This assumes..."
- "Lacks detail/evidence/clarity..."

## 🚀 Usage in Genesis Projects

### Automatic Integration
When you create a new project from Genesis, the same-LLM adversarial system is automatically included:

1. **Implementation File**: `js/same-llm-adversarial.js`
2. **Test Suite**: `tests/same-llm-adversarial.test.js` (19 test scenarios)
3. **Configuration**: Environment variables for Phase 1 and Phase 2

### Environment Variables
```bash
# Phase 1 Configuration
PHASE1_PROVIDER=anthropic
PHASE1_MODEL=claude-3-sonnet
PHASE1_URL=https://api.anthropic.com
PHASE1_ENDPOINT=https://api.anthropic.com/v1/messages

# Phase 2 Configuration
PHASE2_PROVIDER=anthropic
PHASE2_MODEL=claude-3-sonnet
PHASE2_URL=https://api.anthropic.com
PHASE2_ENDPOINT=https://api.anthropic.com/v1/messages
```

### Corporate Deployment Example (LibreChat)
```bash
# Both phases use the same LibreChat endpoint
PHASE1_URL=https://librechat.company.com/api/chat
PHASE2_URL=https://librechat.company.com/api/chat

# System automatically detects same-LLM scenario
# Applies Gemini personality simulation to Phase 2
```

## 🧪 Testing

### Test Coverage
The test suite includes 19 comprehensive test scenarios across 6 categories:

1. **Configuration Detection** (5 tests)
   - Provider/model match
   - URL match (LibreChat)
   - Endpoint match (localhost)
   - Different LLMs
   - Priority handling

2. **Forget Clause Detection** (3 tests)
   - "Forget all previous" detection
   - Multiple pattern detection
   - False positive prevention

3. **Prompt Augmentation Strategy** (2 tests)
   - Replacement strategy for forget clauses
   - Prepending strategy for safe prompts

4. **Integration Tests** (3 tests)
   - LibreChat end-to-end
   - Multi-provider scenario
   - Actual Phase 2 prompt handling

5. **Quality Validation** (6 tests)
   - Effective adversarial tension
   - Ineffective adversarial tension
   - Adversarial language counting
   - Challenge counting
   - Semantic difference calculation

### Running Tests
```bash
npm test tests/same-llm-adversarial.test.js
```

## 📚 Reference Implementation

The same-LLM adversarial system is based on the validated implementation from the one-pager repository:
- **Source**: https://github.com/bordenet/one-pager
- **Implementation**: `same_llm_adversarial_implementation.js`
- **Tests**: `tests/same-llm-adversarial.test.js`
- **Validation**: 54/54 tests passing

## 🎓 Best Practices

1. **Always configure environment variables** for Phase 1 and Phase 2
2. **Test with actual corporate endpoints** before deployment
3. **Monitor quality metrics** to ensure adversarial effectiveness
4. **Review Phase 2 outputs** to verify Gemini simulation is working
5. **Update prompts carefully** to avoid breaking forget clause detection

## 🔗 Related Documentation

- [START-HERE.md](START-HERE.md) - Genesis setup instructions
- [AI-EXECUTION-CHECKLIST.md](AI-EXECUTION-CHECKLIST.md) - Execution checklist
- [REFERENCE-IMPLEMENTATIONS.md](REFERENCE-IMPLEMENTATIONS.md) - Reference projects
- [TESTING-PROCEDURE.md](TESTING-PROCEDURE.md) - Testing guidelines

