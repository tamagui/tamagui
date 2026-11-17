---
id: t-ms9wu0ob-8280
title: Restore native optimizer extraction count
status: done
assignees:
- a2717
labels:
- v3-beta
priority: 3
parent_id: t-ms71b4gl-vbi0
backend: git
sessions:
- a2717
commits:
- 743991592d
- 8eaa928f0b
created_at: 1785560859371
updated_at: 1785562674660
field_marks:
  active_form: 1785560859371
  body: 1785560859371
  claim: 1785560859371
  evidence_summary: 1785560859371
  parent: 1785560859371
  priority: 1785560859371
  recovery_ref: 1785560859371
  status: 1785560859371
  title: 1785560859371
---
Own the native optimizer reports-0 root cause after handoff from a2670. Stay out of a2670's in-flight bundleConfig edits until handoff is explicit. Preserve --expect-optimizations 8; no threshold or gate reduction. Rebuild and prove real native lowering before commit.
