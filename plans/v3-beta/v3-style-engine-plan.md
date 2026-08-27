# V3 style engine: final plan

Status: ready for implementation

Date: 2026-08-27

Merges [`v3-web-style-engine-one-pass.md`](../v3-web-style-engine-one-pass.md)
with the four reviews in this directory and the owner decisions taken on them.
Those documents stay in place as provenance:

- [`v3-web-style-engine-one-pass.md`](../v3-web-style-engine-one-pass.md), the
  design this plan is built on;
- [`opus-feedback.md`](./opus-feedback.md),
  [`grok-feedback.md`](./grok-feedback.md),
  [`gemini-feedback.md`](./gemini-feedback.md), the independent reviews;
- [`nate-grok-opus-review.md`](./nate-grok-opus-review.md) and
  [`v3-consolidated-review.md`](./v3-consolidated-review.md), the merges.

Earlier measurement receipts and the behavior inventory remain evidence. Claim
labels in this document follow the agent contract.

---

## 1. The goal

**Rebuild the style loop from scratch so `directStyle` and `getSplitStyles`
become one careful pass.**

Size and speed are the expected consequence and the reported receipt. They are
not the acceptance test.

### The numbers in the previous plan were made up

3,000 gzip, 5x, 25,000, 20,000, and 250 were owner estimates, not measurements.
Do not optimize against them, and do not treat a miss as a failure or a hit as
success.

This matters because the last campaign already failed this way. **READ**
`v3-handoff-log.md:5930-5960`: six checkpoints, forecasts that missed in both
directions, and a recorded root cause of "the model priced gross declaration
deletion but underpriced the retained plumbing that replaces it."

### Gate on structural invariants instead

Each is checkable by reading the code and cannot be satisfied by shaving
something unrelated.

1. Every authored string is walked by exactly one character loop per pass.
2. Exactly one conditional-object discriminator exists.
3. Exactly one transform accumulator exists.
4. No `sort`, `split`, `join`, `Array.prototype.includes`, regex, or
   `Object.keys` on the render path.
5. No per-clause heap record. Condition state is call-stack locals.
6. `directStyle.ts` does not exist.
7. Component styling does not import `propMapper`.
8. One contribution entry point. No frontend-program channel and no separate
   variant-clause channel.
9. Output completion never re-reads an authored prop.
10. Strict compiled mode contains no style-engine spans.
11. The forward pass reads no render-invariant value inside the per-prop loop.
12. The style pass is callable outside a React render, because the compiler host
    calls it.
13. Nothing is computed outside a `process.env.TAMAGUI_TARGET` guard and consumed
    only inside it. Constant folding cannot remove that, so it is live waste on
    the platform that never uses it.

### Report, do not gate

Every checkpoint records public `View` gzip, processor-artifact gzip, the legacy
core union, corpus timing, and allocation profiles, with a same-run V2 control.
One directional gate: **the processor artifact falls materially at the rebuild,
and no broad runtime scenario regresses outside paired noise.**

If a numeric target is wanted later, measure the processor artifact at
checkpoint 0 and set it from that pool.

---

## 2. Product outcome

Three honest web modes from one engine:

1. **Strict compiled mode** ships no client style processor. Largely already
   true: **READ** `V3_BETA_MEASUREMENT_STATE.md`, the compiled arm is 14 of 14
   flattened with zero bailouts, `getSplitStyles`, `createComponent`, and
   `propMapper` absent, and `directStyle` down to 50 marginal gzip for
   `platformMatches` only. This needs a pin, not a rewrite.
2. **Compiled CSS mode** keeps dynamic behavior while `TAMAGUI_DID_OUTPUT_CSS`
   deletes rule generation and insertion. **Decide and state**: a value the
   compiler could not prove routes inline, because hashing and insertion are
   gone.
3. **Runtime mode** ships one compact processor.

No second web-only styling engine. Compile-time constants and tree shaking
specialize one implementation.

---

## 3. Decisions taken

| question | decision |
| --- | --- |
| Conditional object values | **Keep.** They are the dynamic-value escape hatch. The work is to do them well. |
| Transform order | **Authored order.** Neither current path does this; it is a bug. |
| `group` establishing a query container | **Remove.** Declare `container` separately. |
| Container authoring API | **New shape**, section 5. |
| A style write propagating to styled context | **Drop.** `createStyledContext` is the path. |
| `data-*` to `dataSet` reverse shim | **Remove.** |
| `accessibility*` on web | Remove the web-side work, keep pass-through. The aria-to-native adapter stays. |
| Extending RN's `ViewProps` | **Stop.** Tamagui declares its own base prop types. Web then needs no `react-native` for types. See §9.0. |
| What "size" means | Web only, after a production tree-shaken bundle. See §4. |
| The default authoring surface | **Web.** Accept more CSS than React Native supports; native adapts or drops. Native adapter code is free under the §4 rule. See §9.1. |
| `style={}` | **Keep it, narrow the type hard.** It is React's escape hatch and 673 call sites use it. The type currently promises three things the runtime does not implement. See §9.2. |
| `style` semantics | **Same as props**, tokens, clauses and shorthands. Not React Native's raw style API: that is more code and breaks `$token` values silently. See §9.2. |
| Sub-style props (`accept: 'style' \| 'textStyle'`) | **Remove entirely**, with `getSubStyle`. Token-category `accept` stays. See §9.2. |
| Making an unsupported style work on native | **Fall through, warn in dev.** The author's fix is a `native:` clause, so the message names it. Two guards, zero bytes on web and in native production. See §9.1. |
| Gating the surface to what RN's JS types allow | **No.** Yoga shipped `YGDisplayGrid` before RN's types did. Web leads. |
| Token provenance | **Keep, dev-only.** Needs a code review and proof it shakes out. |
| `extras.props` | Full record, no Proxy, materialized only for components with a functional variant. |
| Numeric targets | Reported receipts, not gates. |

---

## 4. Baseline

**Unsourced.** The following appear in no receipt in the repo and there is no
StyleX fixture in `code/comparisons`. Checkpoint 0 re-derives them with commit,
command, and environment, or deletes them.

| receipt | claimed |
| --- | ---: |
| Tamagui `View` | 34,004 |
| `styled(View, {})` | 35,650 |
| `TamaguiProvider` export | 6,085 |
| `TamaguiRoot` export | 4,525 |
| StyleX `props` call | 848 |
| StyleX namespace retained | 1,735 |

### The only size that counts

**Owner rule: web, after a production bundle, tree-shaken.** Nothing else is a
target.

Consequences, because several earlier framings got this wrong:

- **Metro numbers are not a target.** A prior receipt's "root-exporting
  `ThemeUpdate` costs 3,807 Metro gzip" is not a reason to shape the API. Metro
  retaining the root's static dependency graph is a Metro problem.
- Native bytes are not a target here.
- Development-only code that folds under `NODE_ENV` costs nothing and needs no
  defense. Token provenance is the example.
- A module that tree-shakes out of a production web bundle is already free,
  however large it is in source.
- **Therefore native adapter code should be free, and that is a design lever, not
  just an accounting note.** Everything inside
  `process.env.TAMAGUI_TARGET === 'native'` folds away on web. The whole
  web-to-native lowering lives behind one such guard at `expandStyle.ts:95`. This
  is what makes §9.1 possible: accept far more CSS than React Native supports and
  pay for the translation only where bytes are not the budget. Then a choice
  between "more web capability" and "more native adapter code" has nothing to
  weigh. **§9.1 carries the one measurement that has to confirm this** before
  anything is built on it.

Measured and trustworthy:

- parser-cluster union **4,706 gzip**, CORE **39,938** baseline
  (`v3-handoff-log.md`);
- runtime whole-app V3 109,086 against V2 95,669; compiled whole-app V3 86,637
  against V2 96,018 (`V3_BETA_MEASUREMENT_STATE.md`);
- corpus timing exists in `GET_SPLIT_STYLES_BENCHMARK.md`, which warns that
  host-wide timing moved between runs, so **every timing comparison must be a
  same-run paired control**, never a number quoted from a document.

---

## 5. Container API

Replaces the `containerName` / `containerType` prop pair as the recommended
component API.

```tsx
<View container />                              // container-type: inline-size
<View container="main" />                       // container: main / inline-size
<View container="main" containerType="size" />  // container: main / size
```

Rules:

- `container={false}` and `container={undefined}` are **no-ops**, so
  `container={isRoot}` behaves.
- Raw CSS longhands remain supported inside `style()` and raw style objects:
  `style({ containerName: 'main', containerType: 'inline-size' })`.
- When a longhand is authored alongside `container`, **the longhand wins for the
  property it names** and `container` fills the rest.

Why the divergence from CSS is right: bare CSS `container: main` means
`main / normal`, and `container-type: normal` establishes no query container, so
a CSS-faithful reading would silently do nothing. Tailwind makes the same
convenience choice with `@container/main`. The boolean form already has no CSS
equivalent.

Two properties this buys beyond brevity:

- **Authoring is symmetric with querying.** `container="main"` pairs with
  `@sm/main:`. The longhand pair does not.
- **It makes the group split legible.** Someone relying on `group="card"` plus
  `@sm/card:` migrates to `group="card" container="card"`, which reads as what
  it is.

---

## 6. Binding design

### 6.1 One home

`getSplitStyles.tsx` owns the implementation. `directStyle.ts` is deleted when
the last family moves. `propMapper.ts` may keep a compatibility export only if a
public caller needs it; component styling must not import it.

Every replaced path is deleted in the checkpoint that replaces it. No shadow
engine, compatibility fallback, runtime feature flag, or second parser.

**Constraint:** the style pass stays callable outside React render. **READ**,
`compiler/static/src/compilerHost.ts` and
`compiler/static-tests/tests/flatValues.web.test.tsx` both call it directly.
React hooks, provider, portals, animation drivers, group context, and theme
storage are host inputs, not internal reads.

**There are THREE hosts, not two.** The plan discussed the component host and the
compiler host and missed `hooks/useProps.tsx`, which carries its own safe-area and
group-subscription wiring. That omission is not academic: it has already drifted
into a *different* broken dependency expression from `createComponent`'s, for the
same concept (§14). Both hosts consume one lifecycle helper after the rebuild;
neither carries its own subscription implementation.

### 6.2 One authored-input traversal

Cascade order:

1. `staticConfig.baseStyle`;
2. default props that caller props do not displace;
3. styled-context values that caller props do not displace;
4. caller props in authored enumeration order;
5. nested style values at their authored position;
6. variant output at the variant prop position;
7. compound output at the last selector position.

Preserves presence-based displacement, undefined-context skipping,
`extras.props`, `asChild`, HOC, and original-prop provenance.

Components with a functional variant materialize the full merged props record
once, because external variant code may enumerate it or read a later sibling
prop. Components without one stream the four sources directly and allocate no
merged record. Both drive the same cursor and sink. The materialization is a
key copy; it parses nothing and emits nothing.

A functional variant, getter, Proxy, or coercion is a user-code boundary. The
engine may re-derive narrow scalar state after returning from user code. It may
not replay an authored source.

### 6.3 The forward pass computes its invariants once

**READ**, `contributeProp` (`getSplitStyles.tsx:645-1250`) re-evaluates
per-render constants on every prop:

| line | expression |
| --- | --- |
| 744 | `getDefaultProps(staticConfig)`, a function call per prop whose body is `staticConfig.defaultProps` |
| 830-833 | `staticConfig.isReactNative \|\| (styleProps.isAnimated && driver?.isReactNative && !driver.View?.acceptRenderProp)` |
| 913 | `(styleProps.isAnimated \|\| staticConfig.isHOC) && driver?.isReactNative` |
| 931 | `asChild === 'except-style' \|\| asChild === 'except-style-web'` |
| 936-943, 1039, 1072, 1129 | `isHOC`, `parentVariants`, `disablePropMap` combinations |
| 789-792 | `driver?.animations`, `driver?.outputStyle === 'css'` |
| 701, 743, 755 | `accept`, `asChild`, `!noSkip && !isHOC` |
| `propMapper.ts:85-88` | `if (key === 'elevationAndroid') return`, unconditional per prop on web |
| 813, 823, 1044, 1070, 1151 | `isValidStyleKey(key, validStyles, accept)`, five calls, two of three arguments invariant |

Resolve all of them once above the loop. This is pure hoisting: no compiled
metadata, no cache, no definition-time step, no behavior change. It multiplies by
every prop of every component on every render, so it is likely the largest
single time win in the plan.

`isValidStyleKey` compounds with 6.9: its body
(`getSplitStyles.tsx:438-447`) is `key in validStyles || (isWeb && five string
compares) || (accept && key in accept)`.

### 6.4 Layered scanning

An earlier draft said "one forward character loop per string, tracking modifier
spans, payload spans, nesting, quotes, escapes, CSS component boundaries, numeric
and unit classification, transition-property normalization, and per-emitter data."
That is a mega-scanner, and it is the wrong invariant: it fuses two genuinely
different passes and would be untestable in parts.

**The invariant, restated:**

- one **clause** scan per authored string;
- at most one **payload** scan, after clause resolution;
- one shared quote / parenthesis / escape / span primitive, used by both;
- no repeated payload splitting or reparsing.

Layered, not fused. Checkpoint 0 enumerates the current violations, and the
inventory must name `resolveEmbeddedTokens`, `normalizeTransitionNames`,
`splitComponents`, the `font_*` class regex (`getVariantExtras.tsx:41`), and the
class join-then-split, not only the `scanFlatValue` sites below.

Native transform, background, and shadow parsers are the native follow-on, not
this checkpoint.

**READ**, five `scanFlatValue` call sites exist today, four on the render path,
plus a sixth hand-rolled character loop:

| site | handler | when |
| --- | --- | --- |
| `clauseIdentity.ts:194` | `clauseIdentityScanner` | definition time, keep |
| `useComponentState.ts:121` | `lifecycleHandler` | prepass, delete |
| `getSplitStyles.tsx:166` | `compoundScanHandler` | per compound key, fold in |
| `propMapper.ts:215` | `propMapperHandler` | variant clauses, fold in |
| `directStyle.ts:2029` | `directStyleHandler` | the real emission scan |
| `useComponentState.ts:104-114` | hand-rolled loop over object keys | delete |

One `bg="hover:blue"` on a component with compounds is currently walked four
times. Handlers have been module-scope since checkpoint III-a, so this is walks,
not allocations.

The contribution path may not use `split`, regex, `map`, `sort`, `Object.keys`,
temporary clause arrays, condition objects, visitor objects, or string
reconstruction.

**One string-reconstruction site to kill by name.** `appendFlatClause`
(`helpers/propMapper.ts:30-53`, called from `getSplitStyles.tsx:1085`) builds
`` `${prev} ${conditionSource}:${value}` `` on the HOC path so the wrapped
component's own parser can re-parse it. That is serialize-then-reparse across the
HOC boundary. An HOC must hand the inner component structured clauses instead. Definition-time compilation and cold development diagnostics may
use ordinary collections when their bundle and startup cost is measured.

The scanner sends scalar spans and numeric modifier IDs to the property sink.
Inline and native build no selectors, wrappers, or CSS identity strings. The CSS
path materializes canonical strings once, only for a winning rule.

### 6.5 Conditions and state: call-stack locals, not fixed slots

Compile the modifier vocabulary outside render into numeric IDs and direct
lookup metadata.

**Condition state travels as call-stack locals.** Not fixed frame slots. This is
what ships today: **READ** `v3-handoff-log.md:5875`, checkpoint IV-a "resolves a
clause through one call-stack-only `resolveClauseChain` loop. The heap
`Condition` record, `getCondition`, the direct collect-then-emit loop, the
canonical and kind arrays, the per-clause `Set`, and the grammar-config
precedence bridge are gone." That was worth -362 CORE.

Fixed slots corrupt on same-frame nesting: a conditional variant `sm:$v` can
return `{ color: 'hover:red' }`, and the inner clause evaluates while the outer
condition is live. Across a user-code boundary only numeric source offsets
survive; the condition is re-derived after the return.

Open-ended names cannot be closed IDs. `hover`, `sm`, `dark`, and `web` compile
to numeric IDs. Group names, container names, and themes added by `addTheme` are
unbounded. Use span comparison against the source for the parameterized forms; a
process-lifetime intern leaks and a per-pass intern allocates.

Compute one component-state mask per pass for hover, focusWithin, focus,
focusVisible, press or pressIn, disabled, unmounted, and exiting. Condition
activity becomes one mask test. Component-tier data and ARIA states still emit
selectors but read no component state.

Supported runtime mutation updates the compiled vocabulary through its owning
registry. **Already solved**: `resolveClauseChain` opens with
`getConfigRevisionState(state.conf)` (`directStyle.ts:406`). Preserve it.

Depth stays capped at five distinct non-platform conditions.
`clausePrecedence.ts:160-164` throws above `grammarMaxNonPlatformDepth = 5`, and
the matrix pins five succeeding and six failing.

### 6.6 One frontend path

Static frontend configuration normalizes at definition, never during render.
Static class names are compiler input. A dynamic className is consumed at its
position by the same cursor: one character loop recognizes Tailwind candidates,
passthrough classes, and condition boundaries, then feeds the property sink.

Delete `styleFrontend.preprocessProps`, `STYLE_FRONTEND_PREPROCESSED`,
`frontendProgram`, prefixed passthrough props, and their separate emitter. A
frontend may provide immutable candidate tables and scalar range classification.
It may not return a second props object, rescan the className, or emit styles.

`@tamagui/tailwind` is the affected consumer. Name it in the checkpoint.

### 6.7 Objects are the dynamic-value escape hatch

Object values use the same sink:

```ts
if (typeof value === 'string') scanString(value)
else for (const key in value) emitObjectClause(key, value[key])
```

**Write the contract down**: an object is the only way to put a runtime,
non-string value under a condition.

```tsx
<View bg={{ default: props.color, hover: props.hoverColor }} />
```

A `Variable`, theme object, or arbitrary runtime value cannot be interpolated
into a flat string, and `hoverStyle` is gone. Document this so nobody adds
object-only features and lets the two syntaxes drift.

Three facts keep the adapter small:

1. An object's **keys** are clause chains, scanned once.
2. An object's **values** are already values and are never scanned as clauses.
   **READ**: `contributeStyleObject` passes `payload` to `resolveClauseChain` as
   `raw`; `emitValue` runs token resolution on it, not clause parsing.
3. Conditional **structured** payloads are already refused
   (`directStyle.ts:2160`).

The discriminator is `default` key, else first key against the compiled
vocabulary, guarded by `!Array.isArray(value) && !isVariable(value)`. That guard
already exists at `directStyle.ts:2253-2258`.

**The work is deleting the duplicates**, not designing the adapter. Three copies
exist: `directStyle.ts:2084`, `getSplitStyles.tsx:176-182`,
`getSplitStyles.tsx:199`, plus the object branch at `useComponentState.ts:97-115`.

Structured leaves (`shadowOffset`, `textShadowOffset`, `transform: []`) are the
React Native StyleSheet API. They are leaves that never enter clause parsing, and
web already has the string form (`boxShadow`, `validStyleProps.ts:259`, handled
at `directStyle.ts:1871`). Whether to keep them is an RN-parity question for the
web-alignment campaign, not this one.

### 6.8 One transform accumulator, in authored order

**READ**, four systems exist and two disagree on output order:

| site | shape |
| --- | --- |
| `directStyle.ts:1584-1601` | `flatLegacyTransforms`, `Object.keys().sort().map()`, re-emits the whole `transform` property on every part, so it is quadratic |
| `getSplitStyles.tsx:1529` | `mergeFlatTransforms`, fixed head then `keys.sort(sortString)` |
| `getSplitStyles.tsx:1804` | `mergeTransform`, push/unshift into an array |
| `getSplitStyles.tsx:1718-1752` | `getSubStyle`'s four-deep nested conflict merge |

The first sorts alphabetically, giving `rotate, scale, x, y`. The second uses a
fixed head, giving `x, y, rotate, scale`. Transform composition is not
commutative, so **web-class and native/inline already render the same input
differently**. This is a live correctness bug.

Replace all four with **one accumulator that preserves authored order**. That
deletes both sorts and the quadratic re-emit. `x` and `y` lower to `translateX`
and `translateY`. A complete `transform` value owns the property by normal
cascade precedence. The final native array or CSS text is created once.

Equal `scaleX` / `scaleY` compression to `scale` survives only if a test
justifies it, and without `Object.is` (see 6.11).

Call the order change breaking. Pin it with a rendered assertion on both
platforms, not a snapshot.

### 6.9 Property tables

Move the transition longhands into `webOnlyStylePropsView` and
`webOnlyStylePropsText`. **READ**, `code/core/helpers/src/validStyleProps.ts`
contains no transition keys today while already exporting those web-only tables,
and the same five keys are hand-listed in three places:
`getSplitStyles.tsx:441-445`, `getSplitStyles.tsx:688-698`, and
`directStyle.ts:1567`.

**Shorthands expand into canonical leaf output slots** during the pass, tagged
with authored sequence, so `padding={10} px={20} paddingLeft={30}` resolves
deterministically and two slots never emit competing CSS.

### 6.10 Variants and compounds

Static variant resolver metadata compiles at definition. Static and functional
variant results traverse in place into the same sink. Functional variants remain
the user-code boundary.

**Font family**: delete the variant-result pre-read. Keep the unresolved token
identifier in the output slot and resolve it during output completion, when the
family is known. This removes a double read of a result object that may carry
getters, and it satisfies the single-traversal rule. The current in-loop update
at `getSplitStyles.tsx:998-1005` is not a second props traversal and is fine.

Compound selector metadata compiles outside render. The scanner feeds each
relevant prop clause into compound matching while processing it for ordinary
output. Numeric arena intervals hold the partial Cartesian product; a new
selector expands the prior interval and emits at the last selector.

The module arena grows geometrically before a write, copies its active prefix,
and exposes indices only. No live frame retains a typed-array reference, so a
nested functional variant can grow the arena and the outer frame resumes against
the new binding. A stack watermark releases each frame.

Base style does not satisfy compound selectors. Absent and present-but-undefined
keep their distinction. Output lands after the last selector in authored order.

**This deletes a nine-level nest.** **READ** `getSplitStyles.tsx:220-240`: per
compound key, `matcherChains` runs a full `scanFlatValue` with a `source.slice`
per segment, then a Cartesian double loop whose `joinChains` does two `split`
calls, an `includes`, and a `join` per pair, followed by another `includes`. It
runs for every compound variant on every render whether or not it matches. The
`FlatFrame` bench scenario has twelve compound variants.

### 6.11 Stop over-narrowing at runtime

A check that decides what to do is dispatch and stays. A check that guards
against input a user should not send is a tax on everyone sending correct input.

**RAN**, across `getSplitStyles.tsx`, `directStyle.ts`, `propMapper.ts`, and
`createComponent.tsx`: 94 `typeof`, 19 `Array.isArray`, 17 `isVariable`, 8
`hasOwnProperty`, 3 `Object.is`.

