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

## Standing constraints

- v2 release track is separate: `v2-animations-reliable` must go green before
  any v2.4.x release (worker active as of 2026-07-18).
- An agent may hold the local Xcode/iOS build resources; queue local iOS work
  behind a watcher instead of racing it.
- gh API budget 60/hr shared; fetch logs once to files.
