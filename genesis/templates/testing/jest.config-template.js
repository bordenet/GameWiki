/**
 * Jest Configuration for {{PROJECT_TITLE}}
 * 
 * This configuration sets up Jest for testing JavaScript modules
 * with coverage reporting and threshold enforcement.
 */

export default {
  // Test environment
  testEnvironment: 'jsdom',

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js',
    '!js/**/*.spec.js',
    '!js/app.js',
    '!js/router.js', // Exclude router (tested via E2E)
    '!js/views.js', // Exclude views (tested via E2E)
    '!js/project-view.js', // Exclude project view (tested via E2E)
    '!**/node_modules/**'
  ],

  // Coverage thresholds (ENFORCED)
  // NOTE: Adjust these thresholds based on your project's maturity
  // - New projects: Start with 25/15/30/25
  // - Mature projects: Aim for 60/45/60/60 or higher
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 45,
      functions: 60,
      lines: 60
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Module paths
  moduleDirectories: [
    'node_modules',
    'js'
  ],

  // Transform files (if using TypeScript or JSX)
  transform: {},

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/genesis/',
    '/dist/',
    '/build/'
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Timeout for tests (milliseconds)
  testTimeout: 10000,

  // Bail after first test failure (set to false for CI)
  bail: false,

  // Maximum number of workers
  maxWorkers: '50%',

  // Notify on completion (useful for watch mode)
  notify: false,

  // Error on deprecated APIs
  errorOnDeprecated: true
};

