# Tamagui v3 beta review

- Reviewed: 2026-07-17
- Audited branch: `origin/v3-beta`
- Audited commit: `5418244f4a00ad4331144115f76fdb388885ec0a`
- v2 comparison: tag `v2.4.6` at `76dc8e7dbbbe1d57c1e2e07d41ce0f248c4a0ed9`
- Change size: 313 commits, 1,770 files, +110,948 / -35,750

## Executive verdict

**Hold the first public beta.** The v3 styling grammar, compiler foundation,
Tailwind integration, variant model, animation API, and several behavior
primitives are real and substantial. The product described by the v3 plan is
not assembled yet, and the exact candidate does not have truthful native or
release evidence.

The largest gap is the three-layer component contract:

1. The behavior-only migration is convincing for pilots such as Button, Sheet,
   and Select, but a representative set of public component packages still
   embeds colors, radii, padding, elevation, sizing, and interaction styling.
2. The v2-compatible styled kit exists as duplicated example code rather than
   one documented, versioned, tested product surface.
3. The shadcn copy-paste kit does not exist in the audited tree. There is no
   registry, package, documentation, or even a `shadcn` reference.

The exact SHA also has one failed iOS Detox shard. Its compiler-extraction
benchmark measured the optimized path slower than the unoptimized path on both
the initial attempt and retry. Android reports success while every test failure
is swallowed by the workflow. A beta candidate cannot call that native CI
green.

### Readiness scorecard

| Area                             | Status               | Verdict                                                                                                                                                                            |
| -------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token-first style grammar        | Done                 | Shared grammar, Tailwind mode, class strings, and compound variants have implementation and tests.                                                                                 |
| Compiler architecture            | Substantially done   | Shared graph/IR and Vite, Metro, SSR, and Turbopack coverage exist. Build-time regression evidence is missing and several hot paths are concerning.                                |
| Behavior-only primitives         | Partial              | Button, Sheet, and Select show the intended shape. Accordion, Dialog, Slider, Toggle, Input, ListItem, Toast, and others still own aesthetics.                                     |
| v2-compatible styled kit         | Partial raw material | Canonical-looking skins exist in kitchen-sink and demos, but they are duplicated, divergent, and not offered as one supported kit.                                                 |
| shadcn copy-paste kit            | Missing              | No registry or kit was found. State styling is not uniform enough to support one cleanly.                                                                                          |
| Correctness and accessibility    | Blocked              | Dismissable pointer-event bookkeeping, nested Button semantics, CSS animation completion, and migration documentation need fixes.                                                  |
| Runtime performance              | Mixed                | Compiled simple/rich/group benchmarks look good against inline controls. Heavy and animated cases remain several times slower, and animation drivers contain avoidable frame work. |
| v2 performance comparison        | Missing              | The committed benchmark matrix has no v2 control and contains inconsistent sample sizes and artifacts.                                                                             |
| Web release checks               | Mostly green         | Exact-SHA checks, integrations, SSR/hydration, bundle observation, and Maestro succeeded.                                                                                          |
| Native release checks            | Blocked              | One iOS shard failed; Android failures are explicitly ignored; required One production bundles are absent.                                                                         |
| Packed release proof             | Partial harness      | G1 is thoughtfully implemented, but no durable exact-candidate report proves the bytes that would be published.                                                                    |
| Starter and migration experience | Blocked              | Expo starter imports the now-behavior-only Button directly and has placeholder tests. Several upgrade instructions contradict v3 source.                                           |

## Severity and evidence policy

- **P0**: blocks a credible first beta or invalidates its central product claim.
- **P1**: should be fixed before beta because it can cause incorrect behavior,
  accessibility failure, serious performance risk, or a broken upgrade path.
- **P2**: important beta follow-up that can land shortly after the blockers.

Measured facts are labeled as such. Source-level performance concerns are
called risks unless a benchmark directly demonstrates the effect. All line
numbers refer to the audited commit above. CI links also refer to that commit.

## Highest-priority findings

| ID  | Priority | Finding                                                                                                                     |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| L1  | P0       | The advertised behavior / styled compatibility / shadcn architecture is incomplete.                                         |
| R1  | P0       | Native and packed-release evidence is not sufficient for a beta cut.                                                        |
| R2  | P0       | The default Expo starter consumes unstyled behavior directly and has no meaningful tests.                                   |
| C1  | P1       | `Dismissable` corrupts global pointer-event layer state when `disableOutsidePointerEvents` changes.                         |
| C2  | P1       | CSS exit completion usually falls through to a timer because transition event property names cannot match the tracked keys. |
| C3  | P1       | CSS animated-number style subscribers re-render every frame but read the final target, not the interpolated value.          |
| C4  | P1       | Nested Buttons produce a focusable `role=button` descendant inside a native button.                                         |
| D1  | P1       | Upgrade documentation tells users to remove working Select form props and teaches removed variant syntax.                   |
| A1  | P1       | Component state has no uniform class/native styling contract, which blocks a coherent shadcn layer.                         |
| P1  | P1       | Existing benchmark artifacts cannot establish v3 performance versus v2.                                                     |
| P2  | P1       | Vite compilation serializes transforms and repeats dependency traversal without v2's pending-work and result caches.        |
| P3  | P1       | Metro performs duplicate Babel work and republishes an all-entry cache manifest on changes.                                 |
| P4  | P1       | Motion animated styles run the full Tamagui style splitter on every MotionValue change.                                     |
| P5  | P2       | New allocations and an unused merge sit in the universal component render path.                                             |
| P6  | P2       | Optional Tailwind behavior adds default runtime and install footprint, while bundle CI only warns.                          |

## 1. The three product layers

