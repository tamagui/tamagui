---
id: t-mrjzjxfm-22kk0
title: Implement C1 Button behavior pilot
status: done
assignees:
- ab-mrjwbgya-11820
labels:
- c1
- v3
priority: 3
parent_id: t-mriugrc7-e40
backend: git
created_at: 1783993306882
updated_at: 1783994381317
field_marks:
  active_form: 1783993306882
  body: 1783993306882
  claim: 1783993306882
  evidence_summary: 1783993306882
  parent: 1783993306882
  priority: 1783993306882
  recovery_ref: 1783993306882
  status: 1783993306882
  title: 1783993306882
---
Implemented C1 Button behavior pilot on the shared consolidate branch.

Outcome
- @tamagui/button root now exports useButton, ButtonFrame, ButtonText, ButtonIcon, ButtonContext, ButtonBehaviorProps, and the structural Button composition.
- Behavior owns role/tabIndex, actual DOM disabled plus aria/tab semantics, native disabled press suppression, nested span rendering, link rendering, press forwarding, optional string wrapping, text context, icon/iconAfter plumbing, and refs.
- Root source and regenerated declaration contain zero unstyled, createButton, aesthetic styles, default variants, framework size, circular, chromeless, elevation, or visual variant surface.
- Standalone kitchen-sink copy uses public button and size APIs with an isolated named frame/text/icon scale and app-owned colors, borders, pseudos, circular/custom-size variants.
- No expo starter/docs fan-out, commit, or push.

Files
- code/ui/button/src/Button.tsx
- code/ui/button/types/Button.d.ts
- code/kitchen-sink/src/components/Button.tsx
- code/kitchen-sink/src/usecases/ButtonSkin.tsx
- ButtonSkin registration hunks in code/kitchen-sink/src/usecases/index.web.ts and index.native.ts
- code/kitchen-sink/tests/ButtonSkin.test.tsx
- code/ui/components-test/Button.native.test.tsx

Validation
- @tamagui/button package tsc PASS.
- @tamagui/button bun run build PASS, 1743 ms final rebuild.
- focused strict tsc for copied Button skin, usecase, and Playwright test PASS.
- components-test button.web.test.tsx PASS 4/4.
- components-test Button.native.test.tsx PASS 10/10, including copied-skin responder press and disabled no-active-responder.
- dedicated ButtonSkin Playwright PASS 5/5: default, disabled/focus, nested, icon/text, circular/custom named size.
- existing FormButtonType Playwright PASS 3/3 in the combined pre-final run.
- scoped git diff --check PASS.
- Opus essential review FINAL_PASS, no findings.

C4 legacy consumer backlog
Full kitchen-sink tsc intentionally remains red because framework Button no longer owns visual props: 203 errors in exactly 55 legacy consumer files. New C1 files have zero errors. Exact error counts:
2 code/kitchen-sink/src/AnimationDemos.tsx
3 code/kitchen-sink/src/TestNativeSheet.tsx
1 code/kitchen-sink/src/features/home/screen.tsx
2 code/kitchen-sink/src/usecases/ActionsSheetComparison.tsx
54 code/kitchen-sink/src/usecases/AnimationComprehensiveCase.tsx
6 code/kitchen-sink/src/usecases/AnimationValueLoggingCase.tsx
1 code/kitchen-sink/src/usecases/ButtonCircular.tsx
6 code/kitchen-sink/src/usecases/CompilerExtraction.tsx
1 code/kitchen-sink/src/usecases/CompilerTernaryActive.native.tsx
1 code/kitchen-sink/src/usecases/CompilerTernaryActive.tsx
2 code/kitchen-sink/src/usecases/DialogFocusScopeCase.tsx
1 code/kitchen-sink/src/usecases/DialogNestedCase.tsx
1 code/kitchen-sink/src/usecases/DialogScopedCase.tsx
15 code/kitchen-sink/src/usecases/ExitCompletionCase.tsx
2 code/kitchen-sink/src/usecases/IconFontSizing.tsx
1 code/kitchen-sink/src/usecases/MenuAccessibilityCase.tsx
2 code/kitchen-sink/src/usecases/MenuArrowAnimatePresenceCase.tsx
1 code/kitchen-sink/src/usecases/MenuAutoResizeCase.tsx
1 code/kitchen-sink/src/usecases/MenuBottomCase.tsx
2 code/kitchen-sink/src/usecases/MenuDismissOnScrollCase.tsx
1 code/kitchen-sink/src/usecases/MenuItemFocusCase.tsx
4 code/kitchen-sink/src/usecases/MenuItemPseudoOverrideCase.tsx
1 code/kitchen-sink/src/usecases/MenuOverflowCase.tsx
1 code/kitchen-sink/src/usecases/MenuRadioGroupCase.tsx
1 code/kitchen-sink/src/usecases/MenuSubCase.tsx
1 code/kitchen-sink/src/usecases/MenuSubLeftCase.tsx
1 code/kitchen-sink/src/usecases/MenuSubNestedPositionCase.tsx
1 code/kitchen-sink/src/usecases/MenuSubStyledCase.tsx
1 code/kitchen-sink/src/usecases/MenuThemeCase.tsx
1 code/kitchen-sink/src/usecases/NativePortalTest.tsx
3 code/kitchen-sink/src/usecases/NestedPressExclusive.tsx
5 code/kitchen-sink/src/usecases/OnLayoutCase.tsx
5 code/kitchen-sink/src/usecases/OnLayoutStressCase.tsx
1 code/kitchen-sink/src/usecases/PopoverAndMenuMultiTriggerCase.tsx
3 code/kitchen-sink/src/usecases/PopoverCase.tsx
3 code/kitchen-sink/src/usecases/PopoverFocusScopeCase.tsx
1 code/kitchen-sink/src/usecases/PopoverScopedCase.tsx
1 code/kitchen-sink/src/usecases/PopoverTriggerIsolationCase.tsx
3 code/kitchen-sink/src/usecases/ScrollViewRefCase.tsx
1 code/kitchen-sink/src/usecases/SheetAnimationCase.tsx
3 code/kitchen-sink/src/usecases/SheetDragResistCase.tsx
3 code/kitchen-sink/src/usecases/SheetDragResistCase.web.tsx
6 code/kitchen-sink/src/usecases/SheetKeyboardFitContentCase.tsx
1 code/kitchen-sink/src/usecases/SheetPressRegressionCase.tsx
1 code/kitchen-sink/src/usecases/SheetScrollableDrag.tsx
3 code/kitchen-sink/src/usecases/SheetSnapPointsFitCase.tsx
2 code/kitchen-sink/src/usecases/StressPage.tsx
1 code/kitchen-sink/src/usecases/TabHoverAnimationCase.tsx
19 code/kitchen-sink/src/usecases/ToastMultipleCase.tsx
3 code/kitchen-sink/src/usecases/ToastNativeBurntCase.tsx
3 code/kitchen-sink/src/usecases/ToggleGroupXGroupCase.tsx
3 code/kitchen-sink/src/usecases/TooltipAnimationCase.tsx
4 code/kitchen-sink/src/usecases/TooltipGlobalPatternCase.tsx
1 code/kitchen-sink/src/usecases/TooltipPositionJumpCase.tsx
6 code/kitchen-sink/src/usecases/V5ThemeBuilderOutput.tsx
