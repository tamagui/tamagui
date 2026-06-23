import { shorthands } from '@tamagui/shorthands/v6'

export const tamaguiShorthands = shorthands

const propPrefixEntries: [string, string][] = [
  ...tailwindPrefixesFromShorthands(),

  ['width', 'w'],
  ['height', 'h'],
  ['gap', 'gap'],
  ['rowGap', 'gap-y'],
  ['columnGap', 'gap-x'],

  ['backgroundImage', 'bg'],
  ['backgroundPosition', 'bg'],
  ['backgroundSize', 'bg'],
  ['backgroundRepeat', 'bg'],
  ['backgroundClip', 'bg-clip'],

  ['borderWidth', 'border'],
  ['borderColor', 'border'],
  ['borderStyle', 'border'],
  ...sideEntries('border', 'Width', 'border'),
  ...sideEntries('border', 'Color', 'border'),
  ...cornerEntries(),

  ['color', 'text'],
  ['fontSize', 'text'],
  ['fontWeight', 'font'],
  ['fontFamily', 'font'],
  ['fontStyle', ''],
  ['lineHeight', 'leading'],
  ['letterSpacing', 'tracking'],
  ['textTransform', ''],
  ['textDecorationLine', ''],
  ['textDecorationColor', 'decoration'],

  ['display', ''],
  ['position', ''],
  ['inset', 'inset'],
  ['overflow', 'overflow'],
  ['overflowX', 'overflow-x'],
  ['overflowY', 'overflow-y'],

  ['flex', 'flex'],
  ['flexDirection', 'flex'],
  ['flexWrap', 'flex'],
  ['flexBasis', 'basis'],

  ['opacity', 'opacity'],
  ['boxShadow', 'shadow'],
  ['cursor', 'cursor'],
  ['pointerEvents', 'pointer-events'],

  ['rotate', 'rotate'],
  ['scale', 'scale'],
  ['x', 'translate-x'],
  ['y', 'translate-y'],

  ['outlineWidth', 'outline'],
  ['outlineColor', 'outline'],
  ['outlineStyle', 'outline'],
  ['outlineOffset', 'outline-offset'],

  ['aspectRatio', 'aspect'],
  ['objectFit', 'object'],
  ['objectPosition', 'object'],
]

/**
 * maps css property names to tailwind class prefixes.
 * most Tamagui shorthand-aligned prefixes come from @tamagui/shorthands/v6;
 * the rest are tailwind vocabulary that Tamagui does not expose as shorthands.
 */
export const propToTailwindPrefix: Record<string, string> =
  Object.fromEntries(propPrefixEntries)

function tailwindPrefixesFromShorthands(): [string, string][] {
  return Object.entries(shorthands).map(([short, prop]) => {
    return [prop, shorthandToTailwindPrefix(short, prop)]
  })
}

function shorthandToTailwindPrefix(short: string, prop: string) {
  switch (prop) {
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return prop
    default:
      return short.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }
}

function sideEntries(base: string, suffix: string, prefix: string): [string, string][] {
  return [
    [`${base}Top${suffix}`, `${prefix}-t`],
    [`${base}Right${suffix}`, `${prefix}-r`],
    [`${base}Bottom${suffix}`, `${prefix}-b`],
    [`${base}Left${suffix}`, `${prefix}-l`],
  ]
}

function cornerEntries(): [string, string][] {
  return [
    ['borderTopLeftRadius', 'rounded-tl'],
    ['borderTopRightRadius', 'rounded-tr'],
    ['borderBottomLeftRadius', 'rounded-bl'],
    ['borderBottomRightRadius', 'rounded-br'],
  ]
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
