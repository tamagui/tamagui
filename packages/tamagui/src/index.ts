import './setup'

export * from '@tamagui/accordion'
export * from '@tamagui/adapt'
export * from '@tamagui/alert-dialog'
export * from '@tamagui/animate-presence'
export * from '@tamagui/avatar'
export * from '@tamagui/button'
export * from '@tamagui/card'
export * from '@tamagui/checkbox'
export * from '@tamagui/compose-refs'
export * from '@tamagui/create-context'
export * from '@tamagui/dialog'
export * from '@tamagui/font-size'
export * from '@tamagui/form'
export * from '@tamagui/group'
export * from '@tamagui/helpers-tamagui'
export * from '@tamagui/image'
export * from '@tamagui/label'
export * from '@tamagui/list-item'
export * from '@tamagui/popover'
export * from '@tamagui/popper'
export * from '@tamagui/portal'
export * from '@tamagui/progress'
export * from '@tamagui/radio-group'
export * from '@tamagui/scroll-view'
export * from '@tamagui/select'
export * from '@tamagui/separator'
export * from '@tamagui/shapes'
export * from '@tamagui/sheet'
// Will uncomment when we have a skeleton component
// export * from '@tamagui/skeleton'
export * from '@tamagui/slider'
export * from '@tamagui/stacks'
export * from '@tamagui/switch'
export * from '@tamagui/tabs'
export * from '@tamagui/text'
export * from '@tamagui/theme'
export * from '@tamagui/toggle-group'
export * from '@tamagui/tooltip'
export * from '@tamagui/use-controllable-state'
export * from '@tamagui/use-debounce'
export * from '@tamagui/use-force-update'
export * from '@tamagui/use-window-dimensions'
export * from '@tamagui/visually-hidden'

export * from './createTamagui'

export * from './viewTypes'
export * from './views/TamaguiProvider'

export * from './views/Anchor'
export * from './views/EnsureFlexed'
export * from './views/Fieldset'
export * from './views/Input'
export * from './views/Layouts'
export * from './views/Spinner'
export * from './views/TextArea'
export * from './views/Text'

// since we overlap with StackProps and potentially others
// lets be explicit on what gets exported
export type {
  AnimationKeys,
  ColorTokens,
  CreateTamaguiConfig,
  CreateTamaguiProps,
  FontColorTokens,
  FontLanguages,
  FontLetterSpacingTokens,
  FontLineHeightTokens,
  FontSizeTokens,
  FontStyleTokens,
  FontTokens,
  FontTransformTokens,
  FontWeightTokens,
  GenericFont,
  GenericStackVariants,
  GenericTamaguiConfig,
  GenericTextVariants,
  GetAnimationKeys,
  GetProps,
  GetRef,
  GetVariantProps,
  GroupNames,
  Longhands,
  Media,
  MediaPropKeys,
  MediaQueries,
  MediaQueryState,
  Shorthands,
  SizeTokens,
  SpaceTokens,
  SpacerProps,
  SpecificTokens,
  StackNonStyleProps,
  StackProps,
  StackPropsBase,
  RadiusTokens,
  StaticConfig,
  Styleable,
  TamaguiBaseTheme,
  TamaguiComponent,
  TamaguiComponentPropsBase,
  TamaguiConfig,
  TamaguiCustomConfig,
  TamaguiElement,
  TamaguiInternalConfig,
  TamaguiProviderProps,
  TamaguiSettings,
  TamaguiTextElement,
  TextNonStyleProps,
  TextProps,
  TextPropsBase,
  ThemeKeys,
  ThemeName,
  ThemeParsed,
  ThemeProps,
  ThemeTokens,
  ThemeValueFallback,
  Themes,
  Token,
  Tokens,
  TransformStyleProps,
  TypeOverride,
  VariantSpreadExtras,
  VariantSpreadFunction,
  ZIndexTokens,
} from '@tamagui/core'

export {
  Configuration,
  ComponentContext,
  FontLanguage,
  // components
  Spacer,
  Stack,
  Theme,
  Unspaced,
  View,
  createComponent,
  createFont,
  createShorthands,
  createStyledContext,
  createTheme,
  createTokens,
  createVariable,
  getConfig,
  getMedia,
  getStylesAtomic,
  getThemes,
  getToken,
  getTokenValue,
  getTokens,
  getVariable,
  setupReactNative,
  getVariableName,
  getVariableValue,
  insertFont,
  setupDev,
  // constants
  isChrome,
  isClient,
  isServer,
  isTamaguiComponent,
  isTamaguiElement,
  isTouchable,
  isVariable,
  isWeb,
  isWebTouchable,
  matchMedia,
  mediaObjectToString,
  mediaQueryConfig,
  mediaState,
  spacedChildren,
  styled,
  themeable,
  useDidFinishSSR,
  useEvent,
  // hooks
  useGet,
  useIsTouchDevice,
  useIsomorphicLayoutEffect,
  useMedia,
  useProps,
  usePropsAndStyle,
  useStyle,
  useConfiguration,
  useTheme,
  useThemeName,
  variableToString,
  withStaticProperties,
} from '@tamagui/core'
