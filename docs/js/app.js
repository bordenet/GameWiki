// app.js - Main application for Dim Lantern GM Documentation System

import { initDB, saveSession, getSession, getAllSessions, deleteSession, exportSession, getAllLocations, getAllPlotThreads, saveLocation, savePlotThread, getLocation, getPlotThread, findLocationByName, findPlotThreadByName } from './storage.js';
import { createSession, generatePrompt, validatePhase, advancePhase, isSessionComplete, getCurrentPhase, updatePhaseResponse, getProgress, PHASES, parseTags, filterSessions, getAllTags, parseLocations, parsePlotThreads } from './workflow.js';

let currentSession = null;
let activeFilterTags = [];
let searchQuery = '';
let currentTab = 'sessions';

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

  // Tab navigation
  document.getElementById('tabSessions')?.addEventListener('click', () => switchTab('sessions'));
  document.getElementById('tabLocations')?.addEventListener('click', () => switchTab('locations'));
  document.getElementById('tabPlotThreads')?.addEventListener('click', () => switchTab('plotThreads'));

  // Location filters
  document.getElementById('locationTypeFilter')?.addEventListener('change', renderLocations);
  document.getElementById('locationSearchInput')?.addEventListener('input', renderLocations);

  // Plot thread filters
  document.getElementById('threadStatusFilter')?.addEventListener('change', renderPlotThreads);
  document.getElementById('threadPriorityFilter')?.addEventListener('change', renderPlotThreads);

  // Modal close on backdrop click
  document.getElementById('locationDetailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'locationDetailModal') window.hideLocationDetail();
  });
  document.getElementById('plotThreadDetailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'plotThreadDetailModal') window.hidePlotThreadDetail();
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
  switchTab(currentTab);
}

function switchTab(tab) {
  currentTab = tab;
  currentSession = null;

  // Hide all views
  document.getElementById('sessionListView').classList.add('hidden');
  document.getElementById('workflowView').classList.add('hidden');
  document.getElementById('wikiView').classList.add('hidden');
  document.getElementById('locationsView').classList.add('hidden');
  document.getElementById('plotThreadsView').classList.add('hidden');

  // Update tab styles
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-gold', 'border-b-2', 'border-gold');
    btn.classList.add('text-gray-400');
  });

  const activeTabBtn = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  if (activeTabBtn) {
    activeTabBtn.classList.remove('text-gray-400');
    activeTabBtn.classList.add('text-gold', 'border-b-2', 'border-gold');
  }

  // Show appropriate view and render
  if (tab === 'sessions') {
    document.getElementById('sessionListView').classList.remove('hidden');
    renderSessionList();
    updateStats();
  } else if (tab === 'locations') {
    document.getElementById('locationsView').classList.remove('hidden');
    renderLocations();
  } else if (tab === 'plotThreads') {
    document.getElementById('plotThreadsView').classList.remove('hidden');
    renderPlotThreads();
  }
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
    // Extract locations and plot threads from completed session
    const extracted = await extractAndSaveFromSession(currentSession);
    const extractedMsg = extracted.locations + extracted.threads > 0
      ? ` Extracted ${extracted.locations} locations, ${extracted.threads} plot threads.`
      : '';
    showNotification(`🎉 Session processing complete!${extractedMsg}`, 'success');
    await updateStats();
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

// ============= LOCATIONS =============

