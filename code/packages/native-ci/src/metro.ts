/**
 * Metro bundler utilities for Detox test runners
 *
 * This module provides shared functionality for starting, waiting for,
 * and managing the Metro bundler process across iOS and Android tests.
 */

import type { Subprocess } from 'bun'
import { execSync } from 'node:child_process'
import {
  METRO_URL,
  METRO_PORT,
  DEFAULT_METRO_WAIT_ATTEMPTS,
  DEFAULT_METRO_WAIT_INTERVAL_MS,
  type Platform,
  type ExpoManifest,
} from './constants'

export interface MetroOptions {
  /** Platform for Expo-Platform header */
  platform: Platform
  /** Maximum attempts to wait for Metro */
  maxAttempts?: number
  /** Interval between attempts in milliseconds */
  intervalMs?: number
}

export interface MetroProcess {
  /** The underlying Bun subprocess */
  proc: Subprocess
  /** Kill the Metro process and its children */
  kill: () => Promise<void>
}

/**
 * Wait for Metro bundler to be ready and responding to requests.
 *
 * @returns true if Metro is ready, false if timeout reached
 */
export async function waitForMetro(options: MetroOptions): Promise<boolean> {
  const {
    platform,
    maxAttempts = DEFAULT_METRO_WAIT_ATTEMPTS,
    intervalMs = DEFAULT_METRO_WAIT_INTERVAL_MS,
  } = options

  console.info('Waiting for Metro to start...')

  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const response = await fetch(`${METRO_URL}/`, {
        headers: { 'Expo-Platform': platform },
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

/**
 * Pre-warm the JavaScript bundle to avoid timeout on first app launch.
 * This fetches the bundle URL from the Expo manifest and downloads the bundle.
 */
export async function prewarmBundle(platform: Platform): Promise<void> {
  console.info('Pre-warming bundle...')

  try {
    const response = await fetch(`${METRO_URL}/`, {
      headers: { 'Expo-Platform': platform },
    })

    if (response.ok) {
      const manifest = (await response.json()) as ExpoManifest
      const bundleUrl = manifest?.launchAsset?.url

      if (bundleUrl) {
        console.info(`Fetching bundle from: ${bundleUrl}`)
        await fetch(bundleUrl)
        console.info('Bundle pre-warmed!')
      } else {
        console.info('No bundle URL found in manifest, skipping pre-warm')
      }
    }
  } catch (error) {
    // Non-fatal - continue even if pre-warm fails
    console.info('Bundle pre-warm completed (with error, continuing)')
  }
}

/**
 * Detect if the current project uses expo-dev-client by checking package.json.
 */
function projectUsesDevClient(): boolean {
  try {
    const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf-8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    // check for expo-dev-client dep, or --dev-client in the start script
    if (deps['expo-dev-client']) return true
    if (
      typeof pkg.scripts?.start === 'string' &&
      pkg.scripts.start.includes('--dev-client')
    )
      return true
    return false
  } catch {
    return false
  }
}

/**
 * Start Metro bundler as a background process.
 *
 * @returns MetroProcess with kill function for cleanup
 */
export function startMetro(): MetroProcess {
  console.info('\n--- Starting Metro bundler ---')

  // Only clear cache in CI - locally we want fast startup using cached transforms
  const isCI = !!process.env.CI
  const useDevClient = projectUsesDevClient()
  const args = ['bun', 'expo', 'start', '--offline']
  if (useDevClient) {
    args.splice(3, 0, '--dev-client')
    console.info('Dev client detected')
  }
  if (isCI) {
    args.push('--clear')
    console.info('CI detected: clearing Metro cache')
  }

  const proc = Bun.spawn(args, {
    env: { ...process.env, EXPO_NO_TELEMETRY: 'true' },
    stdout: 'inherit',
    stderr: 'inherit',
  })

  return {
    proc,
    kill: async () => {
      // Metro spawns child processes (watchman, etc.) that may survive a simple kill
      // Use pkill to kill the entire process tree by parent PID
      const pid = proc.pid
      if (pid) {
        try {
          // Kill all child processes first (works on macOS and Linux)
          await Bun.spawn(['pkill', '-P', String(pid)], {
            stdout: 'ignore',
            stderr: 'ignore',
          }).exited
        } catch {
          // Ignore errors - children may already be dead
        }
      }
      proc.kill('SIGKILL')
      console.info('Metro stopped')
    },
  }
}

/**
 * Setup signal handlers to ensure Metro is cleaned up on process termination.
 * This prevents orphaned Metro processes when CI jobs are cancelled.
 */
export function setupSignalHandlers(metro: MetroProcess): void {
  const cleanup = async (signal: string) => {
    console.info(`\nReceived ${signal}, cleaning up...`)
    await metro.kill()
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }

  process.on('SIGINT', () => cleanup('SIGINT'))
  process.on('SIGTERM', () => cleanup('SIGTERM'))
}

/**
 * Check if Metro is already running (e.g., developer has it open in another terminal)
 */
async function isMetroRunning(platform: Platform): Promise<boolean> {
  try {
    const response = await fetch(`${METRO_URL}/`, {
      headers: { 'Expo-Platform': platform },
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Kill whatever process is listening on the Metro port.
 * Prevents conflicts with other projects' Metro instances (or anything else on 8081).
 */
function killPortProcess(): void {
  try {
    const pid = execSync(`lsof -ti tcp:${METRO_PORT} -sTCP:LISTEN`, {
      encoding: 'utf-8',
    }).trim()
    if (pid) {
      console.info(`Killing process ${pid} on port ${METRO_PORT}...`)
      process.kill(Number(pid), 'SIGTERM')
    }
  } catch {
    // nothing listening, or lsof not available
  }
}

/**
 * Run a function with Metro bundler, ensuring proper cleanup.
 * This is a convenience wrapper that handles starting Metro, waiting for it,
 * pre-warming the bundle, and cleanup.
 *
 * If Metro is already running (e.g., in another terminal), it will be reused
 * and not killed after the tests complete.
 */
export async function withMetro<T>(platform: Platform, fn: () => Promise<T>): Promise<T> {
  // Check if Metro is already running
  const alreadyRunning = await isMetroRunning(platform)

  if (alreadyRunning) {
    console.info('\n--- Metro already running, reusing existing instance ---')
    await prewarmBundle(platform)
    return await fn()
  }

  // kill anything on the port before starting (e.g. another project's Metro)
  killPortProcess()

  const metro = startMetro()
  setupSignalHandlers(metro)

  try {
    const metroReady = await waitForMetro({ platform })
    if (!metroReady) {
      throw new Error('Metro failed to start within timeout')
    }

    await prewarmBundle(platform)

    return await fn()
  } finally {
    await metro.kill()
  }
}
