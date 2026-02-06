import type { MediaQueries, MediaQueryState } from '../types'

export let mediaState: MediaQueryState =
  // development only safeguard
  process.env.NODE_ENV === 'development'
    ? new Proxy(
        {},
        {
          get(target, key) {
            if (
              typeof key === 'string' &&
              key[0] === '$' &&
              // dont error on $$typeof
              key[1] !== '$'
            ) {
              throw new Error(`Access mediaState should not use "$": ${key}`)
            }
            return Reflect.get(target, key)
          },
        }
      )
    : ({} as any)

export const setMediaState = (next: MediaQueryState) => {
  mediaState = next
}

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => mediaState

export const mediaKeys = new Set<string>() // with $ prefix
