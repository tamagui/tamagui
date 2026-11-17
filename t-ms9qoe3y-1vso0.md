---
id: t-ms9qoe3y-1vso0
title: Close V3 shorthands CI and diagnostics defects
status: done
assignees:
- a2670
- v3-code-b
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2670
- v3-code-b
commits:
- 4c8fbff2f1
- 7b83810f3a
- b400a1ca38
- f3a55aa8c4
created_at: 1785550519150
updated_at: 1785561392693
field_marks:
  active_form: 1785550519150
  body: 1785550519150
  claim: 1785550519150
  evidence_summary: 1785550519150
  parent: 1785550519150
  priority: 1785550519150
  recovery_ref: 1785550519150
  status: 1785550519150
  title: 1785550519150
---
Fix conf.shorthands transition CSS, then optimized/native/next15 CI failures, then noteOnce once-per-process-per-message behavior. Avoid Fable-owned dirty files until wiring lands. Rebuild packages, run relevant tests, commit each coherent change to v3-beta, and link evidence.
