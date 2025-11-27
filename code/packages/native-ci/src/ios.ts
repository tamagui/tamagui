/**
 * iOS-specific utilities for Detox test runners
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'

/**
 * Ensure the ios/ folder has full prebuild structure for Metro.
 * In CI, the build job may only cache the .app file, so the test job needs
 * to regenerate the ios folder structure for Metro to work correctly.
 *
 * Metro needs the native project files (Podfile, *.xcodeproj) to properly
 * configure the JS bundle with native module information (global.expo.modules).
 *
 * We check for ios/Podfile as the indicator of a complete prebuild,
 * not just the existence of the ios/ folder.
 *
 * Uses --no-install to skip pod install (pods are not needed for Metro).
 */
export async function ensureIOSFolder(): Promise<void> {
  const podfilePath = join(process.cwd(), 'ios', 'Podfile')

  if (!existsSync(podfilePath)) {
    console.info('\n--- Generating ios/ folder (for Metro) ---')
    console.info('Note: ios/Podfile not found, running expo prebuild')
    try {
      await $`npx expo prebuild --platform ios --no-install`
      console.info('iOS folder generated!')
    } catch (error) {
      const err = error as Error
      throw new Error(`Failed to generate ios folder: ${err.message}`)
    }
  } else {
    console.info('iOS folder already exists (Podfile found)')
  }
}
