export { canonicalClauseModifier, isModifierName, reduceFlatValueIdentity, type ClauseIdentityErrorCode, type ClauseIdentityHandler } from "./runtime/clauseIdentity.js";
export { clauseSubjectClassRepetitions, createClausePrecedenceOrder, getClausePrecedenceKeyFromKinds, grammarMaxNonPlatformDepth, type ClausePrecedenceKey, type ClausePrecedenceOrder } from "./runtime/clausePrecedence.js";
export { createGrammarConfigView, grammarPlatformNames, isContainerSizeQueryText, type GrammarSourceConfig } from "./tooling/config.js";
export { mergeFlatValues } from "./runtime/mergeFlatValues.js";
export { namedCssColors } from "./runtime/namedCssColors.js";
export { compileModifierVocabulary, configRevisionSymbol, isRootThemeName, modifierKindMedia, modifierKindPlatform, modifierKindState, modifierKindTheme, type CompiledModifierKind, type CompiledModifierVocabulary } from "./runtime/modifierVocabulary.js";
export { borderSideSuffix, getTokenCategory, insetAxisProps, percentUtilityProps, radiusCornerProps, sizeUtilityProps } from "./tooling/registry.js";
export { splitColorOpacitySuffix, type ColorOpacitySuffix } from "./runtime/colorOpacity.js";
export { getSafeAreaEdge, safeAreaVariableNames } from "./runtime/safeAreaVariables.js";
export { parseFlatValue, scanFlatValue, type FlatScanErrorCode, type FlatValueHandler, type ParsedFlatValue } from "./runtime/scanFlatValue.js";
export { canonicalStateModifierNames, stateModifierSelectors, type CoreStateModifierName } from "./runtime/stateModifiers.js";
export type { NativeTransitionTarget } from "./shorthands/transitionNative.js";
export { bounceToDampingRatio, dampingRatioToBounce, springFromDurationBounce, springPosition, springSettleTime, springToDurationBounce, springToLinearEasing, type SpringCanonical, type SpringPhysics } from "./runtime/spring.js";
export { addTransformValue, cloneTransformAccumulator, createTransformAccumulator, finalizeTransformAccumulator, getTransformPartKeys, removeTransformValue, type TransformAccumulator } from "./runtime/transformAccumulator.js";
export { unitlessNumberProperties } from "./runtime/unitlessNumbers.js";
export { getTokenCategoryName, propToTokenCategoryCode, tokenCategoryColor, tokenCategoryFontFamily, tokenCategoryFontSize, tokenCategoryFontWeight, tokenCategoryLetterSpacing, tokenCategoryLineHeight, tokenCategoryNames, tokenCategoryRadius, tokenCategorySize, tokenCategorySpace, tokenCategoryZIndex, type TokenCategoryCode, type TokenCategoryName } from "./runtime/tokenCategories.js";
export type { ModifierKind, ParsedValue } from "./ast/valueTypes.js";

//# sourceMappingURL=runtime.d.ts.map