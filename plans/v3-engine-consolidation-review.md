# Review: V3 engine consolidation

Reviewed cold at `de1e8d786d`, then against `v3-single-pass.md`,
`v3-single-pass-review.md`, and handoff sections 15 and 16 in the requested
order. I rebuilt both benchmark revisions from detached worktrees before using
their numbers.

## Verdict

Implementation is blocked. The direction is good, and Phase 3 is the right
conceptual point for a make-or-break check, but the plan cannot yet tell whether
that check passed. Its “whole core” number is a sum of non-additive module
marginals, its baseline uses a different application entry from the owner's
30 KB baseline, and its Phase 0 props design violates both the no-Proxy rule and
the public behavior of `extras.props`.

There are four more design blockers behind those: the proposed definition-time
merge is a second clause parser, the compiled modifier table goes stale after a
supported `addTheme`, the reentrancy design leaves existing module globals live
across authored reads, and the fixed condition slots are unsound under same-pass
nested clauses. These need decisions in the plan. They cannot be safely filled
in while implementing.

## 1. The size gate is in the wrong units

This is the first blocker because it invalidates every numeric phase target and
the final acceptance threshold.

READ: `attribute-bundle-gzip.ts` explicitly says that module marginals do not
sum to the chunk total. The plan nevertheless defines core at lines 45-47 and
594-595 as the sum of every `@tamagui/` marginal row minus two animation rows,
then calls that result “whole core” at lines 403-407. That is a row sum, not a
whole-core measurement.

I measured a union deletion as a discriminating control: delete all
non-animation Tamagui source-map spans together, then gzip once. It gives a
different result in all four arms.

| benchmark revision | whole v3 / v2 | row-sum “core” v3 / v2 | one-union core v3 / v2 |
| --- | ---: | ---: | ---: |
| `86c00ff56a`, entry before `FlatFrame` | 104,053 / 94,857 | 39,087 / 29,707 | 39,938 / 30,521 |
| `de1e8d786d`, entry with `FlatFrame` | 106,736 / 95,936 | 41,632 / 30,345 | 42,270 / 31,279 |

The union result is an independent diagnostic, not a proposed ceiling. It
proves that the plan's row sum cannot serve as a whole-core gate. On the current
fixture the error is 638 bytes for v3 and 934 for v2. Even the v3-v2 gap changes.

READ: the two row-sum frames also do not measure the same application. Commit
`878db6d383` added the 63-line `FlatFrame` scenario, including `styled`, twelve
compound variants, grammar-bearing values, and an animation prop, to both the
v3 and v2 bundle entries. It also added the scenario to `shared/bench.ts`.
Changing only the v2 entry moves its row-sum core from 29,707 to 30,345, exactly
638 bytes. The plan's claim at lines 52-59 that the old total used a different
module subset is wrong. The commands are the same, but their entry source is
different.

READ: the owner supplied `39,087 / 29,707` and “ceiling 30 KB” together to the
plan author. The prior plan repeats the same ceiling and v2 target at lines
31-32. The owner therefore set the ceiling in the old, pre-`FlatFrame`,
marginal-sum frame. The plan's `<= 39,000` gate uses the later `41,632 / 30,345`
frame. They are not the same units. A constant offset cannot translate them,
because changing an entry changes gzip's shared dictionary and every marginal.

Both row sums are reproducible for their respective fixture revisions. Neither
is a valid “whole core” under the stated rule that gates use whole core rather
than additive rows.

Options:

1. Keep the old fixture and old row-sum metric. This preserves the historical
   30 KB number but violates the explicit whole-core constraint.
2. Freeze a dedicated size entry, produce one actual no-animation core artifact
   or one union deletion, and ask the owner to set the ceiling in that frame.
   Keep the runtime `FlatFrame` workload in the performance fixture so adding a
   benchmark scenario never moves the size ruler again.
3. Gate on the complete benchmark chunk. That is a real gzip artifact, but it
   lets React, fixture code, and animation-driver changes move an engine gate.

Recommendation: option 2. Record the same-run v2 result as the parity anchor and
retain per-module marginals only for attribution. No implementation should
start until the owner has accepted the new numeric ceiling in that one frame.

