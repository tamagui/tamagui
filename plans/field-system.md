# Field/Form system design for v3

2026-07-16. Owner design doc for the biggest functional gap found in the
base-ui comparison (`plans/base-ui-comparison.md` §4). Prior art studied:
base-ui `field/` + `form/` + `fieldset/` (`~/github/base-ui`), our current
`code/ui/form` (87 lines, zero validation), the `*-headless` bubble inputs,
and `~/bento/src/components/forms` (every bento form hand-wires
react-hook-form + zod per demo; the OTP input wires a `Controller` per digit
slot — exactly the boilerplate a Field primitive should absorb).

## Goal

A `@tamagui/field` behavior package plus an upgraded `@tamagui/form` that
give every input-like component automatic label/description/error
association, a validation state machine, and form value collection — on web
AND native — with zero baked styles, per the v3 behavior/skin contract.
Skins (bento-style cards, error rows, etc.) become thin copy-paste fixtures.

Non-goal: replacing react-hook-form. Field must work standalone for the 80%
case and work as the presentation/aria layer under RHF/TanStack Form via the
`errors` bridge (same play as base-ui).

## Package layout

- `@tamagui/field` (new, behavior only, no aesthetic defaults, no factory):
  - `Field` (root; owns state machine + contexts; renders a plain View)
  - `Field.Label`, `Field.Description`, `Field.Error` (auto-ID association)
  - `Field.Item` (scopes label/description for group members, e.g. one
    checkbox in a group)
  - `useFieldState()` (public read of the full state; render-prop part not
    needed, a hook is more idiomatic for us)
  - `useFieldControl()` (the hook every control consumes; cheap no-op when no
    Field is present — a single context read)
- `@tamagui/form` (upgraded in place): field registry, values projection,
  `errors` prop, focus-first-invalid, `actionsRef`.
- Fieldset: defer. `Field` on a group + `Field.Item` covers the near-term
  need; a `<fieldset>`-rendering part is a later nicety.

## Core state machine (platform-neutral, the load-bearing decisions)

Copied deliberately from base-ui where their choices are hard-won:

1. **Tri-state validity**: `valid: true | false | null`, where `null` means
   "not yet evaluated". Pristine fields are never styled or announced as
   valid or invalid. `aria-invalid` only when `valid === false`.
2. **Flags**: `touched`, `dirty`, `filled`, `focused`, `disabled` — each
   maintained by the control via `useFieldControl` callbacks.
3. **`validate`** accepts either:
   - a function `(value, formValues) => string | string[] | null |
     Promise<...>`, or
   - a **Standard Schema** (`~standard` interface: zod v4, valibot, arktype)
     — issues map to error strings. This is our modernization over base-ui
     and removes the bento zod boilerplate.
4. **Async never blocks submit** (base-ui states this three times; it's a
   design decision, not a limitation): submit runs synchronous validators
   only; async results land via a monotonic commit id that drops stale
   responses.
5. **`validationMode`**: `'onSubmit' (default) | 'onBlur' | 'onChange'`, set
   on Form, overridable per Field. `onSubmit` revalidates on change after the
   first submit attempt. `validationDebounceTime` applies in onChange mode.
6. **`required` noise suppression**: a missing-value error is not raised
   until the field has been dirtied (or submit was attempted).

## Web enrichment vs native path

The state machine is pure JS and identical on both platforms. Web adds:

- native DOM `ValidityState` read from the registered control (the
  `*-headless` BubbleInputs and Input/TextArea register their real
  `<input>`); native `validationMessage` wins over custom validate except in
  onChange mode; custom errors mirrored back via `setCustomValidity`.
- `<form noValidate>` (Form owns validation UI).

Native (RN) has no ValidityState: validation is schema/function only, focus
management goes through the existing `@tamagui/focusable` registry (our
Label already does exactly this), and Form.Trigger already provides submit
without a DOM form. Nothing in the model depends on the DOM.

## Wiring: this dogfoods the v3 state → styling contract

Field state is exposed three ways, all from one state object:

1. **Data attributes** (web) via the unified emitter from the state-contract
   packet: `data-valid` / `data-invalid` / (nothing when null) plus
   `data-touched`, `data-dirty`, `data-filled`, `data-focused`,
   `data-disabled` on Field, Label, Description, Error, and every integrated
   control.
