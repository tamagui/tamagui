import { describe, expect, test } from 'bun:test'

import {
  ensureNpmAuthentication,
  isTrustedPublishingEnvironment,
} from './release-npm-auth'

describe('npm release authentication', () => {
  test('skips npm whoami only in GitHub Actions with an OIDC token request', async () => {
    let checks = 0

    await ensureNpmAuthentication({
      env: {
        GITHUB_ACTIONS: 'true',
        ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.test/token',
        ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'token',
      },
      interactive: false,
      check: async () => {
        checks++
      },
      login: async () => {},
    })

    expect(checks).toBe(0)
  })

  test('does not treat --ci or a generic CI environment as trusted publishing', async () => {
    let checks = 0

    await ensureNpmAuthentication({
      env: { CI: 'true' },
      interactive: false,
      check: async () => {
        checks++
      },
      login: async () => {},
    })

    expect(checks).toBe(1)
    expect(isTrustedPublishingEnvironment({ GITHUB_ACTIONS: 'true' })).toBe(false)
  })

  test('runs npm login and re-checks authentication after a failed whoami', async () => {
    let checks = 0
    let logins = 0

    await ensureNpmAuthentication({
      env: {},
      interactive: true,
      check: async () => {
        checks++
        if (checks === 1) throw new Error('not logged in')
      },
      login: async () => {
        logins++
      },
    })

    expect(checks).toBe(2)
    expect(logins).toBe(1)
  })

  test('fails clearly when npm remains unauthenticated', async () => {
    await expect(
      ensureNpmAuthentication({
        env: {},
        interactive: true,
        check: async () => {
          throw new Error('401 Unauthorized')
        },
        login: async () => {},
      })
    ).rejects.toThrow('npm is still not authenticated after login')
  })

  test('re-checks and reports authentication when npm login exits unsuccessfully', async () => {
    let checks = 0

    await expect(
      ensureNpmAuthentication({
        env: {},
        interactive: true,
        check: async () => {
          checks++
          throw new Error('401 Unauthorized')
        },
        login: async () => {
          throw new Error('login cancelled')
        },
      })
    ).rejects.toThrow('npm is still not authenticated after login')

    expect(checks).toBe(2)
  })
})
