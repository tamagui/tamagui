import './polyfills'

export { useSafeAreaInsets } from 'react-native-safe-area-context'

export * from '@tamagui/helpers'

// since we overlap with StackProps and potentially others
// lets be explicit on what gets exported
export {
  // types
  AnimationKeys,
  ColorTokens,
  CreateTamaguiConfig,
  CreateTamaguiProps,
  FontLetterSpacingTokens,
  FontLineHeightTokens,
  FontSizeTokens,
  FontTokens,
  FontWeightTokens,
  GenericTamaguiConfig,
  GetAnimationKeys,
  GetProps,
  GetVariantProps,
  Media,
  MediaKeys,
  MediaQueries,
  mediaQueryConfig,
  MediaQueryState,
  Shorthands,
  SizeTokens,
  SpaceTokens,
  StaticComponent,
  StaticConfig,
  StaticConfigParsed,
  TamaguiBaseTheme,
  TamaguiConfig,
  TamaguiCustomConfig,
  TamaguiInternalConfig,
  TamaguiProviderProps,
  TextProps,
  ThemeableHOC,
  ThemeValueFallback,
  ThemeKeys,
  ThemeName,
  ThemeObject,
  ThemeProps,
  Themes,
  Tokens,
  TransformStyleProps,
  VariantSpreadExtras,
  VariantSpreadFunction,
  ZIndexTokens,
  // components
  Spacer,
  Stack,
  Text,
  Theme,
  ThemeInverse,
  ThemeReset,
  // context,
  TextAncestorContext,
  // constants
  isChrome,
  isSSR,
  isTouchDevice,
  isWeb,
  isWebIOS,
  supportsTouchWeb,
  // helpers
  addMediaQueryListener,
  createComponent,
  createFont,
  createShorthands,
  createTamagui,
  createTheme,
  createTokens,
  createVariable,
  getHasConfigured,
  getMedia,
  getStylesAtomic,
  getTamagui,
  getThemes,
  getTokens,
  isObj,
  isTamaguiElement,
  matchMedia,
  mediaObjectToString,
  mediaState,
  spacedChildren,
  styled,
  themeable,
  Variable,
  withStaticProperties,
  // hooks
  useConstant,
  useDefaultThemeName,
  useIsomorphicLayoutEffect,
  useMedia,
  useTheme,
  useThemeName,
} from '@tamagui/core'

export * from './viewTypes'

export * from '@tamagui/use-debounce'
export * from '@tamagui/use-force-update'

export * from './hooks/useLayout'
export * from './hooks/useKeyboardDismissable'

export * from './views/BlurView'
export * from './views/Box'
export * from './views/Button'
export * from './views/Card'
export * from './views/Circle'
export * from './views/EnsureFlexed'
export * from './views/Form'
export * from './views/Grid'
export * from './views/Headings'
export * from './views/Hoverable'
export * from './views/HoverablePopover'
export * from './views/Image'
export * from './views/InteractiveContainer'
export * from './views/Layouts'
export * from './views/LinearGradient'
export * from './views/Modal'
export * from './views/Overlay'
export * from './views/Paragraph'
export * from './views/Popover/Popover'
export * from './views/Popover/PopoverProvider'
export * from './views/SafeAreaProvider'
export * from './views/Separator'
export * from './views/SizableFrame'
export * from './views/SizableText'
export * from './views/Square'
export * from './views/Stacks'
export * from './views/Table'
export * from './views/Toast'
export * from './views/Tooltip'
export * from './views/TouchableOpacity'
export * from './views/Transitions'
export * from './views/VisuallyHidden'

export * from './helpers/prevent'
export * from './helpers/getFontSize'
