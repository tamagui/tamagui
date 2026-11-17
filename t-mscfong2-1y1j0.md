---
id: t-mscfong2-1y1j0
title: Validate and close V3 native and unflattened runtime performance parity
status: done
labels:
- native
- performance
- v3
- validation
priority: 3
parent_id: t-ms78wynx-1uf60
backend: git
sessions:
- m3279
- p14430
commits:
- 3023f3e7b8
- 3b426bf3cb84ee95fd54c27d6426f0be20c702c2
- 3ef8fc1600
- 6b47321cc8157dcadccf4f5544564e85aff59d7b
- 72c408283d
- 72ed46a315cb36252bc4346a38755f25c87d9f19
- 86fa1e6e13d135c9c782b9763b5978c73955abb6
- 9e40051fd6
- bb2aa79d1f885b0e9f8910fa13e1b14539159e07
- c48f8a98c2
- da80f52af4bf7eaf8af99195371d2cff644cc7eb
created_at: 1785713454002
updated_at: 1787535145781
field_marks:
  active_form: 1785713454002
  body: 1785713454002
  claim: 1785713454002
  evidence_summary: 1785713454002
  parent: 1785713454002
  priority: 1785713454002
  recovery_ref: 1785713454002
  status: 1785713454002
  title: 1785713454002
---
Reconciled 2026-08-23 by p29920.

READ - the source-bound native campaign is complete and recorded in plans/v3-validation-status-2026-08-02.md. It used four clean Release apps, one iPhone 17 Pro simulator, seed 73129, two warmups, 12 retained rounds, 252 dispatches, behavioral gates, source hashes, and production build identities. The retained evidence reports V3 slower in 16/18 runtime intervals and all six compiled mount/remount intervals, plus about 15% larger raw native bundles. This disproved parity rather than establishing it.

READ - final evidence/record commits 86fa1e6e13, 3b426bf3cb, and 72ed46a315 are ancestors of origin/v3-beta 17732f1e70; the measurement branch remains at origin/validate/v3-native-runtime. This task is done as a completed validation campaign with a negative verdict. Any later performance redesign requires a new scoped task and owner decision, not a stale in-progress validation claim.