The v3 contract says components become behavior primitives, old-looking skins
move into a pre-styled kit, and copied skins are used by starters and the
kitchen sink. It explicitly removes `TAMAGUI_HEADLESS`, default aesthetic
variants, and component factories. See `plans/v3-evolution.md:13-36`,
`plans/v3-evolution.md:186-201`, and the C4 acceptance contract at
`plans/v3-evolution.md:500-520`.

### 1.1 Behavior-only primitives: a successful pilot, not a completed fleet

The direction is good:

- `ButtonFrame` contains structural layout and disabled pointer behavior, with
  no default color, padding, radius, or size scale at
  `code/ui/button/src/Button.tsx:50-68`. `useButton` owns composition,
  semantics, icon handling, and text propagation at
  `code/ui/button/src/Button.tsx:127-240`.
- Sheet exposes structural behavior and parts while the kitchen-sink skin lives
  separately in `code/kitchen-sink/src/components/Sheet.tsx:4-84`.
- Select's substantial styled composition is separate in
  `code/kitchen-sink/src/components/Select.tsx:9-274`.
- Core and UI source contain no active `TAMAGUI_HEADLESS` or `unstyled` branch.
  This is the right one-path architecture. One stale v2 documentation reference
  remains at `code/tamagui.dev/data/docs/components/list-item/2.0.0.mdx:298`.

The fleet is still mixed. Representative public behavior packages embed
opinionated aesthetics:

- Accordion trigger and content own theme colors, padding, hover, focus, and
  press appearance at `code/ui/accordion/src/Accordion.tsx:479-486` and
  `code/ui/accordion/src/Accordion.tsx:523-526`.
- Dialog overlay and content own background, border, padding, radius, and
  elevation at `code/ui/dialog/src/Dialog.tsx:374-392` and
  `code/ui/dialog/src/Dialog.tsx:456-468`.
- Slider track, active range, and thumb own palette, radii, borders, press,
  hover, and focus treatment at `code/ui/slider/src/Slider.tsx:320-328`,
  `code/ui/slider/src/Slider.tsx:351-357`, and
  `code/ui/slider/src/Slider.tsx:423-449`.
- Toggle owns default dimensions, theme colors, border, focus ring, hover,
  press, and active appearance at `code/ui/toggle-group/src/Toggle.tsx:15-78`.
- Input still carries a default palette and sizing policy at
  `code/ui/input/src/shared.tsx:8-85`.
- ListItem still carries default background, color, interaction, size, and text
  policy at `code/ui/list-item/src/ListItem.tsx:77-152`.
- Toast's public frames own visual defaults at
  `code/ui/toast/src/ToastItemFrame.tsx:16-93`.

This is more than cleanup. A consumer importing `Button` gets a behavior
primitive while a consumer importing `Dialog`, `Slider`, or `Toggle` still gets
Tamagui aesthetics. The same root package reexports them all at
`code/ui/tamagui/src/index.ts:3-66`. The v3 API therefore has no reliable rule
for whether a component is styled.

**Recommendation:** finish the C4 sweep before calling the suite unstyled. Keep
layout required for behavior, hit targets, positioning, focus, and native
interaction. Move theme colors, typography, padding scales, radii, borders,
elevation, and opinionated states into the compatibility skin. Add a reviewed
allowlist for structural styles so the boundary is testable rather than a
matter of taste.

### 1.2 The v2-compatible kit: duplicated examples are not a product surface

There is strong raw material. The kitchen-sink Button skin is 229 lines and
implements named sizes, theme states, icons, and public static parts at
`code/kitchen-sink/src/components/Button.tsx:15-229`. The demos Button is also
229 lines and is byte-for-byte equivalent except for two component names at
`code/demos/src/Button.tsx:15-229`. `ControlSkins.tsx` and `MenuSkins.tsx`
contain another 445 lines of copied skins.

That material is fragmented:

- `@tamagui/demos` is a published demo collection with a wildcard `./demo/*`
  export, not a small compatibility-kit contract. See
  `code/demos/package.json:1-40` and its broad dependency set beginning at
  `code/demos/package.json:48`.
- Kitchen-sink, demos, and canary own separate copies. Button has already been
  duplicated exactly. Canary Select is 104 lines versus the kitchen-sink's 274
  and omits Adapt, FocusScope, label/indicator, scroll buttons, and separators.
  Compare `code/tests/v3-canary/src/components/Select.tsx:1-104` with
  `code/kitchen-sink/src/components/Select.tsx:9-274`.
- Canary Sheet omits the controlled composition exposed by kitchen-sink.
  Compare `code/tests/v3-canary/src/components/Sheet.tsx:1-74` with
  `code/kitchen-sink/src/components/Sheet.tsx:1-84`.
- The `tamagui` export map offers the root, web/native aliases, tests, and
  linear-gradient only. It has no kit or per-component compatibility subpaths:
  `code/ui/tamagui/package.json:19-59`.
- Starters do not consume copied skins. The Expo starter imports Button directly
  from `tamagui` at `code/starters/expo-router/app/(tabs)/_layout.tsx:1-33` and
  `code/starters/expo-router/components/CurrentToast.tsx:1-53`.

This will drift immediately. It also makes migration guidance impossible:
there is no stable import or copy command that means "keep my v2 appearance."

**Recommendation:** choose one canonical skin source and derive every copy from
it. A beta-ready kit needs:

- one documented location and import/copy contract;
- a complete part set for each migrated behavior primitive;
- v2 prop and visual compatibility tests where compatibility is promised;
- native and web interaction coverage;
- generated or mechanically checked copies in kitchen-sink, demos, canary, and
  starters;
- a small dependency graph that does not require the demo package.

### 1.3 The shadcn copy-paste kit: absent

