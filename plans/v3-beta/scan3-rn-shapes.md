# Scan 3: Complete Inventory of React Native Shapes in Tamagui Authoring Surface

**Target File:** `plans/v3-beta/scan3-rn-shapes.md`  
**Repo:** `/Users/n8/tamagui` (branch `v3-beta`)  
**Scope:** `code/core/web/src`, `code/core/helpers/src`, `code/core/dom`, `code/core/shorthands`, `code/core/style-grammar`  
**Context:** Tamagui v3 style engine rewrite dropping the "superset of React Native" framing in favor of React Strict DOM alignment (author in CSS/DOM shapes, let the native adapter translate).

---

## Executive Summary & Scope

In Tamagui v2, the component and style grammar was structured as a superset of React Native (`ViewProps`, `ViewStyle`, `TextStyle`), with ad-hoc shims mapping those RN structures into CSS strings or DOM attributes on web. While v2 began replacing accessibility props (`accessibility*` → `aria-*`, `accessible` → `tabIndex`, `nativeID` → `id`), significant portions of the authoring surface remain shaped by React Native conventions.

This inventory provides an exhaustive, evidence-backed audit across two categories:
1. **Style Value Shapes (Part A)**: 10 style domains where accepted prop values or normalizers assume React Native data structures rather than standard W3C CSS.
2. **Component Prop Shapes (Part B)**: 14 non-style prop domains and type unions where base components accept React Native interfaces, event shapes, gesture responder handlers, or runtime blacklists instead of standard HTML/DOM attributes.

Every entry identifies:
- The exact current shape with file and line references (`file:line`).
- The standard CSS/DOM target shape it becomes in v3.
- Native adapter feasibility and where the adapter lives.
- Breaking change classification for existing applications.
- Explicit labeling distinguishing direct code reads (**READ**) from engineering deductions (**INFERRED**).

---

## Master Inventory Tables

### Summary Table A: Style Value Shapes

| # | Style Property / Area | Current React Native Shape | Target Web / CSS Shape | Native Adapter Location | Breaking? |
|---|---|---|---|---|---|
| **A1** | Box Shadows (`shadowOffset`, `shadowRadius`, `shadowColor`, `shadowOpacity`) | Decomposed 4-leaf RN object structure (`shadowOffset: { width, height }`) | Standard CSS `boxShadow` string (`"0 4px 10px rgba(0,0,0,0.2)"`) | RN 0.76+ native `boxShadow` or `expandStyle.native.ts` decomposition | **Yes** |
| **A2** | Text Shadows (`textShadowOffset`, `textShadowRadius`, `textShadowColor`) | Decomposed 3-leaf RN object structure (`textShadowOffset: { width, height }`) | Standard CSS `textShadow` string (`"1px 1px 2px black"`) | `expandStyle.native.ts` decomposition into RN `textShadow*` | **Yes** |
| **A3** | Transforms (`transform`, deprecated discrete props) | Array of single-key objects (`[{ scale: 2 }, { translateX: 20 }]`), `translateX`/`translateY`/`rotation`/`transformMatrix` | Standard CSS `transform` string (`"translateX(20px) scale(2)"`) + flat transform props (`x`, `y`, `scale`, `rotate`) | `style-grammar/src/transformFamily.ts` & `parseNativeTransform.native.ts` | **Yes** |
| **A4** | Font Weight (`fontWeight`) | iOS/RN string keyword weights (`'ultralight'`, `'semibold'`, `'condensedBold'`, `'heavy'`, etc.) | Standard W3C CSS weights (`100..900`, `'normal'`, `'bold'`, `'bolder'`, `'lighter'`) | Font family mapping in `createFont` | **Yes** |
| **A5** | Unitless Numbers & Pixel Coercion | Appending `"px"` to unitless CSS numbers (e.g. `lineHeight: 1.5` → `"1.5px"`); regex stripping `"px"` on native; unwrapping RN `Animated.Value` on web | Standard CSS numbers/lengths; driver-level animated values; native-only pixel parsing | `normalizeValueWithProperty.native.ts` & `dom/primitives.native.tsx` multiplier resolver | **Yes** (for `lineHeight`) |
| **A6** | Flexbox Shorthand (`flex`, `expandFlex`, `StyleCompat`) | Numeric RN Yoga expansion (`flex: 1` → `flexGrow: 1, flexShrink: 0, flexBasis: 0`) with 3 runtime compat modes | Standard W3C CSS `flex` shorthand string/number (`flex="1 1 auto"`, `flex={1}`) passed direct to CSS | React Native Yoga engine natively accepts `flex` | **Yes** (if relying on RN shrink default) |
| **A7** | Border Style & Defaults (`borderStyle`, `border` shorthand) | Restricting `borderStyle` to 3 RN keywords (`solid`, `dotted`, `dashed`); runtime auto-injection of `borderStyle: 'solid'` when `borderWidth` present | Full CSS `borderStyle` keywords (10+ values); standard CSS `border` shorthand; CSS `none` default | `parseBorderShorthand.native.ts:20-74` | **Yes** (if omitting `borderStyle` on web) |
| **A8** | RN-Specific Style Aliases (`writingDirection`, `textAlignVertical`, `elevationAndroid`, `includeFontPadding`, `wordWrap`, `tintColor`) | RN platform property names and Android-specific overrides | CSS standards: `direction` / `dir`, `verticalAlign`, `boxShadow`, `overflowWrap`, SVG `fill`/`color` | `dom/html.native.tsx:50`, `expandStyle.ts:107` | **Yes** |
| **A9** | Axis Shorthands (`mx`, `my`, `px`, `py`, `start`, `end`) | Mapping to RN physical properties (`marginHorizontal`, `paddingVertical`, `marginStart`, etc.) requiring 2-class expansion | Modern CSS logical properties (`marginInline`, `marginBlock`, `paddingInline`, `paddingBlock`, `insetInlineStart`) | `expandStyle.ts:269-288` (`nativeInlineExpansions`) | **Low** (shorthand target update) |
| **A10** | Safe Area Magic Value (`pt="safe"`, `padding="safe"`) | Magic string `"safe"` intercepted on 26 props and expanded via edge tables | Standard CSS `env(safe-area-inset-*)` or design tokens (`$safe-area-top`, etc.) | `resolveSafeAreaVariable.ts` / `@tamagui/style-grammar/safeAreaVariables.ts` | **Yes** |

