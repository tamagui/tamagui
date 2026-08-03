import type { MediaQueries, MediaQueryState } from '../types'

export let mediaState: MediaQueryState = {} as any

export const setMediaState = (next: MediaQueryState) => {
  mediaState = next
}

// shared across copies of this package for the same reason setConfig writes
// globalThis.__tamaguiConfig: an esm import and a cjs require resolve to
// different files, and only the copy that ran createTamagui fills these.
// sharing the containers rather than looking them up per read costs nothing.
const shared = (globalThis.__tamaguiMediaShared ||= {
  queryConfig: {} as MediaQueries,
  keys: new Set<string>(),
})

export const mediaQueryConfig: MediaQueries = shared.queryConfig

export const getMedia = () => mediaState

export const mediaKeys: Set<string> = shared.keys
