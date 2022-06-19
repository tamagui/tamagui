import { ViewStyle } from 'react-native'

export const mergeTransform = (obj: ViewStyle, key: string, val: any, backwards = false) => {
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({ [mapTransformKeys[key] || key]: val } as any)
}
const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}
export const invertMapTransformKeys = {
  translateX: 'x',
  translateY: 'y',
}