---

### Summary Table B: Component Prop Shapes

| # | Prop / Interface | Current React Native Shape | Target Web / DOM Shape | Native Adapter Location | Breaking? |
|---|---|---|---|---|---|
| **B1** | Base Props Union (`StackNonStyleProps`, `TextNonStyleProps`) | Extends `Omit<ViewProps, ...>` and `Omit<ReactTextProps, ...>` (carrying RN-only prop unions) | Extends `React.HTMLAttributes<HTMLDivElement>` / `HTMLSpanElement` | `dom/contract.ts` (`DOMViewProps`, `DOMTextProps`) | **Type-only** |
| **B2** | Event Props (`onPress`, `onPressIn`, `onPressOut`, `onLongPress`, `onHoverIn`, `onHoverOut`) | RN Pressable event names; `getWebEvents` mapping to multi-event listeners; synthetic `e.stopPropagation()` | Standard W3C DOM events (`onClick`, `onPointerDown`, `onPointerUp`, `onPointerEnter`, `onPointerLeave`, `onContextMenu`) | `dom/adapters.ts:37-53` (`clickFromPress`) & `domEventProps.native.ts` | **Yes** |
| **B3** | Pressable Delay Props (`delayLongPress`, `delayPressIn`, `delayPressOut`, `minPressDuration`, `cancelable`) | RN Touchable/Pressable timing configuration props on base Stack/View | Handled at UI component or gesture hook level (not on base DOM elements) | Native Pressable primitives | **Yes** |
| **B4** | Touch Hit Expansion (`hitSlop`) | RN `number | Insets | null` (`{ top, left, bottom, right }`) | CSS pseudo-element hit areas (`::before { inset: -Npx }`) or CSS `touch-action` | Native Pressable / View | **Yes** |
| **B5** | Layout Callbacks (`onLayout`, `onTextLayout`) | RN `LayoutChangeEvent` and `NativeSyntheticEvent<TextLayoutEventData>` | CSS Container Queries (`@container`), standard `ResizeObserver`, or `useResizeObserver` | RN host components receive native layout events | **Yes** |
| **B6** | Gesture Responder Handlers (16 responder props) | 12 Touch Responder props (`onStartShouldSetResponder`, `onResponderMove`, etc.) + 4 Scroll/Selection responders | W3C Pointer Events (`onPointerDown`, `setPointerCapture`, `releasePointerCapture`) | `helpers/pointerEvents.native.ts` | **Yes** |
| **B7** | Test Identifier (`testID`) | RN `testID` prop intercepted and rewritten to `data-testid` on web | Standard HTML `data-testid` attribute authored directly | `dom/html.native.tsx:51` (`'data-testid': 'testID'`) & `htmlRuntime.native.tsx:142` | **Yes** |
| **B8** | Element Identifier (`nativeID`) | RN `nativeID` prop from `ViewProps` / `RNExclusiveTypes.ts` | Standard HTML `id` attribute | `htmlRuntime.native.tsx:24` (passes `id` to native host) | **Yes** |
| **B9** | `asChild` Web Translation Modes (`'web'`, `'except-style-web'`) | Modes designed specifically to rewrite RN event names (`onPress` → `onClick`) when cloning child | Standard `asChild={true}` or `asChild="except-style"` (no event rewriting necessary) | `dom/adapters.ts` (`clickFromPress`) | **Yes** |
| **B10** | Runtime Blacklist Shipped to Web (`nativeOnlyProps.ts`) | 33-prop RN blacklist table merged into `skipProps.ts` on web target (318 B gzip) | Clean web runtime with no RN prop blacklist | `dom/htmlRuntime.native.tsx` handles DOM-to-native lowering | **Low** |
| **B11** | React Native Web Sniffing (`setupReactNative.ts`) | Runtime heuristics sniffing RNW descriptors (`getSize`, `blurTextInput`, etc.) setting `isReactNative: true` | Direct DOM element emission on web; native primitives on native | `dom/primitives.native.tsx` (`DOMView`, `DOMText`, `DOMTextInput`, `DOMImage`) | **Low** |
| **B12** | Ref Method Monkey-Patching (`TamaguiElementMethods`) | Monkey-patching RN `measure`, `measureInWindow`, `measureLayout` onto DOM `HTMLElement` refs | Standard DOM element methods (`getBoundingClientRect()`, `IntersectionObserver`, `focus`, `blur`) | RN `View` has native methods; `dom/primitives.native.tsx:152-182` provides DOM facade | **Yes** |
| **B13** | Text Truncation / Lines (`numberOfLines`, `lineBreakMode`, `ellipsizeMode`) | RN Text props (`numberOfLines: number`, `ellipsizeMode`) lowered to `-webkit-line-clamp` via variants | Standard CSS `lineClamp` / `WebkitLineClamp` style props and `textOverflow="ellipsis"` | Native `Text` receives `numberOfLines` | **Low** |
| **B14** | Container Measurement Barrier (`untilMeasured`) | RN container sizing barrier (`'hide' | 'show'`) to hide unmeasured native views | Standard CSS Container Queries (synchronous in browser layout) | Native container context | **None** |

---

## Part A: Style Value Shapes Inventory

---

### Item A1: Box Shadows (Decomposed RN Shadow Leaves vs CSS `boxShadow`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:378-381`: Declares `shadowColor?: ColorValue`, `shadowOffset?: Readonly<{ width: number; height: number }>`, `shadowOpacity?: number`, `shadowRadius?: number`.
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:168, 251`: Declares `shadowOffset: true` in `stylePropsView` and `shadowOpacity: true` in `stylePropsUnitless`.
  - [**READ**] `code/core/web/src/helpers/defaultOffset.ts:1-2`: Exports default `{ height: 0, width: 0 }`.
  - [**READ**] `code/core/web/src/helpers/normalizeShadow.ts:3-21`: Normalizes `{ shadowColor, shadowOffset, shadowOpacity, shadowRadius }`.
  - [**READ**] `code/core/web/src/helpers/getCSSStylesAtomic.ts:172-192`: In `styleToCSS()`, intercepts `shadowOffset`, `shadowRadius`, `shadowColor`, `shadowOpacity`, synthesizes a CSS `boxShadow` string via `normalizeColor` + `normalizeValueWithProperty`, and mutates the style object with 4 `delete` operations (`delete style.shadowOffset`, etc.).
  - [**READ**] `code/core/web/src/helpers/expandStyles.ts:14-22`: Carries explicit comment `// TODO deprecate for web-style shadows` and runs `normalizeShadow` if any RN shadow leaf is present.
  - [**READ**] `code/core/shorthands/src/index.ts:79-82`: Exports shorthands `shac: 'shadowColor'`, `shar: 'shadowRadius'`, `shof: 'shadowOffset'`, `shop: 'shadowOpacity'`.
