# Scan: React Native APIs Still Shaping the Web Path

**Repo:** `/Users/n8/tamagui` (branch `v3-beta`)  
**Scope:** `code/core/web/src`, `code/core/helpers/src`, `code/core/constants/src`, `code/core/dom`  
**Purpose:** Identify props, helpers, types, and code paths that exist solely because Tamagui originated as a React Native superset, where a web-native API and spelling should be primary instead (with native adapters where needed).

---

## 1. Summary of Findings & Value Ranking

| Rank | Finding | Web-Native Replacement | Native Adapter Status | Removal Type | Value / Win | Effort |
|:---:|---|---|---|---|---|---|
| **1** | `nativeOnlyProps.ts` runtime blacklist table in web bundle | Authored web props; no RN blacklist on web | Handled in `htmlRuntime.native.tsx` | Runtime bytes (318 B gzip) + types | Deletes entire module and `Object.assign` in `skipProps.ts` | Low |
| **2** | RNW sniffing & `isReactNative` runtime branching (`setupReactNative.ts`) | Direct DOM element emission / CSS-first | Primitive components (`primitives.native.tsx`) | Runtime bytes + types | Removes RNW heuristics, weakmap, and branching in render | Medium |
| **3** | `TamaguiComponentEvents` & RN press/touch mapping on Web (`eventHandling.ts`, `createComponent.tsx`) | Standard DOM events (`onClick`, `onPointerDown`, etc.) | Already exists (`dom/adapters.ts`, `domEventProps.native.ts`) | Runtime bytes + types | Simplifies event attachment; removes synthetic stopPropagation and multi-event listeners | Medium |
| **4** | `RNExclusiveTypes.ts` & `RNOnlyProps` union bloat in `types.tsx` | Standard Web DOM / CSS / ARIA types | `dom/html.native.tsx` | Type-surface only | Drastically shrinks `StackNonStyleProps` & `TextNonStyleProps` prop unions | Low |
| **5** | Structured RN shadow leaves (`shadowOffset`, `shadowRadius`, `shadowColor`, `shadowOpacity`, `defaultOffset.ts`) | Standard CSS `boxShadow` / `textShadow` string | RN 0.76+ supports `boxShadow`; native adapter for older RN | Runtime bytes + types | Deletes `defaultOffset.ts`, `normalizeShadow.ts`, and runtime `styleToCSS` deletion loop | Low |
| **6** | RN `Animated.Value` unwrapping & `pxStringRe` parsing in `normalizeValueWithProperty.ts` | Static/CSS values or driver-level animated values | Native driver handles animated values | Runtime bytes | Removes `typeof value.__getValue` check and regex from hot style normalization | Low |
| **7** | `asChild="web"` and `asChild="except-style-web"` prop shims | Standard `asChild` passing web props | `dom/adapters.ts` (`clickFromPress`) | Runtime bytes + types | Eliminates RN-to-web event rewriting on child elements | Low |
| **8** | `usePointerEvents` empty hook call on every web component render | Native DOM pointer events | `pointerEvents.native.ts` | Runtime bytes | Eliminates per-render no-op function call and web stub module | Low |
| **9** | `testID` -> `data-testid` mapping in `getSplitStyles.tsx` | `data-testid` authored directly | Already exists in `html.native.tsx:51` (`data-testid: 'testID'`) | Runtime bytes + types | Removes `testID` sniffing and rewriting from style splitter | Low |
| **10** | RN style property names: `writingDirection`, `textAlignVertical`, `elevationAndroid`, `includeFontPadding` | CSS `direction`, `verticalAlign`, `boxShadow`, font config | Already exists for `dir` (`html.native.tsx:50`) and `verticalAlign` (`expandStyle.ts:107`) | Runtime bytes + types | Removes web expansion fallbacks and RN-only props from style tables | Low |
| **11** | RN `StyleCompat = 'react-native'` & `expandFlex` in `expandStyle.ts` | Standard CSS `flex` shorthand | Yoga layout engine | Runtime bytes + types | Deletes RN-specific flex grow/shrink/basis expansion on web | Low |
| **12** | RN transform array-of-objects (`transformsToString.ts`) on web | Flat transform props or CSS `transform` string | `parseNativeTransform.native.ts` | Runtime bytes + types | Deletes legacy RN transform array stringifier | Low |
| **13** | Web `onLayout` injection in `createComponent.tsx` for container groups | CSS Container Queries / `ResizeObserver` | Native `onLayout` handler | Runtime bytes | Avoids invalid `onLayout` DOM attribute on web elements | Low |
| **14** | Shorthands `mx`, `my`, `px`, `py` targeting RN physical properties (`marginHorizontal`, etc.) | CSS logical properties `marginInline`, `marginBlock`, `paddingInline`, `paddingBlock` | `expandStyle.ts:269-288` (`nativeInlineExpansions`) | Runtime bytes + types | Native CSS logical properties on web; aligns with modern CSS | Low |
| **15** | iOS/RN string font-weight names in `styleTypes.ts` | CSS standard `100..900`, `'normal'`, `'bold'` | Native font family mapping | Type-surface only | Aligns style grammar types with W3C CSS specifications | Low |

