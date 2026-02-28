import { isAndroid } from '@tamagui/constants'
import {
  nonAnimatableWebTextProps,
  nonAnimatableWebViewProps,
  webOnlyStylePropsText,
  webOnlyStylePropsView,
} from './webOnlyStyleProps'

// generally organizing this so we don't duplicate things so its a bit weird

// longhands of CSS shorthands - used for specificity boosting on web
// so that e.g. borderWidth always beats border in the cascade
export const cssShorthandLonghands = {
  // border longhands
  borderWidth: true,
  borderStyle: true,
  borderColor: true,
  borderTopWidth: true,
  borderTopStyle: true,
  borderTopColor: true,
  borderRightWidth: true,
  borderRightStyle: true,
  borderRightColor: true,
  borderBottomWidth: true,
  borderBottomStyle: true,
  borderBottomColor: true,
  borderLeftWidth: true,
  borderLeftStyle: true,
  borderLeftColor: true,
  // outline longhands
  outlineWidth: true,
  outlineStyle: true,
  outlineColor: true,
  outlineOffset: true,
}

const textColors = {
  color: true,
  textDecorationColor: true,
  textShadowColor: true,
}

// used for propMapping to find the right token category
// just specificy the least costly, all else go to `space` (most keys - we can exclude)
export const tokenCategories = {
  radius: {
    borderRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,

    // logical
    borderStartStartRadius: true,
    borderStartEndRadius: true,
    borderEndStartRadius: true,
    borderEndEndRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
    blockSize: true,
    minBlockSize: true,
    maxBlockSize: true,
    inlineSize: true,
    minInlineSize: true,
    maxInlineSize: true,
  },
  zIndex: {
    zIndex: true,
  },
  color: {
    backgroundColor: true,
    borderColor: true,
    borderBlockStartColor: true,
    borderBlockEndColor: true,
    borderBlockColor: true,
    borderBottomColor: true,
    borderInlineColor: true,
    borderInlineStartColor: true,
    borderInlineEndColor: true,
    borderTopColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderEndColor: true,
    borderStartColor: true,
    shadowColor: true,
    ...textColors,
    // outlineColor is supported on RN 0.77+ (New Architecture)
    outlineColor: true,
    // caretColor is web-only
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      caretColor: true,
    }),
  },
}

// discrete (non-animatable) view style properties - keyword-based, no interpolation
// defined above stylePropsView so it can be spread in without duplication
const nonAnimatableViewProps = {
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  backfaceVisibility: true,
  borderCurve: true,
  borderStyle: true,
  borderBlockStyle: true,
  borderBlockEndStyle: true,
  borderBlockStartStyle: true,
  borderInlineStyle: true,
  borderInlineEndStyle: true,
  borderInlineStartStyle: true,
  boxSizing: true,
  cursor: true,
  direction: true,
  display: true,
  flexDirection: true,
  flexWrap: true,
  isolation: true,
  justifyContent: true,
  mixBlendMode: true,
  outlineStyle: true,
  overflow: true,
  position: true,
}

// discrete (non-animatable) font properties
const nonAnimatableFontProps = {
  fontFamily: true,
  fontStyle: true,
  fontVariant: true,
  textTransform: true,
}

// discrete (non-animatable) text-only properties
const nonAnimatableTextOnlyProps = {
  textAlign: true,
  textDecorationLine: true,
  textDecorationStyle: true,
  userSelect: true,
}

// discrete (non-animatable) unitless properties
const nonAnimatableUnitlessProps = {
  WebkitLineClamp: true,
  lineClamp: true,
  gridTemplateColumns: true,
  gridTemplateAreas: true,
}

// all non-animatable style props combined, used by getSplitStyles to keep
// these as atomic CSS classNames even for components with animation drivers
export const nonAnimatableStyleProps = {
  ...nonAnimatableViewProps,
  ...nonAnimatableFontProps,
  ...nonAnimatableTextOnlyProps,
  ...nonAnimatableUnitlessProps,
  // web-only discrete properties (defined in webOnlyStyleProps.ts)
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    ...nonAnimatableWebViewProps,
    ...nonAnimatableWebTextProps,
  }),
}

