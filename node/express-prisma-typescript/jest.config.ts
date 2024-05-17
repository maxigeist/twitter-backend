/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['./config.ts'],
  moduleNameMapper:{
    '^@utils': '<rootDir>/src/utils',
    '^@domains/(.*)': '<rootDir>/src/domains/$1',
  }
}
