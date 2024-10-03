import { isWeb } from '@tamagui/constants'

import type {
  ConfigListener,
  GenericTamaguiSettings,
  TamaguiInternalConfig,
  Token,
  Tokens,
  TokensMerged,
} from './types'

let conf: TamaguiInternalConfig | null

const haventCalledErrorMessage =
  process.env.NODE_ENV === 'development'
    ? `
Haven't called createTamagui yet.

  This often happens due to having duplicate Tamagui sub-dependencies.

  Tamagui needs every @tamagui/* dependency to be on the exact same version, we include an upgrade script
  with the starter kits that you can call with "yarn upgrade:tamagui" to help with this.

  You may want to clear your node_modules as well and run a fresh install after ugprading.
`
    : `❌ Error 001`

export const getSetting = <Key extends keyof GenericTamaguiSettings>(
  key: Key
): GenericTamaguiSettings[Key] => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(haventCalledErrorMessage)
  }
  return (
    conf!.settings[key] ??
    // @ts-expect-error
    conf[key]
  )
}

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
}

export const setConfigFont = (name: string, font: any, fontParsed: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(haventCalledErrorMessage)
  }
  conf!.fonts[name] = font
  conf!.fontsParsed[`$${name}`] = fontParsed
}

export const getConfig = () => {
  if (!conf) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `Missing tamagui config, you either have a duplicate config, or haven't set it up. Be sure createTamagui is called before rendering. Also, make sure all of your tamagui dependencies are on the same version (\`tamagui\`, \`@tamagui/package-name\`, etc.) not just in your package.json, but in your lockfile.`
        : 'Err0'
    )
  }
  return conf
}

export const getConfigMaybe = () => {
  return conf
}

let tokensMerged: TokensMerged
export function setTokens(_: TokensMerged) {
  tokensMerged = _
}

export const getTokens = ({
  prefixed,
}: {
  /**
   * Force either with $ or without $ prefix
   */
  prefixed?: boolean
} = {}): TokensMerged => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(haventCalledErrorMessage)
  }
  const { tokens, tokensParsed } = conf!
  if (prefixed === false) return tokens as any
  if (prefixed === true) return tokensParsed as any
  return tokensMerged
}

export const getTokenObject = (value: Token, group?: keyof Tokens) => {
  return (
    conf!.specificTokens[value] ??
    (group
      ? tokensMerged[group]?.[value]
      : tokensMerged[
          Object.keys(tokensMerged).find((cat) => tokensMerged[cat][value]) || ''
        ]?.[value])
  )
}

export const getToken = (value: Token, group?: keyof Tokens, useVariable = isWeb) => {
  const token = getTokenObject(value, group)
  return useVariable ? token?.variable : token?.val
}

export const getTokenValue = (value: Token | 'unset' | 'auto', group?: keyof Tokens) => {
  if (value === 'unset' || value === 'auto') return
  return getToken(value, group, false)
}

/**
 * Note: this is the same as `getTokens`
 */
export const useTokens = getTokens

export const getThemes = () => conf!.themes

export const configListeners = new Set<ConfigListener>()

export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf)
  } else {
    configListeners.add(cb)
  }
}

export const updateConfig = (key: string, value: any) => {
  // for usage internally only
  Object.assign(conf![key], value)
}

// searches by value name or token name
export const getFont = (name: string) => {
  const conf = getConfig()
  return (
    conf.fontsParsed[name] ??
    Object.entries(conf.fontsParsed).find(
      ([k]) => conf.fontsParsed[k]?.family?.['val'] === name
    )?.[1]
  )
}

type DevConfig = {
  visualizer?:
    | boolean
    | {
        key?: string
        delay?: number
      }
}

export let devConfig: DevConfig | undefined

export function setupDev(conf: DevConfig) {
  if (process.env.NODE_ENV === 'development') {
    devConfig = conf
  }
}
