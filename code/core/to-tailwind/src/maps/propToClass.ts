/**
 * maps CSS property names to Tailwind class prefixes.
 * e.g. backgroundColor → bg, padding → p, width → w
 */

export const propToTailwindPrefix: Record<string, string> = {
  // backgrounds
  backgroundColor: 'bg',
  backgroundImage: 'bg',
  backgroundPosition: 'bg',
  backgroundSize: 'bg',
  backgroundRepeat: 'bg',
  backgroundClip: 'bg-clip',

  // sizing
  width: 'w',
  height: 'h',
  minWidth: 'min-w',
  maxWidth: 'max-w',
  minHeight: 'min-h',
  maxHeight: 'max-h',

  // spacing
  padding: 'p',
  paddingTop: 'pt',
  paddingRight: 'pr',
  paddingBottom: 'pb',
  paddingLeft: 'pl',
  paddingHorizontal: 'px',
  paddingVertical: 'py',
  margin: 'm',
  marginTop: 'mt',
  marginRight: 'mr',
  marginBottom: 'mb',
  marginLeft: 'ml',
  marginHorizontal: 'mx',
  marginVertical: 'my',
  gap: 'gap',
  rowGap: 'gap-y',
  columnGap: 'gap-x',

  // borders
  borderWidth: 'border',
  borderTopWidth: 'border-t',
  borderRightWidth: 'border-r',
  borderBottomWidth: 'border-b',
  borderLeftWidth: 'border-l',
  borderColor: 'border',
  borderTopColor: 'border-t',
  borderRightColor: 'border-r',
  borderBottomColor: 'border-b',
  borderLeftColor: 'border-l',
  borderRadius: 'rounded',
  borderTopLeftRadius: 'rounded-tl',
  borderTopRightRadius: 'rounded-tr',
  borderBottomLeftRadius: 'rounded-bl',
  borderBottomRightRadius: 'rounded-br',
  borderStyle: 'border',

  // typography
  color: 'text',
  fontSize: 'text',
  fontWeight: 'font',
  fontFamily: 'font',
  fontStyle: '',
  lineHeight: 'leading',
  letterSpacing: 'tracking',
  textAlign: 'text',
  textTransform: '',
  textDecorationLine: '',
  textDecorationColor: 'decoration',

  // layout
  display: '',
  position: '',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  inset: 'inset',
  zIndex: 'z',
  overflow: 'overflow',
  overflowX: 'overflow-x',
  overflowY: 'overflow-y',

  // flexbox
  flex: 'flex',
  flexDirection: 'flex',
  flexWrap: 'flex',
  flexGrow: 'grow',
  flexShrink: 'shrink',
  flexBasis: 'basis',
  alignItems: 'items',
  alignContent: 'content',
  alignSelf: 'self',
  justifyContent: 'justify',

  // effects
  opacity: 'opacity',
  boxShadow: 'shadow',
  cursor: 'cursor',
  pointerEvents: 'pointer-events',
  userSelect: 'select',

  // transforms
  rotate: 'rotate',
  scale: 'scale',
  x: 'translate-x',
  y: 'translate-y',

  // outline
  outlineWidth: 'outline',
  outlineColor: 'outline',
  outlineStyle: 'outline',
  outlineOffset: 'outline-offset',

  // other
  aspectRatio: 'aspect',
  objectFit: 'object',
  objectPosition: 'object',
}

// values that become their own class (no prefix-value, just the value)
export const standaloneValueProps: Record<string, Record<string, string>> = {
  display: {
    flex: 'flex',
    none: 'hidden',
    block: 'block',
    inline: 'inline',
    grid: 'grid',
    'inline-flex': 'inline-flex',
  },
  position: {
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
    static: 'static',
  },
  flexDirection: {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  },
  flexWrap: {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  },
  textTransform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    none: 'normal-case',
  },
  textDecorationLine: {
    underline: 'underline',
    'line-through': 'line-through',
    none: 'no-underline',
  },
  fontStyle: {
    italic: 'italic',
    normal: 'not-italic',
  },
  borderStyle: {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    none: 'border-none',
  },
  alignItems: {
    center: 'items-center',
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  },
  alignContent: {
    center: 'content-center',
    'flex-start': 'content-start',
    'flex-end': 'content-end',
    'space-between': 'content-between',
    'space-around': 'content-around',
    stretch: 'content-stretch',
  },
  alignSelf: {
    auto: 'self-auto',
    center: 'self-center',
    'flex-start': 'self-start',
    'flex-end': 'self-end',
    stretch: 'self-stretch',
  },
  justifyContent: {
    center: 'justify-center',
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  },
  overflow: {
    hidden: 'overflow-hidden',
    scroll: 'overflow-scroll',
    auto: 'overflow-auto',
    visible: 'overflow-visible',
  },
  textAlign: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },
  objectFit: {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  },
}

// tamagui component → HTML tag
export const componentToTag: Record<string, string> = {
  View: 'div',
  XStack: 'div',
  YStack: 'div',
  ZStack: 'div',
  Stack: 'div',
  Text: 'span',
  Paragraph: 'p',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  SizableText: 'span',
  Heading: 'h2',
  Label: 'label',
  Separator: 'hr',
}
