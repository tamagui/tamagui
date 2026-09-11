# Review: `v3-web-style-engine-one-pass.md`

Date: 2026-08-27

Reviewed against the current source on `v3-beta`, the two predecessor plans
([`v3-single-pass.md`](../v3-single-pass.md),
[`v3-engine-consolidation.md`](../v3-engine-consolidation.md)), the prior review
([`v3-engine-consolidation-review.md`](../v3-engine-consolidation-review.md)),
and the checked-in receipts in `code/comparisons/`. Every claim below was
checked against the code or a retained receipt, not against the plan's prose.

## Verdict

The direction is right and about half the plan is already true of the code
today. The problem is that it gates a **byte** thesis on a **time** mechanism,
and the two are not connected. Merging passes buys time. Bytes only come out
when a feature's code is deleted or made compiler-only. As written, checkpoint
6's 3,000-byte gate will fail after five checkpoints of work, and the plan has
no bottom-up budget that would have predicted that.

## 1. The byte thesis contradicts a receipt already in the repo

**READ** `code/comparisons/V3_BETA_MEASUREMENT_STATE.md`, independently
re-verified by a second session on 2026-08-22:

> "Replacing the rest of `getSplitStyles` with `directStyle` cannot remove bytes
> without removing those component semantics. Moving the same splitter code into
> `directStyle` only changes its module name."

The plan's "One home" section proposes exactly that move in the opposite
direction and expects bytes from it. Fusing `getSplitStyles.tsx` (1,838 lines) +
`directStyle.ts` (2,294) + `propMapper.ts` (721) produces a roughly 4,800-line
file and roughly the same gzip.

The arithmetic the plan never states: `View` 34,004 -> 25,000 means **9,004
bytes must leave the engine**, and the nucleus target of 3,000 implies today's
engine-in-`View` is about 12,000. So the gate is "delete 75% of the style
engine." That may be achievable, but not by relocation. It needs a line-item
deletion budget:

| family | where | current marginal | forecast |
| --- | --- | ---: | ---: |
| two transform mergers | `directStyle.ts:1584`, `getSplitStyles.tsx:1529` | ? | ? |
| duplicate refusal block | `directStyle.ts:1997` and `:2160` | ? | ? |
| `fixStyles` / `styleToCSS` / `normalizeStyle` residual | helpers | under 2,000 rendered (already measured) | ? |
| duplicate token-category tables | `tokenCategories.ts` + propMapper | ? | ? |
| `hasFlatModifier` prepass | `useComponentState.ts` | ? | ? |

**Build this table in checkpoint 0 using the declaration marginals the plan
currently relegates to "diagnosis only."** If the column sums to 4,000 and the
gate is 9,004, you know before writing code that the gate is wrong rather than
the implementation.

## 2. Several "current state" descriptions are stale or wrong

This matters because whole checkpoints are scoped against them.

**The object adapter already exists, exactly as specified.**
`directStyle.ts:2084-2093` is the discriminator the plan proposes (`default`
key, else first key against the clause grammar). `directStyle.ts:2243-2261` is
the `typeof value === 'string' ? scan : for-in` shape from the plan's own code
block. `contributeStyleObject` feeds `resolveClauseChain`, the same sink as
strings, with no prefixed-key reconstruction and no intermediate style object.
The section "Objects are a 250-byte input adapter" is a rename request, and its
250-byte gate is probably already green. The only genuinely object-specific code
is the shadow/legacy-transform refusal block duplicated from
`directStyle.ts:1997`, and the `implicitLifecycleBase` fallback at `:2193`.

**`normalizeStyle` has no transform merging.** The plan lists five transform
systems to replace; `rg transform code/core/web/src/helpers/normalizeStyle.ts`
returns nothing. Two exist (`directStyle.ts:1584`, `getSplitStyles.tsx:1529`).

**The stale-modifier-table problem is already solved.** `resolveClauseChain`
opens with `getConfigRevisionState(state.conf)` (`directStyle.ts:406`). The plan
re-litigates a resolved item from the prior review.

**`TAMAGUI_DID_OUTPUT_CSS` guards already exist** in `insertStyleRule.tsx`,
`createDesignSystem.ts`, `getThemeCSSRules.ts`, `registerCSSVariable.ts`,
`insertFont.ts`, and `createTamagui.ts`.

**Strict compiled mode is largely already proven.** The retained receipt shows
the compiled arm at 14/14 flattened, zero bailouts, with `getSplitStyles`,
`createComponent`, and `propMapper` entirely absent and `directStyle` down to
**50 marginal gzip for `platformMatches` only**. Checkpoint 7's first bullet is
a regression pin rather than a work item.

