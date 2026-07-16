# `<Variables>` — anonymous inline theme patches

2026-07-16. Spec for a first-class `<Variables>` primitive: CSS-custom-property
style redefinition of theme values at any tree node, cross-platform. Companion
to `plans/v3-evolution.md` (locked contracts) and the consistency-layer finding
in `plans/base-ui-comparison.md` §1. Status: spec, pre-review, no code yet.

## Why

Themes are compiled tables keyed by name. Today the only way to change a value
for a subtree is to define another named theme, which means touching config,
regenerating tables, and paying the theme-resolution machinery for what is
conceptually one overridden value. CSS solved this with custom properties:
redefine `--x` on a node, the subtree follows, nothing re-renders.

Tamagui's web output already IS that system: every theme key becomes a CSS
custom property (`getThemeCSSRules` emits `.t_dark { --background: var(--t2) }`)
and both compiled and runtime atomic styles reference `var(--background)`
(`resolveVariableValue` returns `Variable.variable` on web). The web half of
this feature is exposing an emission point, not building a mechanism. The
native half rides the existing granular theme subscription in `useThemeState`.

Strategic consequences (these are the point, not side effects):

1. **The copied-skin consistency layer becomes values, not code.** The v3 skin
   contract copies skins into user code. Without a shared layer, every copy
   re-derives focus/disabled/press visuals and they drift. With `<Variables>`,
   the layer is conventional variables — `$focusRingColor`, `$focusRingWidth`,
   `$disabledOpacity`, `$pressScale`, easing names — defined once at the root,
   redefinable per area. Copied skins stay plain `styled()` reading `$`-values.
   Zero new abstractions in skins, which is a hard owner constraint.
2. **"Surface" is a copied fixture, not a framework hook.** A user-owned
   `Surface` component reads those variables; behavior components never do.
3. **`defaultProps` is removed in v3.** Its three uses map to: styling →
   `<Variables>`; default look → owned copied skins; propagation →
   styled-context (packet B1 makes context keys typed props).

## API

```tsx
import { Variables } from 'tamagui'

<Variables
  values={{ backgroundHover: '$blue4', radius: 10 }}
  dark={{ backgroundHover: '$blue2' }}
>
  {children}
</Variables>
```

```ts
type VariablesValues = {
  // theme keys + config-declared custom variables
  [K in ThemeKey]?: ThemeValueGet | string | number | PxValue
}

type VariablesProps = {
  values?: VariablesValues
  /** applied additionally when the subtree's scheme is dark */
  dark?: VariablesValues
  /** applied additionally when the subtree's scheme is light */
  light?: VariablesValues
  children?: React.ReactNode
}
```

Semantics:

- **Merge, not replace.** Listed keys override; every other key inherits from
  the parent theme. It is an anonymous patch on the nearest theme, never a
  theme switch: theme name, scheme, and sub-theme resolution below are
  untouched.
- **Scheme scoping.** `dark`/`light` merge over `values` when the subtree's
  effective scheme matches. On web this compiles to scheme-scoped selectors so
  a root light↔dark flip restyles with zero re-renders. v1 ships exactly this
  scheme pair; the emission mechanism (theme-class-scoped rules) generalizes to
  arbitrary theme names (`t_blue`) and a `themed={{ [name]: values }}` form can
  land later without reworking anything. Not in v1: two spellings of one
  feature is what we're avoiding.
- **Nesting.** `<Variables>` under `<Variables>` stacks patches (nearest wins
  per key — CSS cascade on web, merge order on native). A `<Theme>` (or
  component theme) below a `<Variables>` that resolves a new theme name resets
  whatever keys that theme defines, exactly like nesting themes today; put the
  `<Variables>` inside the inner theme if the patch should survive it. This
  falls out of the cascade on web and is mirrored on native for parity.
- **Keys must exist.** A key must be a theme key or a config-declared custom
  variable (below). Unknown keys are a dev-time warning and are dropped. Web
  could emit anything, native cannot resolve undeclared keys in style props;
  parity wins.
- **Not tokens.** `<Variables>` patches theme keys and custom variables only.
  Per-subtree redefinition of token-category entries (`size.$4`, `space.$2`)
  is out of scope: token resolution on native (`getTokenForKey` →
  `conf.tokensParsed`) is global and has no subscription path, and web-only
  token patching would be a platform fork. The `radius: 10` in the sketch is a
  custom variable named `radius` (HeroUI-style `--radius`), not the radius
  token scale.

