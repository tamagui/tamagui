import { spawn, type ChildProcess } from 'node:child_process'
import type { TestProject } from 'vitest/node'
import { getWebDriverConfig } from './getWebDriverConfig'

let devServer: ChildProcess

function startDevServerOnce() {
  if (devServer) return

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
}

const prepareDevServer = (): Promise<void> => {
  const maxRetries = 10
  const retryInterval = 1000
  const startedAt = performance.now()

  return new Promise((resolve, reject) => {
    let retries = 0
    const checkServer = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8081/', {
          method: 'GET',
          headers: { 'Expo-Platform': 'ios' },
        })

        if (response.ok) {
          resolve()
        } else {
          throw new Error('Server not ready')
        }
      } catch (error) {
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

export async function setup(project: TestProject) {
  await prepareDevServer()
  await getWebDriverConfig() // Do this once here so some results are cached - less chance to timeout the tests!
}

export const teardown = async () => {
  if (devServer?.pid) {
    try {
      process.kill(devServer.pid)
    } catch {
      // Process may have already exited
    }
  }
}
