# Select v3 improvements: cross-platform multiple selection design

2026-07-16. Design packet only. This is a proposal for the Select work in C3,
not an implementation authorization.

## Decision

Ship string-only `multiple` selection as part of C3's new Select behavior
layer. Do not add it as a patch to the current Select implementation. The
feature changes root state, item registration, keyboard navigation, floating
positioning, web-native rendering, Adapt handoff, and the React Native path.
C3 owns every one of those seams already.

Defer `items`, object values, `itemToStringLabel`, and
`isItemEqualToValue` to the Combobox/Autocomplete packet. That packet needs a
single platform-neutral item registry, equality helper, label resolver, and
form serializer shared by Combobox and Select. Building those utilities twice
would make Select's C3 decomposition more expensive and would leave two
behavior paths to maintain.

This packet preserves C3's contract:

- behavior owns selection state, item registration, focus, keyboard and
  typeahead, floating and sheet integration, native `<select>` behavior,
  accessibility, portal structure, and web form participation;
- the skin owns the visual trigger, item, selected indicator, viewport,
  scroll controls, and any Sheet footer or completion affordance;
- one platform-neutral selection controller feeds the four render adapters.
  Platform adapters change representation and platform accessibility only.

## Goals and non-goals

The initial feature is a controlled or uncontrolled set of unique string
values, represented in selection order as a `string[]`. Selecting an
unselected item appends it. Selecting a selected item removes it without
reordering the remaining values. The user-driven path never creates a
duplicate.

This packet also adds web form participation because a multi-select without
repeated form entries is incomplete. It proposes `name` and `form` on the
root, with one successful form control per selected value on custom web paths.

It does not add any of the following:

- object-valued items or custom equality;
- data-driven rendering from an `items` prop;
- search, filtering, chips, createable values, or Combobox virtual focus;
- a default mobile "Done" button or any default skin;
- a React Native form abstraction. Field integration remains the later Field
  packet described in `plans/base-ui-comparison.md`.

## API proposal

Keep Select string-valued for this packet. The second generic makes the root
value conditional on the literal `multiple` prop. A non-literal boolean is
allowed but intentionally produces the union required by a runtime-varying
mode.

```tsx
type SelectValue<Value extends string, Multiple extends boolean | undefined> =
  Multiple extends true ? Value[] : Value

export interface SelectProps<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
> {
  children?: React.ReactNode
  id?: string

  multiple?: Multiple
  value?: SelectValue<Value, Multiple>
  defaultValue?: SelectValue<Value, Multiple>
  onValueChange?(value: SelectValue<Value, Multiple>): void

  // existing props, made conditional where they receive the selected value
  renderValue?(value: SelectValue<Value, Multiple>): React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  native?: NativeValue<'web'>
  // ...existing Select props

  // web form ownership. They are inert on React Native.
  name?: string
  form?: string
}

export const Select: <
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>(
  props: SelectScopedProps<SelectProps<Value, Multiple>>,
) => React.JSX.Element
```

Examples:

```tsx
const [fruit, setFruit] = React.useState<'apple' | 'pear'>('apple')
const [fruits, setFruits] = React.useState<Array<'apple' | 'pear'>>(['apple'])

<Select value={fruit} onValueChange={setFruit}>{/* ... */}</Select>

<Select
  multiple
  name="fruit"
  value={fruits}
  onValueChange={setFruits}
  renderValue={(values) => values.join(' + ')}
>
  {/* ... */}
</Select>
```

`multiple` defaults to `false`. An uncontrolled multiple Select initializes to
`[]`; its single-select counterpart retains the current empty-string behavior.
The public type does not accept `null` for either mode in this packet.

`Select.Item` remains string-valued. C3's item registry determines its
collection order, so new code must not rely on the current mandatory `index`
prop. The C3 migration can retain `index` as a compatibility input only if the
v3 migration needs it; it must not be the source of truth for selection,
keyboard order, or typeahead.

### Value and indicator rendering

`Select.Value` has the following precedence in multiple mode:

1. `children`, when explicitly supplied, stays fully user-owned as it does
   today.
