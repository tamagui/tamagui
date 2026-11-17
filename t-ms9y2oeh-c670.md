---
id: t-ms9y2oeh-c670
title: Clear config and Tailwind matrix reds
status: done
assignees:
- a2670
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2670
commits:
- 273451cc54
created_at: 1785562942985
updated_at: 1785569235723
field_marks:
  active_form: 1785562942985
  body: 1785562942985
  claim: 1785562942985
  evidence_summary: 1785562942985
  parent: 1785562942985
  priority: 1785562942985
  recovery_ref: 1785562942985
  status: 1785562942985
  title: 1785562942985
---
At current v3-beta HEAD, reproduce and root-fix matrix reds from a1e2671de6: config V6 generated-source drift and Tailwind declarationGraph leak to web/types/types.d.ts (same failure in test:web and test:types). Do not relax checks or expected graphs. Coordinate before touching active files, rebuild relevant packages, run focused gates, format, and commit by explicit pathspec.
