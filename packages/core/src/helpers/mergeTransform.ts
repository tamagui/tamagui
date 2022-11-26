import type { ViewStyle } from '@tamagui/types-react-native'

export type FlatTransforms = Record<string, any>

export const mergeTransform = (obj: ViewStyle, key: string, val: any, backwards = false) => {
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({ [mapTransformKeys[key] || key]: val } as any)
}

export const mergeTransforms = (
  obj: ViewStyle,
  flatTransforms: FlatTransforms,
  backwards = false
) => {
  Object.entries(flatTransforms).forEach(([key, val]) => {
    mergeTransform(obj, key, val, backwards)
  })
}

export const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}
