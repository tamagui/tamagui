# V3 Scan: Duplicate Concept Implementations

**Scope:** `code/core/web/src`, `code/core/style-grammar/src`, `code/core/helpers/src`  
**Branch:** `v3-beta`  
**Purpose:** Identify concepts implemented in more than one place where copies can silently drift, excluding findings already scheduled in [`v3-style-engine-plan.md`](./v3-style-engine-plan.md).

---

## 1. Summary of Findings

| # | Finding | Primary Locations | Consumers | Win | Risk | Effort |
|---|---------|-------------------|-----------|-----|------|--------|
| 1 | **Triplicate Unitless Property Tables & Suffix Matchers** | `helpers/validStyleProps.ts:134`<br>`style-grammar/unitlessNumbers.ts:1`<br>`web/helpers/variableValue.ts:4` | `internal-runtime.ts`<br>`normalizeValueWithProperty.ts`<br>`dom/primitives.native.tsx`<br>`configVariables.ts` | Prevents runtime/compiler unit desync and drops redundant property sets | Low | Small |
| 2 | **Dead / Orphaned Files with Zero Consumers** | `web/helpers/normalizeStylePropKeys.ts:1`<br>`web/helpers/normalizeStylePropKeys.native.ts:1`<br>`web/constants/accessibilityDirectMap.tsx:1`<br>`web/constants/accessibilityDirectMap.native.tsx:1`<br>`web/helpers/getFontLanguage.ts:1`<br>`web/helpers/getShorthandValue.ts:1` | **Zero consumers** in entire repo (including barrels & tests) | Deletes 6 dead files, reduces package bundle & export surface | None | Trivial |
| 3 | **Duplicate Border & Outline Keyword Sets and Shorthand Parsers** | `web/helpers/parseBorderShorthand.native.ts:4, 20`<br>`web/helpers/parseOutlineShorthand.native.ts:4, 20`<br>`style-grammar/borderFamily.ts:58, 104` | `expandStyle.ts:140, 150`<br>`style-grammar` | Consolidates 3 duplicate 10-keyword Sets and 2 native regex parsers onto canonical `borderFamily` | Low | Small |
| 4 | **Duplicate Native CSS Transform String Parsers with Drifting Semantics** | `web/helpers/parseNativeTransform.native.ts:1`<br>`style-grammar/transformFamily.ts:301` | `directStyle.ts:1837`<br>`transformFamily.ts:285` | Eliminates divergent transform parsing (dp vs strict CSS, matrix validation, translate3d) | Low | Small |
| 5 | **Duplicate Safe-Area Prop Mappings, Expansions, and Inset Access** | `web/helpers/resolveSafeArea.ts:15, 58`<br>`web/helpers/resolveSafeArea.native.ts:12, 52`<br>`style-grammar/safeAreaVariables.ts:1`<br>`web/helpers/resolveSafeAreaVariable.ts:1`<br>`web/helpers/resolveSafeAreaVariable.native.ts:5` | `directStyle.ts:770, 1545`<br>`style-grammar/candidate.ts` | Hoists verbatim 39-line `propEdges` table into `helpers`, unifies edge extraction, unifies native insets read | Low | Small |
| 6 | **Drifting Token Category Lists & Omission of `space` in `helpers`** | `helpers/tokenCategories.ts:5`<br>`web/helpers/tokenCategories.ts:18`<br>`web/helpers/grammarConfig.ts:118`<br>`web/helpers/variableValue.ts:21`<br>`style-grammar/config.ts:123` | `validStyleProps.ts`<br>`directStyle.ts`<br>`getConfigRevisionSnapshot`<br>`findVariableToken` | Adding `space` to canonical `tokenCategories` deletes 60+ hand-listed lines in `tokenCategoryByProperty` and 4 ad-hoc arrays | Low | Small |
| 7 | **Hand-Maintained Web Event Skip List vs Generated DOM Event Table** | `web/helpers/webPropsToSkip.native.ts:16`<br>`web/dom/domEventProps.native.ts:10` | `skipProps.ts:35`<br>`dom/primitives.native.tsx` | Replaces stale 34-event skip list with canonical `@tamagui/dom` table, fixing dropped native pointer/DOM events | Low | Small |
| 8 | **Duplicate CSS Named Colors (148 Names) and Color Functions** | `style-grammar/backgroundFamily.ts:3, 9`<br>`normalize-css-color/src/index.ts:10, 23` | `classifyComponent`<br>`normalizeColor.native.ts` | Eliminates duplicate 148-entry color name lists and regex suites | Low | Small |
| 9 | **Duplicate "Npx" Literal Pixel String Regex** | `web/createVariable.ts:21`<br>`web/helpers/normalizeValueWithProperty.ts:19` | `createVariable.ts:31`<br>`normalizeValueWithProperty.ts:23` | Shares single regex pattern for literal pixel string parsing | None | Trivial |
| 10 | **Duplicate CamelCase-to-Hyphen String Formatters** | `web/helpers/mediaObjectToString.ts:3`<br>`web/helpers/getCSSStylesAtomic.ts:228`<br>`style-grammar/v6ThemeNames.ts:33` | `mediaObjectToString.ts`<br>`createDeclarationBlock`<br>`v6ThemeNames.ts` | Consolidates 3 duplicate regex replacers into single helper | None | Trivial |
| 11 | **Platform Target Drift (`grammarPlatformNames` vs `platformMatches` vs `ALL_PLATFORMS`)** | `style-grammar/config.ts:56`<br>`web/helpers/directStyle.ts:382`<br>`helpers/shouldRenderNativePlatform.ts:24` | `modifierVocabulary.ts`<br>`directStyle.ts`<br>`variables.ts`<br>`shouldRenderNativePlatform.ts` | Synchronizes platform sets (tv, tvos, androidtv) across static analysis, runtime matching, and component props | Low | Small |
| 12 | **Duplicate Recursive Theme Variable Resolvers & Cycle Handlers** | `web/helpers/configVariables.ts:15`<br>`web/helpers/variables.ts:755` | `mergeConfigVariablesIntoTheme`<br>`getMergedTheme` (`<ThemeUpdate>`) | Merges two implementations of sibling variable reference resolution and cycle avoidance | Low | Small |
| 13 | **Duplicate Inverse Shorthand Lookup Helpers** | `web/helpers/getExpandedShorthands.ts:3`<br>`web/helpers/getShorthandValue.ts:6` | `dialog/src/Dialog.tsx`<br>Public export | Deletes redundant `getShorthandValue` with inverted signature | None | Trivial |
| 14 | **Incomplete Pseudo State Extractor vs Engine State Mask** | `web/helpers/extractPseudoState.ts:3`<br>`style-grammar/clauseSources.ts:6`<br>`style-grammar/stateModifiers.ts:11` | `createComponent.tsx:1137, 1394`<br>`clauseCapability.ts` | Replaces incomplete 3-state extractor (misses focusVisible, focusWithin, disabled, enter, exit) with mask | Low | Small |

