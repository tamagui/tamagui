# Render-Path Waste Outside the Style Engine

This document reports render-path waste identified in Tamagui V3 (`v3-beta`) **outside** the style engine (`getSplitStyles.tsx`, `directStyle.ts`, and `propMapper.ts` were strictly excluded from reporting).

Every finding cites exact `file:line` locations read directly from source, documents all consumers across the repository, explains the win in terms of V3 goals (React Strict DOM / web-first alignment, fewer abstractions, no runtime defensive taxes, and heap/work reduction), assesses risk and effort, and notes execution frequency.

---

## Ranked Findings Summary

| # | Finding | Location | Frequency | Value / Impact | Risk | Effort |
|---|---|---|---|---|---|---|
| 1 | `ThemeState` machinery, `useId`, `useReducer`, `useEffect`, and global `Map` updates on every leaf styled component | `useThemeState.ts:103-273`<br>`useTheme.tsx:45-61`<br>`createComponent.tsx:727-753, 818` | **Per render** of every styled component | **High**: Eliminates 1 hook slot (`useReducer`), 1 `useId` string, 1 `useEffect`, `themeStateProps` allocation, and 2 global `Map` writes per component instance | Medium | Medium |
| 2 | Unconditional `useMedia` hook slots (`useReducer`, layout effect, commit effect) and WeakMap writes on every component | `useMedia.tsx:316-497`<br>`createComponent.tsx:831, 1285-1290` | **Per render + per commit** of every styled component | **High**: Eliminates 1 `useReducer`, 1 layout effect, 1 commit effect, and 1 WeakMap allocation per component with no media styles | Medium | Medium |
| 3 | Double object rest-spread (`...nonTamaguiProps` and `...plainDOMProps`) copying 20+ properties per render | `createComponent.tsx:1302-1328`<br>`code/core/core/src/runtime.tsx:110-141` | **Per render** of every DOM component (runs twice) | **High**: Eliminates 2 intermediate heap object allocations and 40+ property copies per element | Low | Low |
| 4 | Double event object allocation and `undefined` prop injection in `getWebEvents` | `createComponent.tsx:1720-1851`<br>`eventHandling.ts:10-22` | **Per render** of interactive/hovered/focused elements | **High**: Eliminates 2 intermediate heap objects (5-7 closures + 9-property mapped object) and stops injecting `undefined` event handlers onto DOM props | Low | Low |
| 5 | Synchronous safe-area layout effect forces an immediate mount re-render on web | `createComponent.tsx:1601-1610`<br>`resolveSafeAreaVariable.ts:8-10` | **Per mount** of any component with safe area styles (`pt="safe"`, etc.) | **High**: Deletes an unnecessary full second render on mount for safe-area components on web | Zero | Low |
| 6 | `objectIdentityKey` dynamic property walk and `Math.random()` caching in render effect deps and context memo | `objectIdentityKey.tsx:1-21`<br>`createComponent.tsx:1631-1632`<br>`createStyledContext.tsx:144` | **Per render** of grouped components and context providers | **Medium-High**: Eliminates string concatenation loops and `Math.random()` WeakMap caching on the render path | Low | Low |
| 7 | `useRenderElement.tsx` is completely unused dead code | `useRenderElement.tsx:1-74` | **Bundle / module load** | **Medium**: Deletes 74 lines of dead code, removing imports of `@tamagui/compose-refs` and `mergeSlotStyleProps` from this path | Zero | Trivial |
| 8 | `React.Children.toArray(props.children)` traverses and clones child elements on every `<View>` render in dev | `createComponent.tsx:1505-1517` | **Per render** of every `<View>` in development | **Medium**: Eliminates expensive React element cloning and array allocation on large trees in dev | Low | Low |
| 9 | `pressDebugName` / `pressDebugDetail` allocates array, `.filter(Boolean)`, and `.join(':')` on every render for a web no-op | `createComponent.tsx:1862-1872` | **Per render** of every component | **Medium**: Eliminates array allocation, filter, join, and 6 property reads per render | Zero | Trivial |
| 10 | `getStyledContextKeys` creates `{}` and loops over static `propKeys` every render | `createComponent.tsx:103-120, 852` | **Per render** of styled-context consuming components | **Medium**: Replaces per-render object allocation and key copy with a hoisted/static mask | Low | Low |
| 11 | Broken and wasteful `Object.keys([...pseudoGroups]).join('')` in `useProps.tsx` | `useProps.tsx:172-173` | **Per render** of `useProps` / `usePropsAndStyle` | **Medium**: Fixes index-based comparison bug and eliminates 2 array allocations + 1 string allocation per group | Zero | Trivial |
| 12 | `mergeComponentProps` allocates a 2-element tuple on every component render | `mergeProps.ts:42-91`<br>`createComponent.tsx:413-417` | **Per render** of every component | **Medium**: Eliminates array tuple allocation on every single component render | Low | Low |
| 13 | `Slot.tsx` hidden class de-optimization (`delete slotProps[key]`) and per-prop regex | `Slot.tsx:59-86`<br>`mergeSlotStyleProps.ts:4, 34` | **Per prop** per `Slot` / `asChild` render | **Medium**: Prevents V8 transition to dictionary mode and eliminates regex tests on every prop | Low | Low |
| 14 | Native `pointerEvents.native.ts` takes `useRef` and allocates state on mount for all components | `pointerEvents.native.ts:28-41` | **Per mount** of every component on native | **Medium**: Saves 1 hook slot and 1 heap object on mount for components without pointer events | Zero | Low |
| 15 | IIFE closure and redundant dual `resolveAnimationDriver` validation on every render | `createComponent.tsx:499-520`<br>`resolveAnimationDriver.ts:3-26` | **Per render** of every component | **Low-Medium**: Eliminates per-render closure allocation and redundant type/field validation of normalized animation drivers | Zero | Trivial |
| 16 | Legacy React Native accessibility checks in `isDisabled` on web | `useComponentState.ts:434-442` | **Per render** of every component | **Low-Medium**: Deletes 2 RN-exclusive property reads (`accessibilityState?.disabled`, `accessibilityDisabled`) on web | Zero | Trivial |
| 17 | `Math.random()` executed 3 times on context creation in `createStyledContext.tsx` | `createStyledContext.tsx:84-93` | **Per context creation** | **Low**: Removes useless random number generation and bizarre string indirection | Zero | Trivial |
| 18 | `getMediaState` creates multiple arrays and `mediaKeyMatch` runs `startsWith`/`endsWith` in a loop | `useMedia.tsx:506-546` | **Per layout change** of container/group subscribers | **Low**: Pre-parses query descriptors to eliminate string method calls and temporary array allocations | Low | Low |
| 19 | `expandStyle.ts` allocates array of `[key, value]` tuples on every shorthand expansion | `expandStyle.ts:161, 170, 174` | **Per expanded shorthand** (margin, padding, inset) | **Low**: Eliminates tuple array allocations during style expansion | Low | Low |
| 20 | `styleToCSS` (in `getCSSStylesAtomic.ts`) mutates style objects with `delete` operator | `getCSSStylesAtomic.ts:188-191` | **Per shadow style object** | **Low**: Prevents V8 hidden class de-optimization on style objects | Low | Trivial |

