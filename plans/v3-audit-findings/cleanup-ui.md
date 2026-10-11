# cleanup-ui

## Summary

- [READ] `Menu.Trigger` lets caller event props overwrite its internal open and keyboard handlers because the final `...triggerProps` spread comes after those handlers.
- [INFERRED] `ContextMenu` advertises the shared `open` prop but keeps a separate local open state, so a controlled root can render an inner menu with a different state from its context.
- [READ] `tabs` and `tabs-headless` contain two complete tab state, keyboard, focus, and ARIA implementations. The headless package is not consumed anywhere else in the surveyed component, demo, or kitchen-sink trees.
- [READ] The native `useSwitch` branch drops the web branch's role, checked state, disabled event guard, and consumer `onPress`, while checkbox and radio headless hooks keep equivalent behavior across platforms.
- [READ] Portal's web implementation applies `open`, `hidden`, and `style`, while the native implementation only reads `children` and `passThrough`.
- [READ] Deep reading covered `create-menu`, `menu`, `context-menu`, `select`, `popover`, `popper`, `tooltip`, `dialog`, `alert-dialog`, `focus-scope`, `dismissable`, `portal`, `remove-scroll`, `checkbox`, `switch`, `radio-group`, `tabs`, `tabs-headless`, `field`, `input`, `form`, and `sheet`. The remaining `code/ui` packages, `code/demos`, and `code/kitchen-sink-shared` received the structural inventory, barrel, import, size, and targeted TODO/API survey only.

## Findings

### F1. `Menu.Trigger` overwrites its own event handlers  [severity: high] [size: S] [label: READ]

- Evidence: `code/ui/menu/src/createNonNativeMenu.tsx:120-122` declares the public prop as `onKeydown`, while `ViewProps` supplies the normal `onKeyDown`. The component destructures only `onKeydown` at `:285-292`, installs its composed press handler and `onKeyDown` at `:344-391`, then spreads `...triggerProps` at `:393`. Because `triggerProps` still contains `onKeyDown`, `onPointerDown`, `onClick`, or `onPress`, a caller can replace the internal handler after it was composed.
- Why it matters: [INFERRED] A caller-supplied `onKeyDown` can suppress Enter, Space, and ArrowDown menu opening. A caller-supplied pointer or press handler can suppress toggling entirely. This is a public interaction failure in the component most users use to open a menu.
- Proposed change: Make `onKeyDown` the single public spelling, destructure the relevant event props, and spread user props before the internal composed handlers. Add a runtime menu test that supplies each supported trigger event and verifies both the user callback and menu state transition.
- Risk / what could make this wrong: [GUESS] Some consumers may rely on the current overwrite behavior to intentionally suppress opening. That would be an undocumented behavior and should be replaced with `event.preventDefault()` or a documented cancellation path.

### F2. `ContextMenu` accepts controlled `open` but does not use it for its context  [severity: high] [size: M] [label: INFERRED]

- Evidence: `code/ui/create-menu/src/createBaseMenu.tsx:87-94` defines `MenuBaseProps.open` and `onOpenChange`, which flow into `ContextMenuProps` through `BaseMenuTypes.MenuProps` at `code/ui/context-menu/src/createNonNativeContextMenu.tsx:47-52`. `ContextMenuComp` creates an unconditional local state at `:105-108`, publishes that local value at `:120-127`, and passes it to the inner menu at `:129-134`; the original `open` prop remains in `rest` and is spread into that inner `<Menu>` at `:135`. `ContextMenuSub` separately uses the expected controllable pattern at `:485-501`.
- Why it matters: [INFERRED] A controlled `<ContextMenu open={...}>` can make the inner base menu open while the context provider still reports `open: false`; trigger ARIA state, trigger placement, close handling, and content state then read different sources. `defaultOpen` is also part of the sibling menu pattern but is not consumed by the root implementation.
- Proposed change: Destructure `open` and `defaultOpen` at the root, resolve them once with `useControllableState`, publish that resolved value to `ContextMenuProvider`, and pass the same value to the base menu. Keep the context-menu event-details callback as the one adapter around the shared `onOpenChange` contract.
- Risk / what could make this wrong: [GUESS] Context menus may have intentionally been trigger-only in some native adapters. The public type currently inherits `open`, so the implementation should either support it consistently or remove it from the public root type and test that narrower contract.

