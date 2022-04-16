import { Tamagui } from './Tamagui'
import { ConfigListener, TamaguiInternalConfig } from './types'

let conf: TamaguiInternalConfig | null

export const setConfig = (next: TamaguiInternalConfig) => {
  conf = next
  if (configListeners.size) {
    configListeners.forEach((cb) => cb(conf!))
    configListeners.clear()
  }
}

export const getHasConfigured = () => !!conf
export const getConfig = () => conf!
export const getTokens = () => conf!.tokensParsed
export const getThemes = () => conf!.themes

export const configListeners = new Set<ConfigListener>()

export const onConfiguredOnce = (cb: ConfigListener) => {
  if (conf) {
    cb(conf)
  } else {
    configListeners.add(cb)
  }

  if (!globalThis['Tamagui']) {
    Tamagui.config = conf
    globalThis['Tamagui'] = Tamagui
  }
}