---

## 2. Detailed Findings

---

### Finding 1: `nativeOnlyProps.ts` Runtime Blacklist Shipped in Web Bundle

- **What:** A 39-line dictionary containing 33 React Native specific prop names (`accessibilityElementsHidden`, `accessibilityIgnoresInvertColors`, `accessibilityLanguage`, `adjustsFontSizeToFit`, `allowFontScaling`, `android_hyphenationFrequency`, `dataDetectorType`, `dynamicTypeRamp`, `elevationAndroid`, `ellipsizeMode`, `hapticFeedback`, `hapticStyle`, `hitSlop`, `importantForAccessibility`, `lineBreakStrategyIOS`, `maxFontSizeMultiplier`, `minimumFontScale`, `needsOffscreenAlphaCompositing`, `nextFocusDown`, `nextFocusForward`, `nextFocusLeft`, `nextFocusRight`, `nextFocusUp`, `onAccessibilityAction`, `onAccessibilityEscape`, `onAccessibilityTap`, `onMagicTap`, `onTextLayout`, `pressRetentionOffset`, `selectionColor`, `shouldRasterizeIOS`, `suppressHighlighting`, `textBreakStrategy`). In `skipProps.ts`, this entire dictionary is merged into `skipProps` on web target via `Object.assign(skipProps, nativeOnlyProps)`.
- **File & Line:**
  - `code/core/web/src/helpers/nativeOnlyProps.ts:1-39`
  - `code/core/web/src/helpers/skipProps.ts:1, 39-41`
- **Who Consumes It:** `skipProps.ts:40` on `TAMAGUI_TARGET === 'web'`. Retained in the production web bundle (measured at 318 bytes gzip in bundle attribution `code/comparisons/output/v3-golf-baseline-attr.txt:28`).
- **Web-Native Replacement:** Web authors write standard HTML/DOM attributes and CSS. In a web-first architecture, web runtime does not need a blacklist table of React Native props; RN props simply are not part of the web prop surface.
- **Native Adapter Status:** `code/core/web/src/dom/htmlRuntime.native.tsx` handles DOM-to-native mapping on native.
- **Removal Type:** Runtime bytes (deletes entire `nativeOnlyProps.ts` module, saving ~318 B gzip from web bundle) + type surface.
- **Why It Is a Win:** Directly removes dead weight and module overhead from the web bundle.
- **Risk:** Zero for web-standard code; only breaks code passing untyped React Native props to web elements expecting them to be silently swallowed.
- **Rough Effort:** Low (delete file, remove import and `Object.assign` in `skipProps.ts`).

---

### Finding 2: React Native Web Sniffing & `isReactNative` Branching

- **What:** `setupReactNative.ts` exports `getReactNativeConfig(Component)`, which sniffs RNW component descriptors using runtime heuristics (`Component.getSize && Component.prefetch`, `Component.displayName === 'ScrollView'`, `Component.State?.blurTextInput`, `Component.propTypes`). It sets `isReactNative: true` in `StaticConfig`. Multiple hot web code paths branch on `isReactNative`:
  - `createComponent.tsx:2073`: Bypasses standard DOM rendering to render `<StaticConfigComponent>` with RNW style prop structure.
  - `createComponent.tsx:1849`: Skips `getWebEvents` if `isReactNative`.
  - `createComponent.tsx:1506`: Guards web layout logic on `!isReactNative`.
  - `getSplitStyles.tsx:830, 903, 1257, 1306, 1453`: Branches style splitting and prop passing on `isReactNative`.