**The measurement infrastructure exists.** `attribute-bundle-gzip.ts` already
has `--core` one-union mode and `--parser-cluster=<checkpoint>` against
`parser-cluster-manifest.json` (78 selectors, 10 declared checkpoints, with a
`movedTo` field that specifically defeats hiding bytes by relocation). "Freeze
the ruler first" should read "add a `web-one-pass-*` checkpoint chain to the
existing manifest," which is an afternoon rather than a phase.

## 3. The baseline table has no provenance

`34,004`, `35,650`, `6,085`, `4,525`, `12,742`, `21,639`, `848`, and `1,735`
appear nowhere else in the repo. There is no StyleX fixture in
`code/comparisons` at all. The plan demands "commit, Bun and Node versions,
platform, minifier, environment constants, fixture hash, warmups, sample count,
median, dispersion" from every future receipt, then opens with eight numbers
that have none of that, measured on a ruler the plan says still has to be built.
Either attach the exact command and commit, or move the table after checkpoint 0
and mark it provisional.

Same for timing. `GET_SPLIT_STYLES_BENCHMARK.md` records clause strings at
9,469.9 (same-tree control) and 7,868.8 (candidate); the plan says 9,566.4. That
doc also warns explicitly: "Host-wide timing changed substantially between the
two runs, so the raw change does not isolate the code change." **A 5x gate
against a frozen number in a markdown file is the exact failure that doc warns
about.** Make the gate a same-run paired control, old and new measured in one
session on one machine, or it means nothing.

## 4. Internal contradictions

- **Checkpoint 6 fuses everything into one file; checkpoint 7 splits at module
  boundaries so web bundlers can drop native code.** You cannot do both. The
  resolution is already in the repo: the receipt notes "Rolldown folds `isWeb`
  through `directStyle`," so use `process.env.TAMAGUI_TARGET` constant folding
  and say so instead of promising module boundaries.
- **"CSS rule generation, hashing, insertion... must disappear" under
  `TAMAGUI_DID_OUTPUT_CSS`, but mode 2 "keeps dynamic Tamagui behavior."** A
  runtime-computed `width={n}` needs either an inline style or a hashed atomic
  class plus an inserted rule. If hashing and insertion are gone, mode 2 must
  route every unproven value inline. That is a real behavior decision the plan
  does not state. State it.
- **The stop conditions forbid a "cache," but a measured atomic identity cache
  is already retained** for a 29.7% allocation reduction with negative controls.
  Narrow that clause to "no fallback or dual-path cache," or the plan forbids
  shipped code.
- **The stop conditions say the union gzip must decrease at checkpoint 2**, and
  checkpoint 2 is mostly already implemented. The plan will halt itself on its
  first engine commit.
- **"Fixed numeric slots for the existing maximum of five non-platform
  conditions"** re-introduces the design the prior review killed twice. A
  conditional variant `sm:$v` returning `{ color: 'hover:red' }` evaluates the
  inner clause while the outer condition is still live on the same frame.
  Revision 3 of the prior plan resolved this with primitive call-stack locals
  plus re-derivation after the user-code return. The new plan says re-derivation
  is allowed, then specifies slots anyway. Say "call-stack primitives"
  explicitly.

## 5. Things that will bite during implementation

**Transform order is a visible breaking change and the two paths already
disagree.** `directStyle.ts:1589` sorts *all* authored keys alphabetically
(`rotate, scale, x, y`). `getSplitStyles.tsx:1531-1561` uses a fixed head
(`x, y, rotate, scale`) then alphabetical for the rest. Transform composition is
not commutative, so web-class and native/inline output already render
differently for the same input. "Flat transform parts use fixed canonical order"
picks one and changes the other. Name the winning order, call it a breaking
change, and pin it with a rendered assertion rather than a snapshot.

**`group` -> container removal breaks `@sm/name:` clauses that target a group.**
`getSplitStyles.tsx:756-771` emits `container-name: ${valInit}` for
`group="card"`, so `@sm/card:` resolves against it today. Checkpoint 1 needs a
diagnostic or codemod and a migration line, not just "update tests."

**The conditional-objects benchmark scenario has 14 elements.** Per
`GET_SPLIT_STYLES_BENCHMARK.md`. That is too small to gate anything. Also worth
noting: at 8.00 props/op and 6,211 ns/op, objects cost about 776 ns/prop against
about 1,734 ns/prop for clause strings. **Objects are already the cheap path.**
The plan spends its most prominent design section defending them. Delete that
framing and point the effort at strings.

**A six-condition chain throws at render.** `clausePrecedence.ts:160-164` throws
when depth exceeds `grammarMaxNonPlatformDepth = 5`. Fixed slots are sound
today, but a production `throw` in the style path deserves a line in the plan.

