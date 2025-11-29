import { describe, test, expect } from '@jest/globals';
import {
  createSession,
  generatePrompt,
  validatePhase,
  advancePhase,
  isSessionComplete,
  getCurrentPhase,
  updatePhaseResponse,
  getProgress,
  parseTags,
  filterSessions,
  getAllTags,
  parseLocations,
  parsePlotThreads,
  PHASES
} from '../js/workflow.js';

describe('Workflow Module', () => {
  describe('createSession', () => {
    test('should create a new session with correct structure', () => {
      const session = createSession('Session 47', '2024-12-15', 'Transcript text');

      expect(session).toBeTruthy();
      expect(session.id).toBeTruthy();
      expect(session.title).toBe('Session 47');
      expect(session.date).toBe('2024-12-15');
      expect(session.transcript).toBe('Transcript text');
      expect(session.currentPhase).toBe(1);
      expect(session.phases).toHaveLength(PHASES.length);
      expect(session.tags).toEqual([]);
    });

    test('should create session with tags', () => {
      const session = createSession('Session 47', '2024-12-15', 'Transcript', ['combat', 'dungeon']);

      expect(session.tags).toEqual(['combat', 'dungeon']);
    });

    test('should initialize all phases as incomplete', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');

      session.phases.forEach(phase => {
        expect(phase.completed).toBe(false);
        expect(phase.prompt).toBe('');
        expect(phase.response).toBe('');
      });
    });

    test('should have 3 phases for Dim Lantern workflow', () => {
      expect(PHASES).toHaveLength(3);
      expect(PHASES[0].name).toBe('Extract');
      expect(PHASES[1].name).toBe('Summarize');
      expect(PHASES[2].name).toBe('Refine');
    });
  });

  describe('generatePrompt', () => {
    test('should generate prompt for phase 1 (Extract)', () => {
      const session = createSession('Session 47', '2024-12-15', 'The party entered the tavern.');
      const prompt = generatePrompt(session);

      expect(prompt).toContain('Phase 1');
      expect(prompt).toContain('Extract');
      expect(prompt).toContain('Session 47');
      expect(prompt).toContain('The party entered the tavern.');
      expect(prompt).toContain('LOCATIONS');
      expect(prompt).toContain('PLOT THREADS');
    });

    test('should generate prompt for phase 2 (Summarize)', () => {
      const session = createSession('Session 47', '2024-12-15', 'Transcript');
      session.phases[0].response = '### LOCATIONS\n- Tavern\n### PLOT THREADS\n- Missing artifact';
      session.phases[0].completed = true;
      session.currentPhase = 2;

      const prompt = generatePrompt(session);

      expect(prompt).toContain('Phase 2');
      expect(prompt).toContain('Wiki');
      expect(prompt).toContain('Tavern');
      expect(prompt).toContain('wiki');
    });

    test('should generate prompt for phase 3 (Refine)', () => {
      const session = createSession('Session 47', '2024-12-15', 'Transcript');
      session.phases[0].response = 'Phase 1 response';
      session.phases[0].completed = true;
      session.phases[1].response = '# Tavern Wiki Page';
      session.phases[1].completed = true;
      session.currentPhase = 3;

      const prompt = generatePrompt(session);

      expect(prompt).toContain('Phase 3');
      expect(prompt).toContain('Validate');
      expect(prompt).toContain('Tavern Wiki Page');
      expect(prompt).toContain('Refine');
    });
  });

  describe('validatePhase', () => {
    test('should fail validation when response is empty', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      const result = validatePhase(session);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('paste');
    });

    test('should fail validation when response is too short', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases[0].response = 'Too short';

      const result = validatePhase(session);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('too short');
    });

    test('should pass validation when response is adequate', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases[0].response = 'A'.repeat(150);

      const result = validatePhase(session);

      expect(result.valid).toBe(true);
    });
  });

  describe('advancePhase', () => {
    test('should mark current phase as completed', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases[0].response = 'Response';

      advancePhase(session);

      expect(session.phases[0].completed).toBe(true);
    });

    test('should advance to next phase', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      advancePhase(session);

      expect(session.currentPhase).toBe(2);
    });

    test('should not advance beyond last phase', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.currentPhase = PHASES.length;

      advancePhase(session);

      expect(session.currentPhase).toBe(PHASES.length);
    });
  });

  describe('isSessionComplete', () => {
    test('should return false for new session', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      expect(isSessionComplete(session)).toBe(false);
    });

    test('should return true when all phases are completed', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases.forEach(phase => {
        phase.completed = true;
      });
      expect(isSessionComplete(session)).toBe(true);
    });
  });

  describe('getProgress', () => {
    test('should return 0% for new session', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      expect(getProgress(session)).toBe(0);
    });

    test('should return 33% when one phase is complete', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases[0].completed = true;
      expect(getProgress(session)).toBe(33);
    });

    test('should return 100% when all phases are complete', () => {
      const session = createSession('Test', '2024-01-01', 'Transcript');
      session.phases.forEach(phase => {
        phase.completed = true;
      });
      expect(getProgress(session)).toBe(100);
    });
  });

  describe('parseTags', () => {
    test('should parse comma-separated tags', () => {
      const result = parseTags('combat, roleplay, dungeon');
      expect(result).toEqual(['combat', 'roleplay', 'dungeon']);
    });

    test('should handle empty string', () => {
      expect(parseTags('')).toEqual([]);
      expect(parseTags(null)).toEqual([]);
      expect(parseTags(undefined)).toEqual([]);
    });

    test('should lowercase all tags', () => {
      const result = parseTags('Combat, ROLEPLAY, Dungeon');
      expect(result).toEqual(['combat', 'roleplay', 'dungeon']);
    });

    test('should trim whitespace', () => {
      const result = parseTags('  combat  ,  roleplay  ');
      expect(result).toEqual(['combat', 'roleplay']);
    });

    test('should filter empty tags', () => {
      const result = parseTags('combat, , roleplay, ');
      expect(result).toEqual(['combat', 'roleplay']);
    });
  });

  describe('filterSessions', () => {
    const sessions = [
      { title: 'Session 1', date: '2024-01-01', tags: ['combat', 'dungeon'] },
      { title: 'Session 2', date: '2024-01-15', tags: ['roleplay', 'city'] },
      { title: 'Session 3', date: '2024-02-01', tags: ['combat', 'boss'] }
    ];

    test('should return all sessions when no filter', () => {
      const result = filterSessions(sessions, '', []);
      expect(result).toHaveLength(3);
    });

    test('should filter by search query in title', () => {
      const result = filterSessions(sessions, 'Session 1', []);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Session 1');
    });

    test('should filter by search query in date', () => {
      const result = filterSessions(sessions, '2024-01', []);
      expect(result).toHaveLength(2);
    });

    test('should filter by single tag', () => {
      const result = filterSessions(sessions, '', ['combat']);
      expect(result).toHaveLength(2);
    });

    test('should filter by multiple tags (AND logic)', () => {
      const result = filterSessions(sessions, '', ['combat', 'dungeon']);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Session 1');
    });

    test('should combine search and tag filters', () => {
      const result = filterSessions(sessions, 'Session', ['combat']);
      expect(result).toHaveLength(2);
    });
  });

  describe('getAllTags', () => {
    test('should return unique sorted tags from all sessions', () => {
      const sessions = [
        { tags: ['combat', 'dungeon'] },
        { tags: ['roleplay', 'combat'] },
        { tags: ['boss'] }
      ];

      const result = getAllTags(sessions);
      expect(result).toEqual(['boss', 'combat', 'dungeon', 'roleplay']);
    });

    test('should handle sessions without tags', () => {
      const sessions = [
        { tags: ['combat'] },
        { },
        { tags: null }
      ];

      const result = getAllTags(sessions);
      expect(result).toEqual(['combat']);
    });

    test('should return empty array for no sessions', () => {
      expect(getAllTags([])).toEqual([]);
    });
  });

  describe('parseLocations', () => {
    const sampleResponse = `# The Crimson Tower

**Type**: Building | **Region**: Northern Marches

## Overview
A mysterious tower that appears during blood moons.

## Session Test Session Events
- Party arrived at the tower
- Met the guardian

## Notable NPCs
- **Guardian Kael**: Ancient spirit bound to the tower

## Connections
- [[Northern Marches]]
- [[Blood Moon Cult]]

## Plot Threads
- [[The Blood Moon Prophecy]]

---

# The Blood Moon Prophecy

**Status**: Active | **Priority**: High

## Summary
An ancient prophecy speaks of a ritual during the blood moon.

## Unresolved Hooks
- What is the ritual's true purpose?
- Who created the prophecy?

## Related Locations
- [[The Crimson Tower]]

## Session History
- **2024-12-15**: Party discovered the prophecy`;

    test('should parse locations from response', () => {
      const locations = parseLocations(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(locations).toHaveLength(1);
      expect(locations[0].name).toBe('The Crimson Tower');
      expect(locations[0].type).toBe('Building');
      expect(locations[0].region).toBe('Northern Marches');
    });

    test('should extract wiki links as connections', () => {
      const locations = parseLocations(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(locations[0].connections).toContain('Northern Marches');
      expect(locations[0].connections).toContain('Blood Moon Cult');
    });

    test('should include session reference', () => {
      const locations = parseLocations(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(locations[0].sessions).toHaveLength(1);
      expect(locations[0].sessions[0].id).toBe('sess-1');
      expect(locations[0].sessions[0].title).toBe('Test Session');
    });

    test('should return empty array for null/empty response', () => {
      expect(parseLocations(null, 'x', 'x', 'x')).toEqual([]);
      expect(parseLocations('', 'x', 'x', 'x')).toEqual([]);
    });

    test('should skip plot thread sections', () => {
      const locations = parseLocations(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      // Should not include "The Blood Moon Prophecy" as a location
      const names = locations.map(l => l.name);
      expect(names).not.toContain('The Blood Moon Prophecy');
    });
  });

  describe('parsePlotThreads', () => {
    const sampleResponse = `# The Crimson Tower

**Type**: Building | **Region**: Northern Marches

## Overview
A mysterious tower.

---

# The Blood Moon Prophecy

**Status**: Active | **Priority**: High

## Summary
An ancient prophecy speaks of a ritual during the blood moon.

## Unresolved Hooks
- What is the ritual's true purpose?
- Who created the prophecy?

## Related Locations
- [[The Crimson Tower]]

## Session History
- **2024-12-15**: Party discovered the prophecy

---

# The Missing Heir

**Status**: Dormant | **Priority**: Medium

## Summary
The rightful heir to the throne has vanished.

## Unresolved Hooks
- Where did the heir go?

## Related Locations
- [[Royal Palace]]`;

    test('should parse plot threads from response', () => {
      const threads = parsePlotThreads(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(threads).toHaveLength(2);
      expect(threads[0].name).toBe('The Blood Moon Prophecy');
      expect(threads[0].status).toBe('Active');
      expect(threads[0].priority).toBe('High');
    });

    test('should extract related locations as wiki links', () => {
      const threads = parsePlotThreads(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(threads[0].relatedLocations).toContain('The Crimson Tower');
    });

    test('should include session reference', () => {
      const threads = parsePlotThreads(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(threads[0].sessions).toHaveLength(1);
      expect(threads[0].sessions[0].id).toBe('sess-1');
    });

    test('should parse different statuses', () => {
      const threads = parsePlotThreads(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      expect(threads[0].status).toBe('Active');
      expect(threads[1].status).toBe('Dormant');
    });

    test('should return empty array for null/empty response', () => {
      expect(parsePlotThreads(null, 'x', 'x', 'x')).toEqual([]);
      expect(parsePlotThreads('', 'x', 'x', 'x')).toEqual([]);
    });

    test('should skip location sections', () => {
      const threads = parsePlotThreads(sampleResponse, 'sess-1', 'Test Session', '2024-12-15');

      // Should not include "The Crimson Tower" as a plot thread
      const names = threads.map(t => t.name);
      expect(names).not.toContain('The Crimson Tower');
    });
  });
});