### The make-or-break point is right; its threshold is not

Phase 3 is the right conceptual location. By then the grammar diet, the shared
resolver, and variant-path absorption should have removed the three parser
drivers. Phase 4 presence work and Phase 5 cleanup should not be allowed to hide
a failure of that thesis.

The `39,000` threshold is meaningless in the current plan for three reasons:

- it is a marginal-row sum labeled whole core;
- it is compared rhetorically with a 30 KB ceiling from another fixture;
- it is measured only against the already-regressed `de1e8d786d` baseline, so
  passing can still leave the assembled campaign worse than the pre-1a state.

After the measurement frame is fixed, the gate should report two deltas: against
the integrated branch baseline and against a same-fixture pre-1a/1b control. It
should also report the surviving parser/resolver cluster as one union. The
owner's target is one parser around 800 gzip; a lower whole core caused by some
unrelated module does not prove that target.

## 2. `variables.mjs` is out of the tracked Vite core, with an important scope limit

The plan is right for the exact Vite runtime benchmark it measures.

READ: after a fresh root build at `de1e8d786d`, I rebuilt v3 into a new output
directory. The source map contains `variableValue.mjs` and
`configVariables.mjs`. It contains no `helpers/variables.mjs`, `ThemeUpdate`, or
`theme-update` source. The attribution row is absent. The diff for
`99fba89f0c` independently shows why: `Theme.tsx` stopped importing
`getInlineValuesFromProps` and `getVariablesCSSRules`; only the separate
`theme-update` entry imports the heavy implementation.

So the 2,347-byte row is already banked for this Vite no-use entry, and the
remaining credible Vite consolidation prize is closer to 4-5 KB than 6-7.5 KB.
The small `variableValue` and `configVariables` rows remain real core features.

Two corrections are required in the plan:

- The old 39,087 baseline was measured after `99fba89f0c`. The variables win is
  already reflected in the owner's 30 KB campaign baseline. Banking it corrects
  the forecast; it does not authorize changing final acceptance to 37,600.
- “An app that never renders inline theme values ships none of it” is true for
  the measured Vite entry and the recorded webpack entry, not for every root
  entry. The intended `v3-beta` branch contains `b0d6c14908`, which exports
  `ThemeUpdate` from the root. The accepted root-export receipt measured Metro
  web rising by 3,807 Tamagui-only marginal gzip, including 2,980 from
  `variables.mjs`. Metro retains the root's static dependency graph. The
  current plan branch diverged before that commit, so its baseline cannot make
  a product-wide “already out” claim.

The implementation branch currently has three local campaign commits while
`v3-beta` has three different commits after their common parent
`99fba89f0c`, including the root export and two compiler/test follow-ups. The
revised plan needs an integration checkpoint followed by a fresh baseline. The
Vite result should stay unchanged, but that must be measured after integration.

## 3. Keeping 1a and 1b is not proved, and the proposed repair remains underwater

The dependency assertion at lines 412-416 is too broad.

READ from the code and phase descriptions:

| existing change | later work that actually needs it | later work that does not need it |
| --- | --- | --- |
| 1a, compound arena and streamed compound anchors | the final one-authored-traversal goal and compound allocation result | grammar diet, shared clause resolver, refusal semantics, variant absorption |
| 1b, direct traversal of defaults/context/caller | Phase 4 removal of the separate authored-prop prepass and parts of Phase 5's second-props-object work | Phases 1-3; all can consume the former merged `processedProps` object |

Phase 3 does not require 1b. In fact, 1b makes Phase 3's public
`extras.props` contract harder because the real merged object no longer exists.
“Later phases reclaim it anyway” is not a dependency argument. Grammar savings
can hide traversal overhead without showing that the traversal machinery was
worth keeping.

The plan also answers the “will repair get it back under water?” question: no.
The pair costs +939 gzip and Phase 0 forecasts only -100 to -300. Its own
forecast leaves the repaired pair +639 to +839 worse than the pre-1a baseline.

### The Phase 0 Proxy design cannot satisfy the contract

This is an independent blocker, even if the byte debt were accepted.

