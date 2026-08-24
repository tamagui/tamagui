# V3 engine consolidation: one parser, one emit pipeline

Status: campaign closed at Phase IV-a on 2026-08-23 by owner decision. Phases
IV-c through VII are canceled and are not authorized implementation work. The
earlier proposal remains below as historical design context until its stale
sections are curated. The assigned Codex max critique is in
`plans/v3-engine-consolidation-review.md`, and p28302 performed the final-pass
audit. Author: Fable session p28910, 2026-08-22.

## Campaign close at Phase IV-a

The exact headline is **parser cluster 4,707 versus the 4,706 baseline, and
CORE 39,976 versus the 39,938 baseline. Six consolidation checkpoints were
net zero on both size ledgers at this precision.** The campaign delivered
correctness and reusable measurement infrastructure, but it did not deliver a
bundle reduction.

### What shipped and is worth keeping

- Per-clause refusal now discards a malformed clause while retaining valid
  base and sibling clauses in style, variant, lifecycle, and tooling paths.
- The `group-` prefix is reserved for group syntax. Configured media, theme,
  custom platform, and container-size names can no longer change the meaning
  of the same authored group clause between compiler and runtime.
- One compiled modifier vocabulary is published per config revision. The same
  revision now invalidates the five `<ThemeUpdate>` WeakMap groups that could
  never invalidate while keyed by the stable `conf.themes` object: theme-key
  unions, scheme-stripped theme buckets, modifier views, parsed inline values,
  and flat layers. Merged-theme results and their idempotency marker use the
  same generation.
- Assembled review caught and fixed two shipping defects with red runtime
  controls. On iOS, `enter:red` could infer `red` as a theme and emit a dynamic
  theme object. A configured size-query media key shadowed by the reserved
  `hover` state could also make `@hover` execute as a container even though the
  authoritative registry rejected it.
- The dead static-only fallback props `Proxy` and its public field are gone.
  The compiler audit found no producer, and production CORE did not move
  because dead-code elimination had already removed the branch.
- `extras.props` keeps its merged, mutable contract. Narrowing it removed no
  code because `mergeComponentProps` and `getVariantExtras` still remain, and
  it would add a second props representation for context-bearing components.
  Probes found one real inherited-context dependency in `StyledContextTokens`
  and a previously omitted media/pseudo overlay, while the claimed TextArea,
  SizableText, and SurfaceRow breaks were disproved. The full decision and
  probe record is in `plans/v3-functional-variant-props-contract.md`.

### Why 800 was not reachable

Consolidation removes copies of grammar work, but it does not remove the one
scanner and resolver that must survive. The compiler boundary does not change
that result for a realistic app: 346 of the 497 classified kitchen-sink
bailouts are behavior or context component contracts, and any single retained
`createComponent` pulls the scanner graph. Compiler work can remove particular
avoidable retentions, but one inherent retention is enough to keep the grammar.

The two plausible representation changes were also priced and declined. A
packed clause identity was estimated at 150 to 300 corrected-union gzip with
high semantic risk, and a span-only merge sink at 70 to 140. The ranges are
non-additive and neither materially closes the roughly 2,950-byte gap. Reaching
about 800 therefore requires a deliberate grammar or public-contract decision
about what the surviving parser no longer supports. More consolidation or
compiler-retention cleanup does not make that decision.

### Forecasting lesson

The forecast model priced gross declaration deletion and underpriced the
replacement plumbing that remained in the assembled survivor. IV-b was
forecast at +70 to +170 parser-cluster gzip and measured +345. IV-a was
forecast at -500 to -700, with a wider plausible range of -450 to -770, and
measured -338. Both consecutive misses favored the campaign. Future size work
here must price the emitted survivor, including replacement state, diagnostics,
and boundary plumbing, before taking credit for deleted declarations.

### Instruments to preserve

- The CORE union frame is implemented by
  `code/comparisons/attribute-bundle-gzip.ts --core` and behaviorally pinned by
  `code/comparisons/attribute-bundle-gzip.test.ts`. Its frozen v3 and v2 entries
  are `code/comparisons/tamagui-bench/src/size.tsx` and
  `code/comparisons/tamagui-v2-bench/src/size.tsx`.
- The 78-selector parser ruler is
  `code/comparisons/parser-cluster-manifest.json`, executed by
  `code/comparisons/attribute-bundle-gzip.ts --parser-cluster=<checkpoint>` and
  pinned by the same test. Its frozen entry and shared fixture are
  `code/comparisons/tamagui-bench/src/cluster.tsx` and
  `code/comparisons/shared/parserClusterFixture.tsx`.
- The structural CORE ledger and parser-cluster ledger remain below under
  `Structural-debt ledger` and `Parser-cluster debt ledger`. They record the
  fixed IV-a recovery miss without letting unrelated reductions pay it.

Run the instruments from the repository root after a full build, always with
fresh output directories:

```sh
bun run build
(cd code/comparisons/tamagui-bench && npx vite build --mode size --sourcemap --outDir /tmp/v3-consol-N)
(cd code/comparisons/tamagui-v2-bench && npx vite build --mode size --sourcemap --outDir /tmp/v2-consol-N)
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-consol-N --core
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v2-consol-N --core
(cd code/comparisons/tamagui-bench && npx vite build --mode cluster --sourcemap --outDir /tmp/v3-cluster-N)
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-cluster-N --parser-cluster=phase-iv-a
bun test code/comparisons/attribute-bundle-gzip.test.ts
```

### Open and unowned follow-ups

- Decide the `<ThemeUpdate>` versus direct-style collision and unknown-name
  priorities from the evidence in
  `plans/v3-themeupdate-condition-divergence.md`; no implementation is owned.
- Fix the compiler presence checks that retain `asChild={false}`,
  `disableOptimization={false}`, and `themeInverse={false}`, with active-value
  controls preserved; the proposal is in
  `plans/v3-compiler-retention-follow-ups.md` and has no owner.
- Characterize and design partial lowering for opaque dynamic styles that
  currently retain the full Tamagui component; the evidence and constraints
  are in `plans/v3-compiler-retention-follow-ups.md` and the work has no owner.
- Characterize and design narrower native clause retention in place of the
  blanket rule that retains every active flat-clause program; the evidence and
  required controls are in `plans/v3-compiler-retention-follow-ups.md` and the
  work has no owner.
- Resolve the D7 same-chain divergence as standalone correctness work. The
  lifecycle prepass still treats `enter:hver:1` as lifecycle-visible while the
  config-aware main resolver refuses the same chain. Phase VI-b was its former
  owner and is canceled; no replacement owner exists.
- Curate the stale proposal sections below. IV-c through VII, the post-V-e
  gate, final acceptance, stop conditions, and sequencing text still describe
  a campaign that will not run. This documentation cleanup is unowned and must
  not be read as authorization to resume optimization.

Phase I bindings, 2026-08-22: with the owner away, coordinator p28302 bound
the two reversible policy choices so the overnight campaign could proceed.
**CEILING is literal CORE <= 30,000. Checkpoint 1a is reverted.** The owner
may override either choice later; no translation from the old row-sum frame
is claimed.

Parser-cluster measurement binding, 2026-08-23: the cluster subgate uses a
separate frozen fixture that instantiates styled inheritance. It never feeds
CORE or changes the frozen size entry. The first declaration-aware frame grew
from 53 selectors to 68 as III-c and III-d destinations were predeclared. It
measured the exact Phase III-a checkpoint `cd2353824f` at **4,239 gzip** and
Phase III-b at 3,950. Those figures remain recorded as the former 68-selector
frame.

Before IV-b, a mechanical reference-closure audit found seven more retained
parser declarations that frame omitted: the direct string driver, two other
direct resolver callers, both lifecycle prepass declarations, the prepass's
private enter constant, and the platform-name table retained by vocabulary
compilation. The 75-selector omission-closed frame measures the same detached
Phase III-a artifact at **4,706 gzip** and Phase III-b at 4,414, down 292. The
<= 1,000 gate therefore requires at least 3,706 bytes in this frame and the 800
target requires at least 3,906. The rejected five-source control remains 1,710
and the former 68-selector figures remain beside every new figure rather than
being rewritten. Full-source and exact-declaration negative controls both move
the union, and missing, ambiguous, wrong-kind, or privately unclosed
declarations fail.

Before IV-a, the manifest predeclares its replacement resolver and two packed
state tables, bringing the current frame to 78 selectors. All three are absent
through IV-b with enforced destinations, so every historical 78-selector
measurement is numerically identical to the omission-closed 75-selector frame.
IV-a is the first checkpoint where they carry spans.

Implementation bindings after revision 3, 2026-08-23:

- The former five-file parser-cluster ruler was rejected after III-b proved
  that code could move into `clauseIdentity` and out of `valueParser` without
  the union following it. It also omitted the runtime drivers in
  `directStyle` and `propMapper`. The replacement is a closed,
  declaration-aware manifest. Its first 4,239 baseline superseded 1,710. The
  later omission audit expands that same frame to 4,706 without changing the
  fixture, CORE, the <= 1,000 gate, or the 800 target. IV-a's three predeclared
  replacement selectors expand the current frame to 78 without changing any
  earlier union.
- Phase III-c is split into explicit grammar contractions, each with a pin,
  before the compiled vocabulary and invalidation work. Compiler and runtime
  disagree on committed HEAD today, so this is a current v3 correctness bug
  exposed by consolidation, not behavior created by the refactor.
- Phase III-b carries +48 CORE of declared structural drift, from 39,857 to
  39,905 (whole bundle 103,969 to 104,018). III-d owns its recovery. Drift
  stops at +300. The separately accounted III-c2 add-then-delete sequence may
  cross that number because III-d and IV-a were named as recovery owners before
  measurement. Implementation then proved that IV-b's per-clause refusal is a
  semantic prerequisite of the call-stack-only IV-a resolver, so the bound
  recovery sequence is III-d -> IV-b -> IV-a with no unrelated checkpoint in
  between. The sequence is measured at each checkpoint and when it closes.
  Unrelated byte reductions may not pay either ledger.
- The parser-cluster <= 1,000 target remains unchanged but is reported rather
  than stopping at V-e. The corrected 4,239 baseline proves before
  implementation that this consolidation scope cannot reach it, so its miss
  cannot discriminate success from failure. The CORE and runtime/allocation
  conditions remain hard stops. The owner may reinstate the cluster stop.
- IV-a closes the declared add-then-delete sequence as a measured miss. It
  removes 362 CORE and 338 parser-cluster gzip, leaving 113 CORE and 287
  parser-cluster bytes unrecovered at the fixed closing point. The recovery
  owner does not slide to IV-c, and no new over-cap sequence may open while
  this missed recovery is outstanding.

What changed in revision 3:

- The 1a pricing control is now a real one-variable control: the integrated
  tip versus the identical tree with only `878db6d383` reverse-applied
  (**CORE_noarena**), replacing the invalid detached-`2681babe1f` comparison,
  which would have priced all post-`99fba89f0c` v3-beta movement as 1a. The
  gate's "own regression" anchor is CORE_noarena.
