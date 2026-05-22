// force single worker always - multiple simulators cause resource exhaustion
// and macOS doesn't properly clean them up between runs
const maxWorkers = 1

// startup-probe: mark when jest finishes loading this config, to bracket the long
// per-shard startup gap (jest spawn -> config eval -> globalSetup -> first test).
console.error(`[startup-probe] config eval ${new Date().toISOString()}`)

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  // only crawl e2e/ for the haste map. with watchman off + the node fs crawler,
  // letting jest walk the whole package (and CI's focused-install node_modules)
  // cost 20-27min of pure startup per shard before any test ran. the detox tests
  // only import from e2e/ and resolve `detox` via node resolution, so nothing
  // outside e2e needs to be in the haste map.
  roots: ['<rootDir>/e2e'],
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 180000, // 3 minutes for CI environments with slow emulators
  maxWorkers,
  globalSetup: '<rootDir>/e2e/detoxGlobalSetup.cjs',
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
