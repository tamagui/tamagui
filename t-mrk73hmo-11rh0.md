---
id: t-mrk73hmo-11rh0
title: Implement F0 compile-only DOM v1
status: canceled
assignees:
- ab-mriu55kg-47600
labels:
- F0
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
created_at: 1784005976832
updated_at: 1784007024275
field_marks:
  active_form: 1784005976832
  body: 1784005976832
  claim: 1784005976832
  evidence_summary: 1784005976832
  parent: 1784005976832
  priority: 1784005976832
  recovery_ref: 1784005976832
  status: 1784005976832
  title: 1784005976832
---
Cancelled by Nate on 2026-07-13 because F0 compile-only DOM mode was removed from scope. All F0-only work was removed from v3-consolidate: deleted the untracked code/ui/dom package and compiler-core src/dom.ts; removed only the F0 export and five DOM diagnostic codes. Scoped residue grep and git diff --check are clean. No commit or push.
