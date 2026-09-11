# v3 web: a real zero-runtime mode, and the road below v2

Branch `v3-beta`. Every number below was re-measured in this worktree; nothing
is carried over from an older record. Claims are labeled **READ** (I ran it,
receipt inline), **INFERRED** (follows from named readings), or **GUESS** (fits
the shape, unverified).

**Two axes, kept separate on purpose.** Goal A is "core must not grow from v2 to
v3": that is the +9,367 gap and the JS items in §9, and it is the question this
plan is primarily answering. Goal B is the zero-runtime mode, where the CSS
artifact becomes a real transferred cost. Theme CSS weight (§3) is worth 17KB
and belongs only to Goal B and to app authoring; it moves Goal A by zero and is
deliberately kept out of that arithmetic.

**Scope, decided by Nate and not open (§11):** the mode targets greenfield apps
written under stricter authoring rules, not migrations of existing large apps.
Coverage failures are a hard build error with a per-site list, never a
per-component fallback. Every component that needs real runtime (sheet, dialog,
select, toast, popover, slider, tooltip and the rest) is a declared async island
and is out of the mode. CSS animation driver only. Web only.

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
it. Neither shrank when the other arrived, so a compiled app carries the full
9.1KB of both. This is not two competing emitters, see §9 item 4.

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
`document.head` at `createTamagui()` time. The flag deletes them from JS and puts
them nowhere, because the vite plugin emits only per-module atomic CSS through
its virtual `.tamagui.css` modules.

### The artifact generator already exists, only vite is missing

An earlier draft of this plan said the fix was "make the compiler emit the CSS
artifact". That was wrong and the correction matters, because the real fix is
much smaller. **READ:**

- `writeTamaguiCSS` (`code/compiler/static/src/extractor/bundleConfig.ts:587`)
  calls `config.getCSS()` and writes it, gated on `props.outputCSS`. It is
  reached from `loadTamagui.ts:161`, `:192`, `:402` and `bundleConfig.ts:522`.
- Five in-repo build configs already set it: `code/tamagui.dev`,
  `code/starters/expo-router`, `code/sandbox`, `code/tests/next-site`,
  `code/tests/next-turbopack`.
- The artifacts exist and contain exactly the right thing.
  `code/sandbox/app/tamagui.generated.css` is 422,550 bytes and opens with
  `._ovs-contain`, `.is_View {display:flex;…}`, `.is_Text`, the `@scope` rule,
  then 792 `:root` blocks and 1,276 `t_light`/`t_dark` occurrences.
- Webpack/Next reach it through the shared `Static.loadTamagui`, which writes
  the file as a side effect of loading. **The vite plugin does not**: it uses its
  own loader (`createViteTamaguiLoader` → `Static.loadTamaguiBuildConfigAsync` /
  `Static.loadTamaguiFromModules`), which never calls the write path. In
  `code/compiler/vite-plugin/src/plugin.ts` the string `outputCSS` appears only
  as `outputCSS: undefined` twice (lines 482 and 484, both on the native branch)
  and once inside a comment on line 739.

**So item 1 is "wire `outputCSS` through the vite plugin's web path, then set the
flag", not "build the artifact".** The breakage evidence above still stands: with
the flag on and no artifact wired, the CSS goes nowhere.

### First, a retraction: the checked-in artifacts are stale

Two earlier rounds of this plan priced the CSS artifact off the
`tamagui.generated.css` files committed in this repo. **Those files do not match
current source and every number derived from them is withdrawn**, including a
−17,620 pruning figure that p22394 and I independently reproduced to within 60
bytes. We agreed because we ran different implementations against the same wrong
input. Agreement between two measurements of the same stale file validates
nothing, which is exactly the trap it looks like.

**READ**, the receipt: `code/starters/expo-router/tamagui.generated.css` carries
300 distinct `.t_` names. The current config
(`createTamagui(defaultConfig).getCSS()`, regenerated from source) has 128 theme
keys, and **only 10 of the 300 names on disk exist in it**. The disk names are
v5-era component sub-themes (`black_Button`, `surface1`, `surface2`, `Slider`,
`TextArea`); the current v6 suite is surface-level composition (`light_level2`,
`light_accent`, `dark_brand`, `dark_inverse_level3`). Regenerating also gives a
different size: 934,134 raw / 17,243 gzip versus 350,414 / 27,550 on disk.

