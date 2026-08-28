# V3 style engine: handoff to the Codex-led fleet

Date: 2026-08-28. Written by the outgoing Fable owner session at Nate's
direction. Audience: a Codex Sol xhigh lead with zero prior context. The
source of truth for the design is `v3-style-engine-plan.md` in this directory;
this document is the execution state on top of it.

Standing correction to the plan: treat its claims and line references as
leads, not facts. It was wrong five times this campaign (each case below);
when the code disagrees, trust the code and record the discrepancy.

## 1. Landed state on v3-beta (tip `8330abb5ea`, CI fully green at `aedb667e4e`)

In landing order, with the SHA that carries each unit:

| unit | SHAs | notes |
| --- | --- | --- |
| checkpoint 0 ruler | `f7417711ca` | fixtures + receipts: `checkpoint-0-receipts.md`. Processor artifact 21,321 gzip at baseline (re-read on later tips: 21,624 → 21,757 → 21,761 as v3-beta moved). |
| checkpoint A + component 2b wins | `93e9b8a0c8..1cbab3a7d0` | group-subscription Set bugs (both hosts, one shared revision helper), web safe-area mount render, press metadata, styled-context key Set, driver validation hoist, dead files. |
| compiler stub fix + snapshot rebaseline | `7cbbd10477`, `76464fff10` | the webpack snapshot was stale from BEFORE the campaign; everyone had been running vitest directly against a stale gitignored bundle. Always run `bun run test:webpack` (its pretest regenerates the bundle). |
| checkpoint 1 container API | `4704c13a54` | `container` prop API, `webContainerType` deleted, group is state-only. |
| checkpoint 2b engine cluster | `8ea68d8296..eab989dbaa` | 11 commits: transition-key centralization, refusal dedup, classification reuse, one-pass joinChains, strict equality, context-sniff removal (partially wrong, see §4), data-attribute directness (partially wrong, see §4), normalizeStyle merge, platform guards, invariant hoisting, ONE transform accumulator in authored order (fifth system found in style-grammar and unified). |
| post-2b receipts | `8ffb9a15b6` | strict-dom-parity citation range + zero-runtime baseline. |
| compiler env-leak fix | `28ccd3c6af` | ROOT CAUSE CLASS: tamagui-build inlines TAMAGUI_TARGET into dist; @tamagui/static must read it live. Its build now uses `--keep-env-target` — NEVER remove that flag. CompilerFrontend.compile save/restores env at the boundary. |
| HOC style-position fix | merge `9c94f9b090` (branch fix-hoc-css-position, fix `4eab149f61`) | resolve-at-HOC stays (skins depend on it); noMergeStyle transports style/className; positional displacement via marker + property map. Pins: SelectSkin, SheetWebKeyboard, ListItem. |
| styled-context token restore | `c51c5c8a8c` | see §4 case 1. `getContextPropSet` WeakMap in propMapper.ts. |
| RNW dataSet restore (now superseded) | `176b2d7213` | see §4 case 2; the branch it guarded was later deleted wholesale by the residue unit. |
| metro cycle fix | `bd8ec6cce1` + `0aec6897d0` | useSplitStyles hook imported from its own module everywhere; helpers/getSplitStyles must never re-export it. Metro crashes at runtime on cycles that esbuild/vite live-bindings hide. Zero-runtime starter playwright is the metro canary. |
| checkpoint 4 web artifact | merge `479036c39b` (branch cp4-web-artifact @ `5504c3a022`) | receipts: `checkpoint-4-receipts.md`. Strict pages: zero engine families across Vite/webpack/Metro (built-content greps). DID_OUTPUT_CSS deletes runtime CSS generation; unproven values route inline (decided policy §2.2 of the plan). Island sizes: metro −27K, vite −3.5K, webpack −4.1K gzip. |
| barrel shrink | `18aced5c81` | zero `export *` in @tamagui/web. Consumer-evidence method in the worker receipt. TokenCategories had to be re-exported after (`bd8ec6cce1` range) — check tamagui.dev typecheck, not just kitchen-sink, when touching exports. |
| checkpoint 2 wind-down | `e9372fa7e4`, `fbe62ddd3d`, `cfdb63f560` | DECISION `checkpoint-2-decision.md`: general definition-time metadata folds into checkpoint 3 (a bolt-on to the old engine failed both size and profile rulers). Only the revision-aware Tailwind cache landed. |
| pre-existing red fixes | `84ab651a35` | Popover.Content skin behavior props via inlineProps (fixed the exit-animation + z-index pins). |
| cp4 fallout set | `2e6f1fcfd0..aedb667e4e` | SSR DID_OUTPUT_CSS server/client symmetry, transform finalization when CSS gen disabled, resolvedCssTransition branch bug, v6ThemeNames graph leaf, per-driver DialogPresenceCompletion pins (css ≥850ms; motion/reanimated immediate — probe-proven correct), stale animated-native CI selector removed. THE GREEN RUN. |
| RN driver web drop | `7c9d038e7f` | animations-react-native is native-only; web drivers are css/motion/reanimated; test matrix migrated (explicit deleted-vs-migrated list in worker receipt); CLAUDE.md updated. |
| RNW residue removal | `53e67cb3de` | core web no longer detects RNW hosts, emits/consumes $$css, rewrites data-*/testID, or reads animationDriver.isReactNative. isReactNative is native-only behind TAMAGUI_TARGET. HOC property map kept as internal `$$tamaguiClassProps` (positional semantics pinned). Islands −~500/arm. rnw-lite untouched by design (it consumes public generic APIs: getStyleTags, usePropsTransform — keep those). |
| baseline correction | `8330abb5ea` | the residue baseline was measured pre-rebase. RULE: measure size baselines only on a pulled + fully rebuilt tree; local must match CI byte-for-byte (it does when done right). |

