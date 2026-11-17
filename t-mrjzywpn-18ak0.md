---
id: t-mrjzywpn-18ak0
title: Implement E4 Metro compiler frontend
status: done
assignees:
- ab-mriu8n1e-93569
labels:
- e4
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mriu55kg-47600
- ab-mriu8n1e-93569
created_at: 1783994005787
updated_at: 1784012984303
field_marks:
  active_form: 1783994005787
  body: 1783994005787
  claim: 1783994005787
  evidence_summary: 1783994005787
  parent: 1783994005787
  priority: 1783994005787
  recovery_ref: 1783994005787
  status: 1783994005787
  title: 1783994005787
---
E4 implementation is evidence-complete and awaiting Opus FINAL_PASS.

Implemented actual shared E3 LoweredModulePlan caching/application in Metro schema v2: user Babel runs first, main-process host-resolved graph/materialization/lowering writes atomic cache generations, isolated workers read plans and apply actual AST edits with composed maps. No analysis marker, preserve-runtime shim, legacy extractor fallback, or worker-side app evaluation remains.

Focused evidence:
- @tamagui/compiler-core build PASS 1.82s
- @tamagui/static build PASS 3.52s
- @tamagui/metro-plugin build PASS; final rebuild 1.389s
- Metro focused Vitest PASS 2 files/2 tests, including actual native output/VM execution, transactional dynamic bailout, two in-process plus two child-process readers, exact invalidation/stale-edge removal, corruption recovery, and UTF-16 map composition
- production marker/fallback grep zero; scoped oxfmt, oxlint, git diff --check green

Exact iOS export:
EXPO_NO_TELEMETRY=1 /usr/bin/time -lp bunx expo export --platform ios --output-dir /tmp/tamagui-e4-native-export-v2 --clear
Natural exit 0 in 61.26s; Metro 53.760s; 4,332 modules; 19MB export; 9.6MB Hermes. Peak RSS 7,330,496,512 bytes, peak footprint 7,792,777,624. Hermes index SHA256 13ac887835a9b2fcf8922422d32167da0e3ed2acbe653e68363f333d7a636b17; metadata SHA256 96a549c8194b65b1127ff298e098453c6551a6ddc6e502bce784f93d52bcc8ad.

Live cache audit:
- schema 2, generation 371e0b3204dbc63addc6b615bc230d4b4ad1bcb1ddd66fa6477cc3ff0bb5692c
- 2,740 entries; all 2,740 referenced blobs present and SHA256-valid; zero missing/invalid
- 72 modules with edits, 325 edits total
- aggregate found 882, lowered 126, flattened 126, bailed 756, styled 20
- 28 stable resolve diagnostics and 756 transactional transform bailouts; no corrupt plan consumed

Live generated bridge replay against cached AvatarDemo.native.js used the exact production Babel options and returned cacheHit=true, diagnostics=0, applied=true, sourceMapComposed=true, stats found/lowered/flattened=1/1/1 and bailed=0. Output contains __TamaguiNativeView plus inline native flexDirection/alignItems/gap style and no marker.

Two lifecycle defects caught and fixed during exact export:
1. Production dev=false, hot=true retained the graph/watchers and thousands of open files. Frontend now retains live graph only when dev && hot; a regression test proves production cache validation installs no watcher and ignores later source mutation.
2. Successful config loading exposed stale Slider dist with the pre-E0 top-level repeating interval. Rebuilt Slider after fixing its B2 source types; generated dist now starts the interval only with active listeners and clears it at zero. Natural export exits without signal.

Additional integration correction: @tamagui/core now explicitly runtime re-exports @tamagui/size symbols, fixing Node ESM named-export config loading. Soot PIDs preserved; no owned Expo/Metro/esbuild process remains. No commit/push.