So the real artifact for a default v6 config is **17,243 gzip, not 27,536**. The
CSS side of the mode was already ~10KB cheaper than either of us had it.

Everything below is regenerated from current source.

### What the artifact is made of

**READ**, `createTamagui(defaultConfig).getCSS()` decomposed with postcss,
classified per top-level rule with at-rules recursing into their children, and
reported as **marginal gzip** (`gzip(file) − gzip(file without that bucket)`)
because theme blocks are repetitive enough that raw byte share badly overstates
them:

| bucket | n | raw | raw% | marginal gzip | gz% |
| --- | ---: | ---: | ---: | ---: | ---: |
| theme | 109 | 896,783 | 96% | **11,952** | 69% |
| `:root` | 3 | 11,428 | 1% | **3,183** | 18% |
| base | 8 | 25,455 | 3% | 543 | 3% |
| atomic | 7 | 340 | 0% | 138 | 1% |

An even earlier draft said "90% theme blocks, `:root` 7%, atomic 0%" from a
regex over `{…}`. Also withdrawn: the regex required `{` immediately after the
selector, so `._ovs-contain {…}` never matched.

**The greenfield app is the one paying for this.** It does not hand-roll a
two-theme config, it does what `code/starters/expo-router/tamagui.config.ts`
does in four lines: import `defaultConfig` from `@tamagui/config/v6` and pass it
straight to `createTamagui`. **READ**: grepping all 15 of that starter's source
files for `<Theme`, `Theme name=` and `theme=` returns nothing but React
Navigation's unrelated `ThemeProvider`. It ships 128 themes and 306 color tokens
for themes it never names.

### This is app authoring, and the pattern already exists

Before the numbers, the framing, because it decides where this belongs.
**READ**: `createV6Config(colors)` takes `{ themes, colorTokens }`
(`code/core/config/src/v6-base.ts:106`), `defaultConfig` is just
`createV6Config(colors)` with the full pack (`v6.ts:30`), and passing your own
narrower pack is a **documented v6 capability** with a worked example at
`code/tamagui.dev/data/docs/core/config-v6-colors.mdx:52`.

So the 128 themes and 306 color tokens in the starter are the default config
being generous, not `@tamagui/web` growing. Nate's read, and he is right:
theme narrowing already worked in v2 and an app author opts into it. **This
contributes zero to "did core grow from v2 to v3", which is the question the
rest of this plan is about.** It is a defaults, docs and starter-template
question on a different axis.

It still matters for the mode, because there the artifact is real transferred
bytes, so the numbers live in the mode's accounting rather than in the ordering.

**READ**, each variant built in its own process to defeat config caching:

| variant | themes | colorTokens | raw | gzip | Δ |
| --- | ---: | ---: | ---: | ---: | ---: |
| `defaultConfig` | 128 | 306 | 934,134 | **17,243** | |
| themes → light + dark | 2 | 306 | 66,349 | **6,279** | −10,964 |
| themes → light/dark + surface levels | 26 | 306 | 219,456 | 8,376 | −8,867 |
| colorTokens → 24 | 128 | 24 | 165,725 | 7,796 | −9,447 |
| both slimmed | 2 | 24 | 15,542 | **2,592** | **−14,651** |

**Config authoring alone recovers −14,651 gzip, 85% of the artifact**, using an
API that already exists. Theme count and color-token count are independent
levers of similar size and they compose. The residual after both is 2,592 gzip,
base rules plus a small `:root`, which is a genuinely cheap CSS side for the
mode.

Two pieces of work fall out, neither on the core-size axis:

- **Defaults, docs and starter.** The starter template could pass an explicit
  `{ themes, colorTokens }` instead of the full pack, and the docs could put the
  size consequence next to the pattern at `config-v6-colors.mdx`. Worth up to
  −14,651 gzip to an app that opts in, needs no compiler work, and helps every
  app using `outputCSS` today. Whether the default itself should get narrower is
  a product call, not a bundle call.
