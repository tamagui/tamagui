import {
  CacheCustom,
  CacheLong,
  CacheNone,
  CacheShort,
  generateCacheControlHeader,
} from './index.js'

const expectedResultMapping: any = {
  CacheShort: {
    method: CacheShort,
    header: 'public, max-age=1, stale-while-revalidate=9',
  },
  CacheLong: {
    method: CacheLong,
    header: 'public, max-age=3600, stale-while-revalidate=82800',
  },
}

describe('CachingStrategy', () => {
  it('should generate the expected cache control header when CacheNone is used', () => {
    expect(generateCacheControlHeader(CacheNone())).toEqual('no-store')
  })

  Object.keys(expectedResultMapping).forEach((methodName) => {
    const testFunction = expectedResultMapping[methodName]
    it(`should generate the expected cache control header when ${methodName} is used`, () => {
      expect(generateCacheControlHeader(testFunction.method())).toEqual(testFunction.header)
    })

    it(`should generate the expected cache control header when ${methodName} override options is used`, () => {
      expect(
        generateCacheControlHeader(
          testFunction.method({
            mode: 'private',
            maxAge: 2,
            staleWhileRevalidate: 18,
            staleIfError: 18,
          })
        )
      ).toEqual('private, max-age=2, stale-while-revalidate=18, stale-if-error=18')
    })

    it(`should throw error when ${methodName} override mode with something else other than private or public`, () => {
      expect(() =>
        testFunction.method({
          mode: 'no-store',
        })
      ).toThrow("'mode' must be either 'public' or 'private'")
    })
  })

  it('should generate the expected cache control header when CacheCustom is used', () => {
    expect(
      generateCacheControlHeader(
        CacheCustom({
          mode: 'public, must-revalidate',
          maxAge: 10,
        })
      )
    ).toEqual('public, must-revalidate, max-age=10')
  })
})
