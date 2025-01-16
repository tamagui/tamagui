/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid } from '@tamagui/constants'

import { getConfig } from '../config'
import {
  webToNativeDynamicExpansion,
  webToNativeExpansion,
} from '../constants/webToNativeProps'
import type { PropMappedValue } from '../types'

const neg1Flex = [
  ['flexGrow', 0],
  ['flexShrink', 1],
  ['flexBasis', 'auto'],
] satisfies PropMappedValue

export function expandStyle(key: string, value: any): PropMappedValue {
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (key === 'flex') {
      if (value === -1) {
        return neg1Flex
      }
      return [
        ['flexGrow', value],
        ['flexShrink', 1],
        ['flexBasis', getConfig().settings.styleCompat === 'react-native' ? 0 : 'auto'],
      ]
    }

    // web only
    switch (key) {
      case 'textAlignVertical': {
        return [['verticalAlign', value === 'center' ? 'middle' : value]]
      }
      case 'writingDirection': {
        return [['direction', value]]
      }
    }
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    isAndroid &&
    key === 'elevationAndroid'
  ) {
    return [['elevation', value]]
  }

  if (key in webToNativeExpansion) {
    return webToNativeExpansion[key].map((key) => {
      return [key, value]
    })
  }

  if (key in webToNativeDynamicExpansion) {
    return webToNativeDynamicExpansion[key](value)
  }
}