---

## Detailed Findings

### 1. `ThemeState` machinery and hook slots on every leaf styled component
- **What**: Leaf styled components (the overwhelming majority of components rendered in an app) do not provide a theme context to descendants. Yet every component calling `createComponent` invokes `useThemeWithState`, which:
  1. Allocates `themeStateProps` (`{ disable, shallow, debug, name? }`) on every render (`createComponent.tsx:727-737`).
  2. Allocates `bag = useRef({ keys: { current: null }, schemeKeys: { current: null }, optimizeForFirstRender })` on mount (`useTheme.tsx:45-52`).
  3. Calls `useId()` on every render (`useThemeState.ts:146`), generating a unique tree ID string for components whose ID is never consumed by any child.
  4. Runs `getPropsKey(props)` (`useThemeState.ts:147`), doing string template interpolation `${name || ''}${reset || ''}${forceClassName || ''}${_themeUpdate?.key || ''}` on every render.
  5. Takes a `useReducer(incReducer, 0)` hook slot (`useThemeState.ts:189`).
  6. Writes to global module Maps `states.set(id, next)` and `localStates.set(id, local)` on every render (`useThemeState.ts:439, 465`).
  7. Installs a `useEffect` hook (`useThemeState.ts:193-273`) with unmount/cleanup logic for the global Maps.
- **File:Line**:
  - `code/core/web/src/hooks/useThemeState.ts:103-273`
  - `code/core/web/src/hooks/useTheme.tsx:45-61`
  - `code/core/web/src/createComponent.tsx:727-753, 818`
- **Who consumes it**:
  - `createComponent.tsx:818` consumes `[theme, themeState] = useThemeWithState(themeStateProps)`.
  - Only `<Theme>` views (`code/core/web/src/views/Theme.tsx:52, 127-129`) actually provide `ThemeStateContext.Provider` to descendants. Leaf components never mount `ThemeStateContext.Provider`.
- **Why it is a win**:
  - Leaf components can read the current theme directly from `ThemeStateContext` without allocating a unique `useId`, `ThemeStateRef`, `useReducer`, `useEffect`, or populating global Maps `states`/`localStates`.
  - On web with CSS variables, the theme object values are static CSS variable strings (`var(--color)`); leaf components do not need dynamic subscription state unless they declare a new sub-theme.
