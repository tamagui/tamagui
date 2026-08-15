# v3 web: a real zero-runtime mode, and the road below v2

Branch `v3-beta`. Every number below was re-measured in this worktree; nothing
is carried over from an older record. Claims are labeled **READ** (I ran it,
receipt inline), **INFERRED** (follows from named readings), or **GUESS** (fits
the shape, unverified).

Two baselines appear below, both real:

- **`f33ced24bc`**, where the decomposition and all the probes were taken.
- **`5e3b31bca9`**, one commit before this plan landed. `359e29cc83` and
  `5e3b31bca9` removed `normalize-css-color` from web mid-write, so the gap is
  now smaller than the decomposition table shows. Item 2 in §9 is done.

**READ**, current bench, single emitted chunk, `gzip -9`:

| | at `f33ced24bc` | at `5e3b31bca9` |
| --- | ---: | ---: |
| V3 | 104,796 | **102,328** |
| V2 | 92,961 | 92,961 |
| gap | +11,835 | **+9,367** |

`aliceblue` (the CSS color-name table) no longer appears in the emitted chunk.

Companion record: [`code/comparisons/V3_BETA_MEASUREMENT_STATE.md`](../code/comparisons/V3_BETA_MEASUREMENT_STATE.md).
That file's headline `+12,052` is correct for `605a1659d3` and is now stale by
one commit (see below).

---

## 1. The result that reorders the whole plan

**READ.** A fully-flattenable app already compiles to zero runtime today, and
the compiled output is byte-for-byte competitive with hand-written React.

Three probe builds, same vite config, same tamagui plugin with `optimize: true`:

| probe | what it renders | JS gzip |
| --- | --- | ---: |
| P3 | 500 hand-written `<div className="is_View _w-… _h-…">` , no tamagui import | 57,485 |
| P1 | 500 `<View width={20} …>` from `tamagui`, all-static props, no provider | 57,492 |
| P2 | P1 wrapped in `<TamaguiProvider config={config}>` | 78,611 |

- **P1 − P3 = +7 bytes gzip.** The compiler lowered every call site to
  `jsx('div', {className: 'is_View _w-… …'})`, the `View` binding went unused,
  and rolldown dropped the entire `tamagui` graph. Grepping the P1 chunk for
  tamagui runtime symbols returns only the two `is_View` class-name string
  literals.
- **P2 − P1 = +21,119 bytes gzip.** That is what `TamaguiProvider` plus
  `createTamagui(config)` costs on their own, with zero un-lowered components in
  the tree.

So the JSX half of "zero runtime" is solved. What is not solved is everything
around it: the CSS the flattened markup references does not exist without the
runtime, the provider does not compile away, and on a real app roughly a fifth
of call sites do not lower at all.

P1's emitted CSS is 474 bytes of atomic rules and nothing else. It references
`is_View` and never defines it. No `:root` block, no theme variables, no
`display:flex` / `box-sizing` base rules. **READ.** A zero-runtime build today
renders unstyled boxes.

---

## 2. Current numbers, re-measured

Fixture: `code/comparisons/tamagui-bench` (V3) vs `code/comparisons/tamagui-v2-bench` (V2).

```sh
cd code/comparisons/tamagui-bench   && EXTRACT=1 npx vite build --sourcemap --outDir /tmp/v3bench
cd code/comparisons/tamagui-v2-bench && EXTRACT=1 npx vite build --sourcemap --outDir /tmp/v2bench
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --against=/tmp/v2bench --filter=@tamagui/
bun code/comparisons/run-benchmarks.ts --build-only \
  --frameworks=tamagui-v3-compiled,tamagui-v2-compiled --seed=73129 \
  --bundle-attribution=/tmp/attr-head.json
```

**READ**, single-chunk `gzip -9` of the emitted JS:

| | V3 | V2 | Δ |
| --- | ---: | ---: | ---: |
| JS raw | 318,135 | 283,515 | +34,620 |
| JS gzip | 104,796 | 92,961 | **+11,835** |
| CSS raw | 3,441 | 4,427 | −986 |

**READ**, `run-benchmarks.ts` (splits tamagui into its own minified chunk, so
whole-app totals differ slightly from the single-chunk build above):

| | V3 | V2 | Δ |
| --- | ---: | ---: | ---: |
| whole-app JS gzip | 105,760 | 94,153 | **+11,607** |
| tamagui-attributable gzip | **44,899** | **33,418** | **+11,481** |
| react control gzip | 57,105 | 57,091 | +14 |

