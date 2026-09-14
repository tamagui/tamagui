# Event callback audit for v3

Audited on `v3-beta` at `45a29dab77`. This is a read-only inventory of the
public callback surface implemented under `code/ui/*/src`, with Base UI's
`(value, eventDetails)` contract as the target.

## Scope and recommendation

The v3 rule should apply to every callback that requests a Tamagui state
change, plus the related interaction and lifecycle callbacks that supply its
cause. A component-owned state callback must run *before* its state commits so
`details.cancel()` actually vetoes the request. Do not synthesize a DOM event
on native or for an imperative action. `details.event` is `undefined` when the
source cannot supply one.

This does not change ordinary host callbacks inherited unchanged from
`ViewProps`, DOM element props, or React Native props. Examples include
`Button.onPress`, `Stack.onLayout`, `ScrollView.onScroll`, and the ordinary
`onFocus`/`onBlur` props on most styled frames. They remain platform callbacks,
not Tamagui change APIs. `Input` and `Image` are called out below because they
adapt host events and therefore need a deliberate compatibility decision.

There is no `onPressedChange` in `code/ui/*/src`; the equivalent public API is
`Toggle.onActiveChange` at `code/ui/toggle-group/src/Toggle.tsx:97`.

## 1. Proposed core contract

Put these types and a small `createChangeEventDetails()` factory in
`@tamagui/core`, with type-only platform specializations at the call sites. The
generic `NativeEvent` preserves an exact DOM, React Synthetic, RNGH, or React
Native event type without forcing `@tamagui/core` to import a native runtime.

```ts
export type TamaguiChangeReason =
  // popup and selection activation
  | 'trigger-press'
  | 'trigger-hover'
  | 'trigger-focus'
  | 'context-menu'
  | 'long-press'
  | 'item-press'
  | 'item-hover'
  | 'sibling-open'
  | 'close-press'
  | 'backdrop-press'
  | 'outside-press'
  | 'focus-out'
  | 'escape-key'
  | 'keyboard'
  // values and gestures
  | 'input-change'
  | 'native-change'
  | 'list-navigation'
  | 'drag'
  | 'track-press'
  | 'pointer'
  | 'sheet-drag'
  | 'sheet-snap'
  | 'swipe'
  // lifecycle and platform
  | 'timeout'
  | 'scroll'
  | 'submit'
  | 'image-load'
  | 'image-error'
  | 'animation-finish'
  | 'native-dismiss'
  | 'native-back'
  | 'adapt-morph'
  | 'imperative-action'
  | 'initial'

export type TamaguiEventDetails<
  Reason extends TamaguiChangeReason = TamaguiChangeReason,
  NativeEvent = unknown,
  Extra extends object = {},
> = {
  reason: Reason
  event: NativeEvent | undefined
  trigger: unknown | undefined
} & Extra

export type TamaguiChangeEventDetails<
  Reason extends TamaguiChangeReason = TamaguiChangeReason,
  NativeEvent = unknown,
  Extra extends object = {},
> = TamaguiEventDetails<Reason, NativeEvent, Extra> & {
  cancel(): void
  readonly isCanceled: boolean
}
```

`cancel()` must be idempotent, set `isCanceled`, and call the source event's
`preventDefault()` when it exists. It is valid only for a request before a
state commit. Completion, telemetry, and after-the-fact native callbacks use
the non-cancelable `TamaguiEventDetails` type. The factory should not grow
Base UI's `allowPropagation()` until a Tamagui behavior primitive actually
needs it.

The vocabulary is closed at the public boundary. Components narrow the union:
`Sheet` can emit `sheet-drag`; a regular popup cannot. `native-back` is
reserved for an Android callback that identifies BackHandler dismissal. The
current code has no `BackHandler` use, so no v3 implementation may claim to
emit it yet. The existing iOS sheet callback only identifies an undifferentiated
native dismissal (`code/ui/sheet/src/nativeSheet.tsx:60`), so it emits
`native-dismiss` unless the renderer is extended. `adapt-morph` describes a
target swap, not an open-value change, and therefore belongs on a lifecycle
completion detail unless the owner explicitly wants a separate Adapt callback.

The standard state shape is:

```ts
onOpenChange?: (open: boolean, details: TamaguiChangeEventDetails<OpenReason>) => void
onValueChange?: (value: Value, details: TamaguiChangeEventDetails<ValueReason>) => void
onOpenChangeComplete?: (open: boolean, details: TamaguiEventDetails<CompletionReason>) => void
```

`onOpenChangeComplete` replaces the inconsistent `onAnimationComplete` names.
It fires once per completed state transition, including the no-animation path,
and carries the request reason saved with that transition. It never fires for a
prop synchronization that did not originate from a component request.

## 2. Per-component inventory

