# Native fast path: zero-re-render style updates via ShadowTree commits

Researched 2026-08-04. Status: design, pre-implementation. Target lane: v3-beta,
as an opt-in experimental feature.

## Goal

On native, style changes driven by app state (theme today; media, press, group
press, container queries later) should commit directly to Fabric's ShadowTree
from C++ with zero React re-renders. This is the same mechanism Unistyles 3
and Uniwind Pro ship in production, but Tamagui's compiler can go further:
they resolve styles at runtime from parsed CSS, we can emit fully-resolved
per-theme style matrices at build time, so the runtime does no resolution at
all.

This also fixes the worst compiler outcome today: a component with a single
themed value can't fully flatten and keeps a hook plus HOC, making one theme
token dramatically more expensive than zero. On the fast path that component
becomes pure data with no subscription.

## Prior art and why this is a clean-room rebuild

PR #3916 (`feat/native-style-op`, plus the earlier
`native-style-optimization-prototype` branch folded into it) proved the idea
end to end in Feb 2026: compiler style matrices, Nitro C++ registry,
`UIManager::updateShadowTree`, verified zero re-renders on iOS. Treat it as a
quarry for references, not a base to rebase:

- Its merge base is ~6 months of main behind v3-beta, and v3 has since removed
  component themes and made theme output deterministic, which deletes the
  problems the branch spent iterations hacking around (901-theme explosion,
  name-pattern filtering, nondeterministic values).
