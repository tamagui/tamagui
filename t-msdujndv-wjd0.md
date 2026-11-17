---
id: t-msdujndv-wjd0
title: 'Fix DialogPointerEvents: close element never hides under animated-native'
status: done
labels:
- animated-native
- dialog
- v3
priority: 3
backend: git
created_at: 1785798881059
updated_at: 1787535143102
field_marks:
  active_form: 1785798881059
  body: 1785798881059
  claim: 1785798881059
  evidence_summary: 1785798881059
  parent: 1785798881059
  priority: 1785798881059
  recovery_ref: 1785798881059
  status: 1785798881059
  title: 1785798881059
---
Reconciled 2026-08-23 by p29920.

READ - plans/v3-dialog-native-driver-exit-hang.md identifies the upstream cause: unresolved borderRadius tokens and string transforms reached the web inline RN style path, then the native animation parser converted them to NaN and never completed exit. Commits bde5b72fc5 and 4937d7134d fixed the emitter and parser, and both are ancestors of origin/v3-beta 17732f1e70.

READ - the recorded behavioral A/B shows DialogPointerEvents.animated.test.tsx failed before and passed after. The same source fix cleared the other native-driver Dialog close/unmount failures without loosening the test. This historical defect is complete; remaining current v3 CI is tracked by t-mt6jqrpk-21lr0.
