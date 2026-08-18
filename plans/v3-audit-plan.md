# Tamagui `v3-beta`: full audit and prioritized plan

**Audited SHA:** `de0d19404fdad9b4af1ae7bc13ab7bc9cf5a8001` (`origin/v3-beta`, tip at
2026-08-18 03:21), read-only worktree, 1,465 commits ahead of `origin/main`.
**Method:** one lead plus nine parallel read-only helpers, each on a named slice.
**Nothing was edited, committed, or published.**

Claims are labeled **READ** (ran it / opened the file, evidence quoted),
**INFERRED** (follows from named things read), **GUESS** (fits the shape,
unverified), or **KNOWN-OPEN** (the team already recorded it; confirmed still
true and priced here). Ideas are labeled **IDEA** and are not findings.

---

## Executive summary

1. **v3 is in good shape and the differentiation is real.** The condition grammar
   routes state, media, group, container, theme and platform in one value and one
   pass, and does it in **1,573 fewer gzip bytes than the v2 code that bought the
   same capability**. The zero-runtime tier measured **7 gzip bytes over
   hand-written React**. `html.*` is a genuine native runtime twin, not a web tag
   alias. These are source-backed, and none of them are currently on the website.

2. **The largest launch risk is documentation, not code.** The current docs teach
   v2 camelCase theme keys (`backgroundHover`) that the v3 resolver does not
   accept, removed palette tokens (`blue10`), and `<Stack>`, which v3 does not
   export at all. A `tsc` probe returns `TS2305`, and I confirmed the absence
   independently. Meanwhile the three flagship v3 surfaces (root `html.*`, the
   compiler tier ladder, and zero-runtime mode) have **no page on the docs site
   at all**. A user's first hour with v3 currently runs on v2 instructions.

3. **Nothing in this repo can fail a build for growing in size.** Two consecutive
   campaigns optimized bytes; the CI bundle job emits a `::warning::` and exits
   zero, and even the zero-runtime starter's gate, in the mode whose whole premise
   is byte size, asserts no ceiling on the gzip numbers it computes. The golf
   campaign recovered 115 gzip across five careful changes. One unnoticed import
   can exceed that silently.

4. **The compiler bails on 19.9% of elements and its largest bail class is
   reported under a reason that is not true, but the bailouts are not a hidden
   win.** 340 of 517 say `<Component> does not accept className`, while the
   predicate behind that message is a three-term AND meaning "is flattenable".
   Fix the message (S). Do **not** chase the 340: a dedicated prober tested the
   idea and closed it. `className` forwarding is real for Button, Input, Label,
   Card and XGroup but broken for ListItem, and seven independent hazards make a
   generic middle tier unsafe, including the exact default-merge ordering hole
   that caused the block-2 bug. The `partialRuntimeSafe` exclusions are doing
   correctness work, not leaving performance on the table.

5. **The published benchmark is stale and appears to understate v3 by more than
   an order of magnitude.** The quoted 19.30ms group mount against Tailwind's 1.28
   comes from an artifact stamped at commit `398b9315`, not this tip. A fresh run
   at the audit SHA measured **v3 compiled group mount 0.70ms against Tailwind's
   0.60, and rerender 2.10 against 2.53**: parity on mount, ahead on rerender,
   with `bailed 0` and the style engine contributing 108 bytes of allocation. The
   fresh run used 3 samples on a different machine, so it is not a publishable
   number; the point is that the *published* one cannot be quoted for this SHA at
   all. Gate 4, and the blog-numbers gap audit built on it, are steering by a
   figure that may no longer describe the product.

6. **There is a second clause grammar, in Rust, and it has already drifted.** The
   LSP's `tamagui-grammar` crate carries its own parser and modifier table that
   spells modifiers `focusVisible`/`focusWithin` where the canonical
   `@tamagui/style-grammar` spells them `focus-visible`/`focus-within`, and has
   no `active` alias and no group/container registry. The editor can accept and
   complete a value the compiler classifies differently. This is the highest
   correctness risk among the DRY findings.

7. **The silent-drop bug class that block 2 just fixed is still open elsewhere.**
   The `styled()`-definition animation-prop drop came from the compiler consuming
   a prop and emitting nothing. Native `onBeforeInput`, `onInvalid` and `onSelect`
   do exactly that today: a non-blocking diagnostic is recorded, the entry is
   consumed, nothing is emitted, and the ordinary loader never surfaces the
   diagnostic. Two more of this shape are already recorded as known-open.

8. **The missing test class is differential runtime-vs-compiled equality.** The
   block-2 bug survived for years because nothing renders the same tree both ways
   and compares. This is the single highest-value test investment available and
   it has a cheap first slice.

9. **Recovery-at-the-failure-site is present in the compiler**, which the repo's
   own rules forbid. `registerRequire` replaces failed modules with a proxy and
   suppresses the warning unless a debug env var is set; the webpack plugin
   silently omits configured components that fail to resolve. These are inputs to
   the compiler, so a swallowed failure produces a quietly incomplete build.

10. **Recommended first four weeks**, in order: **re-run and republish the
    benchmark suite** (M, and it moved to the front because the current number is
    both wrong and public-facing); fix the docs that teach removed APIs (S–M,
    blocks the launch); add the size gate (S); ship the differential test's first
    slice and the parser-agreement tests (S + M); fix the bailout diagnostic and
    unify the Rust grammar (S + M). Two shipped bugs found late in the audit,
    the native motion driver and `generateThemes` under Bun, should be fixed
    whenever someone is next in those files.

---

## The plan, ranked by impact against effort

Ranked as one list across all four dimensions, because the owner has to sequence
one queue, not four. "Size" is S = under a day, M = a few days, L = a week or
more. Every row is expanded in the dimension sections below.

### Do first: high impact, small effort

| # | Item | Dim | Size |
| --- | --- | --- | ---: |
| 1 | Fix docs that teach removed v3 APIs: camelCase theme keys, `blue10`-era palette, `<Stack>`, `getSize(x, {shift})` | Cleanup | S–M |
| 2 | Add a size ceiling to `measure.mjs` (numbers already computed) and a budget to the kitchen-sink delta job | Improve | S then M |
| 3 | Rename the compiler's `acceptsClassName` to `canFlatten` and report the term that actually failed | Cleanup | S |
| 4 | Differential test, first slice: `styled()` definition vs call site vs runtime, compare `transitionDuration` | Testing | S |
| 5 | Parser-agreement tests between the canonical grammar and the runtime scanners | Testing | M |
| 6 | Rewrite the ten worst error messages; `throw new Error("‼️010")` is one of them | Improve | S |
| 7 | Fix the theme provider registry leak (`themeProviderParents` survives normal cleanup) | Improve | S |
| 8 | `Menu.Trigger` spreads caller event props over its own open/keyboard handlers | Cleanup | S |
| 9 | Wire the existing streaming SSR test into CI | Testing | S |
| 10 | Re-run and republish the benchmark suite at this SHA; stamp and check artifact commits | Improve | M |
| 11 | `generateThemes` crashes on its second call under Bun and leaks token state between runs | Cleanup | M |

### Do next: high impact, real effort

| # | Item | Dim | Size |
| --- | --- | --- | ---: |
| 12 | Make `@tamagui/style-grammar` the single owner of clause meaning; generate the Rust LSP tables from it and conformance-test them | Cleanup | M–L |
| 13 | Document the three flagship v3 surfaces: root `html.*`, the compiler tier ladder, zero-runtime mode | Feature | L |
| 14 | Native `@tamagui/config/animations-motion` returns an incomplete driver that the resolver silently rejects | Cleanup | M |
| 15 | Stop silently dropping props: native `onBeforeInput`/`onInvalid`/`onSelect`, `hidden={dynamic}`, `neverSkipProps` on native frames | Cleanup | M |
| 16 | Replace compiler evaluation recovery (`proxyWorm`, `safeResolves`) with real diagnostics | Cleanup | M |
| 17 | Full browser differential harness beyond the first slice | Testing | L |
| 18 | Native vitest resolution: quantify how much "native" coverage is actually testing web, then fix and triage | Testing | L |
| 19 | Bound the unbounded caches and give each a documented lifetime | Improve | M |
| 20 | One `loadCompilerProject` entry point shared by Vite, Next, Metro and the loader | Cleanup | M–L |
| 21 | Per-element "which tier handled this style, and why" developer receipt | Improve | M |

### Worth doing, lower urgency

| # | Item | Dim | Size |
| --- | --- | --- | ---: |
| 22 | Precompute the static half of `getCSS()` so SSR stops regenerating it per render | Improve | M |
| 23 | Key media subscriptions by touched key instead of broadcasting to every subscriber | Improve | M |
| 24 | Restore the headless-base pattern for Tabs (DECIDED 2026-08-18, see detail) | Cleanup | L |
| 25 | Collapse the internal-only `use-*` micro-packages; retire dead package shells | Cleanup | M |
| 26 | Metro diagnostics lose the source span the compiler already computed | Improve | S–M |
| 27 | Build-time performance harness for the real plugins through real bundlers | Testing | M |
| 28 | RSC-safe zero entry — VALIDATION + design proposal only (owner, 2026-08-18) | Feature | L |

---

## Dimension 1: Cleanups

### 1.1 Five implementations of the clause grammar, and they have already drifted [high] [M–L]

This is the DRY finding with the highest correctness risk, and two helpers found
halves of it independently.

**READ.** The canonical parser is `code/core/style-grammar/src/valueParser.ts:1-22,188-261`,
a single left-to-right pass. Beside it:

- `code/core/web/src/helpers/directStyle.ts:1491-1528,1552-1669`: a second full
  clause lexer (quotes, nesting, top-level colons), plus a separate
  condition/modifier parser at `:295-410`.
- `code/core/web/src/helpers/propMapper.ts:24-38,150-260`: a third top-level
  scanner.
- `code/core/web/src/hooks/useComponentState.ts:29-61`: a fourth, partial
  quote/depth/colon detector for lifecycle state.
