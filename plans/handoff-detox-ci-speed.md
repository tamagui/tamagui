# handoff: iOS Detox CI — restore 4 shards, kill the silent startup tax
date: 2026-06-11
branch: v2-fix-reanimated-stuck-hover-ci
last commit: 8fdf4e21a3 (canary2.2.0-1781217884154)
prod: n/a (CI-only work). working tree clean, nothing uncommitted.

## TL;DR — root cause found, fix not yet applied

**The workflow pre-boots + pre-installs the app on one simulator, but Detox runs
tests on a DIFFERENT simulator.** Detox cold-boots its own device inside a
totally silent gap at jest startup. That gap is **6–8 min on every iOS shard on
every run** (pure waste ×4 shards), and ballooned to **26.5 min** on one sick
runner today — which is the "one shard randomly takes 45–52m" variance that
caused an agent to panic-split the matrix into 9 shards.

Evidence (run 27366103322, job `iOS Detox Tests (4/4)`, log at
`/tmp/job-shard4-slow.log` — refetch with
`gh api repos/tamagui/tamagui/actions/jobs/80866000704/logs` if gone):

- 17:43:48 workflow boots simulator: `Booting simulator: 90D75F8C-0A6E-4EE9-AF9B-5A0B441033A5`
- 17:52–17:53 app installed + FrontBoard-verified **on `booted` = 90D75F8C** (wasted)
- 17:56:54 detox spawns jest → **silence for 26.5 minutes** →
- 18:23:23 `SheetDragResist.test.ts is assigned to F0E5DDE2-0D99-4435-A213-1F3BF88A7718 (iPhone 16)` ← **different UDID!**
- 18:23–18:35 all 8 test files actually run and pass in ~12 min.

Same-run healthy shards show the same gap, just smaller: shard 1 = 7.8m,
shard 2 = 5.75m, shard 3 = 6.5m (jest spawn → first "is assigned to", all
allocating F0E5DDE2, never the pre-booted 90D75F8C).

**Control group: the Android Detox job runs the IDENTICAL jest config and gets
jest-spawn → first assignment in 8 seconds.** So it is NOT ts-jest, NOT haste,
NOT jest startup. It's Detox iOS device allocation booting a second simulator.

Why two different devices: the workflow picks "iPhone 16" via
`simctl list devices available -j | jq ... head -1`
(.github/workflows/test-native.yml:110-115), while Detox resolves
`{ type: 'iPhone 16' }` via applesimutils with its own ordering
(code/kitchen-sink/.detoxrc.js:16-18). The runner image has more than one
"iPhone 16" (multiple iOS runtimes), each tool picks a different one.

**`.detoxrc.js` already supports pinning: `DETOX_DEVICE_UDID` env →
`{ id: process.env.DETOX_DEVICE_UDID }` (.detoxrc.js:16-18). CI just never
sets it.** The workflow already exports `SIM_DEVICE_ID` to `$GITHUB_ENV`
(test-native.yml:128).

## The fix (small, surgical)

1. **Pin Detox to the pre-booted simulator.** In the "Run iOS Detox Tests"
   step (test-native.yml:220-230ish), add to its `env:`:
   ```yaml
   DETOX_DEVICE_UDID: ${{ env.SIM_DEVICE_ID }}
   ```
   That's the whole core fix. Allocation should drop from 6–8 min to seconds
   (Android-style), and the pre-installed app + light-mode + SpringBoard-ready
   work finally applies to the device tests actually run on.

