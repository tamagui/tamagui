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
import { finalizeTransformAccumulator } from '@tamagui/style-grammar/runtime'
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
  flatBorderDefaultRequests?: AtomicSlotEntry[]
  flatSlots?: Record<string, AtomicSlotEntry[]>
}

export type AtomicSlotEntry = [
  property: string,
  value: any,
  condition: number,
  identity: string,
  selector: string,
  wrapperSource: readonly string[] | undefined,
  wrapperStart: number,
  wrapperCount: number,
  original?: any,
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

export function requestBorderStyleDefault(
  state: GetStyleState,
  property: string,
  condition: number,
  identity: string,
  selector: string,
  wrapperSource: readonly string[] | undefined,
  wrapperStart: number,
  wrapperCount: number
) {
  if (
    !canGenerateCSS ||
    !state.flatShouldDoClasses ||
    state.styleProps.noNormalize === false
  )
    return
  if (!property.startsWith('border') || !property.endsWith('Width')) return
  const target = property.slice(0, -5) + 'Style'
  const requests = ((state as DirectAtomicState).flatBorderDefaultRequests ||= [])
  for (let index = 0; index < requests.length; index++) {
    if (requests[index][0] === target && requests[index][3] === identity) {
      return
    }
  }
  requests.push([
    target,
    'solid',
    condition,
    identity,
    selector,
    wrapperSource,
    wrapperStart,
    wrapperCount,
  ])
}

function appendSlotEntry(
  list: AtomicSlotEntry[],
  property: string,
  value: any,
  condition: number,
  identity: string,
  selector: string,
  wrapperSource: readonly string[] | undefined,
  wrapperStart: number,
  wrapperCount: number,
  original?: any
) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    if (item[0] === property && item[3] === identity) {
      item[1] = value
      item[2] = condition
      item[8] = original
      return
    }
  }
  list.push([
    property,
    value,
    condition,
    identity,
    selector,
    wrapperSource,
    wrapperStart,
    wrapperCount,
    original,
  ])
}

export function streamAtomic(
  state: GetStyleState,
  property: string,
  value: any,
  condition: number,
  identity: string,
  selector: string,
  wrapperSource: readonly string[] | undefined,
  wrapperStart: number,
  wrapperCount: number,
  original?: any,
  slot = property
) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState
  const list = ((direct.flatSlots ||= {})[slot] ||= [])
  appendSlotEntry(
    list,
    property,
    value,
    condition,
    identity,
    selector,
    wrapperSource,
    wrapperStart,
    wrapperCount,
    original
  )
}

function registerSlot(
  state: DirectAtomicState,
  atomicKey: string,
  entries: readonly AtomicSlotEntry[]
) {
  const ordered: AtomicSlotEntry[] = []
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    let value = entry[1]
    if (entry[0] === 'transform' && Array.isArray(value)) {
      value = transformsToString(value)
    }
    entry[1] = normalizeValueWithProperty(value, entry[0])
    const precedence = entry[2] ? Math.floor(entry[2] / 256) : -1
    let insertAt = ordered.length
    while (insertAt > 0) {
      const beforePrecedence = ordered[insertAt - 1][2]
        ? Math.floor(ordered[insertAt - 1][2] / 256)
        : -1
      if (beforePrecedence <= precedence) break
      insertAt--
    }
    ordered.splice(insertAt, 0, entry)
  }
  let signature = ''
  for (let index = 0; index < ordered.length; index++) {
    const entry = ordered[index]
    signature += directStyleSignature(entry[0], entry[1], entry[3])
  }
  const built = buildAtomicSlotCSS(atomicKey, ordered, signature)
  if (!built) return
  const styleObject = (built[3] ||= [
    atomicKey,
    built[2],
    built[0],
    undefined,
    built[1],
  ]) as StyleObject
  ;(state.flatAtomics ||= {})[atomicKey] = styleObject
  state.classNames[atomicKey] = built[0]
}

const scratchEntry: AtomicSlotEntry = ['', '', 0, '', '', undefined, 0, 0]
const singleSlot: AtomicSlotEntry[] = [scratchEntry]

