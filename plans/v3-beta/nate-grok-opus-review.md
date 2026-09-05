# Combined review: `v3-web-style-engine-one-pass.md`

Date: 2026-08-27

Merges Nate's notes, the Grok review
([`grok-feedback.md`](./grok-feedback.md)), and the Opus pass
([`opus-feedback.md`](./opus-feedback.md)) into one document. Everything below
was checked against the source on `v3-beta` or against a checked-in receipt.
Claim labels follow the agent contract.

---

## Headline: consolidation pays, but the last campaign's ledger hid it

The prior campaign's summary line says the parser cluster ended at 4,707 against
a 4,706 baseline and CORE at 39,976 against 39,938, "net zero at this
precision." Read as written, that reads like proof consolidation does not pay.
It is not. **READ**, the per-checkpoint receipts in
[`v3-handoff-log.md:5155-5930`](../v3-handoff-log.md):

| checkpoint | what it did | CORE | cluster |
| --- | --- | ---: | ---: |
| III-a | scanner signature, module-scope handlers, per-scan visitor objects gone | **-81** | |
| III-b | shared clause identity reducer | +48 | |
| III-c0a/b/c/d | grammar semantic corrections | +7 | +6 |
| III-c1 | runtime normalization | | +55 |
| III-c2 | compiled vocabulary and invalidation | **+520** | **+440** |
| III-d | runtime/tooling split, tooling leaves the app graph | **-520** | **-440** |
| IV-b | per-clause refusal, a new feature | **+308** | **+407** |
| IV-a | one clause resolver | **-362** | **-338** |

The three consolidation checkpoints delivered **-963 gzip**. The deliberate
feature and semantics work in the same sequence added about **+883**. The net
zero is those two facing each other, not consolidation failing.

Two things follow, and they matter more than the headline number:

1. **Fusion works, at roughly the rate this plan needs.** IV-a is the closest
   existing analogue to what the new plan proposes: it deleted the heap
   `Condition` record, `getCondition`, the collect-then-emit loop, the canonical
   and kind arrays, the per-clause `Set`, and the precedence bridge, and replaced
   them with one call-stack-only `resolveClauseChain`. That bought -362 on a
   ~4,700-byte cluster, about 7%, from one layer.
2. **The biggest single win was moving code out of the app graph.** III-d,
   splitting `@tamagui/style-grammar` into `/runtime` and `/tooling`, was -520,
   larger than the fusion checkpoint. That lever is still mostly unused.

**And the experiment this plan actually proposes has never run.** Nothing in
that campaign touched `getSplitStyles`/`directStyle` emitter fusion,
`getSubStyle`, `propMapper`'s role in component styling, the four transform
systems, compound matching, the five scan sites, or the three duplicated
discriminators. The campaign consolidated the *clause parser and resolver*
layer, which is a fraction of the surface this plan names.

