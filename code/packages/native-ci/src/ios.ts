/**
 * iOS-specific utilities for Detox test runners
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { $ } from 'bun'
import { isCI } from './runner'
import { generateFingerprint } from './fingerprint'

/**
 * Shutdown all simulators and clean up zombie simulator processes.
 * macOS doesn't properly clean up simulators between test runs, leading to
 * resource exhaustion (40+ simulators can accumulate).
 */
export async function cleanupSimulators(): Promise<void> {
  console.info('\n--- Cleaning up simulators ---')

  try {
    // shutdown all booted simulators
    execSync('xcrun simctl shutdown all 2>/dev/null || true', { stdio: 'pipe' })

    // kill any zombie Simulator.app processes
    execSync('pkill -9 -f "Simulator.app" 2>/dev/null || true', { stdio: 'pipe' })

    // list remaining booted (should be 0)
    const booted = execSync('xcrun simctl list devices | grep -i booted | wc -l', {
      encoding: 'utf-8',
    }).trim()

    console.info(`Simulators cleaned up (${booted} still booted)`)
  } catch {
    // ignore errors - cleanup is best effort
    console.info('Simulator cleanup completed (some commands may have failed)')
  }
}

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
 *
 * IMPORTANT: Fingerprint only changes when NATIVE dependencies change
 * (Podfile, native modules, etc). JS-only changes don't require rebuild.
 */
export async function ensureIOSApp(config: string = 'ios.sim.debug'): Promise<void> {
  // On CI, the app is built separately - don't build here
  if (isCI()) {
    console.info('CI detected - skipping local build check')
    return
  }

  const projectRoot = process.cwd()

  // Check if app binary exists (use the path from detoxrc)
  const appPath =
    process.env.DETOX_IOS_APP_PATH ||
    'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'
  const fullAppPath = join(projectRoot, appPath)
  const appExists = existsSync(fullAppPath)

  // If app doesn't exist, we must build regardless of fingerprint
  if (!appExists) {
    console.info(`\n--- iOS app not found at ${appPath}, building... ---`)
    await buildIOSApp(config, projectRoot, appPath, '')
    return
  }

  // App exists - check if fingerprint changed (native deps changed)
  let currentFingerprint: string
  try {
    const result = await generateFingerprint({ platform: 'ios', projectRoot })
    currentFingerprint = result.hash
  } catch (err) {
    // if fingerprint generation fails, skip rebuild (app exists)
    console.warn('Could not generate fingerprint, using existing app')
    console.info(`iOS app found at ${appPath}`)
    return
  }

  // Check cached fingerprint
  const cache = loadFingerprintCache(projectRoot)
  const fingerprintMatch = cache?.fingerprint === currentFingerprint && currentFingerprint !== ''

  if (fingerprintMatch) {
    console.info(`iOS app found at ${appPath} (fingerprint matches - no native changes)`)
    return
  }

  // Fingerprint changed - but let user decide if they want to rebuild
  // Many fingerprint changes are false positives (timestamp changes, etc)
  if (cache?.fingerprint) {
    console.info(`\n--- iOS fingerprint changed ---`)
    console.info(`Previous: ${cache.fingerprint.slice(0, 16)}...`)
    console.info(`Current:  ${currentFingerprint.slice(0, 16)}...`)
    console.info(`App exists at ${appPath}`)

    // Check if FORCE_IOS_REBUILD is set
    if (process.env.FORCE_IOS_REBUILD) {
      console.info('FORCE_IOS_REBUILD set, rebuilding...')
      await buildIOSApp(config, projectRoot, appPath, currentFingerprint)
      return
    }

    // Otherwise use existing app but update fingerprint cache
    // This avoids unnecessary rebuilds from timestamp/metadata changes
    console.info('Using existing app (set FORCE_IOS_REBUILD=1 to force rebuild)')
    saveFingerprintCache(projectRoot, {
      fingerprint: currentFingerprint,
      timestamp: new Date().toISOString(),
      appPath,
    })
    return
  }

  // No cache but app exists - just save fingerprint and use existing app
  console.info(`iOS app found at ${appPath} (saving fingerprint)`)
  saveFingerprintCache(projectRoot, {
    fingerprint: currentFingerprint,
    timestamp: new Date().toISOString(),
    appPath,
  })
}

/**
 * Build the iOS app using detox build
 */
async function buildIOSApp(
  config: string,
  projectRoot: string,
  appPath: string,
  fingerprint: string
): Promise<void> {
  // Ensure pods are installed first
  // Check for actual pod config files, not just the Pods directory (which may be incomplete)
  const podConfigPath = join(
    projectRoot,
    'ios',
    'Pods',
    'Target Support Files',
    'Pods-tamaguikitchensink',
    'Pods-tamaguikitchensink.debug.xcconfig'
  )
  if (!existsSync(podConfigPath)) {
    console.info('Installing CocoaPods dependencies...')
    await $`pod install --project-directory=ios`
  }

  // Build the app using detox build
  console.info(`Building iOS app (config: ${config})...`)
  console.info('This may take a few minutes on first run.')
  await $`npx detox build -c ${config}`

  // Save the fingerprint cache
  if (fingerprint) {
    saveFingerprintCache(projectRoot, {
      fingerprint,
      timestamp: new Date().toISOString(),
      appPath,
    })
    console.info('Saved build fingerprint to cache')
  }

  console.info('iOS app built successfully!')
}
