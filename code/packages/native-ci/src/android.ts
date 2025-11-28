/**
 * Android-specific utilities for Detox test runners
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'
import { METRO_PORT, DETOX_SERVER_PORT } from './constants'

/**
 * Wait for Android device/emulator to be ready.
 * Times out after 30 seconds if no device is available.
 */
export async function waitForDevice(): Promise<void> {
  console.info('\n--- Waiting for device ---')

  // Check if any device is connected first (with a quick timeout)
  try {
    const result = await $`adb devices`.quiet()
    const lines = result.stdout.toString().split('\n').filter(line => line.includes('\tdevice'))
    if (lines.length === 0) {
      throw new Error('No Android device/emulator connected. Please start an emulator first.')
    }
  } catch (error) {
    const err = error as Error
    throw new Error(`No Android device available: ${err.message}`)
  }

  try {
    // Wait for device to be fully booted (with timeout)
    await $`timeout 30 adb wait-for-device`.quiet()
    await $`timeout 60 adb shell 'while [ -z "$(getprop sys.boot_completed)" ]; do sleep 1; done'`.quiet()
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

/**
 * Ensure the android/ folder has full prebuild structure for Metro.
 * In CI, the build job caches the entire android/ folder (including APKs and test files).
 * The test job restores this cache and should NOT regenerate it.
 *
 * Why we DON'T always regenerate (unlike a previous approach):
 * - The cached android/ folder includes DetoxTest.java and other manually-added test files
 * - Running `expo prebuild --clean` would DELETE these critical test infrastructure files
 * - The cached folder's fingerprint already ensures it's in sync with node_modules
 *
 * We check for android/build.gradle as the indicator of a complete prebuild.
 * Only regenerate if the folder is missing or incomplete.
 */
export async function ensureAndroidFolder(): Promise<void> {
  const buildGradlePath = join(process.cwd(), 'android', 'build.gradle')

  if (existsSync(buildGradlePath)) {
    console.info('Android folder already exists (build.gradle found)')
    return
  }

  console.info('\n--- Generating android/ folder (for Metro) ---')
  console.info('Note: android/build.gradle not found, running expo prebuild')

  try {
    await $`npx expo prebuild --platform android`
    console.info('Android folder generated!')
  } catch (error) {
    const err = error as Error
    throw new Error(`Failed to generate android folder: ${err.message}`)
  }
}
