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
import { parseDetoxArgs, runDetoxTests } from './detox'
import { ensureIOSFolder } from './ios'

const options = parseDetoxArgs('ios')

console.info('=== iOS Detox Test Runner ===')
console.info(`Config: ${options.config}`)
console.info(`Project root: ${options.projectRoot}`)

// Change to project root
process.chdir(options.projectRoot)

// Ensure ios folder exists (in case build artifacts were separated)
await ensureIOSFolder()

// Run tests with Metro
const exitCode = await withMetro('ios', async () => {
  return runDetoxTests({
    config: options.config,
    projectRoot: options.projectRoot,
    recordLogs: options.recordLogs,
    retries: options.retries,
  })
})

process.exit(exitCode)