- **Risk**: Medium. Splitting `useThemeWithState` into "read theme resource" (fast path for leaves) and "manage theme provider state" (for `<Theme>`) requires careful verification of theme inheritance.
- **Effort**: Medium.
- **Frequency**: **Per render** of every styled component in the application.

---

### 2. Unconditional `useMedia` hook overhead on every component
- **What**: Every component created by `createComponent` calls `useMedia(componentContext, debugProp, stateRef.current)` unconditionally (`createComponent.tsx:831`). Inside `useMedia`:
  1. `useReducer(incReducer, 0)` (`useMedia.tsx:434`) is mounted for every component.
  2. `useIsomorphicLayoutEffect` (`useMedia.tsx:446-455`) runs on mount for every component.
  3. `useEffect` (`useMedia.tsx:457-494`) runs without a dependency array, executing on **every commit** for every component.
  4. `ref.keys.clear()` (`useMedia.tsx:426`) runs on every render.
  5. `setMediaShouldUpdate` (`createComponent.tsx:1285-1290`, `useMedia.tsx:210-227`) allocates a new object `{ ...cur, enabled, keys }` and writes to `States` WeakMap on every render if keys are present.
- **File:Line**:
  - `code/core/web/src/hooks/useMedia.tsx:316-497`
  - `code/core/web/src/createComponent.tsx:831, 1285-1290`
- **Who consumes it**: `createComponent.tsx:831` passes `mediaState` into `styleProps` (`createComponent.tsx:845`).
- **Why it is a win**:
  - Components without media queries or whose styles are compiled/static do not need runtime media subscriptions.
  - On web, media queries are handled natively by CSS `@media` rules (`noClass !== true`). The JS `useMedia` listener is only needed when JS logic or non-CSS drivers actively evaluate media keys.
- **Risk**: Medium. Media subscription must still be activated whenever a component accesses runtime media keys.
- **Effort**: Medium.
- **Frequency**: **Per render and per commit** of every styled component.

---

### 3. Double object rest-spread (`...nonTamaguiProps` and `...plainDOMProps`) copying 20+ properties per render
- **What**: Props are twice subjected to massive explicit destructuring with rest-spread allocations on the render path of every DOM component:
  1. In `createComponent.tsx:1302-1328`, 23 props (`asChild`, `children`, `themeShallow`, `onPress`, `onLongPress`, `onPressIn`, `onPressOut`, `onHoverIn`, `onHoverOut`, `onMouseUp`, `onMouseDown`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, `onTransition`, `separator`, `passThrough`, `forceStyle`, `onClick`, `theme`, etc.) are destructured, allocating a new `nonTamaguiProps` object via `...nonTamaguiProps`.
  2. In `code/core/core/src/runtime.tsx:110-141` (`usePropsTransform`), 21 props (`onMoveShouldSetResponder`, `onMoveShouldSetResponderCapture`, `onResponderEnd`, `onResponderGrant`, `onResponderMove`, `onResponderReject`, `onResponderRelease`, `onResponderStart`, `onResponderTerminate`, `onResponderTerminationRequest`, `onScrollShouldSetResponder`, `onScrollShouldSetResponderCapture`, `onSelectionChangeShouldSetResponder`, `onSelectionChangeShouldSetResponderCapture`, `onStartShouldSetResponder`, `onStartShouldSetResponderCapture`, `collapsable`, `focusable`, `accessible`, `accessibilityDisabled`, `onLayout`, `hrefAttrs`) are destructured from `propsIn`, allocating another new `plainDOMProps` object via `...plainDOMProps`.
- **File:Line**:
  - `code/core/web/src/createComponent.tsx:1302-1328`
  - `code/core/core/src/runtime.tsx:110-141`
- **Who consumes it**: `createComponent.tsx:1332` sets `viewProps = nonTamaguiProps`, then passes it to `usePropsTransform`, which returns `plainDOMProps` passed to `React.createElement(elementType, viewProps, ...)`.
- **Why it is a win**:
  - Object rest-spread (`...rest`) is an expensive O(N) operation that allocates a fresh object and iterates all enumerable own properties.
  - Doing this twice on every render for every DOM element creates unnecessary garbage and CPU churn.
  - Many of the stripped props in `runtime.tsx` (the 16 `onResponder*` handlers) are legacy React Native responder props that web components do not receive unless explicitly authored.
- **Risk**: Low. Ensure props intended for host DOM elements are properly forwarded.
- **Effort**: Low-Medium.
- **Frequency**: **Per render** of every DOM component (executes twice per element).

---

