import './setup.js'

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

export * from './views/TamaguiProvider'
export * from './viewTypes'

export * from './views/Anchor'
export * from './views/EnsureFlexed'
export * from './views/Fieldset'
export * from './views/Grid'
export * from './views/Input'
export * from './views/Layouts'
export * from './views/Spinner'
export * from './views/TextArea'

// since we overlap with StackProps and potentially others
// lets be explicit on what gets exported
export type {
  AnimationKeys,
  ColorTokens,
  CreateTamaguiConfig,
  CreateTamaguiProps,
  FontColorTokens,
  FontLetterSpacingTokens,
  FontLineHeightTokens,
  FontSizeTokens,
  FontStyleTokens,
  FontTokens,
  FontTransformTokens,
  FontWeightTokens,
  GenericFont,
  GenericTamaguiConfig,
  GetAnimationKeys,
  GetProps,
  GetVariantProps,
  GenericTextVariants,
  GenericStackVariants,
  Media,
  MediaPropKeys,
  MediaQueries,
  MediaQueryState,
  Shorthands,
  SizeTokens,
  SpaceTokens,
  SpacerProps,
  StackPropsBase,
  TamaguiElement,
  StackNonStyleProps,
  StaticConfig,
  StaticConfigParsed,
  TamaguiBaseTheme,
  TamaguiComponent,
  TamaguiComponentPropsBase,
  TamaguiConfig,
  FontLanguages,
  TamaguiCustomConfig,
  TamaguiInternalConfig,
  TamaguiProviderProps,
  TextProps,
  TextPropsBase,
  TextNonStyleProps,
  ThemeKeys,
  ThemeName,
  ThemeParsed,
  Longhands,
  StackProps,
  ThemeProps,
  Themes,
  ThemeValueFallback,
  Tokens,
  TransformStyleProps,
  VariantSpreadExtras,
  Styleable,
  VariantSpreadFunction,
  ZIndexTokens,
} from '@tamagui/core'

export {
  // components
  Spacer,
  Stack,
  Text,
  Theme,
  FontLanguage,
  Unspaced,
  // context,
  TextAncestorContext,
  AnimationDriverProvider,
  // constants
  isChrome,
  isClient,
  isServer,
  isTouchable,
  isWeb,
  isWebTouchable,
  mediaQueryConfig,
  createComponent,
  createFont,
  createShorthands,
  createTheme,
  createTokens,
  createVariable,
  getConfig,
  getAnimationDriver,
  getMedia,
  getStylesAtomic,
  getThemes,
  getTokens,
  getVariable,
  variableToString,
  getVariableValue,
  getVariableName,
  insertFont,
  isTamaguiElement,
  isTamaguiComponent,
  isVariable,
  matchMedia,
  mediaObjectToString,
  mediaState,
  spacedChildren,
  styled,
  themeable,
  useStyle,
  withStaticProperties,
  // hooks
  useGet,
  useEvent,
  useDidFinishSSR,
  useIsomorphicLayoutEffect,
  useIsTouchDevice,
  useMedia,
  useTheme,
  useThemeName,
  useProps,
  useMediaPropsActive,
  useSafeRef,
} from '@tamagui/core'

export function LinearGradient(props: never) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`LinearGradient has been moved to tamagui/linear-gradient as of 1.1`)
  }
  return null
}
