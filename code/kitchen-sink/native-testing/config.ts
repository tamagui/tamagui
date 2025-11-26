/**
 * Unified WebDriver configuration for iOS and Android
 *
 * This module provides platform-aware WebDriver configuration.
 * Platform is determined by the NATIVE_TEST_PLATFORM environment variable.
 */

import { execSync } from 'node:child_process'
import path from 'node:path'
import { copySync, ensureDirSync, existsSync } from 'fs-extra'
import type { remote } from 'webdriverio'
import { getPlatform } from './driver'

export type WebdriverIOConfig = Parameters<typeof remote>[0]

// ─────────────────────────────────────────────────────────────────────────────
// iOS-specific helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSimulatorUdid(): string {
  if (process.env.SIMULATOR_UDID) {
    return process.env.SIMULATOR_UDID
  }

  console.warn('No SIMULATOR_UDID provided, trying to find a simulator automatically...')

  try {
    const listDevicesOutput = execSync('xcrun simctl list --json devices').toString()
    const devicesData = JSON.parse(listDevicesOutput).devices
    const runtimes = Reflect.ownKeys(devicesData)

    const runtime = runtimes.find(
      (r) => typeof r === 'string' && r.includes('SimRuntime.iOS-18')
    )

    if (!runtime) {
      throw new Error(`No available runtime found from ${JSON.stringify(runtimes)}`)
    }

    const device = devicesData[runtime].find((d: { name: string }) =>
      d.name.includes('iPhone 16 Pro')
    )

    if (!device) {
      throw new Error(
        `No available device found from ${JSON.stringify(devicesData[runtime])}`
      )
    }

    console.info(`Found simulator device ${device.name} with udid ${device.udid}`)
    return device.udid
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Failed to find an available simulator: ${error.message}`
    }
    throw error
  }
}

async function prepareIOSTestApp(): Promise<string> {
  if (process.env.IOS_TEST_CONTAINER_PATH_DEV) {
    const root = process.cwd()
    const tmpDir = path.join(root, 'node_modules', '.test')
    ensureDirSync(tmpDir)

    const appPath = path.join(tmpDir, `ios-test-container-dev.app`)
    copySync(process.env.IOS_TEST_CONTAINER_PATH_DEV, appPath)

    return appPath
  }

  console.info(
    'No IOS_TEST_CONTAINER_PATH_DEV provided, finding the app automatically from Xcode project...'
  )

  const buildSettings = (() => {
    try {
      return execSync(
        'xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -showBuildSettings 2>&1'
      ).toString()
    } catch (e) {
      if (e instanceof Error) {
        e.message +=
          ' - please make sure you have built the iOS app before running the tests (`npx expo prebuild --platform ios`, `open ios/*.xcworkspace`, and run the app on a simulator at least once).'
      }
      throw e
    }
  })()

  const buildDirLine = buildSettings
    .split('\n')
    .find((line) => line.includes('BUILD_DIR'))

  if (!buildDirLine) {
    throw new Error('Cannot find BUILD_DIR from Xcode project.')
  }

  const buildDir = buildDirLine.split('=')[1].trim()
  const appPath = `${buildDir}/Debug-iphonesimulator/tamaguikitchensink.app`

  console.info(`Using built app: ${appPath}`)

  if (!existsSync(appPath)) {
    throw new Error(
      `Cannot find the app at ${appPath}. Please make sure you have built the iOS app before running the tests.` +
        ' You can `open ios/*.xcworkspace` and run the app on a simulator at least once.'
    )
  }

  return appPath
}

// ─────────────────────────────────────────────────────────────────────────────
// Android-specific helpers
// ─────────────────────────────────────────────────────────────────────────────

function getEmulatorName(): string {
  if (process.env.ANDROID_EMULATOR_NAME) {
    return process.env.ANDROID_EMULATOR_NAME
  }

  console.warn(
    'No ANDROID_EMULATOR_NAME provided, trying to find an emulator automatically...'
  )

  try {
    // Try to find a running emulator first
    const runningDevices = execSync('adb devices', { encoding: 'utf-8' })
    const emulatorMatch = runningDevices.match(/emulator-(\d+)\s+device/)
    if (emulatorMatch) {
      const emulatorId = `emulator-${emulatorMatch[1]}`
      console.info(`Found running emulator: ${emulatorId}`)
      return emulatorId
    }

    // List available AVDs
    const avdList = execSync('emulator -list-avds', { encoding: 'utf-8' })
    const avds = avdList.trim().split('\n').filter(Boolean)

    if (avds.length === 0) {
      throw new Error('No Android emulators found. Create one in Android Studio.')
    }

    // Prefer Pixel devices
    const preferred = avds.find((avd) => avd.toLowerCase().includes('pixel'))
    const avdName = preferred || avds[0]

    console.info(`Found AVD: ${avdName}`)
    return avdName
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Failed to find an Android emulator: ${error.message}`
    }
    throw error
  }
}

async function prepareAndroidTestApp(): Promise<string> {
  if (process.env.ANDROID_TEST_APK_PATH) {
    return process.env.ANDROID_TEST_APK_PATH
  }

  console.info('No ANDROID_TEST_APK_PATH provided, finding the APK automatically...')

  // Check common APK locations
  const possiblePaths = [
    'android/app/build/outputs/apk/debug/app-debug.apk',
    'android/app/build/outputs/apk/release/app-release.apk',
  ]

  for (const p of possiblePaths) {
    const fullPath = path.resolve(process.cwd(), p)
    if (existsSync(fullPath)) {
      console.info(`Found APK at: ${fullPath}`)
      return fullPath
    }
  }

  throw new Error(
    `No APK found. Build the Android app first:\n` +
      `  cd code/kitchen-sink\n` +
      `  npx expo prebuild --platform android\n` +
      `  npx expo run:android`
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

async function pokeDevServer(platform: 'ios' | 'android'): Promise<void> {
  if (process.env.SKIP_POKE_DEV_SERVER) {
    if (process.env.DEBUG) {
      console.info('[pokeDevServer] Skipping due to SKIP_POKE_DEV_SERVER env var')
    }
    return
  }

  const startTime = performance.now()
  try {
    const response = await fetch('http://127.0.0.1:8081/', {
      method: 'GET',
      headers: {
        'Expo-Platform': platform,
      },
    })
    const json = await response.json()
    const bundleUrl = json.launchAsset.url
    await fetch(bundleUrl, { method: 'GET' }).catch(() => {
      // Bundle fetch can timeout, that's ok
    })
    const endTime = performance.now()
    if (process.env.DEBUG) {
      console.info(`[pokeDevServer] Warmed bundle in ${Math.round(endTime - startTime)}ms`)
    }
  } catch {
    console.warn(
      '[pokeDevServer] Dev server not responding, tests may be slower on first run'
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cached values
// ─────────────────────────────────────────────────────────────────────────────

let cachedSimulatorUdid: string | undefined
let cachedEmulatorName: string | undefined
let cachedTestAppPath: string | undefined
let pokeDevServerResult: Promise<void> | undefined

function getSimulatorUdidCached(): string {
  if (!cachedSimulatorUdid) {
    cachedSimulatorUdid = getSimulatorUdid()
  }
  return cachedSimulatorUdid
}

function getEmulatorNameCached(): string {
  if (!cachedEmulatorName) {
    cachedEmulatorName = getEmulatorName()
  }
  return cachedEmulatorName
}

async function prepareTestAppCached(platform: 'ios' | 'android'): Promise<string> {
  if (!cachedTestAppPath) {
    cachedTestAppPath =
      platform === 'ios' ? await prepareIOSTestApp() : await prepareAndroidTestApp()
  }
  return cachedTestAppPath
}

function pokeDevServerCached(platform: 'ios' | 'android'): Promise<void> {
  if (!pokeDevServerResult) {
    pokeDevServerResult = pokeDevServer(platform)
  }
  return pokeDevServerResult
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get WebDriver configuration for the current platform.
 * Platform is determined by NATIVE_TEST_PLATFORM env var (defaults to 'ios').
 */
export async function getWebDriverConfig(): Promise<WebdriverIOConfig> {
  const platform = getPlatform()

  // Start warming the dev server in parallel
  const pokeDevServerPromise = pokeDevServerCached(platform)

  const capabilities =
    platform === 'ios'
      ? {
          platformName: 'iOS',
          'appium:options': {
            automationName: 'XCUITest',
            udid: getSimulatorUdidCached(),
            app: await prepareTestAppCached(platform),
          },
        }
      : {
          platformName: 'Android',
          'appium:options': {
            automationName: 'UiAutomator2',
            ...(getEmulatorNameCached().startsWith('emulator-')
              ? { udid: getEmulatorNameCached() }
              : { avd: getEmulatorNameCached(), avdLaunchTimeout: 180000 }),
            app: await prepareTestAppCached(platform),
            appWaitActivity: '*',
            autoGrantPermissions: true,
            // Increased timeouts for CI environments
            adbExecTimeout: 120000,
            uiautomator2ServerLaunchTimeout: 120000,
            uiautomator2ServerInstallTimeout: 120000,
            androidInstallTimeout: 180000,
            appWaitDuration: 60000,
            newCommandTimeout: 300,
          },
        }

  const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: process.env.APPIUM_PORT ? Number.parseInt(process.env.APPIUM_PORT, 10) : 4723,
    // XCUITest driver can take 5+ minutes to build WebDriverAgent on first run in CI
    connectionRetryTimeout: platform === 'ios' ? 10 * 60 * 1000 : 5 * 60 * 1000,
    connectionRetryCount: 3,
    logLevel: (process.env.DEBUG ? 'warn' : 'error') as const,
    capabilities,
  } satisfies WebdriverIOConfig

  await pokeDevServerPromise

  return wdOpts
}