The react control moving 14 bytes confirms the run is valid and the movement is
ours.

### Correction to the brief's numbers

The brief cites `+12,052 / +11,900` at `605a1659d3`. Those were right for that
commit. `5bc6b34d7f` (nativeStyleEngine gating) landed after it and took 236
bytes out, and the gzip dictionary shifted with it. Current is **+11,607
whole-app / +11,481 tamagui-attributable**. Direction and every conclusion are
unchanged; use the new figures when quoting.

The per-module decomposition reproduces almost exactly. Marginal gzip
(`gzip(chunk) − gzip(chunk without that module)`), V3 vs V2, mine on the left:

| brief | mine | module |
| ---: | ---: | --- |
| +5,451 | +5,451 | `web/helpers/directStyle` |
| +2,280 | +2,315 | `@tamagui/normalize-css-color` (index 2,237 + rgba 78) |
| +1,326 | +1,338 | `web/helpers/propMapper` |
| +1,228 | +1,231 | `web/helpers/variables` |
| +1,110 | +1,118 | `@tamagui/style-grammar` runtime tables |
| +745 | +751 | `animations-css/createAnimations` |
| +434 | +440 | `resolveSafeArea` + `resolveSafeAreaVariable` |
| +377 | +379 | `@tamagui/core::runtime` |
| +207 | +206 | `helpers/tokenCategories` |

