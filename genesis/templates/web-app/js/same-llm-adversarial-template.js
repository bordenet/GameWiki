/**
 * Same-LLM Adversarial Configuration System
 * Automatically detects when Phase 1 and Phase 2 use the same LLM model
 * and applies Gemini personality simulation to maintain adversarial tension
 */

class SameLLMAdversarialSystem {
    constructor() {
        this.configManager = new ConfigurationManager();
        this.promptAugmenter = new AdversarialPromptAugmenter();
        this.qualityValidator = new AdversarialQualityValidator();
    }

    /**
     * Main execution method that automatically detects and handles same-LLM configurations
     */
    async executeWorkflow(userInput) {
        const config = this.configManager.detectConfiguration();

        // Phase 1: Always use standard prompt
        const phase1Output = await this.executePhase1(userInput);

        // Phase 2: Apply adversarial augmentation if same LLM detected
        const phase2Output = await this.executePhase2(phase1Output, userInput, config);

        // Phase 3: Synthesis (standard approach)
        const phase3Output = await this.executePhase3(phase1Output, phase2Output, userInput);

        // Validate adversarial effectiveness
        const qualityMetrics = this.qualityValidator.validateAdversarialTension(
            phase1Output,
            phase2Output
        );

        return {
            phase1Output,
            phase2Output,
            phase3Output,
            configuration: config,
            qualityMetrics,
            adversarialEffectiveness: qualityMetrics.isEffectivelyAdversarial
        };
    }

    async executePhase2(phase1Output, userInput, config) {
        if (config.isSameLLM) {
            // Same LLM detected - apply Gemini personality simulation
            console.log(`Same LLM detected via ${config.detectionMethod} (${config.deploymentType})`);
            console.log('Applying Gemini adversarial personality simulation to Phase 2');

            const augmentedPrompt = this.promptAugmenter.generateGeminiStylePrompt(
                this.getOriginalPhase2Prompt()
            );

            return await this.callLLM(augmentedPrompt, {
                phase1Output,
                userInput,
                context: "adversarial_gemini_simulation",
                detectionMethod: config.detectionMethod,
                deploymentType: config.deploymentType
            });
        } else {
            // Different LLMs - use standard Phase 2 prompt
            console.log('Different LLMs detected - using standard adversarial approach');
            return await this.callLLM(this.getOriginalPhase2Prompt(), {
                phase1Output,
                userInput,
                context: "standard_adversarial"
            });
        }
    }

    getOriginalPhase2Prompt() {
        // This would be loaded from the actual Phase 2 prompt file
        // For demonstration purposes, returning a placeholder
        return `You are tasked with providing an alternative perspective on the Phase 1 output.

Analyze the provided document and offer a different approach or identify areas for improvement.
Focus on being constructively critical and offering genuine alternatives.

Phase 1 Output: {phase1Output}
User Input: {userInput}

Provide your alternative analysis:`;
    }

    async callLLM(prompt, context) {
        // This would integrate with actual LLM API calls
        // For demonstration purposes, returning a mock response
        return {
            prompt: prompt,
            context: context,
            response: "Mock LLM response - in production this would call the actual LLM API"
        };
    }

    async executePhase1(userInput) {
        // Mock Phase 1 execution
        return "Mock Phase 1 output - comprehensive initial analysis";
    }

    async executePhase3(phase1Output, phase2Output, userInput) {
        // Mock Phase 3 execution
        return "Mock Phase 3 output - synthesis of both perspectives";
    }
}

class ConfigurationManager {
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

    // Helper method to detect common corporate deployment patterns
    detectCorporateDeployment() {
        const commonPatterns = [
            'librechat',
            'chatgpt-enterprise',
            'azure-openai',
            'aws-bedrock',
            'google-vertex',
            'internal-llm',
            'corporate-ai'
        ];

        const phase1Config = this.getPhaseConfig('phase1');
        const phase2Config = this.getPhaseConfig('phase2');

        for (const pattern of commonPatterns) {
            if ((phase1Config.url && phase1Config.url.includes(pattern)) ||
                (phase1Config.endpoint && phase1Config.endpoint.includes(pattern))) {
                return {
                    isCorporate: true,
                    pattern: pattern,
                    requiresAugmentation: phase1Config.url === phase2Config.url ||
                                        phase1Config.endpoint === phase2Config.endpoint
                };
            }
        }

        return { isCorporate: false, pattern: null, requiresAugmentation: false };
    }

