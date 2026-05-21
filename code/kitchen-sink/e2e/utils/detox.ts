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
const LAUNCH_MAX_ATTEMPTS = 3
const RETRYABLE_LAUNCH_PATTERNS = [
  'FBSOpenApplicationServiceErrorDomain',
  'FBSOpenApplicationErrorDomain',
  'Could not launch intent',
  'Failed to run application on the device',
]

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
    await withTimeout(
      device.disableSynchronization(),
      LATE_LAUNCH_ACTION_TIMEOUT_MS
    )
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
export async function safeLaunchApp(
  params?: LaunchAppParams
): Promise<void> {
  let lastError: unknown
  for (let attempt = 1; attempt <= LAUNCH_MAX_ATTEMPTS; attempt++) {
    try {
      lastLaunchParams = params
      await device.launchApp({
        ...params,
        launchArgs: {
          ...DEFAULT_LAUNCH_ARGS,
          ...params?.launchArgs,
        },
      } as any)
      await device.disableSynchronization()
      await sleep(POST_LAUNCH_SETTLE_MS)
      return
    } catch (err) {
      lastError = err
      if (attempt === LAUNCH_MAX_ATTEMPTS || !isRetryableLaunchError(err)) {
        if (await tryRecoverLateLaunch()) {
          return
        }
        throw err
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