- **Compiler theme reachability, only if the mode needs it.** Automatic pruning
  for an app that keeps authoring against the full suite. Its value is
  convenience rather than bytes, since config authoring already gets 85%. It
  composes with the mode: reachability is sound only if you know every theme
  name an app can reach, which is the whole-program analysis the mode already
  performs, and contract rule 4 already forbids the dynamic theme names that
  would make it undecidable.

### Why none of this contaminated the v2-vs-v3 numbers

Worth stating explicitly, since a 17KB theme finding next to an 11KB core delta
invites the question. **READ**:
`code/comparisons/tamagui-bench/src/tamagui.config.ts` and
`code/comparisons/tamagui-v2-bench/src/tamagui.config.ts` are byte-identical: a
single hand-written `light` theme with two values, every token category empty,
`media: {}`, `shorthands: {}`. Both arms hold theme CSS tiny and constant, so
the entire measurement series in §2 is core JS with theme weight held out.
Nothing measured needs redoing.

### The existing theme-slimming machinery is not connected

p22394 asked what `TAMAGUI_OPTIMIZE_THEMES` and the names-only projection
already do. **READ**, and the answer is unwelcome: `TAMAGUI_OPTIMIZE_THEMES`
appears in exactly two source files, `vite-plugin/src/plugin.ts:894` (defines it
`true` in production) and `next-plugin/src/withTamagui.ts:90` (defines it
`false`), plus their compiled dist. **Nothing reads it.** `TAMAGUI_KEEP_THEMES`
is assigned in five places and never read as a condition. `@tamagui/config` has
no theme stripping keyed on either.

**INFERRED**, and worth one confirmation pass before anyone relies on it: the
names-only projection at `createTamagui.ts:133` therefore has no producer in
this repo, so `scanAllSheets(true, tokensParsed)` only ever fires for a config a
user hand-wrote in that shape. This is the same failure as
`TAMAGUI_DID_OUTPUT_CSS`: a flag defined at the plugin edge with nothing behind
it. Two dead flags, same disease, and it suggests looking for a third.

The consequence for pruning: there is no existing mechanism to extend. The
projection machinery does the JS half (ship theme names, not values) and leaves
100% of the CSS-side unused-theme mass untouched, because it was never about
the CSS artifact in the first place.

---

## 4. What zero-runtime mode means, precisely

**Definition.** For a declared entry graph, after compilation, no module whose
resolved id contains `/tamagui/` or `/@tamagui/` appears in the client bundle.
Output is `jsx('div' | 'span' | 'input' | …, { className, …passthrough })` plus
one static CSS file. `react` and `react-dom` remain.

**Given constraints** (from Nate): CSS animation driver only. Web only.

**Audience: greenfield apps written under a stricter contract.** This is the
decision that shapes everything else. The mode is not a migration path for an
existing large app, and the 18.6% bail rate on tamagui.dev (§7) is calibration
data about legacy code rather than a work list to burn down. An app opts into
the mode and accepts authoring rules in exchange for the guarantee.

**The contract**, stated as rules a developer follows, because that is how it
has to be documented:

1. **No prop spreading onto styled components.** `{...props}` is the single
   largest recoverable bail class (142 sites on tamagui.dev) and it is
   unrecoverable in general because the compiler cannot prove the spread carries
   no style props. Under the mode it is a build error, and the developer passes
   props explicitly.
2. **No dynamic component types.** `const C = cond ? View : Text` cannot lower.
   Elements are literal.
3. **Static style values.** Every style prop evaluates at build time. A value
   that depends on runtime state uses the CSS-variable escape (§11 q3) if that
   lands, or the component becomes an island.
4. **Static themes and static config.** No runtime theme mutation, no runtime
   theme builder. Themes are a fixed build-time set; switching them is a class
   name on an ancestor.
5. **CSS animation driver only.**
6. **Components drawn from the lowerable set** (§6), with anything else declared
   as an island.
