import { spawn, type ChildProcess } from 'node:child_process'
import type { TestProject } from 'vitest/node'
import { getAndroidWebDriverConfig } from './getWebDriverConfig.android'

let devServer: ChildProcess

function startDevServerOnce() {
  if (devServer) return

  console.info('Seems that the RN dev is not started. Starting RN dev server...')
  devServer = spawn(
    '../../node_modules/.bin/expo',
    ['start', '--dev-client', '--offline'],
    {
      cwd: process.cwd(),
      env: { ...process.env, EXPO_NO_TELEMETRY: 'true' },
      detached: true,
      stdio: 'inherit',
    }
  )
  console.info(`Dev server started with PID: ${devServer.pid}`)
}

const prepareDevServer = (): Promise<void> => {
  const maxRetries = 10
  const retryInterval = 1000
  const startedAt = performance.now()

  return new Promise((resolve, reject) => {
    console.info('Checking RN dev server...')
    let retries = 0
    const checkServer = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8081/', {
          method: 'GET',
          headers: {
            'Expo-Platform': 'android',
          },
        })

        if (response.ok) {
          console.info('RN dev server is ready.')
          resolve()
        } else {
          throw new Error('Server not ready')
        }
      } catch (error) {
        if (retries >= maxRetries) {
          reject(
            new Error(
              `RN dev server is not ready within the expected time (timeout after waiting for ${Math.round(performance.now() - startedAt)}ms).`
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
  await getAndroidWebDriverConfig()
}

export const teardown = async () => {
  if (devServer?.pid) {
    try {
      process.kill(devServer?.pid)
      console.info(`Dev server process (PID: ${devServer?.pid}) killed successfully.`)
    } catch (error) {
      console.error(`Failed to kill dev server process (PID: ${devServer?.pid}):`, error)
    }
  }
}
