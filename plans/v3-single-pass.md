# V3 single-pass style engine plan

Status: reviewed by Fable high in `plans/v3-single-pass-review.md`. p28302
accepted the review amendments and resolved all escalated decisions. Implement
the checkpoints below on `p28910-v3-single-pass`; do not merge any checkpoint to
`v3-beta` before the owner sees the assembled result.

## Outcome

Move the runtime style path into `getSplitStyles.tsx`, because that module already
owns the authored forward order, host prop routing, class/style boundaries, and
the final component result. Moving `propMapper`, direct emission, and component
state discovery inward removes callbacks and intermediate representations. Moving
the splitter outward would preserve those wrappers.

The finished component render has one forward traversal of each authored input:
styled base, surviving defaults, styled context, caller props, each `style`
object, each variant result, each compound result, and each string value. No
authored prop or value is revisited to derive animation state, lifecycle state,
conditions, variants, token values, or output mode. No runtime `.map` or `.split`
is introduced. Hoisted scalar helpers may be called, but none may hide another
traversal of the authored input.

Required output containers are created before the pass and filled during it:
`viewProps`, inline `style`, `classNames`, `rulesToInsert`, and the returned result.
User functions may return their own objects. The engine creates no visitor,
condition, prop-entry, variant-entry, clause, or scratch object during the pass,
and creates no function during the pass. Stable per-instance hook callbacks may
be created once when the component frame is initialized, outside the pass.

The hard bundle result is core web at or below 30,000 gzip bytes. The comparison
target is V2's 29,707. The longer-term owner target remains 20,000.

## Measured starting point

All numbers in this section are **READ** measurements at
`99fba89f0cc9e3afea0a75a4aa67c1d9c75966fc`, using the runtime Vite arm and
`attribute-bundle-gzip.ts`.

| Boundary | V2 gzip | V3 gzip | Delta |
| --- | ---: | ---: | ---: |
| Tamagui core, animations removed | 29,707 | 38,980 | +9,273 |

The current marginal V3 versus V2 rows that this plan can directly change are:

| Measured row | Delta gzip | Plan owner |
| --- | ---: | --- |
| `directStyle` | +5,308 | scalar condition and direct emission in the pass |
| `propMapper` | +831 | inline variant/token routing in the pass |
| `scanFlatValue` | +697 | allocation-free scanner step API and one value traversal |
| `clausePrecedence` | +523 | scalar packed precedence during the scan |
| `modifierRegistry` | +290 | precompiled numeric kind/rank lookup |
| `states` | +283 | runtime state constants folded into the condition switch |
| `stateModifiers` | +63 | aliases folded into the same switch |
| style grammar `config` | +24 | platform rank folded into the same switch |
| `useComponentState` | +126 | lifecycle and platform-pseudo rescans removed |
| `createComponent` | +170 | merge/preprocess/state orchestration removed from it |
| web `tokenCategories` | +318 | one property/category lookup in the fused emitter |
| `insertStyleRule` | +366 | direct rule completion with no separate flush path |
| `getCSSStylesAtomic` | +102 | ordinary atomic lowering absorbed by the one emitter |

**READ**: the six style-grammar rows total 1,880 marginal gzip. The three main
runtime rows, `directStyle`, `propMapper`, and `useComponentState`, total 6,265.

**READ**: marginal gzip rows are not additive because every removal changes the
gzip dictionary. The numbers above identify the measured byte pools each step
must move. They are not promised savings. Every checkpoint below reruns the exact
whole-core measurement. A row disappearing while whole core stays flat is a miss,
not a success hidden behind attribution.

The current declaration attribution provides a second receipt for the hot
pieces. **READ**: `directAtomic` is 482 gzip, `getCondition` 443,
`contributeStyleString` 344, `normalizeTransitionNames` 254,
`tokenVariable` 262, `emitBorder` 167, and `emitProperty` 152. In `propMapper`,
`resolveTokensAndVariants` is 338, `matchesVariantResolver` 276,
`resolveVariantValue` 251, and `propMapper` 235. In `useComponentState`, the two
extra scanners are `lifecycleVisitor` 82 and `hasFlatModifier` 73. Declaration
rows overlap after minification and compression, so they are diagnostic rather
than additive.

## Settled decisions

These are owner decisions. The reviewer should check that the design implements
them, not choose among the rejected alternatives.

### Presence hook

