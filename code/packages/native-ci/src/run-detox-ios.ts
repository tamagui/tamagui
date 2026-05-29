#!/usr/bin/env bun
/**
 * Run iOS Detox tests with Metro bundler
 *
 * Usage: bun run-detox-ios.ts [options]
 *
 * Options:
 *   --config <name>       Detox configuration name (default: ios.sim.debug)
 *   --project-root <path> Project root directory (default: cwd)
 *   --record-logs <mode>  Record logs: none, failing, all (default: all)
 *   --retries <n>         Number of retries for flaky tests (default: 0)
 */

import { withMetro } from './metro'
import { parseDetoxArgs, runDetoxLaunchCanary, runDetoxTests } from './detox'
import { ensureIOSFolder, ensureIOSApp } from './ios'

const options = parseDetoxArgs('ios')

console.info('=== iOS Detox Test Runner ===')
console.info(`Config: ${options.config}`)
console.info(`Project root: ${options.projectRoot}`)

// Change to project root
process.chdir(options.projectRoot)

// Ensure ios folder exists (in case build artifacts were separated)
await ensureIOSFolder()

// Ensure iOS app is built (skipped on CI where app is pre-built)
await ensureIOSApp(options.config)

// Run tests with Metro
const exitCode = await withMetro('ios', async () => {
  // pre-flight: confirm the app can launch and connect to Detox before running
  // the suite. if it can't, every test file's beforeAll would hang the 180s
  // hook timeout x retries (~50min); bail fast instead. see memory
  // project_detox_app_connect_runaway.
  const canaryCode = await runDetoxLaunchCanary({
    config: options.config,
    projectRoot: options.projectRoot,
    recordLogs: options.recordLogs,
    retries: options.retries,
    workers: options.workers,
  })

  if (canaryCode !== 0) {
    console.error(
      '\nPre-flight launch canary failed: the app could not launch/connect to Detox. ' +
        'Skipping the suite to fail fast (this is usually a flaky simulator/app-registration ' +
        'issue, not a test failure). Re-run the shard.'
    )
    return canaryCode
  }

  console.info('\nPre-flight launch canary passed: app connects to Detox. Running suite.')

  return runDetoxTests({
    config: options.config,
    projectRoot: options.projectRoot,
    recordLogs: options.recordLogs,
    retries: options.retries,
    workers: options.workers,
    testFiles: options.testFiles,
  })
})

process.exit(exitCode)
