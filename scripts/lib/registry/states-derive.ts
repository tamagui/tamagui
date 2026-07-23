// A1 registry state contract — DERIVE the states a skin responds to.
//
// this is the W5 side of the shared state vocabulary (W4's
// code/core/style-grammar/src/states.ts). the registry generator emits a
// uniform `meta.states` on every registry item: the canonical A1 state names
// (open/checked/pressed/…) the skin styles. downstream (docs, a tailwind
// bridge) joins those names against the ONE vocabulary — modifier via
// stateToModifier, selector via stateToSelector — instead of re-deriving.
//
// the vocabulary tables are INJECTED (StateTables), never re-declared here: the
// generator passes the real tables from @tamagui/style-grammar at reassembly;
// the unit test passes a small fixture. that keeps this module DRY against the
// single source of truth while remaining testable before the branches merge.

export type StateTables = {
  /** canonical state name -> core pseudo-style prop (states.ts stateToPseudoProp). */
  pseudoProps: Readonly<Record<string, string>>
  /** every canonical state name (states.ts stateNames). */
  allStates: readonly string[]
  /** canonical state name -> web attribute selector (states.ts stateToSelector). */
  selectors: Readonly<Record<string, string>>
}

// escape the RegExp metacharacters in an injected selector/prop literal.
function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * scan a skin's TSX source and return the sorted, de-duplicated set of canonical
 * A1 state names it styles. three authoring forms, all uniform and additive:
 *
 *  1. pseudo tier — a core pseudo-style prop as a styled() config key or a JSX
 *     prop: `pressStyle: {…}` / `pressStyle={…}`. matched from `pseudoProps`.
 *  2. component tier — a `variants: { <state>: { … } }` block whose key is a
 *     canonical state name (open/checked/highlighted/invalid, and disabled,
 *     which real skins author as a variant rather than disabledStyle). matched
 *     from `allStates`.
 *  3. raw selector — a style keyed by the web attribute selector itself,
 *     e.g. `'[data-state="open"]': {…}`. matched from `selectors`. rare in
 *     tamagui source but recognized so nothing escapes the vocabulary.
 */
export function deriveStates(source: string, tables: StateTables): string[] {
  const found = new Set<string>()

  // 1. pseudo-style props (config key `prop:` or JSX `prop={`).
  for (const [state, prop] of Object.entries(tables.pseudoProps)) {
    const re = new RegExp(`\\b${esc(prop)}\\s*[:=]`)
    if (re.test(source)) found.add(state)
  }

  // 2. variant keys that name a canonical state (component tier + disabled).
  //    only look at keys shaped like a variant/style branch (`name: {`) so we
  //    don't match a state word appearing in a comment or string.
  for (const state of tables.allStates) {
    const re = new RegExp(`(^|[\\s,{])${esc(state)}\\s*:\\s*\\{`, 'm')
    if (re.test(source)) found.add(state)
  }

  // 3. raw web attribute selectors used as style keys.
  for (const [state, selector] of Object.entries(tables.selectors)) {
    if (source.includes(selector)) found.add(state)
  }

  return [...found].sort()
}