**READ, owner decision relayed by p28302**: call `usePresence()` unconditionally
for every component. Its no-provider path is one context read followed by an
early return. Do not change the animation-driver presence contract.

**READ, accepted Fable amendment**: `usePresence` currently returns before its
effect when the context is null. `ResetPresence` can change that context between
null and non-null, so a naive universal call changes the hook count. The hook
must always call its effect and make the no-context branch a no-op inside that
effect.

Core imports the hook directly from the `@tamagui/use-presence` package root and
calls it before any authored input is inspected. The call never depends on the
selected driver, `isStub`, `animatedBy`, a transition prop, or a parsed clause.
Every animation driver and `PresenceChild` already imports the same package
root. Core must use that exact root too, with no subpath copy or local context
re-export. A source and built-artifact integration test mounts a Tamagui
component under the real `AnimatePresence` provider and proves the provider and
core consumer observe one context instance.

The hook receives the stable component frame. Its effect runs after the pass
has finalized the frame's animated flag and registers only when that flag is
true. It also unregisters when a previously animated component becomes
ineligible or unmounts. The context read and effect call are universal; the
`register(id)` call is conditional. This preserves today's registering
population while fixing hook order.

**READ, accepted Fable amendment**: every consumer under one `PresenceChild`
currently receives the same id, and unregister deletes that id from the shared
map. Universal registration would let an unrelated descendant unmount delete
the animated descendant's registration and silently complete the exit. Add a
test with an animated exiting descendant plus a non-animated conditional
descendant. Unmounting the non-animated descendant must not complete the exit or
delete the animated registration.

### Refusal semantics

**READ, owner decision relayed by p28302**: a malformed clause discards that
clause only. A valid base and every other valid clause still emit. For example,
`none hover:red unknown:blue` emits `none` and `hover:red`, and drops only
`unknown:blue`.

The same rule applies to a bad base segment: drop that segment and continue at
the next structurally discoverable clause. An unterminated string, comment, or
function can consume the remaining source, so there may be no later boundary to
recover. This is still per-segment refusal; the lexer must not invent a boundary
that CSS does not have.

`parseValue` remains the canonical semantic receipt. Its failure result gains the
partial `ParsedValue` beside diagnostics. Tooling that requires a clean input may
continue to stop on `ok === false`; the compiler and runtime consumers use the
valid segments and surface the diagnostics. There is one parser result, not a
strict parser plus a recovering parser.

### Narrow re-derivation exception at user-code boundaries

**READ, owner decision relayed by p28302**: condition state may be re-derived
after invoking user code, and only at that boundary. The canonical condition
identity is a string. It cannot live in the numeric reentrant arena, while a
functional variant, getter, proxy trap, or authored coercion can synchronously
re-enter the same pass and invalidate a module-local string slot.

The engine therefore keeps numeric source offsets across the user-code call and
re-derives only the condition state that could not safely cross it. This
permission applies only when the engine invokes user code and only to that
condition. It does not permit rescanning a declaration, revisiting another prop,
or re-deriving a condition at an ordinary internal boundary. The exception is
about the string type crossing reentrancy, not convenience.

### Compound anchoring arena

**READ, owner decision relayed by p28302**: compound anchoring uses one module
level numeric arena and a stack cursor. It does not use a cache, a stack of
arrays, or an array per component. The arena is a `Float64Array`; it contains
numbers only.

The concrete frame discipline is:

1. A pass records `base = arenaTop`.
2. It reserves fixed scalar frame cells plus two cells per compiled compound.
3. A compound record stores the frame epoch in one cell and packed
   seen/failed/emitted state in the other. Old cells are initialized lazily when
   an edge first touches them, so frame entry does not clear the region.
4. Nested work starts at the current `arenaTop`, writes above the outer frame,
   and restores its own base when it returns.
5. Every access is `arena[index]` through the module binding. Code must never do
   `const localArena = arena` across a functional variant or another call that
   can re-enter.
6. Frames retain integer offsets only. They never retain slices, array
   references, or references to arena-backed records.
7. A `finally` restores `arenaTop = base`, including when an authored functional
   variant throws.

Reservation at frame entry is the only capacity check. Growth happens only
there, and every write stays within the entering frame's reserved range by
construction. An out-of-bounds typed-array write would be silently discarded,
so no write may rely on the array to detect or repair a missed reservation.

