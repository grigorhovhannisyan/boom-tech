module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
    "^lib/(.*)": "<rootDir>/lib/$1",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/typing/*",
    "!<rootDir>/src/main.ts",
  ],
};
