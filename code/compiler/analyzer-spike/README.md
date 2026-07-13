# V3 analyzer decision spike

This private workspace measures the two candidates named by E1 in
`plans/v3-evolution.md`. It is deliberately outside the published static compiler. The
host fixture supplies every resolved module id; neither candidate performs filesystem or
package resolution.

The checked-in source is a reviewable experiment, not a second compiler implementation.
After evidence is collected, the losing candidate is deleted and the retained graph becomes
the starting point for E2.

**Decided 2026-07-13: yuku.** `evidence/results.json` holds the recorded two-candidate run;
the `oxc-owned` adapter is deleted. The verdict and its reasoning live in
`plans/v3-evolution.md` under E1.
