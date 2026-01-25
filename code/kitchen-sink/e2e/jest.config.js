const os = require('os')

// match the logic in .detoxrc.js - ~2.5GB per simulator, leave 2GB for system overhead
const totalMemGB = os.totalmem() / 1024 / 1024 / 1024
// force single worker in CI to avoid proper-lockfile ECOMPROMISED errors
const isCI = !!process.env.CI
const maxWorkers = isCI ? 1 : Math.max(1, Math.floor((totalMemGB - 2) / 2.5))

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 180000, // 3 minutes for CI environments with slow emulators
  maxWorkers,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }]
  },
};
