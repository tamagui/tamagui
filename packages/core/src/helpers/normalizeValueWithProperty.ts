/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { normalizeColor } from './normalizeColor'

const cache = {}

export function normalizeValueWithProperty(value: any, property?: string): any {
  if (property === undefined || property === null) {
    return value
  }
  const cached = cache[value]?.[property]
  if (cached) {
    return cached
  }
  let res = value
  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    typeof value === 'number' &&
    !unitlessNumbers[property]
  ) {
    res = `${value}px`
  } else if (property && colorProps[property]) {
    res = normalizeColor(value)
  }
  cache[value] ||= {}
  cache[value][property] = res
  return res
}

const colorProps = {
  backgroundColor: true,
  borderColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderBottomColor: true,
  borderLeftColor: true,
  color: true,
  shadowColor: true,
  textDecorationColor: true,
  textShadowColor: true,
}

const unitlessNumbers = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexOrder: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowGap: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnGap: true,
  gridColumnStart: true,
  lineClamp: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  shadowOpacity: true,
}