Legend: **C** means `cancel()` must stop the proposed state transition;
**N** means notification only. Severity is the consumer-facing break caused by
the proposed signature. “Shared interaction callbacks” names the four
Dismissable callbacks in the next table.

### Shared popup, focus, and adaptation primitives

| Surface and current signature | Information lost today | Proposed v3 signature and reasons | C | Internal plumbing to change | Severity |
| --- | --- | --- | :---: | --- | :---: |
| `Dismissable.onEscapeKeyDown?: React.KeyboardEventHandler` (`code/ui/dismissable/src/DismissableProps.tsx:21`) | The later close has no reason link. | `onEscapeKeyDown?(details: TamaguiChangeEventDetails<'escape-key', React.KeyboardEvent>)`; `escape-key`. | C | Construct once in the document key listener, pass it to `onDismiss`; `Dismissable.tsx:228-235`. | H |
| `Dismissable.onPointerDownOutside?: (event: PointerDownOutsideEvent) => void`, `onFocusOutside?: (event: FocusOutsideEvent) => void`, `onInteractOutside?: (event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` (`DismissableProps.tsx:26,31,37`) | Event wrapper exposes `preventDefault`, but no closed reason, uniform cancellation, or later state request. | Each receives one cancelable detail; reasons `outside-press` or `focus-out`. `onInteractOutside` additionally has `interaction: 'pointer' \| 'focus'`. | C | Reuse the same details object for specific and aggregate handlers before `onDismiss`; `Dismissable.tsx:202-215`. | H |
| `Dismissable.onDismiss?: () => void` (`DismissableProps.tsx:42`) | No cause or native event reaches Dialog, Menu, Popover, Select, or Toast. | `onDismiss?(details: TamaguiEventDetails<'outside-press' \| 'focus-out' \| 'escape-key', Event>)`. | N | Change the callback produced by each Dismissable branch; owners turn it into a cancelable root change request. | M |
| `FocusScope.onMountAutoFocus?: (event: Event) => void`, `onUnmountAutoFocus?: (event: Event) => void` (`code/ui/focus-scope/src/types.tsx:40,46`) | Native event is a synthetic custom event with no reason or consistent cancellation name. | Keep base names for the primitive: `onMountAutoFocus?(details)` / `onUnmountAutoFocus?(details)`, reasons `trigger-focus` and `focus-out`; Dialog-family aliases stay `onOpenAutoFocus` / `onCloseAutoFocus`. | C | Replace custom-event creation and `defaultPrevented` reads in `FocusScope.tsx`; keep focus restoration after the callback. | H |
| `RovingFocusGroup.onCurrentTabStopIdChange?: (id: string \| null) => void`, `onEntryFocus?: (event: Event) => void` (`code/ui/roving-focus/src/RovingFocusGroup.tsx:28-29`) | Tab-stop changes lose keyboard versus pointer origin; entry focus has only a raw custom event. | `onCurrentTabStopIdChange?(id, details)` with `keyboard`, `trigger-focus`, `focus-out`; `onEntryFocus?(details)` with `trigger-focus`. | C | Thread key/focus event through item registration and controllable state. Replace `CustomEvent` at `RovingFocusGroup.tsx:106-112`. | H |
| `AdaptTarget.onOpenChange?: (open: boolean) => void`; `AdaptTargetHandoff.onAnimationComplete: (info: { open: boolean }) => void` (`code/ui/adapt/src/Adapt.tsx:71,76`; also exported render state at `112`) | Dialog, Popover, Select, and Sheet erase the initiating event while crossing the Adapt boundary. Completion knows only `open`. | Internal v3 contract: `onOpenChange(open, details)` and `onOpenChangeComplete(open, details)`, including `adapt-morph` only for target handoff completion. | C / N | Make details part of `AdaptParent` context, `useAdaptTarget`, and handoff state rather than a second `viaRef`-like side channel. | H |

### Dialog, popover, tooltip, sheet

