// Web-only style props that need to be skipped on native
// NOTE: backgroundColor is NOT web-only - it works on React Native too!
// NOTE: RN 0.76+ added: boxShadow, filter (cross-platform, with some Android 12+ only filters)
// NOTE: RN 0.77+ added: boxSizing, mixBlendMode, isolation, outline* props
export const webOnlyStylePropsView = {
  transition: true,
  textWrap: true,
  backdropFilter: true,
  WebkitBackdropFilter: true,
  // These background-* props are web-only CSS, but NOT backgroundColor
  background: true,
  // CSS border shorthand (e.g., "1px solid red") - RN only supports individual props
  border: true,
  borderTop: true,
  borderRight: true,
  borderBottom: true,
  borderLeft: true,
  backgroundAttachment: true,
  backgroundBlendMode: true,
  backgroundClip: true,
  backgroundImage: true,
  backgroundOrigin: true,
  backgroundPosition: true,
  backgroundRepeat: true,
  backgroundSize: true,
  borderBottomStyle: true,
  borderImage: true,
  borderLeftStyle: true,
  borderRightStyle: true,
  borderTopStyle: true,
  // boxSizing: now supported in RN 0.77+ (New Architecture)
  caretColor: true,
  clipPath: true,
  contain: true,
  containerType: true,
  content: true,
  // cursor: now cross-platform - supported on iOS 17+ (trackpad/stylus) with limited values
  float: true,
  mask: true,
  maskBorder: true,
  maskBorderMode: true,
  maskBorderOutset: true,
  maskBorderRepeat: true,
  maskBorderSlice: true,
  maskBorderSource: true,
  maskBorderWidth: true,
  maskClip: true,
  maskComposite: true,
  maskImage: true,
  maskMode: true,
  maskOrigin: true,
  maskPosition: true,
  maskRepeat: true,
  maskSize: true,
  maskType: true,
  // mixBlendMode: now supported in RN 0.77+ (New Architecture)
  objectFit: true,
  objectPosition: true,
  // outline*: now supported in RN 0.77+ (New Architecture)
  overflowBlock: true,
  overflowInline: true,
  overflowX: true,
  overflowY: true,
  // NOTE: pointerEvents is NOT web-only - it's a core React Native View prop (not a style)
  pointerEvents: true,
  scrollbarWidth: true,
  textEmphasis: true,
  touchAction: true,
  transformStyle: true,
  userSelect: true,
  willChange: true,
}

export const webOnlyStylePropsText = {
  whiteSpace: true,
  wordWrap: true,
  textOverflow: true,
  textDecorationDistance: true,
  // cursor: now cross-platform - in stylePropsView
  WebkitLineClamp: true,
  WebkitBoxOrient: true,
}
