/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import type { StyleObject } from '@tamagui/helpers'
import { cssShorthandLonghands, simpleHash } from '@tamagui/helpers'
import { getConfigMaybe } from '../config'
import type { TamaguiInternalConfig, ViewStyleObject } from '../types'
import { defaultOffset } from './defaultOffset'
import { normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { transformsToString } from './transformsToString'

// refactor this file away next...

export function getCSSStylesAtomic(style: ViewStyleObject) {
  styleToCSS(style)
  const out: StyleObject[] = []
  for (const key in style) {
    if (key === '$$css') continue
    const val = style[key]
    const so = getStyleObject(style, key)
    if (so) {
      out.push(so)
    }
  }
  return out
}

let conf: TamaguiInternalConfig | null = null

// this could be cached for performance?
const getStyleObject = (
  style: ViewStyleObject,
  key: string
): StyleObject | undefined => {
  let val = style[key]
  if (val == null) return
  // transform
  if (key === 'transform' && Array.isArray(style.transform)) {
    val = transformsToString(val)
  }
  const value = normalizeValueWithProperty(val, key)
  const hash = simpleHash(typeof value === 'string' ? value : `${value}`)
  conf ||= getConfigMaybe()
  const shortProp = conf?.inverseShorthands[key] || key
  let identifier = `_${shortProp}-${hash}`
  if (key === 'pointerEvents') {
    if (value === 'box-none') identifier = '_pe-boxnone'
    else if (value === 'box-only') identifier = '_pe-boxonly'
  }
  const rules = createAtomicRules(identifier, key, value)
  return [
    // array for performance
    key,
    value,
    identifier,
    undefined,
    rules,
  ]
}

export function styleToCSS(style: Record<string, any>) {
  // box-shadow
  const { shadowOffset, shadowRadius, shadowColor, shadowOpacity } = style
  if (
    shadowRadius != null ||
    shadowColor ||
    shadowOffset != null ||
    shadowOpacity != null
  ) {
    const offset = shadowOffset || defaultOffset
    const width = normalizeValueWithProperty(offset.width)
    const height = normalizeValueWithProperty(offset.height)
    const radius = normalizeValueWithProperty(shadowRadius)
    const color = normalizeColor(shadowColor, shadowOpacity)
    if (color) {
      const shadow = `${width} ${height} ${radius} ${color}`
      style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${shadow}` : shadow
    }
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

function createAtomicRules(
  identifier: string,
  property: string,
  value: any
): string[] {
  // longhands get .cls.cls for higher specificity over shorthands
  const cls =
    property in cssShorthandLonghands ? `.${identifier}.${identifier}` : `.${identifier}`

  const selector = cls

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
        false
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
        false
      )
      rules.push(`${selector}${block}`)
      break
    }

    // Polyfill for additional 'pointer-events' values
    case 'pointerEvents': {
      let finalValue = value
      if (value === 'auto' || value === 'box-only') {
        finalValue = 'auto'
      } else if (value === 'none' || value === 'box-none') {
        finalValue = 'none'
      }
      const block = createDeclarationBlock([['pointerEvents', finalValue]], true)
      rules.push(`${selector}${block}`)
      break
    }

    default: {
      const block = createDeclarationBlock([[property, value]])
      rules.push(`${selector}${block}`)
      break
    }
  }

  return rules
}