The audit line in `V3_BETA_MEASUREMENT_STATE.md` ("replacing the rest of
`getSplitStyles` with `directStyle` cannot remove bytes") is **INFERRED from a
source and call-graph audit, not measured**, and it is about the *splitter's
component semantics*: prop forwarding, HOC, `asChild`, `viewProps`, class
assembly, the React insertion effect. That half is genuinely irreducible and
should be excluded from the nucleus. It says nothing about fusing the style
pass.

So the plan's thesis survives, with two conditions the document does not state:

| ledger | mechanism that actually moves it | evidence |
| --- | --- | --- |
| **time** | one scan per string, no sorts, no slices, no `includes`, no Sets | measured, 22,189 -> 7,868 on clause strings already |
| **bytes** | delete a behavior, move it to definition time, move it to the compiler, or put it behind a folded `process.env` constant, plus real pass fusion | measured, -963 across III-a, III-d, IV-a |

- **Do not ship new behavior in the same ledger.** The last campaign's -963 was
  invisible because +883 of deliberate additions rode along. Group/container,
  refusal semantics, and grammar corrections each need their own receipt and
  their own line, never a shared checkpoint with a consolidation win.
- **Build the deletion pool bottom-up anyway.** IV-a's 7% on one layer is a
  useful prior. It says the untouched pool below is worth attacking and it also
  says a 4,700-to-3,000 cut needs deletions, not fusion alone.

---

## What all three reviews agree on, keep verbatim

- Objects stay, as a thin adapter into the same sink. The corpus already says
  they are the cheap path (about 776 ns/prop against about 1,734 ns/prop for
  clause strings), and they are rare (14 object elements against 625
  clause-string ones).
- One character loop per authored string. No `split`, regex, `Object.keys`,
  clause arrays, `Set`, or `sort` on the render path.
- Delete the replaced path in the same commit. No flag, no shadow engine.
- Freeze the ruler before any engine edit, keep V2 as a same-run control.
- Group is not a query container. `getSplitStyles.tsx:756-771` still writes
  `container-name` / `container-type` for `group`.
- `usePresence` always called, effect always runs, register only after the
  completed frame says so.
- `TAMAGUI_DID_OUTPUT_CSS` and strict mode cannot be used to hide a fat
  processor.

---

## The deletion pool

This is the part the plan is missing. It is not a merge list, it is a list of
things that stop existing. Numbers are unmeasured until checkpoint 0 fills them
in; the point is that the pool is enumerable and each row is independently
landable.

### 1. Five scanners over the same strings

**READ**, five live `scanFlatValue` call sites with five separate handlers.
Phase III-a already made every handler a module-scope constant, so these are not
per-scan allocations. The cost is that the same authored string is walked
several times:

| # | site | handler | when |
| --- | --- | --- | --- |
| 1 | `style-grammar/clauseIdentity.ts:194` | `clauseIdentityScanner` | definition time |
| 2 | `hooks/useComponentState.ts:121` | `lifecycleHandler` | prepass, every render |
| 3 | `helpers/getSplitStyles.tsx:166` | `compoundScanHandler` | per compound key, every render |
| 4 | `helpers/propMapper.ts:215` | `propMapperHandler` | per variant clause prop |
| 5 | `helpers/directStyle.ts:2029` | `directStyleHandler` | the real emission scan |

A single `bg="hover:blue"` on a component with compounds is scanned by 2, 3
(once per compound key), and 5, and then `resolveClauseChain` re-walks the
modifier prefix a fourth time. `useComponentState.ts:104-114` also hand-rolls a
*sixth* character loop over conditional-object keys with a
`chain.slice(start, index)` allocation per segment.

The plan says "each string receives one forward character loop" and never
enumerates the six that exist. **That enumeration is the deletion budget.** Four
handlers and four call sites is a real, bounded, measurable pool, and it is the
largest single time win available.

Scanner 2 is the easiest kill: the whole prepass exists to compute one boolean
("does this component need lifecycle/presence"), and the plan already says the
main pass should record that flag.

### 2. Three copies of the conditional-object discriminator

Same rule ("has `default`, else first key resolves as a chain"), three
implementations:

- `directStyle.ts:2084` `isConditionalStyleObject`
- `getSplitStyles.tsx:176-182`, inline inside `matcherChains`
- `getSplitStyles.tsx:199` `isConditionalObjectValue`

The plan's entire "Objects are a 250-byte input adapter" section describes
`directStyle.ts:2084-2093` plus `:2243-2261`, which is **already exactly the
proposed design**, down to the discriminator rule and the `typeof value ===
'string' ? scan : for-in` shape. The section is a rename request. The real work
is deleting copies two and three.

### 3. Four transform systems

**Correction to the earlier Opus pass:** I said `normalizeStyle` had no
transform merging. I checked the wrong file. `helpers/normalizeStyle.ts` has
none; there is a *second, private* `normalizeStyle` at
`getSplitStyles.tsx:1823` that does. The plan was right and I was wrong. Two
different functions with the same name in the same package is itself worth
fixing.

| # | site | shape |
| --- | --- | --- |
| 1 | `directStyle.ts:1584-1601` | `flatLegacyTransforms`, `Object.keys().sort().map()`, re-emits the whole `transform` property on every part |
| 2 | `getSplitStyles.tsx:1529` | `mergeFlatTransforms`, fixed head then `keys.sort(sortString)` |
| 3 | `getSplitStyles.tsx:1804` | `mergeTransform`, push/unshift into an array |
| 4 | `getSplitStyles.tsx:1718-1752` | `getSubStyle`'s four-deep nested conflict merge |

System 1 is quadratic. Three transform props do three full `Object.keys` +
`sort` + `map` passes and three complete re-emissions of `transform`. This is
the clearest single time win in the campaign and the plan under-sells it as
"replace these current systems."

**System 1 and system 2 produce different orders.** System 1 sorts every
authored key alphabetically (`rotate, scale, x, y`). System 2 uses a fixed head
(`x, y, rotate, scale`) then alphabetical. Transform composition is not
commutative, so web-class output and native/inline output already render
differently for the same input. "Fixed canonical order" picks one and changes
the other. That is a visible breaking change and needs Nate's call plus a
rendered pin, not a snapshot.

### 4. `getSubStyle` is a v2 leftover

Nate is right, and the code confirms it. **READ**: `pressStyle`, `hoverStyle`,
and `pseudoDescriptors` appear **zero** times in `getSplitStyles.tsx`. V3 fully
removed the nested pseudo-object path. `getSubStyle` survives for exactly one
case: `accept: 'style' | 'textStyle'` sub-styles, reached only at
`getSplitStyles.tsx:701-711` (Button's `textProps` and friends).

For that one narrow case it still carries:

- `Object.create(parentProps, Object.getOwnPropertyDescriptors(styleIn))` at
  `:1681`, which allocates one descriptor object per key of `styleIn` on every
  call, every render;
- a full `propMapper` call per key at `:1693`, the mapper the plan says
  component styling must stop importing;
- transform systems 3 and 4, including a four-level nested loop at `:1724-1737`
  whose inner `for..in` breaks after the first key, so it silently assumes
  single-key transform objects;
- `fixStyles(styleOut)` legacy normalization;
- a `styleOriginalValues` WeakMap lookup.

Grok is right that the plan barely names it. Stronger version: **`getSubStyle`
must route through the same sink in the same checkpoint that deletes the
`propMapper` import, or the old engine is not deleted.** It is also a good
candidate to delete outright by making `accept` sub-styles ordinary prefixed
contributions.

### 5. `propMapper` as a component-styling entry point

Three contribution entry points exist today: `contributeStyleValue`,
`contributeVariantClauseValue`, and `contributeFrontendProgram`
(`frontendProgram.ts:42`). The frontend-program channel is the Tailwind
package's route in, minted through a module-private `WeakSet`
(`frontendProgram.ts:22-39`). It is a legitimate need and an extra channel the
plan never names. One sink means one entry, with the frontend handing over a
parsed program at the same position rather than through a separate predicate on
every prop.

### 6. Transition keys, hardcoded three times

**READ**, the same five keys spelled out by hand in three places:

- `getSplitStyles.tsx:441-445`, inside `isValidStyleKey`, as a five-way `||`
- `getSplitStyles.tsx:688-698`, the native skip
- `directStyle.ts:1567`, a `transition` / `transitionProperty` special case

And `code/core/helpers/src/validStyleProps.ts` contains **no transition keys at
all**, while already exporting `webOnlyStylePropsView` and
`webOnlyStylePropsText`. Nate's instinct is exactly right: the pattern already
exists. One table entry replaces three hand lists, `isValidStyleKey` collapses
to `key in validStyles || (accept && key in accept)`, and the native skip
becomes a lookup. Small, safe, and it removes the class of bug where the three
lists drift.

### 7. Token provenance

**READ** `helpers/styleProvenance.ts`. Correctly gated:
`shouldTrackStyleTokenProvenance = NODE_ENV === 'development' &&
TAMAGUI_ENABLE_STYLE_TOKEN_PROVENANCE === '1'` (`getSplitStyles.tsx:82-84`), so
it folds to `false` and DCEs in production. It costs no production bytes on the
web arm.

What it does cost: a module that cannot tree-shake because
`getSplitStyles.tsx:72` re-exports it, a field on `GetStyleState`, three inline
hot-path branches, and source complexity in the file the plan wants to make
readable.

**Its only consumer in the entire repo is its own test**
(`core-test/getSplitStyles.tokenProvenance.native.test.tsx`). No LSP, no
devtools package, no site code reads `getStyleTokenProvenance`. Answering Nate's
question directly: it is a devtools side channel that records which token
produced each winning style value, and nothing currently reads it.

Recommendation: delete it, or move it behind the internal-runtime entry with its
test. If a devtools consumer is planned, say which one and when, because a
public API with no consumer is the thing that survives three campaigns.

### 8. `overriddenContextProps` has three writers, and one of them is dead on web

**READ**, three separate mechanisms write `overriddenContextProps`:

1. **`createComponent.tsx:413-420`.** `mergeComponentProps` returns `overrides`:
   context keys the caller passed as props. Re-provided to children at
   `:2085-2096`. This is `createStyledContext` working as documented. Keep.
2. **`directStyle.ts:1111-1116`, the `contextOnly` path.** Reached from
   `getSplitStyles.tsx:1081` and `:1115`, both passing `!isHostStyleKey`. When a
   key is a styled-context prop but not a host style key, the engine resolves
   its clause, writes the winner to context, and emits no style. So
   `size="$5 sm:$3"` propagates correctly. Live, deliberate, well-scoped.
3. **`getSplitStyles.tsx:1579-1601`, inside `mergeStyle`.** Sniffs **every
   winning style write** and asks whether the key is also a context key. This is
   the one that serves #3670, where `color` is both a host style key and a
   context key and is set by a `pressStyle` branch inside a variant, so
   mechanism 1 never sees it.

Mechanism 3 is the problem, and the reason is sharper than "it is slow."

**READ `directStyle.ts:1127-1141`:** on web with `flatShouldDoClasses`, the
normal web path, every `emitProperty` routes into `directAtomic` and **returns
before `merge` is ever called**. `mergeStyle` is that `merge` callback.
Mechanism 3 therefore **cannot fire on the web class path at all**, not for
conditionals and not even for base styles. It only runs on native, and on web
when classes are disabled (inline mode, animated components, `noClass`).

Meanwhile every platform pays for it on every winning style write:

- four `staticConfig` re-derivations (`contextConfig`, `contextProps`,
  `inheritedContextPropKeys`, `contextPropKeys`), all constant per `styled()`
  definition;
- `contextPropKeys?.includes(key)`, a linear array scan;
- `contextConfig?.propKeys?.includes(key)`, a second linear array scan.

A component with 8 context keys and 15 winning style keys pays up to 240 string
comparisons per render, on web, to compute something that path can never use.

The issues it serves are real and closed: **#3670** is
`styled(Button, { variants: { variant: { primary: { pressStyle: { textProps: {
color } } } } } })` where the pressed color never reaches the child Text.
**#3676** is "Context values not accessible in children styles."

Three options, increasing boldness:

- **(a) Free, zero behavior change.** One `Set` of context keys per
  `staticConfig` computed at `styled()` time (there is already a
  `WeakMap<StaticConfig>` precedent at `getSplitStyles.tsx:249`), and skip the
  block entirely when `flatShouldDoClasses` is true, since it provably cannot
  fire there. Removes the tax from the whole web class path. **Land this
  regardless of the other decision.**
- **(b) Narrow.** Fold mechanism 3 into mechanism 2's `contextOnly` channel so
  one writer handles context propagation instead of a post-hoc sniff.
- **(c) Declare the limitation.** A style that sets a context key does not
  propagate to children; only props and context-only programs do. Deletes
  mechanism 3, `originalContextPropValues` (`propMapper.ts:446`), the
  `styleState` field, and the per-write check. Reopens #3670 for the
  `pressStyle: { textProps: {...} }` shape, on native only.

(c) is defensible as a product rule precisely because the current behavior is
already platform-inconsistent: the same code works on native and silently does
nothing on the web class path. That is Nate's call, not the plan author's.

### 9. `compoundScanHandler` and the loops inside it

Nate asked how many loops are hidden here. Counting one compound variant key at
`getSplitStyles.tsx:220-240`:

```
for key in compoundVariant                             1
  matcherChains(expected, props[key])
    scanFlatValue over the whole prop string           2   (+ source.slice per segment)
      compoundMatcherMatchesPayload -> expected.some   3
  for a of chains                                      4
    for b of keyChains                                 5
      joinChains(a, b):
        a.split(':')                                   6   (+ array alloc)
        b.split(':')                                   7   (+ array alloc)
          segments.includes(segment)                   8
        segments.join(':')                                 (+ string alloc)
      next.includes(joined)                            9
```

Nine levels, four allocations per `(a, b)` pair, times every compound variant on
the component, on every render, whether or not it matches. The `FlatFrame`
benchmark scenario has twelve compound variants.

`joinChains` at `:210-218` uses `split` / `includes` / `join` on the render path,
which the plan's own rules ban. `compoundScanHandler` slices per segment and per
chain.

The fix is the one the plan already describes for compounds (compiled metadata
outside render, numeric scratch with a watermark), but the plan does not say
that compound *matching* is where the loops are. It should, because this is
probably the single biggest allocation source on styled components with
compounds.

---

## Design corrections

### Fixed numeric slots were already withdrawn twice

`v3-engine-consolidation.md` revision 3 is explicit: no fixed condition slots. A
conditional variant `sm:$v` can return `{ color: 'hover:red' }`, so an inner
clause is live in the same pass as the outer one. Condition state travels as
call-stack locals; across a user-code boundary only source offsets survive and
the condition is re-derived after the return.

The new plan puts the slots back (line 215) and mentions re-derivation only in
passing. Pick one and write it down:

- call-stack locals plus offset re-derivation at user-code boundaries, already
  designed and pinned, or
- a watermarked numeric stack with a measured size budget, which is the arena
  that 1a paid +279 CORE for and was then reverted.

"Fixed slots" is not an available runtime shape.

### Open-ended names do not fit a closed ID table

`hover`, `sm`, `dark`, and `web` can be compiled to numeric IDs.
`group-hover/card` and `@sm/layout` cannot: user group and container names are
unbounded, and `addTheme` makes theme names unbounded after definition time.

A process-lifetime intern leaks. A per-pass intern allocates. Span comparison
against the source, which revision 3 already specified for the rare
parameterized forms, allocates nothing. Write that. "Collision-free numeric IDs"
as stated will grow a `Map` or go stale.

Related: the stale-vocabulary problem the plan re-litigates is already solved.
`resolveClauseChain` opens with `getConfigRevisionState(state.conf)`
(`directStyle.ts:406`).

### Three-source traversal versus `extras.props` is a declined design

Walking defaults, context, and caller props directly while keeping
`extras.props` a full record and banning `Proxy` is 1b.
[`v3-functional-variant-props-contract.md`](../v3-functional-variant-props-contract.md)
priced it and declined it: `mergeComponentProps` still has to build `nextProps`
for variants, compounds, state, and forwarded view props, so a second
representation is a new allocation and a public break. The handoff log records
the same conclusion, plus "a previously omitted fourth source overlays media and
pseudo values onto `styleState.props`."

Keep `mergeComponentProps`. The one traversal that matters is each *value*
reaching the sink once, not each *source* being walked once.

### `process.env` constants from day one, not checkpoint 7

`getSplitStyles.tsx` is always imported by `View`. Strict compiled mode and
`TAMAGUI_DID_OUTPUT_CSS` only drop code that is behind a folded constant. If
atomic hashing and insertion are written as ordinary code in checkpoint 2 and
"specialized" in checkpoint 7, the emitter gets rewritten twice.

Constraint on the first engine checkpoint: CSS rule generation, hashing, and
insertion live behind `process.env.TAMAGUI_DID_OUTPUT_CSS`; native-only lowering
lives behind `process.env.TAMAGUI_TARGET === 'native'`. The guards already exist
in `insertStyleRule.tsx`, `createDesignSystem.ts`, `getThemeCSSRules.ts`,
`registerCSSVariable.ts`, `insertFont.ts`, and `createTamagui.ts`. Extend the
pattern, do not defer it.

This also resolves the plan's internal contradiction between checkpoint 6
(fuse everything into one file) and checkpoint 7 (split at module boundaries so
web bundlers can drop native code). You cannot do both. Constant folding is the
mechanism that already works: **READ** `V3_BETA_MEASUREMENT_STATE.md`, "Rolldown
folds `isWeb` through `directStyle`."

### Unstated behavior decision in compiled-CSS mode

The plan says hashing and insertion must disappear under
`TAMAGUI_DID_OUTPUT_CSS`, and that mode 2 "keeps dynamic Tamagui behavior." A
runtime-computed `width={n}` needs either an inline style or a hashed atomic
class plus an inserted rule. If hashing and insertion are gone, mode 2 must route
every unproven value inline. State that.

### `parseValue` should not be in the runtime graph

Tooling keeps its parser. Proving `parseValue` is absent from the `View` chunk is
a real, checkable size win. Unifying the runtime scanner with the tooling parser
is how diagnostics ship into the app, which is what the last parser unification
paid for.

---

## Gates, rewritten

### Split the byte number

There is no single "nucleus." Grok's split is correct and the arithmetic
supports it:

- **clause machine** (scan, classify, resolve, condition identity, object
  adapter): a hard cap. The measured parser cluster is 4,706 gzip today for a
  *smaller* union than the plan's nucleus. Collapsing four of the five scanners
  and two of the three discriminators is the only credible route under it. 3,000
  is plausible here **only** if the property emitters are excluded.
- **property emitters** (tokens, border, shadow, transition, safe area,
  transform, atomic identity, rule text): reported every checkpoint, must not
  grow, never counted inside the clause-machine cap.

**"Excluded" here is a measurement bucket, not a feature cut.** Both buckets
ship in full. Splitting them only changes which declarations sum into which
union number. Nothing about this removes shadows, transitions, transforms, or
any animation driver. The animation drivers are outside both buckets in any
case: `animations-motion` and `animations-css` are separate packages, and
`V3_BETA_MEASUREMENT_STATE.md` records that neither appears in any retained
bench arm.

The reason to split is that 3,000 only carries information for the clause
machine. Put the emitters in the same union and the target is unreachable by
arithmetic before a line is written, which is how the last campaign's forecasts
failed at the end instead of at the start.

Checkpoint 0 lists the declarations in each bucket, measures the current union
for both with `attribute-bundle-gzip.ts --parser-cluster`, and sets the numbers
from that pool. **A target with no measured pool behind it fails at the last
checkpoint with no information**, which is exactly what happened last campaign.

### `View` 25k / 20k is the wrong stop for the engine

Current `View` is 34k gzip with React external. That graph contains theme,
media, insert, config, presence, and layout. Checkpoints 2 through 6 do not
remove those. Using 25k as an engine stop fails for reasons this campaign does
not own, which is the same error as using CORE 30k as a parser-cluster stop.

Report `View`. Put 25k and 20k on the later theme and provider work.

### The 5x is the wrong shape

Conditional strings are 9,566 ns. Plain is 2,127 ns. 5x lands at 1,914 ns, which
is **faster than plain props** while still parsing modifiers and emitting extra
clauses. The last retained optimization bought a causal 17% on that scenario.

Two changes:

1. **Gate on frames, not on a ratio.** Checkpoint 0 runs `profile-hotpath.ts`
   on the clause-string scenario and names the frames that must disappear:
   `Condition` objects, per-contribution `Set`s, `sort`, `source.slice` per
   modifier, wrapper arrays, string-key identity, the `joinChains` split/join,
   the `Object.getOwnPropertyDescriptors` in `getSubStyle`. If those frames are
   gone and the number is 3x, that is success. If the number is 5x and the frames
   are still there, the machine moved and the measurement is invalid.
2. **Decompose the fixed per-call overhead.** Add 0-prop and 1-prop scenarios and
   solve for `F`. If `F` is around 1,500 ns, a 5.46-prop scenario at 1,914 ns
   requires the clause work itself to get roughly 19x faster and the target is
   arithmetically dead. One hour of work that validates or kills the headline
   gate before any code changes.

Also: every timing gate must be a **same-run paired control**, old and new in one
session on one machine. `GET_SPLIT_STYLES_BENCHMARK.md` already warns
"host-wide timing changed substantially between the two runs, so the raw change
does not isolate the code change." Gating against a frozen number in a markdown
file is that exact failure.

### Provenance for the baseline table

`34,004`, `35,650`, `6,085`, `4,525`, `12,742`, `21,639`, `848`, `1,735` appear
nowhere else in the repo, and there is no StyleX fixture in `code/comparisons` at
all. The plan demands full receipt metadata from every future measurement and
opens with eight numbers that have none, taken on a ruler it says still has to be
built. Attach the command and commit, or move the table after checkpoint 0.

### Two stop conditions contradict shipped code

- "Do not respond with a ... cache" would forbid the retained atomic identity
  cache (measured 29.7% allocation reduction, has negative controls) and
  `styledDefaultsCache` (`getSplitStyles.tsx:249`). Narrow it to "no fallback or
  dual-path cache."
- "The style-union gzip does not decrease at checkpoints 2, 3, or 6" halts the
  campaign at its first engine commit, because checkpoint 2's object adapter is
  already implemented.

---

## Sequence, rewritten

The nine-checkpoint shape is most of the cost and it back-loads every cheap win.

**0. Ruler, pool, and two experiments. No engine code.**
Add a `web-one-pass-*` checkpoint chain to the existing
`parser-cluster-manifest.json` (78 selectors, 10 checkpoints, `movedTo` already
defeats hiding bytes by relocation). Split the manifest into clause-machine and
property-emitter buckets and measure both unions. Build the deletion pool table
with real marginals. Run the frame profile and the fixed-overhead decomposition.
Re-derive the baseline table with provenance.

**1. Group and container split.**
Independent, lands immediately. Add the migration piece the plan omits:
`group="card"` currently emits `container-name: card`, so `@sm/card:` resolves
against a group today. Removing the coupling breaks that. Needs a diagnostic or
codemod and a release note.

**2. Cheap independent wins, one commit each, no fusion.**
Every row here is small, separately bisectable, and delivers most of the
measurable time win before any risky restructuring:

- transform system 1's quadratic re-emit;
- `useComponentState`'s prepass scanner and its hand-rolled character loop;
- context-key `Set` per `staticConfig`, deleting two linear scans per style
  write;
- transition keys into `webOnlyStyleProps`, deleting three hand lists;
- the duplicated shadow/legacy-transform refusal block;
- the double `resolveClauseChain` on a conditional object's first key
  (`directStyle.ts:2090` then `:2177`);
- `joinChains` without `split`/`join`;
- token provenance, pending Nate's call.

**3. One scanner, one sink.**
Collapse scanners 2, 3, 4 into 5. Delete discriminator copies 2 and 3. Route
`getSubStyle` and the frontend program through the same entry. Delete the
`propMapper` import from component styling. This is the checkpoint the
clause-machine byte gate is judged on. `process.env` guards go in here, not in
checkpoint 7.

**4. Variants, compounds, transforms, output completion.**
Compiled metadata outside render, numeric scratch with a watermark, one transform
accumulator, one output slot per property/condition pair.

**5. Lifecycle and seam deletion.**

Old checkpoint 7 becomes a regression pin plus one small move: **READ**, the
compiled arm already tree-shakes the entire emitter, with `getSplitStyles`,
`createComponent`, and `propMapper` absent and `directStyle` down to **50
marginal gzip for `platformMatches` only**. That work is done; it needs a pin so
it stays done.

Old checkpoint 8 is a separate campaign. It is theme and provider work, it does
not share a failure mode with the style engine, and bundling it here lets a
provider win hide an engine miss, which the plan itself warns against on line 42.

---

## Missing from every version of this plan

- **Compiler and runtime lockstep.** Any change to atomic class identity,
  transform order, or clause precedence must change identically in the compiler
  or mixed compiled/runtime apps get hydration mismatches and a wrong cascade.
  `parserAgreement.web.test.tsx` and `code/comparisons/conformance` should be
  named as required at every emission-changing checkpoint, not only at
  checkpoint 1.
- **What happens when a gate fails.** Every gate says "stop." Say who decides
  and whether the answer is to change the target or the design. The prior review
  had to escalate this twice and the campaign stalled both times.
- **Native risk.** This is titled a web plan and the engine is shared.
  `getSplitStyles.native.test.tsx` and the ios/tvos/androidtv variants should be
  named per checkpoint.
- **SSR and hydration class-name stability.** One line, but it is the failure
  that ships silently.

---

## Decisions that are Nate's, not the plan author's

1. **Transform order.** Web-class and native/inline currently disagree. Picking
   one canonical order changes rendering on the other. Which one wins?
2. **`group` losing its container.** Breaks `@sm/name:` clauses that target a
   group today. Codemod, diagnostic, or accept the break?
3. **Context propagation from winning style writes** (#3670, #3676). Option (a)
   is free and should land either way. The real question is (c): declare that a
   style setting a context key does not propagate to children. The current
   behavior already only works on native and inline, so this makes the rule
   match what ships.
4. **Token provenance.** Delete, or name the devtools consumer that is coming?
5. **The clause-machine number.** 3,000 is reachable only if property emitters
   are excluded and four of five scanners die. Confirm that split before
   checkpoint 0 sets it.

---

## Corrections to the earlier Opus pass

- **"This experiment already ran and returned zero" was wrong.** The prior
  campaign consolidated the clause parser and resolver layer, not the
  emitter/splitter. Its three consolidation checkpoints delivered -963 gzip;
  deliberate feature and semantics work in the same sequence added about +883.
  The net-zero summary line is those two facing each other. See the headline
  table.
- The `V3_BETA_MEASUREMENT_STATE.md` "cannot remove bytes" line is **INFERRED
  from a source and call-graph audit, not measured**, and it scopes to the
  splitter's component semantics only.
- I said `normalizeStyle` had no transform merging. Wrong file. The private
  `normalizeStyle` at `getSplitStyles.tsx:1823` does merge transforms. The plan
  was right; there are four transform systems, not two.
- I said the object adapter's 250-byte gate was "probably already green." It is
  green for the *sink* design, but two duplicate discriminators still exist
  elsewhere, so the gate is measuring the wrong thing rather than being already
  passed.
- Phase III-a already made every scan handler a module-scope constant, so
  "five visitor objects allocated per scan" was wrong. The five separate
  **scans** stand; the allocation claim does not.
- `contextOnly` is not dead code. `getSplitStyles.tsx:1081` and `:1115` pass
  `!isHostStyleKey`, which makes it the live channel for context-only
  conditional programs.