2. **Styled context**: the same keys published through `createStyledContext`
   so skins can declare `variants: { invalid: {...} }` (or compoundVariants
   mixing field state with their own variants) and it works on native too.
3. **Grammar modifiers**: `invalid:border-red9 focused:outline-color9` in
   class strings, claimed by `@tamagui/style-grammar`, compiling to
   `[data-invalid]` selectors on web and context-resolved styles on native.

ARIA/native association, all automatic:

- Field owns `controlId`, `labelId`, `messageIds`. Label associates via
  context (no manual `htmlFor`), Description/Error register into
  `messageIds`, control receives composed `aria-labelledby` /
  `aria-describedby` / `aria-invalid` — across portals.
- Native: map label text to `accessibilityLabel` and description to
  `accessibilityHint` on the control where the control opts in; Label press
  focuses the control via the focusable registry.
- Control registration: a field can own multiple inputs (radio group,
  checkbox group); last-mounted-wins for the primary control; a
  representative-input picker for focus-first-invalid.

## Form upgrade

- Registry: `Map<fieldId, { name, getValue(), validate(), controlRef,
  validityData }>` — same shape web and native.
- `onSubmit(values, eventDetails)`: values projected from the registry by
  `name` (replaces today's zero-argument callback; the old shape is a v3
  break, aligned with the callback-audit workstream).
- `errors` prop: `Record<name, string | string[]>` — the server-error and
  RHF bridge. Errors clear as the user edits that field; after a submit,
  external error changes re-run focus-first-invalid.
- `focusFirstInvalid()`: web focuses + selects; native focuses via the
  focusable registry.
- `actionsRef.validate(fieldName?)` imperative API.
- Form.Trigger stays as-is (already the cross-platform submit story).

## Component integration matrix (lands with the C4 sweep surfaces)

Each control consumes `useFieldControl()` for `{ name, disabled, ariaProps,
dataProps, onFocus/onBlur/onChange reporters, registerControl }`:

| control | notes |
| --- | --- |
| Input / TextArea | register real element on web (ValidityState source) |
| Checkbox / Switch | BubbleInput registers; checked drives `filled` |
| RadioGroup | group = one field, items register as multiple inputs |
| Select | no real input; registers controlRef for focus + custom validate |
| Slider | rides the revived hidden inputs (base-ui-fixes packet) |
| ToggleGroup | optional; same pattern as RadioGroup |

Future components that ride on this: checkbox-group (parent tri-state
select-all is Field.Item + group state), otp-field, number-field.

## Sequencing and packets

Not a beta blocker. But `useFieldControl` must exist as a stable (even if
minimal) contract before C3/C4 rewrite control surfaces, so integration is a
line per component instead of a second sweep.

- **F0** — `useFieldControl` contract + no-op provider (tiny; before C3/C4
  touch checkbox/switch/radio/input/select/slider).
- **F1** — field core: state machine, parts, aria wiring, Standard Schema +
  function validators, web ValidityState enrichment, unit + type tests.
- **F2** — form upgrade: registry, values, errors bridge, focus-first-
  invalid, actionsRef; kitchen-sink validated-signup fixture WITHOUT
  react-hook-form (the bento signup rebuilt on Field, as the canonical
  copied skin) + one RHF-bridge fixture proving coexistence.
- **F3** — control integration across the matrix above (with/after C4).
- **F4** — checkbox-group and otp-field as the first new components built on
  it (otp-field: study base-ui's code-point paste handling and
  `autoComplete="one-time-code"`; bento's OneTimeCodeInput becomes a skin).

## Acceptance

- Signup fixture validates onBlur + onSubmit-revalidate, async username
  check (non-blocking), server error injection, first-invalid focus — web
  Playwright + one native interaction case.
- Zero aesthetic styles in `@tamagui/field`; the fixture skin is app-owned.
- Aria assertions in a conformance-style suite (label/description/error
  association, `aria-invalid` timing, tri-state never announces pristine).
- Grammar test: `invalid:` modifier resolves on web (selector) and native
  (context) with identical values.
