// A1 — the shared STATE VOCABULARY + style-grammar modifiers.
//
// The canonical set of states a styled skin can respond to, and how each maps to
// (1) a Tailwind modifier — for the shadcn registry, both directions — and (2)
// Tamagui. Additive: nothing here changes the existing grammar exports; the
// registry generator (W5) reads this table as the single source of truth for
// stateful styles.
//
// Two tiers:
//  - `pseudo`: a core pseudo-style prop applies the styles at runtime
//    (hoverStyle/pressStyle/…). These already exist in `pseudoToModifier`; the
//    vocabulary just names the state and reuses that modifier.
//  - `component`: the behavior toggles a web data/aria attribute and the skin
//    styles through that selector. No core pseudo-prop — the Tailwind modifier is
//    an attribute variant (`data-[…]` / `aria-…`).

export type StateTier = 'pseudo' | 'component'

export interface StateEntry {
  /** canonical state name — the vocabulary word. */
  state: string
  /** how the state is applied: a core pseudo-style prop, or a DOM attribute. */
  tier: StateTier
  /** canonical Tailwind modifier (e.g. 'press', 'data-[state=open]'). */
  modifier: string
  /** the core pseudo-style prop that applies it (tier === 'pseudo'). */
  pseudoProp?: string
  /** the web attribute selector the behavior emits (tier === 'component'). */
  selector?: string
  /** additional modifier spellings that resolve to the canonical one. */
  aliases?: readonly string[]
}

// The eight-state vocabulary (open/checked/pressed/highlighted/disabled/invalid/
// starting/ending). hover/focus/focus-visible/focus-within already exist in
// `pseudoToModifier` as interaction states; they are not part of the eight but
// compose the same way.
export const stateVocabulary: readonly StateEntry[] = [
  // tier 1 — interaction / lifecycle (core pseudo-style props; modifiers already
  // in pseudoToModifier). The state word can differ from the modifier word
  // (pressed→press, starting→enter, ending→exit).
  {
    state: 'pressed',
    tier: 'pseudo',
    modifier: 'press',
    pseudoProp: 'pressStyle',
    aliases: ['active', 'pressed'],
  },
  {
    state: 'disabled',
    tier: 'pseudo',
    modifier: 'disabled',
    pseudoProp: 'disabledStyle',
  },
  {
    state: 'starting',
    tier: 'pseudo',
    modifier: 'enter',
    pseudoProp: 'enterStyle',
    aliases: ['starting'],
  },
  {
    state: 'ending',
    tier: 'pseudo',
    modifier: 'exit',
    pseudoProp: 'exitStyle',
    aliases: ['ending'],
  },
  // tier 2 — component / ARIA states (behavior-driven attributes; no core
  // pseudo-prop). These modifiers are NEW to the grammar.
  {
    state: 'open',
    tier: 'component',
    modifier: 'data-[state=open]',
    selector: '[data-state="open"]',
  },
  {
    state: 'checked',
    tier: 'component',
    modifier: 'data-[state=checked]',
    selector: '[data-state="checked"]',
    aliases: ['data-[state=on]', 'aria-checked'],
  },
  {
    state: 'highlighted',
    tier: 'component',
    modifier: 'data-[highlighted]',
    selector: '[data-highlighted]',
  },
  {
    // item selection (Select/RadioGroup items, ToggleGroup) — the behavior emits
    // data-state="active"/"inactive"; distinct from `checked`. The bare word
    // `active` is NOT an alias here (it stays an alias of `pressed`).
    state: 'selected',
    tier: 'component',
    modifier: 'data-[state=active]',
    selector: '[data-state="active"]',
  },
  {
    state: 'invalid',
    tier: 'component',
    modifier: 'aria-invalid',
    selector: '[aria-invalid="true"]',
    aliases: ['data-[invalid]'],
  },
] as const

export type StateName = (typeof stateVocabulary)[number]['state']

export const stateNames: readonly string[] = Object.freeze(
  stateVocabulary.map((entry) => entry.state)
)

// state name -> canonical Tailwind modifier.
export const stateToModifier: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(stateVocabulary.map((entry) => [entry.state, entry.modifier]))
)

// any recognized modifier spelling (canonical or alias) -> canonical state name.
export const modifierToState: Readonly<Record<string, string>> = Object.freeze(
  stateVocabulary.reduce<Record<string, string>>((out, entry) => {
    out[entry.modifier] = entry.state
    for (const alias of entry.aliases ?? []) out[alias] = entry.state
    return out
  }, {})
)

// state name -> web attribute selector (component-tier states only).
export const stateToSelector: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    stateVocabulary
      .filter((entry) => entry.selector)
      .map((entry) => [entry.state, entry.selector as string])
  )
)

// state name -> core pseudo-style prop (pseudo-tier states only).
export const stateToPseudoProp: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    stateVocabulary
      .filter((entry) => entry.pseudoProp)
      .map((entry) => [entry.state, entry.pseudoProp as string])
  )
)

export const componentStateNames: readonly string[] = Object.freeze(
  stateVocabulary
    .filter((entry) => entry.tier === 'component')
    .map((entry) => entry.state)
)
