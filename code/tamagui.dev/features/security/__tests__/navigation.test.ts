import { describe, expect, it } from 'vitest'
import {
  getSafeExternalUrl,
  getSafeInternalPath,
  getSafeRequestOrigin,
  getSafeSupabaseAuthUrl,
  safeDecodeURIComponent,
} from '../navigation'

describe('security navigation helpers', () => {
  const origin = 'https://tamagui.dev'

  it('keeps same-origin redirects as internal paths', () => {
    expect(getSafeInternalPath('/account?tab=billing#top', { origin })).toBe(
      '/account?tab=billing#top'
    )
    expect(getSafeInternalPath('https://tamagui.dev/account', { origin })).toBe(
      '/account'
    )
    expect(getSafeInternalPath('account', { origin })).toBe('/account')
  })

  it('rejects cross-origin and ambiguous internal redirects', () => {
    const options = { origin, fallback: '/fallback' }

    expect(getSafeInternalPath('https://evil.test/account', options)).toBe('/fallback')
    expect(getSafeInternalPath('//evil.test/account', options)).toBe('/fallback')
    expect(getSafeInternalPath('/\\evil.test/account', options)).toBe('/fallback')
    expect(getSafeInternalPath('javascript:alert(1)', options)).toBe('/fallback')
  })

  it('decodes redirect params without throwing on malformed encoding', () => {
    expect(safeDecodeURIComponent('%2Faccount%3Ftab%3Dbilling')).toBe(
      '/account?tab=billing'
    )
    expect(safeDecodeURIComponent('%E0%A4%A')).toBe('%E0%A4%A')
  })

  it('only allows configured external origins', () => {
    expect(
      getSafeExternalUrl('https://example.com/auth?x=1', {
        allowedOrigins: ['https://example.com'],
      })
    ).toBe('https://example.com/auth?x=1')

    expect(
      getSafeExternalUrl('https://evil.test/auth', {
        allowedOrigins: ['https://example.com'],
      })
    ).toBe(null)

    expect(
      getSafeExternalUrl('http://example.com/auth', {
        allowedOrigins: ['http://example.com'],
      })
    ).toBe(null)

    expect(
      getSafeExternalUrl('http://localhost:54321/auth', {
        allowedOrigins: ['http://localhost:54321'],
        allowLocalHttp: true,
      })
    ).toBe('http://localhost:54321/auth')
  })

  it('only allows Supabase OAuth redirects to the configured Supabase origin', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'

    expect(
      getSafeSupabaseAuthUrl(
        'https://project.supabase.co/auth/v1/authorize?provider=github'
      )
    ).toBe('https://project.supabase.co/auth/v1/authorize?provider=github')

    expect(
      getSafeSupabaseAuthUrl('https://evil.test/auth/v1/authorize?provider=github')
    ).toBe(null)
  })

  it('keeps trusted request origins on https behind a TLS proxy', () => {
    expect(
      getSafeRequestOrigin(
        new Request('http://tamagui.dev/api/auth/callback', {
          headers: { 'x-forwarded-proto': 'https' },
        })
      )
    ).toBe('https://tamagui.dev')

    expect(
      getSafeRequestOrigin(new Request('http://tamagui.dev/api/auth/callback'))
    ).toBe('https://tamagui.dev')
  })

  it('allows local request origins without upgrading to https', () => {
    expect(
      getSafeRequestOrigin(new Request('http://localhost:8091/api/auth/callback'))
    ).toBe('http://localhost:8091')
  })

  it('falls back for untrusted request hosts', () => {
    expect(getSafeRequestOrigin(new Request('https://evil.test/api/auth/callback'))).toBe(
      'https://tamagui.dev'
    )
  })
})
