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
 * Regenerate the android/ folder for Metro while preserving cached APKs.
 *
 * Unlike iOS where we only cache the .app binary, Android caches the full android/ folder.
 * However, Metro needs a fresh prebuild that matches the current node_modules.
 *
 * If we skip prebuild when build.gradle exists (from cache), the native project config
 * might be stale and not match what the current node_modules expect. This causes
 * runtime errors when the app tries to load native modules.
 *
 * The solution is to ALWAYS regenerate the android folder (like iOS does) while
 * preserving the cached APKs. This ensures:
 * 1. Metro has fresh native project config matching current node_modules
 * 2. We still benefit from cached APKs (no need to rebuild)
 *
 * IMPORTANT: Expo prebuild will clear the android/ folder. We preserve APKs by
 * moving them to a temp location before prebuild, then restoring them after.
 */
export async function ensureAndroidFolder(): Promise<void> {
  const androidPath = join(process.cwd(), 'android')

  console.info('\n--- Regenerating android/ folder (for Metro) ---')

  // Preserve any cached APKs before prebuild clears the folder
  const restoreApks = preserveApks(androidPath)

  try {
    await $`npx expo prebuild --platform android --clean`
    console.info('Android folder generated!')
  } catch (error) {
    const err = error as Error
    throw new Error(`Failed to generate android folder: ${err.message}`)
  } finally {
    // Always restore APKs, even if prebuild fails
    restoreApks()
  }
}
