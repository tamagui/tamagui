/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import {
  type StyleObject,
  StyleObjectIdentifier,
  StyleObjectRules,
  cssShorthandLonghands,
  simpleHash,
} from '@tamagui/helpers'
import { getConfigMaybe } from '../config'
import type { GetStyleState, TamaguiInternalConfig, ViewStyleObject } from '../types'
import { getConfigRevisionState } from './grammarConfig'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { styleToCSS } from './styleToCSS'
import { transformsToString } from './transformsToString'

export { styleToCSS } from './styleToCSS'

export const canGenerateCSS =
  process.env.TAMAGUI_TARGET === 'web' && !process.env.TAMAGUI_DID_OUTPUT_CSS

type DirectAtomicState = GetStyleState & {
  flatAtomics?: Record<string, StyleObject>
}

export type AtomicSlotEntry = [
  property: string,
  value: any,
  condition: number,
  identity: string,
  selector: string,
  wrappers: readonly string[] | undefined,
  original?: any,
  flags?: number,
]

export type SlotIdentity = [
  identifier: string,
  rules: string[],
  value: any,
  styleObject?: unknown,
]

function directStyleSignature(property: string, value: unknown, conditionKey = '') {
  return '\u001f' + property + '\u001f' + conditionKey + '\u001e' + String(value)
}

function getShortProp(key: string) {
  let short = ''
  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i)
    if (
      (i === 0 || (code >= 65 && code <= 90) || key.charCodeAt(i - 1) === 45) &&
      ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))
    ) {
      short += key[i].toLowerCase()
    }
  }
  return short || 'x'
}

export function registerAtomicSlot(
  state: DirectAtomicState,
  atomicKey: string,
  entries: readonly AtomicSlotEntry[]
) {
  let signature = ''
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    let value = entry[1]
    if (entry[0] === 'transform' && Array.isArray(value)) {
      value = transformsToString(value)
    }
    entry[1] = normalizeValueWithProperty(value, entry[0])
    signature += directStyleSignature(
      entry[0],
      entry[1],
      `${entry[3]}\u001d${entry[7]! >> 5}`
    )
  }
  const built = buildAtomicSlotCSS(atomicKey, entries, signature)
  if (!built) return
  let styleObjectProperty = entries[0]![0]
  for (let index = 1; index < entries.length; index++) {
    if (entries[index]![0] !== styleObjectProperty) {
      styleObjectProperty = atomicKey
      break
    }
  }
  const styleObject = (built[3] ||= [
    styleObjectProperty,
    built[2],
    built[0],
    undefined,
    built[1],
  ]) as StyleObject
  ;(state.flatAtomics ||= {})[atomicKey] = styleObject
  state.classNames[atomicKey] = built[0]
}

export function flushDirectStyles(state: GetStyleState, clear = false) {
  if (!canGenerateCSS) {
    if (clear) (state as DirectAtomicState).flatAtomics = undefined
    return
  }
  const direct = state as DirectAtomicState
  const atomics = direct.flatAtomics
  if (!atomics) return
  for (const property in atomics) {
    const styleObject = atomics[property]
    const identifier = styleObject[StyleObjectIdentifier]
    if (shouldInsertStyleRules(identifier)) {
      const rules = styleObject[StyleObjectRules].slice()
      styleObject[StyleObjectRules] = rules
      updateRules(identifier, rules)
      state.flatRulesToInsert![identifier] = styleObject
    }
  }
  if (clear) direct.flatAtomics = undefined
}

export function addComposition(state: GetStyleState, property: 'translate' | 'scale') {
  if (!canGenerateCSS || state.classNames[property]) return
  const isTranslate = property === 'translate'
  const identifier = isTranslate ? '_t-compose' : '_s-compose'
  const value = isTranslate
    ? 'var(--t-x, 0px) var(--t-y, 0px)'
    : 'var(--t-scale-x, 1) var(--t-scale-y, 1)'
  const defaults = isTranslate ? '--t-x:0px;--t-y:0px' : '--t-scale-x:1;--t-scale-y:1'
  const rules = [
    `:where(.${identifier}){${defaults}}`,
    `.${identifier}{${property}:${value}}`,
  ]
  if (shouldInsertStyleRules(identifier)) {
    updateRules(identifier, rules)
    state.flatRulesToInsert![identifier] = [
      property,
      value,
      identifier,
      undefined,
      rules,
    ] as any
  }
  state.classNames[property] = identifier
}