- Two per-pass render-path allocations designed into revision 2 are
  withdrawn: the cursor-indexed clause scratch stack (replaced by primitive
  call-stack locals holding numeric offsets across user-code boundaries) and
  the per-pass theme-key set (replaced by recording directly into the
  component's already-stable tracking refs, carried as a frame field).
- Phase V-b is split: functional-variant traversal, tokenLookup deletion, and
  theme-tracking migration are now separate checkpoints (V-b/V-c/V-d), with
  conditional variant emission as V-e; the theme checkpoint can block on
  p28878 file ownership without coupling the others.
- Acceptance is the single named constant CEILING; all text asserting a
  mechanical row-sum-to-union translation is removed.

What changed in revision 2, so the diff against revision 1 is auditable:

- The measurement frame is rebuilt around one real whole-core artifact (a
  union-deletion CORE metric on a frozen size fixture) instead of a sum of
  non-additive marginal rows. Revision 1's explanation of the frame mismatch
  (a "different module subset") was wrong; the cause is commit `878db6d383`
  adding the FlatFrame scenario to both benchmark entries, which moved the
  ruler itself.
- Checkpoint 1b is REVERTED through the make-or-break gate. Revision 1 kept it
  on an asserted dependency the critique showed does not exist for Phases 1-3,
  and repaired it with a lazy Proxy that violates the no-Proxy rule and cannot
  reproduce the public `extras.props` record semantics. The real merged props
  object comes back; there is no runtime Proxy anywhere in this plan.
- The definition-time clause merge no longer gets its own scanner. A shared,
  config-independent clause identity reduction is introduced; the runtime
  resolver, `parseValue`, and the merge sink all consume it, so there is one
  semantic implementation of clause syntax and identity.
- Condition state during emission travels in call-stack arguments, never in
  fixed slots, so same-frame nested clauses cannot corrupt an outer clause
  (revision 2 first used a scratch stack here; revision 3 replaced it with
  primitive locals, see the revision 3 list).
- `tokenLookup` is deleted rather than "preserved or moved". The theme
  tracking path gets an explicit reentrancy-safe design. Revision 2 named the
  compound arena as an exception; the Phase I binding later removes it with
  1a.
- The compiled vocabulary gains config-revision invalidation so `addTheme`
  cannot strand it, with a runtime test.
- The false "at most five modifiers" premise is removed; chains are unbounded,
  and the existing distinct-non-platform depth rule is preserved exactly.
- Phases are split so a red test localizes to one change.
- Phase 5 no longer claims the exhausted directStyle/atomic seams; its budget
  shrinks to the two targets the counterpart audit did not exempt.
- Final acceptance is restored to the owner's 30 KB ceiling. Revision 1's
  37,600 substitute is withdrawn; the belief that consolidation alone will not
  reach the ceiling is stated as a recommendation with residual attribution,
  not encoded as success.

## Purpose

v3's web core is larger than v2's because the string engine is layered where
v2's object engine was flat. The capability audit (handoff log sections 15-16)
already established that the per-group replacements are lean: condition
routing, atomic merge, and value routing are each SMALLER than their v2
counterparts, and getSplitStyles and createComponent were at parity before the
1a/1b work. The excess is the layering itself: three parser drivers over one
lexer, a canonical parser shipped to serve a definition-time merge helper, the
modifier vocabulary written three times, precedence and identity computed in
separate modules that re-parse what the engine already split, a pre-pass that
re-scans every prop value, and per-call closures gluing the layers together.

This plan restructures the runtime into one lexer, one clause identity
reduction, one clause resolver, one contribution pipeline, and one compiled
vocabulary, then absorbs the variant path and component-state discovery into
the same pass. It is a restructuring with a bundle target and a stop gate, not
a byte-shaving list.

## The measurement frame

### What went wrong, stated plainly

Commit `878db6d383` (checkpoint 1a) added the 63-line FlatFrame scenario,
including `styled`, twelve compound variants, grammar-bearing values, and an
animation prop, to BOTH benchmark entries and to `shared/bench.ts`. That
changed the application being measured, which changed gzip's shared dictionary
and every marginal row. The owner's `39,087 / 29,707` and the 30 KB ceiling
live in the pre-FlatFrame entry; revision 1's `41,632 / 30,345` live in the
post-FlatFrame entry. They are different units, and no constant offset
translates them. Revision 1's claim that the totals differed because of a
different module subset was wrong.

Separately, both of those figures are SUMS of per-module marginal gzip rows,
and `attribute-bundle-gzip.ts` itself states that marginals do not sum to the
chunk total. The critique's union-deletion control (delete all non-animation
Tamagui source-map spans together, gzip once) quantifies the error, READ from
its independent rebuilds:

| benchmark revision | whole v3 / v2 | row-sum "core" v3 / v2 | one-union core v3 / v2 |
| --- | ---: | ---: | ---: |
| `86c00ff56a`, entry before FlatFrame | 104,053 / 94,857 | 39,087 / 29,707 | 39,938 / 30,521 |
| `de1e8d786d`, entry with FlatFrame | 106,736 / 95,936 | 41,632 / 30,345 | 42,270 / 31,279 |

### The one metric

**CORE** is defined as: on the frozen size fixture, the gzip difference between
the built chunk and the same chunk with every `@tamagui/`-attributed
source-map span EXCEPT the `animations-css` and `animation-helpers` modules
deleted as one union. One artifact, one gzip call, one number. The same
operation on the v2 benchmark, built in the same run, yields **CORE_v2**, the
parity anchor.

Mechanics:

- The size fixture is FROZEN at the `86c00ff56a` entry content for both
  benchmark apps. Its dedicated `src/size.tsx` entries import the frozen
  `shared/sizeBench.ts` harness and build only in Vite's explicit `size` mode.
  FlatFrame and any future scenario live in the normal `src/index.tsx` plus
  `shared/bench.ts` performance workload. Adding a runtime scenario must never
  move the size ruler again; the freeze is recorded at the top of each size
  source. The dedicated entry filename stays `index-[hash].js`, so the frozen
  no-arena and v2 controls reproduce the historical artifacts byte for byte.
- `attribute-bundle-gzip.ts` gains a `--core` mode computing exactly the union
  metric above, so CORE is one reproducible command rather than a hand-rolled
  procedure. Per-module marginal rows remain what they are: attribution for
  finding pools, never a gate.
- Every checkpoint records CORE, CORE_v2, the whole-chunk totals, and the
  relevant marginal rows, from a clean tree, full root `bun run build`, and a
  FRESH `--outDir` every time (a reused outDir double-counts chunks; this
  exactly doubled one measurement during revision 1's drafting).

### Binding the ceiling

The owner's 30 KB ceiling was stated in the old row-sum frame, where same-run
v2 measured 29,707 (union: 30,521). Marginal row sums have no unique
conversion into the union metric. Coordinator p28302 bound the stricter
literal reading while the owner was away: **CEILING is CORE at or below
30,000**. This is 521 bytes below same-run v2 CORE (30,521). If the final
result lands from 30,001 through 30,814, residual attribution must call out
that the literal choice alone determines the miss and return the policy
question to the owner. No allowance is silently inferred from the old frame.

## Integration checkpoint and rebaseline (before any engine work)

The branch has three campaign commits on `99fba89f0c` while `v3-beta` has
moved (root ThemeUpdate export `b0d6c14908`, compiler and test follow-ups, a
main merge, and the `86c00ff56a` test pin). In order:

1. Revert `de1e8d786d` (checkpoint 1b) as a single revert commit. See the 1b
   decision below.
2. Merge `origin/v3-beta` into `p28910-v3-single-pass` (merge, not rebase: 1a
   and the plan commits are published SHAs referenced in documents).
3. Freeze the size fixture as defined above.
4. Full root build; measure and record: CORE and CORE_v2 at the integrated
   tip, plus whole-chunk totals and marginal attribution. **CORE_base** is the
   integrated-tip number.
5. Price 1a with a real one-variable control: in a detached scratch worktree,
   take THE EXACT integrated tip, reverse-apply `878db6d383` only, resolve
   nothing else, full build, and measure **CORE_noarena** on the frozen
   fixture. CORE_base minus CORE_noarena is then exactly the size cost of the
   compound arena and streaming, because the two trees differ by nothing but
   1a. (A detached `2681babe1f` is NOT a valid control: it is a child of
   `99fba89f0c` while the integrated tip also carries v3-beta's later web and
   package changes, so that comparison would price all post-`99f` v3-beta
   movement as if it were 1a.) Report the one-variable price to the owner
   against 1a's measured wins (getter reads 1,006 to 1, allocation minus
   16.7%). p28302 declined the +279 CORE trade for this size campaign, so 1a
   is reverted and CORE_noarena is the working baseline. The performance win
   remains a separate future proposal with those measured numbers.
6. Re-verify the variables scope claim post-integration: the Vite size build
   must still contain no `helpers/variables.mjs` span. The root export
   `b0d6c14908` is expected to leave Vite unchanged (READ at pre-integration
   state) but is measured, not assumed, because Metro web demonstrably
   retains the root graph (+3,807 Tamagui marginal, 2,980 of it variables,
   per the accepted root-export receipt).

## The variables.mjs correction, both halves

Half right in revision 1: `variables.mjs` (2,347) is absent from the tracked
Vite no-use bundle; the ThemeUpdate split (`99fba89f0c`) made the heavy module
reachable only through the `theme-update` entry. READ: the baseline source map
contains `variableValue.mjs` and `configVariables.mjs` and no
`helpers/variables.mjs` or `theme-update` source.

Half wrong, corrected: the owner's 39,087 baseline was measured AFTER
`99fba89f0c`. The variables win is already inside the 30 KB campaign
arithmetic and provides no slack against the ceiling. What it does correct is
the FORECAST: the credible consolidation prize from here is roughly 4-5 K, not
6-7.5 K, and the plan says so as a recommendation in the acceptance section
rather than by moving the target. Scope limit that must also be carried: the
"ships none of it" claim holds for the measured Vite and webpack entries only.
Metro retains the root's static graph, so with the `v3-beta` root export a
Metro web app pays for variables regardless of use. That is a product
decision outside this campaign, but no product-wide "already out" claim may be
made, and the rebaseline re-measures the Vite arm after integration.

## The 1a/1b decision

**1b is reverted through the make-or-break gate.** Reasons, in order of
weight:

- Phases 1 through 3 do not depend on it. The grammar diet, the shared
  resolver, refusal semantics, and variant absorption all consume the merged
  `processedProps` object exactly as the pre-1b engine did. Revision 1
  asserted a dependency without naming one; the critique's dependency table
  stands.
- The public `extras.props` contract is `VariantSpreadExtras<Props>.props`,
  the full record. With the merged object gone, no get-trap Proxy reproduces
  `in`, `Object.keys`, spread, rest destructuring, `for...in`,
  `getOwnPropertyDescriptor`, or ownership, and adding traps runs more
  authored code while still violating the explicit no-Proxy rule. With the
  merged object back, `extras.props` IS the record and the entire problem
  disappears.
- The pair cost +939 gzip against a repair forecast of -100 to -300, leaving
  the campaign underwater before it starts.

