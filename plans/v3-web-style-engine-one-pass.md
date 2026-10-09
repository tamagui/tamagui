# V3 web style engine: one pass, one emitter

Status: reviewed implementation plan

Date: 2026-08-27

This plan replaces the implementation sequence in
[`v3-single-pass.md`](./v3-single-pass.md) and
[`v3-engine-consolidation.md`](./v3-engine-consolidation.md). Their measurement
receipts and behavior inventory remain evidence. This document resolves the
main design question differently: conditional objects stay, but they enter the
same clause pipeline as strings and gain no separate processing system.

## Product outcome

Tamagui should have three honest web modes built from one style engine:

1. Strict compiled mode ships no client style processor. It is the direct
   StyleX comparison.
2. Compiled CSS mode keeps dynamic Tamagui behavior while deleting rule
   generation and insertion through `TAMAGUI_DID_OUTPUT_CSS`.
3. Runtime mode ships one small processor for inline styles, conditional
   strings, conditional objects, variants, compounds, groups, containers, and
   native parity.

There will be no second web-only styling engine. Compile-time constants and
tree shaking specialize the same implementation.

The user-facing story is:

- strict web apps get a StyleX-sized residual or less because styling does not
  run in the browser;
- runtime web apps pay for one compact style machine instead of several
  overlapping parsers and emitters;
- object syntax remains available because it is already tokenized input and
  should cost almost nothing;
- groups use Tailwind grammar, and containers are an explicit separate
  capability;
- basic styling does not require `TamaguiProvider`; portal infrastructure can
  be added independently through `TamaguiRoot`.

Provider and client-theme removal come after the style engine proves its own
size. They cannot be used to hide a miss in the processor.

## Baseline and targets

All numbers below are production gzip measurements with React external and a
web target. Marginal rows overlap and must never be added together.

| Receipt | Current result |
| --- | ---: |
| Tamagui `View` | 34,004 bytes |
| `styled(View, {})` | 35,650 bytes |
| `TamaguiProvider` export | 6,085 bytes |
| `TamaguiRoot` export | 4,525 bytes |
| `directStyle` leaf | 12,742 bytes |
| `getSplitStyles` leaf | 21,639 bytes |
| StyleX `props` call | 848 bytes |
| StyleX namespace retained | 1,735 bytes |

The two Tamagui leaf rows are attribution aids. They overlap and do not describe
a 34 KB style processor.

Current production corpus costs are:

| Scenario | Current time |
| --- | ---: |
| plain | 2,127.5 ns/op |
| conditional strings | 9,566.4 ns/op |
| conditional objects | 6,211.2 ns/op |
| variants | 3,174.1 ns/op |
| shorthand | 4,889.8 ns/op |
| style-heavy | 10,168.3 ns/op |
| total corpus | 3,044.7 ns/op |

The implementation targets are:

- complete processor-artifact gzip at or below 3,000 bytes;
- conditional-object support at or below 250 additional gzip bytes;
- a 5x improvement in the conditional-string processor scenario, from
  9,566 ns/op to 1,914 ns/op or less;
- no regression outside paired noise in the broad mount, rerender, group,
  animated, and native matrices;
- `View` at or below 25,000 gzip after engine consolidation;
- `View` at or below 20,000 gzip after the separate theme, provider, and web
  specialization work;
- strict compiled mode contains no style-engine source spans.

The StyleX timing receipt is useful context but is not an acceptance gate. Its
runtime merges compiler-produced `$$css` records and performs less work than
Tamagui runtime mode.

## Freeze the ruler first

Before implementation, add two permanent bundle fixtures whose source never
changes when runtime benchmark scenarios change.

The public fixture exercises every style engine family through a real `View`:
ordinary properties, shorthand, tokens, conditional strings, conditional
objects, state, media, theme, platform, group, container, transforms, variants,
compounds, animation discovery, and atomic CSS.

