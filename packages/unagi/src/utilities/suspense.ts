import { QueryKey } from '../types.js'
import { hashKey } from './hash.js'

/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending'
  let response: T

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
    },
    (err) => {
      status = 'error'
      response = err
    }
  )

  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }

  return { read }
}

type Await<T> = T extends Promise<infer V> ? V : never

type SuspenseCacheEntry = {
  promise: Promise<unknown>
  error?: any
  response?: unknown
}

const browserCache: Record<string, SuspenseCacheEntry> = {}

/**
 * Perform an async function in a synchronous way for Suspense support.
 * To be used only in the client.
 * Inspired by https://github.com/pmndrs/suspend-react
 */
function query<Fn extends () => Promise<unknown>>(key: QueryKey, fn: Fn, preload = false) {
  const stringKey = hashKey(key)

  if (browserCache[stringKey]) {
    const entry = browserCache[stringKey]
    if (preload) return undefined as unknown as Await<ReturnType<Fn>>
    if (entry.error) throw entry.error
    if (entry.response) return entry.response as Await<ReturnType<Fn>>
    if (!preload) throw entry.promise
  }

  console.log('wtfff', stringKey)

  const entry: SuspenseCacheEntry = {
    promise: fn()
      .then((response) => (entry.response = response))
      .catch((error) => (entry.error = error)),
  }
  browserCache[stringKey] = entry

  console.log('wtfff', preload)

  if (!preload) {
    throw entry.promise
  }

  return undefined as unknown as Await<ReturnType<Fn>>
}

export const suspendFunction = <Fn extends () => Promise<unknown>>(key: QueryKey, fn: Fn) =>
  query(key, fn)

export const preloadFunction = (key: QueryKey, fn: () => Promise<unknown>) => query(key, fn, true)