Direct three-source traversal is OUT of this campaign's scope. A future
attempt is a separate owner-approved effort and must present a no-Proxy design
that preserves full record semantics AND beats the merged object on both bytes
and allocations, measured, before it lands.

**1a is reverted.** The exact control prices it at +279 CORE for getter reads
falling from 1,006 to 1 and a 16.7% getSplitStyles allocation reduction.
p28302 declined that trade in this size campaign because later phases do not
depend on its arena, its byte-to-allocation ratio is worse than the prior
accepted +93-byte/29.7% trade, and CORE_noarena gives every later checkpoint
one clean historical baseline. The performance result remains a separate
future proposal with its measured numbers. Settled decision 3's arena and its
module-state exception leave with 1a; no replacement compound arena is
designed into the consolidation phases.

## Target architecture

Five runtime pieces. Everything below the component surface is one module
graph with one direction of flow; no layer re-parses, re-scans, or re-checks
what the layer above already established.

### 1. The lexer (unchanged algorithm, context-passing API)

`scanFlatValue` stays the single charCode pass it is; the record is explicit
that the lexer itself is not a target. Its API changes from a per-consumer
visitor object to a hoisted handler plus explicit context:

```ts
scanFlatValue(source, handler, ctx)
// handler is a module-level object; every method receives ctx first:
// handler.segment(ctx, start, end, isBase)
// handler.chain(ctx, start, end): boolean
// handler.error?(ctx, code, index)
// handler.word?(ctx, start, end, isChain)
```

Each driver hoists exactly one handler to module scope and passes its live
state as `ctx` (the engine passes the pass state; `parseValue` passes its own
per-call record, fine because tooling parses are not a render path). This
removes every per-scan visitor allocation and every module-level scan global
without a second lexer. All drivers move in one commit; the old form is
deleted, not kept as an overload.

### 2. The shared clause identity reduction (the answer to "which parser owns merging")

A new grammar-runtime operation owns clause SYNTAX and IDENTITY,
config-independently: driven by the one lexer, it folds the alias table
(`active`/`pressed` to `press`, `starting` to `enter`, `ending` to `exit`),
canonicalizes an unordered modifier multiset to its order-insensitive slot
key, and reports clause spans. It does NOT classify modifiers against a
config; classification is the resolver's job and happens in exactly one place.

Three consumers, one semantic implementation:

- the runtime clause resolver (below) uses it for canonical spelling and slot
  identity, then classifies and derives condition semantics;
- `parseValue` uses it to build `ParsedValue` for the compiler, codemods, and
  tooling, adding registry diagnostics on top;
- the definition-time merge sink in `mergeVariants` uses it to key clause
  slots and applies later-slot-wins by slice concatenation. Definition-time
  allocations are acceptable; a bespoke merge scanner is not, and revision 1's
  "lean merge driver" is withdrawn as exactly that. The merge cannot drift
  from the runtime on malformed values, aliases, duplicates, or group
  spellings because it has no syntax opinion of its own.

This keeps `parseValue` and `mergeProgramValues` out of the app runtime graph
(the merge no longer imports them) while leaving one owner for what a clause
IS. The open design question the critique named is settled as follows:
`styled()` can run before any config exists, so identity is defined
config-independently (alias fold plus canonical multiset key over spellings),
and only the resolver, which always runs with a live config, assigns kinds.
Two values whose modifiers a config would refuse still merge by spelling
identity, which is today's `acceptAnyModifier` behavior, pinned.

**Parser-cluster gate**: at the make-or-break gate, the union attribution of
the surviving lexer, identity reduction, resolver, and merge sink is measured
as one union. The owner's target for this cluster is about 800 gzip; the gate
requires it at or below 1,000 with the union reported either way. Whole-core
movement alone cannot prove the consolidation happened.

The cluster number comes from `tamagui-bench/cluster.html` and its frozen
shared fixture, never from the CORE size entry. Its closed manifest includes
the complete legacy sources (`mergeVariants`, `mergeFlatValues`,
`valueParser`, `programs`, and `scanFlatValue`), the runtime driver
declarations (`directStyle.getCondition`, `directStyleHandler`,
`directStyle.contributeStyleString`, `directStyle.contributeFrontendValue`,
`directStyle.contributeVariantClauseValue`, `propMapper.resolveVariants`,
`propMapperHandler`, `useComponentState.lifecycleHandler`, and
`useComponentState.hasFlatModifier`), their parser-specific supporting
declarations, and predeclared replacement sources beginning with
`clauseIdentity`. `useComponentState.enterModifier` is selected because the
manifest's private-dependency check proves `hasFlatModifier` references it.
Their predeclared Phase VI destination is the selected
`directStyle.contributeStyleString` main-pass declaration. If IV-c gives that
pass a new top-level owner, its replacement selector must enter the manifest
before the lifecycle declarations may depart.
All selected spans are removed as one union and the stripped chunk is gzipped
once.

Each checkpoint declares which selectors must be present and which must be
absent. An absent selector must name the destination, already inside the
manifest, that received its responsibility. Missing, ambiguous, or escaped
selectors fail the checkpoint. Before IV-b measurement, the frozen artifact's
reference graph is audited once for omissions as well as departures: every
runtime declaration that directly calls or is called by the scanner, clause
identity/group canonicalization, resolver, or merge sink must either have a
manifest selector or an explicit exclusion with a reason below. There is no
unclassified third category. This audit is required because departure closure
did not catch the lifecycle scanner that was never selected in the first
place.

The mechanical audit parsed all 135 `sourcesContent` entries in the frozen
Phase III-d artifact, resolved local and imported top-level references with the
TypeScript AST, and required a generated source-map span for every included
declaration. Its positive control found both previously known lifecycle
omissions. It also found the three direct-style callers and
`config.grammarPlatformNames`; the latter is absent through III-c1 and retained
by `compileModifierVocabulary` from III-c2 onward.

The included inventory is:

- all generated declarations in the full-source `scanFlatValue`,
  `clauseIdentity`, `mergeFlatValues`, and `mergeVariants` selectors;
- the direct-style driver, three contribution callers, condition resolver,
  selector/state/platform/group/container helpers;
- the propMapper handler, conditional resolver, and clause appender;
- the lifecycle handler, `hasFlatModifier`, and its private enter constant;
- the selected precedence, state-spelling, compiled-vocabulary,
  config-revision, platform-name/rank, and container-query declarations.

The explicit exclusions are:

- `emitSegment`, `emitValue`, `contributeStyleValue`, and the token, border,
  shadow, CSS, and component-value splitting helpers, because they consume
  accepted payloads after parser callbacks and remain general emission sinks;
- `propMapper`, `resolveVariantValue`, `resolveTokensAndVariants`, and their
  helpers, because they evaluate accepted variant payloads around the selected
  conditional driver rather than owning grammar or refusal;
- `useComponentState`, `platformPseudoModifiers`, animation and disabled-state
  helpers, because they are hook orchestration and query inputs around the
  selected lifecycle driver;
- shared platform constants, `mediaKeyMatch`, media configuration, and media
  stringification, because they execute live platform/media state for consumers
  outside clause parsing;
- config publication, `getStyleObject`, `getSplitStyles`, `styledImpl`, and
  generic object helpers, because they are app/config/integration roots outside
  this ruler;
- diagnostic/hash snapshot and config-view declarations with zero generated
  spans, plus tooling-only `valueParser`, `programs`, `modifierRegistry`, and
  rich `states` modules absent from the Phase III-d runtime artifact. Their
  historical absent-to-present destinations remain selected.

After classifying those boundaries, a second AST/source-map pass produced no
unselected generated declaration directly touching a seed or serving as a
parser-specific private dependency. The 75-selector manifest was mechanically
closed under this declared parser boundary. IV-a then adds
`resolveClauseChain`, `canonicalStateModifierNames`, and
`stateModifierSelectors` before they carry spans. An AST reference check shows
that `directStyleHandler` reaches only `resolveClauseChain`, `emitValue`, and
`splitComponents`, while `resolveClauseChain` reaches only `platformMatches`
and `emitValue`. The resolver and platform declaration are selected; the two
emission helpers are explicit terminal exclusions above. The current
78-selector manifest is therefore closed under the same boundary without
recursively pulling the general emitter into the parser ruler. Revalidating every historical
artifact also found four stale `isContainerSizeQueryText`/pattern moves that
pointed to another absent selector. Those checkpoints now point to the present
`directStyle.containerCondition` declaration where the responsibility still
lived; every recorded artifact validates again.

Both measurement histories remain explicit:

| checkpoint | former 68-selector union | omission-closed 75-selector union | current 78-selector union |
| --- | ---: | ---: | ---: |
| Phase III-a (`cd2353824f`) | 4,239 | 4,706 | 4,706 |
| III-b | 3,950 | 4,414 | 4,414 |
| III-c0a | 3,950 | 4,414 | 4,414 |
| III-c0b | 3,956 | 4,420 | 4,420 |
| III-c0c / dead Proxy | 3,956 | 4,420 | 4,420 |
| III-c1 | 4,011 | 4,474 | 4,474 |
| III-c2 | 4,638 | 5,139 | 5,139 |
| III-d | 4,198 | 4,700 | 4,700 |
| IV-b | void 4,515 | 5,045 | 5,045 |
| IV-a | | | 4,707 |

The omission-closed Phase III-a baseline is 3,706 above the gate and 3,906
above target. Phase III-b is a same-frame reduction of 292 but remains 3,414
above the gate and 3,614 above target. Even if
the later driver-deletion checkpoints realize their pre-ruler planning band,
the absolute gate is not forecast to pass without materially shrinking the
retained representation. Treating a sink that the baseline never imported as
zero would let an arbitrarily large omitted implementation pass, while adding
styled inheritance to CORE would change the campaign's units. Both
alternatives remain rejected.

The rejected five-source ruler scored III-b as -8 and the nominal row total
suggested +15. The corrected union reports -289 while that fixture's whole
bundle moves -287. Those independent whole measurements tracking each other
show a real bundle reduction that the two incomplete instruments hid, rather
than bytes merely moving between selected declarations.

### Compiler boundary control

The earlier inference that every compiled app ships the runtime scanner, even
when it authors no runtime clauses, was too broad and is superseded. Four
isolated `EXTRACT=1` builds establish the narrower rule: **the scanner is the
universal fallback for every retained `createComponent`**. React-only, one
fully flattened static `View`, and `TamaguiProvider` plus that fully flattened
`View` all omit `scanFlatValue` completely. Adding one retained `View` with
only static literal props and `asChild` keeps `scanFlatValue` at 2,004 mapped
minified bytes and 755 marginal gzip, despite having no dynamic props,
functional variants, clause strings, or runtime `styled()` inheritance.

The retained component reaches the scanner through two top-level edges:
`createComponent -> useComponentState` and
`createComponent -> getSplitStyles`. Those fan into three immediate scanner
sites: lifecycle `hasFlatModifier`, direct string styles, and conditional
variant resolution. **Phases IV-VI touch none of compilerHost.lowerCandidate,
resolve.canFlatten, lower.unsafeEntry, normalization, or static evaluation.
They only reduce the cost after a retained createComponent.**

