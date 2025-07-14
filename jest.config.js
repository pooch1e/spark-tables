module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/app/lib/test-db-scripts.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
};
