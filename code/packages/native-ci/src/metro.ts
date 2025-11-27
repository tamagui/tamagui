/**
 * Metro bundler utilities for Detox test runners
 *
 * This module provides shared functionality for starting, waiting for,
 * and managing the Metro bundler process across iOS and Android tests.
 */

import type { Subprocess } from 'bun'
import {
  METRO_URL,
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
  /** Kill the Metro process */
  kill: () => void
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
 * Start Metro bundler as a background process.
 *
 * @returns MetroProcess with kill function for cleanup
 */
export function startMetro(): MetroProcess {
  console.info('\n--- Starting Metro bundler ---')

  const proc = Bun.spawn(['yarn', 'expo', 'start', '--dev-client', '--offline'], {
    env: { ...process.env, EXPO_NO_TELEMETRY: 'true' },
    stdout: 'inherit',
    stderr: 'inherit',
  })

  return {
    proc,
    kill: () => {
      proc.kill()
      console.info('Metro stopped')
    },
  }
}

/**
 * Setup signal handlers to ensure Metro is cleaned up on process termination.
 * This prevents orphaned Metro processes when CI jobs are cancelled.
 */
export function setupSignalHandlers(metro: MetroProcess): void {
  const cleanup = (signal: string) => {
    console.info(`\nReceived ${signal}, cleaning up...`)
    metro.kill()
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }

  process.on('SIGINT', () => cleanup('SIGINT'))
  process.on('SIGTERM', () => cleanup('SIGTERM'))
}

/**
 * Run a function with Metro bundler, ensuring proper cleanup.
 * This is a convenience wrapper that handles starting Metro, waiting for it,
 * pre-warming the bundle, and cleanup.
 */
export async function withMetro<T>(platform: Platform, fn: () => Promise<T>): Promise<T> {
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
    metro.kill()
  }
}
