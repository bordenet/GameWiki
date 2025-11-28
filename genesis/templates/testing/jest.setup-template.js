/**
 * Jest Setup File
 *
 * This file runs before each test suite to set up the testing environment.
 */

// Mock IndexedDB for testing
import 'fake-indexeddb/auto';
import { webcrypto } from 'node:crypto';

// Polyfill crypto.randomUUID for Node.js
Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto,
  writable: true,
  configurable: true
});

// Polyfill structuredClone for Node.js < 17
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock console methods in tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // Uncomment to suppress console.error in tests
  // error: jest.fn(),
  // Uncomment to suppress console.warn in tests
  // warn: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock File API
class MockBlob {
  constructor(parts, options = {}) {
    this.parts = parts;
    this.type = options.type || '';
    this.size = parts.reduce((acc, part) => acc + (part.length || 0), 0);
  }
}

class MockFile extends MockBlob {
  constructor(parts, name, options = {}) {
    super(parts, options);
    this.name = name;
    this.lastModified = options.lastModified || Date.now();
  }
}

global.Blob = MockBlob;
global.File = MockFile;

// Mock FileReader
global.FileReader = class FileReader {
  readAsText(blob) {
    this.result = blob.parts.join('');
    if (this.onload) {
      this.onload({ target: this });
    }
  }

  readAsDataURL(blob) {
    this.result = `data:${blob.type};base64,${Buffer.from(blob.parts.join('')).toString('base64')}`;
    if (this.onload) {
      this.onload({ target: this });
    }
  }
};

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
});

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});