7. **No JS reads of design state.** No `useMedia()`, `useTheme()`,
   `getTokens()`, `getVariableValue()`. Media, group and pseudo state remain
   fully expressible, but only as CSS.

Rules 1, 2 and 3 want lint rules and ideally types, not just a build error at
the end. An `eslint-plugin` already exists in `code/core/eslint-plugin`, which
is the natural home.

Calibration on how strict this is: **READ**, the official `expo-router` starter
calls `useTheme()` in `app/_layout.tsx:55`, so today's starter violates rule 7.
The contract is real work for the templates, not only for users.

**Delivery shape.** Three things have to exist before the mode can be claimed:

1. **`app.css`**: design-system base rules, `:root` token variables, font rules,
   the theme `.t_*` blocks, and the compiler's atomic rules. The generator
   exists; vite needs wiring (§3). Watch its size (§3).
2. **Lowered JSX** for every call site. Already works (§1).
3. **No provider.** `TamaguiProvider` costs 21,119 gzip on a tree with zero
   un-lowered children. In the mode it must not be imported at all.

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

## 6. Which components are in the mode

**DECIDED by Nate: the mode covers the components that already lower to
`div` + class. Every component that pulls real runtime is an island and is out
of the mode.** No intermediate runtime, no scheme to bring the runtime-dependent
set in. His words on the split: "kk thats a fine tradeoff still".

The audit below is **p22394's READ** of runtime (non-type) imports from
`@tamagui/web` and `@tamagui/core` across `code/ui/*/src`. I spot-checked five
packages (`card`, `accordion`, `sheet`, `select`, `toast`) and my reading agrees
with theirs, so I am relaying it as their reading corroborated, not as my own
full audit.

**In the mode: 15 of 49 audited packages.** They import only stylable /
compile-time surface: `styled`, `View`, `Text`, `createStyledHOC`,
`createStyledContext`, `withStaticProperties`, `createRefComponent`,
`composeRefs`, `composeEventHandlers`, `isWeb`/`isIos`/`isAndroid`. These are
`accordion avatar card collapsible elements form label radio-group
react-native-web scroll-view separator shapes text toggle-group
visually-hidden`, plus the `View`/`Text`/stack primitives themselves. Each
vanishes the moment all of its call sites lower, exactly as `View` did in probe
P1. That set covers layout, text, cards, forms, lists and disclosure, which is
most of a content or marketing site: the greenfield target.

**Islands, the other 34.** `sheet` (8 runtime imports), `toast` (7), `select`
(6), `portal` (6), `slider` (5), `dialog` (4), then
`tooltip switch stacks roving-focus popper menu linear-gradient input
dismissable create-menu` at 3 each, and the remainder. Anything needing
measurement, portals, animation drivers beyond CSS, or focus management. They
keep working exactly as they do today, in a lazily-loaded chunk that carries
`@tamagui/*`, and the main bundle keeps its guarantee.

For the record, since it shaped the decision: the runtime dependencies these 34
share are a short list of eleven symbols (`useEvent`, `useThemeName`, `Theme`,
`useConfiguration`, `getVariableValue`, `useAnimationDriver` /
`useAnimatedNumber`, `useIsTouchDevice`, `useDidFinishSSR`, `Slot`,
`LayoutMeasurementController`, `createChangeEventDetails`). A standalone
mini-runtime satisfying those was the alternative to islands. It is rejected,
so nothing in this plan depends on it.

**The remaining work here is a boundary, not a rewrite.** The mode needs to know
which components are island-only, and to say so at build time with a useful
message rather than through a generic bailout. The cleanest source of truth is
the `acceptsClassName` flag the compiler already reads
(`compilerHost.ts:1091-1092`, `:1295-1299`), since that is exactly the property
that decides lowerability.

---

## 7. Proving coverage, and what happens when it fails

Two gates, because neither alone is sufficient.

**Gate 1, compiler-local.** The compiler already produces exactly the accounting
this needs. The numbers below are **calibration, not a backlog**: tamagui.dev is
a large app written years before any of these rules existed, and the mode targets
greenfield code (§4). Read them as "here is what unconstrained authoring looks
like, and here is which contract rule each bucket corresponds to".

