# Tamagui V3: Roadmap to 100% Web Style API Alignment

## 1. Goal & Definition

"100% Web Style API" means:
- **Keys**: Every property key is standard camelCase CSS (`lineHeight`, `fontSize`, `backgroundColor`, `display`, `marginInline`, `boxShadow`, `gap`, etc.).
- **Values**: Standard CSS syntax and units (`px`, `rem`, `%`, `vh`, `vw`, `calc()`, `min()`, `clamp()`, `auto`, `fit-content`), plus Tamagui tokens and conditional string clauses (`"background hover:background-hover"`).
- **Target semantics**: React Native is treated strictly as a compilation target, not the style design authority. Styles are authored in standard web concepts; the compiler and style grammar expand or adapt them for Yoga and React Native runtime.

Tamagui V3 already took major strides in this direction. This document identifies the exact remaining differences and the concrete steps to achieve complete web alignment.

---

## 2. Where Tamagui V3 Stands Today

V3 has already eliminated several historical React Native quirks:

| Feature | React Native Baseline | Tamagui V3 State | Web Alignment Status |
| --- | --- | --- | --- |
| `lineHeight` | Absolute pixel numbers only (`lineHeight: 24`) | Unitless ratio/multiplier (`lineHeight: 1.5`), strings with `px` (`lineHeight: "24px"`) | **Aligned with CSS** |
| `boxShadow` | 4 separate properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`) | Single CSS-standard `boxShadow` string (`"0 2px 4px rgba(0,0,0,0.1)"`) | **Aligned with CSS** |
| `filter` | Unsupported / native-only APIs | CSS filter string (`"blur(4px) brightness(0.9)"`) | **Aligned with CSS** |
| `border` | Separate width, color, style per side | Standard shorthand string (`"1px solid #ccc"`) | **Aligned with CSS** |
| `outline` | Unsupported on native | Standard shorthand string (`"2px solid blue"`) | **Aligned with CSS** |
| `backgroundImage` | Unsupported on View (`ImageBackground` required) | CSS gradient strings (`"linear-gradient(...)"`) | **Aligned with CSS** |
| Logical Box Model | Partial or non-standard | `marginBlock`, `marginInline`, `paddingBlock`, `paddingInline`, `inset`, `blockSize`, `inlineSize` | **Aligned with CSS** |
| DOM Elements | Generic `View` and `Text` | `html.*` primitives (`html.div`, `html.span`, `html.h1`, etc.) | **Aligned with CSS** |

---

## 3. The Remaining Gaps to 100% Web Style API

Four categories of discrepancies remain between current Tamagui styles and the standard web CSS object model.

### Gap 1: Proprietary React Native Keys to Deprecate

These properties exist solely due to React Native legacy and should be formally deprecated or mapped directly to standard CSS equivalents:

1. **`elevation` (Android only)**
   - *Web equivalent*: `boxShadow`.
   - *Action*: Deprecate `elevation`. When `boxShadow` is provided, generate appropriate elevation or native shadow on Android.
2. **`marginHorizontal` / `marginVertical` / `paddingHorizontal` / `paddingVertical`**
   - *Web equivalent*: `marginInline` / `marginBlock` / `paddingInline` / `paddingBlock`, or standard 2-value shorthand `margin: "10px 20px"`.
   - *Action*: Treat RN horizontal/vertical keys as legacy aliases. Promote `marginInline` and `marginBlock` across docs, types, and codemods.
3. **`marginStart` / `marginEnd` / `paddingStart` / `paddingEnd`**
   - *Web equivalent*: `marginInlineStart` / `marginInlineEnd` / `paddingInlineStart` / `paddingInlineEnd`.
   - *Action*: Standardize on CSS logical property names.
4. **`textAlignVertical` (`'auto' | 'top' | 'bottom' | 'center'`)**
   - *Web equivalent*: `verticalAlign` on inline elements, or flexbox container alignment (`alignItems: 'center'`).
   - *Action*: Deprecate in favor of `verticalAlign` or flex layout.
5. **`includeFontPadding` (Android boolean)**
   - *Web equivalent*: Does not exist in CSS (standard CSS font metrics govern bounding boxes).
   - *Action*: Remove from core style types; handle via compiler or platform config if necessary.
6. **`writingDirection` (`'auto' | 'ltr' | 'rtl'`)**
   - *Web equivalent*: `direction: 'ltr' | 'rtl'`.
   - *Action*: Standardize on `direction`.
7. **`pointerEvents` quirky values (`'box-none' | 'box-only'`)**
   - *Web equivalent*: `'none' | 'auto'`.
   - *Action*: Support standard CSS `pointerEvents: 'none' | 'auto'`. Map `'box-none'` to native runtime only when targeting RN native views.
8. **Legacy shadow props (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)**
   - *Web equivalent*: `boxShadow`.
   - *Action*: Deprecate the 4-part shadow split completely in favor of single `boxShadow` strings.

---

### Gap 2: Box Model & Flexbox Defaults (Semantic Alignment)

This is the largest semantic divergence between React Native and the Web:

1. **`flexDirection` default**
   - In React Native: `display: flex` defaults to `flexDirection: 'column'`.
   - In Web CSS: `display: flex` defaults to `flexDirection: 'row'`.
2. **`flexShrink` default**
   - In React Native: `flexShrink: 0`.
   - In Web CSS: `display: flex` defaults to `flexShrink: 1`.
3. **`position` default**
   - In React Native: elements default to `position: 'relative'`.
   - In Web CSS: elements default to `position: 'static'`.
4. **`display` default**
   - In React Native: all components are flex containers (`display: 'flex'`).
   - In Web CSS: `div` is `display: 'block'`, `span` is `display: 'inline'`.

**Resolution Strategy**:
- **`html.*` Primitives**: Standardize `html.div`, `html.span`, `html.p` to follow standard web defaults (`display: block`, `position: static`). When `display="flex"` is declared, it follows web flex defaults (`row`, `shrink: 1`).
- **Stack Primitives (`YStack`, `XStack`)**: Keep `YStack` (column) and `XStack` (row) as explicit flex containers. Because their layout intent is in their name, they avoid ambiguity on all platforms.
- **`<View>`**: Keep `<View>` backwards-compatible for React Native migration, but position `html.*` and `styled()` as the standard web-aligned entry points.

---

### Gap 3: Missing or Partial Web CSS Properties

Properties standard on web that require consistent compiler and runtime handling across targets:

1. **CSS Grid (`display: 'grid'`)**
   - Properties: `gridTemplateColumns`, `gridTemplateRows`, `gridAutoFlow`, `gridColumn`, `gridRow`, `gridGap`.
   - Web: Passes through directly to atomic CSS.
   - Native: Yoga 3.0 has begun introducing grid concepts, but for general native support, `@tamagui/static` can compile static grids into flex rows/columns or fallback to flex emulation.
2. **Multi-Value Shorthands**
   - Web supports: `margin: "10px 20px"`, `padding: "4px 8px 12px 16px"`, `border: "1px solid red"`, `inset: "0"`, `gap: "10px 20px"`.
   - Native Yoga requires individual side properties (`marginTop`, `marginRight`, `rowGap`, `columnGap`).
   - Tamagui's `@tamagui/style-grammar` and compiler must expand multi-value strings into individual sides during static extraction and runtime preprocessing.
3. **CSS Math & Sizing Functions**
   - Functions: `calc()`, `min()`, `max()`, `clamp()`.
   - Web: Native CSS evaluation.
   - Native: Static values are resolved where possible; dynamic values warn or evaluate via dimension listeners.
4. **`cursor` & `userSelect`**
   - Standard web interaction properties. On native, `cursor` is ignored (or used on macOS/iPadOS pointer), and `userSelect` maps to `selectable` on Text.

---

## 4. Five-Step Implementation Plan

### Step 1: Canonical Web CSS Type Schema
- Make `@tamagui/core/dom` (`styleTypes.ts`) the single canonical source of truth for Tamagui styling types.
- Update `styleTypes.ts` so that all properties are typed against standard web CSS naming (`direction`, `boxShadow`, `verticalAlign`, `pointerEvents`).
- Add `@deprecated` JSDoc annotations to all legacy React Native keys (`elevation`, `marginHorizontal`, `marginVertical`, `shadowOffset`, etc.), directing developers to the web standard equivalents.

### Step 2: Shorthand & Property Expansion in `@tamagui/style-grammar`
- Ensure `@tamagui/style-grammar` and the compiler expand all multi-value web shorthands:
  - `margin: "10px 20px"` -> top/bottom `10px`, left/right `20px` (or `marginBlock` / `marginInline`).
  - `gap: "10px 20px"` -> `rowGap: "10px"`, `columnGap: "20px"`.
  - `inset: "0"` -> `top: 0, right: 0, bottom: 0, left: 0`.
  - `direction: "rtl"` -> maps to React Native `writingDirection: "rtl"`.
- This guarantees zero runtime friction when running web-syntax styles on iOS and Android.

### Step 3: Migration Codemod (`tamagui migrate --web-align`)
- Implement a focused codemod in the Tamagui CLI:
  - `marginHorizontal` -> `marginInline` (or `mx`)
  - `marginVertical` -> `marginBlock` (or `my`)
  - `paddingHorizontal` -> `paddingInline` (or `px`)
  - `paddingVertical` -> `paddingBlock` (or `py`)
  - `elevation` -> `boxShadow`
  - `shadow*` (4-prop) -> `boxShadow`
  - `textAlignVertical` -> `verticalAlign`
- This allows existing codebases to transition cleanly without manual editing.

### Step 4: Cement `html.*` as the Primary Styling Interface
- Clarify the role of primitives:
  - `html.*` elements (`html.div`, `html.span`, `html.section`, etc.) are 100% web-first. They use standard web defaults and compile to atomic CSS on web and optimized views on native.
  - `YStack` and `XStack` are explicit directional stacks for rapid cross-platform layout without flex-direction ambiguity.
  - Core `<View>` remains available for drop-in React Native compatibility.

### Step 5: Positioning & Documentation
- Update all documentation and guides to frame Tamagui as:
  **"A web-aligned universal style system with optimizing compiler support for web and native."**
- Retire phrasing that describes Tamagui as "expanding React Native". React Native is a deployment target; the authoring model is standard web.
