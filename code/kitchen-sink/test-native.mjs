#!/usr/bin/env node

/**
 * Native Test Runner for Tamagui Kitchen Sink
 *
 * This script runs native tests on iOS and Android using Appium + WebDriverIO.
 * It handles environment setup, dependency checks, and provides helpful prompts.
 *
 * Usage:
 *   node test-native.mjs           # Run tests on all available platforms
 *   node test-native.mjs ios       # Run tests on iOS only
 *   node test-native.mjs android   # Run tests on Android only
 *
 * Environment variables:
 *   SKIP_IOS=1              Skip iOS tests
 *   SKIP_ANDROID=1          Skip Android tests
 *   SKIP_DEPENDENCY_CHECK=1 Skip dependency verification
 */

import { execSync, spawnSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isCI = !!process.env.CI

// In CI, native tests run via separate workflows
if (isCI) {
  console.info('ℹ️  Skipping native tests in CI (handled by separate workflow)')
  process.exit(0)
}

const args = process.argv.slice(2)
const runIOS = !process.env.SKIP_IOS && (args.length === 0 || args.includes('ios'))
const runAndroid = !process.env.SKIP_ANDROID && (args.length === 0 || args.includes('android'))

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function exec(cmd, options = {}) {
  return execSync(cmd, { encoding: 'utf-8', ...options }).trim()
}

function commandExists(cmd) {
  const result = spawnSync('which', [cmd], { encoding: 'utf-8' })
  return result.status === 0
}

function printHeader(text) {
  console.log('\n' + '─'.repeat(60))
  console.log(`  ${text}`)
  console.log('─'.repeat(60) + '\n')
}

function printError(text) {
  console.error(`\n❌ ${text}\n`)
}

function printSuccess(text) {
  console.log(`✅ ${text}`)
}

function printWarning(text) {
  console.warn(`⚠️  ${text}`)
}

function printInstallInstructions(tool, instructions) {
  console.log(`\n📦 ${tool} is not installed. Install with:\n`)
  console.log(`   ${instructions}\n`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Dependency Checks
// ─────────────────────────────────────────────────────────────────────────────

function checkAppium() {
  if (!commandExists('appium')) {
    printInstallInstructions('Appium', 'npm install -g appium')
    return false
  }
  printSuccess('Appium is installed')
  return true
}

function checkAppiumDriver(driver) {
  try {
    const output = exec('appium driver list --installed 2>/dev/null')
    if (output.includes(driver)) {
      printSuccess(`Appium ${driver} driver is installed`)
      return true
    }
  } catch (e) {
    // ignore
  }

  console.log(`\n📦 Appium ${driver} driver not installed. Installing...`)
  try {
    execSync(`appium driver install ${driver}`, { stdio: 'inherit' })
    printSuccess(`Appium ${driver} driver installed`)
    return true
  } catch (e) {
    printError(`Failed to install ${driver} driver`)
    return false
  }
}

function checkXcode() {
  if (!commandExists('xcrun')) {
    printInstallInstructions('Xcode', 'Install from the Mac App Store')
    return false
  }
  printSuccess('Xcode is installed')
  return true
}

function checkAndroidSDK() {
  if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
    printWarning('ANDROID_HOME or ANDROID_SDK_ROOT not set')
    console.log('   Set in your shell profile:')
    console.log('   export ANDROID_HOME=$HOME/Library/Android/sdk')
    console.log('   export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools\n')
    return false
  }
  if (!commandExists('adb')) {
    printInstallInstructions(
      'Android SDK Platform Tools',
      'Install via Android Studio SDK Manager'
    )
    return false
  }
  printSuccess('Android SDK is configured')
  return true
}

function findIOSSimulator() {
  try {
    const output = exec('xcrun simctl list devices available --json')
    const data = JSON.parse(output)

    for (const [runtime, devices] of Object.entries(data.devices)) {
      if (!runtime.includes('iOS')) continue
      for (const device of devices) {
        if (device.name.includes('iPhone')) {
          return { ...device, runtime }
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null
}

function findAndroidEmulator() {
  try {
    // Check for running emulator first
    const devices = exec('adb devices')
    const running = devices.match(/emulator-(\d+)\s+device/)
    if (running) {
      return { name: `emulator-${running[1]}`, running: true }
    }

    // Check for available AVDs
    const avds = exec('emulator -list-avds').split('\n').filter(Boolean)
    if (avds.length > 0) {
      return { name: avds[0], running: false }
    }
  } catch (e) {
    // ignore
  }
  return null
}

function findIOSApp() {
  const paths = [
    resolve(__dirname, 'ios/DerivedData/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'),
    resolve(__dirname, 'ios/build/Build/Products/Debug-iphonesimulator/tamaguikitchensink.app'),
  ]

  // Also check Xcode DerivedData
  try {
    const derivedDataPath = exec(
      `find ~/Library/Developer/Xcode/DerivedData -name "tamaguikitchensink.app" -path "*Debug-iphonesimulator*" -type d 2>/dev/null | head -1`
    )
    if (derivedDataPath) {
      paths.unshift(derivedDataPath)
    }
  } catch (e) {
    // ignore
  }

  for (const p of paths) {
    if (existsSync(p)) {
      return p
    }
  }
  return null
}

function findAndroidApp() {
  const paths = [
    resolve(__dirname, 'android/app/build/outputs/apk/debug/app-debug.apk'),
  ]

  for (const p of paths) {
    if (existsSync(p)) {
      return p
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Appium Server Management
// ─────────────────────────────────────────────────────────────────────────────

let appiumProcess = null

function isAppiumRunning() {
  try {
    exec('lsof -i :4723 2>/dev/null')
    return true
  } catch (e) {
    return false
  }
}

function startAppium() {
  if (isAppiumRunning()) {
    printSuccess('Appium is already running on port 4723')
    return true
  }

  console.log('🚀 Starting Appium server...')
  appiumProcess = spawn('appium', [], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  // Wait a bit for Appium to start
  execSync('sleep 3')

  if (isAppiumRunning()) {
    printSuccess(`Appium started (PID: ${appiumProcess.pid})`)
    return true
  }

  printError('Failed to start Appium')
  return false
}

function stopAppium() {
  if (appiumProcess) {
    console.log('🧹 Stopping Appium server...')
    try {
      process.kill(appiumProcess.pid)
    } catch (e) {
      // ignore
    }
    appiumProcess = null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulator/Emulator Management
// ─────────────────────────────────────────────────────────────────────────────

function bootIOSSimulator(udid) {
  try {
    const status = exec(`xcrun simctl list devices | grep "${udid}"`)
    if (status.includes('Booted')) {
      printSuccess('iOS Simulator is already booted')
      return true
    }
  } catch (e) {
    // ignore
  }

  console.log('📱 Booting iOS Simulator...')
  try {
    execSync(`xcrun simctl boot "${udid}"`, { stdio: 'inherit' })
    execSync('open -a Simulator')
    execSync('sleep 5')
    printSuccess('iOS Simulator booted')
    return true
  } catch (e) {
    printError('Failed to boot iOS Simulator')
    return false
  }
}

function startAndroidEmulator(avdName) {
  // Check if already running
  try {
    const devices = exec('adb devices')
    if (devices.includes('emulator')) {
      printSuccess('Android Emulator is already running')
      return true
    }
  } catch (e) {
    // ignore
  }

  console.log('📱 Starting Android Emulator...')
  spawn('emulator', ['-avd', avdName, '-no-audio', '-no-boot-anim'], {
    detached: true,
    stdio: 'ignore',
  })

  // Wait for emulator to boot
  console.log('   Waiting for emulator to boot (this may take a minute)...')
  try {
    execSync('adb wait-for-device', { timeout: 120000 })
    execSync('sleep 10') // Extra time for full boot
    printSuccess('Android Emulator started')
    return true
  } catch (e) {
    printError('Failed to start Android Emulator')
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test Runners
// ─────────────────────────────────────────────────────────────────────────────

async function runIOSTests() {
  printHeader('iOS Native Tests')

  // Check dependencies
  if (!checkXcode()) return false
  if (!checkAppium()) return false
  if (!checkAppiumDriver('xcuitest')) return false

  // Find simulator
  const simulator = findIOSSimulator()
  if (!simulator) {
    printError('No iOS Simulator found. Create one in Xcode.')
    return false
  }
  printSuccess(`Found simulator: ${simulator.name}`)

  // Find app
  const appPath = findIOSApp()
  if (!appPath) {
    printError('iOS app not built. Build with:\n   cd code/kitchen-sink && yarn ios')
    return false
  }
  printSuccess(`Found app: ${appPath}`)

  // Boot simulator
  if (!bootIOSSimulator(simulator.udid)) return false

  // Start Appium
  if (!startAppium()) return false

  // Run tests
  console.log('\n🧪 Running iOS tests...\n')
  try {
    execSync(
      'vitest --config ./vitest.config.ios.mts --run',
      {
        cwd: __dirname,
        stdio: 'inherit',
        env: {
          ...process.env,
          NATIVE_TEST_PLATFORM: 'ios',
          SIMULATOR_UDID: simulator.udid,
          IOS_TEST_CONTAINER_PATH_DEV: appPath,
        },
      }
    )
    return true
  } catch (e) {
    return false
  }
}

async function runAndroidTests() {
  printHeader('Android Native Tests')

  // Check dependencies
  if (!checkAndroidSDK()) return false
  if (!checkAppium()) return false
  if (!checkAppiumDriver('uiautomator2')) return false

  // Find emulator
  const emulator = findAndroidEmulator()
  if (!emulator) {
    printError('No Android Emulator found. Create one in Android Studio.')
    return false
  }
  printSuccess(`Found emulator: ${emulator.name}`)

  // Find app
  const appPath = findAndroidApp()
  if (!appPath) {
    printError('Android app not built. Build with:\n   cd code/kitchen-sink && yarn android')
    return false
  }
  printSuccess(`Found app: ${appPath}`)

  // Start emulator if needed
  if (!emulator.running) {
    if (!startAndroidEmulator(emulator.name)) return false
  }

  // Start Appium
  if (!startAppium()) return false

  // Run tests
  console.log('\n🧪 Running Android tests...\n')
  try {
    execSync(
      'vitest --config ./vitest.config.android.mts --run',
      {
        cwd: __dirname,
        stdio: 'inherit',
        env: {
          ...process.env,
          NATIVE_TEST_PLATFORM: 'android',
          ANDROID_EMULATOR_NAME: emulator.running ? emulator.name : undefined,
          ANDROID_TEST_APK_PATH: appPath,
        },
      }
    )
    return true
  } catch (e) {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  printHeader('Tamagui Native Tests')

  const results = { ios: null, android: null }

  try {
    if (runIOS) {
      results.ios = await runIOSTests()
    }

    if (runAndroid) {
      results.android = await runAndroidTests()
    }
  } finally {
    stopAppium()
  }

  // Summary
  printHeader('Test Results')

  if (runIOS) {
    console.log(`  iOS:     ${results.ios ? '✅ Passed' : '❌ Failed'}`)
  }
  if (runAndroid) {
    console.log(`  Android: ${results.android ? '✅ Passed' : '❌ Failed'}`)
  }
  console.log('')

  const failed = (runIOS && !results.ios) || (runAndroid && !results.android)
  process.exit(failed ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  stopAppium()
  process.exit(1)
})