A repository search across `code`, `plans`, and `docs` found zero references to
`shadcn`, `registry.json`, or a registry-item schema at the audited SHA. There
is no source directory, copy command, component manifest, dependency metadata,
documentation, or canary consumer.

The underlying primitives also lack a uniform state-to-style contract. This is
a prerequisite for a class-oriented copied kit, not a separate polish item.

**Recommendation:** ship a real registry, even if the beta starts with a small
component set. Each entry should include files, dependencies, peer/native
requirements, theme/token assumptions, and a deterministic copy test. Install
the registry into a blank web app and a blank Expo app in CI, then build and
interact with the result. A folder of examples without registry metadata does
not meet the shadcn promise.

## 2. Correctness, accessibility, and API consistency

### C1, P1: Dismissable pointer-event bookkeeping is corrupted by prop changes

`Dismissable` maintains both a Set of layers that disable outside pointer
events and a module-level count. The effect at
`code/ui/dismissable/src/Dismissable.tsx:256-283` adds the node and increments
the count when `disableOutsidePointerEvents` is true. Its cleanup restores the
body style in one case, but never removes the node from the Set and never
decrements the count.

The unmount effect at `code/ui/dismissable/src/Dismissable.tsx:291-310` removes
the node and decrements once, but it does not rerun for
`disableOutsidePointerEvents` changes. The stale Set is consulted to decide
which layers can receive pointer events at
`code/ui/dismissable/src/Dismissable.tsx:180-200`.

Reproduction from the source state machine:

1. Mount with `disableOutsidePointerEvents=true`. The node enters the Set and
   the count increments.
2. Change the prop to false. Effect cleanup may restore `body.pointerEvents`,
   but the Set and count stay populated.
3. A later modal sees a non-empty Set and can skip the body-disable transition.
4. Toggle the original layer true again. `Set.add` is idempotent, but the count
   increments again.
5. Unmount removes one Set entry and decrements once, leaving the global count
   divergent.

There is no interaction test for the true-to-false-to-true sequence.

**Fix:** make the first effect own symmetric Set/count/body cleanup for every
prop transition. Keep creation-order tracking in the separate `layers` Set as
the comment intends. Add a browser integration test with two stacked layers,
prop toggles, outside clicks, and body pointer-style assertions.

### C2, P1: CSS exits usually complete by timeout rather than transition events

The CSS driver maps a simple transition to `keys = ['all']` and keeps raw
Tamagui property keys for explicit transitions at
`code/core/animations-css/src/createAnimations.tsx:537-560`. Exit handling
always installs a maximum-duration timeout at
`code/core/animations-css/src/createAnimations.tsx:731-755`, then waits for
`transitionend` property names to appear in `new Set(keys)` at
`code/core/animations-css/src/createAnimations.tsx:757-776`.

Browser events do not report `propertyName='all'`; they report concrete names
such as `opacity` and `transform`. Tamagui transform keys such as `x`, `y`, and
`scale` also report as `transform`. Those events cannot satisfy the raw-key Set.
With a default plus property overrides, the Set size can exceed the number of
properties that actually transition.

The result is a timer-driven exit lifecycle for common cases, even though the
driver has event listeners. This makes presence completion approximate and
keeps the exact failure modes that the v3 animation plan intended to remove at
`plans/v3-animation-api.md:205-243`.

**Fix:** wait for the element's actual CSS animations and transitions through
`element.getAnimations()` and their `finished` promises. If event aggregation
is retained, normalize Tamagui keys to emitted CSS property names and only wait
for properties whose computed values changed. Keep one cancellation path and
delete the unconditional timer once the exact path is proven.

### C3, P1: CSS animated-number subscribers do frame work with the wrong value

The CSS driver sets `valueRef.current` to the final target once at
`code/core/animations-css/src/createAnimations.tsx:289-304`. It then runs a
timing or spring requestAnimationFrame ticker and notifies interpolated values
at `code/core/animations-css/src/createAnimations.tsx:321-400`.

`useAnimatedNumberStyle` subscribes by forcing a React render for every notify,
but calculates the style from `val.getValue()` at
`code/core/animations-css/src/createAnimations.tsx:221-245` and
`code/core/animations-css/src/createAnimations.tsx:424-435`. `getValue()` reads
the final target, not the notified interpolation.

This has two effects:

- CSS transitions can still animate the host DOM, but a linked style consumer
  does repeated React work while reading the same final value.
- A consumer that expects a JS-linked style to follow the interpolated number
  does not receive that interpolation through this hook.

The spring additionally uses fixed 1 ms substeps, commonly around 17
integrations per 60 Hz frame, at
`code/core/animations-css/src/createAnimations.tsx:349-380`. No hook cleanup
cancels an in-flight ticker on unmount.

**Fix:** separate the CSS-host path from genuine JS reaction consumers. Avoid a
ticker when only CSS is responsible for pixels. When JS interpolation is
needed, store and expose the current interpolated value, batch subscribers, and
cancel requestAnimationFrame on unmount. Add render-count and linked-value
tests rather than only checking the host's visible transition.

### C4, P1: nested Button semantics are invalid

`ButtonFrame` defaults to a native `<button>`, `role="button"`, and `tabIndex=0`
at `code/ui/button/src/Button.tsx:50-55`. `useButton` changes a nested Button's
render element to `span` at `code/ui/button/src/Button.tsx:208-216`, but role,
tab index, and interaction props remain in `restProps` and are spread at
`code/ui/button/src/Button.tsx:151-170` and
`code/ui/button/src/Button.tsx:218-225`.

The browser test confirms the inner span remains a focusable button role inside
the outer native button at `code/kitchen-sink/tests/ButtonSkin.test.tsx:38-45`.
That is an interactive descendant inside a button, introduces an extra focus
stop, and can bubble activation to the outer control. The test currently locks
in the bug while describing the elements as valid.