## 2. Checkpoint 3 (the rebuild) — branch `cp3-engine`, tip `a7ae5d2b7b`

The core one-pass engine. Built by Fable across milestones, all pushed:

- m0 `884ba02227`: predecessor WIP (from Codex r5722) rebased onto `479036c39b`.
- m1 `fda0144c1d`: per-modifier scanner events → pooled ConditionCursors
  (call-stack discipline, watermark release); resolveClauseChain + its chain
  re-walk deleted; five condition module arrays deleted; combineConditions
  canonicalize+reparse replaced with resolved-atom replay; HOC transport hands
  structured clause objects; v6ThemeNames off the runtime entry; HOC
  first-frame enter fix.
- m2 `f6be45f010`: FULL MATRIX GREEN. Two WIP semantic drifts fixed
  (maybeStyleProgram gate; shouldDoClasses flip scoped to frontend/HOC class
  transport only).
- review fixes `1562410679`: all five xhigh-review findings fixed (see §3).
- consolidation + presence fix, receipts docs, tip `a7ae5d2b7b`: legacy CSS
  identity path deleted (engine no longer reaches getStyleObject;
  directIdentities cache deleted); emit compaction measured gzip-NEUTRAL;
  arena judged no-cheap-wins-without-redesign. DEEP presence regression found
  by kitchen-sink and fixed (fiber-walk-proven; fixed-position usePresence had
  exposed presence to animatePresence={false} frames, nulling context for the
  actual animating frame; registration now sticky, gated as the old
  conditional call, decided pre-pass and widened only by finalize). Receipt in
  the checkpoint-3 receipts file in this directory.

The engine on this branch: directStyle.ts / propMapper.ts / frontendProgram.ts
deleted; one pass in getSplitStyles.tsx; three hosts (createComponent,
useProps with noMergeStyle transport, compiler static-resolve) consume it;
React-free; lifecycle protocol (3b) and compound arena (3c) are IN the unit
per owner rulings (commits stay separately green for bisect).

### The immediate task spec

1. Rebase `cp3-engine` (from tip `a7ae5d2b7b`) onto v3-beta `8330abb5ea`.
   Port the residue deletions (`53e67cb3de`) INTO the merged engine: the
   $$css input flatten, $$css output arm, data-*→dataSet, testID
   preservation, RNW event suppression, and web isReactNative detection all
   die in the new engine too (native-only equivalents behind
   `process.env.TAMAGUI_TARGET === 'native'`). Keep the internal
   `$$tamaguiClassProps` positional map (pins depend on the semantics).
   NOTE: cp3-engine history contains an ours-merge (force-push is
   policy-guarded); do not be surprised by the dual lineage.
