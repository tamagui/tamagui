/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { StyleObject, simpleHash } from '@tamagui/helpers'

import { getConfig } from '../config'
import type { DebugProp, TamaguiInternalConfig, ViewStyleWithPseudos } from '../types'
import { defaultOffset } from './defaultOffset'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import {
  PseudoDescriptor,
  pseudoDescriptors,
  pseudoDescriptorsBase,
} from './pseudoDescriptors'

// refactor this file away next...

export function getStylesAtomic(stylesIn: ViewStyleWithPseudos, debug?: DebugProp) {
  let res: StyleObject[] = []
  for (const pseudoName in pseudoDescriptorsBase) {
    const pseudoStyle = stylesIn[pseudoName]
    if (pseudoStyle) {
      res = [
        ...res,
        ...generateAtomicStyles(pseudoStyle, pseudoDescriptorsBase[pseudoName]),
      ]
    }
  }
  res = [...res, ...generateAtomicStyles(stylesIn)]

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(` 🪮 getStylesAtomic`, { stylesIn, res })
  }
  return res
}

let conf: TamaguiInternalConfig

// mutates...

export function transformsToString(transforms: any[]) {
  return transforms
    .map(
      // { scale: 2 } => 'scale(2)'
      // { translateX: 20 } => 'translateX(20px)'
      // { matrix: [1,2,3,4,5,6] } => 'matrix(1,2,3,4,5,6)'
      (transform) => {
        const type = Object.keys(transform)[0]
        const value = transform[type]
        if (type === 'matrix' || type === 'matrix3d') {
          return `${type}(${value.join(',')})`
        }
        return `${type}(${normalizeValueWithProperty(value, type)})`
      }
    )
    .join(' ')
}

export const generateAtomicStyles = (
  style: ViewStyleWithPseudos,
  pseudo?: PseudoDescriptor
): StyleObject[] => {
  if (!style) return []

  conf = conf || getConfig()

  styleToCSS(style)

  const out: StyleObject[] = []
  for (const key in style) {
    if (key in pseudoDescriptors) continue
    let val = style[key]
    if (val == null) continue

    // transform
    if (key === 'transform' && Array.isArray(style.transform)) {
      val = transformsToString(val)
    }

    const value = normalizeValueWithProperty(val, key)
    const hash = simpleHash(`${value}`)
    const pseudoPrefix = pseudo ? `0${pseudo.name}-` : ''
    const shortProp = conf.inverseShorthands[key] || key
    const identifier = `_${shortProp}-${pseudoPrefix}${hash}`
    const rules = createAtomicRules(identifier, key, value, pseudo)
    const styleObject: StyleObject = {
      property: key,
      pseudo: pseudo?.name as any,
      identifier,
      rules,
      value,
    }
    out.push(styleObject)
  }

  return out
}

export function styleToCSS(style: Record<string, any>) {
  // box-shadow
  const { shadowOffset, shadowRadius, shadowColor } = style
  if (style.shadowRadius) {
    const offset = shadowOffset || defaultOffset
    const width = normalizeValueWithProperty(offset.width)
    const height = normalizeValueWithProperty(offset.height)
    const radius = normalizeValueWithProperty(shadowRadius)
    const shadow = `${width} ${height} ${radius} ${shadowColor}`
    style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${shadow}` : shadow
    delete style.shadowOffset
    delete style.shadowRadius
    delete style.shadowColor
    delete style.shadowOpacity
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

function createDeclarationBlock(style: [string, any][], important = false) {
  let next = ''
  for (const [key, value] of style) {
    next += `${hyphenateStyleName(key)}:${value}${important ? ' !important' : ''};`
  }
  return `{${next}}`
}

const hcache = {}
const toHyphenLower = (match: string) => `-${match.toLowerCase()}`
const hyphenateStyleName = (key: string) => {
  if (key in hcache) return hcache[key]
  const val = key.replace(/[A-Z]/g, toHyphenLower)
  hcache[key] = val
  return val
}

const pseudoSelectorPrefixes = (() => {
  const res: Record<string, string> = {}
  for (const key in pseudoDescriptors) {
    const pseudo = pseudoDescriptors[key]
    res[pseudo.name] = `${[...Array(pseudo.priority)].map(() => ':root').join('')} `
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
    ? // adding one more :root so we always override react native web styles :/
      `${pseudoSelectorPrefixes[pseudo.name]} .${identifier}:${pseudo.name}`
    : `:root .${identifier}`
  const important = !!pseudo

  let rules: string[] = []

  // Handle non-standard properties and object values that require multiple
  // CSS rules to be created.
  switch (property) {
    // Equivalent to using '::placeholder'
    case 'placeholderTextColor': {
      const block = createDeclarationBlock(
        [
          ['color', value],
          ['opacity', 1],
        ],
        important
      )
      rules.push(`${selector}::placeholder${block}`)
      break
    }

    // all webkit prefixed rules
    case 'backgroundClip':
    case 'userSelect': {
      const propertyCapitalized = `${property[0].toUpperCase()}${property.slice(1)}`
      const webkitProperty = `Webkit${propertyCapitalized}`
      const block = createDeclarationBlock(
        [
          [property, value],
          [webkitProperty, value],
        ],
        important
      )
      rules.push(`${selector}${block}`)
      break
    }

    // Polyfill for additional 'pointer-events' values
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
      const block = createDeclarationBlock([['pointerEvents', finalValue]], true)
      rules.push(`${selector}${block}`)
      break
    }

    default: {
      const block = createDeclarationBlock([[property, value]], important)
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

const boxNone = createDeclarationBlock([['pointerEvents', 'auto']], true)
const boxOnly = createDeclarationBlock([['pointerEvents', 'none']], true)
