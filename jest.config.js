module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@components$': '<rootDir>/src/components',
    '^@pages$': '<rootDir>/src/pages'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};