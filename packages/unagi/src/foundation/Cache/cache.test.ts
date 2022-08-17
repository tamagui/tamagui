import { generateSubRequestCacheControlHeader } from './cache-sub-request.js'
import { CacheNone, CacheShort } from './strategies/index.js'

describe('generateSubRequestCacheControlHeader', () => {
  it('generates CacheShort caching strategy by default', () => {
    const header = generateSubRequestCacheControlHeader()

    expect(header).toBe('public, max-age=1, stale-while-revalidate=9')
  })

  it('override to private', () => {
    const header = generateSubRequestCacheControlHeader(
      CacheShort({
        mode: 'private',
      })
    )

    expect(header).toBe('private, max-age=1, stale-while-revalidate=9')
  })

  it('supports no-store', () => {
    const header = generateSubRequestCacheControlHeader(CacheNone())

    expect(header).toBe('no-store')
  })
})
