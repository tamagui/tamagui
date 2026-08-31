import { afterEach, describe, expect, test } from 'bun:test'

import { METRO_PORT, METRO_URL } from '../src/constants'
import { startMetro } from '../src/metro'

describe('Detox Metro port', () => {
  const originalSpawn = Bun.spawn
  const originalCI = process.env.CI

  afterEach(() => {
    Bun.spawn = originalSpawn
    if (originalCI === undefined) {
      delete process.env.CI
    } else {
      process.env.CI = originalCI
    }
  })

  test('starts Metro on the port compiled into the native test app', () => {
    delete process.env.CI
    let command: string[] = []
    Bun.spawn = ((args: string[]) => {
      command = args
      return {
        pid: undefined,
        kill() {},
      }
    }) as typeof Bun.spawn

    startMetro()

    expect(METRO_PORT).toBe(9034)
    expect(METRO_URL).toBe('http://127.0.0.1:9034')
    expect(command).toEqual(['bun', 'expo', 'start', '--offline', '--port', '9034'])
  })
})
