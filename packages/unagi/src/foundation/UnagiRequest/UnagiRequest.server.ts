import { HelmetData as HeadData } from 'react-helmet-async'

import { RSC_PATHNAME } from '../../constants.js'
import type { PreloadOptions, QueryKey, ResolvedUnagiConfig, RuntimeContext } from '../../types.js'
import { hashKey } from '../../utilities/hash.js'
import type { QueryCacheControlHeaders } from '../../utilities/log/log-cache-header.js'
import type { QueryTiming } from '../../utilities/log/log-query-timeline.js'
import { parseJSON } from '../../utilities/parse.js'
import { getTime } from '../../utilities/timing.js'
import type { SessionSyncApi } from '../session/session-types.js'

export type PreloadQueryEntry = {
  key: QueryKey
  fetcher: (request: UnagiRequest) => Promise<unknown>
  preload?: PreloadOptions
}
export type PreloadQueriesByURL = Map<string, PreloadQueryEntry>
export type AllPreloadQueries = Map<string, PreloadQueriesByURL>
export type RouterContextData = {
  routeRendered: boolean
  serverProps: Record<string, any>
  routeParams: Record<string, string>
}

let reqCounter = 0 // For debugging
const generateId =
  typeof crypto !== 'undefined' &&
  // @ts-ignore
  !!crypto.randomUUID
    ? // @ts-ignore
      () => crypto.randomUUID() as string
    : () => `req${++reqCounter}`

// Stores queries by url or '*'
const preloadCache: AllPreloadQueries = new Map()
const previouslyLoadedUrls: Record<string, number> = {}
const PRELOAD_ALL = '*'

/**
 * This augments the `Request` object from the Fetch API:
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 *
 * - Adds a `cookies` map for easy access
 * - Adds a static constructor to convert a Node.js `IncomingMessage` to a Request.
 */
export class UnagiRequest extends Request {
  /**
   * A Map of cookies for easy access.
   */
  public cookies: Map<string, string>
  public id: string
  public time: number

  /**
   * Get the canonical URL for the current page, across SSR and RSC requests.
   */
  public normalizedUrl: string

  // CFW Request has a reserved 'context' property, use 'ctx' instead.
  public ctx: {
    cache: Map<string, any>
    head: HeadData
    unagiConfig?: ResolvedUnagiConfig
    queryCacheControl: Array<QueryCacheControlHeaders>
    queryTimings: Array<QueryTiming>
    preloadQueries: PreloadQueriesByURL
    analyticsData: any
    router: RouterContextData
    buyerIpHeader?: string
    session?: SessionSyncApi
    runtime?: RuntimeContext
    scopes: Map<string, Record<string, any>>
    [key: string]: any
  }

  constructor(input: any)
  constructor(input: RequestInfo, init?: RequestInit)
  constructor(input: RequestInfo | any, init?: RequestInit) {
    if (input instanceof Request) {
      super(input, init)
    } else {
      super(getUrlFromNodeRequest(input), getInitFromNodeRequest(input))
    }

    this.time = getTime()
    this.id = generateId()
    this.normalizedUrl = decodeURIComponent(this.isRscRequest() ? normalizeUrl(this.url) : this.url)

    this.ctx = {
      cache: new Map(),
      head: new HeadData({}),
      router: {
        routeRendered: false,
        serverProps: {},
        routeParams: {},
      },
      queryCacheControl: [],
      queryTimings: [],
      analyticsData: {
        url: this.url,
        normalizedRscUrl: this.normalizedUrl,
      },
      preloadQueries: new Map(),
      scopes: new Map(),
    }
    this.cookies = this.parseCookies()
  }

  public previouslyLoadedRequest() {
    if (previouslyLoadedUrls[this.normalizedUrl] > 1) return true
    previouslyLoadedUrls[this.normalizedUrl] = previouslyLoadedUrls[this.normalizedUrl] ? 2 : 1
    return false
  }

