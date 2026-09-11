# Tamagui v3 Platform Gating Inventory & Web-Default Surface Scan

**Status**: Complete Inventory  
**Date**: 2026-08-27  
**Branch**: `v3-beta`  
**Target File**: `plans/v3-beta/scan3-platform-gating.md`  
**Scope**: `@tamagui/helpers`, `@tamagui/web`, `@tamagui/style-grammar`, `@tamagui/static`, and `@tamagui/constants`

---

## Executive Summary

Tamagui v3's shift to web-default authoring is already deeply reflected in the core style engine:
1. **Unprefixed Web-Default Surface**: All 65 web-only style props declared across [`webOnlyStylePropsView`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L50-L81) and [`webOnlyStylePropsText`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L83-L88) are already accepted **unprefixed on the base component prop surface** on web. None of them require a `web:` platform prefix.
2. **Native Drop Pipeline**: On native builds (`TAMAGUI_TARGET === 'native'`), web-only props are merged into [`skipProps`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L34-L36) via [`webPropsToSkip.native.ts`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.native.ts#L12-L55) and **silently dropped** at [`getSplitStyles.tsx:755-804`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L755-L804) before reaching React Native or triggering warnings.
3. **Flat Platform Grammar**: Platform clauses (`web:`, `native:`, `ios:`, `android:`, etc.) are parsed by `@tamagui/style-grammar` as modifier kind `3` (`modifierKindPlatform`), evaluated at runtime against boolean constants in [`directStyle.ts:382-390`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L382-L390), lowered to CSS via [`lowerProgram.ts:267-272`](file:///Users/n8/tamagui/code/core/style-grammar/src/lowerProgram.ts#L267-L272), and statically compiled away during build time via `process.env.TAMAGUI_TARGET` inlining and tree-shaking.
4. **Type-Level Surface**: TypeScript definitions in [`code/core/web/src/types.tsx:2237-2635`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2237-L2635) (`ExtraStyleProps` and `TextStylePropsBase`) expose all web-only properties directly on the base component props, wrapped in `FlatStyleValue<T>`.

---

## 1. Exact Current Set of Web-Only Style Props & Table Inventories

Below is the complete inventory of all platform gating and skip tables in the codebase, listing every key without truncation.

### 1.1 `code/core/helpers/src/webOnlyStyleProps.ts`

- **`nonAnimatableWebViewProps`** ([`webOnlyStyleProps.ts:7-40`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L7-L40)) (32 keys):
  1. `backgroundAttachment`
  2. `backgroundBlendMode`
  3. `backgroundClip`
  4. `backgroundOrigin`
  5. `backgroundRepeat`
  6. `borderBottomStyle`
  7. `borderLeftStyle`
  8. `borderRightStyle`
  9. `borderTopStyle`
  10. `contain`
  11. `containerType`
  12. `containerName`
  13. `content`
  14. `float`
  15. `maskBorderMode`
  16. `maskBorderRepeat`
  17. `maskClip`
  18. `maskComposite`
  19. `maskMode`
  20. `maskOrigin`
  21. `maskRepeat`
  22. `maskType`
  23. `objectFit`
  24. `overflowBlock`
  25. `overflowInline`
  26. `overflowX`
  27. `overflowY`
  28. `scrollbarWidth`
  29. `textWrap`
  30. `touchAction`
  31. `transformStyle`
  32. `willChange`

- **`nonAnimatableWebTextProps`** ([`webOnlyStyleProps.ts:43-48`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L43-L48)) (4 keys):
  1. `whiteSpace`
  2. `wordWrap`
  3. `textOverflow`
  4. `WebkitBoxOrient`

- **`webOnlyStylePropsView`** ([`webOnlyStyleProps.ts:50-81`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L50-L81)) (59 keys total: spreads `nonAnimatableWebViewProps` + 27 keys):
  - *All 32 keys from `nonAnimatableWebViewProps` above*, plus:
  33. `transition`
  34. `backdropFilter`
  35. `WebkitBackdropFilter`
  36. `borderTop`
  37. `borderRight`
  38. `borderBottom`
  39. `borderLeft`
  40. `backgroundPosition`
  41. `backgroundSize`
  42. `borderImage`
  43. `caretColor`
  44. `clipPath`
  45. `mask`
  46. `maskBorder`
  47. `maskBorderOutset`
  48. `maskBorderSlice`
  49. `maskBorderSource`
  50. `maskBorderWidth`
  51. `maskImage`
  52. `maskPosition`
  53. `maskSize`
  54. `objectPosition`
  55. `textEmphasis`
  56. `userSelect`
  57. `overflowWrap`
  58. `wordWrap` *(also in nonAnimatableWebTextProps)*
  59. `resize`

- **`webOnlyStylePropsText`** ([`webOnlyStyleProps.ts:83-88`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L83-L88)) (6 keys total: spreads `nonAnimatableWebTextProps` + 2 keys):
  - *All 4 keys from `nonAnimatableWebTextProps` above*, plus:
  5. `textDecorationDistance`
  6. `WebkitLineClamp`

---

### 1.2 `code/core/web/src/helpers/webPropsToSkip.ts` vs `webPropsToSkip.native.ts`

- **Web implementation** ([`webPropsToSkip.ts:1`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.ts#L1)):
  ```ts
  export const webPropsToSkip = {}
  ```
  Empty object (0 keys) on web.

- **Native implementation** ([`webPropsToSkip.native.ts:12-55`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.native.ts#L12-L55)):
  Combines:
  1. `...webOnlyStylePropsView` (59 keys)
  2. `...webOnlyStylePropsTextWithoutTextOverflow` (5 keys: `whiteSpace`, `wordWrap`, `WebkitBoxOrient`, `textDecorationDistance`, `WebkitLineClamp`; excludes `textOverflow` because native maps it to `numberOfLines={1}` + `ellipsizeMode="tail"`)
  3. **Web-only event handlers** (35 keys):
     - `onClick`
     - `onDoubleClick`
     - `onContextMenu`
     - `onMouseEnter`
     - `onMouseLeave`
     - `onMouseMove`
     - `onMouseOver`
     - `onMouseOut`
     - `onMouseDown`
     - `onMouseUp`
     - `onWheel`
     - `onKeyDown`
     - `onKeyUp`
     - `onKeyPress`
     - `onPointerDown`
     - `onPointerMove`
     - `onPointerUp`
     - `onPointerCancel`
     - `onPointerEnter`
     - `onPointerLeave`
     - `onDrag`
     - `onDragStart`
     - `onDragEnd`
     - `onDragEnter`
     - `onDragLeave`
     - `onDragOver`
     - `onDrop`
     - `onChange`
     - `onInput`
     - `onBeforeInput`
     - `onScroll`
     - `onCopy`
     - `onCut`
     - `onPaste`
  4. **Other web-only DOM props** (2 keys):
     - `htmlFor`
     - `dangerouslySetInnerHTML`

---

### 1.3 `code/core/web/src/helpers/nativeOnlyProps.ts`

- **`nativeOnlyProps`** ([`nativeOnlyProps.ts:4-38`](file:///Users/n8/tamagui/code/core/web/src/helpers/nativeOnlyProps.ts#L4-L38)) (34 keys):
  1. `accessibilityElementsHidden`
  2. `accessibilityIgnoresInvertColors`
  3. `accessibilityLanguage`
  4. `adjustsFontSizeToFit`
  5. `allowFontScaling`
  6. `android_hyphenationFrequency`
  7. `dataDetectorType`
  8. `dynamicTypeRamp`
  9. `elevationAndroid`
  10. `ellipsizeMode`
  11. `hapticFeedback`
  12. `hapticStyle`
  13. `hitSlop`
  14. `importantForAccessibility`
  15. `lineBreakStrategyIOS`
  16. `maxFontSizeMultiplier`
  17. `minimumFontScale`
  18. `needsOffscreenAlphaCompositing`
  19. `nextFocusDown`
  20. `nextFocusForward`
  21. `nextFocusLeft`
  22. `nextFocusRight`
  23. `nextFocusUp`
  24. `onAccessibilityAction`
  25. `onAccessibilityEscape`
  26. `onAccessibilityTap`
  27. `onMagicTap`
  28. `onTextLayout`
  29. `pressRetentionOffset`
  30. `selectionColor`
  31. `shouldRasterizeIOS`
  32. `suppressHighlighting`
  33. `textBreakStrategy`

---

### 1.4 `code/core/web/src/helpers/skipProps.ts`

- **Base `skipProps`** ([`skipProps.ts:7-23`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L7-L23)) (15 keys):
  1. `untilMeasured`
  2. `transition`
  3. `space`
  4. `animateOnly`
  5. `animatedBy`
  6. `displayName`
  7. `disableClassName`
  8. `debug`
  9. `disableOptimization`
  10. `disableNativeStyle`
  11. `render`
  12. `style` *(handled after prop loop to preserve authored order)*
  13. `group`
  14. `container`
  15. `animatePresence`

- **Conditional Environment Appends**:
  - `data-test-renders`: added if `process.env.NODE_ENV === 'test'` ([`skipProps.ts:25-27`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L25-L27))
  - `__tamaguiStyleDebugReceipt`: added if `process.env.NODE_ENV === 'development'` ([`skipProps.ts:29-31`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L29-L31))
  - `Object.assign(skipProps, webPropsToSkip)`: added if `process.env.TAMAGUI_TARGET === 'native'` ([`skipProps.ts:34-36`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L34-L36))
  - `Object.assign(skipProps, nativeOnlyProps)`: added if `process.env.TAMAGUI_TARGET === 'web'` ([`skipProps.ts:39-41`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L39-L41))

---

### 1.5 `code/core/helpers/src/validStyleProps.ts` & `tokenCategories.ts`

- **`validStyleProps.ts` Target Splices**:
  - `nonAnimatableStyleProps` ([`validStyleProps.ts:128-131`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L128-L131)):
    ```ts
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      ...nonAnimatableWebViewProps,
      ...nonAnimatableWebTextProps,
    })
    ```
  - `stylePropsView` ([`validStyleProps.ts:281`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L281)):
    ```ts
    ...(process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsView : {})
    ```
  - `stylePropsTextOnly` ([`validStyleProps.ts:306`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L306)):
    ```ts
    ...(process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsText : {})
    ```
- **`tokenCategories.ts` Target Splice** ([`tokenCategories.ts:63-65`](file:///Users/n8/tamagui/code/core/helpers/src/tokenCategories.ts#L63-L65)):
  - Under `tokenCategories.color`:
    ```ts
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      caretColor: true,
    })
    ```

---

## 2. Unprefixed Base Acceptance vs `web:` Clause Requirement

### Trace of the Exact Execution Path on Web

Every web-only style prop in `webOnlyStylePropsView` and `webOnlyStylePropsText` is **accepted UNPREFIXED** on the base style surface on web. It does **not** require a `web:` clause.

#### Step-by-Step Code Path:

1. **Host Validity Table Construction** ([`getSplitStyles.tsx:531-534`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L531-L534)):
   ```ts
   const validStyles =
     staticConfig.validStyles ||
     (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
   ```
   When `process.env.TAMAGUI_TARGET === 'web'`, `validStylesView` (`stylePropsView`) includes `...webOnlyStylePropsView` ([`validStyleProps.ts:281`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L281)), and `stylePropsText` includes `...webOnlyStylePropsText` ([`validStyleProps.ts:306`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L306)).

2. **Style Key Validation** ([`getSplitStyles.tsx:433-448`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L433-L448)):
   ```ts
   export function isValidStyleKey(
     key: string,
     validStyles: Record<string, boolean>,
     accept?: Record<string, any>
   ) {
     return Boolean(
       key in validStyles ||
       (isWeb &&
         (key === 'transitionProperty' ||
           key === 'transitionDuration' ||
           key === 'transitionTimingFunction' ||
           key === 'transitionDelay' ||
           key === 'transitionBehavior')) ||
       (accept && key in accept)
     )
   }
   ```
   For web-only props (e.g. `cursor`, `backdropFilter`, `userSelect`, `transformStyle`, `clipPath`, `whiteSpace`), `key in validStyles` evaluates to `true`.

3. **Prop Loop Dispatch** ([`getSplitStyles.tsx:823, 1012-1022`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L823-L1022)):
   ```ts
   let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)
   ...
   if (
     isValidStyleKeyInit &&
     valInit != null &&
     !(process.env.TAMAGUI_TARGET === 'native' && valInit === 'unset') &&
     !(variants && keyInit in variants) &&
     !(accept && keyInit in accept) &&
     !(styledContext && keyInit in styledContext)
   ) {
     contributeStyleValue(styleState, keyInit, valInit, mergeStyle)
     return
   }
   ```
   An authored unprefixed prop like `<View cursor="pointer" backdropFilter="blur(10px)" />` directly calls `contributeStyleValue`.

4. **Direct Style Emission** ([`directStyle.ts:2213-2279`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L2213-L2279) and [`directStyle.ts:1989-2039`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1989-L2039)):
   - A string without a colon (`source.indexOf(':') === -1`) routes to `emitValue` ([`directStyle.ts:2013-2027`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L2013-L2027)).
   - Inside `emitValue` / `emitProperty` ([`directStyle.ts:1127-1141`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1127-L1141)), on web with classes enabled (`state.flatShouldDoClasses`), `directAtomic` creates the atomic CSS class (e.g., `_cursor-pointer` or `_bdf-blur(10px)`).

*Finding*: No web-only style prop requires a `web:` clause when targeting web. All 65 props are standard base-level style props in the web runtime.

---

## 3. Exact Native Drop Sites for Web-Only Style Props

When an unprefixed web-only style prop reaches the native runtime (`TAMAGUI_TARGET === 'native'` or native JS bundle), here is what happens:

### 3.1 Primary Drop Site: Silent Drop via `skipProps` in `getSplitStyles.tsx`

**Behavior**: Dropped **silently**. Does **not** warn. Does **not** throw. React Native does **not** receive it.

- **Drop Site**: [`code/core/web/src/helpers/getSplitStyles.tsx:755-804`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L755-L804)
- **Quoted Code**:
  ```tsx
  // code/core/web/src/helpers/getSplitStyles.tsx:755-804
  // keyInit === 'style' is handled in skipProps
  if (keyInit in skipProps && !noSkip && !isHOC && !neverSkipProps?.[keyInit]) {
    if (keyInit === 'group') {
      ...
    }
    if (keyInit === 'container' && valInit) {
      ...
    }
    if (keyInit === 'transition' && typeof valInit === 'string') {
      ...
    } else {
      return
    }
  }
  ```
  Because [`skipProps.ts:34-36`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L34-L36) merged [`webPropsToSkip`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.native.ts#L12-L55) into `skipProps`, any web-only style prop (`cursor`, `backdropFilter`, `clipPath`, `mask`, `transformStyle`, `willChange`, etc.) matches `keyInit in skipProps` and hits line 803: `return`. It never reaches `viewProps`, never reaches `styleState.style`, and is silently discarded.

- **Secondary Skip Guard** (for HOC or passthrough edges) ([`getSplitStyles.tsx:982-996`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L982-L996)):
  ```tsx
  if (!noSkip && !neverSkipProps?.[keyInit]) {
    if (
      keyInit in skipProps &&
      !(
        keyInit === 'transition' &&
        typeof valInit === 'string' &&
        !driver?.animations?.[valInit]
      )
    ) {
      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupEnd()
      }
      return
    }
  }
  ```

---

### 3.2 Specific Native Interceptions & Dev Warnings

A subset of web-only / web-leaning style props are intercepted at dedicated sites:

1. **`transition` and Transition Longhands** ([`getSplitStyles.tsx:689-698`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L689-L698) & [`getSplitStyles.tsx:1220-1223`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1220-L1223)):
   - `getSplitStyles.tsx:689-698`:
     ```tsx
     if (
       process.env.TAMAGUI_TARGET === 'native' &&
       (keyInit === 'transition' ||
         keyInit === 'transitionProperty' ||
         keyInit === 'transitionDuration' ||
         keyInit === 'transitionTimingFunction' ||
         keyInit === 'transitionDelay' ||
         keyInit === 'transitionBehavior')
     ) {
       return
     }
     ```
     *Behavior*: Dropped **silently**.
   - `getSplitStyles.tsx:1220-1223`:
     ```tsx
     if (
       effectiveTransition != null &&
       styleState.style &&
       (process.env.TAMAGUI_TARGET === 'native' || driver?.outputStyle !== 'css')
     ) {
       delete styleState.style.transition
     }
     ```
     *Behavior*: Deleted from output `style` object **silently**.

2. **`containerType` and `containerName`** ([`getSplitStyles.tsx:1227-1230`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1227-L1230)):
   ```tsx
   if (process.env.TAMAGUI_TARGET === 'native' && styleState.style) {
     if ('containerType' in styleState.style) delete styleState.style.containerType
     if ('containerName' in styleState.style) delete styleState.style.containerName
   }
   ```
   *Behavior*: Dropped **silently** from style (used only for native layout/context measurement).

3. **`textOverflow`** ([`getSplitStyles.tsx:862-869`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L862-L869)):
   ```tsx
   } else if (keyInit === 'textOverflow') {
     if (isText && valInit === 'ellipsis') {
       viewProps.numberOfLines ??= 1
       viewProps.ellipsizeMode ??= 'tail'
     }
     return
   }
   ```
   *Behavior*: Re-mapped to React Native `numberOfLines={1}` and `ellipsizeMode="tail"` on Text, then returns **silently** (dropped from style object).

4. **`userSelect`** ([`getSplitStyles.tsx:859-861`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L859-L861)):
   ```tsx
   if (keyInit === 'userSelect') {
     keyInit = 'selectable'
     valInit = valInit !== 'none'
   }
   ```
   *Note (READ)*: `userSelect` is in `webOnlyStylePropsView` -> `webPropsToSkip` -> `skipProps`, so standard elements drop it at line 755 before reaching line 859 unless `isHOC` or `noSkip` is true.

5. **Logical Borders (`borderBlock`, `borderInline`)** ([`directStyle.ts:1192-1197`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1192-L1197)):
   ```tsx
   if (!isWeb && (property === 'borderBlock' || property === 'borderInline')) {
     if (process.env.NODE_ENV === 'development') {
       warnOnce(`RN has no logical border shorthand "${property}"; dropping it`)
     }
     return
   }
   ```
   *Behavior*: **Warns once in development**, then dropped **silently**. In production, dropped **silently**.

6. **Complex `background`** ([`directStyle.ts:1738-1743`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1738-L1743)):
   ```tsx
   if (!isWeb) {
     if (process.env.NODE_ENV === 'development') {
       warnOnce(`native background cannot represent "${raw}"; dropping it`)
     }
     return
   }
   ```
   *Behavior*: If single color, lowered to `backgroundColor`. If gradient/url/multi-part, **warns in development** and dropped **silently**.

7. **Raw `style={{ ... }}` Passthrough** ([`getSplitStyles.tsx:608-635, 737-740, 1483`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L608-L1483)):
   If an author passes a web-only prop directly through the raw React Native `style` prop (e.g. `<View style={{ cursor: 'pointer', backdropFilter: 'blur(5px)' }} />`):
   - It bypasses `skipProps` via `mergeStylePropAtCurrentPosition` ([`getSplitStyles.tsx:737-740`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L737-L740)).
   - It writes directly into `styleState.style` ([`getSplitStyles.tsx:1616-1620`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1616-L1620)).
   - It is assigned directly to `viewProps.style` ([`getSplitStyles.tsx:1483`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1483)).
   *Behavior*: React Native **receives it directly**. React Native's bridge (Fabric / Paper) will ignore unrecognized style properties or emit React Native's own runtime prop warning in dev mode.

---

## 4. Flat-Value Platform Clauses (`web:`, `native:`, `ios:`, `android:`, etc.)

### 4.1 Platform Vocabulary Declaration & Grammar Compilation

- **Declaration** ([`code/core/style-grammar/src/config.ts:56-86`](file:///Users/n8/tamagui/code/core/style-grammar/src/config.ts#L56-L86)):
  ```ts
  // config.ts:56-64
  export const grammarPlatformNames: ReadonlySet<string> = new Set([
    'web',
    'native',
    'android',
    'ios',
    'tv',
    'androidtv',
    'tvos',
  ])

  // config.ts:80-86
  export function grammarPlatformRank(modifier: string): number {
    return modifier === 'native' || modifier === 'web'
      ? 1
      : modifier === 'androidtv' || modifier === 'tvos'
        ? 3
        : 2
  }
  ```
- **Compilation into Modifier Vocabulary** ([`code/core/style-grammar/src/modifierVocabulary.ts:12, 95-97`](file:///Users/n8/tamagui/code/core/style-grammar/src/modifierVocabulary.ts#L12-L97)):
  ```ts
  export const modifierKindPlatform = 3
  ...
  forEachModifierName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, modifierKindPlatform | (grammarPlatformRank(name) << 3))
  )
  ```

---

### 4.2 Runtime Clause Parsing & Evaluation

1. **Config Preparation** ([`code/core/web/src/helpers/grammarConfig.ts:62`](file:///Users/n8/tamagui/code/core/web/src/helpers/grammarConfig.ts#L62)):
   `compileModifierVocabulary` runs during `prepareConfigRevision` and embeds modifier codes into `configRevision.modifiers`.

2. **Platform Matching Engine** ([`code/core/web/src/helpers/directStyle.ts:382-390`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L382-L390)):
   ```ts
   export function platformMatches(name: string): boolean {
     if (name === 'web') return isWeb
     if (name === 'native') return !isWeb
     if (name === 'ios') return isIos
     if (name === 'android') return isAndroid
     if (name === 'tvos') return isIos && isTV
     if (name === 'androidtv') return isAndroid && isTV
     return name === 'tv' && isTV
   }
   ```

3. **Modifier Chain Resolution** ([`code/core/web/src/helpers/directStyle.ts:517-523`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L517-L523)):
   ```ts
   if (kind === modifierKindPlatform) {
     if (rank > platformRank) platformRank = rank
     const matches = platformMatches(modifier)
     active &&= matches
     emit &&= matches
     continue
   }
   ```
   - When resolving `bg="red web:blue native:green"` on web:
     - `web:`: `platformMatches('web')` evaluates `isWeb` (`true`). `active` and `emit` stay `true`.
     - `native:`: `platformMatches('native')` evaluates `!isWeb` (`false`). `active` and `emit` become `false`, suppressing emission.

4. **Program Lowering (Web CSS)** ([`code/core/style-grammar/src/lowerProgram.ts:267-272`](file:///Users/n8/tamagui/code/core/style-grammar/src/lowerProgram.ts#L267-L272)):
   ```ts
   if (kind === 'platform') {
     // a web clause applies here exactly as if unconditional at its position;
     // every other platform's clause belongs to native and is not web CSS
     if (modifier !== 'web') skip = true
     continue
   }
   ```

---

### 4.3 Build-Time Elimination via `process.env.TAMAGUI_TARGET`

- **Static Compiler Target Inlining** ([`code/compiler/static/src/compilerHost.ts:1276-1310`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1276-L1310)):
  ```ts
  const resolveSplitStyles = (...) => {
    const previousStatic = process.env.IS_STATIC
    const previousTarget = process.env.TAMAGUI_TARGET
    if (platform === 'native') {
      process.env.IS_STATIC = 'is_static'
    } else {
      delete process.env.IS_STATIC
    }
    process.env.TAMAGUI_TARGET = platform
    try {
      return core.getSplitStyles(...)
    } finally {
      if (previousStatic === undefined) delete process.env.IS_STATIC
      else process.env.IS_STATIC = previousStatic
      if (previousTarget === undefined) delete process.env.TAMAGUI_TARGET
      else process.env.TAMAGUI_TARGET = previousTarget
    }
  }
  ```
- **Constant Target Inlining in Production Dist**:
  - `code/core/constants/src/constants.ts:3-56`: `export const isWeb: boolean = true`. In production bundles, build tools (Vite, Webpack, Rollup, ESBuild) replace `process.env.TAMAGUI_TARGET` with `'web'` and `isWeb` with `true`.
  - Inactive branches (e.g. `process.env.TAMAGUI_TARGET === 'native'`) are dead-code eliminated and tree-shaken from web output.

---

## 5. Reverse Case: Style Props Accepted Unprefixed on Native but Not Web

Are there style props accepted on Native but **not** Web?

### Inventory of Native-Only Style Props:

1. **`elevation`**:
   - **Where**: [`code/core/web/src/helpers/getSplitStyles.tsx:1071`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1071):
     ```ts
     const isHostStyleKey =
       isValidStyleKey(key, validStyles, accept) ||
       (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
     ```
   - *Status*: Accepted on native Android as a host style key. Not accepted on web (not in `validStyleProps.ts` or web `validStyles`).

2. **`elevationAndroid`**:
   - **Where**: [`code/core/helpers/src/validStyleProps.ts:257`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L257):
     ```ts
     ...(isAndroid ? { elevationAndroid: true } : {})
     ```
   - On web, explicitly added to [`nativeOnlyProps.ts:13`](file:///Users/n8/tamagui/code/core/web/src/helpers/nativeOnlyProps.ts#L13) -> [`skipProps.ts:40`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L40) and skipped.
   - On native non-Android, dropped at [`getSplitStyles.tsx:855`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L855).

### Non-Style Native Props Skipped on Web:

33 React Native component / text / accessibility props are accepted on native but explicitly skipped on web via [`nativeOnlyProps.ts:4-38`](file:///Users/n8/tamagui/code/core/web/src/helpers/nativeOnlyProps.ts#L4-L38) and [`skipProps.ts:40`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L40) so they do not leak to DOM nodes as invalid HTML attributes:
- `accessibilityElementsHidden`, `accessibilityIgnoresInvertColors`, `accessibilityLanguage`, `adjustsFontSizeToFit`, `allowFontScaling`, `android_hyphenationFrequency`, `dataDetectorType`, `dynamicTypeRamp`, `ellipsizeMode`, `hapticFeedback`, `hapticStyle`, `hitSlop`, `importantForAccessibility`, `lineBreakStrategyIOS`, `maxFontSizeMultiplier`, `minimumFontScale`, `needsOffscreenAlphaCompositing`, `nextFocusDown`, `nextFocusForward`, `nextFocusLeft`, `nextFocusRight`, `nextFocusUp`, `onAccessibilityAction`, `onAccessibilityEscape`, `onAccessibilityTap`, `onMagicTap`, `onTextLayout`, `pressRetentionOffset`, `selectionColor`, `shouldRasterizeIOS`, `suppressHighlighting`, `textBreakStrategy`.

---

## 6. Type-Level Gating & Prop Declarations

### 6.1 Base Style Interfaces in `code/core/web/src/types.tsx`

Web-only style properties are declared **directly in the base style type definitions**:

- **`ExtraStyleProps`** ([`code/core/web/src/types.tsx:2237-2635`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2237-L2635)):
  Declares all web-only view style properties directly on the interface:
  ```ts
  interface ExtraStyleProps {
    contain?: Properties['contain']
    cursor?: Properties['cursor']
    backdropFilter?: Properties['backdropFilter']
    backgroundOrigin?: Properties['backgroundOrigin']
    backgroundPosition?: Properties['backgroundPosition']
    backgroundRepeat?: Properties['backgroundRepeat']
    backgroundSize?: Properties['backgroundSize']
    overflowWrap?: Properties['overflowWrap']
    wordWrap?: Properties['wordWrap']
    resize?: Properties['resize']
    overflowX?: Properties['overflowX']
    overflowY?: Properties['overflowY']
    textWrap?: Properties['textWrap']
    backgroundClip?: Properties['backgroundClip']
    backgroundBlendMode?: Properties['backgroundBlendMode']
    backgroundAttachment?: Properties['backgroundAttachment']
    clipPath?: Properties['clipPath']
    caretColor?: Properties['caretColor']
    transformStyle?: Properties['transformStyle']
    mask?: Properties['mask']
    maskImage?: Properties['maskImage']
    textEmphasis?: Properties['textEmphasis']
    borderImage?: Properties['borderImage']
    float?: Properties['float']
    overflowBlock?: Properties['overflowBlock']
    overflowInline?: Properties['overflowInline']
    maskBorder?: Properties['maskBorder']
    maskBorderMode?: Properties['maskBorderMode']
    maskBorderOutset?: Properties['maskBorderOutset']
    maskBorderRepeat?: Properties['maskBorderRepeat']
    maskBorderSlice?: Properties['maskBorderSlice']
    maskBorderSource?: Properties['maskBorderSource']
    maskBorderWidth?: Properties['maskBorderWidth']
    maskClip?: Properties['maskClip']
    maskComposite?: Properties['maskComposite']
    maskMode?: Properties['maskMode']
    maskOrigin?: Properties['maskOrigin']
    maskPosition?: Properties['maskPosition']
    maskRepeat?: Properties['maskRepeat']
    maskSize?: Properties['maskSize']
    maskType?: Properties['maskType']
    gridRow?: Properties['gridRow']
    gridRowEnd?: Properties['gridRowEnd']
    gridRowGap?: Properties['gridRowGap']
    gridRowStart?: Properties['gridRowStart']
    gridColumn?: Properties['gridColumn']
    gridColumnEnd?: Properties['gridColumnEnd']
    gridColumnGap?: Properties['gridColumnGap']
    gridColumnStart?: Properties['gridColumnStart']
    gridTemplateColumns?: Properties['gridTemplateColumns']
    gridTemplateAreas?: Properties['gridTemplateAreas']
    containerType?: Properties['containerType']
    containerName?: string
    blockSize?: SizeTokens | number
    inlineSize?: SizeTokens | number
    minBlockSize?: SizeTokens | number
    maxBlockSize?: SizeTokens | number
    objectFit?: Properties['objectFit']
    verticalAlign?: Properties['verticalAlign']
    minInlineSize?: SizeTokens | number
    maxInlineSize?: SizeTokens | number
    borderInlineColor?: ColorTokens
    borderInlineStartColor?: ColorTokens
    borderInlineEndColor?: ColorTokens
    ...
  }
  ```

- **`TextStylePropsBase`** ([`code/core/web/src/types.tsx:2689-2712`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2689-L2712)):
  Declares web-only text style properties directly on the interface:
  ```ts
  export interface TextStylePropsBase
    extends Omit<RNTextStyle, keyof ExtendedBaseProps>, ExtendedBaseProps {
    ellipsis?: boolean
    numberOfLines?: number
    textDecorationDistance?: number
    textOverflow?: Properties['textOverflow']
    whiteSpace?: Properties['whiteSpace']
    wordWrap?: Properties['wordWrap']
    textShadow?: string
    textDecoration?: string
    font?: string
  }
  ```

- **`StackStyleBase`** ([`code/core/web/src/types.tsx:2686-2687`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2686-L2687)):
  ```ts
  export interface StackStyleBase
    extends Omit<ViewStyle, keyof ExtendedBaseProps | 'elevation'>, ExtendedBaseProps {}
  ```

---

### 6.2 Flat Style Value Wrapping & Platform Keys

- **`WithThemeValues<T>`** ([`code/core/web/src/types.tsx:2070-2078`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2070-L2078)):
  Every property in `StackStyleBase` and `TextStylePropsBase` is mapped through `WithThemeValues<T>`, converting each prop type to `FlatStyleValue<T>`.

- **`FlatStyleValue<T>`** ([`code/core/web/src/types.tsx:2056-2068`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2056-L2068)):
  ```ts
  export type FlatStyleObject<T> = { default?: T | (string & {}) } & {
    [K in FlatClauseName]?: T | (string & {})
  }

  export type FlatStyleValue<T> = T | FlatStyleObject<T> | (string & {})
  ```

- **`FlatClauseName`** ([`code/core/web/src/types.tsx:2029-2046`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2029-L2046)):
  Includes `AllPlatforms` (`'web' | 'native' | 'android' | 'ios' | 'tv' | 'androidtv' | 'tvos'`).

- **Orphaned Type Reference**:
  [`code/core/web/src/types.tsx:1536-1541`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L1536-L1541) defines `AddWebOnlyStyleProps<A>`, but it is not used anywhere in the codebase.

*Finding*: At the TypeScript level, all web-only style props exist directly on base component props (`<View cursor="pointer" />`). They do not require nesting under a `web:` prop or platform block.

---

## Summary Matrix

| Property Category | Unprefixed on Base (Web)? | Behavior on Native Runtime | Type-Level Location |
|---|---|---|---|
| **Web-only View Styles** (59 keys: `cursor`, `backdropFilter`, `mask`, `transformStyle`, etc.) | **Yes** (emitted as atomic CSS / class) | **Dropped silently** via `skipProps` ([`getSplitStyles.tsx:755-804`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L755-L804)) | Base `ExtraStyleProps` ([`types.tsx:2237`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2237)) |
| **Web-only Text Styles** (6 keys: `textOverflow`, `whiteSpace`, `wordWrap`, etc.) | **Yes** (emitted as atomic CSS / class) | `textOverflow="ellipsis"` -> mapped to `numberOfLines`/`ellipsizeMode`; rest **dropped silently** | Base `TextStylePropsBase` ([`types.tsx:2689`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2689)) |
| **Web-only DOM Handlers** (35 keys: `onClick`, `onMouseEnter`, `onKeyDown`, etc.) | **Yes** (passed through to DOM element) | **Dropped silently** via `skipProps` ([`getSplitStyles.tsx:755-804`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L755-L804)) | HTML / DOM Attributes |
| **Native-only Styles** (`elevation`, `elevationAndroid`) | **Dropped / Skipped** on Web | Accepted on Android | `RNExclusiveTypes.ts` / Android-only check |
| **Platform Clause Values** (`web:`, `native:`, etc.) | Accepted in flat value strings & objects | Evaluated at runtime / Lowered to CSS / Tree-shaken at build time | `FlatStyleValue` ([`types.tsx:2068`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L2068)) |