**READ**, `code/comparisons/output/v3-site-compiler-stats.json`, whole
tamagui.dev at the v3 compiler:

```
found 2564   lowered 2086   flattened 2073   partial 13   bailed 478   flattenRate 0.809
local/unsupported-target   221
local/unsafe-style-spread  142
local/dynamic-style-value  115
linked/unresolved-binding    5
```

Homepage alone: 277 found, 225 flattened, 52 bailed. Mapping the buckets onto
the contract:

| bucket | n | contract rule | greenfield expectation |
| --- | ---: | --- | --- |
| `local/unsupported-target` | 221 | rule 6 (lowerable set) | mostly "X does not accept className": `Spinner` 26, `Input` 20, `ScrollView` 18, `Label` 17, `XGroup` 16. **INFERRED**: no compiler improvement fixes these; they are component rewrites or islands. 17 more are "Animated candidates remain on the runtime path", which rule 5 addresses. |
| `local/unsafe-style-spread` | 142 | rule 1 (no spreading) | goes to zero by construction |
| `local/dynamic-style-value` | 115 | rule 3 (static values) | goes to zero by construction, minus whatever the CSS-variable escape can recover |
| `linked/unresolved-binding` | 5 | rule 2 | goes to zero by construction |

So under the contract, 262 of the 478 disappear because the code is written
differently, and the residual problem is the 221 component-shaped bails. That
makes §6's component tiers the real work, and it is why "audit the components"
was the right instinct.

In the mode, every bailout becomes a build error carrying file, line, component
and code. The plumbing exists (`compilerStats.ts`,
`TAMAGUI_COMPILER_STATS_FILE`); the mode adds a threshold of zero.

**Gate 2, bundler-level.** After bundling, assert no emitted module id matches
`/(@)?tamagui/`. This is the only gate that actually proves the claim, because
the compiler's accounting is blind to non-JSX entry points: a stray `useTheme()`,
`getTokens()`, `getVariableValue()`, a `styled()` used as a value, an `Adapt`, or
a component imported for its type that also has a runtime export. Gate 1 without
Gate 2 will report success on a bundle that still ships 40KB of runtime.

### Failure policy: decided

**DECIDED by Nate: hard build failure listing every offending site. No
per-component fallback. The escape hatch is declared async islands.** The
reasoning is kept below because it is what the error message and the docs have
to explain.

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

## 8. What the contract costs in practice

§4 states the rules. This is what they feel like to write against, which is what
the docs have to say honestly:

- **Themes are frozen at build time.** `_mutateTheme`, the runtime theme
  builder, and the `getOrCreateMutatedVariable` path in `getThemeCSSRules` all
  need the CSS generator live. Switching themes survives, since it is a class
  name on an ancestor. Authoring or deriving a theme at runtime does not.
- **No prop spreading onto styled components.** This is the rule people will hit
  first and complain about most, because `({...props}) => <View {...props} />`
  is idiomatic React. Under the mode a wrapper component names its style props
  explicitly, or it is an island.
- **Style values are literals.** `opacity={0.5}` yes, `opacity={someExpr}` no.
  Whether the CSS-variable escape softens this is open (§11 q3).
- **No JS reads of design state.** `useMedia()`, `useTheme()`, `getTokens()`,
  `getVariableValue()`. Media, group and pseudo state stay fully expressible,
  but only as CSS. Anything that needs the current breakpoint as a JS boolean
  is out.
- **CSS animation driver only.**
- **No `asChild` / `Slot`, no `Adapt`**, no context-dependent variants, no
  `styled()` variant functions that read theme at render.
- **Sheets, dialogs, selects, toasts, tooltips, popovers, sliders and the rest
  of the interactive set are islands.** They work, they lazy-load, and their
  cost is visible as a chunk instead of a silent tax on every page.

The honest summary: this is a mode for content and marketing surfaces, app
shells, and the static 90% of a product, with the interactive 10% behind an
island boundary. It is not a mode for an app that is mostly interactive.

---

## 9. Ordered work, with numbers