2. Root `renderValue(values)` receives the ordered `string[]` and replaces the
   default output. This is the required SSR and lazy-mount escape hatch when a
   label cannot be registered yet.
3. The default renders the registered `Select.ItemText` contents for each
   selected value, in array order, with `, ` between entries. A value whose
   item text is not mounted falls back to that raw string.

The selected-label registry replaces the current single `selectedItem` slot.
It is populated by `Select.ItemText`, so rich item labels continue to work
without introducing `items`. When `lazyMount` defers the items, callers that
need labels before first open must provide `renderValue`, exactly as current
SSR guidance already recommends.

`Select.ItemIndicator` is a mechanical selected-state part. It is rendered
for every selected item, not only the most recently selected item. On custom
web, adapted Sheet, and React Native paths it mounts from membership in the
selected array and unmounts when that membership ends. It remains absent inside
the web-native `<select>` because the browser owns option selection visuals.
C3's state surface should expose the same selected boolean to an Item skin
even when no indicator is rendered.

### Form submission

`name` opts a Select into web form participation and `form` associates it with
an external HTML form. Form serialization is one value per successful form
control, with the original `name` repeated:

```text
name=apple&name=pear
```

| Render path | Form control |
| --- | --- |
| Floating custom web Select | One root-level `<input type="hidden">` for each selected value. |
| Web Select adapted to a Sheet | The same root-level hidden inputs. The Sheet portal must not change form ownership. |
| `native="web"` | The actual `<select name form multiple>` owns submission. Do not also render hidden inputs. |
| React Native | No DOM form controls. A later Field package may consume the same value controller. |

For consistency, the custom single-select path should emit one hidden input
when `name` is supplied as part of the same change. It closes an existing form
gap and keeps `name` from having mode-dependent meaning. Native Select uses
the browser's native submission behavior for both modes.

Object serialization is deliberately outside this proposal. It requires the
future `itemToStringValue` companion to any label helper. Serializing an
object through `String(value)` would produce unstable and ambiguous form data.

## Cross-platform behavior matrix

The root selection controller is the authority in every custom path. `active`
is keyboard or pointer focus and `selected` is membership in the value array;
they must remain separate. The selection anchor used when a list opens is the
last selected value that still exists in the item registry. With no selection,
it is the first enabled item.

| Path | Selection and visuals | Semantics | Selecting an item | Keyboard and typeahead | Dismissal and forms |
| --- | --- | --- | --- | --- | --- |
| Web floating listbox | `Select.Item` toggles membership. Every selected item has `aria-selected="true"` and may show its indicator. The list stays positioned against the trigger using the selection anchor. | Trigger stays a combobox. The visible collection is `role="listbox"` with `aria-multiselectable="true"` in multiple mode; each enabled item is `role="option"`. | Pointer click, Enter, and Space toggle the active item. They do not call `setOpen(false)` in multiple mode. Focus stays on that item and the list stays visible. | Arrow keys only move active focus. Typeahead only moves active focus while open. It does not select or close. Escape, outside press, and trigger press still close normally. | Closing returns focus to the trigger through C3's focus behavior. Custom forms receive repeated root-level hidden inputs. |
| Web native `<select multiple>` (`native="web"`) | The browser renders selected options. `Select.ItemIndicator` is not rendered. React `onChange` reads `selectedOptions` in DOM order and calls `onValueChange(string[])`. | Native HTML `<select multiple>` and `<option selected>` semantics are authoritative. No redundant custom listbox or `aria-multiselectable` is emitted. | Browser-native toggle behavior applies, including platform modifier-key conventions. The Select root does not own an open popup for this path. | Browser-native keyboard and typeahead behavior applies. Tamagui does not intercept these events or promise parity with every browser's native control. | The `<select>` receives `name` and `form` directly and submits its selected options. No hidden inputs are rendered. |
| Web Select adapted to a Sheet | The same selection controller toggles item membership and indicators. The adapted viewport keeps a real listbox wrapper instead of losing semantics while portaled into `Adapt.Contents`. | On web it retains `role="listbox"`, `aria-multiselectable="true"`, and option states inside the Sheet. | Click, Enter, and Space toggle and leave the Sheet open. This is the critical mobile-web difference from single Select. | C3 must use the shared collection and typeahead controller here too. Hardware keyboard users get the same active-item, Arrow, Enter, Space, and typeahead behavior as floating web. | Sheet dismissal is owned by the configured Sheet: overlay press is enabled by default, `dismissOnSnapToBottom` closes when configured, and a controlled Sheet can close it. Its `onOpenChange(false)` flows through Adapt to Select. No default Done control is injected. Custom web forms use repeated hidden inputs at the Select root. |
| React Native adapted to a Sheet | Pressing an item toggles membership and updates all selected indicators without dismissing the Sheet. Items use native selected-state accessibility rather than web ARIA. | In multiple mode, expose each item as an accessible checkbox with its checked and disabled state. The trigger exposes its expanded state through React Native accessibility props. | `onPress` toggles the item. The selected value order follows the root controller. | There is no DOM keyboard or typeahead contract on the React Native Sheet path. Hardware-key support can be added only through the RN focus system in a future dedicated packet. | The Sheet's existing overlay dismissal, drag-to-bottom when configured, and platform back behavior close Select through Adapt. Values remain selected after dismissal. There are no HTML form inputs. |
| Pure React Native, no Adapt target | The inline Select viewport uses the same controller. Pressing an item toggles its indicator and leaves the viewport open. | Use the same React Native checkbox selected-state accessibility as the adapted RN Sheet. | `onPress` toggles. Pressing the trigger again or changing controlled `open` closes the inline viewport. | No browser keyboard or typeahead behavior exists on this path. | There is no implicit sheet and no HTML form behavior. The author controls closing through the trigger or root `open`. |

