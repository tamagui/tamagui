import { StaticConfig } from './types'

export const ReactNativeStaticConfigs = new WeakMap<any, Partial<StaticConfig> | null>()

export function getReactNativeConfig(Component: any) {
  return ReactNativeStaticConfigs.get(Component)
}

export function setupReactNative(rnExports: Record<string, any>) {
  for (const key in rnExports) {
    if (key[0].toLowerCase() === key[0]) continue
    const val = rnExports[key]
    if (val && typeof val === 'object') {
      ReactNativeStaticConfigs.set(val, {
        isReactNative: true,
        isText: key === 'Text' || key === 'TextInput',
        isInput: key === 'TextInput',
        inlineProps: key === 'Image' ? new Set(['src', 'width', 'height']) : undefined,
      })
    }
  }
}
