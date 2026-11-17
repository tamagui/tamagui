---
id: t-ms767zgk-wh50
title: Migrate the 20 remaining codemod-flagged kitchen-sink sites
status: done
labels:
- codemod
- migration
- v3
priority: 3
backend: git
sessions:
- a2311
commits:
- bed9c8cb73
created_at: 1785395228996
updated_at: 1785397682244
field_marks:
  active_form: 1785395228996
  body: 1785395228996
  claim: 1785395228996
  evidence_summary: 1785395228996
  parent: 1785395228996
  priority: 1785395228996
  recovery_ref: 1785395228996
  status: 1785395228996
  title: 1785395228996
---
Read AGENTS.md, CONTRIBUTING.md, plans/v3-handoff.md, plans/dom-tailwind-flat-values.md, plans/v3-handoff-log.md, and the current code/core/codemod-flat-values README before editing. Use /tmp/v3-codemod-fix-corpus.json as the starting inventory. Remove the 20 genuinely flagged migration sites while preserving each use case behavior. Ownership is limited to these files and behavior tests that directly exercise them: DialogSheetAdaptCase.tsx, DialogSheetAdaptUnmountCase.tsx, GlobalScopedTriggerIsolationCase.tsx, GroupProp.tsx, MediaQueriesV5.tsx, NumberOfLinesMediaQuery.tsx, OnLayoutStressCase.tsx, StyledRNW.tsx, ToastNativeBurntCase.tsx, ToastNativeNotificationCase.tsx, TooltipGlobalPatternCase.tsx, TooltipPositionJumpCase.tsx under code/kitchen-sink/src/usecases. Resolve token constants at their definitions, use existing media/runtime APIs for conditional behavior props, and preserve authored cascade/order. Do not invent a second parser or use string-existence tests. Never touch the seven protected runtime files, four reserved lanes, codemod package, plans/v3-handoff-log.md, generated CSS, configs, lockfiles, or files outside the ownership list without stopping and reporting. Run the codemod corpus again and require zero flagged sites in these owned files, plus relevant kitchen-sink typecheck/tests and runtime browser verification for behavior changes. Build changed packages if applicable. Commit with explicit pathspecs and a one-line conventional commit. Never push, publish, release, switch branch, stash, reset, or broad-restore. Report commit, exact files, before/after flag counts, and validation.
