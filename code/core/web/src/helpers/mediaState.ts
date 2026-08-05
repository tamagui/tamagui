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

export const getMedia = () => mediaState

// shared across copies of this package for the same reason setConfig writes
// globalThis.__tamaguiConfig: an esm import and a cjs require resolve to
// different files, and only the copy that ran createTamagui fills these.
// sharing the containers rather than looking them up per read costs nothing.
const shared = (globalThis.__tamaguiMediaShared ||= {
  queryConfig: {} as MediaQueries,
  keys: new Set<string>(), // with $ prefix
  keysOrdered: [] as string[],
})

export const mediaQueryConfig: MediaQueries = shared.queryConfig
export const mediaKeys: Set<string> = shared.keys
export const mediaKeysOrdered: string[] = shared.keysOrdered
