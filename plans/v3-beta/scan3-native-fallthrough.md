# Scan 3: Native Style Fallthrough & Unsupported CSS Properties Audit

**Status**: Completed  
**Date**: 2026-08-27  
**Branch**: `v3-beta`  
**Target File**: `plans/v3-beta/scan3-native-fallthrough.md`  

---

## Executive Summary

Tamagui today does **not** have a single unified allowlist or denylist filter for React Native styles. Instead, it operates a **hybrid, dual-path architecture**:

1. **JSX Props Path (Denylist)**: Known web-only style props (`float`, `overflowX`, `backdropFilter`, etc.) are dropped on native via a **DENYLIST** (`webPropsToSkip.native.ts` merged into `skipProps.ts`). This dropping happens **silently** with no warnings.
2. **`style={{ ... }}` Prop Path (Unfiltered Passthrough)**: Any style passed inside the `style` prop bypasses `skipProps` and `isValidStyleKey` entirely. Keys are merged directly into `styleState.style` and handed to React Native untouched, causing React Native to warn or throw at runtime.
3. **Multi-Value Props with Unsupported Values (`display: 'grid'`, `position: 'sticky'`)**: The property key (e.g., `display`, `position`) is present in `validStyles` and is therefore treated as a valid style prop. The unsupported value (`'grid'`, `'sticky'`) passes directly through to the React Native host component, which triggers React Native's runtime `StyleSheetValidation` error.

---

## 1. The Native Style Resolution Pipeline: Final Output Location

### Final Resolved Style Location
On the native path, the final resolved style object is produced in **[`code/core/web/src/helpers/getSplitStyles.tsx:1481-1485`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1481-L1485)** where `styleState.style` is assigned to `viewProps.style`:

```ts
// code/core/web/src/helpers/getSplitStyles.tsx:1481-1485 [READ]
} else {
  if (style) {
    // native assign styles
    viewProps.style = style as any
  }
}
```

The object is returned in `result.style` ([`code/core/web/src/helpers/getSplitStyles.tsx:1377`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1377)) and `result.viewProps` ([`code/core/web/src/helpers/getSplitStyles.tsx:1376`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1376)).

### Hand-off to React Native Host Component
In [`code/core/web/src/createComponent.tsx`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx):
1. `useSplitStyles` calls `getSplitStyles` at **[`code/core/web/src/createComponent.tsx:859-873`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L859-L873)**.
2. `splitStyles.viewProps` (which contains `style`) is destructured into `nonTamaguiProps` at **[`code/core/web/src/createComponent.tsx:1303-1328`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1303-L1328)** and aliased to `let viewProps = nonTamaguiProps` at **[`code/core/web/src/createComponent.tsx:1332`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1332)**.
3. If an animation driver is active (`shouldUseAnimation`), `viewProps.style = animationStyles` is assigned at **[`code/core/web/src/createComponent.tsx:1421`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1421)**.
4. The final `viewProps` (containing `style`) is handed to the underlying React Native host component at **[`code/core/web/src/createComponent.tsx:1984`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1984)**:

```tsx
// code/core/web/src/createComponent.tsx:1984 [READ]
content = React.createElement(elementType, viewProps, content || children)
```