---

## 2. Detailed Findings

---

### Finding 1: Triplicate Unitless Property Tables & Suffix Matchers

- **What:** There are three separate and mutually inconsistent mechanisms for determining whether a property or variable value is unitless:
  1. `stylePropsUnitless` in `code/core/helpers/src/validStyleProps.ts:134-169` (37 keys as a boolean dictionary).
  2. `unitlessNumberProperties` in `code/core/style-grammar/src/unitlessNumbers.ts:1-61` (49 keys as a `Set<string>` plus `ms`, `Moz`, `O`, `Webkit` vendor-prefixed entries).
  3. `isUnitlessVariableKey` in `code/core/web/src/helpers/variableValue.ts:4-19` (uses `unitlessSuffixes.some(s => lower.endsWith(s))` with suffixes `['opacity', 'scale', 'zindex', 'weight', 'flex', 'grow', 'shrink', 'ratio', 'elevation']`).
- **Drift & Discrepancies:**
  - `gridTemplateColumns`, `gridTemplateAreas`, and `WebkitLineClamp` exist in `stylePropsUnitless` but are **missing** from `unitlessNumberProperties`.
  - SVG unitless properties (`fillOpacity`, `floodOpacity`, `stopOpacity`, `strokeDasharray`, `strokeDashoffset`, `strokeMiterlimit`, `strokeOpacity`, `strokeWidth`) and `boxFlex`/`boxOrdinalGroup` exist in `unitlessNumberProperties` but are **missing** from `stylePropsUnitless`.
  - `isUnitlessVariableKey` matches by suffix on arbitrary keys, including `elevation` and `ratio` which are not in either table.
