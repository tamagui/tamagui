---
id: t-mrk06t6x-s7y0
title: Migrate legacy Button consumers to copied skins
status: done
assignees:
- ab-mriu8jpk-92079
labels:
- c4
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu8jpk-92079
created_at: 1783994374473
updated_at: 1784227033562
field_marks:
  active_form: 1783994374473
  body: 1783994374473
  claim: 1783994374473
  evidence_summary: 1783994374473
  parent: 1783994374473
  priority: 1783994374473
  recovery_ref: 1783994374473
  status: 1783994374473
  title: 1783994374473
---
C1 removed framework Button aesthetics by design. Completed C4 consumer migration without restoring framework aesthetics: added app-owned copied Button skins in code/kitchen-sink/src/components/Button.tsx, code/demos/src/Button.tsx, and code/tamagui.dev/components/Button.tsx; migrated the exact 55-file/203-error kitchen backlog plus remaining demo and site consumers to named copied-skin sizes or explicit behavior styling; updated focused legacy visual expectations and registered SheetSkin without overwriting C4 work. Final validation: canonical root `bun run typecheck` PASS (`✅ Type check passed`, /tmp/c4-root-typecheck-final2.log); oxfmt --check PASS and oxlint 0 warnings/errors across 192 scoped changed files; git diff --check PASS. Acceptance greps across demos/src, kitchen-sink/src, and tamagui.dev: legacy Button token-size/chromeless/elevation openings 0; legacy Button.Text token sizes 0; authored unstyled/TAMAGUI_HEADLESS files 0; copied createSizeTable Button skins 3. No commit/push per consolidation coordinator.