- **Target Web / CSS Shape:**
  - Standard CSS `boxShadow` string (e.g. `boxShadow="0 4px 10px rgba(0,0,0,0.2)"`, `boxShadow="0 2px 4px $shadowColor"`, or `boxShadow="none"`).
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] React Native 0.76+ supports `boxShadow` natively across iOS, Android, and macOS.
  - For older React Native versions, native lowering in `code/core/web/src/helpers/expandStyle.native.ts` or `@tamagui/style-grammar/src/payloadShape.ts` can parse the `boxShadow` string into RN shadow properties or elevation.
- **Breaking Change:**
  - **Yes**. Authoring decomposed `{ shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, shadowColor: 'black', shadowOpacity: 0.2 }` or shorthands (`shof`, `shar`, `shac`, `shop`) will be removed from web style types. Mechanical codemod converts these 4 props to a single `boxShadow` string.

---

### Item A2: Text Shadows (Decomposed RN Text Shadow Leaves vs CSS `textShadow`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:481-483`: Declares `textShadowColor?: ColorValue`, `textShadowOffset?: { width: number; height: number }`, `textShadowRadius?: number`.
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:43, 297-298`: Declares `textShadowOffset: true` and `textShadowRadius: true` in `stylePropsTextOnly`.
  - [**READ**] `code/core/web/src/helpers/getCSSStylesAtomic.ts:195-209`: Intercepts `textShadowColor`, `textShadowOffset`, `textShadowRadius`, converts them into `${offsetX} ${offsetY} ${blurRadius} ${color}`, assigns `style.textShadow`, and executes 3 `delete` operations (`delete style.textShadowColor`, `delete style.textShadowOffset`, `delete style.textShadowRadius`).
  - [**READ**] `code/core/web/src/helpers/normalizeStylePropKeys.native.ts:11`: Marks `textShadowColor: true` for native color normalization.
- **Target Web / CSS Shape:**
  - Standard CSS `textShadow` string (e.g. `textShadow="1px 1px 2px black"`, `textShadow="0 2px 4px $color"`, or `textShadow="none"`).
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native adapter in `code/core/web/src/helpers/expandStyle.native.ts` can parse CSS `textShadow` string into `textShadowOffset`, `textShadowRadius`, and `textShadowColor` for native `Text` components.
- **Breaking Change:**
  - **Yes**. Authoring `textShadowOffset={{ width: 1, height: 1 }}`, `textShadowRadius={2}`, `textShadowColor="black"` on web components will be deprecated/removed in favor of `textShadow="1px 1px 2px black"`.

---

### Item A3: Transforms (Array-of-Objects Syntax & Deprecated RN Transform Longhands)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:135-155, 508`: Declares `transform?: string | readonly TransformFunction[]` where `TransformFunction` is an array of mutually exclusive single-key objects: `{ perspective: number } | { rotate: string } | { scale: number } | { translateX: number } | ...`.
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:523-530`: Declares legacy RN discrete props: `transformMatrix?: number[]` (`@deprecated`), `rotation?: number` (`@deprecated`), `translateX?: number` (`@deprecated`), `translateY?: number` (`@deprecated`).
  - [**READ**] `code/core/web/src/helpers/transformsToString.ts:3-22`: Iterates over an array of single-key objects and concatenates them into a CSS transform string (`"translateX(20px) scale(2)"`).
  - [**READ**] `code/core/web/src/helpers/getCSSStylesAtomic.ts:80-82`: `if (key === 'transform' && Array.isArray(val)) { val = transformsToString(val) }`.
  - [**READ**] `code/core/web/src/helpers/getSplitStyles.tsx:1311, 1834`: Invokes `transformsToString` on `style.transform`.
  - [**READ**] `code/core/web/src/helpers/normalizeValueWithProperty.ts:11-15`: Explicitly adds `translateX: true` and `translateY: true` to `stylePropsAllPlusTransforms`.
- **Target Web / CSS Shape:**
  - Standard CSS `transform` string (e.g. `transform="translateX(20px) scale(2) rotate(45deg)"`) or Tamagui flat transform properties (`x={20}`, `y={10}`, `scale={2}`, `rotate="45deg"`).
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native adapter in `code/core/web/src/helpers/parseNativeTransform.native.ts` or `@tamagui/style-grammar/src/transformFamily.ts` converts CSS transform strings or flat props into the React Native transform array format.
- **Breaking Change:**
  - **Yes**. Passing array-of-objects `transform={[{ scale: 2 }, { translateX: 20 }]}` or deprecated props (`translateX`, `translateY`, `rotation`, `transformMatrix`) will no longer be part of the primary web style type surface.

---

### Item A4: Font Weight (iOS/RN String Keywords vs Standard CSS Font Weights)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:436-467`: Accepts iOS/RN string keywords: `'ultralight' | 'thin' | 'light' | 'medium' | 'regular' | 'semibold' | 'condensedBold' | 'condensed' | 'heavy' | 'black'` alongside numbers `100..900` and strings `'100'..'900'`.
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:148`: Declares `fontWeight: true` in `stylePropsUnitless`.
- **Target Web / CSS Shape:**
  - Standard W3C CSS `fontWeight`: numeric `100..900`, or standard CSS keywords `'normal' | 'bold' | 'bolder' | 'lighter'`.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native font resolution in `code/core/web/src/createFont.ts` and native font drivers already map numeric weights (`100`..`900`) and standard keywords to native font families/postscript names.
- **Breaking Change:**
  - **Yes** (minor). Code passing non-standard iOS string keywords like `fontWeight="semibold"` on web (which browsers do not natively recognise in CSS) must migrate to numeric `fontWeight="600"` or `fontWeight={600}`.

---

### Item A5: Unitless Numbers & Pixel Coercion (Missing Unitless CSS Properties & Regex Stripping)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/helpers/normalizeValueWithProperty.ts:28-48`: On web, any number for a property not listed in `stylePropsUnitless` receives `${value}px`.
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:134-169`: `stylePropsUnitless` omits `lineHeight` (RN expects absolute pixel numbers; CSS allows unitless ratio `lineHeight={1.5}` which currently turns into `"1.5px"` on web).
  - [**READ**] `code/core/style-grammar/src/unitlessNumbers.ts:18-20`: `gap`, `columnGap`, `rowGap` are listed in `unitlessNumberPropertyNames`, but in CSS `gap: 10` is invalid syntax without `px`.
  - [**READ**] `code/core/web/src/helpers/normalizeValueWithProperty.ts:17-26`: Uses `const pxStringRe = /^-?\d*\.?\d+px$/` and `if (!isWeb) return Number.parseFloat(value)` to strip `"px"` units on non-web because React Native only accepts raw numbers.
  - [**READ**] `code/core/web/src/helpers/normalizeValueWithProperty.ts:35-42`: Executes `if (typeof value.__getValue === 'function') value = value.__getValue()` to unwrap React Native `Animated.Value` instances during web style normalization.
  - [**READ**] `code/core/web/src/dom/primitives.native.tsx:312-328`: In `resolveInheritedTextStyle`, contains custom logic for `lineHeightMultiplier` to handle unitless line-height on native.
- **Target Web / CSS Shape:**
  - Web style engine accepts standard CSS numbers (allowing unitless `lineHeight: 1.5`, `opacity: 0.5`, `flex: 1`, `zIndex: 10`) and emits valid CSS units for lengths.
  - No `Animated.Value` lookups or regex checks on the web style path.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native adapter in `code/core/web/src/helpers/normalizeValueWithProperty.native.ts` and `dom/primitives.native.tsx:323-328` strips `"px"` from lengths and multiplies unitless `lineHeight` by `fontSize` for React Native.
- **Breaking Change:**
  - **Yes** (for `lineHeight`). In RN/v2, `lineHeight={24}` was interpreted as 24px. In standard CSS, unitless `lineHeight={24}` is a 24× multiplier (2400%). Authored pixel line-heights must be written as `lineHeight={24}` (if migrated to token/px scale) or `lineHeight="24px"`.

---

### Item A6: Flexbox Shorthand (`flex`, `expandFlex`, `StyleCompat`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:13-69, 77-79`: `expandFlex(value, compat)` supports `'legacy'`, `'react-native'`, and `'web'` compatibility modes. In `'react-native'` mode, numeric `flex: 1` expands to `flexGrow: 1, flexShrink: 0, flexBasis: 0` on web to replicate React Native Yoga layout quirks on web DOM elements. In `'web'` mode, `flex: 1` expands to `flexGrow: 1, flexShrink: 1, flexBasis: 0`.
  - [**READ**] `code/core/web/src/config.ts:15, 81-84`: Configures `styleCompat: StyleCompat = 'web'`.
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:189`: Declares `flex?: number` (restricting `flex` to number instead of CSS string shorthand).
- **Target Web / CSS Shape:**
  - Standard CSS `flex` shorthand (e.g. `flex="1"`, `flex="1 1 auto"`, `flex="0 0 200px"`, `flex="none"`, or `flex={1}`) passed directly to CSS without 3-property runtime decomposition.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] React Native's Yoga layout engine natively supports `flex: number` as well as discrete `flexGrow`, `flexShrink`, `flexBasis`.
- **Breaking Change:**
  - **Yes**. Eliminating `styleCompat: 'react-native'` removes automatic `flexShrink: 0` assignment on web. Web layout follows standard CSS flexbox rules.

---

### Item A7: Border Style & Defaults (`borderStyle`, `border` shorthand)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:54, 305-311`: Restricts `borderStyle` to `type BorderStyleValue = 'solid' | 'dotted' | 'dashed'` (the 3 values supported by classic React Native; CSS supports 10+ values).
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:65-71`: Lists `borderStyle`, `borderBlockStyle`, `borderInlineStyle`, etc.
  - [**READ**] `code/core/web/src/helpers/expandStyles.ts:25-42`: In `fixStyles()`, executes `style[borderDefaults[key]] ||= 'solid'` whenever `borderWidth` or `border*Width` is present, forcing a default `solid` border style.
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:217`: Decomposes `borderStyle` into 4 per-side styles (`borderTopStyle`, etc.) on web.
  - [**READ**] `code/core/web/src/helpers/parseBorderShorthand.ts:4`: No-op on web (`return undefined`).
  - [**READ**] `code/core/web/src/helpers/parseBorderShorthand.native.ts:20-74`: Parses `"1px solid red"` into individual `border*Width`, `borderStyle`, `border*Color` properties for React Native.