export const stylePropsUnitless = {
  ...nonAnimatableUnitlessProps,
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexOrder: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowGap: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnGap: true,
  gridColumnStart: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  shadowOpacity: true,
}

export const stylePropsTransform = {
  x: true,
  y: true,
  scale: true,
  perspective: true,
  scaleX: true,
  scaleY: true,
  skewX: true,
  skewY: true,
  matrix: true,
  rotate: true,
  rotateY: true,
  rotateX: true,
  rotateZ: true,
}

export const stylePropsView = {
  ...nonAnimatableViewProps,
  borderBottomEndRadius: true,
  borderBottomStartRadius: true,
  borderBottomWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderBlockWidth: true,
  borderBlockEndWidth: true,
  borderBlockStartWidth: true,
  borderInlineWidth: true,
  borderInlineEndWidth: true,
  borderInlineStartWidth: true,
  borderTopEndRadius: true,
  borderTopStartRadius: true,
  borderTopWidth: true,
  borderWidth: true,
  transform: true,
  transformOrigin: true,
  borderEndWidth: true,
  borderStartWidth: true,
  bottom: true,
  end: true,
  flexBasis: true,
  gap: true,
  columnGap: true,
  rowGap: true,
  left: true,
  margin: true,
  marginBlock: true,
  marginBlockEnd: true,
  marginBlockStart: true,
  marginInline: true,
  marginInlineStart: true,
  marginInlineEnd: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  padding: true,
  paddingBottom: true,
  paddingInline: true,
  paddingBlock: true,
  paddingBlockStart: true,
  paddingInlineEnd: true,
  paddingInlineStart: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  right: true,
  start: true,
  top: true,
  inset: true,
  insetBlock: true,
  insetBlockEnd: true,
  insetBlockStart: true,
  insetInline: true,
  insetInlineEnd: true,
  insetInlineStart: true,
  shadowOffset: true,
  shadowRadius: true,
  ...tokenCategories.color,
  ...tokenCategories.radius,
  ...tokenCategories.size,
  ...stylePropsTransform,
  ...stylePropsUnitless,
  ...(isAndroid ? { elevationAndroid: true } : {}),

  boxShadow: true,
  border: true,
  filter: true,
  // RN 0.76+ supports linear-gradient via backgroundImage
  backgroundImage: true,
  // the actual RN 0.76+ prop name (backgroundImage expands to this on native)
  experimental_backgroundImage: true,
  // RN 0.76/0.77+ style props (New Architecture)
  outline: true,
  outlineColor: true,
  outlineOffset: true,
  outlineWidth: true,

  // web-only for convenience - tree-shaken on native
  ...(process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsView : {}),
}

const stylePropsFont = {
  ...nonAnimatableFontProps,
  fontSize: true,
  fontWeight: true,
  letterSpacing: true,
  lineHeight: true,
}

export const stylePropsTextOnly = {
  ...stylePropsFont,
  ...nonAnimatableTextOnlyProps,
  ...textColors,
  textShadow: true,
  textShadowOffset: true,
  textShadowRadius: true,
  verticalAlign: true,

  // web-only text props - tree-shaken on native
  ...(process.env.TAMAGUI_TARGET === 'web' ? webOnlyStylePropsText : {}),
}

export const stylePropsText = {
  ...stylePropsView,
  ...stylePropsTextOnly,
}

export const stylePropsAll = stylePropsText

export const validPseudoKeys = {
  enterStyle: true,
  exitStyle: true,
  hoverStyle: true,
  pressStyle: true,
  focusStyle: true,
  disabledStyle: true,
  focusWithinStyle: true,

  // allow some web only ones
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    focusVisibleStyle: true,
  }),
}

export const validStyles = stylePropsView