| Surface and current signature | Information lost today | Proposed v3 signature and reasons | C | Internal plumbing to change | Severity |
| --- | --- | --- | :---: | --- | :---: |
| `Dialog.onOpenChange?(open: boolean)` and `onAnimationComplete?: (info: { open: boolean }) => void` (`code/ui/dialog/src/Dialog.tsx:59,70`) | Trigger, Close, Escape, outside, focus, Adapt, and animation causes collapse to a boolean. | `onOpenChange(open, details)` with `trigger-press`, `close-press`, `outside-press`, `focus-out`, `escape-key`, `imperative-action`; replace completion with `onOpenChangeComplete(open, details)` using `animation-finish` or `adapt-morph`. | C / N | Replace bare `setOpen` calls in Trigger, Close, `onDismiss`, and Adapt with `requestOpenChange`; preserve details through `useDialogAnimationReporter` at `312-329`. | H |
| `Dialog.Content.onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']`, `onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']` (`code/ui/dialog/src/Dialog.tsx:716,722`), plus all shared interaction callbacks via `DismissableProps` (`code/ui/dialog/src/Dialog.tsx:704-805`) | Modal and non-modal wrappers override or prevent events, then the root loses the close source. | Shared interaction details and aliases described above. | C | Route the same details from Content through `onDismiss` into the root request. Audit modal custom overrides at `621-640` and non-modal interaction logic at `667-698`. | H |
| `AlertDialog` inherits `DialogProps` (`code/ui/alert-dialog/src/AlertDialog.tsx:55`); its native action calls child `onPress({ native: true })` then `setOpen(false)` (`409-412`) | The action kind and native event are not carried to `onOpenChange`; native alert close cannot currently be vetoed. | Same root signature, with an optional detail extra `action: 'action' \| 'cancel' \| 'destructive'` and reason `item-press`. | Web C; native N until the native alert bridge can defer dismissal. | Give the native button closure a detail before calling `setOpen`; do not pretend cancellation works after the OS has closed the alert. | H |
| `Popover.onOpenChange?: (open: boolean, via?: 'hover' \| 'press') => void` (`code/ui/popover/src/Popover.tsx:92`) | `via` is only hover/press, is optional, races through `viaRef`, and mislabels outside/escape/close paths as press. | `onOpenChange(open, details)` with `trigger-press`, `trigger-hover`, `trigger-focus`, `close-press`, `outside-press`, `focus-out`, `escape-key`, `imperative-action`. | C | Replace `viaRef` at `968-978`; carry details through `useFloatingContext` (`106-126`), Trigger, Close, Dismissable, Adapt, and imperative methods. | H |
| `Popover.Content` inherits the shared interaction callbacks and has `onOpenAutoFocus` / `onCloseAutoFocus` (`code/ui/popover/src/Popover.tsx:693-728`); `Tooltip.Content` is `PopoverContentProps` (`code/ui/tooltip/src/Tooltip.tsx:34`) | Same loss as Dialog, with Tooltip inheriting a popup content contract without documenting it. | Shared details; Tooltip must narrow causes to hover/focus/escape/outside as actually enabled. | C | Pass root `requestOpenChange` to `PopoverContentImpl.handleDismiss` (`789-830`) instead of a bare `false`. | H |
| `Tooltip.onOpenChange?: (open: boolean) => void` (`code/ui/tooltip/src/Tooltip.tsx:96`) | Delay timers, hover grace, focus, document scroll, group replacement, and imperative `closeOpenTooltips()` all appear as a boolean. | `onOpenChange(open, details)` with `trigger-hover`, `trigger-focus`, `outside-press`, `scroll`, `imperative-action`; no cancellation after a delayed timer has already committed. | C before commit | Store the detail with delayed open/close in `useFloatingContext`; thread it through `closeOpenTooltips` and scroll close at `Tooltip.tsx:183-207`. | H |
| `Sheet.onOpenChange?: ((open: boolean) => void) \| Dispatch<SetStateAction<boolean>>`, `onPositionChange?: (position: number) => void`, `onAnimationComplete?: (info: { open: boolean }) => void` (`code/ui/sheet/src/types.tsx:16,35,91,94-98`) | Gesture, overlay, escape, bottom-snap, native modal dismissal, Adapt, and completion sources are all erased. The public union also makes a two-argument callback impossible. | `onOpenChange(open, details)` with `backdrop-press`, `escape-key`, `sheet-drag`, `sheet-snap`, `native-dismiss`, `imperative-action`; `onPositionChange(position, details)` with `sheet-drag`, `sheet-snap`, `imperative-action`; replace completion with `onOpenChangeComplete(open, details)`. | C / C / N | Introduce request functions in `useSheetOpenState`, `useSheetProviderProps`, Sheet overlay, Pan/RNGH release, native modal callback, and `SheetController`. Preserve across Adapt handoff. `nativeSheet.tsx:45-47` also currently calls the prop with the old `open`, not `next`. | H |

### Menus and Select

