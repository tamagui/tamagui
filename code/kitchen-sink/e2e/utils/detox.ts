/**
 * Safe Detox device helpers
 *
 * KeyboardProvider and other native modules keep the main thread busy
 * on iOS, which prevents Detox synchronization from ever resolving.
 * These wrappers launch/reload the app then immediately disable sync
 * so subsequent operations (navigation, element queries) don't hang.
 *
 * Use these instead of calling device.launchApp / device.reloadReactNative directly.
 */

import { device } from 'detox'

/**
 * Launch app then disable sync. Must launch first so Detox can connect,
 * then disable sync before the main-thread-busy state causes a hang.
 */
export async function safeLaunchApp(
  params?: Parameters<typeof device.launchApp>[0]
): Promise<void> {
  await device.launchApp({
    ...params,
    launchArgs: {
      ...params?.launchArgs,
      detoxEnableSynchronization: 0,
    },
  } as any)
  await device.disableSynchronization()
}

/**
 * Disable sync then reload. Sync must be off before reload because
 * the reload triggers a Metro re-bundle and the app's main thread
 * will be busy immediately after.
 */
export async function safeReloadApp(): Promise<void> {
  await device.disableSynchronization()
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
