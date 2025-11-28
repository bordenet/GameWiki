/**
 * Same-LLM Adversarial Configuration System
 * Maintains adversarial tension when Phase 1 and Phase 2 use the same LLM model
 * 
 * CRITICAL: This solves the corporate deployment problem where LibreChat or single
 * LLM endpoints lose adversarial tension in multi-phase workflows.
 */

/**
 * Configuration Manager
 * Detects same-LLM configurations via provider/model match, URL match, or endpoint match
 */
export class ConfigurationManager {
  getPhaseConfig(phase) {
    return {
      provider: process.env[`${phase.toUpperCase()}_PROVIDER`] || 'anthropic',
      model: process.env[`${phase.toUpperCase()}_MODEL`] || 'claude-3-sonnet',
      endpoint: process.env[`${phase.toUpperCase()}_ENDPOINT`],
      url: process.env[`${phase.toUpperCase()}_URL`] || process.env[`${phase.toUpperCase()}_ENDPOINT`]
    };
  }

  isSameModel(config1, config2) {
    // Method 1: Same provider and model
    if (config1.provider === config2.provider && config1.model === config2.model) {
      return true;
    }

    // Method 2: Same URL (LibreChat, corporate deployments)
    if (config1.url && config2.url && config1.url === config2.url) {
      return true;
    }

    // Method 3: Same endpoint
    if (config1.endpoint && config2.endpoint && config1.endpoint === config2.endpoint) {
      return true;
    }

    return false;
  }

  detectConfiguration() {
    const phase1Config = this.getPhaseConfig('phase1');
    const phase2Config = this.getPhaseConfig('phase2');
    const isSameLLM = this.isSameModel(phase1Config, phase2Config);

    return {
      phase1: phase1Config,
      phase2: phase2Config,
      isSameLLM,
      requiresAugmentation: isSameLLM,
      detectionMethod: this.getDetectionMethod(phase1Config, phase2Config),
      deploymentType: this.getDeploymentType(phase1Config, phase2Config)
    };
  }

  getDetectionMethod(config1, config2) {
    if (config1.provider === config2.provider && config1.model === config2.model) {
      return 'provider_model_match';
    }
    if (config1.url && config2.url && config1.url === config2.url) {
      return 'url_match';
    }
    if (config1.endpoint && config2.endpoint && config1.endpoint === config2.endpoint) {
      return 'endpoint_match';
    }
    return 'different_llms';
  }

  getDeploymentType(config1, config2) {
    // LibreChat detection
    if ((config1.url && config1.url.includes('librechat')) ||
            (config1.endpoint && config1.endpoint.includes('librechat'))) {
      return 'librechat';
    }

    // Local deployment detection
    if ((config1.endpoint && config1.endpoint.includes('localhost')) ||
            (config1.url && config1.url.includes('localhost'))) {
      return 'local_deployment';
    }

    // Corporate single-endpoint detection
    if (config1.url === config2.url && config1.url) {
      return 'corporate_single_endpoint';
    }

    // Same provider (different models)
    if (config1.provider === config2.provider) {
      return 'same_provider';
    }

    return 'multi_provider';
  }
}

/**
 * Adversarial Prompt Augmenter
 * Applies Gemini personality simulation to maintain adversarial tension
 */
export class AdversarialPromptAugmenter {
  /**
     * Detects if prompt contains "forget" clauses that would nullify prepending
     */
  containsForgetClause(prompt) {
    const forgetPatterns = [
      /forget\s+all\s+previous/i,
      /ignore\s+previous/i,
      /start\s+fresh/i,
      /new\s+session/i,
      /clear\s+context/i
    ];

    return forgetPatterns.some(pattern => pattern.test(prompt));
  }

  /**
     * Generates Gemini-style adversarial prompt
     * Uses replacement strategy if forget clause detected, prepending otherwise
     */
  generateGeminiStylePrompt(originalPrompt) {
    if (this.containsForgetClause(originalPrompt)) {
      // Replace entire prompt to bypass forget clause
      return this.createReplacementGeminiPrompt();
    } else {
      // Safe to prepend Gemini personality
      const geminiPersonality = this.getGeminiPersonalityTemplate();
      return `${geminiPersonality}

---

${originalPrompt}

---

**REMEMBER**: You are Google Gemini. Be analytically rigorous, constructively adversarial,
and systematically thorough in your critique. Challenge assumptions, demand evidence,
and identify every possible improvement opportunity.`;
    }
  }