The canonical case: `compoundMatcherMatches` (`getSplitStyles.tsx:111-116`) uses
`Object.is`, which differs from `===` only for `NaN` and `-0`. **READ**,
`core-test/compoundVariants.web.test.tsx` and its `.native` sibling both contain
a test named *"compound matchers use `NaN` for scalars and readonly arrays"*. We
pinned NaN-equality semantics in the hottest compound loop for something no
application does. `mergeFlatTransforms:1537` carries the same call.

**Delete the check and the pin together.** Otherwise the next rebuild
reintroduces `Object.is` to make a test pass. Same treatment wherever a guard
protects against input that would otherwise fail with a clear error.

### 6.12 Lifecycle and presence

`useComponentState` stops scanning style input before `getSplitStyles`.

Hook protocol:

1. hydration, stable frame, and component-state storage;
2. presence, read unconditionally in a fixed position;
3. theme and media;
4. the sole style pass into neutral output slots;
5. output-mode selection, effects, subscriptions, and driver consumption of the
   completed frame.

The scanner does not choose CSS or inline. It records neutral winning values plus
enter, exit, platform-pseudo, animation, raw animated value, and subscription
flags. A first-render enter or unmounted clause marks itself active when
encountered and sets the frame flag there. Earlier unconditioned values need no
replay. After the scan, the completed flags choose CSS, inline, or driver
serialization.

Presence registration happens after the pass, only when the frame needs it.
Delete `hasFlatModifier`, the lifecycle visitor, and its scanners. Keep one
presence-context identity in source and built packages, and prove a non-animated
sibling cannot unregister an animated one.

**Effect timing caution**: presence currently registers in a passive effect while
several component lifecycle effects are layout effects. Combining them silently
changes timing. Merge into an existing passive effect, or keep one small effect
until layout registration is proven equivalent.

### 6.13 One output completion

CSS and inline/native apply different policies to one neutral frame:

- **CSS** keeps one slot per property and exact condition identity. A later
  contribution replaces that exact slot. Numeric precedence buckets preserve
  authored order without `sort`.
- **Inline and native** discard inactive conditions, then pick one property
  winner by condition precedence and authored sequence across identities.
- transition longhands contribute to one grouped record;
- synthetic border and shadow defaults disappear when an authored contribution
  owns the property;
- transforms finalize through the one accumulator.

Atomic names and rules build once for winning CSS slots. Inline and native
serialize once. Output completion may walk slots; it may not read an authored
prop again.

**This is fixing a real divergence, and the plan should say so.** **READ**
`directStyle.ts:1127-1141`: on web with `flatShouldDoClasses`, every
`emitProperty` routes into `directAtomic` and returns **before `merge` is ever
called**. So `mergeStyle` (`getSplitStyles.tsx:1569`) never runs on the web class
path, for conditionals or base styles. Today the two paths do not merely
serialize differently; they execute different code and produce different side
effects.

Consequences to clean up with it:

- the `overriddenContextProps` sniff at `getSplitStyles.tsx:1579-1601` is
  native-and-inline only, yet every platform pays four `staticConfig`
  re-derivations and two `Array.prototype.includes` scans per winning style
  write. **Decided: delete it**, along with `originalContextPropValues`
  (`propMapper.ts:446`) and the `styleState` field. `createStyledContext` is the
  supported path.
- `recordStyleTokenProvenance` shares the same call site and is dev-only.

Under `TAMAGUI_DID_OUTPUT_CSS=1`, rule generation, hashing, insertion, and
runtime theme CSS generation disappear from the client artifact. Strict compiled
mode also deletes the scanner, resolver, and output frame; an input the compiler
cannot flatten is a compile error naming the property and source location.

---

## 7. Implementation sequence

### 0. Ruler and pool

- build the public `View` fixture and the processor-artifact fixture, the latter
  a real minified bundle so moving code between files cannot move it outside the
  ruler;
- **measure the processor artifact** and record it;
- re-derive the section 4 baseline with commit, command, and environment, or
  delete the unsourced rows;
- build the deletion-pool table with real declaration marginals;
- run `profile-hotpath.ts` on the clause-string scenario and name the frames that
  must disappear: condition records, per-clause `Set`s, `sort`, `source.slice`
  per modifier, wrapper arrays, string-key identity, `joinChains`,
  `Object.getOwnPropertyDescriptors` in `getSubStyle`;
- add 0-prop and 1-prop corpus scenarios to decompose fixed per-call overhead;
- update [`getSplitStyles-behavior-inventory.md`](../getSplitStyles-behavior-inventory.md);
- record source and built-package presence-context identity.

No engine code.

### 1. Groups, containers, and the container API

- remove implicit container CSS and native measurement from `group`
  (`getSplitStyles.tsx:756-771`);
- delete the `webContainerType` compat setting with it: the public setting
  (`types.tsx:1289-1300`), its default (`createTamagui.ts:257-269`), its read and
  fallback branches (`getSplitStyles.tsx:595-606, 754-785, 1232-1245`), and the
  CLI prompt field (`cli/src/generate-prompt.ts:115-119`). Commit `bf3dce0a6b`
  introduced it as the V2 group/container compatibility mode and its message
  states that the next major removes it when groups become state-only. Public
  breaking change; needs a migration note pointing at the new `container` API;
- implement the section 5 container API;
- keep Tailwind `group-*` and named group modifiers;
- ship a development diagnostic for `@sm/name:` resolving against a `group` that
  no longer establishes a container, naming the `container="name"` fix;
- update group and container tests plus compiler/runtime agreement.

Its own receipt. Does not share a commit with parser work.

### 2. Move immutable work out of render

- normalize frontend and static style configuration at definition;
- compile modifier, variant, compound-selector, property, shorthand, token, and
  transform metadata there;
- route every supported registry mutation through one revisioned owner;
- mark static configs containing functional variants so only those materialize
  the merged props record;
- make the current runtime consume the compiled metadata and delete the setup it
  replaces.

Changes no grammar, cascade, lifecycle, or output semantics. Introduces no unused
shadow structures and no second emitter.

Gate: definition-time mutation and getter-timing pins pass, per-render setup
falls in the profile, size does not regress.

### 2b. Cheap independent wins, one commit each

None needs the rebuild first, none changes grammar or cascade, and together they
are likely most of the measurable time win.

- hoist the render-invariant decisions out of the per-prop loop (6.3);
- one transform accumulator in authored order (6.8);
- delete the `useComponentState` prepass and its hand-rolled loop;
- transition keys into `webOnlyStyleProps` (6.9);
- delete the duplicated shadow/legacy-transform refusal block
  (`directStyle.ts:1997` and `:2160`);
- return the classification from the first `resolveClauseChain` on an object's
  first key instead of resolving twice (`directStyle.ts:2090` then `:2177`);
- `joinChains` without `split` / `join`;
- delete `Object.is` and its `NaN` pins (6.11);
- delete `overriddenContextProps` and `originalContextPropValues`;
- delete the `data-*` to `dataSet` shim (`getSplitStyles.tsx:826-840`);
- merge the two functions named `normalizeStyle` (`helpers/normalizeStyle.ts` and
  `getSplitStyles.tsx:1823`);
- move `pressDebugDetail` and `pressDebugName` inside the native branch that
  consumes them (`createComponent.tsx:1862-1871`, consumed at `:1887`), then
  sweep the other 20 `TAMAGUI_TARGET` sites in that file and the 19 in
  `getSplitStyles.tsx` for the same shape;
- replace `getStyledContextKeys`' per-render object with a `Set` built once per
  `staticConfig` (`createComponent.tsx:103-120`; consumers only test membership);
- hoist `resolveAnimationDriver`'s duck-type validation to `createTamagui`;
- delete the per-prop `elevationAndroid` compare on web (`propMapper.ts:85-88`,
  whose own comment says it should not be necessary);
- delete six unreferenced files: `helpers/normalizeStylePropKeys.ts` and
  `.native.ts`, `constants/accessibilityDirectMap.tsx` and `.native.tsx`,
  `helpers/getFontLanguage.ts`, and `helpers/useRenderElement.tsx`. **READ**, all
  six have zero references anywhere in the repo, including barrels and tests.
  `getShorthandValue.ts` looks like a seventh but is barrel-exported from
  `index.ts`, so it is a public removal and stays out of this commit.

### 3. Rebuild the loop

One assembled unit, because a partial split leaves a forbidden rescan:

- the scalar scanner, state mask, call-stack condition locals, and object
  adapter;
- dynamic className through the same cursor, deleting frontend preprocessing and
  frontend programs;
- tokens, shorthand, border, shadow, transitions, safe areas, and ordinary
  properties through one sink;
- static and functional variant output traversed in place;
- neutral output frame with the two finalization policies;
- deletion of `directStyle.ts`, component runtime use of `propMapper`,
  `getSubStyle`'s separate engine, lifecycle scanners, `hasFlatModifier`,
  duplicate grammar helpers, component-splitting arrays, temporary condition
  collections, and source replay;
- per-clause refusal semantics flipped for style and variant paths together, if
  that remains the contract.

`getSubStyle` must route through the same sink here or the old engine is not
deleted. **READ**: `pressStyle`, `hoverStyle`, and `pseudoDescriptors` appear
**zero** times in `getSplitStyles.tsx`, so it survives only for
`accept: 'style' | 'textStyle'`, while still calling `propMapper`, running
`Object.getOwnPropertyDescriptors` per call, and carrying two of the four
transform systems.

Internal development may use short-lived local commits. The runtime switch is
reviewed and merged as one unit. There is never a commit where an authored string
is handled partly by the old engine and partly by the new one.

Gate: invariants 1 through 9 and 11 through 12 hold, all behavior pins pass, the
processor artifact falls materially, and no broad runtime scenario regresses
outside paired noise.

### 3b. Presence and lifecycle hook protocol

Separable from the scanner. Its own commit and its own receipt.

### 3c. Compound arena

Separable. Consumes clauses without changing how they are produced.

**Why 3b and 3c are split out:** `26ee0b751a` moved one decision into the emitter
and opened a motion-driver regression that neither the core web suite nor the
pinning test caught. A single commit containing the entire engine has no bisect
story.

### 4. Specialize the web artifact

- pin that strict compiled output retains no style-engine spans, which is mostly
  already true;
- move `platformMatches` so the last 50 marginal gzip leaves the compiled arm;
- make `TAMAGUI_DID_OUTPUT_CSS` delete all runtime CSS generation and insertion;
- keep native-only lowering behind `process.env.TAMAGUI_TARGET`, which already
  folds (**READ**, "Rolldown folds `isWeb` through `directStyle`"), rather than
  new module boundaries, which would contradict the one-home rule;
- prove `parseValue` is absent from the `View` chunk.

Gate: production Vite, webpack, and Metro web builds agree on which families
disappear. Inspect built content, not version strings.

### 5. Theme and provider costs

Separate campaign. Does not share a failure mode with the engine and must not
share a checkpoint, or a provider win hides an engine miss.

---

## 8. Follow-on: conditional context reads

Sequenced **after** the rebuild. Each item is independent.

**READ**, `createComponent.tsx` has four `useContext` calls. `ComponentContext`
(`:361`) and `GroupContext` (`:496`) are unconditional for every component.
Styled context (`:357`) is already ternary'd and `NativeMenuContext` (`:374`) is
already platform-gated, so neither offers more.

**Hard constraint: `use()` never goes inside the style pass.** The compiler host
(`compiler/static/src/compilerHost.ts`) and
`compiler/static-tests/tests/flatValues.web.test.tsx` call `getSplitStyles`
outside any React render, and the processor-artifact contract treats React as a
host input. Conditional `use()` lives in the component layer. Where the scanner
must signal a need, it does so through compiled static metadata from checkpoint 2
or a reader closure the component passes in, never by reading context itself.

