---
id: t-mrk174i8-sb40
title: Wire v6 Tailwind defaults drift checks into CI
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- A2
- ci
- v3
priority: 2
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783996068752
updated_at: 1784007500119
field_marks:
  active_form: 1783996068752
  body: 1783996068752
  claim: 1783996068752
  evidence_summary: 1783996068752
  parent: 1783996068752
  priority: 1783996068752
  recovery_ref: 1783996068752
  status: 1783996068752
  title: 1783996068752
---
Completed. .github/workflows/checks.yaml adds one uncached serialized Check v6 Tailwind defaults step in unit-tests immediately after Playwright install and before Turbo cache restore. From code/core/config it runs bun run check:v6-tailwind-defaults then bun run test:v6-tailwind-defaults. No manifest/dependency/lock changes. YAML parse/order assertion, exact package-script targets, Prettier YAML, and scoped diff-check PASS. After E4 released the heavy lane, both exact runtime commands were executed: generated defaults matched tailwindcss@4.3.0 + playwright@1.58.2; Bun test passed 4/4 with 27 expectations.
