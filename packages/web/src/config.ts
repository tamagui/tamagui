import { isWeb } from '@tamagui/constants'

import {
  ConfigListener,
  TamaguiInternalConfig,
  Token,
  Tokens,
  TokensMerged,
} from './types'

let conf: TamaguiInternalConfig | null

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
  configListeners.forEach((cb) => cb(next))
}

export const setConfigFont = (name: string, font: any, fontParsed: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(`Haven't called createTamagui yet`)
  }
  conf!.fonts[name] = font
  conf!.fontsParsed[`$${name}`] = fontParsed
}

export const getConfig = () => {
  if (!conf) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `Missing tamagui config, you either have a duplicate config, or haven't set it up. Be sure createTamagui is called before rendering.`
        : 'Err0'
    )
  }
  return conf
}

let cached: TokensMerged

export const getTokens = ({
  prefixed,
}: {
  /**
   * Force either with $ or without $ prefix
   */
  prefixed?: boolean
} = {}): TokensMerged => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(`Haven't called createTamagui yet`)
  }
  const { tokens, tokensParsed } = conf!
  if (prefixed === false) return tokens
  if (prefixed === true) return tokensParsed
  if (cached) return cached
  cached = Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k, { ...v, ...tokensParsed[k] }])
  ) as any
  return cached
}

export const getToken = (value: Token, group?: keyof Tokens, useVariable = isWeb) => {
  const tokens = getTokens()
  const token =
    value in conf!.specificTokens
      ? conf!.specificTokens[value]
      : (tokens[group as any]?.[value] as any)
  return useVariable ? token?.variable : token?.val
}

export const getTokenValue = (value: Token, group?: keyof Tokens) => {
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
