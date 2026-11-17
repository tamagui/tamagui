---
id: t-ms78v5m5-1qbk0
title: Preserve styled flat programs across same-key call-site props
status: done
labels:
- flat-values
- runtime
- v3
priority: 3
backend: git
sessions:
- a2335
commits:
- dd548ebfe709e5473de4f88001c62f7d9c08b4c5
created_at: 1785399669293
updated_at: 1785424757910
field_marks:
  active_form: 1785399669293
  body: 1785399669293
  claim: 1785399669293
  evidence_summary: 1785399669293
  parent: 1785399669293
  priority: 1785399669293
  recovery_ref: 1785399669293
  status: 1785399669293
  title: 1785399669293
---
Fix the non-protected mergeComponentProps/mergeProps boundary so a styled same-key program such as bg='gray hover:blue' combined with call-site bg='red' preserves clauses and replaces only the base, exactly Decision 21, before default props are discarded. Use style-grammar, avoid a second parser or fallback path, cover styled bases/variants/spreads/JSX on web and native, never edit the seven protected files.