The checked kitchen-sink web corpus gives the available prevalence anchor:
2,645 candidates found, 2,128 fully flattened, 20 partially lowered but still
retained, and 497 bailed. Its classified retention reasons are:

| reason | observed candidates |
| --- | ---: |
| behavior or context component contracts | 346 |
| dynamic values | 51 |
| animation runtime | 34 |
| lifecycle programs | 21 |
| event mapping | 21 |
| `disableOptimization` | 13 |
| unevaluated spreads | 6 |
| theme boundaries | 5 |

Only the 497 classified bailouts are measured by reason. The 20 partial
retentions are not classified. The ordering after those measured web counts
is inferred from API prevalence rather than a measured application
distribution; native-only clauses, groups, containers, and plain-component
`asChild` frequency have no measured distribution here.

Ordered by the measured counts and then expected application prevalence, the
compiler retains a component for these reasons:

1. Behavior HOCs, custom hosts, default children, and styled-context providers.
   Their host selection, interaction, ref, scrolling, child, or provider
   contract is usually inherent. The component-level flag can be conservative
   for an invocation that does not exercise the behavior.
2. Dynamic style and variant values the evaluator cannot prove or lower to an
   unambiguous host style. Runtime variability is inherent. Keeping the full
   Tamagui component is often a current compiler limitation because proven
   numeric domains and static conditional branches already flatten.
3. Animations and lifecycle programs. Driver, presence, callback, and lifecycle
   state are mostly inherent runtime work. Static CSS transitions already
   flatten on web, while `animateOnly` and some finite cases remain conservative.
4. Native conditional flat values and native group/container providers.
   Publishing provider state is inherent. Refusing every native clause program
   is a current compiler limitation.
5. Tamagui event mapping. Active responder handlers require runtime semantics;
   an explicitly undefined handler is retained only because the decision checks
   prop presence.
6. `asChild`. An active Slot must merge into its child and cannot become a host
   wrapper. `asChild={false}` also retains today, which is a presence-check
   artifact.
7. `disableOptimization`. A true value is an intentional opt-out;
   `disableOptimization={false}` retains because the decision checks presence.
8. Prop spreads. Unknown precedence and style ownership require caution, while
   evaluated mixed spreads expose current transactional rewrite limits.
9. Theme boundaries. Active theme state is inherent; `themeInverse={false}`
   retains because the decision checks presence.
10. Candidate recognition and incomplete syntax or static definitions. These
    are compiler analysis and configured-scope limits rather than component
    semantics.
11. Rare invalid-host, serialization, platform mapping, native DOM, edit-shape,
    and style-handle failures. Some represent real platform constraints and
    others are lowering limits.
12. Extraction never entered because it was disabled, excluded by file or
    environment, or outside the configured app graph.

Independent controls distinguish inherent retention from compiler decisions:
opaque web styles partially lower but retain while proven finite domains and
static branches flatten; a static CSS transition flattens on web but retains on
native; active `asChild`, events, lifecycle clauses, and theme boundaries
retain; false-valued `asChild`, `disableOptimization`, and `themeInverse` also
retain. Therefore compiler-boundary work can remove several conservative
retention cases, but it is separate scope. Phases IV through VI only make every
remaining retained component cheaper.

Two representation changes were priced and declined for this campaign. A
packed clause identity was estimated at roughly 150-300 corrected-union gzip,
with low confidence and two to three high-risk checkpoints across identity,
precedence, hashing, merging, and reentrancy. A span-only merge sink was
estimated at roughly 70-140 corrected-union gzip, with medium-low confidence
and one medium-risk definition-time checkpoint. The ranges overlap under gzip
and are not additive. Neither changes the roughly 2,950-byte target gap enough
to justify its risk; if the owner reopens either, the span sink goes first.

### Grammar contraction before the compiled vocabulary

The compiler and runtime classify the same authored spelling differently on
committed HEAD. `createModifierRegistry` itself gives an exact registered name
priority over parameterized parsing, but several compiler and tooling consumers
canonicalize aliases before calling `registry.get`. That pre-lookup
canonicalization can erase the exact configured spelling before the registry
sees it. `directStyle.getCondition` independently tries `group-*` and `@*`
prefixes before configured names, accepts looser identifiers and non-size
container queries, and reads aliases through an object prototype. The same
source can therefore compile one way and run unlowered another way today.
Consolidation exposed this correctness bug; it did not cause it.

Registry semantics are authoritative after correcting the rule that advertises
a container size with no executable media query and reserving the `group-`
prefix for group conditions. This is a grammar contraction. Six rows refuse
input that previously produced a wrong selector, a silent no-op, an
unexecutable condition, or an exception. The platform collision row reserves
the fixed platform vocabulary instead of letting a user theme capture it.
Outward behavior changes ONLY in the seven enumerated rows below, each is
pinned, and CORE does not regress.

| row | before | after | behavioral pin |
| ---: | --- | --- | --- |
| 1 | A root theme named `web`, `native`, `ios`, `android`, `tv`, `tvos`, or `androidtv` wins before the platform branch. | The fixed platform meaning wins. A theme cannot capture a reserved platform name. | `layerParity.web`: `web:` emits with no `.t_web` selector and stays active under the light theme. |
| 2 | A configured media or theme beginning `group-` competes with the group grammar, so config-independent alias identity and configured classification can assign the same spelling different meanings. | The `group-` prefix is reserved. A configured media, theme, or custom platform name with that prefix is not registered and receives an actionable diagnostic; the spelling retains only its group-grammar meaning. | `modifierRegistry.test` and `candidate.test`: colliding media and theme entries are refused with the exact reserved-prefix diagnostic while valid group spellings remain groups; `mergeFlatValues.test` pins `group-active` and `group-press` as one alias-equivalent slot. |
| 3 | A named group accepts any nonempty suffix after `/`, including punctuation, Unicode, or another slash, then interpolates it into selector/class text. | Group identifiers are limited to `[A-Za-z0-9_-]+`; invalid spellings are refused. | `parserAgreement.web`: `group-hover/a.b`, `group-hover/a/b`, and `group-hover/café` are refused by parser and prop path with no group subscription. |
| 4 | A container size or name can carry punctuation, Unicode, or another slash when `queryFor` happens to find the size. | Both segments use `[A-Za-z0-9_-]+`; invalid spellings are refused. | `modifierRegistryAgreement.web`: invalid size/name table is refused with no container subscription. |
| 5 | `@hoverNone` and other configured non-size media are accepted as container queries, producing a silent no-op on web and incorrect activation on native. | `@` accepts only media derived as width, height, inline-size, or block-size conditions. | `flatValuePrograms.native`: a laid-out `@hoverNone` value is refused as a whole under the pre-IV-b refusal rule and records no subscription; the ordinary `hoverNone:` viewport form still activates. |
| 6 | An explicit `containerSizeNames` entry can register `@wide` even when no `wide` media query exists, so the registry binds a condition no runtime can execute. | A declared container size must also have a registered media query; otherwise the registry refuses it with a diagnostic. | `modifierRegistry.test`: the no-media `wide` case changes from a container binding to refusal plus diagnostic. |
| 7 | Every `Object.prototype` spelling can make alias lookup return an inherited function/object, then `getCondition` throws at `.startsWith`; registry record iteration can also bind a custom inherited enumerable name that runtime own-property lookup refuses. | Alias and configured-name lookup uses own entries only. Unconfigured or inherited names refuse, while an explicitly configured own name works without throwing. | `parserAgreement.web`: all twelve own prototype names refuse without throwing; `modifierRegistryAgreement.web` pins own `constructor` as media and an inherited custom name as absent. |

An earlier revision made exact configured `group-*` names win. An executable
probe disproved that design: with `group-active` configured as media, the
registry classified `group-active` as media and `group-press` as group, while
the config-independent identity sink correctly treated the two spellings as
one group-state alias. That conflict affected four independent consumers:
`mergeFlatValues`, `mergeProgramValues`, `normalizeProgramKey`, and
`programClassName`. Making the identity config-dependent would make class
names for identical source depend on config and would break compiler/runtime
class-name correspondence and config-independent caches. Reserving the prefix
removes the second meaning instead. All four consumers remain simple and
config-independent.

An invalid config entry must never change the meaning of valid authored code.
The registry diagnoses and ignores a configured name that violates the
reserved-prefix rule. Runtime classification still treats a valid authored
`group-hover:` or `group-active:` clause as group syntax. A single bad config
key must not make otherwise valid declarations disappear.

A committed-tree sweep found no configured media, theme, container, or custom
platform name beginning `group-`. The only `mediaNames` collisions were the
deliberate registry/candidate tests. Two tamagui.dev purchase components and
the zero-runtime differential corpus contain authored clause/output keys with
that prefix, not config names, so ordinary group usage is unaffected. Group
names do not create another collision: the slash is the grammar boundary, so
`group-active` is the anonymous group's press alias while
`group-hover/active` is hover on a group named `active`.

Group lifecycle is separate from those rows. The registry currently binds
`group-enter`, `group-exit`, `group-starting`, and `group-ending`, but the
production compiler does not call `lowerProgram`, direct runtime group
resolution refuses them, and native group state/subscriptions do not publish
lifecycle. Its own checkpoint stops those four group bindings while retaining
standalone lifecycle modifiers. `parserAgreement.web` pins parser and runtime
refusal. Implementing group lifecycle is a later cross-platform feature; it
requires direct web selectors, production compiler coverage, native parent
presence state, subscription notifications, and animation-timing validation.

### 3. The compiled vocabulary, with config-revision invalidation

Config installation compiles one flat record covering every non-parameterized
modifier: core states and their aliases, component states, media names, root
theme names, platform names. At III-c2, an exact entry carries only the numeric
kind needed for classification; the shared identity owner supplies canonical
state aliases. Precedence, condition-set keys, selector/source facts, and their
existing owners remain unchanged until IV-a consumes them. Adding packed rank
or selector fields in III-c2 would create a second semantic owner before the
checkpoint that deletes the first one.

Staleness is handled by one defined path, not a fallback: the config carries a
monotonic revision that `updateConfig` bumps (READ:
`_mutateTheme.ts:136-139` assigns into `config.themes` and calls
`updateConfig('themes', ...)`, and the config object identity does not change).
`setConfig` compiles before publishing the config, and `updateConfig` eagerly
recompiles after a successful mutation. The render accessor only reads the
fully published record; it never lazily allocates or repairs a directly mutated
config. A runtime test builds the table, calls
`addTheme({ name: 'brand', ... })` on the live config, then renders a `brand:`
clause and asserts it resolves; `parserAgreement` over a static config cannot
catch this class.

The revision record lives on the config under a `Symbol.for(...)` key, not in a
module-local `WeakMap`, so duplicate `@tamagui/web` copies that reach the same
global config also reach the same compiled state. Table construction keeps all
mutable work in call-stack locals. It publishes only when the config still
holds the revision-record identity captured before authored config values were
read, so a nested update cannot be overwritten by the stale outer build.

