---
id: t-ms77vvg6-1xxx0
title: Implement Tailwind isolation lane B Vite and compiler ownership
status: done
labels:
- compiler
- tailwind
- v3
- vite
priority: 3
backend: git
sessions:
- a2329
commits:
- 85d09a5503
created_at: 1785398023158
updated_at: 1785408221762
field_marks:
  active_form: 1785398023158
  body: 1785398023158
  claim: 1785398023158
  evidence_summary: 1785398023158
  parent: 1785398023158
  priority: 1785398023158
  recovery_ref: 1785398023158
  status: 1785398023158
  title: 1785398023158
---
Read AGENTS.md, CONTRIBUTING.md, plans/v3-handoff.md, plans/dom-tailwind-flat-values.md, plans/v3-handoff-log.md, and /tmp/v3-tailwind-isolation-plan.md fully before editing. Implement Lane B exactly as the scout plan specifies on top of commit 0f3fb09a9c: move the official Tailwind scanner/compiler integration from the base @tamagui/vite-plugin into @tamagui/tailwind/vite, create the shared internal config-loader contract needed by compiler/static, preserve HMR invalidation and the virtual CSS module, migrate behavior tests, and update the integration/v3-canary fixtures owned by Lane B. Own only: code/core/tailwind/src/vite.ts, code/core/tailwind/src/vite/** and Vite tests; code/compiler/vite-plugin/src/tailwind.ts deletion, src/internal.ts, src/plugin.ts, src/loadTamagui.ts, its Tailwind/shared-loader tests, and package.json; code/compiler/static/src/compilerHost.ts and src/extractor/loadTamagui.ts; code/compiler/static-tests/tests/styled.web.test.tsx; the analyzer-spike class-string fixture; Tailwind-facing code/tests/integration/** and code/tests/v3-canary/**. Do not edit code/core/tailwind/package.json or any Lane A runtime/type file, Lane C files, bun.lock, plans/v3-handoff-log.md, generated CSS, the seven protected runtime files, four reserved lanes, or style-grammar semantics. Move code intact first, then remove the old path; no dual fallback, feature detection, or second config loader. Build every changed package; run vite-plugin/static/static-tests, integration production build and browser tests, v3-canary typecheck/web build/browser tests, and a real HMR candidate-change probe. Remove temporary outputs and servers by exact PID. Commit with explicit pathspecs and a one-line conventional commit. Never push, publish, release, switch branch, stash, reset, or broad-restore. Report commit, exact files, validation, bundle/import evidence, and any manifest or protected-file handoff without editing those files.
