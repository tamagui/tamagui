import { execSync } from 'node:child_process'
import path from 'node:path'
import { copySync, ensureDirSync, existsSync } from 'fs-extra'
import type { remote } from 'webdriverio'

export type WebdriverIOConfig = Parameters<typeof remote>[0]

function getSimulatorUdid() {
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

    const device = devicesData[runtime].find((d) => d.name.includes('iPhone 16 Pro'))

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

let cachedSimulatorUdid: string | undefined
function getSimulatorUdidCached() {
  if (cachedSimulatorUdid) {
    return cachedSimulatorUdid
  }

  cachedSimulatorUdid = getSimulatorUdid()
  return cachedSimulatorUdid
}

async function pokeDevServer() {
  if (process.env.SKIP_POKE_DEV_SERVER) {
    console.info('[pokeDevServer] Skipping dev server poke due to SKIP_POKE_DEV_SERVER env var')
    return
  }
  console.info(
    '[pokeDevServer] Poking the dev server to trigger a build - this can prevent timeouts during the test since the initial build may take some time.'
  )
  const startTime = performance.now()
  const response = await fetch('http://127.0.0.1:8081/', {
    method: 'GET',
    headers: {
      'Expo-Platform': 'ios',
    },
  })
  const json = await response.json()
  const bundleUrl = json.launchAsset.url
  await fetch(bundleUrl, {
    method: 'GET',
  }).catch(err => {
    console.warn('[pokeDevServer] Bundle fetch failed or timed out:', err.message)
  })
  const endTime = performance.now()
  console.info(
    `[pokeDevServer] Got response in ${endTime - startTime} ms, we're good to go!`
  )
}

let pokeDevServerResult: ReturnType<typeof pokeDevServer> | undefined
function pokeDevServerCached() {
  if (pokeDevServerResult) {
    return pokeDevServerResult
  }

  pokeDevServerResult = pokeDevServer()
  return pokeDevServerResult
}

async function prepareTestApp() {
  if (process.env.IOS_TEST_CONTAINER_PATH_DEV) {
    const root = process.cwd()
    const tmpDir = path.join(root, 'node_modules', '.test')
    ensureDirSync(tmpDir)

    const appPath = path.join(tmpDir, `ios-test-container-dev.app`)
    copySync(process.env.IOS_TEST_CONTAINER_PATH_DEV, appPath)

    return appPath
  } else {
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
}

let cachedTestAppPath: string | undefined
async function prepareTestAppCached() {
  if (cachedTestAppPath) {
    return cachedTestAppPath
  }

  cachedTestAppPath = await prepareTestApp()
  return cachedTestAppPath
}

export async function getWebDriverConfig(): Promise<WebdriverIOConfig> {
  const pokeDevServerPromise = pokeDevServerCached() // Do not await here since we can do other things in parallel. We only need to check if it is done before we return.

  const capabilities = {
    platformName: 'iOS',
    'appium:options': {
      automationName: 'XCUITest',

      udid: getSimulatorUdidCached(),

      app: await prepareTestAppCached(),
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