### Custom variables

Declared once in config, typed by module augmentation, merged into every
parsed theme at `createTamagui` time so they behave exactly like theme keys in
every existing code path (style resolution, `useTheme()`, tracking, CSS
emission):

```ts
const config = createTamagui({
  // flat values or per-scheme { light, dark }
  variables: {
    surfaceBorder: '$borderColor',   // reference: one theme key
    disabledOpacity: 0.5,
    focusRingColor: '$blue10',
    focusRingWidth: 2,
    pressScale: 0.97,
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
})
```

Implementation: after themes are parsed, for each declared variable run
`ensureThemeVariable`-equivalent creation (name = variable key, so the web CSS
var is `--surfaceBorder`) and assign into every `ThemeParsed` that doesn't
already define the key. References (`'$borderColor'`) stay live per-theme: the
parsed value is the referenced Variable, so `getThemeCSSRules` emits
`--surfaceBorder: var(--borderColor)` and native resolves per-theme at parse
time. Typing: `variables` keys join `ThemeParsed`/`ThemeKeys` through the
existing `TamaguiCustomConfig` inference, so `$surfaceBorder` autocompletes in
style props and `useTheme()` with no extra augmentation surface.

Usage in styles needs no new runtime: `borderColor="$surfaceBorder"` already
resolves through `getTokenForKey`'s theme-first lookup
(`code/core/web/src/helpers/getTokenForKey.ts:78`).

## Decision: can values reference other variables/tokens?

**Yes — references are allowed, including chains, resolved at the
`<Variables>` node with snapshot semantics.** Rationale and exact rule:

On web we emit `--backgroundHover: var(--blue4)`. Per css-variables-1, a
custom property containing `var()` is substituted at computed-value time **on
the element that declares it**; descendants inherit the *computed* value. So a
deeper theme redefining `--blue4` does not retroactively change
`--backgroundHover` below it. That gives a precise, enforceable-nowhere-else
rule for free:

> A reference resolves against the definitions visible **at the `<Variables>`
> node** (its own `values` first, then ancestor patches, then the parent
> theme, then tokens). Descendants inherit the resolved value.

Native mirrors it exactly because resolution happens once, at the layer, when
the merged theme object is built. Chains are allowed rather than capped at one
level because the web cascade gives chains for free and a one-level cap would
be enforceable only on native — an invented divergence. No arbitrary
computation: values are single references or literals, never expressions.

Lookup order for `$name` (one shared resolver, both platforms):

1. sibling keys in the same `values` object, then ancestor patch layers, then
   parent theme keys (this is one lookup against the merged theme map, self
   layer first — identical to what the CSS cascade computes);
2. `conf.specificTokens` for qualified references: `$space.4`, `$color.blue4`
   (`code/core/web/src/createTamagui.ts:236`);
3. bare token names: scan token categories in the fixed documented order
   `color, space, size, radius, zIndex` and take the first hit, with a dev
   warning if the name exists in more than one category (use the qualified
   form to disambiguate).

Cycles (`a: '$b', b: '$a'`) are detected during native fixed-point resolution:
dev error, both keys dropped (web would compute the guaranteed-invalid value;
dropping on both sides keeps parity).

Units: raw numbers emit `px` on web except for a small explicit unitless key
set (`opacity`, `zIndex`, `flex`, `scale`, `*Opacity`, `*Scale`), matching how
numeric style props behave — `radius: 10` must produce `10px` or every
`borderRadius="$radius"` breaks. Escape hatches: `'10px'` strings and `px(10)`
(both already understood by `createVariable`, which parses `px` strings back
to numbers for native — `code/core/web/src/createVariable.ts:21`). Native
always receives the number.

## Web implementation

Owner surfaces: new `code/core/web/src/views/Variables.tsx`, a new
`helpers/getVariablesCSSRules.ts`, small export additions. No changes to
`getSplitStyles`, no changes to atomic CSS generation — consumers are already
`var()`-based.

Render: like `<Theme>` (`views/Theme.tsx:167`), a `<span>` with
`display: contents` (custom properties inherit through `display: contents`
elements) carrying a deterministic class:

```html
<span class="_dsp_contents tvar_ab12xyz">…</span>
```

Rule emission, per unique `(values, dark, light)` set:

1. Resolve each entry: reference → the target's `Variable.variable`
   (`var(--blue4)`, `var(--t-space-4)`); literal → serialized with the unit
   rule above. Theme-key custom property names come from
   `simpleHash(key, 40)` exactly as `getThemeCSSRules` does, including
   `TAMAGUI_CSS_VARIABLE_PREFIX`.
2. `identifier = 'tvar_' + simpleHash(serializedResolvedDeclarations)` — pure
   function of resolved output, so server and client agree (no hydration
   mismatch) and the extractor can precompute it.
3. Insert through the existing pipeline —
   `shouldInsertStyleRules(identifier)` / `updateRules` / `insertStyleRules`
   (`helpers/insertStyleRule.tsx`) — the same dedup + SSR-scan path atomic
   styles use. Rules:

```css
.tvar_ab12xyz { --backgroundHover: var(--blue4); --radius: 10px; }
/* scheme-scoped, reusing the theme selector strategy */
.t_dark .tvar_ab12xyz { --backgroundHover: var(--blue2); }
```

Scheme scoping detail: `dark`/`light` rules must survive the same
nested-inversion cases `getThemeCSSRules` handles with its hardcoded
two-level light/dark specificity war (`helpers/getThemeCSSRules.ts:62`).
Extract that selector-chain generation into a shared helper
(`getSchemeScopedSelectors(scheme, targetSelector)`) used by both theme rules
and Variables rules, rather than a second copy. Same two-level nesting limit,
same `shouldAddPrefersColorThemes` handling: when the app relies on
`prefers-color-scheme` instead of a root class, emit the equivalent `@media`
block for the `dark`/`light` values (mirroring `getThemeCSSRules:126`).

Dynamic `values` prop changes: re-resolve → new identifier → insert (rules are
append-only and deduped; stale classes are garbage but tiny, same tradeoff as
atomic styles) → the span's className changes. Only the `<Variables>` element
re-renders; consuming descendants restyle via CSS.

Cost audit: zero renders for scheme flips, zero renders for consumers on
patch changes, one rule-insert per unique value set, no per-consumer runtime
work of any kind. This is the "nearly free" path and ships first.

## Native implementation

One rule: **`<Variables>` is an inline theme layer riding the existing
subscription; no second invalidation system.** Everything below reuses the
machinery in `hooks/useThemeState.ts` (`states`, `localStates`,
`listenersByParent`, `scheduleUpdate`) and per-key tracking in
`hooks/getThemeProxied.ts`.

Mechanics:

- `Variables` calls the theme-state flow the way `<Theme>` does
  (`useThemeWithState(props, false, true)`), passing a new
  `values`/`dark`/`light` bag on `UseThemeWithStateProps`. It pushes its
  state id into `ThemeStateContext` so descendants parent under it.
- `getPropsKey` gains the serialized values hash, so the `localStates` fast
  path (`_propsKey` check, `useThemeState.ts:291`) invalidates when values
  change, and `hasThemeUpdatingProps` treats `values` as theme-updating so the
  provider subscribes and the `cascadeOnChange` effect schedules descendant
  updates through the existing `scheduleUpdate(id)`.
- `getNextState`, when the props carry values: keep the parent's `name` and
  `scheme` untouched, but produce `theme` = merged object — parent
  `ThemeParsed` spread + overridden keys as Variable objects
  (`{ key, name: key, val: resolved }`), with `dark`/`light` merged by the
  parent scheme. References resolve by the shared resolver (fixed-point over
  the merged map + tokens, cycle detection). Merged objects are cached by
  `(parentTheme, valuesKey, scheme)` so identity is stable across renders —
  required both for the snapshot bailouts and because `getThemeProxied` caches
  proxies in a `Map` keyed by theme object identity
  (`getThemeProxied.ts:52`); that cache must become a `WeakMap` (or the merge
  cache must own eviction) so dynamic patches don't leak.
- Descendants need zero changes: they read `parentState.theme` through the
  same proxy, track keys, and re-render only if a key they tracked changed —
  the definition of the granular path. Components that resolve a *new* theme
  name below get `themes[name]` from config, which is what gives the
  "deeper theme resets the patch" parity with the web cascade.