The web native path intentionally has browser-owned interaction semantics. The
other three paths share the component's selection semantics, even though their
presentation and accessibility APIs differ.

### Sheet completion model

A multi-select cannot auto-dismiss after every selection. A baked "Done" row
would be a skin decision and would fail to compose with existing application
Sheets. The default model is therefore:

1. Every item toggle leaves the Select and its Adapt target open.
2. The existing Sheet owns completion through overlay dismissal, a configured
   drag-to-bottom gesture, platform back, or the application's controlled
   `open` state.
3. Values commit immediately on each toggle. Closing does not stage, rollback,
   or re-emit them.

An application that needs an explicit Done button can place one in its own
Sheet composition and close its controlled Select. If C3 needs a declarative
bridge for that button, add a behavior-only `Select.Close` primitive later;
do not make a visible footer part of the Select package.

## Behavior mechanics

The C3 behavior layer should use one ordered collection registry and one
selection controller. It needs these operations:

- `isSelected(value)` with direct string equality for this packet;
- `toggle(value)`, which appends or removes while preserving the remaining
  array order;
- `activeItem`, `selectionAnchor`, first-enabled lookup, and disabled-item
  skipping;
- label registration from `Select.ItemText` for `Select.Value`'s default
  output;
- an event policy that makes single selection commit and close, while multiple
  selection toggles and remains open;
- a platform adapter interface for custom DOM listbox, native `<select>`, and
  React Native press/accessibility props.

Use the selected array as the source of truth. Do not infer selected state from
the current `selectedIndex`: multiple selected items make that index inherently
ambiguous, and the current index is also used by floating positioning.

On close and next open, recompute the selection anchor from the last value in
the selected array that matches a registered item. A controlled array with an
unknown string remains controlled, displays that raw string through
`Select.Value` if needed, and does not create a fake selected option. This is
the same safe behavior needed when a dynamic item disappears.

The C3 collection must carry disabled state and a normalized typeahead label.
`textValue`, currently accepted but unused by `Select.Item`, becomes the
explicit string used for typeahead. If it is absent, use the registered
`Select.ItemText` text content. The list never selects a match merely because
typeahead found it while open.

## Why object values and `items` wait for Combobox

Base UI's Select combines several related features:

- `items` resolves labels for `Select.Value` from a record, flat array, or
  grouped data;
- `itemToStringLabel` supplies a display label for an object value;
- `isItemEqualToValue` replaces reference equality;
- `itemToStringValue` serializes object values for forms;
- multiple selection uses equality for membership, removing values, and
  selecting an anchor.

