import React, { createContext, useContext } from 'react'

import type { QueryKey } from '../../types.js'
import { hashKey } from '../../utilities/hash.js'
import { collectQueryTimings } from '../../utilities/log/index.js'
import { getTime } from '../../utilities/timing.js'
import type { UnagiRequest } from '../UnagiRequest/UnagiRequest.server.js'

// Context to inject current request in SSR
const RequestContextSSR = createContext<UnagiRequest | null>(null)

// Cache to inject current request in RSC
function requestCacheRSC() {
  return new Map()
}

requestCacheRSC.key = Symbol.for('UNAGI_REQUEST')

type ServerRequestProviderProps = {
  request: UnagiRequest
  children: React.ReactNode
}

function getInternalReactDispatcher() {
  return (
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current || {}
  )
}

function isRsc() {
  // This flag is added by RSC Vite plugin
  return __UNAGI_TEST__ || !!getInternalReactDispatcher().isRsc
}

// Note: use this only during RSC/Flight rendering. The React dispatcher
// for SSR/Fizz rendering does not implement getCacheForType.
function getCacheForType(resource: () => Map<any, any>) {
  const dispatcher = getInternalReactDispatcher()

  // @ts-ignore
  if (__UNAGI_TEST__ && !dispatcher.getCacheForType) {
    // Jest does not have access to the RSC runtime, mock it here:
    // @ts-ignore
    return (globalThis.__jestRscCache ??= resource())
  }

  return dispatcher.getCacheForType(resource)
}

export function ServerRequestProvider({ request, children }: ServerRequestProviderProps) {
  if (isRsc()) {
    // Save the request object in a React cache that is
    // scoped to this current rendering.

    const requestCache = getCacheForType(requestCacheRSC)

    requestCache.set(requestCacheRSC.key, request)

    return <>{children}</>
  }

  // Use a normal provider in SSR to make the request object
  // available in the current rendering.
  return <RequestContextSSR.Provider value={request}>{children}</RequestContextSSR.Provider>
}

export function useServerRequest() {
  const request: UnagiRequest | undefined = isRsc()
    ? getCacheForType(requestCacheRSC)?.get(requestCacheRSC.key)
    : useContext(RequestContextSSR) // eslint-disable-line react-hooks/rules-of-hooks

  if (!request) {
    if (__UNAGI_TEST__) {
      // Unit tests are not wrapped in ServerRequestProvider.
      // This mocks it, instead of providing it in every test.
      return { ctx: {} } as UnagiRequest
    }

    throw new Error('No ServerRequest Context found')
  }

  return request
}

type RequestCacheResult<T> =
  | { data: T; error?: never } // success
  | { data?: never; error: Response | Error } // failure

/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export function useRequestCacheData<T>(
  key: QueryKey,
  fetcher: (request: UnagiRequest) => T | Promise<T>
): RequestCacheResult<T> {
  const request = useServerRequest()
  const cache = request.ctx.cache
  const cacheKey = hashKey(key)

  console.log('use it ok')

  if (!cache.has(cacheKey)) {
    let result: RequestCacheResult<T>
    let promise: Promise<RequestCacheResult<T> | void>

    cache.set(cacheKey, () => {
      if (result !== undefined) {
        collectQueryTimings(request, key, 'rendered')
        return result
      }

      if (!promise) {
        const startApiTime = getTime()
        const maybePromise = fetcher(request)

        if (!(maybePromise instanceof Promise)) {
          result = { data: maybePromise }
          return result
        }

        promise = maybePromise.then(
          (data) => {
            result = { data }

            collectQueryTimings(request, key, 'resolved', getTime() - startApiTime)
          },
          (error) => (result = { error })
        )
      }

      throw promise
    })
  }

  // Making sure the promise has returned data because it can be initated by a preload request,
  // otherwise, we throw the promise
  const result = cache.get(cacheKey).call()

  if (result instanceof Promise) throw result
  return result as RequestCacheResult<T>
}

export function preloadRequestCacheData(request: UnagiRequest): void {
  const preloadQueries = request.getPreloadQueries()
  const { cache } = request.ctx

  preloadQueries?.forEach((preloadQuery, cacheKey) => {
    collectQueryTimings(request, preloadQuery.key, 'preload')

    if (!cache.has(cacheKey)) {
      let result: unknown
      let promise: Promise<unknown>

      cache.set(cacheKey, () => {
        if (result !== undefined) {
          collectQueryTimings(request, preloadQuery.key, 'rendered')
          return result
        }
        if (!promise) {
          const startApiTime = getTime()
          promise = preloadQuery.fetcher(request).then(
            (data) => {
              result = { data }
              collectQueryTimings(request, preloadQuery.key, 'resolved', getTime() - startApiTime)
            },
            (error) => {
              result = { error }
            }
          )
        }
        return promise
      })
    }

    cache.get(cacheKey).call()
  })
}
