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
 * Check if any iOS simulator is booted and available for testing.
 * Returns true if at least one simulator is booted.
 */
export function hasBootedSimulator(): boolean {
  return !!getBootedSimulatorUDID()
}

/**
 * Get the UDID of the first booted iOS simulator, or null if none.
 */
export function getBootedSimulatorUDID(): string | null {
  try {
    const output = execSync('xcrun simctl list devices booted', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const match = output.match(/\(([A-F0-9-]{36})\)/i)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Boot an iOS simulator. Picks the first available iPhone device.
 */
export function ensureBootedSimulator(): void {
  if (hasBootedSimulator()) return

  console.info('No booted iOS simulator found, booting one...')
  try {
    const output = execSync('xcrun simctl list devices available', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    // find first available iPhone
    const match = output.match(/iPhone[^\n]*\(([A-F0-9-]{36})\)/i)
    if (!match) {
      throw new Error('No available iPhone simulator found. Install one via Xcode.')
    }
    const udid = match[1]
    console.info(`Booting simulator ${udid}...`)
    execSync(`xcrun simctl boot ${udid}`, { stdio: 'inherit' })
    console.info('Simulator booted.')
  } catch (err) {
    throw new Error(
      `Failed to boot iOS simulator: ${err instanceof Error ? err.message : err}`
    )
  }
}

/**
 * Check if an app is installed on the booted simulator.
 */
function isAppInstalled(bundleId: string, udid: string): boolean {
  try {
    execSync(`xcrun simctl get_app_container "${udid}" "${bundleId}"`, {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return true
  } catch {
    return false
  }
}

/**
 * Ensure the app is installed on a specific simulator.
 * For dev client apps, builds if needed then installs.
 * For Expo Go apps, ensures Expo Go is present.
 */
export async function ensureAppInstalled(opts: {
  projectRoot: string
  bundleId: string
  udid?: string
}): Promise<void> {
  const { projectRoot, bundleId } = opts
  const udid = opts.udid || getBootedSimulatorUDID() || 'booted'

  // check if app is already installed
  if (isAppInstalled(bundleId, udid)) {
    console.info(`App ${bundleId} already installed on simulator ${udid}`)
    return
  }

  if (bundleId === 'host.exp.Exponent') {
    await installExpoGo(udid)
    return
  }

  // custom dev client - build and install
  console.info(`App ${bundleId} not installed, building...`)
  await ensureIOSFolder()

  const appPath =
    process.env.DETOX_IOS_APP_PATH ||
    'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'
  const fullAppPath = join(projectRoot, appPath)

  if (!existsSync(fullAppPath)) {
    await ensureIOSApp('ios.sim.debug')
  }

  console.info(`Installing app on simulator ${udid}...`)
  execSync(`xcrun simctl install "${udid}" "${fullAppPath}"`, { stdio: 'inherit' })
  console.info('App installed.')
}

/**
 * Get the bundle ID needed for maestro tests.
 * Checks flow files first (they declare appId), falls back to app.json.
 */
export function getMaestroBundleId(projectRoot: string): string {
  // check flow files for appId
  const flowsDir = join(projectRoot, 'flows')
  if (existsSync(flowsDir)) {
    try {
      const files = require('fs').readdirSync(flowsDir) as string[]
      for (const f of files) {
        if (!f.endsWith('.yaml')) continue
        const content = readFileSync(join(flowsDir, f), 'utf-8')
        const match = content.match(/^appId:\s*(.+)$/m)
        if (match) return match[1].trim()
      }
    } catch {}
  }

  // fall back to app.json
  try {
    const appJson = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf-8'))
    return appJson.expo?.ios?.bundleIdentifier || 'host.exp.Exponent'
  } catch {
    return 'host.exp.Exponent'
  }
}

/**
 * Download and install Expo Go on the booted simulator.
 */
async function installExpoGo(udid: string): Promise<void> {
  const tmpDir = join(require('os').tmpdir(), 'expo-go-install')
  const appPath = join(tmpDir, 'Expo Go.app')

  // skip download if already cached
  if (existsSync(appPath)) {
    console.info(`Installing cached Expo Go on simulator ${udid}...`)
    execSync(`xcrun simctl install "${udid}" "${appPath}"`, { stdio: 'inherit' })
    console.info('Expo Go installed.')
    return
  }

  console.info('Downloading Expo Go...')
  mkdirSync(tmpDir, { recursive: true })

  // get the download URL from expo's version API
  const { getVersionsAsync } =
    // @ts-ignore - no type declarations for internal expo module
    require('@expo/cli/build/src/api/getVersions') as {
      getVersionsAsync: () => Promise<any>
    }
  const versions = await getVersionsAsync()

  // find the latest SDK version that has an iOS client URL
  const sdkVersions = Object.entries(versions.sdkVersions || {})
    .filter(([, v]: [string, any]) => v.iosClientUrl)
    .sort(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
  const clientUrl = (sdkVersions[0]?.[1] as any)?.iosClientUrl

  if (!clientUrl) {
    throw new Error('Could not find Expo Go download URL')
  }

  execSync(`curl -fsSL "${clientUrl}" -o "${tmpDir}/ExpoGo.tar.gz"`, { stdio: 'inherit' })
  // archive contains .app contents directly, extract into .app bundle
  mkdirSync(appPath, { recursive: true })
  execSync(`tar -xzf "${tmpDir}/ExpoGo.tar.gz" -C "${appPath}"`, { stdio: 'inherit' })

  execSync(`xcrun simctl install "${udid}" "${appPath}"`, { stdio: 'inherit' })
  console.info('Expo Go installed.')
}

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
 * Set SKIP_IOS_REBUILD=1 to skip rebuild even when fingerprint changes.
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
  const fingerprintMatch =
    cache?.fingerprint === currentFingerprint && currentFingerprint !== ''

  if (fingerprintMatch) {
    console.info(`iOS app found at ${appPath} (fingerprint matches - no native changes)`)
    return
  }

  // fingerprint changed - rebuild by default since native deps likely changed
  if (cache?.fingerprint) {
    console.info(`\n--- iOS fingerprint changed ---`)
    console.info(`Previous: ${cache.fingerprint.slice(0, 16)}...`)
    console.info(`Current:  ${currentFingerprint.slice(0, 16)}...`)

    if (process.env.SKIP_IOS_REBUILD) {
      console.info('SKIP_IOS_REBUILD set, using existing app')
      saveFingerprintCache(projectRoot, {
        fingerprint: currentFingerprint,
        timestamp: new Date().toISOString(),
        appPath,
      })
      return
    }

    console.info('Native dependencies changed, rebuilding...')
    await buildIOSApp(config, projectRoot, appPath, currentFingerprint)
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
