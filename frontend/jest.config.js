export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleFileExtensions: ["js", "jsx"],
};