2. **Revert the 9-shard matrix back to the 4-shard layout** from commit
   990c68159f (June 3). Exact previous matrix (test-native.yml):
   ```yaml
   - shard_name: '1/4'
     test_files: 'e2e/CompilerExtraction.test.ts e2e/SafeArea.test.ts e2e/SheetKeyboardDrag.test.ts e2e/SheetFitKeyboardSafeArea.test.ts'
   - shard_name: '2/4'
     test_files: 'e2e/PressStyleNative.noRngh.test.ts e2e/CompilerTernaryActive.test.ts e2e/TabsOnInteraction.test.ts e2e/PointerEvents.test.ts e2e/GroupPressNative.test.ts e2e/ShorthandVariables.test.ts e2e/check-rngh-status.test.ts'
   - shard_name: '3/4'
     test_files: 'e2e/SheetScrollableDrag.test.ts e2e/ThemeMutation.test.ts e2e/NativePortal.test.ts e2e/GroupPressTransitionMatrix.test.ts e2e/MenuRadioGroup.test.ts e2e/PressStyleScrollStuck.test.ts'
   - shard_name: '4/4'
     test_files: 'e2e/PressStyleNative.test.ts e2e/SheetPressRegression.test.ts e2e/SheetKeyboardFitContent.test.ts e2e/SelectRemount.test.ts e2e/SheetDragResist.test.ts e2e/ThemeChangeBasic.test.ts e2e/NestedPressExclusive.test.ts e2e/MediaQueryGtMd.test.ts'
   ```
   Easiest: `git show 990c68159f:.github/workflows/test-native.yml` and copy the
   matrix + its comment block. Keep `check-ios-detox-shards.mjs` validation happy
   (it asserts every e2e file is assigned exactly once; SelectAndroidOnPress is
   android-only).

