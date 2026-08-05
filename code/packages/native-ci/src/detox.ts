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
  /** Specific test files to run (passed as positional args to detox) */
  testFiles?: string[]
}

/**
 * Parse common CLI arguments for Detox runners
 */
export function parseDetoxArgs(platform: Platform) {
  const defaultConfig = platform === 'ios' ? 'ios.sim.debug' : 'android.emu.ci.debug'

  const { values, positionals } = parseArgs({
    options: {
      config: { type: 'string', default: defaultConfig },
      'project-root': { type: 'string', default: process.cwd() },
      headless: { type: 'boolean', default: false },
      'record-logs': { type: 'string', default: 'all' },
      retries: { type: 'string', default: '0' },
      workers: { type: 'string', default: '1' },
    },
    allowPositionals: true,
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
    testFiles: positionals.length > 0 ? positionals : undefined,
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

  // append specific test files if provided (for CI sharding)
  if (options.testFiles && options.testFiles.length > 0) {
    args.push(...options.testFiles)
  }

  return args
}

// 60 min timeout for detox tests (in ms). the heaviest shard's real work is ~38min
// (cold metro bundle + per-test app reloads), so 45min left too little margin; the
// workflow job timeout is 90min, leaving room for setup + this run.
const DETOX_TIMEOUT_MS = 60 * 60 * 1000

// Connect-flake retry: a single beforeAll launchApp that can't connect to Detox on a
// degraded runner fails the whole spec file (all its tests fail off the one hook), and
// nothing retries beforeAll (jest.retryTimes only re-runs individual tests; detox
// --retries is held at 0 to avoid blanket whole-file retry wall-time). So we retry the
// failed files ONCE, but ONLY when every failed file's failure carries the launch/connect
// flake signature - never on a real assertion failure. This is safe by construction: a
// real failure fails again on retry, so a misclassification can only cost one extra file
// run, never mask a genuine bug. See memory project_detox_app_connect_runaway.
const MAX_CONNECT_FLAKE_RETRIES = 1

// Signatures that mark a spec file's failure as the launch/connect flake rather than a
// real test failure. Matched against the ANSI-stripped per-file FAIL block.
//   - "for a hook" - jest hook (beforeAll/beforeEach) timeout; real test timeouts say
//     "for a test", so this never matches an assertion failure.
//   - "timed out after <n>ms" - lowercase message thrown by our withTimeout() wrapper,
//     used ONLY by safeLaunchApp/safeReloadApp/safeTerminate; detox's own waitFor emits
//     capital "Timed out after <n>ms waiting for", so the lowercase form is launch-only.
//   - the safeLaunchApp/safeReloadApp breaker messages.
//   - "FBSOpenApplicationServiceErrorDomain" - simulator can't launch the app (same
//     pattern as RETRYABLE_LAUNCH_PATTERNS in detox utils; never appears in assertions).
//   - "while tearing down Detox environment" - teardown hang, usually from ws close
//     lingering after a prior file's crash; never caused by test logic.
//   - "Detox worker instance has not been installed" - cascading failure when a prior
//     file's teardown corrupted the worker; the test itself never ran.
const CONNECT_FLAKE_SIGNATURES: RegExp[] = [
  /Exceeded timeout of \d+ ?ms for a hook/,
  /Exceeded timeout of \d+ ?ms while tearing down/,
  /Exceeded timeout of \d+ ?ms while handling jest-circus/,
  /\btimed out after \d+ms/,
  /could not connect to Detox/,
  /launch recovery deadline exceeded/,
  /skipping launchApp:/,
  /skipping reload:/,
  /FBSOpenApplicationServiceErrorDomain/,
  /FBSOpenApplicationErrorDomain/,
  /Waited for the root of the view hierarchy to have window focus/,
  /Detox worker instance has not been installed/,
]
// Signatures that indicate a real test failure (assertion/logic error). When present,
// the file is classified as real even if flake signatures also appear (e.g., a teardown
// timeout that cascaded from a real assertion failure).
const REAL_FAILURE_SIGNATURES: RegExp[] = [
  /Exceeded timeout of \d+ ?ms while waiting for/,
  /expect\([^)]+\)\.to/,
  /AssertionError:/,
  /(?<!Runtime)Error: (?!.*timed out after)/,
]
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g
interface DetoxFailureClassification {
  /** every spec file with a FAIL line */
  failedFiles: string[]
  /** failed files whose failure matches a connect-flake signature (retry candidates) */
  flakeFiles: string[]
  /** failed files whose failure looks real (assertion/logic) - never retried */
  realFiles: string[]
}
/**
 * Classify a detox/jest run's combined output into connect-flake vs real failures,
 * per spec file. jest prints each file's `FAIL e2e/X.test.ts` line followed by that
 * file's failure detail (the ● blocks) before the next PASS/FAIL line, so the text
 * between one FAIL line and the next delimiter is that file's failure block.
 *
 * Exported for unit testing against real CI logs.
 */
export function classifyDetoxFailures(rawOutput: string): DetoxFailureClassification {
  const output = rawOutput.replace(ANSI_PATTERN, '')
  // delimiter = any "PASS e2e/..." or "FAIL e2e/..." occurrence (not anchored: real CI
  // logs may carry a leading timestamp/prefix on the line).
  const delimiter = /(PASS|FAIL) (e2e\/[^\s):]+\.test\.ts)/g
  const marks: { kind: string; file: string; index: number }[] = []
  for (const m of output.matchAll(delimiter)) {
    marks.push({ kind: m[1], file: m[2], index: m.index ?? 0 })
  }
  const failedFiles: string[] = []
  const flakeFiles: string[] = []
  const realFiles: string[] = []
  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i]
    if (mark.kind !== 'FAIL') continue
    const blockEnd = i + 1 < marks.length ? marks[i + 1].index : output.length
    const block = output.slice(mark.index, blockEnd)
    if (failedFiles.includes(mark.file)) continue
    failedFiles.push(mark.file)
    // Check for real failures first - if present, don't retry even if flake patterns exist
    const isReal = REAL_FAILURE_SIGNATURES.some((sig) => sig.test(block))
    if (isReal) {
      realFiles.push(mark.file)
    } else {
      const isFlake = CONNECT_FLAKE_SIGNATURES.some((sig) => sig.test(block))
      if (isFlake) {
        flakeFiles.push(mark.file)
      } else {
        realFiles.push(mark.file)
      }
    }
  }
  return { failedFiles, flakeFiles, realFiles }
}

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
 * Spawn one `npx detox test ...` invocation, streaming its output live to the CI log
 * while also capturing it (ANSI included) so we can classify failures afterwards.
 *
 * @returns the process exit code and the full combined stdout+stderr text.
 */
