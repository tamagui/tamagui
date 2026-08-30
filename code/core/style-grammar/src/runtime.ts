export {
  classifyCandidate,
  decodeArbitrary,
  parseCandidate,
  type CandidateClassification,
  type GrammarConfigView,
  type ParsedCandidate,
} from './candidate'
export {
  canonicalClauseModifier,
  isModifierName,
  reduceFlatValueIdentity,
  type ClauseIdentityErrorCode,
  type ClauseIdentityHandler,
} from './clauseIdentity'
export {
  clauseSubjectClassRepetitions,
  createClausePrecedenceOrder,
  getClausePrecedenceKeyFromKinds,
  type ClausePrecedenceKey,
  type ClausePrecedenceOrder,
} from './clausePrecedence'
export {
  createGrammarConfigView,
  grammarPlatformNames,
  isContainerSizeQueryText,
  type GrammarSourceConfig,
} from './config'
export { mergeFlatValues } from './mergeFlatValues'
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
} from './modifierVocabulary'
export {
  borderSideSuffix,
  getTokenCategory,
  percentUtilityProps,
  radiusCornerProps,
} from './registry'
export { splitColorOpacitySuffix } from './resolvePayload'
export { getSafeAreaEdge, safeAreaVariableNames } from './safeAreaVariables'
export {
  scanFlatValue,
  type FlatScanErrorCode,
  type FlatValueHandler,
} from './scanFlatValue'
export {
  canonicalStateModifierNames,
  stateModifierSelectors,
  type CoreStateModifierName,
} from './stateModifiers'
export type { NativeTransitionTarget } from './transitionNative'
export {
  addTransformValue,
  cloneTransformAccumulator,
  createTransformAccumulator,
  finalizeTransformAccumulator,
  getTransformPartKeys,
  removeTransformValue,
  type TransformAccumulator,
} from './transformAccumulator'
export { unitlessNumberProperties } from './unitlessNumbers'
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
} from './tokenCategories'
export type { ModifierKind, ParsedValue } from './valueTypes'
