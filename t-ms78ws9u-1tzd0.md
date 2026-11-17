---
id: t-ms78ws9u-1tzd0
title: Align and migrate V3 transitions
status: done
labels:
- transitions
- v3
priority: 3
backend: git
created_at: 1785399745314
updated_at: 1787535296193
field_marks:
  active_form: 1785399745314
  body: 1785399745314
  claim: 1785399745314
  evidence_summary: 1785399745314
  parent: 1785399745314
  priority: 1785399745314
  recovery_ref: 1785399745314
  status: 1785399745314
  title: 1785399745314
---
Reconciled 2026-08-23 by p29920.

READ - the transition migration is assembled on origin/v3-beta. Evidence includes config-first transition typing and codemod coverage in commits a9859eec0e, 5a4b329013, 78029931a7, and the complete evolution assembly 2facdf38dd. Current v3 Checks passed the full kitchen-sink browser matrix on tip 17732f1e70.

The historical transition alignment task is complete. Current iOS Accordion CI repair is tracked separately by t-mt6jqrpk-21lr0.
