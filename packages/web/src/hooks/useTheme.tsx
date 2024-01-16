import { isClient, isServer } from '@tamagui/constants'
import { useContext, useMemo, useRef, useSyncExternalStore } from 'react'

import { getConfig } from '../config'
import {
  ThemeManager,
  ThemeManagerState,
  getHasThemeUpdatingProps,
} from '../helpers/ThemeManager'
import { ThemeManagerIDContext } from '../helpers/ThemeManagerContext'
import { isEqualShallow } from '../helpers/createShallowSetState'
import type {
  ThemeParsed,
  ThemeProps,
  UseThemeResult,
  UseThemeWithStateProps,
} from '../types'
import { getThemeProxied } from './getThemeProxied'

export type ChangedThemeResponse = {
  state?: ThemeManagerState
  themeManager?: ThemeManager | null
  isNewTheme: boolean
  // null = never been inversed
  // false = was inversed, now not
  inversed?: null | boolean
  mounted?: boolean
}

const emptyProps = { name: null }

let cache: any
function getDefaultThemeProxied() {
  if (cache) return cache
  const config = getConfig()
  const name = config.themes.light ? 'light' : Object.keys(config.themes)[0]
  const defaultTheme = config.themes[name]
  cache = getThemeProxied({ theme: defaultTheme, name })
  return cache
}

export const useTheme = (props: ThemeProps = emptyProps) => {
  const [_, theme] = useThemeWithState(props)
  const res = theme || getDefaultThemeProxied()
  return res as UseThemeResult
}

export const useThemeWithState = (
  props: UseThemeWithStateProps
): [ChangedThemeResponse, ThemeParsed] => {
  const keys = useRef<string[]>([])

  const changedThemeState = useChangeThemeEffect(props, false, keys)

  const { themeManager, state } = changedThemeState

  if (process.env.NODE_ENV === 'development') {
    if (!state?.theme) {
      if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
        console.warn(
          `[tamagui] No theme found, this could be due to an invalid theme name (given theme props ${JSON.stringify(
            props
          )}).\n\nIf this is intended and you are using Tamagui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1`
        )
      }
    }
  }

  const themeProxied = useMemo(() => {
    if (!themeManager || !state?.theme) {
      return {}
    }
    return getThemeProxied(state, props.deopt, themeManager, keys.current, props.debug)
  }, [state?.theme, themeManager, props.deopt, props.debug])

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed('  🔹 useTheme =>', state?.name)
    console.info('returning state', changedThemeState, 'from props', props)
    console.groupEnd()
  }

  return [changedThemeState, themeProxied]
}

export const activeThemeManagers = new Set<ThemeManager>()

// until WeakRef support:
const _uidToManager = new WeakMap<Object, ThemeManager>()
const _idToUID: Record<number, Object> = {}
const getId = (id: number) => _idToUID[id]

export const getThemeManager = (id: number) => {
  return _uidToManager.get(getId(id)!)
}

const registerThemeManager = (t: ThemeManager) => {
  if (!_idToUID[t.id]) {
    const id = (_idToUID[t.id] = {})
    _uidToManager.set(id, t)
  }
}

const emptyCb = (cb: Function) => cb()