Ordered by gzip per unit of risk. "Measured" means I built it and read the bytes.

| # | item | Δ gzip | confidence | risk |
| --- | --- | ---: | --- | --- |
| 1 | Wire `outputCSS` through the vite plugin's web path, then set `TAMAGUI_DID_OUTPUT_CSS` | **−2,928** | measured (READ) | low-medium: the generator and the artifact already exist and webpack/Next already get them (§3); vite is the gap. Must stay off in dev and off when themes mutate at runtime |
| 2 | ~~Move `normalize-css-color` off the web runtime~~ **LANDED** in `359e29cc83` + `5e3b31bca9` | **−2,468** | measured (READ) | done |
| 3 | Correct the docs' "~6KB" claim to the measured ~2.9KB | 0 | READ | none |
| 4 | Keep the runtime prop walker out of a fully compiled build (see below) | ~−3,667 | estimated (INFERRED from `getSplitStyles` marginal 3,667) | high: needs a design for how the compiled path drops prop-walking |
| 5 | `resolveSafeArea` + `tokenCategories` + `core::runtime` off the web hot path | ~−1,025 | marginals (READ), mechanism unverified | medium |
| 6 | Defer or drop the `Variables` feature on web | ~−1,231 | marginal (READ) | product decision, not a leak |
| 7 | **Zero-runtime mode** | up to **−44,899 JS gzip** | see below | the actual project |

**Theme CSS is deliberately not in this table.** It is a real 17KB and it is
measured in §3, but it sits on a different axis: it is app authoring against an
API that already existed in v2, and it moves the core delta by exactly zero.
Mixing it in here would make the "did v3 grow" arithmetic look better without
any of it being true. It belongs in the mode's accounting, below, where
transferred CSS bytes are a genuine cost.

Marginals in this table sum honestly. **READ**: before item 2 landed, items 1
and 2 measured individually at −2,939 and −2,277 (predicted sum −5,216) and
together at −5,168, a 1% error. And item 1 re-measured on the post-item-2
baseline gives −2,928, within 11 bytes of its pre-item-2 figure. Treat sums here
as good to about ±5%.

### Item 4, stated correctly

An earlier draft called this "two style engines ship in every compiled bundle".
That is wrong and I am withdrawing it. **READ**, `getSplitStyles.tsx`: the style
emission sites are `contributeStyleValue` (496, 888, 973, 1093) and
`flushDirectStyles` (509, 1170), all of which delegate to `directStyle`. The two
other `addStyleToInsertRules` calls (637, 646) emit container-query registration
(`container-name` / `container-type`), not styles. There is exactly one
duplicated emission site, lines 1174-1203, gated on
`!noMergeStyle && style && !shouldDoClasses && isAnimated && !driver?.isReactNative`,
i.e. inline animation drivers on web only. It calls `getCSSStyleAtomic` with an
explicit `directStyleSignature(key, value)` so its output matches `directStyle`
byte for byte, and its own comment says it exists to "reproduce the
direct-emission identity so the surviving class matches its server-rendered
counterpart exactly". That is one engine plus a 30-line mirror for one driver
mode. I found no second independent path.

The real cost claim, which is the one that argues for the mode: `getSplitStyles`
is the runtime prop walker at 3,667 gzip and it ships in full alongside
`directStyle` at 5,451. Neither shrank when the other arrived. In a fully
compiled app most of those 9.1KB are unreachable and unremovable, because
nothing in the build tells the bundler that no un-lowered call site survives.
That is the whole argument in one sentence.

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

Upper bound, because the fixture is 100% flattenable primitives, which is
exactly what a greenfield app under the contract is supposed to look like.

The CSS side is measured too, regenerated from current source (§3): **17,243
gzip** on a default v6 config, **2,592** with themes and color tokens narrowed
through the existing `createV6Config` argument. So the mode's trade is "remove
up to 44.9KB of JS, add 2.6 to 17.2KB of CSS depending on how the app authors
its config", and the CSS is a cost the app pays today anyway once it uses
`outputCSS`. The figure to publish still comes from building the Phase 0 starter
and measuring both sides on the same app.

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

