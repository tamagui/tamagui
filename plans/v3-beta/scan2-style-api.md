# V3 Style API & Value Grammar Simplification Scan

**Status**: Ready for implementation  
**Date**: 2026-08-27  
**Branch**: `v3-beta`  
**Scope**: `code/core/helpers/src/validStyleProps.ts`, `tokenCategories.ts`, `webOnlyStyleProps.ts`, `code/core/shorthands`, `code/core/web/src/helpers/expandStyle.ts`, `expandStyles.ts`, `resolveSafeArea.ts`, `resolveRem.ts`, `normalizeValueWithProperty.ts`, and `code/core/style-grammar/src`.

---

## Executive Summary

The V3 style engine rebuild centers on one forward pass with zero redundant scanning, AST reconstruction, or over-narrowing runtime checks. However, the surface of style properties, shorthands, token categories, and value parsers currently carries heavy legacy ballast:

1. **83 Shorthands in `@tamagui/shorthands`**: Over 40 obscure abbreviation cryptograms (e.g. `bblr`, `bbrr`, `shof`, `fost`, `ussel`) have **zero** occurrences across `code/ui/*`, `tamagui.dev`, or starter templates. Furthermore, `createTamagui.ts` contains hardcoded `builtinShorthands` that actively collide with `@tamagui/shorthands` (e.g. `fs` = `fontSize` vs `flexShrink`).
2. **5 Fragmented Token Category Tables**: Token-to-property bindings are duplicated and split across `helpers/tokenCategories.ts`, `web/tokenCategories.ts`, `style-grammar/registry.ts`, `getDynamicVal.ts`, and `validStyleProps.ts`.
3. **Decomposed RN Shadows vs Cross-Platform `boxShadow`**: 4 decomposed React Native shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`), 4 shorthands (`shac`, `shof`, `shop`, `shar`), and runtime normalization in `normalizeShadow.ts` survive despite React Native 0.76+ and web supporting `boxShadow` natively.
4. **Redundant Value Resolvers**: `resolveRem.ts` is a no-op on web (`return value`) yet forces a `value.includes('rem')` string check on every string prop in `propMapper`. Safe-area handling is split across two competing systems: magic `"safe"` prop values (with 117 lines of edge maps) vs standard `$safe-area-*` CSS variables/tokens.
5. **Runtime `expandFlex` Multi-Mode Switching**: 3 legacy compatibility modes (`legacy`, `react-native`, `web`) expand `flex={1}` into `flexGrow`, `flexShrink`, and `flexBasis` on every render instead of emitting standard CSS `flex`.

---

## Ranked Findings (by Value of Removal / Migration Pain)

| Rank | Finding | Classification | Value / Rationale | Migration Pain |
|---|---|---|---|---|
| **1** | [Purge `builtinShorthands` from `createTamagui.ts` & Sever Runtime Collision](#finding-1-purge-builtinshorthands-from-createtamaguits-and-sever-runtime-collision) | **(a) Internal only / (b) Public breaking (edge case)** | Eliminates silent shorthand collisions (`fs`, `fw`) and cleans up config creation | None for valid configs |
| **2** | [Unify the 5 Fragmented Token Category Tables into One Static Registry](#finding-2-unify-the-5-fragmented-token-category-tables-into-one-static-registry) | **(a) Internal only** | Deletes 4 duplicate tables, fixes missing `space` category in helpers, cuts per-render lookups | Zero (internal) |
| **3** | [Deprecate/Delete 40+ Dead Shorthand Cryptograms (`@tamagui/shorthands/src/index.ts`)](#finding-3-deprecatedelete-40-dead-shorthand-cryptograms-in-favor-of-canonical-v6-shorthands) | **(b) Public breaking change with mechanical migration** | Shrinks `WithShorthands` TS union, deletes 40+ unread abbreviations, standardizes on V6/Tailwind | Mechanical AST codemod |
| **4** | [Eliminate Legacy RN Shadow Properties (`shadowColor`, `shadowOffset`, etc.) for Standard `boxShadow`](#finding-4-eliminate-legacy-rn-shadow-properties-in-favor-of-standard-boxshadow) | **(b) Public breaking change with mechanical migration** | Aligns with Strict DOM and RN 0.76+ `boxShadow`, deletes `normalizeShadow.ts` and 4 shorthands | Mechanical codemod |
| **5** | [Delete Runtime `resolveRem.ts` and `resolveRem.native.ts` from Style Loop](#finding-5-delete-runtime-resolveremts-and-resolveremnativets-from-style-loop) | **(a) Internal (web) / (b) Public breaking (native raw rem)** | Eliminates `value.includes('rem')` per-string tax on web and regex loop on native | Native apps use token scales |
| **6** | [Collapse Dual Safe-Area Systems: Remove Magic `"safe"` Value in favor of Tokens/Variables](#finding-6-collapse-dual-safe-area-systems-remove-magic-safe-keyword-for-safe-area-tokens) | **(b) Public breaking change with mechanical migration** | Deletes 216 lines across 2 files (`resolveSafeArea.ts` & `.native.ts`) and per-prop branch | Mechanical codemod (`pt="safe"` -> `pt="$safe-area-top"`) |
| **7** | [Eliminate Multi-Mode `expandFlex` & `StyleCompat` Runtime Modes](#finding-7-eliminate-multi-mode-expandflex-and-stylecompat-runtime-modes) | **(b) Public breaking change with mechanical migration** | Eliminates 3-property expansion and config reads on every `flex` prop | Web standard `flex` authored |
| **8** | [Purge RN-Specific Aliases and Non-Standard Prop Duplicates (`writingDirection`, `wordWrap`, `elevationAndroid`)](#finding-8-purge-rn-specific-aliases-and-non-standard-prop-duplicates) | **(b) Public breaking change with mechanical migration** | Eliminates redundant property checks and aligns strictly with web CSS naming | Mechanical codemod |
| **9** | [Delete Unused Public Helper Files `getShorthandValue.ts` and `getExpandedShorthands.ts`](#finding-9-delete-unused-public-helper-files-getshorthandvaluets-and-getexpandedshorthandsts) | **(b) Public breaking change with mechanical migration** | Removes 2 orphaned helper files from core barrel exports | Migrate callers to `useProps` |
| **10** | [Strip 2009 Flexbox and Vendor Properties from `unitlessNumbers.ts`](#finding-10-strip-2009-flexbox-and-vendor-properties-from-unitlessnumbersts) | **(a) Internal only** | Deletes dead WebKit/Mozilla draft properties (`boxFlex`, `boxOrdinalGroup`, etc.) | None |
| **11** | [Streamline CSS Color-Name Tokenizer in `backgroundFamily.ts`](#finding-11-streamline-css-color-name-tokenizer-in-backgroundfamilyts) | **(a) Internal only** | Removes 147-entry CSS named color set and parser overhead | None |

---

## Detailed Findings

### Finding 1: Purge `builtinShorthands` from `createTamagui.ts` and Sever Runtime Collision

- **What it is**: [`code/core/web/src/createTamagui.ts:232, 376-420`](file:///Users/n8/tamagui/code/core/web/src/createTamagui.ts#L232-L420) defines a hardcoded 41-entry `builtinShorthands` object labeled `// Built-in shorthands used internally for short classname generation`. At line 232, `shorthands = { ...builtinShorthands, ...userShorthands }` merges these into the user's prop-parsing shorthand dictionary.
- **Read Code**:
  ```ts
  // createTamagui.ts:232
  const userShorthands = configIn.shorthands || {}
  const shorthands = { ...builtinShorthands, ...userShorthands }
  ...
  // createTamagui.ts:376-420
  const builtinShorthands = {
    fs: 'fontSize',     // CONFLICT: @tamagui/shorthands defines fs = 'flexShrink'
    fw: 'fontWeight',   // CONFLICT: @tamagui/shorthands defines fw = 'flexWrap'
    fst: 'fontStyle',
    col: 'color',
    ...
  }
  ```
