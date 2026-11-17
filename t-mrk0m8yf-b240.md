---
id: t-mrk0m8yf-b240
title: Preflight C3 Select behavior and copied-skin boundary
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- C3
- preflight
- v3
priority: 3
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783995094743
updated_at: 1784007506291
field_marks:
  active_form: 1783995094743
  body: 1783995094743
  claim: 1783995094743
  evidence_summary: 1783995094743
  parent: 1783995094743
  priority: 1783995094743
  recovery_ref: 1783995094743
  status: 1783995094743
  title: 1783995094743
---
Read-only C3 Select behavior/copied-skin preflight completed on v3-consolidate. No repository edits, installs, builds, tests, or lockfile operations were performed.

## Current public API

`code/ui/select/src/Select.tsx` exports a generic callable `Select<Value extends string>` assembled with `withStaticProperties`. Its statics are `Adapt`, `Content`, `Group`, `Icon`, `Item`, `ItemIndicator`, `ItemText`, `Label`, `ScrollDownButton`, `ScrollUpButton`, `Separator`, `Trigger`, `Value`, `Viewport`, `Indicator`, and `FocusScope`. `Select.Root` is absent. There is no `createSelect` implementation or caller.

`code/ui/select/src/index.tsx` also exports `SelectIcon`, `SelectGroupFrame`, `SelectSeparator`, selected prop types, every type from `types.tsx`, and all context providers/hooks. No authored external caller uses the context internals. `code/ui/tamagui/src/index.ts` re-exports the package.

Smallest compatibility surface: keep callable `<Select>` as the generic root, add `Select.Root`, export the wired behavior parts directly, retain the documented zero-caller statics, and do not add an assembly factory. Preserve exact literal-union inference through both `Select.Root` and the copied app namespace.

## Behavior versus skin ownership

Behavior/state owners:

- `Select.tsx`: controlled open/value, selected value/item, active index, subscriptions, native focus registration, browser-native select mode, Adapt handoff, providers.
- `SelectImpl.tsx`: floating placement, list navigation, typeahead, click-hold selection, resize, scroll arrows, outside dismissal.
- `SelectContent.tsx` and native twin: Portal, RemoveScroll, Dismissable, FocusScope, Escape, trigger-focus restoration, adapted close gate.
- `SelectTrigger.tsx`: combobox ARIA, refs, pointer coarse/fine opening.
- `SelectItem.tsx`: item registration, focus, keyboard/touch/click-hold selection, selected state, native `<option>`.
- `SelectItemText.tsx`: text ID and selected-label publication.
- `SelectViewport.tsx` and native twin: floating ref, lazy content, hidden selected-label content, context forwarding, Adapt portal publication.
- `SelectScrollButton.tsx`: visibility, floating geometry, continuous hover scrolling.
- `context.tsx`: Select/item/adapt/z-index/portal contexts.

Keep roles, refs, data state, disabled/open mechanics, focus/pointer/keyboard behavior, floating coordinates, overflow/scroll mechanics, item stacking, and indicator tracking in the package. Move colors, borders, radii, elevation, token size tables, typography, icons, gradients, opacity, aesthetic spacing, and hover/press/focus appearance to the app skin.

Current leakage/styleability gaps:

- Trigger is a non-styleable `createRefComponent(ListItem)` with ListItem skin, border, focus ring, and size defaults.
- Item is styleable but inherits `ListItem.Frame` aesthetics.
- Value, Label, and ItemText inherit `SizableText` aesthetics.
- Viewport inherits `ThemeableStack` background/border/radius/elevation; its adapted and native paths drop styling props entirely.
- Group is non-styleable and discards caller props in browser-native `<select>` mode while private frames own its skin.
- ItemIndicator and scroll buttons are non-styleable RefComponents; native scroll buttons are plain null functions.
- Icon hard-codes a paragraph `▼`; Indicator hard-codes background/radius; Separator inherits its visual default.
- Content/Adapt/FocusScope are structural controllers without a visual host and should stay structural.

