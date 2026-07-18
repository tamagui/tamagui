# A1 — registry state contract (W5, consumes W4's state vocabulary)

Status: BUILT on `v3/dry-registry`, dormant until reassembly. Pairs with W4's
`plans/v3-a1-state-vocabulary.md` + `code/core/style-grammar/src/states.ts`.

## What this is

The registry generator emits **one uniform state descriptor per registry item**
so every shadcn item declares — in a single vocabulary — which states its skin
responds to. Consumers (docs, a Tailwind bridge, a native runtime) read that
list and join it against the ONE vocabulary (`stateToModifier`,
`stateToSelector`, `stateToPseudoProp`) rather than re-deriving per item. No
parallel vocabulary: W5 imports W4's `states.ts` tables and never re-declares
them.

Concretely, each `registry-item.json` gains:

```json
"meta": { "states": ["disabled", "open", "pressed"] }
```

`meta.states` is the sorted, de-duplicated set of **canonical A1 state names**
(`states.ts` `stateNames`) the skin styles. That is the whole contract surface —
the per-state mapping is global (`stateToModifier` → Tailwind `data-[state=open]`
on web, `stateToPseudoProp`/component state on native), so nothing per-item is
duplicated.

## How states are DERIVED (not manifest-authored)

Consistent with the generator's DRY bar — derive everything derivable, manifest
only the non-derivable — states are scanned out of the skin source, not declared
by hand. `scripts/lib/registry/states-derive.ts` → `deriveStates(source, tables)`
recognizes three uniform authoring forms:

1. **pseudo tier** — a core pseudo-style prop as a `styled()` config key or JSX
   prop: `pressStyle: {…}` / `disabledStyle={…}`. Matched from
   `stateToPseudoProp` (`pressed`, `disabled`, `starting`→`enterStyle`,
   `ending`→`exitStyle`).
2. **component tier** — a `variants: { <state>: { … } }` block whose key is a
   canonical state name. This is exactly how the real Button already authors
   `disabled` (`variants: { disabled: { true: {…} } }`), extended to
   `open`/`checked`/`highlighted`/`invalid`.
3. **raw selector** — a style keyed by the web attribute selector literal
   (`'[data-state="checked"]': {…}`). Matched from `stateToSelector`. Rare in
   Tamagui source, recognized so nothing escapes the vocabulary.

The tables are **injected**, not imported inside the derive module, so the logic
is unit-tested on this branch (fixture tables mirroring `states.ts`) before the
style-grammar branch merges. Escape hatch for a state a scan genuinely cannot
see (applied only by a wrapping behavior component, never in the skin file):
`SkinManifest.extraStates?: string[]` — rare, prefer uniform authoring.

## Wiring (dormant until reassembly)

Built and green now, emits nothing until the A1 tables are injected:

- `states-derive.ts` — pure `deriveStates(source, tables)` + `StateTables` type.
- `buildItem(skin, skinBases, stateTables?)` — populates `meta.states` only when
  `stateTables` is passed. Undefined today → registry byte-identical, drift
  clean.
- `buildRegistry(stateTables?)` threads it through.
- `SkinManifest.extraStates` escape hatch.

**Reassembly step (lead-owned):** in `generate-registry.ts`, import the tables
from `@tamagui/style-grammar` and pass them:

```ts
import { stateToPseudoProp, stateNames, stateToSelector } from '@tamagui/style-grammar'
const stateTables = {
  pseudoProps: stateToPseudoProp,
  allStates: stateNames,
  selectors: stateToSelector,
}
// buildRegistry(stateTables) / checkDrift / writeConsumers all take it
```

Then regenerate: `registry.json` + `r/*.json` gain `meta.states`, the drift
check re-baselines the checked-in copies. Add `@tamagui/style-grammar` to the
generator's dependencies at that point.

## Gaps flagged back to W4

1. **Component-tier authoring convention must be pinned (blocks derivation of
   open/checked/highlighted/invalid).** W4's open-question #1. Recommendation:
   adopt the **canonical-named variant** form — `variants: { open: { true: {…} } }`
   keyed by the A1 state name — as THE authoring convention, mirroring how
   `disabled` is already authored. It is additive (variants exist), uniformly
   derivable (key ∈ `stateNames`), and the behavior toggles the variant prop
   (`open={true}`) it already drives. No new core pseudo-props needed. The web
   `data-state` selector is bridge metadata for the Tailwind direction only; a
   pure-Tamagui item styles through the prop on both web and native, so the
   selector need not appear in the skin source. If W4 prefers core
   `openStyle`/`checkedStyle` pseudo-props instead, `deriveStates` picks them up
   for free via `stateToPseudoProp` — but that is a bigger core change; the
   variant convention is the KISS path.

2. **Ninth `selected` state for Select/RadioGroup (W4's open-question #3).**
   Select/radio item selection emits `data-state="active"/"inactive"`, which is
   not one of the eight. W4's pilots include Select, so its selected-item styling
   currently has no vocabulary word and would escape `meta.states`. Recommend
   folding in `selected` (modifier `data-[state=active]`, selector
   `[data-state="active"]`, alias `data-[state=active]`; native: a `selected`
   variant). Cheap and it keeps Select fully described. If W4 declines, Select's
   selected styling needs `extraStates: ['selected']` in its manifest as a
   documented exception.

3. **`invalid` and `checked` canonical spellings** (W4 open-questions #2/#3) are
   fine as-is for W5 — `deriveStates` matches whatever `states.ts` exports
   (`aria-invalid`, `data-state="checked"`), aliases included via
   `modifierToState`. No action needed.

4. **Tailwind→Tamagui parser wiring (`candidate.ts`, W4 open-question #4)** is a
   separate path from this registry generator and out of scope for the state
   contract. The reverse mapping W5 would need for it (`modifierToState`,
   canonical + aliases) is already exported. If/when the to-tailwind path
   consumes the registry, W5 wires the new attribute modifiers there.
