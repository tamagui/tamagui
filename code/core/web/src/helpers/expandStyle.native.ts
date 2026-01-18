/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid } from '@tamagui/constants'

import {
  webToNativeDynamicExpansion,
  webToNativeExpansion,
} from '../constants/webToNativeProps'
import type { PropMappedValue } from '../types'

export function expandStyle(key: string, value: any): PropMappedValue {
  if (isAndroid && key === 'elevationAndroid') {
    return [['elevation', value]]
  }

  // boxShadow and filter: strings only, passed through directly (RN 0.76+ handles CSS syntax)

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
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
}

for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  EXPANSIONS[parent] = EXPANSIONS[parent].map((k) => `${prefix}${k}`)
}
