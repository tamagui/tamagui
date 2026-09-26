import { describe, expect, test } from 'bun:test'
import {
  isTransientNpmOidcError,
  retryTransientNpmOidcPublish,
} from './release-publish-retry'

describe('isTransientNpmOidcError', () => {
  test('recognizes npm OIDC rate limits and server failures', () => {
    expect(
      isTransientNpmOidcError(
        'npm http fetch POST 503 https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/@tamagui%2ftooltip'
      )
    ).toBe(true)
    expect(
      isTransientNpmOidcError(
        'https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/foo returned 429'
      )
    ).toBe(true)
  })

  test('does not retry ordinary auth or publish failures', () => {
    expect(isTransientNpmOidcError('npm error code ENEEDAUTH')).toBe(false)
    expect(isTransientNpmOidcError('npm error code EPUBLISHCONFLICT')).toBe(false)
  })
})

describe('retryTransientNpmOidcPublish', () => {
  test('backs off transient OIDC failures and then succeeds', async () => {
    let publishes = 0
    const waits: number[] = []

    await retryTransientNpmOidcPublish({
      publish: async () => {
        publishes++
        if (publishes < 3) {
          throw new Error('npm http fetch POST 503 /oidc/token/exchange/package/foo')
        }
      },
      isPublished: async () => false,
      sleep: async (ms) => {
        waits.push(ms)
      },
    })

    expect(publishes).toBe(3)
    expect(waits).toEqual([15_000, 30_000])
  })

  test('does not retry a real publish failure', async () => {
    let publishes = 0

    await expect(
      retryTransientNpmOidcPublish({
        publish: async () => {
          publishes++
          throw new Error('npm error code ENEEDAUTH')
        },
        isPublished: async () => false,
        sleep: async () => {},
      })
    ).rejects.toThrow('ENEEDAUTH')

    expect(publishes).toBe(1)
  })

  test('accepts a version the registry committed after npm exited', async () => {
    let publishes = 0

    await retryTransientNpmOidcPublish({
      publish: async () => {
        publishes++
        throw new Error('npm error code ECONNRESET')
      },
      isPublished: async () => true,
      sleep: async () => {},
    })

    expect(publishes).toBe(1)
  })
})
