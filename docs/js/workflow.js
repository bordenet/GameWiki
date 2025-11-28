// workflow.js - 3-phase workflow for Dim Lantern GM Documentation System
// Phase 1: Extract locations and plot threads from transcript
// Phase 2: Generate wiki summaries for each location
// Phase 3: Refine and validate with Gemini

import { generateId } from './storage.js';

// Define workflow phases
export const PHASES = [
  {
    number: 1,
    name: 'Extract',
    ai: 'Claude Sonnet 4',
    description: 'Extract locations and plot threads from transcript'
  },
  {
    number: 2,
    name: 'Summarize',
    ai: 'Claude Sonnet 4',
    description: 'Generate wiki-style summaries for locations'
  },
  {
    number: 3,
    name: 'Refine',
    ai: 'Gemini 2.5 Pro',
    description: 'Validate and refine summaries for accuracy'
  }
];

/**
 * Create new session with workflow state
 */
export function createSession(title, date, transcript, tags = []) {
  return {
    id: generateId(),
    title: title,
    date: date,
    transcript: transcript,
    tags: tags,
    created: Date.now(),
    modified: Date.now(),
    currentPhase: 1,
    phases: PHASES.map(phase => ({
      number: phase.number,
      name: phase.name,
      ai: phase.ai,
      description: phase.description,
      prompt: '',
      response: '',
      completed: false
    })),
    extractedLocations: [],
    extractedPlotThreads: []
  };
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagString) {
  if (!tagString) return [];
  return tagString.split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);
}

/**
 * Filter sessions by search query and tags
 */
export function filterSessions(sessions, query = '', filterTags = []) {
  return sessions.filter(session => {
    // Text search in title
    const matchesQuery = !query ||
      session.title.toLowerCase().includes(query.toLowerCase()) ||
      session.date.includes(query);

    // Tag filter
    const matchesTags = filterTags.length === 0 ||
      filterTags.every(tag => session.tags?.includes(tag));

    return matchesQuery && matchesTags;
  });
}

/**
 * Get all unique tags from sessions
 */
export function getAllTags(sessions) {
  const tagSet = new Set();
  sessions.forEach(session => {
    session.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Generate prompt for current phase
 */
export function generatePrompt(session) {
  const phase = session.phases[session.currentPhase - 1];

  if (phase.number === 1) {
    return generatePhase1Prompt(session);
  } else if (phase.number === 2) {
    return generatePhase2Prompt(session);
  } else if (phase.number === 3) {
    return generatePhase3Prompt(session);
  }
  return '';
}

function generatePhase1Prompt(session) {
  return `# Phase 1: Extract Locations and Plot Threads

You are a D&D 5E campaign analyst. Extract all significant LOCATIONS and PLOT THREADS from this session transcript.

## Session: ${session.title}
## Date: ${session.date}

## TRANSCRIPT:
${session.transcript}

---

## OUTPUT FORMAT (use exactly this structure):

### LOCATIONS
For each location, provide:
- **Name**: [Location name]
- **Type**: [City/Town/Dungeon/Wilderness/Building/Region]
- **Events**: [Bullet list of what happened here this session]
- **NPCs Encountered**: [List of NPCs at this location]
- **Connections**: [Other locations mentioned in relation to this one]

### PLOT THREADS
For each plot thread, provide:
- **Thread**: [Name of plot thread]
- **Status**: [Active/Resolved/Dormant]
- **Description**: [Brief description]
- **Hooks**: [Unresolved hooks or questions]
- **Related Locations**: [Locations tied to this thread]

Be thorough. Include ALL locations mentioned, even briefly. Capture ALL unresolved plot elements.`;
}

function generatePhase2Prompt(session) {
  const phase1Response = session.phases[0].response;
  return `# Phase 2: Generate Wiki Summaries

Based on the extracted locations and plot threads, create wiki-style documentation.

## Session: ${session.title}
## Date: ${session.date}

## PHASE 1 EXTRACTION:
${phase1Response}

---

## OUTPUT FORMAT:

For each LOCATION, create a wiki page in this format:

# [Location Name]

**Type**: [Type] | **Region**: [Parent region if known]

## Overview
[2-3 sentence description of this location]

## Session ${session.title} Events
- [Chronological bullet points of what happened here]

## Notable NPCs
- **[NPC Name]**: [Brief description and role]

## Connections
- [[Link to related location]]

## Plot Threads
- [[Link to related plot thread]]

---

For each PLOT THREAD, create an entry:

# [Plot Thread Name]

**Status**: [Active/Resolved/Dormant] | **Priority**: [High/Medium/Low]

## Summary
[Description of this plot thread]

## Unresolved Hooks
- [List of open questions or hooks]

## Related Locations
- [[Location links]]

## Session History
- **${session.date}**: [What happened with this thread]`;
}

function generatePhase3Prompt(session) {
  const phase2Response = session.phases[1].response;
  return `# Phase 3: Validate and Refine Wiki Entries

Review the generated wiki entries for accuracy, completeness, and Obsidian compatibility.

## Session: ${session.title}

## GENERATED WIKI CONTENT:
${phase2Response}

---

## YOUR TASK:

1. **Accuracy Check**: Verify all facts match the original transcript
2. **Completeness**: Ensure no locations or plot threads were missed
3. **Obsidian Formatting**: Verify [[wiki links]] are consistent
4. **Clarity**: Improve any unclear descriptions
5. **Cross-References**: Ensure all connections are bidirectional

## OUTPUT:
Provide the FINAL, corrected wiki content ready for copy-paste into Obsidian.
Include any corrections or additions you made.

If everything looks good, output the content unchanged with a note: "✓ Validated - No changes needed"`;
}

/**
 * Validate phase completion
 */
export function validatePhase(session) {
  const phase = session.phases[session.currentPhase - 1];
  if (!phase.response || phase.response.trim() === '') {
    return { valid: false, error: 'Please paste the AI response' };
  }
  if (phase.response.trim().length < 100) {
    return { valid: false, error: 'Response seems too short. Please check the AI output.' };
  }
  return { valid: true };
}

export function advancePhase(session) {
  const phase = session.phases[session.currentPhase - 1];
  phase.completed = true;
  if (session.currentPhase < PHASES.length) {
    session.currentPhase++;
  }
  return session;
}

export function isSessionComplete(session) {
  return session.phases.every(phase => phase.completed);
}

export function getCurrentPhase(session) {
  return session.phases[session.currentPhase - 1];
}

export function updatePhaseResponse(session, response) {
  const phase = getCurrentPhase(session);
  phase.response = response;
  return session;
}

export function getProgress(session) {
  const completedPhases = session.phases.filter(p => p.completed).length;
  return Math.round((completedPhases / PHASES.length) * 100);
}

