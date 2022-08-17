import { preloadFunction, suspendFunction } from '../../../utilities/suspense.js'
import { ResponseSync } from '../ResponseSync.js'

/**
 * Fetch a URL for use in a client component Suspense boundary.
 */
export function fetchSync(url: string, options?: RequestInit) {
  const responseSyncInit = suspendFunction([url, options], async () => {
    console.log('wsadas')
    const response = await globalThis.fetch(new URL(url, window.location.origin), options)
    console.log('wsadas', response)

    return ResponseSync.toSerializable(response)
  })

  return new ResponseSync(responseSyncInit)
}

/**
 * Preload a URL for use in  a client component Suspense boundary.
 * Useful for placing higher in the tree to avoid waterfalls.
 */
export function preload(url: string, options?: RequestInit) {
  preloadFunction([url, options], async () => {
    const response = await globalThis.fetch(url, options)
    const text = await response.text()

    return [text, response] as [string, Response]
  })
}
