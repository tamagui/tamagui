# Base UI vs Tamagui v3: comprehensive gap analysis

2026-07-16. Compared `mui/base-ui` at `c5ab168` (latest main, ~1.6.0) against
`v3-beta`. Method: four parallel deep-reads (base-ui architecture, base-ui-only
components, tamagui v3 component state, per-component API diffs), synthesized
against the locked contracts in `plans/v3-evolution.md` and
`plans/v3-animation-api.md`. Base UI reference clone: `~/github/base-ui`.

The v3 plan already concedes the big architectural point: components must
become behavior primitives with user-owned skins. Base UI is a shipped,
production-hardened version of exactly that thesis (minus styling, native, and
responsiveness, which they punt on entirely). So this is less "should we copy
them" and more "they've published the answer key for the part of v3 we haven't
built yet." The gaps below are ranked by how much they matter for v3,
especially tailwind mode.

---

## 1. The gap that tailwind mode makes urgent: no uniform state → styling contract

This is the single most important finding.

Base UI's entire styling story is: every part computes a `state` object, and
one shared emitter (`internals/getStateAttributesProps.ts`) turns it into
`data-*` attributes with a per-part documented enum (`*DataAttributes.ts`).
Uniform vocabulary everywhere: `data-open`, `data-closed`, `data-checked`,
`data-pressed`, `data-popup-open`, `data-highlighted`, `data-dragging`,
`data-valid`/`data-invalid`/`data-touched`/`data-dirty`/`data-filled`,
`data-side`/`data-align`, plus the animation pair `data-starting-style` /
`data-ending-style`. `className` and `style` on every part also accept
`(state) => ...` callbacks.

Tamagui today: state reaches styles as variant props (`open`, `checked`)
resolved by `styled()`, and `data-*` emission is a secondary, web-only,
per-package afterthought with inconsistent Radix-legacy vocabulary
(`data-state="open|closed"` vs `"on|off"` vs `"active|inactive"` vs
`"checked|unchecked"`, each via a local `getState` helper).

Why tailwind mode changes the calculus: a className-first authoring surface
styles state through selectors. Tailwind users write
`data-[open]:opacity-100`; Base UI users write `[data-open]{...}`. If
`styleMode: 'tailwind'` is the headline of v3 but component state is only
reachable through variant props, the two halves of the product don't compose.
The skins the C lanes produce should be writable as class strings
(`plans/v3-evolution.md` already requires static class strings in `styled()`),
and class strings need state selectors.

Tamagui can actually beat Base UI here, because our grammar is a compiler and
runtime, not just CSS:

- Standardize the state vocabulary once (adopt Base UI's discrete-attribute
  naming: `data-open`, `data-checked`, `data-pressed`, `data-highlighted`,
  `data-disabled`, `data-invalid`, ...) and emit it from one shared helper in
  core instead of per-package `getState` functions.
- Add the same names as first-class modifiers in `@tamagui/style-grammar`
  (packet A0 owns modifier parsing already): `open:bg-color3`,
  `checked:border-color9`, `invalid:border-red9`. On web these compile to
  `[data-open]` selectors; on native they resolve against the same state as
  variant props. Base UI cannot do the native half. This makes the state
  contract cross-platform, which no one else has.
- Document per-part attributes the way Base UI does (their `*DataAttributes.ts`
  enums are the docs source of truth); our grammar table generator (A0 item 4)
  is the natural home.