## 6. The plan's biggest missing speed idea

Before committing to the fusion, run one experiment: **intern authored strings
to compiled clause programs**, keyed by the string plus the config revision that
`getConfigRevisionState` already provides. Real apps re-author the same literals
on every instance and every render. Today `resolveClauseChain` re-walks the
modifier prefix, rebuilds `key`, `selector`, and `theme`, and allocates a
`wrappers` array per clause, per call, forever (`directStyle.ts:408-421`). A hit
turns all of that into one map lookup. That is how the fast Tailwind runtimes
get their numbers, and it plausibly delivers the 5x on its own for a few hundred
bytes.

The plan's stop conditions currently ban it. If interning gets the time, the
fusion's scope collapses to bytes only and the campaign gets much shorter. If it
does not, you have learned that cheaply. **Measure this in checkpoint 0.**

Second experiment, same slot: **decompose the fixed per-call overhead.** Add
0-prop and 1-prop scenarios to the corpus and solve for `F`. Plain props are
2,480 ns/op at 2.28 props/op. If `F` is around 1,500, then 1,914 ns/op for a
5.46-prop clause scenario needs the clause work itself to get roughly 19x faster
and the target is arithmetically dead. This is one hour of work that validates
or kills the headline gate.

Three smaller wins the plan under-sells or misses:

- **The transform re-emit is quadratic.** `directStyle.ts:1584-1601` runs
  `Object.keys().sort().map()` and re-emits the whole `transform` property on
  *every* transform part contribution. Three transform props do six sorts and
  three full re-emissions. Name this; it is the clearest single time win in the
  document.
- **Conditional objects resolve their first key twice.**
  `isConditionalStyleObject` calls `resolveClauseChain` for classification
  (`:2090`), then the loop calls it again with the payload (`:2177`). Return the
  classification from the first call.
- **`hasFlatModifier` in `useComponentState.ts` is a third walk** over every
  string prop before the engine starts. The plan removes it in checkpoint 5,
  which is late. It is independent of everything else and could land first.

## 7. Make the plan smaller: 9 checkpoints to 5

Nine checkpoints each carrying a full measurement ritual is most of the cost.
Proposed collapse:

- **0. Ruler and budget.** Add the `web-one-pass-*` chain to the existing
  manifest. Build the deletion budget table. Run the interning and
  fixed-overhead experiments. Re-derive the baseline table with provenance. No
  engine code.
- **1. Group/container split.** Unchanged, plus a migration diagnostic.
  Independent, lands immediately.
- **2. Cheap independent wins, one commit each, no fusion.** Transform
  accumulator. `hasFlatModifier` deletion. Duplicate refusal block. Double
  object resolve. These are small, separately bisectable, and deliver most of
  the measurable time win before any risky restructuring.
- **3. Fuse the sink and absorb variants and compounds.** Old checkpoints 2, 3,
  and 4. The object adapter work is already done; say so.
- **4. Lifecycle, output completion, deletion of seams.** Old 5 and 6.

Old checkpoint 7 becomes a regression pin plus the 50-byte `platformMatches`
move. Old checkpoint 8 is a separate campaign: it is theme and provider work, it
does not share a failure mode with the style engine, and bundling it here lets a
provider win hide an engine miss, which the plan itself warns against on line
42.

## 8. Missing sections

- **Compiler/runtime lockstep.** Any change to atomic class identity, transform
  order, or clause precedence must change identically in the compiler, or mixed
  compiled/runtime apps get hydration mismatches and a wrong cascade. The plan
  mentions agreement only in checkpoint 1. `parserAgreement.web.test.tsx` and
  `code/comparisons/conformance` should be named as required at checkpoints 3
  and 4 too.
- **What happens when a gate fails.** Every gate currently says "stop." Say who
  decides, and whether the answer is to change the target or the design. The
  prior review had to escalate this twice.
- **Native risk.** This is titled a web plan and the whole engine is shared with
  native. `getSplitStyles.native.test.tsx`, the ios/tvos/androidtv variants, and
  the native benchmark arms should be named per checkpoint rather than folded
  into "no regression in the native matrices."
- **SSR and hydration class-name stability** across the change. One line, but it
  is the failure that ships silently.

## What to keep verbatim

The one-authored-input traversal and its cascade order, the user-code boundary
rule, the presence and lifecycle design, the "delete the path you replace in the
same commit" rule, the stop-condition list with the cache clause narrowed, and
the refusal to answer a miss with a fallback parser. Those are the strongest
parts of the document and they are what the prior two attempts lacked.