**Fix:** either forbid nested interactive Buttons or make a nested Button a
non-interactive presentation part by removing role, tabIndex, press/keyboard
handlers, and disabled semantics. Add keyboard and click-bubbling assertions,
not only tag-name assertions.

### D1, P1: migration documentation contradicts current APIs

Three upgrade paths are currently misleading:

1. The Select guide tells users to remove `name` because Select has no form
   behavior at `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx:304-313`.
   The public type includes `name`, `autoComplete`, and `form` at
   `code/ui/select/src/types.tsx:117-121`, and custom Select renders hidden form
   inputs at `code/ui/select/src/Select.tsx:746-756`. Following the guide breaks
   form submission.
2. The design-system guide teaches a `...size` spread variant at
   `code/tamagui.dev/data/docs/guides/design-systems.mdx:91-120`. v3 explicitly
   removed spread/type-key runtime lookup, with zero-source acceptance at
   `plans/v3-evolution.md:402-421`.
3. The Button upgrade example still uses `<Button size="$4">` at
   `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx:155-169`. Behavior
   Button does not turn that token into visual size. The copied compatibility
   skin uses `small`, `medium`, `large`, and `wide` at
   `code/kitchen-sink/src/components/Button.tsx:15-70`. No supported kit import
   reconciles the old contract with the new one.

These are beta blockers because migration documentation is the first runtime
path for existing users.

**Fix:** regenerate the migration guide from the final exported APIs and kit.
Every before/after snippet should compile in a fixture, and behavior claims
such as form submission should have a browser interaction test.

### D2, P2: Popover trigger omits `aria-controls`

Popover leaves an unresolved comment where `aria-controls` should reference the content ID at
`code/ui/popover/src/Popover.tsx:403-419`. The content already receives the ID
at `code/ui/popover/src/Popover.tsx:853-855`, generated at
`code/ui/popover/src/Popover.tsx:1083`.

**Fix:** wire the existing ID to the trigger when content is present and cover
the controlled, force-mounted, and adapted cases in the popup conformance
suite.

### A1, P1: component state is not a uniform styling API

The style grammar registry enumerates style properties, but has no shared
component-state modifier vocabulary at
`code/core/style-grammar/src/registry.ts:33-139`. Packages emit local web state
formats such as `data-state="open|closed"`, `"active|inactive"`, and other
component-specific values. The existing internal gap analysis documents this
at `plans/base-ui-comparison.md:19-67` and recommends a shared emitter and
grammar at `plans/base-ui-comparison.md:303-316`.

This matters now because the promised shadcn layer is class-first. A copied
skin needs one way to express open, checked, pressed, highlighted, disabled,
invalid, starting, and ending states. Today a Tamagui variant can see some
state, a web data selector can see another shape, and native class grammar has
no equivalent.

**Recommendation:** define one discrete state vocabulary and emit it from a
shared helper. Add the same states as grammar modifiers so `open:`, `checked:`,
and `invalid:` resolve to data selectors on web and component state on native.
Document attributes per part. Land this before generating shadcn skins so the
copied API does not fossilize inconsistent selectors.

### A2, P1: canary coverage is shallow at the new skin boundary

The canary exposes web and native G0 commands at
`code/tests/v3-canary/package.json:6-16`. Web performs a basic Select click and
Sheet open/close at `code/tests/v3-canary/tests/web-canary.test.ts:104-141`.
The native renderer test renders styles and presses Button, but never interacts
with Select or Sheet at
`code/tests/v3-canary/tests/native-runtime.test.tsx:47-96`.

The hard cross-platform behavior is precisely at those boundaries: Select
focus/keyboard/adaptation and Sheet drag, scroll, keyboard, overlay, and
presence. The reduced canary copies also omit parts from the canonical-looking
kitchen-sink skins.

**Recommendation:** consume the same kit artifacts in canary and starters.
Exercise Select selection and adaptation, Sheet drag/scroll/close, and Button
keyboard/accessibility on both platforms. The canary should prove the package
and copy boundary, not a second simplified implementation.

## 3. Performance review

### 3.1 What the repository currently measures

The best current committed web artifact is encouraging for compiler extraction
in simple cases. Against an inline control, compiled Tamagui reports:

| Scenario |         Mount |     Re-render | Source                                          |
| -------- | ------------: | ------------: | ----------------------------------------------- |
| Simple   |  6.8 ms, 0.9x |  9.2 ms, 1.2x | `code/comparisons/output/benchmarks.html:29-35` |
| Rich     |  5.3 ms, 0.9x |  9.7 ms, 1.2x | `code/comparisons/output/benchmarks.html:30-36` |
| Group    | 19.6 ms, 0.9x | 32.3 ms, 1.5x | `code/comparisons/output/benchmarks.html:31-37` |
| Heavy    | 40.2 ms, 3.6x | 33.9 ms, 3.0x | `code/comparisons/output/benchmarks.html:32-38` |
| Animated | 35.2 ms, 5.8x | 38.2 ms, 5.8x | `code/comparisons/output/benchmarks.html:33-39` |

This supports two limited conclusions: extraction is effective for static and
rich examples, and heavy/animated workloads still have meaningful overhead
against an inline control. It does not establish a v2 regression or
improvement.

