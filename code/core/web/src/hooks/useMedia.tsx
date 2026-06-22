import { isServer, isWeb } from '@tamagui/constants'
import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { getSetting } from '../config'
import { resetMediaStyleCache } from '../helpers/createMediaStyle'
import { resetGroupPropPartsCache } from '../helpers/getGroupPropParts'
import { matchMedia } from '../helpers/matchMedia'
import { mediaObjectToString } from '../helpers/mediaObjectToString'
import {
  getMedia,
  mediaKeys,
  mediaQueryConfig,
  setMediaState,
} from '../helpers/mediaState'
import type {
  ComponentContextI,
  DebugProp,
  GetStyleState,
  IsMediaType,
  MediaQueryState,
  TamaguiInternalConfig,
  UseMediaState,
  WidthHeight,
} from '../types'
import { defaultMediaImportance } from '../helpers/pseudoDescriptors'

const mediaKeyRegex = /\$(platform|theme|group)-/

export const isMediaKey = (key: string): boolean => {
  if (key[0] !== '$') return false
  if (mediaKeys.has(key)) return true
  if (mediaKeyRegex.test(key)) return true
  return false
}

export const getMediaKey = (key: string): IsMediaType => {
  if (key[0] !== '$') return false
  if (mediaKeys.has(key)) return true
  const match = key.match(mediaKeyRegex)
  if (match) return match[1] as 'platform' | 'theme' | 'group'
  return false
}

// for SSR capture it at time of startup
let initState: MediaQueryState

let mediaKeysOrdered: string[]

export const getMediaKeyImportance = (key: string) => {
  if (process.env.NODE_ENV === 'development' && key[0] === '$') {
    throw new Error('use short key')
  }

  // + 100 because we set base usedKeys=1, pseudos are 2-N (however many we have)
  // all media go above all pseudos so we need to pad it based on that
  // right now theres 5 pseudos but in the future could be a few more
  return mediaKeysOrdered.indexOf(key) + 100
}

const dispose = new Set<Function>()

let mediaVersion = 0

export const configureMedia = (config: TamaguiInternalConfig) => {
  const { media } = config
  const mediaQueryDefaultActive = getSetting('mediaQueryDefaultActive')
  if (!media) return
  mediaVersion++
  // reset cached media style prefixes/selectors so they get recalculated with new key order
  resetMediaStyleCache()
  // group prop parts cache contains in-checks against the prior media map
  resetGroupPropPartsCache()
  // touch-tracker getter object depends on the current media key set
  resetMediaTouchTracker()
  for (const key in media) {
    getMedia()[key] = mediaQueryDefaultActive?.[key] || false
    mediaKeys.add(`$${key}`)
  }
  Object.assign(mediaQueryConfig, media)
  initState = { ...getMedia() }
  mediaKeysOrdered = Object.keys(media)
  setupMediaListeners()
}

function unlisten() {
  dispose.forEach((cb) => cb())
  dispose.clear()
}

/**
 * Note: This should *not* set the state on the first render!
 * Because to avoid hydration issues SSR must match the server
 * *and then* re-render with the actual media query state.
 */
let setupVersion = -1
export function setupMediaListeners() {
  if (isWeb && isServer) return
  if (process.env.IS_STATIC) return

  // avoid setting up more than once per config
  if (setupVersion === mediaVersion) return
  setupVersion = mediaVersion

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
    dispose.add(() => {
      match.removeListener(update)
    })

    function update() {
      const next = !!getMatch().matches
      if (next === getMedia()[key]) return
      setMediaState({ ...getMedia(), [key]: next })
      updateMediaListeners()
    }

    update()
  }
}

const listeners = new Set<any>()

export function updateMediaListeners() {
  listeners.forEach((cb) => cb(getMedia()))
}

type MediaState = {
  enabled?: boolean
  keys?: Set<string> | null
}

const States = new WeakMap<any, MediaState>()

type MediaRefSlot = {
  proxyTarget: MediaQueryState
  keys: Set<string>
}

// shared "touch tracker" prototype: one object whose enumerable getter
// properties are pre-defined for every configured media key. Hermes inlines
// getter calls; the old `new Proxy(state, { get })` path forced an interpreted
// trap on every access.
let touchTrackerProto: object | null = null
const refSlot = Symbol('mediaRefSlot')

function buildTouchTrackerProto(): object {
  const proto: PropertyDescriptorMap = {}
  for (const fullKey of mediaKeys) {
    const key = fullKey[0] === '$' ? fullKey.slice(1) : fullKey
    proto[key] = {
      enumerable: true,
      configurable: true,
      get(this: { [refSlot]: MediaRefSlot }) {
        const slot = this[refSlot]
        if (!disableMediaTouch) {
          slot.keys.add(key)
        }
        return slot.proxyTarget[key]
      },
    }
  }
  return Object.create(null, proto)
}