### 4. Double event object allocation and `undefined` prop injection in `getWebEvents`
- **What**: When a component is interactive or has hover/press/focus styles:
  1. `createComponent.tsx:1720-1834` allocates an `events` object containing 5-7 closures (`onPressOut`, `onMouseEnter`, `onMouseLeave`, `onPressIn`, `onPress`, `onFocus`, `onBlur`).
  2. `createComponent.tsx:1850` calls `Object.assign(viewProps, getWebEvents(events))`.
  3. `eventHandling.ts:10-22` (`getWebEvents`) allocates a **second** object with 9 fixed properties:
     ```ts
     export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
       return {
         onMouseEnter: events.onMouseEnter,
         onMouseLeave: events.onMouseLeave,
         [webStyle ? 'onClick' : 'onPress']: events.onPress,
         onMouseDown: events.onPressIn,
         onMouseUp: events.onPressOut,
         onTouchStart: events.onPressIn,
         onTouchEnd: events.onPressOut,
         onFocus: events.onFocus,
         onBlur: events.onBlur,
       }
     }
     ```
  4. For unattached handlers (e.g. `onFocus`, `onBlur`, `onTouchStart`), `getWebEvents` sets the property to `undefined`, which `Object.assign` copies onto `viewProps`. React DOM receives explicit `undefined` event handler props.
  5. On `asChild` (`createComponent.tsx:1899-1912`), another intermediate object is created and passed through `getWebEvents`.
- **File:Line**:
  - `code/core/web/src/createComponent.tsx:1720-1851`
  - `code/core/web/src/eventHandling.ts:10-22`
- **Who consumes it**: Assigned onto `viewProps` and passed to `React.createElement`.
- **Why it is a win**:
  - Directly attaches active event handlers onto `viewProps` without allocating the intermediate `events` object and without calling `getWebEvents`.
  - Eliminates 2 heap object allocations and avoids cluttering DOM props with `undefined` values.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per render** of every interactive/hovered/focused component.

---

### 5. Synchronous safe-area layout effect forces an immediate mount re-render on web
- **What**: In `createComponent.tsx:1601-1610`:
  ```ts
  let disposeSafeArea: (() => void) | undefined
  if (splitStyles?.usesSafeArea) {
    const updateSafeArea = () => {
      setState((previous) => ({ ...previous }))
    }
    disposeSafeArea = subscribeToSafeArea(updateSafeArea)
    // close the render-to-subscribe race: the provider tracker may have
    // published new insets after this component evaluated its styles.
    updateSafeArea()
  }
  ```
  - On web, `subscribeToSafeArea` (`resolveSafeAreaVariable.ts:8-10`) is a no-op returning `undefined` because safe area on web is handled by CSS `env(safe-area-inset-*)`.
  - However, line 1609 calls `updateSafeArea()` unconditionally inside the layout effect whenever `splitStyles?.usesSafeArea` is truthy (e.g. `<View pt="safe" />`).
  - Calling `updateSafeArea()` immediately invokes `setState(prev => ({ ...prev }))`, synchronously scheduling a state update and forcing a **second render** of the component on mount on web.
- **File:Line**:
  - `code/core/web/src/createComponent.tsx:1601-1610`
  - `code/core/web/src/helpers/resolveSafeAreaVariable.ts:8-10`
- **Who consumes it**: `createComponent.tsx` layout effect for components using safe-area properties.
- **Why it is a win**:
  - Prevents a forced, redundant re-render on mount for any component utilizing safe-area insets on web.
- **Risk**: Zero on web (CSS `env()` handles safe area directly in the browser stylesheet).
- **Effort**: Low (guard with `process.env.TAMAGUI_TARGET === 'native'`).
- **Frequency**: **Per mount** of any component using safe-area props (`pt="safe"`, `padding="safe"`, etc.).

---

### 6. `objectIdentityKey` dynamic property walk and `Math.random()` caching in render effect deps and context memo
- **What**: `objectIdentityKey` loops over all enumerable properties of an object, concatenating types and values (`k += type + arg`), generating `Math.random()` values for object/function values not in a `WeakMap cache`, and returning a composite string.
  - In `createComponent.tsx:1631-1632`: called on **every render** in the dependency array of `useIsomorphicLayoutEffect` (`pseudoGroups ? objectIdentityKey(pseudoGroups) : 0` and `mediaGroups ? objectIdentityKey(mediaGroups) : 0`).
  - In `createStyledContext.tsx:144`: called on **every render** of context Provider (`useReactMemo(..., [objectIdentityKey(values)])`).
- **File:Line**:
  - `code/core/web/src/helpers/objectIdentityKey.tsx:1-21`
  - `code/core/web/src/createComponent.tsx:1631-1632`
  - `code/core/web/src/helpers/createStyledContext.tsx:144`
- **Who consumes it**:
  - `createComponent.tsx:1631-1632` hook dependencies.
  - `createStyledContext.tsx:144` memo dependencies.
  - `code/ui/popper/src/Popper.tsx:139` memo dependencies.
