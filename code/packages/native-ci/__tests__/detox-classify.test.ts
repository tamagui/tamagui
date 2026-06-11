/**
 * Unit tests for classifyDetoxFailures - the connect-flake vs real-failure classifier
 * that drives the targeted retry in runDetoxTests.
 *
 * Fixtures are faithful slices of two real CI failures:
 *   - run 27021194934 (2026-06-05): noRngh beforeAll hook timeout ("for a hook")
 *   - run 27175651901 (2026-06-09): PointerEvents safeLaunchApp connect timeout
 *     ("timed out after 70000ms" thrown from e2e/utils/detox.ts:84)
 * plus a synthetic real assertion failure that must NOT be treated as a flake.
 */

import { test, expect } from 'bun:test'
import { buildDetoxArgs, classifyDetoxFailures } from '../src/detox'

// June 9: PointerEvents beforeAll launch could not connect; noRngh passed this run.
const JUNE9_CONNECT_TIMEOUT = `
PASS e2e/PressStyleNative.noRngh.test.ts (434.576 s)
  PressStyleNative (no RNGH)
    ✓ should render the test case screen (1200 ms)
FAIL e2e/PointerEvents.test.ts (188.462 s)
  PointerEvents
    ✕ should render the test case (4 ms)
    ✕ should fire pointerDown and pointerUp on tap
  ● PointerEvents › should render the test case

    timed out after 70000ms

      82 |       promise,
      83 |       new Promise<never>((_, reject) => {
    > 84 |         timeout = setTimeout(() => reject(new Error(\`timed out after \${ms}ms\`)), ms)
         |                                           ^
      at Timeout.<anonymous> (e2e/utils/detox.ts:84:43)

Test Suites: 1 failed, 1 skipped, 5 passed, 6 of 7 total
Tests:       6 failed, 7 skipped, 19 passed, 32 total
`

// June 5: noRngh beforeAll exceeded the jest hook timeout; other files passed.
const JUNE5_HOOK_TIMEOUT = `
FAIL e2e/PressStyleNative.noRngh.test.ts (573.804 s)
  PressStyleNative (no RNGH)
    ✕ should render the test case screen (50 ms)
  ● PressStyleNative (no RNGH) › should render the test case screen

    thrown: "Exceeded timeout of 180000 ms for a hook.
    Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

PASS e2e/TabsOnInteraction.test.ts (67.079 s)
PASS e2e/ShorthandVariables.test.ts (79.351 s)
PASS e2e/check-rngh-status.test.ts (47 s)
Test Suites: 1 failed, 1 skipped, 5 passed, 6 of 7 total
Tests:       9 failed, 7 skipped, 16 passed, 32 total
`

// A genuine assertion failure - the press count didn't update. Uses detox's REAL
// expectation-timeout wording from Timer.js: "Exceeded timeout of <n>ms while ...".
// Note the prefix collides with jest's hook timeout ("Exceeded timeout of <n> ms for
// a hook"); the flake signature requires " ms for a hook", so detox's "5000ms while"
// (no space, "while") must NOT match.
const REAL_ASSERTION_FAILURE = `
FAIL e2e/PressStyleNative.test.ts (42.1 s)
  PressStyleNative
    ✓ should render the test case screen (900 ms)
    ✕ should fire pressIn and pressOut events on tap (5300 ms)
  ● PressStyleNative › should fire pressIn and pressOut events on tap

    Exceeded timeout of 5000ms while waiting for element at by.id("simple-press-in-count") to have text "In: 1"

      at e2e/PressStyleNative.test.ts:58:8

Test Suites: 1 failed, 6 passed, 7 of 7 total
Tests:       1 failed, 31 passed, 32 total
`

test('classifies a safeLaunchApp connect timeout as a flake', () => {
  const { failedFiles, flakeFiles, realFiles } =
    classifyDetoxFailures(JUNE9_CONNECT_TIMEOUT)
  expect(failedFiles).toEqual(['e2e/PointerEvents.test.ts'])
  expect(flakeFiles).toEqual(['e2e/PointerEvents.test.ts'])
  expect(realFiles).toEqual([])
})

test('classifies a beforeAll hook timeout as a flake', () => {
  const { failedFiles, flakeFiles, realFiles } = classifyDetoxFailures(JUNE5_HOOK_TIMEOUT)
  expect(failedFiles).toEqual(['e2e/PressStyleNative.noRngh.test.ts'])
  expect(flakeFiles).toEqual(['e2e/PressStyleNative.noRngh.test.ts'])
  expect(realFiles).toEqual([])
})

test('does NOT treat a real assertion failure as a flake', () => {
  const { failedFiles, flakeFiles, realFiles } =
    classifyDetoxFailures(REAL_ASSERTION_FAILURE)
  expect(failedFiles).toEqual(['e2e/PressStyleNative.test.ts'])
  expect(flakeFiles).toEqual([])
  expect(realFiles).toEqual(['e2e/PressStyleNative.test.ts'])
})

test('detox expectation timeout "Exceeded timeout of <n>ms while ..." is NOT a flake', () => {
  // the near-collision case: shares the "Exceeded timeout of" prefix with the jest hook
  // timeout, but lacks " ms for a hook", so it must be classified real (no retry).
  const { flakeFiles, realFiles } = classifyDetoxFailures(REAL_ASSERTION_FAILURE)
  expect(flakeFiles).toEqual([])
  expect(realFiles).toEqual(['e2e/PressStyleNative.test.ts'])
})

test('mixed flake + real failure: real keeps the file out of the retry set', () => {
  const mixed = JUNE9_CONNECT_TIMEOUT + REAL_ASSERTION_FAILURE
  const { flakeFiles, realFiles } = classifyDetoxFailures(mixed)
  expect(flakeFiles).toEqual(['e2e/PointerEvents.test.ts'])
  expect(realFiles).toEqual(['e2e/PressStyleNative.test.ts'])
})

test('strips ANSI color codes before matching', () => {
  const colored = `FAIL e2e/PointerEvents.test.ts (188.4 s)\n  ● x\n    [31mtimed out after 70000ms[39m\n`
  const { flakeFiles } = classifyDetoxFailures(colored)
  expect(flakeFiles).toEqual(['e2e/PointerEvents.test.ts'])
})

test('all-pass output yields no failures', () => {
  const passing = `
PASS e2e/PointerEvents.test.ts (120 s)
PASS e2e/TabsOnInteraction.test.ts (67 s)
Test Suites: 7 passed, 7 total
Tests:       32 passed, 32 total
`
  const { failedFiles, flakeFiles, realFiles } = classifyDetoxFailures(passing)
  expect(failedFiles).toEqual([])
  expect(flakeFiles).toEqual([])
  expect(realFiles).toEqual([])
})

test('builds Detox args with reuse only when requested', () => {
  const base = {
    config: 'ios.sim.debug',
    projectRoot: '/tmp/app',
    recordLogs: 'failing',
    retries: 0,
  }

  expect(buildDetoxArgs(base)).not.toContain('--reuse')
  expect(buildDetoxArgs({ ...base, reuse: true })).toContain('--reuse')
})
