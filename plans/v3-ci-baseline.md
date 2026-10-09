# v3 CI baseline (scratch branch v3-ci-check)

2026-07-16. Full CI ran on `v3-ci-check` (local v3-beta with the day's
integrated stack: callbacks substrate + cancel-contract fix + Variables +
Field system + component fixes). Use this to attribute v3-beta CI failures:
everything failing below is PRE-EXISTING and owned; nothing from the
integrated stack broke CI.

- **Maestro iOS**: success.
- **Detox**: 3/4 shards green. New `FieldForm.test.ts` and `Variables.test.ts`
  auto-discovered by the shard planner and passed on CI simulators (closes
  both packets' "native not run locally" gaps). The single failure is the
  known `CompilerExtraction` "benchmark optimized vs non-optimized" flake,
  already under investigation by the release lane.
- **Checks**: two pre-existing failure classes only:
  1. Typecheck: `code/kitchen-sink/src/components/Select.tsx:177` references
     `SelectBehavior.Root`, which `@tamagui/select` does not export.
     Introduced by `2facdf38dd` (v3-evolution consolidation). The in-flight
     select-multiple worker's C3 behavior controller is the natural fix;
     otherwise the consolidation lane owns it.
  2. `tailwind*.web.test` suite load failures (TSCONFIG_ERROR), A lane owns.

Targeted CI: `.github/workflows/test-targeted.yml` (workflow_dispatch, one
playwright filter on ubuntu). Any `v*` branch push triggers the full Detox
matrix; `v3-*` also triggers Maestro iOS. Mind the shared 60/hr gh API
budget: fetch logs once to a file, never `gh run watch`.

## Update (2026-07-16, post select-multiple)

- The `SelectBehavior.Root` typecheck failure is FIXED by the select-multiple
  packet's C3 behavior controller (integrated on v3-beta).
- Remaining pre-existing Checks failure: `@tamagui/to-tailwind` missing
  tsconfig (A lane).
- Android Detox cannot launch any suite (shared AppCompat theme
  misconfiguration, 24 suites, repo-wide) — needs an owner for a dedicated
  fix packet. Expected red. PROVENANCE (2026-07-17): this entry was briefly
  replaced by an "Expo 55 launch race" root cause from a verification
  agent, then retracted: its evidence (4 suites "launched and passed" on
  Android) was an artifact — all 4 begin `if (isAndroid()) return` before
  `safeLaunchApp` (verified first-hand, e.g.
  code/kitchen-sink/e2e/SheetScrollableDrag.test.ts:30), so they pass
  trivially without launching. Byte-identical failure counts across two
  main runs on different days (29477361833 and 29380776033: 19/4/4 suites,
  72/37/20 tests, 148x AppCompat IllegalStateException) show deterministic
  total failure, consistent with a static theme misconfiguration; the Expo
  coroutine frames in the crash are the delivery path, not the cause.
- METHODOLOGY WARNING: the Android Detox job has continue-on-error: true
  and its script swallows failures ('|| echo ANDROID_TESTS_FAILED=true'),
  so the test-native workflow reports SUCCESS while every Android suite
  burns. Workflow-level green on main says NOTHING about Android. Any
  baseline claim in this doc that cites a green test-native run covers iOS
  only. Recommendation: once the Expo race is fixed, remove the
  greenwashing (or at minimum emit a visible failure annotation) — decision
  with the owner; a verification agent is iterating on a v3-ci-android-*
  branch pending owner approval.
- `test-targeted.yml` workflow_dispatch returns 404 until the workflow file
  exists on the DEFAULT branch (main) — GitHub requirement. Landing it on
  main is owner-gated; until then push v3-ci-* branches for full runs.

## Update (2026-07-17, post lockfile regen)

The merge-repair lockfile regen (236b8c11af) floated ranged deps; consequences
and fixes, in order:
- Detox went FULLY green on 236b8c11af (including the CompilerExtraction
  shard) and stayed green; Maestro green. The expo float (55.0.6 -> 55.0.28)
  rode along — relevant context for the Android investigation.
- supabase-js 2.99 -> 2.110 broke site typecheck; fixed forward in code
  (6458b5ea09).
- @playwright/test floated to a nested 1.61.1, breaking the CI browser cache;
  pinned via root overrides (manypkg-compliant) after an exact-range pin
  tripped manypkg.
- motion/framer-motion floated 12.37.0 -> 12.42.2 and broke the
  v3-ssr-hydration motion-driver tests (11 failures, first run on the merged
  tree; jobs passed on the pre-merge baseline); @vxrn/mdx-rust floated out of
  lockstep with one@1.20.4. Both pinned back via root overrides.
- Root overrides now pin: @playwright/test 1.58.2, motion 12.37.0,
  framer-motion 12.37.0, @vxrn/mdx-rust 1.20.4. Remove deliberately when
  upgrading, with the ssr-hydration suite as the gate.
- integration#test:web failure attribution pending the next run (suspected
  motion float; confirm after the override push).

## Final state (2026-07-17, 5418244f4a)

- Checks: SUCCESS (typecheck, manypkg, unit-tests including
  integration#test:web — confirming the motion float caused it, and the
  earlier tailwind-suite reds were fixed by the A-lane commits that rode the
  merge). Maestro iOS: SUCCESS.
- Detox: single failure = the known CompilerExtraction benchmark flake
  (passed on 236b8c11af, failed here; genuinely flaky, release lane owns).
- Net: origin/v3-beta is green except one known flaky benchmark and the
  Android situation documented above.