The initial arena has 2,048 numeric cells. The fixed frame header is capped at 32
cells and the compound record width is two, so the protected 1,005-compound case
uses 2,042 cells. If `required > arena.length`, growth doubles until it fits,
copies by index, replaces the module binding, and keeps the larger arena for the
process lifetime. It never shrinks. A 1,005-compound outer frame leaves only six
cells, so an inner reentrant frame deliberately exercises growth while the outer
frame is live. A component beyond the witnessed ceiling, or enough nested frames
to cross it, pays one growth allocation and subsequent renders reuse it. A
miss-heavy cache, eviction policy, and adversarial string-key leak do not exist.

If implementation needs more than 32 fixed cells or more than two cells per
compound, this capacity calculation must be updated before code lands. It may
not silently turn 2,048 into a magic number that no longer covers the 1,005 case.

## Reentrancy proof

**READ**: `propMapper.ts` calls an arbitrary authored functional variant while
the outer `getSplitStyles` pass is live. `getSplitStyles` is exported, so that
function can synchronously start another style pass.

**READ**: I ran a discriminating runtime probe. An outer functional variant set
an `outerActive` sentinel, synchronously called `simplifiedGetSplitStyles` for an
inner component with a matching compound variant, then cleared the sentinel.
The inner contribution observed `outerActive === true`, and the test passed
1/1. If the pass were non-reentrant, the inner observation would have been
false. The temporary probe was removed after the observation; its log is
`/tmp/p28910-reentrancy-probe.log`.

**INFERRED**: a single reusable buffer with `length = 0` would overwrite the
outer compound state. The accepted arena watermark design preserves every outer
cell below the inner base at arbitrary nesting depth.

Every authored read is a possible user-code call. This includes functional
variants, own getters on variant definitions and results, getters or proxy traps
on caller props, style objects and styled-context values, and authored
`toString` coercion. No module-level mutable state may remain live across one of
those reads unless it is protected by numeric arena offsets. The permanent
reentrancy suite covers both a functional variant and a getter. Its growth case
uses a 1,005-compound outer frame, enters an inner pass after the outer cells are
live, forces arena replacement, then proves the outer compound still emits.

Audit existing mutable singletons during each collapse. `directStyle`'s
`tokenLookup` remains safe only if it is filled and fully consumed without an
authored read between those operations. `getThemeProxied` remains hook-phase
only; a pure reentrant style pass must never repoint its theme tracking globals.
The scan globals in `useComponentState` disappear with that module.

## Final runtime shape

### One authored contribution stream

The pass consumes sources in this order:

1. static base style;
2. styled defaults displaced by a caller program;
3. default and styled-context props that are not overridden;
4. caller props in their own enumeration order.

Each source is read once. The existing `mergeComponentProps` output object and
the `forEachPropInForwardOrder` entry arrays disappear. Scalar control reads
such as `transition`, `disableClassName`, `animatedBy`, and `disabled` use one
priority lookup over caller, context, and defaults. That lookup does not
enumerate an object.

Static configuration compilation builds these immutable structures outside a
render:

- variant resolver keys, without runtime `split('|')` or `map`;
- compound selector edges grouped by selector key, in inherited authored order;
- compound style property ranges;
- media ranks, modifier kind codes, aliases, and condition selector metadata;
- styled-default entries that can be displaced;
- frontend candidate metadata that is independent of call-site values.

Configuration installation owns config-dependent tables. Component creation or
`styled()` owns static-config-dependent tables. A first component render is not
the compilation point.

When the forward cursor reaches a final prop key, it visits that key's compiled
compound edges. Each edge is visited once. It compares scalar matchers with
`Object.is`; readonly matcher arrays use a plain index loop and no `.some`
callback. When the seen count reaches the selector count, the compound style
range is fed immediately into the same contribution path. This preserves the
current rule that a matching compound runs after its last selector and before
any later caller contribution.

Only merged prop sources feed compound selector edges. Static base-style
contributions do not satisfy a selector, matching the current
`processedProps`-only behavior.

Absent selector keys require explicit handling because the current matcher reads
`props[key]` and can therefore match `undefined`. Static metadata has an
absent-edge list. At frame start those edges perform direct membership reads
against the three prop sources and seed only selectors that are truly absent.
A present prop whose authored value is `undefined` is instead visited at its
authored position and anchors the compound there. This walks compiled selector
metadata, not the authored props or their values. Tests cover absent and
present-but-undefined selectors and their different positions relative to later
props.

### Stable merged-props view

