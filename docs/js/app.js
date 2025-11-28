// app.js - Main application for Dim Lantern GM Documentation System

import { initDB, saveSession, getSession, getAllSessions, deleteSession, exportSession, getAllLocations, getAllPlotThreads } from './storage.js';
import { createSession, generatePrompt, validatePhase, advancePhase, isSessionComplete, getCurrentPhase, updatePhaseResponse, getProgress, PHASES, parseTags, filterSessions, getAllTags } from './workflow.js';

let currentSession = null;
let activeFilterTags = [];
let searchQuery = '';

/**
 * Initialize application
 */
async function initApp() {
  try {
    await initDB();
    setupEventListeners();
    await renderSessionList();
    await updateStats();
    console.log('🕯️ Dim Lantern initialized');
  } catch (error) {
    console.error('Failed to initialize:', error);
    showNotification('Failed to initialize app', 'error');
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  document.getElementById('newSessionBtn')?.addEventListener('click', showNewSessionModal);
  document.getElementById('cancelNewSession')?.addEventListener('click', hideNewSessionModal);
  document.getElementById('createSession')?.addEventListener('click', handleCreateSession);
  document.getElementById('backToListBtn')?.addEventListener('click', backToList);
  document.getElementById('backFromWikiBtn')?.addEventListener('click', backToList);
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    if (currentSession) {
      exportSession(currentSession);
      showNotification('Session exported', 'success');
    }
  });
  document.getElementById('deleteBtn')?.addEventListener('click', async () => {
    if (currentSession && confirm('Delete this session?')) {
      await deleteSession(currentSession.id);
      showNotification('Session deleted', 'success');
      currentSession = null;
      backToList();
    }
  });
  document.getElementById('exportAllBtn')?.addEventListener('click', exportWiki);

  // Search functionality
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSessionList();
  });

  document.getElementById('clearFilters')?.addEventListener('click', () => {
    activeFilterTags = [];
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    renderSessionList();
  });
}

function showNewSessionModal() {
  document.getElementById('newSessionModal').classList.remove('hidden');
  document.getElementById('sessionDate').valueAsDate = new Date();
}

function hideNewSessionModal() {
  document.getElementById('newSessionModal').classList.add('hidden');
  document.getElementById('sessionTitle').value = '';
  document.getElementById('sessionTags').value = '';
  document.getElementById('sessionTranscript').value = '';
}

async function handleCreateSession() {
  const title = document.getElementById('sessionTitle').value.trim();
  const date = document.getElementById('sessionDate').value;
  const tagsInput = document.getElementById('sessionTags').value;
  const transcript = document.getElementById('sessionTranscript').value.trim();

  if (!title || !transcript) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  const tags = parseTags(tagsInput);
  const session = createSession(title, date, transcript, tags);
  await saveSession(session);
  currentSession = session;
  hideNewSessionModal();
  showNotification('Session created', 'success');
  showWorkflow();
}

async function backToList() {
  currentSession = null;
  document.getElementById('sessionListView').classList.remove('hidden');
  document.getElementById('workflowView').classList.add('hidden');
  document.getElementById('wikiView').classList.add('hidden');
  await renderSessionList();
  await updateStats();
}

async function updateStats() {
  const sessions = await getAllSessions();
  const locations = await getAllLocations();
  const plotThreads = await getAllPlotThreads();
  const completedSessions = sessions.filter(s => isSessionComplete(s)).length;
  const totalProgress = sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0;

  document.getElementById('statSessions').textContent = sessions.length;
  document.getElementById('statLocations').textContent = locations.length;
  document.getElementById('statPlotThreads').textContent = plotThreads.length;
  document.getElementById('statProgress').textContent = `${totalProgress}%`;
}

