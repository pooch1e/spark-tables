module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
};
