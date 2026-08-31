import { isAndroid } from '@tamagui/constants'
import {
  nonAnimatableWebTextProps,
  nonAnimatableWebViewProps,
  webOnlyStylePropsText,
  webOnlyStylePropsView,
} from './webOnlyStyleProps'
export { tokenCategories } from './tokenCategories'

const toObj = (
  ...sources: (string | Record<string, boolean> | undefined)[]
): Record<string, boolean> => {
  const out: Record<string, boolean> = {}
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i]
    if (!s) continue
    if (typeof s === 'string') {
      const parts = s.split(' ')
      for (let j = 0; j < parts.length; j++) if (parts[j]) out[parts[j]] = true
    } else {
      Object.assign(out, s)
    }
  }
  return out
}

export const cssShorthandLonghands = toObj(
  'borderWidth borderStyle borderColor borderTopWidth borderTopStyle borderTopColor ' +
    'borderRightWidth borderRightStyle borderRightColor borderBottomWidth borderBottomStyle ' +
    'borderBottomColor borderLeftWidth borderLeftStyle borderLeftColor outlineWidth outlineStyle outlineColor outlineOffset'
)

const textColors = toObj('color textDecorationColor textShadowColor')

const nonAnimatableViewProps = toObj(
  'alignContent alignItems alignSelf backfaceVisibility borderCurve borderStyle ' +
    'borderBlockStyle borderBlockEndStyle borderBlockStartStyle borderInlineStyle ' +
    'borderInlineEndStyle borderInlineStartStyle boxSizing cursor direction display ' +
    'flexDirection flexWrap isolation justifyContent mixBlendMode outlineStyle overflow pointerEvents position visibility'
)

const nonAnimatableFontProps = toObj('fontFamily fontStyle fontVariant textTransform')

const nonAnimatableTextOnlyProps = toObj(
  'textAlign textDecorationLine textDecorationStyle userSelect writingDirection'
)

const nonAnimatableUnitlessProps = toObj(
  'WebkitLineClamp lineClamp gridTemplateColumns gridTemplateAreas'
)

export const nonAnimatableStyleProps = toObj(
  nonAnimatableViewProps,
  nonAnimatableFontProps,
  nonAnimatableTextOnlyProps,
  nonAnimatableUnitlessProps,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableWebViewProps : undefined,
  process.env.TAMAGUI_TARGET === 'web' ? nonAnimatableWebTextProps : undefined
)

export const stylePropsUnitless = toObj(
  nonAnimatableUnitlessProps,
  'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth ' +
    'columnCount flex flexGrow flexOrder flexPositive flexShrink flexNegative fontWeight ' +
    'gridRow gridRowEnd gridRowGap gridRowStart gridColumn gridColumnEnd gridColumnGap gridColumnStart ' +
    'opacity order orphans tabSize widows zIndex zoom scale scaleX scaleY scaleZ shadowOpacity'
)

export const stylePropsTransform = toObj(
  'x y scale perspective scaleX scaleY skewX skewY matrix rotate rotateY rotateX rotateZ'
)

export const stylePropsView = toObj(
  nonAnimatableViewProps,
  'borderBottomWidth borderLeftWidth borderRightWidth borderBlockWidth borderBlockEndWidth ' +
    'borderBlockStartWidth borderInlineWidth borderInlineEndWidth borderInlineStartWidth ' +
    'borderTopWidth borderWidth transform transformOrigin borderEndWidth borderStartWidth ' +
    'bottom end flexBasis gap columnGap rowGap left margin marginBlock marginBlockEnd ' +
    'marginBlockStart marginInline marginInlineStart marginInlineEnd marginBottom marginEnd ' +
    'marginHorizontal marginLeft marginRight marginStart marginTop marginVertical padding ' +
    'paddingBottom paddingInline paddingBlock paddingBlockEnd paddingBlockStart paddingInlineEnd ' +
    'paddingInlineStart paddingEnd paddingHorizontal paddingLeft paddingRight paddingStart ' +
    'paddingTop paddingVertical right start top inset insetBlock insetBlockEnd insetBlockStart ' +
    'insetInline insetInlineEnd insetInlineStart shadowOffset backgroundColor borderColor ' +
    'borderBlockStartColor borderBlockEndColor borderBlockColor borderBottomColor borderInlineColor ' +
    'borderInlineStartColor borderInlineEndColor borderTopColor borderLeftColor borderRightColor ' +
    'borderEndColor borderStartColor shadowColor outlineColor ' +
    (process.env.TAMAGUI_TARGET === 'web' ? 'caretColor ' : '') +
    'borderRadius borderTopLeftRadius borderTopRightRadius borderBottomLeftRadius borderBottomRightRadius ' +
    'borderTopStartRadius borderTopEndRadius borderBottomStartRadius borderBottomEndRadius ' +
    'borderStartStartRadius borderStartEndRadius borderEndStartRadius borderEndEndRadius ' +
    'width height minWidth minHeight maxWidth maxHeight blockSize minBlockSize maxBlockSize ' +
    'inlineSize minInlineSize maxInlineSize shadowRadius',
  stylePropsTransform,
  stylePropsUnitless,
  isAndroid ? { elevationAndroid: true } : undefined,
  'boxShadow border borderBlock borderInline filter background backgroundImage experimental_backgroundImage outline outlineOffset outlineWidth',
  process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsView : undefined
)

const stylePropsFont = toObj(
  nonAnimatableFontProps,
  'fontSize fontWeight letterSpacing lineHeight'
)

export const stylePropsTextOnly = toObj(
  stylePropsFont,
  nonAnimatableTextOnlyProps,
  textColors,
  'textShadow textShadowOffset textShadowRadius textDecoration font verticalAlign',
  process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsText : undefined
)

export const stylePropsText = toObj(stylePropsView, stylePropsTextOnly)

export const stylePropsAll = stylePropsText

export const validStyles = stylePropsView