  private parseCookies() {
    const cookieString = this.headers.get('cookie') || ''

    return new Map(
      cookieString
        .split(';')
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk !== '')
        .map((chunk) => chunk.split(/=(.+)/) as [string, string])
    )
  }

  public isRscRequest() {
    const url = new URL(this.url)
    return url.pathname === RSC_PATHNAME
  }

  public savePreloadQuery(query: PreloadQueryEntry) {
    if (query.preload === PRELOAD_ALL) {
      saveToPreloadAllPreload(query)
    } else {
      this.ctx.preloadQueries.set(hashKey(query.key), query)
    }
  }

  public getPreloadQueries(): PreloadQueriesByURL | undefined {
    if (preloadCache.has(this.normalizedUrl)) {
      const combinedPreloadQueries: PreloadQueriesByURL = new Map()
      const urlPreloadCache = preloadCache.get(this.normalizedUrl)

      mergeMapEntries(combinedPreloadQueries, urlPreloadCache)
      mergeMapEntries(combinedPreloadQueries, preloadCache.get(PRELOAD_ALL))

      return combinedPreloadQueries
    } else if (preloadCache.has(PRELOAD_ALL)) {
      return preloadCache.get(PRELOAD_ALL)
    }
  }

  public savePreloadQueries() {
    preloadCache.set(this.normalizedUrl, this.ctx.preloadQueries)
  }

  /**
   * Buyer IP varies by hosting provider and runtime. The developer should provide this
   * as an argument to the `handleRequest` function for their runtime.
   * Defaults to `x-forwarded-for` header value.
   */
  public getBuyerIp() {
    return this.headers.get(this.ctx.buyerIpHeader ?? 'x-forwarded-for')
  }

  /**
   * Build a `cacheKey` in the form of a `Request` to be used in full-page
   * caching.
   * - lockKey generates a placeholder cache key
   */
  public cacheKey(lockKey = false): Request {
    const url = new URL(this.url)

    if (lockKey) {
      url.searchParams.set('cache-lock', 'true')
    }

    return new Request(url.href, this)
  }

  public async formData(): Promise<FormData> {
    // @ts-ignore
    if (__UNAGI_WORKER__ || super.formData) return super.formData()

    const contentType = this.headers.get('Content-Type') || ''

    // If mimeType’s essence is "multipart/form-data", then:
    if (/multipart\/form-data/.test(contentType)) {
      throw new Error('multipart/form-data not supported')
    } else if (/application\/x-www-form-urlencoded/.test(contentType)) {
      // Otherwise, if mimeType’s essence is "application/x-www-form-urlencoded", then:

      // 1. Let entries be the result of parsing bytes.
      let entries
      try {
        entries = new URLSearchParams(await this.text())
      } catch (err: any) {
        // istanbul ignore next: Unclear when new URLSearchParams can fail on a string.
        // 2. If entries is failure, then throw a TypeError.
        throw new TypeError(undefined, { cause: err as Error })
      }

      // 3. Return a new FormData object whose entries are entries.
      const formData = new FormData()
      for (const [name, value] of entries) {
        formData.append(name, value)
      }
      return formData as FormData
    } else {
      // Otherwise, throw a TypeError.
      throw new TypeError()
    }
  }
}

function mergeMapEntries(map1: PreloadQueriesByURL, map2: PreloadQueriesByURL | undefined) {
  map2 && map2.forEach((v, k) => map1.set(k, v))
}

function saveToPreloadAllPreload(query: PreloadQueryEntry) {
  let setCache = preloadCache.get(PRELOAD_ALL)
  if (!setCache) {
    setCache = new Map()
  }
  setCache?.set(hashKey(query.key), query)
  preloadCache.set(PRELOAD_ALL, setCache)
}

/**
 * @see https://github.com/frandiox/vitedge/blob/17f3cd943e86d7c0c71a862985ddd6caa2899425/src/node/utils.js#L19-L24
 *
 * Note: Request can sometimes be an instance of Express request, where `originalUrl` is the true source of what the
 * URL pathname is. We want to use that if it's present, so we union type this to `any`.
 */
function getUrlFromNodeRequest(request: any) {
  const url: string = request.originalUrl ?? request.url
  if (url && !url.startsWith('/')) return url

  // TODO: Find out how to determine https from `request` object without forwarded proto
  const secure = request.headers['x-forwarded-proto'] === 'https'

  return new URL(`${secure ? 'https' : 'http'}://${request.headers.host! + url}`).toString()
}

function getInitFromNodeRequest(request: any) {
  const init = {
    headers: new Headers(request.headers as { [key: string]: string }),
    method: request.method,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  }

  const remoteAddress = request.socket.remoteAddress
  if (!init.headers.has('x-forwarded-for') && remoteAddress) {
    init.headers.set('x-forwarded-for', remoteAddress)
  }

  return init
}

function normalizeUrl(rawUrl: string) {
  const url = new URL(rawUrl)
  const state = parseJSON(url.searchParams.get('state') ?? '')
  const normalizedUrl = new URL(state?.pathname ?? '', url.origin)
  normalizedUrl.search = state?.search

  return normalizedUrl.toString()
}