- **Why it is a win**:
  - Eliminates string concatenation loops, `WeakMap` lookups/mutations, and `Math.random()` calls on the render hot path.
  - Set instances (`pseudoGroups`, `mediaGroups`) can be tracked via identity, size, or version counter instead of serializing their contents to a string every render.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per render** of components with group/container queries and context providers.

---

### 7. `useRenderElement.tsx` is completely unused dead code
- **What**: `code/core/web/src/helpers/useRenderElement.tsx` exports `evaluateRenderProp`.
  - A search across the entire repository reveals that `evaluateRenderProp` is imported by zero files (only its own `.d.ts` declaration file references it).
  - `createComponent.tsx:2251-2286` has its own hand-rolled `getCustomRender` function instead.
- **File:Line**: `code/core/web/src/helpers/useRenderElement.tsx:1-74`
- **Who consumes it**: **Zero consumers** in the entire codebase.
- **Why it is a win**:
  - Deletes 74 lines of unmaintained dead code.
  - Removes an unused import of `@tamagui/compose-refs` and `mergeSlotStyleProps` from this path.
- **Risk**: Zero (unreferenced file).
- **Effort**: Trivial (delete file).
- **Frequency**: Module load / bundle time.

---

### 8. `React.Children.toArray(props.children)` traverses and clones child elements on every `<View>` render in dev
- **What**: In development mode, `createComponent.tsx:1507-1516` runs:
  ```ts
  if (process.env.NODE_ENV === 'development') {
    if (!isReactNative && !isText && isWeb && !isHOC) {
      React.Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string' && item !== '\n') {
          console.error(
            `Unexpected text node: ${item}. A text node cannot be a child of a <${displayName || propsIn.tag || 'View'}>.`,
            props
          )
        }
      })
    }
  }
  ```
  - `React.Children.toArray` recursively traverses children, flattens nested arrays/fragments, and clones every React element to assign unique `.$key` prefixes.
  - This executes on **every single render** of every non-text `<View>` in development.
- **File:Line**: `code/core/web/src/createComponent.tsx:1505-1517`
- **Who consumes it**: Development console warning.
- **Why it is a win**:
  - `React.Children.toArray` is notoriously slow in React applications with deep trees or many elements.
  - A simple `typeof props.children === 'string'` check or basic array walk (without `React.Children.toArray`) checks for bare strings without cloning child elements or allocating key-assigned arrays.
- **Risk**: Low (dev-only diagnostic).
- **Effort**: Low.
- **Frequency**: **Per render** of every `<View>` in development.

---

### 9. `pressDebugName` / `pressDebugDetail` allocates array, `.filter(Boolean)`, and `.join(':')` on every render for a web no-op
- **What**: In `createComponent.tsx:1862-1872`:
  ```ts
  const pressDebugDetail =
    props.testID ??
    propsIn.testID ??
    props.accessibilityLabel ??
    propsIn.accessibilityLabel ??
    (typeof propsWithHref.href === 'string' ? propsWithHref.href : null) ??
    (typeof propsInWithHref.href === 'string' ? propsInWithHref.href : null)

  const pressDebugName =
    [displayName, pressDebugDetail].filter(Boolean).join(':') || null
  ```
  - Executes 6 fallback property reads, creates an array `[displayName, pressDebugDetail]`, calls `.filter(Boolean)`, and calls `.join(':')` on every render of every component.
  - Line 1887 passes `pressDebugName` into `useEvents(...)`.
  - On web, `useEvents` (`code/core/web/src/eventHandling.ts:37-48`) is a no-op that ignores `_debugName` and returns `null`.
- **File:Line**: `code/core/web/src/createComponent.tsx:1862-1872`
- **Who consumes it**: Passed to `useEvents` at `createComponent.tsx:1887`. Used on native for RNGH gesture debug naming (`eventHandling.native.ts:251`). Completely unused on web.
- **Why it is a win**:
  - Eliminates array allocation, `.filter(Boolean)`, `.join(':')`, and 6 property reads on every render.
  - On web, this entire block should be eliminated (`process.env.TAMAGUI_TARGET === 'native'`).
- **Risk**: Zero.
- **Effort**: Trivial.
- **Frequency**: **Per render** of every component.

---

### 10. `getStyledContextKeys` creates `{}` and loops over static `propKeys` every render
- **What**: In `createComponent.tsx:103-120`:
  ```ts
  function getStyledContextKeys(
    staticConfig: StaticConfig,
    styledContextValue: GenericProps | undefined
  ) {
    const propKeys = staticConfig.contextProps || staticConfig.context?.propKeys
    if (!propKeys) {
      return styledContextValue
    }

    const out: GenericProps = {}
    for (const key of propKeys) {
      out[key] = true
    }
    if (styledContextValue) {
      Object.assign(out, styledContextValue)
    }
    return out
  }
  ```
  - Called at `createComponent.tsx:852` on every render to build `styleProps.styledContext`.
  - `propKeys` is static metadata defined on `staticConfig`. Constructing `out = {}` and populating `out[key] = true` in a loop runs repeatedly for every render of any component with context props.