Those are a useful reference, especially the small `itemEquality` and
`resolveValueLabel` helpers. They are insufficient as a copy target for
Tamagui by themselves. Our implementation must also map the same value through
four presentation paths, including `<option value>` and React Native. Object
values need a stable string serializer for native DOM option values and form
submission, a reverse lookup from a DOM string to the selected object, and
SSR-stable label lookup. Equality must be used consistently by selected state,
toggle removal, selection anchors, native option lookup, and label resolution.

Combobox already needs that machinery for filtering, virtual focus,
virtualization, chips, groups, form/autofill, object values, and multiple
selection. `plans/base-ui-comparison.md` section 5 ranks it as the first
post-beta pure-v3 behavior component for this reason. Giving Select a small
private version now would leave a second equality, label, and serialization
system in the repository.

Recommendation:

- C3 Select ships `multiple` for strings only and uses direct string equality.
- C3 retains `renderValue` as the explicit label escape hatch for manual
  string items, SSR, and lazy mounting.
- The later Combobox packet introduces one generic internal selection utility
  package. At that point, Select adopts the same item registry and may add
  `items`, `itemToStringLabel`, `itemToStringValue`, and
  `isItemEqualToValue` together.

The future public object API should include `itemToStringValue`; adding only
the three names in this packet would leave native `<select>` and form data
undefined. It should accept both a value-to-label mapping and explicit item
rendering without two competing sources of truth. That API design belongs with
the shared Combobox registry.

## Sequencing with C3

Land this **with C3**, after its behavior extraction exists and before its
acceptance gate is declared complete. Do not land a current-code multiple
patch before C3, and do not close C3 with a single-only controller that has to
be reworked immediately afterward.

Suggested order:

1. C3 establishes the behavior-owned item registry, active focus, positioning
   anchor, root open/value controller, floating adapter, Adapt/Sheet adapter,
   React Native adapter, and web-native adapter. The internal controller has a
   `mode: 'single' | 'multiple'` shape from its first commit.
2. C3 implements the existing single-select public contract against that
   controller. This preserves a narrow migration checkpoint.
3. Add the public `multiple`, conditional value types, label registry,
   native `<select multiple>`, and repeated form entries. All C3 acceptance
   suites then run in both modes where relevant.
4. Apply C3's skin split. Item selected state and ItemIndicator behavior stay
   with the behavior parts; colors, checkmarks, spacing, and a Sheet footer
   remain copied application skins.
5. After C3 is stable, Combobox owns the generic object-value expansion and
   Select consumes it. It is a new capability packet, not a C3 blocker.

This sequence keeps one selection engine during the decomposition. It avoids
teaching the legacy `SelectItemParentContext` a second selection model only to
delete it when C3 moves item registration and presentation out of that
context.

## Implementation plan and file touchpoints

The names below identify the current sources that must be migrated. C3 may
move their behavior into new behavior-part modules, but each responsibility
must have one final owner.

