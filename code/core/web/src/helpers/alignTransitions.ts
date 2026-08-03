// Phase 6 item 4 runtime wiring: the six transition props accumulate in
// authored order through the forward pass and merge once at pass end via the
// style-grammar alignment model (five-list substrate, last-wins per longhand,
// shorthand resets).
//
// Driver invariants this wiring must not move:
// - a `transition` string naming a configured driver animation NEVER reaches
//   this accumulator — it short-circuits in getSplitStyles exactly as before,
//   so preset resolution on animated components is byte-identical;
// - the CSS-string form can never be mistaken for a preset: the only preset
//   test is the exact `driver.animations[value]` key lookup upstream.
//
// v1 boundaries, deliberate: a driver preset composing with longhand
// contributions has no consumer yet (drivers take names, not IR), so that mix
// is a dev diagnostic and the longhands drop while the preset behaves exactly
// as today. On native there is no CSS-transition consumer yet either: the
// merged result validates against the capability matrix (detected RN minor,
// no fallback) and reports, never silently approximates.
//
// A clause-bearing `transition` string keeps its SHIPPED program-engine path
// (conditional transitions work today; the accumulator yields to program
// ownership), which means base transitions parse through the transition IR
// while conditional and pseudo-prop transitions parse through the value
// grammar and pseudo extraction — TWO PARSING RULES for one property, a
// documented v1 limit. The follow-up is one grammar owning both, tracked in
// the handoff log; do not quietly extend either side to cover the other.

import {
  alignTransitionContributions,
  getTransformTargets,
  serializeTransition,
  type TransitionContribution,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { noteOnce } from './noteOnce'

export const transitionLonghandKeys: ReadonlySet<string> = new Set([
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'transitionBehavior',
])

/**
 * Conditional transition clauses (`transition="200ms hover:400ms"`) SHIP
 * TODAY through the program engine, so a clause-bearing shorthand must keep
 * that exact path — the accumulator only owns clause-free contributions.
 * Same top-level-colon rule as the value parser: a colon outside parens and
 * strings starts a clause.
 */
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

const camelToKebab = (property: string) =>
  property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

/**
 * `transitionProperty` entries are authored in Tamagui spellings: transform
 * family props map to the CSS property their axis variables compose into
 * (`y` -> `translate`), and camelCase names hyphenate — otherwise the CSS
 * `transition` names a property CSS does not know and silently never fires.
 */
function cssTransitionPropertyName(
  property: string,
  shorthands: Record<string, string>
): string {
  const effectiveProperty = shorthands[property] ?? property
  const targets = getTransformTargets(effectiveProperty)
  if (targets.length > 0) return targets[0].effectiveProperty
  return camelToKebab(effectiveProperty)
}

export function applyAccumulatedTransitions(styleState: GetStyleState): void {
  const contributions = styleState.transitionContributions
  if (!contributions?.length) return

  // a clause-bearing shorthand went to the program engine: the program owns
  // the transition property, and composing the aligned lists with program
  // clauses would invent semantics — the clause-free contributions drop with
  // a note, mirroring the preset rule
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

  const value = merged.value
  // normalize Tamagui property spellings before CSS sees them
  const normalized =
    value.kind === 'transition'
      ? {
          ...value,
          entries: value.entries.map((entry) =>
            entry.property === 'all' || entry.property === 'none'
              ? entry
              : {
                  ...entry,
                  property: cssTransitionPropertyName(
                    entry.property,
                    styleState.conf.shorthands
                  ),
                }
          ),
        }
      : value
  const css = serializeTransition(normalized)
  if (css !== null) {
    styleState.style ||= {}
    styleState.style.transition = css
  }
}

export function accumulateTransition(
  styleState: GetStyleState,
  prop: TransitionContribution['prop'],
  value: string
): void {
  ;(styleState.transitionContributions ||= []).push({ prop, value })
}
