/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import type { StyleObject } from '@tamagui/helpers'
import { cssShorthandLonghands, simpleHash } from '@tamagui/helpers'
import { getConfigMaybe } from '../config'
import type { TamaguiInternalConfig, ViewStyleObject } from '../types'
import { carriesTopLevelInjection } from './carriesTopLevelInjection'
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

export function getCSSStyleAtomic(
  key: string,
  val: any,
  condition = '',
  wrappers?: readonly string[],
  identity?: string,
  direct = false,
  identityKey = key,
  classRepetitions = 1
): StyleObject | undefined {
  return getStyleObject(
    { [key]: val } as ViewStyleObject,
    key,
    condition,
    wrappers,
    identity,
    direct,
    identityKey,
    classRepetitions
  )
}

let conf: TamaguiInternalConfig | null = null

// the direct path rebuilds the same identifier and the same rule strings on
// every render of every component, and insertStyleRules only ever inserts the
// FIRST set it sees for an identifier and discards the rest. the accumulated
// identity is the whole input to both, so one lookup replaces the hash, the
// identifier build and every rule string. two levels so a lookup allocates
// nothing. bounded and cleared the same way simpleHash's cache is.
const directIdentities = new Map<string, Map<string, DirectIdentity>>()
let directIdentitiesSize = 0

type DirectIdentity = { identifier: string; rules: string[] }

const getStyleObject = (
  style: ViewStyleObject,
  key: string,
  condition = '',
  wrappers?: readonly string[],
  identity?: string,
  direct = false,
  identityKey = key,
  classRepetitions = 1
): StyleObject | undefined => {
  let val = style[key]
  if (val == null) return
  // transform
  if (key === 'transform' && Array.isArray(style.transform)) {
    val = transformsToString(val)
  }
  const value = normalizeValueWithProperty(val, key)
  if (typeof value === 'string' && carriesTopLevelInjection(value)) return
  // media queries and shorthands come from the config, so an identity built
  // under one config says nothing about the rules under another
  const nextConf = getConfigMaybe()
  if (nextConf !== conf) {
    conf = nextConf
    directIdentities.clear()
    directIdentitiesSize = 0
  }
  // callers own the array they get back: directAtomic splices into it and
  // addComposition unshifts, so the reuse hands out a copy
  let byKey: Map<string, DirectIdentity> | undefined
  if (direct && identity !== undefined) {
    byKey = directIdentities.get(identityKey)
    const known = byKey?.get(identity)
    if (known) {
      return [key, value, known.identifier, undefined, known.rules.slice()]
    }
  }
  const rawValue = typeof value === 'string' ? value : `${value}`
  // this content hash is the atomic CSS class identity shared by server output
  // and client hydration. it is not a parser cache or a runtime lookup key.
  const hash = simpleHash(identity ?? rawValue, direct ? 'strict' : 10) || '0'
  let shortProp: string
  if (direct) {
    shortProp = ''
    for (let index = 0; index < identityKey.length; index++) {
      const code = identityKey.charCodeAt(index)
      if (
        (index === 0 ||
          (code >= 65 && code <= 90) ||
          identityKey.charCodeAt(index - 1) === 45) &&
        ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))
      ) {
        shortProp += identityKey[index].toLowerCase()
      }
    }
    shortProp ||= 'x'
  } else {
    shortProp = conf?.inverseShorthands[key] || key
  }
  let identifier = `_${shortProp}-${hash}`
  if (key === 'pointerEvents' && !condition) {
    if (value === 'box-none') identifier = '_pe-boxnone'
    else if (value === 'box-only') identifier = '_pe-boxonly'
  }
  const rules = createAtomicRules(
    identifier,
    key,
    value,
    condition,
    wrappers,
    direct,
    classRepetitions
  )
  if (direct && identity !== undefined) {
    if (directIdentitiesSize > 10_000) {
      directIdentities.clear()
      directIdentitiesSize = 0
      byKey = undefined
    }
    if (!byKey) {
      byKey = new Map()
      directIdentities.set(identityKey, byKey)
    }
    byKey.set(identity, { identifier, rules: rules.slice() })
    directIdentitiesSize++
  }
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

function createDeclarationBlock(
  style: [string, any][],
  important = false,
  trailingSemicolon = true
) {
  let next = ''
  for (let index = 0; index < style.length; index++) {
    const [key, value] = style[index]
    next += `${hyphenateStyleName(key)}:${value}${important ? ' !important' : ''}${
      trailingSemicolon || index < style.length - 1 ? ';' : ''
    }`
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
  value: any,
  condition = '',
  wrappers?: readonly string[],
  direct = false,
  classRepetitions = 1
): string[] {
  // longhands get .cls.cls for higher specificity over shorthands
  const repetitions =
    direct && classRepetitions > 1
      ? classRepetitions
      : !direct && property in cssShorthandLonghands
        ? 2
        : 1
  const cls = `.${identifier}`.repeat(repetitions)
  const selector = `${cls}${condition}`

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
      if (direct) {
        const subject = value === 'none' || value === 'box-none' ? 'none' : 'auto'
        const children = value === 'none' || value === 'box-only' ? 'none' : 'auto'
        rules.push(
          `${selector}${createDeclarationBlock([['pointerEvents', subject]], false, false)}`,
          `${selector}>*${createDeclarationBlock(
            [['pointerEvents', children]],
            false,
            false
          )}`
        )
        break
      }
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
      const block = createDeclarationBlock([[property, value]], false, !direct)
      rules.push(`${selector}${block}`)
      break
    }
  }

  if (wrappers?.length) {
    for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
      let rule = rules[ruleIndex]
      for (let index = wrappers.length - 1; index >= 0; index--) {
        rule = `${wrappers[index]} {${rule}}`
      }
      rules[ruleIndex] = rule
    }
  }
  return rules
}
