# Inline theme values: can an app that never uses them ship none of it?

Measured 2026-08-17 on `v3-beta`. Recorded so the worker who implements the
approved mechanism does not rebuild these fixtures or re-derive these numbers.

## The question

`<Theme background="blue4 dark:blue2">` inline values are implemented in
`code/core/web/src/helpers/variables.ts`, which costs **2,339 marginal gzip**,
the largest non-engine module in the bundle. Apps that never write an inline
theme value still ship all of it, because `views/Theme.tsx` calls
`getInlineValuesFromProps` on every enabled render, so the whole downstream graph
is statically reachable and no bundler can shake it.

## What is retained today

Fixture whose ONLY theme use is `<Theme name="dark">`, zero inline values,
attributed with the recipe in `plans/v3-golf-method.md`. Bundle total 74,823.

| module | marginalGzip | minBytes |
| --- | ---: | ---: |
| `web::helpers/variables.mjs` | 2,293 | 6,722 |
| `web::hooks/useThemeState.mjs` | 1,616 | 4,346 |
| `web::views/Theme.mjs` | 791 | 2,145 |

Per-declaration, only `mergeConfigVariablesIntoTheme` (~200) is genuinely needed
by such an app. `getMergedInlineTheme` (~477) and `getVariablesCSSRules` (~327)
are the bulk and are inline-only. Note `mergeConfigVariablesIntoTheme` serves the
CONFIG `variables` key of `createTamagui`, which is a different, staying feature.

## Three mechanisms, measured

| mechanism | before → after | result |
| --- | --- | --- |
| leaf/heavy split ALONE | 74,823 → 74,815 | **no useful effect**; both retained (heavy 1,941, leaf 328) |
| split + build-time opt-out, Vite/Rollup | 74,823 → **71,077** | **−3,746**, heavy module ABSENT |
| split + opt-out, Next/webpack | 144,213 → **139,677** | **−4,536**, heavy reduced to a 37-byte stub |
| same literal-folded flag, Metro 0.83.7 | 2,245,105 → 2,245,001 | **−104 only**, module RETAINED with all three inline markers |

Alongside the Vite opt-out, `useThemeState` fell 1,616 → 1,486 and `Theme`
791 → 702. On webpack, `useThemeState` 1,617 → 1,441 and `Theme` 827 → 748.

**This reproduces `plans/v3-handoff-log.md` section 15 on new ground: guards do
not create module absence, and splitting alone does nothing.** Metro fixes its
dependency graph at resolution time, before minification, and does no
export-level shaking. webpack's success case still ships a stub, so any gate
defined as "no forbidden module ids" fails in its best case.

## DECISION: not scheduled. No compiler DCE, no env flag. (owner, 2026-08-17)

**Final.** Neither mechanism ships. Do not re-propose either one.

- **No generic public env guard.** It pays off on two bundlers out of three and
  leaves the public API carrying a flag that does not do what its name implies on
  native.
- **No compiler/resolver route either**, which was the recommendation this
  document originally carried. The owner's reasoning matches the data above:
  reliably proving NON-USE of something tied to `<Theme>` is not sound, because
  a spread (`<Theme {...props}>`) defeats static detection. The compiler would
  have to fail open, and it would fail open too often for the win to be bankable.

### Logged potential optimization: a separate component

The one shape that would work is to **not tie inline values to `<Theme>` at
all**: a separate component, working name **`ThemeUpdate`**, which tree-shakes
away automatically when nobody imports it. No proving of non-use is required,
because absence of an import IS the proof.

The prize is the **~3,700-4,500 gzip** measured above, for every app that never
writes an inline theme value.

This is a POTENTIAL FUTURE OPTIMIZATION, not scheduled work. It would revisit the
settled `<Theme>` inline-props API, so it is **owner-initiated only**. Do not
start it off the back of this document.

## Fixture layout, to reproduce

Three throwaway fixtures, one per bundler. Each renders exactly:

```tsx
<TamaguiProvider config={config} defaultTheme="light">
  <Theme name="dark">
    <View backgroundColor="$background" />
  </Theme>
</TamaguiProvider>
```

The opt-out is a build-time literal, `process.env.TAMAGUI_INLINE_THEME_VALUES`,
folded per bundler:

- **Vite** — `define: { 'process.env.TAMAGUI_INLINE_THEME_VALUES': JSON.stringify('0') }`,
  plus `tamaguiPlugin({ components: ['tamagui'], config, optimize: true })`.
  Build with `--sourcemap` and attribute with `attribute-bundle-gzip.ts`.
- **Next/webpack** — `env: { TAMAGUI_INLINE_THEME_VALUES: '0' }` gated on an
  `INLINE_OFF` env var, `transpilePackages: ['tamagui', '@tamagui/web']`,
  `productionBrowserSourceMaps: true`. **Give each arm its own `distDir`**
  (`.next-off` vs `.next-full`); two integrations sharing a publish directory
  silently decide what the other one asserts, which has bitten this repo before.
- **Metro** — `getDefaultConfig` with `projectRoot` at the fixture,
  `watchFolders` at the repo root, `resolver.nodeModulesPaths` at the root
  `node_modules`, `mjs` added to `sourceExts`, and
  `transform.experimentalImportSupport: true`, `inlineRequires: false`.

Verify a claimed absence by CONTENT, never by version or config: grep the built
output for markers from the inline-values path. On Metro all three markers
survive in both arms, which is the whole finding.