| Area | File touchpoints | Required change |
| --- | --- | --- |
| Public root types | `code/ui/select/src/types.tsx`, `code/ui/select/src/Select.tsx`, `code/ui/select/src/index.tsx` | Add the conditional `multiple` generic, `name`, `form`, and conditional `renderValue`. Carry mode and typed selected values through the C3 root context. Export the final public types. |
| Selection controller and registry | C3's new Select behavior module, replacing the selection portions of `context.tsx` and `Select.tsx` | Create one registry for ordered items, enabled state, typeahead labels, and rendered labels. Create one single/multiple controller with membership, toggle, active item, and anchor operations. Remove the current single `selectedItem` state and single-value equality assumptions. |
| Custom floating web | `code/ui/select/src/SelectImpl.tsx`, `SelectViewport.tsx`, `SelectContent.tsx`, `SelectTrigger.tsx` | Keep floating geometry, focus scope, and click-hold behavior. Give the collection a listbox wrapper with `aria-multiselectable` in multi mode. Make Enter, Space, click, Arrow, and typeahead use the shared controller. A multi toggle must never close the popup. |
| Items and default value labels | `code/ui/select/src/SelectItem.tsx`, `SelectItemText.tsx`, `Select.tsx` (`Select.Value` and `Select.ItemIndicator`) | Convert per-item selection to membership. Make Indicator mount for every selected item. Register item text by value so Value can render ordered selected labels. Make `textValue` functional for typeahead. |
| Web native select | `code/ui/select/src/Select.tsx` (`SelectGroup` native branch), `SelectItem.tsx` | Pass `multiple`, `name`, `form`, and array `value` to the native `<select>`. Collect `Array.from(event.currentTarget.selectedOptions, option => option.value)` on change. Mark native `<option>` selected from array membership and omit custom indicator/listbox behavior. |
| Web forms | `code/ui/select/src/Select.tsx` or a C3-owned web-only form-input module | Emit one hidden input per selected string for custom web modes. Suppress those inputs whenever the native `<select>` path is selected. Attach inputs at the Select root so an Adapt portal cannot move them outside the owning form. |
| Adapt to Sheet | `code/ui/select/src/Select.tsx` (`SelectSheetImpl`), `SelectContent.tsx`, `SelectViewport.tsx`, `context.tsx` | Preserve `AdaptParent` as the single open-state handoff. Portaled content must retain the collection semantics and web keyboard adapter when it lands in `Adapt.Contents`. Item toggles leave root open; Sheet close still reaches root through `useAdaptTarget`. Preserve the current exit-presence rule that keeps content mounted until `targetFullyHidden`. |
| Pure React Native | `code/ui/select/src/SelectImpl.native.tsx`, `SelectViewport.native.tsx`, `SelectContent.native.tsx`, `SelectItem.tsx` | Replace the inline implementation TODO with the same controller and RN press/accessibility adapter. With no active Adapt target, keep content inline and let trigger/controlled open state close it. Do not create a web-only hidden input or DOM keyboard fallback. |
| Shared context forwarding | `code/ui/select/src/context.tsx`, `types.tsx`, `SelectViewport.native.tsx` | Forward the complete controller and label registry across legacy portal boundaries. Teleport and legacy portal paths must observe identical selected membership and selected labels. |
| Skins | C3's copied kitchen-sink and demo Select skins, current style definitions in `Select.tsx`, `SelectItem.tsx`, `SelectViewport.tsx`, `SelectItemText.tsx`, and `SelectTrigger.tsx` | Move visual defaults out according to C3. Retain structural roles, focusability, state props, and selection mechanics in behavior. Do not add a default Done footer or a visual multiple-only skin. |

Before coding, grep every `SelectProps`, `Select.Item`, `renderValue`, and
`native` caller. The generic change affects both the sender of `value` and
every receiver of `onValueChange`; demos and kitchen-sink use cases must be
made explicit about their single or multiple mode.

## Test plan

Add a focused `SelectMultipleCase` kitchen-sink use case with four fixtures:
floating custom web, `native="web"`, forced Adapt-to-Sheet, and plain React
Native without `Adapt`. The case should display its selected array and a form's
`FormData` entries so browser tests can assert values without relying only on
visual labels. Use labels that differ from values to exercise `ItemText`
registration.

### Type and behavior coverage

- Add package type fixtures proving `multiple` requires `string[]` for
  `value`, `defaultValue`, `onValueChange`, and `renderValue`; prove the
  single path remains scalar. Include a literal `multiple={false}` and a
  runtime boolean case.
- Add a controller-level test for append, removal, order preservation,
  duplicate prevention, disabled-item skipping, selection-anchor selection,
  and controlled values that no longer exist in the registry.
- Preserve the current single-select keyboard, focus, typeahead, positioning,
  click-hold, and Adapt exit-presence suites. Run their equivalent multi cases
  against the shared behavior engine.

### Web floating Playwright

- Verify a listbox has `aria-multiselectable="true"`, each item has the right
  `aria-selected`, and two ItemIndicators are visible after two selections.
- Click two items and assert the popup remains open, the active item remains
  focused, and the rendered value lists both labels in selection order.
