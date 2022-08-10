import { useMemo, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { matchMedia } from '../helpers/matchMedia'
import {
  ConfigureMediaQueryOptions,
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
} from '../types'
import { useSafeRef } from './useSafeRef'

export const mediaState: MediaQueryState = {} as any
const mediaQueryListeners: { [key: string]: Set<Function> } = {}

export function addMediaQueryListener(key: MediaQueryKey, cb: any) {
  mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
  mediaQueryListeners[key].add(cb)
  return () => removeMediaQueryListener(key, cb)
}

export function removeMediaQueryListener(key: MediaQueryKey, cb: any) {
  mediaQueryListeners[key]?.delete(cb)
}

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => {
  return mediaState
}

const dispose = new Set<Function>()

// for SSR capture it at time of startup
let initialMediaState: MediaQueryState | null

export const configureMedia = ({
  queries,
  defaultActive = {},
}: ConfigureMediaQueryOptions = {}) => {
  if (!queries) return

  // support hot reload
  if (initialMediaState) {
    if (process.env.NODE_ENV === 'development') {
      if (JSON.stringify(queries) === JSON.stringify(mediaQueryConfig)) {
        // hmr avoid update
        return
      }
    }
    setupMediaListeners()
  }

  Object.assign(mediaQueryConfig, queries)
  // start in the initial state
  for (const key in queries) {
    mediaState[key] = defaultActive[key] || false
  }
  initialMediaState = { ...mediaState }
}

function unlisten() {
  dispose.forEach((cb) => cb())
  dispose.clear()
}

function setupMediaListeners() {
  // hmr, undo existing before re-binding
  unlisten()

  for (const key in mediaQueryConfig) {
    const str = mediaObjectToString(mediaQueryConfig[key])
    const getMatch = () => matchMedia(str)
    const match = getMatch()
    if (!match) {
      throw new Error('⚠️ No match')
    }
    // react native needs these deprecated apis for now
    match.addListener(update)
    dispose.add(() => match.removeListener(update))
    update()

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
  }
}

export function useMediaQueryListeners() {
  useIsomorphicLayoutEffect(() => {
    setupMediaListeners()
    return unlisten
  }, [])
}

export function useMedia(): {
  [key in MediaQueryKey]: boolean
} {
  const [state, setState] = useState(initialMediaState!)
  const keys = useSafeRef({} as Record<string, boolean>)

  function updateState() {
    setState((prev) => {
      for (const key in keys.current) {
        if (prev[key] !== mediaState[key]) {
          return { ...mediaState }
        }
      }
      return prev
    })
  }

  useIsomorphicLayoutEffect(() => {
    const listeners: Function[] = []
    for (const key in keys.current) {
      listeners.push(addMediaQueryListener(key, updateState))
    }
    updateState()
    return () => {
      listeners.forEach((cb) => cb())
    }
  })

  return useMemo(
    () =>
      new Proxy(state, {
        get(_, key: string) {
          if (!keys.current[key]) {
            keys.current = { ...keys.current, [key]: true }
          }
          return Reflect.get(state, key)
        },
      }),
    [state, keys]
  )
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
