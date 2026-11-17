---
id: t-ms9y57t3-i3v0
title: Clear core web ordering matrix red
status: done
assignees:
- a2667
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2667
commits:
- 10a4b82b10
created_at: 1785563061447
updated_at: 1785564022987
field_marks:
  active_form: 1785563061447
  body: 1785563061447
  claim: 1785563061447
  evidence_summary: 1785563061447
  parent: 1785563061447
  priority: 1785563061447
  recovery_ref: 1785563061447
  status: 1785563061447
  title: 1785563061447
---
At current v3-beta HEAD, reproduce one recorded shuffled seed from the a1e audit, classify shared global-state leaks in flatValueProgramsSSR, registerVariable, variables, themeMediaOverRender, and programCache, then root-fix ordering dependencies. Fixed-order suite is green. Do not alter behavior expectations or skip tests. Build core/web, run the recorded seed and five shuffled iterations, format, commit by explicit pathspec, no push.
