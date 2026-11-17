---
id: t-mrjw5b0l-qi40
title: Regenerate web declarations and remove switch temp
status: done
labels:
- types
- v3
priority: 3
backend: git
sessions:
- ab-mrjw5ilm-38395
created_at: 1783987585797
updated_at: 1783989586986
field_marks:
  active_form: 1783987585797
  body: 1783987585797
  claim: 1783987585797
  evidence_summary: 1783987585797
  parent: 1783987585797
  priority: 1783987585797
  recovery_ref: 1783987585797
  status: 1783987585797
  title: 1783987585797
---
In /Users/n8/.worktrees/tamagui-v3-consolidate delete code/ui/switch/src/Switch.draggable-tmp, rebuild @tamagui/web declarations from current integrated source, verify types.d.ts contains baseStyle and no stale runtime-later/phantom resolveStaticStyle contract, and diff-check. Do not touch unrelated source, commit, push, or run broad tests.
