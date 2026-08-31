export {
  canonicalClauseModifier,
  isModifierName,
  reduceFlatValueIdentity,
  type ClauseIdentityErrorCode,
  type ClauseIdentityHandler,
} from './runtime/clauseIdentity'
export {
  clauseSubjectClassRepetitions,
  createClausePrecedenceOrder,
  getClausePrecedenceKeyFromKinds,
  type ClausePrecedenceKey,
  type ClausePrecedenceOrder,
} from './runtime/clausePrecedence'
export {
  createGrammarConfigView,
  grammarPlatformNames,
  isContainerSizeQueryText,
  type GrammarSourceConfig,
} from './tooling/config'
export { mergeFlatValues } from './runtime/mergeFlatValues'
export {
  compileModifierVocabulary,
  configRevisionSymbol,
  isRootThemeName,
  modifierKindMedia,
  modifierKindPlatform,
  modifierKindState,
  modifierKindTheme,
  type CompiledModifierKind,
  type CompiledModifierVocabulary,
} from './runtime/modifierVocabulary'
export {
  borderSideSuffix,
  getTokenCategory,
  percentUtilityProps,
  radiusCornerProps,
} from './tooling/registry'
export { splitColorOpacitySuffix, type ColorOpacitySuffix } from './runtime/colorOpacity'
export { getSafeAreaEdge, safeAreaVariableNames } from './runtime/safeAreaVariables'
export {
  parseFlatValue,
  scanFlatValue,
  type FlatScanErrorCode,
  type FlatValueHandler,
  type ParsedFlatValue,
} from './runtime/scanFlatValue'
export {
  canonicalStateModifierNames,
  stateModifierSelectors,
  type CoreStateModifierName,
} from './runtime/stateModifiers'
export type { NativeTransitionTarget } from './shorthands/transitionNative'
export {
  addTransformValue,
  cloneTransformAccumulator,
  createTransformAccumulator,
  finalizeTransformAccumulator,
  getTransformPartKeys,
  removeTransformValue,
  type TransformAccumulator,
} from './runtime/transformAccumulator'
export { unitlessNumberProperties } from './runtime/unitlessNumbers'
export {
  getTokenCategoryName,
  propToTokenCategoryCode,
  tokenCategoryColor,
  tokenCategoryFontFamily,
  tokenCategoryFontSize,
  tokenCategoryFontWeight,
  tokenCategoryLetterSpacing,
  tokenCategoryLineHeight,
  tokenCategoryNames,
  tokenCategoryRadius,
  tokenCategorySize,
  tokenCategorySpace,
  tokenCategoryZIndex,
  type TokenCategoryCode,
  type TokenCategoryName,
} from './runtime/tokenCategories'
export type { ModifierKind, ParsedValue } from './ast/valueTypes'