- **File:Line**: `code/core/web/src/createComponent.tsx:103-120, 852`
- **Who consumes it**: `useSplitStyles` via `styleProps.styledContext`.
- **Why it is a win**:
  - The default boolean mask `{ [key]: true }` can be compiled once onto `staticConfig` at definition time, so the per-render step only does `Object.assign` (or direct lookup) when `styledContextValue` is provided.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per render** of every styled-context consuming component.

---

### 11. Broken and wasteful `Object.keys([...pseudoGroups]).join('')` in `useProps.tsx`
- **What**: In `code/core/web/src/hooks/useProps.tsx:172-173`:
  ```ts
  pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
  mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
  ```
  - Spreads the Set into an array `[...pseudoGroups]`.
  - Calls `Object.keys(array)` which returns array **indices** `['0', '1', ...]`.
  - Calls `.join('')` which concatenates indices into `"01"`.
  - This is both a semantic bug (two sets with the same number of items produce the exact same string `"01"` regardless of group names) and wasteful (allocates 2 arrays and 1 string on every render).
- **File:Line**: `code/core/web/src/hooks/useProps.tsx:172-173`
- **Who consumes it**: `useIsomorphicLayoutEffect` dependency array in `usePropsAndStyle`.
- **Why it is a win**:
  - Fixes the bug so group name changes properly trigger the effect.
  - Eliminates array spread, `Object.keys`, and string joining per render.
- **Risk**: Zero.
- **Effort**: Trivial.
- **Frequency**: **Per render** of `useProps` / `usePropsAndStyle`.

---

### 12. `mergeComponentProps` allocates a 2-element tuple on every component render
- **What**: In `code/core/web/src/helpers/mergeProps.ts:42-91`:
  ```ts
  export const mergeComponentProps = (
    defaultProps: object | null | undefined,
    contextProps: object | undefined,
    props: object
  ) => {
    let overriddenContext: GenericProps | null = null

    if (!defaultProps && !contextProps) {
      return [props, overriddenContext] as const
    }
    // ...
    return [out, overriddenContext] as const
  }
  ```
  - In `createComponent.tsx:413`, `const [nextProps, overrides] = mergeComponentProps(...)` destructures the returned tuple.
  - Even in the fast path where there are no default props and no context props, a new 2-element array `[props, null]` is allocated on the heap on every render.
- **File:Line**:
  - `code/core/web/src/helpers/mergeProps.ts:42-91`
  - `code/core/web/src/createComponent.tsx:413-417`
- **Who consumes it**: `createComponent.tsx:413`.
- **Why it is a win**:
  - Inlining the check (`if (!resolvedDefaultProps && !styledContextValue)`) avoids allocating a 2-element array tuple and destructuring it on every single component render.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per render** of every component.

---

### 13. `Slot.tsx` hidden class de-optimization (`delete slotProps[key]`) and per-prop regex
- **What**: In `code/core/web/src/views/Slot.tsx:65-70, 78-83`:
  ```ts
  if (isHTMLChild) {
    for (const key in pressMap) {
      if (key in slotProps) {
        slotProps[pressMap[key]] = slotProps[key]
        delete slotProps[key]
      }
    }
  }
  ```
  - Using the `delete` operator on `slotProps` and `merged` mutates objects into dictionary mode, permanently disabling V8 hidden class shape optimizations for those objects.
  - In `code/core/web/src/helpers/mergeSlotStyleProps.ts:4, 34`:
    ```ts
    const isEventHandler = /^on[A-Z]/
    // ...
    isEventHandler.test(key)
    ```
    Runs regex test `/^on[A-Z]/` on every single property key of the merged slot props.
- **File:Line**:
  - `code/core/web/src/views/Slot.tsx:59-86`
  - `code/core/web/src/helpers/mergeSlotStyleProps.ts:4, 34`
- **Who consumes it**: Radix / Tamagui `Slot` (`asChild`).
- **Why it is a win**:
  - Setting keys to `undefined` or copying to a clean object avoids V8 dictionary mode de-optimization.
  - Replacing regex with a character code check (`key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) >= 65 && key.charCodeAt(2) <= 90`) is much faster than running regex per prop.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per prop** on every `Slot` / `asChild` render.

---

