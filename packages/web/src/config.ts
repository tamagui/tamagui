import { ConfigListener, TamaguiInternalConfig, TokensMerged } from './types.js'

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

export const getConfigIfDefined = () => conf

let cached: TokensMerged
export const getTokens = ({
  prefixed,
}: {
  /**
   * Force either with $ or without $ prefix
   */
  prefixed?: boolean
} = {}): TokensMerged => {
  if (!conf) throw new Error(`never called createTamagui`)
  if (prefixed === false) return conf.tokens
  if (prefixed === true) return conf.tokensParsed
  return (cached ??= Object.freeze({
    size: {
      ...conf.tokens['size'],
      ...conf.tokensParsed['size'],
    },
    space: {
      ...conf.tokens['space'],
      ...conf.tokensParsed['space'],
    },
    radius: {
      ...conf.tokens['radius'],
      ...conf.tokensParsed['radius'],
    },
    zIndex: {
      ...conf.tokens['zIndex'],
      ...conf.tokensParsed['zIndex'],
    },
    color: {
      ...conf.tokens['color'],
      ...conf.tokensParsed['color'],
    },
  }) as any)
}

/**
 * Note: this is the same as `getTokens`
 */
export const useTokens = () => getTokens()

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
