import type { CachingStrategy } from '../../types.js'
import { logCacheApiStatus } from '../../utilities/log/index.js'
import { getCache } from '../runtime.js'
import { CacheShort, generateCacheControlHeader } from './strategies/index.js'

function getCacheControlSetting(
  userCacheOptions?: CachingStrategy,
  options?: CachingStrategy
): CachingStrategy {
  if (userCacheOptions && options) {
    return {
      ...userCacheOptions,
      ...options,
    }
  } else {
    return userCacheOptions || CacheShort()
  }
}

export function generateDefaultCacheControlHeader(userCacheOptions?: CachingStrategy): string {
  return generateCacheControlHeader(getCacheControlSetting(userCacheOptions))
}

/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export async function getItemFromCache(request: Request): Promise<Response | undefined> {
  const cache = getCache()
  if (!cache) {
    return
  }

  const response = await cache.match(request)
  if (!response) {
    logCacheApiStatus('MISS', request.url)
    return
  }

  logCacheApiStatus('HIT', request.url)

  return response
}

/**
 * Put an item into the cache.
 */
export async function setItemInCache(
  request: Request,
  response: Response,
  userCacheOptions: CachingStrategy
) {
  const cache = getCache()
  if (!cache) {
    return
  }

  /**
   * We are manually managing staled request by adding this workaround.
   * Why? cache control header support is dependent on hosting platform
   *
   * For example:
   *
   * Cloudflare's Cache API does not support `stale-while-revalidate`.
   * Cloudflare cache control header has a very odd behaviour.
   * Say we have the following cache control header on a request:
   *
   *   public, max-age=15, stale-while-revalidate=30
   *
   * When there is a cache.match HIT, the cache control header would become
   *
   *   public, max-age=14400, stale-while-revalidate=30
   *
   * == `stale-while-revalidate` workaround ==
   * Update response max-age so that:
   *
   *   max-age = max-age + stale-while-revalidate
   *
   * For example:
   *
   *   public, max-age=1, stale-while-revalidate=9
   *                    |
   *                    V
   *   public, max-age=10, stale-while-revalidate=9
   *
   * Store the following information in the response header:
   *
   *   cache-put-date   - UTC time string of when this request is PUT into cache
   *
   * Note on `cache-put-date`: The `response.headers.get('date')` isn't static. I am
   * not positive what date this is returning but it is never over 500 ms
   * after subtracting from the current timestamp.
   *
   * `isStale` function will use the above information to test for stale-ness of a cached response
   */

  const cacheControl = getCacheControlSetting(userCacheOptions)

  // The padded cache-control to mimic stale-while-revalidate
  request.headers.set(
    'cache-control',
    generateDefaultCacheControlHeader(
      getCacheControlSetting(cacheControl, {
        maxAge: (cacheControl.maxAge || 0) + (cacheControl.staleWhileRevalidate || 0),
      })
    )
  )
  // The cache-control we want to set on response
  const cacheControlString = generateDefaultCacheControlHeader(getCacheControlSetting(cacheControl))

  // CF will override cache-control, so we need to keep a
  // non-modified real-cache-control
  response.headers.set('cache-control', cacheControlString)
  response.headers.set('real-cache-control', cacheControlString)
  response.headers.set('cache-put-date', new Date().toUTCString())

  logCacheApiStatus('PUT', request.url)
  await cache.put(request, response)
}

export async function deleteItemFromCache(request: Request) {
  const cache = getCache()
  if (!cache) return

  logCacheApiStatus('DELETE', request.url)
  await cache.delete(request)
}

/**
 * Manually check the response to see if it's stale.
 */
export function isStale(request: Request, response: Response) {
  const responseDate = response.headers.get('cache-put-date')
  const cacheControl = response.headers.get('real-cache-control')
  let responseMaxAge = 0

  if (cacheControl) {
    const maxAgeMatch = cacheControl.match(/max-age=(\d*)/)
    if (maxAgeMatch && maxAgeMatch.length > 1) {
      responseMaxAge = parseFloat(maxAgeMatch[1])
    }
  }

  if (!responseDate) {
    return false
  }

  const ageInMs = new Date().valueOf() - new Date(responseDate as string).valueOf()
  const age = ageInMs / 1000

  const result = age > responseMaxAge

  if (result) {
    logCacheApiStatus('STALE', request.url)
  }

  return result
}
