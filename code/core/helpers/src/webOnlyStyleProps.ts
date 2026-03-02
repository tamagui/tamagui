// Web-only style props that need to be skipped on native
// NOTE: backgroundColor is NOT web-only - it works on React Native too!
// NOTE: RN 0.76+ added: boxShadow, filter (cross-platform, with some Android 12+ only filters)
// NOTE: RN 0.77+ added: boxSizing, mixBlendMode, isolation, outline* props

// web-only discrete (non-animatable) view props
export const nonAnimatableWebViewProps = {
  backgroundAttachment: true,
  backgroundBlendMode: true,
  backgroundClip: true,
  backgroundOrigin: true,
  backgroundRepeat: true,
  borderBottomStyle: true,
  borderLeftStyle: true,
  borderRightStyle: true,
  borderTopStyle: true,
  contain: true,
  containerType: true,
  content: true,
  float: true,
  maskBorderMode: true,
  maskBorderRepeat: true,
  maskClip: true,
  maskComposite: true,
  maskMode: true,
  maskOrigin: true,
  maskRepeat: true,
  maskType: true,
  objectFit: true,
  overflowBlock: true,
  overflowInline: true,
  overflowX: true,
  overflowY: true,
  // NOTE: pointerEvents is NOT web-only - it's a core React Native View prop (not a style)
  pointerEvents: true,
  scrollbarWidth: true,
  textWrap: true,
  touchAction: true,
  transformStyle: true,
  willChange: true,
}

// web-only discrete (non-animatable) text props
export const nonAnimatableWebTextProps = {
  whiteSpace: true,
  wordWrap: true,
  textOverflow: true,
  WebkitBoxOrient: true,
}

export const webOnlyStylePropsView = {
  ...nonAnimatableWebViewProps,
  transition: true,
  backdropFilter: true,
  WebkitBackdropFilter: true,
  background: true,
  borderTop: true,
  borderRight: true,
  borderBottom: true,
  borderLeft: true,
  backgroundPosition: true,
  backgroundSize: true,
  borderImage: true,
  caretColor: true,
  clipPath: true,
  mask: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderSource: true,
  maskBorderWidth: true,
  maskImage: true,
  maskPosition: true,
  maskSize: true,
  objectPosition: true,
  textEmphasis: true,
  userSelect: true,
}

export const webOnlyStylePropsText = {
  ...nonAnimatableWebTextProps,
  textDecorationDistance: true,
  // cursor: now cross-platform - in stylePropsView
  WebkitLineClamp: true,
}