async function renderLocations() {
  const locations = await getAllLocations();
  const container = document.getElementById('locationsGrid');
  const typeFilter = document.getElementById('locationTypeFilter')?.value || '';
  const searchFilter = document.getElementById('locationSearchInput')?.value?.toLowerCase() || '';

  const filtered = locations.filter(loc => {
    const matchesType = !typeFilter || loc.type === typeFilter;
    const matchesSearch = !searchFilter ||
      loc.name.toLowerCase().includes(searchFilter) ||
      loc.overview?.toLowerCase().includes(searchFilter);
    return matchesType && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-400">
        <p class="text-lg">🗺️ No locations found</p>
        <p class="text-sm mt-2">Complete session workflows to populate your location compendium</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(loc => `
    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500/50 cursor-pointer transition-colors"
         onclick="window.showLocationDetail('${loc.id}')">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-green-400">${escapeHtml(loc.name)}</h3>
        <span class="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">${escapeHtml(loc.type)}</span>
      </div>
      ${loc.region ? `<p class="text-xs text-gray-500 mb-2">📍 ${escapeHtml(loc.region)}</p>` : ''}
      <p class="text-sm text-gray-400 line-clamp-3">${escapeHtml(loc.overview?.substring(0, 150) || 'No description')}</p>
      <div class="mt-3 flex flex-wrap gap-1">
        ${loc.sessions?.map(s => `<span class="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 rounded">${escapeHtml(s.title)}</span>`).join('') || ''}
      </div>
    </div>
  `).join('');
}

window.showLocationDetail = async function(id) {
  const location = await getLocation(id);
  if (!location) return;

  const modal = document.getElementById('locationDetailModal');
  const content = document.getElementById('locationDetailContent');

  content.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-2xl font-bold text-green-400">${escapeHtml(location.name)}</h2>
        <div class="flex gap-2 mt-1">
          <span class="px-2 py-0.5 text-sm bg-gray-700 text-gray-300 rounded">${escapeHtml(location.type)}</span>
          ${location.region ? `<span class="text-sm text-gray-400">📍 ${escapeHtml(location.region)}</span>` : ''}
        </div>
      </div>
      <button onclick="window.hideLocationDetail()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
    </div>

    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-medium text-gold mb-1">Overview</h3>
        <p class="text-gray-300">${escapeHtml(location.overview || 'No description available')}</p>
      </div>

      ${location.npcs ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">Notable NPCs</h3>
          <div class="text-gray-300 whitespace-pre-wrap">${escapeHtml(location.npcs)}</div>
        </div>
      ` : ''}

      ${location.connections?.length ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">Connections</h3>
          <div class="flex flex-wrap gap-2">
            ${location.connections.map(c => `<span class="px-2 py-1 text-sm bg-gray-700 text-green-400 rounded hover:bg-gray-600 cursor-pointer" onclick="window.searchForItem('${escapeHtml(c)}')">[[ ${escapeHtml(c)} ]]</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${location.sessions?.length ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">Appears In</h3>
          <div class="flex flex-wrap gap-2">
            ${location.sessions.map(s => `<span class="px-2 py-1 text-sm bg-gray-700 text-gray-300 rounded">${escapeHtml(s.title)} (${s.date})</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div>
        <h3 class="text-sm font-medium text-gold mb-1">Raw Wiki Content</h3>
        <pre class="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-x-auto whitespace-pre-wrap">${escapeHtml(location.rawContent || '')}</pre>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.hideLocationDetail = function() {
  document.getElementById('locationDetailModal').classList.add('hidden');
};

// ============= PLOT THREADS =============

async function renderPlotThreads() {
  const threads = await getAllPlotThreads();
  const container = document.getElementById('plotThreadsList');
  const statusFilter = document.getElementById('threadStatusFilter')?.value || '';
  const priorityFilter = document.getElementById('threadPriorityFilter')?.value || '';

  const filtered = threads.filter(t => {
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <p class="text-lg">📖 No plot threads found</p>
        <p class="text-sm mt-2">Complete session workflows to track your plot threads</p>
      </div>`;
    return;
  }

  const statusColors = {
    'Active': 'text-green-400 bg-green-400/20',
    'Resolved': 'text-blue-400 bg-blue-400/20',
    'Dormant': 'text-gray-400 bg-gray-400/20'
  };

  const priorityColors = {
    'High': 'text-red-400',
    'Medium': 'text-yellow-400',
    'Low': 'text-gray-400'
  };

  container.innerHTML = filtered.map(thread => `
    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 cursor-pointer transition-colors"
         onclick="window.showPlotThreadDetail('${thread.id}')">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-purple-400">${escapeHtml(thread.name)}</h3>
        <div class="flex gap-2">
          <span class="px-2 py-0.5 text-xs rounded ${statusColors[thread.status] || 'bg-gray-700'}">${escapeHtml(thread.status)}</span>
          <span class="px-2 py-0.5 text-xs ${priorityColors[thread.priority] || ''}">${escapeHtml(thread.priority)}</span>
        </div>
      </div>
      <p class="text-sm text-gray-400 line-clamp-2">${escapeHtml(thread.summary?.substring(0, 200) || 'No summary')}</p>
      ${thread.hooks ? `<p class="text-xs text-yellow-400/70 mt-2">🪝 ${escapeHtml(thread.hooks.substring(0, 100))}...</p>` : ''}
    </div>
  `).join('');
}

window.showPlotThreadDetail = async function(id) {
  const thread = await getPlotThread(id);
  if (!thread) return;

  const modal = document.getElementById('plotThreadDetailModal');
  const content = document.getElementById('plotThreadDetailContent');

  const statusColors = {
    'Active': 'text-green-400 bg-green-400/20',
    'Resolved': 'text-blue-400 bg-blue-400/20',
    'Dormant': 'text-gray-400 bg-gray-400/20'
  };

  content.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-2xl font-bold text-purple-400">${escapeHtml(thread.name)}</h2>
        <div class="flex gap-2 mt-1">
          <span class="px-2 py-0.5 text-sm rounded ${statusColors[thread.status] || 'bg-gray-700'}">${escapeHtml(thread.status)}</span>
          <span class="text-sm text-gray-400">Priority: ${escapeHtml(thread.priority)}</span>
        </div>
      </div>
      <button onclick="window.hidePlotThreadDetail()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
    </div>

    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-medium text-gold mb-1">Summary</h3>
        <p class="text-gray-300">${escapeHtml(thread.summary || 'No summary available')}</p>
      </div>

      ${thread.hooks ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">🪝 Unresolved Hooks</h3>
          <div class="text-yellow-400/80 whitespace-pre-wrap">${escapeHtml(thread.hooks)}</div>
        </div>
      ` : ''}

      ${thread.relatedLocations?.length ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">Related Locations</h3>
          <div class="flex flex-wrap gap-2">
            ${thread.relatedLocations.map(loc => `<span class="px-2 py-1 text-sm bg-gray-700 text-green-400 rounded hover:bg-gray-600 cursor-pointer" onclick="window.searchForItem('${escapeHtml(loc)}')">[[ ${escapeHtml(loc)} ]]</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${thread.sessions?.length ? `
        <div>
          <h3 class="text-sm font-medium text-gold mb-1">Session History</h3>
          <div class="flex flex-wrap gap-2">
            ${thread.sessions.map(s => `<span class="px-2 py-1 text-sm bg-gray-700 text-gray-300 rounded">${escapeHtml(s.title)} (${s.date})</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div>
        <h3 class="text-sm font-medium text-gold mb-1">Raw Wiki Content</h3>
        <pre class="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-x-auto whitespace-pre-wrap">${escapeHtml(thread.rawContent || '')}</pre>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.hidePlotThreadDetail = function() {
  document.getElementById('plotThreadDetailModal').classList.add('hidden');
};

// ============= EXTRACTION & CROSS-REFERENCES =============

/**
 * Extract locations and plot threads from completed session and save to DB
 */
async function extractAndSaveFromSession(session) {
  const phase3Response = session.phases[2]?.response;
  if (!phase3Response) return { locations: 0, threads: 0 };

  const sessionRef = { id: session.id, title: session.title, date: session.date };

  // Parse locations and plot threads from Phase 3 response
  const parsedLocations = parseLocations(phase3Response, session.id, session.title, session.date);
  const parsedThreads = parsePlotThreads(phase3Response, session.id, session.title, session.date);

  let savedLocations = 0;
  let savedThreads = 0;

  // Save locations, merging duplicates by name
  for (const loc of parsedLocations) {
    const existing = await findLocationByName(loc.name);
    if (existing) {
      // Merge: add this session to the existing location
      if (!existing.sessions.some(s => s.id === session.id)) {
        existing.sessions.push(sessionRef);
        existing.rawContent += '\n\n---\n\n' + loc.rawContent;
        await saveLocation(existing);
      }
    } else {
      await saveLocation(loc);
      savedLocations++;
    }
  }

  // Save plot threads, merging duplicates by name
  for (const thread of parsedThreads) {
    const existing = await findPlotThreadByName(thread.name);
    if (existing) {
      // Merge: add this session and update status if changed
      if (!existing.sessions.some(s => s.id === session.id)) {
        existing.sessions.push(sessionRef);
        existing.status = thread.status; // Use latest status
        existing.rawContent += '\n\n---\n\n' + thread.rawContent;
        await savePlotThread(existing);
      }
    } else {
      await savePlotThread(thread);
      savedThreads++;
    }
  }

  return { locations: savedLocations, threads: savedThreads };
}

/**
 * Search for and navigate to a location or plot thread by name
 */
window.searchForItem = async function(name) {
  // Close any open modals
  window.hideLocationDetail();
  window.hidePlotThreadDetail();

  // Try to find as location first
  const location = await findLocationByName(name);
  if (location) {
    switchTab('locations');
    setTimeout(() => window.showLocationDetail(location.id), 100);
    return;
  }

  // Try as plot thread
  const thread = await findPlotThreadByName(name);
  if (thread) {
    switchTab('plotThreads');
    setTimeout(() => window.showPlotThreadDetail(thread.id), 100);
    return;
  }

  showNotification(`"${name}" not found in compendium`, 'info');
};

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

