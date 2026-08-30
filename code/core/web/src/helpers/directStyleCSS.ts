import {
  StyleObjectIdentifier,
  StyleObjectRules,
  type StyleObject,
} from '@tamagui/helpers'
import { finalizeTransformAccumulator } from '@tamagui/style-grammar/runtime'

import type { GetStyleState } from '../types'
import {
  buildAtomicSlotCSS,
  probeRawSlotIdentity,
  storeRawSlotIdentity,
  type AtomicSlotEntry,
} from './getCSSStylesAtomic'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { transformsToString } from './transformsToString'

export const canGenerateCSS =
  process.env.TAMAGUI_TARGET === 'web' && !process.env.TAMAGUI_DID_OUTPUT_CSS

type DirectAtomicState = GetStyleState & {
  flatAtomics?: Record<string, StyleObject>
  flatBorderDefaultRequests?: AtomicSlotEntry[]
  flatTransitions?: AtomicSlotEntry[]
  /** first streamed entry per property when it carried a condition */
  flatSingleEntries?: Record<string, AtomicSlotEntry>
  flatReplaySlots?: Record<string, AtomicSlotEntry[]>
  /** properties with 2+ contributions: combined at completion, ordered by
   * precedence, restoring the deferred slot the cascade tie-break requires
   * (clauseOrderIndependence pins state-after-media at equal specificity) */
  flatSlots?: Record<string, AtomicSlotEntry[]>
  /** the current value carries clauses: open the combined slot up front */
  flatExpectMulti?: boolean
  /** a platform driver may flip this whole pass inline at completion: defer
   * every contribution into slots so the policy stays choosable */
  flatDeferCSS?: boolean
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

export function directStyleSignature(
  property: string,
  value: unknown,
  conditionKey = ''
) {
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

// shared synchronous scratch for streamed and composition single-entry slots
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
  weak: boolean,
  original?: any
) {
  for (let index = 0; index < list.length; index++) {
    if (list[index][3] === identity) {
      // a weak write never displaces the identity's existing contribution
      if (weak) return
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

/**
 * Stream one CSS contribution. A property's first contribution serializes its
 * class immediately (the overwhelmingly common case pays one cached build and
 * no entry). A second contribution promotes the property to a combined slot,
 * finished at completion by precedence order - the deferred arrangement the
 * equal-specificity cascade tie-break requires (clauseOrderIndependence).
 */
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
  weak: boolean,
  original?: any
) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState

  const replay = direct.flatReplaySlots?.[property]
  if (replay) {
    delete direct.flatReplaySlots![property]
    const list = ((direct.flatSlots ||= {})[property] = replay.map(
      (entry) => entry.slice() as AtomicSlotEntry
    ))
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
      weak,
      original
    )
    return
  }

  // an existing combined slot absorbs everything for its property
  const slots = direct.flatSlots
  if (slots) {
    const slot = slots[property]
    if (slot) {
      appendSlotEntry(
        slot,
        property,
        value,
        condition,
        identity,
        selector,
        wrapperSource,
        wrapperStart,
        wrapperCount,
        weak,
        original
      )
      return
    }
  }

  const singleEntries = direct.flatSingleEntries
  const singleEntry = singleEntries ? singleEntries[property] : undefined
  const atomics = direct.flatAtomics
  const streamed = atomics ? atomics[property] : undefined
  if (singleEntry) {
    if (singleEntry[3] !== identity) {
      // second distinct contribution: promote the single into a combined slot
      delete singleEntries![property]
      const list = ((direct.flatSlots ||= {})[property] = [singleEntry])
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
        weak,
        original
      )
      return
    }
    // repeat write for the same identity replaces the single in place below
    if (weak) return
  } else if (streamed !== undefined) {
    // a plain single was streamed: its normalized value lives in its own
    // style object, so promotion needs no side record
    if (identity) {
      const list = ((direct.flatSlots ||= {})[property] = [
        [property, (streamed as any)[1], 0, '', '', undefined, 0, 0],
      ])
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
        weak,
        original
      )
      return
    }
    if (weak) return
    // repeat plain write replaces the single in place below
  } else if (weak && state.classNames[property] !== undefined) {
    // an externally merged class owns the property; the styled-default
    // restore never displaces it
    return
  } else if (direct.flatExpectMulti === true || direct.flatDeferCSS === true) {
    // the value is known to carry more contributions for this property, or a
    // platform driver may flip this pass inline at completion: open the
    // combined slot directly instead of building a single class
    const list: AtomicSlotEntry[] = ((direct.flatSlots ||= {})[property] = [])
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
      weak,
      original
    )
    return
  }

  // repeat authored base values hit the raw memo and skip normalization,
  // signature building, and the identity lookup chain entirely
  if (!identity) {
    const memo = probeRawSlotIdentity(property, value)
    if (memo) {
      const styleObject = (memo[3] ||= [
        property,
        memo[2],
        memo[0],
        undefined,
        memo[1],
      ]) as StyleObject
      ;(direct.flatAtomics ||= {})[property] = styleObject
      state.classNames[property] = memo[0]
      return
    }
  }
  const rawValue = value
  if (property === 'transform' && Array.isArray(value)) {
    value = transformsToString(value)
  }
  const normalized = normalizeValueWithProperty(value, property)
  scratchEntry[0] = property
  scratchEntry[1] = normalized
  scratchEntry[2] = condition
  scratchEntry[3] = identity
  scratchEntry[4] = selector
  scratchEntry[5] = wrapperSource
  scratchEntry[6] = wrapperStart
  scratchEntry[7] = wrapperCount
  const built = buildAtomicSlotCSS(
    property,
    singleSlot,
    directStyleSignature(property, normalized, identity)
  )
  scratchEntry[5] = undefined
  scratchEntry[1] = ''
  if (!built) return
  if (!identity) {
    storeRawSlotIdentity(property, rawValue, built)
  }
  if (identity) {
    ;(direct.flatSingleEntries ||= {})[property] = [
      property,
      normalized,
      condition,
      identity,
      selector,
      wrapperSource,
      wrapperStart,
      wrapperCount,
    ]
  }
  const styleObject = (built[3] ||= [
    property,
    built[2],
    built[0],
    undefined,
    built[1],
  ]) as StyleObject
  ;(direct.flatAtomics ||= {})[property] = styleObject
  state.classNames[property] = built[0]
}

