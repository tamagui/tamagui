import type { Properties } from 'csstype'

/**
 * The style grammar `style()` accepts, owned by Tamagui rather than borrowed
 * from react-native.
 *
 * `@tamagui/core/dom` is the one entry that must typecheck in a project with no
 * react-native installed, so nothing here may reference it. The regular
 * `View`/`Text` props still come from react-native's `ViewStyle`/`TextStyle`;
 * this is a parallel definition of the same property set, not a replacement for
 * those.
 *
 * `styleTypes.test-d.ts` holds it to that: it runs where react-native *is*
 * available and asserts, at the type level, that this key set is exactly the key
 * set of `StackStyleBase & TextStylePropsBase`, that every react-native
 * `ViewStyle`/`TextStyle` key appears here, and that every value the regular
 * props accept is accepted here too. Add a property to `types.tsx` without
 * adding it here and that test goes red.
 *
 * Three value forms are deliberately absent, because they only exist at runtime
 * and `style()` is resolved by the compiler:
 *
 * - `Animated.AnimatedNode` (react-native's `AnimatableNumericValue`)
 * - `OpaqueColorValue` (`PlatformColor()`, `DynamicColorIOS()`)
 * - `Variable` (a `createVariable()` handle)
 *
 * Token names stay strings here rather than the config-derived `ColorTokens` /
 * `SizeTokens` / `SpaceTokens` unions, which are rooted in `TamaguiConfig` and
 * cannot be reached without pulling in the react-native-typed part of the
 * config. `'$4'` and `'surface hover:surface-hover'` still typecheck; they just
 * do not autocomplete on this entry.
 */

/** a length, a percentage, or `auto` — react-native's `DimensionValue` */
type DimensionValue = number | 'auto' | `${number}%` | null

/** a color: a theme or token name, a CSS color, or a clause like `'a hover:b'` */
type ColorValue = string

/**
 * `color` and `outlineColor` also take the theme-value fallbacks, which include
 * a bare number.
 */
type ThemeColorValue = string | number

/** a size token name, a CSS length, or `true` for the token named `true` */
type SizeValue = number | string | true

/** a space token name, a CSS length, or `true` for the token named `true` */
type SpaceValue = number | string | true

type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'

type BorderStyleValue = 'solid' | 'dotted' | 'dashed'

type FontVariantValue =
  | 'small-caps'
  | 'oldstyle-nums'
  | 'lining-nums'
  | 'tabular-nums'
  | 'common-ligatures'
  | 'no-common-ligatures'
  | 'discretionary-ligatures'
  | 'no-discretionary-ligatures'
  | 'historical-ligatures'
  | 'no-historical-ligatures'
  | 'contextual'
  | 'no-contextual'
  | 'proportional-nums'
  | 'stylistic-one'
  | 'stylistic-two'
  | 'stylistic-three'
  | 'stylistic-four'
  | 'stylistic-five'
  | 'stylistic-six'
  | 'stylistic-seven'
  | 'stylistic-eight'
  | 'stylistic-nine'
  | 'stylistic-ten'
  | 'stylistic-eleven'
  | 'stylistic-twelve'
  | 'stylistic-thirteen'
  | 'stylistic-fourteen'
  | 'stylistic-fifteen'
  | 'stylistic-sixteen'
  | 'stylistic-seventeen'
  | 'stylistic-eighteen'
  | 'stylistic-nineteen'
  | 'stylistic-twenty'

type GradientValue = {
  type: 'linear-gradient'
  direction?: string | undefined
  colorStops: ReadonlyArray<{
    color: ColorValue | null
    positions?: ReadonlyArray<string> | undefined
  }>
}

/**
 * The transform functions, one per entry, mutually exclusive the way
 * react-native's transform array is: `{ scale }` or `{ rotate }`, never both in
 * the same entry.
 */
interface TransformFunctions {
  perspective: number
  rotate: string
  rotateX: string
  rotateY: string
  rotateZ: string
  scale: number
  scaleX: number
  scaleY: number
  translateX: number | `${number}%`
  translateY: number | `${number}%`
  skewX: string
  skewY: string
  matrix: number[]
}

type TransformFunction = {
  [K in keyof TransformFunctions]: Pick<TransformFunctions, K> &
    Partial<Record<Exclude<keyof TransformFunctions, K>, undefined>>
}[keyof TransformFunctions]

type Px = `${string | number}px`
type PxOrPct = Px | `${string | number}%`
type TwoValueTransformOrigin = `${PxOrPct | 'left' | 'center' | 'right'} ${
  | PxOrPct
  | 'top'
  | 'center'
  | 'bottom'}`