- **Who consumes it**:
  - `getCSSStylesAtomic.ts:131` reads `conf?.inverseShorthands[key]` to generate class name prefixes like `._col-red`.
  - `propMapper.ts` and `directStyle.ts` read `conf.shorthands` to resolve input props.
- **What breaks & migration**:
  - Class name prefix abbreviations should be a static constant in the CSS compiler (`propertyToClassPrefix`), completely independent of `config.shorthands`.
  - Merging `builtinShorthands` into `config.shorthands` creates silent collisions: `fs` resolves to `fontSize` or `flexShrink` depending on object merge order.
  - Public breaking change if a user relied on undeclared shorthands without providing `@tamagui/shorthands` in config.
- **What user does instead**: Shorthand prop mapping only exists if explicitly provided in `tamagui.config.ts` (e.g. using `shorthands` from `@tamagui/config/v6-base`).
- **Confidence**: High (verified in `createTamagui.ts`, `getCSSStylesAtomic.ts`, and `@tamagui/shorthands`).
- **Classification**: (a) internal only for separating classname prefix generation; (b) public breaking for undeclared shorthand fallback.

---

### Finding 2: Unify the 5 Fragmented Token Category Tables into One Static Registry

- **What it is**: Prop-to-token category mappings are duplicated across five separate files with conflicting definitions:
  1. [`code/core/helpers/src/tokenCategories.ts:5-68`](file:///Users/n8/tamagui/code/core/helpers/src/tokenCategories.ts#L5-L68): Only declares `radius`, `size`, `zIndex`, `color`. Completely omits `space` (so `margin`, `padding`, `gap`, `top`, `bottom`, `left`, `right` are missing).
  2. [`code/core/web/src/helpers/tokenCategories.ts:18-104`](file:///Users/n8/tamagui/code/core/web/src/helpers/tokenCategories.ts#L18-L104): Hand-lists 45 `space` properties and runs 3 `Object.fromEntries(Object.keys().map())` allocations at startup to create `tokenCategoryByProperty`.
  3. [`code/core/style-grammar/src/registry.ts:33-142`](file:///Users/n8/tamagui/code/core/style-grammar/src/registry.ts#L33-L142): Has a 10-member `TokenCategory` union (`space`, `size`, `radius`, `zIndex`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`) with 50+ entries.
  4. [`code/core/web/src/helpers/getDynamicVal.ts:15-31`](file:///Users/n8/tamagui/code/core/web/src/helpers/getDynamicVal.ts#L15-L31): Defines `colorStyleKeys` with 16 hardcoded color properties for iOS dynamic color checks.
  5. [`code/core/helpers/src/validStyleProps.ts:40-55`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L40-L55): Defines `textColors` and manually destructs `viewColorCategoryProps = tokenCategories.color - textColors`.
- **Who consumes it**: `propMapper.ts`, `directStyle.ts`, `getSplitStyles.tsx`, `validStyleProps.ts`, `@tamagui/to-tailwind`, and `@tamagui/style-grammar`.
- **What breaks & migration**: Internal refactoring. Compile modifier, token category, and property metadata once at definition time (as scheduled in Plan Checkpoint 2).
- **What user does instead**: No user-facing change.
- **Confidence**: High (verified across all 5 files).
- **Classification**: (a) internal only.

---

### Finding 3: Deprecate/Delete 40+ Dead Shorthand Cryptograms in favor of Canonical V6 Shorthands

- **What it is**: [`code/core/shorthands/src/index.ts:4-98`](file:///Users/n8/tamagui/code/core/shorthands/src/index.ts#L4-L98) exports 83 shorthands including 40+ cryptic 2-to-4 letter abbreviations:
  - Border longhands: `bblr`, `bbrr`, `bbc`, `blc`, `blw`, `boc`, `brw`, `brc`, `btc`, `btlr`, `btrr`, `btw`, `bbw`, `bls`, `brs`, `bts`, `bbs`.
  - Text: `fost` (`fontStyle`), `fow` (`fontWeight`), `fwr` (`flexWrap`), `ww` (`wordWrap`), `ussel` (`userSelect`), `dsp` (`display`), `fb` (`flexBasis`).
  - Size/Position: `mah` (`maxHeight`), `maw` (`maxWidth`), `mih` (`minHeight`), `miw` (`minWidth`), `pos` (`position`), `ov` (`overflow`).
  - Shadows: `shac` (`shadowColor`), `shar` (`shadowRadius`), `shof` (`shadowOffset`), `shop` (`shadowOpacity`).
- **Who consumes it**:
  - `code/ui/*`: Grepped across all 61 packages in `code/ui`. **Zero** occurrences of `bblr`, `bbrr`, `bbc`, `blc`, `blw`, `boc`, `brw`, `brc`, `btc`, `btlr`, `btrr`, `btw`, `bbw`, `fost`, `fow`, `fwr`, `ww`, `ussel`, `dsp`, `fb`, `mah`, `maw`, `mih`, `miw`, `shac`, `shar`, `shof`, `shop`.
  - `code/tamagui.dev`: **Zero** occurrences in documentation or demos.
  - Only standard shorthands are used in `code/ui`: `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`, `w`, `h`, `bg`/`bc`, `br`, `bw`, `f`, `ai`, `jc`, `fd`, `o`, `zi`, `col`, `fos`, `ff`, `ls`, `lh`, `ta`, `cur`, `t`, `b`, `l`, `r`.
- **What breaks & migration**:
  - Apps using obscure v1/v2 abbreviations will see TypeScript errors.
  - Codemod mechanically migrates `bblr` -> `borderBottomLeftRadius`, `shof` -> `boxShadow`, `fow` -> `fontWeight`, `mah` -> `maxH` (or `maxHeight`).
- **What user does instead**: Use `@tamagui/shorthands/v6` (or `@tamagui/config/v6-base`) with clean, Tailwind-aligned names (`rounded`, `maxH`, `minH`, `w`, `h`, `bg`, `items`, `justify`, etc.) or standard CSS longhands.
- **Confidence**: High (verified with repo-wide greps).
- **Classification**: (b) public breaking change with mechanical migration.

---

### Finding 4: Eliminate Legacy RN Shadow Properties in favor of Standard `boxShadow`

- **What it is**:
  - React Native legacy shadow properties: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` in [`code/core/helpers/src/validStyleProps.ts:168, 251`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L168).
  - Runtime normalization helper: [`code/core/web/src/helpers/normalizeShadow.ts:1-22`](file:///Users/n8/tamagui/code/core/web/src/helpers/normalizeShadow.ts#L1-L22) and [`expandStyles.ts:14-22`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyles.ts#L14-L22).
  - Shorthands: `shac`, `shof`, `shop`, `shar` in [`code/core/shorthands/src/index.ts:79-82`](file:///Users/n8/tamagui/code/core/shorthands/src/index.ts#L79-L82).
- **Who consumes it**:
  - Legacy React Native StyleSheet callers.
  - Modern React Native (RN 0.76+) has native cross-platform support for `boxShadow`.
  - Web uses standard CSS `boxShadow`.
  - `expandStyles.ts:14` carries an explicit comment: `// TODO deprecate for web-style shadows`.
- **What breaks & migration**:
  - Code authored with `<View shadowColor="black" shadowRadius={10} shadowOffset={{width: 0, height: 4}} shadowOpacity={0.2} />`.
  - Mechanical codemod converts these 4 properties into a single `boxShadow="0 4px 10px rgba(0,0,0,0.2)"` (or `boxShadow="0 4px 10px #0003"`).
- **What user does instead**: Write standard `boxShadow="0 4px 12px $shadowColor"` or flat value `boxShadow="0 2px 4px #0002 hover:0 4px 8px #0004"`.
- **Confidence**: High (verified RN 0.76+ support and `expandStyles.ts` TODO).
- **Classification**: (b) public breaking change with mechanical migration.

---

### Finding 5: Delete Runtime `resolveRem.ts` and `resolveRem.native.ts` from Style Loop

- **What it is**:
  - [`code/core/web/src/helpers/resolveRem.ts:1-18`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveRem.ts#L1-L18):
    ```ts
    export function resolveRem(value: string): string { return value }
    export function isRemValue(value: unknown): value is string {
      return typeof value === 'string' && value.includes('rem')
    }
    ```
  - [`code/core/web/src/helpers/resolveRem.native.ts:1-45`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveRem.native.ts#L1-L45): Executes regex `/(-?[\d.]+)rem/g` and `PixelRatio.getFontScale() * baseFontSize * numericValue`.
  - [`code/core/web/src/helpers/propMapper.ts:154, 158, 506`](file:///Users/n8/tamagui/code/core/web/src/helpers/propMapper.ts#L154): Evaluates `isRemValue(value) ? resolveRem(value) : value` on every string property during render.
- **Who consumes it**:
  - Only called in `propMapper.ts`. `getSplitStyles.tsx`, `directStyle.ts`, and `style-grammar` do not call it.
  - On web, `resolveRem` is a 100% no-op that returns the string unchanged, but `value.includes('rem')` runs on every string prop in `propMapper`.
  - In V3 flat-value grammar, `resolvePayload.ts` and `serializePayload.ts` already serialize unit strings directly.
- **What breaks & migration**:
  - Web: Zero breakage (it was already a no-op).
  - Native: If users authored raw `"1.5rem"` strings without using design system tokens, they should configure a font size token or use numeric units.
- **What user does instead**: Web browsers handle `rem` natively in CSS. On native, token scales (`$size.md`, `$fontSize.4`) resolve to numeric pixels at theme/config level.
- **Confidence**: High (verified all call sites in repo).
- **Classification**: (a) internal only on web; (b) public breaking for native apps passing un-tokenized raw `rem` strings.

---

### Finding 6: Collapse Dual Safe-Area Systems: Remove Magic `"safe"` Keyword for Safe-Area Tokens

- **What it is**: Tamagui currently maintains two duplicate safe-area mechanisms:
  1. **Magic keyword `"safe"`**: [`code/core/web/src/helpers/resolveSafeArea.ts:1-117`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeArea.ts#L1-L117) (117 lines) and [`resolveSafeArea.native.ts:1-99`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeArea.native.ts#L1-99) (99 lines). Intercepts `value === 'safe'` on 26 different padding, margin, and inset props, maps them via `propEdges`, and expands them to 4 per-side CSS `env(safe-area-inset-*)` values or native `getInsetForEdge()`.
  2. **Token/Variable System**: [`code/core/style-grammar/src/safeAreaVariables.ts:1-20`](file:///Users/n8/tamagui/code/core/style-grammar/src/safeAreaVariables.ts#L1-L20) and [`resolveSafeAreaVariable.ts:1-11`](file:///Users/n8/tamagui/code/core/web/src/helpers/resolveSafeAreaVariable.ts#L1-L11). Maps `$safe-area-top`, `$safe-area-bottom`, `$safe-area-left`, `$safe-area-right` to `env(safe-area-inset-*)` on web and native insets.
- **Who consumes it**:
  - `pt="safe"`, `padding="safe"`, `inset="safe"` in `kitchen-sink/src/usecases/SafeAreaValue.tsx` and benchmark corpus.
  - Zero usage in `code/ui/*`.
- **What breaks & migration**:
  - Authored props using `pt="safe"` or `padding="safe"`.
  - Mechanical codemod:
    - `pt="safe"` -> `pt="$safe-area-top"` (or `pt="env(safe-area-inset-top)"`).
    - `padding="safe"` -> `p="$safe-area"` (or `p="safe-area-top safe-area-right safe-area-bottom safe-area-left"`).
- **What user does instead**: Use standard token `$safe-area-top` / `$safe-area-bottom` or CSS `env(safe-area-inset-top)`.
- **Confidence**: High (verified both implementations and usage).
- **Classification**: (b) public breaking change with mechanical migration.

---

### Finding 7: Eliminate Multi-Mode `expandFlex` and `StyleCompat` Runtime Modes

- **What it is**: [`code/core/web/src/helpers/expandStyle.ts:13-70, 78`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L13-L70) defines `expandFlex` with 3 compatibility modes (`legacy`, `react-native`, `web`).
- **Read Code**:
  ```ts
  // expandStyle.ts:74
  export function expandStyle(
    key: string,
    value: any,
    styleCompat: StyleCompat = getStyleCompat() // calls getConfigFromGlobalOrLocal() per call!
  ): PropMappedValue {
    if (process.env.TAMAGUI_TARGET === 'web') {
      if (key === 'flex') {
        return expandFlex(value, styleCompat)
      }
  ...
  ```
  In `web` mode, `flex: 1` expands to 3 longhands: `[['flexGrow', 1], ['flexShrink', 1], ['flexBasis', 0]]`.
- **Who consumes it**: `expandStyle.ts` on every component render containing a `flex` prop.
- **What breaks & migration**:
  - Moving to Strict DOM web alignment means web authors write standard CSS `flex`. Web emits CSS `flex: 1` directly without decomposing into 3 atomic rules per element.
  - Native adapter maps `flex: 1` to React Native's flexbox engine.
  - Deletes `getStyleCompat()` config lookup from the hot render path.
- **What user does instead**: Use standard `flex={1}` or longhands `grow={1}`, `shrink={0}`.
- **Confidence**: High (verified in `expandStyle.ts` and `config.ts`).
- **Classification**: (b) public breaking change with mechanical migration (for code expecting RN flex-shrink default on web).

---

### Finding 8: Purge RN-Specific Aliases and Non-Standard Prop Duplicates

- **What it is**:
  - `writingDirection`: [`code/core/helpers/src/validStyleProps.ts:109`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L109), mapped to `direction` in [`expandStyle.ts:82-84`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L82-L84). `direction` is already valid in `nonAnimatableViewProps:74`.
  - `wordWrap`: [`code/core/helpers/src/webOnlyStyleProps.ts:45, 79`](file:///Users/n8/tamagui/code/core/helpers/src/webOnlyStyleProps.ts#L45) and [`shorthands/src/index.ts:22`](file:///Users/n8/tamagui/code/core/shorthands/src/index.ts#L22). Legacy duplicate of CSS standard `overflowWrap`.
  - `elevationAndroid`: [`code/core/helpers/src/validStyleProps.ts:257`](file:///Users/n8/tamagui/code/core/helpers/src/validStyleProps.ts#L257), [`expandStyle.ts:96-98`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyle.ts#L96-L98), [`expandStyles.ts:6-11`](file:///Users/n8/tamagui/code/core/web/src/helpers/expandStyles.ts#L6-L11), [`propMapper.ts:85-88`](file:///Users/n8/tamagui/code/core/web/src/helpers/propMapper.ts#L85-L88).
- **Who consumes it**:
  - `writingDirection`, `wordWrap`, `elevationAndroid` have **zero** occurrences in `code/ui/*` and **zero** in `code/tamagui.dev/data/docs`.
- **What breaks & migration**:
  - `writingDirection="rtl"` -> `direction="rtl"` (mechanical).
  - `wordWrap="break-word"` -> `overflowWrap="break-word"` (mechanical).
  - `elevationAndroid={4}` -> `elevation={4}` or `boxShadow="..."` (mechanical).
- **What user does instead**: Use CSS standard spellings (`direction`, `overflowWrap`, `boxShadow`).
- **Confidence**: High (verified zero usage in UI & docs).
- **Classification**: (b) public breaking change with mechanical migration.

---

### Finding 9: Delete Unused Public Helper Files `getShorthandValue.ts` and `getExpandedShorthands.ts`

- **What it is**:
  - [`code/core/web/src/helpers/getShorthandValue.ts:1-10`](file:///Users/n8/tamagui/code/core/web/src/helpers/getShorthandValue.ts#L1-L10) (10 lines).
  - [`code/core/web/src/helpers/getExpandedShorthands.ts:1-7`](file:///Users/n8/tamagui/code/core/web/src/helpers/getExpandedShorthands.ts#L1-L7) (7 lines).
- **Who consumes it**:
  - `getShorthandValue.ts`: **Zero** references in the entire codebase. Only barrel-exported from `code/core/web/src/index.ts:14`.
  - `getExpandedShorthands.ts`: Only referenced in `code/ui/dialog/src/Dialog.tsx:17, 235`, which the upgrade guide ([`how-to-upgrade.mdx:483`](file:///Users/n8/tamagui/code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx#L483)) already schedules to replace with `useProps`.
- **What breaks & migration**: External callers who imported these functions from `@tamagui/web`.
- **What user does instead**: Use `useProps(props)` or standard prop access.
- **Confidence**: High (verified with repo-wide grep).
- **Classification**: (b) public breaking change with mechanical migration.

---

### Finding 10: Strip 2009 Flexbox and Vendor Properties from `unitlessNumbers.ts`

- **What it is**: [`code/core/style-grammar/src/unitlessNumbers.ts:7-9, 13, 14, 16, 55-59`](file:///Users/n8/tamagui/code/core/style-grammar/src/unitlessNumbers.ts#L7-L59) contains:
  - 2009 CSS draft box properties: `boxFlex`, `boxFlexGroup`, `boxOrdinalGroup`, `flexOrder`, `flexPositive`, `flexNegative`.
  - Vendor prefix loop adding `msBoxFlex`, `MozBoxFlex`, `OBoxFlex`, `WebkitBoxFlex`, etc.
- **Who consumes it**: Mirrored from 10-year-old `react-native-web-internals` code.
- **What breaks & migration**: None. Modern browsers have supported standard flexbox for over a decade.
- **What user does instead**: Use standard `flex`, `flexGrow`, `flexShrink`, `order`.
- **Confidence**: High (verified in `unitlessNumbers.ts`).
- **Classification**: (a) internal only.

---

### Finding 11: Streamline CSS Color-Name Tokenizer in `backgroundFamily.ts`

- **What it is**: [`code/core/style-grammar/src/backgroundFamily.ts:3-7`](file:///Users/n8/tamagui/code/core/style-grammar/src/backgroundFamily.ts#L3-L7) allocates a 147-entry CSS named color set (`aliceblue` ... `yellowgreen`) and runs top-level component splitting to guess whether a value in `background` is a color vs an image.
- **Who consumes it**: Used by `splitBackgroundValue` to split `background: "red url(...)"` into `backgroundColor` and `backgroundImage`.
- **What breaks & migration**: On web, the browser's CSS engine parses the `background` shorthand natively. On native, React Native only supports single colors or `backgroundImage` gradients. Deleting the 147-entry string table reduces bundle size and runtime startup overhead.
- **What user does instead**: Use `background` shorthand (which web handles natively) or discrete `backgroundColor` / `backgroundImage`.
- **Confidence**: High (verified in `backgroundFamily.ts`).
- **Classification**: (a) internal only.

---

## Considered and Rejected

- **Reject removing `px`, `py`, `mx`, `my` shorthands**: Kept because they are universally adopted in React Native, Tailwind, and across all `code/ui` packages.
- **Reject removing `bg` shorthand**: Kept because `bg` is the most widely authored shorthand in the ecosystem, and V6 explicitly aligned `bg` to CSS `background`.
- **Reject removing individual transform props (`x`, `y`, `scale`, `rotate`)**: Kept because independent clause replacement (`scale="1 enter:0.9 exit:0.9"`) is fundamental to Tamagui's animation model.
- **Reject removing `boxShadow` flat-value parsing**: Kept because `boxShadow` is the modern cross-platform standard across web and React Native 0.76+.
- **Reject removing the `'unset'` keyword**: Kept because `'unset'` is standard CSS on web and correctly clears styled defaults on native.
- **Reject removing container query syntax (`@sm:`, `@sm/name:`)**: Explicitly out of scope and retained as the core V3 responsive model.
