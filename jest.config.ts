import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '^@rainbow-me/rainbowkit$': '<rootDir>/__mocks__/rainbowkitMock.js',
    '^wagmi$': '<rootDir>/__mocks__/wagmiMock.js',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/lib/supabase/database.types.ts'
  ],
};

export default config;
