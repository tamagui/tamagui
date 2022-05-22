/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { simpleHash } from '@tamagui/helpers'
import hyphenateStyleName from 'hyphenate-style-name'
import normalizeCSSColor from 'normalize-css-color'
import { TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '../constants/platform'
import { prefixInlineStyles, prefixStyles } from './prefixStyles'

export function expandStyles(style: any) {
  const res = {}
  for (const key in style) {
    updateReactDOMStyle(res, key, style[key])
  }
  return res
}

// TODO can use for inline styles...
/**
 * Compile simple style object to inline DOM styles.
 * No support for 'animationKeyframes', 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
export function inline(style: Style): Object {
  return prefixInlineStyles(expandStyles(style))
}

type Rule = string
type Rules = Array<Rule>
export type RulesData = {
  property?: string
  value?: string
  identifier: string
  rules: Rules
}
type CompilerOutput = { [key: string]: RulesData }
type Value = Object | Array<any> | string | number
export type Style = { [key: string]: Value }

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
  overflow: ['overflowX', 'overflowY'],
  overscrollBehavior: ['overscrollBehaviorX', 'overscrollBehaviorY'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingRight', 'paddingLeft'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
}

export const generateAtomicStyles = (style: ViewStyle & TextStyle): CompilerOutput => {
  const res = expandStyles(style)

  if (
    style.shadowColor != null ||
    style.shadowOffset != null ||
    style.shadowOpacity != null ||
    style.shadowRadius != null
  ) {
    boxShadowReducer(res, style)
  }

  if (
    style.textShadowColor != null ||
    style.textShadowOffset != null ||
    style.textShadowRadius != null
  ) {
    textShadowReducer(res, style)
  }

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
        const identifier = createIdentifier('r', key, value)
        const rules = createAtomicRules(identifier, key, value)
        const cachedResult = cache.set(key, valueString, {
          property: key,
          value: stringifyValueWithProperty(value, key),
          identifier,
          rules,
        })
        out[identifier] = cachedResult
      }
    }
  }

  return out
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
  if (isWeb) {
    switch (key) {
      // Ignore some React Native styles
      case 'elevation':
      case 'overlayColor':
      case 'resizeMode':
      case 'tintColor': {
        break
      }

      case 'aspectRatio': {
        return [key, value.toString()]
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
        return ['textDecorationLine', value]
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
    case 'animationKeyframes': {
      const { animationNames, rules: keyframesRules } = processKeyframesValue(value)
      const block = createDeclarationBlock({ animationName: animationNames.join(',') })
      rules.push(`${selector}${block}`, ...keyframesRules)
      break
    }

    // Equivalent to using '::placeholder'
    case 'placeholderTextColor': {
      const block = createDeclarationBlock({ color: value, opacity: 1 })
      rules.push(
        `${selector}::-webkit-input-placeholder${block}`,
        `${selector}::-moz-placeholder${block}`,
        `${selector}:-ms-input-placeholder${block}`,
        `${selector}::placeholder${block}`
      )
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
 * Create CSS keyframes rules and names from a StyleSheet keyframes object.
 */
function processKeyframesValue(keyframesValue: number | string[]) {
  if (typeof keyframesValue === 'number') {
    throw new Error(`Invalid CSS keyframes type: ${typeof keyframesValue}`)
  }

  const animationNames: string[] = []
  const rules: string[] = []
  const value = Array.isArray(keyframesValue) ? keyframesValue : [keyframesValue]

  for (const keyframes of value) {
    if (typeof keyframes === 'string') {
      // Support external animation libraries (identifiers only)
      animationNames.push(keyframes)
    } else {
      // Create rules for each of the keyframes
      const { identifier, rules: keyframesRules } = createKeyframes(keyframes)
      animationNames.push(identifier)
      rules.push(...keyframesRules)
    }
  }

  return { animationNames, rules }
}

/**
 * Create individual CSS keyframes rules.
 */
function createKeyframes(keyframes) {
  const prefixes = ['-webkit-', '']
  const identifier = createIdentifier('r', 'animation', keyframes)

  const steps =
    '{' +
    Object.keys(keyframes)
      .map((stepName) => {
        const rule = keyframes[stepName]
        const block = createDeclarationBlock(rule)
        return `${stepName}${block}`
      })
      .join('') +
    '}'

  const rules = prefixes.map((prefix) => {
    return `@${prefix}keyframes ${identifier}${steps}`
  })
  return { identifier, rules }
}

/**
 * Creates a CSS declaration block from a StyleSheet object.
 */
function createDeclarationBlock(style: Style) {
  const domStyle = prefixStyles(expandStyles(style))
  const declarationsString = Object.keys(domStyle)
    .map((property) => {
      const value = domStyle[property]
      const prop = hyphenateStyleName(property)
      // The prefixer may return an array of values:
      // { display: [ '-webkit-flex', 'flex' ] }
      // to represent "fallback" declarations
      // { display: -webkit-flex; display: flex; }
      if (Array.isArray(value)) {
        return value.map((v) => `${prop}:${v}`).join(';')
      } else {
        return `${prop}:${value}`
      }
    })
    // Once properties are hyphenated, this will put the vendor
    // prefixed and short-form properties first in the list.
    .sort()
    .join(';')

  return `{${declarationsString};}`
}

function createIdentifier(prefix: string, name: string, value): string {
  const hashedString = simpleHash(name + stringifyValueWithProperty(value, name))
  return `${prefix}-${hashedString}`
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
  const normalizedValue = normalizeValueWithProperty(value, property)
  return typeof normalizedValue !== 'string'
    ? JSON.stringify(normalizedValue || '')
    : normalizedValue
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
  if (isWeb) {
    if ((property == null || !unitlessNumbers[property]) && typeof value === 'number') {
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
  if (isWeb) {
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
  boxFlexGroup: true,
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
const prefixes = ['ms', 'Moz', 'O', 'Webkit']
const prefixKey = (prefix: string, key: string) => {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1)
}
Object.keys(unitlessNumbers).forEach((prop) => {
  prefixes.forEach((prefix) => {
    unitlessNumbers[prefixKey(prefix, prop)] = unitlessNumbers[prop]
  })
})

const resolveShadowValue = (style: ViewStyle): void | string => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = style
  const { height, width } = shadowOffset || defaultOffset
  const offsetX = normalizeValueWithProperty(width)
  const offsetY = normalizeValueWithProperty(height)
  const blurRadius = normalizeValueWithProperty(shadowRadius || 0)
  // @ts-ignore
  const color = normalizeColor(shadowColor || 'black', shadowOpacity)
  if (color != null && offsetX != null && offsetY != null && blurRadius != null) {
    return `${offsetX} ${offsetY} ${blurRadius} ${color}`
  }
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
