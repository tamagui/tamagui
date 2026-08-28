import { isWeb } from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  type StyleObject,
} from '@tamagui/helpers'
import { finalizeTransformAccumulator } from '@tamagui/style-grammar/runtime'

import type { GetStyleState } from '../types'
import {
  buildAtomicSlotCSS,
  getCSSStyleAtomic,
  type AtomicSlotEntry,
} from './getCSSStylesAtomic'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { transformsToString } from './transformsToString'

export const canGenerateCSS = isWeb && !process.env.TAMAGUI_DID_OUTPUT_CSS

// one style contribution in the neutral output frame: winners land in slots
// during the value pass; completion only serializes them
export interface StyleFrameEntry {
  property: string
  value: any
  condition: number
  identity: string
  selector: string
  wrappers: string[] | undefined
  original: any
  /** written while the pass could not emit classes but this property must
   * still become CSS (animated non-animatable style promotion) */
  forceCSS: boolean
  /** last-write order, breaks equal-precedence ties on the inline path */
  sequence: number
  /** run value normalization when the inline completion merges this entry */
  normalize: boolean
}

type DirectAtomicState = GetStyleState & {
  flatFrame?: Record<string, StyleFrameEntry[]>
  flatAtomics?: Record<string, StyleObject>
  flatBorderDefaultRequests?: StyleFrameEntry[]
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
  wrappers: string[] | undefined,
  selector: string
) {
  if (!canGenerateCSS || !state.flatShouldDoClasses) return
  if (state.styleProps.noNormalize === false) return
  const target = borderStyleDefaults[property]
  if (!target) return
  const requests = ((state as DirectAtomicState).flatBorderDefaultRequests ||= [])
  for (let index = 0; index < requests.length; index++) {
    if (requests[index].property === target && requests[index].identity === identity) {
      return
    }
  }
  requests.push({
    property: target,
    value: 'solid',
    condition,
    identity,
    selector,
    wrappers: wrappers && wrappers.length ? wrappers.slice() : undefined,
    original: 'solid',
    forceCSS: false,
    sequence: 0,
    normalize: false,
  })
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
    let value = entry.value
    if (entry.property === 'transform' && Array.isArray(value)) {
      value = transformsToString(value)
    }
    ;(entry as AtomicSlotEntry).value = normalizeValueWithProperty(value, entry.property)
    const precedence = entry.condition ? Math.floor(entry.condition / 256) : -1
    let insertAt = ordered.length
    while (insertAt > 0) {
      const before = ordered[insertAt - 1]
      const beforePrecedence = before.condition ? Math.floor(before.condition / 256) : -1
      if (beforePrecedence <= precedence) break
      insertAt--
    }
    ordered.splice(insertAt, 0, entry)
  }
  let signature = ''
  for (let index = 0; index < ordered.length; index++) {
    const entry = ordered[index]
    signature += directStyleSignature(entry.property, entry.value, entry.identity)
  }
  const built = buildAtomicSlotCSS(atomicKey, ordered, signature)
  if (!built) return
  const styleObject: StyleObject = [
    atomicKey,
    built.value,
    built.identifier,
    undefined,
    built.rules,
  ] as any
  ;(state.flatAtomics ||= {})[atomicKey] = styleObject
  state.classNames[atomicKey] = built.identifier
}

/**
 * Serialize the frame's CSS-destined slots: every slot when the pass emits
 * classes, only force-CSS entries otherwise. Consumed entries leave the frame;
 * whatever remains is the inline completion's input. Transition longhands
 * group into one record, and border widths synthesize a border-style default
 * unless an authored contribution owns the property.
 */
export function completeFrameCSS(state: GetStyleState) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState
  const cssMode = !!state.flatShouldDoClasses
  // a pass can be all-transform: the accumulator alone still produces a slot
  if (!direct.flatFrame && !(cssMode && state.transformAccumulator)) return
  const frame = (direct.flatFrame ||= {})

  // synthetic border-style defaults from authored width contributions,
  // resolved against the frame before any slot is consumed: an authored
  // border-style base (or a matching conditional identity, or an externally
  // merged class) suppresses the default
  let syntheticsByTarget: Record<string, StyleFrameEntry[]> | undefined
  const requests = direct.flatBorderDefaultRequests
  if (cssMode && requests) {
    for (let index = 0; index < requests.length; index++) {
      const request = requests[index]
      const target = request.property
      const targetSlot = frame[target]
      if (!targetSlot && state.classNames[target]) continue
      let covered = false
      if (targetSlot) {
        for (let t = 0; t < targetSlot.length; t++) {
          if (!targetSlot[t].condition || targetSlot[t].identity === request.identity) {
            covered = true
            break
          }
        }
      }
      if (covered) continue
      ;((syntheticsByTarget ||= {})[target] ||= []).push(request)
    }
    direct.flatBorderDefaultRequests = undefined
  }

  // the transform accumulator is the transform slot's base contribution
  if (cssMode && state.transformAccumulator) {
    const transform = finalizeTransformAccumulator(state.transformAccumulator)
    const slot = (frame.transform ||= [])
    slot.unshift({
      property: 'transform',
      value: Array.isArray(transform) ? transformsToString(transform) : transform,
      condition: 0,
      identity: '',
      selector: '',
      wrappers: undefined,
      original: undefined,
      forceCSS: false,
      sequence: 0,
      normalize: false,
    })
    state.transformAccumulator = undefined
  }

  let transitionEntries: StyleFrameEntry[] | undefined
  for (const property in frame) {
    const slot = frame[property]
    let cssEntries: StyleFrameEntry[] | undefined
    if (cssMode) {
      cssEntries = slot
      delete frame[property]
    } else {
      for (let index = slot.length - 1; index >= 0; index--) {
        if (slot[index].forceCSS) {
          ;(cssEntries ||= []).unshift(slot[index])
          slot.splice(index, 1)
        }
      }
      if (!slot.length) delete frame[property]
      if (!cssEntries) continue
    }
    const synthetics = syntheticsByTarget?.[property]
    if (synthetics) {
      for (let index = 0; index < synthetics.length; index++) {
        let covered = false
        for (let t = 0; t < cssEntries.length; t++) {
          if (cssEntries[t].identity === synthetics[index].identity) {
            covered = true
            break
          }
        }
        if (!covered) cssEntries.push(synthetics[index])
      }
      delete syntheticsByTarget![property]
    }
    if (!cssEntries.length) continue
    if (property.startsWith('transition')) {
      if (transitionEntries) {
        for (let index = 0; index < cssEntries.length; index++) {
          transitionEntries.push(cssEntries[index])
        }
      } else {
        transitionEntries = cssEntries
      }
      continue
    }
    registerSlot(direct, property, cssEntries)
  }
  if (syntheticsByTarget) {
    for (const target in syntheticsByTarget) {
      registerSlot(direct, target, syntheticsByTarget[target])
    }
  }
  if (transitionEntries) {
    registerSlot(direct, 'transition', transitionEntries)
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
  const styleObject = getCSSStyleAtomic(property, value, '', undefined, undefined, true)!
  const identifier = styleObject[StyleObjectIdentifier]
  styleObject[StyleObjectRules].unshift(`:where(.${identifier}){${defaults}}`)
  if (shouldInsertStyleRules(identifier)) {
    updateRules(identifier, styleObject[StyleObjectRules])
    state.flatRulesToInsert![identifier] = styleObject
  }
  state.classNames[property] = identifier
}

export function clearFrameAtomic(state: GetStyleState, atomicKey: string) {
  const direct = state as DirectAtomicState
  if (direct.flatAtomics) delete direct.flatAtomics[atomicKey]
}
