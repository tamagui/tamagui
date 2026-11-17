---
id: t-mrk7xr1l-3hp0
title: Complete E5 shared compiler conversion and remove Babel traversal
status: done
labels:
- E5
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu8n1e-93569
created_at: 1784007388713
updated_at: 1784227022822
field_marks:
  active_form: 1784007388713
  body: 1784007388713
  claim: 1784007388713
  evidence_summary: 1784007388713
  parent: 1784007388713
  priority: 1784007388713
  recovery_ref: 1784007388713
  status: 1784007388713
  title: 1784007388713
---
E5 full conversion is source-complete in the consolidated worktree (no commit/push per coordinator).

Implemented:
- Froze legacy E2/E3 output as data fixtures; parity tests no longer execute legacy traversal.
- Moved every compiler entry point to CompilerFrontend -> ProjectGraph/materialize -> lowerModule/applyLoweredModule: Vite, Metro, webpack/Next, and CLI.
- Migrated the static web/native corpus and lib/extract harness to the shared compiler.
- Deleted @tamagui/babel-plugin, @tamagui/static-sync, @tamagui/static-worker, the static worker entry, legacy traversal implementation, fallback switches, old traversal declarations/exports, package refs, and native Babel config usage.
- Updated Expo starter/Metro configs, active compiler docs, nested/root locks, and starter contract tests.
- Fixed adapter-runtime defects found by real gates: CLI CJS createRequire and single-file output root; loader CSS package subpath; Next bundled-webpack DefinePlugin identity; Vite pre-build framework-analysis transform guard.

Validation:
- Package builds green: compiler-core, static, loader, vite-plugin, metro-plugin, next-plugin, CLI.
- bun install --frozen-lockfile: green/no changes.
- Static corpus: native 29/29; web 98 passed + 1 skipped; webpack runtime 18/18.
- Frozen E2/E3 parity/lowerer: 14/14.
- Vite compiler/environment/tailwind: 11/11.
- Metro subprocess cache + applied native lowering/runtime: 2/2.
- CLI built-CJS single-file compile/CSS runtime regression: 1/1 (8 flattened candidates).
- Next-site production webpack build: green, static routes generated.
- Remix/create-tamagui starter contract: 10 passed + 1 skipped; real client+SSR React Router build green.
- Pack dry-run: compiler-core 74, static 107, loader 52, metro 57, Vite 34, Next 16, CLI 54 entries; zero test artifacts.
- analyzer-spike typecheck green.
- oxfmt check green (155 files), oxlint 0 warnings/errors (142 files), git diff --check green.
- Explicit legacy grep over code/library/root manifests+lock: zero matches for old Tamagui Babel/static-worker/static-sync packages, createExtractor, extractToClassNames, extractToNative, getBabelPlugin, and _disableLoadTamagui (excluding unrelated @tamagui/babel-plugin-fully-specified by exact regex).
