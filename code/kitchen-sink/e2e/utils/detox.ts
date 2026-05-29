/**
 * Safe Detox device helpers
 *
 * Root cause of the hangs we used to see: KeyboardProvider's continuous main-
 * thread keyboard-state monitoring delays RCTContentDidAppearNotification,
 * which Detox waits on to flip isReady=true after each launch/reload. When
 * isReady stays false the next `isReady` action hangs until the test timeout.
 *
 * Fix: default-disable KeyboardProvider via the disableKeyboardController
 * launch arg (read in App.native.tsx). Tests that need the keyboard pass
 * disableKeyboardController: false explicitly.
 *
 * We also still belt-and-suspender: pass detoxEnableSynchronization: 0 and
 * call device.disableSynchronization() after launch, so any other always-busy
 * native module (reanimated worklets, animation drivers) can't reintroduce
 * the same hang.
 */

import { device } from 'detox'

const DEFAULT_LAUNCH_ARGS = {
  disableKeyboardController: true,
  detoxEnableSynchronization: 0,
}

// Detox returns from launchApp once RCTContentDidAppearNotification fires, but
// the JSI global / surface bindings can still be settling for a beat after.
const POST_LAUNCH_SETTLE_MS = 1500

// Simulators/emulators can refuse a launch even though the app is installed.
// Sleeping briefly and re-launching nearly always recovers.
const LAUNCH_RETRY_DELAY_MS = 3000
const LATE_LAUNCH_READY_DELAY_MS = 8000
const LATE_LAUNCH_ACTION_TIMEOUT_MS = 5000
const RETRYABLE_LAUNCH_PATTERNS = [
  'FBSOpenApplicationServiceErrorDomain',
  'FBSOpenApplicationErrorDomain',
  'Could not launch intent',
  'Failed to run application on the device',
]

// Per-attempt launch+connect bound. Healthy launches on CI sims land ~30-45s (cold
// beforeAll launch with the full bundle eval); 70s tolerates a slow spike while still
// fitting a recovery relaunch in the deadline below. A worst case where it fires on a
// genuinely-healthy launch just costs one extra relaunch - the test still passes.
const LAUNCH_CONNECT_TIMEOUT_MS = 70000

// terminateApp during recovery is best-effort and must never hang the path.
const TERMINATE_TIMEOUT_MS = 15000

// Total wall-time safeLaunchApp may spend recovering before it gives up. Kept under
// jest's 180s beforeEach/test hook timeout so a flaky launch is recovered (or the
// breaker tripped + a clean error thrown) from inside the hook, rather than jest
// killing the hook from the outside with no chance to recover or fast-fail. The
// reserve below keeps disableSync + settle inside this window too.
const LAUNCH_RECOVERY_DEADLINE_MS = 165000

// disableSynchronization is near-instant on a healthy app but can hang on a
// wedged one; it runs in every test's beforeEach (via safeReloadApp), so bound
// it tightly to avoid burning the full hook timeout here before we even attempt
// the (also-bounded) launch.
const DISABLE_SYNC_TIMEOUT_MS = 20000

// Once a launch demonstrably can't connect to Detox (flaky simulator / app
// registration, not a test bug), every later launch/reload in the SAME test file
// hangs the same way. Trip this so the rest of THIS file's tests fail instantly
// rather than each burning the full hook timeout. Note: jest isolates the module
// registry per test file, so this resets per file (it does not carry across files
// in a shard) and resets on detox's process-level retry. See memory
// project_detox_app_connect_runaway.
let appLaunchUnrecoverable = false

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
type LaunchAppParams = Parameters<typeof device.launchApp>[0]

let lastLaunchParams: LaunchAppParams | undefined

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
      }),
    ])
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}

const isRetryableLaunchError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err)
  return RETRYABLE_LAUNCH_PATTERNS.some((p) => msg.includes(p))
}

const isTimeoutError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('timed out after')
}

// Force-kill the app between recovery attempts. The next launchApp({ newInstance })
// also terminates the prior instance, so this is belt-and-suspenders; bound it so a
// stuck terminate can't eat the recovery budget.
const safeTerminate = async (): Promise<void> => {
  try {
    await withTimeout(device.terminateApp(), TERMINATE_TIMEOUT_MS)
  } catch {
    // best-effort
  }
}

const tryRecoverLateLaunch = async (): Promise<boolean> => {
  if (device.getPlatform() !== 'android') {
    return false
  }

  await sleep(LATE_LAUNCH_READY_DELAY_MS)

  try {
    await withTimeout(device.disableSynchronization(), LATE_LAUNCH_ACTION_TIMEOUT_MS)
    await sleep(POST_LAUNCH_SETTLE_MS)
    return true
  } catch {
    return false
  }
}