The same revision invalidates `grammarConfig`'s content snapshot and replaces
`directStyle`'s config-identity-only media-query and precedence caches with
eagerly prepared values in the config record. A media update therefore cannot
classify a new name while retaining an old query or rank. `mutateThemes`
assigns its whole batch and calls `updateConfig` once; rebuilding after every
theme in the batch would make eager invalidation quadratic in the number of
themes. `setConfigFont` also refreshes the revision after its direct font
mutation because the grammar snapshot includes font token names.

The published revision-state identity is also the generation key for every
config-derived `<ThemeUpdate>` cache: theme-key unions, scheme-stripped bucket
names, its modifier view, parsed inline values, flat layers, and merged-theme
results including their idempotency marker. READ: all five WeakMaps previously
keyed the stable `conf.themes` object, while `updateConfig` mutates that object
in place, and the merged-theme cache had no config generation at all. A warmed
`<ThemeUpdate>` could therefore keep rejecting a theme or key added at runtime
after `directStyle` had refreshed. The regression warms the same raw value,
calls `addTheme`, and proves the new theme is visible without changing config
or themes identity. Stable renders reuse the same generation caches; only a
successful config mutation publishes a new generation.

`<ThemeUpdate>`'s pre-existing exact-collision and unknown-modifier priorities
are not normalized in this checkpoint. Its scheme-stripped implicit theme
buckets are a separate contract, and the concrete behavior differences are
recorded in `plans/v3-themeupdate-condition-divergence.md` for a later decision.

At III-c2 the table replaces the classification if-chain in `getCondition`.
Across III-c2 and IV-a, the table plus resolver then replace `stateSelectors`,
runtime `canonicalClauseModifier` calls, `createClausePrecedenceOrder`,
`withinCategoryRank`, the `states.ts` retention chain, and the
`modifierRegistry` parse helpers. The builder lives in the
grammar package so the compiler compiles the identical table from the
identical config; `parserAgreement` pins the two surfaces.

### 4. The clause resolver (one loop, nesting-safe, unbounded chains)

`resolveClauseChain` is one loop over a chain span, reading modifier segments
directly from the source between the offsets the lexer reported. Per
modifier: one table lookup (group `group-*` and container `@*` spellings are
the only misses and take one inline parse each; today the same spelling is
parsed up to three times per clause across `groupCondition`,
`canonicalClauseModifier`, and `withinCategoryRank`); fold the packed
precedence contribution; AND the active bit from the state source the entry
names; append the selector or wrapper contribution; extend the canonical slot
key.

Corrections from the critique, now binding:

- **Chains are unbounded.** There is no five-modifier syntax limit and the
  design assumes none. What is bounded is DISTINCT modifiers per clause: the
  existing language rule caps distinct non-platform conditions at five (the
  `grammarMaxNonPlatformDepth` rejection is preserved exactly, same observable
  behavior, pinned), and the platform vocabulary is seven names, so distinct
  entries per clause are at most twelve. Duplicate detection therefore scans
  the bounded distinct-so-far list: numeric table ids for table hits, span
  comparison (allocation-free char loop) for the rare parameterized forms.
  Authored chain length itself is unlimited; duplicates beyond the distinct
  set are skipped as today. Tests cover six-plus-modifier chains, reordered
  equivalent sets, aliases, and duplicates.
- **No fixed condition slots, and no scratch structures either.** A
  conditional variant like `sm:$v` can return `{ color: 'hover:red' }`, so an
  inner clause is evaluated while the outer one is live in the SAME pass.
  Condition state therefore travels only as call-stack arguments through the
  emit pipeline, and across a synchronous user-code boundary the ONLY state
  that survives is the clause's numeric source offsets held as primitive
  locals of the function that brackets the call (the source string itself is
  already an argument). When the call returns, the condition is re-derived
  from source plus offsets under settled decision 4, rebuilding the selector,
  wrappers, and slot key. Nesting is safe by construction because every
  nested evaluation has its own stack frame's locals; nothing about a live
  clause sits at module scope, in singleton slots, or in any per-pass grown
  structure. Revision 2's cursor-indexed scratch stack is withdrawn: it
  allocated per pass in the render path, which is the constraint this
  campaign has broken most often, and primitives on the call stack need no
  storage design at all.
- **Allocation story, stated honestly.** The selector string, the wrapper
  list, and the canonical slot key are real strings and a small array,
  required for CSS identity and rule text, and they are built per ACTIVE
  clause exactly as today (`out.wrappers ||= []` already allocates). What this
  design deletes is the per-clause `Condition` object, the `canonical[]`,
  `kinds[]`, and three separate Sets, the collect arrays, and the per-value
  visitor closures. Claims beyond that are not made.

Behavior is preserved bit for bit: active/emit rules, selector shapes, wrapper
text, precedence ordering, group/container subscription side channels
(`flatGroupKeys`, `flatGroupMedia`, `flatStateKeys`), dynamic iOS color
handling, enter/exit, unsupported-state warnings, and the depth rejection.
This is not a re-golf of condition routing semantics; the bytes come from
deleting the modules that recomputed each other's inputs, which the
counterpart audit's "already leaner than v2" verdict did not cover.

### 5. One contribution pipeline with streaming per-clause emission