- **File & Line:**
  - `code/core/web/src/setupReactNative.ts:1-61`
  - `code/core/web/src/styled.tsx:19, 574-575`
  - `code/core/web/src/createComponent.tsx:353, 767, 1506, 1849, 2073`
  - `code/core/web/src/helpers/getSplitStyles.tsx:830, 903, 1257, 1306, 1453`
  - `next.md:300` (already marked as todo: `- drop rnw support / setupReactNative.ts`)
- **Who Consumes It:** `styled.tsx:574` invokes `getReactNativeConfig`, and `createComponent.tsx` / `getSplitStyles.tsx` test `staticConfig.isReactNative`.
- **Web-Native Replacement:** Direct DOM tag rendering on web; native uses primitives from `dom/primitives.native.tsx`.
- **Native Adapter Status:** Native primitives (`DOMView`, `DOMText`, `DOMTextInput`, `DOMImage`) in `dom/primitives.native.tsx` provide clean native host components.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Deletes WeakMap caching, component reflection/sniffing, and 7+ runtime branches across the web render and style paths.
- **Risk:** Low (Tamagui V3 moves away from wrapping legacy RNW components).
- **Rough Effort:** Medium.

---

### Finding 3: `TamaguiComponentEvents` and RN Press/Touch Emulation on Web

- **What:** 
  1. `TamaguiComponentEvents` defines RN Pressable/Touchable options (`delayLongPress`, `delayPressIn`, `delayPressOut`, `minPressDuration`, `cancelable`, `hitSlop`, `onPressIn`, `onPressOut`, `onPress`, `onLongPress`).
  2. `eventHandling.ts` exports `getWebEvents()`, which maps `onPress` -> `onClick`, `onPressIn` -> `onMouseDown` + `onTouchStart`, `onPressOut` -> `onMouseUp` + `onTouchEnd`.
  3. `createComponent.tsx:1776-1793` synthesizes an `onPress` wrapper that intercepts clicks on web, runs `onClick?.(e)`, executes `e.stopPropagation()` if `onPress || onClick` is set (emulating RN Pressable swallowing), runs `onPress?.(e)`, and executes `onLongPress?.(e)`.
  4. `createComponent.tsx:1743, 1756`: Extracts RN Pressable props `onHoverIn` / `onHoverOut` and calls them alongside web `onMouseEnter` / `onMouseLeave`.
- **File & Line:**
  - `code/core/web/src/interfaces/TamaguiComponentEvents.tsx:1-18`
  - `code/core/web/src/eventHandling.ts:1-49`
  - `code/core/web/src/createComponent.tsx:1307-1327, 1720-1851`
- **Who Consumes It:** Every interactive component created by `createComponent.tsx` on web.
- **Web-Native Replacement:** Standard W3C DOM events: `onClick`, `onPointerDown`, `onPointerUp`, `onPointerEnter`, `onPointerLeave` (or `onMouseEnter`/`onMouseLeave`), `onFocus`, `onBlur`.
- **Native Adapter Status:** Already fully implemented in `dom/adapters.ts` (`clickFromPress`), `domEventProps.native.ts`, and `dom/contract.ts`. Native maps web DOM events onto native touch/press.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Eliminates redundant event wrapper allocations per render, synthetic `stopPropagation` edge cases, and duplicate listener attachments (`onMouseDown` + `onTouchStart` + `onMouseUp` + `onTouchEnd`).
- **Risk:** Medium (applications authoring `onPress` instead of `onClick` on web need migration or deprecation alias).
- **Rough Effort:** Medium.

---

### Finding 4: `RNExclusiveTypes.ts` & `RNOnlyProps` Type Surface Bloat

- **What:** `RNExclusiveTypes.ts` exports `GestureResponderHandlers` (12 responder handlers), `RNExtraProps` (`onScrollShouldSetResponder*`, `onSelectionChangeShouldSetResponder*`, `onLayout`, `elevationAndroid`), `RNViewProps` (`rel`, `download`), `RNTextProps` (`dir`, `onTextLayout`), and `RNOnlyProps` (union of 23 props). These are imported into `types.tsx` and intersected into `StackNonStyleProps` and `TextNonStyleProps`.
- **File & Line:**
  - `code/core/web/src/interfaces/RNExclusiveTypes.ts:1-61`
  - `code/core/web/src/types.tsx:28, 2742, 2772`
  - `code/core/web/src/index.ts:66`
