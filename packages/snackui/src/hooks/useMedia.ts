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

import { useRef } from 'react'

import { defaultMediaQueries } from '../constants'
import { matchMedia } from '../helpers/matchMedia'
import { useIsomorphicLayoutEffect } from '../platform'
import { useConstant } from './useConstant'
import { useForceUpdate } from './useForceUpdate'

type MediaQueryObject = { [key: string]: string | number | string }
type MediaQueryShort = MediaQueryObject

export type MediaQueryState = {
  [key in keyof typeof defaultMediaQueries]: boolean
}

export type MediaQueryKey = keyof MediaQueryState

export type MediaQueries = {
  [key in MediaQueryKey]: MediaQueryShort
}

const mediaState: { [key in keyof MediaQueryState]: boolean } = {} as any
const mediaQueryListeners: { [key: string]: Set<Function> } = {}

export const getMedia = () => mediaState

let hasConfigured = false

export type ConfigureMediaQueryOptions = {
  queries: MediaQueries
  defaultActive?: MediaQueryKey[]
}

export const configureMedia = ({
  queries = defaultMediaQueries,
  defaultActive = ['sm', 'xs'],
}: ConfigureMediaQueryOptions) => {
  if (hasConfigured) {
    console.warn(`Already configured mediaQueries once`)
    return
  }
  hasConfigured = true

  // setup
  for (const key in queries) {
    const str = mediaObjectToString(queries[key])
    try {
      const getMatch = () => matchMedia(str)
      const match = getMatch()
      if (!match || typeof match.addListener !== 'function') {
        // caught below
        throw new Error('⚠️ No match (seeing this in RN sometimes)')
      }
      mediaState[key] = !!match.matches
      match.addListener(() => {
        const next = !!getMatch().matches
        if (next === mediaState[key]) return
        mediaState[key] = next
        const listeners = mediaQueryListeners[key]
        if (listeners?.size) {
          for (const cb of [...listeners]) {
            cb()
          }
        }
      })
    } catch (err) {
      console.error('Error running media query', str, err.message, err.stack)
      const isDefaultActive = defaultActive?.includes(key as any) ?? true
      mediaState[key] = isDefaultActive
    }
  }
}

type UseMediaState = {
  selections: { [key: string]: boolean }
  nextSelections: { [key: string]: boolean }
  isRendering: boolean
  isUnmounted: boolean
}

const defaultOptions: ConfigureMediaQueryOptions = {
  queries: defaultMediaQueries,
  // defaultActive: ['sm', 'xs']
}

export const useMedia = () => {
  if (!hasConfigured) {
    configureMedia(defaultOptions)
  }

  const forceUpdate = useForceUpdate()
  const state = useRef() as React.MutableRefObject<UseMediaState>
  if (!state.current) {
    state.current = {
      selections: {},
      nextSelections: {},
      isUnmounted: false,
      isRendering: true,
    }
  }
  state.current.isRendering = true

  // track usage
  useIsomorphicLayoutEffect(() => {
    const st = state.current
    st.isRendering = false
    // delete old
    for (const key in st.selections) {
      if (!(key in st.nextSelections)) {
        mediaQueryListeners[key].delete(forceUpdate)
      }
    }
    // add new
    for (const key in st.nextSelections) {
      if (!(key in st.selections)) {
        mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
        mediaQueryListeners[key].add(forceUpdate)
      }
    }
  })

  // unmount
  useIsomorphicLayoutEffect(() => {
    return () => {
      const st = state.current
      st.isUnmounted = true
      const allKeys = {
        ...st.selections,
        ...st.nextSelections,
      }
      for (const key in allKeys) {
        mediaQueryListeners[key].delete(forceUpdate)
      }
    }
  }, [])

  return useConstant(() => {
    const st = state.current
    return new Proxy(mediaState, {
      get(target, key: string) {
        if (!(key in mediaState)) {
          return Reflect.get(target, key)
        }
        if (!st.isUnmounted) {
          if (st.isRendering) {
            st.nextSelections[key] = true
          }
        }
        if (key in mediaState) {
          return mediaState[key]
        }
        return Reflect.get(mediaState, key)
      },
    })
  })
}

const camelToHyphen = (str: string) =>
  str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()

export const mediaObjectToString = (query: string | MediaQueryObject) => {
  if (typeof query === 'string') {
    return query
  }
  return Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'string') {
        return `(${feature}: ${value})`
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
}
