/**
 * Android-specific utilities for Detox test runners
 */

import { $ } from 'bun'
import { METRO_PORT, DETOX_SERVER_PORT } from './constants'

/**
 * Wait for Android device/emulator to be ready.
 * Blocks until the device has completed booting.
 */
export async function waitForDevice(): Promise<void> {
  console.info('\n--- Waiting for device ---')

  try {
    await $`adb wait-for-device`
    await $`adb shell 'while [ -z "$(getprop sys.boot_completed)" ]; do sleep 1; done'`
    console.info('Device is ready!')
  } catch (error) {
    const err = error as Error
    throw new Error(`Failed to wait for Android device: ${err.message}`)
  }
}

/**
 * Setup ADB reverse port forwarding for Metro and Detox server.
 * This allows the emulator to connect to services on the host machine.
 */
export async function setupAdbReverse(): Promise<void> {
  console.info('\n--- Setting up ADB reverse ---')

  try {
    // Metro bundler port
    await $`adb reverse tcp:${METRO_PORT} tcp:${METRO_PORT}`
    console.info(`Reversed port ${METRO_PORT} (Metro)`)

    // Detox server port
    await $`adb reverse tcp:${DETOX_SERVER_PORT} tcp:${DETOX_SERVER_PORT}`
    console.info(`Reversed port ${DETOX_SERVER_PORT} (Detox)`)
  } catch (error) {
    const err = error as Error
    throw new Error(
      `Failed to setup ADB reverse ports: ${err.message}\n` +
        'Make sure the Android emulator is running and adb is available.'
    )
  }
}

/**
 * Full Android device setup - wait for device and setup port forwarding.
 */
export async function setupAndroidDevice(): Promise<void> {
  await waitForDevice()
  await setupAdbReverse()
}