The neutral visual parts should use core View/Text frames plus wired styleable HOCs. Trigger/Item should stop depending on ListItem. Group should be the styleable actual `<select>` surface in browser-native mode. Adapted/native Viewport must render the neutral frame inside `AdaptPortalContents`. Native null scroll buttons still need compatible static configs/types.

## Adapt and Sheet coupling

Select source imports no Sheet. Root opens an `AdaptParent`, selects the adapted/native path, and publishes Viewport contents through `AdaptPortalContents`; the caller supplies `<Adapt><Sheet>...<Adapt.Contents/></Sheet></Adapt>`. `SelectContent` deliberately remains mounted until `adaptContext.targetFullyHidden`, and the native Viewport re-forwards Select, item, Adapt, Theme, and portal contexts.

C3 implementation must follow C2. Its focused adapted fixture should use the copied public Sheet skin and prove Sheet exit timing, context forwarding, viewport skin propagation, and scrolling. The `@tamagui/sheet` dependency/tsconfig reference is unused by Select source and is a later manifest/lock cleanup candidate only when the lock lane is available.

## Exact owner files and migration packet

Behavior/package:

- `code/ui/select/src/Select.tsx`
- `SelectImpl.tsx`, `SelectImpl.native.tsx`
- `SelectContent.tsx`, `SelectContent.native.tsx`
- `SelectTrigger.tsx`
- `SelectItem.tsx`
- `SelectItemText.tsx`
- `SelectViewport.tsx`, `SelectViewport.native.tsx`
- `SelectScrollButton.tsx`, `SelectScrollButton.native.tsx`
- `context.tsx`, `types.tsx`, `index.tsx`
- `package.json` and `tsconfig.json` only in a released lock lane
- regenerated `code/ui/select/types/*`

Six source files already contain integrated B1/A2/C4 work and must be preserved: `Select.tsx`, `SelectItem.tsx`, `SelectItemText.tsx`, `SelectTrigger.tsx`, `SelectViewport.tsx`, and `types.tsx`.

Canonical copied skin/test:

- add `code/kitchen-sink/src/components/Select.tsx`, using only public Select and size APIs
- add a dual-skin usecase and Playwright test
- migrate `SelectFocusScopeCase.tsx`, `SelectAdaptSheetUnmountCase.tsx`, `SelectAndroidOnPress.tsx`, and `RemoveScrollCase.tsx` to the copied skin
- preserve current dirty C1 registry entries when adding the usecase to `index.web.ts` and `index.native.ts`
- leave the broad demos/docs/site/sandbox/starter sweep to C4

The skin owns named Trigger, Value, Icon, Label, Item, ItemText, ItemIndicator, Indicator, Viewport, scroll-button, Group/native-select, and Separator visuals plus a named size table. A second visibly different skin must reuse the same behavior parts/context and differ in color, radius, typography, indicators, viewport, and scroll buttons.

## Caller counts

Authored TSX contains 25 root openings in 18 files: 22 direct framework roots in 16 files and three site-wrapper roots in two Studio files. The 16 direct files are SelectDemo; sandbox TestSelect and TestAdaptSelectAndroid; seven kitchen usecases (DismissLayerStackingCase, NativePortalTest, RemoveScrollCase, SelectAdaptSheetUnmountCase, SelectAndroidOnPress, SelectFocusScopeCase, SelectRemount); `code/tamagui.dev/components/Select.tsx`; three docs version switchers; next-webpack home; and `code/ui/components-test/Select.native.test.tsx`. DialogDemo and Studio Components consume Select parts indirectly. Eleven direct callers use the full Select + Adapt + Sheet + Adapt.Contents pattern.

Public-part usage across authored TSX:

- Content 22 occurrences / 16 files
- Group 16 / 13
- Item 41 / 17
- ItemIndicator 30 / 12
- ItemText 38 / 16
- Label 15 / 12
- ScrollUpButton 10 / 8
- ScrollDownButton 10 / 8
- Trigger 23 / 17
- Value 23 / 17
- Viewport 22 / 16
- Indicator 1 / 1
- Adapt, Icon, Separator, FocusScope: zero authored TSX callers