- **Target Web / CSS Shape:**
  - Full W3C CSS `borderStyle` keywords (`solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset`, `none`, `hidden`), CSS `border` shorthand string (`border="1px solid #ccc"`), and standard per-side border shorthands (`borderTop`, `borderRight`, etc.).
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/helpers/parseBorderShorthand.native.ts:20-74` already provides the complete native adapter that decomposes CSS `border` shorthands into RN properties.
- **Breaking Change:**
  - **Yes** (if automatic `borderStyle: 'solid'` injection is removed on web). In pure CSS, `borderWidth={1}` with no `borderStyle` produces an invisible border (`border-style: none`).

---

### Item A8: RN-Specific Style Aliases (`writingDirection`, `textAlignVertical`, `elevationAndroid`, `includeFontPadding`, `wordWrap`, `tintColor`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:109, 257, 303`: Declares `writingDirection: true`, `elevationAndroid: true` (Android only), `verticalAlign: true`.
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:82-84, 96-98, 107`:
    - Maps `writingDirection` → `direction` on web.
    - Maps `elevationAndroid` → `elevation` on native.
    - Maps `verticalAlign` → `textAlignVertical` on native.
  - [**READ**] `code/core/web/src/helpers/expandStyles.ts:6-11`: Copies `style.elevationAndroid` to `style.elevation` and deletes `elevationAndroid`.
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:467, 472, 488, 489`: Accepts `includeFontPadding?: boolean`, `textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'`, `wordWrap?: Properties['wordWrap']`, `writingDirection?: 'auto' | 'ltr' | 'rtl'`.
  - [**READ**] `code/core/helpers/src/webOnlyStyleProps.ts:45, 79`: Declares `wordWrap: true` (legacy non-standard duplicate of `overflowWrap`).
  - [**READ**] `code/core/web/src/helpers/getDynamicVal.ts:29`: Lists RN Image property `tintColor: true`.
