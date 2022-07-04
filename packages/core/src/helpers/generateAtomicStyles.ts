/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { StyleObject, simpleHash } from '@tamagui/helpers'
import hyphenateStyleName from 'hyphenate-style-name'
import normalizeCSSColor from 'normalize-css-color'
import { TextStyle, ViewStyle } from 'react-native'

import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { reversedShorthands } from '../createTamagui'
import { PseudoDescriptor, pseudoDescriptors } from './pseudoDescriptors'

type Value = Object | Array<any> | string | number
export type Style = { [key: string]: Value }

class Cache {
  values: Record<string, any> = {}

  get(key: string, valStr: string) {
    return this.values[key]?.[valStr]
  }

  set(key: string, valStr: string, object: any) {
    this.values[key] ??= {}
    this.values[key][valStr] = object
  }
}

const cache = new Cache()

export const generateAtomicStyles = (
  style: ViewStyle & TextStyle,
  pseudo?: PseudoDescriptor
): StyleObject[] => {
  const res = expandStyles(style)
  const out: StyleObject[] = []
  for (const key in res) {
    const value = res[key]
    if (value != null && value != undefined) {
      const valueString = normalizeValueWithProperty(value, key)
      const uid = key + (pseudo?.name || '')
      const cachedResult = cache.get(uid, valueString)
      if (cachedResult != undefined) {
        out.push(cachedResult)
      } else {
        const hash = simpleHash(uid + valueString)
        const pseudoPrefix = pseudo ? `0${pseudo.name}-` : ''
        const shortProp = reversedShorthands[key] || key
        const identifier = `_${shortProp}-${pseudoPrefix}${hash}`
        const rules = createAtomicRules(identifier, key, valueString, pseudo)
        const styleObject: StyleObject = {
          property: key,
          pseudo: pseudo?.name,
          value,
          identifier,
          rules,
        }
        cache.set(uid, valueString, styleObject)
        out.push(styleObject)
      }
    }
  }
  return out
}

const reducedStyleKeys = {
  shadowColor: true,
  shadowOffset: true,
  shadowOpacity: true,
  shadowRadius: true,
  textShadowColor: true,
  textShadowOffset: true,
  textShadowRadius: true,
}

let shorthands: Record<string, string> | null = null

// can likely remove this and include in other loops
export function expandStyles(style: any) {
  const res: Record<string, any> = {}

  if (process.env.TAMAGUI_TARGET === 'web') {
    // box-shadow
    const { boxShadow, shadowColor, shadowOffset, shadowOpacity, shadowRadius } = style
    if (shadowRadius !== undefined) {
      const { height, width } = shadowOffset || defaultOffset
      const offsetX = normalizeValueWithProperty(width || 0)
      const offsetY = normalizeValueWithProperty(height || 0)
      const blurRadius = normalizeValueWithProperty(shadowRadius || 0)
      const color = normalizeColor(String(shadowColor || 'black'), shadowOpacity)
      const shadow = `${offsetX} ${offsetY} ${blurRadius} ${color}`
      res.boxShadow = boxShadow ? `${boxShadow}, ${shadow}` : shadow
    } else if (boxShadow) {
      res.boxShadow = boxShadow
    }

    // text-shadow
    const { textShadowColor, textShadowOffset, textShadowRadius } = style
    if (textShadowColor || textShadowOffset || textShadowRadius) {
      const { height, width } = textShadowOffset || defaultOffset
      const radius = textShadowRadius || 0
      const color = normalizeValueWithProperty(textShadowColor, 'textShadowColor')
      if (color && (height !== 0 || width !== 0 || radius !== 0)) {
        const blurRadius = normalizeValueWithProperty(radius)
        const offsetX = normalizeValueWithProperty(width)
        const offsetY = normalizeValueWithProperty(height)
        res.textShadow = `${offsetX} ${offsetY} ${blurRadius} ${color}`
      }
    }

    // ensure border style set by default to solid
    for (const key in borderDefaults) {
      if (key in style) {
        res[borderDefaults[key]] = style[borderDefaults[key]] || 'solid'
      }
    }
  }

  // think this loop is ultimately unnecessary here and could be merged with higher up loop
  for (let key in style) {
    shorthands = shorthands || getConfig().shorthands
    if (shorthands) {
      key = shorthands[key] || key
    }
    if (isWeb && reducedStyleKeys[key]) {
      continue
    }
    if (key in pseudoDescriptors) {
      res[key] = expandStyles(style[key])
    } else {
      const val = normalizeValueWithProperty(style[key], key)

      if (isWeb) {
        // this is messy, no need for Object.fromEntries
        const out = expandStyle(key, val)
        if (out) {
          Object.assign(res, Object.fromEntries(out))
        } else {
          res[key] = val
        }
      } else {
        if (key === 'shadowRadius') {
          // fix weird incosistent behavior of shadows on native
          if (val) {
            if (!style.shadowOffset) {
              res.shadowOffset = defaultOffset
            }
            if (style.shadowOpacity == undefined) {
              res.shadowOpacity = 1
            }
          }
        }
        res[key] = val
      }
    }
  }

  return res
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}

