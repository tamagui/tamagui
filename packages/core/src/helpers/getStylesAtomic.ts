/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { StyleObject, simpleHash } from '@tamagui/helpers'
import hyphenateStyleName from 'hyphenate-style-name'
import { TextStyle, ViewStyle } from 'react-native'

import { reversedShorthands } from '../createTamagui'
import { defaultOffset } from './expandStyles'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { PseudoDescriptor, pseudoDescriptors } from './pseudoDescriptors'

// refactor this file away next...

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

const pseudosOrdered = Object.values(pseudoDescriptors)

export function getStylesAtomic(stylesIn: ViewStyleWithPseudos) {
  // performance optimization
  if (!stylesIn.hoverStyle && !stylesIn.pressStyle && !stylesIn.focusStyle) {
    return getAtomicStyle(stylesIn)
  }

  // only for pseudos
  const { hoverStyle, pressStyle, focusStyle, ...base } = stylesIn
  let res: StyleObject[] = []
  // *1 order matched to *0
  for (const [index, style] of [hoverStyle, pressStyle, focusStyle, base].entries()) {
    if (!style) continue
    const pseudo = pseudosOrdered[index]
    res = [...res, ...getAtomicStyle(style, pseudo)]
  }
  return res
}

export function getAtomicStyle(style: ViewStyle, pseudo?: PseudoDescriptor): StyleObject[] {
  if (process.env.NODE_ENV === 'development') {
    if (!style || typeof style !== 'object') {
      throw new Error(`Wrong style type: "${typeof style}": ${style}`)
    }
  } else {
    if (!style) {
      console.warn(`Invalid style`)
      return []
    }
  }

  return generateAtomicStyles(style, pseudo)
}

const generateAtomicStyles = (
  styleIn: ViewStyle & TextStyle,
  pseudo?: PseudoDescriptor
): StyleObject[] => {
  // were converting to css styles
  const style = styleIn as Record<string, string | null | undefined>

  // transform
  if (style.transform) {
    if (Array.isArray(style.transform)) {
      style.transform = style.transform.map(mapTransform).join(' ')
    }
  }

  styleToCSS(style)

  const out: StyleObject[] = []
  for (const key in style) {
    const value = style[key]
    if (value != null && value != undefined) {
      const uid = key + (pseudo?.name || '')
      const cachedResult = cache.get(uid, value)
      if (cachedResult != undefined) {
        out.push(cachedResult)
      } else {
        const hash = presetHashes[value]
          ? value
          : typeof value === 'string'
          ? simpleHash(value)
          : `${value}`.replace('.', 'dot')
        const pseudoPrefix = pseudo ? `0${pseudo.name}-` : ''
        const shortProp = reversedShorthands[key] || key
        const identifier = `_${shortProp}-${pseudoPrefix}${hash}`
        const rules = createAtomicRules(identifier, key, value, pseudo)
        const styleObject: StyleObject = {
          property: key,
          pseudo: pseudo?.name,
          value,
          identifier,
          rules,
        }
        cache.set(uid, value, styleObject)
        out.push(styleObject)
      }
    }
  }
  return out
}

const presetHashes = {
  none: true,
}

export function styleToCSS(style: Record<string, any>) {
  // box-shadow
  const { shadowOffset, shadowRadius, shadowColor } = style
  if (style.shadowRadius !== undefined) {
    const offset = shadowOffset || defaultOffset
    const shadow = `${offset.width} ${offset.height} ${shadowRadius} ${shadowColor}`
    style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${shadow}` : shadow
    delete style.shadowOffset
    delete style.shadowRadius
    delete style.shadowColor
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
      style.textShadow = `${offsetX} ${offsetY} ${blurRadius} ${color}`
    }
    delete style.textShadowColor
    delete style.textShadowOffset
    delete style.textShadowRadius
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

// cache
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
        finalValue = 'auto'
        if (value === 'box-only') {
          rules.push(`${selector}>*${boxOnly}`)
        }
      } else if (value === 'none' || value === 'box-none') {
        finalValue = 'none'
        if (value === 'box-none') {
          rules.push(`${selector}>*${boxNone}`)
        }
      }
      const block = createDeclarationBlock({ pointerEvents: finalValue }, true)
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
  if (pseudo && pseudo.name === 'hover') {
    rules = rules.map((r) => `@media not all and (hover: none) { ${r} }`)
  }

  return rules
}

const boxNone = createDeclarationBlock({ pointerEvents: 'auto' }, true)
const boxOnly = createDeclarationBlock({ pointerEvents: 'none' }, true)
