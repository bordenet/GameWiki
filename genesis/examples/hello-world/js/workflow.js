// workflow.js - 2-phase workflow engine

import { generateId } from './storage.js';

// Define workflow phases
export const PHASES = [
  { number: 1, name: 'Input', ai: 'Claude Sonnet 4.5' },
  { number: 2, name: 'Output', ai: 'Gemini 2.5 Pro' }
];

/**
 * Create new project
 */
export function createProject(name, description) {
  return {
    id: generateId(),
    name: name,
    description: description,
    created: Date.now(),
    modified: Date.now(),
    currentPhase: 1,
    phases: PHASES.map(phase => ({
      number: phase.number,
      name: phase.name,
      ai: phase.ai,
      prompt: '',
      response: '',
      completed: false
    }))
  };
}

/**
 * Generate prompt for current phase
 */
export function generatePrompt(project) {
  const phase = project.phases[project.currentPhase - 1];
  
  if (phase.number === 1) {
    return `# Phase 1: ${phase.name}

Project: ${project.name}
Description: ${project.description}

Please analyze the following input and provide your insights:

[User will paste their input here]

Provide a detailed analysis.`;
  } else if (phase.number === 2) {
    const phase1Response = project.phases[0].response;
    return `# Phase 2: ${phase.name}

Project: ${project.name}

Based on the Phase 1 analysis:
${phase1Response}

Please provide the final output.`;
  }
  
  return '';
}

/**
 * Validate phase completion
 */
export function validatePhase(project) {
  const phase = project.phases[project.currentPhase - 1];
  
  if (!phase.response || phase.response.trim() === '') {
    return { valid: false, error: 'Please paste the AI response' };
  }
  
  return { valid: true };
}

/**
 * Complete current phase and advance
 */
export function advancePhase(project) {
  const phase = project.phases[project.currentPhase - 1];
  phase.completed = true;
  
  if (project.currentPhase < PHASES.length) {
    project.currentPhase++;
  }
  
  return project;
}

/**
 * Check if project is complete
 */
export function isProjectComplete(project) {
  return project.phases.every(phase => phase.completed);
}

/**
 * Get current phase
 */
export function getCurrentPhase(project) {
  return project.phases[project.currentPhase - 1];
}

/**
 * Update phase response
 */
export function updatePhaseResponse(project, response) {
  const phase = getCurrentPhase(project);
  phase.response = response;
  return project;
}

/**
 * Get project progress percentage
 */
export function getProgress(project) {
  const completedPhases = project.phases.filter(p => p.completed).length;
  return Math.round((completedPhases / PHASES.length) * 100);
}

