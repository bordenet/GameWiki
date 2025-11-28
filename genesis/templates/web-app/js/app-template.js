/**
 * Main Application Entry Point
 * 
 * REFERENCE IMPLEMENTATION:
 *     https://github.com/bordenet/product-requirements-assistant/blob/main/docs/js/app.js
 *     Study the reference implementation for proper patterns!
 */

import storage from './storage.js';
import { initRouter } from './router.js';
import { loadDefaultPrompts } from './workflow.js';
import { exportAllProjects, importProjects } from './projects.js';
import { showToast, showLoading, hideLoading, formatBytes } from './ui.js';

/**
 * Initialize the application
 */
async function init() {
    try {
        showLoading('Initializing...');

        // Initialize IndexedDB
        await storage.init();
        console.log('✓ Storage initialized');

        // Load default prompts
        await loadDefaultPrompts();
        console.log('✓ Prompts loaded');

        // Initialize router
        initRouter();
        console.log('✓ Router initialized');

        // Setup global event listeners
        setupGlobalEventListeners();
        console.log('✓ Event listeners attached');

        // Update storage info
        await updateStorageInfo();

        hideLoading();
        console.log('✓ App ready');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        hideLoading();
        showToast('Failed to initialize app. Please refresh the page.', 'error', 5000);
    }
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
    // Related projects dropdown
    const relatedProjectsBtn = document.getElementById('related-projects-btn');
    const relatedProjectsMenu = document.getElementById('related-projects-menu');

    if (relatedProjectsBtn && relatedProjectsMenu) {
        relatedProjectsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            relatedProjectsMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            relatedProjectsMenu.classList.add('hidden');
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Export all button
    const exportAllBtn = document.getElementById('export-all-btn');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', async () => {
            try {
                await exportAllProjects();
                showToast('All projects exported successfully!', 'success');
            } catch (error) {
                console.error('Export failed:', error);
                showToast('Failed to export projects', 'error');
            }
        });
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        showLoading('Importing...');
                        const count = await importProjects(file);
                        hideLoading();
                        showToast(`Imported ${count} project${count > 1 ? 's' : ''} successfully!`, 'success');
                        window.location.hash = '';
                    } catch (error) {
                        hideLoading();
                        console.error('Import failed:', error);
                        showToast('Failed to import projects. Please check the file format.', 'error');
                    }
                }
            };
            input.click();
        });
    }

    // Close privacy notice
    const closePrivacyNotice = document.getElementById('close-privacy-notice');
    if (closePrivacyNotice) {
        closePrivacyNotice.addEventListener('click', () => {
            document.getElementById('privacy-notice')?.remove();
            storage.saveSetting('privacy-notice-dismissed', true);
        });
    }

    // Check if privacy notice was dismissed
    storage.getSetting('privacy-notice-dismissed').then(dismissed => {
        if (dismissed) {
            document.getElementById('privacy-notice')?.remove();
        }
    });

    // About link
    const aboutLink = document.getElementById('about-link');
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAboutModal();
        });
    }
}

/**
 * Load saved theme
 * CRITICAL: This must run BEFORE the app initializes to prevent flash of wrong theme
 */
function loadTheme() {
    // Use localStorage for immediate synchronous access
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
}

/**
 * Toggle dark/light theme
 * CRITICAL: This function works with Tailwind's darkMode: 'class' configuration
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        storage.saveSetting('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        storage.saveSetting('theme', 'dark');
    }
}

/**
 * Update storage info in footer
 */
async function updateStorageInfo() {
    const estimate = await storage.getStorageEstimate();
    const storageInfo = document.getElementById('storage-info');

    if (estimate && storageInfo) {
        const used = formatBytes(estimate.usage || 0);
        const quota = formatBytes(estimate.quota || 0);
        const percent = ((estimate.usage / estimate.quota) * 100).toFixed(1);
        storageInfo.textContent = `Storage: ${used} / ${quota} (${percent}%)`;
    } else if (storageInfo) {
        storageInfo.textContent = 'Storage: Available';
    }
}

/**
 * Show about modal
 */
function showAboutModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl shadow-xl">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {{HEADER_EMOJI}} {{PROJECT_TITLE}}
            </h3>
            <div class="text-gray-700 dark:text-gray-300 space-y-3 mb-6">
                <p>{{PROJECT_DESCRIPTION}}</p>
                <p><strong>100% Client-Side:</strong> All your data is stored locally in your browser using IndexedDB. Nothing is ever sent to any server.</p>
                <p><strong>Privacy-First:</strong> No tracking, no analytics, no cookies (except preferences).</p>
                <p><strong>Open Source:</strong> Available on GitHub under MIT license.</p>
            </div>
            <div class="flex justify-between items-center">
                <a href="https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">
                    View on GitHub →
                </a>
                <button type="button" id="close-about-btn" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#close-about-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// CRITICAL: Load theme BEFORE init to prevent flash of wrong theme
loadTheme();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