2. Paired same-run processor re-measure, tip vs branch, using the
   checkpoint-0 receipt commands. Prior readings: pre-consolidation tip
   21,761 vs branch 24,931 (+3,170); post-consolidation 21,757 vs 24,638
   (+2,881). Attribution: compound arena + cursors + neutral-frame/dual
   completion (the invariant machinery), NOT the dedup (which paid).
3. Clause-heavy corpus timing, paired same-run (benchmark-get-split-styles /
   profile-hotpath scenarios; never compare to quoted numbers).

### The standing size-gate ruling (owner-set, Nate-visible)

The plan's directional gate said the processor artifact falls; it grows.
Ruling: **if the paired clause-heavy timing shows a real win, the gate bends**
— the residual (+~2.5-2.9K expected after the residue rebase) is accepted as
the price of the invariants, financed by the campaign's banked wins (−27K
metro islands etc.). Proceed to assembled-review prep. **If timing is flat or
negative: stop**, send the numbers to the manager, and the compound arena gets
a redesign pass before any review. Do not pre-shave behavior to make either
number.

### Assembled review (manager staffs it; per owner rules, review does not chain)

Gate on reading, not just tests: plan §1 invariants 1-9 and 11-13 — one
character loop per authored string (one clause scan + at most one payload
scan), one conditional-object discriminator, one transform accumulator, no
sort/split/join/includes/regex/Object.keys on the render path, no per-clause
heap records (condition state call-stack only; pools must CLEAR on release,
not just rewind), directStyle.ts gone, no component-runtime propMapper, one
contribution entry point, completion never re-reads authored props, style
pass callable outside React render. Then the full validation gates (§5) and
the paired receipts. The unit lands on v3-beta only after this review.

## 3. The five xhigh-review findings (fixed at `1562410679`, keep them fixed)

1. Condition pools retained heap state process-lifetime → release now clears
   strings and truncates atom arrays (only empty shells + capacity persist).
2. Double traversal on compound-fed props → compound feed consumes the
   ordinary scan (finishCompoundEdges scans ONLY values the ordinary path
   never scanned, e.g. exact variant matches); the includes(':') pre-scan is
   dead (styled-default program-ness compiles at definition). A
   scanner-instrumented probe showed exactly one scan per authored value.
3. HOC transport serialized condition text across the boundary → now a
   WeakSet-minted resolved-atom entry list replayed into cursors; canonical
   key materializes once per committed clause.
4. HOC replay broke authored-position order (probe: outer variant beat a
   later authored prop) → positional displacement via delete+reinsert.
   PIN: `core-test/hocClausePosition.web.test.tsx` (verified red pre-fix).
5. Variant-vs-direct numeric values hashed to different atomic classes for
   identical CSS → identity now hashes winning content after normalization
   AND precedence ordering. Pins updated hash-only (rule text verified
   identical).

## 4. Plan-was-wrong cases (binding learnings)

