/**
 * The engine (src/engine, src/utils, src/types, src/data) is plain
 * TypeScript with zero React Native dependencies, so it's tested directly
 * under Node with ts-jest instead of the heavier jest-expo/react-native
 * preset. UI components should get their own RN Testing Library setup
 * (jest-expo preset) as the project grows.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/engine/**/*.test.ts', '**/src/utils/**/*.test.ts'],
};
