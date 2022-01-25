import { TamaguiInternalConfig } from './types'

type ConfigListener = (conf: TamaguiInternalConfig) => void

export let conf: TamaguiInternalConfig | null

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
}

export const getHasConfigured = () => !!conf
export const getTamagui = () => conf!
export const getTokens = () => conf!.tokensParsed
export const getThemes = () => conf!.themes

export const configListeners = new Set<ConfigListener>()

export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf)
  } else {
    configListeners.add(cb)
  }
}
