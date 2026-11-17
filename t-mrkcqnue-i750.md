---
id: t-mrkcqnue-i750
title: Layer Tamagui core reset CSS in hybrid Vite
status: done
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu55kg-47600
created_at: 1784015456054
updated_at: 1784226987857
field_marks:
  active_form: 1784015456054
  body: 1784015456054
  claim: 1784015456054
  evidence_summary: 1784015456054
  parent: 1784015456054
  priority: 1784015456054
  recovery_ref: 1784015456054
  status: 1784015456054
  title: 1784015456054
---
Implemented hybrid-only Vite transform for resolved @tamagui/core/reset.css so its button all:unset remains in the tamagui layer and cannot override layered runtime atomics. Non-hybrid returns original CSS untouched. Focused tailwind 4/4, vite-plugin tsc/build, oxfmt/oxlint/diff green. Bounded Chromium: copied Button 30x30, flex, radius 1000; Tailwind cascade wins; reset is CSSLayerBlockRule tamagui; zero browser failures.
