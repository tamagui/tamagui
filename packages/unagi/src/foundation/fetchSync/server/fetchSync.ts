import { UnagiUseQueryOptions, useQuery } from '../../useQuery/index.js'
import { useUrl } from '../../useUrl/index.js'
import { ResponseSync } from '../ResponseSync.js'

/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export function fetchSync(
  url: string,
  options?: Omit<RequestInit, 'cache'> & UnagiUseQueryOptions
) {
  console.log('url', url)
  const { cache, preload, shouldCacheResponse, ...requestInit } = options ?? {}
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { origin } = useUrl()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error } = useQuery(
    [url, requestInit],
    async () => {
      console.log('wadsad')
      const response = await globalThis.fetch(new URL(url, origin), requestInit)
      return ResponseSync.toSerializable(response)
    },
    {
      cache,
      preload,
      shouldCacheResponse,
    }
  )

  if (error) {
    throw error
  }

  return new ResponseSync(data)
}