/**
 * Launch app then disable sync. Must launch first so Detox can connect,
 * then disable sync before any main-thread-busy state can cause a hang.
 */
export async function safeLaunchApp(params?: LaunchAppParams): Promise<void> {
  // breaker tripped earlier in this run: the app can't connect to Detox, so don't
  // waste another launch window, fail this file's beforeAll instantly.
  if (appLaunchUnrecoverable) {
    throw new Error(
      'skipping launchApp: a previous launch could not connect to Detox in this run ' +
        '(flaky simulator/app-registration). failing fast instead of hanging.'
    )
  }

  lastLaunchParams = params
  const deadline = Date.now() + LAUNCH_RECOVERY_DEADLINE_MS
  // reserve enough of the window for the post-launch disableSync + settle so a
  // successful launch near the deadline still finishes inside the hook budget.
  const reserveMs = DISABLE_SYNC_TIMEOUT_MS + POST_LAUNCH_SETTLE_MS + 2000
  let attemptParams = params
  let attempt = 0
  let lastError: unknown

  while (true) {
    const launchBudget = deadline - Date.now() - reserveMs
    if (launchBudget <= 0) {
      break
    }
    attempt++
    try {
      // bound the launch+connect AND the disableSync: either hanging means the app
      // didn't come up cleanly, so we treat it as a failed attempt and recover below
      // rather than letting jest kill the hook at 180s.
      await withTimeout(
        device.launchApp({
          ...attemptParams,
          launchArgs: {
            ...DEFAULT_LAUNCH_ARGS,
            ...attemptParams?.launchArgs,
          },
        } as any),
        Math.min(LAUNCH_CONNECT_TIMEOUT_MS, launchBudget)
      )
      await withTimeout(device.disableSynchronization(), DISABLE_SYNC_TIMEOUT_MS)
      await sleep(POST_LAUNCH_SETTLE_MS)
      return
    } catch (err) {
      lastError = err
      // android can connect a beat late; recover in place without relaunching.
      if (await tryRecoverLateLaunch()) {
        return
      }

      const timedOut = isTimeoutError(err)
      const retryableSim = isRetryableLaunchError(err)
      if (!(timedOut || retryableSim)) {
        // unknown error - don't burn the budget spinning on it.
        break
      }

      if (timedOut) {
        // the app process is likely up but never connected to Detox (or sync got
        // stuck); force-kill it and force a fresh instance for the next attempt.
        await safeTerminate()
        attemptParams = { ...attemptParams, newInstance: true }
      }

      if (deadline - Date.now() - reserveMs - LAUNCH_RETRY_DELAY_MS <= 0) {
        // no budget for another full attempt; give up to the breaker below.
        break
      }
      console.warn(
        `safeLaunchApp: attempt ${attempt} failed (${timedOut ? 'connect timeout' : 'simulator error'}), retrying after ${LAUNCH_RETRY_DELAY_MS}ms`,
        err instanceof Error ? err.message : err
      )
      await sleep(LAUNCH_RETRY_DELAY_MS)
    }
  }

  // recovery window exhausted: trip the breaker so the rest of THIS file's
  // tests/reloads fail instantly instead of each hanging the full hook timeout.
  appLaunchUnrecoverable = true
  throw lastError ?? new Error('safeLaunchApp: launch recovery deadline exceeded')
}

/**
 * Disable sync before resetting the app, then start a fresh instance while
 * preserving the suite's launch args.
 *
 * Sync must be off before reset because the app can become busy immediately.
 * RN reload can hit "Global was not installed" while a Fabric surface is
 * settling, leaving the app redboxed and Detox waiting on reactNativeReload.
 */
export async function safeReloadApp(): Promise<void> {
  // breaker tripped earlier in this file: a reload will hang the same way, so
  // fail this beforeEach instantly instead of burning the disableSync + launch
  // windows again.
  if (appLaunchUnrecoverable) {
    throw new Error(
      'skipping reload: a previous launch could not connect to Detox in this file. failing fast instead of hanging.'
    )
  }
  // bound disableSynchronization: on a wedged app it can hang, and it runs in
  // every test's beforeEach. if it hangs the launch below (also bounded + breaker)
  // surfaces the real failure.
  try {
    await withTimeout(device.disableSynchronization(), DISABLE_SYNC_TIMEOUT_MS)
  } catch {
    // best-effort
  }
  await safeLaunchApp({
    ...lastLaunchParams,
    newInstance: true,
  })
}

/**
 * Enable sync briefly for a tap interaction, then disable again.
 * RN 0.83 Fabric requires sync enabled for tap delivery;
 * swipe gestures work without sync.
 */
export async function withSync<T>(fn: () => Promise<T>): Promise<T> {
  await device.enableSynchronization()
  try {
    return await fn()
  } finally {
    await device.disableSynchronization()
  }
}
