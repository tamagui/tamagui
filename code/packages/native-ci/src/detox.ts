/**
 * Detox test runner utilities
 *
 * Shared functionality for running Detox E2E tests on iOS and Android.
 */

import { parseArgs } from 'node:util'
import { $ } from 'bun'
import type { Platform } from './constants'

export interface DetoxRunnerOptions {
  /** Detox configuration name */
  config: string
  /** Project root directory */
  projectRoot: string
  /** Record logs mode: none, failing, all */
  recordLogs: string
  /** Number of retries for flaky tests */
  retries: number
  /** Run in headless mode (Android only) */
  headless?: boolean
}

/**
 * Parse common CLI arguments for Detox runners
 */
export function parseDetoxArgs(platform: Platform) {
  const defaultConfig = platform === 'ios' ? 'ios.sim.debug' : 'android.emu.ci.debug'

  const { values } = parseArgs({
    options: {
      config: { type: 'string', default: defaultConfig },
      'project-root': { type: 'string', default: process.cwd() },
      headless: { type: 'boolean', default: false },
      'record-logs': { type: 'string', default: 'all' },
      retries: { type: 'string', default: '0' },
    },
  })

  // Validate and convert retries to number
  const retriesNum = parseInt(values.retries!, 10)
  if (isNaN(retriesNum) || retriesNum < 0) {
    console.error('Error: retries must be a non-negative integer')
    process.exit(1)
  }

  return {
    config: values.config!,
    projectRoot: values['project-root']!,
    headless: values.headless!,
    recordLogs: values['record-logs']!,
    retries: retriesNum,
  }
}

/**
 * Build Detox CLI command arguments
 */
export function buildDetoxArgs(options: DetoxRunnerOptions): string[] {
  const args = [
    'detox',
    'test',
    '--configuration',
    options.config,
    '--record-logs',
    options.recordLogs,
    '--retries',
    String(options.retries),
  ]

  if (options.headless) {
    args.push('--headless')
  }

  return args
}

/**
 * Run Detox tests with the given options
 *
 * @returns Exit code from Detox
 */
export async function runDetoxTests(options: DetoxRunnerOptions): Promise<number> {
  const detoxArgs = buildDetoxArgs(options)

  console.info('\n--- Running Detox tests ---')
  console.info(`Command: npx ${detoxArgs.join(' ')}`)

  const result = await $`npx ${detoxArgs}`.nothrow()
  const exitCode = result.exitCode

  if (exitCode === 0) {
    console.info('\nAll tests passed!')
  } else {
    console.info(`\nTests failed with exit code: ${exitCode}`)
  }

  return exitCode
}
