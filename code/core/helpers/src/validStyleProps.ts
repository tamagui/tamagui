import { isAndroid } from '@tamagui/constants'
import { cssStyleProps, cssStylePropsUnitless } from './cssStyleProps'
import {
  nonAnimatableWebTextProps,
  nonAnimatableWebViewProps,
  webOnlyStylePropsText,
  webOnlyStylePropsView,
} from './webOnlyStyleProps'
import { toStylePropsObject as toObj } from './toStylePropsObject'
export { tokenCategories } from './tokenCategories'

export const cssShorthandLonghands = toObj(
  'borderWidth borderStyle borderColor borderTopWidth borderTopStyle borderTopColor borderRightWidth borderRightStyle borderRightColor borderBottomWidth borderBottomStyle borderBottomColor borderLeftWidth borderLeftStyle borderLeftColor outlineWidth outlineStyle outlineColor outlineOffset'
)

const cssTextColors = toObj('color textDecorationColor')
const textColors = toObj(cssTextColors, 'textShadowColor')

const inputColors = toObj(
  'placeholderTextColor selectionColor cursorColor selectionHandleColor'
)

const nonAnimatableViewProps = toObj(
  'alignContent alignItems alignSelf backfaceVisibility borderCurve borderStyle boxSizing cursor direction display flexDirection flexWrap isolation justifyContent mixBlendMode outlineStyle overflow pointerEvents position visibility'
)

const nonAnimatableFontProps = toObj('fontFamily fontStyle fontVariant textTransform')

const cssTextAlignmentProps = toObj(
  'textAlign textDecorationLine textDecorationStyle userSelect'
)

const nonAnimatableTextOnlyProps = toObj(cssTextAlignmentProps, 'writingDirection')

const nonAnimatableUnitlessProps = toObj('WebkitLineClamp lineClamp')

const webOnlyUnitlessProps = toObj(
  'animationIterationCount borderImageOutset borderImageSlice borderImageWidth columnCount flexOrder flexPositive flexNegative order orphans tabSize widows zoom scaleZ'
)

/**
 * CSS Grid layout props. Web-only by default — Yoga (React Native's layout
 * engine) has no stable CSS Grid support (see facebook/yoga#1865).
 *
 * To enable on native with an experimental Yoga build, set the
 * `TAMAGUI_CSS_GRID` environment variable to `"1"`.
 */
const cssGridProps = toObj(
  'gridTemplateColumns gridTemplateAreas gridRow gridRowEnd gridRowGap gridRowStart gridColumn gridColumnEnd gridColumnGap gridColumnStart'
)

const enableCSSGrid =
  process.env.TAMAGUI_TARGET === 'web' || process.env.TAMAGUI_CSS_GRID === '1'

export const nonAnimatableStyleProps = toObj(
  nonAnimatableViewProps,
  nonAnimatableFontProps,
  nonAnimatableTextOnlyProps,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableUnitlessProps : undefined,
  enableCSSGrid ? cssGridProps : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableWebViewProps : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableWebTextProps : undefined
)

export const stylePropsUnitless = toObj(
  process.env.TAMAGUI_TARGET === 'web' ? cssStylePropsUnitless : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableUnitlessProps : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? webOnlyUnitlessProps : undefined,
  enableCSSGrid ? cssGridProps : undefined,
  'aspectRatio flex flexGrow flexShrink fontWeight opacity zIndex scale scaleX scaleY shadowOpacity'
)

export const stylePropsTransform = toObj(
  'x y scale perspective scaleX scaleY skewX skewY matrix rotate rotateY rotateX rotateZ'
)

const stylePropsFont = toObj(
  nonAnimatableFontProps,
  'fontSize fontWeight letterSpacing lineHeight'
)

export const stylePropsTextOnly = toObj(
  stylePropsFont,
  nonAnimatableTextOnlyProps,
  textColors,
  'textShadow textShadowOffset textShadowRadius textDecoration verticalAlign',
  process.env.TAMAGUI_TARGET === 'web' ? 'font' : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsText : undefined
)

export const stylePropsView = toObj(
  nonAnimatableViewProps,
  'borderBottomWidth borderLeftWidth borderRightWidth borderBlockWidth borderBlockEndWidth borderBlockStartWidth borderInlineWidth borderInlineEndWidth borderInlineStartWidth borderTopWidth borderWidth transform transformOrigin borderEndWidth borderStartWidth bottom end flexBasis gap columnGap rowGap left margin marginBlock marginBlockEnd marginBlockStart marginInline marginInlineStart marginInlineEnd marginBottom marginEnd marginHorizontal marginLeft marginRight marginStart marginTop marginVertical padding paddingBottom paddingInline paddingBlock paddingBlockEnd paddingBlockStart paddingInlineEnd paddingInlineStart paddingEnd paddingHorizontal paddingLeft paddingRight paddingStart paddingTop paddingVertical right start top inset insetBlock insetBlockEnd insetBlockStart insetInline insetInlineEnd insetInlineStart shadowOffset backgroundColor borderColor borderBlockStartColor borderBlockEndColor borderBlockColor borderBottomColor borderInlineColor borderInlineStartColor borderInlineEndColor borderTopColor borderLeftColor borderRightColor borderEndColor borderStartColor shadowColor outlineColor',
  process.env.TAMAGUI_TARGET === 'web' ? 'caretColor' : undefined,
  'borderRadius borderTopLeftRadius borderTopRightRadius borderBottomLeftRadius borderBottomRightRadius borderTopStartRadius borderTopEndRadius borderBottomStartRadius borderBottomEndRadius borderStartStartRadius borderStartEndRadius borderEndStartRadius borderEndEndRadius width height minWidth minHeight maxWidth maxHeight blockSize minBlockSize maxBlockSize inlineSize minInlineSize maxInlineSize shadowRadius',
  stylePropsTransform,
  stylePropsUnitless,
  isAndroid ? { elevationAndroid: true } : undefined,
  'boxShadow border borderBlock borderInline filter background backgroundImage experimental_backgroundImage outline outlineOffset outlineWidth',
  process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsView : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? cssStyleProps : undefined,
  process.env.TAMAGUI_TARGET === 'web'
    ? toObj(
        stylePropsFont,
        cssTextColors,
        cssTextAlignmentProps,
        nonAnimatableWebTextProps,
        'textShadow textDecoration verticalAlign font'
      )
    : undefined
)

export const stylePropsText = toObj(stylePropsView, stylePropsTextOnly)

export const stylePropsInput = toObj(stylePropsText, inputColors)

// native recognizes css names so unsupported styles cannot become host props.
export const stylePropsAll = toObj(
  stylePropsInput,
  cssStyleProps,
  cssGridProps,
  webOnlyStylePropsView,
  nonAnimatableWebTextProps,
  'font',
  nonAnimatableUnitlessProps,
  webOnlyUnitlessProps
)

export const validStyles = stylePropsView