| Surface and current signature | Information lost today | Proposed v3 signature and reasons | C | Internal plumbing to change | Severity |
| --- | --- | --- | :---: | --- | :---: |
| Web `Menu.onOpenChange?(open: boolean)` (`code/ui/menu/src/createNonNativeMenu.tsx:108-114`), base menu root (`code/ui/create-menu/src/createBaseMenu.tsx:89-95`), and `Menu.Sub.onOpenChange?(open: boolean)` (`code/ui/create-menu/src/createBaseMenu.tsx:328-332`) | Trigger press, keyboard, submenu hover, Escape, outside, scroll, and parent close are indistinguishable. | `onOpenChange(open, details)`; root reasons `trigger-press`, `keyboard`, `outside-press`, `focus-out`, `escape-key`, `scroll`, `imperative-action`; Sub additionally `trigger-hover` and `sibling-open`. | C | Replace all `setOpen`/`context.onOpenChange` calls in `createNonNativeMenu.tsx` and `createBaseMenu.tsx`; record exact event at Trigger, SubTrigger, Dismissable, and scroll listener. | H |
| `Menu.Item.onSelect?: (event: Event) => void` (`code/ui/create-menu/src/createBaseMenu.tsx:219-226`) | The API has a custom cancelable event, but it does not name `item-press` or expose the original native event consistently. | `onSelect?(details: TamaguiChangeEventDetails<'item-press', Event>)`; `details.cancel()` keeps the menu open. | C | Replace `CustomEvent(ITEM_SELECT)` and native object cast at `1033-1052`; pass details into Checkbox and Radio composition. | H |
| `Menu.CheckboxItem.onCheckedChange?: (checked: boolean) => void`; `Menu.RadioGroup.onValueChange?: (value: string) => void` (`code/ui/create-menu/src/createBaseMenu.tsx:259-273`) | Selection event and whether a menu close was requested are lost. | `(checked, details)` / `(value, details)` with `item-press`, `keyboard`, `imperative-action`. | C | Make `onSelect` return the same details to Checkbox/Radio handlers before changing their controllable state. | H |
| `Menu.Content` exposes `onCloseAutoFocus`, `onEntryFocus`, and all shared interaction props; `Menu.SubContent` exposes the shared interaction props but omits `onCloseAutoFocus` and `onEntryFocus` (`code/ui/create-menu/src/createBaseMenu.tsx:153-205,346-353`) | Each is forwarded but root state close sees no reason. | Shared detail signatures. The root's internal open autofocus remains internal; SubContent retains only its current public subset. | C | Make Content `onDismiss` carry details through the root and Sub paths at `660-670`, `685-689`, and `943-967`. | H |
| `ContextMenu.onOpenChange?(open: boolean, event?: { preventDefault(); defaultPrevented })` (`code/ui/context-menu/src/createNonNativeContextMenu.tsx:41-56`) | It can cancel only opening, drops the source event, and creates an ad hoc event object. | `onOpenChange(open, details)` with `context-menu`, `long-press`, `outside-press`, `focus-out`, `escape-key`, `item-press`; add `{ point }` extra for the virtual anchor. | C | Replace `createOpenChangeEvent` and pass raw `onContextMenu`/long-press event from `handleOpen` at `200-271`. | H |
| Native `Menu`/`ContextMenu.onOpenChange?: (isOpen: boolean) => void`, plus ContextMenu-only `onOpenWillChange?: (willOpen: boolean) => void` (`code/ui/create-menu/src/createNativeMenu/createNativeMenuTypes.ts:11,17`) | Zeego supplies no cause or veto path through Tamagui. `onOpenChange` is after the platform action. | Collapse to `onOpenChange(open, details)` only if the native bridge can issue a pre-change request. Use `native-dismiss` now; reserve `native-back` for a bridge that identifies it. | N today | Extend the Zeego/root bridge first. The current wrappers at `createNativeMenu.tsx:540-561` can only decorate the post-fact result. | H |
| Native `Menu.Item.onSelect?: (event?: Event) => void`; `CheckboxItem.onCheckedChange?: (checked: boolean) => void`; `onValueChange?: (state, prevState) => void` (`createNativeMenuTypes.ts:63,152,164-167`) | Native selection often has no event; checkbox and radio wrappers discard the state transition source. | `onSelect(details)`, `onCheckedChange(checked, details)`, and one normalized `onValueChange(value, details)`; reason `item-press` or `native-change`. | N for already committed native UI; C only after bridge support | Update child transformer at `createNativeMenu.tsx:317-407`; eliminate the separate native previous-value callback as public API. | H |
| `NativeContextMenu.Auxiliary.onDidShow?: () => void`, `onWillShow?: () => void`; `Preview.onPress?: () => void` (`code/ui/create-menu/src/createNativeMenu/createNativeMenuTypes.ts:24-31,183-197`) | No event, target, or reason. | `onWillShow(details)` / `onDidShow(details)` with `context-menu` or `long-press`; preserve Preview `onPress` as a host callback. | N | The lazy Zeego component must forward lifecycle metadata if it has it. | M |
| `Select.onValueChange?(value: Value)`, `onOpenChange?(open: boolean)`, `onActiveChange?(value: string, index: number)` (`code/ui/select/src/types.tsx:41-52`) | Item press, keyboard selection, native `<select>` change, outside mouse-up, Escape, and Adapt all collapse to values. Active changes also lose why they moved. | `onValueChange(value, details)` with `item-press`, `keyboard`, `native-change`; `onOpenChange(open, details)` with `trigger-press`, `keyboard`, `outside-press`, `escape-key`, `item-press`; `onActiveChange(value, details & { index })` with `item-hover`, `list-navigation`, `keyboard`. | C / C / N | Thread event through `SelectItem.handleSelect` (`129-132`), native `<select>` (`312-314`), interactions in `SelectImpl`, `SelectContent.onDismiss`, Item parent context, and `AdaptParent`. | H |
| `Select.Content` exposes shared interaction callbacks by `Pick<DismissableProps>` (`code/ui/select/src/types.tsx:175-182`) | Its Escape path dismisses through Dismissable while pointer outside is handled separately, so causes diverge. | Shared details, with root `onOpenChange` receiving the same one. | C | Unify `SelectContent.tsx:55-72` and document mouse-up close at `SelectImpl.tsx:74-82`. | H |

