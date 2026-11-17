---
id: t-mrjy3gvu-dli0
title: Implement opt-in size primitive
status: done
assignees:
- ab-mriu8jpk-92079
labels:
- c0
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu8jpk-92079
created_at: 1783990859322
updated_at: 1784227048420
field_marks:
  active_form: 1783990859322
  body: 1783990859322
  claim: 1783990859322
  evidence_summary: 1783990859322
  parent: 1783990859322
  priority: 1783990859322
  recovery_ref: 1783990859322
  status: 1783990859322
  title: 1783990859322
---
Implement plans/v3-evolution.md C0 in the shared consolidate worktree. Atomically replace code/core/sizable-context with code/core/size (@tamagui/size); no alias or compatibility export. The new package depends on @tamagui/web only, never @tamagui/core. Public API: typed SizeContext singleton for token/raw sizes, createSizeContext, createSizeTable with exact named unions/literal projections and separate runtime context instances (do not claim structural type distinctness), and resolveTokenSize using A2 category-aware defaults so true independently resolves size/space/radius/fontSize while explicit token names remain same-key and numbers literal. Migrate helpers-icon and tabs imports/dependencies/references, remove helpers-icon context re-export, remove the stale toggle-group dependency, export through core and tamagui, update root project references and bun.lock, regenerate declarations, add focused type + web/native no-cross-talk/token fixtures, build/pack and exact zero grep for SizableContext and @tamagui/sizable-context. Preserve B2 UI changes. Engine task currently owns web/types/styled/propMapper and web/core declaration build: begin with new package and disjoint consumer files, and coordinate before editing core exports/manifests or running install/build. No commit or push.