One number worth calling out that the brief did not: **`getSplitStyles` is
−188 in V3** (3,667 vs V2's 3,855). `directStyle` is purely additive on top of
it. Two style engines ship in every compiled bundle.

---

## 3. `TAMAGUI_DID_OUTPUT_CSS` is worse than dead

**READ.** Nothing in the repo sets it. `grep -rn TAMAGUI_DID_OUTPUT_CSS` finds
six reader files in `@tamagui/web` and one docs sentence. The next-plugin's
`DefinePlugin` block sets `IS_STATIC`, `TAMAGUI_TARGET`, `TAMAGUI_IS_SERVER`,
`TAMAGUI_ENVIRONMENT`, `TAMAGUI_DOES_SSR_CSS`, `TAMAGUI_OPTIMIZE_THEMES`, and
not this one. The vite plugin sets none of them.

Forcing it on with a vite `define` measures:

| build | JS gzip | Δ |
| --- | ---: | ---: |
| bench baseline | 104,796 | |
| `TAMAGUI_DID_OUTPUT_CSS="1"` | 101,857 | **−2,939** |
| P2 probe baseline | 78,611 | |
| P2 + flag | 75,628 | **−2,983** |

Two independent fixtures, −2,939 and −2,983. The brief's −2,849 is the same
result. **The docs' "~6KB gzipped savings" is roughly double the truth and
should be corrected to ~2.9KB.**

### But turning it on today ships a broken app

**READ.** With the flag on, the emitted CSS asset is byte-identical (3,441 bytes
in both builds), while the JS loses the design-system CSS entirely:

| grep in emitted JS | baseline | flag on |
| --- | ---: | ---: |
| `is_View` | 6 | 2 |
| `:root` | 8 | 0 |

The design-system rules (`:where(.is_View){display:flex;…}`, the scrollbar and
pointer-events rules) and every `:root` theme-variable block live as string
literals in `createDesignSystem.ts` / `getThemeCSSRules.ts` and are injected into
`document.head` at `createTamagui()` time. The flag deletes them from JS and
puts them nowhere. The vite plugin only ever emits per-module atomic CSS through
its virtual `.tamagui.css` modules; it never writes the config-level CSS.

That is what `outputCSS` is for, and **READ**, the vite plugin passes
`outputCSS: undefined` on the native path and never wires it for web at all.
`Static.loadTamagui` will write the file when `props.outputCSS` is set
(`code/compiler/static/src/extractor/loadTamagui.ts:160`), and the `generate`
command in `code/core/cli/src/cli.ts` already drives exactly that path.

**So this is not "flip a flag". It is "make the compiler emit the design-system
and theme CSS as a build artifact, then flip the flag."** Which is the same work
zero-runtime needs. Items 3 and the mode are one problem, not two.

---

## 4. What zero-runtime mode means, precisely

**Definition.** For a declared entry graph, after compilation, no module whose
resolved id contains `/tamagui/` or `/@tamagui/` appears in the client bundle.
Output is `jsx('div' | 'span' | 'input' | …, { className, …passthrough })` plus
one static CSS file. `react` and `react-dom` remain.

**Given constraints** (from Nate): CSS animation driver only. Web only.

**Delivery shape.** Three artifacts have to exist before the mode can be
claimed:

1. **`app.css`** containing, in this order: design-system base rules, `:root`
   token variables, font rules, every theme's `.t_*` variable block, and the
   compiler's atomic rules. Today only the last group is emitted.
2. **Lowered JSX** for every call site. Already works (§1).
3. **No provider.** `TamaguiProvider` costs 21,119 gzip on a tree with zero
   un-lowered children. In the mode it must not be imported at all; theme
   switching becomes "put `t_dark` on an ancestor element", which is what the
   CSS already keys off.

---

## 5. Where the runtime actually goes

Absolute marginal gzip in the V3 bench chunk (the `left` column of the
attribution run), grouped by what removes them:

**Cluster A, the runtime style engine (~16.5KB gzip).** `directStyle` 5,451,
`getSplitStyles` 3,667, `propMapper` 2,407, `insertStyleRule` 1,345,
`style-grammar` runtime tables 1,118, `validStyleProps` 916, `resolveSafeArea`
+ `resolveSafeAreaVariable` 440, `tokenCategories` 206, plus `normalizeColor`
63. This entire cluster exists to serve call sites the compiler did not lower.
It is one unit: **READ**, `directStyle.ts:14-26` imports
`createClausePrecedenceOrder` / `compareClausePrecedence` /
`canonicalClauseModifier` at value level from `@tamagui/style-grammar/runtime`,
and `directStyle.ts:39-41` pulls `propMapper`, `resolveSafeArea` and
`resolveSafeAreaVariable`. You cannot lift the style-grammar tables out
separately while `directStyle` ships.

**Cluster B, config and CSS generation (~5.8KB gzip at `f33ced24bc`, ~3.5KB
now).** `createTamagui` 1,337, `insertStyleRule`'s share, `createDesignSystem`
905, `variables` 1,231, `core::runtime` 379, plus `normalize-css-color` 2,315
which `359e29cc83` has since removed. Most of the remainder is what the
`TAMAGUI_DID_OUTPUT_CSS` measurement takes out.

**Cluster C, the component runtime (~7KB gzip).** `createComponent` 3,923,
`useThemeState` 1,656, `useComponentState` 852, `getThemeProxied` 238,
`useTheme` 92, `createStyledContext` 351.

**Cluster D, features (~4KB gzip).** `animations-css/createAnimations` 2,344,
`use-element-layout` 1,348, `animation-helpers` 390.

Sum ≈ 33KB of the measured 44,899. The rest is component packages and small
helpers.

---

## 6. Component tiers

The audit below is **p22394's READ** of runtime (non-type) imports from
`@tamagui/web` and `@tamagui/core` across `code/ui/*/src`. I spot-checked five
packages (`card`, `accordion`, `sheet`, `select`, `toast`) and my reading agrees
with theirs, so I am relaying it as their reading corroborated, not as my own
full audit.

**Tier A, erases today (15 of 49 audited packages).** Import only stylable /
compile-time surface: `styled`, `View`, `Text`, `createStyledHOC`,
`createStyledContext`, `withStaticProperties`, `createRefComponent`,
`composeRefs`, `composeEventHandlers`, `isWeb`/`isIos`/`isAndroid`. These are
`accordion avatar card collapsible elements form label radio-group
react-native-web scroll-view separator shapes text toggle-group
visually-hidden`. A Tier A component vanishes the moment all of its call sites
lower, exactly as `View` did in probe P1.

**Tier B, needs a small runtime (the bulk of the remaining 34).** The recurring
runtime dependencies across the whole set are a short list: `useEvent`,
`useThemeName`, `Theme`, `useConfiguration`, `getVariableValue`,
`useAnimationDriver` / `useAnimatedNumber`, `useIsTouchDevice`,
`useDidFinishSSR`, `Slot`, `LayoutMeasurementController`,
`createChangeEventDetails`. **That is the actual question to answer, and it is
much narrower than "gut the core":** can those eleven symbols be satisfied by a
standalone package that does not transitively reach the style engine? Several
are trivially independent (`useEvent`, `useDidFinishSSR`, `useIsTouchDevice`,
`Slot`, `composeRefs`). `useThemeName` / `Theme` / `useConfiguration` /
`getVariableValue` are the ones that reach config and theme state and need real
design work.

**Tier C, out of scope for the mode.** `sheet` (8 runtime imports), `toast` (7),
`select` (6), `portal` (6), `slider` (5), `dialog` (4), then
`tooltip switch stacks roving-focus popper menu linear-gradient input
dismissable create-menu` at 3 each. Anything needing measurement, portals,
animation drivers beyond CSS, or focus management. These become islands (§7).

**Open, needs a decision.** Whether Tier B is worth building at all in v1, or
whether v1 is "Tier A only, everything else is an island". The Tier A set covers
layout, text, cards, forms and lists, which is most of a content site.

---

## 7. Proving coverage, and what happens when it fails

Two gates, because neither alone is sufficient.

**Gate 1, compiler-local.** The compiler already produces exactly the accounting
this needs. **READ**, `code/comparisons/output/v3-site-compiler-stats.json`,
whole tamagui.dev at the v3 compiler:

```
found 2564   lowered 2086   flattened 2073   partial 13   bailed 478   flattenRate 0.809
local/unsupported-target   221
local/unsafe-style-spread  142
local/dynamic-style-value  115
linked/unresolved-binding    5
```

The homepage alone: 277 found, 225 flattened, 52 bailed. **18.6% of call sites
on a real app do not lower today.** In zero-runtime mode, every bailout becomes
a build error carrying file, line, component and code. The plumbing exists
(`compilerStats.ts`, `TAMAGUI_COMPILER_STATS_FILE`); the mode adds a threshold of
zero.

The largest bailout bucket is `local/unsupported-target` at 221, and it is
mostly "X does not accept className": `Spinner` 26, `Input` 20, `ScrollView` 18,
`Label` 17, `XGroup` 16, `Button`, `EnsureFlexed`. **INFERRED**: these are Tier
B/C components whose implementation is not a plain styled view, so no compiler
improvement fixes them. They are fixed by rewriting the component or by
declaring it an island. Seventeen more are "Animated candidates remain on the
runtime path", which the CSS-driver-only constraint partly addresses and partly
does not.

**Gate 2, bundler-level.** After bundling, assert no emitted module id matches
`/(@)?tamagui/`. This is the only gate that actually proves the claim, because
the compiler's accounting is blind to non-JSX entry points: a stray `useTheme()`,
`getTokens()`, `getVariableValue()`, a `styled()` used as a value, an `Adapt`, or
a component imported for its type that also has a runtime export. Gate 1 without
Gate 2 will report success on a bundle that still ships 40KB of runtime.

### Failure policy

Recommendation, **not** a survey: **hard build failure with a full list, no
per-site fallback.**

A per-component fallback that silently reintroduces the import is the wrong
design and should be rejected outright. It makes the mode's guarantee
unfalsifiable: the build goes green, one `Spinner` drags in `createComponent`,
`getSplitStyles` and `directStyle`, and the app pays 16KB while believing it is
at zero. Per the repo's own rule, fix the bad state at the source rather than
recovering from it downstream.

So:

- `zeroRuntime: true` fails the build and prints every offending site grouped by
  bailout code, with the component name and a one-line reason.
- `zeroRuntime: 'report'` runs the same analysis, writes the JSON, exits zero.
  This is what you use to find out how far an existing app is. Run it against
  tamagui.dev first; the 478-bailout number above is that report in embryo.
- The escape hatch is **islands**, not fallbacks:
  `zeroRuntime: { islands: ['app/editor/**'] }`. Island modules are excluded
  from the zero-runtime graph, bundled into their own async chunk, and only that
  chunk carries `@tamagui/*`. The main bundle keeps a real guarantee, and the
  cost of using a Sheet is visible as a lazily-loaded chunk instead of a silent
  16KB tax.

**Open question.** Whether an island can share a `TamaguiProvider` with a
zero-runtime root, or whether each island mounts its own provider. Sharing means
the provider is in the main chunk and the guarantee is gone. Per-island
providers mean per-island config parsing cost and possible duplicate theme
class emission. I do not have a confident answer and it needs Nate's call.

---

## 8. What an app gives up

Stated concretely, since this is what determines whether anyone can use the mode:

- **Runtime theme mutation.** `_mutateTheme`, the runtime theme builder, and the
  `getOrCreateMutatedVariable` path in `getThemeCSSRules` all require the CSS
  generator to be live. Themes become a static, build-time set. Theme *switching*
  survives (it is a class name), theme *authoring at runtime* does not.
- **Dynamic style values.** 115 sites on tamagui.dev today, things like
  `opacity={someExpr}` and `color={props.color}`. A CSS custom property escape
  (`style={{'--x': v}}` plus an atomic rule reading `var(--x)`) covers some of
  these and is worth investigating, but not all.
- **Unprovable spreads.** 142 sites. `{...props}` where the compiler cannot
  prove the spread contains no style props. This is the bucket most likely to
  shrink with compiler work, since a typed spread from a known component's props
  is analyzable.
- **JS access to design tokens.** `useMedia()`, `useTheme()`, `getTokens()`,
  `getVariableValue()`. Media, group and pseudo state stay expressible, but only
  as CSS. Anything that needs the current media state as a JS boolean is out.
- **Every animation driver except CSS.** Given.
- **`asChild` / `Slot`, `Adapt`, context-dependent variants**, and `styled()`
  variants whose functions read theme at render.

---

## 9. Ordered work, with numbers

Ordered by gzip per unit of risk. "Measured" means I built it and read the bytes.

| # | item | Δ gzip | confidence | risk |
| --- | --- | ---: | --- | --- |
| 1 | Emit design-system + theme CSS as a build artifact from the vite and next plugins, then set `TAMAGUI_DID_OUTPUT_CSS` | **−2,928** | measured (READ) | medium: needs the CSS file wired into both plugins and an SSR story; must be off in dev and off when themes mutate at runtime |
| 2 | ~~Move `normalize-css-color` off the web runtime~~ **LANDED** in `359e29cc83` + `5e3b31bca9` | **−2,468** | measured (READ) | done |
| 3 | Correct the docs' "~6KB" claim to the measured ~2.9KB | 0 | READ | none |
| 4 | Ship one style engine on the compiled path, not two | ~−3,667 | estimated (INFERRED from `getSplitStyles` marginal 3,667) | high: needs a design for how the compiled path drops prop-walking |
| 5 | `resolveSafeArea` + `tokenCategories` + `core::runtime` off the web hot path | ~−1,025 | marginals (READ), mechanism unverified | medium |
| 6 | Defer or drop the `Variables` feature on web | ~−1,231 | marginal (READ) | product decision, not a leak |
| 7 | **Zero-runtime mode** | up to **−44,899** | see below | the actual project |

Marginals in this table sum honestly. **READ**: before item 2 landed, items 1
and 2 measured individually at −2,939 and −2,277 (predicted sum −5,216) and
together at −5,168, a 1% error. And item 1 re-measured on the post-item-2
baseline gives −2,928, within 11 bytes of its pre-item-2 figure. Treat sums here
as good to about ±5%.

### Does anything short of the mode get v3 below v2?

No. **INFERRED**, from the measured items above, starting from the current
+9,367:

- Item 1 alone: **READ**, 102,328 → 99,400, leaving **+6,439 above V2**.
- Items 1+4: −6,595, leaving **+2,772 above V2**.
- Items 1+4+5+6: −8,851, leaving **+516 above V2**, and that requires removing
  a v3 feature.

Every remaining identified leak, plus a feature deletion, lands at rough parity.
There is no combination of leak-fixes that puts v3 under v2. **Below v2 requires
the mode.**

### What the mode is worth

The bench fixture's tamagui-attributable gzip is 44,899 (**READ**). A
zero-runtime build removes all of it: 105,760 → 60,861 whole-app gzip, against
V2's 94,153. That is **−33,292 vs V2, or 35% of the whole app** (**INFERRED**,
upper bound). The direct evidence that the endpoint is reachable is P1 vs P3:
+7 bytes over hand-written React.

