/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { simpleHash } from '@tamagui/helpers'
import hyphenateStyleName from 'hyphenate-style-name'
import normalizeCSSColor from 'normalize-css-color'
import { TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '../constants/platform'
import { pseudos } from './getStylesAtomic'

type Value = Object | Array<any> | string | number
export type Style = { [key: string]: Value }

type Rule = string
type Rules = Array<Rule>

export type RulesData = {
  property?: string
  value?: string
  identifier: string
  rules: Rules
}

type CompilerOutput = { [key: string]: RulesData }

const reducedStyleKeys = {
  shadowColor: true,
  shadowOffset: true,
  shadowOpacity: true,
  shadowRadius: true,
  textShadowColor: true,
  textShadowOffset: true,
  textShadowRadius: true,
}

export function expandStyles(style: any) {
  const res = {}
  boxShadowReducer(res, style)
  textShadowReducer(res, style)
  for (const key in style) {
    if (reducedStyleKeys[key]) continue
    if (key in pseudos) {
      res[key] = expandStyles(style[key])
    } else {
      updateReactDOMStyle(res, key, style[key])
    }
  }
  return res
}

function updateReactDOMStyle(style: Object, key: string, value: any) {
  value = normalizeValueWithProperty(value, key)
  const out = expandStyle(key, value)
  if (out) {
    Object.assign(style, Object.fromEntries(out))
  } else {
    style[key] = value
  }
}

export const generateAtomicStyles = (style: ViewStyle & TextStyle): CompilerOutput => {
  const res = expandStyles(style)

  const out = {}
  for (const key in res) {
    const value = res[key]
    if (value != null) {
      const valueString = stringifyValueWithProperty(value, key)
      const cachedResult = cache.get(key, valueString)
      if (cachedResult != null) {
        const { identifier } = cachedResult
        out[identifier] = cachedResult
      } else {
        const identifier = simpleHash(key + valueString)
        const rules = createAtomicRules(identifier, key, valueString)
        const cachedResult = cache.set(key, valueString, {
          property: key,
          value: valueString,
          identifier,
          rules,
        })
        out[identifier] = cachedResult
      }
    }
  }

  return out
}

export function expandStyle(key: string, value: any) {
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
    if (isWeb && Array.isArray(value)) {
      return [[key, value.join(',')]]
    }
  }
}

function createAtomicRules(identifier: string, property, value): Rules {
  const rules: string[] = []
  const selector = `.${identifier}`

  // Handle non-standard properties and object values that require multiple
  // CSS rules to be created.
  switch (property) {
    // Equivalent to using '::placeholder'
    case 'placeholderTextColor': {
      const block = createDeclarationBlock({ color: value, opacity: 1 })
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
          const block = createDeclarationBlock({ pointerEvents: 'none' })
          rules.push(`${selector}>*${block}`)
        }
      } else if (value === 'none' || value === 'box-none') {
        finalValue = 'none!important'
        if (value === 'box-none') {
          const block = createDeclarationBlock({ pointerEvents: 'auto' })
          rules.push(`${selector}>*${block}`)
        }
      }
      const block = createDeclarationBlock({ pointerEvents: finalValue })
      rules.push(`${selector}${block}`)
      break
    }

    // Polyfill for draft spec
    // https://drafts.csswg.org/css-scrollbars-1/
    case 'scrollbarWidth': {
      if (value === 'none') {
        rules.push(`${selector}::-webkit-scrollbar{display:none}`)
      }
      const block = createDeclarationBlock({ scrollbarWidth: value })
      rules.push(`${selector}${block}`)
      break
    }

    default: {
      const block = createDeclarationBlock({ [property]: value })
      rules.push(`${selector}${block}`)
      break
    }
  }

  return rules
}

/**
 * Creates a CSS declaration block from a StyleSheet object.
 */
function createDeclarationBlock(style: Style) {
  const domStyle = expandStyles(style)
  const declarationsString = Object.keys(domStyle)
    .map((property) => {
      const value = domStyle[property]
      const prop = hyphenateStyleName(property)
      return `${prop}:${value}`
    })
    // Once properties are hyphenated, this will put the vendor
    // prefixed and short-form properties first in the list.
    .sort()
    .join(';')

  return `{${declarationsString};}`
}

const cache = {
  get(property, value) {
    if (
      cache[property] != null &&
      cache[property].hasOwnProperty(value) &&
      cache[property][value] != null
    ) {
      return cache[property][value]
    }
  },
  set(property, value, object) {
    if (cache[property] == null) {
      cache[property] = {}
    }
    return (cache[property][value] = object)
  },
}

function stringifyValueWithProperty(value: Value, property?: string): string {
  // e.g., 0 => '0px', 'black' => 'rgba(0,0,0,1)'
  return normalizeValueWithProperty(value, property)
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
}

const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.indexOf('var(') === 0

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

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */

const resolveShadowValue = (style: ViewStyle): void | string => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = style
  if (shadowRadius === undefined) {
    return
  }
  const { height, width } = shadowOffset || defaultOffset
  const offsetX = normalizeValueWithProperty(width)
  const offsetY = normalizeValueWithProperty(height)
  const blurRadius = normalizeValueWithProperty(shadowRadius || 0)
  const color = normalizeColor(String(shadowColor || 'black'), shadowOpacity)
  return `${offsetX} ${offsetY} ${blurRadius} ${color}`
}

function boxShadowReducer(resolvedStyle, style) {
  const { boxShadow } = style
  const shadow = resolveShadowValue(style)
  if (shadow != null) {
    resolvedStyle.boxShadow = boxShadow ? `${boxShadow}, ${shadow}` : shadow
  }
}

const defaultOffset = { height: 0, width: 0 }
function textShadowReducer(resolvedStyle, style) {
  const { textShadowColor, textShadowOffset, textShadowRadius } = style
  const { height, width } = textShadowOffset || defaultOffset
  const radius = textShadowRadius || 0
  const offsetX = normalizeValueWithProperty(width)
  const offsetY = normalizeValueWithProperty(height)
  const blurRadius = normalizeValueWithProperty(radius)
  const color = normalizeValueWithProperty(textShadowColor, 'textShadowColor')

  if (
    color &&
    (height !== 0 || width !== 0 || radius !== 0) &&
    offsetX != null &&
    offsetY != null &&
    blurRadius != null
  ) {
    resolvedStyle.textShadow = `${offsetX} ${offsetY} ${blurRadius} ${color}`
  }
}

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