| target | opportunity |
| --- | --- |
| presence | driver exposes `presenceContext` instead of a `usePresence` hook; core owns registration and reads it conditionally |
| `GroupContext` | read only when the component declares a group or container, or its compiled metadata says its styles reference a group/container condition |
| native `TextAncestor` | read only for native View rendering where text ancestry matters |
| `ThemeStateContext` | potentially the largest win, but needs `useThemeWithState` split into "obtain the theme resource" and "run theme lifecycle machinery" first. Its own design pass. |
| `ComponentContext` | carries text ancestry, animation driver, media emitter, and parent focus state. Conditional reads do little until it is decomposed; do that after the items above have moved out. |

Order: presence, then `GroupContext`, then native `TextAncestor`, then split
`useThemeWithState`, then decompose `ComponentContext`.

For presence, keep the effect-timing caution in 6.12.

---

## 9. Follow-on: web API alignment

Separate campaign. Shares no failure mode with the engine.

### 9.0 Decided: stop extending React Native's `ViewProps`

**Owner decision.** Tamagui declares its own base prop types instead of
inheriting React Native's. This is the headline item of this campaign and the
rest of the section is downstream of it.

**READ**, the evidence that this is cheaper than it sounds:

- **Every `react-native` usage on the web path is type-only.** The only
  `from 'react-native'` imports in web files are `import type` in
  `types.tsx:15-23` (`PressableProps`, `RNText`, `RNTextStyle`,
  `ReactTextProps`, `View`, `ViewProps`, `ViewStyle`) and
  `interfaces/RNExclusiveTypes.ts`, plus one `.test-d.ts`. Every runtime import
  lives in a `.native.ts` / `.native.tsx` file that web never loads.
- **`react-native` is a `devDependency`, not a peer**, in both `@tamagui/web` and
  `@tamagui/core`. Nothing forces it on users through the manifest.
- **But the published types do force it.** `code/core/web/types/types.d.ts`
  carries the `from 'react-native'` import, so a web-only consumer's TypeScript
  has to resolve React Native's types to use Tamagui at all.

That last point is the user-facing win: **a web app stops needing React Native
installed for types to resolve.**

**Half of this already exists, and that changes the shape of the work.** **READ**
`dom/styleTypes.ts:1-32`: it is already "the style grammar `style()` accepts,
owned by Tamagui rather than borrowed from react-native", written precisely
because "`@tamagui/core/dom` is the one entry that must typecheck in a project
with no react-native installed, so nothing here may reference it." It types 59
properties off `csstype`'s `Properties` and declares its own `DimensionValue`,
`ColorValue`, `FlexAlignType` and friends. `dom/styleTypes.test-d.ts` then
asserts at the type level that its key set is **exactly** `StackStyleBase &
TextStylePropsBase`.

So the v3 move is not "write a new base type surface". It is **promote
`styleTypes.ts` to be the only definition and delete the RN-derived one.** That
is cheaper, and it retires a hand-maintained parity test whose whole job is
keeping two declarations of the same thing in step, the same
`// KEEP IN SYNC WITH ^` smell as `RNExclusiveTypes.ts`, one file over.

The cost of the current arrangement is already visible: `display` is declared
identically in both files (`types.tsx:2681`, `dom/styleTypes.ts:187`) and
**neither includes `'grid'`** (see §9.1).

What gets deleted, the "whole thing":

- the `import type { ... } from 'react-native'` in `types.tsx:15-23`;
- `interfaces/RNExclusiveTypes.ts` entirely: `RNExtraProps`, `RNViewProps`,
  `RNTextProps`, and the `RNOnlyProps` union. That file carries a
  `// KEEP IN SYNC WITH ^` comment over a hand-maintained ~25-entry union, which
  is its own drift hazard;
- `code/core/core/src/reactNativeTypes.ts`, a one-line re-export;
- the `Omit<ViewProps, ...>` gymnastics in `StackNonStyleProps` (`types.tsx:2732-2757`)
  and `TextNonStyleProps` (`:2765+`), including the `keyof RNOnlyProps` and
  `keyof ExtendBaseStackProps` subtractions and the six event handlers omitted
  only because RN and DOM types conflict.

**This also supersedes the a11y prop question below.** Once Tamagui declares its
own base props, the roughly 45 `accessibility*` props stop arriving from RN's
`ViewProps` and simply are not declared. No `Omit` union is needed, so the
option-1 risk (a large `Omit` costing more TypeScript time than it saves)
disappears.

What to watch:

- **Native parity is the real work.** The native path still needs these props to
  reach RN components. The declared types must stay assignable to what RN
  expects, and `dom/html.native.tsx` plus `htmlRuntime.native.tsx` remain the
  adapter.
- Declare the base props from the DOM and CSS side, not by copying RN's shape
  back in under a new name. Copying it renames the problem.
- `ExtendBaseStackProps` / `ExtendBaseTextProps` (`types.tsx:2637`) are the
  declaration-merging escape hatch for consumers; check whether they still make
  sense once the base is ours.
- Measure `v3-type-performance.md` before and after. This should be the largest
  single TypeScript win available, and it should be proven, not assumed.

Sequence it after the engine rebuild, with its own receipt.

### 9.1 Decided: web is the default surface, native adapts

**Owner decision.** Author in CSS. Support more of CSS than React Native does.
Where native cannot express something, drop it and say so in development.

The economics are asymmetric and that asymmetry is the whole argument. **READ**
`expandStyle.ts:95`: the entire native adapter sits inside
`process.env.TAMAGUI_TARGET === 'native'`. Under the §4 rule (web production
bytes are the only budget), **every additional native lowering costs zero on the
side that counts**, so the ceiling on how much CSS we accept is design effort,
not size.

**Prove the premise once before building on it (INFERRED, not yet measured).** I
read the guard; I did not measure a bundle. The branch folds to `if (false)`, but
the bytes only disappear if the bundler then drops what only it referenced:
`resizeModeMap`, `verticalAlignMap`, `nativeInlineExpansions`, and the
`parseBorderShorthand` / `parseOutlineShorthand` **imports**, which requires
tree-shaking across a module boundary. Rollup and esbuild both do this, and the
plan already assumes `TAMAGUI_TARGET` folding elsewhere, so the expected answer is
yes. It is still one grep of a production web bundle for `resizeMode` and
`textAlignVertical`, and §9.1 should not start until someone has run it. If those
strings survive, the free-adapter argument is wrong and this section needs
rewriting, not patching.

#### The `web:` prefix is not what gates the surface

- **Every web-only style prop is already accepted unprefixed on web.** **READ**
  `validStyleProps.ts:281` and `:306` spread `webOnlyStylePropsView` and
  `webOnlyStylePropsText` into `stylePropsView` / `stylePropsTextOnly` under
  `TAMAGUI_TARGET === 'web'`. `overflowX`, `float`, `clipPath`, `willChange`,
  `userSelect` need no prefix today.
- **A `web:` clause cannot widen the key allowlist.** **READ**
  `getSplitStyles.tsx:1102-1106`: a conditional clause whose key fails
  `isValidStyleKey` is dropped with `"is not a valid style on this component;
  the conditional variant value is dropped."` The clause is evaluated *after*
  host validity, never instead of it.

So "stop writing `web:` everywhere" and "accept more CSS unprefixed" are the
**same change**: grow or invert the host validity table. There is no separate
prefix work to schedule, and no prefix ergonomics to design.

#### Two frontends, and one of them already falls through

**Owner correction, and it changes the fix.** The surface is not one authoring
mode. `helpers/styleFrontend.ts:59-80` defines a per-component `StyleFrontend`,
frozen onto its static config by the package it was imported from: regular
`@tamagui/core` components carry `regularStyleFrontend` (`:102-104`, identity),
and `@tamagui/tailwind` carries its own.

**Tailwind mode already has passthrough, and grid already works there.** **READ**
`tailwind/src/candidate.ts:462-468`: a class the frontend does not claim is kept
raw by `preserveRawClass`. `frontend.ts:81-85` partitions a styled base into
`baseStyle` (styles) plus `passthroughClassName` (the raw remainder), and
`getSplitStyles.tsx:527` prepends it. The test at
`tailwind/src/__tests__/frontend.web.test.tsx:211` asserts
`passthroughClassName` is exactly `'grid-cols-3 shadow-none'`. Unclaimed classes
stay raw so the app's own CSS applies them.

So the fall-through I proposed to build exists, in the mode where a class string
makes it natural.

**But passthrough is not free, and that argues for claiming more rather than
passing more through.** **READ** `getSplitStyles.tsx:528-530`: a non-empty
`passthroughClassName` sets `shouldDoClasses = false`, which is what gates the
atomic-CSS path (`:1283`, `:1292`). **One unclaimed class turns off atomic CSS for
that entire component.** Every property the tailwind frontend learns to claim is a
component that keeps its classes.

**In tamagui mode the gate is the types, not a runtime table.** Props are typed,
so TypeScript decides at authoring time whether `gridTemplateRows` is a style
prop. The runtime table exists to answer the same question a second time, from a
separate hand-written source, which is the entire defect above: the types and the
table are two declarations of one fact and they have drifted.

That reframes the work. It is not "invert a runtime discriminator", it is **one
declaration, with the runtime table derived from it.** Nothing has to guess,
because in tamagui mode nothing unknown should arrive; and where something does
(untyped JS, a spread), today's DOM-attribute fall-through is an acceptable last
resort rather than the thing the design rests on.

#### An unlisted style key becomes a DOM attribute

**READ** `getSplitStyles.tsx:1160`, the fall-through of the prop loop:
`viewProps[key] = val`. A key in neither `stylePropsAll` nor `validStyles` lands
on the element as an attribute.

This is not theoretical. **READ** `webOnlyStyleProps.ts:76-80`, three properties
added under the note: *"real style keys, not DOM attributes: without these an
authored value falls through to viewProps and reaches the element as an unknown
attribute"*. The three are `overflowWrap`, `wordWrap`, `resize`. Someone hit this
and patched it one property at a time.

The table is not a convenience list. It is the only thing standing between a CSS
property and a broken DOM attribute, and it is hand-maintained across eight
objects in two packages.

#### Evidence that hand-maintenance has already drifted

**Grid is declared half-way, and `display="grid"` does not typecheck.**

- Ten grid properties are allowlisted (`validStyleProps.ts:116-117, 149-156`) and
  typed in both type files (`types.tsx:2510-2546`, `dom/styleTypes.ts:412-421`).
- `display` is typed
  `'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'`
  in **both** files (`types.tsx:2681`, `dom/styleTypes.ts:187`). No `'grid'`.
- Result: `gridTemplateColumns="1fr 1fr"` typechecks and emits CSS, while
  `display="grid"` is a type error. You get grid's children without grid.
- Absent from every table: `gridTemplateRows` (while `gridTemplateColumns` and
  `gridTemplateAreas` are present), `gridTemplate`, `gridArea`, `gridAutoFlow`,
  `gridAutoRows`, `gridAutoColumns`, `justifyItems`, `justifySelf`, `placeItems`,
  `placeContent`, `placeSelf`.
- **The runtime already works.** `display` is in `nonAnimatableViewProps`
  (`validStyleProps.ts:75`), so `display="grid"` emits `display: grid` today.
  Only the type blocks it.
- **And it is not a dead end on native.** **READ** RN 0.86's
  `ReactCommon/yoga/yoga/YGEnums.h:50` (`YGDisplayGrid`) and `:87-92`, the grid
  track types (`Auto`, `Points`, `Percent`, `Fr`, `Minmax`). Yoga is implementing
  CSS Grid, while RN's JS `StyleSheetTypes.d.ts` exposes no grid property at all.
  The layout engine is ahead of the JS surface, so declaring the full grid surface
  on web now is running toward where native is going.