### 14. Native `pointerEvents.native.ts` takes `useRef` and allocates state on mount for all components
- **What**: In `code/core/web/src/helpers/pointerEvents.native.ts:28-41`:
  ```ts
  const ref = useRef<{
    isInside: boolean
    layout: { width: number; height: number }
    isCaptured: boolean
  } | null>(null)
  if (!ref.current) {
    ref.current = { isInside: false, layout: { width: 0, height: 0 }, isCaptured: false }
  }

  if (!hasPointerEvents) return
  ```
  - `useRef` is called on every component on native, allocating an object `{ isInside: false, layout: { width: 0, height: 0 }, isCaptured: false }` on mount.
  - The `if (!hasPointerEvents) return` bailout is placed **after** the `useRef` call.
- **File:Line**: `code/core/web/src/helpers/pointerEvents.native.ts:28-41`
- **Who consumes it**: `createComponent.tsx:1503` on native.
- **Why it is a win**:
  - 99.9% of components do not use pointer events (`onPointerDown`, `onPointerUp`, etc.).
  - Bailing before hook allocation (or only calling `usePointerEvents` when pointer props are present) saves 1 hook slot and 1 heap object on mount for almost every component on native.
- **Risk**: Zero.
- **Effort**: Low.
- **Frequency**: **Per mount** of every component on native.

---

### 15. IIFE closure and redundant dual `resolveAnimationDriver` validation on every render
- **What**: In `createComponent.tsx:499-520`:
  - An IIFE arrow function `const animationDriver = (() => { ... })()` is allocated and invoked on every render.
  - Inside, `resolveAnimationDriver(componentContext.animationDriver) ?? resolveAnimationDriver(config?.animations)` calls `resolveAnimationDriver` twice.
  - `resolveAnimationDriver` (`resolveAnimationDriver.ts:3-26`) performs `typeof value !== 'object'`, `'isStub' in value`, `'useAnimations' in value`, and `'default' in driver` checks on drivers that were already normalized at configuration time (`TamaguiProvider.tsx:54-57` or `createTamagui`).
- **File:Line**:
  - `code/core/web/src/createComponent.tsx:499-520`
  - `code/core/web/src/helpers/resolveAnimationDriver.ts:3-26`
- **Who consumes it**: `createComponent.tsx` animation setup and `useComponentState`.
- **Why it is a win**:
  - Inlining the property lookup (`props.animatedBy ? ... : componentContext.animationDriver || config?.animations`) eliminates closure allocation and redundant type checks per render.
- **Risk**: Zero.
- **Effort**: Trivial.
- **Frequency**: **Per render** of every component.

---

### 16. Legacy React Native accessibility checks in `isDisabled` on web
- **What**: In `code/core/web/src/hooks/useComponentState.ts:434-442`:
  ```ts
  const isDisabled = (props: any) => {
    return (
      props.disabled ||
      props.passThrough ||
      props.accessibilityState?.disabled ||
      props['aria-disabled'] ||
      props.accessibilityDisabled ||
      false
    )
  }
  ```
  - For every component render on web, checks `accessibilityState?.disabled` (nested property lookup) and `accessibilityDisabled`.
  - In V3 web-first alignment, web authoring uses standard `disabled` or `aria-disabled`; React Native compatibility is handled via native adapters.
- **File:Line**: `code/core/web/src/hooks/useComponentState.ts:434-442`
- **Who consumes it**: `useComponentState` line 258.
- **Why it is a win**:
  - Deletes 2 legacy React Native property lookups per component render on web and aligns with V3 web-first direction.
- **Risk**: Zero on web.
- **Effort**: Trivial.
- **Frequency**: **Per render** of every component.

---

### 17. `Math.random()` executed 3 times on context creation in `createStyledContext.tsx`
- **What**: In `code/core/web/src/helpers/createStyledContext.tsx:84-93`:
  ```ts
  const createReactContext = React[
    Math.random() ? 'createContext' : 'createContext'
  ] as typeof React.createContext
  const useReactMemo = React[
    Math.random() ? 'useMemo' : 'useMemo'
  ] as typeof React.useMemo
  const useReactContext = React[
    Math.random() ? 'useContext' : 'useContext'
  ] as typeof React.useContext
  ```
  - Uses `Math.random()` to dynamically index static React methods `'createContext'`, `'useMemo'`, `'useContext'`.
- **File:Line**: `code/core/web/src/helpers/createStyledContext.tsx:84-93`
- **Who consumes it**: `createStyledContext` factory invocations (e.g. `ComponentContext`).
- **Why it is a win**:
  - Removes dead random number generation and bizarre string indirection.
- **Risk**: Zero.
- **Effort**: Trivial.
- **Frequency**: Per context creation.

---

