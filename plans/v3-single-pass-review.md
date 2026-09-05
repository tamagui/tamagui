# Design review: v3-single-pass.md

Reviewer: Fable session p28910-assigned design-boundary review, 2026-08-22.
Read the plan cold and in full, then verified its claims against source at
`99fba89f0c` in this worktree. Every claim below is labeled. This review is a
message, not a plan edit.

Verdict up front: the plan is strong. The arena design, the ledger discipline,
and the checkpoint structure are better than what usually reaches this stage.
But I found one genuine fourth wall the plan has not designed for, one stop
condition that is near-certain to trigger and should be settled now rather than
mid-implementation, and a cluster of unnoticed consequences of settled decision
1 that will break silently if implemented naively. Those three come first.

## Blocker 1 (fourth wall): per-clause condition state has no home across user-code boundaries

The plan bans parsing anything twice, bans per-call objects, and stores frame
scratch as integers in the numeric arena. Those three constraints do not
compose for conditional variant values, and the plan never resolves the
conflict.

**READ** how the current code survives: `propMapper.ts:182-227` scans
`"big sm:$myVariant"`, calls `getCondition` per chain purely as a validity
check, THROWS THE CONDITION AWAY, keeps only the modifier string in a local,
then calls the user's functional variant, and the condition is re-derived later
at emission (`directStyle.ts:1674-1683`, `contributeVariantClauseValue` calls
`getCondition` again). The modifier chain is parsed twice today, and that
second parse is exactly what makes the path reentrancy-safe: nothing resolved
is held across the user call.

Under the plan's rules the implementer must resolve the condition once and hold
it across the functional-variant call. Where?

- Module-level fixed slots: corrupted by reentrancy, the exact failure the
  arena exists to prevent.
- Per-instance frame slots: corrupted by same-frame nesting. A variant result
  can itself contain clause-bearing values (`sm:$v` returning
  `{ color: 'hover:red' }`), so an inner clause is processed while the outer
  clause is still live, inside the same component frame.
- The arena: cannot hold this state. Condition state is partly string-typed.
  The plan itself says exact condition identity uses "the canonical condition
  string" (line 252-257), and "Fixed scalar slots hold canonical modifier
  names" (line 247-248) without ever saying where string-typed slots live. The
  2,048-cell arena is scalar/numeric by design; frames "retain integer offsets
  only".

So the plan's own described design either violates its arena discipline or
violates its one-parse rule, depending on which way the implementer jumps.
This is the kind of wall that gets discovered three weeks in.

Options:

a) Bless a narrow exception: a condition whose clause brackets a user-code
   call (functional variant, getter) may be re-derived from its modifier chain
   after the call returns. This is what the code does today, it is a scan of a
   short modifier chain rather than of the authored value, and the owner's
   directive is aimed at per-render re-parsing of prop values, not at a bounded
   re-derivation at a user-code boundary. Cheapest, proven, smallest bundle.
b) Add a parallel string stack with the same watermark discipline as the
   numeric arena (base/top, restore in finally, index through the module
   binding). Sound, but a second arena to keep disciplined, more code, more
   bytes, and it exists only for this case.

Recommendation: (a), taken to the owner as an explicit amendment to the
one-parse rule before implementation starts. I am not deciding it; I am saying
the plan cannot land as written without deciding it.

## Blocker 2: the `_animation` marker stop condition will trigger; settle it now, not at step 3

The plan (line 306-313) requires an animation-driver style object to carry a
top-level marker replacing `hasAnimatedStyleValue`'s loop, and stops if "no
existing producer can set it without changing user-created style object
semantics".

**READ**: grep of the whole repo finds no producer of `_animation`. The only
consumer is `useComponentState.ts:377-385`, which checks each style VALUE for
an `_animation` key. **INFERRED** from that shape: the values are created by
external animation libraries (Reanimated-style shared values) and embedded by
USERS into style objects they create themselves
(`<View style={{ opacity: sharedValue }} />`). No Tamagui producer ever owns
the containing object, so a top-level marker on the object is set by nobody.
The stop condition's premise is not a risk, it is the actual situation.

Do not let implementation reach step 3, hit this, and stall. Decide now.
Relevant facts for the decision: the check only changes behavior for
web + a driver whose `outputStyle !== 'css'` (`useComponentState.ts:334`), and
`curStateRef.hasAnimated` is sticky anyway. The realistic options are a bounded
top-level-values-only pre-read of `props.style` when present (one small object,
not a traversal of authored props generally), or folding the per-value check
into the style prop's single traversal and accepting that output mode
finalizes at the style prop's position, which needs the same
provisional-until-boundary treatment the plan already grants `unmounted`. The
second conflicts with emissions before the style prop having already chosen a
mode, so it is not obviously sound. This needs the owner, with these facts, at
the design boundary.