- **Target Web / CSS Shape:**
  - Standard W3C CSS properties: `direction` (or HTML `dir` attribute), `verticalAlign`, `boxShadow`, `overflowWrap`, and standard SVG/filter color properties.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/html.native.tsx:50` already maps `dir: 'writingDirection'`.
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:107` already maps `verticalAlign` to `textAlignVertical` on native.
- **Breaking Change:**
  - **Yes**. Authoring `writingDirection="rtl"`, `elevationAndroid={4}`, `wordWrap="break-word"`, or `textAlignVertical="center"` on web components will be deprecated/removed in favor of standard CSS spellings.

---

### Item A9: Axis Shorthands Targeting RN Physical Properties (`mx`, `my`, `px`, `py`, `start`, `end`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/shorthands/src/index.ts:66-67, 76-77`: `mx: 'marginHorizontal'`, `my: 'marginVertical'`, `px: 'paddingHorizontal'`, `py: 'paddingVertical'`.
  - [**READ**] `code/core/shorthands/src/v6.ts:26-27, 33-34`: `mx: 'marginHorizontal'`, `my: 'marginVertical'`, `px: 'paddingHorizontal'`, `py: 'paddingVertical'`.
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:210-214`: Expands `marginHorizontal` → `['marginRight', 'marginLeft']`, `paddingVertical` → `['paddingTop', 'paddingBottom']`.
  - [**READ**] `code/core/helpers/src/validStyleProps.ts:202-205, 242, 288`: Accepts RN physical directionals: `start`, `end`, `borderStartWidth`, `borderEndWidth`, `borderStartColor`, `borderEndColor`.
- **Target Web / CSS Shape:**
  - Modern CSS logical properties: `marginInline`, `marginBlock`, `paddingInline`, `paddingBlock`, `insetInlineStart`, `insetInlineEnd`, `borderInlineStartWidth`, `borderInlineEndWidth`, etc.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/helpers/expandStyle.ts:269-288` (`nativeInlineExpansions`): Already contains the full native adapter mapping `marginInline` → `marginStart`/`marginEnd` and `paddingInline` → `paddingStart`/`paddingEnd` on native.
- **Breaking Change:**
  - **Low** (internal shorthand re-targeting). Updating `mx` to map to `marginInline` and `px` to `paddingInline` emits modern CSS logical rules on web while native lowering continues to handle RTL on native.

---

### Item A10: Safe Area Magic Keyword (`pt="safe"`, `padding="safe"`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/helpers/resolveSafeArea.ts:1-117`: Intercepts `value === 'safe'` on 26 props (`padding`, `paddingTop`, `paddingHorizontal`, `margin`, `inset`, `top`, etc.), matches against `propEdges`, and expands to per-side `env(safe-area-inset-*)` values.
  - [**READ**] `code/core/web/src/helpers/resolveSafeArea.native.ts:1-99`: Equivalent 99-line interceptor for native insets.
- **Target Web / CSS Shape:**
  - Standard CSS `env(safe-area-inset-top)` or design tokens (`$safe-area-top`, `$safe-area-bottom`, `$safe-area-left`, `$safe-area-right`).
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/style-grammar/src/safeAreaVariables.ts:1-20` and `code/core/web/src/helpers/resolveSafeAreaVariable.ts:1-11` already resolve `$safe-area-*` tokens to `env()` on web and insets on native.
- **Breaking Change:**
  - **Yes**. Authoring magic `pt="safe"` or `padding="safe"` is replaced with `pt="$safe-area-top"` or `p="$safe-area"`.

---

## Part B: Component Prop Shapes Inventory

---

### Item B1: Base Props Union Bloat (`StackNonStyleProps` & `TextNonStyleProps`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/types.tsx:2732-2757`: `StackNonStyleProps` extends `Omit<ViewProps, ...> & ExtendBaseStackProps & TamaguiComponentPropsBase` where `ViewProps` is imported from `react-native` (line 21).
  - [**READ**] `code/core/web/src/types.tsx:2765-2787`: `TextNonStyleProps` extends `Omit<ReactTextProps, ...> & ExtendBaseTextProps & TamaguiComponentPropsBase` where `ReactTextProps` is imported from `react-native` (line 19).
  - [**READ**] `code/core/web/src/interfaces/RNExclusiveTypes.ts:33-61`: `RNOnlyProps` union (23 props) is intersected and re-exported.
  - [**READ**] `code/core/web/src/dom/html.tsx:43-48` and `html.native.tsx:180-185`: `MergeHTMLProps<DOMProps, TamaguiProps, TamaguiNonStyleProps>` allows RN-shaped non-style props to shadow DOM props.
