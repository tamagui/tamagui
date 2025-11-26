/**
 * Vitest global setup for native tests
 *
 * This module handles dev server preparation and WebDriver config caching
 * for both platforms. Platform is determined by NATIVE_TEST_PLATFORM env var.
 *
 * Usage in vitest.config:
 *   globalSetup: './native-testing/setup.ts'
 */

import { spawn, type ChildProcess } from 'node:child_process'
import type { TestProject } from 'vitest/node'
import { getWebDriverConfig } from './config'
import { getPlatform } from './driver'

let devServer: ChildProcess | undefined

function startDevServerOnce(): void {
  if (devServer) return

  const platform = getPlatform()
  if (process.env.DEBUG) {
    console.info(`[native-testing] Starting dev server for ${platform}...`)
  }

  devServer = spawn(
    '../../node_modules/.bin/expo',
    ['start', '--dev-client', '--offline'],
    {
      cwd: process.cwd(),
      env: { ...process.env, EXPO_NO_TELEMETRY: 'true' },
      detached: true,
      stdio: process.env.DEBUG ? 'inherit' : 'ignore',
    }
  )

  if (process.env.DEBUG) {
    console.info(`[native-testing] Dev server started with PID: ${devServer.pid}`)
  }
}

function prepareDevServer(): Promise<void> {
  const platform = getPlatform()
  const maxRetries = 10
  const retryInterval = 1000
  const startedAt = performance.now()

  return new Promise((resolve, reject) => {
    let retries = 0

    const checkServer = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8081/', {
          method: 'GET',
          headers: { 'Expo-Platform': platform },
        })

        if (response.ok) {
          if (process.env.DEBUG) {
            console.info('[native-testing] Dev server is ready.')
          }
          resolve()
        } else {
          throw new Error('Server not ready')
        }
      } catch {
        if (retries >= maxRetries) {
          reject(
            new Error(
              `Dev server not ready (timeout after ${Math.round(performance.now() - startedAt)}ms)`
            )
          )
        } else {
          startDevServerOnce()
          retries++
          setTimeout(checkServer, retryInterval)
        }
      }
    }

    checkServer()
  })
}

export async function setup(_project: TestProject): Promise<void> {
  await prepareDevServer()
  // Cache WebDriver config to reduce timeout risk during tests
  await getWebDriverConfig()
}

export async function teardown(): Promise<void> {
  if (devServer?.pid) {
    try {
      process.kill(devServer.pid)
      if (process.env.DEBUG) {
        console.info(`[native-testing] Dev server (PID: ${devServer.pid}) killed.`)
      }
    } catch {
      // Process may have already exited
    }
  }
}
