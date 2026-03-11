/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid, isWeb } from '@tamagui/constants'

import { getSetting } from '../config'
import type { PropMappedValue } from '../types'
import { parseBorderShorthand } from './parseBorderShorthand'
import { parseOutlineShorthand } from './parseOutlineShorthand'

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
        ['flexShrink', getSetting('styleCompat') === 'legacy' ? 1 : 0],
        ['flexBasis', getSetting('styleCompat') === 'legacy' ? 'auto' : 0],
      ]
    }

    switch (key) {
      case 'writingDirection': {
        return [['direction', value]]
      }
      // some safari-based browsers seem not to support without -webkit prefix
      case 'backdropFilter': {
        return [
          ['backdropFilter', value],
          ['WebkitBackdropFilter', value],
        ]
      }
    }
  }

  if (process.env.TAMAGUI_TARGET === 'native') {
    if (isAndroid && key === 'elevationAndroid') {
      return [['elevation', value]]
    }

    // native-only value transforms
    switch (key) {
      case 'objectFit': {
        const resizeMode = resizeModeMap[value] || 'cover'
        return [['resizeMode', resizeMode]]
      }
      case 'verticalAlign': {
        return [['textAlignVertical', verticalAlignMap[value] || 'auto']]
      }
      case 'position': {
        // position: fixed|sticky -> absolute on native
        if (value === 'fixed' || value === 'sticky') {
          return [['position', 'absolute']]
        }
        return
      }
      case 'backgroundImage': {
        // RN 0.76+ uses experimental_backgroundImage
        // value may be a parsed array (from parseNativeStyle) or a plain string
        return [['experimental_backgroundImage', value]]
      }
      case 'border': {
        // parse border shorthand string to individual properties
        // on native, only supports a single border (all sides)
        if (typeof value === 'string') {
          const parsed = parseBorderShorthand(value)
          if (parsed) {
            return parsed
          }
        }
        return
      }
      case 'outline': {
        if (typeof value === 'string') {
          const parsed = parseOutlineShorthand(value)
          if (parsed) {
            return parsed
          }
        }
        return
      }
    }

    // native-only key expansions (logical properties)
    if (key in nativeExpansions) {
      return nativeExpansions[key].map((k) => [k, value])
    }
  }

  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map((k) => [k, value])
  }
}

// native value transforms
const resizeModeMap: Record<string, string> = {
  fill: 'stretch',
  none: 'center',
  'scale-down': 'contain',
  contain: 'contain',
  cover: 'cover',
}

const verticalAlignMap: Record<string, string> = {
  top: 'top',
  middle: 'center',
  bottom: 'bottom',
  auto: 'auto',
}

// shared expansions
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
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
  ...(isWeb && {
    // react-native only supports borderStyle
    borderStyle: ['TopStyle', 'RightStyle', 'BottomStyle', 'LeftStyle'],
    // react-native doesn't support X / Y
    overflow: xy,
    overscrollBehavior: xy,
  }),
}

for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  EXPANSIONS[parent] = EXPANSIONS[parent].map((k) => `${prefix}${k}`)
}

// native-only expansions (logical properties not supported in RN)
const nativeExpansions: Record<string, string[]> = {
  // logical border properties
  borderBlockColor: ['borderTopColor', 'borderBottomColor'],
  borderInlineColor: ['borderEndColor', 'borderStartColor'],
  borderBlockWidth: ['borderTopWidth', 'borderBottomWidth'],
  borderInlineWidth: ['borderEndWidth', 'borderStartWidth'],
  borderBlockStyle: ['borderTopStyle', 'borderBottomStyle'],
  borderInlineStyle: ['borderEndStyle', 'borderStartStyle'],
  borderBlockStartColor: ['borderTopColor'],
  borderBlockEndColor: ['borderBottomColor'],
  borderInlineStartColor: ['borderStartColor'],
  borderInlineEndColor: ['borderEndColor'],
  borderBlockStartWidth: ['borderTopWidth'],
  borderBlockEndWidth: ['borderBottomWidth'],
  borderInlineStartWidth: ['borderStartWidth'],
  borderInlineEndWidth: ['borderEndWidth'],
  borderBlockStartStyle: ['borderTopStyle'],
  borderBlockEndStyle: ['borderBottomStyle'],
  borderInlineStartStyle: ['borderStartStyle'],
  borderInlineEndStyle: ['borderEndStyle'],
  // logical margin/padding
  marginBlock: ['marginTop', 'marginBottom'],
  marginInline: ['marginEnd', 'marginStart'],
  paddingBlock: ['paddingTop', 'paddingBottom'],
  paddingInline: ['paddingEnd', 'paddingStart'],
  marginBlockStart: ['marginTop'],
  marginBlockEnd: ['marginBottom'],
  marginInlineStart: ['marginStart'],
  marginInlineEnd: ['marginEnd'],
  paddingBlockStart: ['paddingTop'],
  paddingBlockEnd: ['paddingBottom'],
  paddingInlineStart: ['paddingStart'],
  paddingInlineEnd: ['paddingEnd'],
  // logical sizing
  minBlockSize: ['minHeight'],
  maxBlockSize: ['maxHeight'],
  minInlineSize: ['minWidth'],
  maxInlineSize: ['maxWidth'],
  blockSize: ['height'],
  inlineSize: ['width'],
  // inset
  inset: ['top', 'right', 'bottom', 'left'],
  insetBlock: ['top', 'bottom'],
  insetBlockStart: ['top'],
  insetBlockEnd: ['bottom'],
  insetInlineStart: ['left'],
  insetInlineEnd: ['right'],
}
