# V3 Scan 2: The `styled()` and Component Definition API

Date: 2026-08-27  
Scope: `code/core/web/src/styled.tsx`, `code/core/web/src/createComponent.tsx`, `code/core/web/src/helpers/mergeVariants.ts`, `code/core/web/src/helpers/createStyledContext.tsx`, `code/core/web/src/helpers/getVariantExtras.tsx`, `code/core/web/src/types.tsx`, and consumption across `code/ui/*`, `code/tamagui.dev`, `code/kitchen-sink`, and starters.

---

## Executive Summary

The `styled()` and component definition API in Tamagui carries substantial baggage from V2:
1. **Compound variants** implement a 9-level nested Cartesian product parser over conditional clause strings (`hover:sm:blue`) that is **used nowhere in `code/ui` or `tamagui.dev`** and is undocumented.
2. **`StaticConfig`** contains obsolete flags (`isZStack`, `memo`) that are either dead code or redundant with `createComponent` invariants, plus heavy inheritance plumbing (`parentStaticConfig`, `isHOC`) that causes runtime HOC pass-through and re-parsing branches.
3. **Functional variant `extras`** constructs a heavy object containing `context` (0 usages in the entire repo), full `fonts` dictionaries, and getters that parse class name strings, when real components only use `tokens`, `props`, and font scales.
4. **`asChild`** defines four modes (`true`, `'web'`, `'except-style'`, `'except-style-web'`), where `'web'` and `'except-style-web'` have **zero usages** in the entire codebase.
5. **`accept`** in `StaticConfig` keeps `getSubStyle` and the legacy style engine alive solely for custom sub-style props (`activeStyle`, `contentContainerStyle`).

Removing these provides substantial bundle reductions, deletes entire runtime parsing subsystems, and aligns `styled()` with web standards and React Strict DOM.

---

## Ranked Findings

Ranked by **(Value of Removal) / (Migration Pain)**. Boldest defensible proposals first.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ High Value / Low Migration Pain (Top Priority)                                         │
│  1. Restrict Compound Variants to Exact Matchers (Delete Cartesian Condition Engine)   │
│  2. Delete `staticConfig.isZStack` and the Dead `@tamagui/spacer` `spacedChildren`     │
│  3. Delete `staticConfig.memo` (Unconditional `React.memo` in `createComponent`)       │
│  4. Delete `asChild="web"` and `asChild="except-style-web"`                            │
│  5. Drop `parentStaticConfig` Retention on Component Definitions                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ High Value / Moderate Migration Pain                                                   │
│  6. Strip Unused Properties from `extras` in Functional Variants                       │
│  7. Delete Runtime `allowedStyleValues` Setting & Granular Variant Resolvers           │
│  8. Drop `accept` Sub-Style Processing (`getSubStyle`) and Inline Token Props          │
│  9. Eliminate `isHOC` Runtime Metadata & Re-parsing Pipelines                          │
│ 10. Move `elevationAndroid` Out of Core `propMapper` into `@tamagui/stacks`            │
│ 11. Normalize String Overload `styled(Component, className, ...)` to Frontend Factory  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Restrict Compound Variants to Exact Values and Delete the Cartesian Clause Engine

- **What it is**: `compoundVariants` support matching combinations of variant props. Currently, `getSplitStyles.tsx:111-240` implements a full Cartesian product parser (`compoundScanHandler`, `matcherChains`, `joinChains`, `compoundVariantMatchChains`, `Object.is`) that attempts to resolve compound matches across arbitrary conditional clause strings (`size="hover:sm sm:lg"`) and conditional objects.
- **File & Line**: [`code/core/web/src/helpers/getSplitStyles.tsx:111-240`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L111-L240), [`code/core/web/src/types.tsx:3096`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3096).
- **Docs status**: Grepped `code/tamagui.dev/data/docs` — **0 matches**. Completely undocumented.
- **Who consumes it**:
  - `code/ui/*`: **0 usages**. Not a single component in the UI kit defines `compoundVariants`.
  - `code/tamagui.dev`: **0 usages**.
  - `code/demos`: **0 usages**.
  - Internal tests only (`code/core/core-test/compoundVariants.*.test.tsx`) and the synthetic `FlatFrame` benchmark in `code/comparisons/tamagui-bench`.
