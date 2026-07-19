import './setup'

export * from '@tamagui/spacer'
export * from '@tamagui/accordion'
export * from '@tamagui/adapt'
export * from '@tamagui/alert-dialog'
export * from '@tamagui/animate'
export * from '@tamagui/animate-presence'
export * from '@tamagui/avatar'
export * from '@tamagui/button'
export * from '@tamagui/card'
export * from '@tamagui/checkbox'
export * from '@tamagui/collapsible'
export * from '@tamagui/compose-refs'
export * from '@tamagui/create-context'
export * from '@tamagui/dialog'
export * from '@tamagui/font-size'
export * from '@tamagui/field'
export * from '@tamagui/form'
export * from '@tamagui/group'
export * from '@tamagui/react-native-media-driver'
export * from '@tamagui/elements'
export * from '@tamagui/helpers-tamagui'
export * from '@tamagui/image'
export * from '@tamagui/label'
export * from '@tamagui/list-item'
export * from '@tamagui/menu'
export * from '@tamagui/context-menu'
export * from '@tamagui/create-menu'
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
export * from '@tamagui/toast'
export * from '@tamagui/toggle-group'
export * from '@tamagui/tooltip'
export * from '@tamagui/use-controllable-state'
export * from '@tamagui/use-debounce'
export * from '@tamagui/use-force-update'
export * from '@tamagui/element'
export * from '@tamagui/use-window-dimensions'
export * from '@tamagui/visually-hidden'

// styled default components — the unstyled @tamagui/ui primitives + the default
// v2-look skins (see ./components). These explicitly shadow the unstyled
// Button/Select/Sheet re-exported above from @tamagui/{button,select,sheet}, so
// `import { Button } from 'tamagui'` is styled (v2-compatible). The unstyled
// primitives remain available via `tamagui/unstyled` (= @tamagui/ui). Each skin
// file is the single definition the shadcn registry item is generated from.
export {
  Button,
  ButtonFrame,
  ButtonIcon,
  ButtonText,
  buttonSizes,
  type ButtonProps,
  type ButtonSize,
} from './components/Button'
export {
  Select,
  SelectGroup,
  SelectIcon,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  type SelectRootProps,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  selectParts,
  selectSizes,
  type SelectSize,
} from './components/Select'
export {
  Sheet,
  SheetBackground,
  SheetContainer,
  SheetControlled,
  SheetHandle,
  SheetOverlay,
  SheetRoot,
  SheetScrollView,
} from './components/Sheet'
export { Input, type InputProps, TextArea, type TextAreaProps } from './components/Input'
export { ToggleGroup, type ToggleGroupItemProps } from './components/ToggleGroup'
export { Accordion } from './components/Accordion'
export { Dialog, DialogContent, DialogOverlay } from './components/Dialog'
export { Slider, SliderActive, SliderThumb, SliderTrack } from './components/Slider'
export { ListItem, type ListItemProps } from './components/ListItem'
export { Card, CardFrame, type CardProps } from './components/Card'
export { Progress, ProgressIndicator, type ProgressProps } from './components/Progress'
export { Label, type LabelProps } from './components/Label'
export { Separator, type SeparatorProps } from './components/Separator'
// styled v2 Toast skin — shadows the unstyled @tamagui/toast composable Toast /
// Toaster / toast re-exported above, so `import { Toast, Toaster, toast } from
// 'tamagui'` is the styled v2-look toast. (The v1 imperative Toast was removed in
// v3.) Also surfaced at the tamagui/toast subpath.
export {
  Toast,
  Toaster,
  ToastItem,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toast,
  useToastItem,
  useToasts,
  type ExternalToast,
  type ToastPosition,
  type ToastT,
  type ToasterPosition,
  type ToasterProps,
} from './components/Toast'
// Surface — the copied panel/well/toolbar fixture (YStack + level variant +
// facets), plus the raw facet set for skins/user code that want to compose the
// same chrome. See ./components/Surface + ./components/facets.
export { Surface, type SurfaceProps } from './components/Surface'
export { facets } from './components/facets'

export * from './createTamagui'

export * from './viewTypes'
export * from './views/TamaguiProvider'

export * from './views/Anchor'
export * from './views/EnsureFlexed'
export * from './views/Fieldset'
export * from '@tamagui/input'
export * from '@tamagui/spinner'
export * from './views/Text'

// since we overlap with ViewProps and potentially others
// lets be explicit on what gets exported
export type {
  TransitionKeys,
  TransitionProp,
  AnimatedNumberStrategy,
  UniversalAnimatedNumber,
  UseAnimatedNumber,
  UseAnimatedNumberReaction,
  UseAnimatedNumberStyle,
  UseAnimatedNumbersStyle,
  ColorTokens,
  CreateTamaguiConfig,
  CreateTamaguiProps,
  CreatedSizeContext,
  CreatedSizeTable,
  FontColorTokens,
  FontLanguages,
  FontLetterSpacingTokens,
  FontLineHeightTokens,
  FontFamilyTokens,
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
  GetThemeValueForKey,
  GroupNames,
  Longhands,
  Media,
  MediaPropKeys,
  MediaQueries,
  MediaQueryState,
  GenericVariables,
  VariablesProps,
  VariablesValues,
  RadiusTokens,
  ResolvedFontMetric,
  ResolvedFrameMetric,
  ResolvedTokenSize,
  Shorthands,
  SizeContextValue,
  SizeResolverExtras,
  SizeTableContextValue,
  SizeTableDefinition,
  SizeTableEntry,
  SizeTableName,
  SizeTablePart,
  SizeTableProjection,
  SizeTableSelection,
  SizeTokens,
  SpaceTokens,
  SpecificTokens,
  StackNonStyleProps,
  ViewProps,
  StaticConfig,
  StyledHOCFactory,
  TamaguiBaseTheme,
  TamaguiBuildOptions,
  TamaguiComponent,
  TamaguiConfig,
  TamaguiCustomConfig,
  TamaguiElement,
  TamaguiInternalConfig,
  TamaguiProviderProps,
  TamaguiSettings,
  TamaguiTextElement,
  TextNonStyleProps,
  TextProps,
  ThemeKeys,
  ThemeName,
  ThemeParsed,
  ThemeProps,
  Themes,
  ThemeTokens,
  ThemeValueFallback,
  Token,
  TokenSize,
  Tokens,
  TypeOverride,
  Variable,
  VariantSpreadExtras,
  VariantSpreadFunction,
  ZIndexTokens,
  ViewStyle,
  TextStyle,
} from '@tamagui/core'

export {
  ClientOnly,
  Configuration,
  ComponentContext,
  GroupContext,
  FontLanguage,
  // components
  Theme,
  Variables,
  View,
  SizeContext,
  createComponent,
  createFont,
  createShorthands,
  createSizeContext,
  createSizeTable,
  createStyledContext,
  createStyledHOC,
  createTokens,
  createVariable,
  getConfig,
  getMedia,
  getCSSStylesAtomic,
  getThemes,
  getToken,
  getTokenValue,
  getTokens,
  getVariable,
  getVariableName,
  getVariableValue,
  insertFont,
  setConfig,
  setupDev,
  _withStableStyle,
  // constants
  isBrowser,
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
  resolveTokenSize,
  setOnLayoutStrategy,
  styled,
  themeable,
  // hooks
  useAnimatedNumber,
  useAnimatedNumberReaction,
  useAnimatedNumberStyle,
  useAnimatedNumbersStyle,
  useAnimationDriver,
  useClientValue,
  useDidFinishSSR,
  useEvent,
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
