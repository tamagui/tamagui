/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid, isWeb } from '@tamagui/constants'

import type { PropMappedValue } from '../types'
import {
  webToNativeDynamicExpansion,
  webToNativeExpansion,
} from '../constants/webToNativeProps'

export function expandStyle(key: string, value: any): PropMappedValue {
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (key === 'flex') {
      return [
        ['flexGrow', value],
        ['flexShrink', 1],
        ['flexBasis', 'auto'],
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

  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map((key) => {
      return [key, value]
    })
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

const all = ['Top', 'Right', 'Bottom', 'Left']
const horiz = ['Right', 'Left']
const vert = ['Top', 'Bottom']
const xy = ['X', 'Y']

const EXPANSIONS: Record<string, string[]> = {
  borderColor: ['TopColor', 'RightColor', 'BottomColor', 'LeftColor'],
  borderRadius: [
    'TopLeftRadius',
    'TopRightRadius',
    'BottomRightRadius',
    'BottomLeftRadius',
  ],
  borderWidth: ['TopWidth', 'RightWidth', 'BottomWidth', 'LeftWidth'],
  margin: all,
  marginHorizontal: horiz,
  marginVertical: vert,
  overscrollBehavior: xy,
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
  ...(isWeb && {
    // react-native only supports borderStyle
    borderStyle: ['TopStyle', 'RightStyle', 'BottomStyle', 'LeftStyle'],
    // react-native doesn't support X / Y
    overflow: xy,
  }),
}

for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  EXPANSIONS[parent] = EXPANSIONS[parent].map((k) => `${prefix}${k}`)
}
