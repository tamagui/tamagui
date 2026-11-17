---
id: t-musrvazn-qdo0
title: Repair hook snapshot bundle growth without changing size gates
status: done
assignees:
- s8106
labels:
- branch:launch/theme-hydration
- lane:launch-theme-size-repair
- umbrella:plans/v3-zero-runtime-mode.md
backend: git
sessions:
- s8106
commits:
- 9acbfd714731cf826f2f61497ce9b5548e0a8e1a
created_at: 1791054943331
updated_at: 1791056340839
field_marks:
  active_form: 1791054943331
  body: 1791056340839
  claim: 1791054943331
  evidence_summary: 1791054943331
  parent: 1791054943331
  priority: 1791054943331
  recovery_ref: 1791054943331
  status: 1791056340803
  title: 1791054943331
---
Repair complete: 9acbfd714731cf826f2f61497ce9b5548e0a8e1a, pushed origin/v3-beta. Local branch launch/theme-hydration; retained worktree ~/.worktrees/tamagui-launch-theme-hydration. Parent r54299 owns Checks/automatic-beta CI watching. No main push, release dispatch, spawns, share, or One/docs worker edits.

Final source only: code/core/web/src/hooks/useThemeState.ts renames localState -> state and subscribedParentId -> subscribedTo. All guards and control flow preserved, including hook-owned snapshots, renderVersion strict-effects restoration and next !== r.lastSnap callback comparison. Original SSR tests and size baseline/thresholds/assertions untouched.

RAN paired rebuilt gzip level9: Node24.16.0, darwin-arm64, zlib1.3.1-e00f703, Vite8.2.2 / Metro0.84.4. Original Vite73349 -> candidate73341 (-8; baseline73341). Original Metro124081 -> candidate124077 (-4; baseline124079). Original local bytes exactly match assigned Linux CI receipts; this does not prove candidate Linux bytes. Vite is exactly at the existing limit. Parent's Linux CI final owns verdict. Next/base tiers not rebuilt locally.

TESTED unchanged SSR negative control: both tests FAIL against separate ignored pre96e0 hook fixture on stale isNew and hydration mismatch; both PASS on final source, including no recoverable errors and original host retained. TESTED71 existing web assertions in forceClassNameThemeLive, passThroughThemeLive, portalTheme, safeAreaVariables, shorthandVariables, themeProviderRegistryLeak and variables. Covers live switches, stable child subscription, ThemeUpdate rerender, portal inheritance and strict-mode cleanup. TESTED unchanged starter browser contract8/8 passes on Vite and Metro: first paint, transition, class theme switches, island mount and dynamic inline hover widths.

RAN @tamagui/web bun run build; scoped TypeScript7.0.2 tsc -b code/core/web incl source dependency references; pinned oxlint1.85.0, oxfmt, diff check pass. Vite/Metro island graph, forbidden artifact signatures and page/CSS/island size gates pass. No broadened assertions/baselines. Tracked tree clean. Watchman cookie files from crawl remain untracked; ignored fixtures/dependencies/build output retained.

Evidence: ~/Library/Caches/launch-theme-size-repair/paired.json, original/candidate-{vite,metro}-island.js(.gz), original/candidate-{vite,metro}.json with SHA256, original-source.ts, candidate-source.ts, validation.txt and build/typecheck/SSR/theme/browser logs. Reproduce with scripts/tmp/theme-size-receipts.mjs and theme-size-playwright.config.ts. Worktree node_modules now isolates all local workspace package links; missing pinned deps are in ignored scripts/tmp/theme-size-deps. Ignored Metro config watches shared external node_modules and disables stalled Watchman; held fixed across pairs. Shared main dependencies unchanged. Task-local matching Chromium archive passed unzip integrity check, then extracted with system unzip after Playwright extraction stalled. Owned test servers stopped. REVIEW: none, as assigned.