- `code/lsp/crates/tamagui-grammar/src/value.rs:95-173`: a fifth, in Rust, with
  its own hard-coded modifier table at `vocab.rs:57-62`.

The Rust one has **already drifted**: `code/core/style-grammar/src/stateModifiers.ts:1-24`
spells the interaction modifiers `focus-visible` and `focus-within` and aliases
`active` to `press`; the Rust table has only camelCase `focusVisible`/`focusWithin`,
no `active` alias, and no equivalent of the group modifiers
(`modifierRegistry.ts:99-109`) or container modifiers (`:124-145`). The LSP uses
its own implementation directly (`code/lsp/crates/tamagui-lsp/src/features.rs:14,79,164,260,308`),
and its own crate doc says it is meant to back the language server "the way
`@tamagui/style-grammar` does" (`tamagui-grammar/src/lib.rs:1-6`).

**Why this was not caught:** the campaign audited these parsers for **bytes** and
correctly declared the seam exhausted (handoff-log section 16: the parser "is
already a single-pass charCode loop and is not a target"; `propMapper`'s parser
"is done"). Nobody audited them for **agreement**. Different axis, still open.

**Consequence.** The editor can accept, complete, and validate a value that the
compiler then classifies differently. Also `directStyle.ts:1572-1573` early-returns
on top-level `;`, `{`, `}` while `valueParser.ts:221-260` reports those as invalid
characters, an untested error-contract divergence.

**Proposed.** Make `@tamagui/style-grammar` the one owner of clause meaning.
Generate the Rust modifier registry, aliases, parameterized-modifier rules and
conformance vectors from that package, and make the Rust parser pass those
vectors; keep Rust as an editor transport, never as a second owner of meaning.
For the three JS scanners, add parser-agreement tests first (see 4.2, nearly
free, since a second implementation is its own oracle), then route them through
one shared scanner.

**Good news worth recording:** the TypeScript language service and the ESLint rule
are already on the shared grammar (`code/core/language-service/src/core.ts:1-10,168-175`,
`code/core/eslint-plugin/src/validFlatValues.ts:1-55`). Only the Rust LSP forked.

### 1.2 The compiler's biggest bailout class is reported under a false reason [high] [S]

**READ.** `code/compiler/static-tests/tests/fixtures/bailoutMetric.expected.json`
is a checked-in measurement over 253 files: 2,595 elements found, 2,078 lowered,
**517 bailed (19.9%)**. 340 of the 517 are class `component runtime contract`,
each carrying `<Component> does not accept className`. Button alone is 206,
Input 45, Label 23, ListItem 12.

The predicate behind that message (`code/compiler/static/src/compilerHost.ts:1131-1136`)
is a three-term AND:

```
acceptsClassName:
  resolved.staticConfig.acceptsClassName !== false &&
  !resolved.staticConfig.neverFlatten &&
  !resolved.staticConfig.context,
```

It means "is flattenable". The bailout at `:1336-1343` reports the AND of three
terms under the name of one of them.

