---
id: t-mrjynyxi-u0y0
title: Validate E2 shared analyzer IR
status: done
assignees:
- ab-mriu8n1e-93569
labels:
- e2
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu8n1e-93569
created_at: 1783991815830
updated_at: 1784227052196
field_marks:
  active_form: 1783991815830
  body: 1783991815830
  claim: 1783991815830
  evidence_summary: 1783991815830
  parent: 1783991815830
  priority: 1783991815830
  recovery_ref: 1783991815830
  status: 1783991815830
  title: 1783991815830
---
Validate the integrated code/compiler/analyzer-spike draft in /Users/n8/.worktrees/tamagui-v3-consolidate. Own only code/compiler/analyzer-spike. Run its typecheck/build/correctness/source-map harness using the merged Yuku dependency; fix concrete source/harness defects only within that directory, preserving UTF-16 spans, complete/incomplete ElementIR, host-resolved IDs, stable sorting, Result-only evaluation, and exact invalidation. Do not touch public static/Vite/Metro adapters, manifests/lock, or other packages. Finish with focused tests/harness, oxfmt/oxlint/diff check, and exact evidence. No commit/push.
