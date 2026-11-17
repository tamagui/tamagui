---
id: t-ms9qrf5m-22ii0
title: Fix container-only parent updates
status: done
assignees:
- a2665
- a2717
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2717
commits:
- 27b7fffe3b
- 5309bf3705
- e41f60ff93c
created_at: 1785550660474
updated_at: 1785560875827
field_marks:
  active_form: 1785550660474
  body: 1785550660474
  claim: 1785550660474
  evidence_summary: 1785550660474
  parent: 1785550660474
  priority: 1785550660474
  recovery_ref: 1785550660474
  status: 1785550660474
  title: 1785550660474
---
Blocked until Fable a2662 lands transition wiring. Fix the upstream createComponent provider construction so a component that acquires container/group behavior after mount updates through GroupContext. Rebuild core, add or extend behavior-level coverage, and run relevant web/native integration tests.
