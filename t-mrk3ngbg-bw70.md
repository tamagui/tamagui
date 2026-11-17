---
id: t-mrk3ngbg-bw70
title: Finish C4 behavior factory and copied-skin sweep
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- C4
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1784000189788
updated_at: 1784007494029
field_marks:
  active_form: 1784000189788
  body: 1784000189788
  claim: 1784000189788
  evidence_summary: 1784000189788
  parent: 1784000189788
  priority: 1784000189788
  recovery_ref: 1784000189788
  status: 1784000189788
  title: 1784000189788
---
C4 implementation, validation, and required Opus review are complete. Opus verdict: FINAL_PASS with no required changes.

Removed aesthetic-injection factories createCheckbox, createRadioGroup, createSwitch, createTabs, and MenuPredefined while preserving genuine menu/context-menu behavior constructors and scopes. Checkbox, RadioGroup, Switch, Tabs, Menu, Popper, Popover, and Tooltip expose direct styleable neutral behavior parts. Copied appearances live in demos ControlSkins/MenuSkins, custom demos, explicit kitchen/site consumers, and a site RadioGroup copied size skin. Generated declarations were rebuilt.

Evidence: all owned package/declaration builds pass; demos full type build passes; five public type fixtures pass; demos, kitchen-sink, and tamagui.dev typechecks pass; canonical root typecheck passes; Checkbox web Vitest 9/9; Checkbox native interaction 1/1; focused Playwright 30/30; authored formatting passes on 264 files; lint passes on 248 TS/TSX files with zero warnings/errors; git diff --check passes. Exact candidate greps are zero for authored lowercase unstyled, TAMAGUI_HEADLESS, removed factories/demo names, deleted artifacts, and neutral-part declaration appearance leaks.

Intentionally retained behavior constructors: createImage for source/object-fit/event/native implementation plumbing; createBaseMenu, createMenu, createNonNativeMenu, createNativeMenu, withNativeMenu, createContextMenu, and createNonNativeContextMenu for behavior, native adapters, and scoped contexts. No commit or push performed.

External note: an accidental substring test selection exposed two stale C1 Button default-skin geometry assertions in v6DefaultSize.web; exact C4 tests are green and C1 files were not changed.
