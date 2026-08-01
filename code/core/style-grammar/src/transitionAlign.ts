// Phase 6 item 4: align transition shorthand and longhand behavior.
//
// Ruling (2026-07-31, design record "Web-aligned transitions"): transitions
// follow the border-family precedent — last-wins per longhand in authored
// order, the shorthand expands-and-resets — because the five transition
// longhands are real independent CSS longhands whose composition CSS fully
// defines. The merge SUBSTRATE is the five longhand LISTS, not the zipped
// entries: `transition="opacity 200ms"` followed by `transitionDelay="50ms"`
// must yield opacity/200ms/50ms, which only works when delay replaces the
// delay list and the zip (property list drives, shorter lists cycle) happens
// at the end. Zipping and validation have one owner: final assembly goes
// through parseTransitionLonghands.
//
// The one preset exception, where the transform no-invented-composition rule
// applies: a preset occupies the fused duration+timingFunction pair and is
// not decomposable into CSS components, so a duration or timing-function
// longhand AFTER a preset shorthand is a diagnostic naming the fix.
// property/delay/behavior compose freely around a preset. A longhand after a
// global-value shorthand (`transition="inherit"`) is a diagnostic for the
// same reason: the global is whole-value and per-longhand override of it is
// not representable without pretending to decompose it.
//
// Conditional transition clauses (`transition="200ms hover:400ms"`) are
// EXPLICITLY DEFERRED, not unconsidered: the record does not promise them and
// they would pull the program engine into the transition IR.

import {
  parseTransition,
  parseTransitionLonghands,
  type PresetTransitionTiming,
  type TransitionEntry,
  type TransitionLonghands,
  type TransitionParseResult,
} from './transition'

export type TransitionLonghandName =
  | 'transitionProperty'
  | 'transitionDuration'
  | 'transitionTimingFunction'
  | 'transitionDelay'
  | 'transitionBehavior'

export interface TransitionContribution {
  /** the authored prop, in authored order */
  prop: 'transition' | TransitionLonghandName
  value: string
}

interface MergeState {
  global: string | null
  preset: PresetTransitionTiming | null
  /** each slot holds the LAST contribution's list text, or undefined = CSS default */
  lists: Partial<Record<TransitionLonghandName, string>>
}

const timingLonghands: ReadonlySet<TransitionLonghandName> = new Set([
  'transitionDuration',
  'transitionTimingFunction',
])

function listText(values: readonly string[]): string {
  return values.join(', ')
}

/**
 * Merges any mix of `transition` shorthand and longhand contributions, in
 * authored order, into one TransitionIR. Last-wins per longhand; the
 * shorthand resets all five.
 */
export function alignTransitionContributions(
  contributions: readonly TransitionContribution[],
  presetNames?: ReadonlySet<string>
): TransitionParseResult {
  const state: MergeState = { global: null, preset: null, lists: {} }

  for (const contribution of contributions) {
    if (contribution.prop === 'transition') {
      const parsed = parseTransition(contribution.value, presetNames)
      if (!parsed.ok) return parsed

      // a shorthand resets everything that came before it
      state.global = null
      state.preset = null
      state.lists = {}

      if (parsed.value.kind === 'global') {
        state.global = parsed.value.value
        continue
      }
      const entries = parsed.value.entries
      const presetEntry = entries.find((entry) => entry.timing.type === 'preset')
      if (presetEntry) {
        state.preset = presetEntry.timing as PresetTransitionTiming
        state.lists.transitionProperty = listText(entries.map((entry) => entry.property))
        state.lists.transitionDelay = listText(entries.map((entry) => entry.delay))
        state.lists.transitionBehavior = listText(entries.map((entry) => entry.behavior))
        continue
      }
      state.lists.transitionProperty = listText(entries.map((entry) => entry.property))
      state.lists.transitionDuration = listText(
        entries.map((entry) => (entry.timing as { duration: string }).duration)
      )
      state.lists.transitionTimingFunction = listText(
        entries.map(
          (entry) => (entry.timing as { timingFunction: string }).timingFunction
        )
      )
      state.lists.transitionDelay = listText(entries.map((entry) => entry.delay))
      state.lists.transitionBehavior = listText(entries.map((entry) => entry.behavior))
      continue
    }

    if (state.global) {
      return {
        ok: false,
        diagnostics: [
          {
            code: 'transition-invalid-list',
            token: contribution.prop,
            message: `"${contribution.prop}" cannot override the CSS-wide transition "${state.global}" per longhand; restate the whole transition`,
          },
        ],
      }
    }
    if (state.preset && timingLonghands.has(contribution.prop)) {
      return {
        ok: false,
        diagnostics: [
          {
            code: 'transition-invalid-list',
            token: contribution.prop,
            message: `"${contribution.prop}" cannot partially override the "${state.preset.name}" preset — a preset's timing is not decomposable into CSS components; restate \`transition\` with CSS timing or change the preset`,
          },
        ],
      }
    }
    state.lists[contribution.prop] = contribution.value
  }

  if (state.global) {
    return {
      ok: true,
      value: { kind: 'global', value: state.global as any },
    }
  }

  if (state.preset) {
    // validate and zip the three CSS-shaped slots through the one owner, then
    // transplant the preset timing onto every zipped entry
    const zipped = parseTransitionLonghands({
      transitionProperty: state.lists.transitionProperty,
      transitionDelay: state.lists.transitionDelay,
      transitionBehavior: state.lists.transitionBehavior,
    })
    if (!zipped.ok || zipped.value.kind !== 'transition') return zipped
    const preset = state.preset
    const entries: TransitionEntry[] = zipped.value.entries.map((entry) => ({
      ...entry,
      timing: preset,
    }))
    return { ok: true, value: { kind: 'transition', entries } }
  }

  return parseTransitionLonghands(state.lists as TransitionLonghands)
}
