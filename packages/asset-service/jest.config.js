module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.json', diagnostics: false } }
};