### Selection controls and form primitives

| Surface and current signature | Information lost today | Proposed v3 signature and reasons | C | Internal plumbing to change | Severity |
| --- | --- | --- | :---: | --- | :---: |
| `Accordion.Single.onValueChange?(value: string)` and `Multiple.onValueChange?(value: string[])` (`code/ui/accordion/src/Accordion.tsx:112,174`) | Trigger press and keyboard event disappear in `useControllableState`. | `(value, details)` with `trigger-press`, `keyboard`, `imperative-action`. | C | Pass trigger event through Collapsible Item `onOpenChange` at `427-433` into the root state setter. | H |
| `Collapsible.onOpenChange?(open: boolean)` (`code/ui/collapsible/src/Collapsible.tsx:30-34`) | Toggle source and cancellation are absent. | `(open, details)` with `trigger-press`, `keyboard`, `imperative-action`. | C | Change `onOpenToggle` context to accept event and call a request setter before `setOpen`. | H |
| `Checkbox.onCheckedChange?(checked: boolean \| 'indeterminate')` (`code/ui/checkbox-headless/src/useCheckbox.tsx:17-29`) | Press/key/focusable selection event is discarded before `setChecked`. | `(checked, details)` with `trigger-press`, `keyboard`, `imperative-action`, `native-change`. | C | Change `useCheckbox` press handler at `73-83`, native focusable registration, and the native `<input>` path in `createCheckbox.tsx`. | H |
| `Switch.onCheckedChange?(checked: boolean)` (`code/ui/switch-headless/src/useSwitch.tsx:11-22`) | Press, RN `NativeSwitch.onValueChange`, and focusable selection share a bare boolean. | `(checked, details)` with `trigger-press`, `keyboard`, `native-change`, `imperative-action`. | C | Pass source through `useSwitch` and use a wrapper rather than raw `setChecked` in `useSwitchNative.native.tsx:31`. | H |
| `RadioGroup.onValueChange?: (value: string) => void` (`code/ui/radio-group/src/createRadioGroup.tsx:44-48`; headless implementation `useRadioGroup.tsx:14-18`) | Press, Enter/Space, and roving focus selection are indistinguishable. | `(value, details)` with `trigger-press`, `keyboard`, `list-navigation`, `imperative-action`. | C | Thread events from `useRadioGroupItem` at `199-226` through `onChange`. | H |
| `Toggle.onActiveChange?(active: boolean)` (`code/ui/toggle-group/src/Toggle.tsx:94-98`); `ToggleGroup.Single/Multiple.onValueChange` (`code/ui/toggle-group/src/ToggleGroup.tsx:181,230`) | Toggle press and group composition lose their source. | `(active, details)` and `(value, details)` with `trigger-press`, `keyboard`, `imperative-action`. | C | Give Toggle's composed `onPress` the event, then pass details through Item to group providers. | H |
| `Tabs.onValueChange?: (value: Tab) => void`, `Tabs.Trigger.onInteraction?: (type, layout) => void` (`code/ui/tabs/src/createTabs.tsx:350,391`); headless `useTabs.onValueChange` (`code/ui/tabs-headless/src/useTabs.tsx:21`) | Press, Enter/Space, automatic focus, and hover/focus indicator observations are lost. | `onValueChange(value, details)` with `trigger-press`, `keyboard`, `trigger-focus`, `imperative-action`. Change indicator observer to `onInteraction({ type, layout, ...details })`, non-cancelable. | C / N | Thread events from Trigger `onPress`/key/focus (`175-203`) and the headless hook. Do not manufacture a source event in the selected-value effect. | H |
| `Slider.onValueChange?(value: number[])`; `onSlideStart(event, value, target)`, `onSlideMove(event, value)`, `onSlideEnd(event, value)` (`code/ui/slider/src/types.ts:10-16,78`) | Value callbacks lose drag/keyboard origin, thumb index, and target; the slide callback argument order is inconsistent between horizontal and vertical paths. | `onValueChange(value, details & { activeThumbIndex })`; normalize observers to `onSlideStart(value, details & { target })`, `onSlideMove(value, details)`, `onSlideEnd(value, details)`. Reasons `drag`, `keyboard`, `track-press`, `imperative-action`. | C for value; N for observers | Keep one details object from `SliderImpl` pointer/key handler through orientation wrappers and `updateValues`; audit the inconsistent calls at `Slider.tsx:134-149,274-288,640-694`. | H |
| `Input.onChangeText?: (text: string) => void`, `onSubmitEditing?: (e: { nativeEvent: { text: string } }) => void`, `onSelectionChange?: (e: { nativeEvent: { selection: { start; end } } }) => void` (`code/ui/input/src/types.ts:108,113,123-125`), inherited DOM `onChange`/`onInput`, plus native `onEndEditing`, `onContentSizeChange`, `onScroll`, `onKeyPress` (`InputNativeProps.ts:285-309`) | Web adapters create partial RN-shaped events and `onChangeText` loses the DOM event. | Preserve these platform-compatibility signatures in v3. If a new semantic field control is built, give it `onValueChange(value, details)` rather than changing `Input`. | N | Keep adapters in `Input.tsx:100-162` and `Input.native.tsx:197-255` separate from the C4 core API. | L |
| `Form.onSubmit?: () => void` (`code/ui/form/src/Form.tsx:26-30`) | Native submitter/event is swallowed and users cannot distinguish a trigger press from form submit. | Defer to the Field/Form packet: `onSubmit?(details: TamaguiEventDetails<'submit' \| 'trigger-press', SubmitEvent>)`. It is notification only because Form currently prevents native default unconditionally. | N | Preserve the submit event in `Form.tsx:75-78` and pass a trigger event from `Form.Trigger:44-57`. | M |

