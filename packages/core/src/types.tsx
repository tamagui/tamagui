// TODO split this into own package @tamagui/types to share with animations packages

import { Properties } from 'csstype'
import React, { RefObject } from 'react'
import {
  GestureResponderEvent,
  Image,
  PressableProps,
  TextProps as ReactTextProps,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { Variable } from './createVariable'
import { ResolveVariableTypes } from './helpers/createPropMapper'
import { TamaguiReactElement } from './static'
import { RNWTextProps, RNWViewProps } from './types-rnw'
import { FontLanguageProps } from './views/FontLanguage.types'
import { ThemeProviderProps } from './views/ThemeProvider'

export type SpaceDirection = 'vertical' | 'horizontal' | 'both'

export type TamaguiElement = HTMLElement | View

export type DebugProp = boolean | 'break' | 'verbose'

//
// base props that are accepted by createComponent (additional to react-native-web)
//
export type TamaguiComponentPropsBase = {
  hitSlop?: PressableProps['hitSlop']
  asChild?: boolean
  space?: SpaceTokens | null
  spaceDirection?: SpaceDirection
  separator?: React.ReactNode
  dangerouslySetInnerHTML?: { __html: string }
  animation?: AnimationProp
  animateOnly?: string[]
  children?: any | any[]
  debug?: DebugProp
  disabled?: boolean
  className?: string
  themeShallow?: boolean
  id?: string
  tag?: string
  theme?: ThemeName | null
  componentName?: string
  forceStyle?: 'hover' | 'press' | 'focus'
  onHoverIn?: (e: MouseEvent) => any
  onHoverOut?: (e: MouseEvent) => any
  onPress?: (e: GestureResponderEvent) => any
  onPressIn?: (e: GestureResponderEvent) => any
  onPressOut?: (e: GestureResponderEvent) => any
  // WEB ONLY
  onMouseEnter?: (e: MouseEvent) => any
  onMouseLeave?: (e: MouseEvent) => any
  onMouseDown?: (e: MouseEvent) => any
  // WEB STYLES
  userSelect?: Properties['userSelect']
  cursor?: Properties['cursor']
}

export type ReactComponentWithRef<Props, Ref> = React.ForwardRefExoticComponent<
  Props & React.RefAttributes<Ref>
>

export type ConfigListener = (conf: TamaguiInternalConfig) => void

// to prevent things from going circular, hoisting some types in this file
// to generally order them as building up towards TamaguiConfig

export type VariableVal = number | string | Variable
export type VariableColorVal = string | Variable

type GenericKey = string | number | symbol

export interface CreateTokens<Val extends VariableVal = VariableVal> {
  color: { [key: GenericKey]: Val }
  space: { [key: GenericKey]: Val }
  size: { [key: GenericKey]: Val }
  radius: { [key: GenericKey]: Val }
  zIndex: { [key: GenericKey]: Val }
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

type GenericTokens = CreateTokens
type GenericThemes = {
  [key: string]:
    | Partial<TamaguiBaseTheme> & {
        [key: string]: VariableVal
      }
}

type GenericShorthands = {}

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

export type CreateTamaguiConfig<
  A extends GenericTokens,
  B extends GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts
> = {
  fonts: RemoveLanguagePostfixes<F>
  fontLanguages: GetLanguagePostfixes<F> extends never ? string[] : GetLanguagePostfixes<F>[]
  tokens: A
  // parsed
  themes: {
    [Name in keyof B]: {
      [Key in keyof B[Name]]: Variable
    }
  }
  shorthands: C
  media: D
  animations: AnimationDriver<E>
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
  F extends GenericFonts = GenericFonts
> = {
  tokens: A
  themes: B
  shorthands?: C
  media?: D
  animations?: AnimationDriver<E>
  fonts: F
}

export type InferTamaguiConfig<Conf> = Conf extends ConfProps<
  infer A,
  infer B,
  infer C,
  infer D,
  infer E,
  infer F
>
  ? TamaguiInternalConfig<A, B, C, D, E, F>
  : unknown

// for use in creation functions so it doesnt get overwrtitten
export type GenericTamaguiConfig = CreateTamaguiConfig<
  GenericTokens,
  GenericThemes,
  GenericShorthands,
  GenericMedia,
  GenericAnimations,
  GenericFonts
>

// since TamaguiConfig will be re-declared, these will all be typed globally
export type ThemeDefinition = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type ThemeKeys = keyof ThemeDefinition
export type ThemeParsed = {
  [key in ThemeKeys]: Variable
}
export type Tokens = TamaguiConfig['tokens']
export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
export type ThemeName = GetAltThemeNames<keyof Themes>
export type ThemeTokens = `$${ThemeKeys}`
export type AnimationKeys = Omit<GetAnimationKeys<TamaguiConfig>, number>
export type FontLanguages = ArrayIntersection<TamaguiConfig['fontLanguages']>

type ArrayIntersection<A extends any[]> = A[keyof A]

type GetAltThemeNames<S> = (S extends `${string}_${infer Alt}` ? GetAltThemeNames<Alt> : S) | S

export type SpacerProps = Omit<StackProps, 'flex' | 'direction' | 'size'> & {
  size?: number | SpaceTokens | null
  flex?: boolean | number
  direction?: SpaceDirection
}

export type CreateTamaguiProps = {
  shorthands?: GenericTamaguiConfig['shorthands']
  media?: GenericTamaguiConfig['media']
  animations?: AnimationDriver<any>
  fonts: GenericTamaguiConfig['fonts']
  tokens: GenericTamaguiConfig['tokens']
  themes: {
    [key: string]: {
      [key: string]: string | number | Variable
    }
  }

  defaultTheme?: string

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
  mediaQueryDefaultActive?: Record<MediaQueryKey, boolean>

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
}

// this is the config generated via createTamagui()
export type TamaguiInternalConfig<
  A extends GenericTokens = GenericTokens,
  B extends GenericThemes = GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts
> = Omit<CreateTamaguiProps, keyof GenericTamaguiConfig> &
  CreateTamaguiConfig<A, B, C, D, E, F> & {
    // TODO need to make it this but this breaks types, revisit
    // animations: E //AnimationDriver<E>
    // with $ prefixes for fast lookups (one time cost at startup vs every render)
    tokensParsed: CreateTokens<Variable>
    themeConfig: any
    fontsParsed: GenericFonts
    getCSS: () => string
    parsed: boolean
    inverseShorthands: Record<string, string>
  }

export type GetAnimationKeys<A extends GenericTamaguiConfig> = keyof A['animations']['animations']

// prevents const intersections from being clobbered into string, keeping the consts
export type UnionableString = string & {}
export type UnionableNumber = number & {}
export type PropTypes<A extends TamaguiComponent> = A extends React.FunctionComponent<infer Props>
  ? Props
  : unknown

export type GenericFont<Key extends number | string = number | string> = {
  size: { [key in Key]: number | Variable }
  lineHeight: Partial<{ [key in Key]: number | Variable }>
  letterSpacing: Partial<{ [key in Key]: number | Variable }>
  weight: Partial<{ [key in Key]: number | string | Variable }>
  family: string | Variable
  style?: Partial<{ [key in Key]: TextStyle['fontStyle'] | Variable }>
  transform?: Partial<{ [key in Key]: TextStyle['textTransform'] | Variable }>
  color?: Partial<{ [key in Key]: string | Variable }>
  // for native use only, lets you map to alternative fonts
  face?: { [key in FontWeightSteps]: { normal?: string; italic?: string } }
}

// media
export type MediaQueryObject = { [key: string]: string | number | string }
export type MediaQueryKey = keyof Media
export type MediaPropKeys = `$${MediaQueryKey}`
export type MediaQueryState = { [key in MediaPropKeys]: boolean }
export type MediaProps<A> = {
  [key in MediaPropKeys]?: A
}
export type MediaQueries = {
  [key in MediaQueryKey]: MediaQueryObject
}

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

type GetTokenString<A> = A extends string | number ? `$${A}` : `$${string}`

// base tokens
export type SizeTokens = GetTokenString<keyof Tokens['size']> | number
export type SpaceTokens = GetTokenString<keyof Tokens['space']> | number | boolean
export type ColorTokens =
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeParsed>
  | CSSColorNames
export type ZIndexTokens = GetTokenString<keyof Tokens['zIndex']> | number
export type RadiusTokens = GetTokenString<keyof Tokens['radius']> | number

// font tokens
export type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>
export type FontSizeTokens = GetTokenString<GetTokenFontKeysFor<'size'>> | number
export type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}` | number
export type FontWeightSteps = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`
export type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}` | FontWeightSteps
export type FontColorTokens = `$${GetTokenFontKeysFor<'color'>}` | number
export type FontLetterSpacingTokens = `$${GetTokenFontKeysFor<'letterSpacing'>}` | number
export type FontStyleTokens = `$${GetTokenFontKeysFor<'style'>}` | TextStyle['fontStyle']
export type FontTransformTokens =
  | `$${GetTokenFontKeysFor<'transform'>}`
  | TextStyle['textTransform']

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
  : {}

type FontKeys = 'fontFamily'
type FontSizeKeys = 'fontSize'
type FontWeightKeys = 'fontWeight'
type FontLetterSpacingKeys = 'letterSpacing'
type LineHeightKeys = 'lineHeight'
type ZIndexKeys = 'zIndex'

export type ThemeValueGet<K extends string | number | symbol> = K extends 'theme'
  ? ThemeTokens
  : K extends SizeKeys
  ? SizeTokens
  : K extends FontKeys
  ? FontTokens
  : K extends FontSizeKeys
  ? FontSizeTokens
  : K extends SpaceKeys
  ? K extends 'shadowOffset'
    ? { width: SpaceTokens; height: SpaceTokens }
    : SpaceTokens
  : K extends ColorKeys
  ? ColorTokens
  : K extends ZIndexKeys
  ? ZIndexTokens
  : K extends LineHeightKeys
  ? FontLineHeightTokens
  : K extends FontWeightKeys
  ? FontWeightTokens
  : K extends FontLetterSpacingKeys
  ? FontLetterSpacingTokens
  : never

export type ThemeValueFallback = UnionableString | Variable

export type WithThemeValues<T extends object> = {
  [K in keyof T]: ThemeValueGet<K> extends never
    ? T[K]
    : ThemeValueGet<K> | Exclude<T[K], string> | ThemeValueFallback
}

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

//
// add both theme and shorthands
//
type WithThemeAndShorthands<A extends object> = WithThemeValues<A> &
  WithShorthands<WithThemeValues<A>>

//
// combines all of theme, shorthands, pseudos...
//
type WithThemeShorthandsAndPseudos<A extends object> =
  | WithThemeAndShorthands<A> & PseudoProps<WithThemeAndShorthands<A>>

//
// ... media queries and animations
//
type WithThemeShorthandsPseudosMediaAnimation<A extends object> = WithThemeShorthandsAndPseudos<A> &
  MediaProps<WithThemeShorthandsAndPseudos<A>>

//
// Stack
//

type WebOnlyStyleProps = {
  // WEB ONLY
  cursor?: string
  // WEB ONLY
  contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
  // WEB ONLY values: inherit, inline, block, content
  display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  // WEB ONLY pointerEvents can be a style prop
  pointerEvents?: ViewProps['pointerEvents']
}

export type StackStylePropsBase = Omit<ViewStyle, 'display' | 'backfaceVisibility' | 'elevation'> &
  TransformStyleProps &
  WebOnlyStyleProps

export type StackPropsBaseShared = Omit<ViewProps, 'display' | 'children'> &
  RNWViewProps &
  TamaguiComponentPropsBase

export type StackStyleProps = WithThemeShorthandsPseudosMediaAnimation<StackStylePropsBase>
export type StackPropsBase = StackPropsBaseShared & WithThemeAndShorthands<StackStylePropsBase>
export type StackProps = StackPropsBaseShared & StackStyleProps

export type GestureReponderEvent = Exclude<View['props']['onResponderMove'], void> extends (
  event: infer Event
) => void
  ? Event
  : never

//
// Text props
//

export type TextStylePropsBase = Omit<TextStyle, 'display' | 'backfaceVisibility'> &
  TransformStyleProps &
  WebOnlyStyleProps & {
    ellipse?: boolean
    selectable?: boolean
    textDecorationDistance?: number
    textOverflow?: Properties['textOverflow']
    whiteSpace?: Properties['whiteSpace']
    wordWrap?: Properties['wordWrap']
  }

export type TextPropsBaseShared = Omit<ReactTextProps, 'children'> &
  RNWTextProps &
  TamaguiComponentPropsBase
export type TextPropsBase = TextPropsBaseShared & WithThemeAndShorthands<TextStylePropsBase>
export type TextStyleProps = WithThemeShorthandsPseudosMediaAnimation<TextStylePropsBase>
export type TextProps = TextPropsBaseShared & TextStyleProps

// could actually infer from parent
export type ViewOrTextProps = WithThemeShorthandsPseudosMediaAnimation<
  Omit<TextStylePropsBase, keyof StackStylePropsBase> & StackStylePropsBase
>

//
// StaticComponent
//

export type TamaguiComponent<
  Props = any,
  Ref = any,
  BaseProps = {},
  VariantProps = {}
> = ReactComponentWithRef<Props, Ref> & StaticComponentObject

type StaticComponentObject = {
  staticConfig: StaticConfig
  /*
   * Only needed for more complex components
   * If you create a styled frame component this is a HoC to extract
   * styles from all parents.
   */
  extractable: <X>(a: X, opts?: Partial<StaticConfig>) => X
}

export type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
  config: TamaguiInternalConfig
  disableInjectCSS?: boolean
  children?: React.ReactNode
}

export type PropMapper = (
  key: string,
  value: any,
  theme: ThemeParsed,
  props: Record<string, any>,
  state: Partial<SplitStyleState>,
  languageContext?: FontLanguageProps,
  avoidDefaultProps?: boolean,
  debug?: DebugProp
) => undefined | [string, any][]

export type StaticConfigParsed = StaticConfig & {
  parsed: true
  propMapper: PropMapper
  variantsParsed?: {
    [key: string]: {
      [key: string]: any
    }
  }
}

export type GenericVariantDefinitions = {
  [key: string]: {
    [key: string]:
      | ((a: any, b: any) => any)
      | {
          [key: string]: any
        }
  }
}

export type StaticConfig = {
  Component?: React.FunctionComponent<any> & StaticComponentObject

  variants?: GenericVariantDefinitions

  /**
   * Used for applying sub theme style
   */
  componentName?: string

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
   * Attempts to attach focus styles at runtime (useful for native)
   */
  isInput?: boolean

  /**
   * React native web images need special handling for className support
   */
  isImage?: boolean

  /**
   * Which style keys are allowed to be extracted.
   */
  validStyles?: { [key: string]: boolean }

  /**
   * Same as React.defaultProps, be sure to sync
   */
  defaultProps: Record<string, any>

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
   * Merges into defaultProps later on, used internally yonly
   */
  defaultVariants?: { [key: string]: any }

  /**
   * Auto-detect, but can ovverride, passes styles properly to react-native-web
   */
  isReactNativeWeb?: boolean

  /**
   * Used internally to keep reference to the original rnw component
   */
  reactNativeWebComponent?: any

  /**
   * Memoize the component
   */
  memo?: boolean

  /**
   * Auto-detect, but can ovverride, passes styles properly to react-native-web
   */
  isTamagui?: boolean

  /**
   * Used internally to handle extractable HoC separate
   */
  isHOC?: boolean

  /**
   * Used insternally to attach default props to names
   */
  parentNames?: string[]

  /**
   * By default if styled() doesn't recognize a parent Tamagui compoent or specific react-native views,
   * it will assume the passed in component only accepts style={} for react-native compatibility.
   * Setting `acceptsClassName: true` indicates Tamagui can pass in className props.
   */
  acceptsClassName?: boolean
}

/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */

export type StylableComponent =
  | TamaguiComponent
  // * excessively deep type instantiation
  // | TamaguiReactElement
  | React.Component
  | React.ForwardRefExoticComponent<any>
  | ReactComponentWithRef<any, any>
  | (new (props: any) => any)
  | typeof View
  | typeof Text
  | typeof TextInput
  | typeof Image

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

export type GetProps<A extends StylableComponent> = A extends TamaguiComponent<infer Props>
  ? Props
  : A extends TamaguiReactElement<infer Props>
  ? Props
  : A extends React.Component<infer Props>
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
}

type PropLike = { [key: string]: any }

export type VariantSpreadFunction<Props extends PropLike, Val = any> = (
  val: Val,
  config: VariantSpreadExtras<Props>
) =>
  | {
      [Key in keyof Props]: Props[Key] | Variable
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
export type SizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, SizeTokens>
export type SpaceVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, SpaceTokens>
export type ColorVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ColorTokens>
export type FontLineHeightVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontLineHeightTokens
>
export type FontLetterSpacingVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontLetterSpacingTokens
>
export type FontStyleVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontStyleTokens
>
export type FontTransformVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<
  A,
  FontTransformTokens
>
export type ZIndexVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ZIndexTokens>
export type RadiusVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, RadiusTokens>
export type ThemeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ThemeTokens>

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

type CSSColorNames =
  | 'aliceblue'
  | 'antiquewhite'
  | 'aqua'
  | 'aquamarine'
  | 'azure'
  | 'beige'
  | 'bisque'
  | 'black'
  | 'blanchedalmond'
  | 'blue'
  | 'blueviolet'
  | 'brown'
  | 'burlywood'
  | 'cadetblue'
  | 'chartreuse'
  | 'chocolate'
  | 'coral'
  | 'cornflowerblue'
  | 'cornsilk'
  | 'crimson'
  | 'cyan'
  | 'darkblue'
  | 'darkcyan'
  | 'darkgoldenrod'
  | 'darkgray'
  | 'darkgreen'
  | 'darkkhaki'
  | 'darkmagenta'
  | 'darkolivegreen'
  | 'darkorange'
  | 'darkorchid'
  | 'darkred'
  | 'darksalmon'
  | 'darkseagreen'
  | 'darkslateblue'
  | 'darkslategray'
  | 'darkturquoise'
  | 'darkviolet'
  | 'deeppink'
  | 'deepskyblue'
  | 'dimgray'
  | 'dodgerblue'
  | 'firebrick'
  | 'floralwhite'
  | 'forestgreen'
  | 'fuchsia'
  | 'gainsboro'
  | 'ghostwhite'
  | 'gold'
  | 'goldenrod'
  | 'gray'
  | 'green'
  | 'greenyellow'
  | 'honeydew'
  | 'hotpink'
  | 'indianred '
  | 'indigo  '
  | 'ivory'
  | 'khaki'
  | 'lavender'
  | 'lavenderblush'
  | 'lawngreen'
  | 'lemonchiffon'
  | 'lightblue'
  | 'lightcoral'
  | 'lightcyan'
  | 'lightgoldenrodyellow'
  | 'lightgrey'
  | 'lightgreen'
  | 'lightpink'
  | 'lightsalmon'
  | 'lightseagreen'
  | 'lightskyblue'
  | 'lightslategray'
  | 'lightsteelblue'
  | 'lightyellow'
  | 'lime'
  | 'limegreen'
  | 'linen'
  | 'magenta'
  | 'maroon'
  | 'mediumaquamarine'
  | 'mediumblue'
  | 'mediumorchid'
  | 'mediumpurple'
  | 'mediumseagreen'
  | 'mediumslateblue'
  | 'mediumspringgreen'
  | 'mediumturquoise'
  | 'mediumvioletred'
  | 'midnightblue'
  | 'mintcream'
  | 'mistyrose'
  | 'moccasin'
  | 'navajowhite'
  | 'navy'
  | 'oldlace'
  | 'olive'
  | 'olivedrab'
  | 'orange'
  | 'orangered'
  | 'orchid'
  | 'palegoldenrod'
  | 'palegreen'
  | 'paleturquoise'
  | 'palevioletred'
  | 'papayawhip'
  | 'peachpuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderblue'
  | 'purple'
  | 'red'
  | 'rosybrown'
  | 'royalblue'
  | 'saddlebrown'
  | 'salmon'
  | 'sandybrown'
  | 'seagreen'
  | 'seashell'
  | 'sienna'
  | 'silver'
  | 'skyblue'
  | 'slateblue'
  | 'slategray'
  | 'snow'
  | 'springgreen'
  | 'steelblue'
  | 'tan'
  | 'teal'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'white'
  | 'whitesmoke'
  | 'yellow'
  | 'yellowgreen'

export type TamaguiComponentState = {
  hover: boolean
  press: boolean
  pressIn: boolean
  focus: boolean
  mounted: boolean
  animation?: null | {
    style?: any
    avoidClasses?: boolean
  }
}

export type SplitStyleState = TamaguiComponentState & {
  noClassNames?: boolean
  dynamicStylesInline?: boolean
  resolveVariablesAs?: ResolveVariableTypes
  fallbackProps?: Record<string, any>
  keepVariantsAsProps?: boolean
  hasTextAncestor?: boolean
}

// Animations:

type AnimationConfig = {
  [key: string]: any
}

// includes a very limited adapter between various impls for number => style
// this is useful only in limited scenarios like `Sheet`, but necessary in those cases

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
  setValue(next: number, config?: AnimatedNumberStrategy): void
  stop(): void
}

export type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
  avoidClasses?: boolean
  useAnimations: UseAnimationHook
  useAnimatedNumber: (initial: number) => UniversalAnimatedNumber<any>
  useAnimatedNumberStyle: <V extends UniversalAnimatedNumber<any>>(
    val: V,
    getStyle: (current: any) => any
  ) => void
  useAnimatedNumberReaction: (
    val: UniversalAnimatedNumber<any>,
    onValue: (current: number) => void
  ) => void
  animations: A
  View?: any
  Text?: any
}

export type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>

export type UseAnimationHelpers = {
  hostRef: RefObject<HTMLElement | View>
  staticConfig: StaticConfigParsed
  getStyle: (props?: {
    isEntering?: boolean
    isExiting?: boolean
    exitVariant?: string | null
    enterVariant?: string | null
  }) => ViewStyle
  state: SplitStyleState
  pseudos: PseudoProps<ViewStyle>
  // style: ViewStyle | null | undefined
  // isMounted: boolean
  // exitStyle?: ViewStyle | null
  onDidAnimate?: any
  delay?: number
  // mergedStyles(props?: { isExiting?: boolean }): ViewStyle
}

export type UseAnimationHook = (
  props: UseAnimationProps,
  helpers: UseAnimationHelpers
) => null | {
  style?: StackStylePropsBase | StackStylePropsBase[]
}