Upper bound, because the fixture is 100% flattenable primitives. A real app's
number is set by how much of it is Tier A, and the `zeroRuntime: 'report'` run
against tamagui.dev is what turns that into a real figure. Do that report early;
it is cheap and it decides whether the mode is a headline feature or a niche one.

### Note on item 2, which landed while this was being written

The two web consumers were `helpers/themes.ts::normalizeThemeValue` and
`helpers/propMapper.ts::isCSSColorName`. Both are gone:

- `359e29cc83` deleted `normalizeThemeValue`. `ensureThemeVariable` now stores
  the authored value as written.
- `5e3b31bca9` made the Color variant resolver treat any string as a color, so
  the 150-name membership table is no longer consulted.

A third import site, `helpers/normalizeColor.ts::getRgba`, was already dead on
web (it tree-shook to 63 gzip of `normalizeColor` alone) and was removed in the
same pass. The brief's "exactly two web consumers" was right.

**One consequence to verify, INFERRED, not measured.** `normalizeThemeValue`
existed so that equivalent spellings of a color (`#fff`, `white`,
`rgb(255,255,255)`) collapsed to one CSS variable and so that an SSR-hydrated
value compared equal to the client-computed one. Without it, a config that
spells the same color two ways now emits two variables, and any place that
compares a hydrated theme value against a freshly computed one is comparing raw
strings. Worth a hydration test on a config with mixed color spellings before
this is considered closed. Neither of the two commits carries a test that would
catch it.

