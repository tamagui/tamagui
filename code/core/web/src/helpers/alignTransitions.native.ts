import {
  alignTransitionContributions,
  validateNativeTransition,
  type TransitionContribution,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { detectNativeTransitionTarget } from './nativeTransitionTarget'
import { noteOnce } from './noteOnce'

export const transitionLonghandKeys: ReadonlySet<string> = new Set([
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'transitionBehavior',
])

export function hasTopLevelClause(value: string): boolean {
  let depth = 0
  let quote = ''
  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    if (quote) {
      if (char === '\\') index++
      else if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'") quote = char
    else if (char === '(') depth++
    else if (char === ')') depth--
    else if (char === ':' && depth === 0) return true
  }
  return false
}

export function applyAccumulatedTransitions(styleState: GetStyleState): void {
  const contributions = styleState.transitionContributions
  if (!contributions?.length) return

  if (styleState.programs?.has('transition')) {
    noteOnce(
      `[tamagui] a conditional \`transition\` value owns the property; the other transition contributions are dropped. Put everything in the conditional value, or remove its clauses to use longhands.`
    )
    return
  }

  if (styleState.sawTransitionPreset) {
    noteOnce(
      `[tamagui] transition longhands cannot compose with the "${styleState.sawTransitionPreset}" driver preset yet — the preset applies and the longhands are dropped. Restate \`transition\` as a CSS value to use longhands.`
    )
    return
  }

  const merged = alignTransitionContributions(contributions)
  if (!merged.ok) {
    for (const diagnostic of merged.diagnostics) {
      noteOnce(`[tamagui] ${diagnostic.message}`)
    }
    return
  }

  const target = detectNativeTransitionTarget()
  if (!target) {
    noteOnce(
      `[tamagui] CSS transitions on native need a detectable React Native version and platform; none was found, so the transition is dropped`
    )
    return
  }
  const validated = validateNativeTransition(merged.value, target)
  if (!validated.ok) {
    for (const diagnostic of validated.diagnostics) {
      noteOnce(`[tamagui] ${diagnostic.message}`)
    }
    return
  }
  noteOnce(
    `[tamagui] CSS transitions are not driven on native yet — use an animation driver preset. The value validated against the capability matrix and was dropped.`
  )
}

export function accumulateTransition(
  styleState: GetStyleState,
  prop: TransitionContribution['prop'],
  value: string
): void {
  ;(styleState.transitionContributions ||= []).push({ prop, value })
}
