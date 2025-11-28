/**
 * Router Module
 * Handles client-side routing for multi-project navigation
 * 
 * This module provides hash-based routing to navigate between:
 * - Home view (project list)
 * - New project form
 * - Individual project workflow view
 */

import { renderProjectsList, renderNewProjectForm } from './views.js';
import { renderProjectView } from './project-view.js';

const routes = {
    'home': renderProjectsList,
    'new-project': renderNewProjectForm,
    'project': renderProjectView
};

let currentRoute = null;
let currentParams = null;

/**
 * Navigate to a route
 * @param {string} route - Route name ('home', 'new-project', 'project')
 * @param {...any} params - Route parameters (e.g., project ID)
 */
export function navigateTo(route, ...params) {
    currentRoute = route;
    currentParams = params;
    
    // Update URL hash
    if (route === 'home') {
        window.location.hash = '';
    } else if (route === 'new-project') {
        window.location.hash = '#new';
    } else if (route === 'project' && params[0]) {
        window.location.hash = `#project/${params[0]}`;
    }
    
    // Render the route
    const handler = routes[route];
    if (handler) {
        handler(...params);
    } else {
        console.error(`Route not found: ${route}`);
        navigateTo('home');
    }
}

/**
 * Initialize router
 * Sets up hash change listener and handles initial route
 */
export function initRouter() {
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial load
    handleHashChange();
}

/**
 * Handle hash change events
 * Parses URL hash and navigates to appropriate route
 */
function handleHashChange() {
    const hash = window.location.hash.slice(1); // Remove #
    
    if (!hash) {
        navigateTo('home');
    } else if (hash === 'new') {
        navigateTo('new-project');
    } else if (hash.startsWith('project/')) {
        const projectId = hash.split('/')[1];
        navigateTo('project', projectId);
    } else {
        navigateTo('home');
    }
}

/**
 * Get current route information
 * @returns {Object} Current route and parameters
 */
export function getCurrentRoute() {
    return { route: currentRoute, params: currentParams };
}

