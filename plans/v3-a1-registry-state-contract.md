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
   `open`/`checked`/`highlighted`/`invalid`/`selected` — the blessed convention
   (see Decisions).
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

## Decisions (finalized with W4)

1. **Component-tier authoring convention — BLESSED: the canonical-named variant
   form** `variants: { <A1 state>: { true: {…} } }`, mirroring existing
   `disabled`. No new core `openStyle`/`checkedStyle` pseudo-props. This is
   `deriveStates` form #2 and the PRIMARY path for
   open/checked/highlighted/invalid/selected; the raw-selector (#3) and
   pseudo-prop (#1) forms stay as fallbacks. The web `data-state` selector is
   bridge metadata for the Tailwind direction only — a pure-Tamagui item styles
   through the variant prop on both web and native, so the selector need not
   appear in the skin source.

2. **Ninth `selected` state — FOLDED IN.** Select/RadioGroup item selection emits
   `data-state="active"/"inactive"`. `selected` is component tier: modifier
   `data-[state=active]`, selector `[data-state="active"]`, native `selected`
   variant. The bare word `active` is NOT aliased to `selected` — `active` stays
   an alias of `pressed` (`:active`), avoiding the collision. W4 adds `selected`
   to `states.ts`; `deriveStates` picks it up automatically at merge (it reads
   the injected `allStates`/`selectors`, never aliases), so Select is fully
   described with no per-item `extraStates` exception. Locked by the
   `deriveStates` selected-state test.

3. **`invalid` spelling — confirmed as-is:** `aria-invalid` canonical,
   `data-[invalid]` alias. No W5 action — `deriveStates` matches whatever
   `states.ts` exports.

4. **Tailwind→Tamagui parser (`candidate.ts`) — out of scope** for this contract
   and for reassembly. The reverse mapping (`modifierToState`, canonical +
   aliases) is already exported for that later path.
