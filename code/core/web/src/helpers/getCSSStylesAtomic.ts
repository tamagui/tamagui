/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import type { StyleObject } from '@tamagui/helpers'
import { cssShorthandLonghands, simpleHash } from '@tamagui/helpers'
import { getConfigMaybe } from '../config'
import type { TamaguiInternalConfig, ViewStyleObject } from '../types'
import { getConfigRevisionState } from './grammarConfig'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { styleToCSS } from './styleToCSS'
import { transformsToString } from './transformsToString'

export { styleToCSS } from './styleToCSS'

// refactor this file away next...

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

export type SlotIdentity = {
  identifier: string
  rules: string[]
  value: any
  /** finished wrapper, cached so a repeat build allocates nothing */
  styleObject?: unknown
}

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
  // transform
  if (key === 'transform' && Array.isArray(val)) {
    val = transformsToString(val)
  }
  const value = normalizeValueWithProperty(val, key)
  // shorthand-derived class prefixes come from the config
  const nextConf = syncAtomicConfig()
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
  return [
    // array for performance
    key,
    value,
    identifier,
    undefined,
    rules,
  ]
}

// ── frame slot builder ───────────────────────────────────────────────────────
// Build the css for one completed frame slot in a single shot: the identifier
// hashes the slot's WINNING content, the base rule comes first, and
// conditional rules follow in ascending precedence (later rules win the
// cascade at equal specificity). Cached per (atomicKey, signature): a slot
// that resolves to the same content is the same class, however it got there.

export interface AtomicSlotEntry {
  property: string
  value: any
  condition: number
  identity: string
  selector: string
  wrappers: readonly string[] | undefined
  /** authored value, carried only on deferred platform-pseudo passes so an
   * inline conversion preserves provenance */
  original?: any
}

const slotIdentities = new Map<string, Map<string, SlotIdentity>>()
let slotIdentitiesSize = 0

// raw-value memo in front of the normalized identity: a repeat authored value
// skips normalization and signature building entirely. pure memoization - two
// raw spellings that normalize alike still share one identity through the
// normalized signature they both resolve to.
const rawSlotIdentities = new Map<string, Map<unknown, SlotIdentity>>()
let rawSlotIdentitiesSize = 0

export function probeRawSlotIdentity(
  property: string,
  raw: unknown
): SlotIdentity | undefined {
  syncAtomicConfig()
  return rawSlotIdentities.get(property)?.get(raw)
}

export function storeRawSlotIdentity(
  property: string,
  raw: unknown,
  identity: SlotIdentity
) {
  if (rawSlotIdentitiesSize > 10_000) {
    rawSlotIdentities.clear()
    rawSlotIdentitiesSize = 0
  }
  let byRaw = rawSlotIdentities.get(property)
  if (!byRaw) {
    byRaw = new Map()
    rawSlotIdentities.set(property, byRaw)
  }
  byRaw.set(raw, identity)
  rawSlotIdentitiesSize++
}

function syncAtomicConfig() {
  const nextConf = getConfigMaybe()
  const nextRevision = nextConf ? getConfigRevisionState(nextConf).revision : 0
  if (nextConf !== conf || nextRevision !== confRevision) {
    conf = nextConf
    confRevision = nextRevision
    slotIdentities.clear()
    slotIdentitiesSize = 0
    rawSlotIdentities.clear()
    rawSlotIdentitiesSize = 0
  }
  return nextConf
}

function slotClassRepetitions(atomicKey: string, condition: number): number {
  const base =
    atomicKey === 'containerName' || atomicKey === 'containerType'
      ? condition
        ? Math.max(
            2,
            1 +
              ((Math.floor(condition / 256) >>> 23) & 7) +
              (Math.floor(condition / 256) >>> 26) * 6 -
              ((condition >>> 5) & 7)
          )
        : 2
      : condition
        ? 1 +
          ((Math.floor(condition / 256) >>> 23) & 7) +
          (Math.floor(condition / 256) >>> 26) * 6 -
          ((condition >>> 5) & 7)
        : 1
  return base
}

export function buildAtomicSlotCSS(
  atomicKey: string,
  entries: readonly AtomicSlotEntry[],
  signature: string
): SlotIdentity | undefined {
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) return
  // media queries and shorthands come from the config, so an identity built
  // under one config says nothing about the rules under another
  syncAtomicConfig()
  let byKey = slotIdentities.get(atomicKey)
  const known = byKey?.get(signature)
  if (known) return known

  const hash = simpleHash(signature, 'strict') || '0'
  let shortProp = ''
  for (let index = 0; index < atomicKey.length; index++) {
    const code = atomicKey.charCodeAt(index)
    if (
      (index === 0 ||
        (code >= 65 && code <= 90) ||
        atomicKey.charCodeAt(index - 1) === 45) &&
      ((code >= 65 && code <= 90) || (code >= 97 && code <= 122))
    ) {
      shortProp += atomicKey[index].toLowerCase()
    }
  }
  shortProp ||= 'x'
  let identifier = `_${shortProp}-${hash}`
  if (atomicKey === 'pointerEvents' && entries.length === 1 && !entries[0].condition) {
    const value = entries[0].value
    if (value === 'box-none') identifier = '_pe-boxnone'
    else if (value === 'box-only') identifier = '_pe-boxonly'
  }

  // entries arrive ordered (base first, conditionals ascending precedence)
  // and normalized: the slot signature was built from exactly this sequence
  const rules: string[] = []
  let lastValue: any
  for (const entry of entries) {
    // values arrive normalized: the slot signature normalized them so the
    // identity hash and the rule text agree
    const value = entry.value
    lastValue = value
    const entryRules = createAtomicRules(
      identifier,
      entry.property,
      value,
      entry.selector,
      entry.wrappers,
      2,
      slotClassRepetitions(atomicKey, entry.condition)
    )
    for (const rule of entryRules) rules.push(rule)
  }

  const built: SlotIdentity = { identifier, rules, value: lastValue }
  if (slotIdentitiesSize > 10_000) {
    slotIdentities.clear()
    slotIdentitiesSize = 0
    byKey = undefined
  }
  if (!byKey) {
    byKey = new Map()
    slotIdentities.set(atomicKey, byKey)
  }
  byKey.set(signature, built)
  slotIdentitiesSize++
  return built
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
  direct: boolean | 2 = false,
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