DynamicColorIOS interaction (churn-sensitive, see below): the fast-scheme
path in `getThemeProxied` builds light/dark pairs by reading
`config.themes[name][key]` directly (`getThemeProxied.ts:151`), which would
bypass a merged layer. For keys overridden by a `<Variables>`: if both scheme
values are known (from `values`/`dark`/`light`), build the dynamic pair from
the layer itself via `getDynamicVal`; otherwise deopt that key from the
optimization (track it normally). Never read the base config theme for an
overridden key.

Android/no-fast-path: scheme changes re-render through the normal subscription
today; `<Variables>` adds nothing to that cost.

## SSR / hydration

- Rules flow through `insertStyleRules`, so `getCSS()`/`getNewCSS()` include
  them for SSR extraction automatically (`createDesignSystem.ts:201`), and
  client-side `scanAllSheets` + `shouldInsertStyleRules` dedup against
  server-emitted rules.
- Class names are pure functions of resolved values — identical server and
  client, no hydration mismatch, no render-order dependence.
- The `dark`/`light` split never resolves the scheme at render time on web, so
  SSR output is scheme-agnostic and correct under both `prefers-color-scheme`
  and class-based scheme switching, including the `t_unmounted` first-frame
  story — nothing new to do.

## Compiler / extractor interaction

Contract (extractor is an optimizer; runtime is always correct without it):

- A `<Variables>` whose `values`/`dark`/`light` are fully static literals (or
  config-resolvable references) is extractable: the plugin resolves the same
  shared resolver at build time, computes the identical `tvar_<hash>`
  identifier, appends the rules to the extracted CSS, and replaces the element
  with `<span className="_dsp_contents tvar_…">`. Under
  `TAMAGUI_DID_OUTPUT_CSS` the runtime insert path is already a no-op.
- Any dynamic member → bail to runtime, whole component (no partial
  extraction), with a diagnostics reason code per the E-lane contract.
- Because identifiers are content-hashed, extracted and runtime-inserted rules
  for the same values dedup rather than duplicate.
- v1 ships runtime-only; extraction is a follow-up packet after the E2/E3
  engine work, but the deterministic-hash contract is designed in now so
  nothing changes shape later.

## defaultProps removal (migration notes)

What v3 must provide before deleting `defaultProps`:

| defaultProps use | replacement |
| --- | --- |
| styling defaults (`defaultProps: { backgroundColor: '$blue4' }`) | `<Variables values>` at the appropriate scope, or the skin itself |
| default look of a component | owned copied skins (C lanes) |
| prop propagation to children | styled-context typed props (packet B1) |

Docs need a migration table entry in the v3 blog/upgrade guide; the skin-kit
convention (`$focusRingColor`, `$focusRingWidth`, `$disabledOpacity`,
`$pressScale`, easings) should land as part of the canonical skin fixtures so
every copied skin reads the same names from day one. HeroUI prior art
(`~/github/heroui/packages/styles/themes/`) validates the shape: their entire
cross-component polish is `--radius` + derived scales
(`--field-radius: calc(var(--radius) * 1.5)`) and `color-mix` derivations.
We deliberately do not support `calc`/`color-mix` *inside* `Variables` values
(no arbitrary computation — native has no cascade to evaluate it); derived
values belong in config `variables` definitions computed in JS, or in
theme-builder generation.

## Churn risks / assumptions on in-flight work

The theme hooks (`useThemeState.ts`, `getThemeProxied.ts`, `useTheme.tsx`)
were flagged as actively churning in another session. As of this writing the
checkout is clean — the `optimizeFor` rework appears landed
(`e8c36cc7ee`, `2ef029b9a5`, `120052ddb0`) — but these assumptions are the
ones that break if that work continues:

1. `states`/`localStates`/`listenersByParent`/`scheduleUpdate` remain the
   invalidation backbone and `ThemeStateContext` carries a state id.
2. `getPropsKey`/`_propsKey` remains the fast-path invalidation key (we extend
   it with the values hash).
3. `getThemeProxied` caches by theme-object identity (`trackingCache` /
   `untrackedCache` Maps) — the merged-layer cache and the WeakMap change
   coordinate with whoever owns that file.