**INFERRED**, from `code/core/web/src/createStyledHOC.tsx:62-68` (spreads the
wrapped component's staticConfig, then sets `neverFlatten: true`),
`code/ui/button/src/Button.tsx:48-49` (`ButtonFrame = styled(View, { context: ButtonContext })`)
and `code/core/web/src/styled.tsx:637-641`: Button's own `acceptsClassName` is
inherited **true**, and it fails on the other two terms. `className` is also not
in `buttonInternalPropNames` (`Button.tsx:193-199`), so a caller's `className`
flows through `frameProps` into `<ButtonFrame {...buttonProps} />` at `:291`.

So the diagnostic sends a reader to add className support that already exists,
and it mislabels 340 of 517 rows in the metric the campaign steers compiler work
by. Rename the field to `canFlatten` and emit the failing term. "Button is never
flattened (behavior HOC)" or "Button provides a styled context".

**The 340 are not a recoverable lever, and that question is now closed.** A
dedicated prober tested it and the answer is no; see §1.2b. The diagnostic fix
below stands on its own merits regardless.

### 1.2b The 340 bailouts are not a hidden lever: closed, with evidence [high] [no work]

Worth recording as a settled question, because the number is large and inviting
and it will tempt the next person who reads the metric.

**Q1: does `className` reach the DOM through a behavior HOC?** Probed at runtime
against built web packages after a cold build, reading raw HTML. `probe-xyz`
**is present** on Button, Input, Label, Card and XGroup, and **absent** on
ListItem. The cause is visible in source: Button builds `frameProps` from raw
`propsIn` (`code/ui/button/src/Button.tsx:193-199`), so `className` survives its
fixed deletion list; ListItem builds `frameProps` from `rest` of
`processedProps = useProps(propsIn)` (`code/ui/list-item/src/ListItem.tsx:171-186,214-222`),
so the raw `className` is dropped. **So forwarding works for most, but is not
universal, which by itself kills a blanket fix.**

**Q2: could the compiler hand a retained HOC a computed className?** Mechanically
yes, `compilerHost.ts:1721-1731,1751-1779` already builds `partialProps` and
returns edits with `flattened: false`, which is exactly that shape. **Safely, no**,
and the seven reasons are each independently sufficient: atomic specificity and
insertion order (the hazard is recorded in the code itself at `:1139-1141`, and
`cssOwnersConflict` at `:575-589` only sees call-site owners); the HOC's own styled
frame competing with the emitted class; context-provided styles written after
emission (`createStyledContext` in Card and ListItem, Button's `textContext`
provider at `Button.tsx:212-280`); runtime-selected variants, which
`partialStaticConfig` at `:1249-1256` deliberately strips before computing owners;
styled-definition defaults merged 300+ lines later at `:1827-1839`: **the exact
ordering hole that produced the block-2 bug**; behavior code rewriting props, per
ListItem above; and theme/media state read after the class was computed.

The conclusion that matters for future planning: **`partialRuntimeSafe`'s
exclusions are doing real correctness work, not leaving performance on the table.**
A bad middle tier would render successfully with the wrong color, spacing or
variant, varying with first-use CSS order, far harder to detect than a visible
bailout.

**Q3: what does one bailed component actually cost?** A controlled probe
(happy-dom, 100 forced rerenders after 10 warmups) comparing
`<Button className padding={8}>` against a host `<button>`:
Button mount 4.8399 ms vs host 0.5279 ms; median update 0.1906 ms vs 0.0007 ms.
Real per-component cost, a retained component runs `createComponent`,
`useComponentState`, `useThemeWithState`, `useMedia` and `useSplitStyles`, plus its
own behavior render and nested text. But it is an upper-bound-ish single-component
comparison in happy-dom, not a production budget, and not evidence about the group
benchmark (see §2.2).

**If anyone revisits this**, the only sound route is a descriptor that explicitly
proves per-component forwarding, enumerates frame and context style owners,
accounts for defaults and variants, and defines insertion order, evaluated on that
small proven subset only. The current descriptors do not carry that proof.

### 1.3 Props the compiler consumes and emits nowhere [high] [M]

Same shape as the bug block 2 just fixed, where a `styled()` definition's
`transition` was consumed and dropped.

**READ.** `code/compiler/static/src/domStructuralPass.ts:91-113` records a
`local/unsupported-prop-key` diagnostic for DOM event props whose table row says
`native === 'none'`. It uses `localBailout`, which does not set `blocking`
(`code/compiler/compiler-core/src/diagnostics.ts:82-88`). Native lowering then
calls `consume(entry)` for every such event (`compilerHost.ts:730-741`) and
continues with no edit; consumed entries merge into `styleEntries` at `:2095-2104`,
removing the prop from output. The affected rows are `onBeforeInput`, `onInvalid`
and `onSelect` (`code/core/dom/src/tables/events.ts:150-173`).

Zero mode cannot catch it either (`code/compiler/compiler-core/src/zero.ts:162-170` only turns *blocking* diagnostics into violations) and the ordinary webpack
loader never surfaces `extracted.plan.diagnostics` (`code/compiler/loader/src/loader.ts:102-128,190-207`).

Two more of this shape are already **KNOWN-OPEN** in the handoff log's "Named
follow-ups" and are confirmed still true: `hidden={dynamic}` on a dom tag is
consumed with nothing static to lower and silently dropped, and
`primitives.native.tsx`'s four `DOMRuntime*Frames` do not declare `neverSkipProps`,
so a native element with a runtime style program plus `onClick`/`onChange` drops
the handler on the compiled path.

**Proposed.** Enumerate every prop-consuming site and classify each as "retained
on the runtime path" or "dropped". Anything in the second class either stops being
consumed or gets a blocking diagnostic naming the prop and its replacement. A
designed lowering decline is fine; a consume-and-emit-nothing is not.

### 1.4 Recovery at the failure site, in the compiler's own inputs [high] [M]

The repo forbids this pattern by name. It is present in the layer where it does
the most damage: the compiler's inputs.

**READ.** `code/compiler/static/src/registerRequire.ts:202-232` catches every
failed `require`, returns `proxyWorm`, and suppresses the warning unless
`TAMAGUI_SHOW_FULL_BUNDLE_ERRORS` or `DEBUG` is set (`:213-228`).
`code/compiler/loader/src/TamaguiPlugin.ts:316-337` catches failed
`requireResolve` calls in `safeResolves`, silently omits the entry, and logs only
under `DEBUG`; that reduced list then feeds `componentsFullPaths` (`:340-347`) and
`isInComponentModule` (`:364-368`), so a typo in a configured component silently
changes module classification.

`code/compiler/compiler-core/src/lower.ts:297-321` also converts any exception
from `host.lowerCandidate` into `local/style-resolution-failed`. A lowerer
returning `ok: false` is a legitimate designed tier; catching arbitrary exceptions
and letting adapters ignore the diagnostic hides implementation defects as
ordinary extraction declines.

**Proposed.** Fail config and configured-component resolution with a
module-specific diagnostic. Reserve a typed decline result for expected
unsupported lowerings and let unexpected exceptions escape with their stack and
span. If some third-party modules genuinely must fail during static evaluation,
that is an explicit opt-in ignore list, not a process-wide catch that defaults to
continuing.

### 1.5 Four integrations each answer "what is a compiler project" differently [med] [M–L]

**READ.** Vite (`code/compiler/vite-plugin/src/loadTamagui.ts:151-181`, with a
third async variant at `:73-82`), Next's plugin
(`code/compiler/loader/src/TamaguiPlugin.ts:83-95,130-143`), the webpack transform
(`code/compiler/loader/src/loader.ts:84-101`) and Metro
(`code/compiler/metro-plugin/src/frontend.ts:570-588`, resolving every project
component again at `:589-610`) each load the compiler project and each repeat the
zero-mode `outputCSS: undefined` policy. Next and Metro also duplicate build-config
merge/normalization (`next-plugin/src/withTamagui.ts:40-45`,
`metro-plugin/src/index.ts:79-90`).

They already diverge on sync-vs-async loading, component resolution, and whether
`outputCSS` is removed for report versus enforce. A fifth integration would
silently get a sixth answer.

**Proposed.** One `loadCompilerProject` in static/compiler taking the resolved
target, root and options, returning evaluated config, component modules, project
generation and the zero CSS policy. Resolution stays adapter-owned (Vite's
ModuleRunner, webpack's resolver, Metro's resolver are genuinely different); only
normalization and the project contract move.

### 1.6 Component-layer drift and duplication [mixed]

From the `code/ui` sweep. The helper deep-read `create-menu`, `menu`,
`context-menu`, `select`, `popover`, `popper`, `tooltip`, `dialog`, `alert-dialog`,
`focus-scope`, `dismissable`, `portal`, `remove-scroll`, `checkbox`, `switch`,
`radio-group`, `tabs`, `tabs-headless`, `field`, `input`, `form` and `sheet`; the
rest of `code/ui` got a structural survey only. Coverage stated so the gap is
visible.

- **`Menu.Trigger` overwrites its own handlers [high] [S] READ.** The public prop
  is spelled `onKeydown` (`code/ui/menu/src/createNonNativeMenu.tsx:120-122`) while
  `ViewProps` supplies `onKeyDown`. The component destructures only `onKeydown`
  (`:285-292`), installs its composed press and `onKeyDown` handlers (`:344-391`),
  then spreads `...triggerProps` **after** them (`:393`). A caller's `onKeyDown`,
  `onPointerDown`, `onClick` or `onPress` replaces the internal handler, so a
  caller can silently disable Enter/Space/ArrowDown opening on the component most
  users open menus with. Fix the spelling, destructure the event props, spread
  user props before the composed handlers.
- **`ContextMenu` accepts controlled `open` and ignores it [high] [M] INFERRED.**
  `ContextMenuComp` creates unconditional local state
  (`code/ui/context-menu/src/createNonNativeContextMenu.tsx:105-108`), publishes
  that to the provider (`:120-127`), and separately spreads the original `open`
  prop into the inner `<Menu>` via `rest` (`:135`). Provider and inner menu can
  disagree. `ContextMenuSub` uses the correct controllable pattern at `:485-501`,
  so the right shape is already in the same file.
- **`tabs` and `tabs-headless` are two complete controllers [med] [L] READ.**
  `code/ui/tabs/src/Tabs.tsx` owns state, trigger keyboard/press/focus (`:224-291`)
  and delegates focus to `RovingFocusGroup`; `code/ui/tabs-headless/src/useTabs.tsx`
  independently owns state (`:103-121`), its own tab registry and focus traversal
  (`:123-208`) and its own ARIA contract (`:211-257`) using an `HTMLElement` map
  rather than roving focus. A bounded search across `code/ui`, `code/demos/src`
  and `code/kitchen-sink-shared/src` found no consumer of the headless package
  outside its own source. Pick one owner; the external-consumer question makes
  removal a release decision.

  **DECIDED 2026-08-18 by the owner — this is no longer an open "pick one".**
  Headless packages are the intended BASE LAYER and skinned components consume
  them, which `switch`, `checkbox` and `radio-group` already do (READ: each
  package.json depends on its `-headless` sibling). Tabs is the drift, not the
  design: `code/ui/tabs` has no `tabs-headless` dependency and reimplements the
  controller.

  The fix RESTORES the pattern rather than removing headless. Extract the
  SKINNED Tabs controller logic — the battle-tested one, covered by kitchen-sink
  — into `@tamagui/tabs-headless`, replacing that package's divergent orphan
  implementation, then rebuild `Tabs.tsx` to consume it. Current Tabs behavior
  is the behavioral reference: existing tabs tests must pass UNCHANGED, and add
  coverage proving the headless hook is actually the layer under the skin,
  mirroring how `useSwitch`/`useCheckbox` are consumed.

  Note the direction carefully — the orphan implementation is the one that goes,
  and the code that survives is the one already proven in the skin. Doing it the
  other way round would ship the untested controller.
- **Native `useSwitch` drops behavior [med] [M] READ.**
  `code/ui/switch-headless/src/useSwitch.tsx:84-93` returns only a toggling
  `onPress`, the ref and a null bubble input on native, while the web branch
  (`:110-151`) supplies `role: 'switch'`, `aria-checked`, `aria-labelledby`, a
  disabled guard, and composes the caller's `onPress`. So a native Switch loses
  the caller's `onPress` and its a11y state. `checkbox-headless`
  (`useCheckbox.tsx:103-117`) does not drop them, which shows the intended shape.
- **Native `Portal` ignores `open`, `hidden` and `style`**, which the web
  implementation applies [med] [M] READ.
- **`Dismissable` ships an unconditional debug logger** [low] [S] READ.
- Lower-value: headless label prop spelling drift, checked-state helpers copied
  across menu and control packages.

### 1.7 Two real bugs found in the core package sweep [high] [M each]

Both were verified rather than reasoned about, and both are in published public
surface.

**Native motion exports a structurally incomplete `AnimationDriver` [high] [M] READ.**
`code/core/animations-motion/src/index.native.ts:8-27` declares `createAnimations`
as returning `AnimationDriver<A>` but returns only `isReactNative`, `animations`,
`View` and `Text`. The contract (`code/core/web/src/types.tsx:3453-3477`) requires
`useAnimations`, `usePresence`, `ResetPresence`, `useAnimatedNumber`,
`useAnimatedNumberStyle`, `useAnimatedNumbersStyle` and `useAnimatedNumberReaction`.
The `.d.ts` repeats the false complete type (`types/index.native.d.ts:1-2`).

Consequence: `resolveAnimationDriver.ts:7-22` rejects the object because
`useAnimations` is absent and returns `null`, while `createTamagui.ts:245-261`
still stores the original incomplete object when it is the configured driver, and
`createComponent.tsx:500-520` can then select that raw object for an `animatedBy`
entry. This is reachable from public config: `@tamagui/config/animations-motion`
points at this entry (`code/core/config/package.json:110-117`,
`code/core/config/src/animations-motion.ts:1-3`).

The file itself says motion is web-only and recommends the native or reanimated
drivers (`index.native.ts:1-2`), so the intent is clearly "unsupported on native".
The fix is to make that explicit (one complete stub with `isStub: true`, or a deliberately typed unsupported factory) so the resolver and component selection
see the same explicit thing instead of a structurally incomplete driver. A lying
type is worse than an honest failure.

**`generateThemes` cannot be called twice under Bun [high] [M] READ, with a probe.**
`code/core/generate-themes/src/generate-themes.ts:32-34` calls
`purgeCache(inputFilePath)` on every invocation after the first, and `purgeCache`
reads `module.constructor` at `:192-205`, which Bun does not have, as the code's
own comment at `:193` acknowledges. **The helper ran a two-call Bun probe against
two temporary theme modules; the second call failed with
`ReferenceError: module is not defined` at `generate-themes.ts:192` before
producing output.**

Separately and independently, `dedupedTokens` is module-global (`:59-62`), appended
to (`:74-81`) and never cleared, so repairing the cache guard alone would leave the
second run mixing the first run's token values into the emitted `colors` array
(`:123-132`). Fix both, or the fix produces a subtler bug than the crash it
replaces. One two-invocation test with distinct color values covers it.

**Caveat the probe establishes and does not exceed:** this was observed under Bun,
and the source has a Bun-specific branch. Node behavior may differ, so validate in
both runtimes the CLI supports.

### 1.8 Public API surface incoherence [med] [M]

- **Two packages export incompatible `useEvent` under the same name.**
  `code/core/use-event/src/useEvent.ts:5-7` is `useEvent(callback?)` returning a
  stable callback, re-exported from `@tamagui/core` and `tamagui`
  (`code/core/web/src/index.ts:123-124`). The vendored internals package exports
  `useEvent(event, options?)` returning an event-target listener handle
  (`code/core/react-native-web-internals/src/modules/useEvent/index.tsx:20-35`,
  published from its root at `src/index.tsx:49-53`). Same name, incompatible
  arguments and return, both public. Rename the vendored one to `useEventHandle` or
  stop re-exporting it from the public barrel.
- **Token resolution has two public contracts and neither is canonical at the root.**
  `code/core/get-token/src/index.ts:8-27` exposes `getSize`/`getSpace`/`getRadius`
  through a policy-aware resolver returning a `Variable`;
  `code/core/web/src/config.ts:133-147` exposes generic
  `getToken`/`getTokenObject`/`getTokenValue` doing exact-key lookup with no size
  policy. `@tamagui/get-token` is public with 11 source importers, yet
  `code/ui/tamagui/src/index.ts:269-275` exports only the generic family. The names
  do not reveal the split. Define one canonical API with explicit return mode and
  policy behavior, alias the rest, and re-export the supported surface from the
  root. Preserve the distinction in the signature rather than silently changing
  return values, the two APIs genuinely serve different consumers today.
- **16 independently published hook micro-packages, 6 unreachable from any barrel.**
  All 16 `@tamagui/use-*` / `@tamagui/react-native-use-*` packages carry their own
  `main`/`module`/`types`/`exports`/`build` surface. An `export * from` search across
  `code/core` and `code/ui` found aggregate exports for 10; `use-callback-ref`,
  `use-constant`, `use-direction`, `use-escape-keydown`, `use-keyboard-visible` and
  `use-previous` have none. Every internal hook move is therefore a package-graph and
  release change. Decide which are supported external APIs, fold the rest into one
  internal hooks surface, and start with `use-keyboard-visible`, which has no source
  caller at all.

The recurring caveat on all three, and on §1.9: **this repo cannot see npm
consumers.** An in-repo import search proves nothing about external usage, so every
package removal is a release decision with a deprecation window, not a cleanup.

### 1.9 Dead and near-dead surface in core [low–med] [S–M]

**READ**, each verified with a whole-`code/` import search:

- `@tamagui/calc`: `src/index.ts:9` says "unused code - not exported" while
  `:17-71` exports `calc`. No import anywhere under `code/`.
- `@tamagui/use-keyboard-visible`: no source caller. `code/ui/sheet/package.json:61`
  and `sheet/tsconfig.json:30` keep a dependency and project reference, but Sheet
  uses its own `useKeyboardControllerSheet.ts:30-142`.
- `@tamagui/config-base` and `@tamagui/theme-base`: full published package shells
  whose entire entry is an unconditional deprecation throw, with build scripts and
  root exports intact.
- `debug="break"` is in the public `DebugProp` union (`code/core/web/src/types.tsx:569`)
  and its only branch is empty (`createComponent.tsx:2166-2168`). The option
  advertises behavior the runtime does not provide.
- A commented-out early-return benchmark probe sits in the hot style splitter
  (`getSplitStyles.tsx:276-293`), with a comment instructing future readers to
  mutate production code for profiling.
- `isPlainObject` is copied verbatim in three web helpers
  (`mergeVariants.ts:5-11`, `createStyledContext.tsx:66-72`, `getSplitStyles.tsx:100-106`).

Each is individually small. Removing published packages is a release decision, not
a cleanup, because this repo cannot see npm consumers, that caveat applies to
`calc`, `use-keyboard-visible`, `config-base` and `theme-base`. Removing the dead
Sheet dependency edge and the dead `debug="break"` branch is not.

**DECIDED 2026-08-18 by the owner — the removal hold is LIFTED.** Remove
`@tamagui/calc`, `@tamagui/use-keyboard-visible`, `@tamagui/config-base` and
`@tamagui/theme-base` from the repo and from the workspace/build graph, and delete
the dead dependency edges (Sheet's `use-keyboard-visible` dep and the tsconfig
ref). The reasoning that lifts the caveat: v3 is a MAJOR release boundary, so
package removal is in policy, and the npm-side effect only lands at release time,
which stays owner-gated exactly as it always has. Removing them here does not
publish anything.

**`useEvent` collision — resolution, and it is narrower than "fix the collision".**
READ, verified by the coordinator: the vendored `rnw-internals`
`useEvent(event, options)` is consumed ONLY by `useHover`, inside the same
package, through a relative import. So stop exporting it from
`@tamagui/react-native-web-internals`' root barrel, or rename it to
`useEventHandle` there. **`@tamagui/use-event` and the core re-export stay
untouched** — they are not the problem and changing them would be the expensive
way to fix a barrel export.

**`getToken` vs `getSize` is NOT a removal.** It stays the consolidation item the
plan already describes: one canonical API, alias the rest, re-export the supported
surface from the root.

**Item 28 REFRAMED 2026-08-18 by the owner — the last hold is lifted, but the
green light is for VALIDATION, not implementation.**

Preconditions, per the owner and confirmed against the repo:
- **Providerless root already SHIPPED** in block 2 Phase 4 (handoff section 19):
  zero roots are ordinary markup, `TamaguiProvider` is illegal in a zero graph,
  and `TamaguiRoot` exists with `TamaguiProvider` wrapping it — that layering is
  the back-compat the owner wants KEPT for full-runtime users.
- **One-global-config is designed but NOT implemented**
  (`plans/v3-single-config-loading.md` is design-only).

The lane answers three questions and writes a design proposal, nothing more:
1. Are the zero entry's modules importable from React Server Components as-is —
   no client-only imports, no module-scope hook machinery? **PROBE this, do not
   reason it.** The audit records that server output is currently a placeholder,
   so a reading-based answer here is worth nothing.
2. Is implementing the single-config design a HARD PREREQUISITE for RSC, or
   independent of it?
3. What exactly is the client boundary — islands stay client, what else?

**Deliverable: a design proposal with probe receipts, routed to the coordinator
for the owner BEFORE any implementation. This is a design-proposal boundary, so
no code beyond probes.** `TamaguiProvider` back-compat is a hard constraint of
any proposal. Scheduled in wave C alongside item 24.

---

## Dimension 2: Improvements

Note on scope: the completed core-golf campaign measured the byte seams and
declined specific items (the `directAtomic` identity cache, the 436-gzip
object-vs-string unification, `createComponent`, `getSplitStyles`,
`use-element-layout`, `propMapper`'s tables). **Nothing below re-proposes any of
them.** Three of five directStyle groups are already smaller than the V2 code
that bought the same capability; that seam is genuinely done. The improvements
worth having are elsewhere.

### 2.1 Nothing can fail a build for growing in size [high] [S then M]

**READ.** `.github/scripts/compare-webpack-stats.mjs:31-34`, the entire response
to a gzip increase is `console.log('::warning::Bundle gzip total increased by ...')`.
The file's only `process.exit(1)` is `usage()` at `:41`, for a malformed CLI
invocation. `.github/workflows/checks.yaml:395-430` builds base and head, writes
`v3-bundle-delta.md`, appends it to the step summary, uploads an artifact, and
compares nothing against a budget.

Even the zero-runtime starter does not gate on bytes:
`code/starters/zero-runtime/scripts/measure.mjs:192-202` throws on
`!tier.built || tier.forbiddenModules > 0 || tier.compilerViolations > 0`. It
computes `jsGzip` and `cssGzip` into `receipts.json` (`:177-182`) and asserts no
ceiling on either, in the mode whose entire premise is byte size.

**Absence check:** `grep -rn "gzip|maxSize|sizeLimit" .github/workflows/*.yaml`
returns nothing. A positive would have been a step comparing a number to a stored
threshold and failing.

The July state-of-the-release doc already flagged this ("bundle-size budgets were
specified but never enforced"). It is still true a month and a full golf campaign
later. The campaign recovered 115 gzip across five careful changes; one unnoticed
import can exceed that with nothing turning red.

**Proposed.** (S) `measure.mjs` already has the numbers, add a committed baseline
and a comparison. (M) give the kitchen-sink delta job a committed baseline file
and a fail threshold. Use a committed baseline a PR updates deliberately, so
legitimate growth is a reviewed diff rather than a false failure or a silent
drift.

### 2.2 The published benchmark artifact is stale, and it understates v3 badly [high] [M]

**This section replaces the conclusion I started the audit with, because a probe
disproved it.** Recording the correction rather than the original reasoning,
since the correction is the useful part.

The widely-quoted table (`docs/v3-beta-state-of-the-release.md:308-333`) shows v3
compiled group mount at **19.30 ms** against Tailwind's 1.28, a 15x gap, named
"Gate 4" and deliberately deprioritized. It is the single number that undercuts
v3's performance story.

**READ: that artifact is not from this branch tip.** `code/comparisons/output/benchmarks.html:26-33`
carries the 19.3 ms `Group hover` figure, and its own metadata identifies commit
`398b93155b08c96d8b080953fe8efebe5734e2db`. The audit SHA is `de0d194...`.
`plans/v3-beta-campaign-plan.md:228-232` establishes Gate 4 as a benchmark gate; it
does not make that artifact a receipt for the current tree.

**READ: a fresh production run at the audit SHA** (Chromium 145, Apple M3 Max, 200
items, 3 retained samples, 2 warmups):

```
Tamagui v3 compiled: mount mean 0.7000 ms, rerender mean 2.1000 ms
Tailwind:            mount mean 0.6000 ms, rerender mean 2.5333 ms
Inline:              mount mean 1.3667 ms, rerender mean 3.3667 ms
```

That is roughly **parity with Tailwind on group mount and ahead of it on group
rerender**, against a published 15x deficit.

**READ:** the same run logged `[tamagui] compiler stats: 1 modules with candidates
… found 14 · lowered 14 (flattened 11, partial 3, styled 0) · bailed 0`, and the
hot-path profile attributes the workload's allocation to `react-dom` (316,661
bytes/iteration) and the bench source itself, with `createComponent.mjs` at **108
bytes**. The group workload is fully lowered host elements. Bailouts do not explain
the old number, and neither does the style engine.

**What I am NOT claiming.** That v3 now beats Tailwind. The two runs differ in
commit, machine (M3 Max vs the M2 in the old table), browser build inputs, and
sample count (3 versus 10). Those differences make the absolute milliseconds soft,
and the handoff log's own rule applies: numbers measured by a different method
cannot be compared to the record. What is solid is narrower and still decisive:
**the checked-in artifact is many commits stale and cannot be quoted for this
SHA**, and a fresh run of the same harness produces a completely different picture.

**Why this matters more than a stale file usually would.** This number is load
bearing in three places: it is the justification for Gate 4 existing, it is what a
launch post would have to concede, and `code/comparisons/V3_BLOG_NUMBERS_GAP_AUDIT.md`
is built around it. The team is currently steering by, and preparing to publish, a
figure that appears to understate its own product by more than an order of
magnitude.

**Proposed [M, and it should jump the queue].** Re-run the full suite at this SHA
with the original method (10 retained samples, shuffled ordering, one machine, the recorded seed) and republish `benchmarks.json`/`benchmarks.html` with the commit
stamped. Then decide whether Gate 4 still describes a real problem. Add a staleness
guard so a published benchmark artifact whose commit is not the current tip cannot
be quoted as current; the metadata is already in the file, nothing reads it.

**Still open after that.** The native side is genuinely thin and unaffected by this
correction: 2 of 6 scenarios measured, no v2 column, and `code/comparisons/output/benchmarks-native-v2-v3.md:5-14`
states its own compiled-v3 cells are invalid. `V3_BETA_MEASUREMENT_STATE.md:103-109`
shows native runtime simple mount at v3 27.49 ms vs v2 23.98 ms (paired CI +2.36 to
+4.65 ms). That gap is real, unattributed, and is where the measurement effort
should go once web is republished.

### 2.3 A theme provider registry entry outlives its provider [high] [S]

**READ.** `code/core/web/src/hooks/useThemeState.ts:135-144` writes every cascading
provider ID into `themeProviderParents` and writes or deletes its inline layer.
The normal subscription cleanup at `:235-243` deletes listeners, `localStates`,
`states` and pending updates, but not `themeProviderParents` or
`inlineThemeLayers`. `cleanupThemeState` at `:315-324` deletes those two **only
when `r.unsubscribe` is already absent**, which is the opposite of the ordinary
subscribed-provider path.

Each mounted provider normally gets a distinct `useId` (`:127-130`), so a provider
that mounts and unmounts repeatedly leaves IDs and parent IDs reachable from a
process-wide Map, and inline layers can retain the value object. The asymmetry
between the two cleanup branches is directly visible in the source; the retained
heap size is **INFERRED** until a mount/unmount probe measures it.

**Proposed.** Delete both maps' entries on the provider cleanup path after
unsubscribing. Probe with repeated mount/unmount of a dynamic `<Theme>`, exercising
portals and Strict Mode, since portal bridging may read an entry during a
transition.

### 2.4 Caches with no bound and no documented lifetime [high] [M]

**READ.** `useThemeState.ts:69-73` creates a process-wide `themeNameCache` that
clears only on `cacheVersion` change (`:635-638`) and inserts every distinct key
(`:643-650`). `code/core/web/src/helpers/registerCSSVariable.ts:40-56` stores every
distinct token or literal in `tokensValueToVariable` and `autoVariables`, with a
second unbounded Map and array for runtime-mutated values (`:59-75`).
`code/core/web/src/helpers/nativeStyleEngine.ts:69-90,94-109` stores every mapping
key and state name, invalidating only when the engine identity changes (`:112-115`).

This is a specific gap, not a general complaint: the sibling caches in
`code/core/web/src/helpers/variables.ts` **do** clear at 10,000 entries
(`:313,419-424,612,669-673,677,835-840`). The bounded pattern already exists in
the same layer.

Theme builders, live previews, per-tenant values and generated state names turn
user-input cardinality into retained memory over an app's lifetime.

**Proposed.** Give each cache an owner and a lifetime (config-lifetime,
app-lifetime, session-lifetime) and bound the three above with the limit the
variable caches already use. **Caveat that changes the design:** blind LRU
eviction is wrong here, because a CSS variable can still be referenced by emitted
CSS after the component that requested it is gone. It needs a generation or
session boundary, not a size cap alone.

### 2.5 SSR pays to regenerate configuration-static CSS on every render [med] [M]

**READ.** `code/core/web/src/views/TamaguiProvider.tsx:86-98` embeds
`config.getCSS()` in every web provider render. The full path
(`code/core/web/src/helpers/createDesignSystem.ts:184-197`) joins all rules, joins
`themeConfig.getThemeRulesSets()`, and maps every auto variable; the design-system
string is rebuilt at `:211-227`; and `createTamagui.ts:202-223` defines
`getThemeRulesSets()` as a fresh `createThemeCSS(dedupedThemes, configIn)` call.

Most of that is configuration-static for a given config. Only the runtime rule
list changes as components are discovered. This is a per-request and first-paint
cost, distinct from the steady-state style resolution the golf campaign measured.

**Proposed.** Precompute the static design-system, theme rule sets and initial
auto-variable CSS at `createTamagui` time; make `getCSS()` append only newly
accumulated runtime rules, preserving `sinceLastCall` and `exclude` semantics.
Cache key must include the CSS separator and exclusion mode, and late variable
registration or theme-builder updates must invalidate the static fragment.
Benchmark 1, 10 and 100 requests against one config and assert output equality.

### 2.6 A media change wakes every media subscriber [high] [M]

**READ.** `code/core/web/src/hooks/useMedia.tsx:92-96` keeps every media subscriber
in one Set and `updateMediaListeners` calls every callback; each callback then
loops only its own touched keys (`:257-284`) and may force a React update
(`:342-356`). So one breakpoint change costs O(all media subscribers) even when
almost none use the changed key. `code/core/web/src/_withStableStyle.tsx:22-28`
calls `useMedia()` with no component UID, so it takes the global path.

By contrast a theme update is already selective (`useThemeState.ts:586-607` walks the descendant listener graph) which shows the intended shape exists in the
neighbouring subsystem.

**Proposed.** Index subscriptions by touched media key and publish only to the
buckets whose key value actually changed, keeping one bucket for subscribers that
observe the whole media object. Handle HMR and `configureMedia` replacing keys so
no stale buckets survive.

**Honest limit:** the fan-out *shape* is READ from the source; exact render counts
are not measured. Ship a render-count fixture (one theme change, one media key,
one group state, one hover) alongside the fix, counting callbacks and committed
renders separately, because the native fast path can commit without React
(`useMedia.tsx:351-355`, `useThemeState.ts:215-223`).

### 2.7 Developer experience: messages, tiers, and types

**The ten worst user-facing messages [med] [S] READ.** Ranked by how little context
and recovery they give:

1. `code/core/web/src/views/Theme.tsx:214` throws `new Error("‼️010")`. An
   internal code and nothing else: no theme name, no component, no recovery.
2. `code/core/web/src/config.ts:102-105`: production emits `Err0` for a missing
   config. Development has a useful explanation, so production users and crash
   reports lose the duplicate-config diagnosis exactly where it is hardest to get.
3. `useThemeState.ts:626-630`: production emits `❌004` when `name` and `reset` are
   both passed, omitting both prop names and the valid alternatives.
4. `useMedia.tsx:69-73` throws `new Error('⚠️ No match')`, with no media key, no
   query, and no platform, so a malformed query and a missing implementation look
   identical.
5. `insertStyleRule.tsx:378-387`: logs `Error inserting style rule` plus the rules
   array, without the identifier, selector or stylesheet target.
6. and 7. `code/ui/sheet/src/SheetImplementationCustom.tsx:1296-1302,1314-1317`:
   `Invalid snapPoint ...` without the received value or accepted examples.
8. `code/ui/portal/src/GorhomPortalItem.tsx:11-14`: `No hostName`, without saying
   to add `hostName` or set `passThrough`.
9. `code/core/web/src/helpers/matchMedia.native.ts:7-10`: the matchMedia warning
   omits the affected keys and the required `setupMatchMedia` call.
10. `useComponentState.ts:263-265`: a debug warning that can dump a large
   serialized object, with no component name and no action.

Route them through one formatter: keep the machine-readable code stable, add
component/prop names and the received value where safe, and one recovery action.
The production-versus-development split in items 2 and 3 is the pattern worth
fixing generally: production is where the user has the least context and
currently gets the least text.

**No way to ask "which tier handled this style, and why" [med] [M].** **READ.**
The runtime can already log props, static config, style state, theme and rules
under `debug="verbose"` (`getSplitStyles.tsx:454-468`) and can attach token
provenance to the winning style (`:1260-1274`, `helpers/styleProvenance.ts:1-16`).
The compiler already returns a code, message, source span and component
(`compilerHost.ts:2962-2983`). Neither side tells a user whether a given style was
compiled, lowered, resolved at runtime, or dropped. The information exists at both
ends and is thrown away in between, which is what makes this cheap. Expose a
development-only per-element receipt through the existing debug channel.

**The clause grammar is `string` to the type system [high] [M, bounded].** **READ.**
`code/core/web/src/types.tsx:2033-2065`, `FlatClausePrefix` covers only the first
modifier prefix and `FlatStyleValue<T>` includes `(string & {})`. So
`opacity="1 enter:0 exit:0"` gets no checking of base value, modifier names,
payloads, ordering or repeats; `enetr:` is not an error.

**This is a measured constraint, not an oversight, and any proposal must respect
it.** Campaign decision 8 priced the modifier half against the real prop graph in
two isolated worktrees: every arm produced TS2590 at `createStyledHOC`, state-only
14 members (6.27x slower check), media+platform 21, and state+media+platform 35.
The smallest arm is already unrepresentable, so there is no narrower type-level
retreat. The base half shipped (`bg` gained `ColorTokens`).

**Therefore the only viable path is the language service**, which already owns
this by decision. The gap is that the service's grammar diagnostics are not what a
user experiences by default in an ordinary editor setup. Fix the delivery, not the
types.

### 2.8 Two measurement gaps that block claims [KNOWN-OPEN] [M each]

- **Native hot paths have no attribution.** `code/comparisons/V3_BETA_MEASUREMENT_STATE.md:103-109`
  shows native runtime simple mount at v3 27.49ms vs v2 23.98ms (paired CI +2.36
  to +4.65ms), and `output/benchmarks-native-v2-v3.md:18-29` shows a runtime gap
  across simple, themed, rich and group, with the file itself stating the
  compiled v3 cells are invalid (`:5-14`). The source points at several candidate
  layers (`createComponent.tsx:361-375,496,814-827,1596-1629`) with no attribution
  between them. Any native optimization before a split profile is speculation.
- **Compiler build time is unmeasured end to end.** `code/comparisons/V3_BLOG_NUMBERS_GAP_AUDIT.md:100-107`
  records that no harness measures cold and warm compiler wall-clock across the
  shared corpus, and that this blocks compiler-speed claims. The analyzer spike's
  synthetic graph timings are a lower-level control, not user build times.

---

## Dimension 3: Features, competitive position, and wins not being claimed

Competitors were read from source at pinned snapshots: react-strict-dom `c877f5c`,
NativeWind `f941c0d`, Unistyles `e116373`, StyleX `65974e2`. Every Tamagui cell was
verified against v3 source rather than docs or memory.

### 3.1 The documentation gap is the launch risk, not the code [high] [L]

The three surfaces v3 is most differentiated on have **no page on the docs site**.

- **Root `html.*`** is exported from the regular barrel
  (`code/core/web/src/index.ts:109-118`), constructed at
  `code/core/web/src/dom/html.tsx:929-970`, and called "the recommended DOM
  frontend" in `code/ui/tamagui/src/index.ts:279-281`; the standalone DOM surface
  is marked deprecated and points at it
  (`code/core/web/src/dom/standalone.ts:28-31,38-41,48-51,66-69,95-98`). A scoped
  search over `code/tamagui.dev/data/docs/**/*.mdx`, every README, `code/starters`
  and `code/demos` found no user-facing `import { html } from 'tamagui'`, no
  `html.div`, no `@tamagui/dom` guidance. The only HTML page is
  `components/html-elements/2.0.0.mdx:9-25`, documenting the older named
  `Section`/`Article`/`Main` wrappers from `@tamagui/elements`.
- **The compiler tier ladder**: ordinary compiled, compiled global CSS, strict
  zero-runtime (`plans/v3-zero-runtime-mode.md:613-625`), has no page. The only
  user-facing zero-runtime material is `code/starters/zero-runtime/README.md`,
  which is a starter contract and measurement note, not documentation.
- **The frontend concept that replaced `styleMode`** is unexplained. (`styleMode`
  itself is gone: the only two references in `code/` are test comments saying so,
  `code/core/tailwind/src/__tests__/frontend.web.test.tsx:18` and
  `utilities.web.test.tsx:8`.)

Meanwhile the docs that *do* exist teach v2. See §1 of the plan table and the
docs-drift detail: camelCase theme keys the v3 resolver does not accept
(`intro/themes.mdx:153-210,342-387`, `core/configuration.mdx:545-560`,
`core/theme.mdx:139-141` versus `code/core/themes/src/generated.ts:14-30`, which
declares only kebab-case `background-hover`, `color-hover`, `placeholder-color`);
removed v5 palette names like `blue10`/`gray10` in ordinary v3 examples; `<Stack>`
in runnable code blocks when v3 exports no `Stack` at all, a `tsc` probe returns
`TS2305`, which **I confirmed independently**: no `Stack` export exists in
`code/core/web/src/index.ts`, `code/core/core/src/index.tsx`,
`code/ui/tamagui/src/index.ts`, or `code/ui/stacks/src/Stacks.tsx` (which exports
only `YStack`, `XStack`, `ZStack`). Also `getSize`/`getSpace` documented with a
second `{ shift }` argument the v3 functions do not accept (cold `tsc` probe:
`TS2554`), and `Checkbox.Indicator disablePassStyles` / `scaleSize` documented
with no source occurrence.

The migration draft is wrong in a way that matters: it says `exitStyle` remains
valid on web and `enterStyle` can be converted. **v3 implements neither prop.**
The v3 spelling is a flat `enter:`/`exit:` clause, and the campaign already burned
a cycle on exactly this confusion. The draft also omits the `<Variables>` removal
entirely, and the codemod has no Variables conversion.

### 3.2 What v3 does better and is not saying [high] [S to write]

Each of these is backed by repo evidence, which is the bar for putting it in a
blog post. Listed with the claim as a launch post would make it.

1. **"One value grammar routes state, media, group, container, theme and platform
   conditions through one precedence model."** One left-to-right pass
   (`style-grammar/src/valueParser.ts:1-22,188-261`), all condition kinds in one
   pass of `directStyle.ts:295-418`. This is the broadest condition model in the
   competitive set.
2. **"v3 does more condition routing in 1,573 fewer gzip bytes than v2."** Same
   fixtures, same gzip level, same span-subtraction method on both sides: v3
   1,123 vs v2 2,696 (`plans/v3-handoff-log.md:1984-1999`). Must be stated as this
   group, not as "the v3 bundle is smaller than v2".
3. **"The compiler has tiers, not an all-or-nothing extraction switch."** The plan
   tracks found / lowered / flattened / styled / bailed
   (`compiler-core/src/lower.ts:20-26`); dynamic props can stay as narrow host
   properties (`compilerHost.ts:1319-1333,1412-1419`); output can be class plus
   inline style (`:2860-2908`).
4. **"A conforming zero-runtime web entry measured 7 gzip bytes over hand-written
   React."** (`plans/v3-zero-runtime-mode.md:79-91`.) Scope it to the zero
   contract; do not generalize to full-runtime Tamagui.
5. **"`html.*` is a native runtime twin, not a web tag alias."** The native runtime
   maps DOM props, wraps literal text, and reads the same generated tables the
   compiler reads (`dom/htmlRuntime.native.tsx:7-24,56-75,193-205`,
   `code/core/dom/src/tables/nativeBacking.ts:1-21,75-104`).
6. **"The same semantic `html.*` source lowers to web tags or native primitives."**
   One structural pass validates both targets (`domStructuralPass.ts:19-24,30-84`).
   Do not claim identical behavior for every tag, the tables deliberately reject
   some native tags and props.
7. **"Real SSR and streaming behavior for conditional styles."** Server class/rule
   emission is tested (`core-test/flatValueProgramsSSR.web.test.tsx:112-151`) and
   streaming tests assert style program blocks are not split across chunks
   (`flatValueProgramsStreaming.web.test.tsx:11-24,54-74`).
8. **"One grammar powers the editor and the codemod, with no second parser."** True
   for the TypeScript tooling (`style-grammar/src/toolingDiagnostics.ts:610-728`,
   `codemod-flat-values/src/grammar.ts:1-5`): **but see §1.1: the Rust LSP is a
   second parser, so fix that before making this claim in public.**

**Two claims to avoid**, both of which a marketing pass would reach for:

- *"v3 is faster than Unistyles because it has zero runtime."* The zero-runtime
  probe is a web bundle measurement; Unistyles' advertised cost is a native C++
  measurement. Different target, different workload, not comparable.
- *"v3 is RSC-safe."* Zero-mode islands are explicitly client-only and the server
  output is a placeholder (`plans/v3-zero-runtime-mode.md:899-906`). The defensible
  version is "zero mode has a server/client contract, and an RSC-safe subset is the
  next product."

Also worth being explicit publicly: `@tamagui/tailwind` is a separate frontend and
the standalone DOM entry excludes the Tailwind parser by design
(`code/core/web/src/dom/standalone.ts:15-18`). Saying so turns a boundary into a
documented contract instead of a surprise.

### 3.3 What competitors have that v3 does not, and what to do about each

Ranked by how much new machinery v3 would need.

- **Unistyles' native C++/Nitro Shadow Tree engine (L), recommend declining for
  now.** It requires New Architecture and Nitro, and its source carries a C++
  parser, registry and Shadow Tree manager (`~/github/react-native-unistyles/packages/unistyles/cxx/parser/Parser.cpp`,
  `.../cxx/shadowTree/ShadowTreeManager.cpp`). Users get theme/breakpoint/runtime
  updates without React re-rendering. Matching it means a supported native module,
  JSI bindings, a native style registry, Shadow Tree commit integration, and a
  two-engine debug story. v3's compiler makes static paths cheap; it does not turn
  JS style evaluation into a C++ engine. This is a separate product decision, not
  a v3 task.
- **StyleX's explicit RSC / static-CSS contract (L), recommend a bounded version.**
  StyleX's runtime `create()` throws if it survives to runtime
  (`~/github/stylex/packages/@stylexjs/stylex/src/stylex.js:65-79`), the compiler
  owns CSS emission, and the repo ships a Vite RSC example. Rather than promising
  that all Tamagui components are RSC-compatible, build **one small RSC-safe
  DOM/zero entry** with no hooks, context or runtime imports, and document the
  client boundary. v3 already has most of the compiler machinery.
- **StyleX's authoring tooling.** An ESLint suite including a no-unused-styles rule
  (`~/github/stylex/packages/@stylexjs/eslint-plugin/README.md:40-47,156-167`) and a
  devtools extension. v3 has an ESLint plugin and a language service; the gap is
  the analysis products on top, which §3.4 argues are v3's cheapest wins.
- **NativeWind's ecosystem reach.** Tailwind familiarity and class-string
  portability. v3 has a Tailwind frontend already; the gap is positioning and
  documentation, not capability.

### 3.4 Capabilities the v3 architecture makes cheap [IDEA]

The argument for this whole section: v3 now has a parsed program with source
spans, a registry, lowering receipts with codes and components, and a grammar with
tooling metadata. Every item below is mostly **reading data the build already
produces**, which is why they are S/M rather than L.

- **Clause-aware design-system linter (M).** Rules over the parsed program:
  raw values where a token exists, conditions that can never match, a clause
  ordering that a later clause always overrides.
- **Unused-token, unused-variant, unused-theme-key report (M).** The registry and
  the parsed program together already know which are referenced. StyleX ships the
  equivalent and users like it.
- **Theme coverage / dark-mode completeness report (M).** Which theme keys are
  defined in one theme and missing in its sibling. This is a correctness product,
  not a lint.
- **"Why did this stay on the runtime path?" (M).** The bailout receipts already
  carry code, message, span and component. Surfacing them as a per-file report is
  mostly plumbing, and it directly serves the 19.9% bailout number.
- **Per-route critical CSS and CSS splitting (M/L).** The compiler already knows
  which rules each module produced.
- **Token export to Figma or platform-neutral JSON (M).**
- **Inline clause preview and next-condition-aware autocomplete in the editor
  (S/M each).** The grammar metadata exists; this is the delivery half of the
  type-system constraint in §2.7.
- **Native capability diagnostics generated from the same tables (S/M).**
  `directStyle.ts:1712-1729` already warns when a state has no native source and
  drops unsupported native values. Publishing that as a generated support matrix
  turns a limitation into a trust feature.
- **Streaming SSR style-resource ownership (M)**, and a **cross-system capability
  corpus with receipts (M/L)** so competitive claims stop being hand-maintained.

---

## Dimension 4: Testing and validation gaps

### 4.1 There is no differential runtime-versus-compiled oracle [high] [L, with an S first slice]

**This is the single highest-value test investment available**, and the reason is
concrete rather than theoretical.

The block-2 close-out fixed a bug where a `transition` (and every prop in
`runtimeAnimationProps`) written in a `styled()` **definition** emitted nothing,
while the identical value at the **call site** worked. Root cause: `compilerHost.ts`
decided lowering from call-site props while `completeProps` merged the styled
definition's defaults 350 lines later. It had been wrong for years. Nothing caught
it, because nothing renders the same tree both ways and compares the result.

**Absence check, stated so it can be checked.** The helper searched
`code/compiler/static-tests`, `code/tests`, `code/kitchen-sink/tests` and the
Vitest/Playwright configs for `parity`, `computed`, `getComputedStyle`,
`extractForWeb`, `renderToString` and compiler-output comparisons. A positive
would have rendered one authored tree twice (once through the ordinary runtime, once compiled) and compared a runtime style observation. What exists instead:

- `code/compiler/static-tests/tests/flatValues.web.test.tsx:124-163` compares a
  clause class against `hostCore.getSplitStyles` and inserted rules. That is an
  internal style-object comparison, not two rendered trees.
- In the same file's precedence corpus (`:223-299`), the `styledLayer` branch only
  asserts that generated CSS *contains* declarations (`:240-244`); the actual
  runtime comparison lives in the other branch (`:245-272`), and **the scenario
  loop skips `styledLayer` at `:278`.** So the one place that compares runtime to
  compiled explicitly skips the `styled()` definition case, the exact shape of the
  bug.
- `e2-parity.web.test.ts:159-180` compares compiler IR against frozen legacy
  observations; `code/core/tailwind/src/__tests__/parityShared.tsx` compares the
  Tailwind converter to the shared resolver. Neither is runtime-vs-compiled
  browser equivalence.

**Design.** Render a runtime route and a compiled route from one fixture, mark
corresponding elements with stable `data-probe` attributes, and compare a canonical
map from `getComputedStyle`. Compare **CSS longhands, never class names or emitted
CSS text**, that lets the browser expand shorthands and resolve variables, and it
removes hash and rule-order differences for free. Normalize browser serialization,
zero forms and whitespace. For stateful cases drive the same hover/focus/media
state before sampling.

**Corpus, not fuzzing.** Start hand-maintained: static `styled()` definitions,
call-site props, style arrays, tokens/themes, media, pseudos, groups, dynamic
bailout controls, Tailwind candidates, reusing the existing flat-value precedence
fixtures. Arbitrary JSX generation would mostly produce cases the compiler is
*designed* to bail out on.

**The S-size first slice, which is the thing to actually schedule:** three
equivalent cases (`styled(View, { transition: 'medium' })`, a call-site `<View transition="medium">`, and a runtime `<View transition="medium">`) comparing
`getComputedStyle(...).transitionDuration` and the other transition longhands. The
definition case is the regression detector; the call-site case is the control that
proves the harness can observe the property at all. One to two days, and it would
have caught the bug that motivated this section.

Then M (3–5 days) for a reusable runner and 30–50 cases; L (1–2 weeks) to run it
across Vite, Next webpack and Metro web with persisted counterexamples.

### 4.2 Five clause parsers, no agreement test [high] [M: and this one is nearly free]

The grammar itself is well tested: `style-grammar/src/__tests__/valueParser.test.ts`
covers ordinary values, functions, strings, clauses and errors, and
`valueParser.fuzz.test.ts:212-253,318-333` runs a 2,000-case constructed fuzz plus
2,000 chaos strings.

But it tests **one** parser. Per §1.1 there are five implementations, and nothing
compares them. **A second implementation of the same grammar is its own oracle**,
so this is the cheapest high-yield test in the whole audit: for each input from the
corpus that already exists, assert the canonical parser's base and ordered
`(modifiers, payload)` clauses match the segments `directStyle` and `propMapper`
actually consume, and that `hasFlatModifier` fires on exactly the values with a
flat modifier. For invalid input, assert consistent rejection.

One known divergence to write a test around first: `directStyle.ts:1572-1573`
early-returns on top-level `;`, `{` and `}` while `valueParser.ts:221-260` reports
them as invalid characters.

Extend the same vectors to the Rust crate as its conformance suite (§1.1).

### 4.3 The three frontends have uneven coverage [med] [M]

`styleMode` is gone; three package-selected frontends replaced it, ordinary
Tamagui props, Tailwind class candidates, and DOM `style()` handles. Tailwind has
the strongest frontend-specific tests. `to-tailwind` has only transform and
round-trip tests. There is no end-to-end browser parity matrix across all three
frontends, which is the same missing oracle as §4.1, applied across frontends
instead of across tiers.

### 4.4 Hydration proves one premise, not the boundary variants [med] [M]

Phase 7 proved the hydration premise for a mixed-color-spelling config, and phase 8
found that receipt had been passing for days against a stale hand-built
`dist-hydration` (now fixed, and the cold-receipt standard it set is the right one).

What is covered now: same-config mixed color spelling, an intentional render
mismatch, and CSS round-trip controls. What is not: a theme selection change across
the boundary, server and client disagreeing on a media query, request-specific
values, RSC, and the standalone streaming test in CI. The last of those is the
cheap one: **the streaming SSR test already exists
(`core-test/flatValueProgramsStreaming.web.test.tsx`) and is not wired into CI [S]**.

### 4.5 Determinism is checked narrowly [med] [M]

Metro and Next now compare cold and warm receipts. That is block-2 close-out work
and is **not** a gap. What remains is broad: repeated-build and cross-machine
byte-identity, especially for Vite and for compiler artifacts. The Metro plan cache
has already produced one real bug (invalidated by another bundler's output) and one
stale-artifact false green. A test that a cache hit and a cache miss produce
identical output is small and has a large blast radius.

### 4.6 A green native test can certify the wrong implementation [high] [L] [KNOWN-OPEN, now quantified]

The handoff log records this: Vite concatenates the extension arrays each plugin
contributes, so the Tamagui plugin's **web** list wins relative-import resolution
before the native-test extensions are reached.

**Independently reproduced, not taken on trust.** The helper built both relevant
packages and ran a Vite `resolveConfig` probe with the real plugin extension
arrays: the final array begins with 12 web/base entries and only then reaches
`.native.tsx`/`.native.ts`/`.native.js`/`.native.jsx`, `webIndex: 0`,
`nativeIndex: 12`. Sources: `code/packages/vite-plugin-internal/src/getConfig.ts:54-69,83-107`
defines the native-first list; `code/compiler/vite-plugin/src/plugin.ts:734-747`
defines the Tamagui list starting `.web.mjs`, `.web.js`, `.web.jsx`, `.web.ts`,
`.web.tsx`.

**Newly quantified.** 64 platform-suffixed test files exist (36 `code/core/core-test`,
10 `code/compiler/static-tests/tests`, 14 `code/ui/components-test`, 4
`code/core/tailwind`); CI's filtered native command runs the first three roots, 60
files (`.github/workflows/checks.yaml:133-137`). A static relative-import graph
probe found **20 of the 64 reach at least one local import where the current order
picks a web/base file before a native sibling** (17 core-test, 2 static-tests, 1
Tailwind).

**Read the two numbers correctly**, because they measure different things: 20 is a
conservative lower-bound graph metric and does *not* mean every assertion in those
files is web-only. The handoff's direct repro (**5 files, 9 failures** across refs, native fast-path links, Tailwind Dimensions, stable-style rendering and colors) is
the triage budget. Do not extrapolate 20 into a bigger number.

Fixing the resolver is not a test-only change: each of the 9 failures has to be
triaged into "stale web expectation" versus "native product defect", and
establishing which **is** the work. Add a resolver assertion that fails when a
native config's final extension list puts a web extension before a native one.
That is the cheap part, and it prevents the regression from returning.

### 4.7 `html.*` native is tested as a smoke slice, not as a mapping contract [high] [M]

`html.native` maps **49 tag entries**; the direct runtime suite covers **10**. It
asserts only `ref.tagName`, one direct HTML event (`onClick`), and one
compiled-runtime text-input event (`onChange`). The rest of the event mappings and
most of the ref facade are unasserted.

This matters because the handoff's own "Named follow-ups" already records a live
defect in exactly this area, `primitives.native.tsx`'s four `DOMRuntime*Frames`
do not declare `neverSkipProps`, so a native element with a runtime style program
plus `onClick`/`onChange` drops the handler on the compiled path. Nothing in the
current suite would catch it.

**Proposed [IDEA, and it is the right shape]:** generate the contract from the
source tables rather than hand-writing 49 tests. The mapping already exists as data
(`code/core/dom/src/tables/nativeBacking.ts`, `code/core/dom/src/tables/events.ts`);
a generated suite asserting every tag's backing and every event row's mapping stays
correct as the tables change, and it makes the coverage number a property of the
tables instead of a maintenance chore.

### 4.8 Platform and conformance coverage [high] [M]

- CI's unit matrix is jsdom/Vitest plus headless Chromium and WebKit. iOS Detox and
  Maestro run simulators; **Android Detox runs only on main and release branches**;
  there is **no physical-device CI** at all.
- **The conformance pixel harness is not called from any workflow.** The Tailwind
  conformance harness is real and valuable (it compares against a same-tree oracle) but it is Tailwind-specific and manually staged. There is no general web/native
  component parity gate.

Sequence these carefully: make conformance reports **artifacts** first, and only
promote them to a hard gate once their noise level is known. A pixel gate turned on
cold produces failures nobody trusts, and an untrusted gate gets disabled.

### 4.9 Component coverage, by the numbers [med] [M]

Of the 61 `code/ui` packages: **36 have a named kitchen-sink integration path, 9
appear only indirectly through another component, and 16 have none** in the search
scope. The good news is that the risk weighting is already right, dialog, sheet,
select, menu, popover, focus and dismiss behavior have substantial web coverage,
which is where focus and dismissal bugs actually live. The 16 uncovered are mostly
low-risk, so this is a fill-in-over-time item, not an emergency. Worth publishing
the table so the gaps are chosen rather than accidental.

### 4.10 Suite health [med] [M]

- **161 direct emitted-source assertions across 15 compiler test files.** Spot-checked
  and confirmed: `code/compiler/static-tests/tests/babel.native.test.tsx:134,244-275`
  asserts things like `expect(code).toContain('_expressions={[compact]}')`,
  `toContain('sm:30px')` and `toContain('<YStack')`.

  A fair caveat the repo's blanket rule does not make: a compiler's product genuinely
  **is** text, so asserting on emitted code is not as obviously worthless here as it
  would be for a component. The real objection is narrower and still holds:
  `toContain('sm:30px')` is a proxy for "this style applies at the `sm` breakpoint",
  and the proxy can pass while the behavior is broken, which is precisely how the
  `styled()` transition bug survived. These are the largest block of low-signal tests
  in the repo, and §4.1's differential harness is what would let most of them be
  **deleted** rather than rewritten. Do not bulk-delete them before that harness
  exists; they are weak coverage, not zero coverage.
- 65 skip sites in kitchen-sink tests/e2e and 7 in core/compiler; **no `.only`**,
  which is good hygiene. 37 of the native skips are already documented as deliberate
  (Detox `swipe()` limitations); `PressStyleNative` (11) and `GroupPressNative` (5)
  are the two worth revisiting. Note `noRngh` is *not* duplicate coverage: it is the
  responder-fallback half, so deleting the RNGH twin would uncover the default press
  path.
- **Load-sensitive thresholds beyond the two already known.** The handoff names
  `motionDriverConversion` (10x ceiling, hit 11.93x) and `safeAreaVariables.native`
  (5s limit, hit 10s). Also in this class: `OnLayoutStress`, `MotionLinkedBenchmark`,
  and elapsed animation timing checks, all of which can fail when a busy runner
  delays frames. The repo rule stands: **never raise a threshold to make one pass.**
  Isolate the runner, or re-express the assertion so it does not measure wall clock.
- Visual and accessibility coverage exists in narrow places with no broad regression
  story.

---

## Appendix A: What this audit deliberately did NOT report

Recorded so the next reader does not rediscover it as a gap, and so nobody spends
effort the campaign already spent and closed.

**The core golf campaign is complete and its declined list stands.** No size work
is proposed on `directStyle`, `getSplitStyles`, `createComponent`, `propMapper`'s
parser or `tokenCategoryByProperty`, `use-element-layout`, the grammar tables, the
`directAtomic` identity cache, or the 436-gzip object-vs-string unification. Three
of five `directStyle` groups are already smaller than the V2 code that bought the
same capability; condition routing alone is 1,573 gzip smaller. Anyone tempted by
these should read handoff-log sections 15–16 first.

Where this report *does* touch those files, it is on a different axis: parser
**agreement** (§1.1, §4.2) rather than parser size, and diagnostic **naming**
(§1.2) rather than lowering bytes. The golf campaign measured bytes and correctly
closed that seam; correctness and clarity in the same files were never in scope for
it.

**Block 2 (zero-runtime) is closed and its close-out is on this SHA.** Not reported
as gaps: the `cssRules: string[]` plan-schema change (deliberately deferred as a
rider), erasure running only on violation-free modules, the zero graph gate keying
on the project root, first-wins compiled CSS dedupe, per-rule coverage on Next and
Metro, and the fixture/starter CI wiring on separate runners.

**Known-open items confirmed still true and priced rather than presented as
discoveries:** the native vitest resolution gap (§4.6), `hidden={dynamic}` and the
`neverSkipProps` gap on native frames (§1.3), the two load-sensitive tests (§4.10),
the Vite island double-publish path, and the `img objectFit: 'fill'` unreachable
native case.

**One correction to a claim in the July docs:** `@tamagui/web` no longer imports
`twMerge` unconditionally. There is no `tailwind-merge` reference in
`code/core/web/src` and no such dependency in its `package.json`. That gap is
closed; the state-of-the-release doc has not been updated to say so.

## Appendix B: Method, coverage, and what would change these conclusions

**Team.** One lead (Opus) plus nine parallel read-only Luna helpers, each on a
named slice: core cleanups, UI cleanups, compiler cleanups, docs drift, perf/DX,
competitive analysis, build-time testing, runtime testing, and one dedicated prober
on the bailout question. **Substitution to note:** the brief asked for Luna at
xhigh where possible; the `codex-luna` runner's schema exposes `high` as its only
effort value (`tm run --group sm --dry-run`), so every helper ran at high. No Fable
was used.

**Coverage, stated so the gaps are visible rather than implied:**

- `code/ui`: 22 of 61 packages deep-read; the remaining 39 got a structural,
  barrel, import-graph and TODO survey only.
- `code/core`: the first pass was shallow for ~80 packages and was sent back for a
  second pass on animations drivers, the theme pipeline, token/value resolution, the
  `use-*` package graph and API-surface coherence. The second pass produced the two
  shipped bugs in §1.7 and the API collisions in §1.8, so the first pass's depth was
  the limiting factor rather than the material. Assume more remains in the packages
  neither pass reached.
- Competitors, read from source at pinned snapshots, not from memory or marketing.
- **Not covered at all:** `code/tamagui.dev` as an application, `code/bento`,
  the registry generator, Detox/Maestro flows beyond what CI runs, and the iOS/Android
  native modules. Those were outside the brief and remain unaudited.

**What was actually executed, as opposed to read.** A cold build of the web
packages plus a runtime HTML probe of `className` forwarding through six components;
a Vite `resolveConfig` probe reproducing the native extension ordering
(`webIndex: 0`, `nativeIndex: 12`); `tsc` probes on documented snippets returning
`TS2305` and `TS2554`; a two-call Bun probe of `generateThemes` producing
`ReferenceError: module is not defined`; a happy-dom render-cost comparison of
Button versus a host element; and one fresh production benchmark run. No device
run, no full-suite benchmark, no CI run.

**What would change the conclusions:**

- **§2.2 is the one to re-derive first.** The fresh run used 3 samples on a
  different machine than the published table, so it establishes that the published
  artifact is unquotable, not what the real number is. A proper re-run could land
  anywhere between "v3 is at parity with Tailwind" and "there is still a real gap,
  smaller than 15x". Everything downstream of Gate 4 depends on which.
- **The 340-bailout question is settled and should stay settled** unless someone
  builds the per-component forwarding proof described in §1.2b. Two conclusions in
  this report were reversed by probing rather than reasoning, the bailout lever and
  the group benchmark, which is the strongest argument in the document for the
  differential-testing investment in §4.1.
- The 20-of-64 native resolution number is a conservative graph lower bound. The
  actionable number is the handoff's direct 5 files / 9 failures.
- Several findings carry an unresolvable caveat: **this repo cannot see npm
  consumers.** Every proposal to remove a published package or rename a public
  export is a release decision with a deprecation window, not a cleanup, and I have
  marked those individually rather than pricing them as if they were free.


## Appendix C: where the underlying detail lives

Each helper's full report, with the complete evidence this document summarizes:

| Slice | File |
| --- | --- |
| Core package cleanups (two passes) | `findings/cleanup-core.md` |
| Component (`code/ui`) cleanups | `findings/cleanup-ui.md` |
| Compiler and toolchain cleanups | `findings/cleanup-compiler.md` |
| Docs drift and public API surface | `findings/docs-drift.md` |
| Performance and developer experience | `findings/perf-dx.md` |
| Competitive analysis and capability matrix | `findings/competitive.md` |
| Build-time testing gaps | `findings/test-compiler.md` |
| Runtime and platform testing gaps | `findings/test-runtime.md` |
| The bailout-lever investigation | `findings/bailout-lever.md` |
| The lead's own findings | `findings/lead-own.md` |

All paths are relative to the directory holding this document. The helper reports
carry per-finding risk sections ("what could make this wrong") that are condensed
here; consult them before acting on anything sized M or larger.

---

## Provenance and status (added on commit to the repo, 2026-08-18)

This rollup and the ten files in `plans/v3-audit-findings/` are the full v3-beta
audit, produced by an independent read-only audit team against SHA `de0d1940`
and committed here so workers read them from source rather than from a scratch
directory that will be cleaned up.

Verification standing: the coordinator spot-verified 8 claims across 6 helper
slices against the audited SHA, 8/8 confirmed READ. Treat individual findings as
verified-by-sample, not each independently re-proven — consult the per-finding
risk sections in `plans/v3-audit-findings/` before acting on anything M or
larger, as the brief requires.

Two items already have campaign history worth knowing before you act on them:

- **The `enterStyle`/`exitStyle` docs finding is confirmed twice over.** V3
  implements NEITHER prop; the v3 spelling is flat `enter:` / `exit:` clauses on
  the style value, and `code/core/codemod-flat-values/src/legacyConditions.ts:15`
  maps the old spelling. Block 2's close-out independently rediscovered this the
  expensive way: it probed the V2 prop names, read the resulting green build as a
  finding, and produced a false "enter/exit animations do not run in any compiled
  web build" claim that had to be retracted. **A probe of a prop that does not
  exist cannot fail informatively** — green means not-implemented and red would
  also have meant not-implemented. Fixing the docs is the right action; do not
  re-derive the behavior.
- **Native vitest resolution (item 18)** was diagnosed during block 1: Vite
  CONCATENATES the extension arrays each plugin config contributes, so the
  Tamagui plugin's WEB list wins relative-import resolution before the
  native-test extensions are reached. The handoff log records why flipping it
  naively is expensive.

Status of the audited tree: block 2 (zero-runtime mode) is implemented and
closed as of `de0d1940`. Its own records are `plans/v3-zero-runtime-mode.md` and
handoff-log sections 14-23.
