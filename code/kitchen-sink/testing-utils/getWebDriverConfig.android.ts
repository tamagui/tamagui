import { execSync } from 'node:child_process'
import path from 'node:path'
import { copySync, ensureDirSync, existsSync } from 'fs-extra'
import type { remote } from 'webdriverio'

export type WebdriverIOConfig = Parameters<typeof remote>[0]

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

let cachedEmulatorName: string | undefined
function getEmulatorNameCached(): string {
  if (cachedEmulatorName) {
    return cachedEmulatorName
  }
  cachedEmulatorName = getEmulatorName()
  return cachedEmulatorName
}

async function prepareTestApp(): Promise<string> {
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

let cachedAppPath: string | undefined
async function prepareTestAppCached(): Promise<string> {
  if (cachedAppPath) {
    return cachedAppPath
  }
  cachedAppPath = await prepareTestApp()
  return cachedAppPath
}

async function pokeDevServer() {
  if (process.env.SKIP_POKE_DEV_SERVER) {
    console.info(
      '[pokeDevServer] Skipping dev server poke due to SKIP_POKE_DEV_SERVER env var'
    )
    return
  }
  console.info('[pokeDevServer] Poking the dev server to trigger a build...')
  const startTime = performance.now()
  try {
    const response = await fetch('http://127.0.0.1:8081/', {
      method: 'GET',
      headers: {
        'Expo-Platform': 'android',
      },
    })
    const json = await response.json()
    const bundleUrl = json.launchAsset.url
    await fetch(bundleUrl, { method: 'GET' }).catch((err) => {
      console.warn('[pokeDevServer] Bundle fetch failed or timed out:', err.message)
    })
    const endTime = performance.now()
    console.info(`[pokeDevServer] Got response in ${endTime - startTime} ms`)
  } catch (err) {
    console.warn(
      '[pokeDevServer] Dev server not responding, tests may be slower on first run'
    )
  }
}

let pokeDevServerResult: ReturnType<typeof pokeDevServer> | undefined
function pokeDevServerCached() {
  if (pokeDevServerResult) {
    return pokeDevServerResult
  }
  pokeDevServerResult = pokeDevServer()
  return pokeDevServerResult
}

export async function getAndroidWebDriverConfig(): Promise<WebdriverIOConfig> {
  const pokeDevServerPromise = pokeDevServerCached()

  const emulatorName = getEmulatorNameCached()
  const isRunningEmulator = emulatorName.startsWith('emulator-')

  const capabilities = {
    platformName: 'Android',
    'appium:options': {
      automationName: 'UiAutomator2',
      ...(isRunningEmulator
        ? { udid: emulatorName }
        : { avd: emulatorName, avdLaunchTimeout: 180000 }),
      app: await prepareTestAppCached(),
      appWaitActivity: '*',
      autoGrantPermissions: true,
      // Increased timeouts for CI environments (based on Appium GitHub issues)
      // See: https://github.com/appium/appium/issues/14453
      adbExecTimeout: 120000, // 2 min for ADB commands
      uiautomator2ServerLaunchTimeout: 120000, // 2 min for UiAutomator2 server
      uiautomator2ServerInstallTimeout: 120000, // 2 min for server install
      androidInstallTimeout: 180000, // 3 min for APK install
      appWaitDuration: 60000, // 1 min wait for app activity
      newCommandTimeout: 300, // 5 min between commands before timeout
    },
  }

  const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: process.env.APPIUM_PORT ? Number.parseInt(process.env.APPIUM_PORT, 10) : 4723,
    connectionRetryTimeout: 5 * 60 * 1000,
    connectionRetryCount: 3,
    logLevel: 'warn' as const,
    capabilities,
  } satisfies WebdriverIOConfig

  await pokeDevServerPromise

  return wdOpts
}
