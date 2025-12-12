import { isWeb } from '@tamagui/constants'
import { MISSING_THEME_MESSAGE } from './constants/constants'
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
Haven't called createTamagui yet. ${MISSING_THEME_MESSAGE}
`
    : `❌ Error 001`

// helper to get config from module-scoped variable or globalthis fallback
// this handles vite ssr bundling where multiple copies of tamagui may exist
let hasWarnedAboutGlobalFallback = false

const getConfigFromGlobalOrLocal = (): TamaguiInternalConfig | null => {
  // prefer local conf first
  if (conf) {
    return conf
  }

  // fall back to globalthis (for vite ssr bundling scenarios)
  if (globalThis.__tamaguiConfig) {
    if (process.env.NODE_ENV === 'development' && !hasWarnedAboutGlobalFallback) {
      hasWarnedAboutGlobalFallback = true
      console.warn(
        process.env.NODE_ENV === 'development'
          ? `Tamagui: Using global config fallback. This may indicate duplicate tamagui instances (e.g., from Vite SSR bundling). This is handled automatically, but may cause issues.`
          : `❌ Error 002`
      )
    }
    return globalThis.__tamaguiConfig
  }

  return null
}

export const getSetting = <Key extends keyof GenericTamaguiSettings>(
  key: Key
): GenericTamaguiSettings[Key] => {
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  return (
    config!.settings[key] ??
    // @ts-expect-error
    config[key]
  )
}

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
  globalThis.__tamaguiConfig = next
}

export const setConfigFont = (name: string, font: any, fontParsed: any) => {
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  config!.fonts[name] = font
  config!.fontsParsed[`$${name}`] = fontParsed
}

export const getConfig = () => {
  const config = getConfigFromGlobalOrLocal()
  if (!config) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `Missing tamagui config, you either have a duplicate config, or haven't set it up. Be sure createTamagui is called before rendering. Also, make sure all of your tamagui dependencies are on the same version (\`tamagui\`, \`@tamagui/package-name\`, etc.) not just in your package.json, but in your lockfile.`
        : 'Err0'
    )
  }
  return config
}

export const getConfigMaybe = () => {
  return getConfigFromGlobalOrLocal()
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
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  const { tokens, tokensParsed } = config!
  if (prefixed === false) return tokens as any
  if (prefixed === true) return tokensParsed as any
  return tokensMerged
}

export const getTokenObject = (value: Token, group?: keyof Tokens) => {
  const config = getConfigFromGlobalOrLocal()
  return (
    config!.specificTokens[value] ??
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

export const getThemes = () => getConfigFromGlobalOrLocal()!.themes

export const configListeners = new Set<ConfigListener>()

export const onConfiguredOnce = (cb: ConfigListener) => {
  const config = getConfigFromGlobalOrLocal()
  if (config) {
    cb(config)
  } else {
    configListeners.add(cb)
  }
}

export const updateConfig = (key: string, value: any) => {
  // for usage internally only
  const config = getConfigFromGlobalOrLocal()
  Object.assign(config![key], value)
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
