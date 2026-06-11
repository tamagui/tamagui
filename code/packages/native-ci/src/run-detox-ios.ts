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

import { resolve } from 'node:path'
import { withMetro } from './metro'
import { parseDetoxArgs, runDetoxTests } from './detox'
import {
  ensureAppInstalled,
  ensureIOSFolder,
  ensureIOSApp,
  getBootedSimulatorUDID,
  getIOSBundleId,
} from './ios'

const options = parseDetoxArgs('ios')

console.info('=== iOS Detox Test Runner ===')
console.info(`Config: ${options.config}`)
console.info(`Project root: ${options.projectRoot}`)

const projectRoot = resolve(options.projectRoot)

// Change to project root
process.chdir(projectRoot)

// Ensure ios folder exists (in case build artifacts were separated)
await ensureIOSFolder()

// Ensure iOS app is built (skipped on CI where app is pre-built)
await ensureIOSApp(options.config)

const bundleId = getIOSBundleId(projectRoot, options.config)
await ensureAppInstalled({
  projectRoot,
  bundleId,
  udid: getBootedSimulatorUDID() ?? undefined,
})

// Run tests with Metro
const exitCode = await withMetro('ios', async () => {
  return runDetoxTests({
    config: options.config,
    projectRoot,
    recordLogs: options.recordLogs,
    retries: options.retries,
    workers: options.workers,
    testFiles: options.testFiles,
    reuse: true,
  })
})

process.exit(exitCode)
