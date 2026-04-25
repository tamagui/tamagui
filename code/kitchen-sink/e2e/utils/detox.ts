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
// Calling reloadReactNative immediately can hit "AppRegistryBinding::stopSurface
// failed. Global was not installed.", which leaves the app in a half-init state
// where the next isReady never resolves and the test hangs ~3min until timeout.
// A small grace period after launch and before reload reliably avoids the race.
const POST_LAUNCH_SETTLE_MS = 1500
const PRE_RELOAD_SETTLE_MS = 250

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * Launch app then disable sync. Must launch first so Detox can connect,
 * then disable sync before any main-thread-busy state can cause a hang.
 */
export async function safeLaunchApp(
  params?: Parameters<typeof device.launchApp>[0]
): Promise<void> {
  await device.launchApp({
    ...params,
    launchArgs: {
      ...DEFAULT_LAUNCH_ARGS,
      ...params?.launchArgs,
    },
  } as any)
  await device.disableSynchronization()
  await sleep(POST_LAUNCH_SETTLE_MS)
}

/**
 * Disable sync then reload. Sync must be off before reload because
 * the reload triggers a Metro re-bundle and the app's main thread
 * will be busy immediately after.
 */
export async function safeReloadApp(): Promise<void> {
  await device.disableSynchronization()
  await sleep(PRE_RELOAD_SETTLE_MS)
  await device.reloadReactNative()
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
