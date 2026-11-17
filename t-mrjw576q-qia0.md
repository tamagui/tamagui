---
id: t-mrjw576q-qia0
title: Finish C4 headless and unstyled source sweep
status: done
labels:
- c4
- v3
priority: 4
backend: git
sessions:
- ab-mrjw5ihv-38326
created_at: 1783987580834
updated_at: 1783989923224
field_marks:
  active_form: 1783987580834
  body: 1783987580834
  claim: 1783987580834
  evidence_summary: 1783987580834
  parent: 1783987580834
  priority: 1783987580834
  recovery_ref: 1783987580834
  status: 1783987580834
  title: 1783987580834
---
In /Users/n8/.worktrees/tamagui-v3-consolidate remove remaining TAMAGUI_HEADLESS and skin-semantic unstyled source uses in the identified core/UI files, preserving behavior as plain structural props/hooks. Source only; no generated declarations, core/web/compiler, commit, push, or broad tests. Acceptance: source grep zero TAMAGUI_HEADLESS; any retained unstyled must be explicitly non-skin and documented.