### Toasts, animation, and media

| Surface and current signature | Information lost today | Proposed v3 signature and reasons | C | Internal plumbing to change | Severity |
| --- | --- | --- | :---: | --- | :---: |
| Radix-style `Toast.onOpenChange?(open: boolean)`, `onEscapeKeyDown`, `onPause?()`, `onResume?()`, and `onSwipeStart/Move/Cancel/End?(event: GestureResponderEvent)` (`code/ui/toast/src/ToastImpl.tsx:101,120,126,132,136-148`) | Close button, Escape, timeout, swipe, focus, pointer, and native gesture sources do not reach the open callback. Pause/resume has no source. | `onOpenChange(open, details)` with `close-press`, `escape-key`, `timeout`, `swipe`, `imperative-action`; retain swipe observers as `onSwipe*(details)` and pause/resume as non-cancelable details with `pointer`, `trigger-focus`, `focus-out`. | C for open; N otherwise | Thread details through `ToastClose`, `ToastImpl` Dismissable, timer, PanResponder/RNGH, and the composed `onSwipeEnd` at `Toast.tsx:146-180`. | H |
| Composable toast `ToastT.onDismiss?: (toast) => void`, `onAutoClose?: (toast) => void`, and `ToastAction.onClick?: (event) => void` (`code/ui/toast/src/ToastState.ts:22-23,38`) | Dismiss and timer callbacks omit close cause, swipe direction/velocity, and source event. They cannot veto removal. Action intentionally receives only its host event. | `onDismiss?(toast, details)` and `onAutoClose?(toast, details)` with `close-press`, `swipe`, `timeout`, `imperative-action`; make dismissal cancelable before `setRemoved`. Keep `action.onClick(event)` as a host callback. | C for removal | Carry event through `useAnimatedDragGesture`, close handlers at `ToastComposable.tsx:731-810,1044-1095`, and imperative `ToastState.dismiss`. | H |
| `AnimatePresence.onExitComplete?: () => void` (`code/ui/animate-presence/src/types.ts:72`), forwarded by `Animate` (`code/ui/animate/src/Animate.tsx:63-71`) | No component/transition identity or completion reason. | `onExitComplete?(details: TamaguiEventDetails<'animation-finish'>)`; no cancellation. | N | Attach completion metadata while collecting Presence children, including the immediate no-child path in `PresenceChild.tsx:47-81`. | M |
| `Dialog` and `Sheet` `onAnimationComplete` are listed above; `AdaptTargetHandoff.onAnimationComplete` is internal (`code/ui/adapt/src/Adapt.tsx:71`) | Three nearly identical reporters do not share a transition ID or originating cause. | One `onOpenChangeComplete` contract, driven by Lane H transition completion. | N | Remove the three ad hoc reporter shapes when C4 adopts the shared lifecycle emitter. | H |
| `Avatar.Image.onLoadingStatusChange?: (status: ImageLoadingStatus) => void` (`code/ui/avatar/src/Avatar.tsx:36-38`) | `idle`, load, and error transitions lose the actual load/error event. | `(status, details)` with `initial`, `image-load`, `image-error`; no cancellation. | N | Preserve `onLoad`/`onError` event when setting status at `Avatar.tsx:99-107`, then feed its details into the effect at `66-69`. | M |
| `Image` inherits DOM/RN `onLoadStart`, `onProgress`, `onLoad`, `onError`, and `onLoadEnd` through `ImageProps` (`code/ui/image/src/types.ts:10-47`); Tamagui normalizes `onLoad` and `onError` and discards the original event (`createImage.tsx:218-238`) | Source event metadata is lost, but this is a host-compatibility surface rather than a state callback. | Preserve existing handler types for v3. A future `onLoadingStatusChange(status, details)` can expose normalized lifecycle without changing DOM/RN compatibility. | N | If added, retain the source event before the current normalized callbacks run. | L |

