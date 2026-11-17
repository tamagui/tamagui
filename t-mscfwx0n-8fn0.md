---
id: t-mscfwx0n-8fn0
title: Integrate and ship V3 validation evidence and fixes
status: done
labels:
- integration
- v3
- validation
priority: 3
parent_id: t-ms78wynx-1uf60
backend: git
sessions:
- m3060
commits:
- d2cfd04df5454e58e89c983bfc3fb477180f488c
created_at: 1785713839655
updated_at: 1785785798433
field_marks:
  active_form: 1785713839655
  body: 1785713839655
  claim: 1785713839655
  evidence_summary: 1785713839655
  parent: 1785713839655
  priority: 1785713839655
  recovery_ref: 1785713839655
  status: 1785713839655
  title: 1785713839655
---
Cross-review the web, native/runtime, and React Strict DOM validation branches; cherry-pick coherent commits into integrate/v3-validation-20260802; rebuild and rerun the affected gates; push; open and drive the integration PR to merge into the active V3 lane, then ensure the V3 lane is merged according to the release program.