- **Target Web / DOM Shape:**
  - Standard React DOM HTML element attributes (`React.HTMLAttributes<HTMLDivElement>`, `React.HTMLAttributes<HTMLSpanElement>`, etc.) and W3C event definitions.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/contract.ts:35-61` (`DOMViewProps`, `DOMTextProps`, `DOMTextInputProps`, `DOMImageProps`) defines the clean native host interfaces.
- **Breaking Change:**
  - **Type-surface only**. Removing React Native prop pollution from web TypeScript unions reduces type-checking latency and eliminates invalid autocomplete options.

---

### Item B2: Event Props (RN Press/Touch Names vs W3C DOM Events)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentEvents.tsx:1-18`: Defines `onPress`, `onPressIn`, `onPressOut`, `onLongPress`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`.
  - [**READ**] `code/core/web/src/eventHandling.ts:10-22`: `getWebEvents()` maps `onPress` → `onClick`, `onPressIn` → `onMouseDown` + `onTouchStart`, `onPressOut` → `onMouseUp` + `onTouchEnd`.
  - [**READ**] `code/core/web/src/createComponent.tsx:1720-1851`: Synthesizes an `onPress` wrapper that executes `onClick?.(e)`, invokes `e.stopPropagation()` if `onPress || onClick` is set (emulating RN Pressable swallowing), runs `onPress?.(e)`, and executes `onLongPress?.(e)`. Also binds RN `onHoverIn` / `onHoverOut` alongside `onMouseEnter` / `onMouseLeave` (lines 1743, 1756).
  - [**READ**] `code/core/web/src/types.tsx:391-441`: `WebOnlyPressEvents` intersects RN `PressableProps['onPress']` with standard DOM `DivAttributes['onClick']`.
- **Target Web / DOM Shape:**
  - Standard W3C DOM events: `onClick`, `onPointerDown`, `onPointerUp`, `onPointerEnter`, `onPointerLeave`, `onKeyDown`, `onContextMenu`.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/adapters.ts:37-53` (`clickFromPress`), `dom/contract.ts:43`, and `dom/domEventProps.native.ts:25` already implement native lowering from `onClick` to native `onPress`.
- **Breaking Change:**
  - **Yes**. Authoring `onPress`, `onPressIn`, `onPressOut`, `onLongPress` directly on web components will be deprecated in favor of `onClick`, `onPointerDown`, `onPointerUp`, `onContextMenu`.

---

### Item B3: Pressable Delay & Timing Props

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentEvents.tsx:1-8`: Declares `delayLongPress?: any`, `delayPressIn?: any`, `delayPressOut?: any`, `minPressDuration?: number`, `cancelable?: boolean`.
  - [**READ**] `code/core/web/src/createComponent.tsx:1838-1846`: Assigns `delayLongPress`, `delayPressIn`, `delayPressOut`, `minPressDuration`, `cancelable` to events on native.
- **Target Web / DOM Shape:**
  - Not applicable on base DOM elements. Gesture timing is handled by UI component state or CSS transition delays (`transition-delay`).
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Pressable primitives and gesture handlers on native manage press timers internally.
- **Breaking Change:**
  - **Yes** (for code passing RN Touchable delay props to base `View`/`Stack`).

---

### Item B4: Touch Hit Expansion (`hitSlop`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:114-122`: Declares `hitSlop?: number | Insets | null` with `interface Insets { top?: number; left?: number; bottom?: number; right?: number }`.
  - [**READ**] `code/core/web/src/types.tsx:374, 384-389`: Inherited in `TamaguiComponentPropsBaseBase`.
  - [**READ**] `code/core/web/src/helpers/nativeOnlyProps.ts:17`: Blacklists `hitSlop: 1` on web target.
  - [**READ**] `code/core/web/src/createComponent.tsx:1841`: Forwards `hitSlop: viewProps.hitSlop` to native Pressable.
- **Target Web / DOM Shape:**
  - CSS pseudo-element hit-area expansion (`::before { inset: -Npx }`) or CSS `touch-action`.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native Pressable / View accepts `hitSlop` on native.
- **Breaking Change:**
  - **Yes** (for users passing `hitSlop` on web expecting it to work or be swallowed).

---

### Item B5: Layout Callbacks (`onLayout` and `onTextLayout`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/RNExclusiveTypes.ts:8, 18, 39`: Declares `onLayout?: ((event: LayoutChangeEvent) => void)`.
  - [**READ**] `code/core/web/src/interfaces/RNExclusiveTypes.ts:9-11, 29, 40`: Declares `onTextLayout?: ((event: NativeSyntheticEvent<TextLayoutEventData>) => void)`.
  - [**READ**] `code/core/web/src/createComponent.tsx:1443-1465`: Synthesizes and assigns `onLayout` to DOM nodes on web if container grouping is active.
  - [**READ**] `code/core/web/src/helpers/nativeOnlyProps.ts:32`: Blacklists `onTextLayout: 1` on web target.
- **Target Web / DOM Shape:**
  - Web standard `ResizeObserver`, CSS Container Queries (`@container`), or explicit `useResizeObserver` hooks.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native host components (`View`, `Text`) receive native `onLayout` and `onTextLayout` directly from React Native.
- **Breaking Change:**
  - **Yes** (for web code relying on `onLayout` prop callback execution on web DOM nodes).

---

### Item B6: Gesture Responder Handlers (16 Responder Props)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/RNExclusiveTypes.ts:14-17, 22, 34-38, 49-60`: Exports 12 `GestureResponderHandlers`: `onStartShouldSetResponder`, `onMoveShouldSetResponder`, `onResponderEnd`, `onResponderGrant`, `onResponderReject`, `onResponderMove`, `onResponderRelease`, `onResponderStart`, `onResponderTerminationRequest`, `onResponderTerminate`, `onStartShouldSetResponderCapture`, `onMoveShouldSetResponderCapture`, plus 4 scroll/selection responders (`onScrollShouldSetResponder`, `onScrollShouldSetResponderCapture`, `onSelectionChangeShouldSetResponder`, `onSelectionChangeShouldSetResponderCapture`).
  - [**READ**] `code/core/web/src/types.tsx:28, 2742, 2772`: Intersects these responder types into every `StackNonStyleProps` and `TextNonStyleProps`.
- **Target Web / DOM Shape:**
  - Standard W3C Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`, `setPointerCapture`, `releasePointerCapture`) and HTML Drag and Drop events.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/helpers/pointerEvents.native.ts:1-151` already adapts W3C pointer events onto native touch responder handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`).
- **Breaking Change:**
  - **Yes**. Authoring raw RN touch responder handlers on web components will no longer typecheck or attach.

---

### Item B7: Test Identifier (`testID` vs Standard `data-testid`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/helpers/getSplitStyles.tsx:902-918`: Intercepts `keyInit === 'testID'`, checks `isReactNative`, and writes `viewProps['data-testid'] = valInit` while preserving `viewProps.testID` for RN animation drivers.
  - [**READ**] `code/core/web/src/dom/html.native.tsx:51`: Declares rename `'data-testid': 'testID'`.
  - [**READ**] `code/core/web/src/dom/htmlRuntime.native.tsx:142`: Carries note `'data-testid is the one exception and reaches testID on native'`.
