import type { AllCacheOptions, CachingStrategy, QueryKey } from '../../types.js'
import { hashKey } from '../../utilities/hash.js'
import { getCache } from '../runtime.js'
import * as CacheApi from './cache.js'
import { CacheShort } from './strategies/index.js'

/**
 * Wrapper Cache functions for sub queries
 */

/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key: string) {
  return `https://shopify.dev/?${key}`
}

function getCacheOption(userCacheOptions?: CachingStrategy): AllCacheOptions {
  return userCacheOptions || CacheShort()
}

export function generateSubRequestCacheControlHeader(userCacheOptions?: CachingStrategy): string {
  return CacheApi.generateDefaultCacheControlHeader(getCacheOption(userCacheOptions))
}

/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export async function getItemFromCache(key: QueryKey): Promise<undefined | [any, Response]> {
  const cache = getCache()

  if (!cache) {
    return
  }

  const url = getKeyUrl(hashKey(key))
  const request = new Request(url)

  const response = await CacheApi.getItemFromCache(request)

  if (!response) {
    return
  }

  return [await response.json(), response]
}

/**
 * Put an item into the cache.
 */
export async function setItemInCache(
  key: QueryKey,
  value: any,
  userCacheOptions?: CachingStrategy
) {
  const cache = getCache()
  if (!cache) {
    return
  }

  const url = getKeyUrl(hashKey(key))
  const request = new Request(url)
  const response = new Response(JSON.stringify(value))

  await CacheApi.setItemInCache(request, response, getCacheOption(userCacheOptions))
}

export async function deleteItemFromCache(key: QueryKey) {
  const cache = getCache()
  if (!cache) return

  const url = getKeyUrl(hashKey(key))
  const request = new Request(url)

  await CacheApi.deleteItemFromCache(request)
}

/**
 * Manually check the response to see if it's stale.
 */
export function isStale(key: QueryKey, response: Response) {
  return CacheApi.isStale(new Request(getKeyUrl(hashKey(key))), response)
}