export function getCSSStylesAtomic(style: ViewStyleObject) {
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) return []
  styleToCSS(style)
  const out: StyleObject[] = []
  for (const key in style) {
    if (key === '$$css') continue
    const val = style[key]
    const so = getStyleObject(val, key)
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
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) return
  return getStyleObject(
    val,
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
let confRevision = 0

const getStyleObject = (
  val: any,
  key: string,
  condition = '',
  wrappers?: readonly string[],
  identity?: string,
  direct: boolean | 2 = false,
  identityKey = key,
  classRepetitions = 1
): StyleObject | undefined => {
  if (val == null) return
  if (key === 'transform' && Array.isArray(val)) {
    val = transformsToString(val)
  }
  const value = normalizeValueWithProperty(val, key)
  syncAtomicConfig()
  const rawValue = typeof value === 'string' ? value : `${value}`
  const hash = simpleHash(identity ?? rawValue, direct ? 'strict' : 10) || '0'
  const shortProp = direct
    ? getShortProp(identityKey)
    : conf?.inverseShorthands[key] || key
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
  return [key, value, identifier, undefined, rules]
}

// keyed atomicKey -> signature so the lookup never has to join the two into a
// fresh string; every atomic slot of every element goes through here per render
const slotIdentities = new Map<string, Map<string, SlotIdentity>>()
let slotIdentityCount = 0

function syncAtomicConfig() {
  const nextConf = getConfigMaybe()
  const nextRevision = nextConf ? getConfigRevisionState(nextConf).revision : 0
  if (nextConf !== conf || nextRevision !== confRevision) {
    conf = nextConf
    confRevision = nextRevision
    slotIdentities.clear()
    slotIdentityCount = 0
  }
}

export function buildAtomicSlotCSS(
  atomicKey: string,
  entries: readonly AtomicSlotEntry[],
  signature: string
): SlotIdentity | undefined {
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) return
  syncAtomicConfig()
  let bucket = slotIdentities.get(atomicKey)
  if (bucket === undefined) {
    bucket = new Map()
    slotIdentities.set(atomicKey, bucket)
  } else {
    const known = bucket.get(signature)
    if (known) return known
  }

  const hash = simpleHash(signature, 'strict') || '0'
  const shortProp = getShortProp(atomicKey)
  let identifier = `_${shortProp}-${hash}`
  if (atomicKey === 'pointerEvents' && entries.length === 1 && !entries[0][2]) {
    const value = entries[0][1]
    if (value === 'box-none') identifier = '_pe-boxnone'
    else if (value === 'box-only') identifier = '_pe-boxonly'
  }

  const rules: string[] = []
  let lastValue: any
  let layered = false
  for (let index = 1; index < entries.length; index++) {
    if (entries[index][0] !== entries[0][0]) {
      layered = true
      break
    }
  }
  for (const entry of entries) {
    const value = entry[1]
    lastValue = value
    const entryRules = createAtomicRules(
      identifier,
      entry[0],
      value,
      entry[4],
      entry[5],
      2,
      Math.max(
        layered ? 1 + (entry[7]! >> 5) : 1,
        atomicKey === 'containerName' || atomicKey === 'containerType' ? 2 : 1
      )
    )
    for (const rule of entryRules) rules.push(rule)
  }

  const built: SlotIdentity = [identifier, rules, lastValue]
  if (slotIdentityCount > 10_000) {
    slotIdentities.clear()
    slotIdentityCount = 0
    slotIdentities.set(atomicKey, (bucket = new Map()))
  }
  slotIdentityCount++
  bucket.set(signature, built)
  return built
}

const hcache = {}
const toHyphenLower = (match: string) => `-${match.toLowerCase()}`
const hyphenateStyleName = (key: string) => {
  if (key in hcache) return hcache[key]
  const val = key.replace(/[A-Z]/g, toHyphenLower)
  hcache[key] = val
  return val
}

function declaration(key: string, value: any, important = false) {
  return `${hyphenateStyleName(key)}:${value}${important ? ' !important' : ''};`
}

function createAtomicRules(
  identifier: string,
  property: string,
  value: any,
  condition = '',
  wrappers?: readonly string[],
  direct: boolean | 2 = false,
  classRepetitions = 1
): string[] {
  const repetitions =
    direct && classRepetitions > 1
      ? classRepetitions
      : !direct && property in cssShorthandLonghands
        ? 2
        : 1
  const cls = `.${identifier}`.repeat(repetitions)
  const selector = `${cls}${condition}`

  let rules: string[] = []
  switch (property) {
    case 'placeholderTextColor': {
      rules.push(
        `${selector}::placeholder{${declaration('color', value)}${declaration('opacity', 1)}}`
      )
      break
    }

    case 'backgroundClip':
    case 'userSelect': {
      const propertyCapitalized = `${property[0].toUpperCase()}${property.slice(1)}`
      const webkitProperty = `Webkit${propertyCapitalized}`
      rules.push(
        `${selector}{${declaration(property, value)}${declaration(webkitProperty, value)}}`
      )
      break
    }

    case 'pointerEvents': {
      if (direct) {
        const subject = value === 'none' || value === 'box-none' ? 'none' : 'auto'
        const children = value === 'none' || value === 'box-only' ? 'none' : 'auto'
        rules.push(
          `${selector}{pointer-events:${subject}}`,
          `${selector}>*{pointer-events:${children}}`
        )
        break
      }
      let finalValue = value
      if (value === 'auto' || value === 'box-only') {
        finalValue = 'auto'
      } else if (value === 'none' || value === 'box-none') {
        finalValue = 'none'
      }
      rules.push(`${selector}{${declaration('pointerEvents', finalValue, true)}}`)
      break
    }

    default: {
      let output = declaration(property, value)
      if (direct) output = output.slice(0, -1)
      rules.push(`${selector}{${output}}`)
      break
    }
  }

  if (wrappers) {
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
