/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isWeb } from '@tamagui/constants'
import { stylePropsAll, stylePropsUnitless } from '@tamagui/helpers'

// only doing this on web on native it accepts pixel values

const stylePropsAllPlusTransforms = {
  ...stylePropsAll,
  translateX: true,
  translateY: true,
}

export function normalizeValueWithProperty(value: any, property = ''): any {
  if (!isWeb) return value
  if (
    stylePropsUnitless[property] ||
    (property && !stylePropsAllPlusTransforms[property]) ||
    typeof value === 'boolean'
  ) {
    return value
  }
  let res = value
  if (value && typeof value === 'object') return value
  if (typeof value === 'number') {
    res = `${value}px`
  } else if (property) {
    res = `${res}`
  }
  return res
}