- **Who Consumes It:** `code/core/web/src/types.tsx` intersects it into every Tamagui `View` and `Text` prop type; `index.ts` re-exports it.
- **Web-Native Replacement:** Standard React DOM HTML attributes and W3C event types (`PointerEvent`, `MouseEvent`, etc.).
- **Native Adapter Status:** `code/core/web/src/dom/html.native.tsx` handles native prop typing.
- **Removal Type:** Type-surface only.
- **Why It Is a Win:** Substantially reduces the TypeScript type union size for every Tamagui component, improving IDE autocomplete speed and `tsc` compilation time (tracked in `v3-type-performance.md`).
- **Risk:** Low (can deprecate or remove from public web unions).
- **Rough Effort:** Low.

---

### Finding 5: Structured RN Shadow Leaves & `defaultOffset.ts`

- **What:**
  1. `defaultOffset.ts` exports `{ height: 0, width: 0 }`.
  2. `normalizeShadow.ts` normalizes `{ shadowColor, shadowOffset: { width, height }, shadowOpacity, shadowRadius }`.
  3. `getCSSStylesAtomic.ts:170-210` (`styleToCSS`) intercepts `shadowOffset`, `shadowRadius`, `shadowColor`, `shadowOpacity` and `textShadowColor`, `textShadowOffset`, `textShadowRadius`, converts them into CSS `boxShadow` / `textShadow` strings, and deletes all 7 properties from the runtime style object (`delete style.shadowOffset`, etc.).
- **File & Line:**
  - `code/core/web/src/helpers/defaultOffset.ts:1-2`
  - `code/core/web/src/helpers/normalizeShadow.ts:1-21`
  - `code/core/web/src/helpers/getCSSStylesAtomic.ts:170-210`
  - `code/core/helpers/src/validStyleProps.ts:251, 297-298`
- **Who Consumes It:** `getCSSStylesAtomic.ts`, `normalizeShadow.ts`, `defaultOffset.ts`.
- **Web-Native Replacement:** Standard CSS `boxShadow` and `textShadow` strings (e.g. `boxShadow="0 4px 8px rgba(0,0,0,0.1)"`), already supported in modern CSS and React Native 0.76+.
- **Native Adapter Status:** RN 0.76+ supports `boxShadow` natively. For older RN versions, native style parsing can decompose `boxShadow` into RN shadow props.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Deletes 2 helper modules (`defaultOffset.ts`, `normalizeShadow.ts`) and removes the costly property interception, string formatting, and `delete` mutations from `styleToCSS`.
- **Risk:** Low-Medium (users authoring legacy React Native `shadowOffset` objects need to use `boxShadow`).
- **Rough Effort:** Low.

---

### Finding 6: RN `Animated.Value` Unwrapping & `pxStringRe` in `normalizeValueWithProperty.ts`

- **What:**
  1. `normalizeValueWithProperty.ts:35-42`: Executes `if (typeof value.__getValue === 'function') value = value.__getValue()` to unwrap React Native `Animated.Value` instances during web style normalization.
  2. `normalizeValueWithProperty.ts:19, 23-25`: Uses `const pxStringRe = /^-?\d*\.?\d+px$/` and `if (!isWeb) return Number.parseFloat(value)` to strip `"px"` units on non-web because React Native only accepts numbers.
- **File & Line:**
  - `code/core/web/src/helpers/normalizeValueWithProperty.ts:17-26, 35-42`
- **Who Consumes It:** Called on every style value normalization via `getCSSStylesAtomic.ts:83, 180-203`, `transformsToString.ts:17`, and `normalizeStyle.ts:23`.
- **Web-Native Replacement:** Web style engine accepts standard CSS numbers/strings/CSS variables. `Animated.Value` unwrapping belongs in native animation drivers, not in the web CSS style normalizer.
- **Native Adapter Status:** Animation drivers (`animations-reanimated`, etc.) handle animated value resolution.
- **Removal Type:** Runtime bytes.
- **Why It Is a Win:** Eliminates property lookups (`__getValue`), object type checks, and regex testing from the hot per-style-value loop.
- **Risk:** Low (motion driver on web uses CSS transitions/motion, not RN `Animated.Value`).
- **Rough Effort:** Low.