### F3. `tabs` and `tabs-headless` implement the same controller twice  [severity: med] [size: L] [label: READ]

- Evidence: `code/ui/tabs/src/Tabs.tsx:53-75` defines controlled value, default value, orientation, direction, and activation mode. Its trigger implements press, keyboard, and focus activation at `:224-291`, and the root owns the controllable state at `:328-365`. Independently, `code/ui/tabs-headless/src/useTabs.tsx:15-42` defines the same public state options, owns another controllable state at `:103-121`, implements its own tab registry and focus traversal at `:123-208`, and returns another trigger/content ARIA contract at `:211-257`. A bounded `rg` search for `@tamagui/tabs-headless|useTabs\(` across `code/ui`, `code/demos/src`, and `code/kitchen-sink-shared/src` found only the headless package's own source and generated declarations, so the component does not consume this controller.
- Why it matters: [INFERRED] Keyboard behavior, activation semantics, tab ordering, disabled handling, and ARIA details can drift between the public component and the headless package. The two implementations already use different focus models: `Tabs.tsx` delegates to `RovingFocusGroup`, while `useTabs.tsx` keeps an `HTMLElement` map and its own array order.
- Proposed change: Choose one behavior owner. `Tabs.tsx` is the current canonical implementation for the exported component because it owns the actual `Tabs` package and RovingFocus integration. Either make `tabs-headless` a thin adapter over a shared platform-neutral controller extracted from that behavior, or explicitly retire the package after checking its public release contract. Preserve platform-specific focus adapters at the edge.
- Risk / what could make this wrong: [GUESS] `tabs-headless` may be consumed by external applications even though this repository has no consumer. Any consolidation needs a declaration and migration check before removing its current hook surface.

### F4. Native `useSwitch` drops accessibility and consumer interaction behavior  [severity: med] [size: M] [label: READ]

- Evidence: `code/ui/switch-headless/src/useSwitch.tsx:84-93` returns only an `onPress` that toggles state, the ref, and a null bubble input when `TAMAGUI_TARGET` is native. The sibling branch at `:110-151` supplies `role: 'switch'`, `aria-checked`, `aria-labelledby`, disabled and data-state props, composes `props.onPress`, and creates the form bubble input. `code/ui/switch/src/Switch.tsx:112-116` consumes this hook directly. By comparison, `code/ui/checkbox-headless/src/useCheckbox.tsx:103-117` returns its role, checked state, disabled guard, and composed press handler without dropping them on native.
- Why it matters: [INFERRED] A non-native-rendered Switch on React Native loses the caller's `onPress` callback and the headless hook's accessibility state. Its `disabled` prop is still forwarded by the styled wrapper, but the hook's native interaction path itself does not guard or describe that state.
- Proposed change: Keep one composed switch interaction object for both platforms, then branch only the web form bubble input and platform-specific host props. Add native behavior coverage for `disabled`, `onPress`, `accessibilityRole`, and checked-state exposure.
- Risk / what could make this wrong: [GUESS] The separate `useSwitchNative` path may cover apps that always pass `native`; the affected path is the ordinary native target with no native host override, which still reaches `switchProps`.

### F5. Headless label prop spelling drifts across equivalent controls  [severity: low] [size: S] [label: READ]

- Evidence: `code/ui/checkbox-headless/src/useCheckbox.tsx:17-31` and `code/ui/radio-headless/src/useRadioGroup.tsx:67-76` expose `labelledBy`. `code/ui/switch-headless/src/useSwitch.tsx:11-20` instead exposes `labeledBy`, while consuming `props['aria-labelledby'] || props.labeledBy` at `:107-108`.
- Why it matters: [INFERRED] Users building interchangeable checkbox, radio, and switch headless wrappers cannot use one convenience prop spelling. The mismatch is user-visible in the public type surface even though all three hooks ultimately produce `aria-labelledby`.
- Proposed change: Standardize the convenience prop on the majority spelling, `labelledBy`, across the three headless controls and their styled wrappers. If compatibility is required, document one spelling and add the other only at the public type boundary during a deprecation window.
- Risk / what could make this wrong: [GUESS] Existing Switch consumers may already depend on the American spelling. A release note and type-level migration path would be needed before removing it.