Functional variants currently read final sibling/default/context values through
`extras.props`, including values whose authored contribution occurs later. The
pass cannot build a partial object and change that contract.

Each component frame therefore owns one stable props view, allocated once with
the frame outside the pass. Property reads resolve caller, styled context, then
defaults without enumerating those objects. Reentrant passes use their own frame,
so an outer functional variant that calls an inner splitter and then resumes
still reads the outer view. Direct non-component calls create the same frame in
their public wrapper and run the same engine.

Before implementation, search all `extras.props` consumers again. If any
production consumer enumerates, spreads, freezes, retains for later use, or
depends on property descriptors, preserve that observation in a behavior test
and extend the stable view. Do not add a merged-props prepass.

### Scalar flat-value scan

`scanFlatValue` is refactored into the shared grammar's scalar transition
primitive plus its allocation-friendly tooling wrapper. The runtime owns the
single character loop for the current value and drives the transition primitive
one character at a time. The canonical parser drives the same transitions when
it builds `ParsedValue` and diagnostics. This keeps one lexer without a runtime
visitor object or a function that secretly loops over the string.

The runtime scan tracks segment validity separately for the base and each
clause. It emits a valid segment when its boundary is known. A bad modifier,
empty payload, or invalid character marks only that segment. Lifecycle and
platform-pseudo flags are set only by valid, nonempty clauses.

The current `Condition` object, canonical modifier array, kind array, wrapper
array, and `Set` disappear. Numeric slots hold modifier kind and rank codes for
the grammar's bounded non-platform depth. A packed number carries active/emit,
enter/exit, unsupported-native-state, platform rank, depth, category rank, and
within-category rank. Precedence comparison remains one integer comparison.

An arbitrary configured media/theme/group/container vocabulary cannot be put in
a collision-free fixed-width JavaScript bitmask without imposing a new config
limit. Exact CSS condition-set identity therefore uses the canonical condition
string already required to emit its selector and wrappers. Inline/native paths
do not build CSS selector strings. The string stays in an ordinary local only
while no user-code boundary can re-enter. Across such a boundary, numeric source
offsets survive in the arena and the condition is re-derived under the narrow
exception above. Hash-only identity is rejected because a collision would merge
unrelated clause slots.

### Variant values and style objects

Static variant objects are compiled to property ranges. Functional variants are
called directly and their returned object is traversed once, in place, without
`resolveVariantValue`, `resolveTokensAndVariants`, normalized result objects, or
entry arrays. Nested variants feed the same contribution path. User-created
variant output is not copied.

Before traversing a variant result, perform one direct `fontFamily` read (or its
configured shorthand) and update the active font scope. This preserves current
order-sensitive behavior where `{ fontSize: '$5', fontFamily: '$heading' }`
resolves `$5` against the heading scale even though `fontSize` enumerates first.
The read is O(1), not a traversal, and is treated as a possible getter reentry.
Add a test that uses different token values in the old and new font scales so a
wrong order is observable.

On native, a later `unset` contribution deletes the already-produced expanded
output keys. This is a backward mutation of output, not a second authored-input
pass. Keep the existing styled-default clear test and add an earlier ordinary
prop followed by shorthand `unset` so the fused variant and direct paths are
both pinned.

The `style` prop retains authored position. Each array member and each style
object property is consumed once. While that existing traversal reads a value,
it also checks whether the value carries React Native's `_animation` marker and
sets the frame animation bit. There is no marker pre-scan. RNW `$$css` maps,
accepted substyles, transform conflict handling, original token provenance, and
frozen-parent behavior retain their inventory tests. Any scratch needed to
pause and resume a nested source is stored as integer frame state in the arena,
not as a closure or object.

The Tailwind frontend no longer returns a preprocessed props object. Its static
descriptor supplies scalar candidate transitions that the core className loop
drives. Core owns the one className character traversal; the frontend may
classify a range but may not loop the source again. Claimed programs feed the
same emitter at that className position, and passthrough text appends at the same
position. This removes `STYLE_FRONTEND_PREPROCESSED` and the second prop object.

### Hook and state sequencing

`getSplitStyles.tsx` exposes one component hook entry and one pure entry for the
existing no-rerender updates and public direct callers. Both use the same engine.
The component entry performs hook setup, then calls the engine once.

Hook order is fixed as follows:

1. hydration and stable frame hooks;
2. unconditional direct `usePresence()` with registration deferred to its
   post-pass frame flag;
