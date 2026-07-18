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

## The eight-state vocabulary

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

hover / focus / focus-visible / focus-within are pre-existing interaction states
(in `pseudoToModifier`); not part of the eight, but they compose identically.

## Name reconciliation

The vocabulary word can differ from the existing modifier word:
`pressed → press`, `starting → enter`, `ending → exit`. Those modifiers are
unchanged; A1 adds the vocabulary word as the state name and registers the word
as an alias so a `pressed:` / `starting:` / `ending:` class resolves correctly.

## Exports (for W5)

`stateVocabulary` (the table), `StateName`, `stateNames`, `stateToModifier`,
`modifierToState` (canonical + aliases → state), `stateToSelector` (component
tier), `stateToPseudoProp` (pseudo tier), `componentStateNames`.

## Open questions for the lead / W5

1. **Component-state authoring in tamagui skins.** Tier-1 states have a runtime
   pseudo-prop; tier-2 (open/checked/highlighted/invalid) do not. Today skins
   express them ad hoc — a `variant` the behavior toggles (Sheet `open`, ListItem
   `active`) or a raw data-attribute style. Do we want a uniform authoring form
   (e.g. core-supported `openStyle`/`checkedStyle` pseudo-props, or a documented
   `variants: { open: {...} }` convention W5 recognizes)? A1 defines the mapping;
   the authoring convention is the follow-up W5 needs pinned.
2. **`invalid` modifier**: `aria-invalid` vs `data-[invalid]` as canonical. Chose
   `aria-invalid` (matches form a11y); `data-[invalid]` kept as alias.
3. **`checked` selector** — grounded against the source: checkbox/switch
   `getState(checked)` emits `data-state` = `checked` / `unchecked` /
   `indeterminate`; accordion/dialog/popover/collapsible `getState(open)` emits
   `open` / `closed`; menu/select emit `data-highlighted`; forms emit
   `aria-invalid` (13 call sites); `data-disabled` is emitted broadly (35 sites).
   So the canonical selectors match. One divergence to decide: **select/radio
   item selection uses `data-state="active"/"inactive"`, not `checked`** — that is
   a separate "selected/active" concept (cf. ToggleGroup's `activeStyle`) and is
   not one of the eight. Fold it in as a ninth `selected` state, or leave it to
   per-component variants?
4. Parser wiring (candidate.ts) to accept the new attribute modifiers is left to
   W5; A1 stays additive and does not touch the parser.
