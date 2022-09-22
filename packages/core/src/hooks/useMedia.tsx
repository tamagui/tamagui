import { useEffect, useMemo, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { matchMedia } from '../helpers/matchMedia'
import {
  MediaQueries,
  MediaQueryKey,
  MediaQueryObject,
  MediaQueryState,
  TamaguiInternalConfig,
} from '../types'
import { useSafeRef } from './useSafeRef'

export const mediaState: MediaQueryState =
  // development time safeguard
  process.env.NODE_ENV === 'development'
    ? new Proxy(
        {},
        {
          get(target, key) {
            if (typeof key === 'string' && key[0] === '$') {
              throw new Error(`Access of mediaState should never include $`)
            }
            return Reflect.get(target, key)
          },
        }
      )
    : ({} as any)

type MediaListener = (next: boolean) => void

const mediaQueryListeners: { [key: string]: Set<MediaListener> } = {}

export function addMediaQueryListener(key: MediaQueryKey, cb: MediaListener) {
  if (process.env.NODE_ENV === 'development' && key[0] === '$') {
    // eslint-disable-next-line no-console
    console.warn(`Warning, listening to media queries shouldn't use the "$" prefix`)
  }
  mediaQueryListeners[key] = mediaQueryListeners[key] || new Set()
  mediaQueryListeners[key].add(cb)
  return () => removeMediaQueryListener(key, cb)
}

export function removeMediaQueryListener(key: MediaQueryKey, cb: MediaListener) {
  mediaQueryListeners[key]?.delete(cb)
}

export const mediaQueryConfig: MediaQueries = {}

export const getMedia = () => {
  return mediaState
}

const dispose = new Set<Function>()

// for SSR capture it at time of startup
let initialMediaState: MediaQueryState | null

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media, mediaQueryDefaultActive } = config
  if (!media) return
  for (const key in media) {
    mediaState[key] = mediaQueryDefaultActive?.[key] || false
  }
  Object.assign(mediaQueryConfig, media)
  initialMediaState = { ...mediaState }
  if (config.disableSSR) {
    setupMediaListeners()
  }
}

export const getInitialMediaState = () => initialMediaState

function unlisten() {
  dispose.forEach((cb) => cb())
  dispose.clear()
}

/**
 * Note: This should *not* set the state on the first render!
 * Because to avoid hydration issues SSR must match the server
 * *and then* re-render with the actual media query state.
 */
let configuredKey = ''
function setupMediaListeners() {
  // avoid setting up more than once per config
  const nextKey = JSON.stringify(mediaQueryConfig)
  if (nextKey === configuredKey) {
    return
  }
  configuredKey = nextKey

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
        listeners.forEach((cb) => cb(next))
      }
    }
  }
}

export function useMediaQueryListeners(config: TamaguiInternalConfig) {
  if (config.disableSSR) {
    return
  }

  useEffect(() => {
    setupMediaListeners()
    return unlisten
  }, [])
}

export function useMedia(): {
  [key in MediaQueryKey]: boolean
} {
  const [state, setState] = useState(initialMediaState || {})
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
    const disposes: Function[] = Object.keys(keys.current).map((key) =>
      addMediaQueryListener(key, updateState)
    )
    updateState()
    return () => {
      disposes.forEach((cb) => cb())
    }
  })

  return useMemo(
    () =>
      new Proxy(state, {
        get(_, key: string) {
          if (process.env.NODE_ENV === 'development') {
            if (!initialMediaState) {
              throw new Error(
                `To use useMedia() you must pass in media configuration to createTamagui, none was found.`
              )
            }
          }
          if (!keys.current[key]) {
            keys.current[key] = true
          }
          return Reflect.get(state, key)
        },
      }),
    [state, keys]
  )
}

/**
 * Useful for more complex components that need access to the currently active props,
 * accounting for the currently active media queries.
 *
 * Use sparingly, is will loop props and trigger re-render on all media queries.
 *
 * */
export function useMediaPropsActive<A extends Object>(
  props: A
): {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]: A[Key]
} {
  const media = useMedia()

  return useMemo(() => {
    const evaluated = {} as A
    const lastSetImportanceForKey = {}
    const propNames = Object.keys(props)
    const mediaKeysOrdered = Object.keys(getMedia())

    function update(k: string, v: any, importance = 0) {
      if (lastSetImportanceForKey[k] > importance) {
        return
      }
      lastSetImportanceForKey[k] = importance
      evaluated[k] = v
    }

    for (let i = propNames.length - 1; i >= 0; i--) {
      const key = propNames[i]
      const val = props[key]
      if (key[0] === '$') {
        const shortKey = key.slice(1)
        if (!media[shortKey]) {
          continue
        }
        if (val && typeof val === 'object') {
          const subPropNames = Object.keys(val)
          const mediaImportance = mediaKeysOrdered.indexOf(shortKey)
          for (let j = subPropNames.length; j--; j >= 0) {
            const skey = subPropNames[j]
            update(skey, val[skey], mediaImportance)
          }
        }
      } else {
        update(key, val)
      }
    }

    return evaluated
  }, [media, props])
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
