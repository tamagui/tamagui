---
id: t-mrkbn6eo-vyn0
title: Fix Vite optimizer core singleton
status: done
labels:
- v3
- vite
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu55kg-47600
created_at: 1784013613872
updated_at: 1784227007739
field_marks:
  active_form: 1784013613872
  body: 1784013613872
  claim: 1784013613872
  evidence_summary: 1784013613872
  parent: 1784013613872
  priority: 1784013613872
  recovery_ref: 1784013613872
  status: 1784013613872
  title: 1784013613872
---
Fixed the Vite optimizer singleton split by adding installed @tamagui/core and @tamagui/web to the existing context-bearing optimizeDeps include list; existing tamagui/core/web dedupe remains. Focused regression resolves a server config and asserts core+web+sheet/controller includes and tamagui/core/web dedupe.

Evidence: core expectation RED before source change; web expectation RED after core-only runtime exposed missing ThemeStateContext; final focused test 1 pass/7 skipped. Vite-plugin tsc PASS; build PASS 1475ms; oxfmt/oxlint/diff PASS. Forced canary optimize metadata changed from sheet/controller/toast/core-inject only to plain core + plain web + those entries. Bounded Chromium dev load: canary-root visible, diagnostics [], forbidden duplicate/global-config/missing-theme/animation diagnostics []; server stopped and 5188 clear. Build changed only ignored dist output; no tracked generated type change. No full Playwright/prod/SSR/native export, commit, or push.
