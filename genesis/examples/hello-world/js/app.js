// app.js - Main application logic

import { initDB, saveProject, getProject, getAllProjects, deleteProject, exportProject } from './storage.js';
import { createProject, generatePrompt, validatePhase, advancePhase, isProjectComplete, getCurrentPhase, updatePhaseResponse, getProgress, PHASES } from './workflow.js';
import { initMockMode, setMockMode, isMockMode, getMockResponse } from './ai-mock.js';

let currentProject = null;

/**
 * Initialize application
 */
async function initApp() {
  try {
    // Initialize database
    await initDB();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize AI mock mode
    initMockMode();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render project list
    await renderProjectList();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showNotification('Failed to initialize app', 'error');
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Dark mode toggle
  document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
  
  // New project button
  document.getElementById('newProjectBtn')?.addEventListener('click', showNewProjectDialog);
  
  // Back to list button
  document.getElementById('backToListBtn')?.addEventListener('click', () => {
    currentProject = null;
    showProjectList();
  });
  
  // Export button
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    if (currentProject) {
      exportProject(currentProject);
      showNotification('Project exported', 'success');
    }
  });
  
  // Delete button
  document.getElementById('deleteBtn')?.addEventListener('click', async () => {
    if (currentProject && confirm('Delete this project?')) {
      await deleteProject(currentProject.id);
      showNotification('Project deleted', 'success');
      currentProject = null;
      showProjectList();
    }
  });
  
  // AI Mock mode toggle
  document.getElementById('mockModeCheckbox')?.addEventListener('change', (e) => {
    setMockMode(e.target.checked);
    showNotification(
      e.target.checked ? 'AI Mock Mode enabled' : 'AI Mock Mode disabled',
      'info'
    );
  });
}

/**
 * Dark mode
 * CRITICAL: Works with Tailwind's darkMode: 'class' configuration
 * Reference: https://github.com/bordenet/product-requirements-assistant
 */
function initDarkMode() {
  // Use localStorage for immediate synchronous access
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');

  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Show project list view
 */
async function showProjectList() {
  document.getElementById('projectListView').classList.remove('hidden');
  document.getElementById('workflowView').classList.add('hidden');
  await renderProjectList();
}

/**
 * Render project list
 */
async function renderProjectList() {
  const projects = await getAllProjects();
  const container = document.getElementById('projectList');
  
  if (projects.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <p class="text-lg">No projects yet</p>
        <p class="text-sm mt-2">Click "New Project" to get started</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = projects.map(project => `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer"
         onclick="window.openProject('${project.id}')">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">${escapeHtml(project.name)}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${escapeHtml(project.description)}</p>
        </div>
        <div class="ml-4 text-right">
          <div class="text-sm font-medium text-blue-600 dark:text-blue-400">${getProgress(project)}%</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Phase ${project.currentPhase}/${PHASES.length}
          </div>
        </div>
      </div>
      <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Modified: ${new Date(project.modified).toLocaleDateString()}
      </div>
    </div>
  `).join('');
}

/**
 * Show new project dialog
 */
function showNewProjectDialog() {
  const name = prompt('Project name:');
  if (!name) return;
  
  const description = prompt('Project description:');
  if (!description) return;
  
  const project = createProject(name, description);
  currentProject = project;
  
  saveProject(project).then(() => {
    showNotification('Project created', 'success');
    showWorkflow();
  });
}

/**
 * Open existing project
 */
window.openProject = async function(id) {
  currentProject = await getProject(id);
  showWorkflow();
};

/**
 * Show workflow view
 */
function showWorkflow() {
  document.getElementById('projectListView').classList.add('hidden');
  document.getElementById('workflowView').classList.remove('hidden');
  renderWorkflow();
}

/**
 * Render workflow
 */
function renderWorkflow() {
  const container = document.getElementById('workflowContent');
  const phase = getCurrentPhase(currentProject);
  const prompt = generatePrompt(currentProject);
  
  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        ${escapeHtml(currentProject.name)}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">${escapeHtml(currentProject.description)}</p>
      
      <!-- Phase Progress -->
      <div class="flex gap-4 mb-6">
        ${PHASES.map(p => `
          <div class="flex-1 text-center">
            <div class="text-sm font-medium ${p.number === currentProject.currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}">
              ${p.number === currentProject.currentPhase ? '→' : currentProject.phases[p.number - 1].completed ? '✓' : '○'} 
              Phase ${p.number}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${p.name}</div>
          </div>
        `).join('')}
      </div>
      
      <!-- Current Phase -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Phase ${phase.number}: ${phase.name}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">AI Model: ${phase.ai}</p>
        </div>
        
        <!-- Prompt -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Prompt
          </label>
          <textarea readonly 
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                    rows="10">${prompt}</textarea>
          <button onclick="window.copyPrompt()" 
                  class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Copy Prompt
          </button>
          ${isMockMode() ? `
            <button onclick="window.useMockResponse()" 
                    class="mt-2 ml-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Use Mock Response
            </button>
          ` : ''}
        </div>
        
        <!-- Response -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AI Response
          </label>
          <textarea id="responseInput"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="10"
                    placeholder="Paste the AI response here...">${phase.response}</textarea>
        </div>
        
        <!-- Actions -->
        <div class="flex gap-2">
          <button onclick="window.saveResponse()" 
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  `;
}

// Global functions for onclick handlers
window.copyPrompt = function() {
  const prompt = generatePrompt(currentProject);
  navigator.clipboard.writeText(prompt);
  showNotification('Prompt copied to clipboard', 'success');
};

window.useMockResponse = async function() {
  const phase = getCurrentPhase(currentProject);
  const mockResponse = await getMockResponse(phase.number);
  document.getElementById('responseInput').value = mockResponse;
  showNotification('Mock response loaded', 'info');
};

window.saveResponse = async function() {
  const response = document.getElementById('responseInput').value;
  updatePhaseResponse(currentProject, response);
  
  const validation = validatePhase(currentProject);
  if (!validation.valid) {
    showNotification(validation.error, 'error');
    return;
  }
  
  advancePhase(currentProject);
  await saveProject(currentProject);
  
  if (isProjectComplete(currentProject)) {
    showNotification('Project complete!', 'success');
  } else {
    showNotification('Phase completed', 'success');
  }
  
  renderWorkflow();
};

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const id = Date.now();
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.id = `notification-${id}`;
  notification.className = `notification ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('removing');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

