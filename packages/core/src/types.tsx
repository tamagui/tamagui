// TODO split this into own package @tamagui/types to share with animations packages

import CSS from 'csstype'
import React from 'react'
import {
  GestureResponderEvent,
  Image,
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
import { RNWTextProps, RNWViewProps } from './types-rnw'
import { ThemeProviderProps } from './views/ThemeProvider'

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
type GenericShorthands = {
  // [key: string]: string
}

type GenericMedia<K extends string = string> = {
  // name => media shorthand name (camelCase) => value
  [key in K]: {
    [key: string]: number | string
  }
}

type GenericFonts = {
  [key: string]: GenericFont
}

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
> = Partial<Pick<ThemeProviderProps, 'defaultTheme' | 'disableRootThemeClass'>> & {
  fonts: F
  tokens: A
  themes: B
  shorthands: C
  media: D
  animations: AnimationDriver<E>
}

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
export type ThemeObject = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type Tokens = TamaguiConfig['tokens']
export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
export type ThemeName = GetAltThemeNames<keyof Themes>
// export type ThemeNameWithSubThemes = GetSubThemes<ThemeName>
export type ThemeKeys = keyof ThemeObject
export type ThemeTokens = `$${ThemeKeys}`
export type AnimationKeys = GetAnimationKeys<TamaguiConfig>

type GetAltThemeNames<S> = (S extends `${string}_${infer Alt}` ? GetAltThemeNames<Alt> : S) | S

// this is the config generated via createTamagui()
export type TamaguiInternalConfig<
  A extends GenericTokens = GenericTokens,
  B extends GenericThemes = GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia,
  E extends GenericAnimations = GenericAnimations,
  F extends GenericFonts = GenericFonts
> = CreateTamaguiConfig<A, B, C, D, E, F> & {
  // TODO need to make it this but this breaks types, revisit
  // animations: E //AnimationDriver<E>
  Provider: (props: TamaguiProviderProps) => any
  // with $ prefixes for fast lookups (one time cost at startup vs every render)
  tokensParsed: CreateTokens<Variable>
  themeConfig: any
  fontsParsed: GenericFonts
  getCSS: () => string
  parsed: boolean
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
}

// media
export type MediaKeys = keyof Media
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
export type ConfigureMediaQueryOptions = {
  queries?: MediaQueries
  defaultActive?: MediaQueryKey[]
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

//
// base props that are accepted by createComponent (additional to react-native-web)
//
export type TamaguiComponentPropsBase = {
  space?: SpaceTokens
  dangerouslySetInnerHTML?: { __html: string }
  animation?: AnimationKeys
  animateOnly?: string[]
  children?: any | any[]
  debug?: boolean | 'break' | 'verbose'
  disabled?: boolean
  className?: string
  id?: string
  tag?: string
  theme?: ThemeName | null
  onHoverIn?: (e: MouseEvent) => any
  onHoverOut?: (e: MouseEvent) => any
  onPress?: (e: GestureResponderEvent) => any
  onPressIn?: (e: GestureResponderEvent) => any
  onPressOut?: (e: GestureResponderEvent) => any
  // WEB ONLY
  onMouseEnter?: (e: MouseEvent) => any
  onMouseLeave?: (e: MouseEvent) => any
  onMouseDown?: (e: MouseEvent) => any
}

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
> = keyof TamaguiConfig['fonts'][keyof TamaguiConfig['fonts']][A]

type GetTokenString<A> = A extends string | number ? `$${A}` : `$${string}`

// base tokens
export type SizeTokens = GetTokenString<keyof Tokens['size']> | number
export type SpaceTokens = GetTokenString<keyof Tokens['space']> | number | boolean
export type ColorTokens =
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeObject>
  | CSSColorNames
export type ZIndexTokens = GetTokenString<keyof Tokens['zIndex']> | number
export type RadiusTokens = GetTokenString<keyof Tokens['radius']> | number

// font tokens
export type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>
export type FontSizeTokens = GetTokenString<GetTokenFontKeysFor<'size'>> | number
export type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}` | number
export type FontWeightTokens =
  | `$${GetTokenFontKeysFor<'weight'>}`
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`
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

export type PsuedoPropKeys = keyof PseudoProps<any>

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
// combines all of theme, shorthands, psuedos...
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

//
// Text props
//

export type TextStylePropsBase = Omit<TextStyle, 'display' | 'backfaceVisibility'> &
  TransformStyleProps &
  WebOnlyStyleProps & {
    ellipse?: boolean
    selectable?: boolean
    textDecorationDistance?: number
    userSelect?: CSS.Properties['userSelect']
    textOverflow?: CSS.Properties['textOverflow']
    whiteSpace?: CSS.Properties['whiteSpace']
    wordWrap?: CSS.Properties['wordWrap']
    cursor?: CSS.Properties['cursor']
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
  injectCSS?: boolean
  children?: React.ReactNode
}

export type StaticConfigParsed = StaticConfig & {
  parsed: true
  propMapper: (
    key: string,
    value: any,
    theme: ThemeObject,
    props: any,
    resolveVariablesAs?: ResolveVariableTypes,
    avoidDefaultProps?: boolean
  ) => undefined | boolean | { [key: string]: any }
  variantsParsed?: {
    [key: string]: {
      [key: string]: any
    }
  }
}

export type StaticConfig = {
  Component?: React.FunctionComponent<any> & StaticComponentObject

  variants?: {
    [key: string]: {
      [key: string]:
        | ((a: any, b: any) => any)
        | {
            [key: string]: any
          }
    }
  }

  /**
   * Used for applying sub theme style
   */
  componentName?: string

  /**
   * If you need to pass context or something, prevents from ever
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
  defaultProps?: any

  /**
   * If these props are encountered, bail on all optimization.
   */
  deoptProps?: Set<string>

  /**
   * If these props are encountered, leave them un-extracted.
   */
  inlineProps?: Set<string>

  /**
   * A bit odd, only for more advanced heirarchies.
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
   * Memoize the component
   */
  memo?: boolean

  /**
   * Auto-detect, but can ovverride, passes styles properly to react-native-web
   */
  isTamagui?: boolean
}

/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */

export type StylableComponent =
  | TamaguiComponent
  | React.Component
  | React.ForwardRefExoticComponent<any>
  | (new (props: any) => any)
  | typeof View
  | typeof Text
  | typeof TextInput
  | typeof Image

export type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<
  any,
  any,
  infer BaseProps
>
  ? BaseProps
  : never

export type GetProps<A extends StylableComponent> = A extends TamaguiComponent<infer Props>
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
            [Key in string | number]?: MyProps | VariantSpreadFunction<MyProps, Val>
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
  resolveVariablesAs?: ResolveVariableTypes
  fallbackProps?: Object
}

// Animations:

type AnimationConfig = {
  [key: string]: any
}

export type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
  avoidClasses?: boolean
  useAnimations: UseAnimationHook
  animations: A
  View?: any
  Text?: any
}

export type UseAnimationProps = TamaguiComponentPropsBase &
  Record<string, any> & {
    animation: string
  }

export type UseAnimationHelpers = {
  staticConfig: StaticConfigParsed
  getStyle: (props?: {
    isEntering?: boolean
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
) => {
  style?: StackStylePropsBase | StackStylePropsBase[]
  safeToUnmount?: () => void
}
