/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import type { StyleObject } from '@tamagui/helpers'
import { simpleHash } from '@tamagui/helpers'

import { getConfig, getConfigMaybe } from '../config'
import type { TamaguiInternalConfig, ViewStyleWithPseudos } from '../types'
import { defaultOffset } from './defaultOffset'
import { normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import type { PseudoDescriptor } from './pseudoDescriptors'
import { pseudoDescriptors } from './pseudoDescriptors'
import { transformsToString } from './transformsToString'
import { isMediaKey } from '../hooks/useMedia'

// refactor this file away next...

export function getStylesAtomic(style: ViewStyleWithPseudos) {
  styleToCSS(style)
  const out: StyleObject[] = []
  for (const key in style) {
    if (key === '$$css') continue
    const val = style[key]
    if (key in pseudoDescriptors) {
      if (val) {
        out.push(...getStyleAtomic(val, pseudoDescriptors[key]))
      }
    } else if (isMediaKey(key)) {
      for (const subKey in val) {
        const so = getStyleObject(val, subKey)
        if (so) {
          so[0] = key // set the property to be eg $platform-web so we can use it above
          out.push(so)
        }
      }
    } else {
      const so = getStyleObject(style, key)
      if (so) {
        out.push(so)
      }
    }
  }
  return out
}

export const getStyleAtomic = (
  style: ViewStyleWithPseudos,
  pseudo?: PseudoDescriptor
): StyleObject[] => {
  styleToCSS(style)
  const out: StyleObject[] = []
  for (const key in style) {
    const so = getStyleObject(style, key, pseudo)
    if (so) {
      out.push(so)
    }
  }
  return out
}

let conf: TamaguiInternalConfig | null = null

// this could be cached for performance?
const getStyleObject = (
  style: ViewStyleWithPseudos,
  key: string,
  pseudo?: PseudoDescriptor
): StyleObject | undefined => {
  let val = style[key]
  if (val == null) return
  // transform
  if (key === 'transform' && Array.isArray(style.transform)) {
    val = transformsToString(val)
  }
  const value = normalizeValueWithProperty(val, key)
  const hash = simpleHash(typeof value === 'string' ? value : `${value}`)
  const pseudoPrefix = pseudo ? `0${pseudo.name}-` : ''
  conf ||= getConfigMaybe()
  const shortProp = conf?.inverseShorthands[key] || key
  const identifier = `_${shortProp}-${pseudoPrefix}${hash}`
  const rules = createAtomicRules(identifier, key, value, pseudo)
  return [
    // array for performance
    key,
    value,
    identifier,
    pseudo?.name as any,
    rules,
  ]
}

export function styleToCSS(style: Record<string, any>) {
  // box-shadow
  const { shadowOffset, shadowRadius, shadowColor, shadowOpacity } = style
  if (shadowRadius || shadowColor) {
    const offset = shadowOffset || defaultOffset
    const width = normalizeValueWithProperty(offset.width)
    const height = normalizeValueWithProperty(offset.height)
    const radius = normalizeValueWithProperty(shadowRadius)
    const color = normalizeColor(shadowColor, shadowOpacity)
    const shadow = `${width} ${height} ${radius} ${color}`
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

// adding one more :root so we always override react native web styles :/
const selectorPriority = (() => {
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
  const pseudoIdPostfix = pseudo
    ? pseudo.name === 'disabled'
      ? `[aria-disabled]`
      : `:${pseudo.name}`
    : ''
  const pseudoSelector = pseudo?.selector

  let selector = pseudo
    ? pseudoSelector
      ? `${pseudoSelector} .${identifier}`
      : `${selectorPriority[pseudo.name]} .${identifier}${pseudoIdPostfix}`
    : `:root .${identifier}`

  // enter style on css driver needs both:
  //   .t_unmounted .selector
  //   .selector.t_unmounted
  if (pseudoSelector === pseudoDescriptors.enterStyle.selector) {
    selector = `${selector}, .${identifier}${pseudoSelector}`
  }

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
    rules = rules.map((r) => `@media (hover) {${r}}`)
  }

  return rules
}

const boxNone = createDeclarationBlock([['pointerEvents', 'auto']], true)
const boxOnly = createDeclarationBlock([['pointerEvents', 'none']], true)