export function completeStreamingCSS(state: GetStyleState) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState
  const cssMode = !!state.flatShouldDoClasses

  const requests = direct.flatBorderDefaultRequests
  if (cssMode && requests) {
    direct.flatBorderDefaultRequests = undefined
    for (let index = 0; index < requests.length; index++) {
      const request = requests[index]
      const target = request[0]
      const slot = direct.flatSlots ? direct.flatSlots[target] : undefined
      if (slot) {
        let covered = false
        for (let t = 0; t < slot.length; t++) {
          if (!slot[t][2] || slot[t][3] === request[3]) {
            covered = true
            break
          }
        }
        if (!covered) slot.push(request)
        continue
      }
      if (state.classNames[target] !== undefined) continue
      ;((direct.flatSlots ||= {})[target] ||= []).push(request)
    }
  }

  if (cssMode && state.transformAccumulator) {
    const transform = finalizeTransformAccumulator(state.transformAccumulator)
    state.transformAccumulator = undefined
    const accumulated: AtomicSlotEntry = [
      'transform',
      Array.isArray(transform) ? transformsToString(transform) : transform,
      0,
      '',
      '',
      undefined,
      0,
      0,
    ]
    ;((direct.flatSlots ||= {}).transform ||= []).unshift(accumulated)
  }

  const slots = direct.flatSlots
  if (slots) {
    direct.flatSlots = undefined
    for (const property in slots) {
      registerSlot(direct, property, slots[property])
    }
  }
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
  const value = isTranslate
    ? 'var(--t-x, 0px) var(--t-y, 0px)'
    : 'var(--t-scale-x, 1) var(--t-scale-y, 1)'
  const defaults = isTranslate ? '--t-x:0px;--t-y:0px' : '--t-scale-x:1;--t-scale-y:1'
  scratchEntry[0] = property
  scratchEntry[1] = value
  scratchEntry[2] = 0
  scratchEntry[3] = ''
  scratchEntry[4] = ''
  scratchEntry[5] = undefined
  scratchEntry[6] = 0
  scratchEntry[7] = 0
  const built = buildAtomicSlotCSS(
    property,
    singleSlot,
    directStyleSignature(property, value, '')
  )
  if (!built) return
  const identifier = built[0]
  const rules = built[1].slice()
  rules.unshift(`:where(.${identifier}){${defaults}}`)
  if (shouldInsertStyleRules(identifier)) {
    updateRules(identifier, rules)
    state.flatRulesToInsert![identifier] = [
      property,
      built[2],
      identifier,
      undefined,
      rules,
    ] as any
  }
  state.classNames[property] = identifier
}

export function clearFrameAtomic(state: GetStyleState, atomicKey: string) {
  const direct = state as DirectAtomicState
  if (direct.flatAtomics) delete direct.flatAtomics[atomicKey]
  if (direct.flatSlots) delete direct.flatSlots[atomicKey]
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

const slotIdentities = new Map<string, Map<string, SlotIdentity>>()
let slotIdentitiesSize = 0

function syncAtomicConfig() {
  const nextConf = getConfigMaybe()
  const nextRevision = nextConf ? getConfigRevisionState(nextConf).revision : 0
  if (nextConf !== conf || nextRevision !== confRevision) {
    conf = nextConf
    confRevision = nextRevision
    slotIdentities.clear()
    slotIdentitiesSize = 0
  }
  return nextConf
}

export function buildAtomicSlotCSS(
  atomicKey: string,
  entries: readonly AtomicSlotEntry[],
  signature: string
): SlotIdentity | undefined {
  if (process.env.TAMAGUI_DID_OUTPUT_CSS) return
  syncAtomicConfig()
  let byKey = slotIdentities.get(atomicKey)
  const known = byKey?.get(signature)
  if (known) return known

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
      atomicKey === 'containerName' || atomicKey === 'containerType' ? 2 : 1,
      entry[6],
      entry[7]
    )
    for (const rule of entryRules) rules.push(rule)
  }

  const built: SlotIdentity = [identifier, rules, lastValue]
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
  classRepetitions = 1,
  wrapperStart = 0,
  wrapperCount = wrappers?.length || 0
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

  if (wrappers && wrapperCount) {
    for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
      let rule = rules[ruleIndex]
      for (let index = wrapperStart + wrapperCount - 1; index >= wrapperStart; index--) {
        rule = `${wrappers[index]} {${rule}}`
      }
      rules[ruleIndex] = rule
    }
  }
  return rules
}
