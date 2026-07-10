// native usecase registry (lazy). includes native-only usecases.
// AUTO-SHAPED lazy registry: each usecase module is required (and therefore
// evaluated) only when its component is first accessed, not when this index loads.
// Object.keys(useCases) lists names without evaluating any usecase (getters are not
// invoked by Object.keys); useCases[name] evaluates just that one. This avoids the
// per-launch eval of every usecase that made Detox app relaunches slow.
import type { ComponentType } from 'react'

const loaders: Record<string, () => ComponentType<any>> = {
  ActionsSheetComparison: () =>
    require('./ActionsSheetComparison').ActionsSheetComparison,
  AnimatedByProp: () => require('./AnimatedByProp').AnimatedByProp,
  AnimatePresenceExitTest: () =>
    require('./AnimatePresenceExitTest').AnimatePresenceExitTest,
  AnimationComprehensiveCase: () =>
    require('./AnimationComprehensiveCase').AnimationComprehensiveCase,
  Benchmark: () => require('./Benchmark').Benchmark,
  ButtonCircular: () => require('./ButtonCircular').ButtonCircular,
  GroupDisabledStyleLatchCase: () =>
    require('./GroupDisabledStyleLatchCase').GroupDisabledStyleLatchCase,
  ButtonCustom: () => require('./ButtonCustom').ButtonCustom,
  ButtonInverse: () => require('./ButtonInverse').ButtonInverse,
  ButtonUnstyled: () => require('./ButtonUnstyled').ButtonUnstyled,
  CheckboxDisabledOnPress: () =>
    require('./CheckboxDisabledOnPress').CheckboxDisabledOnPress,
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
  DialogFocusScopeCase: () => require('./DialogFocusScopeCase').DialogFocusScopeCase,
  DialogFocusScopeDebug: () => require('./DialogFocusScopeDebug').DialogFocusScopeDebug,
  DialogNestedCase: () => require('./DialogNestedCase').DialogNestedCase,
  DialogOpenControlled: () => require('./DialogOpenControlled').DialogOpenControlled,
  DialogPointerEventsCase: () =>
    require('./DialogPointerEventsCase').DialogPointerEventsCase,
  DialogScopedCase: () => require('./DialogScopedCase').DialogScopedCase,
  DialogSheetAdaptCase: () => require('./DialogSheetAdaptCase').DialogSheetAdaptCase,
  DialogSheetAdaptHandoffCase: () =>
    require('./DialogSheetAdaptHandoffCase').DialogSheetAdaptHandoffCase,
  AdaptLiveSlotSpikeCase: () =>
    require('./AdaptLiveSlotSpikeCase').AdaptLiveSlotSpikeCase,
  Example: () => require('./Example').Example,
  ExitCompletionCase: () => require('./ExitCompletionCase').ExitCompletionCase,
  FocusScopeNoFocusCase: () => require('./FocusScopeNoFocusCase').FocusScopeNoFocusCase,
  FocusVisibleButton: () => require('./FocusVisibleButton').FocusVisibleButton,
  FocusVisibleButtonPointer: () =>
    require('./FocusVisibleButtonPointer').FocusVisibleButtonPointer,
  FocusVisibleButtonWithFocusStyle: () =>
    require('./FocusVisibleButtonWithFocusStyle').FocusVisibleButtonWithFocusStyle,
  FontTokensInVariants: () => require('./FontTokensInVariants').FontTokensInVariants,
  GroupHoverMobile: () => require('./GroupHoverMobile').GroupHoverMobile,
  GroupPressInVariant: () => require('./GroupPressInVariant').GroupPressInVariant,
  GroupPseudoVariantOverride: () =>
    require('./GroupPseudoVariantOverride').GroupPseudoVariantOverride,
  GroupPressNative: () => require('./GroupPressNative').GroupPressNative,
  GroupPressTransitionMatrix: () =>
    require('./GroupPressTransitionMatrix').GroupPressTransitionMatrix,
  GroupProp: () => require('./GroupProp').GroupProp,
  MediaQueryGtMd: () => require('./MediaQueryGtMd').MediaQueryGtMd,
  MediaQueriesV5: () => require('./MediaQueriesV5').MediaQueriesV5,
  MotionReduceCase: () => require('./MotionReduceCase').MotionReduceCase,
  MenuAccessibilityCase: () => require('./MenuAccessibilityCase').MenuAccessibilityCase,
  MenuAsChildPositionCase: () =>
    require('./MenuAsChildPositionCase').MenuAsChildPositionCase,
  MenuHighlightCase: () => require('./MenuHighlightCase').MenuHighlightCase,
  MenuRadioGroupCase: () => require('./MenuRadioGroupCase').MenuRadioGroupCase,
  MenuSubCase: () => require('./MenuSubCase').MenuSubCase,
  MenuSubLeftCase: () => require('./MenuSubLeftCase').MenuSubLeftCase,
  NativePortalTest: () => require('./NativePortalTest').NativePortalTest,
  GroupUseCases: () => require('./GroupUseCases').GroupUseCases,
  IconFillStroke: () => require('./IconFillStroke').IconFillStroke,
  ImageObjectFit: () => require('./ImageObjectFit').ImageObjectFit,
  ImageTokenStyle: () => require('./ImageTokenStyle').ImageTokenStyle,
  ThemedListItem: () => require('./ListItem').ThemedListItem,
  NewInputBasic: () => require('./NewInputBasic').NewInputBasic,
  InputTextShorthand: () => require('./InputTextShorthand').InputTextShorthand,
  NewInputEvents: () => require('./NewInputEvents').NewInputEvents,
  OverlayStyled: () => require('./OverlayStyled').OverlayStyled,
  PlaceholderTextColor: () => require('./PlaceholderTextColor').PlaceholderTextColor,
  PointerEventsCase: () => require('./PointerEventsCase').PointerEventsCase,
  PopoverCase: () => require('./PopoverCase').PopoverCase,
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
  RenderPropCase: () => require('./RenderPropCase').RenderPropCase,
  SafeAreaValue: () => require('./SafeAreaValue').SafeAreaValue,
  ScrollViewRefCase: () => require('./ScrollViewRefCase').ScrollViewRefCase,
  SecondPage: () => require('./SecondPage').SecondPage,
  SelectAndroidOnPress: () => require('./SelectAndroidOnPress').SelectAndroidOnPress,
  SelectFocusScopeCase: () => require('./SelectFocusScopeCase').SelectFocusScopeCase,
  SelectRemount: () => require('./SelectRemount').SelectRemount,
  Shadows: () => require('./Shadows').Shadows,
  ShorthandVariables: () => require('./ShorthandVariables').ShorthandVariables,
  SheetAnimationCase: () => require('./SheetAnimationCase').SheetAnimationCase,
  SheetDragCase: () => require('./SheetDragCase').SheetDragCase,
  SheetDragResistCase: () => require('./SheetDragResistCase').SheetDragResistCase,
  SheetKeyboardDragCase: () => require('./SheetKeyboardDragCase').SheetKeyboardDragCase,
  SheetKeyboardFitContentCase: () =>
    require('./SheetKeyboardFitContentCase').SheetKeyboardFitContentCase,
  KeyboardControllerTest: () =>
    require('./KeyboardControllerTest').KeyboardControllerTest,
  SheetScrollableDrag: () => require('./SheetScrollableDrag').SheetScrollableDrag,
  SheetScrollLockCase: () => require('./SheetScrollLockCase').SheetScrollLockCase,
  SheetSnapPointsFitCase: () =>
    require('./SheetSnapPointsFitCase').SheetSnapPointsFitCase,
  SheetFit3pcNativeRepro: () =>
    require('./SheetFit3pcNativeRepro').SheetFit3pcNativeRepro,
  SheetPressRegressionCase: () =>
    require('./SheetPressRegressionCase').SheetPressRegressionCase,
  SlowThemeReRender: () => require('./SlowThemeReRender').SlowThemeReRender,
  SpinnerCustomColors: () => require('./SpinnerCustomColors').SpinnerCustomColors,
  StackZIndex: () => require('./StackZIndex').StackZIndex,
  StyledAnchor: () => require('./StyledAnchor').StyledAnchor,
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
  IconFontSizing: () => require('./IconFontSizing').IconFontSizing,
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
  StylePlatform: () => require('./StylePlatform').StylePlatform,
  StyleProp: () => require('./StyleProp').StyleProp,
  TabsOnInteraction: () => require('./TabsOnInteraction').TabsOnInteraction,
  TextNestedInheritance: () => require('./TextNestedInheritance').TextNestedInheritance,
  TextOverflowEllipsis: () => require('./TextOverflowEllipsis').TextOverflowEllipsis,
  ThemeChange: () => require('./ThemeChange').ThemeChange,
  ThemeChangeBasic: () => require('./ThemeChangeBasic').ThemeChangeBasic,
  ThemeComponentResolution: () =>
    require('./ThemeComponentResolution').ThemeComponentResolution,
  ThemeMutation: () => require('./ThemeMutation').ThemeMutation,
  ThemeNested: () => require('./ThemeNested').ThemeNested,
  ThemeReset: () => require('./ThemeReset').ThemeReset,
  ThemeShallowCase: () => require('./ThemeShallowCase').ThemeShallowCase,
  ToastMultipleCase: () => require('./ToastMultipleCase').ToastMultipleCase,
  ToastNativeBurntCase: () => require('./ToastNativeBurntCase').ToastNativeBurntCase,
  ToggleGroupActiveProps: () =>
    require('./ToggleGroupActiveProps').ToggleGroupActiveProps,
  TooltipAnimationCase: () => require('./TooltipAnimationCase').TooltipAnimationCase,
  TooltipCase: () => require('./TooltipCase').TooltipCase,
  TooltipGroupCase: () => require('./TooltipGroupCase').TooltipGroupCase,
  TooltipPositionJumpCase: () =>
    require('./TooltipPositionJumpCase').TooltipPositionJumpCase,
  TooltipTriggerInlineCase: () =>
    require('./TooltipTriggerInlineCase').TooltipTriggerInlineCase,
  TransformMediaQueryMerge: () =>
    require('./TransformMediaQueryMerge').TransformMediaQueryMerge,
  UseCases: () => require('./UseCases').UseCases,
  UseTheme: () => require('./UseTheme').UseTheme,
  V5ThemeBuilderOutput: () => require('./V5ThemeBuilderOutput').V5ThemeBuilderOutput,
  VariantFontFamily: () => require('./VariantFontFamily').VariantFontFamily,
  VariantsOrder: () => require('./VariantsOrder').VariantsOrder,
  VisibilityCase: () => require('./VisibilityCase').VisibilityCase,
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
