// jest.config.ts
const config = {
  preset: 'ts-jest/presets/default-esm', // enables ESM support with ts-jest
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.mts'],

  // Use transform instead of globals per ts-jest docs:
  transform: {
    '^.+\\.(ts|tsx|mts)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json', // adjust if you have a separate config
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // fix imports with .js extensions in ESM context
    '^@/(.*)$': '<rootDir>/$1', // your alias mapping
  },

  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-package)/)', // if you import any ESM from node_modules
  ],

  // **Important: Load env variables before tests run**
  setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