**Two confirmed bugs, both from the same duplication.**

1. **`userSelect` is silently dead on native.** It is declared in
   `nonAnimatableTextOnlyProps` as cross-platform (`validStyleProps.ts:106`) *and*
   in `webOnlyStylePropsView` as web-only (`webOnlyStyleProps.ts:75`). Web-only
   means it joins `webPropsToSkip` on native (`webPropsToSkip.native.ts:13`), and
   `skipProps` is checked at `getSplitStyles.tsx:755`, **before** `isValidStyleKey`
   at `:823`. So it is dropped before validity is ever consulted, while **RN 0.86
   supports it** (`StyleSheetTypes.d.ts:643`).
2. **`expandStyle`'s `objectFit` native adapter is unreachable from the prop
   path.** `objectFit` is in `nonAnimatableWebViewProps`
   (`webOnlyStyleProps.ts:30`), so native skips it at `:755`, yet
   `expandStyle.ts:102-105` has a native `case 'objectFit'` mapping it to
   `resizeMode`. That code cannot run for `objectFit="cover"`. It runs only for
   `style={{ objectFit: 'cover' }}`, which bypasses `skipProps` entirely.

Both are the same shape, and the shape is already known: **READ**
`webPropsToSkip.native.ts:6-7` subtracts `textOverflow` from the native skip list
with a comment explaining its native mapping. One key was noticed and fixed. Two
were not.

**The two authoring paths do not agree.** **READ**
`getSplitStyles.tsx:608-635`: `style={{...}}` runs `normalizeStyle` then
`contributeStyleValue` with **no `skipProps` check and no `isValidStyleKey`
check**. Props run the full gauntlet. `normalizeStyle.ts:25` does call
`expandStyle`, so the native *lowering* applies to both, but the *allowlist*
applies to only one. Same authored intent, two answers, decided by spelling.

#### What to do

1. **Generate the style-key universe instead of hand-writing it.** `csstype` is
   already a dependency (`core/web/package.json:110`) and already supplies 59
   property types in `dom/styleTypes.ts`. Eight hand-maintained objects across two
   packages is the defect source above, not an incidental mess.
2. **Keep `webOnlyStyleProps` only as a native denylist.** On web, once every CSS
   property is valid, the list has no job. It exists today only to add properties
   back into `stylePropsView`. On native it has a real job: "no native equivalent,
   drop it." Halving its meaning removes the `userSelect` bug class by
   construction, because a property becomes either cross-platform or
   native-dropped and can no longer be both.
3. **Make the two authoring paths share one decision.** Whatever the rule becomes,
   `style={{...}}` and props must consult it identically. This belongs in the §6.1
   consolidation, not in a separate campaign.
4. **The types are the surface; derive the runtime table from them.** Do not build
   a runtime discriminator that guesses whether an unknown camelCase prop is a
   style or a DOM attribute. In tamagui mode TypeScript has already answered, and
   the runtime table's only job is to agree with it. One declaration, generated
   both ways. Today's DOM-attribute fall-through stays as the last resort for
   untyped callers, where being wrong is cheap.
5. **Teach the tailwind frontend to claim more, rather than leaning on
   passthrough.** Passthrough is correct as a safety net and costs a component its
   atomic CSS (`getSplitStyles.tsx:528-530`). Claiming `grid-cols-*` beats passing
   it through.
6. **Do not gate the surface to what RN's JS types allow.** Yoga has grid before
   RN's types do. The web surface leads; native catches up or drops.

#### The native fall-through warning

The author's fix is always the same (add a `native:` clause), so the message must
name it. Cost is zero on both counts that matter: `TAMAGUI_TARGET === 'native'`
tree-shakes it out of web, and `NODE_ENV === 'development'` tree-shakes it out of
native production.

Put it **where the drop already happens**, not in a new pass:

- key-level: the `skipProps` return at `getSplitStyles.tsx:755-804`, which today
  drops every web-only property on native in silence;
- value-level: `expandStyle`'s native branch already carries the signal:
  `return []` means "intentionally dropped" (`expandStyle.ts:126`, `visibility`),
  `return undefined` means "keep as authored".

Use `warnOnce` (`helpers/warnOnce.ts`), the established pattern for exactly this,
so a dropped style inside a list warns once rather than once per row.

**Do not add a scan over the final style object.** It walks every key of every
style on the native render path in dev, and it throws away the one thing a good
message needs: *which* rule dropped the value. The information is only complete at
the decision site.

### 9.2 Decided: keep `style={}`, narrow it hard, delete sub-styles

**Owner decision.** `style` stays. Its type shrinks to what the runtime actually
implements. `accept: 'style' | 'textStyle'` and `getSubStyle` go entirely.

#### The type promises three things the runtime does not do

**READ** `types.tsx:2756` (and `:2786` for Text), on the most-used prop in the
library:

```ts
style?: StyleProp<LooseCombinedObjects<React.CSSProperties, ViewStyle>>
```

Expanding `LooseCombinedObjects` (`:2718`) and `StyleProp` (`:3635`), that is
`(CSSProperties | ViewStyle | (CSSProperties & ViewStyle)) | RegisteredStyle<T> |
RecursiveArray<T | RegisteredStyle<T> | Falsy> | Falsy`.

The whole runtime is 27 lines: `mergeStylePropAtCurrentPosition`
(`getSplitStyles.tsx:608-635`). Falsy returns, **one** level of array, `$$css`
objects become classNames, everything else goes `normalizeStyle` then
`contributeStyleValue` per key.

1. **`RecursiveArray` flattens exactly one level.** `const style = isArray ?
   styleProp[index] : styleProp`, then `normalizeStyle(style)`. A nested array
   reaches `normalizeStyle`, whose `for (let key in style)` (`normalizeStyle.ts:19`)
   enumerates array *indices*, producing `{0: …, 1: …}` and contributing `'0'` and
   `'1'` as style keys. There is no `flatten` in core; I grepped. Nothing caught it
   because `style={[[` appears nowhere in the repo.
2. **`RegisteredStyle<T>` is dead.** RN 0.86's `StyleSheet.create` is
   `create<T>(styles: T & NamedStyles<any>): T`, documented "an identity function"
   (`StyleSheet.d.ts:28-42`). It returns the objects. A number arriving anyway
   enumerates nothing and vanishes silently.
3. **`CSSProperties` is offered on native.** Nothing narrows the union per target.

**Target shape:** `TamaguiStyle | TamaguiStyle[] | Falsy`. Drop `RegisteredStyle`,
flatten `RecursiveArray` to a flat array (all the runtime implements and all
anyone uses), and drop `LooseCombinedObjects` once §9.0 makes `styleTypes.ts` the
single style declaration. Likely the largest single TypeScript win in the surface,
and it makes the type stop overpromising.

#### `style` is a second pipeline, and that is a §6.1 item

Props run `skipProps` (`:755`), `isValidStyleKey` (`:823`), and the text-on-View
host ruling (`:1044`, `:1151`). `style={}` runs none of them. That is the root of
the `objectFit` divergence in §9.1: `style={{objectFit}}` reaches the native
adapter and `objectFit=` is dropped before it. One decision, consulted by both
paths, removes the class rather than its two instances.

#### Sub-styles: remove, and the 0-runtime argument does not hold

The case for keeping `accept: 'style'` is that it is the only declarative way to
say "this custom prop is a bag of styles", which a compiler would need. Three
readings retire it:

- **The compiler never uses it for extraction.** `accept` appears **once** in
  `compiler/static`: `compilerHost.ts:1256`, as the third argument to
  `isValidStyleKey`. It widens host validity so the component does not bail. There
  is no sub-style flattening and no `getSubStyle` in the compiler at all.
- **Three of the four declarations are already dead.** Checkbox (`:36`, `:63`) and
  Toggle (`:58`) declare `accept: { activeStyle: 'style' }` on their frames, but
  the wrappers destructure `activeStyle` out of props first
  (`Checkbox.tsx:114-121`, `Toggle.tsx:80-87`) and spread its keys as ordinary
  props (`:193`, `:216`, `:103`). The frame never receives the prop, so the entry
  cannot fire. **Tabs does the same thing with no `accept` declaration**
  (`Tabs.tsx:264`), which is the proof the plain spread is sufficient.
- **The one live caller cannot be flattened anyway.** ScrollView's
  `contentContainerStyle` (`ScrollView.tsx:14-16`) is the only reachable
  `accept: 'style'`, on a component declared `neverFlatten: true` (`:13`).

`'textStyle'` has zero declarations anywhere. It exists only in the type
(`types.tsx:3059`), the runtime check (`getSplitStyles.tsx:704`), and two
conditional type branches (`styled.tsx:177`, `:520`).

**Keep the other `accept`.** `accept: { placeholderTextColor: 'color' }`
(`input/src/shared.tsx:132-136`) maps a non-style prop to a **token category** so
`"$blue10"` resolves on it. It never routes through `getSubStyle`; only
`'style'`/`'textStyle'` do (`:704`). That is the answer for scalar custom props
and it stays. Delete only the `'style' | 'textStyle'` arm of the union.

**What the two real needs become:**

- conditional styles on the same element (`activeStyle`) are flat clauses. Note
  the state name is a live question, not a blocker: `active:` in the grammar is an
  alias of `press`, lowering to `:active` (`lowerProgram.ts:71-73`), so it means
  "while pressed" and these components mean checked or selected. Nothing blocks
  the removal today, because all three already spread props;
- styles for a *different* element (`contentContainerStyle`) cannot be a clause by
  definition. It is a passthrough prop and does not need the style engine: type it
  as a style object and hand it over untouched.

**What gets deleted:** `getSubStyle` (`getSplitStyles.tsx:1664-1750`) with its
`Object.create(parentProps, Object.getOwnPropertyDescriptors(styleIn))` prototype
trick and its own 4-deep nested transform loop; the `accept === 'style'` branch at
`:701-711`; the `'style' | 'textStyle'` arm at `types.tsx:3059`; and the two
`styled.tsx` conditional type branches.

Note the wasted work this also removes: where the path was live, `getSubStyle`
resolved tokens into a style object which the consumer then spread back as props,
re-entering the prop pipeline to be resolved a second time.

#### Decided: `style` is the Tamagui style object, not React Native's

The tempting alternative is "make `style` just the React Native style API": a
plain object, no tokens, no clauses, a true escape hatch. **Rejected**, because it
is both more code and the breaking direction.

**`style` is already a full Tamagui style surface spelled as an object.** **READ**
`directStyle.ts:2243-2252`: `contributeStyleValue` routes every string value
through `contributeStyleString`, the flat-value clause scanner. So
`style={{ backgroundColor: 'red hover:blue' }}` parses clauses today. `:2221`
handles the `'safe'` magic value. Tokens resolve because this is the same emit
path props use, and `core-test/flatValuePrograms.web.test.tsx:778` pins
`style={{ padding: '10px 20px' }}` interleaving with a `paddingTop` program in
authored order.

**A raw path would be more code, not less.** The expensive half of the current
handling is not token or clause resolution. It is merge-and-emit: merging at the
authored prop position (why `mergeStylePropAtCurrentPosition` is a closure called
mid-loop), the atomic-CSS-versus-inline decision, transform merging against
prop-contributed transforms, and `expandStyle`'s native lowering. A raw path needs
all of it and skips only three things, so it means a bypass flag threaded through
`emitValue` / `emitProperty` or a parallel emitter: more hot-path branches and a
second semantics to test. The existing `noNormalize` / `noSkip` / `noExpand` /
`noMergeStyle` family shows where that road ends.

