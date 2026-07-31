// The platform-clause capability contract and the composed conversion
// assessment (three-dimension review, 2026-07-31).
//
// Three separately-owned dimensions, one composed answer:
// - PROPERTY: programEligibility (can this prop carry programs at all).
// - CLAUSE (this file): can a modifier lower on web CSS, and can it evaluate
//   natively. This is the ONE owner of both capability sets — the web side is
//   DERIVED from the lowering selector table and the native side is defined
//   here and consumed by the native evaluator, so the claims cannot drift
//   from what actually runs.
// - HOST: owned by the validStyles tables in @tamagui/helpers (enforced at
//   runtime by the text-only-prop ruling). NOT mirrored here — the consumer
//   supplies a HostView it already holds (staticConfig for the runtime and
//   codemod, the serialized config for tooling).
//
// The composition lives INSIDE assessFlatConversion so no consumer ever
// combines axes itself: one question, one structured answer, and "clean"
// means convertible AND evaluable where the author put it.

import { legacyPartComposite, programEligibility } from './programEligibility'
import { defaultStateSelectors } from './lowerProgram'
import { parseContainerModifier, parseGroupModifier } from './modifierRegistry'
import type { ModifierKind, ModifierRegistryView } from './valueTypes'

/**
 * States the native evaluator can source right now: componentState fields
 * plus enter/exit from the lifecycle. Component-tier states (open, checked,
 * highlighted, invalid, …) need the behavior packages to feed componentState;
 * until then they are web-only and the evaluator diagnoses them — it imports
 * THIS set, so widening it here is what enables them there.
 */
export const nativeSourceableStates: ReadonlySet<string> = new Set([
  'hover',
  'press',
  'active',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
])

/**
 * States a group clause can source natively: the subset of the sourceable
 * set that `subscribeToContextGroup` writes into componentState.group. The
 * native evaluator derives its group-state key map from this set.
 */
export const nativeGroupSourceableStates: readonly string[] = Object.freeze([
  'hover',
  'press',
  'active',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
])

const nativeGroupSourceable: ReadonlySet<string> = new Set(nativeGroupSourceableStates)

/**
 * Web lowerability is DERIVED from the selector table the lowering actually
 * uses, so `exit` (deliberately absent there — no exited-state class exists
 * in the DOM to select) is web-unlowerable here by construction.
 */
const webLowerableStates: ReadonlySet<string> = new Set(
  Object.keys(defaultStateSelectors)
)

export interface ClauseCapability {
  /** the clause can lower to web CSS */
  web: boolean
  /** the clause can evaluate on native */
  native: boolean
  /** why a side is unsupported, for diagnostics */
  note?: string
}

const bothTargets: ClauseCapability = Object.freeze({ web: true, native: true })

/**
 * Per-modifier capability. `kind` comes from the same registry the value was
 * parsed against; an unregistered modifier is a parse error upstream and
 * reports unsupported on both targets here.
 */
export function clauseCapability(
  modifier: string,
  kind: ModifierKind | undefined
): ClauseCapability {
  if (kind === 'media' || kind === 'theme' || kind === 'platform') {
    return bothTargets
  }
  if (kind === 'container') {
    return bothTargets
  }
  if (kind === 'state') {
    const web = webLowerableStates.has(modifier)
    const native = nativeSourceableStates.has(modifier)
    if (web && native) return bothTargets
    return {
      web,
      native,
      note: !web
        ? `"${modifier}:" cannot lower to web CSS — there is no exited-state class in the DOM to select; exit is animation-driver territory`
        : `"${modifier}:" is a component-tier state with no native source until the behavior packages feed componentState`,
    }
  }
  if (kind === 'group') {
    const parsed = parseGroupModifier(modifier)
    if (!parsed) return { web: false, native: false, note: `"${modifier}:" is not a group modifier` }
    const web = webLowerableStates.has(parsed.state)
    const native = nativeGroupSourceable.has(parsed.state)
    if (web && native) return bothTargets
    return {
      web,
      native,
      note: `group state "${parsed.state}" has no native source`,
    }
  }
  return {
    web: false,
    native: false,
    note: `"${modifier}:" is not a registered modifier`,
  }
}

