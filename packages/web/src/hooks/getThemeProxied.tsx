import { isIos } from '@tamagui/constants'
import { getConfig } from '../config'
import { getVariable } from '../createVariable'
import { ThemeManager, ThemeManagerState } from '../helpers/ThemeManager'
import type { DebugProp, UseThemeResult } from '../types'

export function getThemeProxied(
  { theme, name, scheme }: ThemeManagerState,
  deopt = false,
  themeManager?: ThemeManager,
  keys?: string[],
  debug?: DebugProp
): UseThemeResult {
  if (!theme) return {}

  const config = getConfig()

  function track(key: string) {
    if (keys && !keys.includes(key)) {
      keys.push(key)
      if (process.env.NODE_ENV === 'development' && debug) {
        console.info(` 🎨 useTheme() tracking new key: ${key}`)
      }
    }
  }

  return new Proxy(theme, {
    has(_, key) {
      if (Reflect.has(theme, key)) {
        return true
      }
      if (typeof key === 'string') {
        if (key[0] === '$') key = key.slice(1)
        return themeManager?.allKeys.has(key)
      }
    },
    get(_, key) {
      if (
        // dont ask me, idk why but on hermes you can see that useTheme()[undefined] passes in STRING undefined to proxy
        // if someone is crazy enough to use "undefined" as a theme key then this not working is on them
        key !== 'undefined' &&
        typeof key === 'string'
      ) {
        // auto convert variables to plain
        const keyString = key[0] === '$' ? key.slice(1) : key
        const val = theme[keyString]

        if (val && typeof val === 'object') {
          // TODO this could definitely be done better by at the very minimum
          // proxying it up front and just having a listener here
          return new Proxy(val as any, {
            // when they touch the actual value we only track it
            // if its a variable (web), its ignored!
            get(_, subkey) {
              if (subkey === 'val') {
                // always track .val
                track(keyString)
              } else if (subkey === 'get') {
                return (platform?: 'web') => {
                  const outVal = getVariable(val)

                  if (process.env.TAMAGUI_TARGET === 'native') {
                    // ios can avoid re-rendering in some cases when we are using a root light/dark
                    // disabled in cases where we have animations
                    if (
                      platform !== 'web' &&
                      isIos &&
                      !deopt &&
                      config.settings.fastSchemeChange &&
                      !someParentIsInversed(themeManager)
                    ) {
                      if (scheme) {
                        const oppositeThemeName = name.replace(
                          scheme === 'dark' ? 'dark' : 'light',
                          scheme === 'dark' ? 'light' : 'dark'
                        )
                        const oppositeTheme = config.themes[oppositeThemeName]
                        const oppositeVal = getVariable(oppositeTheme?.[keyString])
                        if (oppositeVal) {
                          const dynamicVal = {
                            dynamic: {
                              dark: scheme === 'dark' ? outVal : oppositeVal,
                              light: scheme === 'light' ? outVal : oppositeVal,
                            },
                          }
                          return dynamicVal
                        }
                      }
                    }

                    // if we dont return early with a dynamic val on native, always track
                    track(keyString)
                  }

                  return outVal
                }
              }

              return Reflect.get(val as any, subkey)
            },
          })
        }

        if (
          process.env.NODE_ENV === 'development' &&
          process.env.TAMAGUI_FEAT_THROW_ON_MISSING_THEME_VALUE === '1'
        ) {
          throw new Error(
            `[tamagui] No theme key "${key}" found in theme ${name}. \n  Keys in theme: ${Object.keys(
              theme
            ).join(', ')}`
          )
        }
      }

      return Reflect.get(_, key)
    },
  }) as UseThemeResult
}

// to tell if we are inversing the scheme anywhere in the tree, if so we need to de-opt
function someParentIsInversed(manager?: ThemeManager) {
  if (process.env.TAMAGUI_TARGET === 'native') {
    let cur: ThemeManager | null | undefined = manager
    while (cur) {
      if (!cur.parentManager) return false
      if (cur.parentManager.state.scheme !== cur.state.scheme) return true
      cur = cur.parentManager
    }
  }
  return false
}