3. **(Recommended) add a startup probe so this never goes silent again.**
   A probe existed (commit 182c45dced added `e2e/detoxGlobalSetup.cjs` wrapping
   `detox/runners/jest/globalSetup` with timestamps) and was later deleted by
   b7cfd5a506 after a *wrong/partial* conclusion (blamed ts-jest type-check; the
   dedicated e2e/tsconfig.json is fine and ts-jest IS transpile-only — verified
   in node_modules/ts-jest: tsconfig `isolatedModules: true` → transpileModule
   path). Re-add it permanently (it's 13 lines, costs nothing); content is in
   `git show 182c45dced:code/kitchen-sink/e2e/detoxGlobalSetup.cjs`. Also log
   the allocated UDID vs `SIM_DEVICE_ID` mismatch as a CI warning/failure.

4. **(Optional, evaluate after 1–3)** the same agent earlier today tried
   `--reuse` + `ensureAppInstalled` (commits 3525ff9d71 "ci: reuse preinstalled
   ios detox app" + 876d6c7064 "ci: resolve ios detox project root"), then
   reverted it all in 829ba5b400. The runs for those commits were cancelled
   (superseded), so the approach was never disproven. With DETOX_DEVICE_UDID
   pinned, `--reuse` would also skip Detox's reinstall and use the
   pre-installed app. But Detox's own install onto an already-booted sim is
   ~10–20s — probably not worth the extra moving part. Don't cargo-cult it
   back; only add if measurements say install time matters.

## What today's churn did (so you don't repeat it)

All by agentbus session ab-mq9rz7l7-76586, on this branch, reacting to the
45–52m shard variance without finding the silent gap:

- 3525ff9d71 + 876d6c7064: tried --reuse/preinstall (never validated, runs cancelled)
- 829ba5b400 "ci: rebalance ios detox shards": reverted the reuse work, reshuffled shards
- 63ec36d357 "ci: split long ios detox shard"
- 61280bc533 "ci: isolate slow ios detox tests" → current HEAD state: **9 shards**,
  several single-file (2/9 = SheetScrollableDrag alone, 4/9 = PointerEvents
  alone, 5/9 = SheetDragResist alone, 6/9 = NestedPressExclusive alone).
  Sharding more does NOT fix this: each shard pays its own 6–8 min allocation
  tax, and any shard can draw the 26-min sick-runner version.

## Cost model (why 4 shards is right)

Per-shard fixed overhead today: ~10 min runner setup/deps + ~2.5 min Metro
prewarm bundle + **6–8 min silent detox allocation (the bug)**. Test exec for
the whole iOS suite is only ~45–50 min total. With the allocation tax gone:
fixed ~13 min + ~12 min tests/shard ≈ **~25 min/shard on 4 shards** — exactly
the historical good state the user wants back.

Reference timings (all fetched today, JSONs in /tmp/run-*.json):
- run 27366103322 (today, 4 shards): 30.4 / 28.2 / 38.3 / 52.5 min
- run 27312414050 (Jun 10 main): 18.1 / 34.2 / 44.8 / 20.2
- run 27240438656 (Jun 9 main): 11.2 / 31.1 / 45.9 / 39.1
- run 26930471415 (Jun 4 main): 38.9 / 34.9 / 18.4 / 45.1
- Android full suite: 12–13 min, every run. Validate iOS shards job: 0.2 min.

The remaining variance after the fix should mostly disappear; if a residual
slow shard remains, check "iOS Bundled <N>ms" lines first (memory: a sick
runner once took ~22 min for the cold Metro bundle vs ~1 min normal — that is
a different, rarer failure).

## Key files

- `.github/workflows/test-native.yml` — shard matrix (~line 54-85), boot step
  (101-128), wait-for-boot (148-163), app install (181-212), run step (~220).
- `code/kitchen-sink/.detoxrc.js` — `DETOX_DEVICE_UDID` support :16-18;
  testRunner/jest setup; maxWorkers 1.
- `code/kitchen-sink/e2e/jest.config.js` — haste scoped to e2e, ts-jest with
  dedicated `e2e/tsconfig.json` (transpile-only, verified working — do NOT
  re-litigate this).
- `code/kitchen-sink/e2e/utils/detox.ts` — safeLaunchApp with 70s/attempt +
  165s deadline + per-file breaker. This code is GOOD; it bounds launch hangs.
  The 26-min hang was BEFORE any of this runs (device allocation).
- `code/packages/native-ci/src/run-detox-ios.ts` — CI runner: ensureIOSFolder →
  ensureIOSApp → withMetro(prewarm bundle) → `npx detox test ...`.
- `code/scripts/check-ios-detox-shards.mjs` (referenced by "Validate iOS Detox
  Shards" job) — asserts shard coverage; update alongside matrix edits.

## How to verify

1. Make changes on this branch (it's already a CI-fix branch) or a fresh one
   off it. `git add` exact paths, one-line conventional commit, `ci:` prefix.
2. Push, then watch the `test-native.yml` run **without `gh run watch`**
   (60/hr API budget; use ScheduleWakeup every ~10 min, fetch
   `gh run list --workflow=test-native.yml --limit 3` once per wakeup,
   logs once per job: `gh api repos/tamagui/tamagui/actions/jobs/<id>/logs > /tmp/x.log`).
3. In each iOS shard log, assert:
   - [ ] `is assigned to <UDID>` matches the `Booting simulator: <UDID>` line
   - [ ] gap from `detox[<pid>] B ... jest --config` to first `is assigned to`
         is < 60s (was 5.75–26.5 min)
   - [ ] probe prints globalSetup start/end timestamps
   - [ ] all 4 shards < ~30 min wall, no shard > 35 min
   - [ ] Validate iOS Detox Shards job passes (coverage exactly-once)
4. Re-run / observe at least 2 green runs before declaring victory — single
   green run proves nothing about variance. Then this should go to a PR
   targeting main (never push main directly).

## Gotchas

- zsh + sandbox: `ps` doesn't work; `rg` from repo root needs `cd /Users/n8/tamagui`
  first (some earlier commands silently ran from code/kitchen-sink).
- `gh run watch` is banned (drains the 60/hr API budget in minutes). Fetch
  logs ONCE to /tmp and grep locally.
- The same-UDID-across-shards illusion: every shard VM clones the same image,
  so "F0E5DDE2 on all 4 shards" does NOT mean one device — it's 4 VMs with
  identical device sets. Don't let that confuse the analysis.
- `simctl shutdown all` at the top of the boot step kills any image-prebooted
  sim; that's fine once Detox is pinned to the one we boot.
- An agentbus session (ab-mq9rz7l7-76586) was active on this branch today; check
  `agentbus summary ab-mq9rz7l7-76586` before pushing in case it's still alive.