- Use Arrow keys, typeahead, Space, and Enter. Arrows and typeahead only move
  focus; Space and Enter toggle; neither toggle closes the list.
- Verify Escape, outside press, and trigger press close and restore focus to
  the trigger without rolling back the array.
- Submit an in-tree form and an external form associated with `form`. Assert
  `FormData.getAll(name)` is the ordered selected array and no duplicate hidden
  entries appear after repeated toggles.
- Re-run the existing click-hold cases in multiple mode. A genuine drag and
  release toggles one item and leaves the list open; the opening mouse-up guard
  still prevents an accidental toggle.

### Web native `<select multiple>` Playwright

- Assert that the native control is a `<select multiple>` with options and no
  custom Trigger, listbox, ItemIndicator, or hidden inputs.
- Select two options through the DOM control and assert the root receives the
  complete string array in DOM order.
- Submit a form and assert repeated values from the native control. Cover an
  external `form` owner as well.
- Run in Chromium and WebKit. Browser-native keyboard and typeahead behavior
  is deliberately not asserted as identical across engines.

### Adapt-to-Sheet web Playwright

- Force `Adapt when={true}` at a touch-sized viewport. Toggle two items and
  assert the Sheet, its listbox, and both indicators remain attached and
  visible.
- Use a hardware keyboard while the Sheet is open to prove Arrow, typeahead,
  Space, and Enter use the same controller as floating web.
- Dismiss through the Sheet overlay and through `dismissOnSnapToBottom` in a
  fixture that enables it. Assert root `open` becomes false, both values
  remain, and the existing `targetFullyHidden` exit test continues to keep
  adapted content mounted through the slide-out.
- Assert repeated form entries while the collection is portaled into
  `Adapt.Contents`.

### React Native and native Sheet Detox

- Add a plain-RN fixture with no `Adapt`. Tap two item test IDs, assert both
  visual indicators and the displayed selected array, then tap the trigger to
  close it. Verify that it did not auto-close after either toggle.
- Add an Adapt-to-Sheet fixture on iOS and Android. Tap two items, assert the
  Sheet remains open and both selections are visible, then dismiss via the
  supported Sheet action and re-open to confirm state persists.
- Cover the existing Android `onPress` regression path with multiple mode so
  the physical-device failure cannot return. The test must verify each tap
  changes the array and leaves the Sheet open before the final dismissal.
- Assert React Native accessibility state for selected multi items using the
  platform's accessibility inspection where the Detox driver exposes it.

Capture web and native screenshots for the new fixture after implementation.
The screenshots should use two different C3 skins to prove the behavior is not
coupled to the old Select visual defaults.

## Open questions for coordinator review

1. Is the Sheet's standard dismissal model sufficient for multi-select, or
   should C3 also expose a behavior-only `Select.Close` primitive for an
   application-owned Done button? The recommendation is to ship no default
   Done UI.
2. Should v3 remove the public required `Select.Item index` prop during C3, or
   retain it as a deprecated migration compatibility prop while the registry
   becomes authoritative? The recommendation is to remove it from new docs and
   make registry order authoritative.
3. Is `name` plus `form` the approved initial web form surface, with
   `required`, `disabled`, autofill, and Field context deferred to the Field
   packet? The recommendation is yes. A root-level disabled contract should
   arrive with that Field work instead of guessing from `Select.Trigger`.
4. Is comma-plus-space the desired default `Select.Value` separator for
   multiple labels? The recommendation is yes, with `renderValue` for chips,
   localization, count summaries, and any richer display.
5. Does the owner accept browser-native multi-select behavior for
   `native="web"` as the explicit platform contract? The recommendation is
   yes. Replacing it with a simulated menu would defeat the native path.

## Sources read

- `plans/base-ui-comparison.md`, sections 5 and 6
- `plans/v3-evolution.md`, C3
- Current Tamagui Select implementation in `code/ui/select/src/`, including
  native files and current kitchen-sink web, Sheet, and Detox coverage
- Base UI Select source under `~/github/base-ui/packages/react/src/select/`,
  especially its root, item, value, list, and native form behavior
- Base UI `internals/itemEquality.ts` and `internals/resolveValueLabel.tsx`