- **Target Web / DOM Shape:**
  - Standard HTML attribute `data-testid` authored directly across web and native.
- **Native Adapter Feasibility & Location:**
  - [**READ**] Native adapter in `code/core/web/src/dom/html.native.tsx:51` and `htmlRuntime.native.tsx:142` already maps `data-testid` to `testID` on native host components.
- **Breaking Change:**
  - **Yes** (for web callers authoring `testID` instead of `data-testid`).

---

### Item B8: Element Identifier (`nativeID` vs Standard `id`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/RNExclusiveTypes.ts`: Inherits `nativeID` from RN `ViewProps`.
  - [**READ**] `code/core/web/src/types.tsx:2730`: Documents `nativeID → id`.
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:47`: Declares `id?: string`.
  - [**READ**] `code/core/web/src/helpers/getSplitStyles.tsx:920-923`: Passes `id` to `viewProps.id`.
- **Target Web / DOM Shape:**
  - Standard HTML `id` attribute.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/dom/src/tables/attributes.ts:24-25`: Notes `id is the exception: View, Text and TextInput all take it, so that row passes it straight through`.
- **Breaking Change:**
  - **Yes** (for code passing `nativeID` on web).

---

### Item B9: `asChild` Web Translation Modes (`'web'`, `'except-style-web'`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:20-25`: `asChild?: boolean | 'except-style' | 'except-style-web' | 'web'`.
  - [**READ**] `code/core/web/src/types.tsx:264-267`: Re-exports the 4-variant `asChild` union.
  - [**READ**] `code/core/web/src/createComponent.tsx:1898-1912`: When `asChild === 'web'` or `'except-style-web'`, invokes `getWebEvents` to rewrite child element events (`onPress` → `onClick`).
  - [**READ**] `code/core/web/src/helpers/getSplitStyles.tsx:931, 1411`: Tests `asChild === 'except-style-web'`.
- **Target Web / DOM Shape:**
  - `asChild={true}` or `asChild="except-style"`. Since web events (`onClick`, etc.) are primary, no event renaming mode is required.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/adapters.ts` (`clickFromPress`) handles event adaptation on native.
- **Breaking Change:**
  - **Yes** (removing string modes `'web'` and `'except-style-web'`).

---

### Item B10: Runtime Blacklist Shipped to Web Bundle (`nativeOnlyProps.ts`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/helpers/nativeOnlyProps.ts:1-39`: 39-line table with 33 React Native specific prop names (`accessibilityElementsHidden`, `accessibilityIgnoresInvertColors`, `accessibilityLanguage`, `adjustsFontSizeToFit`, `allowFontScaling`, `android_hyphenationFrequency`, `dataDetectorType`, `dynamicTypeRamp`, `elevationAndroid`, `ellipsizeMode`, `hapticFeedback`, `hapticStyle`, `hitSlop`, `importantForAccessibility`, `lineBreakStrategyIOS`, `maxFontSizeMultiplier`, `minimumFontScale`, `needsOffscreenAlphaCompositing`, `nextFocusDown`, `nextFocusForward`, `nextFocusLeft`, `nextFocusRight`, `nextFocusUp`, `onAccessibilityAction`, `onAccessibilityEscape`, `onAccessibilityTap`, `onMagicTap`, `onTextLayout`, `pressRetentionOffset`, `selectionColor`, `shouldRasterizeIOS`, `suppressHighlighting`, `textBreakStrategy`).
  - [**READ**] `code/core/web/src/helpers/skipProps.ts:39-41`: `if (process.env.TAMAGUI_TARGET === 'web') { Object.assign(skipProps, nativeOnlyProps) }` merges this table into the web production bundle.
- **Target Web / DOM Shape:**
  - Clean web runtime: RN props are not accepted on web components, so no runtime blacklist table is shipped to the web bundle.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/htmlRuntime.native.tsx:65-124` defines unsupported prop diagnostics on native.
- **Breaking Change:**
  - **Low** (only breaks code passing untyped RN props to web elements expecting them to be silently swallowed).

---

### Item B11: React Native Web Sniffing & `isReactNative` Branching (`setupReactNative.ts`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/setupReactNative.ts:1-61`: `getReactNativeConfig(Component)` sniffs RNW component descriptors using runtime heuristics (`Component.getSize && Component.prefetch`, `Component.displayName === 'ScrollView'`, `Component.State?.blurTextInput`, `Component.propTypes`) and returns `isReactNative: true`.
  - [**READ**] `code/core/web/src/styled.tsx:574-575`: Sets `isReactNative = Boolean(reactNativeConfig || config?.isReactNative || parentStaticConfig?.isReactNative)`.
  - [**READ**] `code/core/web/src/createComponent.tsx:353, 767, 1506, 1849, 2073`: Branches rendering, layout, and event binding on `isReactNative`.
  - [**READ**] `code/core/web/src/helpers/getSplitStyles.tsx:830, 903, 1257, 1306, 1453`: Branches style splitting and prop passing on `isReactNative`.
- **Target Web / DOM Shape:**
  - Direct DOM element emission on web (`<div>`, `<span>`, `<button>`, etc.); native host components render native primitives from `dom/primitives.native.tsx`.
- **Native Adapter Feasibility & Location:**
  - [**READ**] `code/core/web/src/dom/primitives.native.tsx` (`DOMView`, `DOMText`, `DOMTextInput`, `DOMImage`) provides clean native primitives.
- **Breaking Change:**
  - **Low** (drops wrapping legacy third-party React Native Web components).

---

### Item B12: Ref Method Monkey-Patching (`TamaguiElementMethods`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/types.tsx:537-555`: Defines `TamaguiElementMethods` with `measure(callback)`, `measureInWindow(callback)`, `measureLayout(relativeTo, onSuccess, onFail)`, `focus()`, `blur()`, which are dynamically attached to DOM `HTMLElement` refs on web.
  - [**READ**] `code/core/web/src/dom/primitives.native.tsx:152-182`: Creates facade object wrapping native instances to emulate DOM methods (`getBoundingClientRect`, `tagName`, `nodeName`).