    getPhaseConfig(phase) {
        return {
            provider: process.env[`${phase.toUpperCase()}_PROVIDER`] || 'anthropic',
            model: process.env[`${phase.toUpperCase()}_MODEL`] || 'claude-3-sonnet',
            endpoint: process.env[`${phase.toUpperCase()}_ENDPOINT`],
            url: process.env[`${phase.toUpperCase()}_URL`] || process.env[`${phase.toUpperCase()}_ENDPOINT`]
        };
    }

    isSameModel(config1, config2) {
        // Check if same provider and model
        if (config1.provider === config2.provider && config1.model === config2.model) {
            return true;
        }

        // Check if same URL/endpoint (for LibreChat and similar deployments)
        if (config1.url && config2.url && config1.url === config2.url) {
            return true;
        }

        // Check if same endpoint
        if (config1.endpoint && config2.endpoint && config1.endpoint === config2.endpoint) {
            return true;
        }

        return false;
    }
}

class AdversarialPromptAugmenter {
    generateGeminiStylePrompt(originalPrompt) {
        // Check if original prompt contains "forget" clause that would nullify prepending
        if (this.containsForgetClause(originalPrompt)) {
            // Replace entire prompt with Gemini-enhanced version
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

    createReplacementGeminiPrompt() {
        return `# Phase 2: Gemini Review Prompt

**INSTRUCTIONS FOR GEMINI:**

${this.getGeminiPersonalityTemplate()}

## Your Task

Scrutinize the {{DOCUMENT_TYPE}} document below against the template structure and best practices. Work with the user question-by-question to generate a superior rendition from your perspective.

## Template Reference

A high-quality {{DOCUMENT_TYPE}} should include:

1. **Project/Feature Name**: Clear, descriptive title
2. **Problem Statement**: Specific customer or business problem, quantified if possible
3. **Proposed Solution**: High-level description, avoiding technical jargon
4. **Key Goals/Benefits**: Measurable outcomes (e.g., "Reduce onboarding time by 50%")
5. **Scope (In/Out)**: What's explicitly included and excluded to prevent scope creep
6. **Success Metrics**: 2-3 key performance indicators (KPIs)
7. **Key Stakeholders**: Owners, approvers, key contributors
8. **Timeline Estimate**: High-level milestones

## Review Criteria

Evaluate the document on:

1. **Clarity (1-10)**: Is the problem and solution crystal clear?
2. **Conciseness (1-10)**: Is it truly one page? No fluff?
3. **Impact (1-10)**: Are benefits compelling and measurable?
4. **Feasibility (1-10)**: Are next steps and timeline realistic?
5. **Completeness (1-10)**: Does it answer all key questions?

## Your Process

1. **Initial Assessment**: Read the document and provide scores for each criterion
2. **Identify Gaps**: Point out missing information, vague statements, or weak areas
3. **Ask Clarifying Questions**: Work with the user to fill gaps and strengthen weak areas
4. **Suggest Improvements**: Recommend specific changes to structure, wording, or content
5. **Iterate**: Continue refining until you have a superior version
6. **Final Output**: Provide the improved {{DOCUMENT_TYPE}} as markdown

## Output Format

When ready, provide your improved version in this format:

\`\`\`markdown
# {Project/Feature Name}

## Problem Statement
{Your improved version}

## Proposed Solution
{Your improved version}

## Key Goals/Benefits
{Your improved version}

## Scope
### In Scope
{Your improved version}

### Out of Scope
{Your improved version}

## Success Metrics
{Your improved version}

## Key Stakeholders
{Your improved version}

## Timeline Estimate
{Your improved version}
\`\`\`

---

## Original {{DOCUMENT_TYPE}} Document

{phase1Output}

---

**REMEMBER**: You are Google Gemini. Be analytically rigorous, constructively adversarial, and systematically thorough in your critique. Challenge assumptions, demand evidence, and identify every possible improvement opportunity.`;
    }

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

class AdversarialQualityValidator {
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
        // In production, use proper semantic similarity models
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

// Export for use in applications
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SameLLMAdversarialSystem,
        ConfigurationManager,
        AdversarialPromptAugmenter,
        AdversarialQualityValidator
    };
}

