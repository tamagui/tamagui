/**
 * Android-specific utilities for Detox test runners
 */

import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { $ } from 'bun'
import { METRO_PORT, DETOX_SERVER_PORT } from './constants'

/** Standard APK paths relative to android folder */
const APK_PATHS = [
  'app/build/outputs/apk/debug/app-debug.apk',
  'app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
]

/**
 * Move APKs to a temporary location outside android/ to preserve them during prebuild.
 * Returns a function to restore them after prebuild completes.
 */
function preserveApks(androidPath: string): () => void {
  const tempDir = join(process.cwd(), '.apk-backup')
  const movedApks: Array<{ from: string; to: string }> = []

  // Move any existing APKs to temp location
  for (const relativePath of APK_PATHS) {
    const apkPath = join(androidPath, relativePath)
    if (existsSync(apkPath)) {
      const tempPath = join(tempDir, relativePath)
      mkdirSync(dirname(tempPath), { recursive: true })
      console.info(`  Preserving: ${relativePath}`)
      renameSync(apkPath, tempPath)
      movedApks.push({ from: apkPath, to: tempPath })
    }
  }

  // Return restore function
  return () => {
    for (const { from, to } of movedApks) {
      if (existsSync(to)) {
        mkdirSync(dirname(from), { recursive: true })
        console.info(`  Restoring: ${from.replace(androidPath + '/', '')}`)
        renameSync(to, from)
      }
    }
    // Clean up temp dir
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true })
    }
  }
}

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

/**
 * Ensure the android/ folder has full prebuild structure for Metro.
 * In CI, the build job only caches APKs (android/app/build/outputs/apk/...),
 * which creates the android/ folder but without the full prebuild structure.
 *
 * Metro needs the native project files (build.gradle, app/src/main/...) to
 * properly configure the JS bundle with native module information (global.expo.modules).
 *
 * We check for android/build.gradle as the indicator of a complete prebuild,
 * not just the existence of the android/ folder.
 *
 * IMPORTANT: Expo prebuild will detect a "malformed" project if only APKs exist
 * and automatically clear the android/ folder. We preserve APKs by moving them
 * to a temp location before prebuild, then restoring them after.
 */
export async function ensureAndroidFolder(): Promise<void> {
  const androidPath = join(process.cwd(), 'android')
  const buildGradlePath = join(androidPath, 'build.gradle')

  if (!existsSync(buildGradlePath)) {
    console.info('\n--- Generating android/ folder (for Metro) ---')
    console.info('Note: android/build.gradle not found, running expo prebuild')

    // Preserve any cached APKs before prebuild clears the folder
    const restoreApks = preserveApks(androidPath)

    try {
      await $`npx expo prebuild --platform android`
      console.info('Android folder generated!')
    } catch (error) {
      const err = error as Error
      throw new Error(`Failed to generate android folder: ${err.message}`)
    } finally {
      // Always restore APKs, even if prebuild fails
      restoreApks()
    }
  } else {
    console.info('Android folder already exists (build.gradle found)')
  }
}
