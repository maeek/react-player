module.exports = {
  roots: ["<rootDir>/src"],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*stories.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/stories/**",
    "!<rootDir>/src/test/*.mock.js"
  ],
  clearMocks: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./src/setup-tests.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/test/styles.mock.js',
  }
};
