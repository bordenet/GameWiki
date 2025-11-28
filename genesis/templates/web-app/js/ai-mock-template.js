/**
 * AI Mock Mode for Testing
 * 
 * ⚠️ FOR TESTING ONLY ⚠️
 * 
 * This module provides mock AI responses for testing the application
 * without making actual API calls to OpenAI, Anthropic, or Google.
 * 
 * DO NOT USE IN PRODUCTION.
 * 
 * Purpose:
 * - Enable end-to-end testing without API costs
 * - Provide consistent, predictable responses for testing
 * - Allow testing of error conditions
 * - Enable offline development and testing
 * 
 * Usage:
 * - Set MOCK_MODE = true in app configuration
 * - Mock responses will be returned instead of real API calls
 * - Toggle via UI (development only)
 */

// Mock mode state
let mockModeEnabled = false;

// Mock response templates for each phase
const mockResponses = {
  phase1: {
    success: `# {{PHASE_1_NAME}} - Mock Response

This is a mock response for testing purposes.

## Key Points

1. **First Point**: This demonstrates the structure of a typical AI response
2. **Second Point**: Mock responses help test the application flow
3. **Third Point**: No actual API calls are made in mock mode

## Details

The mock response includes realistic formatting and structure that matches
what you would expect from {{PHASE_1_AI}}.

## Next Steps

Proceed to Phase 2 to continue testing the workflow.

---
*This is a mock response generated for testing. Enable live mode to use real AI.*`,
    
    error: 'Mock error: API rate limit exceeded (simulated for testing)'
  },
  
  phase2: {
    success: `# {{PHASE_2_NAME}} - Mock Response

Building on the Phase 1 output, here's the mock response for Phase 2.

## Analysis

The previous phase provided a foundation. This phase expands on that work.

## Recommendations

1. **Recommendation 1**: Based on the Phase 1 output
2. **Recommendation 2**: Additional considerations
3. **Recommendation 3**: Final thoughts

## Conclusion

This mock response demonstrates the multi-phase workflow.

---
*This is a mock response generated for testing. Enable live mode to use real AI.*`,
    
    error: 'Mock error: Invalid API key (simulated for testing)'
  },
  
  phase3: {
    success: `# {{PHASE_3_NAME}} - Mock Response

Final phase mock response incorporating all previous phases.

## Summary

This represents the culmination of the multi-phase workflow.

## Final Output

The complete result based on all previous phases.

## Quality Check

✅ All phases completed
✅ Consistent formatting
✅ Comprehensive coverage

---
*This is a mock response generated for testing. Enable live mode to use real AI.*`,
    
    error: 'Mock error: Service temporarily unavailable (simulated for testing)'
  }
};

/**
 * Enable or disable mock mode
 * @param {boolean} enabled - Whether to enable mock mode
 */
export function setMockMode(enabled) {
  mockModeEnabled = enabled;
  console.log(`[AI Mock] Mock mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  
  // Store preference
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('aiMockMode', enabled ? 'true' : 'false');
  }
}

/**
 * Check if mock mode is enabled
 * @returns {boolean} True if mock mode is enabled
 */
export function isMockMode() {
  return mockModeEnabled;
}

/**
 * Initialize mock mode from stored preference
 */
export function initMockMode() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('aiMockMode');
    if (stored === 'true') {
      setMockMode(true);
    }
  }
}

/**
 * Get mock response for a phase
 * @param {number} phaseNumber - Phase number (1, 2, 3, etc.)
 * @param {object} options - Options for mock response
 * @param {boolean} options.simulateError - Simulate an error response
 * @param {number} options.delay - Delay in milliseconds (default: 1000)
 * @returns {Promise<string>} Mock AI response
 */
export async function getMockResponse(phaseNumber, options = {}) {
  const { simulateError = false, delay = 1000 } = options;
  
  console.log(`[AI Mock] Generating mock response for phase ${phaseNumber}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Get phase key
  const phaseKey = `phase${phaseNumber}`;
  const phaseResponses = mockResponses[phaseKey];
  
  if (!phaseResponses) {
    throw new Error(`No mock responses defined for phase ${phaseNumber}`);
  }
  
  // Return error or success response
  if (simulateError) {
    throw new Error(phaseResponses.error);
  }
  
  return phaseResponses.success;
}

/**
 * Mock API call (replaces real API calls when mock mode is enabled)
 * @param {string} prompt - The prompt to send
 * @param {number} phaseNumber - Current phase number
 * @param {object} options - API options
 * @returns {Promise<string>} AI response (mock or real)
 */
export async function callAI(prompt, phaseNumber, options = {}) {
  if (mockModeEnabled) {
    console.log('[AI Mock] Using mock response (mock mode enabled)');
    return getMockResponse(phaseNumber, options);
  }
  
  // In real mode, this would call the actual API
  // For now, throw error to indicate real API not implemented
  throw new Error('Real AI API not implemented. Enable mock mode for testing.');
}

/**
 * Add custom mock response for a phase
 * @param {number} phaseNumber - Phase number
 * @param {string} response - Custom mock response
 */
export function addMockResponse(phaseNumber, response) {
  const phaseKey = `phase${phaseNumber}`;
  if (!mockResponses[phaseKey]) {
    mockResponses[phaseKey] = {};
  }
  mockResponses[phaseKey].custom = response;
  console.log(`[AI Mock] Added custom mock response for phase ${phaseNumber}`);
}

// Export mock responses for testing
export { mockResponses };