### 18. `getMediaState` creates multiple arrays and `mediaKeyMatch` runs `startsWith`/`endsWith` in a loop
- **What**: In `code/core/web/src/hooks/useMedia.tsx:506-546`:
  - `getMediaState`: `[...mediaGroups].map(...)` creates 2 arrays, and `Object.fromEntries` creates a third.
  - `mediaKeyMatch`: for every query key in `mediaQueryConfig[key]`, runs `query.startsWith('max')` and `query.endsWith('Width')` every time container layout changes.
- **File:Line**: `code/core/web/src/hooks/useMedia.tsx:506-546`
- **Who consumes it**: `subscribeToContextGroup.tsx:71` when a group/container element fires `onLayout`.
- **Why it is a win**:
  - Pre-normalizing media query keys into parsed boolean flags (`isMax: boolean`, `isWidth: boolean`, `expectedVal: number`) at config time avoids string operations and temporary array allocations during layout callbacks.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per container layout update** of every container/group subscriber.

---

### 19. `expandStyle.ts` allocates array of `[key, value]` tuples on every shorthand expansion
- **What**: In `code/core/web/src/helpers/expandStyle.ts:161, 170, 174`:
  ```ts
  if (key in universalExpansions) {
    return universalExpansions[key].map((k) => [k, value])
  }
  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map((k) => [k, value])
  }
  ```
  - Allocates an outer array and N inner 2-element tuple arrays `[k, value]` for every expanded shorthand (`margin`, `padding`, `inset`, `borderColor`, `borderWidth`, etc.).
- **File:Line**: `code/core/web/src/helpers/expandStyle.ts:161, 170, 174`
- **Who consumes it**: `normalizeStyle.ts:25-28`, `code/core/animations-motion/src/createAnimations.tsx:109`.
- **Why it is a win**:
  - Expanding directly into a target output slot or passing a callback avoids allocating intermediate tuple arrays on every expanded shorthand.
- **Risk**: Low.
- **Effort**: Low.
- **Frequency**: **Per expanded shorthand property** during style normalization.

---

### 20. `styleToCSS` (in `getCSSStylesAtomic.ts`) mutates style objects with `delete` operator
- **What**: In `code/core/web/src/helpers/getCSSStylesAtomic.ts:188-191`:
  ```ts
  delete style.shadowOffset
  delete style.shadowRadius
  delete style.shadowColor
  delete style.shadowOpacity
  ```
  - Mutating input style objects with `delete` forces V8 into dictionary mode and disables hidden class optimizations.
- **File:Line**: `code/core/web/src/helpers/getCSSStylesAtomic.ts:188-191`
- **Who consumes it**: `getCSSStylesAtomic` when shadow styles are normalized into `boxShadow`.
- **Why it is a win**:
  - Assigning `undefined` or copying to clean output avoids V8 shape transitions to dictionary mode.
- **Risk**: Low.
- **Effort**: Trivial.
- **Frequency**: **Per shadow style object** processed by atomic CSS generator.

---

## Checked and Found Clean

The following in-scope files and modules were read and verified to have no significant render-path waste:

1. `code/core/web/src/hooks/useAnimationDriver.ts`: Direct context read and typed validation errors; no per-render allocations.
2. `code/core/web/src/hooks/useDisableSSR.tsx`: 1-line scalar getter (`componentContext?.disableSSR ?? getSetting('disableSSR')`).
3. `code/core/web/src/hooks/useIsTouchDevice.tsx`: Clean hook wrapping `useDidFinishSSR()` with constant return on SSR/client.
4. `code/core/web/src/hooks/isOptimizedForFirstRender.ts`: Direct boolean setting lookup (`getSetting('optimizeForFirstRender')`).
5. `code/core/web/src/hooks/doesRootSchemeMatchSystem.ts`: Reads boolean state with no allocations.
6. `code/core/web/src/helpers/componentDisplayName.ts`: Pure symbol property getter/setter without heap allocations.
7. `code/core/web/src/helpers/skipProps.ts`: Static dictionary initialized once at module load time; fast `prop in skipProps` lookups.
8. `code/core/web/src/helpers/nativeOnlyProps.ts` & `code/core/web/src/helpers/webPropsToSkip.ts`: Pure static lookup tables.
9. `code/core/web/src/helpers/styleOriginalValues.ts`: Clean WeakMap metadata storage.
10. `code/core/web/src/helpers/themeRef.ts`: Pure string prefix check and slice with no intermediate allocations.
11. `code/core/web/src/views/FontLanguage.tsx`: Small React context wrapper with standard `useMemo` caching.
12. `code/core/web/src/views/SafeAreaTracker.tsx`: Layout measurement component with clean native event subscription.
13. `code/core/web/src/views/Configuration.tsx`: Direct provider passthrough with standard context props.
14. `code/core/web/src/views/View.tsx` & `code/core/web/src/views/Text.tsx`: Pure static configs and factory invocations at definition time.
