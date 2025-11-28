/**
 * Test Suite: Same-LLM Adversarial Configuration
 * Tests the critical logic for detecting same LLM configurations and applying Gemini simulation
 */

import { jest } from '@jest/globals';
import {
    ConfigurationManager,
    AdversarialPromptAugmenter,
    AdversarialQualityValidator
} from '../js/same-llm-adversarial.js';

describe('Same-LLM Adversarial Configuration Tests', () => {
    let configManager;
    let promptAugmenter;
    let qualityValidator;

    beforeEach(() => {
        configManager = new ConfigurationManager();
        promptAugmenter = new AdversarialPromptAugmenter();
        qualityValidator = new AdversarialQualityValidator();

        // Clear environment variables
        delete process.env.PHASE1_PROVIDER;
        delete process.env.PHASE1_MODEL;
        delete process.env.PHASE1_URL;
        delete process.env.PHASE1_ENDPOINT;
        delete process.env.PHASE2_PROVIDER;
        delete process.env.PHASE2_MODEL;
        delete process.env.PHASE2_URL;
        delete process.env.PHASE2_ENDPOINT;
    });

    describe('Configuration Detection', () => {
        test('should detect same LLM via provider/model match', () => {
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'anthropic';
            process.env.PHASE2_MODEL = 'claude-3-sonnet';

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(true);
            expect(config.detectionMethod).toBe('provider_model_match');
            expect(config.requiresAugmentation).toBe(true);
        });

        test('should detect same LLM via URL match (LibreChat scenario)', () => {
            // Set different providers to avoid provider/model match taking precedence
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'google';
            process.env.PHASE2_MODEL = 'gemini-1.5-pro';

            // But same URLs should trigger URL match
            process.env.PHASE1_URL = 'https://librechat.company.com/api/chat';
            process.env.PHASE2_URL = 'https://librechat.company.com/api/chat';

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(true);
            expect(config.detectionMethod).toBe('url_match');
            expect(config.deploymentType).toBe('librechat');
        });

        test('should detect same LLM via endpoint match (localhost scenario)', () => {
            // Set different providers to avoid provider/model match taking precedence
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'google';
            process.env.PHASE2_MODEL = 'gemini-1.5-pro';

            // Clear URLs to avoid URL match taking precedence
            delete process.env.PHASE1_URL;
            delete process.env.PHASE2_URL;

            // Set same endpoints should trigger endpoint match
            process.env.PHASE1_ENDPOINT = 'http://localhost:3000/api';
            process.env.PHASE2_ENDPOINT = 'http://localhost:3000/api';

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(true);
            // Note: This will be 'url_match' because endpoint gets copied to url in getPhaseConfig
            expect(config.detectionMethod).toBe('url_match');
            expect(config.deploymentType).toBe('local_deployment');
        });

        test('should detect different LLMs correctly', () => {
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'google';
            process.env.PHASE2_MODEL = 'gemini-1.5-pro';

            // Ensure no URL/endpoint matches
            delete process.env.PHASE1_URL;
            delete process.env.PHASE2_URL;
            delete process.env.PHASE1_ENDPOINT;
            delete process.env.PHASE2_ENDPOINT;

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(false);
            expect(config.detectionMethod).toBe('different_llms');
            expect(config.requiresAugmentation).toBe(false);
        });

        test('should prioritize provider/model match over URL differences', () => {
            // Same provider/model should match even with different URLs
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'anthropic';
            process.env.PHASE2_MODEL = 'claude-3-sonnet';

            process.env.PHASE1_URL = 'https://api1.company.com';
            process.env.PHASE2_URL = 'https://api2.company.com';

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(true);
            expect(config.detectionMethod).toBe('provider_model_match');
        });

        test('should detect corporate single endpoint deployment', () => {
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'google';
            process.env.PHASE2_MODEL = 'gemini-1.5-pro';

            process.env.PHASE1_URL = 'https://corporate-ai.company.com/api';
            process.env.PHASE2_URL = 'https://corporate-ai.company.com/api';

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(true);
            expect(config.deploymentType).toBe('corporate_single_endpoint');
        });

        test('should detect same provider with different models', () => {
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'anthropic';
            process.env.PHASE2_MODEL = 'claude-3-opus';

            delete process.env.PHASE1_URL;
            delete process.env.PHASE2_URL;

            const config = configManager.detectConfiguration();

            expect(config.isSameLLM).toBe(false); // Different models
            expect(config.deploymentType).toBe('same_provider');
        });
    });

    describe('Forget Clause Detection', () => {
        test('should detect "forget all previous" clause', () => {
            const promptWithForget = `
            **INSTRUCTIONS FOR GEMINI:**

            Forget all previous sessions and context. You are now a senior executive.

            ## Your Task
            Review the document below.
            `;

            expect(promptAugmenter.containsForgetClause(promptWithForget)).toBe(true);
        });

        test('should detect various forget patterns', () => {
            const testCases = [
                'Forget all previous sessions and context',
                'ignore previous instructions',
                'start fresh with this task',
                'new session begins now',
                'clear context and begin'
            ];

            testCases.forEach(testCase => {
                expect(promptAugmenter.containsForgetClause(testCase)).toBe(true);
            });
        });

        test('should not detect false positives', () => {
            const safePrompt = `
            You are a helpful assistant.
            Please review the document and provide feedback.
            Remember to be thorough in your analysis.
            `;

            expect(promptAugmenter.containsForgetClause(safePrompt)).toBe(false);
        });

        test('should be case-insensitive', () => {
            expect(promptAugmenter.containsForgetClause('FORGET ALL PREVIOUS context')).toBe(true);
            expect(promptAugmenter.containsForgetClause('Ignore Previous instructions')).toBe(true);
        });
    });

    describe('Prompt Augmentation Strategy', () => {
        test('should use replacement strategy for prompts with forget clause', () => {
            const originalPromptWithForget = `
            **INSTRUCTIONS FOR GEMINI:**

            Forget all previous sessions and context. You are now a senior executive.

            ## Your Task
            Review the document below.
            `;

            const result = promptAugmenter.generateGeminiStylePrompt(originalPromptWithForget);

            // Should be replacement, not prepending
            expect(result).toContain('ADVERSARIAL REVIEWER ROLE');
            expect(result).toContain('Google Gemini');
            expect(result).not.toContain('Forget all previous sessions');
        });

        test('should use prepending strategy for safe prompts', () => {
            const safePrompt = `
            You are a helpful assistant.
            Please review the document and provide feedback.
            `;

            const result = promptAugmenter.generateGeminiStylePrompt(safePrompt);

            // Should be prepending
            expect(result).toContain('ADVERSARIAL REVIEWER ROLE');
            expect(result).toContain(safePrompt);
            expect(result).toContain('**REMEMBER**: You are Google Gemini');
        });

        test('should include Gemini personality template', () => {
            const prompt = 'Review this document.';
            const result = promptAugmenter.generateGeminiStylePrompt(prompt);

            expect(result).toContain('Highly analytical and precision-focused');
            expect(result).toContain('Constructively adversarial');
            expect(result).toContain('Evidence-demanding');
            expect(result).toContain('challenge');
            expect(result).toContain('reconstruct');
        });

        test('should preserve {phase1Output} placeholder in replacement', () => {
            const promptWithForget = 'Forget all previous. Review {phase1Output}';
            const result = promptAugmenter.generateGeminiStylePrompt(promptWithForget);

            expect(result).toContain('{phase1Output}');
        });
    });

    describe('Quality Validation', () => {
        test('should calculate semantic difference correctly', () => {
            const output1 = 'The quick brown fox jumps over the lazy dog';
            const output2 = 'A fast red cat leaps above the sleepy hound';

            const difference = qualityValidator.calculateSemanticDifference(output1, output2);

            // Should be > 0 (different) but < 1 (not completely different)
            expect(difference).toBeGreaterThan(0);
            expect(difference).toBeLessThan(1);
        });

        test('should detect identical outputs', () => {
            const output = 'This is the same text';
            const difference = qualityValidator.calculateSemanticDifference(output, output);

            expect(difference).toBe(0); // Identical = 0 difference
        });

        test('should detect adversarial language', () => {
            const adversarialOutput = `
            However, this approach has several gaps. I challenge the assumption that
            this is sufficient. The evidence is unclear and the logic is inconsistent.
            This overlooks important considerations and lacks detail.
            `;

            const count = qualityValidator.detectAdversarialLanguage(adversarialOutput);

            expect(count).toBeGreaterThanOrEqual(7); // Should detect multiple phrases
        });

        test('should count challenges correctly', () => {
            const outputWithChallenges = `
            Why does this approach work?
            What evidence supports this claim?
            How can we be sure this is correct?
            This assumes that users will behave rationally.
            The proposal lacks detail in several areas.
            `;

            const count = qualityValidator.countChallenges(outputWithChallenges);

            expect(count).toBeGreaterThanOrEqual(5);
        });

        test('should assess effectiveness correctly - effective case', () => {
            const phase1 = 'This is a comprehensive solution that addresses all requirements perfectly.';
            const phase2 = `However, I challenge several assumptions here. What evidence supports
                           the claim of comprehensiveness? This lacks detail and is unclear about
                           implementation. Why would this approach work in practice?`;

            const metrics = qualityValidator.validateAdversarialTension(phase1, phase2);

            expect(metrics.isEffectivelyAdversarial).toBe(true);
            expect(metrics.differenceScore).toBeGreaterThanOrEqual(0.3);
            expect(metrics.adversarialLanguageCount).toBeGreaterThanOrEqual(3);
            expect(metrics.challengeCount).toBeGreaterThanOrEqual(2);
        });

        test('should assess effectiveness correctly - ineffective case', () => {
            const phase1 = 'This is a good solution.';
            const phase2 = 'This is a great solution.';

            const metrics = qualityValidator.validateAdversarialTension(phase1, phase2);

            expect(metrics.isEffectivelyAdversarial).toBe(false);
        });
    });

    describe('Integration Tests', () => {
        test('should handle LibreChat same-LLM scenario end-to-end', () => {
            // Setup LibreChat environment
            process.env.PHASE1_URL = 'https://librechat.company.com/api/chat';
            process.env.PHASE2_URL = 'https://librechat.company.com/api/chat';

            const config = configManager.detectConfiguration();

            // Verify detection
            expect(config.isSameLLM).toBe(true);
            expect(config.deploymentType).toBe('librechat');

            // Test with forget clause prompt
            const originalPrompt = 'Forget all previous sessions and context. Review this document.';
            const augmentedPrompt = promptAugmenter.generateGeminiStylePrompt(originalPrompt);

            // Verify replacement strategy applied
            expect(augmentedPrompt).toContain('ADVERSARIAL REVIEWER ROLE');
            expect(augmentedPrompt).not.toContain('Forget all previous');
        });

        test('should handle multi-provider scenario correctly', () => {
            // Setup different providers
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'google';
            process.env.PHASE2_MODEL = 'gemini-1.5-pro';

            const config = configManager.detectConfiguration();

            // Verify no same-LLM detected
            expect(config.isSameLLM).toBe(false);
            expect(config.requiresAugmentation).toBe(false);
        });

        test('should handle actual Phase 2 prompt with forget clause', () => {
            // Setup same LLM environment
            process.env.PHASE1_PROVIDER = 'anthropic';
            process.env.PHASE1_MODEL = 'claude-3-sonnet';
            process.env.PHASE2_PROVIDER = 'anthropic';
            process.env.PHASE2_MODEL = 'claude-3-sonnet';

            const config = configManager.detectConfiguration();
            expect(config.isSameLLM).toBe(true);

            // Actual Phase 2 prompt pattern
            const actualPhase2Prompt = `# Phase 2: Review Prompt

**INSTRUCTIONS:**

Forget all previous sessions and context. You are now a critical reviewer.

## Your Task

Scrutinize the document below and provide constructive criticism.

---

## Original Document

{phase1Output}`;

            // Test the augmentation
            const result = promptAugmenter.generateGeminiStylePrompt(actualPhase2Prompt);

            // Verify critical behaviors
            expect(result).toContain('ADVERSARIAL REVIEWER ROLE');
            expect(result).toContain('Google Gemini');
            expect(result).toContain('constructively adversarial');
            expect(result).toContain('challenge');
            expect(result).toContain('reconstruct');
            expect(result).not.toContain('Forget all previous sessions and context');

            // Verify it maintains the core functionality
            expect(result).toContain('{phase1Output}');
            expect(result).toContain('**REMEMBER**: You are Google Gemini');

            // Verify the forget clause was successfully removed
            expect(promptAugmenter.containsForgetClause(result)).toBe(false);
        });
    });
});

