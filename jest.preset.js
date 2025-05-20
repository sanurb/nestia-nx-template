const nxPreset = require('@nx/jest/preset').default

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  testPathIgnorePatterns: ['<rootDir>/apps/.*/e2e'],
  testTimeout: 20000,
  detectOpenHandles: true,
  detectLeaks: true,
  passWithNoTests: true,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['json'],
}
