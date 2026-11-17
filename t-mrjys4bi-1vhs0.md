---
id: t-mrjys4bi-1vhs0
title: Complete E2 old-new parity corpus
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
created_at: 1783992009438
updated_at: 1784227044044
field_marks:
  active_form: 1783992009438
  body: 1783992009438
  claim: 1783992009438
  evidence_summary: 1783992009438
  parent: 1783992009438
  priority: 1783992009438
  recovery_ref: 1783992009438
  status: 1783992009438
  title: 1783992009438
---
Complete the missing plans/v3-evolution.md E2 acceptance gate in /Users/n8/.worktrees/tamagui-v3-consolidate: run a representative current @tamagui/static snapshot corpus through both the legacy extractor and the new analyzer IR/graph, plus compiled-JSX cases, compare normalized observable results, and require every difference to have an explicit correctness explanation. Own code/compiler/analyzer-spike plus the smallest dedicated E2 parity fixture/harness under code/compiler/static-tests if needed; do not switch adapters or edit Vite/Metro production paths. Preserve current static test semantics, avoid hard-coded unstable snapshots, and keep runtime bounded. Run the focused old/new parity corpus, analyzer check/correctness/source-map gates, format/lint/diff. No commit/push.
