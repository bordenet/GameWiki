/**
 * AI Mock Mode UI Component
 * 
 * Provides UI controls for toggling AI mock mode on/off.
 * Only visible in development/testing environments.
 */

import { setMockMode, isMockMode, initMockMode } from './ai-mock.js';

/**
 * Initialize mock mode UI
 * Shows toggle control in development mode
 */
export function initMockModeUI() {
  // Initialize mock mode from storage
  initMockMode();
  
  // Only show UI in development (not on GitHub Pages)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log('[AI Mock UI] Production environment detected, hiding mock mode toggle');
    return;
  }
  
  // Create mock mode toggle
  createMockModeToggle();
  
  // Update UI to reflect current state
  updateMockModeUI();
}

/**
 * Create mock mode toggle UI element
 */
function createMockModeToggle() {
  // Check if already exists
  if (document.getElementById('mock-mode-toggle')) {
    return;
  }
  
  // Create container
  const container = document.createElement('div');
  container.id = 'mock-mode-toggle';
  container.className = 'fixed bottom-4 right-4 z-50 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 rounded-lg p-3 shadow-lg';
  
  // Create label
  const label = document.createElement('label');
  label.className = 'flex items-center gap-2 cursor-pointer';
  
  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'mock-mode-checkbox';
  checkbox.checked = isMockMode();
  checkbox.className = 'w-4 h-4 cursor-pointer';
  checkbox.addEventListener('change', handleMockModeToggle);
  
  // Create label text
  const labelText = document.createElement('span');
  labelText.className = 'text-sm font-medium text-yellow-900 dark:text-yellow-100';
  labelText.textContent = '⚠️ AI Mock Mode';
  
  // Create info icon
  const infoIcon = document.createElement('button');
  infoIcon.type = 'button';
  infoIcon.className = 'text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100';
  infoIcon.innerHTML = '&#9432;'; // Info icon
  infoIcon.title = 'Click for information about mock mode';
  infoIcon.addEventListener('click', showMockModeInfo);
  
  // Assemble
  label.appendChild(checkbox);
  label.appendChild(labelText);
  label.appendChild(infoIcon);
  container.appendChild(label);
  
  // Add to page
  document.body.appendChild(container);
}

/**
 * Handle mock mode toggle
 * @param {Event} event - Change event
 */
function handleMockModeToggle(event) {
  const enabled = event.target.checked;
  setMockMode(enabled);
  updateMockModeUI();
  
  // Show notification
  showNotification(
    enabled 
      ? '⚠️ Mock mode enabled - Using simulated AI responses' 
      : '✅ Mock mode disabled - Ready for real AI calls',
    enabled ? 'warning' : 'success'
  );
}

/**
 * Update UI to reflect current mock mode state
 */
function updateMockModeUI() {
  const checkbox = document.getElementById('mock-mode-checkbox');
  if (checkbox) {
    checkbox.checked = isMockMode();
  }
  
  // Update page indicator
  updatePageIndicator();
}

/**
 * Update page-level indicator of mock mode
 */
function updatePageIndicator() {
  const existingIndicator = document.getElementById('mock-mode-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  if (!isMockMode()) {
    return;
  }
  
  // Create indicator banner
  const indicator = document.createElement('div');
  indicator.id = 'mock-mode-indicator';
  indicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 text-sm font-medium z-40';
  indicator.innerHTML = '⚠️ MOCK MODE ACTIVE - Using simulated AI responses for testing';
  
  document.body.appendChild(indicator);
}

/**
 * Show information modal about mock mode
 */
function showMockModeInfo() {
  const message = `
    <div class="text-left">
      <h3 class="text-lg font-bold mb-2">AI Mock Mode</h3>
      
      <p class="mb-3"><strong>⚠️ FOR TESTING ONLY ⚠️</strong></p>
      
      <p class="mb-3">Mock mode provides simulated AI responses for testing without making real API calls.</p>
      
      <h4 class="font-bold mb-1">When to use:</h4>
      <ul class="list-disc ml-5 mb-3">
        <li>Testing the application workflow</li>
        <li>Developing new features</li>
        <li>Running automated tests</li>
        <li>Working offline</li>
      </ul>
      
      <h4 class="font-bold mb-1">When NOT to use:</h4>
      <ul class="list-disc ml-5 mb-3">
        <li>Creating real documents</li>
        <li>Production use</li>
        <li>Evaluating AI quality</li>
      </ul>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
        Mock mode is automatically disabled in production environments.
      </p>
    </div>
  `;
  
  showModal('AI Mock Mode Information', message);
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, warning, error)
 */
function showNotification(message, type = 'info') {
  // This would integrate with your existing notification system
  // For now, just console log
  console.log(`[Notification] ${type.toUpperCase()}: ${message}`);
  
  // You can implement a toast notification here
  // Example: showToast(message, type);
}

/**
 * Show modal dialog
 * @param {string} title - Modal title
 * @param {string} content - Modal content (HTML)
 */
function showModal(title, content) {
  // This would integrate with your existing modal system
  // For now, just use alert
  alert(`${title}\n\n${content.replace(/<[^>]*>/g, '')}`);
  
  // You can implement a proper modal here
  // Example: showModalDialog(title, content);
}

// Export for testing
export { updateMockModeUI, handleMockModeToggle };

