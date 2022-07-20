/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isWeb } from '../constants/platform'

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
      case 'aspectRatio': {
        return [[key, value.toString()]]
      }

      case 'textAlignVertical': {
        return [['verticalAlign', value === 'center' ? 'middle' : value]]
      }

      case 'textDecorationLine': {
        return [['textDecorationLine', value]]
      }

      case 'writingDirection': {
        return [['direction', value]]
      }
    }
  }

  const longKey = STYLE_SHORT_FORM_EXPANSIONS[key]
  if (longKey) {
    return longKey.map((key) => {
      return [key, value]
    })
  }
}

const STYLE_SHORT_FORM_EXPANSIONS: Record<string, string[]> = {
  borderColor: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  borderRadius: [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ],
  borderStyle: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
  borderWidth: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  marginHorizontal: ['marginRight', 'marginLeft'],
  marginVertical: ['marginTop', 'marginBottom'],
  overscrollBehavior: ['overscrollBehaviorX', 'overscrollBehaviorY'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingRight', 'paddingLeft'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
  ...(isWeb && {
    // react-native doesn't support X / Y
    overflow: ['overflowX', 'overflowY'],
  }),
}
