// force single worker - multiple workers cause ECOMPROMISED lock file errors
// see: https://github.com/wix/Detox/issues/4210
const { execFileSync } = require('node:child_process')
const { existsSync } = require('node:fs')
const { join } = require('node:path')

const maxWorkers = 1
// dedicated detox metro port - both platforms route through it.
// Android: app reads from android/app/src/main/res/values/integers.xml
// iOS: launchArgs.RCT_jsLocation tells RCTBundleURLProvider where metro is
const detoxMetroPort = process.env.DETOX_METRO_PORT || '9034'
const defaultAndroidSdkRoot =
  process.env.ANDROID_SDK_ROOT ||
  process.env.ANDROID_HOME ||
  join(process.env.HOME || '', 'Library/Android/sdk')
const simulatorDevice = process.env.DETOX_DEVICE_UDID
  ? { id: process.env.DETOX_DEVICE_UDID }
  : { type: process.env.DETOX_DEVICE || 'iPhone 16' }

function detectLocalAvdName() {
  if (process.env.DETOX_AVD_NAME) {
    return process.env.DETOX_AVD_NAME
  }

  const sdkRoot =
    process.env.ANDROID_SDK_ROOT ||
    process.env.ANDROID_HOME ||
    join(process.env.HOME || '', 'Library/Android/sdk')
  const emulatorPath = join(sdkRoot, 'emulator', 'emulator')

  if (!existsSync(emulatorPath)) {
    return 'Pixel_6_API_33_8GB'
  }

  try {
    const avds = execFileSync(emulatorPath, ['-list-avds'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const preferred = ['Pixel_6_API_33_8GB', 'Pixel_6_API_31', 'Medium_Phone_API_36.1']

    return (
      preferred.find((name) => avds.includes(name)) || avds[0] || 'Pixel_6_API_33_8GB'
    )
  } catch {
    return 'Pixel_6_API_33_8GB'
  }
}

const localAndroidAvdName = detectLocalAvdName()

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
      maxWorkers,
    },
    jest: {
      setupTimeout: 180000, // 3 minutes for CI environments
      retries: 1, // Retry flaky tests once
    },
  },
  artifacts: {
    rootDir: './e2e/artifacts',
    plugins: {
      screenshot: 'failing',
      uiHierarchy: 'enabled',
    },
  },
  behavior: {
    init: {
      exposeGlobals: true,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      // CI uses 'build/' (set via env var), local uses global DerivedData
      // note: -derivedDataPath is ignored when Xcode has IDEBuildLocationStyle=Custom
      // so we use BUILT_PRODUCTS_DIR to force the output location
      binaryPath:
        process.env.DETOX_IOS_APP_PATH ||
        'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app',
      build:
        'xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -configuration Debug -sdk iphonesimulator SYMROOT="$(pwd)/ios/build/Build/Products" OBJROOT="$(pwd)/ios/build/Build/Intermediates.noindex"',
      // tell RCTBundleURLProvider where metro is (auto-detection fails with dev-client)
      launchArgs: {
        RCT_jsLocation: `localhost:${detoxMetroPort}`,
      },
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        process.env.DETOX_IOS_APP_PATH ||
        'ios/build/Build/Products/Release-iphonesimulator/tamaguikitchensink.app',
      build:
        'xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -configuration Release -sdk iphonesimulator SYMROOT="$(pwd)/ios/build/Build/Products" OBJROOT="$(pwd)/ios/build/Build/Intermediates.noindex"',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build: `cd android && ANDROID_SDK_ROOT="${defaultAndroidSdkRoot}" ANDROID_HOME="${defaultAndroidSdkRoot}" ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --init-script init.gradle`,
      // Dedicated Metro port for Detox plus the Detox server port.
      reversePorts: [Number(detoxMetroPort), 8099],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: `cd android && ANDROID_SDK_ROOT="${defaultAndroidSdkRoot}" ANDROID_HOME="${defaultAndroidSdkRoot}" ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release`,
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: simulatorDevice,
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        // Local development - use your own AVD name (default matches what native-ci expects)
        avdName: localAndroidAvdName,
      },
    },
    // CI emulator - created by reactivecircus/android-emulator-runner
    'emulator.ci': {
      type: 'android.emulator',
      device: {
        avdName: 'test',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    // CI configurations
    'android.emu.ci.debug': {
      device: 'emulator.ci',
      app: 'android.debug',
    },
  },
}
