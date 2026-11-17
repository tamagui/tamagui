---
id: t-mrka6qy7-11i90
title: Implement G0 integrated v3 canary
status: done
assignees:
- ab-mriu55kg-47600
labels:
- G0
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu55kg-47600
created_at: 1784011167727
updated_at: 1787535182217
field_marks:
  active_form: 1784011167727
  body: 1784011167727
  claim: 1784011167727
  evidence_summary: 1784011167727
  parent: 1784011167727
  priority: 1784011167727
  recovery_ref: 1784011167727
  status: 1784011167727
  title: 1784011167727
---
Reconciled 2026-08-23 by p29920.

READ - the integrated canary is present on origin/v3-beta and was exercised from packed artifacts by the later G1 campaign. plans/v3-beta3-release-readiness.md records the assembled b0bf3f7bef preview passing isolated web production plus SSR and native Expo export/runtime canaries. The current npm beta was subsequently published through the same v3 release line.

The historical G0 implementation and its real-browser/native execution are complete. Current tip CI remains tracked by t-mt6jqrpk-21lr0.