/** shorthand strings the compiler splits into longhands; tokens allowed inside */
type ShorthandString = string

/**
 * Layout, the flexbox and box-model properties.
 */
interface LayoutStyle {
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: FlexAlignType
  alignSelf?: 'auto' | FlexAlignType
  aspectRatio?: number | string
  bottom?: DimensionValue
  boxSizing?: 'border-box' | 'content-box'
  columnGap?: number | string
  direction?: 'inherit' | 'ltr' | 'rtl'
  /** extends react-native's `display` with the web values */
  display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  end?: DimensionValue
  flex?: number
  flexBasis?: DimensionValue
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexGrow?: number
  flexShrink?: number
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: number | string
  height?: DimensionValue
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  left?: DimensionValue
  margin?: DimensionValue
  marginBottom?: DimensionValue
  marginEnd?: DimensionValue
  marginHorizontal?: DimensionValue
  marginLeft?: DimensionValue
  marginRight?: DimensionValue
  marginStart?: DimensionValue
  marginTop?: DimensionValue
  marginVertical?: DimensionValue
  maxHeight?: DimensionValue
  maxWidth?: DimensionValue
  minHeight?: DimensionValue
  minWidth?: DimensionValue
  overflow?: 'visible' | 'hidden' | 'scroll'
  padding?: DimensionValue
  paddingBottom?: DimensionValue
  paddingEnd?: DimensionValue
  paddingHorizontal?: DimensionValue
  paddingLeft?: DimensionValue
  paddingRight?: DimensionValue
  paddingStart?: DimensionValue
  paddingTop?: DimensionValue
  paddingVertical?: DimensionValue
  /** extends react-native's `position` with the web values */
  position?: 'absolute' | 'relative' | 'fixed' | 'static' | 'sticky'
  right?: DimensionValue
  rowGap?: number | string
  start?: DimensionValue
  top?: DimensionValue
  width?: DimensionValue
  zIndex?: number
}

/**
 * The logical (block/inline) box-model properties. Tamagui types these against
 * its own tokens rather than react-native's `DimensionValue`.
 */
interface LogicalStyle {
  blockSize?: SizeValue
  inlineSize?: SizeValue
  maxBlockSize?: SizeValue
  maxInlineSize?: SizeValue
  minBlockSize?: SizeValue
  minInlineSize?: SizeValue
  inset?: SpaceValue
  insetBlock?: SpaceValue
  insetBlockEnd?: SpaceValue
  insetBlockStart?: SpaceValue
  insetInline?: SpaceValue
  insetInlineEnd?: SpaceValue
  insetInlineStart?: SpaceValue
  marginBlock?: SpaceValue
  marginBlockEnd?: SpaceValue
  marginBlockStart?: SpaceValue
  marginInline?: SpaceValue
  marginInlineEnd?: SpaceValue
  marginInlineStart?: SpaceValue
  paddingBlock?: SpaceValue
  paddingBlockEnd?: SpaceValue
  paddingBlockStart?: SpaceValue
  paddingInline?: SpaceValue
  paddingInlineEnd?: SpaceValue
  paddingInlineStart?: SpaceValue
}

/**
 * Borders, radii and outlines.
 */
interface BorderStyle {
  border?: ShorthandString
  borderBlock?: ShorthandString
  borderInline?: ShorthandString
  borderColor?: ColorValue
  borderBlockColor?: ColorValue
  borderBlockEndColor?: ColorValue
  borderBlockStartColor?: ColorValue
  borderBottomColor?: ColorValue
  borderEndColor?: ColorValue
  borderInlineColor?: ColorValue
  borderInlineEndColor?: ColorValue
  borderInlineStartColor?: ColorValue
  borderLeftColor?: ColorValue
  borderRightColor?: ColorValue
  borderStartColor?: ColorValue
  borderTopColor?: ColorValue
  borderCurve?: 'circular' | 'continuous'
  borderImage?: Properties['borderImage']
  borderRadius?: number | string
  borderBottomEndRadius?: number | string
  borderBottomLeftRadius?: number | string
  borderBottomRightRadius?: number | string
  borderBottomStartRadius?: number | string
  borderEndEndRadius?: number | string
  borderEndStartRadius?: number | string
  borderStartEndRadius?: number | string
  borderStartStartRadius?: number | string
  borderTopEndRadius?: number | string
  borderTopLeftRadius?: number | string
  borderTopRightRadius?: number | string
  borderTopStartRadius?: number | string
  borderStyle?: BorderStyleValue
  borderBlockEndStyle?: BorderStyleValue
  borderBlockStartStyle?: BorderStyleValue
  borderBlockStyle?: BorderStyleValue
  borderInlineEndStyle?: BorderStyleValue
  borderInlineStartStyle?: BorderStyleValue
  borderInlineStyle?: BorderStyleValue
  borderWidth?: number
  borderBottomWidth?: number
  borderEndWidth?: number
  borderLeftWidth?: number
  borderRightWidth?: number
  borderStartWidth?: number
  borderTopWidth?: number
  borderBlockEndWidth?: SpaceValue
  borderBlockStartWidth?: SpaceValue
  borderBlockWidth?: SpaceValue
  borderInlineEndWidth?: SpaceValue
  borderInlineStartWidth?: SpaceValue
  borderInlineWidth?: SpaceValue
  outline?: ShorthandString
  outlineColor?: ThemeColorValue
  outlineOffset?: SpaceValue
  outlineStyle?: BorderStyleValue | (string & {})
  outlineWidth?: SpaceValue
}