READ: `getSplitStyles` creates a new `styleState` object on every call at lines
518-537. `getVariantExtras` caches in a `WeakMap<GetStyleState, ...>` at lines
5-10. Moving the Proxy into that cache makes it lazy within one style pass; it
does not make it stable per component or across renders. Every render that
invokes a functional variant still creates the extras object, its two accessor
closures, the Proxy, its handler, and its trap closure. The unmeasured “99%”
claim at lines 311-313 is irrelevant to the no-Proxy rule and is unsupported for
components such as Button, Text, Input, Slider, and Tabs that use functional
variants in ordinary paths.

There is also a behavior loss. `VariantSpreadExtras<Props>.props` is typed as
the full `Props`, not as a scalar lookup function. A Proxy whose target is
`processedProps` and whose only trap is `get` cannot reproduce the former merged
record:

- `'contextKey' in extras.props` sees only the Proxy target;
- `Object.keys`, spread, rest destructuring, and `for...in` omit default and
  styled-context keys;
- `getOwnPropertyDescriptor`, `hasOwn`, and proxy enumeration observe the wrong
  ownership;
- adding the missing traps would run more authored code and would still violate
  the explicit no-Proxy constraint.

Repository call sites happen to use scalar reads. That does not narrow a public
generic `Props` contract for external functional variants.

Options:

1. Revert 1b and keep the actual merged props record for Phase 1 through Phase
   3. This restores full record behavior and removes the runtime Proxy. Attempt
   direct three-source traversal later only if a no-Proxy design can beat the
   merged object in both bytes and allocations.
2. Formally narrow `extras.props` to scalar lookup semantics. This is a public
   breaking change and needs an owner decision plus migration work.
3. Materialize or maintain a complete stable record outside the pass. This
   restores the loop/object that 1b meant to remove and still needs a concrete
   reentrancy design when nested renders update it.

Recommendation: option 1. Keep 1a only as an explicitly priced performance
trade if the owner accepts its independent size result and the module-arena
exception. If both commits stay, Phase 0 must recover the full 939 bytes and
prove all `extras.props` operations without a Proxy before later grammar savings
are allowed to count. The current Phase 0 forecast cannot meet that bar.

Phase 0 also cannot call itself a complete repair while lines 428-429 allow the
`useComponentState` per-call closure to remain until Phase 4 and lines 433-435
deliberately leave several render closures in place. Either split those into
named later checkpoints or remove them in Phase 0. “Fix now only if trivial” is
not compatible with a binding no-per-call-allocation rule.

## 4. The target architecture still creates a second clause parser

The plan's main architectural direction is sound: one lexer, one clause
resolver, one contribution pipeline, and one vocabulary is the correct place to
attack the measured duplication. The definition-time merge at lines 328-341
breaks that architecture.

It proposes a new driver that scans both values, recognizes clauses, folds
aliases, canonicalizes unordered modifier sets, records spans, and applies
slot-replacement semantics. That is a clause parser. It duplicates exactly the
syntax and identity logic that `resolveClauseChain` is meant to own. Calling it
“lean” does not make it one path, and it can silently drift on malformed values,
aliases, duplicate modifiers, group spellings, or future grammar changes.

The current merge uses `parseValue` plus `clauseConditionSetKey`, so at least its
meaning is shared. The replacement must use the same clause reducer and
canonical slot identity as the runtime resolver, with a definition-time merge
sink. Definition-time allocations are acceptable. A bespoke merge driver is
not. Tooling can keep diagnostics outside the app graph without giving runtime
and styled-time merging two semantic implementations.

There is a real design question to settle: `styled()` can run before a config is
installed, while the runtime resolver classifies config-defined media and theme
names. The shared syntax reducer therefore needs a config-independent clause
identity operation that both sinks use, followed by runtime classification in
one place. The plan currently avoids that question by writing the second
parser.

Add a direct acceptance gate for the owner's parser goal: attribute the union of
the surviving lexer, clause reducer, resolver, and definition-time merge sink.
Require one semantic path and roughly 800 gzip. Whole-core movement alone cannot
prove consolidation.

### The “at most five modifiers” premise is false