### Coverage notes

The remaining UI packages either expose no component-owned change/event
callback or only forward host callbacks: `button`, `card`, `collection`,
`elements`, `focus-guard`, `group`, `label`, `linear-gradient`, `list-item`,
`portal`, `progress`, `scroll-view`, `separator`, `shapes`, `spacer`,
`spinner`, `stacks`, `tamagui` view primitives, `text`, `visually-hidden`, and
`z-index-stack`. `Popper`'s `onArrowSize`, `onHoverReference`, and
`onLeaveReference` are context implementation hooks, not `PopperProps`
(`code/ui/popper/src/Popper.tsx:60-86`), so they are internal plumbing for the
Popover/Tooltip rows rather than public callbacks to migrate. Likewise,
`ToastProvider.onToastAdd/onToastRemove`, `Sheet.ScrollBridge` callbacks, and
`Adapt` context callbacks are exported implementation contexts, not component
props; the migration must update them but should not bless them as additional
public API.

## 3. Interaction props: keep them, do not subsume them

Keep `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`,
`onEscapeKeyDown`, `onOpenAutoFocus`, and `onCloseAutoFocus` as explicit
callbacks. Do not replace them with only `onOpenChange`.

They are preflight observation points with information that a later state
callback cannot reconstruct: exact pointer versus focus ordering, outside
target, right-click/ctrl-click behavior, focus-restoration intent, and the
ability to stop an intermediate behavior while leaving an owner in control of
whether it changes state. Removing them would make Dialog, Menu, ContextMenu,
Popover, Select, and Toast less expressive.

Their implementation should nevertheless use the same cancelable details
object. The sequence for an outside pointer should be:

```text
native pointer event
  -> onPointerDownOutside(details)
  -> onInteractOutside(the same details)
  -> if !details.isCanceled, owner.onOpenChange(false, same details)
```

This preserves the existing `preventDefault()` use case through
`details.cancel()`, gives the root callback a precise reason and native event,
and removes the current split where the interaction prop can veto a change that
the root callback cannot explain. Do not call both `event.preventDefault()` and
`details.cancel()` as separate mechanisms in v3. The factory owns that bridge.

## 4. Ordered migration plan

Estimates are engineering time for one owner and include focused tests, not a
full UI rewrite.

1. **Shared contract, 2 to 3 days.** Add the core types/factory and a
   `requestChange(next, details)`-capable path to
   `@tamagui/use-controllable-state`. It must preserve one details object and
   skip the state write when canceled. Add unit coverage for idempotent cancel,
   controlled/uncontrolled state, and `event: undefined`.
2. **Dismissal and focus substrate, 3 to 4 days.** Migrate `dismissable`,
   `focus-scope`, and `roving-focus` first. They provide the shared interaction
   props consumed by every popup. Add a shared popup conformance suite covering
   Escape, pointer outside, focus outside, prevent/cancel, and focus restore.
3. **C2/C3 pilot surfaces, 5 to 7 days.** Migrate `adapt`, `sheet`, `dialog`,
   `popover`, and `select` together. These are already connected by the Adapt
   handoff. Replace bare boolean setters, fix the native Sheet old-value call,
   and make `onOpenChangeComplete` use Lane H's transition lifecycle rather
   than timers or component-specific reporters.
4. **C4 component sweep, 8 to 12 days.** This is the planned breaking window
   in `plans/v3-evolution.md:518-531`. Land the standardized two-argument
   callbacks for Accordion, Collapsible, Checkbox, Switch, RadioGroup,
   Toggle/ToggleGroup, Tabs, Slider, Menu, ContextMenu, Tooltip, and both Toast
   APIs. This packet also includes the shared interaction-prop signatures,
   `onOpenChangeComplete`, and the popup conformance tests. It must remove
   Popover's `via` parameter and all ad hoc cancel-event objects in favor of the
   core factory.
