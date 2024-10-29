import React from 'react'
import { isClient, isIos, isServer, isWeb } from '@tamagui/constants'

import { DynamicColorIOS } from 'react-native'

import { getConfig, getSetting } from '../config'
import type { Variable } from '../createVariable'
import { getVariable } from '../createVariable'
import type { ThemeManagerState } from '../helpers/ThemeManager'
import { ThemeManager, getHasThemeUpdatingProps } from '../helpers/ThemeManager'
import { ThemeManagerIDContext } from '../helpers/ThemeManagerContext'
import { isEqualShallow } from '../helpers/createShallowSetState'
import type {
  DebugProp,
  ThemeParsed,
  ThemeProps,
  Tokens,
  UseThemeWithStateProps,
  VariableVal,
  VariableValGeneric,
} from '../types'

export type ChangedThemeResponse = {
  state?: ThemeManagerState
  prevState?: ThemeManagerState
  themeManager?: ThemeManager | null
  isNewTheme: boolean
  // null = never been inversed
  // false = was inversed, now not
  inversed?: null | boolean
  mounted?: boolean
}

const emptyProps = { name: null }

let cached: any

function getDefaultThemeProxied(): UseThemeResult {
  const config = getConfig()
  const name = config.themes.light ? 'light' : Object.keys(config.themes)[0]
  if (!cachedDefaultTheme[name]) {
    const theme = config.themes[name]
    cachedDefaultTheme[name] = getThemeProxied({
      theme,
      name,
      scheme: 'light',
    })
  }
  return cachedDefaultTheme[name]
}
export type ThemeGettable<Val> = Val & {
  /**
   * Returns an optimized value that avoids the need for re-rendering:
   * On web a CSS variable, on iOS a dynamic color, on Android it doesn't
   * optimize and returns the underlying value.
   *
   * @param platform when "web" it will only return the dynamic value for web, avoiding the iOS dynamic value.
   * For things like SVG, gradients, or other external components that don't support it, use this option.
   */
  get: (
    platform?: 'web'
  ) => string | (Val extends VariableVal ? string | number : unknown)
}

export type UseThemeResult = {
  [Key in keyof ThemeParsed]: ThemeGettable<ThemeParsed[Key]>
}

// not used by anything but its technically more correct type, but its annoying to have in intellisense so leaving it
// type SimpleTokens = NonSpecificTokens extends `$${infer Token}` ? Token : never
// export type UseThemeWithTokens = {
//   [Key in keyof ThemeParsed | keyof SimpleTokens]: ThemeGettable<
//     Key extends keyof ThemeParsed
//       ? ThemeParsed[Key]
//       : Variable<ThemeValueGet<`$${Key}`> extends never ? any : ThemeValueGet<`$${Key}`>>
//   >
// }

export const useTheme = (props: ThemeProps = {}) => {
  const [_, theme] = useThemeWithState(props)
  const res = theme || getDefaultThemeProxied()
  return res as UseThemeResult
}

const cachedDefaultTheme: { [key: string]: UseThemeResult } = {}

export const useThemeWithState = (
  props: UseThemeWithStateProps
): [ChangedThemeResponse, ThemeParsed] => {
  const keys = React.useRef<string[]>([])

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
            typeof props.debug === 'string' &&
            props.debug !== 'profile'
          ) {
            console.info(
              `  🎨 useTheme() shouldUpdate? tracking keys ${keys.current.length} ${props.shouldUpdate?.()}`,
              next
            )
          }

          return next
        }
      : undefined
  )

  const { themeManager, state } = changedThemeState

  if (process.env.NODE_ENV === 'development') {
    if (!state?.theme) {
      if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
        console.error(
          `[tamagui] No theme found, this could be due to an invalid theme name (given theme props ${JSON.stringify(
            props
          )}).\n\nIf this is intended and you are using Tamagui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1`
        )
      }
    }
  }

  const themeProxied = React.useMemo(() => {
    // reset keys on new theme
    keys.current = []

    if (!themeManager || !state?.theme) {
      return {}
    }
    return getThemeProxied(
      { theme: state.theme, name: state.name, scheme: state.scheme as string },
      props.deopt,
      themeManager,
      keys.current,
      props.debug
    )
  }, [state?.theme, themeManager, props.deopt, props.debug])

  if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
    console.groupCollapsed(`  🔹 [${themeManager?.id}] useTheme =>`, state?.name)
    console.info(
      'returning state',
      changedThemeState.state,
      changedThemeState.isNewTheme,
      'from props',
      props
    )
    console.groupEnd()
  }

  return [changedThemeState, themeProxied]
}