Lines 213-218 justify fixed short-chain handling by saying chains are at most
five modifiers. The grammar has no such syntax limit. `clausePrecedence.ts`
caps the packed precedence depth field at five; it still includes every
distinct modifier in condition identity. A six-modifier clause is accepted
today.

The revised design must support unbounded authored chains or explicitly change
the language with diagnostics and owner approval. It also needs a concrete
allocation story for the selector string, wrapper sequence, and canonical set
key. JavaScript string insertion is not in-place, and an arbitrary wrapper list
does not fit in unspecified fixed slots. Tests need six or more modifiers,
reordered equivalent sets, aliases, and duplicates.

## 5. The reentrancy section states the right rule and then exempts the unsafe state

Lines 380-385 state the correct rule: every authored read can re-enter and no
module-level mutable state may be live across it. The concrete bullets do not
satisfy that rule.

### `tokenLookup` must move; “preserve or move” is not enough

`tokenLookup` is filled at `directStyle.ts:421-427`. Its next consumer calls
`isVariable(lookup.value)`. `isVariable` performs `'isVar' in v`, so an authored
Proxy can run a `has` trap and re-enter after the singleton was filled but
before its fields were fully consumed. `resolveVariableValue` can then read and
invoke an authored `.get` function. The existing safety premise is therefore
too weak.

Move the three fields to the per-pass frame or to reentrancy-safe locals before
the refactor changes call boundaries. The plan must choose that outcome; it
cannot leave preserving the singleton as an implementation option.

### `getThemeProxied` is active inside the pass even when its factory is not

Lines 394-395 say the globals remain hook-phase-only because the fused module
will not call `getThemeProxied`. That checks the wrong call.

The objects returned by `getThemeProxied` contain `val` getters and `get`
closures. Those execute during token resolution and inside functional variants,
and they read module globals `curKeys`, `curSchemeKeys`, `curProps`, and
`curState`. The dynamic ThemeUpdate path also calls `String(pair[scheme])`, so
an authored `toString` can re-enter while those globals are live. Avoiding the
factory call during the pass does not make its returned getters safe.

The revised plan needs a reentrancy-safe theme/token path. Options include an
engine path over raw theme values with explicit per-frame tracking, or a
per-component tracking view whose closures bind stable refs rather than a
module-wide “current component.” This also applies to `extras.theme`, which user
functional variants can read during the pass. Recommendation: keep the engine
off the shared tracking globals and carry tracking state on the pass frame.

### One set of condition slots is corrupted by same-frame nesting

The prior review already identified this exact failure. A conditional variant
such as `sm:$v` can return `{ color: 'hover:red' }`. The inner clause is
processed while the outer condition remains live on the same `styleState`.
Lines 220-225 now put the packed condition, selector, wrappers, key, theme, and
source offsets into fixed `styleState` slots. The inner clause overwrites those
slots before the outer emission resumes.

The accepted narrow rule was to retain numeric source offsets across a user
boundary and re-derive the condition after the call. The plan must also handle
same-frame nested clause evaluation. Scalar call-stack arguments or an explicit
frame stack can do that. One mutable slot set cannot.

The module compound arena deserves explicit treatment too. It is module-level
mutable state held across authored reads, although its watermark ranges were
designed to make nesting safe. If that prior owner decision is an allowed
exception to the literal rule, name it as the sole exception and retain the
growth-under-nesting negative control. If the rule is literal, 1a must be
reopened. The plan currently claims both positions at once.

### The reentrancy test plan is too small

One functional-variant probe plus one generic getter test cannot cover distinct
code sites with distinct live state. Add discriminating runtime probes for:

- an exact variant-definition getter and a resolver-key getter;
- a variant-result getter, including the `fontFamily` pre-read and subsequent
  traversal;
- caller props, a nested style object, and styled-context values, parameterized
  over `get`, `has`, and enumeration traps;
- a functional variant that starts an inner style pass;
- a custom Variable `.get` and an authored `toString` during atomic identity or
  dynamic theme coercion;
- nested conditional variants that overwrite same-frame clause scratch;
- the existing 1,005-compound outer frame with arena growth during inner work.