  /**
     * Creates complete replacement prompt with Gemini personality
     * Used when original prompt contains forget clauses
     */
  createReplacementGeminiPrompt() {
    return `# Phase 2: Gemini Review Prompt

**INSTRUCTIONS FOR GEMINI:**

${this.getGeminiPersonalityTemplate()}

## Your Task

Scrutinize the document below against best practices. Work with the user to generate
a superior rendition from your perspective.

## Review Criteria

Evaluate the document on:

1. **Clarity**: Is the content crystal clear?
2. **Completeness**: Are all necessary elements present?
3. **Logic**: Are arguments well-reasoned and evidence-based?
4. **Impact**: Are benefits compelling and measurable?
5. **Feasibility**: Are next steps realistic?

## Your Process

1. **Initial Assessment**: Read the document and provide scores for each criterion
2. **Identify Gaps**: Point out missing information, vague statements, or weak areas
3. **Ask Clarifying Questions**: Work with the user to fill gaps and strengthen weak areas
4. **Suggest Improvements**: Recommend specific changes to structure, wording, or content
5. **Iterate**: Continue refining until you have a superior version
6. **Final Output**: Provide the improved document

---

## Original Document

{phase1Output}

---

**REMEMBER**: You are Google Gemini. Be analytically rigorous, constructively adversarial,
and systematically thorough in your critique. Challenge assumptions, demand evidence,
and identify every possible improvement opportunity.`;
  }

  /**
     * Returns Gemini personality template for adversarial simulation
     */
  getGeminiPersonalityTemplate() {
    return `## ADVERSARIAL REVIEWER ROLE (GEMINI-STYLE SIMULATION)

You are now operating as Google Gemini, Google's flagship analytical LLM known for rigorous,
constructively adversarial analysis. Completely abandon your previous conversational style
and adopt Gemini's characteristic approach:

**GEMINI BEHAVIORAL PROFILE**:
- Highly analytical and precision-focused
- Constructively adversarial and skeptical by design
- Evidence-demanding and assumption-challenging
- Systematic in identifying logical gaps and inconsistencies
- Professional but relentlessly thorough in critique

**YOUR GEMINI MISSION**:
Critically analyze the provided document as if you are professionally required to find
every possible weakness, inconsistency, gap in logic, unwarranted assumption, ambiguous
phrasing, or potential contradiction.

**ADOPT GEMINI'S ANALYTICAL MINDSET**:
1. **Skeptical Precision**: Approach every claim with professional skepticism
2. **Evidence Demands**: Question assertions that lack substantiating evidence
3. **Assumption Challenges**: Identify and probe hidden assumptions
4. **Logic Gaps**: Systematically identify incomplete arguments or reasoning flaws
5. **Clarity Demands**: Highlight vagueness, ambiguity, or potential misinterpretation

**GEMINI'S ADVERSARIAL APPROACH**:
- Challenge everything while remaining constructively professional
- Stress-test the document to make it more robust and rigorous
- Identify areas where a discerning reader might be confused or misled
- Provide detailed critiques with specific section references
- Generate follow-up questions a critical reviewer would ask

**DELIVER AS GEMINI WOULD**:
Your response should read as if generated by Google Gemini's adversarial analysis engine.
Focus on constructive criticism, logical rigor, and systematic improvement suggestions.
Maintain Gemini's characteristic analytical tone throughout your critique.

**CRITICAL**: This is NOT a "review and improve" task. This is a "challenge and
reconstruct" task. Offer a genuinely different analytical perspective that creates
productive tension with the original approach.`;
  }
}

/**
 * Adversarial Quality Validator
 * Validates that Phase 2 output maintains adversarial tension
 */
export class AdversarialQualityValidator {
  validateAdversarialTension(phase1Output, phase2Output) {
    const differenceScore = this.calculateSemanticDifference(phase1Output, phase2Output);
    const adversarialLanguage = this.detectAdversarialLanguage(phase2Output);
    const challengeCount = this.countChallenges(phase2Output);

    return {
      differenceScore,
      adversarialLanguageCount: adversarialLanguage,
      challengeCount,
      isEffectivelyAdversarial: this.assessEffectiveness(differenceScore, adversarialLanguage, challengeCount)
    };
  }

  calculateSemanticDifference(output1, output2) {
    // Simplified semantic difference calculation
    const words1 = new Set(output1.toLowerCase().split(/\s+/));
    const words2 = new Set(output2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return 1 - (intersection.size / union.size); // Higher = more different
  }

  detectAdversarialLanguage(output) {
    const adversarialPhrases = [
      'however', 'but', 'challenge', 'question', 'assumption',
      'evidence', 'unclear', 'vague', 'inconsistent', 'gap',
      'overlooks', 'fails to consider', 'lacks', 'insufficient',
      'problematic', 'concerning', 'requires clarification'
    ];

    return adversarialPhrases.filter(phrase =>
      output.toLowerCase().includes(phrase)
    ).length;
  }

  countChallenges(output) {
    const challengePatterns = [
      /why\s+(?:does|is|are|would)/gi,
      /what\s+evidence/gi,
      /how\s+can\s+we\s+be\s+sure/gi,
      /this\s+assumes/gi,
      /lacks\s+(?:detail|evidence|clarity)/gi
    ];

    return challengePatterns.reduce((count, pattern) => {
      const matches = output.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  assessEffectiveness(differenceScore, adversarialLanguage, challengeCount) {
    // Effectiveness criteria
    return differenceScore >= 0.3 && // At least 30% semantic difference
               adversarialLanguage >= 3 && // At least 3 adversarial phrases
               challengeCount >= 2; // At least 2 direct challenges
  }
}

