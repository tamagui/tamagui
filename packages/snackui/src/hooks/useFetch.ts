import { isEqual } from '@o/fast-compare'

interface FetchCache {
  fetch?: Promise<void>
  error?: any
  init: RequestInit | undefined
  input: RequestInfo
  response?: any
}

export type UseFetchOptions = {
  disabled?: boolean
  init?: RequestInit | undefined
  lifespan: number
}

const fetchCaches: FetchCache[] = []

export function useFetch(input: RequestInfo, userOptions?: UseFetchOptions) {
  const options: UseFetchOptions = {
    lifespan: 0,
    ...userOptions,
  }

  for (const fetchCache of fetchCaches) {
    if (
      isEqual(input, fetchCache.input) &&
      isEqual(options.init, fetchCache.init)
    ) {
      // hasn't changed
      if (fetchCache.error) {
        throw fetchCache.error
      }
      if (fetchCache.response) {
        return fetchCache.response
      }
      throw fetchCache.fetch
    }
  }

  // new or has changed
  const fetchCache: FetchCache = {
    init: options.init,
    input,
    fetch: fetch(input, options.init)
      .then((response) => {
        const contentType = response.headers.get('Content-Type')
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json()
        }
        return response.text()
      })
      .then((response) => {
        // set response
        fetchCache.response = response
      })
      .catch((e) => {
        // set error
        fetchCache.error = e
      })
      .then(() => {
        // invalidate cache
        if (options.lifespan > 0) {
          setTimeout(() => {
            const index = fetchCaches.indexOf(fetchCache)
            if (index !== -1) {
              fetchCaches.splice(index, 1)
            }
          }, options.lifespan)
        }
      }),
  }

  fetchCaches.push(fetchCache)

  throw fetchCache.fetch
}
