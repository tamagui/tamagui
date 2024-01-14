import { isClient, isServer } from '@tamagui/constants'
import { useContext, useId, useMemo, useRef, useSyncExternalStore } from 'react'

import { getConfig } from '../config'
import { Variable } from '../createVariable'
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
  VariableVal,
  VariableValGeneric,
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

  const changedThemeState = useChangeThemeEffect(
    props,
    false,
    keys.current,
    !isServer
      ? () => {
          const next =
            props.shouldUpdate?.() ?? (keys.current.length > 0 ? true : undefined)

          if (
            process.env.NODE_ENV === 'development' &&
            props.debug &&
            props.debug !== 'profile'
          ) {
            console.info(`  🎨 useTheme() shouldUpdate?`, next, {
              shouldUpdateProp: props.shouldUpdate?.(),
              keys: [...keys.current],
            })
          }
          return next
        }
      : undefined
  )

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
  keys?: string[],
  shouldUpdate?: () => boolean | undefined
): ChangedThemeResponse => {
  const { disable } = props
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

  const prevRef = useRef<ChangedThemeResponse | undefined>()

  const id = useId()

  function getSnapshot() {
    const force =
      // forced ||
      shouldUpdate?.() ||
      props.deopt ||
      // this fixes themeable() not updating with the new fastSchemeChange setting
      (process.env.TAMAGUI_TARGET === 'native' ? props['disable-child-theme'] : undefined)

    const prev = prevRef.current
    const updatedState = createStateIfChanged(
      props,
      parentManager,
      prev,
      keys,
      shouldUpdate,
      isRoot,
      force
    )

    if (props.name) {
      if (props.debug) console.log('🎨 snap', id, props, updatedState)
    }

    if (updatedState) {
      prevRef.current = updatedState

      if (prev?.isNewTheme) {
        console.warn(
          'we are changing value but staying a new theme, notify children',
          updatedState.themeManager.id,
          updatedState.state?.name,
          prev?.state?.name
        )
        // if it was a new theme already and is updating, notify children
        updatedState.themeManager?.notify()
      }

      return updatedState
    }

    return prev
  }

  const themeState = useSyncExternalStore<ChangedThemeResponse>(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  const { state, mounted, isNewTheme, themeManager, inversed } = themeState
  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)

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

function getNextStateIfChanged(
  props: UseThemeWithStateProps,
  prev?: ThemeManagerState,
  themeManager?: ThemeManager,
  shouldUpdate?: () => boolean | undefined,
  force?: boolean | undefined
) {
  const forceUpdate = force ?? shouldUpdate?.()
  if (!themeManager || forceUpdate === false) return
  const next = themeManager.getState(props)
  if (props.debug) console.log('🎨 next', { next, props, themeManager })
  if (!next) return
  if (prev && forceUpdate !== true) {
    const shouldChange = themeManager.getStateShouldChange(next, prev)
    if (props.debug) console.log('🎨 shouldChange', shouldChange, { next, prev })
    if (!shouldChange) {
      return
    }
  }
  return next
}

function createStateIfChanged(
  props: UseThemeWithStateProps,
  parentManager?: ThemeManager,
  prev?: ChangedThemeResponse,
  keys?: string[],
  shouldUpdate?: () => boolean | undefined,
  isRoot = false,
  force = false
): ChangedThemeResponse {
  if (props.debug)
    console.log('🎨 createStateIfChanged', shouldUpdate?.(), { force }, props)
  if (prev && shouldUpdate?.() === false && !force) {
    return prev
  }

  //  returns previous theme manager if no change
  let themeManager: ThemeManager = parentManager!
  let state: ThemeManagerState | undefined
  const hasThemeUpdatingProps = getHasThemeUpdatingProps(props)

  if (hasThemeUpdatingProps) {
    const getNewThemeManager = () => {
      return new ThemeManager(props, isRoot ? 'root' : parentManager)
    }

    if (prev) {
      if (prev.themeManager) {
        themeManager = prev.themeManager

        // this could be a bit better, problem is on toggling light/dark the state is actually
        // showing light even when the last was dark. but technically allso onChangeTheme should
        // basically always call on a change, so i'm wondering if we even need the shouldUpdate
        // at all anymore. this forces updates onChangeTheme for all dynamic style accessed components
        // which is correct, potentially in the future we can avoid forceChange and just know to
        // update if keys.length is set + onChangeTheme called
        const forceChange = force || (keys?.length ? true : undefined)
        const nextState = getNextStateIfChanged(
          props,
          prev?.state,
          themeManager,
          shouldUpdate,
          forceChange
        )

        if (nextState) {
          state = nextState

          if (!prev.isNewTheme) {
            themeManager = getNewThemeManager()
          } else {
            themeManager.updateState(nextState, false)
          }
        } else {
          if (props.debug) console.log('returning previous')
          return prev
        }
      }
    } else {
      themeManager = getNewThemeManager()
      state = themeManager.state
    }
  }

  const isNewTheme = Boolean(themeManager !== parentManager || props.inverse)

  if (isNewTheme) {
    registerThemeManager(themeManager)
  }

  // only inverse relies on this for ssr
  const mounted = !props.inverse ? true : isRoot || prev?.mounted

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
  const inversed = nextInversed ? true : wasInversed != null ? false : null

  const response: ChangedThemeResponse = {
    themeManager,
    isNewTheme,
    mounted,
    inversed,
  }

  if (prev) {
    const shouldReturnPrev = Boolean(
      !force &&
        // isEqualShallow uses the second arg as the keys so this should compare without state first...
        isEqualShallow(prev, response) &&
        // ... and then compare just the state, because we make a new state obj but is likely the same
        isEqualShallow(prev.state, state)
    )

    if (props.debug) console.log('🎨 shouldReturnPrev', shouldReturnPrev, { state, prev })

    if (shouldReturnPrev) {
      return prev
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