---

### Finding 7: `asChild="web"` and `asChild="except-style-web"` Event Mapping

- **What:** `asChild` accepts `'web'` and `'except-style-web'`. In `createComponent.tsx:1898-1912`, these modes trigger `getWebEvents` to rewrite RN event prop names (`onPress`, `onPressIn`, `onPressOut`, `onLongPress`) to DOM event props (`onClick`, etc.) when cloning the child element.
- **File & Line:**
  - `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:20-25`
  - `code/core/web/src/types.tsx:264-267`
  - `code/core/web/src/createComponent.tsx:1898-1912`
  - `code/core/web/src/helpers/getSplitStyles.tsx:931, 1411`
- **Who Consumes It:** `createComponent.tsx:1898` and `getSplitStyles.tsx:931, 1411`.
- **Web-Native Replacement:** `asChild={true}` or `asChild="except-style"`. Since web events (`onClick`, etc.) are authored directly in V3, no event rewriting is needed when passing props to DOM children.
- **Native Adapter Status:** Native uses `clickFromPress` in `dom/adapters.ts`.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Removes string mode checks, event rewriting, and `getWebEvents` object allocation during `asChild` rendering.
- **Risk:** Low (deprecated modes).
- **Rough Effort:** Low.

---

### Finding 8: `usePointerEvents` Empty Web Hook Call

- **What:** `usePointerEvents(props, viewProps)` is called unconditionally on every component render in `createComponent.tsx:1503`. On web, `helpers/pointerEvents.ts` is an empty stub function `export function usePointerEvents(_props: any, _viewProps: any) {}`. On native, `pointerEvents.native.ts` executes a full hook setting up `useRef` and touch responder bridges for drag/capture scenarios.
- **File & Line:**
  - `code/core/web/src/helpers/pointerEvents.ts:1-10`
  - `code/core/web/src/createComponent.tsx:37, 1503`
- **Who Consumes It:** `createComponent.tsx:1503` imports and invokes it on every render.
- **Web-Native Replacement:** Standard browser pointer events (`onPointerDown`, `setPointerCapture`, etc.) work natively on web DOM elements with zero wrapper code.
- **Native Adapter Status:** Implemented in `pointerEvents.native.ts`.
- **Removal Type:** Runtime bytes.
- **Why It Is a Win:** Eliminates an unnecessary module import and a no-op function call per component per render on web.
- **Risk:** Zero.
- **Rough Effort:** Low.

---

### Finding 9: `testID` to `data-testid` Mapping in `getSplitStyles.tsx`

- **What:** In `getSplitStyles.tsx:902-918`, an explicit check intercepts `keyInit === 'testID'` and rewrites it to `viewProps['data-testid'] = valInit` on web, while also keeping `testID` if `driver?.isReactNative`.
- **File & Line:**
  - `code/core/web/src/helpers/getSplitStyles.tsx:902-918`
- **Who Consumes It:** `getSplitStyles.tsx:902`.
- **Web-Native Replacement:** Standard W3C HTML attribute `data-testid` is authored on web.
- **Native Adapter Status:** Native adapter already exists in `code/core/web/src/dom/html.native.tsx:51` (`'data-testid': 'testID'`) and `htmlRuntime.native.tsx:142`.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Removes prop sniffing and renaming branch from the style contributor loop.
- **Risk:** Low (users authoring `testID` on web can be guided to `data-testid`).
- **Rough Effort:** Low.

---

### Finding 10: RN Style Property Names (`writingDirection`, `textAlignVertical`, `elevationAndroid`, `includeFontPadding`)

- **What:**
  1. `expandStyle.ts:82-84`: Intercepts RN `writingDirection` on web and expands it to CSS `direction`.
  2. `expandStyle.ts:96-98` & `validStyleProps.ts:257`: Supports `elevationAndroid` (and `isAndroid && key === 'elevation'`).
  3. `styleTypes.ts:472`: Accepts `textAlignVertical` (RN Android property) alongside `verticalAlign`.
  4. `styleTypes.ts:467`: Accepts `includeFontPadding` (RN Android property).
