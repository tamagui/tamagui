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
T1+T2 → `v3/t12-v1-removal-surface` (Opus xhigh) — PR #4137, lint green,
  **blocked on a real native Toast regression** (see below);
T3 → `v3/t3-native-ci-truth` (Sol xhigh) — PR #4140 opened 2026-07-19;
T4 → `v3/t4-state-wiring` (Opus high) — DONE, merged (`72b550b1b0`);
T5 → `v3/t5-docs-migration` (Opus high, stacked on T12) — PR #4138, was red
  only from staleness (branched before the snapshot refresh + oxfmt); base
  merged in, lint fixed;
T7 → `v3/t7-benchmarks` (Sol high) — DONE, merged 2026-07-19 (#4139).

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

Under investigation on the T12 branch. Fix belongs in the compiler (stable total
ordering / remove the shared-state race), NOT in sorting classes in the test and
NOT by refreshing the snapshot.

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
- Branches named `v*` (e.g. `v3/t12-v1-removal-surface`, `v3/t3-native-ci-truth`)
  DO get real Android signal, but from the **push** run. Enumerate runs per SHA and
  read the one with `event=push`: `gh run list --branch <b> --json event,headSha,...`.
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
