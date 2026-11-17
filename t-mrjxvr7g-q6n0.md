---
id: t-mrjxvr7g-q6n0
title: Remove legacy variant resolver engine
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- b2
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783990499452
updated_at: 1784007514752
field_marks:
  active_form: 1783990499452
  body: 1783990499452
  claim: 1783990499452
  evidence_summary: 1783990499452
  parent: 1783990499452
  priority: 1783990499452
  recovery_ref: 1783990499452
  status: 1783990499452
  title: 1783990499452
---
After the B2 authored-key migration finishes, delete the old SpreadKeys, VariantTypeKeys, GetVariantValues and propMapper fallback branches for colon keys, spread keys, legacyTokenCats, and bare catch-all. Preserve TS-style VariantResolverKey semantics, union ordering, exact literal keys, A2 default-token category behavior, compound variants, and prop-order precedence. Update styled type inference to use VariantResolverValue without legacy parsing. Coordinate before editing core tests because B2 is currently changing them. Rebuild web/core declarations, add or update focused web/native/type coverage, run diff check, and report exact zero greps. No commit or push.
