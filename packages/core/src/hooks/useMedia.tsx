import { useForceUpdate } from '@tamagui/use-force-update'
import { useEffect, useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { matchMedia } from '../helpers/matchMedia'
import {
  ConfigureMediaQueryOptions,
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
} from '../types'
import { useConstant } from './useConstant'

/**
 * 🛑🛑🛑
 *
 *   for concurrent mode safety need to tweak this a little bit,
 *   don't mutate mediaState in setupMediaListeners
 *   and don't return a global mediaState
 *   instead each component gets a local copy of just the ones they listen to
 *
 * 🛑🛑🛑
 *
 */

export const mediaState: MediaQueryState = {} as any
const mediaQueryListeners: { [key: string]: Set<Function> } = {}

export function addMediaQueryListener(key: MediaQueryKey, cb: any) {
  mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
  mediaQueryListeners[key].add(cb)
}

export function removeMediaQueryListener(key: MediaQueryKey, cb: any) {
  mediaQueryListeners[key]?.delete(cb)
}

export const mediaQueryConfig: MediaQueries = {}
let hasSetup = false

export const getMedia = () => {
  return mediaState
}

const dispose = new Set<Function>()

export const configureMedia = ({
  queries,
  defaultActive = ['sm', 'xs'],
}: ConfigureMediaQueryOptions = {}) => {
  if (!queries) return

  // support hot reload
  if (hasSetup) {
    if (JSON.stringify(queries) === JSON.stringify(mediaQueryConfig)) {
      // hmr avoid update
      return
    }
    setupMediaListeners()
  }

  Object.assign(mediaQueryConfig, queries)

  // SSR = start all in the initial state you set
  for (const key in queries) {
    mediaState[key] = defaultActive.includes(key)
  }

  hasSetup = true
}

function setupMediaListeners() {
  // hmr, undo existing before re-binding
  dispose.forEach((cb) => cb())
  dispose.clear()

  for (const key in mediaQueryConfig) {
    const str = mediaObjectToString(mediaQueryConfig[key])
    try {
      const getMatch = () => matchMedia(str)
      const match = getMatch()
      if (!match || typeof match.addListener !== 'function') {
        // caught below
        throw new Error('⚠️ No match (seeing this in RN sometimes)')
      }
      mediaState[key] = !!match.matches
      // note this deprecated api works with polyfills we use now
      match.addListener(update)
      dispose.add(() => match.removeListener(update))

      function update() {
        const next = !!getMatch().matches
        if (next === mediaState[key]) return
        mediaState[key] = next
        const listeners = mediaQueryListeners[key]
        if (listeners?.size) {
          for (const cb of [...listeners]) {
            cb()
          }
        }
      }

      update()
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error running media query', str, err.message, err.stack)
    }
  }
}

export function useMediaQueryListeners() {
  useIsomorphicLayoutEffect(() => {
    return setupMediaListeners()
  }, [])
}

type UseMediaState = {
  selections: { [key: string]: boolean }
  nextSelections: { [key: string]: boolean }
  isRendering: boolean
  isUnmounted: boolean
}

export function useMedia(): {
  [key in MediaQueryKey]: boolean
} {
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
  useEffect(() => {
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
        if (key[0] === '$') {
          key = key.slice(1)
        }
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
