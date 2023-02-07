/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isWeb } from '@tamagui/constants'

export function expandStyle(key: string, value: any) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (key === 'flex') {
      // The 'flex' property value in React Native must be a positive integer,
      // 0, or -1.
      if (value <= -1) {
        return [
          ['flexGrow', 0],
          ['flexShrink', 1],
          ['flexBasis', 'auto'],
        ]
      }
      // normalizing to better align with native
      // see spec for flex shorthand https://developer.mozilla.org/en-US/docs/Web/CSS/flex
      if (value >= 0) {
        return [
          ['flexGrow', value],
          ['flexShrink', 1],
        ]
      }
      return
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

  const longKey = EXPANSIONS[key]
  if (longKey) {
    return longKey.map((key) => {
      return [key, value]
    })
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
