import { ViewStyle } from 'react-native'

console.log('process.env.TAMAGUI_TARGET', process.env.TAMAGUI_TARGET)

// flat transform props
export const stylePropsTransform = Object.freeze({
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
})

export const stylePropsView = Object.freeze({
  backfaceVisibility: true,
  backgroundColor: true,
  borderBottomColor: true,
  borderBottomStyle: true,
  borderTopStyle: true,
  borderLeftStyle: true,
  borderRightStyle: true,
  borderBottomEndRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderBottomStartRadius: true,
  borderBottomWidth: true,
  borderColor: true,
  borderEndColor: true,
  borderLeftColor: true,
  borderLeftWidth: true,
  borderRadius: true,
  borderRightColor: true,
  borderRightWidth: true,
  borderStartColor: true,
  borderStyle: true,
  borderTopColor: true,
  borderTopEndRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderTopStartRadius: true,
  borderTopWidth: true,
  borderWidth: true,
  opacity: true,
  transform: true,
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  aspectRatio: true,
  borderEndWidth: true,
  borderStartWidth: true,
  bottom: true,
  display: true,
  end: true,
  flex: true,
  flexBasis: true,
  flexDirection: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  height: true,
  justifyContent: true,
  left: true,
  margin: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  maxHeight: true,
  maxWidth: true,
  minHeight: true,
  minWidth: true,
  overflow: true,
  padding: true,
  paddingBottom: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  position: true,
  right: true,
  start: true,
  top: true,
  width: true,
  zIndex: true,
  direction: true,
  shadowColor: true,
  shadowOffset: true,
  shadowOpacity: true,
  shadowRadius: true,
  ...stylePropsTransform,

  // allow a few web only ones
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    overflowX: true,
    overflowY: true,
    userSelect: true,
    cursor: true,
    contain: true,
    pointerEvents: true,
    boxSizing: true,
    boxShadow: true,
  }),
})

export const stylePropsTextOnly = Object.freeze({
  color: true,
  fontFamily: true,
  fontSize: true,
  fontStyle: true,
  fontWeight: true,
  letterSpacing: true,
  lineHeight: true,
  textAlign: true,
  textDecorationLine: true,
  textDecorationStyle: true,
  textDecorationColor: true,
  textShadowColor: true,
  textShadowOffset: true,
  textShadowRadius: true,
  textTransform: true,

  // allow some web only ones
  ...(process.env.TAMAGUI_TARGET === 'web' && {
    whiteSpace: true,
    wordWrap: true,
    textOverflow: true,
    textDecorationDistance: true,
    userSelect: true,
    selectable: true,
    cursor: true,
  }),
})

export const stylePropsText = Object.freeze({
  ...stylePropsView,
  ...stylePropsTextOnly,
})

export const stylePropsAll = stylePropsText

export const validPseudoKeys = Object.freeze({
  enterStyle: true,
  exitStyle: true,
  hoverStyle: true,
  pressStyle: true,
  focusStyle: true,
})

export const validStyles = Object.freeze({
  ...validPseudoKeys,
  ...stylePropsView,
})

export const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

export const invertMapTransformKeys = {
  translateX: 'x',
  translateY: 'y',
}

export const mergeTransform = (obj: ViewStyle, key: string, val: any) => {
  obj.transform ||= []
  // @ts-ignore
  obj.transform.push({ [mapTransformKeys[key] || key]: val })
}
