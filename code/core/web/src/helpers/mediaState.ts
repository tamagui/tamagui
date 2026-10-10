import type { MediaQueries, MediaQueryState } from '../types'

export let mediaState: MediaQueryState = {} as any

export const setMediaState = (next: MediaQueryState) => {
  mediaState = next
}

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => mediaState

export const mediaKeys = new Set<string>()

export function mediaKeyMatch(
  key: string,
  dimensions: { width: number; height: number }
) {
  const mediaQueries = mediaQueryConfig[key]
  for (const query in mediaQueries) {
    const expectedVal = +mediaQueries[query]
    const isMax = query.startsWith('max')
    const isWidth = query.endsWith('Width')
    const givenVal = dimensions[isWidth ? 'width' : 'height']
    if (isMax ? givenVal >= expectedVal : givenVal <= expectedVal) return false
  }
  return true
}
