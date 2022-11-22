import type { ViewStyle } from '@tamagui/types-react-native'

export const mergeTransform = (obj: ViewStyle, key: string, val: any, backwards = false) => {
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({ [mapTransformKeys[key] || key]: val } as any)
}

export const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}
