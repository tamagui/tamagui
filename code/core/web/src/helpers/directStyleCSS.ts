import {
  StyleObjectIdentifier,
  StyleObjectRules,
  type StyleObject,
} from '@tamagui/helpers'
import { finalizeTransformAccumulator } from '@tamagui/style-grammar/runtime'

import type { GetStyleState } from '../types'
import { buildAtomicSlotCSS, type AtomicSlotEntry } from './getCSSStylesAtomic'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { transformsToString } from './transformsToString'

export const canGenerateCSS =
  process.env.TAMAGUI_TARGET === 'web' && !process.env.TAMAGUI_DID_OUTPUT_CSS

type DirectAtomicState = GetStyleState & {
  flatAtomics?: Record<string, StyleObject>
  flatBorderDefaultRequests?: AtomicSlotEntry[]
  flatSlots?: Record<string, AtomicSlotEntry[]>
}

/**
 * A border width was authored, so its edge needs `borderStyle: solid` unless
 * an authored border style owns the property by completion time. Requests key
 * off the authored (pre-expansion) property, matching the emitted class.
 */
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
  if (!canGenerateCSS || !state.flatShouldDoClasses) return
  if (state.styleProps.noNormalize === false) return
  const target = borderStyleDefaults[property]
  if (!target) return
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

function directStyleSignature(property: string, value: unknown, conditionKey = '') {
  return `\u001f${property}\u001f${conditionKey}\u001e${String(value)}`
}

const borderStyleDefaults: Record<string, string> = {
  borderWidth: 'borderStyle',
  borderTopWidth: 'borderTopStyle',
  borderRightWidth: 'borderRightStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderLeftWidth: 'borderLeftStyle',
}

function registerSlot(
  state: DirectAtomicState,
  atomicKey: string,
  entries: readonly AtomicSlotEntry[]
) {
  // identity derives from the slot's winning content AFTER normalization and
  // AFTER ordering (base first, conditionals ascending precedence): the same
  // final rules are the same class, whatever order they were contributed in
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
      const before = ordered[insertAt - 1]
      const beforePrecedence = before[2] ? Math.floor(before[2] / 256) : -1
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

// shared synchronous scratch for composition single-entry slots
const scratchEntry: AtomicSlotEntry = ['', '', 0, '', '', undefined, 0, 0]
const singleSlot: AtomicSlotEntry[] = [scratchEntry]

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
    if (list[index][0] === property && list[index][3] === identity) {
      list[index][1] = value
      list[index][2] = condition
      list[index][8] = original
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

/** collect one contribution into its per-property program */
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

/**
 * The CSS residue that genuinely cannot stream: border-style defaults resolve
 * against what the pass authored, property programs combine in precedence
 * order, transition longhands group into one record, and the
 * transform accumulator becomes the transform slot's base.
 */
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
      // nothing authored: an externally merged class still suppresses it
      if (state.classNames[target] !== undefined) continue
      ;((direct.flatSlots ||= {})[target] ||= []).push(request)
    }
  }

  // the transform accumulator is the transform slot's base contribution
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
      // rulesToInsert owns its array; never expose the cache's copy
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
  const value =
    property === 'translate'
      ? 'var(--t-x, 0px) var(--t-y, 0px)'
      : 'var(--t-scale-x, 1) var(--t-scale-y, 1)'
  const defaults =
    property === 'translate' ? '--t-x:0px;--t-y:0px' : '--t-scale-x:1;--t-scale-y:1'
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