The exact-SHA Detox run adds a separate warning. The
[iOS shard 1/4 job](https://github.com/tamagui/tamagui/actions/runs/29566347396/job/87840444600)
failed `CompilerExtraction.test.ts`. Across the initial attempt and retry, the
20-view optimized mount was 13.4% and 22.4% slower than
`disableOptimization`, beyond the test's 10% tolerance. The assertion and its
best-of-three protocol are at
`code/kitchen-sink/e2e/CompilerExtraction.test.ts:79-123`, with the rendered
case at `code/kitchen-sink/src/usecases/CompilerExtraction.tsx:148-235`.

Twenty views, fixed optimized-first order, and best-of-three make this a noisy,
order-sensitive benchmark. It is not proof of a general regression. It is
proof that the exact candidate is red on its own performance gate and that the
gate needs either a reproducible fix or a better protocol.

### P1: the benchmark suite cannot compare v3 with v2

The current matrix has no v2 entry at
`code/comparisons/run-benchmarks.ts:40-75`. It also has correctness problems:

- Runtime Tamagui uses 200 components and skips group/heavy, while compiled and
  inline use 500/150 at `code/comparisons/run-benchmarks.ts:48-63` and
  `code/comparisons/shared/bench.ts:19-27`.
- Runtime results are divided by the 500-item inline baseline without
  normalization at `code/comparisons/run-benchmarks.ts:205-238`.
- Output labels every column as 500/150 at
  `code/comparisons/run-benchmarks.ts:245` and
  `code/comparisons/run-benchmarks.ts:281`.
- Three runs discard minimum and maximum, leaving one sample at
  `code/comparisons/run-benchmarks.ts:158-183`.
- The apps are Vite development servers at
  `code/comparisons/run-benchmarks.ts:40-88`.
- Native artifacts disagree. JSON has null for compiled rich, group, heavy, and
  animated at `code/comparisons/output/benchmarks-native.json:16-28`, while the
  HTML reports values for all of them at
  `code/comparisons/output/benchmarks-native.html:24-37`.

`next.md:94-155` contains older one-run numbers and still calls group a 19.4x
priority, while the current committed HTML reports group mount at 0.9x inline.
That may reflect landed work, but the status document and benchmark provenance
do not say so.

**Recommendation:** add the v2.4.6 app as a real matrix column, use equal item
counts, run production bundles, randomize framework and scenario order, record
warmup separately, retain enough samples for confidence intervals, and include
commit, hardware, browser/runtime, and raw samples in one artifact. Make native
JSON the source for generated HTML so they cannot diverge.

### P2, P1 risk: Vite compilation serializes work and repeats graph traversal

The v3 frontend serializes every compile through a promise queue at
`code/compiler/static/src/compiler.ts:72-80`. Each compile creates a compiler
host and recursively discovers, resolves, and loads the project-local import
tree at `code/compiler/static/src/compiler.ts:115-213`. The compiler session
also has its own queue at `code/compiler/compiler-core/src/session.ts:43-98`.
Every Vite JSX transform enters this path.

By comparison, v2 shared client/SSR compiled output, deduplicated pending work,
kept a bounded result cache, and used two persistent extraction workers at
`v2.4.6:code/compiler/vite-plugin/src/plugin.ts:507-540`,
`v2.4.6:code/compiler/vite-plugin/src/plugin.ts:597-612`, and
`v2.4.6:code/compiler/static-worker/src/index.ts:90-101`.

This is a **source-level cold-build and HMR regression risk**, not a measured
regression. The new graph caches parsed state and enables better invalidation,
but dependency discovery, source loading, duplicate SSR/client work, and
serialization can dominate before those wins apply.

**Optimization:** persist the host and resolved module graph per project
generation, update only changed files, restore content-addressed output caching
and pending-work deduplication, and use bounded parallel lowering. Benchmark
cold build, warm rebuild, one-leaf HMR, one-shared-dependency HMR, and parallel
SSR/client builds in small and large fixtures.

### P3, P1 risk: Metro duplicates Babel and republishes project-sized cache state

Metro's initial graph scan Babel-compiles modules sequentially at
`code/compiler/metro-plugin/src/frontend.ts:147-178` and
`code/compiler/metro-plugin/src/frontend.ts:391-427`. The actual Metro
transformer calls the user's Babel transformer again at
`code/compiler/metro-plugin/src/transformer.ts:35-49`.

After a changed module, the frontend republishes all compiled entries at
`code/compiler/metro-plugin/src/frontend.ts:296-315` and
`code/compiler/metro-plugin/src/frontend.ts:516-524`. Publication sorts and
serializes every entry, probes existing blobs, and rewrites the manifest at
`code/compiler/metro-plugin/src/compilerCache.ts:114-176`. Each transform reads
and parses the manifest and then reads a blob at
`code/compiler/metro-plugin/src/compilerCache.ts:221-281`. The focused cache
test covers one entry only.

v2's Metro plugin did not pre-scan and compile the project graph at
`v2.4.6:code/compiler/metro-plugin/src/index.ts:41-70`.

This is a strong project-size startup and HMR risk. It needs measurement before
beta because mobile projects are exactly where users cannot replace the
compiler easily.

**Optimization:** reuse the Babel result between discovery and final transform,
publish only changed descriptors, keep an in-memory manifest/blob index per
worker, compact in the background, and test 1, 100, 1,000, and 5,000 module
fixtures with cold start and leaf/shared invalidation.

### P4, P1: Motion resolves the full style system on each animated value change

The Motion driver defines `getProps()` by calling `getSplitStyles`, fixing
styles, and converting them to CSS at
`code/core/animations-motion/src/createAnimations.tsx:1004-1030`. Every
multi-value change calls that full pipeline at
`code/core/animations-motion/src/createAnimations.tsx:1036-1062`. The
single-value path does the same at
`code/core/animations-motion/src/createAnimations.tsx:1067-1094`.

Each callback then starts `animate(node, webStyle, config)` again. This places
token/theme resolution, variant machinery, style normalization, allocation,
and a new animation control object inside a per-value frame path.

**Optimization:** resolve tokens and property mappings when the animated style
is registered, then update concrete CSS properties or transforms directly.
Motion should own interpolation once. Add a profiler assertion for style-split
calls per animation and a 100-element linked-motion benchmark.

### P5, P2: avoidable work sits in every Tamagui component render

The universal component function now copies all props to remove `ref` at
`code/core/web/src/createComponent.tsx:276-280`. It then performs a second
default/context merge to produce `baseProps` at
`code/core/web/src/createComponent.tsx:365-375`. Repository search finds
`baseProps` and `callerProps` only where they are created/passed and in their
type declarations; no style logic reads them. See
`code/core/web/src/createComponent.tsx:752-762` and
`code/core/web/src/types.tsx:3444-3447`.

`getSplitStyles` also materializes `Object.entries` arrays for props and base
style even when no compound variants exist at
`code/core/web/src/helpers/getSplitStyles.tsx:275-290`, then iterates that array
at `code/core/web/src/helpers/getSplitStyles.tsx:1258-1262` and
`code/core/web/src/helpers/getSplitStyles.tsx:1324`.

A focused local Node 22 arm64 microbenchmark with 16 representative props found
the `Object.entries` plus iteration loop 2.77x the direct `for...in` loop. A
second synthetic merge made that merge loop 1.39x slower. These are isolated
operation measurements, not end-to-end render results. The existing stress
test cannot catch a regression because its only threshold is median greater
than zero at `code/kitchen-sink/tests/StressPagePerf.test.tsx:73-76`.

**Optimization:** delete the unused merge and fields, retain a direct iteration
fast path when compound variants are absent, and benchmark full component
render profiles before and after. The hot path should have allocation budgets,
not only functional tests.

### P6, P2: optional Tailwind behavior has default footprint

`@tamagui/web` imports `twMerge` unconditionally from `tailwind-merge` at
`code/core/web/src/helpers/getSplitStyles.tsx:36` and calls it only when
Tailwind mode is enabled at
`code/core/web/src/helpers/getSplitStyles.tsx:1377-1388`. A focused tree-shaken
browser bundle of that import measured 27,018 bytes minified and 8,498 bytes
gzip. Tree shaking may remove it in some builds, so this is a reachability risk,
not a claim that every Tamagui app gains exactly 8.5 KB.

The Vite plugin makes `@tailwindcss/node` and `@tailwindcss/oxide` unconditional
dependencies while `tailwindcss` itself is an optional peer at
`code/compiler/vite-plugin/package.json:34-61`. On the review machine those two
installed packages occupied about 3.6 MiB on Apple arm64.

Tailwind startup/HMR also scans broad source globs, reads all scanner files with
an unbounded `Promise.all`, reunions candidates, sorts, and rebuilds CSS at
`code/compiler/vite-plugin/src/tailwind.ts:137-199`. Source transforms invoke
the scanner/build path again at `code/compiler/vite-plugin/src/tailwind.ts:201-207`.

**Optimization:** place Tailwind merge and compiler integration behind explicit
entry points, cache static class parsing by config and class string, keep
per-file candidate reference counts, bound file reads, and update Tailwind CSS
incrementally on HMR.

### Bundle architecture and governance

The `tamagui` root has 61 star exports and a broad internal dependency graph at
`code/ui/tamagui/src/index.ts:3-66` and
`code/ui/tamagui/package.json:70-134`, but offers no per-component subpaths at
`code/ui/tamagui/package.json:19-59`. ESM web bundlers can tree-shake much of
this. Metro and imperfect package optimization have less reliable outcomes,
and consumers have no narrow supported route through the convenience package.

Every root import also runs setup that imports `@tamagui/polyfill-dev`, assigns
global React, and installs a global requestAnimationFrame fallback at
`code/ui/tamagui/src/setup.ts:1-12`. `@tamagui/config` depends on all four
animation drivers at `code/core/config/package.json:146-160`. Root themes
reexport the theme builder at `code/core/themes/src/index.tsx:1-8`, while the
default config imports root themes at `code/core/config/src/index.tsx:1-15`.

The bundle-delta workflow records artifacts, but the comparator only emits a
warning when gzip grows and exits successfully at
`.github/scripts/compare-webpack-stats.mjs:22-35`. The integration fixture has
coarse absolute caps of 60 KB CSS gzip and 500 KB JS gzip at
`code/tests/integration/tests/simple.integration.test.js:247-250`.

**Recommendation:** add supported narrow component/config/theme entry points,
remove root global setup where modern targets do not require it, and enforce
budgets for web JS/CSS, Metro production bundles, and install size. Keep the
existing delta artifact, but fail on reviewed thresholds and retain a rolling
baseline.

## 4. Release and operational readiness

### R1, P0: native CI is not green

At the audited SHA:

- The [Checks run](https://github.com/tamagui/tamagui/actions/runs/29566351471)
  succeeded, including integrations, SSR/hydration, and the observational
  bundle job.
- [Maestro](https://github.com/tamagui/tamagui/actions/runs/29566347377)
  succeeded.
- [Detox](https://github.com/tamagui/tamagui/actions/runs/29566347396)
  failed iOS shard 1/4 on the compiler performance assertion described above.
- Android has `continue-on-error: true` at
  `.github/workflows/test-native.yml:528-536`. Its command converts every test
  failure into an environment flag at
  `.github/workflows/test-native.yml:643-646`, then emits a warning and succeeds
  at `.github/workflows/test-native.yml:648-656`.
- `plans/v3-ci-baseline.md:34-55` documents the deterministic AppCompat launch
  failure and explicitly says workflow-level success proves nothing about
  Android.
- Expo Go CI is disabled at
  `.github/workflows/test-ios-kitchensink-go.yml:17-20`.

The master acceptance contract also requires One iOS and Android production
bundles at `plans/v3-evolution.md:701-703`. The closest repository test manually
calls `vxrnNative` in a Vite-plugin fixture at
`code/compiler/vite-plugin/test/loadTamagui.test.ts:455-589`; it is not a One
production bundle. G0 exports iOS only at
`code/tests/v3-canary/package.json:16`.

**Exit condition:** fix Android launch, remove failure swallowing, get every
required iOS and Android shard green on the same candidate, and retain One
production-bundle logs/artifacts for both platforms.

### R2, P0: the starter demonstrates the wrong product boundary

C4 requires starters to use copied skins at `plans/v3-evolution.md:512-520`.
The Expo starter imports raw Button behavior from `tamagui` in its tabs and
toast controls at `code/starters/expo-router/app/(tabs)/_layout.tsx:1-33` and
`code/starters/expo-router/components/CurrentToast.tsx:1-53`.

Both starter test scripts are the string `true` at
`code/starters/expo-router/package.json:6-14`. No build or runtime assertion
catches the missing skin or proves the v3 copy workflow.

**Exit condition:** install the canonical compatibility or shadcn skin into the
starter through the supported user flow, remove direct aesthetic assumptions
about behavior primitives, and run real web export plus native render/interaction
smokes.

### R3, P0: G1 does not yet certify publish bytes

The G1 dry-run harness is a good foundation. It builds packages, stages
tarballs, rewrites manifests, audits exports, installs into isolation, runs G0,
rejects removed packages, and generates publish commands. Its contract is at
`scripts/v3-release-dry-run.md:1-101`.

The audited tree and exact-SHA CI contain no durable `release-preview.json` or
equivalent report proving a complete G1 run for the candidate. More
importantly, the documented release path in `next.md:5-22` invokes the normal
release script, which runs checks and later creates a separate pack set at
`scripts/release.ts:442-481` and `scripts/release.ts:685-727`. A successful
dry-run therefore does not certify the exact tarballs later published.

The canary also has `g0:web` and `g0:native` but no normal `test` script at
`code/tests/v3-canary/package.json:6-16`, so generic workspace test execution
does not automatically run both gates.

**Exit condition:** make G1 the single artifact path used by the owner-approved
publish step, or call the same staging/audit implementation inside release.
Run both npm and Bun packers from a clean final candidate, retain the report and
tarball hashes, install those exact tarballs into canary, and publish those same
bytes only after explicit release approval.

### Status documents contradict source and CI

Planning drift makes it hard to tell what is done:

- `next.md:57` says animation H is in execution although H0 through H5 commits
  and implementations are present.
- `next.md:72-77` defers compound variants although they have landed.
- `next.md:94-155` preserves old performance priorities that conflict with the
  newer committed benchmark artifact.
- `plans/v3-ci-baseline.md:64-65` says Detox stayed fully green, while the final
  exact-SHA run has a failed shard.
- `plans/v3-ci-baseline.md:79-80` leaves integration attribution pending even
  though the exact-SHA Checks run is green.
- `plans/v3-animation-api.md` records only part of the landed animation work and
  still describes several pre-implementation paths.

This is a beta risk because the release checklist is being assembled from these
documents. Consolidate status into one source, link every completed item to a
commit and durable test artifact, and delete superseded queues.

## 5. What is done, what is partial, and what remains

### Done or substantially done

- Shared token-first style grammar and generated style property registry.
- Tailwind 4.3.0 hybrid integration with Tamagui candidate filtering and
  compiler/integration coverage.
- TS-style variant resolvers, context variants, static class strings, and
  compound variants.
- Shared compiler graph/IR and lowerer foundations with Vite, Metro, SSR,
  compiled JSX, cache-isolation, and Turbopack tests.
- Removal of active core/UI `TAMAGUI_HEADLESS` and `unstyled` branching.
- Behavior-first Button and substantial Sheet/Select separation.
- Animation API implementation across CSS, native Animated, Reanimated, and
  Motion, including public transition lifecycle work.
- G0 web coverage for development, HMR, production, SSR, hydration, and basic
  Button/Select/Sheet interactions.
- A thoughtful G1 dry-run implementation.
- Exact-SHA web Checks, integration, SSR/hydration, bundle observation, and
  Maestro success.
- Removal of the planned deprecated packages from active package discovery.

### Partial

- Behavior-only conversion across the full public component fleet.
- Aesthetic skin extraction and v2 compatibility coverage.
- Animation correctness. CSS completion/value propagation issues and known
  Reanimated rapid-exit skips remain at
  `code/kitchen-sink/tests/TabHoverAnimation.animated.test.tsx:222-229` and
  `code/kitchen-sink/tests/TabHoverAnimation.animated.test.tsx:403-411`.
- Compiler performance. Functional architecture is covered more deeply than
  cold/warm build cost and invalidation scaling.
- Bundle governance. Deltas are collected but not enforced, and native bundle
  budgets are absent.
- Canary coverage. Web proves a narrow happy path; native does not exercise the
  hardest new primitive/skin boundaries.
- Migration documentation and v2 deprecation guidance.
- Release artifact proof and linkage to the actual publish path.

### Missing or blocked

- A coherent, supported v2-compatible styled kit.
- A shadcn registry and copy-paste kit.
- Uniform state attributes and native/class modifiers for copied skins.
- Copied skins in the Expo starter and meaningful starter tests.
- A fully green exact-candidate iOS run.
- Truthful Android CI and a fixed Android AppCompat launch.
- One iOS and Android production bundle evidence.
- An equal-workload v2 versus v3 performance report.
- Durable G1 evidence for the exact tarballs that would be published.
- A current single beta checklist.

## 6. Prioritized path to beta

### Gate 1: finish the product contract

1. Complete the behavior/aesthetic separation across every public component
   package. Review structural-style allowlists package by package.
2. Create one canonical v2-compatible skin source. Derive kitchen-sink, demos,
   canary, docs, and starters mechanically from it.
3. Define and implement the shared component-state vocabulary across web,
   native, variants, data attributes, and class grammar.
4. Build a real shadcn registry for a focused beta set, then install it into
   clean web and Expo fixtures in CI.
5. Expose and document one supported path for each layer. A user should be able
   to answer, from an import alone, whether they own the appearance.

Acceptance:

- No theme colors, visual padding scales, radii, borders, elevation, or
  opinionated interaction styles remain in behavior packages outside a reviewed
  structural allowlist.
- Every compatibility skin has one canonical source and parity tests.
- A blank consumer can install/copy both kits, build, and run without importing
  `@tamagui/demos`.
- Starter, kitchen-sink, docs, and canary consume the same artifacts.

### Gate 2: close correctness and migration bugs

1. Fix Dismissable dynamic pointer-event bookkeeping and test stacked toggles.
2. Fix nested Button semantics and keyboard/click propagation.
3. Replace CSS exit timer aggregation with actual animation completion.
4. Fix CSS animated-number linked values and frame-render behavior.
5. Add Popover `aria-controls` and shared popup conformance tests.
6. Correct Select/Button/design-system migration docs and compile every snippet.
7. Remove or fix tests that currently assert invalid semantics.

Acceptance:

- New tests fail on the audited source and pass on the fix.
- Popup conformance covers controlled/uncontrolled state, focus, escape,
  outside interaction, animation completion, force mount, and adaptation.
- Migration fixtures submit forms and exercise copied Button sizes.

### Gate 3: make release evidence truthful

1. Fix Android AppCompat launch and remove both `continue-on-error` and shell
   failure swallowing.
2. Stabilize or redesign the iOS compiler benchmark, then get the complete
   exact-candidate Detox matrix green.
3. Produce One iOS and Android production bundles and retain artifacts.
4. Make G1 the artifact source for release, run both packers, and save report,
   manifest rewrites, tarball hashes, and canary results.
5. Replace starter placeholder tests with real web/native checks.
6. Consolidate the release checklist and remove stale status claims.

Acceptance:

- One candidate SHA has green Checks, SSR/hydration, Maestro, all iOS Detox,
  blocking Android Detox, starter smokes, One production bundles, G0, and G1.
- The tarballs installed by G0/G1 are the exact tarballs queued for the
  owner-approved publish.

### Gate 4: establish performance confidence

1. Repair the benchmark matrix and add v2.4.6 with equal workloads and
   production builds.
2. Remove the universal render-path dead merge and no-compound allocations.
3. Move Motion style resolution out of the per-value callback.
4. Split CSS host transitions from JS-linked animated-number work.
5. Add Vite cold/warm/HMR scaling benchmarks and restore cache/dedup/parallelism
   where measurements justify it.
6. Add Metro project-size benchmarks and incremental cache publication.
7. Move optional Tailwind runtime/build dependencies behind explicit entry
   points and cache candidate work.
8. Enforce reviewed web and native bundle budgets.

Acceptance:

- The report records raw samples and confidence, not one trimmed sample.
- v3 has explicit regression budgets versus v2 for runtime, cold build, HMR,
  Metro startup, JS/CSS bundles, native production bundles, and install size.
- Heavy and animated scenarios have an owned target or a documented beta
  limitation.

### Gate 5: cut the beta

After Gates 1 through 4, rerun the full release candidate from a clean checkout,
freeze the report artifacts, update the migration guide and beta announcement,
and request explicit owner approval for publication. Publication itself is
outside this review and must remain a separate authorized action.

## 7. Suggested beta exit checklist

- [ ] Public component fleet has one documented unstyled behavior contract.
- [ ] v2-compatible kit is canonical, complete for the beta set, and tested on
      web and native.
- [ ] shadcn registry installs into clean web and Expo consumers.
- [ ] Shared state attributes/modifiers style copied parts on web and native.
- [ ] Dismissable, nested Button, CSS exit, and animated-number issues are fixed.
- [ ] Select/Button/variant migration examples compile and behave as written.
- [ ] Exact candidate has green blocking iOS and Android native CI.
- [ ] One production bundles succeed for iOS and Android.
- [ ] Expo starter uses copied skins and passes real smokes.
- [ ] v2-versus-v3 benchmark uses equal production workloads and retained raw
      samples.
- [ ] Heavy and animated performance has an accepted budget.
- [ ] Vite and Metro cold/warm scaling is measured on representative projects.
- [ ] Web and native bundle budgets are enforced.
- [ ] G1 audits the exact tarballs later passed to the publish command.
- [ ] One current status document replaces contradictory queues.
- [ ] Owner explicitly approves the beta publish.

## 8. Review method and limitations

The review used an immutable archive of
`5418244f4a00ad4331144115f76fdb388885ec0a`, not the divergent shared working
tree. It inspected the 313-commit diff from v2.4.6, public package exports,
component behavior and skins, compiler frontends and cache paths, universal
style/render paths, four animation drivers, benchmark harnesses and artifacts,
canary/release scripts, starters, migration docs, and exact-SHA CI results.

Two independent adversarial passes covered architecture/API and performance;
a third covered release status and plan/source drift. Focused local
measurements were used only for isolated enumeration and dependency-size facts.
They are identified as such. No source-level risk is presented as an end-to-end
measured regression.

This review did not publish packages, mutate product code, or claim visual
parity from screenshots. The beta should retain durable outputs from the
recommended production, native, bundle, and G1 runs so the final decision can
be made from one exact candidate rather than accumulated session history.
