/**
 * Detox test runner utilities
 *
 * Shared functionality for running Detox E2E tests on iOS and Android.
 */

import { parseArgs } from 'node:util'
import type { Platform } from './constants'
import { DETOX_SERVER_PORT } from './constants'

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
  /** Number of parallel workers (default: 1) */
  workers?: number
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
      workers: { type: 'string', default: '1' },
    },
  })

  // Validate and convert retries to number
  const retriesNum = Number.parseInt(values.retries!, 10)
  if (Number.isNaN(retriesNum) || retriesNum < 0) {
    console.error('Error: retries must be a non-negative integer')
    process.exit(1)
  }

  // Validate and convert workers to number
  const workersNum = Number.parseInt(values.workers!, 10)
  if (Number.isNaN(workersNum) || workersNum < 1) {
    console.error('Error: workers must be a positive integer')
    process.exit(1)
  }

  return {
    config: values.config!,
    projectRoot: values['project-root']!,
    headless: values.headless!,
    recordLogs: values['record-logs']!,
    retries: retriesNum,
    workers: workersNum,
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
    // force jest to exit after tests complete (prevents hanging on open handles)
    '--forceExit',
  ]

  if (options.headless) {
    args.push('--headless')
  }

  // add parallel workers if specified
  if (options.workers && options.workers > 1) {
    args.push('--workers', String(options.workers))
  }

  return args
}

// 30 min timeout for detox tests (in ms)
const DETOX_TIMEOUT_MS = 30 * 60 * 1000

/**
 * Reset Detox lock file to prevent ECOMPROMISED errors in CI
 * See: https://github.com/wix/Detox/issues/4210
 */
export async function resetDetoxLockFile(): Promise<void> {
  console.info('Resetting Detox lock file...')
  const proc = Bun.spawn(['npx', 'detox', 'reset-lock-file'], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  await proc.exited
}

/**
 * Run Detox tests with the given options
 *
 * @returns Exit code from Detox
 */
export async function runDetoxTests(options: DetoxRunnerOptions): Promise<number> {
  // Reset lock file to prevent ECOMPROMISED errors in CI
  // This clears stale locks from previous runs that can cause "Unable to update lock within the stale threshold" errors
  await resetDetoxLockFile()

  const detoxArgs = buildDetoxArgs(options)

  console.info('\n--- Running Detox tests ---')
  console.info(`Using fixed Detox server port: ${DETOX_SERVER_PORT}`)
  console.info(`Command: npx ${detoxArgs.join(' ')}`)

  // Use Bun.spawn with timeout to prevent hanging on zombie processes
  const proc = Bun.spawn(['npx', ...detoxArgs], {
    env: { ...process.env, DETOX_SERVER_PORT: String(DETOX_SERVER_PORT) },
    stdout: 'inherit',
    stderr: 'inherit',
  })

  // Race between process completion and timeout
  const timeoutPromise = new Promise<'timeout'>((resolve) => {
    setTimeout(() => resolve('timeout'), DETOX_TIMEOUT_MS)
  })

  const result = await Promise.race([proc.exited, timeoutPromise])

  if (result === 'timeout') {
    console.info('\nDetox timed out, killing process...')
    proc.kill('SIGKILL')
    return 1
  }

  const exitCode = result

  if (exitCode === 0) {
    console.info('\nAll tests passed!')
  } else {
    console.info(`\nTests failed with exit code: ${exitCode}`)
  }

  return exitCode
}
