# v3 beta campaign — consolidated plan and status

Updated 2026-07-18. This is the single source of truth for beta exit, superseding
the beta-relevant queues in `next.md` and the per-lane status scattered across
`plans/` (per the review's consolidation ask). Anchor review:
`docs/reviews/v3-beta-review-2026-07-17.md` (verdict HOLD, audited `5418244f4a`).

Big change since the review: the C4 unstyled sweep, canonical skins, DRY shadcn
registry, state grammar, and the review's correctness fixes were found on
`v3/reassembly` (never in the reviewed SHA), merged to `v3-beta`, and pushed as
`61ab5e4b84` on 2026-07-18. First-ever CI run on that work is in flight.

## Decisions log

1. **Packaging (old OQ1): RESOLVED, user-approved 2026-07-18.** `tamagui` keeps
   behavior primitives as the main export; styled skins live at subpaths inside
   `tamagui` (`tamagui/unstyled`, per-component subpaths); `@tamagui/ui` is the
   unstyled home. The separate `@tamagui/kit` package from the earlier draft was
   NOT built and is not planned; skins in `tamagui` are the canonical source.
2. **v1 compat surfaces: REMOVE, user decision 2026-07-18.** The retained v1
   Button (`code/ui/button/src/v1`) and v1 imperative Toast (which still owns the
   primary `Toast` export) go away. Rationale: same as the v1→v2 transition, no
   need to ship the old surface into v3. Work item T1 below.
3. **Surface component / ThemeableStack:** direction is specced and accepted but
   not executed. `plans/variables.md` (coordinator-accepted): "Surface is a
   copied fixture, not a framework hook" — a user-owned copied `Surface` skin
   reads conventional variables (`$surfaceBorder`, `$focusRingColor`,
   `$disabledOpacity`, `$pressScale`, easings) via the shipped `<Variables>`
   primitive; behavior components never read them. `next.md` companions: remove
   component themes in favor of `theme="surface1-3"` sub-themes, remove or
   simplify `ThemeableStack`/`SizableStack` (docs already treat stacks as plain
   YStack extensions). Work item T2 below executes this as: delete the
   ThemeableStack variant system from behavior packages, ship `Surface` as a
   copied skin fixture in the canonical skin set + registry.
4. **OQ2 "atom one": CLOSED as moot (2026-07-18).** The phrase was a
   voice-dictation artifact recorded from an earlier session; the user does
   not recognize it. No decision was hiding behind it. The unstyled docs
   baseline is simply the bare behavior primitives.
5. **Surface defaults: nothing on by default (user, 2026-07-18).** A bare
   `<Surface>` renders no chrome or interaction styling; all facets opt-in.
   See `plans/surface-levels.md`.
6. **Benchmarks (review Gate 4) stay deprioritized to the very end** (user call,
   unchanged).

## Landed (post-merge v3-beta @ 61ab5e4b84)

- Behavior/aesthetic separation for the 10-component beta set: Button, Select,
  Sheet, Accordion, Dialog, Slider, Toggle, Input/TextArea, ListItem, Toast.
  Canonical skins + per-component manifests in `code/ui/tamagui/src/components/`.
- `@tamagui/ui` unstyled package, `tamagui/unstyled` + per-component subpaths.
- DRY shadcn registry (`scripts/generate-registry.ts`, `registry/json/r/*.json`)
  with blank web/Expo CI install fixtures.
- Review correctness fixes present in history: C1 Dismissable bookkeeping,
  C4 nested Button, D2 Popover aria-controls (`d235edc4c9`), C2 CSS exit
  completion, C3 animated-number, P4 Motion per-value splitter (`2298a42c6f`),
  D1 migration docs (`976f589252`).
- Perf hot-path work: ref-clone removal (`bd18969c1d`), dead baseProps merge +
  no-compound fast path (`d46390d6e1`), motion per-render memoization
  (`2a17f57173`), flat group syntax fix (`ca26eed780`).
- A1 state vocabulary in style grammar (`c87e3d375e`, `d481fdc6e1`) — note
  runtime wiring is "dormant until style-grammar reassembly" per `7b89542c59`,
  see T4.
- `<Variables>` primitive: web + native packets landed, iOS-simulator validated
  (Detox 5/5), including custom config variables. See `plans/variables.md`.
- Whole-monorepo typecheck passes; full package build passes (165 tasks); motion
  conversion contract test passes.

## Remaining work to beta

Execution started 2026-07-18 (user: "get us all the way"), fully parallel per
user 2026-07-19. Assignments:
T1+T2 → `v3/t12-v1-removal-surface` — PR #4137. Toast regression fixed and
  verified (simulator + CI Maestro + web). Now also carries T5's docs and the
  compiler determinism fix. Awaiting a full run on `3e1de5df1b`. NOTE: Android
  has never run on this branch (the `v*` push glob does not match slashes) —
  its Android signal arrives on the `v3-beta` push run after merge;
T3 → `v3/t3-native-ci-truth` — PR #4140. **iOS Detox green (all 4 shards)** —
  the `scrollTo` wedge is fixed and observed. Android still iterating: the
  `atIndex` fix landed and exposed two further bugs (a tap parked behind the
  nav bar by `whileElement`'s 75%-visibility stop, and an assertion race —
  `withSync` re-disables synchronization in its `finally`, so reads after it
  run unsynchronized);
T4 → `v3/t4-state-wiring` — DONE, merged (`72b550b1b0`);
T5 → `v3/t5-docs-migration` — DONE, merged 2026-07-19 (#4138) into T12;
T7 → `v3/t7-benchmarks` — DONE, merged 2026-07-19 (#4139).

Merge order (forced by the push-run/Android facts above): #4137 → `v3-beta`
first, which both unblocks bento (it needs the v3 contract on `v3-beta`) and
produces the first real Android run for the contract work. #4140 merges on its
own push-run Android verdict, not on its PR rollup.

T7 result (production builds, 200 items / 60 heavy, 10 samples, mount ms):
v3 compiled beats v2.4.6 compiled on the workloads that matter — group
19.3 vs 43.8, heavy 18.8 vs 24.9, animated 15.8 vs 21.5; simple/rich are a
wash (0.54 vs 0.47). Both are still far off Tailwind/inline on group/heavy
(1.3 / 2.6), which is the pre-existing gap Gate 4 exists to attack.

Native Toast regression (T12, found and FIXED 2026-07-19, `259b5b2b25`).

Root cause: `withStaticProperties` does `Object.assign(component, staticProps)`
— it mutates in place. The new Toast skin composed straight onto the imported
behavior component:

```tsx
function ToastList(props) { return <ToastBehavior.List ... /> }   // lazy read
export const Toast = withStaticProperties(ToastBehavior, { List: ToastList })
```

so `ToastBehavior.List` *became* the skin's `ToastList`, and that function reads
`.List` at render time — i.e. itself. `Viewport` survived because
`Viewport: ToastBehavior.Viewport` is captured when the object literal evaluates,
before the mutation. Native-only because on web `tamagui` and `@tamagui/toast`
resolve to separate ESM instances (the same split behind the "conflicting star
exports" warning), so the mutation landed on a different object; on native both
resolve through one CJS instance.

Confirmed by runtime instrumentation, not inference: publish reached exactly one
subscriber, `ToastRoot` re-rendered with `toasts.length = 1`, `ToastViewport`
rendered with `ctx.toasts.length = 1` and children count 1, and the behavior
`ToastList` was never entered; a demo-side probe printed
`Toast.List name = ToastList | Viewport = WithTheme`. Fix: capture the behavior
parts up front and hang the styled parts on a distinct root. Verified on the
iOS simulator — `toast-item` visible + swipe-to-dismiss, the exact assertion
that failed 3/3 in CI.

**Follow-up (not done, deliberately deferred):** four sibling skins — Dialog,
Accordion, Slider, ToggleGroup — also call `withStaticProperties` on components
imported from `@tamagui/ui`, so they graft styled parts onto the unstyled
package's own exports for every consumer. They don't self-recurse (each reads
its parts eagerly via `styled(UiX.Part, ...)`), so nothing is broken today, but
it contradicts the three-layer contract that `@tamagui/ui` is the unstyled home.
Fixing it means wrapping roots like `UiSlider`, which is a styled frame, and
that risks breaking `styled()` extension and the compiler — too much to fold
into this PR. Fix it in its own change, with `styled(Slider)` coverage.

Integration policy (user 2026-07-19): worker branches validate on their own
PRs in parallel; v3-beta takes BATCHED merges of already-green branches (one
PR stacking the small ones) so the ~45m full matrix is paid once per batch,
not per branch. Repo only allows squash merges. Post-merge v3-beta runs are
confirmations, not gates.

Known issue parked for the perf/Gate-4 lane (found by T12): a variant block on
a styled() wrapper around an animated node crashes the native Animated
driver's interpolation — worked around by keeping v2-compat variants on the
animated behavior frames; the driver fragility itself is unfixed.

T1. **Remove v1 surfaces** (decision 2). Delete `code/ui/button/src/v1` and the
    v1 Toast; the unstyled behavior + skins own the primary export names.
    Sweep re-exports, types, docs, kitchen-sink/canary usages. Migration note in
    upgrade guide.

T2. **Fleet tail + Surface** (decision 3). Strip remaining aesthetics from
    Card, Progress, Label, Separator; replace the stacks/ThemeableStack variant
    system with the copied `Surface` fixture + `surface1-3` sub-themes + the
    skin-kit variable conventions. Manually confirm Switch, Checkbox,
    RadioGroup, Tabs, Avatar, Group are clean (heuristic grep says yes).
    Acceptance: review Gate 1 fleet-wide (no theme colors, visual padding
    scales, radii, borders, elevation, or opinionated states outside a reviewed
    structural allowlist).

T3. **Native CI truthful (R1, P0)** + **G1 publish bytes (R3)** + **starter
    (R2)**. Only a wip commit exists (`6723976e32`). Android AppCompat launch
    fix, remove `continue-on-error` + shell failure swallowing, stabilize the
    iOS CompilerExtraction benchmark, produce One iOS/Android production
    bundles, make G1 the artifact path for the actual publish, replace starter
    placeholder `true` tests and consume copied skins in the starter.

T4. **A1 runtime wiring.** Un-dormant the shared state vocabulary so `open:`,
    `checked:`, `invalid:` modifiers resolve to data selectors on web and
    component state on native, then regenerate registry skins on it.

T5. **Docs.** Verify the 3-mode docs toggle (UNSTYLED / STYLED / TAILWIND,
    branch `v3/docs-toggle-migration`) is merged and working against the landed
    packaging; regenerate migration guide snippets against final exports
    (compiled fixtures); document decision 2's removal.

T6. **CI green on v3-beta @ 61ab5e4b84** (in flight 2026-07-18): Checks +
    Detox + Maestro on the merged tree, first validation of the reassembly work
    and the universal render-path rewrites it contains.

T7. **Benchmarks last** (Gate 4): v2.4.6 column, equal workloads, production
    builds, retained samples; enforce bundle budgets.

Then Gate 5: clean-checkout release candidate, freeze artifacts, explicit user
approval to publish (never automatic).

## T6 CLEARED: v3-beta fully green including Android (2026-07-19, `c2516230b2`)

First genuinely-complete native validation of the merged campaign:

```
Checks | Registry | Test iOS Native (Maestro)          success
Native Tests (Detox):
  Android Detox Tests                                  success
  iOS Detox Tests 1/4 2/4 3/4 4/4 + auto-discovered    success
  Build Android App | Build iOS App                    success
  Build One Production Native Bundles                  success   (review R3)
```

Two reasons this is the meaningful checkpoint rather than just another green:

1. **It is the first Android run the component contract has ever had.** #4137 could
   not get one on its own branch — the `v*` push glob does not match slashes — so
   the v1 removals, Surface, facets and behavior/skin split were merged on iOS +
   Maestro evidence alone. This run is what actually cleared them on Android.
2. **It runs against the post-#4140 CI**, so a green Android result now means the
   job ran, rather than reporting success while skipping.

Cost note for future campaigns: three earlier attempts at this verdict were
cancelled, because everything on `v3-beta` — pushes, merges and `workflow_dispatch`
— shares the concurrency group `Native Tests (Detox)-refs/heads/v3-beta` with
`cancel-in-progress: true`. Small doc pushes killed expensive macOS/emulator runs
twice. **Batch pushes to `v3-beta` while a native run is in flight, or push while
the run is still queued** (restarting a queued run is free).

## Compiler emits nondeterministic output (found 2026-07-19) — beta-blocker class

`code/tests/next-webpack/tests/exports.unit.test.ts` is not a stale snapshot, it
is a **flaky check over nondeterministic compiler output**. Same commit, caches
(`.tamagui`, `node_modules/.cache`) cleared before each run, three runs:
pass / fail / pass — and the failures differ from each other:

- atomic classes emitted in a different ORDER on a Separator (identical class
  set, order-only), and
- an `h1` sometimes gaining `_tt-f-transform44812` (a font-derived
  `textTransform`) and sometimes not.

Ordering is cosmetic — each atomic class is its own CSS rule, so the cascade is
decided by stylesheet order, not className order. A class appearing or not is
NOT cosmetic: that is a real visual difference and suggests the compiler
sometimes drops a style it should emit. Treat the two symptoms as potentially
separate bugs.

Why this matters beyond CI: non-reproducible builds. Same source in, different
bytes out.

**This retroactively explains a chain of wrong conclusions**, recorded so nobody
re-derives them: #4138's "Separator ordering" failure, #4137 passing at
`0008581e6c` and failing after, and a local "8 passed" that became a failure on
rerun were all this one flake. A bisect run against it is a coin flip — an
attempt to attribute the failure to a `sandbox-ui` star-export change was wrong
and was reverted back in (`f21f7fae7f`). Do not bisect against this test until
it is deterministic, and do not read a single green run on these PRs as proof.

**ROOT-CAUSED AND FIXED 2026-07-19 (`e39285988c`, on the T12 branch).**

`bundleConfig()` (`code/compiler/static/src/extractor/bundleConfig.ts`) wrote the
web and native bundles to the SAME paths (`.tamagui/tamagui.config.cjs`,
`.tamagui/<mod>-components.config.cjs`). Those bundles are not interchangeable —
`bundle.ts` inlines `process.env.TAMAGUI_TARGET` as a literal via esbuild
`define`. A reuse check then skips rebuilding when the output file is **less than
3 seconds old**. So when two `tamagui build` invocations land within 3s, the web
pass finds the native pass's file "fresh" and loads the **native** bundle as the
web config. Native variables are `variable: ''`, so every CSS-variable-backed
class collapsed (`_gap-c-space-4` → `_gap-`, `_col-color12` → `_col-`) and the
web-only `_pos-relative` / `_ws-normal` defaults vanished. Self-sustaining: each
process's native pass refreshed the mtime for the next process's web pass.

Not a race in the usual sense — a cache keyed on **elapsed time** over a
**platform-ambiguous path**. That is why isolated runs never reproduced it (40/40
clean standalone) while the vitest suite — 7 builds back-to-back sharing one
`.tamagui` — failed ~25%.

Fix: platform-scope the paths (`tamagui.config.web.cjs` / `.native.cjs`, same for
component bundles), plus `allFiles.sort()` in the CLI since chokidar `add` order
isn't guaranteed. Same 30 cold runs: **7/30 failures → 0/30**, byte-identical
output.

Severity correction: the earlier "ordering is cosmetic" framing understated this.
The observed failures were not reordering — classes were **dropped** and variable
references **emptied**. That is a real visual break, not a reproducibility
annoyance.

Two consequences worth keeping:
- `_tt-f-transform44812` on H1 SHOULD be emitted. `createFont`'s `processSection`
  forward-fills the heading font's `transform: { 6: 'uppercase', 7: 'none' }`
  across all 16 size keys, so size 10 resolves to `none`, backed by a real rule
  `._tt-f-transform44812{text-transform:var(--f-transform-10);}`. The old snapshot
  lacked it because it was captured during a contaminated run.
- **A genuine behavioural bug fell out of this:** native `pointerEvents="none"`
  was being deleted, because the native pass had been running with web semantics.
  Pointer events were not actually disabled on native.

## Reading native CI correctly: "Android Detox Tests" is SKIPPED on PR runs

`.github/workflows/test-native.yml:579` gates the Android job on
`github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/heads/v') ||
github.ref == 'refs/heads/rn82'` — deliberately, per its own comment ("not PRs").
A `pull_request` run's ref is `refs/pull/<n>/merge`, so **Android is skipped on
every PR run** and only really executes on the push-triggered run for the branch.

Consequences, learned the hard way 2026-07-19:

- `gh pr checks <n>` shows the PR run, where `Android Detox Tests` reports
  *skipped*. Skipped is not a failure, so naive "any failures?" queries — including
  the ones used to drive merges in this campaign — count it as fine. A PR can look
  entirely green having never run Android on the merged commit.
- Which branches get a push run at all is a second trap. `test-native.yml` triggers
  on push for `main`, `native-*`, `v*`, `rn82` — and in GitHub Actions branch globs
  **`*` does not match `/`**. So:
  - `v3-beta` matches `v*` → push run, Android RUNS.
  - `v3/t12-v1-removal-surface` does NOT match (the slash) → **no push run at all**,
    so Android has never run on that branch.
  - `v3/t3-native-ci-truth` gets push runs only because that branch itself added
    `v3/**` to the triggers (`d3841defef`).
  Enumerate per SHA and read the `event=push` one:
  `gh run list --branch <b> --json event,headSha,name,status,conclusion`.
- **Do not merge a native-affecting PR on the PR rollup alone.** Confirm the push
  run's Android job actually ran and passed for that exact SHA.

To be accurate about severity: this is NOT the R1 greenwashing bug in another form.
R1 was Android reporting success without being exercised. Here Android really does
run, on the push run, and every Android result analysed in this campaign came from
those runs. The skip is deliberate and commented, a runner-cost choice.

The real consequence is narrow but still bites: a merge decision made purely on
PR-green is not backed by Android evidence, because that check set does not contain
an Android run. Hence the rule above — read the push run before merging anything
native-affecting. Whether to also run Android on PRs is the repo owner's cost call.

## Carried into main with T3 (#4140, merged 2026-07-19) — two open items

1. **`AdaptLiveSlotSpike` test 2 is flaky on Android.** It merged green, but on the
   verifying push run its first attempt failed on a full 10s timeout waiting for
   `sheet typed: sheet-ios` and passed only on `[Retry #1]`. The same anchor passed
   first-try in an earlier run, so it is intermittent, not systematic. On the branch
   whose whole point is that green means green, a retry-dependent pass is a soft
   green and is recorded as such rather than quietly accepted.
2. **Flakes that pass on retry retain no artifacts**, which is why (1) could not be
   diagnosed. The Android log-retention step is failure-only, so a retried-but-passed
   job uploads nothing. That is a real observability gap and the blocker on fixing
   (1) — closing it is a prerequisite, not a nice-to-have. Guessing without artifacts
   produced both wrong turns in this file's history.

Also unexplained and deliberately not "fixed" from first principles: Android reported
`sheet-live-slot-press-count` as 0% visible while the failure screenshot shows it on
screen at ~2018/2280, clear of the nav bar at ~2160. Worked around with a
per-platform scroll anchor; the contradiction is documented in-code with a warning
that it needs a view-hierarchy dump, not reasoning.

## Native suite carries 37 deliberately-skipped tests

The Android Detox run reports `4 skipped suites, 37 skipped tests`. These are
source-level `describe.skip` / `it.skip` in `PressStyleNative`, `SheetKeyboardDrag`
and `SheetDragResist`, with identical counts on `origin/main` — pre-existing and
deliberate (SheetDragResist's are documented Detox `swipe()` limitations), NOT
silent CI skipping. Recorded because "green while not exercising anything" is
exactly what the T3 lane exists to eliminate, and a reader comparing totals should
know these are intentional. Worth revisiting on their own merits before 1.0; not
touched by this campaign.

## `wrapChildrenInText` bugs (found 2026-07-19, fixed in #4141)

Surfaced while fixing T3's Android matcher, and initially mis-filed as a
test-matching quirk. The owner pushed back — "isn't it supposed to join adjacent
text?" — which reclassified it as a product bug. Verified at runtime:

```
['increment ', 'slot']  ->  2 separate <Text> elements
['Count: ', 5]          ->  <Text>"Count: "</Text> + a RAW, unwrapped 5
```

1. **Adjacent text children were not joined.** `<Button>increment {name}</Button>`
   rendered as sibling text nodes: visible gap, `ellipsis`/wrapping applied per
   fragment instead of across the string, and assistive tech (plus native matchers)
   saw fragments rather than one label.
2. **Numbers were never wrapped** — the check was `typeof child === 'string'`, so a
   bare number leaks into the frame and throws "Text strings must be rendered within
   a `<Text>` component" on native.

Fix groups adjacent string+numeric children into one `Text`. Notably **no snapshot
changes were required** (static 98, webpack 18, exports 8/8 cold), so compiled output
of real screens is unaffected.

Lesson worth keeping: iOS hid this by merging fragments into a single accessibility
element. Only Android's stricter matcher told the truth, and the first instinct was
to work around the messenger.

## Small known defects (pre-existing, not regressions)

- **`accessibilityLabel` leaks to the DOM on web.**
  `code/ui/toast/src/ToastComposable.tsx:1139` forwards
  `accessibilityLabel={rest.accessibilityLabel}` to `ToastPositionWrapper`, and it
  reaches a DOM node, so React logs "React does not recognize the
  `accessibilityLabel` prop on a DOM element" for every toast on web. Observed in
  a Playwright probe of the Toast demo. Identical on `v3-beta`, so it is NOT from
  the T12 contract work — left alone to keep #4137 from growing further. One-line
  fix, worth doing before beta since it is console noise in every consumer app.

## Release-coupled: bento

The bento checkout (bundled by tamagui.dev when `hasBento`) consumed removed
v1 Toast APIs + ThemeableStack. Resolution (2026-07-19): bento gets a `v3`
branch fully migrated to the v3 contract; the v3-beta site pins to it; the
ThemeableStack compat shims were dropped to keep the removal decision pure.
**At v3 release: bento `v3` merges to bento main together with the tamagui.dev
cutover** — they deploy as a pair, since bento main must keep building against
tamagui v2.4.x until prod flips.

Routing (2026-07-19): the toast/ThemeableStack migration landed on bento `v3`
(e17522f); the remaining tail (createSwitch reconstruction + whatever
build:prod surfaces next) is a dedicated lane on branch bento `v3`. The
bento-complete site prod build is a RELEASE gate, not a merge gate for the
tamagui component-contract PRs.

## Standing constraints

- v2 release track is separate: `v2-animations-reliable` must go green before
  any v2.4.x release (worker active as of 2026-07-18).
- An agent may hold the local Xcode/iOS build resources; queue local iOS work
  behind a watcher instead of racing it.
- gh API budget 60/hr shared; fetch logs once to files.
