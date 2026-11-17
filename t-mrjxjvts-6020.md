---
id: t-mrjxjvts-6020
title: Finish B2 legacy resolver-key migration
status: done
labels:
- b2
- v3
priority: 4
backend: git
sessions:
- ab-mriu8jpk-92079
created_at: 1783989945568
updated_at: 1784227055760
field_marks:
  active_form: 1783989945568
  body: 1783989945568
  claim: 1783989945568
  evidence_summary: 1783989945568
  parent: 1783989945568
  priority: 1783989945568
  recovery_ref: 1783989945568
  status: 1783989945568
  title: 1783989945568
---
Migrate every remaining authored/test variant definition from spread/type legacy keys to TS-style keys across demos, kitchen-sink, tamagui.dev, SelectViewport, Text, and core tests. Use Size/Space/Color/Radius/ZIndex/Font* or number/any as semantically appropriate; preserve dynamic functional resolver bodies. FlatBubbleCard bare global narrows to Color. Do not touch core web engine implementation/generated declarations. Acceptance grep zero legacy definition keys in source/tests. No commit/push/broad tests.