Each probe should assert that the outer pass resumes with its original props,
theme tracking, condition identity, and compound state. Read counts matter:
the new `fontFamily` pre-read must not accidentally invoke a getter twice.

## 6. The compiled modifier table silently misses themes added at runtime

Lines 175-204 compile root theme names once and cache the table by
`TamaguiInternalConfig` identity in a WeakMap. That identity does not change for
supported theme mutation.

READ: `@tamagui/theme`'s `_mutateTheme.ts:136-139` assigns
`config.themes[themeName] = theme` and calls `updateConfig('themes',
config.themes)`. A table created before `addTheme({ name: 'brand', ... })` never
learns `brand`. A later `brand:red` clause will be refused or treated as an
unknown modifier with no error in ordinary production rendering.

Use a config revision that invalidates the table, or keep dynamic theme-name
classification against the live config inside the one resolver. This must be
one defined path, not “try the compiled table, then fall back.” Add a runtime
test that builds the table, adds a new root theme on the same config object, and
then renders a clause using it. `parserAgreement` over a static config cannot
catch this.

The styled-time variant metadata at lines 292-295 needs the same timing
precision. Compile resolver key spelling and order only. Continue reading
`variant[value]`, resolver result properties, and static variant values at the
current render point unless the owner explicitly accepts changed getter and
mutation timing.

## 7. The phases still bundle independent failure classes

The phases are sequential, but several checkpoints are too broad for a red test
to identify its cause.

- Phase 0 combines the public props view, Proxy removal, compound-frame layout,
  helper hoisting, prepass removal, and read-count changes. Split measurement
  integration, 1a repair, and the 1b keep/revert decision. The props contract
  needs its own checkpoint.
- Phase 1 combines a mechanical lexer signature migration, a new
  definition-time parser, package export surgery, and live runtime
  classification through a compiled table. Split the signature change, shared
  clause/merge semantics, and compiled vocabulary. Package graph removal should
  be measured after each semantic owner is known.
- Phase 2 combines resolver equivalence, a deliberate refusal-semantics change,
  packed condition representation, streaming emission, entry-point folding,
  shorthand movement, and coercion movement. First replace the resolver with
  unchanged behavior. Then change refusal in both style and variant paths.
  Then stream and delete intermediates. Move shorthand/coercion only after
  emission parity remains green.
- Phase 3 should separate static variant traversal from functional variants and
  their public extras contract. Conditional variant direct emission is another
  checkpoint because it removes the last parser driver.
- Phase 4 combines state discovery with universal presence mechanics and React
  context identity. Record the main-pass flags first, remove the prepass second,
  then change presence wiring. A silent subscription failure and a duplicated
  context should not share a checkpoint.

The plan is strong where it names group/container subscription updates,
font-family ordering, native `unset`, presence context identity, and the
wide-subtree benchmark. Keep those tests at the exact checkpoints that remove
their old mechanisms.

Do not enforce the runtime/tooling boundary with a source-string import test.
Use package exports, a real build graph assertion, or the lint dependency graph.
Source-string tests are prohibited and do not prove what the emitted graph
contains.

## 8. Phase 5 spends budget on seams already measured as exhausted

The plan says at lines 357-367 that composite emitters, atomic merge, rule
identity, and generic value routing are deliberate non-targets. Phase 5 then
targets `fixStyles`/`styleToCSS`, `insertStyleRule`, and
`getCSSStylesAtomic` at lines 545-555. Those positions conflict.

Handoff sections 15 and 16 already measured:

- condition routing, atomic merge, and generic value routing are smaller than
  their v2 counterparts;
- `getSplitStyles` was 112 bytes smaller than v2 before 1a/1b;
- `createComponent` was at parity;
- object/string normalization unification was declined because it needs an end
  pass and changes box-shadow order and atomic identity;
- the atomic identity cache deliberately costs bytes for a measured 29.7%
  allocation reduction and has negative controls for silent wrong-rule reuse.

Consequences:

- Remove `fixStyles`/`styleToCSS` unification from the Phase 5 savings forecast
  unless new evidence disproves the recorded end-pass and identity premises.
