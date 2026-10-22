export default {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/test/setupEnv.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
  testMatch: ["**/*.test.{ts,tsx}"],
  clearMocks: true,
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
    "^axios$": "axios/dist/browser/axios.cjs",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**",
    "!src/main.tsx",
    "!src/types.ts",
  ],
  coverageDirectory: "coverage",
};
