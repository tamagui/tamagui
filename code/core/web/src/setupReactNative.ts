import type { StaticConfig } from './types'

const ReactNativeStaticConfigs = new WeakMap<any, Partial<StaticConfig> | null>()

export function getReactNativeConfig(Component: any) {
  if (!Component) return

  if (process.env.TAMAGUI_TARGET === 'native') {
    if (Component.propTypes?.onTextInput || Component.propTypes?.onChangeText) {
      return RNConfigs.TextInput
    }
    if (Component.getSizeWithHeaders) {
      return RNConfigs.Image
    }
    if (Component.propTypes?.textBreakStrategy) {
      return RNConfigs.Text
    }

    // can optimize plain View or Text to not be react native specific

    // can assume everything else is react native on native
    return RNConfigs.default
  }
  if (Component.getSize && Component.prefetch) {
    return RNConfigs.Image
  }
  if (Component.displayName === 'Text' && Component.render) {
    return RNConfigs.Text
  }
  if (
    Component.render &&
    (Component.displayName === 'ScrollView' || Component.displayName === 'View')
  ) {
    return RNConfigs.default
  }
  if (Component.State?.blurTextInput) {
    return RNConfigs.TextInput
  }

  return ReactNativeStaticConfigs.get(Component)
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

/**
 * @deprecated this is no longer necessary, tamagui auto-detects RN views
 */
export function setupReactNative(rnExports: Record<string, any>) {
  // no-op
  // for (const key in rnExports) {
  //   if (key[0].toLowerCase() === key[0]) continue
  //   const val = rnExports[key]
  //   if (val && typeof val === 'object') {
  //     ReactNativeStaticConfigs.set(val, {
  //       isReactNative: true,
  //       isText: key === 'Text' || key === 'TextInput',
  //       isInput: key === 'TextInput' || key === 'TextArea',
  //       inlineProps: key === 'Image' ? new Set(['src', 'width', 'height']) : undefined,
  //     })
  //   }
  // }
}