/** file-extension intent: shared files must support BOTH targets */
export type ConversionTargets = 'shared' | 'web' | 'native'

/**
 * Host validity as the consumer already holds it — a projection of the
 * component's staticConfig, never a table of this package's own.
 */
export interface HostView {
  /** does this host accept `prop` as a style (validStyles + accept) */
  accepts(prop: string): boolean
  /** for diagnostics: the component name the author sees */
  componentName?: string
}

export interface ConversionReason {
  dimension: 'property' | 'clause' | 'host'
  modifier?: string
  message: string
  /** the action the author takes, stated concretely */
  remedy: string
}

export interface ConversionAssessment {
  /**
   * clean: convertible AND evaluable where authored, with ALL THREE
   * dimensions verified — clean is a promise, so an unchecked dimension can
   * never produce it. needs-relocation: the conversion is syntactically
   * right but this site was DETERMINED unable to evaluate it — the remedy
   * names where it goes. unknown-host: property and clauses verified but the
   * component identity could not be established, so host validity is
   * UNVERIFIED rather than fine — the site needs review, not relocation.
   * ineligible: this property cannot carry the clause spelling at all.
   */
  verdict: 'clean' | 'needs-relocation' | 'unknown-host' | 'ineligible'
  reasons: readonly ConversionReason[]
}

export interface ConversionInput {
  property: string
  /** modifiers used across the value's clauses, deduplicated by the caller or not */
  modifiers?: readonly string[]
  targets: ConversionTargets
  /**
   * absent means the consumer could NOT establish the component's identity
   * (structural provenance proves only direct View/Text and traceable styled
   * bases today) — the verdict is then at best 'unknown-host', never 'clean'
   */
  host?: HostView
}

const clean: ConversionAssessment = Object.freeze({ verdict: 'clean', reasons: [] })

/**
 * The one call a converter, lint rule, or report makes before claiming a
 * flat-value suggestion is safe. Composes property eligibility, per-target
 * clause capability, and host validity; consumers never combine axes
 * themselves.
 */
export function assessFlatConversion(
  input: ConversionInput,
  registry: ModifierRegistryView
): ConversionAssessment {
  const reasons: ConversionReason[] = []

  if (programEligibility(input.property) === 'legacy-part') {
    reasons.push({
      dimension: 'property',
      message: `"${input.property}" is a part prop with no flat clause spelling`,
      remedy: `move the condition onto \`${legacyPartComposite[input.property]}\``,
    })
    return { verdict: 'ineligible', reasons }
  }

  for (const modifier of input.modifiers ?? []) {
    const capability = clauseCapability(modifier, registry.get(modifier))
    const needsWeb = input.targets !== 'native'
    const needsNative = input.targets !== 'web'
    if ((needsWeb && !capability.web) || (needsNative && !capability.native)) {
      const missing = needsWeb && !capability.web ? 'web' : 'native'
      reasons.push({
        dimension: 'clause',
        modifier,
        message:
          capability.note ?? `"${modifier}:" is not supported on ${missing}`,
        remedy:
          missing === 'web'
            ? `keep the driver-evaluated pseudo prop, or move this usage to a .native.tsx file`
            : `move this usage to a .web.tsx file, or drop the clause on native`,
      })
    }
  }

  if (input.host && !input.host.accepts(input.property)) {
    reasons.push({
      dimension: 'host',
      message: `"${input.property}" is not a valid style on ${input.host.componentName ?? 'this component'} — the runtime drops it`,
      remedy: `move this style to a component that accepts it (a Text-based component, or html.* on web)`,
    })
  }

  if (reasons.length) return { verdict: 'needs-relocation', reasons }

  if (!input.host) {
    return {
      verdict: 'unknown-host',
      reasons: [
        {
          dimension: 'host',
          message: `the component's identity could not be established, so host validity for "${input.property}" is unverified`,
          remedy: `verify the component accepts this style prop, or supply type-aware provenance so the check can run`,
        },
      ],
    }
  }

  return clean
}
