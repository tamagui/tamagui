// Web-only style props that need to be skipped on native

import { toStylePropsObject as toObj } from './toStylePropsObject'

export const nonAnimatableWebViewProps = /* @__PURE__ */ toObj(
  'backgroundAttachment backgroundBlendMode backgroundClip backgroundOrigin backgroundRepeat borderBlockStyle borderBlockEndStyle borderBlockStartStyle borderInlineStyle borderInlineEndStyle borderInlineStartStyle borderBottomStyle borderLeftStyle borderRightStyle borderTopStyle contain containerType containerName content float maskBorderMode maskBorderRepeat maskClip maskComposite maskMode maskOrigin maskRepeat maskType objectFit overflowBlock overflowInline overflowX overflowY scrollbarWidth textWrap touchAction transformStyle willChange'
)

export const nonAnimatableWebTextProps = /* @__PURE__ */ toObj(
  'whiteSpace wordWrap textOverflow WebkitBoxOrient'
)

export const webOnlyStylePropsView = /* @__PURE__ */ toObj(
  nonAnimatableWebViewProps,
  'transition transitionProperty transitionDuration transitionTimingFunction transitionDelay transitionBehavior backdropFilter WebkitBackdropFilter borderTop borderRight borderBottom borderLeft backgroundPosition backgroundSize borderImage caretColor clipPath mask maskBorder maskBorderOutset maskBorderSlice maskBorderSource maskBorderWidth maskImage maskPosition maskSize objectPosition textEmphasis userSelect overflowWrap wordWrap resize'
)

export const webOnlyStylePropsText = /* @__PURE__ */ toObj(
  nonAnimatableWebTextProps,
  'textDecorationDistance WebkitLineClamp'
)