4. The `optimizeForFirstRender` mode subscribes unconditionally
   (`shouldSubscribeToTheme`), so patch updates propagate there too — but it
   skips key tracking, meaning *every* subscribed descendant under a changed
   `<Variables>` re-renders in that mode. Acceptable (it's the mode's global
   tradeoff), worth a line in docs.
5. The DynamicColorIOS pair construction reads `config.themes` directly; our
   deopt/pair-from-layer change touches the exact lines the optimizeFor work
   owns. Coordinate before implementing the native path.

## Test plan

Kitchen-sink (`code/kitchen-sink/src/usecases/VariablesCase.tsx` +
`tests/Variables.test.tsx`, default driver only — nothing here is
animation-driver dependent):

1. **Zero-re-render redefinition (web).** Memoized child subtree with a render
   counter exposed as a `data-*` attribute; a button swaps the `values` prop.
   Assert: computed `background-color` of the child changes, render count does
   not.
2. **Dark-scoped values, zero re-render (web).** `dark={{ … }}` + root scheme
   flip. Assert computed style flips per scheme, render count unchanged,
   nested inverse (`<Theme name="light">` inside dark) picks the light value.
3. **Merge semantics.** Overridden key changes, sibling theme key inherits;
   nested `<Variables>` stacks; `<Theme name>` below resets its defined keys.
4. **References.** `values={{ surfaceBorder: '$borderColor' }}` follows the
   theme at the node; sibling reference resolves to the sibling's patched
   value; cycle warns in dev and drops.
5. **Custom variables.** Config-declared `$focusRingColor` styleable and
   redefinable; unknown key warns and drops.
6. **SSR.** `getNewCSS()` includes the `tvar_` rule; hydration inserts no
   duplicate (assert via rule count).
7. **Native (core-test vitest + one RN interaction case).** Merged layer
   resolves through `useTheme()`; tracked-key-only re-render on patch change
   (spy render counts on a consumer tracking an unrelated key); deeper
   `<Theme>` resets; px-string values arrive as numbers.
8. **Units.** `radius: 10` → `10px` on web / `10` native; `opacity`-class keys
   stay unitless; `px()` and `'10px'` forms.

Type tests (`code/core/web/src/*.test-d.ts`): values keys constrained to
theme keys + declared variables; `dark`/`light` same; invalid key errors;
config `variables` inference flows to `$name` style props.

## Implementation order

1. **Web runtime** (this worktree, branch `variables`): config `variables`
   parsing, shared resolver, `getVariablesCSSRules` + shared scheme-selector
   helper, `Variables` view, exports, kitchen-sink case + tests 1–6, type
   tests. No native changes at all in this packet.
2. **Coordinator review of web diff.**
3. **Native layer**: `UseThemeWithStateProps.values`, merged-layer cache,
   proxy cache WeakMap, DynamicColorIOS deopt/pair, tests 7. Coordinate with
   theme-hooks owner first.
4. **Extractor packet** (after E2/E3 land): static extraction per the
   contract above.
5. **Docs/blog**: component page, custom-variables guide section, defaultProps
   migration entry, skin-kit convention doc with the canonical skins.

## Coordinator decisions (2026-07-16, review)

Spec accepted; the snapshot-semantics reference decision is better than the
one-level cap the original brief floated (enforceable on both platforms, and
web/native parity falls out of it). Answers:

1. **dark/light only in v1: approved.** The `themed={{name}}` general form
   waits for a real consumer; the emission mechanism already generalizes.
2. **Theme-hooks churn:** the optimizeFor rework is landed (`e8c36cc7ee`
   verified on v3-beta) and hooks are clean; the themes-split brief running
   in parallel explicitly does not touch `code/core/web/src/hooks/*`.
   Proceed with the web packet now (it touches no hooks). Before starting
   the native packet, message the coordinator to confirm the hooks owner is
   finished — do not treat silence as done.
3. **`trackingCache` WeakMap fix: defer to the native packet, land it as
   that packet's first standalone commit** — keeps the web packet
   zero-hooks-contact and fixes the leak class before the merged layers that
   make it reachable exist.
4. Amendment: add `fontWeight` to the unitless allowlist (a custom variable
   `headingWeight: 600` must not emit `600px`); audit the list once against
   RN-numeric style keys before freezing it.

Green light: implement step 1 (web runtime) per the implementation order.
