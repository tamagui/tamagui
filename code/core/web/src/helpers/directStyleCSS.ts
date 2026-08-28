import { isWeb } from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  type StyleObject,
} from '@tamagui/helpers'
import {
  finalizeTransformAccumulator,
  type ClausePrecedenceKey,
} from '@tamagui/style-grammar/runtime'

import type { GetStyleState } from '../types'
import { getCSSStyleAtomic } from './getCSSStylesAtomic'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { transformsToString } from './transformsToString'

export const canGenerateCSS = isWeb && !process.env.TAMAGUI_DID_OUTPUT_CSS

type DirectAtomic = {
  baseRules: number
  conditions?: Record<
    string,
    {
      count: number
      index: number
      precedence: ClausePrecedenceKey
      default?: boolean
    }
  >
  signature: string
  styleObject: StyleObject
}

type DirectAtomicState = GetStyleState & {
  flatAtomics?: Record<string, DirectAtomic>
}

export function directStyleSignature(
  property: string,
  value: unknown,
  conditionKey = ''
) {
  return `\u001f${property}\u001f${conditionKey}\u001e${String(value)}`
}

export function directAtomic(
  state: GetStyleState,
  property: string,
  value: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  isDefault = false
) {
  if (!canGenerateCSS) return
  const direct = state as DirectAtomicState
  const atomics = (direct.flatAtomics ||= {})
  const atomicKey = property.startsWith('transition') ? 'transition' : property
  const existing = atomics[atomicKey]
  const contribution = directStyleSignature(property, value, conditionKey)
  const signature = existing ? existing.signature + contribution : contribution
  const next = getCSSStyleAtomic(
    property,
    value,
    conditionSelector,
    conditionWrappers,
    signature,
    2 as any,
    atomicKey,
    property === 'containerName' || property === 'containerType'
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
        : undefined
  )
  if (!next) return
  const identifier = next[StyleObjectIdentifier]
  const nextRules = next[StyleObjectRules]
  const slotted = condition || atomicKey === 'transition'

  if (!existing) {
    const atomic: DirectAtomic = {
      baseRules: slotted ? 0 : nextRules.length,
      conditions: undefined,
      signature,
      styleObject: next,
    }
    if (slotted) {
      atomic.conditions = {
        [atomicKey === 'transition' ? `${conditionKey}\0${property}` : conditionKey]: {
          count: nextRules.length,
          index: 0,
          precedence: condition ? Math.floor(condition / 256) : 0,
          default: isDefault,
        },
      }
    }
    atomics[atomicKey] = atomic
  } else {
    const previousIdentifier = existing.styleObject[StyleObjectIdentifier]
    const rules = existing.styleObject[StyleObjectRules].slice()
    existing.styleObject[StyleObjectRules] = rules
    if (!condition && !isDefault && existing.conditions) {
      for (const key in existing.conditions) {
        const entry = existing.conditions[key]
        if (!entry.default) continue
        rules.splice(entry.index, entry.count)
        delete existing.conditions[key]
        for (const otherKey in existing.conditions) {
          const other = existing.conditions[otherKey]
          if (other.index > entry.index) other.index -= entry.count
        }
      }
    }
    if (previousIdentifier !== identifier) {
      const oldSelector = `.${previousIdentifier}`
      const newSelector = `.${identifier}`
      for (let index = 0; index < rules.length; index++) {
        rules[index] = rules[index].replaceAll(oldSelector, newSelector)
      }
    }
    if (slotted) {
      const slot =
        atomicKey === 'transition' ? `${conditionKey}\0${property}` : conditionKey
      const previous = existing.conditions?.[slot]
      if (previous) {
        rules.splice(previous.index, previous.count)
        if (existing.conditions) {
          for (const key in existing.conditions) {
            const entry = existing.conditions[key]
            if (entry !== previous && entry.index > previous.index) {
              entry.index -= previous.count
            }
          }
        }
        delete existing.conditions![slot]
      }
      const precedence = condition ? Math.floor(condition / 256) : 0
      let insertionIndex = rules.length
      if (existing.conditions) {
        for (const key in existing.conditions) {
          const entry = existing.conditions[key]
          if (entry.precedence > precedence && entry.index < insertionIndex) {
            insertionIndex = entry.index
          }
        }
        for (const key in existing.conditions) {
          const entry = existing.conditions[key]
          if (entry.index >= insertionIndex) entry.index += nextRules.length
        }
      }
      ;(existing.conditions ||= {})[slot] = {
        count: nextRules.length,
        index: insertionIndex,
        precedence,
        default: isDefault,
      }
      rules.splice(insertionIndex, 0, ...nextRules)
    } else {
      const difference = nextRules.length - existing.baseRules
      rules.splice(0, existing.baseRules, ...nextRules)
      if (difference && existing.conditions) {
        for (const key in existing.conditions) {
          existing.conditions[key].index += difference
        }
      }
      existing.baseRules = nextRules.length
    }
    existing.signature = signature
    existing.styleObject[StyleObjectIdentifier] = identifier
    existing.styleObject[1] = next[1]
  }
  state.classNames[atomicKey] = identifier
}

const borderStyleDefaults: Record<string, string> = {
  borderWidth: 'borderStyle',
  borderTopWidth: 'borderTopStyle',
  borderRightWidth: 'borderRightStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderLeftWidth: 'borderLeftStyle',
}

export function emitBorderStyleDefault(
  state: GetStyleState,
  property: string,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string
) {
  if (
    !canGenerateCSS ||
    !state.flatShouldDoClasses ||
    state.styleProps.noNormalize === false
  ) {
    return
  }
  const target = borderStyleDefaults[property]
  if (!target) return
  const atomic = (state as DirectAtomicState).flatAtomics?.[target]
  if (
    atomic?.baseRules ||
    (state.classNames[target] && !atomic) ||
    (condition && atomic?.conditions?.[conditionKey])
  ) {
    return
  }
  directAtomic(
    state,
    target,
    'solid',
    condition,
    conditionKey,
    conditionWrappers,
    conditionSelector,
    true
  )
}

export function flushDirectStyles(state: GetStyleState, clear = false) {
  if (!canGenerateCSS) {
    if (clear) (state as DirectAtomicState).flatAtomics = undefined
    return
  }
  const direct = state as DirectAtomicState
  if (state.transformAccumulator) {
    const transform = finalizeTransformAccumulator(state.transformAccumulator)
    directAtomic(
      state,
      'transform',
      Array.isArray(transform) ? transformsToString(transform) : transform,
      0,
      '',
      undefined,
      ''
    )
    if (clear) state.transformAccumulator = undefined
  }
  const atomics = direct.flatAtomics
  if (!atomics) return
  for (const property in atomics) {
    const styleObject = atomics[property].styleObject
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

export function clearDirectAtomic(state: GetStyleState, atomicKey: string) {
  const direct = state as DirectAtomicState
  if (direct.flatAtomics) delete direct.flatAtomics[atomicKey]
}
