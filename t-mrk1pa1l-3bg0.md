---
id: t-mrk1pa1l-3bg0
title: Implement C2 Sheet behavior and copied skin
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- C2
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
sessions:
- ab-mrjwbgya-11820
created_at: 1783996915737
updated_at: 1784007497116
field_marks:
  active_form: 1783996915737
  body: 1783996915737
  claim: 1783996915737
  evidence_summary: 1783996915737
  parent: 1783996915737
  priority: 1783996915737
  recovery_ref: 1783996915737
  status: 1783996915737
  title: 1783996915737
---
Completed C2 Sheet packet. Inlined behavior wrappers/root into Sheet.tsx; exported callable Sheet plus Root, Controlled, Container, Background, Overlay, Handle, ScrollView; fixed frames structurally neutral; preserved Handle press ordering and Overlay caller-first dismissal; made ScrollView styleable; fixed named styled overlay partitioning through parentStaticConfig; deleted createSheet source/export. Public type follow-up: canonical root RED at CrashAdaptSheet.tsx:17 showed direct Sheet.Handle omitted h and widened pos. Added direct fixture coverage for Handle h/bg/pos/t and representative shorthand props on Overlay/Container/Background/ScrollView. Fixed all five parts with ViewProps or GetProps<typeof ScrollView> plus precise h/o/pos longhand-derived types. No any and no consumer edit. Copied public-API skin/usecase/Playwright live in kitchen-sink. Type fixture is code/ui/sheet/test/Sheet.test-d.tsx outside build inputs. Generated declarations rebuilt: Sheet.d.ts, SheetImplementationCustom.d.ts, SheetScrollView.d.ts, index.d.ts; createSheet.d.ts deleted. Final evidence: build PASS 2942 ms; package tsc PASS; focused kitchen-config harness containing CrashAdaptSheet/direct fixture/copied skin PASS; Sheet unit 17/17 PASS; SheetSkin Playwright 3/3 PASS; existing SheetOverlayStyle Playwright 3/3 PASS; native SheetReanimated 1/1 PASS; oxfmt 9/9 PASS; oxlint 0; scoped diff check PASS. Declaration grep confirms Root/Controlled/all parts and zero createSheet/test artifact/unstyled/TAMAGUI_HEADLESS in src/types/dist. Canonical root bun run typecheck PASS. Opus essential review FINAL_PASS with no findings. C2 files frozen and lane released.