5. **Native menu bridge, 3 to 6 days after upstream support.** Extend Zeego or
   its Tamagui adapter to report initiating events/reasons and offer a
   pre-change veto. Until then native menu `onOpenChange` remains a lifecycle
   notification and cannot honestly meet the C4 cancellation guarantee.
6. **Low-risk lifecycle and compatibility review, 2 to 3 days.** Migrate
   AnimatePresence and Avatar lifecycle details. Keep Input and Image host
   callbacks stable, then decide their semantic companion APIs with the
   Field/Form work. Update every doc example and generated prop reference in
   the same commit as its signature.

The C4 acceptance suite should assert the callback's arity and behavior, not
only types: each trigger source supplies the correct reason/event; cancellation
keeps controlled and uncontrolled state unchanged; `onOpenChangeComplete`
preserves the originating reason; and native paths use `undefined` rather than
inventing a browser Event.

## 5. Open questions for the owner

1. Should `onOpenChangeComplete` fire on every no-animation transition, or only
   after an actual presence/animation lifecycle? The audit recommends every
   committed component request, with a microtask completion for no-animation.
2. Do we require cancellation for native menus and native AlertDialog before
   exposing their v3 callback shape, or accept a documented notification-only
   exception until Zeego/the alert bridge supports a pre-change request?
3. Is `adapt-morph` enough as a completion reason, or should Adapt expose a
   separate public `onTargetChange` callback? It is not an open-state change.
4. Should Sheet position changes be cancelable only at a settled snap point, as
   recommended here, or during drag frames too? Cancelling every frame would
   make gesture ownership much harder and is not a useful controlled API.
5. Is the Field/Form packet allowed to change `Form.onSubmit` to receive the
   native submit event, or must the current zero-argument API remain for
   compatibility despite v3?
6. Should Input retain React Native compatibility exactly, as recommended, or
   add an opt-in `onValueChange(value, details)` before Field lands?
7. Do we want a public `trigger` reference on details across web and native?
   The proposed `unknown | undefined` is safe, but a first-class cross-platform
   target type would need an explicit ownership and lifetime contract.

## 6. Coordinator decisions (2026-07-16)

Audit accepted, including keeping the preflight interaction props (section 3)
and the ordered migration plan (section 4). Answers to section 5:

1. `onOpenChangeComplete` fires for every committed component request; the
   no-animation path completes in a microtask. Matches base-ui semantics.
2. Ship C4 with a documented notification-only exception for native menus and
   native AlertDialog: those paths type their details as the non-cancelable
   `TamaguiEventDetails`, never the cancelable shape. The Zeego/alert bridge
   (migration item 5) is a follow-up, not a C4 blocker. Honest types over
   fake veto.
3. `adapt-morph` as a completion reason is enough. No public
   `onTargetChange` until a real consumer asks for it.
4. Sheet position changes are cancelable only at settled snap points, never
   per drag frame.
5. Yes: the Field/Form packet changes `Form.onSubmit` to
   `onSubmit(values, details)` (`plans/field-system.md`). v3 is the breaking
   window; the zero-argument API does not survive.
6. Input keeps its React Native compatibility surface exactly. The semantic
   `onValueChange(value, details)` arrives with Field integration (F3), not
   before.
7. `trigger: unknown | undefined` ships as-is for v3. A first-class
   cross-platform target type needs an ownership/lifetime contract we do not
   want to invent speculatively.

Execution: migration phases 1 and 2 (core factory + `requestChange` in
use-controllable-state, then dismissable/focus-scope/roving-focus substrate +
popup conformance suite) are dispatchable as one packet ahead of C4 and do
not overlap current lane owner files. Phases 3 and 4 land with C2/C3/C4 as
planned.

## 7. Contract amendment (2026-07-16, post-integration regression)

`cancel()` NO LONGER calls the source event's `preventDefault()` (reverses the
section-1 wording). Proven wrong by a real regression: Select keeps its
content and Dismissable layer mounted while closed and always-cancels
outside-press details to defer to its own listener; with the preventDefault
bridge, every trigger press had its native document pointerdown
preventDefaulted and the select never opened (SelectTypeahead/SelectSkin, 5
tests). Vetoing a Tamagui state change and canceling a native default are
separate concerns (base-ui separates them as preventBaseUIHandler vs
preventDefault). Handlers that also want the native default canceled call
`details.event?.preventDefault?.()` explicitly. Two call sites depended on the
bridge and now do this: Dismissable's escape auto-dismiss (consuming escape
preventDefaults the keydown, matching pre-details behavior) and the submenu
self-close escape handler in createBaseMenu. The same regression also
unmasked a latent focus-outside bug, now fixed: browser focus fixup can land
focusin on an ancestor of the layer (the native <dialog> element when its
inner active element blurs); an ancestor gaining focus never counts as
focus-out.