function getTouchTrackerProto(): object {
  if (!touchTrackerProto) touchTrackerProto = buildTouchTrackerProto()
  return touchTrackerProto
}

function resetMediaTouchTracker() {
  touchTrackerProto = null
}

export function setMediaShouldUpdate(
  ref: any,
  enabled?: boolean,
  keys?: MediaState['keys']
) {
  const cur = States.get(ref)

  if (!cur || cur.enabled !== enabled || keys) {
    States.set(ref, {
      ...cur,
      enabled,
      keys,
    })
  }
}

function subscribe(subscriber: () => void) {
  listeners.add(subscriber)
  return () => {
    listeners.delete(subscriber)
  }
}

// =====================================================================
// MOONSHOT: media subscription lives in MediaProvider at the root.
// Components below just useContext(MediaContext) to read the current
// MediaQueryState. No per-component useSyncExternalStore.
// =====================================================================

export const MediaContext = createContext<MediaQueryState | null>(null)

const getServerSnapshot = () => initState

/**
 * Hosts the single media subscription for the tree. Renders the current
 * media snapshot into context so descendant useMedia()/createComponent calls
 * only pay a useContext cost.
 */
export function MediaProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getMedia, getServerSnapshot)
  return <MediaContext.Provider value={state}>{children}</MediaContext.Provider>
}

export function useMedia(
  componentContext?: ComponentContextI,
  debug?: DebugProp
): UseMediaState {
  'use no memo'

  type MediaRef = {
    keys: Set<string>
    proxyTarget: MediaQueryState
    proxy: UseMediaState
    componentContext?: ComponentContextI
    debug?: DebugProp
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`media-enter`

  const ctxState = useContext(MediaContext) ?? getMedia()

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`media-useContext`

  const internalRef = useRef<MediaRef | null>(null)
  if (!internalRef.current) {
    const r: MediaRef = {
      keys: new Set<string>(),
      proxyTarget: ctxState,
      proxy: undefined as unknown as UseMediaState,
      componentContext,
      debug,
    }
    const tracker = Object.create(getTouchTrackerProto())
    tracker[refSlot] = { proxyTarget: ctxState, keys: r.keys } as MediaRefSlot
    r.proxy = tracker as UseMediaState
    internalRef.current = r
  } else {
    internalRef.current.componentContext = componentContext
    internalRef.current.debug = debug
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`media-useRef-proxyCreate`

  const ref = internalRef.current

  // clear each render to track only rendered touched keys
  if (ref.keys.size) {
    ref.keys.clear()
  }

  // re-point the cached tracker at the current snapshot so getters read it
  ref.proxyTarget = ctxState
  ;(ref.proxy as any)[refSlot].proxyTarget = ctxState

  if (process.env.NODE_ENV === 'development' && ref.debug) {
    // (debug log preserved from prior implementation if needed)
  }

  if (process.env.NODE_ENV === 'development' && globalThis.time)
    globalThis.time`media-repoint`

  return ref.proxy
}

let disableMediaTouch = false
export function _disableMediaTouch(val: boolean) {
  disableMediaTouch = val
}

export function getMediaState(mediaGroups: Set<string>, layout: WidthHeight) {
  disableMediaTouch = true
  let res: Record<string, boolean>
  try {
    res = Object.fromEntries(
      [...mediaGroups].map((mediaKey) => {
        return [mediaKey, mediaKeyMatch(mediaKey, layout as any)]
      })
    )
  } finally {
    disableMediaTouch = false
  }
  return res
}

export const getMediaImportanceIfMoreImportant = (
  mediaKey: string,
  key: string,
  styleState: GetStyleState,
  isSizeMedia: boolean
) => {
  const importance = isSizeMedia
    ? getMediaKeyImportance(mediaKey)
    : defaultMediaImportance
  const usedKeys = styleState.usedKeys
  return !usedKeys[key] || importance > usedKeys[key] ? importance : null
}

const cachedMediaKeyToQuery: Record<string, string> = {}

export function mediaKeyToQuery(key: string) {
  return (
    cachedMediaKeyToQuery[key] ||
    (cachedMediaKeyToQuery[key] = mediaObjectToString(mediaQueryConfig[key]))
  )
}

export function mediaKeyMatch(
  key: string,
  dimensions: { width: number; height: number }
) {
  const mediaQueries = mediaQueryConfig[key]
  const result = Object.keys(mediaQueries).every((query) => {
    const expectedVal = +mediaQueries[query]
    const isMax = query.startsWith('max')
    const isWidth = query.endsWith('Width')
    const givenVal = dimensions[isWidth ? 'width' : 'height']
    // if not max then min
    return isMax ? givenVal < expectedVal : givenVal > expectedVal
  })
  return result
}