1. **Styled-context tokens** (issues #3670/#3676): plan said delete
   overriddenContextProps/originalContextPropValues; they are what deliver
   authored token strings (not CSS vars) to child functional variants.
   Restored at `c51c5c8a8c` with a WeakMap membership Set
   (`getContextPropSet`). Kitchen-sink StyledContextTokens pins it.
2. **data-*→dataSet**: plan said delete; RNW hosts required it. Later mooted
   by the residue removal, but the lesson stands: deletion decisions need the
   consumer audit, not the plan's word.
3. **Lifecycle prepass**: plan said delete in 2b; it fed hook-order decisions.
   Correctly rebuilt as part of 3b instead.
4. **Transition hand-lists**: the plan's third copy had drifted into a real
   two-key semantic normalization; preserved, not deleted.
5. **Transform systems**: plan counted four; style-grammar's
   composeTransformArray was a fifth. All five now route through the one
   accumulator.

## 5. Validation gates (every landing)

- Root: `bun run lint` (oxfmt is part of it and separate from oxlint — a
  formatting miss cost a CI cycle) and `bun run check`.
- `code/core/core-test`: `bun run test` (full: native, provenance, web, ios,
  androidtv, tvos).
- Compiler: `code/compiler/static-tests` `bun run test`, `test:native`, and
  `test:webpack` (pretest regenerates the gitignored bundle — never vitest
  directly for webpack).
- Kitchen-sink (`code/kitchen-sink`): default + webkit projects; animated
  css/reanimated/motion (three web drivers only). Named canaries:
  StyledContextTokens, SelectSkin, ListItem, ActiveStateBackground,
  SheetWebKeyboard (webkit-sheet project), PopoverHoverable,
  hocClausePosition. Known load-sensitive flakes (pass isolated, never
  loosened): Accordion reanimated intermediate-frame sample, InputRef
  popover-focus race.
- Zero-runtime starter (`code/starters/zero-runtime`): `npx playwright test`
  (the metro cycle canary) and `node scripts/measure.mjs` under pinned Node
  24.16.0 (fnm or mise; the script hard-refuses other versions). Baselines
  are +0-threshold: fold `--update-baseline` into the SAME push as the change
  that moved them, measured only on a pulled + fully rebuilt tree.
- SSR: the five-file prod SSR job under `v3-ssr-hydration` when touching
  emission; DID_OUTPUT_CSS must be defined symmetrically for SSR and client.

## 6. Hard technical constraints (each one re-breaks a fixed bug if violated)

- `@tamagui/static` builds with `--keep-env-target`; its env reads stay live.
- No module-scope `TAMAGUI_TARGET`-conditional bindings anywhere in core
  (mixed-target harnesses observe them stale; domCompiledRuntime pins it).
- Module graph stays acyclic (metro runtime crash class);
  helpers/getSplitStyles never re-exports the hook.
- getSplitStyles stays React-free; static-resolve entry stays side-effect-free.
- Never loosen a test/timeout/assertion to go green; pins change only against
  a decided policy, stated in the commit.
- Any Claude session in this fleet: turn auto-compact ON at start (a Fable
  session wedged at its hard limit; /compact cannot run past it).
- GitHub redacts digits in workflow logs; count off-CI.
- `gh run list --branch` filtering is unreliable; verify SHAs with
  `git merge-base --is-ancestor`.

## 7. Queued work (not started)

- **Sheet/Slider/Spinner RN-host web migrations** (post-rebuild; exact sites
  from the residue audit): SheetImplementationCustom.tsx (RN Dimensions,
  PanResponder, View measurement/responder wrappers),
  GestureDetectorWrapper.tsx (RN View), Sheet.tsx (RN Platform + RNView
  type), nativeSheet.tsx (native RN View); SliderImpl.tsx + Slider.tsx (RN
  View responder host); Spinner.tsx (RN ActivityIndicator — bounded
  standalone).
- Plan §8 (conditional context reads) and §9 (web API alignment: own base
  prop types, grid typing, style={} narrowing) — separate campaigns, after
  the engine.
- Minor: attribute-bundle-gzip's bun:test subprocess-capture issue (test
  red locally, not in CI); dot-dev generate-css module-resolution warning
  (intentional per its build); `getShorthandValue` public-removal decision.
- **SheetDragFade CSS load flake** (post-campaign, do not staff during the
  engine close): fails under the full parallel kitchen-sink run on pre-change
  baselines and passes standalone. Receipt: `e8191a082d`. Treat it as a real
  timing-window defect: replace clock-dependent sequencing with condition
  waits and stricter precondition/assertion checks. Do not add retries, sleeps,
  timeout increases, or relaxed assertions.
- **Config invalidation test-order defect** (post-campaign, separate slice):
  `configInvalidation.web.test.tsx` pin "a warmed config recognizes a theme
  added at runtime" fails when the file runs alone and passes only under
  full-suite ordering. It reproduces at `bdba800925`, so it predates the final
  engine landing. The root is known only through the `addTheme` /
  `startTransition` layer and belongs to the config-swap defect class. Receipt:
  r6416 review-application report at `154273258f`. Fix the hidden ordering
  dependency at its source; do not make the test rely on suite setup.

## 8. Fleet process (as run so far)

Workers spawn via tm on codex-sol-high (xhigh for review). Every spawn names
a REVIEW disposition. Land on local validation; the coordinator sweeps CI and
owns landing order for engine-critical branches (cp3-engine lands only via
assembled review). Size-baseline refreshes fold into the causing push.
Worker reports use RAN/TESTED/INFERRED labels; a green self-report without
the discriminating observation is not evidence.