- **File & Line:**
  - `code/core/web/src/helpers/expandStyle.ts:82-84, 96-98`
  - `code/core/helpers/src/validStyleProps.ts:109, 257, 303`
  - `code/core/web/src/dom/styleTypes.ts:467, 472, 489`
- **Who Consumes It:** `expandStyle.ts`, `validStyleProps.ts`, `styleTypes.ts`.
- **Web-Native Replacement:**
  - `writingDirection` -> CSS `direction` / HTML `dir` attribute
  - `textAlignVertical` -> CSS `verticalAlign`
  - `elevationAndroid` -> CSS `boxShadow`
  - `includeFontPadding` -> Not a CSS property (native-only font metric adjustment).
- **Native Adapter Status:**
  - `html.native.tsx:50` already maps `dir: 'writingDirection'`.
  - `expandStyle.ts:107` already maps `verticalAlign` to `textAlignVertical` on native.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Removes legacy fallback expansion cases from `expandStyle.ts` on web and cleans up the valid style tables.
- **Risk:** Low.
- **Rough Effort:** Low.

---

### Finding 11: RN `StyleCompat = 'react-native'` & `expandFlex` in `expandStyle.ts`

- **What:** `expandStyle.ts:13-69` contains `expandFlex(value, compat)` supporting `'react-native'`, `'legacy'`, and `'web'` compatibility modes. In `'react-native'` mode, numeric `flex: 1` expands to `flexGrow: 1, flexShrink: 0, flexBasis: 0` on web to replicate React Native Yoga layout quirks on web DOM elements.
- **File & Line:**
  - `code/core/web/src/helpers/expandStyle.ts:13-69, 77-79`
  - `code/core/web/src/config.ts:15, 81-84`
- **Who Consumes It:** `expandStyle.ts:78` calls `expandFlex` for `key === 'flex'` on web.
- **Web-Native Replacement:** Standard CSS `flex` behavior (`flex: 1` is standard W3C CSS shorthand). Web apps do not need RN flex layout emulation.
- **Native Adapter Status:** Native Yoga layout natively implements React Native flex rules.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Deletes 55+ lines of flex expansion branching, mode switching, and `getStyleCompat()` calls from `expandStyle.ts`.
- **Risk:** Low (default in V3 is already `'web'`).
- **Rough Effort:** Low.

---

### Finding 12: RN Transform Array-of-Objects (`transformsToString.ts`)

- **What:** `transformsToString.ts` iterates over an array of single-key React Native transform objects (e.g. `[{ translateX: 20 }, { scale: 2 }, { matrix: [...] }]`) to concatenate them into a CSS transform string (`"translateX(20px) scale(2)"`).
- **File & Line:**
  - `code/core/web/src/helpers/transformsToString.ts:1-23`
- **Who Consumes It:** Used for legacy RN `transform={[{ scale: 2 }]}` props.
- **Web-Native Replacement:** Flat transform style props (`scale={2}`, `x={20}`) or standard CSS `transform` strings (`transform="scale(2) translateX(20px)"`).
- **Native Adapter Status:** `parseNativeTransform.native.ts` handles transform parsing on native.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Deletes the legacy transform array converter module in favor of the single unified transform accumulator (Section 6.8 of Style Engine Plan).
- **Risk:** Low.
- **Rough Effort:** Low.

---

### Finding 13: Web `onLayout` Handling in `createComponent.tsx`

- **What:** In `createComponent.tsx:1443-1465`, if `groupContext && props.containerType !== 'normal'`, the component composes and assigns `nonTamaguiProps.onLayout`. On web, HTML DOM elements have no native `onLayout` event, so this prop is passed down to the DOM node as an invalid attribute or relies on legacy polyfills.
- **File & Line:**
  - `code/core/web/src/createComponent.tsx:1443-1465`
- **Who Consumes It:** `createComponent.tsx:1448`.
- **Web-Native Replacement:** Web CSS Container Queries (`container-type`, `@container`) or explicit `ResizeObserver` hooks.
- **Native Adapter Status:** Native components receive native `onLayout` from React Native.
- **Removal Type:** Runtime bytes.
- **Why It Is a Win:** Prevents assigning non-standard `onLayout` handlers to web DOM elements and simplifies component prop assembly.
- **Risk:** Low (aligned with Section 5 Container API plan to remove implicit measurement).
- **Rough Effort:** Low.

---

