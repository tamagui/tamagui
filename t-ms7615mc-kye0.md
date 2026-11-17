---
id: t-ms7615mc-kye0
title: Implement Tailwind isolation lane A runtime and type seam
status: done
labels:
- isolation
- tailwind
- v3
priority: 3
backend: git
sessions:
- a2308
commits:
- 0f3fb09a9c
created_at: 1785394910388
updated_at: 1785792083181
field_marks:
  active_form: 1785394910388
  body: 1785394910388
  claim: 1785394910388
  evidence_summary: 1785394910388
  parent: 1785394910388
  priority: 1785394910388
  recovery_ref: 1785394910388
  status: 1785394910388
  title: 1785394910388
---
Read plans/v3-handoff.md, plans/dom-tailwind-flat-values.md, CONTRIBUTING.md, AGENTS.md, plans/v3-handoff-log.md, and /tmp/v3-tailwind-isolation-plan.md fully before editing. Implement Lane A exactly as the scout plan specifies: neutral style frontend descriptor and internal runtime seam, the new code/core/tailwind runtime package excluding all Vite-owned files, Tailwind root/type surface, and the required runtime/type tests. Own only the Lane A files enumerated in /tmp/v3-tailwind-isolation-plan.md. Never touch the seven protected runtime files listed in v3-handoff.md, any reserved lane, code/core/tailwind Vite/compiler files, bun.lock, or code/tamagui.dev/tamagui.generated.css. Do not alter existing style-grammar semantics. Search before adding helpers. Build every changed package, run behavior and type tests, inspect git diff for co-tenant work, and commit with explicit pathspecs using a one-line conventional commit. Never push, publish, release, switch branch, stash, reset, or use broad restore. Report commit, exact files, validation, and remaining protected-file handoff. If the required protected-file seam is needed, log its exact contract in plans/v3-handoff-log.md without editing the protected file.
