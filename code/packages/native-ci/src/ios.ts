/**
 * iOS-specific utilities for Detox test runners
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { $ } from 'bun'
import { isCI } from './runner'
import { generateFingerprint } from './fingerprint'

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

// local fingerprint cache file path
const IOS_FINGERPRINT_CACHE = '.ios-build-fingerprint.json'

interface FingerprintCache {
  fingerprint: string
  timestamp: string
  appPath: string
}

/**
 * Load the cached fingerprint for iOS builds
 */
function loadFingerprintCache(projectRoot: string): FingerprintCache | null {
  const cachePath = join(projectRoot, IOS_FINGERPRINT_CACHE)
  if (!existsSync(cachePath)) {
    return null
  }
  try {
    return JSON.parse(readFileSync(cachePath, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * Save the fingerprint cache
 */
function saveFingerprintCache(projectRoot: string, cache: FingerprintCache): void {
  const cachePath = join(projectRoot, IOS_FINGERPRINT_CACHE)
  writeFileSync(cachePath, JSON.stringify(cache, null, 2))
}

/**
 * Ensure the iOS app binary exists, building it if necessary.
 * On CI, this is a no-op since CI builds the app in a separate job.
 * Locally, this will build the app if the binary is missing OR if the
 * fingerprint has changed (indicating native dependencies changed).
 */
export async function ensureIOSApp(config: string = 'ios.sim.debug'): Promise<void> {
  // On CI, the app is built separately - don't build here
  if (isCI()) {
    console.info('CI detected - skipping local build check')
    return
  }

  const projectRoot = process.cwd()

  // Check if app binary exists (use the path from detoxrc)
  const appPath = process.env.DETOX_IOS_APP_PATH ||
    'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'
  const fullAppPath = join(projectRoot, appPath)
  const appExists = existsSync(fullAppPath)

  // Generate current fingerprint
  let currentFingerprint: string
  try {
    const result = await generateFingerprint({ platform: 'ios', projectRoot })
    currentFingerprint = result.hash
  } catch (err) {
    // if fingerprint generation fails, fall back to existence check
    console.warn('Could not generate fingerprint, falling back to existence check')
    if (appExists) {
      console.info(`iOS app found at ${appPath}`)
      return
    }
    // fall through to build
    currentFingerprint = ''
  }

  // Check cached fingerprint
  const cache = loadFingerprintCache(projectRoot)
  const fingerprintMatch = cache?.fingerprint === currentFingerprint && currentFingerprint !== ''

  if (appExists && fingerprintMatch) {
    console.info(`iOS app found at ${appPath} (fingerprint matches)`)
    return
  }

  // Determine why we're rebuilding
  if (appExists && !fingerprintMatch) {
    console.info(`\n--- iOS app exists but fingerprint changed, rebuilding... ---`)
    console.info(`Previous: ${cache?.fingerprint?.slice(0, 16) || 'none'}...`)
    console.info(`Current:  ${currentFingerprint.slice(0, 16)}...`)
  } else {
    console.info(`\n--- iOS app not found at ${appPath}, building... ---`)
  }

  // Ensure pods are installed first
  // Check for actual pod config files, not just the Pods directory (which may be incomplete)
  const podConfigPath = join(projectRoot, 'ios', 'Pods', 'Target Support Files', 'Pods-tamaguikitchensink', 'Pods-tamaguikitchensink.debug.xcconfig')
  if (!existsSync(podConfigPath)) {
    console.info('Installing CocoaPods dependencies...')
    await $`pod install --project-directory=ios`
  }

  // Build the app using detox build
  console.info(`Building iOS app (config: ${config})...`)
  console.info('This may take a few minutes on first run.')
  await $`npx detox build -c ${config}`

  // Save the fingerprint cache
  if (currentFingerprint) {
    saveFingerprintCache(projectRoot, {
      fingerprint: currentFingerprint,
      timestamp: new Date().toISOString(),
      appPath,
    })
    console.info('Saved build fingerprint to cache')
  }

  console.info('iOS app built successfully!')
}
