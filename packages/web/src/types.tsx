import type { StyleObject } from '@tamagui/helpers'
import type { Properties } from 'csstype'
import {
  ComponentType,
  ForwardRefExoticComponent,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
  RefObject,
} from 'react'
import type {
  GestureResponderHandlers,
  PressableProps,
  Text as RNText,
  TextProps as ReactTextProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import type { Variable } from './createVariable'
import { StyledContext } from './helpers/createStyledContext'
import { CSSColorNames } from './interfaces/CSSColorNames'
import { Role } from './interfaces/Role'
import type { LanguageContextType } from './views/FontLanguage.types'
import type { ThemeProviderProps } from './views/ThemeProvider'

export type { MediaStyleObject, StyleObject } from '@tamagui/helpers'

export type SpaceDirection = 'vertical' | 'horizontal' | 'both'

export type TamaguiElement = HTMLElement | View
export type TamaguiTextElement = HTMLElement | RNText

export type DebugProp = boolean | 'break' | 'verbose' | 'visualize' | 'profile'

export type TamaguiComponentPropsBaseBase = {
  target?: string
  hitSlop?: PressableProps['hitSlop']
  /**
   * When truthy passes through all props to a single child element, and avoids rendering its own element.
   * Must pass just one child React element that will receive all the props.
   *
   * The option "except-style" will avoid passing any style related props.
   *
   * The option "web" will map all React Native style props to web props (onPress becomes onClick).
   *
   * The option "except-style-web" combines the except-style and web options.
   *
   */
  asChild?: boolean | 'except-style' | 'except-style-web' | 'web'

  dangerouslySetInnerHTML?: { __html: string }
  children?: any | any[]

  debug?: DebugProp

  disabled?: boolean

  /**
   * Same as the web className property, useful for applying styles from CSS on web only
   */
  className?: string

  /**
   * If given a theme it will only apply to this element, instead of passing down to children
   */
  themeShallow?: boolean

  /**
   * Same as the web id property for setting a uid on an element
   */
  id?: string

  /**
   * Controls the output tag on web
   */
  tag?: string

  /**
   * Applies a theme to this element
   */
  theme?: ThemeName | null

  /**
   * Marks this component as a group for use in styling children based on parents named group
   * See: https://tamagui.dev/docs/intro/props
   */
  group?: GroupNames

  /**
   * Works only alongside group, when children of the group are using container based sizing on native you can hide them until parent is measured.
   * See: https://tamagui.dev/docs/intro/props
   */
  untilMeasured?: 'hide' | 'show'

  /**
   * Equivalent to "name" property on styled() for automatically applying a theme
   */
  componentName?: string

  /**
   * Used for controlling the order of focus with keyboard or assistive device enavigation
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
   */
  tabIndex?: string | number

  /**
   * Equivalent to role="" attribute on web for accesibility
   */
  role?: Role

  /**
   * Disable all compiler optimization
   */
  disableOptimization?: boolean

  /**
   * Forces the pseudo style state to be on
   */
  forceStyle?: 'hover' | 'press' | 'focus'

  /**
   * Disables className output of styles, instead using only inline styles
   */
  disableClassName?: boolean

  // WEB ONLY TODO probably remove these in favor of something better

  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void
}

export type TamaguiComponentPropsBase<A = {}> = WebOnlyPressEvents &
  TamaguiComponentPropsBaseBase

export type WebOnlyPressEvents = {
  onPress?: PressableProps['onPress']
  onLongPress?: PressableProps['onLongPress']
  onPressIn?: PressableProps['onPress']
  onPressOut?: PressableProps['onPress']
  onHoverIn?: DivAttributes['onMouseEnter']
  onHoverOut?: DivAttributes['onMouseLeave']
  onMouseEnter?: DivAttributes['onMouseEnter']
  onMouseLeave?: DivAttributes['onMouseLeave']
  onMouseDown?: DivAttributes['onMouseDown']
  onMouseUp?: DivAttributes['onMouseUp']
}

/**
 * For static / studio
 */

type NameToPaths = {
  [key: string]: Set<string>
}

export type LoadedComponents = {
  moduleName: string
  nameToInfo: Record<
    string,
    {
      staticConfig: StaticConfig
    }
  >
}

export type TamaguiProjectInfo = {
  components: LoadedComponents[]
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

// base props that are accepted by createComponent (additional to react-native-web)

type DivAttributes = HTMLAttributes<HTMLDivElement>

export type TamaguiReactElement<P = {}> = React.ReactElement<P> & {
  type: TamaguiComponent
}

export type ReactComponentWithRef<Props, Ref> = ForwardRefExoticComponent<
  Props & RefAttributes<Ref>
>

export type ComponentContextI = {
  disableSSR?: boolean
  inText: boolean
  language: LanguageContextType | null
  animationDriver: AnimationDriver | null
  groups: GroupContextType
}

type ComponentGroupEvent = {
  pseudo?: PseudoGroupState
  layout?: LayoutValue
}

// this object must stay referentially the same always to avoid every component re-rendering
// instead `state` is mutated and only used on initial mount, after that emit/subscribe
export type GroupContextType = {
  emit: GroupStateListener
  subscribe: (cb: GroupStateListener) => DisposeFn
  state: Record<string, ComponentGroupEvent>
}

export type GroupStateListener = (name: string, state: ComponentGroupEvent) => void

type PseudoGroupState = {
  hover?: boolean
  press?: boolean
  focus?: boolean
}

// could just be TamaguiComponentState likely
export type GroupState = {
  pseudo?: PseudoGroupState
  media?: Record<MediaQueryKey, boolean>
}

export type LayoutEvent = {
  nativeEvent: {
    layout: LayoutValue
    target: any
  }
  timeStamp: number
}

type LayoutValue = {
  x: number
  y: number
  width: number
  height: number
  left: number
  top: number
}

export type DisposeFn = () => void

export type ConfigListener = (conf: TamaguiInternalConfig) => void

// to prevent things from going circular, hoisting some types in this file
// to generally order them as building up towards TamaguiConfig

export type VariableVal = number | string | Variable | VariableValGeneric
export type VariableColorVal = string | Variable

type GenericKey = string

export type CreateTokens<Val extends VariableVal = VariableVal> = Record<
  string,
  { [key: GenericKey]: Val }
> & {
  color: { [key: GenericKey]: Val }
  space: { [key: GenericKey]: Val }
  size: { [key: GenericKey]: Val }
  radius: { [key: GenericKey]: Val }
  zIndex: { [key: GenericKey]: Val }
}

type Tokenify<A extends GenericTokens> = Omit<
  {
    [Key in keyof A]: TokenifyRecord<A[Key]>
  },
  'color' | 'space' | 'size' | 'radius' | 'zIndex'
> & {
  color: TokenifyRecord<A['color']>
  space: TokenifyRecord<A['space']>
  size: TokenifyRecord<A['size']>
  radius: TokenifyRecord<A['radius']>
  zIndex: TokenifyRecord<A['zIndex']>
}

type TokenifyRecord<A extends CreateTokens[keyof CreateTokens]> = {
  [Key in keyof A]: A[Key] extends Variable ? A[Key] : Variable<A[Key]>
}

export type TamaguiBaseTheme = {
  // defined for our tamagui kit , we could do this inside `tamagui`
  // but maybe helpful to have some sort of universally shared things +
  // + enforce if they want their own, redefine in their design sys
  background: VariableColorVal
  backgroundHover: VariableColorVal
  backgroundPress: VariableColorVal
  backgroundFocus: VariableColorVal
  color: VariableColorVal
  colorHover: VariableColorVal
  colorPress: VariableColorVal
  colorFocus: VariableColorVal
  borderColor: VariableColorVal
  borderColorHover: VariableColorVal
  borderColorPress: VariableColorVal
  borderColorFocus: VariableColorVal
  shadowColor: VariableColorVal
  shadowColorHover: VariableColorVal
  shadowColorPress: VariableColorVal
  shadowColorFocus: VariableColorVal
}

export type VariableValGeneric = { __generic: 1 }

type GenericTokens = CreateTokens
type GenericThemes = {
  [key: string]:
    | Partial<TamaguiBaseTheme> & {
        [key: string]: VariableVal
      }
}

export type CreateShorthands = {
  // for some reason using keyof ViewStyle here will cause type circularity on react native 0.71
  [key: string]: string
}

export type GenericShorthands = {}

// sm: { minWidth: 100 }
type GenericMedia = {
  [key: string]: {
    [key: string]: number | string
  }
}

export type GenericFonts = Record<string, GenericFont>

type GenericAnimations = {
  [key: string]:
    | string
    | {
        [key: string]: any
      }
    | any[]
}

// this is the "main" typed object, which users re-define
// (internal) keep all types directly on this object and reference them from elsewhere
//
// const config = createTamagui(...)
// type MyConfig = typeof config
// declare module 'tamagui' {
//   export interface TamaguiCustomConfig extends MyConfig {}
// }
// now your whole app/kit should be typed correctly
//
export interface TamaguiCustomConfig {}

export interface TamaguiConfig
  extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>,
    TamaguiCustomConfig {}

type OnlyAllowShorthandsSetting = boolean | undefined
type DefaultFontSetting = string | undefined

export type CreateTamaguiConfig<
  A extends GenericTokens,
  B extends GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts,
  G extends OnlyAllowShorthandsSetting = OnlyAllowShorthandsSetting,
  H extends DefaultFontSetting = DefaultFontSetting,
  I extends GenericTamaguiSettings = GenericTamaguiSettings
> = {
  fonts: RemoveLanguagePostfixes<F>
  fontLanguages: GetLanguagePostfixes<F> extends never
    ? string[]
    : GetLanguagePostfixes<F>[]
  tokens: A
  // parsed
  themes: {
    [Name in keyof B]: {
      [Key in keyof B[Name]]: B[Name][Key] extends Variable
        ? B[Name][Key]
        : Variable<B[Name][Key]>
    }
  }
  shorthands: C
  media: D
  animations: AnimationDriver<E>
  onlyAllowShorthands: G
  defaultFont: H
  settings: I
}

type GetLanguagePostfix<Set> = Set extends string
  ? Set extends `${string}_${infer Postfix}`
    ? Postfix
    : never
  : never

type OmitLanguagePostfix<Set> = Set extends string
  ? Set extends `${infer Prefix}_${string}`
    ? Prefix
    : Set
  : never

type RemoveLanguagePostfixes<F extends GenericFonts> = {
  [Key in OmitLanguagePostfix<keyof F>]: F[Key]
}

type GetLanguagePostfixes<F extends GenericFonts> = GetLanguagePostfix<keyof F>

// test RemoveLanguagePostfixes
// type x = CreateTamaguiConfig<any, any, any, any, any, {
//   body: any,
//   body_en: any
// }>['fonts']

type ConfProps<
  A extends GenericTokens,
  B extends GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts,
  G extends OnlyAllowShorthandsSetting = OnlyAllowShorthandsSetting,
  H extends DefaultFontSetting = DefaultFontSetting,
  I extends GenericTamaguiSettings = GenericTamaguiSettings
> = {
  tokens?: A
  themes?: B
  shorthands?: C
  media?: D
  animations?: AnimationDriver<E>
  fonts?: F
  onlyAllowShorthands?: G
  defaultFont?: H
  settings?: I
}

export type InferTamaguiConfig<Conf> = Conf extends ConfProps<
  infer A,
  infer B,
  infer C,
  infer D,
  infer E,
  infer F,
  infer G,
  infer H,
  infer I
>
  ? TamaguiInternalConfig<A, B, C, D, E, F, G, H, I>
  : unknown

// for use in creation functions so it doesnt get overwritten
export type GenericTamaguiConfig = CreateTamaguiConfig<
  GenericTokens,
  GenericThemes,
  GenericShorthands,
  GenericMedia,
  GenericAnimations,
  GenericFonts
>

// try and find the top level types as they can be supersets:
type NonSubThemeNames<A extends string | number> = A extends `${string}_${string}`
  ? never
  : A
type BaseThemeDefinitions = TamaguiConfig['themes'][NonSubThemeNames<
  keyof TamaguiConfig['themes']
>]
type GenericThemeDefinition = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type ThemeDefinition = BaseThemeDefinitions extends never
  ? GenericThemeDefinition
  : BaseThemeDefinitions
export type ThemeKeys = keyof ThemeDefinition
export type ThemeParsed = {
  [key in ThemeKeys]: ThemeDefinition[key]
}

export type Tokens = TamaguiConfig['tokens']

export type TokensParsed = {
  [Key in keyof Tokens]: TokenPrefixed<Tokens[Key]>
}

type TokenPrefixed<A extends { [key: string]: any }> = {
  [key in Ensure$Prefix<keyof A>]: A[keyof A]
}

type Ensure$Prefix<A extends string | number | symbol> = A extends string
  ? A extends `$${string}`
    ? A
    : `$${A}`
  : never

export type TokensMerged = TokensParsed & Tokens

export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
export type ThemeName = Exclude<GetAltThemeNames<keyof Themes>, number>
export type ThemeTokens = `$${ThemeKeys}`
export type AnimationKeys = TamaguiConfig['animations'] extends AnimationDriver<
  infer Config
>
  ? keyof Config
  : string
export type FontLanguages = ArrayIntersection<TamaguiConfig['fontLanguages']>

export interface ThemeProps {
  className?: string
  name?: Exclude<ThemeName, number> | null
  componentName?: string
  children?: any
  reset?: boolean
  debug?: DebugProp | any
  inverse?: boolean
  // on the web, for portals we need to re-insert className
  forceClassName?: boolean
  // allows for forcing the auto-update behavior
  shouldUpdate?: () => boolean | undefined

  // used internally for shallow themes
  shallow?: boolean
}

// more low level
export type UseThemeWithStateProps = ThemeProps & {
  deopt?: boolean
  disable?: boolean
}

type ArrayIntersection<A extends any[]> = A[keyof A]

type GetAltThemeNames<S> =
  | (S extends `${string}_${infer Alt}` ? GetAltThemeNames<Alt> : S)
  | S

type SpacerPropsBase = {
  size?: SpaceValue
  flex?: boolean | number
  direction?: SpaceDirection
}

type SpacerOwnProps = SpacerPropsBase &
  //
  WithThemeShorthandsPseudosMediaAnimation<SpacerPropsBase>

export type SpacerProps = Omit<StackProps, 'flex' | 'direction' | 'size'> &
  //
  SpacerOwnProps

type AllowedValueSettingBase =
  | boolean
  | 'strict'
  | 'somewhat-strict'
  | 'strict-web'
  | 'somewhat-strict-web'

type AllowedStyleValuesSettingSize = AllowedValueSettingBase | 'number' | 'percent'
type AllowedStyleValuesSettingZIndex = AllowedValueSettingBase | 'number'
type AllowedStyleValuesSettingRadius = AllowedValueSettingBase | 'number'
type AllowedStyleValuesSettingColor = AllowedValueSettingBase | 'named'

type AllowedStyleValuesSettingPerCategory = {
  space?: AllowedStyleValuesSettingSize
  size?: AllowedStyleValuesSettingSize
  radius?: AllowedStyleValuesSettingRadius
  zIndex?: AllowedStyleValuesSettingZIndex
  color?: AllowedStyleValuesSettingColor
}

type AllowedStyleValuesSetting =
  | AllowedValueSettingBase
  | AllowedStyleValuesSettingPerCategory

type AutocompleteSpecificTokensSetting = boolean | 'except-special'

type GenericTamaguiSettings = {
  /**
   * Set up allowed values on style props, this is only a type-level validation.
   *
   * "strict" - only allows tokens for any token-enabled properties
   * "strict-web" - same as strict but allows for web-specific tokens like auto/inherit
   * "somewhat-strict" - allow tokens or:
   *     for space/size: string% or numbers
   *     for radius: number
   *     for zIndex: number
   *     for color: named colors or rgba/hsla strings
   * "somewhat-strict-web" - same as somewhat-strict but allows for web-specific tokens
   *
   * @default false - allows any string (or number for styles that accept numbers)
   *
   */
  allowedStyleValues?: AllowedStyleValuesSetting

  /**
   * Set up if "specific tokens" ($color.name) are added to the types where tokens are allowed.
   * The VSCode autocomplete puts specific tokens above the regular ones, which leads to worse DX.
   * If true this setting removes the specific token from types for the defined categories.
   *
   * If set to "except-special", specific tokens will autocomplete only if they don't normally use
   * one of the special token groups: space, size, radius, zIndex, color.
   *
   * @default except-special
   */
  autocompleteSpecificTokens?: AutocompleteSpecificTokensSetting

  /**
   * Will change the behavior of media styles. By default they have a fixed specificity: they
   * always override any $theme- or $platform- styles. With this enabled, media styles will have
   * the same precedence as the theme and platform styles, meaning that the order of the props
   * determines if they override.
   *
   * @default false
   */
  mediaPropOrder?: boolean

  /**
   * On iOS, this enables a mode where Tamagui returns color values using `DynamicColorIOS`
   * This is a React Native built in feature, you can read the docs here:
   *   https://reactnative.dev/docs/dynamiccolorios
   *
   * We're working to make this enabled by default without any setting, but Tamagui themes
   * support inversing and/or changing to light/dark at any point in the tree. We haven't implemented
   * support for either of these cases when combined with this feature.
   *
   * So - as long as you:
   *
   *   1. Only use light/dark changes of themes at the root of your app
   *   2. Don't use <Theme inverse> or themeInverse
   *   3. Always change light/dark alongside the Appearance.colorSheme
   *
   * Then this feature is safe to turn on and will significantly speed up dark/light re-renders.
   */
  fastSchemeChange?: boolean
}

export type TamaguiSettings = TamaguiConfig['settings']

export type CreateTamaguiProps = {
  reactNative?: any
  shorthands?: CreateShorthands
  media?: GenericTamaguiConfig['media']
  animations?: AnimationDriver<any>
  fonts?: GenericTamaguiConfig['fonts']
  tokens?: GenericTamaguiConfig['tokens']
  themes?: {
    [key: string]: {
      [key: string]: string | number | Variable
    }
  }

  settings?: GenericTamaguiSettings

  /**
   * Define a default font, for better types and default font on Text
   */
  defaultFont?: string

  /**
   * Web-only: define text-selection CSS
   */
  selectionStyles?: (theme: Record<string, string>) => null | {
    backgroundColor?: any
    color?: any
  }

  /**
   * *Advanced use case* For all CSS extracted views, this has no effect.
   *
   * For SSR compatibility on the web, Tamagui will render once with the settings
   * from `mediaQueryDefaultActive` set for all media queries. Then, it will render
   * again after the initial render using the proper media query values. This is so that
   * hydration will match perfectly with the server.
   *
   * Setting disableSSR will avoid this second render by setting the media query state
   * to the actual browser dimensions on initial load. This is only useful for client-only
   * apps.
   *
   */
  disableSSR?: boolean

  /**
   * Disable inserting a theme class in the DOM or context, allowing you to manually place it higher.
   * For custom use cases like integration with next-theme.
   */
  disableRootThemeClass?: boolean

  defaultProps?: Record<string, any> & {
    Stack?: StackProps
    Text?: TextProps
    Spacer?: SpacerProps
  }

  // for the first render, determines which media queries are true
  // useful for SSR
  mediaQueryDefaultActive?: Record<string, boolean>

  // what's between each CSS style rule, set to "\n" to be easier to read
  // defaults: "\n" when NODE_ENV=development, "" otherwise
  cssStyleSeparator?: string

  // (Advanced)
  // on the web, tamagui treats `dark` and `light` themes as special and
  // generates extra CSS to avoid having to re-render the entire page.
  // this CSS relies on specificity hacks that multiply by your sub-themes.
  // this sets the maxiumum number of nested dark/light themes you can do
  // defaults to 3 for a balance, but can be higher if you nest them deeply.
  maxDarkLightNesting?: number

  // adds @media(prefers-color-scheme) media queries for dark/light
  shouldAddPrefersColorThemes?: boolean

  // only if you put the theme classname on the html element we have to generate diff
  themeClassNameOnRoot?: boolean

  /**
   * Only allow shorthands when enabled
   */
  onlyAllowShorthands?: OnlyAllowShorthandsSetting
}

export type GetCSS = (opts?: {
  separator?: string
  exclude?: 'themes' | 'design-system' | null
  sinceLastCall?: boolean
}) => string

// this is the config generated via createTamagui()
export type TamaguiInternalConfig<
  A extends GenericTokens = GenericTokens,
  B extends GenericThemes = GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts,
  G extends OnlyAllowShorthandsSetting = OnlyAllowShorthandsSetting,
  H extends DefaultFontSetting = DefaultFontSetting,
  I extends GenericTamaguiSettings = GenericTamaguiSettings
> = Omit<CreateTamaguiProps, keyof GenericTamaguiConfig> &
  Omit<CreateTamaguiConfig<A, B, C, D, E, F, G, H, I>, 'tokens'> & {
    // TODO need to make it this but this breaks types, revisit
    // animations: E //AnimationDriver<E>
    // with $ prefixes for fast lookups (one time cost at startup vs every render)
    tokens: Tokenify<A>
    tokensParsed: Tokenify<A>
    themeConfig: any
    fontsParsed: GenericFonts
    getCSS: GetCSS
    getNewCSS: GetCSS
    parsed: boolean
    inverseShorthands: Record<string, string>
    reactNative?: any
    defaultFont?: H
    fontSizeTokens: Set<string>
    specificTokens: Record<string, Variable>
    settings: I
  }

export type GetAnimationKeys<A extends GenericTamaguiConfig> = keyof A['animations']

// prevents const intersections from being clobbered into string, keeping the consts
export type UnionableString = string & {}
export type UnionableNumber = number & {}

type GenericFontKey = string | number | symbol

export type GenericFont<Key extends GenericFontKey = GenericFontKey> = {
  size: { [key in Key]: number | Variable }
  lineHeight?: Partial<{ [key in Key]: number | Variable }>
  letterSpacing?: Partial<{ [key in Key]: number | Variable }>
  weight?: Partial<{ [key in Key]: number | string | Variable }>
  family?: string | Variable
  style?: Partial<{ [key in Key]: TextStyle['fontStyle'] | Variable }>
  transform?: Partial<{ [key in Key]: TextStyle['textTransform'] | Variable }>
  color?: Partial<{ [key in Key]: string | Variable }>
  // for native use only, lets you map to alternative fonts
  face?: Partial<{
    [key in FontWeightValues]: { normal?: string; italic?: string }
  }>
}

// media
export type MediaQueryObject = { [key: string]: string | number | string }
export type MediaQueryKey = keyof Media
export type MediaPropKeys = `$${MediaQueryKey}`
export type MediaQueryState = { [key in MediaQueryKey]: boolean }

export type ThemeMediaKeys<TK extends keyof Themes = keyof Themes> =
  `$theme-${TK extends `${string}_${string}` ? never : TK}`

export type PlatformMediaKeys = `$platform-${AllPlatforms}`

export interface TypeOverride {
  groupNames(): 1
}

export type GroupNames = ReturnType<TypeOverride['groupNames']> extends 1
  ? never
  : ReturnType<TypeOverride['groupNames']>

type ParentMediaStates = 'hover' | 'press' | 'focus'

export type GroupMediaKeys =
  | `$group-${GroupNames}`
  | `$group-${GroupNames}-${ParentMediaStates}`
  | `$group-${GroupNames}-${MediaQueryKey}`
  | `$group-${GroupNames}-${MediaQueryKey}-${ParentMediaStates}`

export type MediaProps<A> = {
  [key in MediaPropKeys | GroupMediaKeys | ThemeMediaKeys | PlatformMediaKeys]?: A
}

export type MediaQueries = {
  [key in MediaQueryKey]: MediaQueryObject
}

export interface MediaQueryList {
  addListener(listener?: any): void
  removeListener(listener?: any): void
  match?: (query: string, dimensions: { width: number; height: number }) => boolean
  matches: boolean
}

export type MatchMedia = (query: string) => MediaQueryList

export type TransformStyleProps = {
  x?: number
  y?: number
  perspective?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: string
  skewY?: string
  matrix?: number[]
  rotate?: string
  rotateY?: string
  rotateX?: string
  rotateZ?: string
}

// createComponent props helpers

// animation="bouncy"
// animation={['bouncy', {  }]}
// { all: 'name' }

// TODO can override for better types
export type AnimationConfigType = any

export type AnimationProp =
  | AnimationKeys
  | {
      [key: string]:
        | AnimationKeys
        | {
            type: AnimationKeys
            [key: string]: any
          }
    }
  | [
      AnimationKeys,
      {
        [key: string]:
          | AnimationKeys
          | {
              type?: AnimationKeys
              [key: string]: any
            }
      }
    ]

/**
 * Tokens
 */

type PercentString = `${string}%` & {}

type SomewhatSpecificSizeValue = 'auto' | PercentString | UnionableNumber
type SomewhatSpecificSpaceValue = 'auto' | PercentString | UnionableNumber

type VariableString = `var(${string})`

export type SomewhatSpecificColorValue =
  | CSSColorNames
  | 'transparent'
  | (`rgba(${string})` & {})
  | (`rgb(${string})` & {})
  | (`hsl(${string})` & {})
  | (`hsla(${string})` & {})
  | (`#${string}` & {})

type WebOnlySizeValue =
  | `${number}vw`
  | `${number}dvw`
  | `${number}lvw`
  | `${number}svw`
  | `${number}vh`
  | `${number}dvh`
  | `${number}lvh`
  | `${number}svh`
  | `calc(${string})`
  | `min(${string})`
  | `max(${string})`
  | 'max-content'
  | 'min-content'

type UserAllowedStyleValuesSetting = Exclude<
  TamaguiSettings['allowedStyleValues'],
  undefined
>

type GetThemeValueSettingForCategory<
  Cat extends keyof AllowedStyleValuesSettingPerCategory
> = UserAllowedStyleValuesSetting extends AllowedValueSettingBase | undefined
  ? UserAllowedStyleValuesSetting
  : UserAllowedStyleValuesSetting extends AllowedStyleValuesSettingPerCategory
  ? UserAllowedStyleValuesSetting[Cat]
  : true

type GetThemeValueFallbackFor<
  Setting,
  StrictValue,
  SomewhatStrictValue,
  LooseValue,
  WebOnlyValue
> = Setting extends 'strict'
  ? StrictValue
  : Setting extends 'strict-web'
  ? StrictValue | WebOnlyValue
  : Setting extends 'somewhat-strict'
  ? SomewhatStrictValue
  : Setting extends 'somewhat-strict-web'
  ? SomewhatStrictValue | WebOnlyValue
  : LooseValue

// the most generic fallback for anything not covered by special values
export type ThemeValueFallback =
  // for backwards compat with overriding the type we make this either UnionableString
  // or never if they don't define any UserAllowedStyleValuesSetting
  | (TamaguiSettings['allowedStyleValues'] extends undefined ? UnionableString : never)
  | Variable

type AllowedValueSettingSpace = GetThemeValueSettingForCategory<'space'>
type AllowedValueSettingSize = GetThemeValueSettingForCategory<'size'>
type AllowedValueSettingColor = GetThemeValueSettingForCategory<'color'>
type AllowedValueSettingZIndex = GetThemeValueSettingForCategory<'zIndex'>
type AllowedValueSettingRadius = GetThemeValueSettingForCategory<'radius'>

type WebStyleValueUniversal = 'unset' | 'inherit' | VariableString

export type ThemeValueFallbackSpace =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingSpace,
      never,
      SomewhatSpecificSpaceValue,
      UnionableString | UnionableNumber,
      WebStyleValueUniversal | WebOnlySizeValue
    >

export type ThemeValueFallbackSize = GetThemeValueFallbackFor<
  AllowedValueSettingSize,
  never,
  SomewhatSpecificSizeValue,
  UnionableString | UnionableNumber,
  WebStyleValueUniversal | WebOnlySizeValue
>

export type ThemeValueFallbackColor =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingColor,
      never,
      SomewhatSpecificColorValue,
      UnionableString | UnionableNumber,
      WebStyleValueUniversal
    >

export type ThemeValueFallbackRadius =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingRadius,
      never,
      UnionableNumber,
      UnionableNumber,
      WebStyleValueUniversal
    >

export type ThemeValueFallbackZIndex =
  | ThemeValueFallback
  | GetThemeValueFallbackFor<
      AllowedValueSettingZIndex,
      never,
      UnionableNumber,
      UnionableNumber,
      WebStyleValueUniversal
    >

type GetTokenString<A> = A extends string | number ? `$${A}` : `$${string}`

export type SpecificTokens<
  Record = Tokens,
  RK extends keyof Record = keyof Record
> = RK extends string
  ? `$${RK}.${keyof Record[RK] extends string | number ? keyof Record[RK] : never}`
  : never

// defaults to except-special
export type SpecificTokensSpecial = TamaguiSettings extends {
  autocompleteSpecificTokens: infer Val
}
  ? Val extends 'except-special' | undefined
    ? never
    : SpecificTokens
  : SpecificTokens

export type SizeTokens =
  | SpecificTokensSpecial
  | ThemeValueFallbackSize
  | GetTokenString<keyof Tokens['size']>

export type SpaceTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['space']>
  | ThemeValueFallbackSpace
  // TODO can remove / refactor but need to verify
  | boolean

export type ColorTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeParsed>
  | CSSColorNames

export type ZIndexTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['zIndex']>
  | number

export type RadiusTokens =
  | SpecificTokensSpecial
  | GetTokenString<keyof Tokens['radius']>
  | number

export type Token =
  | (TamaguiSettings extends { autocompleteSpecificTokens: false }
      ? never
      : SpecificTokens)
  | GetTokenString<keyof Tokens['radius']>
  | GetTokenString<keyof Tokens['zIndex']>
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof Tokens['space']>
  | GetTokenString<keyof Tokens['size']>

export type ColorStyleProp = ThemeValueFallbackColor | ColorTokens

// fonts
type DefaultFont = TamaguiConfig['defaultFont']

export type Fonts = DefaultFont extends string
  ? TamaguiConfig['fonts'][DefaultFont]
  : never

export type Font = ParseFont<Fonts>

type GetTokenFontKeysFor<
  A extends
    | 'size'
    | 'weight'
    | 'letterSpacing'
    | 'family'
    | 'lineHeight'
    | 'transform'
    | 'style'
    | 'color'
> = keyof TamaguiConfig['fonts']['body'][A]

export type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>
export type FontFamilyTokens = GetTokenString<GetTokenFontKeysFor<'family'>>
export type FontSizeTokens = GetTokenString<GetTokenFontKeysFor<'size'>> | number
export type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}` | number
export type FontWeightValues =
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`
  | 'bold'
  | 'normal'
export type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}` | FontWeightValues
export type FontColorTokens = `$${GetTokenFontKeysFor<'color'>}` | number
export type FontLetterSpacingTokens = `$${GetTokenFontKeysFor<'letterSpacing'>}` | number
export type FontStyleTokens = `$${GetTokenFontKeysFor<'style'>}` | TextStyle['fontStyle']
export type FontTransformTokens =
  | `$${GetTokenFontKeysFor<'transform'>}`
  | TextStyle['textTransform']

type ParseFont<A extends GenericFont> = {
  size: TokenPrefixed<A['size']>
  lineHeight: TokenPrefixedIfExists<A['lineHeight']>
  letterSpacing: TokenPrefixedIfExists<A['letterSpacing']>
  weight: TokenPrefixedIfExists<A['weight']>
  family: TokenPrefixedIfExists<A['family']>
  style: TokenPrefixedIfExists<A['style']>
  transform: TokenPrefixedIfExists<A['transform']>
  color: TokenPrefixedIfExists<A['color']>
  face: TokenPrefixedIfExists<A['face']>
}

type TokenPrefixedIfExists<A> = A extends Object ? TokenPrefixed<A> : {}

//
// adds theme short values to relevant props
//

export type ThemeValueByCategory<K extends string | number | symbol> = K extends 'theme'
  ? ThemeTokens
  : K extends 'size'
  ? SizeTokens
  : K extends 'font'
  ? FontTokens
  : K extends 'fontSize'
  ? FontSizeTokens
  : K extends 'space'
  ? SpaceTokens
  : K extends 'color'
  ? ColorTokens
  : K extends 'zIndex'
  ? ZIndexTokens
  : K extends 'lineHeight'
  ? FontLineHeightTokens
  : K extends 'fontWeight'
  ? FontWeightTokens
  : K extends 'letterSpacing'
  ? FontLetterSpacingTokens
  : K extends keyof Tokens
  ? // fallback to user-defined tokens
    GetTokenString<Tokens[K]>
  : never

type FontKeys = 'fontFamily'
type FontSizeKeys = 'fontSize'
type FontWeightKeys = 'fontWeight'
type FontLetterSpacingKeys = 'letterSpacing'
type LineHeightKeys = 'lineHeight'
type ZIndexKeys = 'zIndex'

export type ThemeValueGet<K extends string | number | symbol> = K extends 'theme'
  ? ThemeTokens
  : K extends SizeKeys
  ? SizeTokens | ThemeValueFallbackSize
  : K extends FontKeys
  ? FontTokens
  : K extends FontSizeKeys
  ? FontSizeTokens
  : K extends `${`border${string | ''}Radius`}`
  ? RadiusTokens | ThemeValueFallbackRadius
  : K extends SpaceKeys
  ? K extends 'shadowOffset'
    ? { width: SpaceTokens; height: SpaceTokens }
    : SpaceTokens | ThemeValueFallbackSpace
  : K extends ColorKeys
  ? ColorTokens | ThemeValueFallbackColor
  : K extends ZIndexKeys
  ? ZIndexTokens | ThemeValueFallbackZIndex
  : K extends LineHeightKeys
  ? FontLineHeightTokens
  : K extends FontWeightKeys
  ? FontWeightTokens
  : K extends FontLetterSpacingKeys
  ? FontLetterSpacingTokens
  : never

export type WithThemeValues<T extends object> = {
  [K in keyof T]: ThemeValueGet<K> extends never
    ? T[K]
    :
        | ThemeValueGet<K>
        | Exclude<T[K], string>
        | ThemeValueFallback
        | (TamaguiSettings extends { autocompleteSpecificTokens: infer Val }
            ? Val extends true | undefined
              ? SpecificTokens
              : never
            : never)
}

type NarrowShorthands = Narrow<Shorthands>
export type Longhands = NarrowShorthands[keyof NarrowShorthands]

export type OmitLonghands<R extends Record<string, any>> =
  TamaguiConfig['onlyAllowShorthands'] extends true ? Omit<R, Longhands> : R

// adds shorthand props
export type WithShorthands<StyleProps> = {
  [Key in keyof Shorthands]?: Shorthands[Key] extends keyof StyleProps
    ? StyleProps[Shorthands[Key]] | null
    : undefined
}

// adds pseudo props
export type PseudoProps<A> = {
  hoverStyle?: A | null
  pressStyle?: A | null
  focusStyle?: A | null
  exitStyle?: A | null
  enterStyle?: A | null
}

export type PseudoPropKeys = keyof PseudoProps<any>

export type PseudoStyles = {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
  enterStyle?: ViewStyle
  exitStyle?: ViewStyle
}

export type AllPlatforms = 'web' | 'native' | 'android' | 'ios'

//
// add both theme and shorthands
//
type WithThemeAndShorthands<A extends object> = WithThemeValues<OmitLonghands<A>> &
  WithShorthands<WithThemeValues<A>>

//
// combines all of theme, shorthands, pseudos...
//
type WithThemeShorthandsAndPseudos<A extends object> =
  | WithThemeAndShorthands<A> & PseudoProps<WithThemeAndShorthands<A>>

//
// ... media queries and animations
//
type WithThemeShorthandsPseudosMediaAnimation<A extends object> =
  WithThemeShorthandsAndPseudos<A> & MediaProps<WithThemeShorthandsAndPseudos<A>>

/**
 * Base style-only props (no media, pseudo):
 */

export type SpaceValue = number | SpaceTokens | ThemeValueFallback

type SharedBaseExtraStyleProps = {
  columnGap?: SpaceValue
  contain?: Properties['contain']
  cursor?: Properties['cursor']
  display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  gap?: SpaceValue
  outlineColor?: Properties['outlineColor']
  outlineOffset?: SpaceValue
  outlineStyle?: Properties['outlineStyle']
  outlineWidth?: SpaceValue
  pointerEvents?: ViewProps['pointerEvents']
  rowGap?: SpaceValue
  space?: SpaceValue
  spaceDirection?: SpaceDirection
  separator?: ReactNode
  animation?: AnimationProp | null
  animateOnly?: string[]
  userSelect?: Properties['userSelect']
}

type OverrideRNStyleProps =
  | 'display'
  | 'backfaceVisibility'
  | 'elevation'
  | 'gap'
  | 'columnGap'
  | 'rowGap'

export type StackStylePropsBase = Omit<
  ViewStyle,
  OverrideRNStyleProps | keyof SharedBaseExtraStyleProps
> &
  TransformStyleProps &
  SharedBaseExtraStyleProps

type SharedBaseExtraStylePropsText = SharedBaseExtraStyleProps & {
  ellipse?: boolean
  textDecorationDistance?: number
  textOverflow?: Properties['textOverflow']
  whiteSpace?: Properties['whiteSpace']
  wordWrap?: Properties['wordWrap']
}

export type TextStylePropsBase = Omit<
  TextStyle,
  OverrideRNStyleProps | keyof SharedBaseExtraStylePropsText
> &
  TransformStyleProps &
  SharedBaseExtraStylePropsText

export interface ExtendBaseStackProps {}
export interface ExtendBaseTextProps {}

//
// Stack
//

type LooseCombinedObjects<A extends Object, B extends Object> = A | B | (A & B)

// these are added back in by core
type OmitRemovedNonWebProps = 'onLayout' | keyof GestureResponderHandlers

export type StackNonStyleProps = Omit<
  ViewProps,
  'display' | 'children' | OmitRemovedNonWebProps | keyof ExtendBaseStackProps | 'style'
> &
  ExtendBaseStackProps &
  TamaguiComponentPropsBase & {
    // we allow either RN or web style props, of course only web css props only works on web
    style?: StyleProp<LooseCombinedObjects<React.CSSProperties, ViewStyle>>
  }

export type StackStyleProps =
  WithThemeShorthandsPseudosMediaAnimation<StackStylePropsBase>

export type StackPropsBase = StackNonStyleProps &
  WithThemeAndShorthands<StackStylePropsBase>

export type StackProps = StackNonStyleProps & StackStyleProps

//
// Text props
//

export type TextNonStyleProps = Omit<
  ReactTextProps,
  'children' | OmitRemovedNonWebProps | keyof ExtendBaseTextProps | 'style'
> &
  ExtendBaseTextProps &
  TamaguiComponentPropsBase & {
    // we allow either RN or web style props, of course only web css props only works on web
    style?: StyleProp<LooseCombinedObjects<React.CSSProperties, TextStyle>>
  }

export type TextPropsBase = TextNonStyleProps & WithThemeAndShorthands<TextStylePropsBase>

export type TextStyleProps = WithThemeShorthandsPseudosMediaAnimation<TextStylePropsBase>
export type TextProps = TextNonStyleProps & TextStyleProps

//
// StaticComponent
//

export type Styleable<Props, Ref> = <
  CustomProps extends Object,
  X extends FunctionComponent<Props & CustomProps> = FunctionComponent<
    Props & CustomProps
  >
>(
  a: X,
  staticConfig?: Partial<StaticConfig>
) => ReactComponentWithRef<CustomProps & Omit<Props, keyof CustomProps>, Ref> & {
  staticConfig: StaticConfig
  styleable: Styleable<Props, Ref>
}

export type TamaguiComponent<
  Props = any,
  Ref = any,
  BaseProps = {},
  VariantProps = {},
  ParentStaticProperties = {}
> = ReactComponentWithRef<Props, Ref> &
  StaticComponentObject<Props, Ref> &
  ParentStaticProperties & {
    __baseProps: BaseProps
    __variantProps: VariantProps
  }

type StaticComponentObject<Props, Ref> = {
  staticConfig: StaticConfig

  /** @deprecated use `styleable` instead (same functionality, better name) */
  extractable: <X>(a: X, staticConfig?: Partial<StaticConfig>) => X
  /*
   * If you want your HOC of a styled() component to also be able to be styled(), you need this to wrap it.
   */
  styleable: Styleable<Props, Ref>
}

export type TamaguiComponentExpectingVariants<
  Props = {},
  Variants = {}
> = TamaguiComponent<Props, any, any, Variants>

export type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
  config: TamaguiInternalConfig
  disableInjectCSS?: boolean
  children?: ReactNode
}

export type PropMappedValue = [string, any][] | undefined

type FlatTransforms = Record<string, any>

export type GetStyleState = {
  style: TextStyleProps
  usedKeys: Record<string, number>
  classNames: ClassNamesObject
  staticConfig: StaticConfig
  theme: ThemeParsed
  props: Record<string, any>
  context?: ComponentContextI
  curProps: Record<string, any>
  viewProps: Record<string, any>
  styleProps: SplitStyleProps
  componentState: TamaguiComponentState
  conf: TamaguiInternalConfig
  avoidMergeTransform?: boolean
  fontFamily?: string
  debug?: DebugProp
  transforms?: FlatTransforms
}

export type StyleResolver<Response = PropMappedValue> = (
  key: string,
  value: any,
  props: SplitStyleProps,
  state: GetStyleState,
  parentVariantKey: string
) => Response

export type PropMapper = (
  key: string,
  value: any,
  state: GetStyleState,
  subProps?: Record<string, any>
) => PropMappedValue

export type GenericVariantDefinitions = {
  [key: string]: {
    [key: string]:
      | ((a: any, b: any) => any)
      | {
          [key: string]: any
        }
  }
}

export type StaticConfigPublic = {
  defaultProps?: Record<string, any>

  /**
   * (compiler) If you need to pass context or something, prevents from ever
   * flattening. The 'jsx' option means it will never flatten. if you
   * pass JSX as a children (if its purely string, it will still flatten).
   */
  neverFlatten?: boolean | 'jsx'

  /**
   * Determines ultimate output tag (Text vs View)
   */
  isText?: boolean

  /**
   * Which style keys are allowed to be extracted.
   */
  validStyles?: { [key: string]: boolean }

  /**
   * (compiler) If these props are encountered, bail on all optimization.
   */
  deoptProps?: Set<string>

  /**
   * (compiler) If these props are encountered, leave them un-extracted.
   */
  inlineProps?: Set<string>

  /**
   * (compiler) If not flattening, leave this prop as original value.
   * Only applies to style attributes
   */
  inlineWhenUnflattened?: Set<string>

  /**
   * (compiler) A bit odd, only for more advanced heirarchies.
   * Indicates that the component will set this prop so the
   * static extraction can ensure it sets them to ={undefined}
   * so they get overriddent. In the future, this can be smarter.
   */
  ensureOverriddenProp?: { [key: string]: boolean }

  /**
   * Auto-detected, but can ovverride. Wraps children to space them on top
   */
  isZStack?: boolean

  /**
   * Auto-detect, but can override, passes styles properly to react-native-web
   */
  isReactNative?: boolean

  /**
   * By default if styled() doesn't recognize a parent Tamagui compoent or specific react-native views,
   * it will assume the passed in component only accepts style={} for react-native compatibility.
   * Setting `acceptsClassName: true` indicates Tamagui can pass in className props.
   */
  acceptsClassName?: boolean
}

type StaticConfigBase = StaticConfigPublic & {
  Component?: FunctionComponent<any> & StaticComponentObject<any, any>

  variants?: GenericVariantDefinitions

  context?: StyledContext

  /**
   * Used for applying sub theme style
   */
  componentName?: string

  /**
   * Merges into defaultProps later on, used internally yonly
   */
  defaultVariants?: { [key: string]: any }

  /**
   * Memoize the component
   */
  memo?: boolean

  /**
   * By default if styled() doesn't recognize a parent Tamagui compoent or specific react-native views,
   * it will assume the passed in component only accepts style={} for react-native compatibility.
   * Setting `acceptsClassName: true` indicates Tamagui can pass in className props.
   */
  acceptsClassName?: boolean

  /**
   * Used internally for handling focus
   */
  isInput?: boolean

  /**
   * Used internally for knowing how to handle when a HOC is in-between styled()
   */
  isHOC?: boolean

  // insanity, for styled(styled(styleable(styled())))
  isStyledHOC?: boolean
}

export type StaticConfig = StaticConfigBase & {
  parentStaticConfig?: StaticConfigBase
}

export type ViewStyleWithPseudos =
  | TextStyleProps
  | (TextStyleProps & {
      hoverStyle?: TextStyleProps
      pressStyle?: TextStyleProps
      focusStyle?: TextStyleProps
    })

/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */

export type StylableComponent =
  | TamaguiComponent
  // * excessively deep type instantiation
  // | TamaguiReactElement
  | ComponentType<any>
  | ForwardRefExoticComponent<any>
  | ReactComponentWithRef<any, any>
  | (new (props: any) => any)

export type GetStyledVariants<A extends TamaguiComponent> = A extends TamaguiComponent<
  any,
  any,
  any,
  infer Variants
>
  ? Variants
  : never

export type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<
  any,
  any,
  infer BaseProps
>
  ? BaseProps
  : never

export type GetProps<A extends StylableComponent> = A extends TamaguiComponent<
  infer Props
>
  ? Props
  : A extends TamaguiReactElement<infer Props>
  ? Props
  : A extends ComponentType<infer Props>
  ? GetGenericComponentTamaguiProps<Props>
  : A extends new (props: infer Props) => any
  ? GetGenericComponentTamaguiProps<Props>
  : {}

type GetGenericComponentTamaguiProps<P> = P &
  Omit<'textAlign' extends keyof P ? TextProps : StackProps, keyof P>

export type SpreadKeys =
  | '...fontSize'
  | '...fontStyle'
  | '...fontTransform'
  | '...lineHeight'
  | '...letterSpacing'
  | '...size'
  | '...space'
  | '...color'
  | '...zIndex'
  | '...theme'
  | '...radius'

export type VariantDefinitions<
  Parent extends StylableComponent = TamaguiComponent,
  MyProps extends Object = GetProps<Parent>,
  Val = any
> = VariantDefinitionFromProps<MyProps, Val>

export type VariantDefinitionFromProps<MyProps, Val> = MyProps extends Object
  ? {
      [propName: string]:
        | VariantSpreadFunction<MyProps, Val>
        | ({
            [Key in SpreadKeys]?: Key extends '...fontSize'
              ? FontSizeVariantSpreadFunction<MyProps>
              : Key extends '...size'
              ? SizeVariantSpreadFunction<MyProps>
              : Key extends '...space'
              ? SpaceVariantSpreadFunction<MyProps>
              : Key extends '...color'
              ? ColorVariantSpreadFunction<MyProps>
              : Key extends '...lineHeight'
              ? FontLineHeightVariantSpreadFunction<MyProps>
              : Key extends '...fontTransform'
              ? FontTransformVariantSpreadFunction<MyProps>
              : Key extends '...fontStyle'
              ? FontStyleVariantSpreadFunction<MyProps>
              : Key extends '...letterSpacing'
              ? FontLetterSpacingVariantSpreadFunction<MyProps>
              : Key extends '...zIndex'
              ? ZIndexVariantSpreadFunction<MyProps>
              : Key extends '...radius'
              ? RadiusVariantSpreadFunction<MyProps>
              : Key extends '...theme'
              ? ThemeVariantSpreadFunction<MyProps>
              : never
          } & {
            [Key in string | number | 'true' | 'false']?:
              | MyProps
              | VariantSpreadFunction<MyProps, Val>
          } & {
            [Key in VariantTypeKeys]?: Key extends ':number'
              ? VariantSpreadFunction<MyProps, number>
              : Key extends ':boolean'
              ? VariantSpreadFunction<MyProps, boolean>
              : Key extends ':string'
              ? VariantSpreadFunction<MyProps, string>
              : never
          })
    }
  : never

export type GenericStackVariants = VariantDefinitionFromProps<StackProps, any>
export type GenericTextVariants = VariantDefinitionFromProps<StackProps, any>

export type GetVariantProps<Variants> = {
  [Key in keyof Variants]?: Variants[Key] extends VariantSpreadFunction<any, infer Val>
    ? Val
    : GetVariantValues<keyof Variants[Key]>
}

export type VariantSpreadExtras<Props> = {
  fonts: TamaguiConfig['fonts']
  tokens: TamaguiConfig['tokens']
  theme: Themes extends { [key: string]: infer B } ? B : unknown
  props: Props
  fontFamily?: FontFamilyTokens
  font?: Font
}

type PropLike = { [key: string]: any }

export type VariantSpreadFunction<Props extends PropLike, Val = any> = (
  val: Val,
  config: VariantSpreadExtras<Props>
) =>
  | {
      [Key in keyof Props]: Props[Key] | Variable | VariableVal
    }
  | null
  | undefined

export type VariantTypeKeys = ':string' | ':boolean' | ':number'

export type GetVariantValues<Key> = Key extends `...${infer VariantSpread}`
  ? ThemeValueByCategory<VariantSpread>
  : Key extends 'true' | 'false'
  ? boolean
  : Key extends ':string'
  ? string
  : Key extends ':boolean'
  ? boolean
  : Key extends ':number'
  ? number
  : Key

export type FontSizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontSizeTokens
>
export type SizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  SizeTokens
>
export type SpaceVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  SpaceTokens
>
export type ColorVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ColorTokens
>
export type FontLineHeightVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontLineHeightTokens>
export type FontLetterSpacingVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontLetterSpacingTokens>
export type FontStyleVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontStyleTokens
>
export type FontTransformVariantSpreadFunction<A extends PropLike> =
  VariantSpreadFunction<A, FontTransformTokens>
export type ZIndexVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ZIndexTokens
>
export type RadiusVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  RadiusTokens
>
export type ThemeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  ThemeTokens
>

/**
 * --------------------------------------------
 *   end variants
 * --------------------------------------------
 */

type SizeKeys =
  | 'width'
  | 'height'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'shadowRadius'

type ColorKeys =
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderBottomColor'
  | 'borderTopColor'
  | 'borderLeftColor'
  | 'borderRightColor'
  | 'shadowColor'
  | 'textShadowColor'
  | 'borderBlockColor'
  | 'borderBlockEndColor'
  | 'borderBlockStartColor'

type SpaceKeys =
  | 'space'
  | 'padding'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingLeft'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingEnd'
  | 'paddingStart'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginLeft'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginEnd'
  | 'marginStart'
  | 'x'
  | 'y'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'borderTopEndRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderTopStartRadius'
  | 'borderBottomEndRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomStartRadius'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderRadius'
  | 'borderRightWidth'
  | 'borderTopEndRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderEndWidth'
  | 'borderStartWidth'
  | 'borderTopStartRadius'
  | 'borderTopWidth'
  | 'borderWidth'
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'shadowOffset'

export type TamaguiComponentState = {
  hover: boolean
  press: boolean
  pressIn: boolean
  focus: boolean
  unmounted: boolean | 'should-enter'
  animation?: null | {
    style?: any
    avoidClasses?: boolean
  }
  // for groups:
  group?: Record<string, GroupState>
}

export type ResolveVariableAs = 'auto' | 'value' | 'variable' | 'none' | 'web'

export type SplitStyleProps = {
  mediaState?: Record<string, boolean>
  noClassNames?: boolean
  noExpand?: boolean
  noNormalize?: boolean
  noSkip?: boolean
  resolveValues?: ResolveVariableAs
  disableExpandShorthands?: boolean
  fallbackProps?: Record<string, any>
  hasTextAncestor?: boolean
  // for animations
  isAnimated: boolean
  isExiting?: boolean
  exitVariant?: string
  enterVariant?: string
  keepStyleSSR?: boolean
}

// Presence

export interface PresenceContextProps {
  id: string
  isPresent: boolean
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | string | string[]
  custom?: any
  exitVariant?: string | null
  enterVariant?: string | null
  enterExitVariant?: string | null
}

type SafeToRemoveCallback = () => void
type AlwaysPresent = [true, null, null]
type Present = [true, undefined, PresenceContextProps]
type NotPresent = [false, SafeToRemoveCallback, PresenceContextProps]

export type UsePresenceResult = AlwaysPresent | Present | NotPresent

// Animations:

type AnimationConfig = {
  [key: string]: any
}

// includes a very limited adapter between various impls for number => style
// this is useful only in limited scenarios like `Sheet`, but necessary in those cases
// TODO: make css driver compatible with this?

export type AnimatedNumberStrategy =
  // only values shared between reanimated/react-native for now
  | {
      type: 'spring'
      stiffness?: number
      damping?: number
      mass?: number
      overshootClamping?: boolean
      restSpeedThreshold?: number
      restDisplacementThreshold?: number
    }
  | { type: 'timing'; duration: number }
  | { type: 'direct' }

export type UniversalAnimatedNumber<A> = {
  getInstance(): A
  getValue(): number
  setValue(next: number, config?: AnimatedNumberStrategy, onFinished?: () => void): void
  stop(): void
}

export type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
  isReactNative?: boolean
  keepStyleSSR?: boolean
  supportsCSSVars?: boolean
  useAnimations: UseAnimationHook
  usePresence: () => UsePresenceResult
  useAnimatedNumber: (initial: number) => UniversalAnimatedNumber<any>
  useAnimatedNumberStyle: <V extends UniversalAnimatedNumber<any>>(
    val: V,
    getStyle: (current: any) => any
  ) => any
  useAnimatedNumberReaction: <V extends UniversalAnimatedNumber<any>>(
    opts: {
      value: V
      hostRef: RefObject<HTMLElement | View>
    },
    onValue: (current: number) => void
  ) => void
  animations: A
  View?: any
  Text?: any
}

export type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>

export type UseAnimationHook = (props: {
  style: Record<string, any>
  props: Record<string, any>
  presence?: UsePresenceResult | null
  hostRef: RefObject<HTMLElement | View>
  staticConfig: StaticConfig
  styleProps: SplitStyleProps
  componentState: TamaguiComponentState
  theme: ThemeParsed
  pseudos: PseudoProps<ViewStyle> | null
  onDidAnimate?: any
  delay?: number
}) => null | {
  style?: StackStylePropsBase | StackStylePropsBase[]
}

export type GestureReponderEvent = Exclude<
  View['props']['onResponderMove'],
  void
> extends (event: infer Event) => void
  ? Event
  : never

export type RulesToInsert = StyleObject[]

export type GetStyleResult = {
  pseudos?: PseudoStyles | null
  style: ViewStyle
  classNames: ClassNamesObject
  rulesToInsert: RulesToInsert
  viewProps: StackProps & Record<string, any>
  fontFamily: string | undefined
  space?: any // SpaceTokens?
  hasMedia: boolean | string[]
  dynamicThemeAccess?: boolean
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
}

export type ClassNamesObject = Record<string, string>

export type TamaguiComponentEvents = {
  cancelable?: boolean | undefined
  disabled?: any
  hitSlop?: any
  delayLongPress?: any
  delayPressIn?: any
  delayPressOut?: any
  focusable?: any
  minPressDuration?: number | undefined
  onPressIn: ((e: any) => void) | undefined
  onPress: ((e: any) => void) | undefined
  onLongPress?: ((e: any) => void) | undefined
  onMouseEnter?: ((e: any) => void) | undefined
  onMouseLeave?: ((e: any) => void) | undefined
  onPressOut: ((e: any) => void) | undefined
}

export type ModifyTamaguiComponentStyleProps<
  Comp extends TamaguiComponent,
  ChangedProps extends Object
> = Comp extends TamaguiComponent<infer A, infer B, infer C, infer D, infer E>
  ? A extends Object
    ? TamaguiComponent<Omit<A, keyof ChangedProps> & ChangedProps, B, C, D, E>
    : never
  : never

/**
 * Narrow copied from ts-toolbelt
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/Narrow.ts
 */
export type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch

type Narrowable = string | number | bigint | boolean

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>
    }

export type Narrow<A> = Try<A, [], NarrowRaw<A>>

export type NativePlatform = 'web' | 'mobile' | 'android' | 'ios'
export type NativeValue<Platform extends NativePlatform = NativePlatform> =
  | boolean
  | Platform
  | Platform[]

/**
 * `StyleProp` copied from React Native:
 *  Exported to fix https://github.com/tamagui/tamagui/issues/1258
 */

export type Falsy = undefined | null | false
export interface RecursiveArray<T>
  extends Array<T | ReadonlyArray<T> | RecursiveArray<T>> {}
/** Keep a brand of 'T' so that calls to `StyleSheet.flatten` can take `RegisteredStyle<T>` and return `T`. */

export type RegisteredStyle<T> = number & { __registeredStyleBrand: T }
export type StyleProp<T> =
  | T
  | RegisteredStyle<T>
  | RecursiveArray<T | RegisteredStyle<T> | Falsy>
  | Falsy

export type FillInFont<A extends GenericFont, DefaultKeys extends string | number> = {
  family: string
  lineHeight: FillInFontValues<A, 'lineHeight', DefaultKeys>
  weight: FillInFontValues<A, 'weight', DefaultKeys>
  letterSpacing: FillInFontValues<A, 'letterSpacing', DefaultKeys>
  size: FillInFontValues<A, 'size', DefaultKeys>
  style: FillInFontValues<A, 'style', DefaultKeys>
  transform: FillInFontValues<A, 'transform', DefaultKeys>
  color: FillInFontValues<A, 'color', DefaultKeys>
  face: A['face']
}

type FillInFontValues<
  A extends GenericFont,
  K extends keyof A,
  DefaultKeys extends string | number
> = keyof A[K] extends GenericFontKey
  ? {
      [Key in DefaultKeys]: A[K][any]
    }
  : {
      [Key in keyof A[K] | DefaultKeys]: Key extends keyof A[K]
        ? Exclude<A[K][Key], Variable>
        : any
    }

export type ThemesLikeObject = Record<string, Record<string, string>>

// dedupe themes to avoid duplicate CSS generation
export type DedupedTheme = {
  names: string[]
  theme: ThemeParsed
}

export type DedupedThemes = DedupedTheme[]

export type UseMediaState = {
  [key in MediaQueryKey]: boolean
}
