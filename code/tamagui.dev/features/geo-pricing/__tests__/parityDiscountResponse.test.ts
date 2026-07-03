import { afterEach, describe, expect, it } from 'vitest'
import { getParityDiscountResponse } from '../parityDiscountResponse'
import { getTrustedCountryCode } from '../trustedCountry'

const originalOriginSecret = process.env.CF_ORIGIN_SECRET

afterEach(() => {
  if (originalOriginSecret === undefined) {
    delete process.env.CF_ORIGIN_SECRET
  } else {
    process.env.CF_ORIGIN_SECRET = originalOriginSecret
  }
})

const request = (headers: HeadersInit = {}, path = '/api/parity-discount') =>
  new Request(`https://tamagui.dev${path}`, { headers })

describe('getTrustedCountryCode', () => {
  it('does not trust CF-IPCountry when the origin secret is missing', () => {
    delete process.env.CF_ORIGIN_SECRET

    expect(getTrustedCountryCode(request({ 'CF-IPCountry': 'BR' }))).toBe(null)
  })

  it('trusts CF-IPCountry when the origin secret matches', () => {
    process.env.CF_ORIGIN_SECRET = 'secret'

    expect(
      getTrustedCountryCode(
        request({
          'CF-IPCountry': 'BR',
          'x-origin-secret': 'secret',
        })
      )
    ).toBe('BR')
  })

  it('rejects mismatched origin secrets', () => {
    process.env.CF_ORIGIN_SECRET = 'secret'

    expect(
      getTrustedCountryCode(
        request({
          'CF-IPCountry': 'BR',
          'x-origin-secret': 'wrong',
        })
      )
    ).toBe(null)
  })
})

describe('getParityDiscountResponse', () => {
  it('does not display a discount the charge path would reject', () => {
    delete process.env.CF_ORIGIN_SECRET

    expect(getParityDiscountResponse(request({ 'CF-IPCountry': 'BR' }))).toMatchObject({
      country: null,
      countryName: 'Unknown',
      discount: 0,
    })
  })

  it('displays parity when the country is trusted', () => {
    process.env.CF_ORIGIN_SECRET = 'secret'

    expect(
      getParityDiscountResponse(
        request({
          'CF-IPCountry': 'BR',
          'x-origin-secret': 'secret',
        })
      )
    ).toMatchObject({
      country: 'BR',
      countryName: 'Brazil',
      discount: 50,
    })
  })

  it('keeps the admin preview override separate from trusted checkout pricing', () => {
    delete process.env.CF_ORIGIN_SECRET

    expect(
      getParityDiscountResponse(request({}, '/api/parity-discount?country=BR'))
    ).toMatchObject({
      country: 'BR',
      countryName: 'Brazil',
      discount: 50,
      isOverride: true,
    })
  })
})