---

## 10. Sequencing

**Phase 0, this week.** Fix the docs claim. Run `zeroRuntime: 'report'` (or
just `TAMAGUI_COMPILER_STATS_FILE`, which already exists) against tamagui.dev
and against a second real app, and publish the bailout histogram. Everything
after this is scoped by that number.

**Phase 1, the CSS artifact.** Wire `outputCSS` for web through the vite plugin
and the next plugin, emit design-system + tokens + fonts + themes into it, set
`TAMAGUI_DID_OUTPUT_CSS` when and only when that file is being produced and no
runtime theme mutation is declared. Gate it off in dev. **−2,928 measured**, and
it is a hard prerequisite for the mode. Item 2 already landed and needs only the
hydration check noted in §9.

**Phase 2, provider elimination.** Make a zero-runtime root need no
`TamaguiProvider`. Theme switching becomes a class name on an ancestor.
Worth 21,119 gzip on a clean tree.

**Phase 3, the two gates.** `zeroRuntime: true` fails on any bailout; the
bundler assertion fails on any emitted `@tamagui/*` module. Ship them together,
because Gate 1 alone gives false confidence.

**Phase 4, Tier B.** Decide whether the eleven recurring runtime symbols get a
standalone package or whether v1 is Tier A only. Then islands.

Items 4, 5 and 6 are independent of all of this and improve the non-zero-runtime
path, which is the path most apps will stay on. They should not block the mode
and the mode should not block them.

