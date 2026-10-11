import type { StaticConfig } from './types'

export function getReactNativeConfig(Component: any) {
  if (process.env.TAMAGUI_TARGET !== 'native' || !Component) return

  if (Component.propTypes?.onTextInput || Component.propTypes?.onChangeText) {
    return RNConfigs.TextInput
  }
  if (Component.getSizeWithHeaders) {
    return RNConfigs.Image
  }
  if (Component.propTypes?.textBreakStrategy) {
    return RNConfigs.Text
  }

  // can assume every other non-tamagui component is native on native
  return RNConfigs.default
}

const RNConfigs = {
  Image: {
    isReactNative: true,
    inlineProps: new Set(['src', 'width', 'height']),
  },
  Text: {
    isReactNative: true,
    isText: true,
  },
  TextInput: {
    isReactNative: true,
    isInput: true,
    isText: true,
  },
  default: {
    isReactNative: true,
  },
} satisfies Record<string, Partial<StaticConfig>>