/**
 * Background, shadow, filter and the rest of the paint layer.
 */
interface PaintStyle {
  backfaceVisibility?: 'visible' | 'hidden'
  /** the CSS `background` shorthand; `0` comes from csstype's length default */
  background?: string | 0
  backgroundAttachment?: Properties['backgroundAttachment']
  backgroundBlendMode?: Properties['backgroundBlendMode']
  backgroundClip?: Properties['backgroundClip']
  backgroundColor?: ColorValue
  backgroundImage?: Properties['backgroundImage']
  backgroundOrigin?: Properties['backgroundOrigin']
  backgroundPosition?: Properties['backgroundPosition']
  backgroundRepeat?: Properties['backgroundRepeat']
  backgroundSize?: Properties['backgroundSize']
  backdropFilter?: Properties['backdropFilter']
  boxShadow?: ShorthandString
  caretColor?: Properties['caretColor']
  clipPath?: Properties['clipPath']
  elevation?: number
  experimental_backgroundImage?: string | readonly GradientValue[]
  filter?: ShorthandString
  isolation?: 'auto' | 'isolate'
  mixBlendMode?:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'
  opacity?: number
  shadowColor?: ColorValue
  shadowOffset?: Readonly<{ width: number; height: number }>
  shadowOpacity?: number
  shadowRadius?: number
  visibility?: Properties['visibility']
}

/**
 * The CSS mask family, web-only and dropped on native.
 */
interface MaskStyle {
  mask?: Properties['mask']
  maskBorder?: Properties['maskBorder']
  maskBorderMode?: Properties['maskBorderMode']
  maskBorderOutset?: Properties['maskBorderOutset']
  maskBorderRepeat?: Properties['maskBorderRepeat']
  maskBorderSlice?: Properties['maskBorderSlice']
  maskBorderSource?: Properties['maskBorderSource']
  maskBorderWidth?: Properties['maskBorderWidth']
  maskClip?: Properties['maskClip']
  maskComposite?: Properties['maskComposite']
  maskImage?: Properties['maskImage']
  maskMode?: Properties['maskMode']
  maskOrigin?: Properties['maskOrigin']
  maskPosition?: Properties['maskPosition']
  maskRepeat?: Properties['maskRepeat']
  maskSize?: Properties['maskSize']
  maskType?: Properties['maskType']
}

/**
 * The CSS grid family, web-only and dropped on native.
 */
interface GridStyle {
  gridColumn?: Properties['gridColumn']
  gridColumnEnd?: Properties['gridColumnEnd']
  gridColumnGap?: Properties['gridColumnGap']
  gridColumnStart?: Properties['gridColumnStart']
  gridRow?: Properties['gridRow']
  gridRowEnd?: Properties['gridRowEnd']
  gridRowGap?: Properties['gridRowGap']
  gridRowStart?: Properties['gridRowStart']
  gridTemplateAreas?: Properties['gridTemplateAreas']
  gridTemplateColumns?: Properties['gridTemplateColumns']
}

/**
 * Text, including the CSS-only text properties Tamagui adds on top of
 * react-native's `TextStyle`.
 */
