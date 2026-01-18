/**
 * iOS-specific utilities for Detox test runners
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'bun'
import { isCI } from './runner'

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

/**
 * Ensure the iOS app binary exists, building it if necessary.
 * On CI, this is a no-op since CI builds the app in a separate job.
 * Locally, this will build the app if the binary is missing.
 */
export async function ensureIOSApp(config: string = 'ios.sim.debug'): Promise<void> {
  // On CI, the app is built separately - don't build here
  if (isCI()) {
    console.info('CI detected - skipping local build check')
    return
  }

  // Check if app binary exists (use the path from detoxrc)
  const appPath = process.env.DETOX_IOS_APP_PATH ||
    'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'
  const fullAppPath = join(process.cwd(), appPath)

  if (existsSync(fullAppPath)) {
    console.info(`iOS app found at ${appPath}`)
    return
  }

  console.info(`\n--- iOS app not found at ${appPath}, building... ---`)

  // Ensure pods are installed first
  // Check for actual pod config files, not just the Pods directory (which may be incomplete)
  const podConfigPath = join(process.cwd(), 'ios', 'Pods', 'Target Support Files', 'Pods-tamaguikitchensink', 'Pods-tamaguikitchensink.debug.xcconfig')
  if (!existsSync(podConfigPath)) {
    console.info('Installing CocoaPods dependencies...')
    await $`pod install --project-directory=ios`
  }

  // Build the app using detox build
  console.info(`Building iOS app (config: ${config})...`)
  console.info('This may take a few minutes on first run.')
  await $`npx detox build -c ${config}`

  console.info('iOS app built successfully!')
}
