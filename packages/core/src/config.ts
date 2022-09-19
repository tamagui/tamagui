import { ConfigListener, TamaguiInternalConfig, ThemeParsed } from './types'

let conf: TamaguiInternalConfig | null

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
  if (configListeners.size) {
    configListeners.forEach((cb) => cb(conf!))
    configListeners.clear()
  }
}

export const setConfigFont = (name: string, font: any, fontParsed: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!conf) throw new Error(`Haven't called createTamagui yet`)
  }
  Object.assign(conf!.fonts, { [name]: font })
  Object.assign(conf!.fontsParsed, { [`$${name}`]: fontParsed })
}

export const getHasConfigured = () => !!conf
export const getConfig = () => conf!
export const getTokens = () => conf!.tokensParsed
export const getThemes = () => conf!.themes

export const configListeners = new Set<ConfigListener>()

export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf!)
  } else {
    configListeners.add(cb)
  }
}

export const updateConfig = (key: string, value: any) => {
  Object.assign(key, value)
}
