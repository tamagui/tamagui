/**
 * iOS-specific utilities for Detox test runners
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'

/**
 * Ensure the ios/ folder exists for Metro to properly configure bundles.
 * In CI, the build job may only cache the .app file, so the test job needs
 * to regenerate the ios folder structure for Metro to work correctly.
 *
 * Uses --no-install to skip pod install (which happens separately in CI).
 */
export async function ensureIOSFolder(): Promise<void> {
  const iosPath = join(process.cwd(), 'ios')

  if (!existsSync(iosPath)) {
    console.info('\n--- Generating ios/ folder (for Metro) ---')
    try {
      await $`npx expo prebuild --platform ios --no-install`
      console.info('iOS folder generated!')
    } catch (error) {
      const err = error as Error
      throw new Error(`Failed to generate ios folder: ${err.message}`)
    }
  } else {
    console.info('iOS folder already exists')
  }
}