### F6. Checked-state helpers are copied across menu and control packages  [severity: low] [size: S] [label: READ]

- Evidence: `code/ui/checkbox-headless/src/utils.tsx:3-8` exports `isIndeterminate` and `getState`. `code/ui/create-menu/src/createBaseMenu.tsx:1931-1937` contains the same `isIndeterminate` predicate and the same indeterminate/checked/unchecked state conversion under the names `isIndeterminate` and `getCheckedState`. `code/ui/radio-headless/src/utils.tsx:1-3` and `code/ui/switch-headless/src/useSwitch.tsx:25-27` each repeat the boolean checked-state conversion.
- Why it matters: [INFERRED] The menu checkbox item, checkbox, radio, and switch can drift in state-string semantics while each copy remains locally green. This is exactly the same `data-state` contract spread across sibling controls.
- Proposed change: Put one checked-state utility in an already low-level shared package, with an indeterminate-aware function and a boolean specialization, then route menu, checkbox, radio, and switch through it. `checkbox-headless` is the closest existing owner of the full indeterminate contract, but a lower-level helper avoids making `create-menu` depend on a control package.
- Risk / what could make this wrong: [GUESS] Introducing a new package dependency solely for two tiny functions may cost more than the code saved. The consolidation is worthwhile only if the shared helper lives in an existing low-level package.

### F7. Native Portal ignores shared `open` and `style` props  [severity: med] [size: M] [label: READ]

- Evidence: `code/ui/portal/src/PortalProps.tsx:5-22` exposes `style` and an `open` prop whose documentation says it enables pointer events. Web `code/ui/portal/src/Portal.tsx:26-46` applies `style` and sets the host `pointerEvents` to `open ? 'auto' : 'none'`. Native `code/ui/portal/src/Portal.native.tsx:8-22` destructures only `children` and `passThrough`, and its host always uses `pointerEvents="box-none"` at `:13`.
- Why it matters: [INFERRED] A component using the shared Portal contract can remain touchable when closed on native, and native callers cannot style the native portal host through the documented prop. Dialog, menu, popover, and sheet all use Portal, so this difference can surface in multiple overlay families.
- Proposed change: Mirror the shared `open` pointer-event contract and style forwarding in the native host, or narrow the shared type so those props are explicitly web-only and make every native overlay own its closed-state behavior. The first option keeps sibling overlay semantics aligned.
- Risk / what could make this wrong: [GUESS] Some native portal consumers may rely on the host remaining mounted and pass-through while their child controls visibility. Preserve mounting and change only host interaction semantics, with overlay tests for closed, exit-animation, and nested cases.

### F8. `Dismissable` ships an unconditional debug logger  [severity: low] [size: S] [label: READ]

- Evidence: `code/ui/dismissable/src/Dismissable.tsx:57-64` exports `debugDismissableLayers()` and calls `console.log('[Dismissable] Active layers:', ...)` every time the helper is invoked. A bounded `rg` search for `debugDismissableLayers` across `code/ui`, `code/demos/src`, and `code/kitchen-sink-shared/src` found only its declaration and generated declaration output, with no in-repo caller.
- Why it matters: [INFERRED] Any consumer or diagnostic path that calls this exported helper writes a raw layer dump to production logs. The helper is also a one-off debug surface absent from the native Dismissable barrel, so it increases API and platform drift without a known internal use.
- Proposed change: Remove the logger and either remove the unused helper or make it a pure snapshot function behind an explicitly supported diagnostics API. Keep `getDismissableLayerCount()` for the actual non-React use cases.
- Risk / what could make this wrong: [GUESS] External debugging code may import the helper. If it is retained for compatibility, the minimum safe change is deleting the unconditional `console.log`.

## Ideas (speculative, not findings)

### I1. Audit the remaining intentionally empty native/web adapters as one package policy

`code/ui/react-native-web/src/index.tsx:1`, `code/ui/sheet/src/nativeSheet.tsx:84-86`, and several native dismissable/focus/remove-scroll stubs contain TODO or no-op adapters. I did not classify these as defects because their package contracts may intentionally make the feature a platform no-op. A single documented policy for intentional stubs would make future dead-code sweeps faster.
