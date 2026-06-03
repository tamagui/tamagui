// force single worker always - multiple simulators cause resource exhaustion
// and macOS doesn't properly clean them up between runs
const maxWorkers = 1

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  // scope the haste-map crawl to e2e/ only. the detox tests import from e2e/ and
  // resolve `detox` via node resolution, so nothing outside e2e needs to be in the
  // haste map; keeps the crawl off the package + node_modules.
  roots: ['<rootDir>/e2e'],
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 180000, // 3 minutes for CI environments with slow emulators
  maxWorkers,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  // per-test retry for flaky individual tests (jest.retryTimes); replaces detox's
  // whole-file --retries. must run after the framework is installed, hence AfterEnv.
  setupFilesAfterEnv: ['<rootDir>/e2e/jest.setup.ts'],
  verbose: true,
  // watchman daemon disabled - jest must use node fallback watcher
  watchman: false,
  haste: { forceNodeFilesystemAPI: true },
  transform: {
    // use the dedicated e2e tsconfig (isolatedModules = transpile-only). without this
    // ts-jest type-checked the whole monorepo per file via the package tsconfig's
    // project references, costing ~7min/shard of startup before any test ran.
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/e2e/tsconfig.json' }],
  },
}
