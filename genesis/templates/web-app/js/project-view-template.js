/**
 * Project Detail View Module
 * Handles rendering the project workflow view
 * 
 * This module provides the main workflow interface for a single project:
 * - Phase tabs (Phase 1, 2, 3)
 * - Prompt generation and copying
 * - Response input and saving
 * - Phase navigation
 * - Export functionality
 */

import { getProject, updatePhase } from './projects.js';
import { getPhaseMetadata, generatePromptForPhase, exportFinalPRD } from './workflow.js';
import { escapeHtml, showToast, copyToClipboard } from './ui.js';
import { navigateTo } from './router.js';

/**
 * Render the project detail view
 * @param {string} projectId - Project ID to render
 */
export async function renderProjectView(projectId) {
    const project = await getProject(projectId);
    
    if (!project) {
        showToast('Project not found', 'error');
        navigateTo('home');
        return;
    }

    const container = document.getElementById('app-container');
    container.innerHTML = `
        <div class="mb-6">
            <button id="back-btn" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-4">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Projects
            </button>
            
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        ${escapeHtml(project.title)}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400">
                        ${escapeHtml(project.problems)}
                    </p>
                </div>
                <button id="export-prd-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Export {{DOCUMENT_TYPE}}
                </button>
            </div>
        </div>

        <!-- Phase Tabs -->
        <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex space-x-1">
                ${[1, 2, 3].map(phase => {
                    const meta = getPhaseMetadata(phase);
                    const isActive = project.phase === phase;
                    const isCompleted = project.phases[phase].completed;
                    
                    return `
                        <button 
                            class="phase-tab px-6 py-3 font-medium transition-colors ${
                                isActive 
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }"
                            data-phase="${phase}"
                        >
                            <span class="mr-2">${meta.icon}</span>
                            Phase ${phase}
                            ${isCompleted ? '<span class="ml-2 text-green-500">✓</span>' : ''}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Phase Content -->
        <div id="phase-content">
            ${renderPhaseContent(project, project.phase)}
        </div>
    `;

    // Event listeners
    document.getElementById('back-btn').addEventListener('click', () => navigateTo('home'));
    document.getElementById('export-prd-btn').addEventListener('click', () => exportFinalPRD(project));
    
    document.querySelectorAll('.phase-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const phase = parseInt(tab.dataset.phase);
            project.phase = phase;
            document.getElementById('phase-content').innerHTML = renderPhaseContent(project, phase);
            attachPhaseEventListeners(project, phase);
        });
    });

    attachPhaseEventListeners(project, project.phase);
}

/**
 * Render content for a specific phase
 * @param {Object} project - Project object
 * @param {number} phase - Phase number (1-3)
 * @returns {string} HTML content for the phase
 */
function renderPhaseContent(project, phase) {
    const meta = getPhaseMetadata(phase);
    const phaseData = project.phases[phase];
    
    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ${meta.icon} ${meta.title}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                    ${meta.description}
                </p>
                <div class="inline-flex items-center px-3 py-1 bg-${meta.color}-100 dark:bg-${meta.color}-900/20 text-${meta.color}-800 dark:text-${meta.color}-300 rounded-full text-sm">
                    <span class="mr-2">🤖</span>
                    Use with ${meta.ai}
                </div>
            </div>

            <!-- Step 1: Generate Prompt -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Step 1: Copy Prompt to AI
                </h4>
                <button id="copy-prompt-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    📋 Copy Prompt to Clipboard
                </button>
                ${phaseData.prompt ? `
                    <div class="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Generated Prompt:</span>
                            <button class="view-prompt-btn text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                View Full Prompt
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            ${escapeHtml(phaseData.prompt.substring(0, 200))}...
                        </p>
                    </div>
                ` : ''}
            </div>

            <!-- Step 2: Paste Response -->
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Step 2: Paste AI Response
                </h4>
                <textarea
                    id="response-textarea"
                    rows="12"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder="Paste the AI's response here..."
                >${escapeHtml(phaseData.response || '')}</textarea>

                <div class="mt-3 flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                        ${phaseData.completed ? '✓ Phase completed' : 'Paste response to complete this phase'}
                    </span>
                    <button id="save-response-btn" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Save Response
                    </button>
                </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button id="prev-phase-btn" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${phase === 1 ? 'invisible' : ''}">
                    ← Previous Phase
                </button>
                <button id="next-phase-btn" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${phase === 3 ? 'invisible' : ''} ${!phaseData.completed ? 'opacity-50 cursor-not-allowed' : ''}">
                    Next Phase →
                </button>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners for phase interactions
 * @param {Object} project - Project object
 * @param {number} phase - Phase number (1-3)
 */
function attachPhaseEventListeners(project, phase) {
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    const saveResponseBtn = document.getElementById('save-response-btn');
    const responseTextarea = document.getElementById('response-textarea');
    const prevPhaseBtn = document.getElementById('prev-phase-btn');
    const nextPhaseBtn = document.getElementById('next-phase-btn');

    copyPromptBtn.addEventListener('click', async () => {
        const prompt = await generatePromptForPhase(project, phase);
        await copyToClipboard(prompt);
        await updatePhase(project.id, phase, prompt, project.phases[phase].response);
        renderProjectView(project.id);
    });

    saveResponseBtn.addEventListener('click', async () => {
        const response = responseTextarea.value.trim();
        if (response) {
            await updatePhase(project.id, phase, project.phases[phase].prompt, response);
            showToast('Response saved successfully!', 'success');
            renderProjectView(project.id);
        } else {
            showToast('Please enter a response', 'warning');
        }
    });

    if (prevPhaseBtn) {
        prevPhaseBtn.addEventListener('click', () => {
            project.phase = phase - 1;
            document.getElementById('phase-content').innerHTML = renderPhaseContent(project, phase - 1);
            attachPhaseEventListeners(project, phase - 1);
        });
    }

    if (nextPhaseBtn && project.phases[phase].completed) {
        nextPhaseBtn.addEventListener('click', () => {
            project.phase = phase + 1;
            document.getElementById('phase-content').innerHTML = renderPhaseContent(project, phase + 1);
            attachPhaseEventListeners(project, phase + 1);
        });
    }
}