function createDeclarationBlock(style: Style, important = false) {
  let declarations = ''
  for (const key in style) {
    const prop = hyphenateStyleName(key)
    const value = style[key]
    declarations += `${prop}:${value}`
  }
  return `{${declarations}${important ? ` !important` : ''};}`
}

const pseudoSelectorPrefixes = (() => {
  const res: Record<string, string> = {}
  for (const key in pseudoDescriptors) {
    const pseudo = pseudoDescriptors[key]
    res[pseudo.name] = [...Array(pseudo.priority)].map(() => ':root').join('') + ' '
  }
  return res
})()

function createAtomicRules(
  identifier: string,
  property: string,
  value: any,
  pseudo?: PseudoDescriptor
): string[] {
  const selector = pseudo
    ? `${pseudoSelectorPrefixes[pseudo.name]} .${identifier}:${pseudo.name}`
    : `.${identifier}`
  const important = !!pseudo

  let rules: string[] = []

  // Handle non-standard properties and object values that require multiple
  // CSS rules to be created.
  switch (property) {
    // Equivalent to using '::placeholder'
    case 'placeholderTextColor': {
      const block = createDeclarationBlock({ color: value, opacity: 1 }, important)
      rules.push(`${selector}::placeholder${block}`)
      break
    }

    // Polyfill for additional 'pointer-events' values
    // See d13f78622b233a0afc0c7a200c0a0792c8ca9e58
    case 'pointerEvents': {
      let finalValue = value
      if (value === 'auto' || value === 'box-only') {
        finalValue = 'auto!important'
        if (value === 'box-only') {
          const block = createDeclarationBlock({ pointerEvents: 'none' }, important)
          rules.push(`${selector}>*${block}`)
        }
      } else if (value === 'none' || value === 'box-none') {
        finalValue = 'none!important'
        if (value === 'box-none') {
          const block = createDeclarationBlock({ pointerEvents: 'auto' }, important)
          rules.push(`${selector}>*${block}`)
        }
      }
      const block = createDeclarationBlock({ pointerEvents: finalValue }, important)
      rules.push(`${selector}${block}`)
      break
    }

    // Polyfill for draft spec
    // https://drafts.csswg.org/css-scrollbars-1/
    case 'scrollbarWidth': {
      if (value === 'none') {
        rules.push(`${selector}::-webkit-scrollbar{display:none}`)
      }
      const block = createDeclarationBlock({ scrollbarWidth: value }, important)
      rules.push(`${selector}${block}`)
      break
    }

    default: {
      const block = createDeclarationBlock({ [property]: value }, important)
      rules.push(`${selector}${block}`)
      break
    }
  }

  // hover styles need to be conditional
  // perhaps this can be generalized but for now lets just shortcut
  // and hardcode for hover styles, if we need to later we can
  // WEIRD SYNTAX, SEE:
  //   https://stackoverflow.com/questions/40532204/media-query-for-devices-supporting-hover
  if (pseudo?.name === 'hover') {
    rules = rules.map((r) => `@media not all and (hover: none) { ${r} }`)
  }

  return rules
}