- **What breaks & migration**:
  - Exact compound matching (`{ size: 'sm', tone: 'critical', style: { ... } }`) and array matching (`{ state: ['active', 'selected'] }`) remain supported.
  - Deletes runtime Cartesian expansion of conditional strings inside compounds. No real component or app authored conditional Cartesian compound variants.
  - Codemod: Not needed for any real code.
- **What the user does instead**: Compound variants match exact prop values. For state-specific styling, author conditions directly in variants or style props (`sm: { ... }`).
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration** (deletes undocumented Cartesian conditional string matching; exact compound matching preserved).

---

### 2. Delete `staticConfig.isZStack` and the Orphaned `@tamagui/spacer` `spacedChildren` Helper

- **What it is**: `staticConfig.isZStack` is a legacy flag declared in `StaticConfigPublic` and passed by `ZStack` in `code/ui/stacks/src/Stacks.tsx:56`. `createComponent.tsx` and `getSplitStyles.tsx` have zero references to `isZStack`. The only file in the repo referencing `props.isZStack` was `code/ui/spacer/src/spacedChildren.tsx:8-57`, which is itself orphaned and never called anywhere in the entire repository.
- **File & Line**: [`code/core/web/src/types.tsx:3077`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3077), [`code/ui/stacks/src/Stacks.tsx:49-58`](file:///Users/n8/tamagui/code/ui/stacks/src/Stacks.tsx#L49-L58), [`code/ui/spacer/src/spacedChildren.tsx:1-60`](file:///Users/n8/tamagui/code/ui/spacer/src/spacedChildren.tsx#L1-L60).
- **Docs status**: `isZStack` is undocumented. `ZStack` is documented in `tamagui.dev/data/docs/components/stacks`.
- **Who consumes it**: Internal legacy code only. `ZStack` in V3 is authored as `styled(YStack, { position: 'relative' })`.
- **What breaks & migration**:
  - `staticConfig.isZStack` is removed from `StaticConfigPublic`.
  - `@tamagui/spacer`'s `spacedChildren` export is deleted (V3 uses CSS `gap` / `space` tokens natively).
  - Codemod: Remove `isZStack: true` from any custom `styled()` config objects.
- **What the user does instead**: Use `ZStack` (which is just `position: 'relative'`) and standard layout props.
- **Confidence**: Verified.
- **Classification**: **(a) Internal only** for `staticConfig.isZStack`; **(b) Public breaking change with mechanical migration** for `@tamagui/spacer`'s unused `spacedChildren` export.

---

### 3. Delete `staticConfig.memo` (All Components are Already Memoized Unconditionally)

- **What it is**: `staticConfig.memo` was added as an opt-in flag to wrap styled components in `React.memo`. In `createComponent.tsx:2237`, every component returned by `createComponent` is **already wrapped in `React.memo(res)` unconditionally**.
- **File & Line**: [`code/core/web/src/types.tsx:3094, 3122`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3094), [`code/core/web/src/createComponent.tsx:2237`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L2237), [`code/ui/shapes/src/Square.tsx:35`](file:///Users/n8/tamagui/code/ui/shapes/src/Square.tsx#L35), [`code/ui/slider/src/Slider.tsx:558`](file:///Users/n8/tamagui/code/ui/slider/src/Slider.tsx#L558), [`code/ui/image/src/Image.tsx:30`](file:///Users/n8/tamagui/code/ui/image/src/Image.tsx#L30).
- **Docs status**: Undocumented in `code/tamagui.dev/data/docs`.
- **Who consumes it**: Set in 3 UI components (`Square`, `Slider`, `Image`) and `createStyledHOC.tsx:79`.
- **What breaks & migration**:
  - Removing `memo?: boolean` from `StaticConfigPublic` and `StaticConfigBase`.
  - Zero runtime behavior change because `createComponent` memoizes all components.
  - Codemod: Strip `memo: true` from `styled()` options.
- **What the user does instead**: Nothing; components are memoized automatically.
- **Confidence**: Verified.
- **Classification**: **(a) Internal only** (runtime is a no-op; clean type change).

---

### 4. Delete `asChild="web"` and `asChild="except-style-web"` (Collapse `asChild` Modes)

- **What it is**: `asChild` accepts four modes: `boolean | 'web' | 'except-style' | 'except-style-web'`. The `'web'` and `'except-style-web'` modes only toggled whether `getWebEvents` mapped `onPress` to `onClick` on web.
- **File & Line**: [`code/core/web/src/types.tsx:260-267`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L260-L267), [`code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx:18-25`](file:///Users/n8/tamagui/code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx#L18-L25), [`code/core/web/src/createComponent.tsx:1898`](file:///Users/n8/tamagui/code/core/web/src/createComponent.tsx#L1898), [`code/core/web/src/helpers/getSplitStyles.tsx:931, 1411`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L931).
- **Docs status**: Listed in `code/tamagui.dev/data/docs/intro/props.mdx:319` as a type union; no guide or example uses `'web'` or `'except-style-web'`.
- **Who consumes it**:
  - Repo scan across all packages: **0 usages of `asChild="web"` and 0 usages of `asChild="except-style-web"`**.
  - `asChild={true}` (or bare `asChild`) has 600+ usages.
  - `asChild="except-style"` has ~12 usages in UI/triggers (`Dismissable`, `createBaseMenu`, `TooltipSimple`, `ToggleGroup`, `Link.tsx`).
- **What breaks & migration**:
  - Type union collapses to `boolean | 'except-style'`.
  - Codemod: Replace `asChild="web"` with `asChild={true}`, and `asChild="except-style-web"` with `asChild="except-style"`.
- **What the user does instead**: Use `asChild={true}` for standard Slot composition, or `asChild="except-style"` when passing triggers without wrapper styles.
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration** (0 usages in repo).

---

### 5. Drop `parentStaticConfig` Retention on Component Definitions

- **What it is**: When `styled(ComponentIn, ...)` is called, `styledImpl` sets `conf.parentStaticConfig = parentStaticConfig`. This retains a strong reference to the entire parent config object, creating a linked list of static configs across nested styled chains.
- **File & Line**: [`code/core/web/src/types.tsx:3148-3150`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3148-L3150), [`code/core/web/src/styled.tsx:557-671`](file:///Users/n8/tamagui/code/core/web/src/styled.tsx#L557-L671), [`code/ui/sheet/src/SheetImplementationCustom.tsx:1234-1251`](file:///Users/n8/tamagui/code/ui/sheet/src/SheetImplementationCustom.tsx#L1234-L1251).
- **Docs status**: Internal type; undocumented.
- **Who consumes it**:
  - `styled.tsx` already flattens and merges `defaultProps`, `variants`, `compoundVariants`, `context`, `contextProps`, `baseClassName`, and `isText` into `conf` at definition time.
  - The only runtime consumers were:
    1. `getSplitStyles.tsx:1584-1589`: the `overriddenContextProps` sniff (already scheduled for deletion in V3 plan §2b / §6.13).
    2. `getSplitStyles.tsx:1129`: `isHOC` parent variants lookup.
    3. `SheetImplementationCustom.tsx:1239-1251`: `isSheetOverlayComponent` walks `parentStaticConfig` to find `[SHEET_OVERLAY_MARKER]`.
- **What breaks & migration**:
  - Internal only. `Sheet.Overlay` can carry a static marker property directly or inherit it through `conf`.
  - Garbage collection is improved; nested styled components don't hold onto ancestor static configs.
- **What the user does instead**: Unaffected.
- **Confidence**: Verified.
- **Classification**: **(a) Internal only**.

---

### 6. Strip Unused Properties from `extras` in Functional Variants

- **What it is**: Functional variants `(value, extras) => ({ ... })` receive `extras = getVariantExtras(styleState)`. `extras` contains: `tokens`, `fonts`, `theme`, `context`, `fontFamily` (getter), `font` (getter), and `props`.
- **File & Line**: [`code/core/web/src/helpers/getVariantExtras.tsx:1-61`](file:///Users/n8/tamagui/code/core/web/src/helpers/getVariantExtras.tsx#L1-L61), [`code/core/web/src/types.tsx:3240-3255`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3240-L3255).
- **Docs status**: Documented in `code/tamagui.dev/data/docs/core/styled.mdx` (`tokens, theme, props, font, fonts`).
- **Who consumes it**:
  - Across all of `code/ui/*` and `code/demos`:
    - `extras.tokens`: Used in `Toggle.tsx:40`, `Label.tsx:36`, `TabsCustomDemo.tsx:16`.
    - `extras.props`: Used in `SizableText.tsx:29`, `SliderImpl.tsx:30`, `getFontSized`.
    - `extras.font` / `extras.fontFamily`: Used in `getFontSized` (in `get-font-sized/src/index.ts:13`).
    - `extras.theme`: **0 usages in `code/ui`**.
    - `extras.fonts`: **0 usages in `code/ui`**.
    - `extras.context`: **0 usages anywhere in the repository** (grepped full repo, 0 matches).
- **What breaks & migration**:
  - Dropping `extras.context` breaks nothing.
  - Dropping `extras.fonts` dictionary (retaining `extras.font` and `extras.fontFamily`) simplifies font resolution.
  - Per V3 plan §3 & §6.2: `extras.props` is materialized only for components that declare a functional variant, allocated once as a plain object.
  - Codemod: For any user variant accessing `extras.context`, read from React context or props instead.
- **What the user does instead**: Use `extras.tokens`, `extras.props`, and `extras.font`. Use `useStyledContext()` for context.
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration**.

---

### 7. Delete Runtime `allowedStyleValues` Setting and Granular Variant Resolvers

- **What it is**: `propMapper.ts:618-721` implements `isAllowedStyleValue` and `matchesVariantResolver` with a mini type system of 15 resolver names: `Size`, `Space`, `Color`, `Radius`, `ZIndex`, `Theme`, `FontSize`, `FontStyle`, `FontTransform`, `FontLineHeight`, `FontLetterSpacing`, `number`, `string`, `boolean`, `any`. It runs regex checks (`viewportValuePattern`, `remStringPattern`) against `conf.settings.allowedStyleValues` (`strict`, `strict-web`, `somewhat-strict`, `somewhat-strict-web`) on every variant check.
- **File & Line**: [`code/core/web/src/helpers/propMapper.ts:618-721`](file:///Users/n8/tamagui/code/core/web/src/helpers/propMapper.ts#L618-L721), [`code/core/web/src/types.tsx:3166-3240`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3166-L3240).
- **Docs status**: Undocumented in `code/tamagui.dev/data/docs`.
- **Who consumes it**:
  - `code/ui/*` only uses: `Size`, `FontSize`, `number`, `string`, `boolean`, and `any`.
  - `FontTransform`, `FontLineHeight`, `FontLetterSpacing`, `FontStyle`, `Radius`, `ZIndex`, `Space`, and `Theme` have **0 usages in `code/ui`**.
  - `allowedStyleValues` setting is a legacy V2 validation guard.
- **What breaks & migration**:
  - Removes regex checks from variant resolution hot path.
  - Variant resolvers simplify to the core set: `Size`, `FontSize`, `Color`, `number`, `string`, `boolean`, `any`.
  - Codemod: If any custom component used `variant: { FontLineHeight: ... }`, change key to `Size` or `number | string`.
- **What the user does instead**: Use standard variant resolver names or exact variant keys.
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration**.

---

### 8. Drop `accept` Sub-Style Processing (`getSubStyle`) and Inline Token Props

- **What it is**: `StaticConfig.accept` (`types.tsx:3058-3060`) serves two disparate functions:
  1. Sub-style processing (`accept: { activeStyle: 'style' }` in `Checkbox`/`Toggle`, `contentContainerStyle: 'style'` in `ScrollView`): calls `getSubStyle()` in `getSplitStyles.tsx:708`. This is the **sole remaining caller** keeping `getSubStyle`, `propMapper`, and two legacy transform systems alive.
  2. Custom token props (`accept: { placeholderTextColor: 'color' }` in `Input`): maps props to token categories.
- **File & Line**: [`code/core/web/src/types.tsx:3058-3060`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3058-L3060), [`code/core/web/src/helpers/getSplitStyles.tsx:700-711`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L700-L711), [`code/core/web/src/styled.tsx:165-181, 219-227`](file:///Users/n8/tamagui/code/core/web/src/styled.tsx#L165-L181).
- **Docs status**: Documented in `code/tamagui.dev/data/docs/core/styled.mdx:265-281`.
- **Who consumes it**:
  - `code/ui/checkbox`: `accept: { activeStyle: 'style' }`
  - `code/ui/toggle-group`: `accept: { activeStyle: 'style' }`
  - `code/ui/scroll-view`: `accept: { contentContainerStyle: 'style' }`
  - `code/ui/input`: `accept: { placeholderTextColor: 'color', ... }`
- **What breaks & migration**:
  - Per V3 plan §3 & §6.13: `getSubStyle` is removed, allowing deletion of `directStyle.ts` and `propMapper.ts`.
  - Sub-styles like `contentContainerStyle` or `activeStyle` can be authored as sub-components (`ScrollView.Content`, `Checkbox.Indicator`) or passed as resolved style objects.
  - Token-mapped props like `placeholderTextColor` resolve directly in the unified style sink.
  - Codemod: Remove `accept` from custom `styled()` definitions; replace sub-style props with compound sub-components.
- **What the user does instead**: Use sub-components (e.g. `<ScrollView><ScrollView.Content ...>`) or standard style props.
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration**.

---

### 9. Eliminate `isHOC` Runtime Metadata & Re-parsing Pipelines

- **What it is**: `createStyledHOC` wraps a component with a custom render function and sets `staticConfig.isHOC = true`. This introduces extensive runtime branches throughout the engine:
  - 7 `!isHOC` checks in `useComponentState.ts:158-278` bypassing animations, hydration, and lifecycle.
  - `appendFlatClause` in `propMapper.ts:30-53` serializing flat clause strings over the HOC boundary so the inner component can re-parse them.
  - `isHOCShouldPassThrough` and `parentVariants` lookups in `getSplitStyles.tsx:936-961, 1085, 1129, 1307`.
  - `isPlainStyledComponent`, `isNonStyledHOC`, and `isStyledHOC` in `styled.tsx:561-670`.
- **File & Line**: [`code/core/web/src/createStyledHOC.tsx:1-89`](file:///Users/n8/tamagui/code/core/web/src/createStyledHOC.tsx#L1-L89), [`code/core/web/src/styled.tsx:561-670`](file:///Users/n8/tamagui/code/core/web/src/styled.tsx#L561-L670), [`code/core/web/src/helpers/getSplitStyles.tsx:936-961`](file:///Users/n8/tamagui/code/core/web/src/helpers/getSplitStyles.tsx#L936-L961), [`code/core/web/src/hooks/useComponentState.ts:142-278`](file:///Users/n8/tamagui/code/core/web/src/hooks/useComponentState.ts#L142-L278).
- **Docs status**: Documented in `how-to-upgrade.mdx` and `how-to-build-a-button.mdx`.
- **Who consumes it**: Used in ~15 components across `code/ui/` (`TabsList`, `SheetScrollView`, `SelectValue`, `SelectItemText`, `ButtonFrame`).
- **What breaks & migration**:
  - In V3, component styling passes structured props directly without serializing/re-parsing clause strings across HOC boundaries (Plan §6.4).
  - If `createStyledHOC` is unified into standard `styled()` or straightforward React component composition, all `isHOC` runtime dispatch is deleted.
  - Codemod: If `createStyledHOC(Component, fn)` signature is replaced by standard component wrapping, codemod transforms invocations mechanically.
- **What the user does instead**: Author standard React wrapper components or use `styled()`.
- **Confidence**: Verified.
- **Classification**: **(a) Internal only** for deleting the runtime `isHOC` branches; **(b) Public breaking change with mechanical migration** if `createStyledHOC` API surface is unified.

---

### 10. Move `elevationAndroid` Out of Core `propMapper` into `@tamagui/stacks`

- **What it is**: `propMapper.ts:85-88` carries an unconditional check: `if (key === 'elevationAndroid') return` on web, with a comment stating *"this shouldnt be necessary and handled in the outer loop"*.
- **File & Line**: [`code/core/web/src/helpers/propMapper.ts:85-88`](file:///Users/n8/tamagui/code/core/web/src/helpers/propMapper.ts#L85-L88), [`code/ui/stacks/src/getElevation.ts:1-25`](file:///Users/n8/tamagui/code/ui/stacks/src/getElevation.ts#L1-L25).
- **Docs status**: Undocumented in `code/tamagui.dev/data/docs`.
- **Who consumes it**: Consumed solely by the `elevation` variant on `YStack`/`XStack`/`ZStack` for Android shadow emulation.
- **What breaks & migration**:
  - Move Android elevation logic into the `elevation` variant implementation in `@tamagui/stacks`.
  - Zero application breakage.
- **What the user does instead**: Unaffected.
- **Confidence**: Verified.
- **Classification**: **(a) Internal only**.

---

### 11. Normalize String Overload `styled(Component, className, ...)` to Frontend Factory

- **What it is**: `styled.tsx:460-488` supports variable-length argument lists where the 2nd argument can be a base class name string (`styled(View, 'p-4 bg-red-500', { ... })`). Core `styled()` is documented and typed as `styled(Component, options, config)`. The string overload exists only for `@tamagui/tailwind`.
- **File & Line**: [`code/core/web/src/styled.tsx:404-409, 470-490`](file:///Users/n8/tamagui/code/core/web/src/styled.tsx#L404-L409), [`code/core/web/src/types.tsx:3031`](file:///Users/n8/tamagui/code/core/web/src/types.tsx#L3031).
- **Docs status**: Core `styled()` docs only document `styled(Component, options, config)`.
- **Who consumes it**: `@tamagui/tailwind` via `createFrontendStyled`.
- **What breaks & migration**:
  - Keep `styled(Component, options, config)` strictly 2-3 arguments in `@tamagui/core` / `@tamagui/web`.
  - Frontend-specific class strings are passed via `createFrontendStyled` or `{ baseClassName: '...' }`.
  - Codemod: `styled(View, 'cls', opts)` -> `styled(View, { ...opts, baseClassName: 'cls' })`.
- **What the user does instead**: Pass `baseClassName` in options or use the Tailwind frontend factory.
- **Confidence**: Verified.
- **Classification**: **(b) Public breaking change with mechanical migration**.

---

## Considered and Rejected

1. **Dropping `styled.a`, `styled.div`, etc. (HTML Element Factories)**  
   *Rejected*: Aligns directly with web-first and React Strict DOM goals; costs only a lightweight Proxy and zero render-time overhead.

2. **Dropping `createStyledContext`**  
   *Rejected*: Styled context is the canonical V3 replacement for style writes propagating to context; it is clean and widely used across `code/ui`.

3. **Dropping definition-time `mergeVariants`**  
   *Rejected*: Definition-time variant inheritance is essential for nested `styled(styled(Parent, ...))` composition and has zero cost on the render hot path.

4. **Dropping `extras.props` in functional variants**  
   *Rejected*: Sizable components (`SizableText`, `Slider`) genuinely need sibling props (`fontSize`, `orientation`); materializing it only when functional variants exist (Plan §3 & §6.2) solves the performance cost without breaking variant cooperation.

5. **Dropping `isText` from `StaticConfig`**  
   *Rejected*: Text ancestor tracking, font family resolution, and DOM tag selection require a fundamental distinction between Text and View at definition time.

6. **Dropping `validStyles` from `StaticConfig`**  
   *Rejected*: Definition-time static property tables allow the style pass to classify properties without runtime dispatch.
