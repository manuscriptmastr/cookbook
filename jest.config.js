/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/recipes/archive/index.test.js',
    '<rootDir>/src/recipes/decorator/index.test.js',
    '<rootDir>/src/recipes/error/index.test.js',
    '<rootDir>/src/recipes/functional/index.test.js',
    '<rootDir>/src/recipes/query/index.test.js',
    '<rootDir>/src/recipes/swiftui/index.test.js',
  ],
};