export function expandStyle(key: string, value: any) {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return [[key, value]]
  }

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
    // Ignore some React Native styles
    case 'elevation':
    case 'overlayColor':
    case 'resizeMode':
    case 'tintColor': {
      break
    }

    case 'aspectRatio': {
      return [[key, value.toString()]]
    }

    // TODO: remove once this issue is fixed
    // https://github.com/rofrischmann/inline-style-prefixer/issues/159
    case 'backgroundClip': {
      if (value === 'text') {
        return [
          ['backgroundClip', value],
          ['WebkitBackgroundClip', value],
        ]
      }
      break
    }

    case 'textAlignVertical': {
      return [['verticalAlign', value === 'center' ? 'middle' : value]]
    }

    case 'textDecorationLine': {
      return [['textDecorationLine', value]]
    }

    case 'transform': {
      if (Array.isArray(value)) {
        return [[key, value.map(mapTransform).join(' ')]]
      }
      break
    }

    case 'writingDirection': {
      return [['direction', value]]
    }
  }

  const longKey = STYLE_SHORT_FORM_EXPANSIONS[key]
  if (longKey) {
    return longKey.map((key) => {
      return [key, value]
    })
  } else {
    if (Array.isArray(value)) {
      return [[key, value.join(',')]]
    }
  }
}

// { scale: 2 } => 'scale(2)'
// { translateX: 20 } => 'translateX(20px)'
// { matrix: [1,2,3,4,5,6] } => 'matrix(1,2,3,4,5,6)'
const mapTransform = (transform) => {
  const type = Object.keys(transform)[0]
  const value = transform[type]
  if (type === 'matrix' || type === 'matrix3d') {
    return `${type}(${value.join(',')})`
  } else {
    const normalizedValue = normalizeValueWithProperty(value, type)
    return `${type}(${normalizedValue})`
  }
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

function normalizeValueWithProperty(value: any, property?: string): any {
  if (process.env.TAMAGUI_TARGET === 'web') {
    const shouldCoerceToPx =
      typeof value === 'number' &&
      (property === undefined || property === null || !unitlessNumbers[property])
    if (shouldCoerceToPx) {
      return `${value}px`
    }
  }
  if (property && colorProps[property]) {
    return normalizeColor(value)
  }
  return value
}

const normalizeColor = (color?: number | string, opacity = 1): void | string => {
  if (color == null || color == undefined) {
    return
  }
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (typeof color === 'string' && isWebColor(color)) {
      return color
    }
  }
  const colorInt = processColor(color)
  if (colorInt != null) {
    const r = (colorInt >> 16) & 255
    const g = (colorInt >> 8) & 255
    const b = colorInt & 255
    const a = ((colorInt >> 24) & 255) / 255
    const alpha = (a * opacity).toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return `${color}`
}

const webColors = {
  currentColor: true,
  currentcolor: true,
  transparent: true,
  inherit: true,
}

const isWebColor = (color: string): boolean => webColors[color] || color.indexOf('var(') === 0

const processColor = (color?: number | string): number | undefined | null => {
  if (color === undefined || color === null) {
    return color
  }
  let intColor = normalizeCSSColor(color)
  if (intColor === undefined || intColor === null) {
    return undefined
  }
  return ((+intColor << 24) | (+intColor >>> 8)) >>> 0
}

const unitlessNumbers = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFleGroup: true,
  boxOrdinalGroup: true,
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
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  shadowOpacity: true,
}

const defaultOffset = { height: 0, width: 0 }

const STYLE_SHORT_FORM_EXPANSIONS = {
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
