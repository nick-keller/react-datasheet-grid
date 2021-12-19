import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./dist', './cypress'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/tests/helpers/styleMock.ts',
  },
}
export default config
