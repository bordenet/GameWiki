// ai-mock.js - Mock AI responses for testing

// Mock responses for each phase
const mockResponses = {
  1: `# Phase 1 Analysis

Thank you for providing the input. Here's my detailed analysis:

## Key Points
1. The input demonstrates clear understanding of the requirements
2. The approach is well-structured and logical
3. There are opportunities for enhancement

## Recommendations
- Consider adding more specific examples
- Expand on the implementation details
- Include edge cases and error handling

## Next Steps
Proceed to Phase 2 for the final output.`,

  2: `# Phase 2 Final Output

Based on the Phase 1 analysis, here is the final output:

## Summary
The project successfully addresses the core requirements with a clear, actionable approach.

## Deliverables
1. **Primary Output**: A well-structured solution that meets all specified criteria
2. **Documentation**: Clear explanation of the approach and rationale
3. **Next Steps**: Recommendations for implementation and future enhancements

## Conclusion
This solution provides a solid foundation for moving forward with confidence.`
};

let mockModeEnabled = false;

/**
 * Initialize mock mode from localStorage
 */
export function initMockMode() {
  const saved = localStorage.getItem('aiMockMode');
  mockModeEnabled = saved === 'true';
  
  // Show toggle only on localhost
  if (isLocalhost()) {
    const toggle = document.getElementById('aiMockToggle');
    if (toggle) {
      toggle.classList.remove('hidden');
      const checkbox = document.getElementById('mockModeCheckbox');
      if (checkbox) {
        checkbox.checked = mockModeEnabled;
      }
    }
  }
  
  return mockModeEnabled;
}

/**
 * Check if running on localhost
 */
function isLocalhost() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
}

/**
 * Set mock mode
 */
export function setMockMode(enabled) {
  mockModeEnabled = enabled;
  localStorage.setItem('aiMockMode', enabled.toString());
  
  // Update checkbox
  const checkbox = document.getElementById('mockModeCheckbox');
  if (checkbox) {
    checkbox.checked = enabled;
  }
  
  return mockModeEnabled;
}

/**
 * Check if mock mode is enabled
 */
export function isMockMode() {
  return mockModeEnabled;
}

/**
 * Get mock response for phase
 */
export async function getMockResponse(phaseNumber) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockResponses[phaseNumber] || 'Mock response not available for this phase.';
}

/**
 * Add custom mock response
 */
export function addMockResponse(phaseNumber, response) {
  mockResponses[phaseNumber] = response;
}

