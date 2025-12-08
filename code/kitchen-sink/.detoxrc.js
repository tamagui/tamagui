/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 180000, // 3 minutes for CI environments
      retries: 2, // Retry flaky tests up to 2 times
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
      // CI uses 'build/' (set via env var), local uses 'ios/build/'
      binaryPath:
        process.env.DETOX_IOS_APP_PATH ||
        'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app',
      build:
        'xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        process.env.DETOX_IOS_APP_PATH ||
        'ios/build/Build/Products/Release-iphonesimulator/tamaguikitchensink.app',
      build:
        'xcodebuild -workspace ios/tamaguikitchensink.xcworkspace -scheme tamaguikitchensink -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --init-script init.gradle',
      // Port 8081 for Metro, port 8099 for Detox server (fixed in native-ci scripts)
      reversePorts: [8081, 8099],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
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
        avdName: process.env.DETOX_AVD_NAME || 'Pixel_6_API_33_8GB',
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