- **File:Line:**
  - [`code/core/helpers/src/validStyleProps.ts:134-169`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L134-L169)
  - [`code/core/style-grammar/src/unitlessNumbers.ts:1-61`](file:///Users/n8/tamagui/code/core/style-grammar/src/unitlessNumbers.ts#L1-L61)
  - [`code/core/web/src/helpers/variableValue.ts:4-19`](file:///Users/n8/tamagui/code/core/web/src/helpers/variableValue.ts#L4-L19)
- **Who Consumes It:**
  - `stylePropsUnitless`: [`code/core/web/src/internal-runtime.ts:67`](file:///Users/n8/tamagui/code/core/web/src/internal-runtime.ts#L67), [`code/core/web/src/helpers/normalizeValueWithProperty.ts:29`](file:///Users/n8/tamagui/code/core/web/src/helpers/normalizeValueWithProperty.ts#L29), [`code/core/helpers/src/validStyleProps.ts:256`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L256).
  - `unitlessNumberProperties`: [`code/core/web/src/dom/primitives.native.tsx:416`](file:///Users/n8/tamagui/code/core/web/src/dom/primitives.native.tsx#L416), [`code/core/codemod-flat-values/src/legacyConditions.ts:279`](file:///Users/n8/tamagui/code/core/codemod-flat-values/src/legacyConditions.ts#L279).
  - `isUnitlessVariableKey`: [`code/core/web/src/helpers/configVariables.ts:53`](file:///Users/n8/tamagui/code/core/web/src/helpers/configVariables.ts#L53), [`code/core/web/src/helpers/variables.ts:79`](file:///Users/n8/tamagui/code/core/web/src/helpers/variables.ts#L79).
- **Why It Is a Win:** Unifies all unitless checks onto a single canonical lookup table exported from `@tamagui/helpers` (or compiled bitmask/Set), eliminating runtime vs DOM primitive vs theme variable serialization bugs.
- **Risk:** Low. Consolidate to the union of all valid unitless properties.
- **Effort:** Small.

---

### Finding 2: Dead / Orphaned Files with Zero Consumers in Entire Repository

- **What:** Multiple files in `code/core/web/src` define functions and tables that have zero consumers across the entire monorepo (not used in core, apps, tests, or examples):
  1. `normalizeStylePropKeys.ts` and `normalizeStylePropKeys.native.ts`: Defines an empty object on web and a 10-prop color object on native. Zero imports anywhere in repo.
  2. `accessibilityDirectMap.tsx` and `accessibilityDirectMap.native.tsx`: Defines 5 empty/null dummy mapping objects. Zero imports anywhere in repo.
  3. `getFontLanguage.ts`: 3-line helper `fontFamily.includes('_') ? fontFamily.split('_')[1] : null`. Zero imports anywhere in repo.
  4. `getShorthandValue.ts`: Helper `(props, key) => props[key] ?? props[inverseShorthands[key]]`. Exact duplicate of `getExpandedShorthand` with inverted arguments. Zero internal callers; UI packages use `getExpandedShorthand`.
- **File:Line:**
  - [`code/core/web/src/helpers/normalizeStylePropKeys.ts:1-4`](file:///Users/n8/tamagui/code/core/web/src/helpers/normalizeStylePropKeys.ts#L1-L4) and [`.native.ts:1-13`](file:///Users/n8/tamagui/code/core/web/src/helpers/normalizeStylePropKeys.native.ts#L1-L13)
  - [`code/core/web/src/constants/accessibilityDirectMap.tsx:1-12`](file:///Users/n8/tamagui/code/core/web/src/constants/accessibilityDirectMap.tsx#L1-L12) and [`.native.tsx:1-11`](file:///Users/n8/tamagui/code/core/web/src/constants/accessibilityDirectMap.native.tsx#L1-L11)
  - [`code/core/web/src/helpers/getFontLanguage.ts:1-3`](file:///Users/n8/tamagui/code/core/web/src/helpers/getFontLanguage.ts#L1-L3)
  - [`code/core/web/src/helpers/getShorthandValue.ts:1-10`](file:///Users/n8/tamagui/code/core/web/src/helpers/getShorthandValue.ts#L1-L10)
- **Who Consumes It:**
  - Verified with full-repo grep: **Zero consumers** for all 4 pairs/files.
- **Why It Is a Win:** Directly deletes 6 dead files, saves packaging/dist byte overhead, cleans up exported public surface.
- **Risk:** None.
- **Effort:** Trivial.

---

### Finding 3: Duplicate Border & Outline Keyword Sets and Shorthand Parsers

- **What:**
  1. The 10 border/outline style keywords (`solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset`, `none`, `hidden`) are defined as 3 separate duplicate `Set` instances:
     - `borderStyles` in `parseBorderShorthand.native.ts:4-15`
     - `outlineStyles` in `parseOutlineShorthand.native.ts:4-15`
     - `lineStyles` in `code/core/style-grammar/src/borderFamily.ts:58-69`
  2. `parseBorderShorthand.native.ts` (lines 20–74) and `parseOutlineShorthand.native.ts` (lines 20–62) contain duplicate CSS 3-component whitespace-splitting and regex length parsing (`^[\d.]+(?:px|em|rem|%|pt|vw|vh)?$`), both of which duplicate the canonical `splitBorderValue` implementation in `borderFamily.ts`.
- **File:Line:**
  - [`code/core/web/src/helpers/parseBorderShorthand.native.ts:4-15, 20-74`](file:///Users/n8/tamagui/code/core/web/src/helpers/parseBorderShorthand.native.ts#L4-L74)
  - [`code/core/web/src/helpers/parseOutlineShorthand.native.ts:4-15, 20-62`](file:///Users/n8/tamagui/code/core/web/src/helpers/parseOutlineShorthand.native.ts#L4-L62)
  - [`code/core/style-grammar/src/borderFamily.ts:58-69, 104-172`](file:///Users/n8/tamagui/code/core/style-grammar/src/borderFamily.ts#L58-L172)
- **Who Consumes It:**
  - `parseBorderShorthand`: [`code/core/web/src/helpers/expandStyle.ts:140`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L140)
  - `parseOutlineShorthand`: [`code/core/web/src/helpers/expandStyle.ts:150`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L150)
  - `borderFamily.ts`: Style-grammar pipeline & program lowering.
- **Why It Is a Win:** Deletes 2 ad-hoc native shorthand parsers and 3 duplicate sets, routing border and outline expansion through the canonical border family.
- **Risk:** Low.
- **Effort:** Small.

---

### Finding 4: Duplicate Native CSS Transform String Parsers with Drifting Semantics

- **What:** Two distinct CSS transform string parsers exist for React Native:
  1. `parseNativeTransform` in `code/core/web/src/helpers/parseNativeTransform.native.ts:1-36` uses a regex `/([A-Za-z][\w]*)\(([^()]*)\)/g`.
  2. `parseTransformString` in `code/core/style-grammar/src/transformFamily.ts:301-369` uses manual character loops and tokenization.
- **Drift & Discrepancies:**
  - `parseNativeTransform` accepts `dp` units, unvalidated `matrix` lengths, and converts bare numbers to numeric values leniently without checking angle types on `rotate`.
  - `parseTransformString` strictly validates units, enforces 9 or 16 numbers for `matrix()`, decomposes `translate3d`, and provides structured diagnostics.
  - `parseNativeTransform` only exists as a `.native.ts` file with no web equivalent.
- **File:Line:**
  - [`code/core/web/src/helpers/parseNativeTransform.native.ts:1-36`](file:///Users/n8/tamagui/code/core/web/src/helpers/parseNativeTransform.native.ts#L1-L36)
  - [`code/core/style-grammar/src/transformFamily.ts:301-369`](file:///Users/n8/tamagui/code/core/style-grammar/src/transformFamily.ts#L301-L369)
- **Who Consumes It:**
  - `parseNativeTransform`: [`code/core/web/src/helpers/directStyle.ts:1837`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1837).
  - `parseTransformString`: [`code/core/style-grammar/src/transformFamily.ts:285`](file:///Users/n8/tamagui/code/core/style-grammar/src/transformFamily.ts#L285) (`composeTransformArray`).
- **Why It Is a Win:** Retires `parseNativeTransform.native.ts` when consolidating transform handling into the single accumulator (as planned in section 6.8), ensuring consistent transform parsing behavior.
- **Risk:** Low.
- **Effort:** Small.

---

### Finding 5: Duplicate Safe-Area Prop Mappings, Expansions, and Inset Access

- **What:**
  1. `propEdges` (39-line dictionary mapping 26 props to single or multi edges), `baseKeyForExpansion`, and `edgeToPascal` are copy-pasted verbatim between `resolveSafeArea.ts` and `resolveSafeArea.native.ts`.
  2. `safeAreaVariableNames` and `getSafeAreaEdge` in `style-grammar/src/safeAreaVariables.ts` define the canonical safe area edge mapping, yet `resolveSafeAreaVariable.ts` (web) and `resolveSafeAreaVariable.native.ts` (native) both duplicate string slicing `name.startsWith('safe-area-') ? name.slice(10) : ''`.
  3. Native safe-area metric resolution has two distinct paths: `resolveSafeArea.native.ts:77` reads `globalThis.__tamagui_safe_area__` directly, while `resolveSafeAreaVariable.native.ts:11` calls `getSafeArea()`.
- **File:Line:**
  - [`code/core/web/src/helpers/resolveSafeArea.ts:15-56, 58-116`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeArea.ts#L15-L116)
  - [`code/core/web/src/helpers/resolveSafeArea.native.ts:12-50, 52-71`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeArea.native.ts#L12-L71)
  - [`code/core/style-grammar/src/safeAreaVariables.ts:1-20`](file:///Users/n8/tamagui/code/core/style-grammar/src/safeAreaVariables.ts#L1-L20)
  - [`code/core/web/src/helpers/resolveSafeAreaVariable.ts:1-7`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeAreaVariable.ts#L1-L7)
  - [`code/core/web/src/helpers/resolveSafeAreaVariable.native.ts:5-24`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeAreaVariable.native.ts#L5-L24)
- **Who Consumes It:**
  - `expandSafeAreaValue`: [`code/core/web/src/helpers/directStyle.ts:1545`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L1545).
  - `resolveSafeAreaVariable`: [`code/core/web/src/helpers/directStyle.ts:770`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L770).
  - `safeAreaVariables.ts`: `style-grammar/src/table.ts`, `candidate.ts`.
- **Why It Is a Win:** Hoists `propEdges` table into `@tamagui/helpers` once, shares `getSafeAreaEdge` across web and native resolvers, and unifies native safe area insets access.
- **Risk:** Very low.
- **Effort:** Small.

---

### Finding 6: Drifting Token Category Lists & Omission of `space` in `helpers`

- **What:**
  1. The canonical token category table in `code/core/helpers/src/tokenCategories.ts:5-67` defines `radius`, `size`, `zIndex`, and `color`, but **omits `space`**.
  2. Because `space` is missing from `helpers`, `code/core/web/src/helpers/tokenCategories.ts:18-84` manually hand-lists 60+ individual `space` properties (`borderWidth`, `margin*`, `padding*`, `inset*`, `gap*`, `outline*`, etc.) inline inside `tokenCategoryByProperty`.
  3. The list of token category names `['color', 'space', 'size', 'radius', 'zIndex']` is hand-written across multiple files.
- **File:Line:**
  - [`code/core/helpers/src/tokenCategories.ts:5-67`](file:///Users/n8/tamagui/code/core/helpers/src/tokenCategories.ts#L5-L67)
  - [`code/core/web/src/helpers/tokenCategories.ts:18-84`](file:///Users/n8/tamagui/code/core/web/src/helpers/tokenCategories.ts#L18-L84)
  - [`code/core/web/src/helpers/grammarConfig.ts:118`](file:///Users/n8/tamagui/code/core/web/src/helpers/grammarConfig.ts#L118)
  - [`code/core/web/src/helpers/variableValue.ts:21`](file:///Users/n8/tamagui/code/core/web/src/helpers/variableValue.ts#L21)
  - [`code/core/style-grammar/src/config.ts:123`](file:///Users/n8/tamagui/code/core/style-grammar/src/config.ts#L123)
- **Who Consumes It:**
  - `tokenCategories`: `validStyleProps.ts`, `to-tailwind`.
  - `tokenCategoryByProperty` / `getTokenCategoryForProperty`: `directStyle.ts:42, 247`.
  - `grammarConfig.ts`: `getConfigRevisionSnapshot`.
  - `variableValue.ts`: `findVariableToken`.
- **Why It Is a Win:** Adding `space` to `tokenCategories` in `@tamagui/helpers` allows deleting 66 lines of hand-written property lists in `web/src/helpers/tokenCategories.ts` and unifies the category names array everywhere.
- **Risk:** Very low.
- **Effort:** Small.

---

### Finding 7: Hand-Maintained Web Event Skip List vs Generated DOM Event Table

- **What:** `code/core/web/src/helpers/webPropsToSkip.native.ts:16-51` hand-lists 34 DOM event handlers to skip on native (`onClick`, `onMouseEnter`, `onPointerDown`, `onPointerMove`, `onPointerUp`, `onKeyDown`, `onScroll`, `onChange`, etc.). Meanwhile, `@tamagui/dom` contains a canonical code generator (`scripts/generate-html.ts`) producing `code/core/web/src/dom/domEventProps.native.ts` (30 events that have native equivalents).
- **Drift & Discrepancies:**
  - `webPropsToSkip.native.ts` marks `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`, `onPointerEnter`, `onPointerLeave`, `onClick`, `onKeyDown`, `onScroll`, `onChange`, `onInput` as "to skip".
  - However, `domEventProps.native.ts` and `dom/adapters.ts` explicitly implement native adaptations for those exact events.
- **File:Line:**
  - [`code/core/web/src/helpers/webPropsToSkip.native.ts:16-55`](file:///Users/n8/tamagui/code/core/web/src/helpers/webPropsToSkip.native.ts#L16-L55)
  - [`code/core/web/src/dom/domEventProps.native.ts:10-40`](file:///Users/n8/tamagui/code/core/web/src/dom/domEventProps.native.ts#L10-L40)
- **Who Consumes It:**
  - `webPropsToSkip.native.ts`: [`code/core/web/src/helpers/skipProps.ts:35`](file:///Users/n8/tamagui/code/core/web/src/helpers/skipProps.ts#L35).
  - `domEventProps.native.ts`: [`code/core/web/src/dom/primitives.native.tsx`](file:///Users/n8/tamagui/code/core/web/src/dom/primitives.native.tsx).
- **Why It Is a Win:** Deriving event skipping from the canonical `@tamagui/dom` definitions avoids dropping valid native event handlers and eliminates hand-maintained event tables.
- **Risk:** Low.
- **Effort:** Small.

---

### Finding 8: Duplicate CSS Named Colors (148 Names) and Color Functions

- **What:**
  1. `namedCssColors` in `code/core/style-grammar/src/backgroundFamily.ts:3-7` is a hand-coded space-separated string of 148 CSS color names split into a `Set<string>`.
  2. `code/core/normalize-css-color/src/index.ts:10-13` contains `colorNames` with the exact same 148 color names mapped to hex values.
  3. `backgroundFamily.ts:9` defines `colorFunctions` (`rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab`, `lch`, `oklab`, `oklch`, `color`), while `normalize-css-color` defines regex matchers for `rgb`, `rgba`, `hsl`, `hsla`, `hwb`.
- **File:Line:**
  - [`code/core/style-grammar/src/backgroundFamily.ts:3-20`](file:///Users/n8/tamagui/code/core/style-grammar/src/backgroundFamily.ts#L3-L20)
  - [`code/core/normalize-css-color/src/index.ts:10-38`](file:///Users/n8/tamagui/code/core/normalize-css-color/src/index.ts#L10-L38)
- **Who Consumes It:**
  - `namedCssColors` / `colorFunctions`: `backgroundFamily.ts:71` (`classifyComponent`), used by `borderFamily.ts`, `fontShorthand.ts`, `textDecorationFamily.ts`.
  - `normalize-css-color`: `normalizeColor.native.ts:1-5`.
- **Why It Is a Win:** De-duplicates the 148 CSS color names and function lists across packages.
- **Risk:** Low (ensure zero-dependency boundaries are maintained).
- **Effort:** Small.

---

### Finding 9: Duplicate "Npx" Literal Pixel String Regex

- **What:** The exact regular expression `/^-?\d*\.?\d+px$/` is defined twice to detect literal "Npx" pixel strings for float parsing on native and unit retention on web.
- **File:Line:**
  - [`code/core/web/src/createVariable.ts:21`](file:///Users/n8/tamagui/code/core/web/src/createVariable.ts#L21) (`const pxStringRe = /^-?\d*\.?\d+px$/`)
  - [`code/core/web/src/helpers/normalizeValueWithProperty.ts:19`](file:///Users/n8/tamagui/code/core/web/src/helpers/normalizeValueWithProperty.ts#L19) (`const pxStringRe = /^-?\d*\.?\d+px$/`)
- **Who Consumes It:**
  - `createVariable.ts:31` (`createVariable`)
  - `normalizeValueWithProperty.ts:23` (`normalizeValueWithProperty`)
- **Why It Is a Win:** Single shared regex constant; eliminates redundant regex instantiation.
- **Risk:** None.
- **Effort:** Trivial.

---

### Finding 10: Duplicate CamelCase-to-Hyphen String Formatters

- **What:** Three separate implementations of camelCase to hyphenated CSS property conversion:
  1. `camelToHyphen` in `mediaObjectToString.ts:3-5`: `str.replace(/[A-Z]/g, (m) => \`-${m.toLowerCase()}\`).toLowerCase()`
  2. `hyphenateStyleName` in `getCSSStylesAtomic.ts:228-234`: `key.replace(/[A-Z]/g, toHyphenLower)` with cache
  3. Inline replacer in `v6ThemeNames.ts:33`: `name.replace(/[A-Z]/g, (letter) => \`-${letter.toLowerCase()}\`)`
- **File:Line:**
  - [`code/core/web/src/helpers/mediaObjectToString.ts:3-5`](file:///Users/n8/tamagui/code/core/web/src/helpers/mediaObjectToString.ts#L3-L5)
  - [`code/core/web/src/helpers/getCSSStylesAtomic.ts:228-234`](file:///Users/n8/tamagui/code/core/web/src/helpers/getCSSStylesAtomic.ts#L228-L234)
  - [`code/core/style-grammar/src/v6ThemeNames.ts:33`](file:///Users/n8/tamagui/code/core/style-grammar/src/v6ThemeNames.ts#L33)
- **Who Consumes It:**
  - `mediaObjectToString`: [`mediaObjectToString.ts:18`](file:///Users/n8/tamagui/code/core/web/src/helpers/mediaObjectToString.ts#L18).
  - `getCSSStylesAtomic`: [`getCSSStylesAtomic.ts:220`](file:///Users/n8/tamagui/code/core/web/src/helpers/getCSSStylesAtomic.ts#L220).
  - `v6ThemeNames`: [`v6ThemeNames.ts:29`](file:///Users/n8/tamagui/code/core/style-grammar/src/v6ThemeNames.ts#L29).
- **Why It Is a Win:** Unifies string hyphenation helper across the style engine and eliminates redundant implementations. (Also note `mediaObjectToString.ts:22` has a buggy character class `/[height|width]$/` which matches any character in `height|width` rather than the words "height" or "width").
- **Risk:** None.
- **Effort:** Trivial.

---

### Finding 11: Platform Target Drift (`grammarPlatformNames` vs `platformMatches` vs `ALL_PLATFORMS`)

- **What:** The supported platform targets are defined in 3 different ways:
  1. `grammarPlatformNames` in `code/core/style-grammar/src/config.ts:56-64`: defines `['web', 'native', 'android', 'ios', 'tv', 'androidtv', 'tvos']` and `grammarPlatformGroups` defining `'tv'` as `androidtv` + `tvos`.
  2. `platformMatches` in `code/core/web/src/helpers/directStyle.ts:382-389`: checks `web`, `native`, `ios`, `android`, `tvos`, `androidtv`, but **omits `tv`**.
  3. `ALL_PLATFORMS` in `code/core/helpers/src/shouldRenderNativePlatform.ts:24`: only lists `['web', 'android', 'ios']` (omitting `tv`, `tvos`, `androidtv`).
- **File:Line:**
  - [`code/core/style-grammar/src/config.ts:56-74`](file:///Users/n8/tamagui/code/core/style-grammar/src/config.ts#L56-L74)
  - [`code/core/web/src/helpers/directStyle.ts:382-389`](file:///Users/n8/tamagui/code/core/web/src/helpers/directStyle.ts#L382-L389)
  - [`code/core/helpers/src/shouldRenderNativePlatform.ts:24`](file:///Users/n8/tamagui/code/core/helpers/src/shouldRenderNativePlatform.ts#L24)
- **Who Consumes It:**
  - `grammarPlatformNames`: Modifier vocabulary compilation, candidate parsing.
  - `platformMatches`: `directStyle.ts:519`, `variables.ts:574`.
  - `shouldRenderNativePlatform`: Components supporting the `native` prop.
- **Why It Is a Win:** Synchronizes platform definitions across static vocabulary, runtime condition matching, and component native props so that TV platforms behave consistently.
- **Risk:** Low.
- **Effort:** Small.

---

### Finding 12: Duplicate Recursive Theme Variable Resolvers & Cycle Handlers

- **What:** Both `configVariables.ts` (`resolveRawValue`) and `variables.ts` (`resolveRaw`) implement identical multi-step reference resolution for theme values: resolving string name pointers against other variables in the map, falling back to parent themes, falling back to `tokensParsed`, and detecting reference cycles.
- **File:Line:**
  - [`code/core/web/src/helpers/configVariables.ts:15-47`](file:///Users/n8/tamagui/code/core/web/src/helpers/configVariables.ts#L15-L47)
  - [`code/core/web/src/helpers/variables.ts:755-777`](file:///Users/n8/tamagui/code/core/web/src/helpers/variables.ts#L755-L777)
- **Who Consumes It:**
  - `configVariables.ts:51`: `mergeConfigVariablesIntoTheme` (used at `createTamagui` configuration time).
  - `variables.ts:802`: `getMergedTheme` (used by `<ThemeUpdate>` runtime merging).
- **Why It Is a Win:** Consolidates theme variable graph resolution into a single shared function, preventing divergence in reference resolution rules.
- **Risk:** Low.
- **Effort:** Small.

---

### Finding 13: Duplicate Inverse Shorthand Lookup Helpers

- **What:** `getExpandedShorthands.ts` and `getShorthandValue.ts` are two separate files that perform the exact same inverse shorthand lookup:
  - `getExpandedShorthand(propKey: string, props: object)`
  - `getShorthandValue(props: Record<string, any>, key: string)`
- **File:Line:**
  - [`code/core/web/src/helpers/getExpandedShorthands.ts:3-6`](file:///Users/n8/tamagui/code/core/web/src/helpers/getExpandedShorthands.ts#L3-L6)
  - [`code/core/web/src/helpers/getShorthandValue.ts:6-9`](file:///Users/n8/tamagui/code/core/web/src/helpers/getShorthandValue.ts#L6-L9)
- **Who Consumes It:**
  - `getExpandedShorthand`: [`code/ui/dialog/src/Dialog.tsx:235`](file:///Users/n8/tamagui/code/ui/dialog/src/Dialog.tsx#L235), exported from `web/src/index.ts:12`.
  - `getShorthandValue`: Zero callers in repo, exported from `web/src/index.ts:14`.
- **Why It Is a Win:** Deletes `getShorthandValue.ts` and unifies on one helper.
- **Risk:** None.
- **Effort:** Trivial.

---

### Finding 14: Incomplete Pseudo State Extractor vs Engine State Mask

- **What:** `extractPseudoState` in `extractPseudoState.ts` creates an object with only `{ hover, press, focus }` (plus group pseudo states), completely ignoring `focusVisible`, `focusWithin`, `disabled`, `enter`, and `exit`. Meanwhile, `stateModifiers.ts` and `clauseSources.ts` define the complete 8/9-state interaction vocabulary.
- **File:Line:**
  - [`code/core/web/src/helpers/extractPseudoState.ts:3-32`](file:///Users/n8/tamagui/code/core/web/src/helpers/extractPseudoState.ts#L3-L32)
  - [`code/core/style-grammar/src/clauseSources.ts:6-16`](file:///Users/n8/tamagui/code/core/style-grammar/src/clauseSources.ts#L6-L16)
  - [`code/core/style-grammar/src/stateModifiers.ts:11-20`](file:///Users/n8/tamagui/code/core/style-grammar/src/stateModifiers.ts#L11-L20)
- **Who Consumes It:**
  - `extractPseudoState`: [`code/core/web/src/createComponent.tsx:1137, 1394`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1137) (used for `stateRef.current.prevPseudoState` change tracking).
  - `clauseSources.ts`: `clauseCapability.ts:65`.
- **Why It Is a Win:** Replacing `extractPseudoState` with the unified integer bitmask (planned in 6.5) eliminates heap allocations per render and fixes missed state change triggers for `focusVisible`, `focusWithin`, and `disabled`.
- **Risk:** Low.
- **Effort:** Small.

---

## 3. Checked and Found Nothing (Clean Single Implementations)

The following areas and modules within scope were audited and verified to have single, canonical implementations without duplication:

1. **`code/core/helpers/src/clamp.ts`**: Single clean numeric clamp implementation; no duplicates found.
2. **`code/core/helpers/src/withStaticProperties.tsx`**: Single canonical implementation for hoisting static subcomponents.
3. **`code/core/helpers/src/reservedThemeProps.ts`**: Single canonical table for reserved `<Theme>` props, shared cleanly between runtime and compiler.
4. **`code/core/web/src/helpers/resolveAnimationDriver.ts`**: Single clean driver resolution helper.
5. **`code/core/web/src/helpers/defaultAnimationDriver.tsx`**: Single fallback animation driver.
6. **`code/core/web/src/helpers/timer.ts`**: Single timer implementation used for profiling and benchmarks.
7. **`code/core/web/src/helpers/warnOnce.ts` and `noteOnce.ts`**: Clean single diagnostic logging helpers with dedup Set.
8. **`code/core/web/src/dom/contract.ts` and `dom/adapters.ts`**: Clean unified event payload adapters for native DOM primitives.
9. **`code/core/web/src/helpers/themeUpdateState.ts`**: Single symbol and interface definition for theme update layers.
10. **`code/core/style-grammar/src/programEligibility.ts`**: Single definition of property program eligibility.
11. **`code/core/style-grammar/src/programHash.ts`**: Single hashing implementation for style programs.
