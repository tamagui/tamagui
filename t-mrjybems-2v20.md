---
id: t-mrjybems-2v20
title: Close integrated typecheck errors
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- integration
- v3
priority: 4
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783991229652
updated_at: 1784007512029
field_marks:
  active_form: 1783991229652
  body: 1783991229652
  claim: 1783991229652
  evidence_summary: 1783991229652
  parent: 1783991229652
  priority: 1783991229652
  recovery_ref: 1783991229652
  status: 1783991229652
  title: 1783991229652
---
Fix the four Opus-confirmed root typecheck errors in code/ui/button/src/Button.tsx (lines around 264,316 size union mismatch) and code/ui/list-item/src/ListItem.tsx (lines around 236,238 styled overload mismatch) without broadening public types or restoring unstyled. Preserve A2 category semantics, C4 base aesthetics, and B1 prop-order behavior. Also remove remaining legacy-syntax prose in code/core/constants/src/constants.ts and code/core/core-test/styledContextTokens.web.test.tsx, rebuild @tamagui/input so its generated shared.d.ts no longer contains the old spread-size key, and run a broad source/generated legacy grep plus focused package/source typechecks. No commit/push. Opus independently reruns root typecheck afterward.