### Finding 14: Shorthands `mx`, `my`, `px`, `py` Targeting RN Physical Properties

- **What:** In `shorthands/src/index.ts:66-67, 76-77` and `shorthands/src/v6.ts:26-27, 33-34`, the common axis shorthands map to React Native physical property names:
  - `mx: 'marginHorizontal'`
  - `my: 'marginVertical'`
  - `px: 'paddingHorizontal'`
  - `py: 'paddingVertical'`
  These require expansion into `marginLeft`/`marginRight` or `marginTop`/`marginBottom` in `expandStyle.ts:210-214`.
- **File & Line:**
  - `code/core/shorthands/src/index.ts:66-67, 76-77`
  - `code/core/shorthands/src/v6.ts:26-27, 33-34`
  - `code/core/web/src/helpers/expandStyle.ts:210-214`
- **Who Consumes It:** `@tamagui/shorthands`, config definitions, and `expandStyle.ts`.
- **Web-Native Replacement:** Standard CSS logical properties: `marginInline`, `marginBlock`, `paddingInline`, `paddingBlock`.
- **Native Adapter Status:** `expandStyle.ts:269-288` (`nativeInlineExpansions`) already contains the full adapter that maps `marginInline` -> `marginStart`/`marginEnd` and `paddingInline` -> `paddingStart`/`paddingEnd` on native.
- **Removal Type:** Runtime bytes + type surface.
- **Why It Is a Win:** Web CSS natively supports `margin-inline` / `padding-inline` with automatic RTL handling. Eliminates the need to expand `mx`/`px` into 2 physical classes on web.
- **Risk:** Low (shorthand target change).
- **Rough Effort:** Low.

---

### Finding 15: iOS/RN String Font-Weight Names in `styleTypes.ts`

- **What:** `styleTypes.ts:457-466` includes iOS/React Native specific `fontWeight` string keywords: `'ultralight' | 'thin' | 'light' | 'medium' | 'regular' | 'semibold' | 'condensedBold' | 'condensed' | 'heavy' | 'black'`. W3C CSS font-weight specification only admits numeric weights `100..900` or standard keywords (`'normal'`, `'bold'`, `'bolder'`, `'lighter'`).
- **File & Line:**
  - `code/core/web/src/dom/styleTypes.ts:457-466`
- **Who Consumes It:** `styleTypes.ts:457-466`.
- **Web-Native Replacement:** Standard CSS `fontWeight` types (`100..900`, `'normal'`, `'bold'`, `'bolder'`, `'lighter'`).
- **Native Adapter Status:** Native font definitions in `createFont` map numeric weights to platform font names.
- **Removal Type:** Type-surface only.
- **Why It Is a Win:** Cleans the style grammar type definition and aligns it strictly with CSS standard.
- **Risk:** Low.
- **Rough Effort:** Low.

---

## 3. Checked and Found Nothing

The following files and directories were inspected and found to be clean of React Native API leftovers on the web path:

1. **`code/core/constants/src/constants.ts` & `platformDriver.ts`**:
   - Platform flags (`isWeb`, `isBrowser`, `isServer`, `isClient`) are standard, clean environment discriminators.
   - `platformDriver.ts` defines an abstract renderer extension point (e.g. for GPUI/Metal) with no RN-specific leaking into web.
2. **`code/core/helpers/src/` (`clamp.ts`, `composeEventHandlers.ts`, `themeClassNames.ts`, `reservedThemeProps.ts`, `shouldRenderNativePlatform.ts`)**:
   - Pure mathematical utilities, generic event compositors, and CSS theme class generators with no RN-specific shims.
3. **`code/core/dom/src/tables/` (`tags.ts`, `attributes.ts`, `events.ts`, `nativeBacking.ts`, `compatibility.ts`)**:
   - Clean implementation of the Tamagui DOM contract and React Strict DOM alignment.
   - Attributes and events are defined using W3C standards with explicit native lowering tables rather than web-side pollution.
4. **`code/core/web/src/views/FontLanguage.tsx`**:
   - Web version cleanly renders `<div style={{ display: 'contents' }}>` with CSS class names `t_lang-${name}-${language}`, with no RN context shims.
5. **`code/core/web/src/helpers/tokenCategories.ts`**:
   - Clean categorical mapping of style properties to design token buckets (`color`, `space`, `size`, `radius`, `zIndex`).