The five current entry points (`contributeStyleValue`,
`contributeStyleString`, `contributeVariantClauseValue`,
`contributeFrontendValue`, plus propMapper's `resolveVariants` scanner)
collapse into one pipeline:

```
contribution(key, value, position in the forward pass)
  classify value ONCE: string-with-colon | plain string | number | Variable |
    object | frontend program
  [shorthand fold: once, here, nowhere else]
  [variant? -> variant application, below]
  string-with-colon -> lexer drives: per segment, resolve clause (4), emit
  everything else   -> emit directly with a null condition
emit(property, payload, condition args)
  [token resolution, one string->number coercion point]
  [composite lowering: border / textDecoration / background / transform /
   shadow / edge expansion, unchanged emitters]
  [sink: atomic slot | inline style | native style | context capture]
```

Settled decision 2 (a malformed clause discards only that clause) is what
makes streaming legal: the pipeline emits each valid segment the moment its
boundary is known and drops only the bad segment, so the collect arrays and
pending-condition locals are deleted rather than optimized. The decision lands
in the style path and the variant path in the same commit, with
`parserAgreement.web.test.tsx` repinned in that commit and `parseValue`
returning the surviving partial value beside diagnostics on its failure arm;
there stays exactly one parser result shape. Lexical errors are assigned at
the lexer boundary, not reconstructed by each consumer. The scanner tracks the
error offsets in the current top-level word and compares them with that word's
final colon when the word closes: errors before the colon invalidate the
modifier chain, errors after it invalidate that clause's payload, and errors
in an ordinary word invalidate the current base or payload. This distinction
is required for inputs such as an unterminated string after `hover:` followed
by a later valid clause, and it adds only primitive call-stack state.
The public `FlatValueHandler.chain` false-means-stop contract stays unchanged.
The style and variant handlers instead record a refused chain as pending
clause state, return true so the scan can find later clauses, and omit only
that clause when its payload closes.
IV-b keeps the existing collect-then-emit order so every condition is still
validated before direct emission and before any functional variant can run.
IV-a then streams the direct string path after these semantics make the
collector unnecessary; IV-c owns the remaining pipeline folding and timing
changes.
The lifecycle prepass consumes the same structural segment-validity signal, so
a valid `enter:` clause survives a malformed neighboring clause and an empty or
lexically malformed enter payload does not trigger presence. It does not grow a
second config-aware resolver merely to validate another modifier in the same
chain; that pre-existing narrow divergence disappears in Phase VI when the
resolved main pass becomes the lifecycle authority.
The `aspectRatio="16:9"` carve-out, the lifecycle-only
resting-value synthesis, the multi-value dev warning, and the no-colon fast
path survive with pins.

During a single string-value scan no user code can run (the string is already
materialized; token resolution reads config and theme values through the
engine path below), so streaming inside the lexer callback is reentrancy-safe
with all state on the pass frame. The variant path DOES run user code between
clause resolution and payload emission; there the bracketing function's
primitive locals keep the numeric offsets and the condition is re-derived per
settled decision 4.

### 6. Variant application fused into the pass

- `styled()` compiles variant resolver KEY metadata only: the
  `parseVariantResolverKey` split and ordering. `variant[value]` reads,
  resolver result properties, and static variant values keep their current
  read timing at the render point, so authored getter and mutation timing is
  unchanged unless the owner explicitly trades it.
- Static variant values contribute their properties in place. Functional
  variants are called directly; their returned object is traversed once, in
  place, with no `resolveTokensAndVariants` copy, no `normalizeStyle`
  intermediate, no entry arrays, and no `appendFlatClause` string round-trip
  on the engine path. `appendFlatClause` survives only for the HOC pass-down
  case, where reconstructing string form IS the contract.
- Before traversing a variant result, one direct O(1) `fontFamily` (or its
  configured shorthand) read updates the font scope, preserving
  `{ fontSize: '$5', fontFamily: '$heading' }` ordering; the pin uses two
  font scales that disagree on the token value, and the probe asserts the
  pre-read invokes an authored getter exactly once.
- Native `unset` keeps deleting already-produced output keys (a backward walk
  over OUTPUT, legal under the one-pass rule), pinned.
- Conditional variant values resolve their chain once via the resolver and
  feed `emit` directly with condition arguments.
- `extras.props` is the real merged props record, restored by the 1b revert.
  No Proxy, no view, no contract question. `getVariantExtras` keeps its
  existing per-pass cache.

### 7. Reentrancy-safe token and theme paths

**`tokenLookup` is deleted.** READ: the singleton is filled at
`directStyle.ts:421-427` and its consumer then calls `isVariable(lookup.value)`,
which performs `'isVar' in v`; an authored Proxy runs a `has` trap there, and
`resolveVariableValue` can invoke an authored `.get`, both while the singleton
is live. `tokenVariable` has exactly one caller, so per the inline-single-use
rule it folds into `configuredValue` and the three fields become locals. No
cross-boundary carrier object replaces it.

**The engine leaves the shared theme tracking globals entirely.** READ:
`getThemeProxied` caches ONE proxy per theme object across all components
(`trackingCache`, getThemeProxied.ts:57), which is exactly why its getters
must read the "current component" from module globals (`curKeys`,
`curSchemeKeys`, `curProps`, `curState`, :61-64), and those getters execute
during pass-time token resolution and inside functional variants, while
authored `toString`/getter code can run. Design:

- The ENGINE resolves theme values against the raw `ThemeParsed` record and
  records each accessed key DIRECTLY into the component's already-stable
  tracking refs, which the pass state carries as a frame field (the refs are
  per-instance hook state; their inner Set is created lazily on first track,
  once per instance, exactly as `track()` does today, so the engine adds zero
  per-pass allocation). A reentrant inner pass carries its own frame's
  tracking target, and the pure non-component entry carries none and skips
  recording. Subscription behavior is identical (the same keys end up
  tracked); the engine simply never executes a tracking getter mid-pass and
  never touches a module global. Revision 2's per-pass key set is withdrawn
  for the same reason as the scratch stack: it allocated per pass in the
  render path.
- User-facing surfaces that read theme values mid-pass (`extras.theme`) or
  outside it (`useTheme()`) move to tracking views whose getters close over
  that component's own stable refs instead of module globals; the per-theme
  shared-proxy cache is replaced by per-instance views created once per
  (instance, theme identity) in the hook phase, which is the "stable
  per-instance hook allocations are created once outside the pass" allowance.
  The module globals are then deleted.
- Coordination: `useThemeState.ts` and `getThemeProxied.ts` were owned by
  p28878 during the prior plan. If that ownership is still live, this item
  sequences behind their handoff; the engine-side half (raw reads plus frame
  set) does not touch their files and proceeds regardless.

**The binding rule**: every read of authored
data (functional variants, getters on variant definitions per
propMapper.ts:509-510, getters on variant results, on caller props, on style
objects, on styledContext values, `has` traps via `in`, authored
`toString`/String coercion, authored Variable `.get`) is a potential
synchronous re-entry, and no module-level mutable state may be live across
any of them. With 1a reverted there is no sanctioned exception.

### 8. The reentrancy probe matrix

The permanent suite grows from two probes to a matrix; each probe asserts the
outer pass resumes with its original props, theme tracking, condition
identity, and compound state, and asserts authored read COUNTS where a read
was deliberately made O(1):

- a variant-definition getter and a resolver-key getter;
- a variant-result getter, including the fontFamily pre-read (exactly one
  invocation) and the subsequent traversal;
- caller props, a nested style object, and styledContext values,
  parameterized over `get`, `has`, and enumeration traps;
- a functional variant that synchronously starts an inner style pass;
- a custom Variable `.get` and an authored `toString` during atomic identity
  or dynamic theme coercion;
- nested conditional variants that would overwrite same-frame clause scratch
  under a slot design (the case that killed fixed slots);
- a large compound set around a nested authored read, proving the local
  pre-1a matcher resumes its outer pass correctly.

## What this plan deliberately does not touch

- The lexer's algorithm.
- Composite emitters, atomic merge and rule identity (`directAtomic`'s slot
  machinery and the identity cache with its negative-control tests), and
  generic value routing semantics: measured at or below v2 counterparts, or
  declined with recorded reasons.
- `fixStyles`/`styleToCSS` object-side unification: DECLINED in the record
  (needs an end pass, changes boxShadow rule identity, ceiling 215-348).
  Revision 1 listed it under Phase 5; that conflict is resolved by dropping
  it. It returns only if new evidence disproves the recorded premises, as its
  own proposal to the owner.
- `insertStyleRule` and `getCSSStylesAtomic` deltas: NOT a byte pool. Their
  audit happens once, for residual attribution only; cache mechanics bought a
  measured 29.7% allocation win and are not traded away.
- Current `getSplitStyles`/`createComponent` growth over their at-parity
  record states is 1a repair debt (and 1a pricing), not permission to golf
  seams the audit closed.
- The string grammar as a feature, atomic expansion, build-time flags or
  capability gates, `resolveSafeArea`, `useMedia`, `core::runtime`,
  config/theme rows: feature weight, the owner's separate conversation.
- `_animation` stays (settled decision 5), discovered inside the sole style
  traversal, with the direct Tamagui animated-value test closing the
  `RawAnimatedValueCase` gap.

## Phases

Each checkpoint is one failure class, ends green on its named suites, and
records CORE, CORE_v2, whole totals, parser-cluster union, and its pool rows. Pool rows are named
against the rebaseline attribution (revision 1's absolute row figures predate
the revert and integration and are indicative only). Gzip rows are not
additive; the bundle acceptance gate is always CORE. Parser-cluster debt has
its own stop below. A pool row disappearing while CORE stays flat is a miss to
report, not absorb.

### Phase I: integration and measurement freeze

The six-step checkpoint above (revert 1b; merge v3-beta; freeze the size
fixture; rebaseline CORE_base / CORE_v2 plus the one-variable CORE_noarena
control; price and revert 1a; re-verify the Vite variables absence). Also lands
the `--core` tool mode. The bound baseline is whole 104,053 / CORE 39,938;
CORE_v2 is 30,521 and CEILING is 30,000.

### Phase II: removed with 1a

Reverting 1a removes the compound arena, its streaming callback, and every
repair this phase owned. Reverting 1b already removed its Proxy, closures,
pre-pass, and double reads. There is no Phase II code checkpoint and no
replacement traversal. Phase III begins from the pre-1a getSplitStyles path.

### Structural-debt ledger

This ledger records checkpoint-local CORE regressions that have an explicitly
named structural recovery point. It is not offset by unrelated reductions.
Unrecovered drift above +300 is a hard stop. A predeclared add-then-delete
sequence is accounted separately: its checkpoint may cross +300 only when the
recovery owners were named before measurement, those owners run immediately
next with no intervening work, and the sequence is measured again when it
closes. Future checkpoints do not gain this treatment after they miss a
measurement. A material miss at an intermediate recovery owner stops the
sequence before the next owner.

| checkpoint | CORE before | CORE after | delta | recovery owner | status |
| --- | ---: | ---: | ---: | --- | --- |
| III-b | 39,857 | 39,905 | +48 | III-d package-surface split | recovered |
| III-c2 | 39,911 | 40,550 | +639 | III-d tooling split, IV-b prerequisite, then IV-a resolver/precedence deletion | sequence +167 remains |
| III-d | 40,550 | 40,030 | -520 | paid III-b +48, then III-c2 +472 | banked |
| IV-b | 40,030 | 40,338 | +308 | IV-a resolver/precedence deletion | sequence +475 remains |
| IV-a | 40,338 | 39,976 | -362 | fixed sequence closing point | **missed recovery: +113** |

Current cumulative unrecovered drift: **0 CORE**. Current predeclared sequence
recovery is closed as missed with **+113 CORE outstanding**. Its recovery point
does not move to IV-c, and no new over-cap sequence debt may open while that
miss remains outstanding.

### Parser-cluster debt ledger

The parser-cluster target remains at or below 1,000 with 800 as the target and
is reported rather than stopping at the make-or-break gate. Between gates,
every checkpoint records its one-union movement and names a recovery point for
any increase. Permanent correctness costs are recorded but do not become debt.
Cumulative unrecovered cluster drift above +300 is a hard stop. The same
predeclared-sequence rule as the CORE ledger applies, and the sequence is
reported separately from drift.

The operational ledger below uses the current 78-selector frame. Its historical
values equal the omission-closed 75-selector frame because the three IV-a
destinations are declared absent through IV-b. The former 68-selector history
stays in the measurement table above. The baseline is the Phase III-a commit
`cd2353824f`. III-c1 does not land the compiled table. It adds strict shared
identifier/query classification while the legacy resolver, precedence, and
set-key wiring still exists. IV-a deletes that old wiring, so IV-a owns recovery
of III-c1's temporary cluster increase.

| checkpoint | cluster before | cluster after | delta | reason or recovery owner | status |
| --- | ---: | ---: | ---: | --- | --- |
| III-a omission-closed baseline | | 4,706 | | 78-selector ruler baseline; same bytes as the 75-selector frame | banked |
| III-b | 4,706 | 4,414 | -292 | shared identity reduction and merge sink | banked |
| III-c0a | 4,414 | 4,414 | 0 | container invariant stays outside the runtime cluster | banked |
| III-c0b | 4,414 | 4,420 | +6 | permanent lifecycle-contract correctness cost | permanent |
| III-c0c | 4,420 | 4,420 | 0 | config diagnostic stays outside the app graph | banked |
| III-c0d | 4,420 | 4,420 | 0 | production DCE already removed the dead Proxy | banked |
| III-c1 | 4,420 | 4,474 | +54 | IV-a resolver replacement | open |
| III-c2 | 4,474 | 5,139 | +665 | III-d tooling split, IV-b prerequisite, then IV-a resolver/precedence deletion | sequence +226 remains |
| III-d | 5,139 | 4,700 | -439 | runtime/tooling graph split | banked against III-c2 |
| IV-b | 4,700 | 5,045 | +345 | per-clause refusal plumbing; IV-a resolver/collector deletion | sequence +571 remains |
| IV-a | 5,045 | 4,707 | -338 | fixed resolver recovery point; pays III-c1's +54 first | **missed sequence recovery: +287** |

Current cumulative unrecovered parser-cluster drift: **0**. The fixed IV-a
closing point pays III-c1's +54 drift and 284 bytes of sequence debt, then
closes with **+287 parser-cluster gzip of missed sequence recovery
outstanding**. No new over-cap sequence debt may open while that miss remains.

The III-c2 measurement is whole 104,653 / CORE 40,550 in the frozen size
fixture and whole 104,506 / parser cluster 4,638 in the former 68-selector
cluster frame (5,139 in the omission-closed frame).
Four exported numeric modifier codes have no generated declaration spans after
Rolldown inlines them. The manifest therefore records those declarations as
absent with their bytes represented inside the already-selected
`compileModifierVocabulary` and `getCondition` declarations. Requiring a
positive declaration span for them would make a valid build fail without
measuring any additional byte.

### III-c2 recovery forecast

The forecast uses declaration and module marginals only to bound likely work;
those rows are not added into either acceptance metric. III-d is expected to
move **300 to 430 CORE** and **250 to 380 parser-cluster gzip** by moving human
diagnostic and completion construction out of `modifierVocabulary`, removing
the rich `states` and legacy registry/tooling retention chains from the app
graph, and keeping only the numeric runtime vocabulary. The current relevant
rows include `modifierVocabulary` at 399 marginal gzip, `states` at 320, and
`modifierRegistry` at 66, with substantial overlap and retained replacements.

IV-b is measured separately before IV-a because its semantic movement and the
resolver's structural movement must remain attributable. It is part of the
bound recovery sequence only because whole-value refusal otherwise requires a
resolved `Condition` to survive from the lexer's `chain()` callback to the
later payload emission. It is not counted as recovery forecast for IV-a.

IV-a is expected to move a further **250 to 420 CORE** and **300 to 500
parser-cluster gzip** by replacing the old `getCondition` plus selector,
group/container, precedence, set-key, and canonicalization bridge with the one
resolver. The current gross declarations include `getCondition` at 441,
`stateSelectors` at 125, group/container/state/platform helpers at 102/147/97/56,
and the retained precedence/identity helpers; the replacement resolver keeps a
material part of that behavior.

Combined, the forecast is **550 to 850 CORE** and **550 to 880 parser-cluster
gzip** against sequence debts of +639 and +627. The midpoint covers both. The
low end falls short by 89 CORE and 77 parser-cluster gzip, so recovery is
credible but not assured. III-d and IV-b are each measured before IV-a; a
material miss is reported rather than hidden inside the resolver checkpoint.

Phase III-d measured **-520 CORE** and **-439 parser-cluster gzip** in the
omission-closed frame, exceeding its original forecast bands. The movement comes from
the scoped runtime/tooling graph split. It pays III-b's +48 CORE debt first,
then reduces the III-c2 sequence debt by 472 CORE and 439 parser-cluster gzip.
IV-b started with +167 CORE and +226 parser-cluster sequence debt, plus
III-c1's separately tracked +54 parser-cluster drift. It measured +308 CORE
and +345 parser-cluster gzip. IV-a then measured -362 CORE and -338
parser-cluster gzip. It closes the fixed sequence 113 CORE and 287
parser-cluster bytes short of full recovery.

### Omission-closed forward forecast

The first forecast was systematically optimistic. IV-b was forecast at +70 to
+170 and measured +345. The post-IV-b IV-a forecast was -500 to -700, with a
wider plausible range of -450 to -770, and measured -338. Both errors favored
the campaign.

The two misses share one mechanism. The model priced named declaration
deletions and treated the replacement semantics as small scalar glue. IV-b
instead distributed validity, diagnostics, and lifecycle state across five
retained surfaces. IV-a deleted the legacy resolver helpers, but the current
`directStyle` module marginal is 4 bytes larger than IV-b: the new
`resolveClauseChain` is 1,175 marginal gzip and `directStyleHandler` remains
237, offsetting the deleted 450-byte `getCondition`, 158-byte container helper,
112-byte group helper, 109-byte state helper, 136-byte selector table, and
77-byte segment emitter. Those declaration rows overlap and are not added.
They show that code moved into the retained implementation rather than
disappearing. The measurable reduction came from the tooling-shaped
`clausePrecedence` module leaving the app graph (-504 marginal) and a smaller
`clauseIdentity` contribution (-147), while `scanFlatValue` grew 124 and the
packed state tables grew 93. The hypothesis is therefore supported: the prior
model priced gross removals reasonably and underpriced the retained plumbing
that must replace them.

The corrected forecast gives no credit for code motion. It counts only work
that can actually disappear after its behavior moves:

| checkpoint or sequence | corrected parser-cluster movement | basis |
| --- | ---: | --- |
| IV-b | actual +345 | distributed segment-validity and partial-result semantics |
| IV-a | actual -338 | precedence/tooling deletion offset by the retained resolver and state tables |
| IV-c | -70 to 0 | contributor, join, visitor, and collector glue can disappear; parsing, warning, and emission behavior stays in the pipeline |
| V-a through V-e net | -90 to -20 | the conditional propMapper handler and offset collection disappear, but validation, the user-code boundary, re-resolution, and traversal move into the main pass |
| VI-a/VI-b net | -90 to -20 | the lifecycle prepass disappears, while lifecycle flags, provisional presence state, and transfer into the main pass remain |

From IV-a's measured 4,707, the corrected post-V-e endpoint is **4,547 to
4,687** and the post-VI endpoint is **4,457 to 4,667**. The earlier 4,230 to
3,550 endpoint is superseded. Even the favorable endpoint remains 3,457 above
the <=1,000 gate and 3,657 above the 800 target. Confidence is low to medium,
but the correction now assumes replacement code costs most of the gross
deletion instead of assuming it is nearly free.

The IV-a recovery sequence closes as **missed** with the exact shortfalls in
the ledgers above; the recovery point may not slide to IV-c. No new over-cap
sequence debt may open while that missed recovery remains outstanding, and
unrelated bytes may not be golfed to manufacture a pass. The owner decides
whether IV-c through VI is worth continuing against the corrected endpoint.

IV-b measured whole 104,450 / CORE 40,338 and cluster whole 104,345 /
parser-cluster union 5,045. Its +308 CORE and +345 cluster movement exceeded
the cluster forecast by 175 bytes at the high end. The first IV-b cluster
receipt was invalid: the checkpoint existed in a 68-selector manifest and
reported 4,515 because it could not see seven declarations already identified
by the closure audit. The receipt itself omitted all seven. Restoring the
75-selector manifest changed the same artifact to 5,045, and a second fresh
artifact reproduced 5,045 exactly. All nine historical artifacts then
revalidated at 4,706, 4,414, 4,414, 4,420, 4,420, 4,474, 5,139, 4,700, and
5,045. The flattering 4,515 result is void.

The miss came from work that the +70 to +170 forecast treated as one scalar
validity flag but that crosses five retained parser surfaces. The two fresh
IV-b artifacts are byte-identical to their repeats. Both the cluster and CORE
artifacts attribute their nonadditive marginal movement to the same centers:
`directStyle` +185 cluster marginal, `scanFlatValue` +105,
`clauseIdentity` +43, `propMapper` +34, and `useComponentState` +11. At the
declaration level, `directStyleHandler` moved 80 to 245, `scanFlatValue` 454
to 565, `clauseIdentityScanner` 210 to 260, and `propMapperHandler` 44 to 79.
These rows explain location, not the 345-byte union by addition.

Two parts of that cost remain after IV-a: the lexer must own error ranges at
ordinary and EOF word boundaries, and partial validity must reach identity,
tooling, variant, and lifecycle consumers. The largest part is a temporary
collect-then-emit bridge in `directStyle`. Whole-value refusal still needs the
old resolved condition collection, while IV-b adds per-clause refusal,
first-refusal state, chain counts, and the exact `16:9` ratio exception. IV-a
removes that collector when it streams each validated clause through the new
resolver. This dominant single cost follows directly from the bound
III-d -> IV-b -> IV-a sequence and is scheduled for deletion at the next
checkpoint. It is not unexplained structural drift.

Before implementation, the revised IV-a expectation was **-500 to -700
parser-cluster gzip**, with a wider plausible range of -450 to -770 and
low-to-medium confidence. It measured -338, 112 bytes worse than the plausible
low end, and missed its fixed 625-byte obligation by 287. That second
same-direction forecast miss is what required the corrected forward model
above.

The honest campaign headline at IV-a is unchanged by its separate semantic and
correctness gains: **the parser cluster is 4,707 against its 4,706 baseline,
and CORE is 39,976 against its 39,938 baseline. Across the six measured
consolidation movements, both size ledgers are net zero.**

### Phase III: grammar and render-path cleanup (nine checkpoints)

- **III-a, lexer signature.** The context-passing API, all drivers converted
  mechanically, no semantic change. Verify: parserAgreement unchanged, flat
  value suites, package builds.
- **III-b, shared identity reduction.** Land the reduction; `parseValue`
  consumes it; the `mergeVariants` sink replaces `mergeFlatValues`'s
  `parseValue`+`mergeProgramValues` use. Verify: mergeVariants and styled
  inheritance suites, clause-merge pins including malformed values, aliases,
  duplicates, reordered sets, group spellings; parserAgreement. This
  checkpoint records +48 CORE structural debt, recoverable only by III-d.
- **III-c0a, executable container-size invariant.** A declared container size
  must also name a registered media query. Land row 6 and its registry
  diagnostic pin by itself, before runtime normalization.
- **III-c0b, group lifecycle contract.** Stop registry binding for
  `group-enter`, `group-exit`, `group-starting`, and `group-ending`, while
  retaining standalone lifecycle modifiers. Land the parser/runtime refusal
  pin by itself and record the real cross-platform feature as follow-up work.
- **III-c0c, reserved group prefix.** Refuse configured media, theme, custom
  platform, and container-size names beginning `group-` with a diagnostic that
  names the reserved prefix and tells the user to rename the configured name. Convert
  every prior collision test to assert both refusal and the exact diagnostic;
  retain the config-independent alias pins in merging, program identity, and
  class naming. The committed-tree dependency sweep above is part of the
  checkpoint receipt.
- **III-c0d, dead fallback Proxy.** Delete the static-only `fallbackProps`
  get-only Proxy and its public `SplitStyleProps` field after the compiler-path
  search proves there is no producer, fixture, or consumer. Measure the frozen
  bundle, but do not retain dead code when production DCE makes the delta zero.
- **III-c1, runtime normalization.** Change `directStyle.getCondition` only for
  the runtime half of row 2 and rows 1, 3, 4, 5, and 7 in the enumerated table
  above, one failing-before/passing-after pin per row. Invalid configured
  `group-` names are ignored after their diagnostic, so valid authored group
  clauses retain their config-independent group meaning. Identifiers become
  strict, only size media have `@` forms, platform wins its reserved collision,
  and prototype spellings cannot throw. Registry record iteration becomes
  own-only at the same behavior boundary. No shared table or invalidation lands here.
  Behavior changes only in the enumerated rows and CORE does not regress. Its
  +55 parser-cluster movement is debt assigned to IV-a, where the legacy
  resolver, precedence, and set-key wiring is removed. Row
  1 remains cheap to flip if the owner rejects the coordinator's provisional
  platform-first ruling.
- **III-c2, compiled vocabulary.** Land the table plus revision invalidation;
  `getCondition` classifies through it without another behavior change
  (precedence and set-key still come from the existing modules). Verify: full
  condition matrix, the warmed-table `addTheme` runtime test, a warmed
  `<ThemeUpdate>` cache followed by `addTheme`, a live media update proving
  query text and precedence both refresh, a nested config-getter update proving
  the outer compile cannot republish stale state, and parserAgreement. The
  measured intermediate state is whole 104,653 / CORE 40,550 and cluster whole
  104,506 / union 4,638. Its +639 CORE and +627 cluster movement is predeclared
  sequence debt assigned first to III-d and then to IV-a, under the sequence
  rule and forecast above.
- **III-d, package surface.** Runtime/tooling entry split, enforced through
  package exports plus a build-graph assertion (never a source-string test);
  `parseValue`, `mergeProgramValues`, the legacy registry builder, completion
  trie, source-span and diagnostic-message formatters, and tooling-only
  vocabulary projections out of the app graph. The runtime graph retains one
  compiled modifier vocabulary and its scalar refusal codes, without carrying
  editor completion, source-span, or message-construction shapes. Measure this
  now that each semantic owner exists. Verify: the compiler fixture builds
  against the tooling surface, app builds, and CORE. It must recover the +48
  III-b structural-debt ledger or report a checkpoint miss; unrelated byte
  reductions do not count as recovery. Measured result: whole 104,142 / CORE
  40,030 and cluster whole 104,000 / union 4,198. The scoped split recovers
  III-b and beats the declared III-d forecast, so the bound IV-b prerequisite
  may proceed before IV-a.

Pool rows (indicative): valueParser, programs, mergeFlatValues, states,
stateModifiers, modifierRegistry, grammar config.

### Phase IV: resolver and pipeline (four checkpoints)

- **IV-b, per-clause refusal.** The semantics flip in style AND variant paths
  in this one commit; `parseValue` partial results; `parserAgreement`
  repinned; the settled refusal cases (good clauses before and after a bad
  one, bad base with surviving clauses, empty payload, enter beside a bad
  clause, unterminated constructs, `aspectRatio="16:9"`, a good enter clause
  beside a bad one still sets `hasEnterStyle`, and the committed D7 lifecycle
  control remains true). This checkpoint runs before
  IV-a. Whole-value refusal requires resolved condition state to survive from
  `scanFlatValue.chain()` until a later payload segment, which is exactly the
  heap state IV-a must delete. Per-clause refusal lets the lexer retain only
  numeric chain offsets and resolve once when that clause's payload closes.
- **IV-a, resolver equivalence.** This checkpoint depends on IV-b and preserves
  IV-b's newly settled refusal behavior. `resolveClauseChain` replaces
  `getCondition`'s internals plus the precedence/set-key module calls;
  `Condition` is replaced by condition arguments and numeric-offset
  re-derivation. The direct string path resolves and emits each accepted clause
  when its payload closes, so no resolved condition crosses a callback and no
  authored state source is read twice. Verify: the entire condition matrix
  (media, platform, theme, group, container, states, precedence, nesting),
  unbounded-chain and duplicate tests, the nested-clause condition probe,
  emitter parity. Measured result: whole 104,081 / CORE 39,976 and cluster
  whole 103,947 / 78-selector union 4,707. Against IV-b this is -362 CORE and
  -338 cluster. The fixed recovery sequence closes as missed by 113 CORE and
  287 cluster bytes. Assembled review also fixed two shipping correctness
  defects with red runtime pins: `enter:red` could be misread as a theme on iOS
  and produce a dynamic-theme object, and `@hover` could execute as a container
  when a size-query media entry was shadowed by the reserved `hover` state even
  though the authoritative registry rejected that form. The first fix carries
  the already-resolved theme scalar through emission; the second reuses the
  existing compiled lookup. Neither adds an allocation, loop, or config read.
- **IV-c, remaining streaming and folding.** The remaining collect arrays and
  per-value visitors are deleted; `contributeVariantClauseValue` and
  `contributeFrontendValue` folded into the pipeline. Verify: group and
  container clause output PLUS subscription updates (groupNotifications,
  mediaKeyedSubscriptions, GroupProp, GroupUseCases, GroupPressInVariant, and
  the group/container cases in the getSplitStyles suites; a lost subscription
  key renders once and silently stops updating), transform family, border,
  shadow, transition, token category, safe area, dynamic iOS theme color,
  lifecycle resting values, SSR.
- **IV-d, single fold points.** One shorthand-fold point and one
  string-to-number coercion point, moved only while emission parity stays
  green. Verify: emitter parity, shorthand suites.

### Phase V: variant absorption (five checkpoints)

- **V-a, static variant values** traversed in place; resolver key metadata
  compiled at `styled()`; read timing preserved. Verify: variant resolver,
  spread variant, authored-order suites.
- **V-b, functional variants.** Direct call, in-place result traversal,
  fontFamily pre-read with read-count probe, `extras.props` as the real
  merged record. Verify: production functional-variant paths (Button,
  SizableText, Input, Slider, Tabs), the functional-variant and
  variant-result probes.
- **V-c, tokenLookup deletion.** `tokenVariable` folds into
  `configuredValue`, the singleton becomes locals, no carrier object. Verify:
  token category, shorthand variable, styled-context token suites, the
  Variable `.get` and authored `toString` probes.
- **V-d, theme-tracking migration.** Engine raw-theme reads recording into
  the frame-carried stable tracking refs; the per-instance tracking views
  replacing the shared-proxy globals land here or, if p28878's ownership of
  those files is still live, split behind their handoff while the engine
  half proceeds. Verify: theme subscription suites, dynamic iOS theme color,
  the theme-read probes, useTheme tracking behavior.
- **V-e, conditional variant direct emission.** The last parser driver is
  removed; `appendFlatClause` remains only for HOC pass-down; native `unset`
  pins; the engine stops importing `propMapper`, leaving a tree-shakeable
  shell only where an export is public API. Verify: conditional variant
  values, HOC/asChild and parent merge suites, native unset, the
  nested-conditional-variant probe.

### THE MAKE-OR-BREAK GATE (after V-e)

Three conditions are measured with the frozen fixture and full rebuild.
Conditions 1 and 3 are hard stops. Condition 2 remains the owner's unchanged
target and is reported, but its miss alone does not stop the campaign because
the corrected ruler proved it unreachable before implementation began.

1. **CORE at or below CORE_noarena minus 2,000 AND at or below CORE_base
   minus 2,000.** Both anchors, so passing cannot mean "recovered our own
   regression" (CORE_noarena is the same tree without 1a) and cannot mean
   "beat only a stale ruler". For planning context only (non-additive, never
   acceptance): the pre-FlatFrame union control measured 39,938, so the gate
   is expected to sit near 37,900 in the union frame; the binding numbers are
   the two anchors recorded at Phase I.
2. **The parser cluster (lexer + identity reduction + resolver + merge sink),
   attributed as one union, at or below 1,000 gzip**, target 800, reported
   either way. This is the owner's "one parser, around 800" stated directly.
   The target is not lowered or translated. Missing it is non-stopping under
   the coordinator's provisional binding; the owner may reinstate the stop.
3. The runtime matrix (run-benchmarks, fixed seed, v2 same-run control) shows
   no broad scenario regression beyond paired noise, and the flat-scenario
   hot-path profile shows the removed visitor/condition/array/propMapper
   frames absent with a clear CPU and allocation reduction.

Condition 1 or 3 failing stops implementation: no further phases, no
compensating golf. A condition 2 miss is reported with exact residual
attribution but does not stop by itself. A stopping failure's deliverable is
exact residual attribution (module and declaration level, against CORE_v2)
plus a written account of which pools moved and which did not, to p28302 and
the owner. The same stop applies mid-phase if any checkpoint lands CORE
positive after its pools were supposed to move.

### Phase VI: component-state discovery and presence (three checkpoints)

Phase VI carries one explicit semantic obligation from IV-b. The committed D7
control (`0 hver:1 enter:2`) remains lifecycle-true through IV-b because the
lifecycle prepass has no config-aware modifier resolver and must not grow a
temporary duplicate. VI-b must remove that divergence when the resolved main
pass replaces the prepass. Its pin changes the same-chain form
`enter:hver:1` from lifecycle-visible to refused while retaining the IV-b case
where a valid `enter:` clause sits beside a different malformed clause.

- **VI-a, flags from the pass.** The main pass records lifecycle, platform
  pseudo, and animation flags while the prepass still runs; an assertion
  compares them for the whole test matrix. No behavior change.
- **VI-b, prepass removal.** `hasFlatModifier`, `lifecycleVisitor`, the scan
  globals, and the runtime `useComponentState` scan are deleted; the pass's
  flags become authoritative; unmounted state stays provisional until the
  pass finishes per the prior plan. Verify: parser lifecycle agreement,
  enter/exit suites, hydration, SSR.
- **VI-c, presence wiring.** Direct unconditional `usePresence` from the
  package root, internally unconditional effect, registration gated on the
  completed frame's animated flag, unregister on ineligibility. Verify:
  ResetPresence null/non-null toggles without hook-order change, the
  non-animated-descendant unmount case (must not delete an animated sibling's
  registration or complete its exit), the built-artifact single-
  PresenceContext proof, the direct Tamagui animated-value test, animation
  driver hook order, animatedBy switching, no-rerender emitter tests,
  platform-driver hover apply/revert, and the wide-subtree presence-flip
  benchmark (rejected on material regression beyond paired noise). A silent
  subscription failure and a duplicated context never share a checkpoint with
  the prepass work.

### Phase VII: legitimate remaining seams (reduced scope)

Only the two targets the counterpart audit did not exempt, plus hygiene:

- one prop-to-token-category representation (`web/helpers/tokenCategories`
  stops re-deriving maps from the helpers tables at module load; the raw
  helpers tables stay for `validStyleProps`);
- the frontend scalar-candidate integration removing
  `STYLE_FRONTEND_PREPROCESSED` and the second props object, with core owning
  the one className traversal;
- deletion of dead exports, forwarding shells, and duplicate types;
- the residual audit of `insertStyleRule` and `getCSSStylesAtomic` deltas,
  for ATTRIBUTION in the final report only.

Verify: the full behavior inventory
(`plans/getSplitStyles-behavior-inventory.md`), Tailwind frontend
round-trip/config-aware/adversarial suites web and native, RNW `$$css`,
frozen parent, zero-runtime fixture (once its separately owned animations
failure is resolved), package builds. Revision 1's Phase 5 forecast is
withdrawn; this phase's expected CORE move is a few hundred bytes and is not
load-bearing for acceptance.

## Acceptance

**Acceptance is CORE at or below CEILING = 30,000**, with CORE_v2 = 30,521
recorded beside it as the parity anchor. This plan asserts no conversion from
the old row-sum frame.

Recommendation, stated as a recommendation: the phase pools credibly sum
(planning context only; rows and phases do not add under gzip) to roughly
2,500-4,500 of CORE movement, which likely leaves the assembled engine above
the ceiling, because the variables win the earlier estimate leaned on was
already inside the baseline. If the gate passes and the endpoint is still
above the bound ceiling, the deliverable is exact residual attribution
against CORE_v2, per module and declaration, separating (a) rows the record
classifies as capability, (b) anything
unexplained, and the owner decides which capability or target changes. At no
point does the plan claim the ceiling was reached unless CORE says so.

## Measurement

At Phase I and after every checkpoint, from a clean tree with a full root
`bun run build`:

```sh
cd code/comparisons/tamagui-bench && npx vite build --mode size --sourcemap --outDir /tmp/v3-consol-N   # fresh dir every time
cd ../tamagui-v2-bench && npx vite build --mode size --sourcemap --outDir /tmp/v2-consol-N              # rebuilt whenever the fixture or deps change
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-consol-N --core                       # CORE (union metric, new mode)
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v2-consol-N --core                       # CORE_v2
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-consol-N --against=/tmp/v2-consol-N --filter=@tamagui/   # attribution only
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-consol-N --within='directStyle'       # plus getSplitStyles during IV-V
cd code/comparisons/tamagui-bench && bun run build:cluster --sourcemap --outDir /tmp/v3-cluster-N
bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3-cluster-N --parser-cluster=<checkpoint-name>
```

No EXTRACT build substitutes for the runtime arm. Runtime and allocation
measurement uses the prior plan's procedure: `run-benchmarks.ts` with fixed
seed and v2 as same-run control at Phase I, the gate, and Phase VII;
`profile-hotpath.ts` on the flat scenario (which lives in the performance
workload, contains string clauses, a clause-bearing variant, an enter clause,
a compound, and a rerender, with `--verify-workload` proving v2/v3 sources
identical) plus heavy and animated as negative controls; the presence
wide-subtree flip lands in the animated matrix before VI-c merges. Bundle
size alone accepts nothing; before each commit the diff is read specifically
for per-call allocation, added loops, and double reads, because the parity
suites cannot catch them.

## Stop conditions

Stop and report the exact protected behavior if: the sole style traversal
cannot preserve `_animation` without replaying authored input; presence
cannot resolve to one context instance across core and every driver;
deterministic later-same-priority CSS requires rereading an authored value;
the frontend cannot expose scalar candidates without a second className
traversal; reentrancy can leave a stale binding; the compiled
vocabulary cannot be made revision-correct on one path; a behavior-inventory
pin fails because of the consolidation. Never respond to a stop condition
with a cache, flag, second parser, fallback path, Proxy, or conservative
all-inline mode. Tests only ever get stricter: no timeout raises, no retry
wrappers, no loosened assertions, no source-string assertions.

## Still open for sequencing

1. Whether p28878's ownership of `useThemeState.ts`/`getThemeProxied.ts` is
   still live, which sequences the per-instance tracking-view half of the
   theme work.