- Do not treat `insertStyleRule` or `getCSSStylesAtomic` module deltas as an
  available byte pool. Audit is fine for residual reporting, but deleting cache
  mechanics would trade away a measured performance win.
- Treat current `getSplitStyles` and `createComponent` growth as 1a/1b repair
  debt, not as permission to golf seams that were already lean.
- The duplicate token-category representation and frontend second props object
  remain legitimate consolidation targets because the counterpart audit did not
  exempt them.

Phase 5's stated -500 to -900 therefore needs a new bottom-up proof before it
can contribute to endpoint arithmetic.

## 9. Final acceptance cannot be changed from 30 KB to 37,600 in this plan

Lines 563-579 unilaterally replace the owner's hard 30 KB result with 37,600.
The stated reason is that the variables win was already banked. That reasoning
is invalid because the 30 KB ceiling and 39,087 baseline were both established
after the variables module left the tracked Vite entry.

If the consolidated engine remains above the owner's ceiling, the correct plan
is the prior plan's path: report exact residual attribution and ask the owner
which capability or target changes. A design author cannot pre-classify the
remaining 6-8 KB as unavoidable feature weight and accept it. The v2
counterpart audit proved selected directStyle groups; it did not prove every
future residual in the assembled chunk.

The forecast arithmetic is also optimistic even before gzip interaction. The
listed phase ranges total 2,850 to 4,950 bytes, which puts 41,632 at 36,682 to
38,782, not 36,600 to 38,300. Since gzip rows are non-additive, this range may
be used only as planning context, never as acceptance.

## Required plan changes before code

1. Freeze one size fixture and one actual whole-core metric, rebaseline after
   integrating the three `v3-beta` commits, and obtain the owner's ceiling in
   that frame.
2. Keep the Phase 3 make-or-break location, but gate against both the integrated
   baseline and a same-fixture pre-1a/1b control. Add an approximately 800-byte
   single-parser union gate.
3. Choose the 1b outcome. Recommendation: revert it and restore the real merged
   props object through Phase 3. Do not use a runtime Proxy.
4. Replace the bespoke definition-time merge parser with the shared clause
   reducer and canonical identity operation.
5. Make condition nesting, `tokenLookup`, theme tracking, and the compound arena
   comply explicitly with the authored-read reentrancy rule. Add the boundary
   matrix above.
6. Specify live config revision behavior for dynamically added themes and remove
   the false five-modifier bound.
7. Split the bundled checkpoints and remove exhausted directStyle,
   `getSplitStyles`, `createComponent`, and atomic-cache seams from the savings
   budget.
8. Restore 30 KB as the owner's acceptance target until the owner explicitly
   changes it after seeing residual evidence in the corrected frame.

With those changes, the central consolidation direction is sound. Without
them, the implementation can pass every listed parity suite, silently change
public variant props or dynamic-theme behavior, and declare success against a
number measured in different units.

## Revision 2 follow-up

Revision 2 fixes most of the original blockers. It now states the variables
scope correctly, restores 30 KB as the owner's target, reverts 1b, makes 1a an
explicit measured trade, removes the runtime Proxy, gives clause syntax and
identity one semantic owner, gates the parser cluster as a union, covers the
authored-read reentrancy boundaries, and removes the v2-lean seams from the
savings budget. Those are real corrections. Four items still block engine
implementation.

### A. The proposed pre-1a control does not isolate 1a

Revision 2 lines 136-145 compare the integrated branch after merging current
`v3-beta` with detached commit `2681babe1f`, then call the difference exactly
the cost of 1a. The trees differ by more than 1a. `2681babe1f` is a direct
child of `99fba89f0c`; current `origin/v3-beta` also forks from
`99fba89f0c` and has since gained the ThemeUpdate root export, web package
changes, compiler/test follow-ups, and a main merge. Replacing only the size
entry does not make those code trees equal.

This invalidates `CORE_pre1a`, the claimed standalone 1a price, and the first
make-or-break condition at lines 617-621. Use the exact integrated tree for
both arms. Reverse-apply only `878db6d383` in the control arm, or construct
the equivalent pair by applying only 1a to the integrated no-1a tree. Freeze
the identical fixture in both. Verify the resulting tree diff contains only
1a before calling the gzip difference its price.