**Phase 0.** Fix the docs claim. Write the greenfield starter that the mode
targets (§4's contract, in-mode components only) and measure it end to end: JS
gzip, CSS gzip, and the compiler's bailout count. This replaces "run the report
against tamagui.dev" from the earlier draft, because tamagui.dev is no longer
the target and its numbers are calibration rather than scope.

**Phase 1, the CSS artifact.** Wire `outputCSS` through the vite plugin's web
path, set `TAMAGUI_DID_OUTPUT_CSS` when and only when that file is being
produced and no runtime theme mutation is declared, gate it off in dev. Confirm
Next and metro already do the equivalent through `Static.loadTamagui`.
**−2,928 measured**, and it is a hard prerequisite for the mode. Item 2 already
landed and needs only the hydration check noted in §9.

**Phase 2, the artifact's size, on the app-authoring axis.** Not on the critical
path for core size, and not ahead of anything else here. The mode's CSS side is
17,243 gzip on a default v6 config and 2,592 with a narrowed one (§3), using an
API that already exists. Update the starter template and put the size
consequence next to the pattern in `config-v6-colors.mdx`. Revisit compiler
theme reachability only if the mode turns out to need it.

**Phase 3, provider elimination.** Make a zero-runtime root need no
`TamaguiProvider`. Theme switching becomes a class name on an ancestor.
Worth 21,119 gzip on a clean tree.

**Phase 4, the two gates and the island boundary.** `zeroRuntime: true` fails on
any bailout with a per-site list; the bundler assertion fails on any emitted
`@tamagui/*` module. Ship them together, because Gate 1 alone gives false
confidence. Alongside them, make island-only components fail with a message that
names the component and says "island", driven off `acceptsClassName` (§6).

**Phase 5, the authoring rules as lint.** Rules 1, 2 and 3 of the contract in
`code/core/eslint-plugin`, so a developer sees them while typing rather than at
build time.

Items 4, 5 and 6 in §9 are independent of all of this and improve the ordinary
compiled path, which is where every non-greenfield app stays. They should not
block the mode and the mode should not block them.

---

## 11. Settled, and still open

**Settled by Nate, do not reopen:**

- Failure policy: hard build failure with a full site list, no per-component
  fallback, islands as the escape hatch (§7).
- Audience: greenfield apps under stricter authoring rules, not tamagui.dev (§4).
- Component split: the runtime-dependent set is islands and is out of the mode.
  No intermediate mini-runtime (§6).

**Still open:**

1. **Does the mode need compiler theme reachability at all?** The size question
   is answered and it is smaller than two rounds of this plan claimed: the
   artifact is 17,243 gzip on a default v6 config, and narrowing themes and
   color tokens through the existing `createV6Config` argument gets it to 2,592
   (§3). If telling app authors to narrow their pack is enough, the compiler
   analysis is unnecessary. If it is not enough, the open part is whether
   reachability can be proven for `<Theme name=>`, the `theme=` prop, and nested
   theme composition. Note there is no existing mechanism to extend, since the
   theme-slimming flags are unwired (§3).
2. Can an island share a provider with a zero-runtime root, or does each island
   mount its own? Sharing puts the provider in the main chunk and the guarantee
   is gone. Per-island providers mean repeated config parsing and possibly
   duplicate theme class emission.
3. Does the CSS-custom-property escape (`style={{'--x': v}}` plus an atomic rule
   reading `var(--x)`) recover enough dynamic values to be worth building, or is
   contract rule 3 enough on its own? I have not measured it and would not guess.
4. `TAMAGUI_DOES_SSR_CSS` already has a `'mutates-themes'` value that keeps
   `getThemeCSSRules` live. Is that the right existing switch to hang the
   "runtime theme mutation is declared" gate off, rather than adding a new one?
5. Item 4 is the largest non-mode win at ~3.7KB and I have no design for it. Is
   there a coherent story where a fully compiled build never loads
   `getSplitStyles`, or does the prop walker serve call sites the direct emitter
   structurally cannot?
6. The hydration check on `359e29cc83` (§9). Small, but nobody owns it yet.

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