Concrete proposal: add a small packet alongside C4 ("state attribute
unification") that lands the shared emitter + vocabulary before the component
sweep rewrites each package, so the sweep applies it mechanically.

## 2. Animation lifecycle: they detect, we guess (lane H should copy the mechanism)

Base UI's animation system is three small hooks with zero timers:

- `useTransitionStatus(open)` → `'starting' | 'ending' | 'idle'`, surfaced as
  `data-starting-style` / `data-ending-style`. Pure CSS transitions and
  keyframes hang off those two attributes.
- `useAnimationsFinished(ref)` → `Promise.all(element.getAnimations().map(a =>
  a.finished))`, then `ReactDOM.flushSync` to unmount before the next paint. A
  `MutationObserver` on `data-starting-style` handles the
  wait-for-enter-styles-to-register frame.
- `useOpenChangeComplete` → drives the public `onOpenChangeComplete(open)` and
  unmount-after-exit. JS animation libraries integrate via
  `eventDetails.preventUnmountOnClose()` + `actionsRef.current.unmount()`.

Tamagui's css driver fakes completion with
`setTimeout(onFinish, duration || 300)`
(`code/core/animations-css/src/createAnimations.tsx:167`), which cascades into
Sheet's 1000ms `opacityFallbackTimer` and Adapt's 3000ms exit latch. Lane H
(H3) already plans a real ticker; it should adopt `getAnimations()` completion
detection for the css driver instead of (or in addition to) a spring ticker,
because it is exact, handles user-authored CSS transitions, and deletes every
safety timer.

The bigger prize for tailwind mode: emit `data-starting-style` /
`data-ending-style` from our presence system. Then a tailwind-mode user
animates a popover with pure classes
(`transition-all data-starting-style:opacity-0 data-ending-style:opacity-0`)
and never touches an animation driver. `enterStyle`/`exitStyle` remain the
prop-form equivalent; the attributes are the class-form equivalent. This also
gives the C-lane copied skins a CSS-only animation story, which matters since
lane H removes baked component fades.

## 3. Callback API: we lose information Base UI preserves

Every Base UI change callback is `(value, eventDetails)` where `eventDetails`
carries a closed `reason` vocabulary (~40 kebab-case constants:
`trigger-press`, `trigger-hover`, `outside-press`, `escape-key`, `focus-out`,
`item-press`, `imperative-action`, ...), the native `event`, `cancel()` /
`isCanceled` (callbacks can veto the change), and per-component extras
(`preventUnmountOnClose()`). Plus `onOpenChangeComplete` and an `actionsRef`
(`{ close(), unmount() }`) on every popup.

Tamagui callbacks are almost all single-argument. The closest analog is
Popover's `onOpenChange(open, via?: 'hover' | 'press')`. Nothing is cancelable;
consumers who need "why did this close" or "block close when X" resort to
preventDefault on three separate interaction props (`onPointerDownOutside`,
`onEscapeKeyDown`, `onInteractOutside`).

v3 is a breaking release; this is the one chance to adopt
`onOpenChange(open, details)` / `onValueChange(value, details)` shapes across
the fleet cheaply. It also cleans up real internal warts: the dialog/adapt
animation reporters and Sheet's `shouldHideParentSheet` plumbing are ad-hoc
versions of `onOpenChangeComplete`. Recommend: define one
`TamaguiChangeEventDetails` in core (reason + event + cancel), apply it during
the C4 sweep, and wire `onOpenChangeComplete` off the lane-H `onTransition`
lifecycle so the two land as one system.

## 4. Form/Field: our biggest functional hole

`code/ui/form/src/Form.tsx` is 87 lines: intercept submit, call a
zero-argument `onSubmit()`. No fields, no values, no validation, no errors, no
touched/dirty, nothing. Slider's hidden-input form participation is commented
out (`name` is accepted and dead). Checkbox/switch/radio bubble inputs exist
but there is no validation layer above them.

Base UI's field system is its deepest asset and the part least entangled with
web-only tech:

- `Field.Root/Control/Label/Error/Description/Validity/Item` +
  `Fieldset.Root/Legend` + `Form`.
- `validate(value, formValues)` sync or async, `validationMode:
  onSubmit | onBlur | onChange` (onSubmit revalidates on change after first
  submit attempt), debounce, monotonic commit ids to drop stale async results.
- Native `ValidityState` integration with a tri-state `valid: true|false|null`
  (null = pristine; load-bearing so pristine fields are never styled or
  announced as invalid), `valueMissing` suppressed until dirtied,
  `setCustomValidity` mirroring.
- Every control auto-integrates by consuming field context: name, disabled,
  `aria-invalid`, `aria-describedby` composed from Description + Error ids,
  `data-valid/invalid/touched/dirty/filled/focused` on every part.
- `Form errors={serverErrorsByName}` is the whole server/react-hook-form
  story; errors clear as the user edits; submit focuses first invalid.

This is the ideal flagship new behavior package for the v3 thesis: a Field is
almost pure behavior (state machine + aria wiring + registration), the skin is
trivially user-owned, and it multiplies the value of every input-like
component we ship. Cross-platform note: keep the validation state machine
platform-neutral in JS, treat DOM `ValidityState` as a web-only enrichment.
The tri-state `valid` and "async validators never block submit" decisions
should be copied as-is.

Recommend: post-beta packet, but design the C3/C4 control surfaces (checkbox,
switch, radio, input, select, slider) to consume a field context from day one
so the field package lands without a second sweep.

## 5. Missing components, ranked by leverage

Non-test LOC from base-ui as the effort signal. Shared machinery gates most of
these: their `internals/composite` (one roving-focus/DOM-order registry, 1.4k
LOC) plus `itemEquality` / `resolveValueLabel` / `filter` utilities. We have
`@tamagui/roving-focus` + `@tamagui/collection` already; they cover similar
ground but per-package. Consolidating ours into one composite primitive makes
the small components nearly free.

| Component | LOC | Notes |
| --- | --- | --- |
| combobox + autocomplete | 6188 + 707 | The biggest gap and most-requested modern primitive. One engine (`AriaCombobox`): single/multiple/none selection, `Intl.Collator` filtering, virtualization support, chips (multi-select tokens), virtual focus via `aria-activedescendant`, grid mode, form/autofill. Autocomplete is a thin re-export layer over it. Their select also shares its value/label/equality machinery, which would give our select `multiple` + object values on the way through. |
| number-field | 2757 | Steppers with press-and-hold, pointer-lock scrubbing with virtual cursor, full `Intl.NumberFormat` parse/format, wheel, min/max/step/largeStep. Frequently requested; pairs with Field. |
| navigation-menu | 3056 | Shared viewport that morphs size/position between items (`--positioner-width/height` + ResizeObserver), `data-activation-direction`. Marketing-site staple; strong fit for tamagui.dev itself. |
| scroll-area | 1684 | Native scroll preserved, overlay scrollbar parts, data-attribute driven. We have RN ScrollView; a web scroll-area with styleable scrollbars is a different product and pairs well with tailwind mode. |
| checkbox-group | 407 | Cheap. The parent tri-state ("select all") state machine is the value. |
| otp-field | 1322 | Roving slots, paste normalization by code points, `autoComplete="one-time-code"`, auto-submit. Cheap-ish, high perceived value, very native-relevant (SMS codes). |
| meter | 330 | Trivial next to Progress. |
| toolbar / menubar | 620 / 217 | Almost entirely thin bindings over the composite primitive; nearly free once composite is consolidated. Menubar reuses the menu engine. |
| preview-card | 1355 | Hover link-preview card; mostly popover + delays + inline-rect anchoring. Low priority. |
| field/fieldset/form | 1982 | Covered in §4. |
| drawer | 4581 | We have Sheet, which is stronger (native gestures, keyboard controller, safe areas, Adapt integration). Steal ideas instead of porting: their snap-point API accepts fractions, px numbers, and CSS length strings; `SwipeArea` (drag a closed drawer open from an edge); `Indent` (iOS scale-back background effect); nested-drawer stacking with progress vars; `CloseWatcher` for Android back gesture on web. Good input to C2. |

Suggested order given v3: combobox first (post-beta, built as the first
pure-v3-contract component: behavior parts + copied class-string skin, no
factory, no unstyled). It dogfoods the composite primitive, the state
attributes, the field context, and tailwind skins all at once. Then
number-field + otp-field + checkbox-group (they ride the Field system),
then toolbar/menubar/meter as cheap wins, then navigation-menu, scroll-area.

## 6. Per-component feature gaps (both directions)

Where Base UI is ahead, per component:

- **Dialog**: nested-dialog counting (escape/outside-press only on topmost,
  `--nested-dialogs` var), `modal: 'trap-focus'` third mode, declarative
  `initialFocus`/`finalFocus` (touch-aware), `actionsRef`,
  `onOpenChangeComplete`, detached-trigger `Handle` + typed `payload`.
- **Select**: `multiple` (typed `Value[]`, per-value hidden inputs,
  `aria-multiselectable`), `items` prop with object values +
  `itemToStringLabel`/`isItemEqualToValue`, field/autofill integration. Ours
  is single-string-only.
- **Menu**: `LinkItem`, detached `Handle`/`triggerId`, menubar integration,
  typed select reasons. Ours: zeego native menus, `indeterminate` checkbox
  items, structured `ItemTitle/Subtitle/Icon/Image` slots.
- **Slider**: scalar value mode (ours is always `number[]`), thumb collision
  `push|swap|none`, configurable `largeStep`, `Value`/`Label` parts with
  `Intl` formatting, a real focusable `<input type=range>` per thumb (native
  aria + forms), `onValueCommitted`. Our form participation is dead code and
  keyboard is web-only.
- **Tabs**: built-in `Indicator` part with `data-activation-direction`,
  auto-fallback off disabled/removed tabs. Ours exposes `onInteraction` +
  layout for hand-rolled indicators (works on native; keep it, add the part).
- **Accordion/Collapsible**: `hiddenUntilFound` (find-in-page via
  `hidden="until-found"` + `beforematch`), `keepMounted`, measured
  `--collapsible-panel-height` for pure-CSS height transitions. Ours keeps
  arrow-key roving focus (they deprecated it per updated APG; fine to keep)
  and animates height natively.
- **Tooltip**: `trackCursorAxis` (cursor following), `disabled` prop,
  hoverable-popup default. Ours: scroll-to-close, `TooltipSimple`, delay
  groups (parity), but native tooltip renders nothing.
- **Toast**: anchored toasts (Positioner/Arrow), `priority: low|high` aria
  model, F6 viewport focus, richer pause/resume state machine. Ours: two
  overlapping public APIs (Radix-style v1 + Sonner-style v2) need a
  consolidation decision for v3; native burnt toasts are a real advantage.
- **Checkbox/Switch/Radio**: `readOnly`, `uncheckedValue`, group parent
  tri-state, field validity attributes.
- **Progress**: `min` prop, `Intl.NumberFormat` value formatting,
  `Track/Value/Label` parts.

Bugs/small gaps found during this review (fix regardless of the rest):

1. Tabs: JSDoc says `activationMode` defaults to `automatic` but code defaults
   to `'manual'`, and auto-activation is silently web-only
   (`code/ui/tabs/src/createTabs.tsx` ~line 278).
2. Separator has no `role="separator"` / `aria-orientation` /
   `data-orientation` (`code/ui/separator/src/Separator.tsx`).
3. Slider `name` prop is accepted but dead (BubbleInput commented out).
4. `code/ui/switch/src/Switch.draggable-tmp` is abandoned WIP with leftover
   `console.log`s; `tabs-headless` is orphaned (zero consumers, logic
   duplicated in styled tabs). Delete or adopt during C4.
5. Avatar fallback prop is `delayMs` vs the ecosystem's `delay`.
6. Popover `aria-controls` TODO at `code/ui/popover/src/Popover.tsx:406`.

## 7. Cross-cutting mechanisms worth stealing outright

- **`mergeProps` semantics** (`merge-props/mergeProps.ts`): rightmost wins,
  className concatenated, styles deep-merged, event handlers chained
  right-to-left with `event.preventBaseUIHandler()` so a consumer can cancel
  the library's own handler per-event without re-implementing behavior. Our
  headless hooks and behavior parts need exactly this contract; today prop
  composition is ad hoc per package.
- **Focusable-when-disabled** (`aria-disabled` over native `disabled` so
  disabled items stay in the a11y tree and roving order).
- **Scroll lock** (`packages/utils/src/useScrollLock.ts`): ref-counted
  singleton, `scrollbar-gutter: stable` when available, iOS/pinch-zoom
  special cases. Ours delegates to `remove-scroll`; theirs handles cases ours
  reparents around (see the RemoveScroll reparent TODOs in dialog/popover).
- **VoiceOver+WebKit focus guards** that flip to `role=button` and drop
  `aria-hidden` (VO virtual-cursor trap), IME-aware escape handling,
  `markOthers` ref-counted inert isolation for stacked modals.
- **Conformance test harness**: `describeConformance` (render prop, ref
  forwarding, className merging identical across all parts) and
  `popupConformanceTests` (controlled/uncontrolled, `aria-expanded`/
  `aria-controls`/`aria-haspopup`, unmount-when-no-exit-animation,
  unmount-when-animation-finishes) run against every popup component. Given
  our per-driver skipped-test debt in kitchen-sink, one shared conformance
  suite for our popup fleet is the cheapest quality multiplier available, and
  it's the natural acceptance harness for the C4 sweep.
- **CSP story**: `CSPProvider` nonce for injected styles. We inject styles
  too; worth a pass.

## 8. Where we are ahead (protect these in the C lanes)

- **Cross-platform everything**: base-ui is React-DOM-only, full stop. Every
  argument for tamagui runs through this.
- **Adapt → Sheet**: no base-ui analog at all. Dialog/Popover/Select morphing
  into a native-feeling sheet on mobile is the single most differentiated
  feature; C2/C3 must keep it working through the decomposition.
- **Real native integrations**: zeego iOS/Android menus + context-menu
  Preview/Auxiliary, burnt OS toasts, RN `<Switch>`, RN `Alert.alert`, Sheet
  keyboard-controller/safe-area/gestures, slider RN responder gestures.
- **Styling system itself**: tokens, themes, variants, compiler, and now the
  tailwind grammar. Base UI ships zero styling; every base-ui user
  hand-builds what our C-lane skins will provide as copy-paste.
- **Popper**: batched `tamaguiAutoUpdate` (no per-element ResizeObserver
  churn), anchor-size CSS vars (parity with base-ui), cross-platform
  floating-ui fork with RN positioning.
- **Hoverable popovers** with safe-polygon grace, imperative
  `anchorTo(rect)`, global close helpers.

Positioning summary: Base UI is the best web-only headless kit; our defensible
position is "the same rigor, cross-platform, with the styling system and
responsive adaptation built in." The v3 plan already points there; the gaps in
§§1–4 are what's between us and credibly claiming the "same rigor" half.

## 9. Recommendations mapped to the v3 plan

Amendments to existing lanes (small, high leverage, breaking-window-bound):

1. **A0/state**: add the unified state-attribute vocabulary + shared emitter,
   and claim state modifiers (`open:`, `checked:`, `invalid:`, ...) in the
   grammar registry so class-string skins can style state on web AND native.
2. **Lane H**: adopt `getAnimations()`-based completion (replaces every
   timer: css driver estimate, Sheet 1000ms, Adapt 3000ms) and emit
   `data-starting-style`/`data-ending-style` from presence so tailwind-mode
   users get pure-CSS enter/exit.
3. **C4 sweep**: apply `(value, eventDetails)` callback shapes +
   `onOpenChangeComplete` + `actionsRef` while every component is already
   being rewritten; adopt mergeProps/preventBaseUIHandler semantics for
   behavior parts; fix the §6 bug list; consolidate the two toast APIs;
   delete `Switch.draggable-tmp` and orphaned `tabs-headless`.
4. **C2 (Sheet)**: import drawer ideas: CSS-length snap points, SwipeArea
   (edge-drag open), Indent scale-back effect, `CloseWatcher` back-gesture.
5. **Testing**: build `describeConformance` + popup conformance suites as the
   C4 acceptance harness.

Post-beta queue (new work, roughly in order):

6. **Field/Form/Fieldset behavior package** (tri-state validity, validationMode,
   server errors, auto aria wiring); design C3/C4 control surfaces to consume
   field context now.
7. **Composite consolidation** (one roving-focus/registry primitive from
   roving-focus + collection), then **toolbar/menubar/meter** as near-free
   wins.
8. **Combobox/Autocomplete** as the flagship first pure-v3 component
   (also unlocks Select `multiple` + object values via shared machinery).
9. **Number-field, otp-field, checkbox-group** riding the Field system.
10. **Navigation-menu, scroll-area**; preview-card opportunistically.

## 10. Docs and blog obligations (owner-requested, do not drop)

Every packet in this workstream must land with its user-facing writing, and
the v3 blog post (`code/tamagui.dev/data/blog/version-three.mdx`, drafted
2026-07-10) predates all of it. Checklist, updated as packets merge:

- [ ] Blog: eventDetails callbacks (`onOpenChange(open, details)`, reasons,
      cancel) — headline breaking change, belongs in the migration section.
- [x] Blog + `docs/components/tabs`: activationMode now truly defaults to
      `automatic` (web-only note).
- [x] `docs/components/slider`: `name` now submits real form values (one
      hidden input per thumb, repeated name).
- [x] `docs/components/separator`: web `role`/`aria-orientation` semantics.
- [x] `docs/components/avatar`: `delay` preferred, `delayMs` deprecated.
- [x] Select `multiple` (with C3): blog section + select docs, four-path
      behavior notes per plans/select-v3-improvements.md.
- [ ] State-attribute vocabulary + grammar modifiers (`open:`, `checked:`,
      `invalid:`) when they land: blog (tailwind-mode section) + a styling
      guide page.
- [ ] `data-starting-style`/`data-ending-style` CSS animation path (lane H):
      blog animation section + animations docs.
- [x] Field/Form system (F1/F2): new docs pages + blog mention.

Site changes use the `site:` commit prefix and are validated with a real
render (Playwright or dev-server check), per repo contract.
