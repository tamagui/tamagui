#!/usr/bin/env bun
/**
 * Run iOS Detox tests with Metro bundler
 *
 * Usage: bun run-detox-ios.ts [options]
 */

import { parseArgs } from 'node:util'
import { $ } from 'bun'

const { values: options } = parseArgs({
  options: {
    config: { type: 'string', default: 'ios.sim.debug' },
    'project-root': { type: 'string', default: process.cwd() },
    'record-logs': { type: 'string', default: 'all' },
    retries: { type: 'string', default: '0' },
  },
})

const config = options.config!
const projectRoot = options['project-root']!
const recordLogs = options['record-logs']!
const retries = options.retries!

async function waitForMetro(maxAttempts = 60, intervalMs = 2000): Promise<boolean> {
  console.info('Waiting for Metro to start...')

  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const response = await fetch('http://127.0.0.1:8081/', {
        headers: { 'Expo-Platform': 'ios' },
      })
      if (response.ok) {
        console.info('Metro is responding!')
        return true
      }
    } catch {
      // Metro not ready yet
    }
    console.info(`Waiting for Metro... (${i}/${maxAttempts})`)
    await Bun.sleep(intervalMs)
  }

  return false
}

async function prewarmBundle(): Promise<void> {
  console.info('Pre-warming bundle...')

  try {
    const response = await fetch('http://127.0.0.1:8081/', {
      headers: { 'Expo-Platform': 'ios' },
    })

    if (response.ok) {
      const manifest = (await response.json()) as { launchAsset?: { url?: string } }
      const bundleUrl = manifest?.launchAsset?.url

      if (bundleUrl) {
        console.info(`Fetching bundle from: ${bundleUrl}`)
        await fetch(bundleUrl)
        console.info('Bundle pre-warmed!')
      }
    }
  } catch {
    console.info('Bundle pre-warm completed (with error, continuing)')
  }
}

console.info('=== iOS Detox Test Runner ===')
console.info(`Config: ${config}`)
console.info(`Project root: ${projectRoot}`)

// Change to project root
process.chdir(projectRoot)

// Start Metro bundler in background
console.info('\n--- Starting Metro bundler ---')
const metro = Bun.spawn(['yarn', 'expo', 'start', '--dev-client', '--offline'], {
  env: { ...process.env, EXPO_NO_TELEMETRY: 'true' },
  stdout: 'inherit',
  stderr: 'inherit',
})

let testExitCode = 1

try {
  // Wait for Metro to be ready
  const metroReady = await waitForMetro()
  if (!metroReady) {
    throw new Error('Metro failed to start within timeout')
  }

  // Pre-warm the bundle
  await prewarmBundle()

  // Build Detox command
  const detoxArgs = [
    'detox',
    'test',
    '--configuration',
    config,
    '--record-logs',
    recordLogs,
    '--retries',
    retries,
  ]

  // Run Detox tests
  console.info('\n--- Running Detox tests ---')
  console.info(`Command: npx ${detoxArgs.join(' ')}`)

  const result = await $`npx ${detoxArgs}`.nothrow()
  testExitCode = result.exitCode

  if (testExitCode === 0) {
    console.info('\nAll tests passed!')
  } else {
    console.info(`\nTests failed with exit code: ${testExitCode}`)
  }
} finally {
  // Cleanup Metro
  console.info('\n--- Cleaning up ---')
  metro.kill()
  console.info('Metro stopped')
}

process.exit(testExitCode)
