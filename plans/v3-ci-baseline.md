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
  fix packet.
- `test-targeted.yml` workflow_dispatch returns 404 until the workflow file
  exists on the DEFAULT branch (main) — GitHub requirement. Landing it on
  main is owner-gated; until then push v3-ci-* branches for full runs.