*(Note on related files)*:
- **[`code/core/web/src/helpers/parseNativeStyle.native.ts:14-29`](file:///Users/n8/tamagui/code/core/web/src/helpers/parseNativeStyle.native.ts#L14-L29)** [READ]: Only handles string-to-RN-object parsing for `backgroundImage`, `boxShadow`, and `textShadow`.
- **[`code/core/web/src/helpers/setElementProps.native.tsx:1-9`](file:///Users/n8/tamagui/code/core/web/src/helpers/setElementProps.native.tsx#L1-L9)** [READ]: Attaches a polyfilled `getBoundingClientRect` to the native element ref via `composeRefs` (`createComponent.tsx:1484`).
- **[`code/core/web/src/helpers/nativeStyleEngine.ts:886-926, 1013-1028`](file:///Users/n8/tamagui/code/core/web/src/helpers/nativeStyleEngine.ts#L886-L926)** [READ]: Handles the experimental native fast path for direct ShadowTree commits.
- **[`code/core/web/src/helpers/useRenderElement.tsx:20-73`](file:///Users/n8/tamagui/code/core/web/src/helpers/useRenderElement.tsx#L20-L73)** [READ]: Implements `evaluateRenderProp` for slot/render prop evaluation (at `createComponent.tsx:1952`, `getCustomRender` is called).

---

## 2. What Happens TODAY to Unsupported Style Keys (Allowlist vs. Denylist)

Today's behavior depends entirely on **how the style was authored**:

### A. Authored as a JSX Prop (e.g. `<View float="left" overflowX="hidden" />`)
This path uses a **DENYLIST** to drop known web-only style properties.

1. **Denylist Definition**:
   [`code/core/web/src/helpers/skipProps.ts:34-36`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L34-L36) merges `webPropsToSkip`:
   ```ts
   // code/core/web/src/helpers/skipProps.ts:34-36 [READ]
   // Skip web-only props on native
   if (process.env.TAMAGUI_TARGET === 'native') {
     Object.assign(skipProps, webPropsToSkip)
   }
   ```
2. **Denylist Contents**:
   [`code/core/web/src/helpers/webPropsToSkip.native.ts:12-15`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.native.ts#L12-L15) pulls from `webOnlyStylePropsView` and `webOnlyStylePropsText`:
   ```ts
   // code/core/web/src/helpers/webPropsToSkip.native.ts:12-15 [READ]
   export const webPropsToSkip = {
     ...webOnlyStylePropsView,
     ...webOnlyStylePropsTextWithoutTextOverflow,
   ...
   ```
   [`code/core/helpers/src/webOnlyStyleProps.ts:50-81`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L50-L81) defines `webOnlyStylePropsView` (e.g. `float`, `overflowX`, `overflowY`, `contain`, `transformStyle`, `backdropFilter`, `backgroundSize`, `resize`, etc.).
3. **Filtering Mechanism**:
   In [`code/core/web/src/helpers/getSplitStyles.tsx:755-804`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L755-L804):
   ```ts
   // code/core/web/src/helpers/getSplitStyles.tsx:755-804 [READ]
   if (keyInit in skipProps && !noSkip && !isHOC && !neverSkipProps?.[keyInit]) {
     ...
     return
   }
   ```
   **Verdict**: Known web-only style props on the denylist are **SILENTLY DROPPED** on native.

### B. Authored as an Unknown Prop (e.g. `<View customCssProp="foo" />`)
1. `isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)` returns `false` at [`code/core/web/src/helpers/getSplitStyles.tsx:823`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L823).
2. The prop flows to `propMapper` ([`code/core/web/src/helpers/getSplitStyles.tsx:1024`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1024)).
3. At [`code/core/web/src/helpers/getSplitStyles.tsx:1039-1054`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1039-L1054):
   ```ts
   // code/core/web/src/helpers/getSplitStyles.tsx:1039-1054 [READ]
   if (!isHOC && disablePropMap && !isStyledContextProp) {
     if (key in stylePropsAll && !isValidStyleKey(key, validStyles, accept)) {
       if (process.env.NODE_ENV === 'development') {
         console.warn(
           `[tamagui] "${key}" is a text style prop and this component is not text — it would render on neither platform. Use a Text-based component, or html.* for raw web elements.`
         )
       }
       return
     }
     viewProps[key] = val
     return
   }
   ```
   **Verdict**: If the key is completely unknown (not in `stylePropsAll`), it is **assigned to `viewProps[key] = val`** (line 1052) and passed directly to the React Native component as a non-style JSX attribute (where React Native host views silently ignore it).

### C. Authored Inside `style={{ ... }}` (e.g. `<View style={{ float: 'left', display: 'grid' }} />`)
1. `keyInit === 'style'` calls `mergeStylePropAtCurrentPosition(valInit)` at [`code/core/web/src/helpers/getSplitStyles.tsx:737-740`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L737-L740).
2. `mergeStylePropAtCurrentPosition` ([`code/core/web/src/helpers/getSplitStyles.tsx:608-634`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L608-L634)) loops through every key in the object and calls `contributeStyleValue`:
   ```ts
   // code/core/web/src/helpers/getSplitStyles.tsx:624-633 [READ]
   for (const key in normalized) {
     if (normalized[key] == null) continue
     contributeStyleValue(
       styleState,
       key,
       normalized[key],
       mergeStyle,
       styleOriginals?.[key]
     )
   }
   ```
3. `contributeStyleValue` ([`code/core/web/src/helpers/directStyle.ts:2213-2279`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L2213-L2279)) calls `emitValue` -> `emitProperty` -> `mergeStyle` ([`code/core/web/src/helpers/getSplitStyles.tsx:1569-1629`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1569-L1629)), which performs:
   ```ts
   // code/core/web/src/helpers/getSplitStyles.tsx:1616-1617 [READ]
   styleState.style ||= {}
   styleState.style[key] = out
   ```
   **Verdict**: There is **NO filter** for keys passed inside `style={{ ... }}`. They are kept in `styleState.style` and passed to React Native, which throws or warns at runtime.

---

## 3. Existing Allowlists and Where They Are Used to Reject Keys

### Allowlist Definitions
Defined in [`code/core/helpers/src/validStyleProps.ts`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts):
- `stylePropsView`: [`code/core/helpers/src/validStyleProps.ts:187-282`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L187-L282) [READ]
- `stylePropsTextOnly`: [`code/core/helpers/src/validStyleProps.ts:292-307`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L292-L307) [READ]
- `stylePropsText`: [`code/core/helpers/src/validStyleProps.ts:310-312`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L310-L312) [READ] (`{ ...stylePropsView, ...stylePropsTextOnly }`)
- `stylePropsAll`: [`code/core/helpers/src/validStyleProps.ts:314`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L314) [READ] (`stylePropsText`)
- `validStyles`: [`code/core/helpers/src/validStyleProps.ts:316`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L316) [READ] (`stylePropsView`)

*Note*: On native (`process.env.TAMAGUI_TARGET === 'native'`), `webOnlyStylePropsView` (`validStyleProps.ts:281`) and `webOnlyStylePropsText` (`validStyleProps.ts:306`) are excluded from `validStyles` and `stylePropsText`.

### Locations Where the Allowlist is Used to REJECT Keys
1. **Frontend Program Values ([`getSplitStyles.tsx:813-819`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L813-L819))** [READ]:
   Rejects invalid style properties with warning:
   `[tamagui] "${valInit.property}" is not a valid style on this component; the frontend value is dropped.`
2. **Text Styles on View Components ([`getSplitStyles.tsx:1044-1051, 1151-1158`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1044-L1051))** [READ]:
   Rejects text style keys (present in `stylePropsAll` but failing `validStyles` on a View) with warning:
   `[tamagui] "${key}" is a text style prop and this component is not text — it would render on neither platform. Use a Text-based component, or html.* for raw web elements.`
3. **Conditional Variant Clauses on Incompatible Hosts ([`getSplitStyles.tsx:1102-1106`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1102-L1106))** [READ]:
   Rejects invalid conditional variant styles with warning:
   `[tamagui] "${key}" is not a valid style on this component; the conditional variant value is dropped.`
4. **Compiler Static Extraction Bailout ([`code/compiler/static/src/compilerHost.ts:1255-1257, 2235-2261`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1255-L1257))** [READ]:
   Uses `isInvalidHostStyleProp` (`name in stylePropsAll && !isValidStyleKey(name, validStyles, staticConfig.accept)`). Rejects text props on non-text elements and triggers compiler bailout.

---

## 4. Existing Dev-Only Warnings in the Native Style Path

All development warnings follow the `process.env.NODE_ENV === 'development'` (or `process.env.NODE_ENV !== 'production'`) pattern using the bounded deduplication helper `warnOnce`:

### Warning Utility Pattern
**[`code/core/web/src/helpers/warnOnce.ts:15-23`](file:///Users/n8/tamagui/code/core/web/src/helpers/warnOnce.ts#L15-L23)** [READ]:
```ts
const warnLimit = 500
const warned = process.env.NODE_ENV !== 'production' ? new Set<string>() : null

export function warnOnce(key: string, message = key) {
  if (process.env.NODE_ENV !== 'development') return
  if (warned!.has(key) || warned!.size >= warnLimit) return
  warned!.add(key)
  console.warn(`[tamagui] ${message}`)
}
```

### Complete List of Style Warnings on Native
1. **Logical Border Shorthands**: [`code/core/web/src/helpers/directStyle.ts:1194`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1194) [READ]
   `warnOnce('RN has no logical border shorthand "${property}"; dropping it')`
2. **Unsupported Background Values**: [`code/core/web/src/helpers/directStyle.ts:1740`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1740) [READ]
   `warnOnce('native background cannot represent "${raw}"; dropping it')`
3. **Unsupported Transform Units/Values**: [`code/core/web/src/helpers/directStyle.ts:1766`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1766) [READ]
   `warnOnce('native transform "${property}" cannot represent "${value}"; dropping it')`
4. **Sub-property Contradictions**: [`code/core/web/src/helpers/directStyle.ts:771`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L771) [READ]
   `warnOnce('"${name}" contributes to "color", not "${property}"; keeping it literal')`
5. **Orphaned Conditional Clauses**: [`code/core/web/src/helpers/directStyle.ts:2003, 2162`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L2003) [READ]
   `warnOnce('conditional "${property}" needs its composite property; dropping it')`
6. **Grammar Scanner Refusals**: [`code/core/web/src/helpers/directStyle.ts:108, 142, 160`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L108) [READ]
   Calls `warnRefusedValue(property, source, reason)` (`warnOnce.ts:42-47`).
7. **Text Style on View Warning**: [`code/core/web/src/helpers/getSplitStyles.tsx:1046, 1153`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1046) [READ]
   `console.warn('[tamagui] "${key}" is a text style prop and this component is not text — it would render on neither platform...')`
8. **Frontend Program Dropped**: [`code/core/web/src/helpers/getSplitStyles.tsx:816`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L816) [READ]
   `console.warn('[tamagui] "${valInit.property}" is not a valid style on this component; the frontend value is dropped.')`

---

## 5. How `display` Flows Today on Web and Native

### Definition
`display: true` is defined in `nonAnimatableViewProps` at [`code/core/helpers/src/validStyleProps.ts:75`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L75) [READ], which is included in `stylePropsView` (`validStyleProps.ts:188`) and exported as `validStyles` (`validStyleProps.ts:316`).

### Flow on Web
- `isValidStyleKey('display', validStyles, accept)` evaluates to `true` (`getSplitStyles.tsx:823`).
- Flushed as atomic CSS (`_dsp-grid`) or inline style (`styleState.style.display = 'grid'`) at `directStyle.ts:1131` / `getSplitStyles.tsx:1617`.
- **Web Result**: Accepted and rendered natively by the browser.

### Flow on Native
1. `display` is in `validStyles` ([`code/core/helpers/src/validStyleProps.ts:75, 316`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L75)).
2. `display` is **NOT** in `webPropsToSkip.native.ts` or `skipProps.ts`.
3. `isValidStyleKey('display', ...)` evaluates to `true` at [`code/core/web/src/helpers/getSplitStyles.tsx:823`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L823).
4. Handled by `contributeStyleValue(styleState, 'display', 'grid', mergeStyle)` at [`code/core/web/src/helpers/getSplitStyles.tsx:1020`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1020).
5. `mergeStyle` sets `styleState.style['display'] = 'grid'` at [`code/core/web/src/helpers/getSplitStyles.tsx:1617`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1617).
6. Assigned to `viewProps.style = style` at [`code/core/web/src/helpers/getSplitStyles.tsx:1483`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L1483).
7. Passed into `React.createElement(elementType, viewProps, ...)` at [`code/core/web/src/createComponent.tsx:1984`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1984).
8. **Native Result**: React Native / Yoga only supports `display: 'flex'` and `display: 'none'`. React Native's `StyleSheetValidation` throws an error / warning in dev: `Invalid prop display of value grid supplied to style, expected one of ["none","flex"]`.

---

## 6. Compiler / Static Extraction Notion of "Valid Style Key"

**YES**, the compiler in [`code/compiler/static/src/compilerHost.ts`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts) maintains its own validation layer:

1. **Imports Allowlist**: Imports `validStylesView`, `stylePropsText`, `stylePropsAll` ([`compilerHost.ts:23-25`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L23-L25) [READ]) and `isValidStyleKey` from `@tamagui/web` ([`compilerHost.ts:46`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L46) [READ]).
2. **`isStyleProp`**: Determines if a prop is a candidate for static style lowering at [`code/compiler/static/src/compilerHost.ts:1217-1225`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1217-L1225) [READ]:
   ```ts
   const isStyleProp = (name: string, component: LoweringComponent): boolean => {
     const staticConfig = component.staticConfig as StaticConfig
     return (
       compilerStyleProps.has(name) ||
       name in (options.tamaguiConfig.shorthands ?? {}) ||
       !!staticConfig.validStyles?.[name] ||
       !!staticConfig.variants?.[name]
     )
   }
   ```
3. **`isInvalidHostStyleProp`**: Validates whether a style is permitted on the host at [`code/compiler/static/src/compilerHost.ts:1247-1258`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1247-L1258) [READ]:
   ```ts
   const isInvalidHostStyleProp = (
     name: string,
     component: LoweringComponent
   ): boolean => {
     const staticConfig = component.staticConfig as StaticConfig
     const validStyles =
       staticConfig.validStyles ||
       (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
     return (
       name in stylePropsAll && !isValidStyleKey(name, validStyles, staticConfig.accept)
     )
   }
   ```
4. **Bailout on Invalid Host Styles**: [`compilerHost.ts:2233-2262`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L2233-L2262) [READ] bails out with `local/unsupported-target` if an invalid host style prop is found.
5. **Direct Style Name Resolver**: [`compilerHost.ts:1260-1268`](file:///Users/n8/tamagui/code/compiler/static/src/compilerHost.ts#L1260-L1268) [READ] checks `staticConfig.validStyles?.[expanded]`.

---

## Warning Hook Location (< 10 lines)

```ts
// [INFERRED DESIGN PLACEMENT] In code/core/web/src/helpers/getSplitStyles.tsx (near line 1481) or directStyle.ts emitProperty (line 1153):
if (process.env.TAMAGUI_TARGET === 'native' && process.env.NODE_ENV === 'development') {
  if (styleState.style) {
    for (const key in styleState.style) {
      if (!isSupportedNativeStyle(key, styleState.style[key])) {
        warnOnce(`unsupported:${key}=${styleState.style[key]}`, `Style "${key}: ${styleState.style[key]}" is unsupported on React Native and was dropped. Add a "native:" override to specify native behavior.`)
        delete styleState.style[key]
      }
    }
  }
}
```
*(Hook uses existing `warnOnce` from `code/core/web/src/helpers/warnOnce.ts:18` to deduplicate warnings with a 500-key bound).*
