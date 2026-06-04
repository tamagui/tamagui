// web-only usecase registry (lazy). excludes native-only deps
// (react-native-keyboard-controller, react-native-actions-sheet, react-native-teleport).
// AUTO-SHAPED lazy registry: each usecase module is required (and therefore
// evaluated) only when its component is first accessed, not when this index loads.
// Object.keys(useCases) lists names without evaluating any usecase (getters are not
// invoked by Object.keys); useCases[name] evaluates just that one. This avoids the
// per-launch eval of every usecase that made Detox app relaunches slow.
import type { ComponentType } from 'react'

const loaders: Record<string, () => ComponentType<any>> = {
  AnimatedByProp: () => require('./AnimatedByProp').AnimatedByProp,
  AnimatePresenceEnterExitCase: () =>
    require('./AnimatePresenceEnterExitCase').AnimatePresenceEnterExitCase,
  AnimatePresenceExitTest: () =>
    require('./AnimatePresenceExitTest').AnimatePresenceExitTest,
  AnimationComprehensiveCase: () =>
    require('./AnimationComprehensiveCase').AnimationComprehensiveCase,
  RawAnimatedValueCase: () => require('./RawAnimatedValueCase').RawAnimatedValueCase,
  AnimationsWithMediaQueriesCase: () =>
    require('./AnimationsWithMediaQueriesCase').AnimationsWithMediaQueriesCase,
  ThemeMediaAnimationCase: () =>
    require('./ThemeMediaAnimationCase').ThemeMediaAnimationCase,
  Benchmark: () => require('./Benchmark').Benchmark,
  ButtonCircular: () => require('./ButtonCircular').ButtonCircular,
  ButtonCustom: () => require('./ButtonCustom').ButtonCustom,
  ButtonIconColor: () => require('./ButtonIconColor').ButtonIconColor,
  ButtonInverse: () => require('./ButtonInverse').ButtonInverse,
  ButtonUnstyled: () => require('./ButtonUnstyled').ButtonUnstyled,
  CheckboxDisabledOnPress: () =>
    require('./CheckboxDisabledOnPress').CheckboxDisabledOnPress,
  ClickDuringEnterCase: () => require('./ClickDuringEnterCase').ClickDuringEnterCase,
  CodeExamplesInput: () => require('./CodeExamplesInput').CodeExamplesInput,
  ColorTokenFallback: () => require('./ColorTokenFallback').ColorTokenFallback,
  CompilerExtraction: () => require('./CompilerExtraction').CompilerExtraction,
  CompilerTernaryActive: () => require('./CompilerTernaryActive').CompilerTernaryActive,
  ComplexVariants: () => require('./ComplexVariants').ComplexVariants,
  CrashAdaptSheet: () => require('./CrashAdaptSheet').CrashAdaptSheet,
  CustomStyledAnimatedPopover: () =>
    require('./CustomStyledAnimatedPopover').CustomStyledAnimatedPopover,
  CustomStyledAnimatedTooltip: () =>
    require('./CustomStyledAnimatedTooltip').CustomStyledAnimatedTooltip,
  DriverDisableAnimationPropsCase: () =>
    require('./DriverDisableAnimationPropsCase').DriverDisableAnimationPropsCase,
  DOMNodeAPIs: () => require('./DOMNodeAPIs').DOMNodeAPIs,
  DialogFocusScopeCase: () => require('./DialogFocusScopeCase').DialogFocusScopeCase,
  DialogFocusScopeDebug: () => require('./DialogFocusScopeDebug').DialogFocusScopeDebug,
  DialogNestedCase: () => require('./DialogNestedCase').DialogNestedCase,
  DismissLayerStackingCase: () =>
    require('./DismissLayerStackingCase').DismissLayerStackingCase,
  DialogOpenControlled: () => require('./DialogOpenControlled').DialogOpenControlled,
  DialogPointerEventsCase: () =>
    require('./DialogPointerEventsCase').DialogPointerEventsCase,
  DialogScopedCase: () => require('./DialogScopedCase').DialogScopedCase,
  DialogSheetAdaptCase: () => require('./DialogSheetAdaptCase').DialogSheetAdaptCase,
  DialogSheetAdaptResizeCase: () =>
    require('./DialogSheetAdaptResizeCase').DialogSheetAdaptResizeCase,
  DialogSheetAdaptUnmountCase: () =>
    require('./DialogSheetAdaptUnmountCase').DialogSheetAdaptUnmountCase,
  Example: () => require('./Example').Example,
  ExitCompletionCase: () => require('./ExitCompletionCase').ExitCompletionCase,
  StyleValidation: () => require('./StyleValidation').StyleValidation,
  FocusVisibleButton: () => require('./FocusVisibleButton').FocusVisibleButton,
  FocusVisibleButtonPointer: () =>
    require('./FocusVisibleButtonPointer').FocusVisibleButtonPointer,
  FocusVisibleButtonWithFocusStyle: () =>
    require('./FocusVisibleButtonWithFocusStyle').FocusVisibleButtonWithFocusStyle,
  FontTokensInVariants: () => require('./FontTokensInVariants').FontTokensInVariants,
  FocusWithinCase: () => require('./FocusWithinCase').FocusWithinCase,
  FormButtonTypeCase: () => require('./FormButtonTypeCase').FormButtonTypeCase,
  GroupHoverMobile: () => require('./GroupHoverMobile').GroupHoverMobile,
  GroupPressInVariant: () => require('./GroupPressInVariant').GroupPressInVariant,
  GroupPseudoVariantOverride: () =>
    require('./GroupPseudoVariantOverride').GroupPseudoVariantOverride,
  GroupPressNative: () => require('./GroupPressNative').GroupPressNative,
  GroupPressTransitionMatrix: () =>
    require('./GroupPressTransitionMatrix').GroupPressTransitionMatrix,
  GroupProp: () => require('./GroupProp').GroupProp,
  GlobalScopedTriggerIsolationCase: () =>
    require('./GlobalScopedTriggerIsolationCase').GlobalScopedTriggerIsolationCase,
  MediaQueryGtMd: () => require('./MediaQueryGtMd').MediaQueryGtMd,
  MediaQueriesV5: () => require('./MediaQueriesV5').MediaQueriesV5,
  MenuAboveDialogCase: () => require('./MenuAboveDialogCase').MenuAboveDialogCase,
  MenuAnimatePositionCase: () =>
    require('./MenuAnimatePositionCase').MenuAnimatePositionCase,
  MenuAnimatePositionToggleCase: () =>
    require('./MenuAnimatePositionToggleCase').MenuAnimatePositionToggleCase,
  MenuAccessibilityCase: () => require('./MenuAccessibilityCase').MenuAccessibilityCase,
  MenuItemFocusCase: () => require('./MenuItemFocusCase').MenuItemFocusCase,
  MenuArrowAnimatePresenceCase: () =>
    require('./MenuArrowAnimatePresenceCase').MenuArrowAnimatePresenceCase,
  MenuAsChildPositionCase: () =>
    require('./MenuAsChildPositionCase').MenuAsChildPositionCase,
  MenuAutoResizeCase: () => require('./MenuAutoResizeCase').MenuAutoResizeCase,
  MenuFocusLeaveCase: () => require('./MenuFocusLeaveCase').MenuFocusLeaveCase,
  MenuHighlightCase: () => require('./MenuHighlightCase').MenuHighlightCase,
  MenuMultiTriggerCase: () => require('./MenuMultiTriggerCase').MenuMultiTriggerCase,
  MenuItemPseudoOverrideCase: () =>
    require('./MenuItemPseudoOverrideCase').MenuItemPseudoOverrideCase,
  MenuBottomCase: () => require('./MenuBottomCase').MenuBottomCase,
  MenuOverflowCase: () => require('./MenuOverflowCase').MenuOverflowCase,
  MenuDismissOnScrollCase: () =>
    require('./MenuDismissOnScrollCase').MenuDismissOnScrollCase,
  MenuRadioGroupCase: () => require('./MenuRadioGroupCase').MenuRadioGroupCase,
  MenuSubCase: () => require('./MenuSubCase').MenuSubCase,
  MenuSubNestedPositionCase: () =>
    require('./MenuSubNestedPositionCase').MenuSubNestedPositionCase,
  MenuSubLeftCase: () => require('./MenuSubLeftCase').MenuSubLeftCase,
  MultiDriverAnimation: () => require('./MultiDriverAnimation').MultiDriverAnimation,
  MenuSubStyledCase: () => require('./MenuSubStyledCase').MenuSubStyledCase,
  MenuThemeCase: () => require('./MenuThemeCase').MenuThemeCase,
  MenuUnstyledCase: () => require('./MenuUnstyledCase').MenuUnstyledCase,
  GroupUseCases: () => require('./GroupUseCases').GroupUseCases,
  HeightMediaQueryOverrideCase: () =>
    require('./HeightMediaQueryOverrideCase').HeightMediaQueryOverrideCase,
  ImageTokenStyle: () => require('./ImageTokenStyle').ImageTokenStyle,
  InputAutoFocusAfterMenuCase: () =>
    require('./InputAutoFocusAfterMenuCase').InputAutoFocusAfterMenuCase,
  InputAutoFocusStyledCase: () =>
    require('./InputAutoFocusStyledCase').InputAutoFocusStyledCase,
  ThemedListItem: () => require('./ListItem').ThemedListItem,
  NewInputBasic: () => require('./NewInputBasic').NewInputBasic,
  InputTextShorthand: () => require('./InputTextShorthand').InputTextShorthand,
  OpacityModifierCase: () => require('./OpacityModifierCase').OpacityModifierCase,
  OnLayoutCase: () => require('./OnLayoutCase').OnLayoutCase,
  OnLayoutScaleCase: () => require('./OnLayoutScaleCase').OnLayoutScaleCase,
  OnLayoutStressCase: () => require('./OnLayoutStressCase').OnLayoutStressCase,
  NewInputEvents: () => require('./NewInputEvents').NewInputEvents,
  OverlayStyled: () => require('./OverlayStyled').OverlayStyled,
  ParagraphSpanFontInheritance: () =>
    require('./ParagraphSpanFontInheritance').ParagraphSpanFontInheritance,
  PlaceholderTextColor: () => require('./PlaceholderTextColor').PlaceholderTextColor,
  PointerEventsCase: () => require('./PointerEventsCase').PointerEventsCase,
  ProgressFirstPaint: () => require('./ProgressFirstPaint').ProgressFirstPaint,
  PopoverAdaptSheetUnmountCase: () =>
    require('./PopoverAdaptSheetUnmountCase').PopoverAdaptSheetUnmountCase,
  PopoverAndMenuMultiTriggerCase: () =>
    require('./PopoverAndMenuMultiTriggerCase').PopoverAndMenuMultiTriggerCase,
  PopoverCase: () => require('./PopoverCase').PopoverCase,
  PopoverAnimatePositionCase: () => require('./PopoverCase').PopoverAnimatePositionCase,
  PopoverHoverableDelayCase: () =>
    require('./PopoverHoverableCase').PopoverHoverableDelayCase,
  PopoverHoverableRestMsCase: () =>
    require('./PopoverHoverableCase').PopoverHoverableRestMsCase,
  PopoverHoverableExitAnimCase: () =>
    require('./PopoverHoverableCase').PopoverHoverableExitAnimCase,
  PopoverHoverableSafePolygonCase: () =>
    require('./PopoverHoverableCase').PopoverHoverableSafePolygonCase,
  PopoverHoverableDisableClickCase: () =>
    require('./PopoverHoverableDisableClickCase').PopoverHoverableDisableClickCase,
  PopoverHoverableScopedCase: () =>
    require('./PopoverHoverableScopedCase').PopoverHoverableScopedCase,
  PopoverHoverableRapidCase: () =>
    require('./PopoverHoverableRapidCase').PopoverHoverableRapidCase,
  PopoverContentStyledPlusAnimations: () =>
    require('./PopoverContentStyledPlusAnimations').PopoverContentStyledPlusAnimations,
  PopoverFocusScopeCase: () => require('./PopoverFocusScopeCase').PopoverFocusScopeCase,
  PopoverScopedCase: () => require('./PopoverScopedCase').PopoverScopedCase,
  PopoverTriggerIsolationCase: () =>
    require('./PopoverTriggerIsolationCase').PopoverTriggerIsolationCase,
  PressStyleNative: () => require('./PressStyleNative').PressStyleNative,
  PressStyleScrollStuck: () => require('./PressStyleScrollStuck').PressStyleScrollStuck,
  PseudoStyleMerge: () => require('./PseudoStyleMerge').PseudoStyleMerge,
  PseudoTransitionCase: () => require('./PseudoTransitionCase').PseudoTransitionCase,
  RemoveScrollCase: () => require('./RemoveScrollCase').RemoveScrollCase,
  RenderPropCase: () => require('./RenderPropCase').RenderPropCase,
  ScrollViewRefCase: () => require('./ScrollViewRefCase').ScrollViewRefCase,
  SecondPage: () => require('./SecondPage').SecondPage,
  SelectAndroidOnPress: () => require('./SelectAndroidOnPress').SelectAndroidOnPress,
  SelectFocusScopeCase: () => require('./SelectFocusScopeCase').SelectFocusScopeCase,
  SelectRemount: () => require('./SelectRemount').SelectRemount,
  Shadows: () => require('./Shadows').Shadows,
  ShorthandVariables: () => require('./ShorthandVariables').ShorthandVariables,
  SheetAnimationCase: () => require('./SheetAnimationCase').SheetAnimationCase,
  SheetOnAnimationCompleteCase: () =>
    require('./SheetOnAnimationCompleteCase').SheetOnAnimationCompleteCase,
  SheetDragCase: () => require('./SheetDragCase').SheetDragCase,
  SheetDragResistCase: () => require('./SheetDragResistCase.web').SheetDragResistCase,
  SheetScrollableDrag: () => require('./SheetScrollableDrag').SheetScrollableDrag,
  SheetScrollLockCase: () => require('./SheetScrollLockCase').SheetScrollLockCase,
  SheetSnapPointsFitCase: () =>
    require('./SheetSnapPointsFitCase').SheetSnapPointsFitCase,
  SheetWebKeyboardCase: () => require('./SheetWebKeyboardCase').SheetWebKeyboardCase,
  SheetWebKeyboardAutoFocusCase: () =>
    require('./SheetWebKeyboardAutoFocusCase').SheetWebKeyboardAutoFocusCase,
  SlowThemeReRender: () => require('./SlowThemeReRender').SlowThemeReRender,
  SpinnerCustomColors: () => require('./SpinnerCustomColors').SpinnerCustomColors,
  StackZIndex: () => require('./StackZIndex').StackZIndex,
  StyledAnchor: () => require('./StyledAnchor').StyledAnchor,
  StyledHtmlCase: () => require('./StyledHtmlCase').StyledHtmlCase,
  StyledButtonAnimationAuto: () =>
    require('./StyledButtonAnimationAuto').StyledButtonAnimationAuto,
  StyledButtonTheme: () => require('./StyledButtonTheme').StyledButtonTheme,
  StyledButtonVariantPseudo: () =>
    require('./StyledButtonVariantPseudo').StyledButtonVariantPseudo,
  StyledButtonVariantPseudoMerge: () =>
    require('./StyledButtonVariantPseudoMerge').StyledButtonVariantPseudoMerge,
  StyledCheckboxTheme: () => require('./StyledCheckboxTheme').StyledCheckboxTheme,
  StyledContextColor: () => require('./StyledContextColor').StyledContextColor,
  StyledContextTokens: () => require('./StyledContextTokens').StyledContextTokens,
  StyledHOCNamed: () => require('./StyledHOCNamed').StyledHOCNamed,
  StyledIconColor: () => require('./StyledIconColor').StyledIconColor,
  StyledInputFocusStyle: () => require('./StyledInputFocusStyle').StyledInputFocusStyle,
  StyledInputOnFocus: () => require('./StyledInputOnFocus').StyledInputOnFocus,
  StyledMediaQueryMerge: () => require('./StyledMediaQueryMerge').StyledMediaQueryMerge,
  StyledOverridePsuedo: () => require('./StyledOverridePsuedo').StyledOverridePsuedo,
  StyledRNW: () => require('./StyledRNW').StyledRNW,
  StyledStyleableInputOnFocus: () =>
    require('./StyledStyleableInputOnFocus').StyledStyleableInputOnFocus,
  StyledStyleableInputVariant: () =>
    require('./StyledStyleableInputVariant').StyledStyleableInputVariant,
  StyledStyledStyleableInputOnFocus: () =>
    require('./StyledStyledStyleableInputOnFocus').StyledStyledStyleableInputOnFocus,
  StyledVariantTextColor: () =>
    require('./StyledVariantTextColor').StyledVariantTextColor,
  StyledViewOnFocus: () => require('./StyledViewOnFocus').StyledViewOnFocus,
  StressPage: () => require('./StressPage').StressPage,
  StyleCompatCase: () => require('./StyleCompatCase').StyleCompatCase,
  StylePlatform: () => require('./StylePlatform').StylePlatform,
  StyleProp: () => require('./StyleProp').StyleProp,
  TabsOnInteraction: () => require('./TabsOnInteraction').TabsOnInteraction,
  TextNestedInheritance: () => require('./TextNestedInheritance').TextNestedInheritance,
  TabHoverAnimationCase: () => require('./TabHoverAnimationCase').TabHoverAnimationCase,
  ThemeChange: () => require('./ThemeChange').ThemeChange,
  ThemeConditionalName: () => require('./ThemeConditionalName').ThemeConditionalName,
  ThemeChangeBasic: () => require('./ThemeChangeBasic').ThemeChangeBasic,
  ThemeComponentResolution: () =>
    require('./ThemeComponentResolution').ThemeComponentResolution,
  ThemeMutation: () => require('./ThemeMutation').ThemeMutation,
  ThemeNested: () => require('./ThemeNested').ThemeNested,
  ThemeReset: () => require('./ThemeReset').ThemeReset,
  ThemeShallowCase: () => require('./ThemeShallowCase').ThemeShallowCase,
  ToastAboveDialogCase: () => require('./ToastAboveDialogCase').ToastAboveDialogCase,
  ToastMultipleCase: () => require('./ToastMultipleCase').ToastMultipleCase,
  ToastNativeNotificationCase: () =>
    require('./ToastNativeNotificationCase').ToastNativeNotificationCase,
  ToggleGroupActiveProps: () =>
    require('./ToggleGroupActiveProps').ToggleGroupActiveProps,
  ToggleGroupXGroupCase: () => require('./ToggleGroupXGroupCase').ToggleGroupXGroupCase,
  TooltipAnimationCase: () => require('./TooltipAnimationCase').TooltipAnimationCase,
  TooltipCase: () => require('./TooltipCase').TooltipCase,
  TooltipGlobalPatternCase: () =>
    require('./TooltipGlobalPatternCase').TooltipGlobalPatternCase,
  TooltipGroupCase: () => require('./TooltipGroupCase').TooltipGroupCase,
  TooltipPositionJumpCase: () =>
    require('./TooltipPositionJumpCase').TooltipPositionJumpCase,
  TooltipTriggerInlineCase: () =>
    require('./TooltipTriggerInlineCase').TooltipTriggerInlineCase,
  TooltipMultiTriggerCase: () =>
    require('./TooltipMultiTriggerCase').TooltipMultiTriggerCase,
  TransformMediaQueryMerge: () =>
    require('./TransformMediaQueryMerge').TransformMediaQueryMerge,
  UseCases: () => require('./UseCases').UseCases,
  NumberOfLinesFontStyles: () =>
    require('./NumberOfLinesFontStyles').NumberOfLinesFontStyles,
  NumberOfLinesMediaQuery: () =>
    require('./NumberOfLinesMediaQuery').NumberOfLinesMediaQuery,
  UseTheme: () => require('./UseTheme').UseTheme,
  V5ThemeBuilderOutput: () => require('./V5ThemeBuilderOutput').V5ThemeBuilderOutput,
  VariantFontFamily: () => require('./VariantFontFamily').VariantFontFamily,
  VariantsOrder: () => require('./VariantsOrder').VariantsOrder,
  ZIndex: () => require('./ZIndex').ZIndex,
  NestedPressExclusive: () => require('./NestedPressExclusive').NestedPressExclusive,
}

export const useCases: Record<string, ComponentType<any>> = {}
for (const key of Object.keys(loaders)) {
  Object.defineProperty(useCases, key, {
    enumerable: true,
    configurable: true,
    get: () => loaders[key](),
  })
}
