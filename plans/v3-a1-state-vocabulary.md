# A1 — shared state vocabulary + style-grammar modifiers (W4 proposal)

Status: PROPOSED (additive, non-breaking). Lead reviews, W5 consumes.
Implemented in `code/core/style-grammar/src/states.ts` (exported from the package
index). Nothing existing changed — this only adds new exports.

## Why

The registry generator (W5) needs one source of truth for stateful styles: given
a skin that styles a state (pressed, open, checked, …), which Tailwind modifier
does the shadcn registry item use, and vice-versa. The grammar already handles
interaction/lifecycle states through `pseudoToModifier` (hover/press/focus/…/
enter/exit). A1 names the full vocabulary and adds the component/ARIA states that
had no modifier.

## The nine-state vocabulary

Two tiers by how the state is applied:

- **pseudo** — a core pseudo-style prop applies the styles at runtime
  (`hoverStyle`/`pressStyle`/…). Core's canonical set is exactly:
  hoverStyle, pressStyle, focusStyle, focusVisibleStyle, focusWithinStyle,
  disabledStyle, enterStyle, exitStyle. The modifier already lives in
  `pseudoToModifier`; A1 just names the state and reuses it.
- **component** — the behavior toggles a web `data-*`/`aria-*` attribute and the
  skin styles through that selector. No core pseudo-prop. The modifier is a
  Tailwind attribute variant. **These modifiers are new.**

| state | tier | Tailwind modifier | tamagui pseudo-prop | web selector | notes |
|-------|------|-------------------|--------------------|--------------|-------|
| pressed | pseudo | `press` | `pressStyle` | (`:active`) | aliases `active`, `pressed` |
| disabled | pseudo | `disabled` | `disabledStyle` | `:disabled` | |
| starting | pseudo | `enter` | `enterStyle` | (`@starting-style`) | alias `starting` |
| ending | pseudo | `exit` | `exitStyle` | — | alias `ending` |
| open | component | `data-[state=open]` | — | `[data-state="open"]` | new |
| checked | component | `data-[state=checked]` | — | `[data-state="checked"]` | aliases `data-[state=on]`, `aria-checked`; new |
| highlighted | component | `data-[highlighted]` | — | `[data-highlighted]` | new |
| invalid | component | `aria-invalid` | — | `[aria-invalid="true"]` | alias `data-[invalid]`; new |
| selected | component | `data-[state=active]` | — | `[data-state="active"]` | item selection (Select/RadioGroup/ToggleGroup); NOT aliased by bare `active`; new |

hover / focus / focus-visible / focus-within are pre-existing interaction states
(in `pseudoToModifier`); not part of the nine, but they compose identically.

## Name reconciliation

The vocabulary word can differ from the existing modifier word:
`pressed → press`, `starting → enter`, `ending → exit`. Those modifiers are
unchanged; A1 adds the vocabulary word as the state name and registers the word
as an alias so a `pressed:` / `starting:` / `ending:` class resolves correctly.

## Exports (for W5)

`stateVocabulary` (the table), `StateName`, `stateNames`, `stateToModifier`,
`modifierToState` (canonical + aliases → state), `stateToSelector` (component
tier), `stateToPseudoProp` (pseudo tier), `componentStateNames`.

## Resolved (lead, W5 relayed)

1. **Component-state authoring — BLESSED convention.** Tier-2 stateful styles
   (open/checked/highlighted/invalid/selected) are authored as canonical-named
   variants `variants: { open: { true: {…} } }` keyed by the A1 state name (same
   shape as `disabled`). That is what W5's registry derives `meta.states` from.
   Skins that genuinely can't fit it use W5's `extraStates` escape hatch, but
   uniform authoring is preferred. (No new core `openStyle`/`checkedStyle`
   pseudo-props.)
2. **9th state `selected` added** — component tier, `data-[state=active]`,
   `[data-state="active"]`. Bare `active` stays an alias of `pressed`, NOT
   `selected`.
3. **`invalid` modifier**: `aria-invalid` canonical (matches form a11y);
   `data-[invalid]` kept as alias.
4. **Selectors grounded against the source**: checkbox/switch `getState(checked)`
   emits `data-state` = `checked`/`unchecked`/`indeterminate`;
   accordion/dialog/popover/collapsible `getState(open)` emits `open`/`closed`;
   menu/select emit `data-highlighted`; forms emit `aria-invalid` (13 sites);
   `data-disabled` broad (35 sites); select/radio item selection emits
   `data-state="active"/"inactive"` → now the `selected` state.

## Skin audit (C4 sweep) — canonical-variant conformance

Per the blessed convention, component-tier stateful styles should be canonical-
named variants keyed by the A1 state name. Audit of the ten tamagui skins:

**Already canonical (no change):**
- `Sheet` — `variants: { open: { true/false } }`. The reference example.
- `Button` — `variants: { disabled: { true } }`.
- `ListItem` — `variants: { disabled: { true } }`.

**No component-tier stateful styles (pseudo-only; nothing to convert):**
- `Accordion`, `Dialog`, `Slider`, `Input`, `Toast`, `Select` — hover/press/focus/
  focus-visible only. (These components DO have component states — Accordion/Dialog
  open, Select highlighted/selected — but the skins don't style them today; they
  rely on the behavior + pseudo states. Out of audit scope.)

**Flagged — can't cleanly fit the variant convention → W5 `extraStates`:**
- `ListItem` `active` variant = item selection (the v2-compat public `active`
  prop; canonical would be `selected`). Renaming `active → selected` breaks v2
  compatibility (the whole point of styled-default), so it stays `active`; W5
  should map `active → selected` via `extraStates`. (Not a data-attribute state —
  it's a consumer-set styling prop.)
- `ToggleGroup` on-state is styled through the Toggle behavior's `activeStyle`
  prop (behavior emits `data-state="on"` / `aria-pressed`), NOT a variant.
  `data-state="on"` is A1 `checked` (alias `data-[state=on]`). Converting to
  `variants: { checked: {...} }` needs a behavior change (Toggle would have to
  toggle a `checked` variant), so keep `activeStyle`; W5 maps it to `checked` via
  `extraStates`.

Net: no skin code changes needed; two `extraStates` entries for W5 (ListItem
`active`→`selected`, ToggleGroup `activeStyle`→`checked`).

## Still open

- Parser wiring (candidate.ts) to accept the new attribute modifiers is left to
  W5; A1 stays additive and does not touch the parser.
