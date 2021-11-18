import { RefObject } from 'react'
import { TextProps as ReactTextProps, TextStyle } from 'react-native'
import { GestureResponderEvent, View, ViewProps, ViewStyle } from 'react-native'

import { Variable } from './createVariable'
import { ThemeProviderProps } from './views/ThemeProvider'

// to prevent things from going circular, hoisting some types in this file
// to generally order them as building up towards TamaguiConfig

export type TamaguiStylesBase = Omit<ViewStyle, 'display' | 'backfaceVisibility'> &
  TransformStyleProps & {
    cursor?: string
    contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  }

type StyleKeys = keyof TamaguiStylesBase

type GenericTokens = CreateTokens
type GenericThemes = {
  [key: string]: {
    // defined for our tamagui kit , we could do this inside `tamagui`
    // but maybe helpful to have some sort of universally shared things +
    // + enforce if they want their own, redefine in their design sys
    bg: string | Variable
    bg2: string | Variable
    bg3: string | Variable
    bg4: string | Variable
    color: string | Variable
    color2: string | Variable
    color3: string | Variable
    color4: string | Variable
    borderColor: string | Variable
    borderColor2: string | Variable
    shadowColor: string | Variable
    shadowColor2: string | Variable
  }
}
export type GenericShorthands<VK extends string = string> = {
  [key in VK]: StyleKeys
  // text: { [key in TK]: StyleKeys }
}
type GenericMedia<K extends string = string> = {
  // name => media shorthand name (camelCase) => value
  [key in K]: {
    [key: string]: number | string
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
  C extends GenericShorthands,
  D extends GenericMedia
> = Partial<Pick<ThemeProviderProps, 'defaultTheme' | 'disableRootThemeClass'>> & {
  tokens: A
  themes: B
  shorthands: C
  media: D
}

// for use in creation functions so it doesnt get overwrtitten
export type GenericTamaguiConfig = CreateTamaguiConfig<
  GenericTokens,
  GenericThemes,
  GenericShorthands,
  GenericMedia
>

// since TamaguiConfig will be re-declared, these will all be typed globally
export type ThemeObject = TamaguiConfig['themes'][keyof TamaguiConfig['themes']]
export type Tokens = TamaguiConfig['tokens']
export type Shorthands = TamaguiConfig['shorthands']
export type Media = TamaguiConfig['media']
export type Themes = TamaguiConfig['themes']
// themes
export type ThemeName = keyof Themes
export type ThemeKeys = keyof ThemeObject
export type ThemeKeyVariables = `$${ThemeKeys}`
// export type Spaces = TamaguiConfig['tokens']['spaces'][keyof TamaguiConfig['tokens']['spaces']]
// export type FontSizes = TamaguiConfig['tokens']['fontSizes'][keyof TamaguiConfig['tokens']['fontSizes']]
// export type Colors = TamaguiConfig['tokens']['colors'][keyof TamaguiConfig['tokens']['colors']]

// this is the config generated via createTamagui()
export type TamaguiInternalConfig<
  A extends GenericTokens = GenericTokens,
  B extends GenericThemes = GenericThemes,
  C extends GenericShorthands = GenericShorthands,
  D extends GenericMedia = GenericMedia
> = CreateTamaguiConfig<A, B, C, D> & {
  Provider: (props: TamaguiProviderProps) => JSX.Element
  // with $ prefixes for fast lookups (one time cost at startup vs every render)
  themeParsed: { [key: string]: Variable }
  tokensParsed: CreateTokens<Variable>
  themeConfig: any
  getCSS: () => string
}

// prevents const intersections from being clobbered into string, keeping the consts
export type UnionableString = string & {}
export type UnionableNumber = number & {}
export type PropTypes<A extends StaticComponent> = A extends React.FunctionComponent<infer Props>
  ? Props
  : unknown

// TODO:
//  - make TextKeys enforced
//  - space / size share keys?
//  - color should be keyed with theme keys
export interface CreateTokens<
  Val extends number | string | Variable = number | string | Variable,
  TextKeys extends string = string
> {
  font: { [key in TextKeys]: Val }
  fontSize: { [key in TextKeys]: Val }
  lineHeight: { [key in TextKeys]: Val }
  letterSpace: { [key in TextKeys]: Val }
  color: { [key: string]: Val }
  space: { [key: string]: Val }
  size: { [key: string]: Val }
  radius: { [key: string]: Val }
  zIndex: { [key: string]: Val }
}

// media
export type MediaKeys = keyof Media
export type MediaQueryObject = { [key: string]: string | number | string }
export type MediaQueryState = {
  [key in string]: boolean
}
export type MediaQueryKey = keyof Media
export type MediaProps<A> = {
  [key in `$${MediaQueryKey}`]?: A
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

//
// Stack props
//

// TODO make WithThemeValues apply them more specifically
// so only things like padding/border/etc get $size shorthands
// and only colorful things get color shorthands

type ShortKeysView = keyof Shorthands

type ThemeValue<A> = Omit<A, string> | UnionableString | Variable

export type WithThemeValues<T extends object> = {
  [K in keyof T]:
    | ThemeValue<T[K]>
    | (K extends ColorableKeys
        ? ThemeKeyVariables
        : K extends SizeKeys
        ? `$${keyof Tokens['size']}`
        : K extends FontKeys
        ? `$${keyof Tokens['font']}`
        : K extends FontSizeKeys
        ? `$${keyof Tokens['fontSize']}`
        : K extends SpaceKeys
        ? `$${keyof Tokens['space']}`
        : K extends ColorKeys
        ? `$${keyof Tokens['color']}`
        : K extends ZIndexKeys
        ? `$${keyof Tokens['zIndex']}`
        : K extends LineHeightKeys
        ? `$${keyof Tokens['lineHeight']}`
        : {})
}

export type TamaguiThemedStackStyleProps = WithThemeValues<TamaguiStylesBase>

export type ShorthandStyleProps = {
  [key in ShortKeysView]?: Shorthands[ShortKeysView] extends keyof TamaguiThemedStackStyleProps
    ? TamaguiThemedStackStyleProps[Shorthands[ShortKeysView]] | null
    : {}
}

type StackStylePropsBase = TamaguiThemedStackStyleProps & ShorthandStyleProps

export type StackStyleProps = StackStylePropsBase & {
  hoverStyle?: StackStylePropsBase | null
  pressStyle?: StackStylePropsBase | null
}

export type StackProps = Omit<RNWInternalProps, 'children'> &
  MediaProps<StackStyleProps> &
  StackStyleProps &
  Omit<ViewProps, 'display' | 'children'> & {
    tag?: string
    ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any)
    animated?: boolean
    fullscreen?: boolean
    children?: any | any[]
    onHoverIn?: (e: MouseEvent) => any
    onHoverOut?: (e: MouseEvent) => any
    onPress?: (e: GestureResponderEvent) => any
    onPressIn?: (e: GestureResponderEvent) => any
    onPressOut?: (e: GestureResponderEvent) => any
    onMouseEnter?: (e: GestureResponderEvent) => any
    onMouseLeave?: (e: GestureResponderEvent) => any
    space?: Tokens['space'][keyof Tokens['space']] | boolean | string | number
    pointerEvents?: string
    userSelect?: string
    className?: string
    disabled?: boolean
  }

// type x = StackProps['children']

//
// Text props
//

type EnhancedTextStyleProps = WithThemeValues<
  Omit<TextStyle, 'display' | 'backfaceVisibility'> & TransformStyleProps
>
export type TextStylePropsBase = EnhancedTextStyleProps
export type TextStyleProps<S = TextStylePropsBase> = S & {
  hoverStyle?: S | null
  pressStyle?: S | null
}
export type TextProps<StyleProps = TextStyleProps> = Omit<ReactTextProps, 'style'> &
  MediaProps<StyleProps> &
  StyleProps & {
    tag?: string
    display?: TextStyle['display'] | 'inherit'
    ellipse?: boolean
    selectable?: boolean
    children?: any
    className?: string
    pointerEvents?: string
    cursor?: string
    userSelect?: string
    textDecorationDistance?: number
  }

export type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
  initialWindowMetrics?: any
  fallback?: any
  children?: any
}

export type RNWInternalProps = {
  accessibilityState?: {
    busy?: boolean
    checked?: boolean | 'mixed'
    disabled?: boolean
    expanded?: boolean
    grabbed?: boolean
    hidden?: boolean
    invalid?: boolean
    modal?: boolean
    pressed?: boolean
    readonly?: boolean
    required?: boolean
    selected?: boolean
  }
  accessibilityValue?: {
    max?: number
    min?: number
    now?: number
    text?: string
  }
  children?: any
  focusable?: boolean
  nativeID?: string
  onBlur?: (e: any) => void
  onClick?: (e: any) => void
  onClickCapture?: (e: any) => void
  onContextMenu?: (e: any) => void
  onFocus?: (e: any) => void
  onKeyDown?: (e: any) => void
  onKeyUp?: (e: any) => void
  onMoveShouldSetResponder?: (e: any) => boolean
  onMoveShouldSetResponderCapture?: (e: any) => boolean
  onResponderEnd?: (e: any) => void
  onResponderGrant?: (e: any) => void
  onResponderMove?: (e: any) => void
  onResponderReject?: (e: any) => void
  onResponderRelease?: (e: any) => void
  onResponderStart?: (e: any) => void
  onResponderTerminate?: (e: any) => void
  onResponderTerminationRequest?: (e: any) => boolean
  onScrollShouldSetResponder?: (e: any) => boolean
  onScrollShouldSetResponderCapture?: (e: any) => boolean
  onSelectionChangeShouldSetResponder?: (e: any) => boolean
  onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean
  onStartShouldSetResponder?: (e: any) => boolean
  onStartShouldSetResponderCapture?: (e: any) => boolean
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  testID?: string
  // unstable
  dataSet?: Object
  onMouseDown?: (e: any) => void
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onMouseMove?: (e: any) => void
  onMouseOver?: (e: any) => void
  onMouseOut?: (e: any) => void
  onMouseUp?: (e: any) => void
  onScroll?: (e: any) => void
  onTouchCancel?: (e: any) => void
  onTouchCancelCapture?: (e: any) => void
  onTouchEnd?: (e: any) => void
  onTouchEndCapture?: (e: any) => void
  onTouchMove?: (e: any) => void
  onTouchMoveCapture?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchStartCapture?: (e: any) => void
  onWheel?: (e: any) => void
  href?: string
  hrefAttrs?: { download?: boolean; rel?: string; target?: string }
}

export type StaticComponent<
  Props = any,
  VariantProps = any,
  StaticConfParsed = StaticConfigParsed,
  ParentVariantProps = any
> = React.FunctionComponent<Props> & {
  staticConfig: StaticConfParsed
  variantProps?: VariantProps

  /*
   * Only needed for more complex components
   * If you create a styled frame component this is a HoC to extract
   * styles from all parents.
   */
  extractable: <X>(a: X) => X
}

export type StaticConfigParsed = StaticConfig & {
  parsed: true
  propMapper: (
    key: string,
    value: any,
    theme: ThemeObject
  ) => undefined | boolean | { [key: string]: any }
  variantsParsed?: {
    [key: string]: {
      [key: string]: any
    }
  }
}

export type StaticConfig = {
  Component?: StaticComponent

  variants?: {
    [key: string]: {
      [key: string]:
        | ((a: any, b: any) => any)
        | {
            [key: string]: any
          }
    }
  }

  /*
   * If you need to pass context or something, prevents from ever
   * flattening. The 'jsx' option means it will never flatten. if you
   * pass JSX as a children (if its purely string, it will still flatten).
   */
  neverFlatten?: boolean | 'jsx'

  /*
   * Determines ultimate output tag (Text vs View)
   */
  isText?: boolean

  /*
   * Which style keys are allowed to be extracted.
   */
  validStyles?: { [key: string]: boolean }

  /*
   * Allows for defining extra valid props to be extracted beyond
   * the default ones.
   */
  validPropsExtra?: { [key: string]: any }

  /*
   * Same as React.defaultProps, be sure to sync
   */
  defaultProps?: any

  /*
   * If this prop is encountered, bail on all optimization.
   */
  deoptProps?: Set<string>

  /*
   * A bit odd, only for more advanced heirarchies.
   * Indicates that the component will set this prop so the
   * static extraction can ensure it sets them to ={undefined}
   * so they get overriddent. In the future, this can be smarter.
   */
  ensureOverriddenProp?: { [key: string]: boolean }
}

type ColorableKeys =
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderTopColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'borderRightColor'
  | 'shadowColor'

type SizeKeys = 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight'

type FontKeys = 'fontFamily'

type FontSizeKeys = 'fontSize'

type LineHeightKeys = 'lineHeight'

type ZIndexKeys = 'zIndex'

type ColorKeys =
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderBottomColor'
  | 'borderTopColor'
  | 'borderLeftColor'
  | 'borderRightColor'

type SpaceKeys =
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
