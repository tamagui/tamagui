import type { MediaQueries, MediaQueryState } from '../types'

export let mediaState: MediaQueryState = {} as any

export const setMediaState = (next: MediaQueryState) => {
  mediaState = next
}

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => mediaState

export const mediaKeys = new Set<string>()