interface TextStyle {
  color?: ThemeColorValue
  ellipsis?: boolean
  font?: ShorthandString
  fontFamily?: string
  fontSize?: number
  fontStyle?: 'normal' | 'italic'
  fontVariant?: FontVariantValue[]
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 'ultralight'
    | 'thin'
    | 'light'
    | 'medium'
    | 'regular'
    | 'semibold'
    | 'condensedBold'
    | 'condensed'
    | 'heavy'
    | 'black'
  includeFontPadding?: boolean
  letterSpacing?: number
  lineHeight?: number
  numberOfLines?: number
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'
  textDecoration?: ShorthandString
  textDecorationColor?: ColorValue
  textDecorationDistance?: number
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through'
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed'
  textEmphasis?: Properties['textEmphasis']
  textOverflow?: Properties['textOverflow']
  textShadow?: ShorthandString
  textShadowColor?: ColorValue
  textShadowOffset?: { width: number; height: number }
  textShadowRadius?: number
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  textWrap?: Properties['textWrap']
  verticalAlign?: Properties['verticalAlign']
  whiteSpace?: Properties['whiteSpace']
  wordWrap?: Properties['wordWrap']
  writingDirection?: 'auto' | 'ltr' | 'rtl'
}

/**
 * Transforms. Tamagui accepts the individual functions as top-level props in
 * addition to react-native's `transform` array.
 */
interface TransformStyle {
  matrix?: number[]
  perspective?: number
  rotate?: `${number}deg` | (string & {})
  rotateX?: `${number}deg` | (string & {})
  rotateY?: `${number}deg` | (string & {})
  rotateZ?: `${number}deg` | (string & {})
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: string
  skewY?: string
  transform?: string | readonly TransformFunction[]
  transformOrigin?:
    | PxOrPct
    | 'left'
    | 'center'
    | 'right'
    | 'top'
    | 'bottom'
    | TwoValueTransformOrigin
    | `${TwoValueTransformOrigin} ${Px}`
  transformStyle?: Properties['transformStyle']
  /** maps to `translateX` */
  x?: number
  /** maps to `translateY` */
  y?: number
  /** @deprecated use `matrix` in `transform` */
  transformMatrix?: number[]
  /** @deprecated use `rotate` */
  rotation?: number
  /** @deprecated use `x` */
  translateX?: number
  /** @deprecated use `y` */
  translateY?: number
}

/**
 * Web-only properties with no react-native equivalent, plus the interaction and
 * containment ones that work on both.
 */
interface WebStyle {
  contain?: Properties['contain']
  containerName?: string
  containerType?: Properties['containerType']
  cursor?: Properties['cursor']
  float?: Properties['float']
  objectFit?: Properties['objectFit']
  overflowBlock?: Properties['overflowBlock']
  overflowInline?: Properties['overflowInline']
  overflowWrap?: Properties['overflowWrap']
  overflowX?: Properties['overflowX']
  overflowY?: Properties['overflowY']
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only'
  resize?: Properties['resize']
  userSelect?: Properties['userSelect']
}

type TransitionSpringConfig = {
  stiffness?: number
  damping?: number
  mass?: number
  tension?: number
  friction?: number
  velocity?: number
  overshootClamping?: boolean
  duration?: number
  bounciness?: number
  speed?: number
}

/** a configured driver animation name, or a CSS transition string like `'200ms'` */
type TransitionValue = string

type TransitionProp =
  | TransitionValue
  | ({
      default?: TransitionValue
      enter?: TransitionValue
      exit?: TransitionValue
      delay?: number
    } & TransitionSpringConfig & {
        [key: string]:
          | TransitionValue
          | {
              type: TransitionValue
              [key: string]: any
            }
          | number
          | boolean
          | undefined
      })
  | [
      TransitionValue,
      {
        delay?: number
        enter?: TransitionValue
        exit?: TransitionValue
      } & TransitionSpringConfig & {
          [key: string]:
            | TransitionValue
            | {
                type?: TransitionValue
                [key: string]: any
              }
            | number
            | boolean
            | undefined
        },
    ]

/**
 * The animation props, which ride along with the style grammar because a
 * transition is authored next to the styles it transitions.
 */
interface AnimationStyle {
  transition?: TransitionProp | null
  animateOnly?: string[]
  animatePresence?: boolean
  onTransition?: (event: {
    phase: 'start' | 'end'
    cause: 'enter' | 'exit' | 'update'
    finished?: boolean
  }) => void
  passThrough?: boolean
}

/**
 * The whole style grammar `style()` accepts.
 */
export interface TamaguiStyleProps
  extends
    LayoutStyle,
    LogicalStyle,
    BorderStyle,
    PaintStyle,
    MaskStyle,
    GridStyle,
    TextStyle,
    TransformStyle,
    WebStyle,
    AnimationStyle {}
