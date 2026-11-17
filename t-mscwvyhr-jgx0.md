---
id: t-mscwvyhr-jgx0
title: Remove identity zIndex tokens from V6 config
status: done
labels:
- config
- v3
- zindex
priority: 3
backend: git
sessions:
- p13938
commits:
- b84036909e760f27f00dda6dd6542887e08e58a0
created_at: 1785742348383
updated_at: 1785785814845
field_marks:
  active_form: 1785742348383
  body: 1785742348383
  claim: 1785742348383
  evidence_summary: 1785742348383
  parent: 1785742348383
  priority: 1785742348383
  recovery_ref: 1785742348383
  status: 1785742348383
  title: 1785742348383
---
Resolved on v3-beta by b84036909e. V6 no longer carries the identity zIndex token scale or defaultTokens.zIndex, and the broader defaultSize/defaultTokens global interface was removed with component defaults moved to @tamagui/size. The assembled core web/native, web, config, style-grammar, to-tailwind, tailwind, and compiler suites passed before landing.