### B. The scratch stack and theme-key set allocate during each render

Revision 2 lines 331-335 say the condition scratch array grows once per depth
level per pass. That means new scratch records are allocated in a render pass.
Lines 440-442 likewise specify a per-pass theme-key Set. Both contradict the
explicit no-per-call-allocation constraint.

The condition offsets do not need heap-backed scratch. Authored calls are
synchronous, so primitive offsets can remain in the outer function's locals;
after the call returns, re-derive the condition from those locals. That also
handles same-pass nesting without a module singleton or fixed slot. If the
implementation needs another design, the plan must name where the records are
created once and reused without sharing live state between reentrant passes.

For theme tracking, the likely zero-allocation path is to give the pass the
component's existing stable tracking refs and add keys directly to their Sets,
which matches the current cumulative tracking behavior without shared globals.
If transactional per-pass collection is required for a behavior the current
code has, state and test that behavior; otherwise a new Set per pass has no
justification. In either case, the plan must explicitly prove zero per-pass
allocation.

### C. The old ceiling has no unique mechanical conversion to CORE

Revision 2 lines 116-123 correctly reject row sums as gates, then say the old
row-sum ceiling will translate mechanically to union CORE. It will not. Gzip
marginals are non-additive, so there is no mathematical conversion from an
arbitrary row-sum target to a union target. The known baseline pair supports
several different policies:

- literal `CORE <= 30,000`;
- parity in the new frame, `CORE <= CORE_v2`;
- preservation of the historical allowance above v2,
  `CORE <= CORE_v2 + (30,000 - 29,707)`, or `CORE_v2 + 293`.

Those are materially different targets. Recommendation: if the original
intent was approximately v2 parity with the allowance visible in the quoted
numbers, bind the ceiling to `CORE_v2 + 293`. Use literal 30,000 only if the
owner confirms that 30 KB was an absolute artifact target rather than a
same-frame parity target. Record one formula and one measured number before
Phase II. Do not call either choice a translation performed by the tool.

### D. Phase V-b still combines three independent failure classes

Phase V-b at revision 2 lines 600-605 changes functional-variant traversal,
deletes `tokenLookup`, and replaces engine theme tracking in one checkpoint.
Each can fail independently, and theme subscription failure can remain silent
after the first correct render. Theme-file ownership can also block without
blocking either of the other changes.

Split this into separate checkpoints: functional variants and their read
timing; the local token-resolution rewrite; and engine/user-facing theme
tracking. Then remove the conditional-variant driver in its own checkpoint.
Each checkpoint should record CORE and run its own reentrancy and subscription
pins. The same principle should be applied inside IV-c if streaming the style
path and folding a frontend driver cannot be staged with an independently
green intermediate tree.

The plan is sound enough to implement after these four corrections and the
three owner decisions at its end. It is not sound enough before them. In
particular, implementation must not begin with a control known to include
unrelated commits or with an unresolved meaning for the only final byte gate.

## Revision 3 disposition

Revision 3 resolves A through D. It requires the exact integrated tree with
only 1a reverse-applied, replaces both per-pass scratch allocations with
primitive call-stack state or stable component refs, binds acceptance to one
owner-chosen constant, and splits Phase V into independently measurable
checkpoints. I found no replacement design blocker in that revision.

Phase I then completed the control the plan specifies. The integrated arm is
40,217 CORE, the exact no-1a arm is 39,938, and the same-run v2 anchor is
30,521. The no-1a artifact came from detached `c10696b15f` with only
`878db6d383` reverse-applied after a full build; it is byte-identical to the
independently frozen historical artifact. The isolated price of 1a is therefore
+279 gzip.

With the owner away, coordinator p28302 made both reversible bindings so the
overnight campaign could proceed: literal CEILING = 30,000 CORE, and revert
1a. The latter makes CORE_noarena (39,938) the working baseline and leaves the
getter/allocation win as a separate future proposal. This resolves the last
Phase I hold. Phase II has no remaining code because its entire subject leaves
with 1a; implementation proceeds at Phase III.