async function spawnDetoxOnce(
  detoxArgs: string[],
  testFiles: string[] = []
): Promise<{ exitCode: number; output: string }> {
  console.info('\n--- Running Detox tests ---')
  console.info(`Using fixed Detox server port: ${DETOX_SERVER_PORT}`)
  console.info(`Command: npx ${detoxArgs.join(' ')}`)

  // pipe (not inherit) so we can capture output for flake classification; tee each
  // chunk straight back to our stdout/stderr so the live CI log is unchanged.
  const proc = Bun.spawn(['npx', ...detoxArgs], {
    env: {
      ...process.env,
      DETOX_SERVER_PORT: String(DETOX_SERVER_PORT),
      TAMAGUI_DETOX_TEST_FILES: testFiles.join(' '),
    },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const decoder = new TextDecoder()
  let output = ''
  const tee = async (
    stream: ReadableStream<Uint8Array>,
    sink: NodeJS.WriteStream
  ): Promise<void> => {
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      sink.write(value)
      output += decoder.decode(value, { stream: true })
    }
  }

  const pumps = Promise.all([
    tee(proc.stdout, process.stdout),
    tee(proc.stderr, process.stderr),
  ])

  const timeoutPromise = new Promise<'timeout'>((resolve) => {
    setTimeout(() => resolve('timeout'), DETOX_TIMEOUT_MS)
  })

  const result = await Promise.race([proc.exited, timeoutPromise])

  if (result === 'timeout') {
    console.info('\nDetox timed out, killing process...')
    proc.kill('SIGKILL')
    return { exitCode: 1, output }
  }

  // drain any buffered output the process emitted right before exit
  await pumps
  return { exitCode: result, output }
}

/**
 * Run Detox tests with the given options.
 *
 * On failure, retries the failed spec files ONCE when (and only when) every failed
 * file's failure carries the launch/connect flake signature - this recovers the
 * beforeAll-launch flake that jest.retryTimes can't, without reintroducing blanket
 * whole-file retries. Real failures are never retried (and would fail again anyway).
 *
 * @returns Exit code from Detox
 */
export async function runDetoxTests(options: DetoxRunnerOptions): Promise<number> {
  // Reset lock file to prevent ECOMPROMISED errors in CI
  // This clears stale locks from previous runs that can cause "Unable to update lock within the stale threshold" errors
  await resetDetoxLockFile()

  const detoxArgs = buildDetoxArgs(options)
  const { exitCode, output } = await spawnDetoxOnce(detoxArgs, options.testFiles ?? [])

  if (exitCode === 0) {
    console.info('\nAll tests passed!')
    return 0
  }
  console.info(`\nTests failed with exit code: ${exitCode}`)

  const { flakeFiles, realFiles } = classifyDetoxFailures(output)

  // nothing to retry: either we couldn't attribute the failure to specific files, or a
  // real (non-flake) failure is present - in both cases surface the original result.
  if (flakeFiles.length === 0) {
    return exitCode
  }
  if (realFiles.length > 0) {
    console.info(
      `\nReal test failure(s) present (${realFiles.join(', ')}); not retrying the ` +
        `connect-flaked file(s).`
    )
    return exitCode
  }

  for (let attempt = 1; attempt <= MAX_CONNECT_FLAKE_RETRIES; attempt++) {
    console.info(
      `\n::warning::Detox launch-connect flake detected (beforeAll could not connect to ` +
        `Detox). Retry ${attempt}/${MAX_CONNECT_FLAKE_RETRIES} of: ${flakeFiles.join(', ')}`
    )
    // fresh lock file before the retry so a stale lock from the wedged run can't
    // immediately re-trip the same connect failure.
    await resetDetoxLockFile()

    const retryArgs = buildDetoxArgs({ ...options, testFiles: flakeFiles })
    const retry = await spawnDetoxOnce(retryArgs, flakeFiles)
    if (retry.exitCode === 0) {
      console.info(
        `\n✓ Recovered ${flakeFiles.length} connect-flaked file(s) on retry ${attempt}.`
      )
      return 0
    }

    // if the retry surfaced a real failure (the flake cleared but a genuine bug is
    // underneath), stop retrying and surface it.
    const retryClass = classifyDetoxFailures(retry.output)
    if (retryClass.realFiles.length > 0 || retryClass.flakeFiles.length === 0) {
      console.info('\nRetry surfaced a non-flake failure; surfacing it.')
      return retry.exitCode
    }
    // still a pure connect-flake - loop will retry again if budget remains.
    flakeFiles.length = 0
    flakeFiles.push(...retryClass.flakeFiles)
  }

  console.info('\nConnect-flake retries exhausted; tests still failing.')
  return 1
}
