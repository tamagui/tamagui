#!/usr/bin/env node

/**
 * Native test runner for iOS and Android using @tamagui/native-ci
 *
 * Usage:
 *   node scripts/test-native.mjs          # Run iOS tests (default)
 *   node scripts/test-native.mjs ios      # Run iOS tests
 *   node scripts/test-native.mjs android  # Run Android tests
 *   node scripts/test-native.mjs all      # Run both iOS and Android tests
 *
 * Prerequisites:
 *   - Bun runtime (https://bun.sh)
 *   - iOS: Xcode with simulator, applesimutils
 *   - Android: Android Studio with emulator running
 *   - App builds: Run detox:build:ios or detox:build:android first
 *
 * In CI environments, this script exits successfully as tests are
 * handled by separate workflows.
 */

import { execSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Skip in CI - native tests are run by separate workflows
if (process.env.CI) {
  console.log('Skipping native tests in CI (handled by separate workflow)')
  process.exit(0)
}

// Parse command line args
const platform = process.argv[2] || 'ios'

// Check for bun
const bunCheck = spawnSync('bun', ['--version'], { encoding: 'utf-8' })
if (bunCheck.status !== 0) {
  console.error('Error: Bun runtime is required. Install from https://bun.sh')
  process.exit(1)
}

// Helper to run native-ci script
function runNativeTests(plat) {
  const script = `../packages/native-ci/src/run-detox-${plat}.ts`
  const config = plat === 'ios' ? 'ios.sim.debug' : 'android.emu.debug'

  console.log(`\n=== Running ${plat.toUpperCase()} Detox Tests ===\n`)

  try {
    execSync(`bun run ${script} --project-root . --config ${config}`, {
      cwd: projectRoot,
      stdio: 'inherit',
    })
    return true
  } catch (error) {
    console.error(`\n${plat.toUpperCase()} tests failed`)
    return false
  }
}

// Run tests based on platform argument
let success = true

switch (platform) {
  case 'ios':
    success = runNativeTests('ios')
    break

  case 'android':
    success = runNativeTests('android')
    break

  case 'all':
    const iosResult = runNativeTests('ios')
    const androidResult = runNativeTests('android')
    success = iosResult && androidResult
    break

  default:
    console.error(`Unknown platform: ${platform}`)
    console.log('Usage: node scripts/test-native.mjs [ios|android|all]')
    process.exit(1)
}

process.exit(success ? 0 : 1)