The site wrapper is app-owned evidence, but it is not a canonical skin: it mixes root and trigger props, misroutes several root props, hard-codes root z-index, drops `variant`, lacks adapted Sheet skin, and uses instance props rather than named parts.

## Required implementation hazards

- Floating `getReferenceProps` currently injects a hard-coded `SelectTrigger` class and final event props, overwriting a copied skin class and caller handlers. Compose caller props and keep behavior-owned ARIA/ref/state authoritative.
- Item and Viewport interaction spreads overwrite caller handlers. Compose intentionally. Disabled Item has no guard in `handleSelect`, and native `<option>` does not receive disabled; behavior must own suppression.
- Scroll buttons overwrite caller enter/leave handlers and do not cancel RAF on unmount.
- Value recognizes ItemText by direct `staticConfig.componentName`; a named `styled(Select.ItemText)` hides it behind `parentStaticConfig`. Use ancestry-aware matching and test selected-label display.
- Keep `adaptContext.targetFullyHidden` as the adapted close gate and retain hidden closed children when `renderValue` is absent.
- Keep scroll-button position/top/left/width/z-index, Viewport overflow/max-height/portal/focus/scroll, and Indicator measurements in behavior.
- A named Viewport can invalidate the `.is_SelectViewport` scrollbar selector. Use a stable behavior marker or assert ancestry preserves it.
- Root generic inference and copied compound statics require a type fixture; no string index or broadened values.

## Declarations and dependencies

There are 17 tracked Select declaration files. Five contain 42 stale `unstyled` lines although authored source has zero `unstyled`/`TAMAGUI_HEADLESS`. Current declarations expose Trigger, Group, ItemIndicator, and scroll buttons as non-styleable RefComponents and native Viewport as a plain function. Regenerate Select and aggregate Tamagui declarations after source is green.

`code/ui/select/types/useSelectBreakpointActive.d.ts` is orphaned with no source/export and must be deleted explicitly. `selectViewportElevate.web.test.tsx` tests an old framework aesthetic; move the default elevation assertion to the copied skin or retain only explicit style-prop behavior.

Unused current dependencies/references include create-context, get-token, sheet, use-debounce, use-event, and z-index-stack. Removing ListItem/Separator/default text frames should also make list-item, separator, and likely text removable. Conversely `SelectViewport.tsx` imports start-transition without a direct dependency. Defer manifest and bun.lock work to the released lock lane.

## Focused future gates, serialized after C2/E4 release

1. Build `code/ui/select` and regenerate Select declarations, then build the aggregate `code/ui/tamagui` declarations.
2. Focused type harness: every public visual part works under `styled(...)`; copied statics preserve props; root callback retains the exact value literal union; adapted/native parts expose the same styling surface.
3. Core web Vitest: updated `selectViewportElevate.web.test.tsx`.
4. Native Vitest: `code/ui/components-test/Select.native.test.tsx`.
5. Default + WebKit Playwright, workers serialized: SelectClickHold, SelectFocusScope, SelectInnerPositioning, SelectKeyboardNav, SelectPositioning, SelectTypeahead, RemoveScroll, DismissLayerStacking, plus the new dual-skin test.
6. Animated gate: SelectAdaptSheetUnmount across css/native/reanimated/motion drivers.
7. Native interaction: Android SelectAndroidOnPress, iOS SelectRemount, and Maestro Select.yaml if the lane budget allows.
8. Final exact checks: zero `unstyled`, `TAMAGUI_HEADLESS`, and `createSelect` in authored Select source/generated declarations; no orphan declaration; adapted/native skin props proven; both skins pass selection/selected-label behavior; scoped `git diff --check`.

Implementation remains intentionally paused until C2 and the E4 heavy/lock lane are explicitly handed off.
