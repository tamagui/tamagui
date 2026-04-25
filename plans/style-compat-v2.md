# `styleCompat` for v2: three-mode split

## TL;DR

Tamagui's `styleCompat` setting is today a half-finished idea. It's typed as `'legacy' | 'react-native'`, gates exactly one property (`flexBasis` in the `flex` shorthand), and its `'react-native'` mode doesn't actually match React Native — it matches CSS. The two open lightstrike PRs ([#3936](https://github.com/tamagui/tamagui/pull/3936), [#3937](https://github.com/tamagui/tamagui/pull/3937)) both diagnose real bugs that stem from that half-finished state, but fix them globally in ways that break RN↔web consistency in the other direction.

The plan: widen to `'legacy' | 'react-native' | 'web'`, make `'react-native'` actually match Yoga, make `'web'` match CSS spec, default v5/v2-final to `'web'`. Land as three sequential PRs (flex → web lineHeight → native lineHeight), defer `defaultPosition` coupling, close the two open PRs and lift their tests into this work.

The only meaningful breaking change from v5 canary is numeric `lineHeight` semantics for raw user props (tokens stay absolute, unaffected). A one-repo-wide survey found ~23 user-code sites total across tamagui + chat + takeout — a one-hour mechanical sweep.

## Why

Lightstrike filed [#3936](https://github.com/tamagui/tamagui/pull/3936) because `flex={1}` in v2's plain-`<div>` render path emits an explicit `_fs-1` that overrides `.is_View`'s base `flex-shrink: 0`, causing flex children in column layouts to collapse below content height. His fix: change the flex expansion to emit `flexShrink: 0` in `react-native` mode.

Natew's original review of that PR pushed back — claiming RN's Yoga expands `flex: 1` to `grow:1 shrink:1 basis:0` same as CSS, and that the perceived `flex-shrink: 0` in RN came from View base styles, not the shorthand itself. I echoed that pushback earlier in this planning conversation.

**Both of us were wrong.** Verified against the Yoga source in `node_modules/react-native/ReactCommon/yoga/yoga/node/Node.cpp` and `yoga/style/Style.h`:

- `Style::DefaultFlexShrink = 0.0f`
- `Style::WebDefaultFlexShrink = 1.0f`
- `Config::useWebDefaults_` defaults to `false` and RN doesn't flip it.

Walking `resolveFlexShrink()` at lines 440–453 for `flex: 1` on a Yoga node with RN's default config:

1. `style_.flexShrink()` not defined → skip
2. `!useWebDefaults && flex defined && flex < 0` → false (flex is 1)
3. Return `useWebDefaults ? WebDefaultFlexShrink : DefaultFlexShrink` → **`0.0f`**

So Yoga really does resolve `flex: 1` to `grow:1, shrink:0, basis:0` for RN. Lightstrike's rationale was correct. Our current `styleCompat: 'react-native'` mode emits `shrink: 1`, which matches CSS, not RN. This is the core reason the setting has been causing confusion.

The [#3937 lineHeight](https://github.com/tamagui/tamagui/pull/3937) situation is the same shape: a numeric `lineHeight: 1.15` gets `px` appended by tamagui's normalizer, producing `line-height: 1.15px` which is nearly invisible text — clearly a bug from the CSS perspective. Lightstrike's fix makes `lineHeight` unitless everywhere, which aligns with CSS spec but silently breaks anyone writing `lineHeight: 24` in RN-idiomatic "24 absolute DIPs" style.

Both PRs are symptoms of the same underlying problem: tamagui wants to be web-first or RN-first depending on the property, the setting that's supposed to control this only covers one property, and that property is handled inconsistently. The fix is to commit to the abstraction: `styleCompat` is the single lever that picks a coherent side of every RN↔web divergence.

## What exists today

**Type** — `code/core/web/src/types.tsx:1080`:

```ts
export interface GenericTamaguiSettings {
  styleCompat?: 'react-native' | 'legacy'
}
```

**Defaults:**
- v4 config (`code/core/config/src/v4.ts:34`): `styleCompat: 'legacy'`
- v5 config (`code/core/config/src/v5-base.ts:56`): `styleCompat: 'react-native'`

**Only one call site branches on it** — `code/core/web/src/helpers/expandStyle.ts:25-29`:

```ts
if (key === 'flex') {
  if (value === -1) return neg1Flex
  return [
    ['flexGrow', value],
    ['flexShrink', 1],
    ['flexBasis', getSetting('styleCompat') === 'legacy' ? 'auto' : 0],
  ]
}
```

**Base `.is_View` CSS** (`code/core/web/src/helpers/createDesignSystem.ts:247`):

```css
.is_View {
  display: flex; align-items: stretch; flex-direction: column;
  flex-basis: auto; box-sizing: border-box;
  min-height: 0; min-width: 0; flex-shrink: 0;
}
```

Hardcoded. Already RN-aligned on the important defaults.

**`defaultPosition` setting** — `code/core/web/src/createTamagui.ts:189`, `'static' | 'relative'`, v4 sets `'relative'` (RN-aligned), v5 unset → `'static'` (web-aligned).

**RN position default, re-verified:** still `relative`. [Yoga's Style.h](https://github.com/facebook/yoga/blob/main/yoga/style/Style.h) has `PositionType positionType_ = PositionType::Relative`, [RN docs](https://reactnative.dev/docs/layout-props) say "everything is set to relative by default." Yoga 3.0 added `position: 'static'` as a value but kept `relative` as the default.

## The three modes

| Input | `legacy` | `react-native` | `web` |
|---|---|---|---|
| `flex: N` (N > 0) | `grow N, shrink 1, basis auto` | `grow N, shrink 0, basis 0` | `grow N, shrink 1, basis 0` |
| `flex: 0` | `grow 0, shrink 1, basis auto` | `grow 0, shrink 0, basis auto` | `grow 0, shrink 1, basis 0` |
| `flex: -N` | `grow 0, shrink 1, basis auto` (N = -1 special case only) | `grow 0, shrink abs(N), basis auto` | passes through as `flex` value (CSS rejects negatives) |
| `flex: "unset"` or other string | pass through as `flex: value` | pass through as `flex: value` | pass through as `flex: value` |
| `.is_View` base `flex-shrink` | `0` | `0` | `0` |
| `defaultPosition` fallback (see deferral note) | `relative` | `relative` | `static` |
| numeric `lineHeight` on web | `Npx` | `Npx` | `N` (unitless; CSS multiplier) |
| numeric `lineHeight` on native | `N` DIPs | `N` DIPs | `N × resolved fontSize` DIPs when fontSize resolvable locally or via Text ancestor context |

Five branch points, one setting. All other RN↔web divergences (logical-prop expansion, `objectFit→resizeMode`, `position:fixed→absolute` on native, `backgroundImage→experimental_backgroundImage`, border edge-specific styles, etc.) stay always-on one-way conversions — they have no "other side" to opt into.

### Why `.is_View` base stays `flex-shrink: 0` in all modes

My first pass flipped this in web mode to match CSS's `flex-shrink: 1` default. Reconsidered: the flex shorthand in web mode already emits `flexShrink: 1` for explicit `flex={N}` usage, so users opting into CSS semantics get them on that path. Changing the base default would silently shrink every View without an explicit flex prop in a flex parent — huge blast radius across the existing component library which was designed against `flex-shrink: 0`. Leave it.

### Why explicit `flexShrink: 0` emission in RN mode

`expandStyle` could simply not emit `flexShrink` in RN mode and rely on `.is_View`'s base `flex-shrink: 0` to apply. But that couples RN-mode flex correctness to the presence of a specific CSS rule in a different file. If someone ever removes or overrides `.is_View { flex-shrink: 0 }`, RN mode silently breaks. Worth the extra `_fs-0` atomic class for robustness.

## Why `web` as the v5 default

Two reasons.

**Minimizes breaking change from current v5 canary.** Today's v5 emits `grow N, shrink 1, basis 0` for `flex={N}`. New `'web'` mode emits the same thing. No snapshot churn on flex. The only behavior change is `lineHeight` semantics for raw numeric props, which is already buggy in canary for fractional values (`1.15px`).

**Correct semantics for the default audience.** Web is the larger surface. Tailwind shorthands align automatically with CSS-spec flex. Users who want RN-idiomatic raw-number semantics (`lineHeight: 24` means 24 DIPs) can explicitly opt into `styleCompat: 'react-native'` — a valid, documented choice.

### Concrete breaking changes when v5 default flips to `'web'`

**Behavior:**
1. Numeric `lineHeight` on web: `lineHeight={24}` emits `line-height: 24` (CSS spec: 24× font-size) instead of `line-height: 24px`. Escape hatch: `lineHeight="24px"`.
2. Numeric `lineHeight` on native (when the finalizer ships): `lineHeight={1.2}` with `fontSize={20}` becomes `24` DIPs instead of `1.2` DIPs. The old behavior was broken; this is a correctness fix that's still technically a behavior change.

**Compiler snapshots:**
3. `_lh-Npx` class names become `_lh-N` for raw numeric lineHeights. Runtime-equivalent on web because the CSS is now unitless-compliant. Static extraction tests need snapshot updates.

**`'react-native'` mode bug fix (separate from the default flip):**
4. Anyone explicitly opting into `'react-native'` gets the Yoga-correct flex shrink. Before: `grow N, shrink 1, basis 0`. After: `grow N, shrink 0, basis 0`. Release-note worthy.

**No change:**
- Flex shorthand (identical to canary)
- `flex={0}`, `flex={-1}` (identical)
- `.is_View` base, `defaultPosition` default, all font token lineHeights, all non-lineHeight numeric style props, all native non-lineHeight behavior

### On `line-height: 24` in CSS

To head off confusion in release notes and docs: unitless `line-height` has no proper name in CSS spec — it's just `<number>`. Its semantics: **24× the element's font-size**. So `font-size: 16px; line-height: 24` renders a 384px-tall line box. The multiplier (not the computed pixel value) is what inherits to children, which is why Eric Meyer's 2006 [Unitless line-heights](https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/) post made the unitless form a convention. Web mode aligns to this. Users who want absolute web pixels write `lineHeight="24px"` (string). Tokens stay absolute and unaffected.

## Blast radius

Surveyed tamagui, chat, takeout for raw numeric `lineHeight` (excluding tokens, strings, and computed expressions):

| Repo | Raw numerics | Notable sites |
|---|---|---|
| tamagui | 12 (+5 computed) | tamagui.dev hero branding (`HomeHero.tsx`, `TakeoutLogo.tsx`), code blocks, `Benchmark.tsx` |
| chat | 7 | `ButtonSimple.tsx` (6, already labeled "temp fix"), `MDXComponents.tsx`, `Editor.tsx` |
| takeout | 4 | `DocsCodeBlock.tsx`, `BetaBadge.tsx`, OG image gen (2) |

**Total: ~23 sites. One-hour mechanical sweep per repo.** Escape-hatch `lineHeight="24px"` usage today: 1 instance total across all three repos (a tooltip assignment in `createComponent.tsx:370`), so nobody currently knows about the string form — worth documenting explicitly in the release post.

Font helpers (`createSystemFont`, `createGenericFont`, `font-inter`, `font-dm-sans`, `font-silkscreen`) are **not** blast radius despite all emitting absolute-number lineHeights. Walked the token path to verify: font values flow through `registerFontVariables` (`code/core/web/src/insertFont.ts:73`) → `variableToCSS(val)` (`code/core/web/src/helpers/registerCSSVariable.ts:15`) which evaluates `!unitless && typeof v.val === 'number' ? '${v.val}px' : v.val` with `unitless=false` as default. The CSS var emits as e.g. `--font-body-lineHeight-$4: 22px`. The resulting `line-height: var(--...)` resolves to `22px` — absolute length, immune to the unitless-multiplier rule, identical on web and native. So `<Text size="$4">` works correctly in every mode.

Only raw numeric user props are affected.

## Implementation architecture

### 1. Widen the setting type

`code/core/web/src/types.tsx:1080`:

```ts
export interface GenericTamaguiSettings {
  styleCompat?: 'legacy' | 'react-native' | 'web'
}
```

Update JSDoc to describe all three modes. Do not hand-edit generated types in `code/core/web/types/` — regenerate through the repo's normal build.

### 2. Centralized accessor

```ts
// in code/core/web/src/config.ts alongside getSetting
export type StyleCompat = 'legacy' | 'react-native' | 'web'

export function getStyleCompat(): StyleCompat {
  return getSetting('styleCompat') || 'web'
}
```

Fallback to `'web'` for configs that omit the setting entirely. v5-base sets it explicitly; the fallback only affects hand-rolled minimal configs, which should get the v2-era default.

### 3. Flex expansion

Extract `code/core/web/src/helpers/expandStyle.ts` flex handling into a dedicated helper:

```ts
function expandFlex(value: unknown, compat: StyleCompat): PropMappedValue | undefined {
  if (typeof value === 'string') return [['flex', value]]  // preserve 'unset' etc.
  if (typeof value !== 'number') return undefined
  if (value === -1) return neg1Flex  // unchanged historical special case

  switch (compat) {
    case 'legacy':
      return [['flexGrow', value], ['flexShrink', 1], ['flexBasis', 'auto']]
    case 'react-native':
      if (value > 0)  return [['flexGrow', value], ['flexShrink', 0], ['flexBasis', 0]]
      if (value === 0) return [['flexGrow', 0], ['flexShrink', 0], ['flexBasis', 'auto']]
      /* value < 0 */ return [['flexGrow', 0], ['flexShrink', -value], ['flexBasis', 'auto']]
    case 'web':
      return [['flexGrow', value], ['flexShrink', 1], ['flexBasis', 0]]
  }
}
```

Note on basis `0` vs `0%`: CSS spec resolves `flex: 1` basis to `0%`. Tamagui emits `0` which normalizes to `0px`. Functionally identical in almost every layout — the edge cases where `0%` differs are flex containers with indefinite main size, a rare pattern. Keep `0` to avoid snapshot churn.

### 4. Web lineHeight normalization

`code/core/web/src/helpers/normalizeValueWithProperty.ts:19-23`:

```ts
if (
  stylePropsUnitless[property] ||
  (property === 'lineHeight' && getStyleCompat() === 'web') ||
  (property && !stylePropsAllPlusTransforms[property]) ||
  typeof value === 'boolean'
) {
  return value
}
```

Do **not** add `lineHeight` to the global `stylePropsUnitless` table (which is what #3937 proposed). The table is shared with code paths that don't know about `styleCompat`; mutating it would silently affect every consumer including static extraction.

Mirror the same gate in the static-extraction path (`code/core/react-native-web-internals/src/StyleSheet/compiler/normalizeValueWithProperty.tsx:28`). If the rn-web-internals file can't easily import the config accessor, hoist the decision up to its caller in `getCSSStylesAtomic.ts` instead.

### 5. Native lineHeight finalization

On native in `web` mode, numeric `lineHeight` needs to be multiplied by resolved fontSize to match CSS's unitless semantics. Otherwise `<Text fontSize={20} lineHeight={1.2}>` renders wildly differently on the two platforms.

**Helper:**

```ts
function finalizeNativeTextLineHeight(
  styleState: GetStyleState,
  style: TextStyle | null | undefined,
  originalValues?: Record<string, any>
): void {
  if (process.env.TAMAGUI_TARGET !== 'native') return
  if (getStyleCompat() !== 'web') return
  if (!style) return
  if (!styleState.staticConfig.isText && !styleState.staticConfig.isInput) return

  const rawLineHeight = originalValues?.lineHeight
  if (typeof rawLineHeight !== 'number') return  // skip tokens, strings, absent

  const fontSize = resolveTextFontSize(styleState, style)
  if (typeof fontSize !== 'number') return

  style.lineHeight = fontSize * rawLineHeight
}
```

Text/Input only. A View with `lineHeight={1.2}` doesn't get finalized — RN View ignores `lineHeight` anyway, and running text semantics on non-Text would be wrong.

Don't round. RN accepts float lineHeights. Font helpers do round (via `Math.round`) but those produce tokens, which never hit this path.

### 6. Origin tracking: skip token-resolved values

The finalizer must only multiply when the value came from a **raw numeric prop**, not when it came from a token that happens to resolve to a number. `<Text lineHeight="$4">` with `$4 = 24` should render absolute 24 DIPs on both platforms, not `24 × fontSize`.

Tamagui already has partial origin tracking. Verified in `code/core/web/src/helpers/getSplitStyles.tsx`:

- `mergeStyle(..., originalVal)` at line 1514 accepts an `originalVal` from the propMapper.
- `styleOriginalValues` WeakMap at line 86 stores originals per-substyle-object.
- `getSubStyle` at lines 1615–1684 populates and attaches original values to each style output.
- Context propagation uses `originalVal` at line 1540 to override context props with pre-resolution token values.

Gap: base `styleState.style` doesn't carry a persistent per-key original map — `mergeStyle` uses `originalVal` for context tracking but doesn't store it anywhere the finalizer can read later.

Two options:

- **Narrow:** attach a single `originalLineHeight?: any` field to `GetStyleState`, populated by `mergeStyle` when `key === 'lineHeight' && originalVal !== undefined`. Minimal surface for a one-property need.
- **Generic:** add `originalStyleValues?: Record<string, any>` to `GetStyleState`, populated by `mergeStyle` for any key where `originalVal !== undefined`. Future-proofs for other mode-aware transforms.

Lean narrow to start. If a second mode-aware property appears (letterSpacing em, or any new web↔RN divergence), widen then. Shipping a generic map for one consumer is premature.

The variant-resolution path needs a parallel fix: when a variant resolves `lineHeight: '$4'` through `propMapper`, the `originalVal` must be the `'$4'` string, not the resolved number. If any path currently drops that metadata, `<styled(Text, { variants: { size: { true: { fontSize: '$4', lineHeight: '$4' } } } })>` on native web-mode would incorrectly multiply. Worth dedicated tests.

**Reject the value-range heuristic.** "Multiply if value < 10" makes `lineHeight={6}` impossible to express exactly and makes the finalizer's behavior opaque. Track the source properly.

### 7. Call sites for the finalizer

Text-style objects exist on several surfaces. The finalizer must run at each one, exactly once, for native web-mode Text/Input only.

**Base style.** Call after the prop loop, after active media/pseudo merges, after parent default merge, after transform merge, after `props.style` merge. Call before the existing native font-family face substitution pass in `getSplitStyles.tsx` (around the `// native: swap out the right family based on weight/style` block):

```ts
if (process.env.TAMAGUI_TARGET === 'native') {
  finalizeNativeTextLineHeight(styleState, style, styleState.originalStyleValues)
  // existing font-family face substitution follows
}
```

**Substyles (`getSubStyle`).** `hoverStyle`, `pressStyle`, `focusStyle`, `$gtSm`, etc. Call near the end of `getSubStyle` before returning `styleOut`, passing the local `originalValues` map that's already constructed there. This covers both static web output and active native substyle merges.

**Inline `style` prop.** Already merged late into base style via `mergeStyle`. The base-style call above catches it. For web, `normalizeStyle(styleProp)` needs the same unitless-lineHeight gate as `normalizeValueWithProperty`.

**Double-multiplication avoidance.** Once a substyle is finalized and merged into base, the base-style finalizer must not multiply again. Easiest guard: the finalizer only acts when the original metadata says the value was a raw number at its source. After finalization, clear or mark the original so a downstream merge doesn't re-trigger. The cleanest implementation is: each style object finalizes itself before merging outward, and merged results carry no raw-number originals for the now-absolute lineHeight.

### 8. `resolveTextFontSize` — fontSize resolution order

```ts
function resolveTextFontSize(
  styleState: GetStyleState,
  style: TextStyle
): number | undefined {
  if (typeof style.fontSize === 'number') return style.fontSize
  if (typeof styleState.style?.fontSize === 'number') return styleState.style.fontSize
  const ancestorFontSize = styleState.componentContext?.parentFontSize
  if (typeof ancestorFontSize === 'number') return ancestorFontSize

  // no local fontSize — intentionally return undefined rather than
  // falling back to a default token. See "inherited fontSize caveat" below.
  return undefined
}
```

If fontSize isn't resolvable, the finalizer leaves `lineHeight` as the raw numeric value. On native that means the text collapses visibly, surfacing the user error instead of silently producing a different line height than what the user asked for. On web, CSS handles the multiplier dynamically from inherited `font-size`, so web users don't hit this case.

### 9. Extending `ComponentContext` for Text ancestors

Tamagui already has `ComponentContext` (`code/core/web/src/contexts/ComponentContext.tsx`) with `inText: boolean`, provided by Text components at `createComponent.tsx:1592-1598`:

```tsx
if (process.env.TAMAGUI_TARGET === 'web' && !asChild && isText && !hasTextAncestor) {
  content = (
    <ComponentContext.Provider {...componentContext} inText={true}>
      {content}
    </ComponentContext.Provider>
  )
}
```

Today the provider is web-only and carries a boolean only. Extend it:

```ts
// types.tsx
export type ComponentContextI = {
  // ... existing fields
  inText: boolean
  parentFontSize?: number   // new — resolved numeric fontSize from Text ancestor
}

// createComponent.tsx — lift the web-only gate for native web-mode, pass resolved fontSize
if (!asChild && isText && !hasTextAncestor) {
  const shouldCarryFontSize =
    process.env.TAMAGUI_TARGET === 'native' && getStyleCompat() === 'web'
  if (process.env.TAMAGUI_TARGET === 'web' || shouldCarryFontSize) {
    content = (
      <ComponentContext.Provider
        {...componentContext}
        inText={true}
        parentFontSize={shouldCarryFontSize ? resolvedNumericFontSize : undefined}
      >
        {content}
      </ComponentContext.Provider>
    )
  }
}
```

The finalizer reads `styleState.componentContext?.parentFontSize` as step 3 of the fontSize fallback chain. This handles the common `<Text fontSize={20}><Text lineHeight={1.2}/></Text>` nesting case.

View doesn't wrap children in this context — which is correct. RN inherits fontSize through Text ancestors only, not View ancestors. `<View fontSize={20}><Text lineHeight={1.2}/></View>` falling back to undefined (and therefore leaving lineHeight alone) matches RN's actual inheritance behavior.

### 10. Font helpers: unchanged

`createSystemFont`, `createGenericFont`, `font-inter`, `font-dm-sans`, `font-silkscreen`, and the v4/v5 config font definitions all emit absolute-number lineHeights today and **stay that way** across all modes. Tokens are design-system values representing intended absolute leading. `styleCompat: 'web'` changes raw numeric style prop semantics, not token definitions.

Token safety was verified (section: "Blast radius" above). `variableToCSS` bakes `px` into every numeric font token on web, so `<Text size="$4">` produces absolute `line-height: 22px` identically in all modes.

A future Model B (store multipliers in tokens, apply dynamically) is architecturally interesting but out of scope. It would require every font helper to change, make `theme.body.lineHeight.$4` return different types on different platforms or require runtime multiplication for every token application, and break anyone introspecting token values. Deferred.

### 11. `defaultPosition`: defer

Current plan-space proposal: couple omitted `defaultPosition` to `styleCompat` (legacy/react-native → `relative`, web → `static`). Current v5 already defaults to `static` because v5-base omits the setting and createTamagui falls back to `static`. So coupling would not change v5 behavior, but it would change behavior for any user who wrote a minimal config with `styleCompat: 'react-native'` and no explicit `defaultPosition`.

That's a separate behavior change with its own blast radius, and it doesn't block the flex or lineHeight fixes. Land those first. Address `defaultPosition` coupling in a follow-up once those are stable.

## File changes

1. **`code/core/web/src/types.tsx:1080`** — widen `styleCompat` union, update JSDoc.
2. **`code/core/web/src/config.ts`** — add `StyleCompat` type and `getStyleCompat()` helper.
3. **`code/core/web/src/helpers/expandStyle.ts:19-30`** — extract `expandFlex()`, implement three-mode table including `flex > 0`, `flex === 0`, `flex < 0`, string flex.
4. **`code/core/web/src/helpers/normalizeValueWithProperty.ts:19-23`** — gate unitless lineHeight on `web` mode.
5. **`code/core/react-native-web-internals/src/StyleSheet/compiler/normalizeValueWithProperty.tsx:28`** — mirror the gate or hoist the decision up.
6. **`code/core/web/src/helpers/getSplitStyles.tsx`** — add `finalizeNativeTextLineHeight`, `resolveTextFontSize`, call sites in base-style completion and `getSubStyle` output; extend `GetStyleState` with a narrow `originalLineHeight` field (or carry via existing `styleOriginalValues` WeakMap).
7. **`code/core/web/src/types.tsx` (`ComponentContextI`)** and **`code/core/web/src/contexts/ComponentContext.tsx`** — add `parentFontSize?: number`.
8. **`code/core/web/src/createComponent.tsx:1591-1598`** — lift web-only gate for native web-mode Text, pass resolved fontSize to the context provider.
9. **`code/core/config/src/v5-base.ts:56`** — change `styleCompat: 'react-native'` → `'web'`.
10. **`code/core/config/src/v4.ts:34`** — no change. Stays `'legacy'`.

Do **not** modify `code/core/helpers/src/validStyleProps.ts` (`stylePropsUnitless`) or `code/core/react-native-web-internals/src/modules/unitlessNumbers/index.tsx` globally — the gates are at the call sites, not in the shared tables.

## Tests

### Unit — core web style expansion

Extend `code/core/core-test/getStylesAtomic.web.test.tsx` (lightstrike scaffolded this in #3936):

**Flex:**
- `legacy`: `flex={1}` → grow 1, shrink 1, basis auto
- `react-native`: `flex={1}` → grow 1, shrink 0, basis 0
- `web`: `flex={1}` → grow 1, shrink 1, basis 0
- `react-native`: `flex={0}` → grow 0, shrink 0, basis auto
- `react-native`: `flex={-2}` → grow 0, shrink 2, basis auto
- `flex={-1}` in all modes → grow 0, shrink 1, basis auto
- `flex="unset"` in all modes → preserved as `flex: unset`, no longhand expansion

**lineHeight on web:**
- `react-native`, numeric `lineHeight={24}` → `24px`
- `react-native`, numeric `lineHeight={1.2}` → `1.2px`
- `web`, numeric `lineHeight={1.2}` → `1.2` (unitless)
- `web`, numeric `lineHeight={24}` → `24` (unitless)
- all modes, `lineHeight="150%"` → passes through
- all modes, `lineHeight="24px"` → passes through
- regression guards: opacity still unitless in all modes, fontSize still gets px

### Unit — native text finalization

New file `code/core/core-test/getSplitStyles.native.test.tsx` or similar:

- `Text` + `web` mode + `fontSize={20}, lineHeight={1.2}` → final `style.lineHeight === 24`
- `Text` + prop order reversed → same result
- `Text` + `web` mode + no local fontSize, no ancestor → `style.lineHeight === 1.2` (unchanged; error surfaces visibly)
- `Text` + `web` mode + nested inside `<Text fontSize={20}>` → inner `lineHeight={1.2}` resolves to 24 via `parentFontSize` context
- `Text` + `web` mode + `<View fontSize={20}><Text lineHeight={1.2}/></View>` → inner `lineHeight === 1.2` (View doesn't propagate, correct)
- `Text` + `web` mode + `lineHeight="$4"` (token) → not multiplied, stays absolute token value
- `Text` + `react-native` mode + numeric `lineHeight={1.2}` → `1.2` unchanged (finalizer doesn't run)
- `View` + `web` mode + numeric `lineHeight={1.2}` → `1.2` unchanged (finalizer gated on isText/isInput)
- variant-resolved `lineHeight: '$4'` → not multiplied
- variant-resolved raw numeric `lineHeight: 1.2` → multiplied
- `hoverStyle={{ fontSize: 20, lineHeight: 1.2 }}` → finalizes correctly when merged
- `$gtSm={{ fontSize: 20, lineHeight: 1.2 }}` → finalizes correctly when active
- `Input` with text-like props → same behavior as Text

### Compiler — static extraction

Both babel and webpack snapshot suites must cover the change:

- `code/compiler/static-tests/tests/babel.web.test.tsx` default config (v5 web):
  - `flex={1}` keeps `_fg-1 _fs-1 _fb-0px` (no change from canary)
  - `lineHeight={1.2}` emits `_lh-1.2` (not `_lh-1.2px`)
- Same file with a test fixture for `styleCompat: 'react-native'`:
  - `flex={1}` emits `_fg-1 _fs-0 _fb-0px`
  - `lineHeight={1.2}` emits `_lh-1.2px`
- `webpack.test.tsx.snap` — regenerate and review diffs explicitly, do not blind-accept.
- `babel.native.test.tsx` — if the native compiler can load a `web`-mode config, verify raw numeric lineHeight multiplies when fontSize is statically known and token lineHeight does not.

### Integration — kitchen-sink

Lift lightstrike's useful artifacts:

- `code/kitchen-sink/src/usecases/FlexShrinkCase.tsx` (from #3936): two flex children in fixed-height column parent. Verify behavior in each of three configs (`legacy`, `react-native`, `web`).
- `code/kitchen-sink/tests/FlexShrink.test.tsx` (from #3936): Playwright check on computed height + computed `flex-shrink` value.
- New `code/kitchen-sink/src/usecases/LineHeightWebModeCase.tsx`: Text with `fontSize={20}` and `lineHeight={1.2}`, verify computed line-height in web mode vs react-native mode.

### Commands to run

Read `package.json` scripts in each target package before settling on exact invocations. Expected roughly:

```sh
cd code/core/core-test && bun test
cd code/compiler/static-tests && bun test
cd code/kitchen-sink && bun run test:web
```

## Implementation phases

Four PRs, sequenced for risk isolation. Each is independently reviewable and revertable.

### Phase 1: flex (lowest risk)

1. Widen the `styleCompat` union type.
2. Add `getStyleCompat()` helper.
3. Refactor `expandStyle` flex handling into `expandFlex()`.
4. Flip v5-base default to `'web'`.
5. Unit tests for all three modes × all flex input types.
6. Update compiler snapshots deliberately.

Behavior-preserving for v5 canary users (flex output identical). Fixes the `'react-native'` mode for anyone who opted in explicitly. Ships the three-mode surface so Phases 2–3 have something to gate on.

### Phase 2: web lineHeight normalization

1. Gate unitless `lineHeight` on `getStyleCompat() === 'web'` in `normalizeValueWithProperty.ts`.
2. Mirror in the compiler path.
3. Do **not** touch global `stylePropsUnitless`.
4. Unit tests for numeric/percentage/string lineHeight across modes.
5. Compiler snapshot updates.
6. Migration sweep of raw numeric `lineHeight` in tamagui.dev, chat, takeout per blast-radius survey.

Web behavior diverges for raw numeric lineHeight. Documented in the blog post / migration guide.

### Phase 3: native lineHeight finalization

Highest risk. Ships last.

1. Extend `GetStyleState` with narrow `originalLineHeight` tracking.
2. Ensure `mergeStyle` and `getSubStyle` populate it correctly, including the variant-resolution path.
3. Add `finalizeNativeTextLineHeight` and `resolveTextFontSize`.
4. Wire call sites in base-style completion and `getSubStyle` output.
5. Extend `ComponentContextI` with `parentFontSize`, populate at Text provider, lift the web-only gate for native web mode.
6. Native unit tests covering every surface (base, pseudo, media, inline, variant, View-negative, Text-positive, token-not-multiplied, ancestor-fontSize).
7. Native kitchen-sink integration tests.

Ship when Phases 1 and 2 are green in CI and no regressions have surfaced from canary users.

### Phase 4: docs + release

1. Blog post: "styleCompat in v2 — three modes, one lever."
2. Upgrade guide: migration for raw numeric lineHeight.
3. Configuration reference: full three-mode table.
4. Release notes: explicit callout of the `'react-native'` mode flex-shrink fix for existing opters.

### Deferred

- `defaultPosition` coupling to `styleCompat` — separate follow-up PR after Phases 1–3 are stable.
- Any broader RN↔web style-prop gap audit (`elevation`, `includeFontPadding`, transform aliases) — separate tracking issue.

## PR handling

- **Close [#3936](https://github.com/tamagui/tamagui/pull/3936)** — rationale was correct, fix was too narrow. Lift `FlexShrinkCase.tsx` + `FlexShrink.test.tsx` into Phase 1.
- **Close [#3937](https://github.com/tamagui/tamagui/pull/3937)** — the global `stylePropsUnitless` mutation is the wrong shape. Lift all the numeric/percentage/opacity/fontSize guard tests into Phase 2 as mode-parameterized regression coverage.

## Risks

- **Losing origin metadata through variants.** Token `lineHeight: '$4'` inside a variant getting multiplied on native. Addressed by tracking `originalVal` through the variant propMapper path; tests cover it explicitly.
- **Double-multiplication across substyle merges.** A finalized substyle merging into base and being multiplied again. Addressed by clearing original metadata at finalization and structuring the call order so each surface finalizes exactly once.
- **Text finalizer running on Views.** Addressed by gating on `staticConfig.isText || isInput`.
- **Static extraction bypassing runtime gates.** Addressed by mirroring the gate in the compiler normalize path and covering both in snapshot tests.
- **ComponentContext perf.** Extending the provider with `parentFontSize` means font-size changes re-render descendants. Today the provider already flips on `inText`, so marginal cost is small, but worth watching in profile traces.
- **Snapshot churn masking real behavior change.** Review every changed snapshot deliberately; do not accept en-masse.

## Success criteria

- `styleCompat: 'react-native'` matches Yoga/RN for `flex` (all sign cases).
- `styleCompat: 'web'` emits CSS-spec flex shorthand and unitless lineHeight on web.
- `styleCompat: 'web'` on native renders raw numeric lineHeight as `fontSize * value` when fontSize is locally resolvable, and leaves it alone otherwise.
- Token lineHeights render absolute values identically in all modes on both platforms.
- Text finalization affects Text/Input only; Views and Stacks unaffected.
- All four surfaces (base, pseudo, media, inline) + variants covered by tests.
- Existing v5 canary users see zero flex regressions; only numeric lineHeight migrates.
- Compiler snapshots hand-reviewed; no unexplained diffs.

## Open decisions

1. **Narrow `originalLineHeight` field vs generic `originalStyleValues` map on `GetStyleState`.** Lean narrow until a second mode-aware property appears. Revisit if the finalizer pattern generalizes.
2. **Default fallback when `styleCompat` is unset.** Plan uses `'web'` — matches v2 intent for hand-rolled configs. Alternative: fall back to `'legacy'` as a safer implicit default. Pick based on how much we trust users without explicit settings to want v2 semantics.

## Sources

- [Yoga `Style.h`](https://github.com/facebook/yoga/blob/main/yoga/style/Style.h) — `DefaultFlexShrink`, `WebDefaultFlexShrink`, position default
- [RN Layout Props docs](https://reactnative.dev/docs/layout-props) — position `relative` default
- [Yoga 3.0 announcement](https://www.yogalayout.dev/blog/announcing-yoga-3.0) — `position: static` support added, default stayed `relative`
- [Meyer: Unitless line-heights](https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/) — origin of the convention
- [PR #3936 — flex shrink](https://github.com/tamagui/tamagui/pull/3936)
- [PR #3937 — lineHeight unitless](https://github.com/tamagui/tamagui/pull/3937)