The processor fixture calls the production pure style entry with opaque dynamic
input and host callbacks. It includes the complete transitive implementation
that reads an authored style value or emits inline, native, or CSS output. React
hooks, provider, portals, animation drivers, and theme storage are external host
inputs. Grammar, frontend input handling, token and shorthand routing,
normalization, transforms, atomic rules, and output completion are inside the
artifact. This is a real minified bundle, not a source-map row or hand-maintained
manifest. Moving code to another file cannot move it outside the ruler.

Record four values from the same build:

1. complete public `View` gzip;
2. complete processor-artifact gzip;
3. the existing one-union Tamagui core metric for continuity with the 39,938
   baseline and 30,000 target;
4. declaration marginals for diagnosis only.

The processor artifact and public artifact are each compressed directly. The
legacy core union is compressed once. None is the sum of module marginals. Keep
a same-fixture V2 result and the current V3 commit as controls.

Measure the object adapter with a temporary source comparison that removes only
the object discriminator and object key loop. This comparison does not become
a production feature flag. The two builds must otherwise have identical entry,
config, minifier, environment constants, and lockfile. A control object input
must prove the enabled build executed the adapter. Shared factoring remains
inside both processor artifacts, so it still counts against the 3,000-byte
whole. The object delta cannot be made smaller by moving its work elsewhere.

## Binding design

### One home

`getSplitStyles.tsx` owns the implementation. `directStyle.ts` is deleted when
the last family moves. `propMapper.ts` may retain a compatibility export only
if a public caller requires it, but component styling must not import it.

Every replaced path is deleted in the same checkpoint that replaces it. No
shadow engine, compatibility fallback, runtime feature flag, or second parser
is allowed.

### One authored-input traversal

The engine walks authored sources in their current cascade order:

1. `staticConfig.baseStyle`;
2. default props that caller props do not displace;
3. styled-context values that caller props do not displace;
4. caller props in authored enumeration order;
5. nested style values at their authored position;
6. variant output at the variant prop position;
7. compound output at the last selector position.

The implementation preserves presence-based displacement, undefined-context
skipping, `extras.props`, `asChild`, HOC, and original-prop provenance.
Components with a functional variant materialize the full merged props record
once before style processing because external variant code may enumerate it or
read a later sibling prop. Components without a functional variant stream the
four sources directly and allocate no merged record. Both inputs drive the same
style cursor and property sink.

That record materialization is a key-copy input preparation step. It does not
parse a value or emit a style. Narrowing `extras.props` to scalar reads would
remove it, but that is a separate public breaking change and is not assumed
here.

A functional variant, getter, Proxy, or coercion is a user-code boundary. The
engine may re-derive narrow scalar state after returning from user code, as
already permitted by [`CONTRIBUTING.md`](../CONTRIBUTING.md). It may not replay
an authored source.

### One scalar scanner

Each string receives one forward character loop. The scanner tracks modifier
spans, payload spans, nesting, quotes, escapes, CSS component boundaries,
numeric and unit classification, transition-property normalization, and the
property-specific data needed by its emitter.

The common contribution path may not use `split`, regex, `map`, `sort`,
`Object.keys`, temporary clause arrays, condition objects, visitor objects, or
string reconstruction. Definition-time compilation and cold development
diagnostics can use ordinary collections when their bundle and startup cost is
measured.

The scanner sends scalar spans and numeric modifier IDs directly to the same
property sink. Inline and native paths do not build selectors, wrappers, or CSS
identity strings. The CSS path materializes canonical strings once, only when a
winning rule needs them.

### One frontend path

Static frontend configuration is normalized when a styled component is
defined, never during render. Static class names are compiler input. A dynamic
className is consumed at its position by the same style cursor: one character
loop recognizes Tailwind candidates, regular class passthrough, and condition
boundaries, then feeds candidate values into the same property sink.

Delete per-render `styleFrontend.preprocessProps`,
`STYLE_FRONTEND_PREPROCESSED`, `frontendProgram`, prefixed passthrough props,
and their separate emitter. A frontend can provide immutable candidate tables
and scalar range classification. It cannot return a second props object, scan
the className again, or emit styles itself.

