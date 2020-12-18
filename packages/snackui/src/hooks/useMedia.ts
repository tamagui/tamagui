//
// for types:
//
//   interface MyMediaQueries {}
//   const myMediaQueries: MyMediaQueries = {}
//   configureMedia(myMediaQueries)
//   declare module 'snackui' {
//     interface MediaQueryState extends MyMediaQueries
//   }
//
//

import { useEffect, useLayoutEffect, useRef } from 'react'

import { useConstant } from './useConstant'
import { useForceUpdate } from './useForceUpdate'

type MediaQueryObject = { [key: string]: string | number }
type MediaQueryShort = MediaQueryObject

if (!process.env.IS_STATIC) {
  require('@expo/match-media')
}

// temp patch for test environments
global.matchMedia =
  global.matchMedia ||
  function () {
    return { addEventListener() {}, removeEventListener() {}, matches: [] }
  }

export interface MediaQueryState {
  xs: boolean
  notXs: boolean
  sm: boolean
  notSm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  short: boolean
  tall: boolean
}

export type MediaQueries = {
  [key in keyof MediaQueryState]: MediaQueryShort
}

export const defaultMediaQueries = {
  xs: { maxWidth: 660 },
  notXs: { minWidth: 660 + 1 },
  sm: { maxWidth: 860 },
  notSm: { minWidth: 860 + 1 },
  md: { minWidth: 960 },
  lg: { minWidth: 1120 },
  xl: { minWidth: 1280 },
  xxl: { minWidth: 1420 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
}

const media: { [key in keyof MediaQueryState]: boolean } = {} as any
const mediaQueryListeners: { [key: string]: Set<Function> } = {}

export const getMedia = () => media

let hasConfigured = false
let mediaQueries: MediaQueries = { ...defaultMediaQueries }

export const configureMedia = (queries: MediaQueries = mediaQueries) => {
  if (hasConfigured) {
    throw new Error(`Already configured mediaQueries once`)
  }
  hasConfigured = true
  mediaQueries = queries

  // setup
  for (const key in queries) {
    const getMatch = () => global.matchMedia(mediaObjectToString(queries[key]))
    const match = getMatch()
    media[key] = !!match.matches
    match.addEventListener('change', () => {
      media[key] = !!getMatch().matches
      const listeners = mediaQueryListeners[key]
      if (listeners?.size) {
        for (const cb of [...listeners]) {
          cb()
        }
      }
    })
  }
}

type UseMediaState = {
  selections: { [key: string]: boolean }
  nextSelections: { [key: string]: boolean }
  isRendering: boolean
}

export const useMedia = () => {
  if (!hasConfigured) {
    configureMedia()
  }

  const forceUpdate = useForceUpdate()
  const state = useRef() as React.MutableRefObject<UseMediaState>
  if (!state.current) {
    state.current = {
      selections: {},
      nextSelections: {},
      isRendering: true,
    }
  }
  state.current.isRendering = true

  // track usage
  useLayoutEffect(() => {
    const st = state.current
    st.isRendering = false
    for (const key in st.selections) {
      if (!(key in st.nextSelections)) {
        mediaQueryListeners[key].delete(forceUpdate)
      }
    }
    for (const key in st.nextSelections) {
      if (!(key in st.selections)) {
        mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
        mediaQueryListeners[key].add(forceUpdate)
      }
    }
  })

  // unmount
  useEffect(() => {
    return () => {
      for (const key in state.current.selections) {
        mediaQueryListeners[key].delete(forceUpdate)
      }
    }
  }, [])

  return useConstant(() => {
    return new Proxy({} as MediaQueryState, {
      get(_, key) {
        if (!media) return
        if (typeof key !== 'string') return
        if (!(key in media)) {
          throw new Error(
            `No media query configured "${String(key)}" in: ${Object.keys(
              media
            )}`
          )
        }
        if (state.current.isRendering) {
          state.current.nextSelections[key] = true
        }
        return media[key]
      },
    })
  })
}

const camelToHyphen = (str: string) =>
  str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()

export const mediaObjectToString = (
  query: string | MediaQueryObject,
  negate?: boolean
) => {
  if (typeof query === 'string') return query
  return Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
}
