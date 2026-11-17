---
id: t-ms9qoeaq-1vse0
title: Triage V3 animated CSS failures
status: done
assignees:
- a2667
- v3-code
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2667
commits:
- 152c86dc2a
- 24e1181511
- 6197fcf433
- 62f1a97d3a
- 8e8a280556
- 8ebfb5abe0
- cfec4cd236
- f091eeba9c
- f5a6b68baf
created_at: 1785550519394
updated_at: 1785563377537
field_marks:
  active_form: 1785550519394
  body: 1785550519394
  claim: 1785550519394
  evidence_summary: 1785550519394
  parent: 1785550519394
  priority: 1785550519394
  recovery_ref: 1785550519394
  status: 1785550519394
  title: 1785550519394
---
Classify the 34 animated-css Playwright failures and PseudoTransition flake as real V3 regression, inherited behavior, or proven threshold noise. Fix real regressions, rebuild changed packages, run isolated and relevant integration tests, commit to v3-beta, and link evidence.
