---
id: t-mrjwtc6d-au90
title: Remove core unstyled compatibility plumbing
status: done
labels:
- c4
- core
- v3
priority: 3
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783988707045
updated_at: 1784007517750
field_marks:
  active_form: 1783988707045
  body: 1783988707045
  claim: 1783988707045
  evidence_summary: 1783988707045
  parent: 1783988707045
  priority: 1783988707045
  recovery_ref: 1783988707045
  status: 1783988707045
  title: 1783988707045
---
Remove remaining authored unstyled support from core web engine and obsolete tests after C4 UI sweep: useThemeState, createComponent, getSplitStyles, types.tsx, and affected focused type/runtime fixtures. Coordinate types.tsx with active A2 owner. Preserve ordinary user variant semantics under other names. Acceptance: authored source/test grep zero unstyled where it represented framework skin compatibility; final declarations regenerated later; no commit/push/broad tests.
