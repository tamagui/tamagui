import { useForceUpdate } from '@tamagui/use-force-update'
import { useRef } from 'react'

import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { matchMedia } from '../helpers/matchMedia'
import {
  ConfigureMediaQueryOptions,
  MediaQueries,
  MediaQueryObject,
  MediaQueryState,
} from '../types'
import { useConstant } from './useConstant'

export const mediaState: { [key in keyof MediaQueryState]: boolean } = {} as any
const mediaQueryListeners: { [key: string]: Set<Function> } = {}

export const addMediaQueryListener = (key: string, cb: any) => {
  mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
  mediaQueryListeners[key].add(cb)
}

export const removeMediaQueryListener = (key: string, cb: any) => {
  mediaQueryListeners[key].delete(cb)
}

let conf: MediaQueries | null = null

export const mediaQueryConfig = new Proxy<MediaQueries>({} as any, {
  get(target, key) {
    if (!conf) {
      throw new Error(`Be sure to run configureMedia before accessing mediaQueryConfig`)
    }
    return Reflect.get(conf, key)
  },
  ownKeys() {
    if (!conf) {
      throw new Error(`Be sure to run configureMedia before accessing mediaQueryConfig`)
    }
    return Object.keys(conf)
  },
  getOwnPropertyDescriptor() {
    return {
      enumerable: true,
      configurable: true,
    }
  },
})

export const getMedia = () => {
  if (!conf) {
    throw new Error(`not configured yet`)
  }
  return mediaState
}

export const configureMedia = ({
  queries,
  defaultActive = ['sm', 'xs'],
}: ConfigureMediaQueryOptions = {}) => {
  if (conf) {
    console.warn(
      `Already configured mediaQueries once (you may have called getMedia() before configureMedia())`
    )
  }

  if (queries) {
    conf = queries
  }

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
    } catch (err: any) {
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

export const useMedia = () => {
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
        removeMediaQueryListener(key, forceUpdate)
      }
    }
    // add new
    for (const key in st.nextSelections) {
      if (!(key in st.selections)) {
        addMediaQueryListener(key, forceUpdate)
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
        removeMediaQueryListener(key, forceUpdate)
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

function camelToHyphen(str: string) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()
}

export function mediaObjectToString(query: string | MediaQueryObject) {
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