export const useChangeThemeEffect = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: { current: string[] }
): ChangedThemeResponse => {
  const { disable } = props

  // TODO perf: put into ComponentContext to remove one more hook
  const parentManagerId = useContext(ThemeManagerIDContext)
  const parentManager = getThemeManager(parentManagerId)

  if ((!isRoot && !parentManager) || disable) {
    return {
      isNewTheme: false,
      state: parentManager?.state,
      themeManager: parentManager,
    }
  }

  const subscribe = parentManager?.onChangeTheme || emptyCb

  // TODO perf: can remove if put into createComponent above
  const prevRef = useRef<ChangedThemeResponse | undefined>()

  function shouldUpdate() {
    if (isServer) return false
    return props.shouldUpdate?.() ?? ((keys?.current.length ?? 0) > 0 ? true : undefined)
  }

  function getSnapshot() {
    const prev = prevRef.current

    const shouldPersist =
      // isRoot ||
      shouldUpdate?.() ||
      props.deopt ||
      // this fixes themeable() not updating with the new fastSchemeChange setting
      (process.env.TAMAGUI_TARGET === 'native'
        ? props['disable-child-theme']
          ? true
          : undefined
        : undefined)

    const hasThemeUpdatingProps = getHasThemeUpdatingProps(props)
    if (!hasThemeUpdatingProps && prev?.isNewTheme === false) {
      return prev
    }

    const updatedState = getUpdatedStateIfChanged(
      props,
      parentManager,
      prev,
      isRoot,
      shouldPersist
    )

    if (updatedState) {
      prevRef.current = updatedState
      if (updatedState.shouldUpdate) {
        updatedState.themeManager?.updateState(updatedState.state!, false)
      }
      if (prev?.isNewTheme) {
        // // if it was a new theme already and is updating, notify children
        console.warn('NOTIFY', updatedState, prev)
        updatedState.themeManager?.notify()
      }
      if (shouldPersist || !prev) {
        return updatedState
      }
    }

    return prev!
  }

  const themeState = useSyncExternalStore<ChangedThemeResponse>(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  const { state, mounted, isNewTheme, themeManager, inversed } = themeState
  const isInversingOnMount = Boolean(!mounted && props.inverse)

  if (isInversingOnMount) {
    return {
      isNewTheme: false,
      inversed: false,
      themeManager: parentManager,
      state: {
        name: '',
        ...parentManager?.state,
        className: '',
      },
    }
  }

  return {
    state,
    isNewTheme,
    inversed,
    themeManager,
  }
}

type ChangedThemeResponseUpdate = ChangedThemeResponse & { shouldUpdate?: boolean }

function getUpdatedStateIfChanged(
  props: UseThemeWithStateProps,
  parentManager: ThemeManager | undefined,
  prev: ChangedThemeResponse | undefined,
  isRoot = false,
  force?: boolean
): ChangedThemeResponseUpdate | undefined {
  if (prev && force === false) {
    return
  }

  //  returns previous theme manager if no change
  let themeManager: ThemeManager = prev?.themeManager ?? parentManager!
  let state: ThemeManagerState | undefined
  let shouldUpdate

  const parent = isRoot ? 'root' : parentManager
  if (prev) {
    if (prev.themeManager) {
      // this could be a bit better, problem is on toggling light/dark the state is actually
      // showing light even when the last was dark. but technically allso onChangeTheme should
      // basically always call on a change, so i'm wondering if we even need the shouldUpdate
      // at all anymore. this forces updates onChangeTheme for all dynamic style accessed components
      // which is correct, potentially in the future we can avoid forceChange and just know to
      // update if keys.length is set + onChangeTheme called
      const nextState = themeManager.getState(props)
      const shouldChange = themeManager.getStateShouldChange(nextState, prev.state)

      if (nextState && (shouldChange || force)) {
        if (!prev.isNewTheme) {
          themeManager = new ThemeManager(props, parent)
          state = themeManager.state
        } else {
          state = nextState
          shouldUpdate = true
        }
      } else {
        return
      }
    }
  } else {
    themeManager = new ThemeManager(props, parent)
    state = themeManager.state
  }

  const isNewTheme = Boolean(themeManager !== parentManager || props.inverse)

  if (isNewTheme) {
    registerThemeManager(themeManager)
  }

  // only inverse relies on this for ssr
  const mounted = !props.inverse ? true : !!(isRoot || prev?.mounted)

  if (!state) {
    if (isNewTheme) {
      state = themeManager.state
    } else {
      state = parentManager!.state
      themeManager = parentManager!
    }
  }

  const wasInversed = prev?.inversed
  const nextInversed = isNewTheme && state.scheme !== parentManager?.state.scheme
  const inversed = mounted && nextInversed ? true : wasInversed != null ? false : null

  const response: ChangedThemeResponseUpdate = {
    themeManager,
    isNewTheme,
    mounted,
    inversed,
    shouldUpdate,
  }

  if (prev) {
    const shouldReturnPrev = Boolean(
      !force &&
        // isEqualShallow uses the second arg as the keys so this should compare without state first...
        isEqualShallow(prev, response) &&
        // ... and then compare just the state, because we make a new state obj but is likely the same
        isEqualShallow(prev.state, state)
    )

    if (shouldReturnPrev) {
      return
    }
  }

  // after we compare equal we set the state
  response.state = state

  if (process.env.NODE_ENV === 'development' && props['debug'] && isClient) {
    console.groupCollapsed(` 🔷 ${themeManager.id} useChangeThemeEffect createState`)
    const parentState = { ...parentManager?.state }
    const parentId = parentManager?.id
    const themeManagerState = { ...themeManager.state }
    console.info({ props, parentState, parentId })
    console.info({ themeManager, prev, response, themeManagerState })
    console.groupEnd()
  }

  return response
}