- It carries a pre-0.81 manual clone-and-commit C++ path. v3 targets RN >= 0.82
  (see `plans/react-native-style-capabilities.md`), where the New Architecture
  is mandatory and `updateShadowTree` (RN core PR #50020, 0.81+) always exists.
  That whole path is dead weight now.
- It has real defects worth designing out rather than patching: theme fallback
  logic exists in JS (`dark_blue` falls back to `dark`) but not in C++ (exact
  key lookup, silent skip on miss); unlink re-derives the ShadowNode from the
  ref at cleanup time, which can leave dangling `ShadowNodeFamily*` entries;
  mutex discipline is ad hoc; the theme dependency is hardcoded rather than one
  of several dependency kinds.
- Its scope stops at themes. We now know we want media, press, group press,
  and container queries to slot into the same engine, so the registry design
  must be dependency-generic from the start.

External prior art to keep reading as we build:

- Unistyles 3.x (jpudysz): Nitro + ShadowTree commits, several RCs spent on
  the ShadowTree algorithm, list virtualization, and Reanimated coexistence.
- Uniwind Pro (same author): second-gen C++ engine, compile-time dependency
  mapping (Theme, ColorScheme, Dimensions, Orientation, Insets, FontScale,
  Rtl), per-className resolved-style caching keyed by a component-state
  bitmask, separate update queues for suspended trees. Their hardest problem
  was timing ShadowTree commits so both React and Reanimated respect them.
- RN 0.85 shipped a shared animation backend (core Animated + Reanimated on
  one native backend, with Software Mansion). The commit-conflict landscape
  Uniwind fought predates this; re-verify against 0.85+ rather than porting
  their workarounds.

## Ecosystem direction (why now)

- RN core still has no CSS variables (`discussions-and-proposals#722`, open
  since 2023) and no `calc()`; nothing shipped as of 0.87-rc.
- Expo is building native CSS and vanilla Tailwind support with Mark Lawlor
  (NativeWind), with Material 3 dynamic colors called "a key primitive" of it;
  CSS grid is landing in Yoga. The ecosystem is converging on
  styles-as-data-updated-outside-React. Our compiler contract (resolved style
  matrices keyed by dependency state) is engine-agnostic: if RN core ever
  ships variable-like primitives, the compiler retargets them and the C++
  registry shrinks. Design the compiler output format as the stable contract,
  the engine as replaceable.
- RN 0.87 introduces Props 2.0 (`setProp`); watch it as a possible future
  update primitive.

## Design

### One engine, many dependency kinds

A single Nitro HybridObject, `TamaguiRegistry`, owning:

- `views: ShadowNodeFamily* -> { slots: Slot[] }` where a Slot is
  `(kind, key, props)`. Kinds: `base`, `theme` (key = scope id), later
  `media` (key = query name), `press`, `groupPress` (key = group id),
  `container` (key = group id + condition).
- `state`: current theme per scope, media match map, pressed groups,
  container sizes. Each dependency kind is one state table plus one
  invalidation rule; the commit path is shared.
- On any state change: collect affected views, merge slot props in fixed
  precedence order (base < theme < media < group/container < press), emit one
  batched `updateShadowTree` commit.

v1 implements only `base` + `theme`. The point of shipping the generic slot
model anyway is that media/press/container each become: a compiler emitter, a
state setter, an invalidation rule. No engine rewrite per feature.

### Compiler contract

Behind `experimental.nativeFastPath` in Tamagui build options. The flag only
changes native compiler output. For a
statically extractable element with themed values, emit the resolved matrix:

- Per-theme props fully resolved at build time from the deterministic v3 theme
  output. Identical themes deduped; aliases expanded at build time so the
  runtime and C++ do exact key lookup only. No resolution, no fallback chains,
  no name parsing at runtime. If a theme key is missing at runtime it is a
  compiler bug: dev-mode assert, never a silent skip.
- Colors pre-processed to ints at build time (Fabric's C++ parser takes ARGB
  ints, not CSS strings), not per-link at runtime like the old branch.
- Bailouts (ternaries, spreads, dynamic values) keep today's output exactly.
  Widening bailouts (pre-computing both ternary branches) is future work, not
  v1.

What changes, concretely (today's native output verified in
`code/compiler/static-tests/tests/themedFlatten.native.test.tsx`):

```tsx
// source
<Square bg="$background" borderColor="$color" width={40} />

// today, uncompiled: styled -> createComponent -> useThemeWithState hook,
// every themed component re-renders on any theme change (measured:
// 125-170ms for 500 components per sub-theme toggle)

// today, compiled (v3 native flattening): flattened element, but the themed
// key becomes a live hook read - the "one theme value forces a hook" state:
const _theme = useTheme()
<View style={{ width: 40, backgroundColor: _theme["background"]?.get(), ... }} />
// cheaper per render, but still N re-renders per theme change

// fast path, runtime mode (built): uncompiled components intercept the theme
// listener, commit natively, skip the re-render entirely

// fast path, compiler mode (next): flattened element + link with the resolved
// per-theme matrix, NO hook at all:
<View ref={link({ state: { light: {...}, dark: {...}, light_red: {...} } })}
      style={{ width: 40 }} />
// theme change = one engine commit, zero JS per component
```

### Runtime contract (JS)

- A minimal host component per element type (view/text) that renders the RN
  primitive, reads the current theme once without subscribing, and
  links/unlinks with the registry. No HOC, no memo tricks doing correctness
  work.
- A JS mirror of registry state (current theme per scope) so that when React
  does re-render a linked component for unrelated prop changes, it renders
  the current styles and cannot revert a native commit. Spike whether this
  makes `nativeProps_DEPRECATED` syncing (Unistyles' approach) unnecessary;
  prefer the JS mirror as the single mechanism if evidence supports it.
- `Theme` publishes scope changes to the registry. Without the native module
  or off the fast path, everything behaves exactly as today. One fallback
  boundary, not per-feature forks.

#### Runtime integration mode (built 2026-08-04, the beta path)

Two engine modes share the commit tail. The compiler mode (scope broadcast +
pre-filled state tables via `setStateName`) is the end state. The runtime mode
ships first because it needs no compiler work and keeps every Tamagui
resolution semantic (nesting, sub-themes, variants) in the code that already
implements them:

- Core (`@tamagui/web`) exposes `setNativeStyleEngine(engine)`; the engine
  interface matches `@tamagui/native-registry` exactly, so wiring is
  `setNativeStyleEngine(registry)`. Core has no native dependency; web never
  sets an engine. Enabling the engine IS the experimental flag.
- Eligible leaves (not animated, not HOC, no group, not passThrough) link
  their host at mount with empty slots and register a per-render
  `nativeStyleUpdate` closure.
- The theme subscription callback in `useThemeState` calls
  `props.nativeUpdate(next)` INSTEAD of forcing a re-render when it returns
  true. State maps update first, so any later natural render resolves the
  same values (mirror consistency by construction). Forced updates
  (`forceUpdateThemes`) always re-render.
- The updater re-runs `getSplitStyles` with the next theme (proxied via
  `getThemeProxied`, cache-hit per theme object) and queues
  `{id, state: themeName, props: style}`; a microtask flush folds the whole
  cascade into ONE `applyViewStates` call and one ShadowTree commit.
- Lazy warm tables: each pushed theme name is cached engine-side per view.
  Re-toggling an already-pushed theme sends `{id, state}` only — no style
  computation, zero JS beyond the queue. The pushed-set resets on every
  React render so no cached entry can outlive the props/state that produced
  it. This makes repeated toggles (the common case: 2-3 themes) converge to
  compiler-mode performance without a compiler.
- Views with a per-view active state are skipped by scope broadcasts, so the
  two modes cannot fight over a view.

#### Media queries in runtime mode (built 2026-08-04)

Media rides the same interception shape as themes, one layer over:

- `useMedia`'s per-component subscription updates its proxy mirrors first,
  then calls `stateRef.nativeMediaUpdate()` and skips the re-render when it
  returns true. The subscription only fires when a media key the component's
  styles actually reference flips (`flatMediaKeys` collects every media key
  present in props regardless of active state, so the listening set is stable
  without re-rendering).
- The media updater clears the warm cache (every cached state entry was
  computed under the old media state) and re-runs the theme updater cold
  under the current theme (`nativeThemeState` tracks the last natively
  handled theme so the recompute never uses a stale render capture). The
  captured `styleProps.mediaState` is the component's media proxy, which
  reads through the mirror updated one step earlier — fresh values with no
  extra plumbing.
- Dropped-key semantics, decided by reading RN's actual
  `nativeProps_DEPRECATED` merge in `UIManager::cloneNode` (READ, RN 0.83):
  render rawProps win for every key the render sets, sticky values persist
  for keys it omits. So the one hazard is a key pushed earlier that a later
  computation drops (media flip removing a `sm:` style, a removed prop). The
  JS side tracks the union of pushed keys per link (`nativePushedKeys`) and
  pushes `null` for dropped keys — RawProps null resets the prop to default,
  exactly what a real re-render's style diff does — and the engine erases
  null-valued keys from the sticky nativeProps so future React renders can
  set them again. Nulled keys stay in the pushed-key union because engine
  state tables retain them.
- A real render re-pushes the fresh style (with nulls) only when it detects
  previously pushed keys its own style dropped, closing the last
  resurrection window RN's sticky merge would otherwise leave open.

#### Test/demo surfaces (2026-08-04, code-complete, on-device run pending)

- `NativeRegistryParityCase`: self-checking correctness — many prop kinds,
  pinned nested sub-theme receives no updates, warm toggles send bare
  entries with zero misses, a real re-render resets the warm cache, engine
  tables inspected via the new `getViewState(id)` introspection, and a
  rotate-the-sim media check (`sm` flips at minWidth 640) that must show a
  `paddingBottom: null` reset on rotating back. Prints `[parity]` JSON.
- `NativeRegistryShowdownCase` + `scripts/record-native-showdown.sh`: the
  launch-video side-by-side — two 400-square grids, left opted out via the
  new `disableNativeStyle` prop, shared sub-theme auto-toggling, per-panel
  JS-done HUD and a shared-JS-thread jank dot; the script boots the sim,
  records H.264 via simctl, and taps start via xcodebuildmcp.

### Lifetime and threading rules (the old branch's sore spots, fixed by design)

- Link captures the ShadowNode once at mount; unlink uses the token returned
  by link, never re-derives from the ref. The engine sweeps entries whose
  family no longer resolves in the tree during commits, so a missed unlink
  degrades to garbage, not a dangling pointer dereference.
- All registry entry points run on the JS thread; assert it. No speculative
  mutexes. If a real cross-thread caller appears later (native media events),
  add a queue at that boundary, not locks everywhere.

### Module system: Nitro

Settled. The engine is C++-first (raw JSI for opaque ShadowNode wrappers,
folly::dynamic, ShadowTree commits). Nitro is built for exactly this and is
what Unistyles/Uniwind run in production, so upstream fixes for Reanimated and
Suspense interactions arrive on our stack. Expo Modules is a Swift/Kotlin DSL
with slow calls, wrong tool. C++ TurboModules work but with heavy boilerplate
and no ecosystem riding shotgun; the old branch already migrated away from
them for cause. Cost: `react-native-nitro-modules` peer dep for apps opting
in; everyone else keeps current behavior.

## Honesty protocol for benchmarks

It is easy to fool ourselves here. v3 already has a fast path for the most
demoable scenario: on iOS, light/dark scheme switches can skip re-render
entirely via DynamicColorIOS when all accessed keys are colors
(`useThemeState.ts`, `getThemeProxied.ts`). Benchmarking that scenario would
compare against Tamagui at its best and prove little. Headline scenarios must
be the cases that are genuinely slow today:

1. Android light/dark switch (no DynamicColorIOS there).
2. Sub-theme switch (`dark` -> `dark_blue`) on both platforms; forces
   re-render today.
3. Themed non-color values (space/radius tokens); deopts the
   DynamicColorIOS path today.
4. The half-flattened component: one themed value, hook + HOC today. Measure
   per-component render cost and mass mount cost.
5. 1000-row list theme switch: wall time from input to visually complete,
   dropped frames on both threads.
6. Regression guards: mount cost of 2000 linked views vs unlinked (linking
   overhead), memory delta, bundle delta from style matrices.

Method requirements:

- Release builds on real devices; measure UI and JS thread frame times, not
  render counts alone. Render counts are a secondary diagnostic (the old
  branch was fooled once by counting parent renders).
- Prove the fast path engaged: registry exposes view count and a commit
  counter; a benchmark that never increments the commit counter is invalid.
- Negative control per scenario: rerun with the registry disabled and confirm
  the numbers regress. A measurement that cannot fail is not a measurement.
- One external reference point: same scenario in Unistyles or Uniwind, so our
  claims are calibrated against the state of the art, not just our own
  baseline.

## Phases

### Phase 0: de-risking spike (before any architecture lands)

One throwaway kitchen-sink harness proving the two interactions that killed
weeks for Uniwind, on our RN target:

- Link one view, swap `backgroundColor` via `updateShadowTree`, confirm
  persistence when a parent re-render commits over it.
- Same, with a Reanimated animation running on the view and on a sibling
  (RN 0.85+ shared animation backend).
- Same, under a Suspense boundary that suspends and resumes.

Exit criteria: native-committed props survive all three, or we know exactly
which mitigation (commit traits, nativeProps sync, update queue) each needs.
This spike decides the engine's commit strategy; everything after depends on
it.

#### Phase 0 results (2026-08-04, iOS sim, RN 0.83.2, Reanimated 4.2.2)

Ran on device via `NativeRegistrySpikeCase` in kitchen-sink. The commit
strategy is decided; two failures were found and fixed, each pinned by a
discriminating run (a deliberately stale-props "box B" that only native
commits can color correctly):

- **RN's `UIManager::updateShadowTree` (0.81+) is unsafe under concurrent
  commits.** It pre-builds its clone from a revision read before the commit
  and its commit callback ignores the root it receives, so a commit landing
  in between (the same-tap React render) makes it commit a stale-based tree
  and the update is lost. Read directly from
  `ReactCommon/react/renderer/uimanager/UIManagerUpdateShadowTree.cpp`.
  Fix: the engine does its own `ShadowTree::commit` and builds the clone
  INSIDE the transaction from the callback-provided root, so retries rebuild
  from fresh state. Worth reporting upstream.
- **The JS mirror alone does not survive React re-commits of
  unchanged children.** React's tree absorbs native-updated nodes via state
  reconciliation on unrelated commits; a later React commit then re-commits
  that stale absorbed node over a fresh native update (reproduced: box B
  reverted despite a successful engine commit). Fix: sync
  `family.nativeProps_DEPRECATED` on every engine commit, which RN merges
  over props on every future clone of that family. Both mechanisms are
  needed: the mirror keeps re-rendered components consistent, nativeProps
  keeps non-re-rendered clones consistent.
- **Reanimated coexistence: clean.** A `withRepeat` transform/width animation
  on a linked view and a sibling ran through repeated engine commits with no
  lost updates in either direction (0.83's Animated backend; re-verify on
  0.85+ when v3 bumps).
- **Suspense: clean.** A linked view mounted under a suspend/resume boundary
  links and receives subsequent commits.
- **Unmount: clean.** Unlinking removes the view (count drops) and later
  commits proceed; the retained-ShadowNode design means a missed unlink
  degrades to a skipped family, not UB.
- Consequence for the compiler contract: `nativeProps_DEPRECATED` merges
  accumulate, so every state entry for a view must emit the SAME key set
  (a key present in one theme and absent in another would go stale). The
  emitter must union keys across states.

#### Benchmark results (2026-08-04, iOS sim, dev build, `NativeRegistryBenchCase`)

500 squares, each with two theme-driven colors (`$background`, `$color`) plus
static dims, toggling the `red`/`green` sub-themes (never light/dark, so
DynamicColorIOS cannot flatter the baseline). 20 measured toggles after 5
warmups, medians. "jsDone" is trigger → last React commit (React Profiler
timestamp) or the fully-synchronous engine call; it has no vsync floor.

| scenario | jsDone/toggle | React commits | control |
| --- | --- | --- | --- |
| tamagui today (unmemoized children) | 125–170ms | 2 per toggle | square-0 profiler: renders 2x per toggle |
| rn floor (inline host views, setState) | 50ms | 1 per toggle | — |
| native registry (pre-filled state tables) | 15.7–20.8ms | 0 | engine commits == toggles, misses 0 |

- The native figure is all-inclusive and synchronous: props parse, tree clone,
  Yoga layout, and sync mount for all 500 views inside one
  `ShadowTree::commit`. The React paths pay their mount off the measured JS
  timeline on top of the numbers shown.
- Native is ~6x faster than today's sub-theme change and ~2.4x faster than the
  cheapest possible React re-render, with zero React work.
- Honesty notes: dev-mode React overhead inflates the React paths (a release
  run is still owed); the first harness run measured a silent bail-out
  (squares never re-rendered) and looked 12x better for the baseline than
  reality — the per-square Profiler control is what caught it. Variance
  across app sessions was 125–170ms for the baseline; the native path held
  15.7–20.8ms.
- Amusing control that mattered: with the iOS sim in dark appearance, the
  baseline grid rendered invisibly (DynamicColorIOS resolves by OS scheme,
  and the harness forces light sub-themes). Visual verification needs the sim
  in light appearance.

### Phase 1: engine + compiler, themes only

- `@tamagui/native-registry` package: Nitro module, slot model, theme state,
  JS mirror, link/unlink lifetime rules above. RN >= 0.82 only, one C++ path.
- Compiler emit behind the experimental flag, v3 themes, dedup + build-time
  alias expansion, build-time color processing.
- Benchmark suite from the honesty protocol, checked into kitchen-sink, with
  the negative controls automated.
- Android verified in the same phase as iOS, not deferred (the old branch
  never ran Android once).

### Phase 2: experimental release on v3-beta

- Opt-in flag documented as experimental; fallback path is bit-identical to
  today when off or unavailable.
- Detox coverage: theme switch correctness (not just speed) across nested
  scopes, sub-themes, list virtualization (recycled views must re-link
  correctly), and unmount/remount churn.

### Phase 3+: additional dependency kinds, in order of leverage

- Media queries: compiler emits per-media slot props; a Dimensions listener
  (JS first; native later if the roundtrip shows up in traces) feeds
  `setMedia`; same commit path.
- Press and group press: gesture-driven slot activation. Interacts with the
  animation drivers, which already optimize press; only take this phase if
  traces show wins over the existing drivers.
- Container queries: group containers publish measured sizes to the registry;
  condition evaluation in C++.

Each phase lands only with its own honesty-protocol benchmarks.

## Open questions

- Package and flag naming is settled: `@tamagui/native-registry` and
  `experimental.nativeFastPath`.
- Whether the JS mirror fully replaces `nativeProps_DEPRECATED` syncing:
  Phase 0 answers this.
- How wide v1 extraction eligibility should be (currently: no ternaries, no
  spreads): measure hit rate on kitchen-sink and takeout before widening.
- Whether the registry should also own DynamicColorIOS interplay (a linked
  view on iOS could skip theme slots for pure-color scheme switches) or
  simply supersede it when the flag is on. Prefer supersede: one path.