3. component state storage;
4. theme and media hooks;
5. the one authored-input pass;
6. effects and animation-driver consumption of the completed frame.

Component state storage is initialized once per instance. On a first render the
unmounted state is provisional until the pass either encounters a valid enter
clause or reaches the end. No earlier value needs to be replayed: an enter clause
becomes active at its own boundary, while values before it are not conditioned on
that later clause. By the end of the pass `hasEnterStyle`, `platformPseudo`,
`hasAnimationProp`, `shouldEnter`, `isAnimated`, `willBeAnimated`, `noClass`, and
the initial unmounted state are final before createComponent consumes them.

A declared transition is an O(1) merged-key membership read. Raw animated style
values are different: their marker lives on each user-authored property value,
so it is discovered during the sole `style` traversal. Earlier contributions
remain in resolved output slots while output mode is provisional. When the
marker sets the animation bit, those slots require no authored input replay;
the already-required output completion serializes them under the final
class/inline mode. Future contributions use the finalized bit directly.

**READ**: `_animation` is a public, load-bearing path. Tamagui's exported View
style type includes React Native `ViewStyle`; that type accepts
`Animated.AnimatedNode` for animatable values, and `Animated.Value` carries the
marker. Commit `9cda0cdceb` intentionally added this check when deciding whether
a component takes the animation path. The existing `RawAnimatedValueCase` uses
`AnimatedView`, so it does not test this Tamagui consumer. Add a direct Tamagui
component test with a user-supplied animated value and prove it selects and
updates through the configured animated path. Do not replace this with a
Tamagui-owned top-level marker or conservatively disable classes for every
component with a `style` prop.

Platform-driver pseudo support is known before the pass, while whether this
component uses hover/press/focus is finalized during it. The component may
prepare the stable driver lane unconditionally, but subscribes and calls the
animation emitter only when the completed frame says `platformPseudo`. Do not
turn every component under a platform driver into an animated component.

### Output completion

All token resolution, shorthand/family expansion, precedence, condition
activity, transform composition, border defaults, shadow lowering, host prop
routing, and rule-slot decisions finish during the contribution that owns them.
`fixStyles`, `styleToCSS`, `mergeFlatTransforms`, `flushDirectStyles`, and the
class-list split/join path are either folded into those writes or reduced to
serialization of already-produced output. Output serialization must not read an
authored prop, style value, variant value, or source string again.

This is a literal proof obligation for the implementation. In particular,
current `directAtomic` rewrites earlier rule selectors and `flushDirectStyles`
walks atomics after the prop pass. The replacement must preserve deterministic
later-same-priority CSS behavior across global rule insertion order without
rescanning authored values. If that cannot be done with the flat output/arena
records, stop and report the protected behavior precisely. Do not weaken CSS
cascade determinism or call an output rewrite an input pass.

## Bisectable implementation order

Every step ends green for its named tests and records whole-core gzip. These are
branch checkpoints for review and bisection, not permission to merge partial work
to `v3-beta`.

### 1a. Stream compounds over the existing merged props object

Land:

- static compound metadata compilation outside render;
- the 2,048-cell `Float64Array` arena and stack cursor;
- compound matching and immediate contribution at the last selector while the
  existing `processedProps` object is still the stream source;
- no per-render `Object.entries`, compound `Map`, entry tuples, or arrays;
- absent and present-but-undefined anchoring, with base-style contributions
  excluded from compound selector state;
- the narrow condition re-derivation rule documented in `CONTRIBUTING.md`.

Verify:

- web, native, and iOS compound suites, including 1,005 compounds;
- a permanent nested functional-variant reentrancy test and a getter-based
  reentrancy test;
- a growth-under-nesting test where the outer 1,005-compound frame remains
  correct after the inner frame replaces the arena binding;
- compound tests proving base style does not satisfy a selector, absent and
  present `undefined` anchor differently, and authored order stays unchanged;
- source and dist package builds.

`getSplitStyles` is already 287 smaller than V2, so this checkpoint has no
positive delta pool to claim. Its measured target is removal of compound-path
allocations with no whole-core or `getSplitStyles` gzip regression. Any size
increase is reported before 1b rather than absorbed into it.

### 1b. Remove the merged props object

Land:

- direct default, styled-context, and caller traversal in the verified current
  enumeration order;
- presence-based default displacement and undefined-context skipping;
- one stable per-instance `extras.props` view with scalar reads against caller,
  context, then defaults;