/**
 * The CSS residue that genuinely cannot stream: border-style defaults resolve
 * against what the pass authored, promoted multi-contribution slots combine
 * in precedence order, transition longhands group into one record, and the
 * transform accumulator becomes the transform slot's base.
 */
export function completeStreamingCSS(state: GetStyleState) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState
  const cssMode = !!state.flatShouldDoClasses
  const singleEntries = direct.flatSingleEntries

  const requests = direct.flatBorderDefaultRequests
  if (cssMode && requests) {
    direct.flatBorderDefaultRequests = undefined
    for (let index = 0; index < requests.length; index++) {
      const request = requests[index]
      const target = request[0]
      const targetSingle = singleEntries ? singleEntries[target] : undefined
      if (targetSingle) {
        if (targetSingle[3] === request[3]) continue
        // promote so the synthetic joins the target's combined slot
        delete singleEntries![target]
        ;((direct.flatSlots ||= {})[target] = [targetSingle]).push(request)
        continue
      }
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
      // an unconditioned streamed single owns the property outright
      if (direct.flatAtomics && direct.flatAtomics[target] !== undefined) continue
      // nothing authored: an externally merged class still suppresses it
      if (state.classNames[target] !== undefined) continue
      registerSlot(direct, target, [request])
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
    const slot = direct.flatSlots ? direct.flatSlots.transform : undefined
    const transformSingle = singleEntries ? singleEntries.transform : undefined
    if (slot) {
      slot.unshift(accumulated)
    } else if (transformSingle) {
      delete singleEntries!.transform
      ;(direct.flatSlots ||= {}).transform = [accumulated, transformSingle]
    } else {
      ;(direct.flatSlots ||= {}).transform = [accumulated]
    }
  }

  const slots = direct.flatSlots
  if (slots) {
    direct.flatSlots = undefined
    for (const property in slots) {
      registerSlot(direct, property, slots[property])
    }
  }

  const transitions = direct.flatTransitions
  if (transitions) {
    direct.flatTransitions = undefined
    registerSlot(direct, 'transition', transitions)
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
  if (direct.flatSingleEntries) delete direct.flatSingleEntries[atomicKey]
  if (direct.flatReplaySlots) delete direct.flatReplaySlots[atomicKey]
  if (direct.flatSlots) delete direct.flatSlots[atomicKey]
  if (atomicKey === 'transition') direct.flatTransitions = undefined
}
