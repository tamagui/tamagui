# V3 engine consolidation: one parser, one emit pipeline

Status: revision 3, after the assigned Codex max critique in
`plans/v3-engine-consolidation-review.md` and p28302's final-pass audit.
Author: Fable session p28910, 2026-08-22. Supersedes the checkpoint sequence
in `plans/v3-single-pass.md` (checkpoints 1c through 4); its settled
decisions, reentrancy findings, and review amendments carry forward and are
restated where they bind this design. p29049 implements from this document.

Phase I bindings, 2026-08-22: with the owner away, coordinator p28302 bound
the two reversible policy choices so the overnight campaign could proceed.
**CEILING is literal CORE <= 30,000. Checkpoint 1a is reverted.** The owner
may override either choice later; no translation from the old row-sum frame
is claimed.

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
module-state exception leave this campaign with 1a; no replacement compound
arena is designed into the consolidation phases.

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

### 3. The compiled vocabulary, with config-revision invalidation

Config installation compiles one flat record covering every non-parameterized
modifier: core states and their aliases, component states, media names, root
theme names, platform names. Each entry carries a packed integer (kind code,
the precedence contribution bits exactly as `packClausePrecedence` lays them
out, lifecycle and unsupported-on-native bits, an active-source id, and a
small numeric id used for duplicate detection) plus the selector fragment or
wrapper string it contributes.

Staleness is handled by one defined path, not a fallback: the config carries a
monotonic revision that `updateConfig` bumps (READ:
`_mutateTheme.ts:136-139` assigns into `config.themes` and calls
`updateConfig('themes', ...)`, and the config object identity does not
change), and every table lookup goes through an accessor that rebuilds the
table when the stored revision is stale. A runtime test builds the table,
calls `addTheme({ name: 'brand', ... })` on the live config, then renders a
`brand:` clause and asserts it resolves; `parserAgreement` over a static
config cannot catch this class.

The table replaces, in the runtime graph: `stateSelectors`, the
classification if-chain in `getCondition`, `canonicalClauseModifier` calls,
`createClausePrecedenceOrder`, `withinCategoryRank`, the `states.ts` retention
chain, and the `modifierRegistry` parse helpers. The builder lives in the
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
gaining the partial result beside diagnostics; there stays exactly one parser
result shape. The `aspectRatio="16:9"` carve-out, the lifecycle-only
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
records CORE, CORE_v2, whole totals, and its pool rows. Pool rows are named
against the rebaseline attribution (revision 1's absolute row figures predate
the revert and integration and are indicative only). Gzip rows are not
additive; the gate is always CORE. A pool row disappearing while CORE stays
flat is a miss to report, not absorb.

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

### Phase III: grammar (four checkpoints)

- **III-a, lexer signature.** The context-passing API, all drivers converted
  mechanically, no semantic change. Verify: parserAgreement unchanged, flat
  value suites, package builds.
- **III-b, shared identity reduction.** Land the reduction; `parseValue`
  consumes it; the `mergeVariants` sink replaces `mergeFlatValues`'s
  `parseValue`+`mergeProgramValues` use. Verify: mergeVariants and styled
  inheritance suites, clause-merge pins including malformed values, aliases,
  duplicates, reordered sets, group spellings; parserAgreement.
- **III-c, compiled vocabulary.** The table plus revision invalidation;
  `getCondition` classifies through it with outward behavior UNCHANGED
  (precedence and set-key still computed by the existing modules this
  checkpoint). Verify: full condition matrix, the addTheme runtime test,
  parserAgreement.
- **III-d, package surface.** Runtime/tooling entry split, enforced through
  package exports plus a build-graph assertion (never a source-string test);
  `parseValue`, `mergeProgramValues`, registry builder, trie, and diagnostics
  out of the app graph; measured now that each semantic owner exists. Verify:
  compiler fixture builds against the tooling surface, app builds, CORE.

Pool rows (indicative): valueParser, programs, mergeFlatValues, states,
stateModifiers, modifierRegistry, grammar config.

### Phase IV: resolver and pipeline (four checkpoints)

- **IV-a, resolver equivalence.** `resolveClauseChain` replaces
  `getCondition`'s internals plus the precedence/set-key module calls, with
  UNCHANGED refusal semantics and behavior; `Condition` replaced by condition
  arguments and offset re-derivation. Verify: the entire condition matrix
  (media, platform, theme, group, container, states, precedence, nesting),
  unbounded-chain and duplicate tests, the nested-clause condition probe,
  emitter parity.
- **IV-b, per-clause refusal.** The semantics flip in style AND variant paths
  in this one commit; `parseValue` partial results; `parserAgreement`
  repinned; the settled refusal cases (good clauses before and after a bad
  one, bad base with surviving clauses, empty payload, enter beside a bad
  clause, unterminated constructs, `aspectRatio="16:9"`, a good enter clause
  beside a bad one still sets `hasEnterStyle`).
- **IV-c, streaming and folding.** Streaming emission; collect arrays and
  per-value visitors deleted; `contributeVariantClauseValue` and
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

Three conditions, all required, measured with the frozen fixture and full
rebuild:

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
3. The runtime matrix (run-benchmarks, fixed seed, v2 same-run control) shows
   no broad scenario regression beyond paired noise, and the flat-scenario
   hot-path profile shows the removed visitor/condition/array/propMapper
   frames absent with a clear CPU and allocation reduction.

Any condition failing stops implementation: no further phases, no
compensating golf. The deliverable becomes exact residual attribution (module
and declaration level, against CORE_v2) plus a written account of which pools
moved and which did not, to p28302 and the owner. The same stop applies
mid-phase if any checkpoint lands CORE positive after its pools were supposed
to move.

### Phase VI: component-state discovery and presence (three checkpoints)

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