### Objects are a 250-byte input adapter

Object values use the same clause sink:

```ts
if (typeof value === 'string') {
  scanString(value)
} else {
  for (const key in value) {
    emitObjectClause(key, value[key])
  }
}
```

The real discriminator must distinguish conditional objects from structured
style values such as `shadowOffset`. A `default` key identifies a conditional
object. Otherwise the first key is checked against the compiled modifier
vocabulary. Once identified, the object is walked once and its key and value
are fed directly into the same condition resolver and property sink as a string
clause.

There is no `contributeStyleObject`, lifecycle object visitor, object-specific
variant branch, prefixed-key reconstruction, or intermediate style object. If
the measured adapter exceeds 250 bytes, factor the shared sink until it meets
the gate. Dropping object syntax is not the response.

### Tailwind condition grammar

Keep these forms:

- `hover:`, `focus:`, `press:`, `disabled:`;
- `sm:`, `dark:`, `web:`;
- `group-hover:` and `group-hover/card:`;
- `@sm:` and `@sm/layout:`;
- stacked forms such as `sm:dark:group-hover/card:`.

Old `$group-*` syntax stays removed. `group` exposes parent interaction state.
It does not establish a CSS query container. `container`, `containerName`, and
`containerType` establish query containers as specified in
[`dom-tailwind-flat-values.md`](./dom-tailwind-flat-values.md#group-state-uses-tailwinds-modifier-grammar-unchanged).

The current `group` branch in `getSplitStyles.tsx` still inserts
`container-name` and `container-type`. Remove that coupling before measuring
the consolidated engine so group-only parents stop paying container setup and
native measurement costs.

### Conditions and state

Compile the modifier vocabulary outside render into collision-free numeric
IDs and direct lookup metadata. Runtime scanner results use fixed numeric slots
for the existing maximum of five non-platform conditions.

Compute one component-state mask per pass for hover, focusWithin, focus,
focusVisible, press or pressIn, disabled, unmounted, and exiting. Condition
activity becomes one mask test. Component-tier data and ARIA states still emit
CSS selectors but do not read component state.

This removes the state-rank ternary, repeated `startsWith` and `indexOf` work,
condition objects, per-contribution `Set` creation, and lexicographic condition
sorting. Media, group, and container subscription keys are numeric during the
pass and are finalized once for hook consumers.

Supported runtime mutation such as `addTheme` must update the compiled
vocabulary through its owning registry. A definition-time snapshot that goes
stale is not acceptable.

### One transform accumulator

Replace these current systems with fixed transform slots in the output frame:

- `directStyle.flatLegacyTransforms`;
- `mergeStyle` flat transforms;
- `mergeFlatTransforms` sorting and object construction;
- nested transform conflict handling in `getSubStyle`;
- transform merging in `normalizeStyle`.

`x` and `y` lower to `translateX` and `translateY`. Equal `scaleX` and `scaleY`
retain the existing `scale` compression where tests require it. A complete
`transform` value owns the property according to normal cascade precedence.
Flat transform parts use fixed canonical order. The final native array or CSS
text is created once.

### Variants and compounds

Static variant resolver metadata is compiled when the styled component is
created. Static and functional variant results are traversed in place and feed
the same contribution sink. Functional variants remain the explicit user-code
boundary. Preserve `extras.props` as a full props record and preserve the
font-family pre-read that selects token families.

Compound selector metadata is also compiled outside render. The style scanner
feeds each relevant prop clause into compound matching while it processes that
clause for ordinary output. For each compound, numeric arena intervals hold the
partial Cartesian product of matching condition IDs. A new selector expands
the prior interval by each matching clause and emits the result when the last
selector arrives.

The module arena grows geometrically before a write, copies its active prefix,
and exposes indices only. No live frame retains a typed-array reference, so a
nested functional variant can grow the arena and the outer frame resumes
against the new binding. A stack watermark releases each frame. This supports
unbounded authored branch counts without a fixed capacity and creates no entry
tuples, maps, joined condition strings, or style objects.

Base style does not satisfy compound selectors; absent and
present-but-undefined keep their current distinction; output lands after the
last selector in authored order. The Cartesian work can be exponential because
the authored compound semantics are exponential, but each authored scalar is
still scanned once.

### Lifecycle and presence

`useComponentState` must stop scanning style input before `getSplitStyles`.
Hook setup uses this fixed protocol:

1. hydration, stable frame, and component-state storage hooks;
2. unconditional `usePresence`, whose internal effect is unconditional and a
   no-op without context;
3. theme and media hooks;
4. the sole style pass into neutral output slots;
5. output-mode selection, effects, subscriptions, and animation-driver
   consumption of the completed frame.

The scanner does not choose CSS or inline output. It records neutral winning
values plus enter, exit, platform-pseudo, animation, raw animated value, and
subscription flags. A first-render enter or unmounted clause marks itself
active when encountered and sets the frame flag at that boundary. Earlier
unconditioned values need no replay. After the scan, the completed animation
and lifecycle flags choose CSS, inline, or driver serialization and initialize
the stable unmounted state for subsequent renders.

Presence registration occurs after the pass and only when the completed frame
needs it. Delete `hasFlatModifier`, the lifecycle visitor, and their object and
string scanners. Keep one presence-context identity in source and built
packages, and prove a non-animated sibling cannot unregister an animated
sibling.

### One output completion

CSS and inline/native completion have different policies over one neutral
frame:

- CSS retains one slot for every property and exact condition identity. A later
  contribution replaces that exact slot. Numeric precedence buckets retain
  stable authored order without calling `sort`.
- Inline and native discard inactive conditions, then select one property
  winner by condition precedence and authored sequence across condition
  identities.
- transition longhands contribute to one grouped transition record;
- generated border and shadow defaults are marked synthetic and disappear when
  an authored contribution owns the relevant property;
- complete and flat transforms finalize through the one transform accumulator.

Atomic class names and rules are built once for winning CSS slots during output
completion. Inline and native styles serialize once. Output completion may walk
output slots; it may not read an authored prop or source value again.

When `TAMAGUI_DID_OUTPUT_CSS=1`, CSS rule generation, hashing, insertion, and
runtime theme CSS generation must disappear from the client artifact. Strict
compiled mode must also delete the style scanner, resolver, and output frame.
An input the compiler cannot flatten is a compile error in strict mode with the
property and source location. Strict mode cannot silently retain the runtime
engine or drop the style.

## Implementation sequence

Each checkpoint is a coherent commit on the integration branch. It deletes the
path it replaces, builds the package, runs its named behavior matrix, and
records public gzip, processor-artifact gzip, legacy core-union gzip, runtime
timing, and allocations.

### 0. Freeze contracts and measurement

- add the stable public and processor bundle fixtures;
- record V3, V2, StyleX, object-adapter, and strict-mode controls;
- update [`getSplitStyles-behavior-inventory.md`](./getSplitStyles-behavior-inventory.md)
  with every test named below;
- record source and built-package context identity before presence changes.

No engine code changes in this checkpoint.

### 1. Separate groups from containers

- remove implicit container CSS and native measurement from `group`;
- keep Tailwind `group-*` and named group modifiers;
- keep explicit `container` behavior and named container queries;
- update group/container behavior tests and compiler/runtime agreement.

This is a semantic correction with its own receipt. It does not share a commit
with parser work.

### 2. Move immutable work out of render

- normalize frontend and static style configuration at component definition;
- compile modifier, variant, compound-selector, property, shorthand, token,
  and transform metadata there;
- update every supported registry mutation through one revisioned owner;
- mark static configs that contain functional variants so only those components
  materialize the full merged props record;
- make the current runtime consume the compiled metadata and delete the runtime
  setup it replaces.

This checkpoint changes no style grammar, cascade, lifecycle, or output
semantics. It introduces no unused shadow structures and no second runtime
emitter.

Gate: definition-time mutation and getter timing pins pass, per-render setup
falls in the profile, and bundle size does not regress.

### 3. Replace the runtime engine as one assembled change

The scanner, frontend, property sink, variants, compounds, lifecycle protocol,
neutral frame, transforms, and output completion switch together. They cannot
land as independently reachable runtime paths because any partial split keeps a
forbidden rescan.

The assembled change:

- installs the scalar scanner, state mask, numeric conditions, and object
  adapter;
- consumes dynamic className through the same cursor and deletes frontend
  preprocessing and frontend programs;
- routes tokens, shorthand, border, shadow, transitions, safe areas, and all
  ordinary properties through one sink;
- traverses static and functional variant output in place;
- feeds the same scanned clauses into the growing compound arena;
- puts `usePresence` in its fixed hook position and discovers lifecycle and raw
  animated values in the pass;
- records neutral output and finalizes CSS or inline/native with their distinct
  policies;
- installs the one transform accumulator;
- flips direct-style and variant refusal semantics together if per-clause
  refusal remains the contract;
- deletes `directStyle.ts`, per-render style frontend preprocessing,
  `frontendProgram`, component runtime use of `propMapper`, lifecycle scanners,
  `hasFlatModifier`, duplicate grammar helpers, component-splitting arrays,
  transform merge systems, temporary condition collections, and source replay;
- merges single-use helpers into `getSplitStyles.tsx` and removes dead types,
  closures, compatibility state, and debug counters.

Internal development can use short-lived local commits, but the runtime switch
is reviewed and merged as one assembled unit. There is never a commit where an
authored string is handled partly by the old engine and partly by the new one.

Gate: every authored string and conditional object is scanned once, object
support is at most 250 gzip, processor artifact is at most 3,000 gzip,
conditional strings meet the 5x target, public `View` is at most 25,000 gzip,
legacy core union is at most 30,000 gzip, all behavior pins pass, and the broad
runtime matrix has no regression.

### 4. Specialize the web artifact

- prove strict compiled output retains no style-engine spans;
- make `TAMAGUI_DID_OUTPUT_CSS` delete all runtime CSS generation and insertion;
- split native-only parser and normalization code at module boundaries that web
  bundlers can remove;
- retain one implementation and one public behavior contract.

Gate: production Vite, webpack, and Metro web builds agree on which engine
families disappear. Inspect built content, not version strings or source
assumptions.

### 5. Remove optional theme and provider costs

- make basic `View` styling work without `TamaguiProvider`;
- keep `TamaguiRoot` as the explicit portal-host and root-infrastructure entry;
- erase client theme objects when the compiler proves no runtime theme reads;
- ensure app config can export `{}` for client themes only through an owned
  compile-time proof, rather than an author-maintained environment guess;
- measure `View`, `TamaguiRoot`, dynamic theme use, and strict no-theme use as
  separate entries.

Gate: `View` reaches 20,000 gzip or less without breaking dynamic themes,
portals, SSR, hydration, or native. This checkpoint cannot change the 3,000-byte
engine acceptance result from checkpoint 3.

## Behavior matrix

Run the existing tests at the phase that changes their behavior:

- parser agreement and flat-value programs on web, native, and SSR;
- conditional values in direct props, style props, variants, and compounds;
- group and container output plus subscription updates, named and unnamed;
- nested viewport, container, theme, platform, state, group, and enter/exit
  conditions;
- transform families and transform/media query merging;
- border defaults, shadows, transitions, safe areas, tokens, shorthands, and
  token categories;
- variant resolution, functional variant reentry, getter reentry,
  `extras.props`, font-family token selection, and native `unset`;
- compound authored order, `Object.is`, context, inheritance, 1,005 entries,
  absent versus undefined, a multi-selector Cartesian product, and nested arena
  growth past the original binding while an outer frame is live;
- HOC, `asChild`, parent merging, frozen parents, RNW `$$css`, and original
  provenance;
- presence aliases, enter/exit, raw animated values, hook order, hydration,
  no-rerender updates, platform-driver state, and a single context instance.

The matrix also pins:

- five distinct non-platform modifiers succeed and six fail, while duplicate
  and platform modifiers retain their current accounting;
- an exact colon-bearing variant key resolves as a variant before its value is
  treated as clauses;
- mutating a supported variant definition or registry invalidates compiled
  metadata at the same observable boundary as today;
- complete `transform` mixed with flat transforms across CSS, inline, native,
  media, and nested substyles;
- CSS exact-slot replacement, stable precedence insertion, transition grouping,
  and synthetic border/shadow default removal;
- inline/native active-condition competition across different condition
  identities;
- strict compiled mode reports a dynamic input it cannot flatten.

Add behavioral tests only for missing contracts. Do not assert source strings,
loosen timeouts, add retries, or update snapshots without validating the new
rendered behavior.

## Measurement at every checkpoint

Use the existing comparison scripts and add entries to them instead of creating
another benchmark system:

- stable public and processor artifacts plus the legacy core-union attribution;
- `benchmark-get-split-styles.ts` for the corpus timing above;
- `run-benchmarks.ts` for paired V3/V2 mount and rerender scenarios;
- `profile-hotpath.ts` for clause-heavy, group, heavy, and animated CPU and
  allocation profiles;
- strict compiled fixtures for source-map and built-content inspection.

Each receipt records commit, Bun and Node versions, platform, minifier,
environment constants, fixture hash, warmups, sample count, median, dispersion,
host count, renders, complete gzip, union gzip, and declaration attribution.
The before and after runs use the same machine and seed. V2 remains a same-run
control.

After code changes, build affected packages. Before completion, run from the
repository root:

```sh
bun run lint
bun run check
```

## Stop conditions

Stop the current checkpoint and name the exact behavior or bytes if any of
these occurs:

- a replacement lands while its predecessor remains reachable;
- a string or authored object is traversed twice outside the documented
  user-code boundary;
- conditional-object support exceeds 250 gzip;
- the complete processor artifact does not fall materially in checkpoint 3;
- transform output needs sorting or temporary object arrays;
- group state once again creates a query container;
- the modifier table becomes stale after a supported runtime registry update;
- reentrancy corrupts an outer style or compound frame;
- a fixed compound capacity truncates an authored Cartesian product;
- deterministic CSS cascade would require replaying authored input;
- a behavior-inventory pin fails because of consolidation;
- a size win comes from removing an unrelated behavior or changing the ruler.

Do not respond with a fallback parser, cache, Proxy, runtime option, conservative
all-inline mode, or duplicated compatibility path. Fix the shared source of the
problem or return the failed premise for a design decision.

## Follow-up package seam: `@tamagui/style`

This is outside the engine implementation sequence, but the engine must leave a
clean seam for it.

The current standalone [`style()`](../code/core/web/src/dom/standalone.ts) API
behind `tamagui/dom` and `@tamagui/core/dom` is compile-only and throws when a
call reaches runtime. A future `@tamagui/style` package could expose a
StyleX-like web runtime for direct HTML use while reusing the exact processor
artifact from this plan.

That package would assume the CSS output driver and browser host. It would omit
React components, native output, animation drivers, provider, portals, JS theme
objects, and dynamic Tamagui theme subscriptions. Static calls could still
compile away; dynamic calls would use the small runtime and CSS variables. The
public API and configuration format need a separate design after checkpoint 3.

A separate package is acceptable. A separate parser, condition resolver,
property normalizer, transform system, or CSS emitter is not. Its first
feasibility receipt is the complete public package gzip beside the StyleX
`props` and namespace fixtures. If the package cannot be expressed as a thin
host facade over the same processor, stop rather than fork the styling engine.

## Completion

This work is complete when the final built artifacts prove all three product
modes, the old modules and passes are deleted, every named behavior pin passes,
the 3 KB and 5x engine targets are met, conditional objects cost no more than
250 bytes, and the public bundle receipts support the web story without adding
overlapping marginal numbers.
