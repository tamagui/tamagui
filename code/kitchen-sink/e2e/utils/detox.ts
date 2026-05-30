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

import { by, device, element, waitFor } from 'detox'

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
const LAUNCH_MAX_ATTEMPTS = 3
const RETRYABLE_LAUNCH_PATTERNS = [
  'FBSOpenApplicationServiceErrorDomain',
  'FBSOpenApplicationErrorDomain',
  'Could not launch intent',
  'Failed to run application on the device',
]

// A healthy launch+connect is well under this even on a cold (Metro pre-warmed)
// CI bundle, so if it fires the app is hanging, not slow. Bounding it below
// jest's 180s hook timeout lets safeLaunchApp catch the hang itself (and trip the
// breaker below) instead of jest killing the beforeAll hook from the outside.
const LAUNCH_CONNECT_TIMEOUT_MS = 120000

// Once a launch demonstrably can't connect to Detox (flaky simulator / app
// registration, not a test bug), every later launch in this jest process hangs
// the same way. Trip this so the rest of the shard's files fail instantly rather
// than each burning the full hook timeout x retries (the ~50min runaway in
// memory project_detox_app_connect_runaway). Resets naturally on detox's
// process-level retry.
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

  let lastError: unknown
  for (let attempt = 1; attempt <= LAUNCH_MAX_ATTEMPTS; attempt++) {
    try {
      lastLaunchParams = params
      // bound the launch+connect so a hang throws here (caught below) instead of
      // jest killing the hook at 180s with no chance to trip the breaker.
      await withTimeout(
        device.launchApp({
          ...params,
          launchArgs: {
            ...DEFAULT_LAUNCH_ARGS,
            ...params?.launchArgs,
          },
        } as any),
        LAUNCH_CONNECT_TIMEOUT_MS
      )
      await device.disableSynchronization()
      await sleep(POST_LAUNCH_SETTLE_MS)
      return
    } catch (err) {
      lastError = err
      if (attempt === LAUNCH_MAX_ATTEMPTS || !isRetryableLaunchError(err)) {
        if (await tryRecoverLateLaunch()) {
          return
        }
        break
      }

      if (await tryRecoverLateLaunch()) {
        return
      }

      console.warn(
        `safeLaunchApp: attempt ${attempt}/${LAUNCH_MAX_ATTEMPTS} failed with retryable simulator error, retrying after ${LAUNCH_RETRY_DELAY_MS}ms`,
        err instanceof Error ? err.message : err
      )
      await sleep(LAUNCH_RETRY_DELAY_MS)
    }
  }

  // gave up after all attempts: trip the breaker so the rest of this shard's
  // files fail instantly instead of each hanging the full hook timeout x retries.
  appLaunchUnrecoverable = true
  throw lastError
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
  await device.disableSynchronization()
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

/**
 * Relaunch straight into a single use case via the `directUseCase` launch arg.
 *
 * The app renders that use-case component at the root (inside all the providers:
 * Portal, GestureHandler, SafeArea, Keyboard, tamagui Provider), bypassing the
 * home screen → quick-nav navigation that safeReloadApp + navigateToTestCase
 * paid (~60-90s/test). safeLaunchApp leaves sync disabled. This both isolates
 * each test (newInstance) and removes the navigation cost.
 *
 * `useCase` must match a component export in src/usecases (the same name passed
 * to navigateToTestCase). `waitForId` is a testID rendered by that case.
 */
export async function reloadUseCase(
  useCase: string,
  waitForId: string,
  extraLaunchArgs?: Record<string, unknown>
): Promise<void> {
  await safeLaunchApp({
    newInstance: true,
    launchArgs: { directUseCase: useCase, ...extraLaunchArgs },
  })
  await waitFor(element(by.id(waitForId)))
    .toExist()
    .withTimeout(180000)
}
