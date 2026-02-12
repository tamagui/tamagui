#!/usr/bin/env bun
/**
 * Run Android Detox tests with Metro bundler
 *
 * Usage: bun run-detox-android.ts [options]
 *
 * Options:
 *   --config <name>       Detox configuration name (default: android.emu.ci.debug)
 *   --project-root <path> Project root directory (default: cwd)
 *   --headless            Run in headless mode
 *   --record-logs <mode>  Record logs: none, failing, all (default: all)
 *   --retries <n>         Number of retries for flaky tests (default: 0)
 */

import { withMetro } from './metro'
import { parseDetoxArgs, runDetoxTests } from './detox'
import { waitForDevice, setupAdbReverse, ensureAndroidFolder } from './android'

const options = parseDetoxArgs('android')

console.info('=== Android Detox Test Runner ===')
console.info(`Config: ${options.config}`)
console.info(`Project root: ${options.projectRoot}`)
console.info(`Headless: ${options.headless}`)

// Change to project root
process.chdir(options.projectRoot)

// Ensure android folder exists (CI only caches APKs, not the full project)
await ensureAndroidFolder()

// Wait for Android device to be ready
await waitForDevice()

// Setup ADB reverse for Metro (Detox handles its own port via reversePorts config, but we need Metro early)
await setupAdbReverse()

// Run tests with Metro
const exitCode = await withMetro('android', async () => {
  return runDetoxTests({
    config: options.config,
    projectRoot: options.projectRoot,
    recordLogs: options.recordLogs,
    retries: options.retries,
    headless: options.headless,
    testFiles: options.testFiles,
  })
})

process.exit(exitCode)
