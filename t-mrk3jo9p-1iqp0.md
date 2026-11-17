---
id: t-mrk3jo9p-1iqp0
title: Implement C3 Select behavior and copied skin
status: done
assignees:
- ab-mriu8jpk-92079
labels:
- C3
- v3
priority: 3
parent_id: t-mrk0m8yf-b240
backend: git
sessions:
- ab-mriu55kg-47600
- ab-mriu8jpk-92079
created_at: 1784000013469
updated_at: 1784227026404
field_marks:
  active_form: 1784000013469
  body: 1784000013469
  claim: 1784000013469
  evidence_summary: 1784000013469
  parent: 1784000013469
  priority: 1784000013469
  recovery_ref: 1784000013469
  status: 1784000013469
  title: 1784000013469
---
Implemented C3 Select behavior/public-part decomposition and copied skins on v3-consolidate.

Delivered:
- Callable generic Select plus Select.Root; direct styleable Trigger, Value, Icon, Group, Label, Item, ItemText, ItemIndicator, Indicator, Viewport, scroll buttons, and Separator.
- Neutral behavior frames, styled ItemText ancestry, native/adapted viewport prop forwarding, stable viewport marker, disabled native/item handling, pointer-handler composition, scroll RAF cleanup.
- App-owned kitchen-sink Select and independent AltSelect size/visual skins, real adapted copied-Sheet fixture, explicit Select.Icon demo/caller migration.
- Narrow event-order fix: mouseup queues the click-hold fallback rather than unmounting first; caller onClick runs exactly once before normal pointer selection closes, while drag-release, quick-click guard, disabled and preventDefault behavior remain intact.

Final C3 evidence:
- @tamagui/select build PASS; public Select.test-d.tsx fixture PASS.
- Select Click and Hold 3/3 plus caller-handler/isolation 1/1 PASS (4/4, one worker, retries 0; /tmp/c3-select-item-clickhold.log).
- Full SelectSkin PASS 3/3 (one worker, retries 0; /tmp/c3-selectskin-final.log), including real pointer click through fixed-snap copied Sheet; no dispatchEvent/force-click masking.
- selectViewportElevate web PASS 2/2; Select native PASS 2/2.
- C3 scoped oxfmt 23/23, oxlint 0 warnings/errors, git diff --check PASS; zero Select unstyled/TAMAGUI_HEADLESS, demo iconAfter, and synthetic adapted-click residue.
- Demos C3 callsites/type surface are clean.
- Canonical root bun run typecheck reached only C4 migration fallout after Popper/Menu neutralization: Tooltip passes removed size; Menu/Popover/Tooltip consumers still pass removed elevation/elevate aesthetics; several copied Radio/Button consumers still pass removed size. There are zero C3 Select diagnostics. Log: /tmp/c3-root-typecheck-final.log.

No commit/push. C3 is ready for coherent Opus review; root typecheck remains externally blocked by the active C4 consumer sweep.