- **Target Web / DOM Shape:**
  - Standard Web DOM element ref methods: `getBoundingClientRect()`, `IntersectionObserver`, `ResizeObserver`, `focus()`, `blur()`.
- **Native Adapter Feasibility & Location:**
  - [**READ**] React Native `View` already has `NativeMethods` (`measure`, `measureInWindow`, `measureLayout`), while `code/core/web/src/dom/primitives.native.tsx:152-182` provides the DOM facade for native elements.
- **Breaking Change:**
  - **Yes** (for web code calling `ref.current.measure(...)` instead of standard `ref.current.getBoundingClientRect()`).

---

### Item B13: Text Truncation / Lines (`numberOfLines`, `lineBreakMode`, `ellipsizeMode`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/views/Text.tsx:15-27, 46-60`: `numberOfLines` is handled on web via built-in variants expanding to `WebkitLineClamp`, `WebkitBoxOrient: 'vertical'`, `display: '-webkit-box'`, `overflow: 'hidden'`.
  - [**READ**] `code/core/web/src/dom/styleTypes.ts:470`: Declares `numberOfLines?: number`.
  - [**READ**] `code/core/web/src/types.tsx:2780`: Omits `numberOfLines` from `ReactTextProps` so style side owns it.
  - [**READ**] `code/core/web/src/dom/html.native.tsx:52`: Maps `rows: 'numberOfLines'`.
- **Target Web / DOM Shape:**
  - Standard CSS `lineClamp` / `WebkitLineClamp` style prop and `textOverflow="ellipsis"`.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native `Text` component natively receives `numberOfLines`. Native style engine maps CSS `lineClamp` to `numberOfLines` on native.
- **Breaking Change:**
  - **Low** (can retain `numberOfLines` as a convenience alias/shorthand for `lineClamp`).

---

### Item B14: Container Sizing Measurement Barrier (`untilMeasured`)

- **Current Shape (`file:line`):**
  - [**READ**] `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:79`: Declares `untilMeasured?: 'hide' | 'show'`.
  - [**READ**] `code/core/web/src/types.tsx:332`: Documents `untilMeasured` as hiding children until parent is measured on native.
  - [**READ**] `code/core/web/src/helpers/skipProps.ts:8`: `untilMeasured: 1` in `skipProps`.
- **Target Web / DOM Shape:**
  - Not applicable on web. Browser CSS Container Queries (`@container`) evaluate synchronously within the browser layout engine.
- **Native Adapter Feasibility & Location:**
  - [**INFERRED**] Native container context handles measurement hiding on native.
- **Breaking Change:**
  - **None** on web (`untilMeasured` was already skipped on web).

---

## Part C: Cross-Cutting Architectural Surface Analysis

### 1. The `asChild` Event Rewriting Seam
In v2, `asChild` allowed passing `'web'` or `'except-style-web'` (`code/core/web/src/createComponent.tsx:1898-1912`). When cloning child elements, Tamagui ran `getWebEvents()` to translate React Native event names (`onPress`, `onPressIn`, `onPressOut`, `onLongPress`) to DOM event names (`onClick`, `onMouseDown`, etc.).
- **V3 Resolution:** Since web event names (`onClick`, `onPointerDown`) are authored directly on all components in v3, child elements receive web event props natively. `asChild` simplifies to `boolean | 'except-style'`.

### 2. Elimination of Synthetic `stopPropagation` on Web
In v2, `code/core/web/src/createComponent.tsx:1784-1786` executed `if (onPress || onClick) { e.stopPropagation() }` to mimic React Native Pressable behavior (where a nested press handler swallows touch events from bubbling to parent touchables).
- **V3 Resolution:** Standard DOM bubbling applies. Component authors call `e.stopPropagation()` explicitly when desired, eliminating surprising event suppression bugs on web.

### 3. Elimination of Multi-Listener Binding (`onMouseDown` + `onTouchStart`)
In v2, `code/core/web/src/eventHandling.ts:15-18` mapped `onPressIn` to attach *both* `onMouseDown` and `onTouchStart`, and `onPressOut` to attach *both* `onMouseUp` and `onTouchEnd`. On hybrid touch/mouse devices, this caused duplicate event firings and state thrashing.
- **V3 Resolution:** Standard W3C Pointer Events (`onPointerDown`, `onPointerUp`) provide single, unified event dispatch across mouse, pen, and touch inputs.

---

## Part D: Codemod & Migration Plan for V3 Beta

All breaking changes identified in Parts A and B are fully mechanical and can be automated via an AST codemod (`@tamagui/codemod v3-shapes`):

```tsx
// 1. Shadows
<View shadowColor="black" shadowRadius={10} shadowOffset={{ width: 0, height: 4 }} shadowOpacity={0.2} />
// ↓ Codemod ↓
<View boxShadow="0 4px 10px rgba(0,0,0,0.2)" />

// 2. Text Shadows
<Text textShadowColor="black" textShadowRadius={2} textShadowOffset={{ width: 1, height: 1 }} />
// ↓ Codemod ↓
<Text textShadow="1px 1px 2px black" />

// 3. Transforms
<View transform={[{ translateX: 20 }, { scale: 2 }]} />
// ↓ Codemod ↓
<View transform="translateX(20px) scale(2)" /> // or: <View x={20} scale={2} />

// 4. Events
<Button onPress={handleClick} onPressIn={handleDown} onLongPress={handleContext} />
// ↓ Codemod ↓
<Button onClick={handleClick} onPointerDown={handleDown} onContextMenu={handleContext} />

// 5. Test IDs
<View testID="header-nav" />
// ↓ Codemod ↓
<View data-testid="header-nav" />

// 6. RN Style Names
<Text writingDirection="rtl" textAlignVertical="center" />
// ↓ Codemod ↓
<Text direction="rtl" verticalAlign="middle" />

// 7. Safe Area
<View pt="safe" pb="safe" />
// ↓ Codemod ↓
<View pt="$safe-area-top" pb="$safe-area-bottom" />
```
