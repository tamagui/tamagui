import { execSync } from 'node:child_process'
import path from 'node:path'
import { copySync, ensureDirSync } from 'fs-extra'
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

async function prepareTestApp() {
  if (process.env.IOS_TEST_CONTAINER_PATH_DEV) {
    const root = process.cwd()
    const tmpDir = path.join(root, 'node_modules', '.test')
    ensureDirSync(tmpDir)

    const appPath = path.join(tmpDir, `ios-test-container-dev.app`)
    copySync(process.env.IOS_TEST_CONTAINER_PATH_DEV, appPath)

    return appPath
  } else {
    const buildSettings = execSync('xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -showBuildSettings 2>&1').toString()

    const buildDirLine = buildSettings
    .split('\n')
    .find(line => line.includes('BUILD_DIR'));

    if (!buildDirLine) {
      throw new Error('Cannot find BUILD_DIR from Xcode project.');
    }

    const buildDir = buildDirLine.split('=')[1].trim();

    const appPath = `${buildDir}/Debug-iphonesimulator/tamaguikitchensink.app`

    return appPath
  }
}

export async function getWebDriverConfig(): Promise<WebdriverIOConfig> {
  const capabilities = {
    platformName: 'iOS',
    'appium:options': {
      automationName: 'XCUITest',

      udid: getSimulatorUdid(),

      app: await prepareTestApp(),
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

  return wdOpts
}