- removal of the component render's `mergeComponentProps` output allocation;
- no changes yet to `propMapper`, the value grammar, condition resolution, or
  emission.

Verify:

- default, styled-context, overridden-context, caller order, HOC/asChild, and
  parent merge suites;
- production functional variants that read later siblings through
  `extras.props`, including Button, SizableText, Input, Slider, and Tabs paths;
- a reentrant functional variant resumes with its outer stable props view;
- source and dist package builds.

Measured pool this step must move: the relevant `createComponent` +170 and any
now-attributable `mergeProps` bytes. A flat whole-core result is a miss and is
reported before 1c.

### 1c. Absorb propMapper without changing grammar semantics

Land:

- static variant resolver metadata outside render;
- inline variant, shorthand, token, embedded-token, safe-area, and native
  `unset` routing in `getSplitStyles.tsx`;
- direct traversal of variant results with the O(1) font-family scope read
  before their property loop;
- a tree-shakeable compatibility shell only where an exported helper remains
  required; the component runtime no longer imports `propMapper`;
- current whole-declaration refusal preserved in both prop and variant paths.
  Per-clause refusal does not change until 2, when both paths change together.

Verify:

- variant resolver, spread variant, styled-context token, shorthand variable,
  accepted substyle, and authored-order suites;
- a font-family hoisting test whose font-size token differs between the old and
  selected family;
- native `unset` clears styled defaults and prior ordinary or shorthand output;
- conditional variant values still use the pre-change refusal contract at this
  checkpoint;
- source and dist package builds.

Measured pool this step must move: `propMapper` +831. Record its marginal row and
whole-core gzip separately; disappearance of the row without a whole-core drop
is a miss.

### 2. Fuse the scalar lexer, condition number, and emitter

Land:

- partial per-clause parser results and diagnostics;
- runtime scalar scanner driven inside the contribution;
- per-clause refusal with immediate good-clause emission in both direct style
  and variant-value paths in the same commit;
- packed condition flags/precedence and scalar modifier slots;
- direct token, border, shadow, transition, transform, atomic, and inline writes;
- removal of runtime `Condition`, visitor objects, per-clause arrays and sets;
- removal of the component runtime import of `directStyle` and generic grammar
  aggregation helpers;
- one property/category lookup, while retaining the raw helper tables consumed
  by `@tamagui/helpers/validStyleProps`.

Verify:

- update `parserAgreement.web.test.tsx` for partial success and add good clauses
  both before and after a bad one;
- emitter parity, flat-value program web/native/SSR, conditional variant value,
  nested media/platform, clause precedence, transform family, border, shadow,
  transition, token category, safe area, and frontend program suites;
- group and container clause output plus subscription updates, including
  `groupNotifications.web.test.tsx`, the group/container cases in
  `getSplitStyles.web.test.tsx` and `getSplitStyles.native.test.tsx`,
  `mediaKeyedSubscriptions.web.test.tsx`, `GroupProp.test.tsx`,
  `GroupUseCases.test.tsx`, and `GroupPressInVariant.test.tsx`;
- compiler/runtime agreement on partial values;
- source and dist package builds.

Measured pool this step must move: `directStyle` +5,308, the six grammar rows
totaling +1,880, and web `tokenCategories` +318. This is the main bundle
checkpoint. If the whole core does not fall materially here, the design missed
the cause and implementation stops before more churn is added.

### 3. Fold component state discovery and hook setup into the module

Land:

- direct, unconditional `@tamagui/use-presence` root hook for every component;
- an internally unconditional presence effect with registration gated by the
  completed frame's animated flag;
- stable per-instance frame and `_animation` detection inside the sole style
  traversal;
- lifecycle/platform/animation metadata returned by the same pass;
- reordered hook orchestration so theme/media inputs are available before the
  pass and all consumers run after it;
- deletion of `hasFlatModifier`, `lifecycleVisitor`,
  `hasAnimatedStyleValue`, and the runtime `useComponentState` module;
- pure reruns for avoid-rerender media/state updates using the same stable frame
  and engine.

Verify:

- parser lifecycle agreement;
- AnimatePresence enter/exit and alias tests;
- `ResetPresence` null/non-null toggles without changing hook order;
- unmounting a non-animated descendant under one `PresenceChild` does not delete
  an animated sibling's registration or complete its exit;