export function getThemeProxied(
  {
    theme,
    name,
    scheme,
  }: {
    theme: ThemeParsed
    name: string
    scheme: string
  },
  deopt = false,
  themeManager?: ThemeManager,
  keys: string[] = [],
  debug?: DebugProp
): UseThemeResult {
  if (!theme) return {} as UseThemeResult

  const config = getConfig()

  function track(key: string) {
    if (keys && !keys.includes(key)) {
      if (!keys.length) {
        // Schedule an update check
        setTimeout(() => {
          themeManager?.selfUpdate()
        })
      }
      keys.push(key)
      if (process.env.NODE_ENV === 'development' && debug) {
        console.info(`🎨 useTheme() tracking new key: ${key}`)
      }
    }
  }

  const themeProxy = new Proxy(theme, {
    has(target, key) {
      if (Reflect.has(target, key)) {
        return true
      }
      if (typeof key === 'string') {
        const keyName = key.startsWith('$') ? key.slice(1) : key
        return themeManager?.allKeys.has(keyName)
      }
      return false
    },
    get(target, key): any {
      if (key === '__isTheme') return true
      if (typeof key !== 'string' || key === 'undefined') {
        return Reflect.get(target, key)
      }

      const keyName = key.startsWith('$') ? key.slice(1) : key
      const val = theme[keyName]

      if (val === undefined) {
        // Reintroduce the error handling code
        if (
          process.env.NODE_ENV === 'development' &&
          process.env.TAMAGUI_FEAT_THROW_ON_MISSING_THEME_VALUE === '1'
        ) {
          throw new Error(
            `[tamagui] No theme key "${keyName}" found in theme "${name}".\nKeys in theme: ${Object.keys(
              theme
            ).join(', ')}`
          )
        }

        // Return undefined if the key doesn't exist
        return undefined
      }

      // Ensure key is tracked
      if (!globalThis.tamaguiAvoidTracking) {
        track(keyName)
      }

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info(`🎨 useTheme() accessed key: ${keyName}`)
      }

      const getFn = (platform?: 'web') => {
        const outVal = getVariable(val)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.info(
            `🎨 useTheme() ${keyName}.get(${platform ?? 'native'}) called, outVal:`,
            outVal
          )
        }

        if (
          process.env.TAMAGUI_TARGET === 'native' &&
          platform !== 'web' &&
          isIos &&
          !deopt &&
          getSetting('fastSchemeChange')
        ) {
          if (scheme) {
            const isInversed = getIsInversed(themeManager)
            const colorLight = getVariable(config.themes[name]?.[keyName] ?? val)
            const colorDark = getVariable(config.themes[`${name}_dark`]?.[keyName] ?? val)
            const dynamicVal = DynamicColorIOS({
              light: isInversed ? colorDark : colorLight,
              dark: isInversed ? colorLight : colorDark,
            })

            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              console.info(
                `🎨 useTheme() ${keyName}.get(${platform ?? 'native'}) returning DynamicColorIOS`,
                dynamicVal
              )
            }

            return dynamicVal
          }
        }

        return outVal
      }

      // Create the ThemeGettable object
      const themeGettable: ThemeGettable<typeof val> = Object.assign({}, val, {
        get: getFn,
      })

      return themeGettable
    },
  })

  return themeProxy as unknown as UseThemeResult
}