async function renderSessionList() {
  const allSessions = await getAllSessions();
  const sessions = filterSessions(allSessions, searchQuery, activeFilterTags);
  const container = document.getElementById('sessionList');

  // Render tag filter buttons
  renderTagFilter(allSessions);

  // Update active filters display
  updateActiveFiltersDisplay();

  if (allSessions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <p class="text-lg">📜 No sessions yet</p>
        <p class="text-sm mt-2">Click "New Session" to process your first transcript</p>
      </div>`;
    return;
  }

  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <p class="text-lg">🔍 No matching sessions</p>
        <p class="text-sm mt-2">Try adjusting your search or filters</p>
      </div>`;
    return;
  }

  container.innerHTML = sessions.map(session => `
    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gold/50 cursor-pointer transition-colors"
         onclick="window.openSession('${session.id}')">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-semibold text-gold">${escapeHtml(session.title)}</h3>
          <p class="text-sm text-gray-400 mt-1">${session.date}</p>
          ${session.tags?.length ? `
            <div class="flex flex-wrap gap-1 mt-2">
              ${session.tags.map(tag => `
                <span class="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full">#${escapeHtml(tag)}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="ml-4 text-right">
          <div class="text-sm font-medium ${isSessionComplete(session) ? 'text-green-400' : 'text-blue-400'}">${getProgress(session)}%</div>
          <div class="text-xs text-gray-500 mt-1">Phase ${session.currentPhase}/${PHASES.length}</div>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        ${PHASES.map((p, i) => `
          <div class="h-2 flex-1 rounded ${session.phases[i].completed ? 'bg-green-500' : session.currentPhase === p.number ? 'bg-blue-500' : 'bg-gray-600'}"></div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderTagFilter(sessions) {
  const allTags = getAllTags(sessions);
  const container = document.getElementById('tagFilter');

  if (allTags.length === 0) {
    container.innerHTML = '<span class="text-sm text-gray-500">No tags yet</span>';
    return;
  }

  container.innerHTML = allTags.map(tag => `
    <button type="button"
            class="px-2 py-1 text-xs rounded-full transition-colors ${activeFilterTags.includes(tag) ? 'bg-gold text-ink' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
            onclick="window.toggleTagFilter('${escapeHtml(tag)}')">
      #${escapeHtml(tag)}
    </button>
  `).join('');
}

function updateActiveFiltersDisplay() {
  const container = document.getElementById('activeFilters');
  const tagsContainer = document.getElementById('activeFilterTags');

  if (activeFilterTags.length === 0 && !searchQuery) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  tagsContainer.innerHTML = activeFilterTags.map(tag => `
    <span class="px-2 py-0.5 text-xs bg-gold text-ink rounded-full">#${escapeHtml(tag)}</span>
  `).join('');
}

window.toggleTagFilter = function(tag) {
  const index = activeFilterTags.indexOf(tag);
  if (index === -1) {
    activeFilterTags.push(tag);
  } else {
    activeFilterTags.splice(index, 1);
  }
  renderSessionList();
};

window.openSession = async function(id) {
  currentSession = await getSession(id);
  showWorkflow();
};

function showWorkflow() {
  document.getElementById('sessionListView').classList.add('hidden');
  document.getElementById('workflowView').classList.remove('hidden');
  renderWorkflow();
}

function renderWorkflow() {
  const container = document.getElementById('workflowContent');
  const phase = getCurrentPhase(currentSession);
  const prompt = generatePrompt(currentSession);

  container.innerHTML = `
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-2xl font-bold text-gold mb-2">${escapeHtml(currentSession.title)}</h2>
      <p class="text-gray-400 mb-6">Session Date: ${currentSession.date}</p>
      
      <!-- Phase Progress -->
      <div class="flex gap-4 mb-6">
        ${PHASES.map(p => `
          <div class="flex-1 text-center p-3 rounded ${p.number === currentSession.currentPhase ? 'bg-gray-700 border border-gold/50' : ''}">
            <div class="text-sm font-medium ${p.number === currentSession.currentPhase ? 'text-gold' : currentSession.phases[p.number - 1].completed ? 'text-green-400' : 'text-gray-500'}">
              ${currentSession.phases[p.number - 1].completed ? '✓' : p.number === currentSession.currentPhase ? '→' : '○'} Phase ${p.number}
            </div>
            <div class="text-xs text-gray-400 mt-1">${p.name}</div>
            <div class="text-xs text-gray-500">${p.ai}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Phase ${phase.number}: ${phase.name}</h3>
          <p class="text-sm text-gray-400">${phase.description}</p>
          <p class="text-sm text-gold mt-1">AI Model: ${phase.ai}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Generated Prompt</label>
          <textarea readonly class="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white font-mono text-sm" rows="12">${prompt}</textarea>
          <button onclick="window.copyPrompt()" class="mt-2 px-4 py-2 bg-gold text-ink font-semibold rounded hover:bg-yellow-500">📋 Copy Prompt</button>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">AI Response</label>
          <textarea id="responseInput" class="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white" rows="12" placeholder="Paste the AI response here...">${phase.response}</textarea>
        </div>
        
        <div class="flex gap-2">
          <button onclick="window.saveResponse()" class="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-500">
            ${isSessionComplete(currentSession) ? '✓ Complete' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>`;
}

// Global functions for onclick handlers
window.copyPrompt = function() {
  const prompt = generatePrompt(currentSession);
  navigator.clipboard.writeText(prompt);
  showNotification('Prompt copied to clipboard', 'success');
};

window.saveResponse = async function() {
  const response = document.getElementById('responseInput').value;
  updatePhaseResponse(currentSession, response);

  const validation = validatePhase(currentSession);
  if (!validation.valid) {
    showNotification(validation.error, 'error');
    return;
  }

  advancePhase(currentSession);
  await saveSession(currentSession);

  if (isSessionComplete(currentSession)) {
    showNotification('🎉 Session processing complete!', 'success');
  } else {
    showNotification('Phase completed', 'success');
  }

  renderWorkflow();
};

async function exportWiki() {
  const sessions = await getAllSessions();
  const completedSessions = sessions.filter(s => isSessionComplete(s));

  if (completedSessions.length === 0) {
    showNotification('No completed sessions to export', 'error');
    return;
  }

  let wikiContent = '# Dim Lantern Campaign Wiki\n\n';
  wikiContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  wikiContent += '---\n\n';

  for (const session of completedSessions) {
    wikiContent += `## ${session.title} (${session.date})\n\n`;
    wikiContent += session.phases[2].response + '\n\n';
    wikiContent += '---\n\n';
  }

  const blob = new Blob([wikiContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dim-lantern-wiki.md';
  a.click();
  URL.revokeObjectURL(url);
  showNotification('Wiki exported', 'success');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const id = Date.now();
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  const notification = document.createElement('div');
  notification.id = `notification-${id}`;
  notification.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in`;
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
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