- source and built-artifact provider/consumer tests prove one
  `PresenceContext` instance;
- a direct Tamagui component with a user-supplied React Native animated value
  selects the animated path, closing the hole left by `RawAnimatedValueCase`;
- animation driver hook-order tests, animatedBy switching, hydration, SSR, and
  no-rerender emitter tests;
- platform-driver hover apply/revert and ordinary event hover/press/focus;
- theme/media subscription and native fast-path suites.

Measured pool this step must move: `useComponentState` +126 plus any remaining
`createComponent` orchestration attribution. The more important measured result
is removal of its 82-gzip visitor and 73-gzip `hasFlatModifier` declarations and
their allocation/CPU frames.

### 4. Remove final runtime passes and old module seams

Land:

- frontend scalar candidate integration;
- contribution-time defaults, normalization, transform/shadow completion, and
  rule insertion records;
- output-only class serialization with no authored input revisit;
- deletion of dead `directStyle`, `frontendProgram`, preprocessing markers,
  forwarding closures, and duplicate compatibility types/imports;
- confirm the implementation obeys the one-pass rule and narrow user-code
  exception already recorded in `CONTRIBUTING.md`; do not widen the exception.

Verify:

- the full behavior inventory below;
- Tailwind frontend round-trip/config-aware/adversarial suites on web and native;
- zero-runtime fixture after the separately owned animations `/extras` failure
  is fixed or reverted;
- source and dist package builds.

Measured pool this step must move: `insertStyleRule` +366,
`getCSSStylesAtomic` +102, and whatever remains of the mapped +9,273 after the
first three checkpoints. Final acceptance is whole core at or below 30,000,
not the sum of marginal rows.

The mapped positive rows total 9,101 against a +9,273 gap. New arena, stable
view, absent-edge, and partial-refusal code also consumes bytes, so a result
slightly above 30,000 is a plausible measured outcome rather than a reason to
hide a residual. If that happens, run exact residual attribution and return it
to the owner before adding another mechanism.

## Behavior parity matrix

`plans/getSplitStyles-behavior-inventory.md` is the checklist. For every row,
record the named pin, the project/driver arms that actually ran, and any existing
skip. A green filename is not evidence that all animation drivers executed it.

The minimum core matrix is:

- `emitterParity.web.test.tsx`;
- `compoundVariants.web.test.tsx`, `compoundVariants.native.test.tsx`, and
  `compoundVariants.ios.test.tsx`, including authored order, `Object.is`,
  inheritance, context, 1,005 compounds, base-style exclusion, absent versus
  present `undefined`, functional-variant reentry, getter reentry, and arena
  growth while an outer frame is live;
- `parserAgreement.web.test.tsx`, updated to per-clause refusal;
- `flatValuePrograms.web.test.tsx`, `.native.test.tsx`, and SSR;
- `conditionalVariantValues.web.test.tsx` and frontend-program tests;
- getSplitStyles web/native/tv platform matrices, nested media tests, group and
  container clause tests, and group/container subscription update tests;
- transform-family web/native and TransformMediaQueryMerge;
- token category, shorthand variable, shadow, border default, and safe-area
  tests;
- styled-context token, variant resolver, variant font-family hoisting, spread
  variant, native `unset`, accepted substyle, frozen parent, RNW `$$css`,
  HOC/asChild, and parent merge tests;
- enter/exit, animation timing, discrete property, conditioned discrete, hook
  order, hydration, direct animated-value input, conditional presence
  registration, single context identity, and platform-driver tests, quoting
  passed/skipped projects.

Add or update behavior tests only where the contract changes or a proof gap is
named. Never assert source text. Never loosen a timeout, retry, coverage arm, or
expectation.

The refusal cases to pin are:

- `none hover:red unknown:blue focus:green`: base, hover, and focus survive;
- `none; hover:red`: bad base drops, hover survives;
- `none hover: focus:green`: empty hover drops, focus survives;
- a good enter clause beside a bad clause still sets `hasEnterStyle`;
- a bad or empty enter clause does not set `hasEnterStyle`;
- an unterminated construct drops the segment and does not invent a later
  boundary;
- `aspectRatio="16:9"` retains its existing property-specific meaning.

## Size and performance measurement

### Bundle

At baseline and after every implementation step, from the same commit state:

```sh
cd code/comparisons/tamagui-bench
npx vite build --sourcemap --outDir /tmp/v3-single-pass

cd ../tamagui-v2-bench
npx vite build --sourcemap --outDir /tmp/v2-single-pass

cd /Users/n8/.worktrees/tamagui-v3-golf-baseline-p28910
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-single-pass --against=/tmp/v2-single-pass --filter=@tamagui/
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-single-pass --filter=@tamagui/ --min=0
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-single-pass --within='getSplitStyles'
```

Record whole Tamagui gzip, animation rows, animation-subtracted core, module
attribution, and declaration attribution. Keep the V2 artifact fixed for the
sequence. No `EXTRACT` build is substituted for this runtime arm.

### Runtime matrix

Use the existing production harness as the broad regression/control run. Run
the baseline before edits and the finished branch with the same seed:

```sh
bun code/comparisons/run-benchmarks.ts \
  --frameworks=tamagui-v3-runtime,tamagui-v2-runtime \
  --samples=10 \
  --warmups=2 \
  --seed=73129 \
  --output=/tmp/v3-single-pass-before.json
```

Repeat with `--output=/tmp/v3-single-pass-after.json`. V2 is the same-run machine
control. Report mount and rerender paired effects for simple, rich, group, heavy,
and animated. The change is rejected if a broad scenario regresses beyond the
run's paired noise without a demonstrated harness artifact.

### Hot path and allocations

The existing heavy scenario does not contain conditional string values, so it
cannot prove the removed scanner path ran. Extend the existing Tamagui benchmark
workload with one `flat` scenario in the same source file used by both V2 and V3.
Do not create a new harness. The scenario must contain stable base values,
multiple clauses, a clause-bearing variant, an enter clause, a compound, and a
rerender that changes active state. `--verify-workload` must still prove the V2
and V3 source/config files byte-identical.

Run before and after with the same scale and iterations:

```sh
bun code/comparisons/profile-hotpath.ts \
  --scenario=flat \
  --iterations=30 \
  --warmups=5 \
  --scale=200 \
  --label=before \
  --output=/tmp/v3-single-pass-hot-before.json
```

Repeat with `--label=after` and the corresponding output path. Also run `heavy`
and `animated` as negative controls. Report:

- mount and update medians;
- sampled CPU milliseconds per iteration and the relevant source frames;
- sampled allocation bytes per iteration and per render;
- host count and renders per iteration;
- whether removed visitor, condition, array, and propMapper frames are absent
  from a profile that demonstrably executed flat clauses.

Success requires a clear reduction in the flat scenario's CPU and allocations
and no broad matrix regression. Bundle size alone cannot accept the change.

The animated matrix must also include a presence provider over a wide subtree
with mostly non-animated descendants. Measure a presence flip before and after
the universal context read. Report descendant commits and elapsed update time;
the direct hook change is rejected if it creates a material wide-subtree render
regression beyond paired noise.

## Stop conditions

Stop and return the exact protected behavior to p28302 if any of these premises
is false:

- the stable merged-props view cannot preserve a production `extras.props`
  operation without a prop prepass;
- the sole style traversal cannot preserve user-authored `_animation` behavior
  without replaying an authored value;
- core and every driver cannot resolve the direct presence hook to one context
  instance;
- deterministic CSS later-same-priority behavior requires rereading an authored
  value after its forward contribution;
- Tailwind cannot expose scalar candidate transitions without a hidden second
  className traversal;
- arena growth or a reentrant call can leave a reference to the replaced array;
- a behavior-inventory pin fails for a reason caused by the consolidation.

Do not add a cache, feature flag, environment gate, declared capability,
compiler opt-out, second parser, rollback log, per-call scratch object, or
conservative all-inline fallback to get around one of these conditions.

## Out-of-scope measured remainder

The following current deltas are **READ** measurements but are not silently
folded into this refactor: `resolveSafeArea` +336, `useMedia` +311, config/theme
variable helpers, and helper token-category tables. They buy separate behavior
or are owned by another active worker. If the assembled single-pass engine is
still above 30,000, report its exact residual attribution and ask the owner which
capability to remove or rewrite. Do not claim the pass reached the ceiling by
estimating compression, and do not edit `Theme.tsx`, `helpers/variables.ts`,
`useThemeState.ts`, `getThemeProxied.ts`, `createTamagui.ts`, or `types.tsx` while
p28878 owns them.

The animations `/extras` fixture failure reported by p28302 belongs to p28881.
Record it separately if still present. Do not fix it here or attribute it to the
single-pass branch.