---

## 11. Open questions

1. Can an island share a provider with a zero-runtime root, or does each island
   mount its own? (§7)
2. Is v1 Tier A only, or does Tier B get a standalone runtime package? (§6)
3. Does the CSS-custom-property escape (`style={{'--x': v}}` plus an atomic rule
   reading `var(--x)`) cover enough of the 115 `dynamic-style-value` bailouts to
   be worth building? I have not measured this and would not guess.
4. `TAMAGUI_DOES_SSR_CSS` already has a `'mutates-themes'` value that keeps
   `getThemeCSSRules` live. Is that the right existing switch to hang the
   "runtime theme mutation is declared" gate off, rather than adding a new one?
5. Item 4 (one style engine) is the largest non-mode win at ~3.7KB and I have no
   design for it. Does the compiled path have a coherent story where
   `getSplitStyles` never loads, or do the two emitters serve genuinely different
   call sites?

---

## Appendix: reproducing the probes

The probe fixtures were temporary files in `code/comparisons/tamagui-bench/`,
removed after measuring. To recreate, add `probe-p1.tmp.html` pointing at
`probe-p1.tmp.tsx`, plus a config that sets
`build.rollupOptions.input` to that html and uses the normal
`tamaguiPlugin({ components: ['tamagui'], config: 'src/tamagui.config.ts',
optimize: true, disableExtraction: false })`.

P1 body:

```tsx
import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

function App() {
  const arr: any[] = []
  for (let i = 0; i < 500; i++) {
    arr.push(
      <View key={i} width={20} height={20} backgroundColor="rgb(99,102,241)"
        borderRadius={3} margin={1} />
    )
  }
  return <View flexDirection="row" flexWrap="wrap">{arr}</View>
}

createRoot(document.getElementById('root')!).render(<App />)
```

P2 is P1 wrapped in `<TamaguiProvider config={config}>`. P3 replaces every
`View` with a `div` carrying the class names P1's compiler output produced.

The `TAMAGUI_DID_OUTPUT_CSS` and `normalize-css-color` probes used
`define: { 'process.env.TAMAGUI_DID_OUTPUT_CSS': '"1"' }` and
`resolve.alias['@tamagui/normalize-css-color']` pointed at a stub exporting
no-op `rgba` / `normalizeCSSColor` / `isKnownColorName` / default.

Measure with `gzip -9 -c <chunk>.js | wc -c`, which is what both the harness and
`attribute-bundle-gzip.ts` use.
