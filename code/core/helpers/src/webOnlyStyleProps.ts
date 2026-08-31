// Web-only style props that need to be skipped on native

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

export const nonAnimatableWebViewProps = toObj(
  'backgroundAttachment backgroundBlendMode backgroundClip backgroundOrigin backgroundRepeat ' +
    'borderBottomStyle borderLeftStyle borderRightStyle borderTopStyle contain containerType ' +
    'containerName content float maskBorderMode maskBorderRepeat maskClip maskComposite ' +
    'maskMode maskOrigin maskRepeat maskType objectFit overflowBlock overflowInline ' +
    'overflowX overflowY scrollbarWidth textWrap touchAction transformStyle willChange'
)

export const nonAnimatableWebTextProps = toObj(
  'whiteSpace wordWrap textOverflow WebkitBoxOrient'
)

export const webOnlyStylePropsView = toObj(
  nonAnimatableWebViewProps,
  'transition transitionProperty transitionDuration transitionTimingFunction transitionDelay ' +
    'transitionBehavior backdropFilter WebkitBackdropFilter borderTop borderRight borderBottom ' +
    'borderLeft backgroundPosition backgroundSize borderImage caretColor clipPath mask ' +
    'maskBorder maskBorderOutset maskBorderSlice maskBorderSource maskBorderWidth maskImage ' +
    'maskPosition maskSize objectPosition textEmphasis userSelect overflowWrap wordWrap resize'
)

export const webOnlyStylePropsText = toObj(
  nonAnimatableWebTextProps,
  'textDecorationDistance WebkitLineClamp'
)
