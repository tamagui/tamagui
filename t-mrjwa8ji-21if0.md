---
id: t-mrjwa8ji-21if0
title: Fix v6 category-aware default tokens
status: done
labels:
- a2
- v3
priority: 4
backend: git
sessions:
- ab-mrjwae7e-97628
created_at: 1783987815870
updated_at: 1783991684081
field_marks:
  active_form: 1783987815870
  body: 1783987815870
  claim: 1783987815870
  evidence_summary: 1783987815870
  parent: 1783987815870
  priority: 1783987815870
  recovery_ref: 1783987815870
  status: 1783987815870
  title: 1783987815870
---
In v3-consolidate fix the proven v6 Button/Input default frame regression. Keep settings.defaultSize authoritative for Size, add optional defaultTokens overrides for space/radius/zIndex/fontSize with legacy fallback, add category-aware default-token helpers while preserving existing Size wrappers, thread true resolution through propMapper/get-token/get-button-sized/get-font-sized and exact-true fan-out variants, set v6 defaultSize= and other category overrides=, preserve explicit  same-key semantics. Use existing A2 RED design; no commit/push/broad tests. Avoid active C4-owned checkbox/create-menu/popover/select viewport/switch/tooltip files. Defer generated declarations to final rebuild.