## Blocker 3: unnoticed consequences of settled decision 1 (unconditional usePresence)

Not re-litigating the decision. The no-provider path is exactly as the owner
read it (**READ**, `use-presence/src/usePresence.ts`: context read, early
return). The unnoticed consequences are all on the WITH-provider path and in
the mechanics of calling it:

1. **usePresence is internally hook-unsafe as written.** It early-returns
   BEFORE its `React.useEffect` (usePresence.ts, the `if (!context) return`
   precedes `React.useEffect(() => register(id), [])`). Calling it
   unconditionally for every component means every component crashes with a
   hook-order error if its context flips null and non-null across renders,
   which `ResetPresence disable` toggling does
   (PresenceContext.tsx, ResetPresence). The fix is to make usePresence
   internally unconditional (always run the effect, no-op without context).
   That preserves the external contract, but it is a change to the presence
   module the plan does not name.

2. **Universal register() silently kills exit animations.** **READ**,
   `animate-presence/src/PresenceChild.tsx:29,47-50,71-73`: every consumer
   under one PresenceChild registers the SAME id (the PresenceChild's useId),
   and unregister is `presenceChildren.delete(id)`. So the FIRST unmounting
   consumer deletes the shared registration for everyone still mounted, and
   PresenceChild's effect (`!isPresent && !presenceChildren.size &&
   onExitComplete?.()`) then completes exits immediately, skipping the exit
   animation with no error. Today the registering population is only
   `willBeAnimated` components (`useComponentState.ts:164-169`), so the window
   is narrow. Under unconditional presence, ANY conditional render unmounting
   inside any Dialog/Sheet/Popover subtree (a spinner, a list row) arms it.
   This is precisely the silent-breakage class the review was asked to hunt.
   The clean shape: unconditional HOOK, conditional REGISTRATION. The register
   effect runs after render, by which time the completed pass knows whether
   this component is animated, so the effect can register only in that case
   and current registration behavior is preserved exactly. The plan should say
   this; an implementer who "just calls usePresence unconditionally" ships the
   bug.

3. **Which usePresence?** Today the call is driver-relayed
   (`animationDriver?.usePresence?.()`). Unconditional-but-driver-relayed is
   still hook-count-unstable: the driver comes from context, `isStub` exists
   (`useComponentState.ts:103`), and `animatedBy` switches drivers per
   component. Hook safety requires core to call ONE presence hook regardless
   of driver, i.e. a direct import. That also walks straight into this repo's
   known silent failure: a subpath-duplicated React context broke adapted
   sheets with no error. Whichever module ends up owning PresenceContext,
   every driver and core must resolve to the same instance, and the dedupe
   config needs checking. One line in the plan would have prevented a repeat.

4. **Subscription cost.** Every component under a PresenceChild now reads
   PresenceContext, so presence value flips re-render the entire subtree
   through memo boundaries, and with `presenceAffectsLayout` the context value
   is new every render (PresenceChild.tsx:31-61). Dialogs and Sheets wrap
   whole app subtrees in AnimatePresence. This lands in the runtime matrix as
   a diffuse regression if it lands at all; the `animated` benchmark scenario
   should be checked for whether it contains a presence provider over a wide
   subtree, and if not, the flat scenario extension should add one.

## Reentrancy analysis: the proof is sound but proves one member of a class

The probe is a real discriminating observation and the arena conclusion
follows. But functional variants are one of at least six ways user code runs
mid-pass, all of which exist in the current source:

- getters on variant DEFINITION objects: `getVariantDefinition`
  (`propMapper.ts:509-510`) does hasOwnProperty then `variant[value]`; an own
  getter executes on that read;
- getters on variant RESULT objects, which the plan traverses "in place";
- getters on caller props and `style` objects, which the stable props view
  forwards by design;
- getters on styledContext values;
- `String(value)` and template coercion of authored values
  (`directStyle.ts:632`, `directStyle.ts:528`) running a user `toString`;
- functional variants (proven).

None of these needs its own probe. What they change is the required phrasing
of the discipline: the rule is not "don't capture the arena across a
functional-variant call", it is "treat EVERY read of authored data as a
potential re-entry point; no module-level mutable state may be live across any
such read". The plan's rule 5 says "or another call that can re-enter", which
is compatible, but implementers will not naturally read a property access as
"a call". Make it explicit, and make the permanent reentrancy test include one
getter-based re-entry (a variant definition getter or a style-object getter)
alongside the functional-variant one, so the class is pinned rather than the
instance.

The audit must also cover module-level mutable state that already exists
OUTSIDE the arena:

- `tokenLookup` (`directStyle.ts:421`), a reused module singleton. **READ**:
  currently safe; it is filled and fully consumed inside `configuredValue`
  (`directStyle.ts:508-530`) with no authored-data read between fill and last
  read. The fused emitter must preserve that property or move it into the
  frame. Nothing in the plan names it.
- Theme tracking globals `curKeys`/`curSchemeKeys`/`curProps`/`curState`
  (`getThemeProxied.ts:61-64`). Safe today because only the hook phase
  repoints them and re-entered pure passes do not call getThemeProxied. The
  fused module must never call getThemeProxied outside the hook phase. Note a
  benign quirk: an inner reentrant pass resolving theme tokens tracks its keys
  into the OUTER component's key set; that is over-subscription and arguably
  correct (the outer's output does depend on them), but it is worth knowing
  when reading subscription tests.
- `useComponentState.ts:37-40` scan globals: deleted by step 3, and only
  reachable from the hook phase before then, so fine.

## Arena discipline as written: holds, with two implementation traps to name

The frame rules (base/top watermark, epoch cells, lazy init, finally-restore,
index-through-module-binding, integer-only retention) are consistent and the
plan's own described code obeys them. Two traps the text should pin so the
implementation cannot drift:

1. **State the array type and the single capacity-check point.** If the arena
   is a typed array, an out-of-bounds write is SILENTLY DISCARDED and the read
   comes back undefined; that is the intermittent silent corruption this
   design most fears, and it happens the first time any write lands outside a
   frame's reservation. If it is a plain array, an OOB write silently grows
   it and the growth/binding invariant is bypassed. Either way the plan should
   state: reservation at frame entry is the ONLY capacity check, growth
   happens only there, and every write is within the entering frame's
   reserved range by construction.
2. The 2,048 sizing note is honest but worth restating as behavior: 32 + 2 x
   1,005 = 2,042 leaves 6 cells, so ANY nesting under a compound-bearing
   outer frame grows the arena on first occurrence. That is allowed by the
   plan, but the reentrancy test should assert correctness ACROSS a growth
   event (nest deep enough to force growth mid-pass, then verify the outer
   frame's compound state), because growth-mid-nesting is where a captured
   stale binding would show up and nowhere else.

## Silent-breakage candidates the parity inventory misses

1. **fontFamily hoisting inside variant results.** **READ**,
   `propMapper.ts:293-313`: the current code reads `variantValue.fontFamily`
   (or its shorthand) FIRST, updates `styleState.fontFamily`, and only then
   resolves the rest of the object. A strict in-place forward traversal
   resolves `{ fontSize: '$5', fontFamily: '$heading' }` differently: fontSize
   resolves against the previous font's scale (`directStyle.ts:452-457` reads
   `state.fontFamily` for font-key tokens). No test in the plan's matrix pins
   this. It is preservable inside one pass without violating the rules: a
   single direct `variantValue.fontFamily` property read before traversing is
   O(1) and not a traversal. Say it, and pin it.
2. **Group/container conditions are absent from every verify list.** **READ**:
   the plan's only mentions of "group" are the compound-metadata bullet, the
   bitmask rejection, and a benchmark scenario name; no group or container
   behavior test is named at any step. Group and container clauses carry a
   subscription side channel (`flatGroupKeys`/`flatGroupMedia`/
   `flatStateKeys` Sets, `directStyle.ts:261,282-283,355`) that step 2
   deletes along with the other per-pass Sets. A lost subscription key renders
   correctly on first paint and silently stops updating, the exact class the
   review brief names. Kitchen-sink has GroupHover/GroupProp/GroupUseCases
   etc., and the inventory references `flatGroupSyntax.web.test.tsx`, but the
   plan runs the full inventory only at step 4. Move group/container clause
   and subscription tests into step 2's verify list, where the Sets die.
3. **Compound edge accounting has two unstated rules.** Current matching runs
   against `processedProps` only (`getSplitStyles.tsx:231`), so base-style
   contributions never satisfy a compound selector; the streaming cursor must
   feed compound edges from prop sources only, not from base-style
   contributions of the same key. And a PRESENT key with authored `undefined`
   anchors the compound at that prop's position today (it is an entry in
   `processedProps`), which is different from frame-start seeding of truly
   absent keys; the plan's planned `undefined`-matcher test should cover both
   the absent case and the present-but-undefined case, since they order the
   compound differently relative to other props.
4. **Native `unset` mutates earlier output.** `propMapper.ts:59-75` deletes
   already-merged style keys when a later prop is `'unset'`. That is a
   backward walk over OUTPUT, so it is legal under the plan's rules, but it is
   behavior the fused pass must reproduce and no test for it is named in the
   matrix.
5. **Variant-path refusal must flip in the same step as the style path.**
   `resolveVariants` today refuses the WHOLE value on any bad clause
   (`propMapper.ts:208`, `if (refused) return []`), and the comment above it
   records that the two paths disagreeing was a real past bug. Step 1 moves
   this code into the pass; step 2 changes refusal semantics. Fine, but state
   explicitly that step 1 preserves whole-declaration refusal in the inlined
   variant path and step 2 flips BOTH paths together, or the two paths
   disagree again for the life of one checkpoint.

## Bisectability: linear and reviewable, with one step carrying too much

The four checkpoints are genuinely sequential, each with named tests and a
whole-core measurement, so bisection works in the linear sense that matters.
Independent revertability of a middle step is not real (each builds on the
last), but the plan is honest that these are branch checkpoints, not merges.

The weakness is step 1, which bundles three separately-riskable changes: the
arena + compound streaming, the merged-prop-object removal + stable props
view, and propMapper absorption. A red test at checkpoint 1 does not localize
among them, and two of the three are the highest-risk items in the whole plan
(reentrant arena; `extras.props` contract). Both halves are separable:
compound streaming can land over the EXISTING merged object first (the anchors
are just entry indices), then the merged object is removed. I recommend
splitting step 1 into 1a/1b along that line. Cheap to do now, expensive to
wish for later.

One clean result from checking the props-order question: the plan's streamed
source order (non-overridden defaults, non-overridden context, caller props in
their own order) matches current merged enumeration exactly. **READ**,
`mergeProps.ts:29-36,67-88`: overridden defaults are skipped (`key in props`,
presence not definedness) and the caller value appears at the caller position,
and undefined context values are skipped. The stream must preserve those two
small semantics (presence-based displacement; undefined-context skip), but the
order itself is not a behavior change.

## Ledger: honest, two nits and one expectation to set

The non-additivity disclaimer, per-step pools, whole-core gate at every
checkpoint, and the "a row disappearing while whole core stays flat is a miss"
rule are exactly right. Nits:

- "the four style-grammar rows total 1,880" is six rows
  (697+523+290+283+63+24 = 1,880); step 2 repeats "four". The number is
  right, the count is wrong. Cosmetic, fix it so nobody hunts for phantom
  rows.
- The three-runtime-rows sum (6,265) checks out.

The expectation: mapped rows sum to 9,101 face value against a +9,273 delta,
so reaching ≤30,000 means netting essentially the entire identified pool while
the new machinery (arena, packed conditions, stable props view, absent-edge
seeding, per-clause refusal) adds bytes the ledger does not budget. Given
gzip non-additivity, the realistic outcome is landing close to but above the
ceiling and triggering the plan's own residual-attribution conversation with
the owner. That path is already written into the plan and is the honest one; I
am flagging only that it should be EXPECTED, not treated as a step-4 surprise.
Step 2's "falls materially or stop" gate is the right main gate.

The measurement procedure itself is solid: harnesses exist
(`attribute-bundle-gzip.ts`, `run-benchmarks.ts`, `profile-hotpath.ts` all
present, `--verify-workload` exists in run-benchmarks.ts, scenario plumbing
exists in profile-hotpath.ts), fixed V2 artifact, negative controls, and the
correct refusal to accept bundle size without the allocation/CPU receipt.

## Parity inventory

Sufficient on its named core: `compoundVariants.web.test.tsx` exists with the
1,005 case (line 246), `parserAgreement.web.test.tsx` exists and the update is
planned with good pin cases (bad base, empty clause, unterminated construct,
enter beside bad clause, `aspectRatio="16:9"`), `emitterParity.web.test.tsx`
exists. The gaps are the five items in the silent-breakage section above, plus
the getter-based reentrancy pin from the reentrancy section. Add those and the
inventory is adequate.

## Settled decisions, implemented as settled?

- Decision 1 (presence): the plan implements the letter; blocker 3 lists the
  consequences it has not noticed. Nothing there requires reopening the
  decision, only specifying the mechanics (internally unconditional hook,
  conditional registration, single context identity).
- Decision 2 (per-clause refusal): implemented consistently, good pin list;
  see the variant-path timing note above.
- Decision 3 (arena): implemented consistently; see the two traps and
  blocker 1 for the string-typed remainder the arena cannot hold.

## Bottom line

Settle blockers 1 and 2 with the owner before any code, and write blocker 3's
mechanics (unconditional hook / conditional registration / single context
identity) into the plan. Split step 1. Add the named parity pins, group tests
at step 2, and the getter-reentrancy test. With those amendments this plan is
implementable, and its hardest parts (arena discipline, ledger honesty,
checkpoint structure) hold up under a hostile read.
