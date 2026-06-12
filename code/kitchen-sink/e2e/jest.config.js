// force single worker always - multiple simulators cause resource exhaustion
// and macOS doesn't properly clean them up between runs
const maxWorkers = 1

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 180000, // 3 minutes for CI environments with slow emulators
  maxWorkers,
  globalSetup: '<rootDir>/e2e/globalSetup.js',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  // watchman daemon disabled - jest must use node fallback watcher
  watchman: false,
  haste: { forceNodeFilesystemAPI: true },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
}