// to tell if we are inversing the scheme anywhere in the tree, if so we need to de-opt
function getIsInversed(manager?: ThemeManager) {
  if (process.env.TAMAGUI_TARGET === 'native') {
    let isInversed = false

    let cur: ThemeManager | null | undefined = manager

    while (cur) {
      if (!cur.parentManager) return isInversed
      if (cur.parentManager.state.scheme !== cur.state.scheme) {
        isInversed = !isInversed
      }
      cur = cur.parentManager
    }
  }

  return false
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

const ogLog = console.error
const preventWarnSetState =
  process.env.NODE_ENV === 'production'
    ? ogLog
    : // temporary fix for logs, they are harmless in that i've tried to rewrite this
      // a few times using the "right" ways, but they are always slower. maybe skill issue
      (a?: any, ...args: any[]) => {
        if (typeof a === 'string' && a.includes('Cannot update a component')) {
          return
        }
        return ogLog(a, ...args)
      }

export const useChangeThemeEffect = (
  props: UseThemeWithStateProps,
  isRoot = false,
  keys?: string[],
  shouldUpdate?: () => boolean | undefined
): ChangedThemeResponse => {
  const { disable } = props
  const parentManagerId = React.useContext(ThemeManagerIDContext)
  const parentManager = getThemeManager(parentManagerId)

  if ((!isRoot && !parentManager) || disable) {
    return {
      isNewTheme: false,
      state: parentManager?.state,
      themeManager: parentManager,
    }
  }

  // to test performance: uncomment
  // if (!disable && parentManager) {
  //   return {
  //     isNewTheme: false,
  //     state: {
  //       name: 'light',
  //       theme: getConfig().themes.light,
  //     },
  //     themeManager: parentManager!,
  //   }
  // }

  const [themeState, setThemeState] = React.useState<ChangedThemeResponse>(createState)

  const { state, mounted, isNewTheme, themeManager, inversed, prevState } = themeState
  const isInversingOnMount = Boolean(!themeState.mounted && props.inverse)

  function getShouldUpdateTheme(
    manager = themeManager,
    nextState?: ThemeManagerState | null,
    prevState: ThemeManagerState | undefined = state,
    forceShouldChange = false
  ) {
    const forceUpdate = shouldUpdate?.()
    if (!manager || (!forceShouldChange && forceUpdate === false)) return
    const next = nextState || manager.getState(props, parentManager)
    if (forceShouldChange) {
      return next
    }
    if (!next) return
    if (forceUpdate !== true && !manager.getStateShouldChange(next, prevState)) {
      return
    }

    return next
  }

  if (!isWeb && themeManager) {
    if (getShouldUpdateTheme(themeManager)) {
      const next = createState(themeState)
      if (next.state?.name !== themeState.state?.name) {
        setThemeState(next)
        console.error = preventWarnSetState
        themeManager.notify()
        console.error = ogLog
      }
    }
  }

  if (!isServer) {
    React.useLayoutEffect(() => {
      // one homepage breaks on useTheme() in MetaTheme if this isnt set up
      if (themeManager && state && prevState && state !== prevState) {
        themeManager.notify()
      }
    }, [state])

    // listen for parent change + notify children change
    React.useEffect(() => {
      if (!themeManager) return

      // SSR safe inverse (because server can't know prefers scheme)
      // could be done through fancy selectors like how we do prefers-media
      // but may be a bit of explosion of selectors
      if (props.inverse && !mounted) {
        setThemeState((prev) => {
          return createState({
            ...prev,
            mounted: true,
          })
        })
        return
      }

      if (isNewTheme || getShouldUpdateTheme(themeManager)) {
        activeThemeManagers.add(themeManager)
        setThemeState(createState)
      }

      // for updateTheme/replaceTheme
      const selfListenerDispose = themeManager.onChangeTheme((_a, _b, forced) => {
        if (forced) {
          setThemeState((prev) => {
            const next = createState(prev, forced !== 'self')
            return next
          })
        }
      }, true)

      const disposeChangeListener = parentManager?.onChangeTheme(
        (name, manager, forced) => {
          const force =
            forced ||
            shouldUpdate?.() ||
            props.deopt ||
            // this fixes themeable() not updating with the new fastSchemeChange setting
            (process.env.TAMAGUI_TARGET === 'native'
              ? props['disable-child-theme']
              : undefined)

          const shouldTryUpdate = force ?? Boolean(keys?.length || isNewTheme)

          if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
            // prettier-ignore
            console.info(` 🔸 onChange`, {
              id: themeManager.id,
              force,
              shouldTryUpdate,
              props,
              name,
              keys,
            })
          }

          if (shouldTryUpdate) {
            setThemeState((prev) => createState(prev, force))
          }
        },
        themeManager.id
      )

      return () => {
        selfListenerDispose()
        disposeChangeListener?.()
        if (isNewTheme) {
          activeThemeManagers.delete(themeManager)
        }
      }
    }, [
      themeManager,
      parentManager,
      isNewTheme,
      props.componentName,
      props.inverse,
      props.name,
      props.reset,
      mounted,
    ])

    if (process.env.NODE_ENV === 'development' && props.debug !== 'profile') {
      React.useEffect(() => {
        globalThis['TamaguiThemeManagers'] ??= new Set()
        globalThis['TamaguiThemeManagers'].add(themeManager)
        return () => {
          globalThis['TamaguiThemeManagers'].delete(themeManager)
        }
      }, [themeManager])
    }
  }

  if (isWeb && isInversingOnMount) {
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

  function createState(prev?: ChangedThemeResponse, force = false): ChangedThemeResponse {
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

      if (prev?.themeManager) {
        themeManager = prev.themeManager

        // this could be a bit better, problem is on toggling light/dark the state is actually
        // showing light even when the last was dark. but technically allso onChangeTheme should
        // basically always call on a change, so i'm wondering if we even need the shouldUpdate
        // at all anymore. this forces updates onChangeTheme for all dynamic style accessed components
        // which is correct, potentially in the future we can avoid forceChange and just know to
        // update if keys.length is set + onChangeTheme called
        const forceChange = force || Boolean(keys?.length)
        const next = themeManager.getState(props, parentManager)
        const nextState = getShouldUpdateTheme(
          themeManager,
          next,
          prev.state,
          forceChange
        )

        if (nextState) {
          state = nextState

          if (!prev.isNewTheme && !isRoot) {
            themeManager = getNewThemeManager()
          } else {
            themeManager.updateState(nextState)
          }
        } else {
          if (prev.isNewTheme) {
            // reset to parent
            if (parentManager && !next) {
              themeManager = parentManager
            }
          }
        }
      } else {
        themeManager = getNewThemeManager()
        state = { ...themeManager.state }
      }
    }

    const isNewTheme = Boolean(themeManager !== parentManager || props.inverse)

    if (isNewTheme) {
      registerThemeManager(themeManager)
    }

    const isWebSSR = isWeb ? !getSetting('disableSSR') : false
    const mounted = isWebSSR ? isRoot || prev?.mounted : true

    if (!state) {
      if (isNewTheme) {
        state = themeManager.state
      } else {
        state = parentManager!.state
        themeManager = parentManager!
      }
    }

    const wasInversed = prev?.inversed
    const isInherentlyInversed =
      isNewTheme && state.scheme !== parentManager?.state.scheme
    const inversed = isRoot
      ? false
      : isInherentlyInversed
        ? true
        : isWebSSR
          ? wasInversed != null
            ? false
            : null
          : props.inverse

    const response: ChangedThemeResponse = {
      themeManager,
      isNewTheme,
      mounted,
      inversed,
    }

    const shouldReturnPrev =
      prev &&
      !force &&
      // isEqualShallow uses the second arg as the keys so this should compare without state first...
      isEqualShallow(prev, response) &&
      // ... and then compare just the state, because we make a new state obj but is likely the same
      isEqualShallow(prev.state, state)

    if (prev && shouldReturnPrev) {
      return prev
    }

    // after we compare equal we set the state
    response.state = state
    response.prevState = prev?.state

    if (process.env.NODE_ENV === 'development' && props['debug'] && isClient) {
      console.groupCollapsed(`🔷 [${themeManager.id}] useChangeThemeEffect createState`)
      const parentState = { ...parentManager?.state }
      const parentId = parentManager?.id
      const themeManagerState = { ...themeManager.state }
      console.info({
        props,
        parentState,
        parentId,
        themeManager,
        prev,
        response,
        themeManagerState,
      })
      console.groupEnd()
    }

    return response
  }
}
