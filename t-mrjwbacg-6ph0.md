---
id: t-mrjwbacg-6ph0
title: Restore B1 own-variant and context defaults typing
status: done
labels:
- b1
- types
- v3
priority: 4
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783987864864
updated_at: 1784007521091
field_marks:
  active_form: 1783987864864
  body: 1783987864864
  claim: 1783987864864
  evidence_summary: 1783987864864
  parent: 1783987864864
  priority: 1783987864864
  recovery_ref: 1783987864864
  status: 1783987864864
  title: 1783987864864
---
Fix the integrated StyledOptions overload so a styled declaration may set defaults for its own newly declared variants and consumed context keys, restoring pre-B1 accepted behavior without broadening unrelated props. Cover the five root typecheck failures and focused type assertions. Then rebuild @tamagui/web and @tamagui/core declarations so normalizeStaticConfigStyles is exported through core. No commit/push/broad tests.