**And it breaks silently.** `style={{ backgroundColor: '$blue10' }}` works today.
Raw semantics emit the literal `$blue10` as a CSS value, which is invalid, so it
simply stops applying. No error, no warning.

So the rule is the one that costs nothing: **`style` carries the same style
semantics as props.** One meaning, two spellings.

**§9.1 is what makes this collapse free.** The only job `CSSProperties` does in
that union is admit CSS properties the Tamagui prop surface rejects. Once §9.1
accepts all of CSS on props, the two converge and the branch is redundant, so
narrowing `LooseCombinedObjects` to a single style type loses nothing. The two
decisions are more coupled than they look; do not land §9.2's type narrowing
before §9.1.

**One inconsistency to settle in the same change:** `style` gets tokens and
clauses but **not shorthands**. **READ** `normalizeStyle.ts:19-41`, which never
consults `conf.shorthands`, against `getSubStyle` at `getSplitStyles.tsx:1686`,
which does. So `style={{ px: 10 }}` silently does not expand while
`style={{ backgroundColor: '$blue10' }}` resolves. Nobody chose that middle
ground, which is itself the evidence these semantics were never stated. Under the
rule above, shorthands apply.

**Already correct, keep it.** **READ** `dom/html.native.tsx:47-69` and
`htmlRuntime.native.tsx:103-131`: web APIs are authored and mapped onto RN props
on native. `aria-label` to `accessibilityLabel`, `aria-checked` to
`accessibilityState.checked`, `aria-valuemax` to `accessibilityValue.max`,
`tabIndex` to `focusable`, `readOnly` to `editable`, `disabled` to `disabled`
plus `focusable` plus `accessibilityState.disabled`, `aria-hidden`, `aria-live`,
with explicit `'no native equivalent'` entries. This is the React Strict DOM
model, already shipped. There is no web `focusable` adapter and none is needed.

**Not core.** `code/core/web` has zero imports of `react-native-web-internals`
and no `react-native-web` dependency; only `react-native-web-lite`, itself, and
`compiler/static` depend on it. So `createDOMProps/index.tsx` (427 lines, roughly
45 `accessibility*` to `aria-*` mappings) is never on core's render path, which
is why `react-native-web-internals` is absent from every retained bench arm.
Changing it is an rnw-lite decision worth zero core bytes. Left alone for now.

**What is left in core:**

- the `data-*` to `dataSet` shim, already scheduled in checkpoint 2b;
- `getSplitStyles.tsx:902-914` rewrites `testID` for RNW and RN-driver hosts. The
  native adapter already maps `data-testid` to `testID`
  (`dom/html.native.tsx:51`), so this is the same reverse-shim shape and goes with
  it;
- `eventHandling.ts:10-22` `getWebEvents`, whose own header says it "maps
  RN-style events to DOM events". It allocates a nine-key object with a computed
  key per render and `Object.assign`s all nine onto `viewProps`, `undefined`
  values included. Web should attach DOM events directly;
- `helpers/nativeOnlyProps.ts`, a 33-entry RN prop blacklist merged into
  `skipProps` on web (`helpers/skipProps.ts:39-41`), reported at 318 gzip. Web
  should not ship a table of React Native prop names;
- `hooks/useComponentState.ts:434-443` `isDisabled` reads
  `accessibilityState?.disabled` and `accessibilityDisabled` on every render of
  every component. After this campaign it is
  `disabled || passThrough || aria-disabled`, which is also a §6.11 win;
- **the types**, which is the real remaining cost, but not in the way an earlier
  draft of this plan said. **Correction, READ `types.tsx:2720-2731`:** the
  deprecated a11y prop aliases were **already removed in v2**. That comment
  documents the removal and the `aria-*` mapping; it is not a live shim.

  The `accessibility*` props still in the surface come from **React Native's own
  `ViewProps`**, imported at `types.tsx:21-23` and inherited through
  `StackNonStyleProps extends Omit<ViewProps, ...>` (`:2732-2757`). So there is
  nothing to delete in Tamagui's own declarations. The two real options are:

  1. add roughly 45 names to the existing `Omit<ViewProps, ...>` union. This may
     **cost** TypeScript performance rather than save it, because large `Omit`
     unions are themselves expensive;
  2. stop extending RN's `ViewProps` and declare Tamagui's own base props
     explicitly. This is the actual React Strict DOM move, it is much bigger, and
     it is the only one that genuinely shrinks the surface.

  Option 2 is the right target and needs its own design pass. Do not let anyone
  land option 1 as a TS-perf win without measuring, because it plausibly
  regresses.

  Separately, and likely a bigger TS-perf item than the a11y props:
  `LooseCombinedObjects<A, B> = A | B | (A & B)` (`types.tsx:2718`) is applied to
  the single most-used prop as
  `style?: StyleProp<LooseCombinedObjects<React.CSSProperties, ViewStyle>>`
  (`:2756`). That is a three-way union of two very large object types, wrapped in
  `StyleProp`, which is itself recursive over arrays. Worth measuring against
  [`v3-type-performance.md`](../v3-type-performance.md) before anything else in
  the type surface. **§9.2 owns the fix**; this is the same item, not a second one.

Shape:

1. `aria-*`, `role`, `data-*`, and `tabIndex` are the authored API;
2. native keeps the existing adapter;
3. `accessibility*` keeps passing through at runtime but does no web-side work,
   with a development `console.error` naming the `aria-*` replacement;
4. remove them from the public types, or mark `@deprecated`, so the editor leads
   to the web spelling and the prop union shrinks;
5. docs, a skill, the migration guide, and the blog post carry the mapping table.
   `compiler/static-tests/tests/webAlignment.web.test.tsx` is the pin.

---

## 10. Behavior matrix

Run existing tests at the checkpoint that changes their behavior:

- parser agreement and flat-value programs on web, native, and SSR;
- conditional values in direct props, style props, variants, and compounds;
- group and container output and subscription updates, named and unnamed, plus
  the new container API and its diagnostic;
- nested viewport, container, theme, platform, state, group, and enter/exit
  conditions;
- transform families and transform/media query merging;
- border defaults, shadows, transitions, safe areas, tokens, shorthands, and
  token categories;
- variant resolution, functional variant reentry, getter reentry,
  `extras.props`, font-family token selection, and native `unset`;
- compound authored order, context, inheritance, 1,005 entries, absent versus
  undefined, a multi-selector Cartesian product, and nested arena growth past the
  original binding while an outer frame is live;
- HOC, `asChild`, parent merging, frozen parents, RNW `$$css`, and original
  provenance;
- presence aliases, enter/exit, raw animated values, hook order, hydration,
  no-rerender updates, platform-driver state, and a single context instance;
- **`DriverConditionedDiscrete.animated.test.tsx`**, the pin for
  hover/press-conditioned discrete props on the motion driver. `26ee0b751a` broke
  exactly this, root-caused to a stale 18-prop hand copy of
  `nonAnimatableStyleProps` in `animations-motion`. Deleting `directStyle.ts`
  must preserve `disableAnimationProps` routing.

Also pin:

- five distinct non-platform modifiers succeed and six fail;
- an exact colon-bearing variant key resolves as a variant before its value is
  treated as clauses;
- mutating a supported variant definition or registry invalidates compiled
  metadata at today's observable boundary;
- complete `transform` mixed with flat transforms across CSS, inline, native,
  media, and nested substyles, **asserting authored order on both platforms**;
- shorthand and longhand competition resolving to one leaf slot;
- CSS exact-slot replacement, stable precedence insertion, transition grouping,
  and synthetic border/shadow default removal;
- inline/native active-condition competition across condition identities;
- strict compiled mode reporting a dynamic input it cannot flatten;
- the style pass running outside a React render, as the compiler host calls it.

Native suites named explicitly: `getSplitStyles.native.test.tsx` and the ios,
tvos, and androidtv variants.

**Delete the `NaN` compound-matcher pins** with their `Object.is` (6.11).

Add behavioral tests only for missing contracts. Do not assert source strings,
loosen timeouts, add retries, or update snapshots without validating rendered
behavior.

---

## 11. Measurement

Extend the existing scripts. Do not build another benchmark system.

- public and processor artifacts plus the legacy core-union attribution
  (`attribute-bundle-gzip.ts`, which already has `--core` and
  `--parser-cluster=<checkpoint>` against the 78-selector
  `parser-cluster-manifest.json` with its `movedTo` relocation guard);
- `benchmark-get-split-styles.ts` for corpus timing;
- `run-benchmarks.ts` for paired V3/V2 mount and rerender;
- `profile-hotpath.ts` for clause-heavy, group, heavy, and animated CPU and
  allocation profiles;
- strict compiled fixtures for built-content inspection.

Each receipt records commit, Bun and Node versions, platform, minifier,
environment constants, fixture hash, warmups, sample count, median, dispersion,
host count, renders, complete gzip, union gzip, and declaration attribution.
Before and after use the same machine and seed. V2 is a same-run control.

**Every timing comparison is a same-run paired control.** Never compare against a
number quoted from a document. `GET_SPLIT_STYLES_BENCHMARK.md` records that
host-wide timing moved substantially between two runs, so a quoted number cannot
isolate a code change.

**Compiler and runtime lockstep**: any change to atomic class identity, transform
order, or clause precedence must change identically in the compiler, or mixed
compiled and runtime apps get hydration mismatches and a wrong cascade. Run
`parserAgreement.web.test.tsx` and `code/comparisons/conformance` at every
emission-changing checkpoint, not only checkpoint 1.

After code changes, build affected packages. Before completion, from the repo
root:

```sh
bun run lint
bun run check
```

---

## 12. Stop conditions

Stop and name the exact behavior or bytes if:

- a replacement lands while its predecessor is still reachable;
- a string or authored object is traversed twice outside the user-code boundary;
- condition state is stored anywhere but call-stack locals;
- transform output needs sorting or temporary object arrays, or stops being
  authored order;
- group state creates a query container again;
- the modifier table goes stale after a supported registry update;
- reentrancy corrupts an outer style or compound frame;
- a fixed compound capacity truncates an authored Cartesian product;
- deterministic CSS cascade would require replaying authored input;
- the style pass becomes uncallable outside a React render;
- a behavior-inventory pin fails because of consolidation;
- the processor artifact does not fall materially at checkpoint 3;
- a size win comes from removing an unrelated behavior or changing the ruler.

Do not respond with a fallback parser, dual-path cache, Proxy, runtime option,
conservative all-inline mode, or duplicated compatibility path. Fix the shared
source or return the failed premise for a decision.

**Note on caches**: this forbids fallback and dual-path caches. It does not
forbid the retained atomic identity cache (measured 29.7% allocation reduction,
with negative controls) or `styledDefaultsCache` (`getSplitStyles.tsx:249`).

---

## 13. Prior-campaign context

Read before forecasting anything.

The last campaign's summary line, "net zero at this precision," has been misread
as proof consolidation does not pay. **READ**, the per-checkpoint receipts in
`v3-handoff-log.md:5155-5930`:

| checkpoint | what it did | CORE | cluster |
| --- | --- | ---: | ---: |
| III-a | scanner signature, module-scope handlers | **-81** | |
| III-b | shared clause identity | +48 | |
| III-c0a/b/c/d | grammar semantic corrections | +7 | +6 |
| III-c1 | runtime normalization | | +55 |
| III-c2 | compiled vocabulary and invalidation | **+520** | **+440** |
| III-d | tooling leaves the app graph | **-520** | **-440** |
| IV-b | per-clause refusal, a new feature | **+308** | **+407** |
| IV-a | one clause resolver | **-362** | **-338** |

Three consolidation checkpoints delivered **-963**. Deliberate feature work in
the same sequence added about **+883**.

Two lessons, both binding here:

- **Never ship new behavior in the same ledger as a consolidation win.** The
  group and container change, the container API, refusal semantics, and the
  web-alignment audit each get their own receipt.
- **The largest single lever was moving code out of the app graph** (III-d,
  -520), larger than the fusion checkpoint. Still mostly unused: `parseValue`
  absent from the runtime graph, native lowering behind `TAMAGUI_TARGET`, CSS
  generation behind `TAMAGUI_DID_OUTPUT_CSS`.

And the experiment this plan proposes has never run. That campaign consolidated
the clause parser and resolver layer. It never touched emitter and splitter
fusion, `getSubStyle`, `propMapper`'s role, the transform systems, compound
matching, or the five scan sites.

The audit line in `V3_BETA_MEASUREMENT_STATE.md` ("replacing the rest of
`getSplitStyles` with `directStyle` cannot remove bytes") is **INFERRED from a
source and call-graph audit, not measured**, and scopes to the splitter's
component semantics: prop forwarding, HOC, `asChild`, `viewProps`, class
assembly, the React insertion effect. That half is irreducible and belongs
outside the processor artifact.

---

## 14. Scan results

Five read-only agents scanned for wins this plan does not already list. Full
findings, with file:line and consumer analysis, are in this directory:

- [`scan-rn-api-leftovers.md`](./scan-rn-api-leftovers.md), 15 findings
- [`scan-duplication.md`](./scan-duplication.md), 14 findings
- [`scan-render-waste.md`](./scan-render-waste.md), 19 findings
- [`scan-dead-code.md`](./scan-dead-code.md)
- [`scan-v2-legacy.md`](./scan-v2-legacy.md)

Round 3, on the web-default surface (feeds §9.1):

- [`scan3-platform-gating.md`](./scan3-platform-gating.md), the full platform
  gating inventory with every table listed key by key
- [`scan3-rn-shapes.md`](./scan3-rn-shapes.md), 10 style-value and 14 component-prop
  domains still shaped by React Native
- [`scan3-native-fallthrough.md`](./scan3-native-fallthrough.md), what native does
  with unsupported keys and values

**Treat those files as leads, not conclusions.** They are cheap-tier scans and
their framing sometimes overstates. Verify before acting. Two examples from
spot-checking: the `useMedia` effect is reported as "un-memoized" when the code
carries a comment explaining why it re-indexes every commit, and the six
"zero-consumer" files are actually five, because `getShorthandValue.ts` is
barrel-exported.

### Verified and folded into this plan

**READ**, each checked directly:

| finding | where | disposition |
| --- | --- | --- |
| `webContainerType` is the V2 group/container compat setting | `types.tsx:1289-1300`, `createTamagui.ts:257-269`, `getSplitStyles.tsx:595-606, 754-785, 1232-1245`, `cli/src/generate-prompt.ts:115-119` | **Checkpoint 1.** Commit `bf3dce0a6b`'s own message says "the later major removes it when groups become state-only." Delete the setting, its default, its fallback branches, and the CLI prompt field alongside the group split. Public breaking change, needs a migration note. |
| five files with **zero references anywhere** | `helpers/normalizeStylePropKeys.ts`, `.native.ts`, `constants/accessibilityDirectMap.tsx`, `.native.tsx`, `helpers/getFontLanguage.ts` | **Checkpoint 2b.** Free deletion. |
| `getShorthandValue.ts` duplicates `getExpandedShorthands.ts` | `helpers/getShorthandValue.ts`, exported from `index.ts` | Public API removal, not free. Separate decision. |
| `useRenderElement.tsx` unused | `helpers/useRenderElement.tsx` | **Checkpoint 2b.** Zero consumers, stale `.d.ts.map`. Duplicate of `getCustomRender`. |
| `nativeOnlyProps.ts`, a 33-entry RN blacklist merged into `skipProps` on web | `helpers/nativeOnlyProps.ts:1-39`, `helpers/skipProps.ts:39-41` | **Web alignment (§9).** Reported at 318 gzip in `comparisons/output/v3-golf-baseline-attr.txt`. Web should not ship a table of RN prop names. |
| `testID` to `data-testid` rewriting in the splitter | `getSplitStyles.tsx` | **Web alignment (§9).** The native adapter already maps it (`html.native.tsx:51`), so this is the same reverse-shim shape as `dataSet`. |
| `styleCompat` modes (`legacy`, `react-native`, `web`) | `config.ts:15, 81-84`, `helpers/expandStyle.ts:19-78`, consumed at `propMapper.ts:103,176` and `directStyle.ts:1923-1925` | **§5 theme/provider campaign or its own.** Added by `d72304a67b` "Implement v2 style compatibility modes." **`'web'` is already the default** (`config.ts:83`), so deleting the other two modes changes nothing for anyone who did not opt in, smaller than the earlier "public breaking change" framing. The plan already deletes the `directStyle` consumer; the surviving branch still needs removal. |
| `userSelect` silently dead on native, though RN 0.86 supports it | declared cross-platform at `validStyleProps.ts:106` **and** web-only at `webOnlyStyleProps.ts:75`; dropped via `webPropsToSkip.native.ts:13` at `getSplitStyles.tsx:755`, before validity at `:823`. RN support: `StyleSheetTypes.d.ts:643` | **§9.1.** A confirmed bug, and the reason the plan removes the "web-only *and* cross-platform" overlap by construction rather than by fixing one key. |
| `expandStyle`'s native `objectFit` adapter is unreachable from the prop path | adapter at `expandStyle.ts:102-105`; `objectFit` skipped on native via `webOnlyStyleProps.ts:30`. Reachable only through `style={{}}`, which bypasses `skipProps` | **§9.1.** Same shape as `userSelect`, and the precedent is already in the tree: `webPropsToSkip.native.ts:6-7` subtracts `textOverflow` for exactly this reason. |
| grid declared half-way; `display="grid"` is a type error | 10 grid props at `validStyleProps.ts:116-117, 149-156`; `display` union missing `'grid'` in **both** `types.tsx:2681` and `dom/styleTypes.ts:187`; runtime already emits it via `validStyleProps.ts:75` | **§9.1.** Two-line fix in two duplicated unions, and the clearest evidence that eight hand-maintained tables have drifted. Yoga already has `YGDisplayGrid` (`YGEnums.h:50`). |
| `style`'s type promises three things the runtime never implements | `types.tsx:2756, 2786, 2718, 3635` against `getSplitStyles.tsx:608-635`; `RegisteredStyle` dead per RN's `StyleSheet.d.ts:28-42` | **§9.2.** Nested arrays enumerate as indices and contribute `'0'`/`'1'` as style keys. No `flatten` exists in core. Narrow the type to `TamaguiStyle \| TamaguiStyle[] \| Falsy`. |
| three of four `accept: 'style'` declarations are unreachable | declared at `Checkbox.tsx:36,63` and `Toggle.tsx:58`; destructured out before the frame at `Checkbox.tsx:114-121`, `Toggle.tsx:80-87`; spread as props at `:193, :216, :103`; `Tabs.tsx:264` does the same with no declaration | **§9.2.** The only reachable one is ScrollView's `contentContainerStyle`, on a `neverFlatten: true` component. |
| the compiler does not use `accept` for extraction | one occurrence in `compiler/static`: `compilerHost.ts:1256`, as an argument to `isValidStyleKey` | **§9.2.** Retires the "sub-styles enable 0-runtime" argument. `accept` widens host validity so a component does not bail; it does not flatten. |
| `dom/styleTypes.ts` is already an RN-free parallel declaration of the base style surface | `dom/styleTypes.ts:1-32`, held to parity by `dom/styleTypes.test-d.ts` | **§9.0.** Changes that item from "write a new type surface" to "promote this one and delete the RN-derived twin", retiring a hand-maintained parity test with it. |
| flat top-level settings fallback | `config.ts:67-79`, carries a `@ts-expect-error` | Own decision. Added by `70ac20ddcd` while deprecating the flat shape. Public breaking change, mechanical migration. |

### Round 4: independent deep-dive, verified here

A separate deep-dive review. I checked its load-bearing claims by reading the code
rather than accepting them. These survived.

| finding | evidence | disposition |
| --- | --- | --- |
| **`objectIdentityKey` returns `''` for every `Set`** | `objectIdentityKey.tsx:3` iterates `for (const key in obj)`; a `Set` has no enumerable own properties, so the loop body never runs. Used as effect dependencies at `createComponent.tsx:1631-1632` for `pseudoGroups` / `mediaGroups` | **Checkpoint A, before the rebuild.** Confirmed bug. The group-subscription effect cannot see a group set change. |
| **`useProps` has a second, differently-broken surrogate, and it is also expensive** | `useProps.tsx:172-173`: `Object.keys([...pseudoGroups]).join('')`. Spreading a Set gives an array; `Object.keys` on an array gives **indices**, so the dependency is `'0'`, `'01'`, `'012'`: cardinality only. It sits in a **layout-effect dependency array** (`:168-174`), so it runs every render, before paint, twice per component: an array allocation, a second array of index **strings** (one integer-to-string conversion per group), and a joined string. Six allocations to compute a pure function of `set.size`, which is a free property read | **Checkpoint A.** Two hosts, two different failure modes for one concept: `createComponent`'s is cheap and wrong (constant), this one is expensive and wrong (cardinality). The concrete evidence behind §6.1's third-host correction. **Note the fix has no tradeoff:** retained Set identity plus a revision counter makes the dependency one number, correct *and* free. Nobody is buying correctness with cycles here. |
| web safe-area forces an extra render on mount | `createComponent.tsx:1600-1610` is not target-gated | **Checkpoint A**, with a **framing correction**: `subscribeToSafeArea` on web is *already* an inert `return undefined` (`resolveSafeAreaVariable.ts:7-9`), so the subscription costs nothing. The whole cost is the unconditional `updateSafeArea()` at `:1609` calling `setState(p => ({...p}))`. Web resolves through `env(safe-area-inset-*)` at `:1-6`. Gate the setState, not the subscription. |
| `parentSplitStyles` has no repository producer | `getSplitStyles.tsx:100`, recursed at `:1506`; `core-test/emitterParity.web.test.tsx:107` says outright it "has no repository-internal producer" and exists to pin the direct API | **Remove in v3.** Only a direct-API pin preserves it. |
| `createVariable.accessed` is module-global pass state | `createVariable.ts:83-85`, a bare `let accessed` behind `setDidGetVariableValue` / `didGetVariableValue` | **Rebuild.** Replace with a completed-frame flag. A standalone compiler-host styling pass must leave no global behind; that is a required receipt. |
| `dynamicThemeAccess` has no runtime consumer | produced at `getSplitStyles.tsx:1387`, typed at `types.tsx:3573`, read **only** by `core-test/getSplitStyles.ios.test.tsx:230, 245, 257` | **Stronger than "unused field."** Those three tests assert it as a stand-in for iOS theme re-render behavior. If nothing reads the field, they pin nothing and give false assurance. Removing it means replacing them with a real re-render assertion, not deleting coverage. |
| the unitless tables are two concepts, not three | already carried below as an unverified lead | **Now verified, with the carve-out.** `helpers/validStyleProps.ts:134` and style-grammar's list are the same property-level concept and should derive from one table. `variableValue.ts` matches **suffixes on theme token names** and stays separate. Do not "deduplicate" it. |

Two things this review got right about method, worth keeping: it separated the
**proven** key bug from the **inferred** stale-subscription consequence and asked
for a failing integration test before claiming the latter, and its evidence list
is more concrete than §11's was. Fold that list into §11.

### Found by direct reading, not by the scans

**READ**, each of these I opened and traced to its consumer myself.

**A pattern class the scans did not look for: work computed outside a
`TAMAGUI_TARGET` guard and consumed only inside it.** Constant folding cannot
remove it, because the computation is not lexically inside the guarded branch.

- `createComponent.tsx:1862-1871` computes `pressDebugDetail` (six property
  reads, two of them `accessibilityLabel`) and `pressDebugName`
  (`[displayName, pressDebugDetail].filter(Boolean).join(':')`, so an array, a
  filter result, and a joined string). Its **only** consumer is `:1887`, inside a
  `process.env.TAMAGUI_TARGET === 'native'` ternary. On web this runs every
  render for every component and the result is discarded. Fix is to move both
  declarations inside the native branch. `createComponent.tsx` has 21
  `TAMAGUI_TARGET` references and `getSplitStyles.tsx` has 19; the rest deserve
  the same pass.

Other verified render-path waste:

| what | where | why it is waste |
| --- | --- | --- |
| `getStyledContextKeys` allocates an object per render and fills it with `key: true` | `createComponent.tsx:103-120`, called at `:852` | its result is consumed **only** as `key in styledContext` (`getSplitStyles.tsx:1018` and `:1030`). `propKeys` is invariant per `staticConfig`, so this should be a `Set` built once at definition plus a separate check against the context value. Zero per-render allocation. |
| `getWebEvents` returns a fresh 9-key object with a **computed key** | `eventHandling.ts:10-22`, applied at `createComponent.tsx:1850` | the computed key (`[webStyle ? 'onClick' : 'onPress']`) forces a dictionary-mode object, and `Object.assign` then copies all nine keys onto `viewProps` including the `undefined` ones. Per render, per interacting component. The file header calls itself "maps RN-style events to DOM events", so it is also §9 material. |
| `isDisabled` reads five props per render | `hooks/useComponentState.ts:434-443`, called at `:258` | the comment directly above the call site says *"will be nice to deprecate half of these"*. Three of the five are RN accessibility spellings (`accessibilityState?.disabled`, `accessibilityDisabled`), so §9 shrinks this to `disabled \|\| passThrough \|\| aria-disabled`. |
| `resolveAnimationDriver` runs duck-type validation up to twice per render, inside an IIFE | `createComponent.tsx:499-520`, `helpers/resolveAnimationDriver.ts` | `isAnimationDriver` does `typeof`, then `'isStub' in value`, then `'useAnimations' in value && typeof ... === 'function'`. That is validating configuration the app author supplied, on every render of every component. It belongs at `createTamagui` time, once. Textbook §6.11. |
| `elevationAndroid` string compare per prop on web | `helpers/propMapper.ts:85-88` | the guard is `if (!(TAMAGUI_TARGET === 'native' && isAndroid))`, which folds to `true` on web, leaving an unconditional per-prop compare for an Android-only prop. The code comment says *"this shouldnt be necessary and handled in the outer loop"*. |
| `appendFlatClause` **reconstructs a clause string** so the wrapped component can re-parse it | `helpers/propMapper.ts:30-53`, used from `getSplitStyles.tsx:1085` | it builds `` `${prev} ${conditionSource}:${value}` `` for the HOC path. That is serialize-then-reparse across the HOC boundary, and string reconstruction on the render path, which §6.4 bans. An HOC should hand the inner component structured clauses, not a re-serialized string. |
| font-family pre-read confirmed | `helpers/propMapper.ts:337-348` | reads `variantValue.fontFamily \|\| variantValue[conf.inverseShorthands.fontFamily]` **before** `resolveTokensAndVariants` traverses the same object, so a `fontFamily` getter on a variant result fires twice. This is the read §6.10 defers to output completion. |

### The public export surface is why "internal only" is hard here

**READ** `code/core/web/src/index.ts`. It re-exports about 40 modules with
`export *`, including `./helpers/getSplitStyles`, `./helpers/propMapper`,
`./helpers/normalizeStyle`, and `export type * from './types'` (268 exported
types and interfaces in that one file).

Two consequences the plan should carry:

- **`propMapper` is in the barrel but has zero importers.** **RAN**, the only
  references anywhere are `getSplitStyles.tsx` (internal) and a test reaching it
  by relative path. It is reachable through `@tamagui/web`, not load-bearing, so
  §6.1's "may keep a compatibility export" is a hedge rather than a requirement.
  Unexport it and delete it.
- **`export *` is why knip reports everything as used**, which is the mechanism
  behind the gate gap below.

**RAN**, counting consumers outside `code/core` across `code/ui`,
`code/tamagui.dev`, `code/kitchen-sink`, `code/starters`, and `code/compiler`:

| export | consumers outside core |
| --- | ---: |
| `createStyledHOC` | 68 |
| `_withStableStyle` | 8 |
| `createChangeEventDetails` | 7 |
| `_withNativeStyle` | 3 |
| `themeable`, `formatDiagnostic` | 2 |
| `fixStyles`, `getExpandedShorthand`, `mergeSlotStyleProps`, `usePortalThemeState`, `getDefaultProps` | 1 |
| **`getShorthandValue`, `proxyThemesToParents`, `transformsToString`, `getVariantExtras`** | **0** |

Zero consumers downstream does not prove no external user depends on them. But it
does mean the export is speculative surface, and that suggests a cheap,
high-value major-version move the plan does not currently name:

**Unexport before you delete.** Shrinking `index.ts` removes no behavior, shrinks
the public type surface, lets knip and tree-shaking actually work, and converts
every future deletion in those modules from a public break into an internal one.
It is the lowest-risk breaking change available and it should happen early, not
at the end.

### Theme system: one thing to protect, one lever

**READ**, `helpers/variables.ts` is 855 lines and has exactly two importers:
`theme-update.ts` (a re-export) and `views/ThemeUpdate.tsx`.

**Correction to an earlier draft.** It claimed `ThemeUpdate` is "not exported
from any root index." That was wrong: it checked `@tamagui/web` and
`@tamagui/core` and never checked the package users actually import.
`code/ui/tamagui/src/index.ts:149` exports `ThemeUpdate` from `tamagui`. The
public API is already root-exported. `@tamagui/core/theme-update` is internal
plumbing that `code/ui/tamagui/src/theme-update.ts` uses to wrap the
implementation with typed theme keys, plus the compiler and vite plugin.

The earlier draft also proposed pinning `variables` out of the root graph on the
strength of a Metro measurement. **Withdrawn.** Per the size rule in §4, Metro
bytes are not a target. That pin had no other justification.

The lever, not a cleanup: `hooks/useThemeState.ts` calls
`useContext(ThemeStateContext)` at `:120` for every component, plus `useRef`,
`useReducer`, and `useEffect`. The file is already carefully tuned (its comments
explain deliberately avoiding `useSyncExternalStore` for Hermes reasons), so this
is not naive code to clean up. It is exactly the §8 target: split "obtain the
theme resource" from "run theme lifecycle machinery" so a component with no
theme prop, no theme modifier, and no token values never subscribes.

### Corrections to the scan reports

Verify before acting on those files. Six claims did not survive checking.

From the round-3 scans (`scan3-platform-gating.md`, `scan3-rn-shapes.md`,
`scan3-native-fallthrough.md`):

- **"React Native throws `Invalid prop display of value grid supplied to style,
  expected one of [none, flex]`" is stale by several majors.** RN 0.86 has no
  `StyleSheetValidation` and no such string anywhere in `Libraries/`. I grepped
  both, zero hits. RN has no JS-side style validation left at all. What actually
  happens to `display: 'grid'` on native is a **runtime probe**, not something to
  assert; and given `YGDisplayGrid` exists (§9.1) the answer may be "it works".
  Nothing in the plan should depend on native rejecting it.
- **`styleCompat` already defaults to `'web'`.** **READ** `config.ts:83`:
  `?? ... || 'web'`. CSS flex semantics are today's default, so migrating flex is
  not a breaking change. What remains is deleting the `legacy` and `react-native`
  modes from `expandFlex` (`expandStyle.ts:32-68`), a §6.11 simplification on the
  web hot path, not a migration.
- **`lineHeight={1.5}` → `1.5px` is real but is a rule, not a bug.** **READ**
  `normalizeValueWithProperty.ts:44-45`; `lineHeight` is absent from
  `stylePropsUnitless`. But `:46-48` passes strings through untouched, so
  `lineHeight="1.5"` already yields CSS's unitless multiplier. The rule is "a
  number means px, a string passes through", it is consistent, and it matches RN's
  point semantics. Document it; do not change it. (One real finding nearby: that
  same unitless-vs-px decision is written a second time at
  `internal-runtime.ts:67`.)

From the earlier rounds:

- **`useMedia` is overstated.** `indexMediaListener` early-outs at
  `hooks/useMedia.tsx:265` (`if (cur !== undefined && sameMediaKeys(cur, keys))
  return`). The real per-commit cost is a `Map` get, a small set comparison, and
  the two closures React allocates each render because the effect has no
  dependency array. Real, but far smaller than "re-indexes every commit" implies.
- **"Six zero-consumer files" is five.** `getShorthandValue.ts` is barrel-exported
  from `index.ts`, so removing it is a public break.
- **"Direct mutation of shared exported `defaultComponentStateMounted`" is
  wrong.** At `useComponentState.ts:287` it is the *source* of `Object.assign`,
  not the target. There is a real smell nearby, though: `state` is
  `useState`'s own object when `forceStyle` is unset (`:267`), and `:287-289`
  mutates it in place before calling `setState`.

### Leads worth chasing, not yet verified

- Triplicate unitless-property tables (`helpers/validStyleProps.ts:134`,
  `style-grammar/unitlessNumbers.ts`, `web/helpers/variableValue.ts:4`), which
  risk runtime and compiler unit desync.
- Token category lists drifting across five files, where adding `space` to the
  canonical table reportedly deletes 60+ hand-listed lines.
- Two divergent native transform string parsers
  (`helpers/parseNativeTransform.native.ts` and
  `style-grammar/transformFamily.ts:301`). This is adjacent to §6.8; check
  whether the one accumulator subsumes both.
- `extractPseudoState.ts` extracts three states while the engine's state mask
  covers eight. Likely subsumed by §6.5.

### The `bun run check` gate has a gap

`bun run check` runs knip and **passed** while five files in `code/core/web/src`
have zero references anywhere in the repo. Whatever the cause, the gate the plan
leans on is not catching unreferenced files in core. Worth fixing the knip config
before trusting it as a completion check.

## 15. Open questions

1. **Escalation path.** When a gate fails, who decides whether the target or the
   design changes? This stalled the campaign twice.
2. **SSR and hydration class-name stability** across the rebuild. Needs one line
   in the matrix and someone to own it.
3. **`usePresence` bundling.** Reading presence unconditionally pulls
   `@tamagui/use-presence` into every app. Confirm it is small and shares one
   context symbol across packages, or that a stub tree-shakes.
4. **Compiled CSS mode's dynamic-value policy.** With hashing and insertion gone,
   confirm that unproven values route inline.
5. **Structured RN style leaves** (`shadowOffset` and friends). Keep for RN
   parity, or drop as part of web alignment? Not an engine decision.
6. **How much the tailwind frontend should claim.** Passthrough is the safety net,
   but it costs the component its atomic CSS (§9.1). Every property the frontend
   learns to claim is a de-optimization removed, so "claim everything the type
   surface declares" is the obvious target. Confirm nothing depends on a class
   staying raw.
7. **`untilMeasured`, `hitSlop`, `onLayout`, and the gesture responder props.**
   Round 3 lists these as RN-shaped, and each has a CSS or DOM answer
   (`@container`, `ResizeObserver`, pointer events). But they are component
   behavior, not the style engine, and removing them is a much larger break than
   anything in §9.1. Out of scope here; someone should own them separately.
