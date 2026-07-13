export type TokenCategory =
  | 'space'
  | 'size'
  | 'radius'
  | 'zIndex'
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'

export type Convenience =
  | 'alignment-alias'
  | 'bare-border'
  | 'flex-bundle'
  | 'font-generic'
  | 'percentage'
  | 'sizing-keyword'

export type GrammarDecision = {
  syntax: string
  decision: 'keep' | 'drop'
  reason: string
}

export interface GrammarEntry {
  prop: string
  prefix: string
  tokenCategory?: TokenCategory
  conveniences?: readonly Convenience[]
}

export const grammarEntries: readonly GrammarEntry[] = [
  { prop: 'backgroundColor', prefix: 'bg', tokenCategory: 'color' },
  { prop: 'width', prefix: 'w', tokenCategory: 'size', conveniences: ['sizing-keyword'] },
  {
    prop: 'height',
    prefix: 'h',
    tokenCategory: 'size',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'minWidth',
    prefix: 'min-w',
    tokenCategory: 'size',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'maxWidth',
    prefix: 'max-w',
    tokenCategory: 'size',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'minHeight',
    prefix: 'min-h',
    tokenCategory: 'size',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'maxHeight',
    prefix: 'max-h',
    tokenCategory: 'size',
    conveniences: ['sizing-keyword'],
  },
  { prop: 'padding', prefix: 'p', tokenCategory: 'space' },
  { prop: 'paddingTop', prefix: 'pt', tokenCategory: 'space' },
  { prop: 'paddingRight', prefix: 'pr', tokenCategory: 'space' },
  { prop: 'paddingBottom', prefix: 'pb', tokenCategory: 'space' },
  { prop: 'paddingLeft', prefix: 'pl', tokenCategory: 'space' },
  { prop: 'paddingHorizontal', prefix: 'px', tokenCategory: 'space' },
  { prop: 'paddingVertical', prefix: 'py', tokenCategory: 'space' },
  { prop: 'margin', prefix: 'm', tokenCategory: 'space' },
  { prop: 'marginTop', prefix: 'mt', tokenCategory: 'space' },
  { prop: 'marginRight', prefix: 'mr', tokenCategory: 'space' },
  { prop: 'marginBottom', prefix: 'mb', tokenCategory: 'space' },
  { prop: 'marginLeft', prefix: 'ml', tokenCategory: 'space' },
  { prop: 'marginHorizontal', prefix: 'mx', tokenCategory: 'space' },
  { prop: 'marginVertical', prefix: 'my', tokenCategory: 'space' },
  { prop: 'gap', prefix: 'gap', tokenCategory: 'space' },
  { prop: 'borderWidth', prefix: 'border', tokenCategory: 'space' },
  { prop: 'borderTopWidth', prefix: 'border-t', tokenCategory: 'space' },
  { prop: 'borderRightWidth', prefix: 'border-r', tokenCategory: 'space' },
  { prop: 'borderBottomWidth', prefix: 'border-b', tokenCategory: 'space' },
  { prop: 'borderLeftWidth', prefix: 'border-l', tokenCategory: 'space' },
  { prop: 'borderColor', prefix: 'border', tokenCategory: 'color' },
  { prop: 'borderTopColor', prefix: 'border-t', tokenCategory: 'color' },
  { prop: 'borderRightColor', prefix: 'border-r', tokenCategory: 'color' },
  { prop: 'borderBottomColor', prefix: 'border-b', tokenCategory: 'color' },
  { prop: 'borderLeftColor', prefix: 'border-l', tokenCategory: 'color' },
  { prop: 'borderRadius', prefix: 'rounded', tokenCategory: 'radius' },
  { prop: 'borderTopLeftRadius', prefix: 'rounded-tl', tokenCategory: 'radius' },
  { prop: 'borderTopRightRadius', prefix: 'rounded-tr', tokenCategory: 'radius' },
  { prop: 'borderBottomLeftRadius', prefix: 'rounded-bl', tokenCategory: 'radius' },
  { prop: 'borderBottomRightRadius', prefix: 'rounded-br', tokenCategory: 'radius' },
  { prop: 'borderStyle', prefix: 'border' },
  { prop: 'color', prefix: 'color', tokenCategory: 'color' },
  { prop: 'fontSize', prefix: 'text', tokenCategory: 'fontSize' },
  { prop: 'fontWeight', prefix: 'font' },
  {
    prop: 'fontFamily',
    prefix: 'font',
    tokenCategory: 'fontFamily',
    conveniences: ['font-generic'],
  },
  { prop: 'fontStyle', prefix: '' },
  { prop: 'lineHeight', prefix: 'leading', tokenCategory: 'lineHeight' },
  { prop: 'letterSpacing', prefix: 'tracking', tokenCategory: 'letterSpacing' },
  { prop: 'textAlign', prefix: 'text' },
  { prop: 'textTransform', prefix: '' },
  { prop: 'textDecorationLine', prefix: '' },
  { prop: 'display', prefix: '' },
  { prop: 'position', prefix: '' },
  { prop: 'top', prefix: 'top', tokenCategory: 'space' },
  { prop: 'right', prefix: 'right', tokenCategory: 'space' },
  { prop: 'bottom', prefix: 'bottom', tokenCategory: 'space' },
  { prop: 'left', prefix: 'left', tokenCategory: 'space' },
  { prop: 'inset', prefix: 'inset', tokenCategory: 'space' },
  { prop: 'zIndex', prefix: 'z', tokenCategory: 'zIndex' },
  { prop: 'overflow', prefix: '' },
  { prop: 'flex', prefix: 'flex', conveniences: ['flex-bundle'] },
  { prop: 'flexDirection', prefix: 'flex' },
  { prop: 'flexWrap', prefix: 'flex' },
  { prop: 'flexGrow', prefix: 'grow' },
  { prop: 'flexShrink', prefix: 'shrink' },
  { prop: 'alignItems', prefix: 'items', conveniences: ['alignment-alias'] },
  { prop: 'alignContent', prefix: 'content', conveniences: ['alignment-alias'] },
  { prop: 'alignSelf', prefix: 'self', conveniences: ['alignment-alias'] },
  { prop: 'justifyContent', prefix: 'justify', conveniences: ['alignment-alias'] },
  { prop: 'opacity', prefix: 'opacity', conveniences: ['percentage'] },
  { prop: 'boxShadow', prefix: 'shadow' },
  { prop: 'pointerEvents', prefix: 'pointer-events' },
  { prop: 'rotate', prefix: 'rotate' },
  { prop: 'scale', prefix: 'scale', conveniences: ['percentage'] },
  { prop: 'x', prefix: 'translate-x', tokenCategory: 'space' },
  { prop: 'y', prefix: 'translate-y', tokenCategory: 'space' },
  { prop: 'aspectRatio', prefix: 'aspect' },
  { prop: 'objectFit', prefix: 'object' },
] as const

export const propToTailwindPrefix: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(grammarEntries.map(({ prop, prefix }) => [prop, prefix]))
)

export const propToGrammarEntry: Readonly<Record<string, GrammarEntry>> = Object.freeze(
  Object.fromEntries(grammarEntries.map((entry) => [entry.prop, entry]))
)

export function getTokenCategory(prop: string): TokenCategory | null {
  return propToGrammarEntry[prop]?.tokenCategory || null
}

export const prefixToEntries: Readonly<Record<string, readonly GrammarEntry[]>> =
  Object.freeze(
    grammarEntries.reduce<Record<string, GrammarEntry[]>>((out, entry) => {
      if (!entry.prefix) return out
      ;(out[entry.prefix] ||= []).push(entry)
      return out
    }, {})
  )

export const standaloneValueProps: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = Object.freeze({
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
  pointerEvents: {
    none: 'pointer-events-none',
    auto: 'pointer-events-auto',
    'box-none': 'pointer-events-box-none',
    'box-only': 'pointer-events-box-only',
  },
  textAlign: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
    start: 'text-start',
    end: 'text-end',
  },
  objectFit: {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  },
})

export const fontWeightNames: Readonly<Record<string, string>> = Object.freeze({
  '100': 'thin',
  '200': 'extralight',
  '300': 'light',
  '400': 'normal',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
  '800': 'extrabold',
  '900': 'black',
  normal: 'normal',
  bold: 'bold',
})

const generatedWholeUtilities: Record<string, Record<string, string | number>> = {}
for (const prop in standaloneValueProps) {
  for (const value in standaloneValueProps[prop]) {
    generatedWholeUtilities[standaloneValueProps[prop][value]] = { [prop]: value }
  }
}
for (const value in fontWeightNames) {
  generatedWholeUtilities[`font-${fontWeightNames[value]}`] = {
    fontWeight: /^\d+$/.test(value) ? value : value === 'bold' ? '700' : '400',
  }
}

export const wholeClassUtilities: Readonly<
  Record<string, Readonly<Record<string, string | number>>>
> = Object.freeze({
  ...generatedWholeUtilities,
  'flex-1': { flex: 1 },
  'flex-auto': { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' },
  'flex-initial': { flexGrow: 0, flexShrink: 1, flexBasis: 'auto' },
  'flex-none': { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' },
  contents: { display: 'contents' },
  border: { borderWidth: 1 },
  'border-t': { borderTopWidth: 1 },
  'border-r': { borderRightWidth: 1 },
  'border-b': { borderBottomWidth: 1 },
  'border-l': { borderLeftWidth: 1 },
  'border-x': { borderLeftWidth: 1, borderRightWidth: 1 },
  'border-y': { borderTopWidth: 1, borderBottomWidth: 1 },
  'inset-0': { top: 0, right: 0, bottom: 0, left: 0 },
})

export const wholeClassConveniences: Readonly<Record<string, Convenience>> =
  Object.freeze({
    'flex-1': 'flex-bundle',
    'flex-auto': 'flex-bundle',
    'flex-initial': 'flex-bundle',
    'flex-none': 'flex-bundle',
    border: 'bare-border',
    'border-t': 'bare-border',
    'border-r': 'bare-border',
    'border-b': 'bare-border',
    'border-l': 'bare-border',
    'border-x': 'bare-border',
    'border-y': 'bare-border',
    'inset-0': 'sizing-keyword',
  })

export const pseudoToModifier: Readonly<Record<string, string>> = Object.freeze({
  hoverStyle: 'hover',
  pressStyle: 'press',
  focusStyle: 'focus',
  focusVisibleStyle: 'focus-visible',
  focusWithinStyle: 'focus-within',
  disabledStyle: 'disabled',
  enterStyle: 'enter',
  exitStyle: 'exit',
})

export const modifierAliases: Readonly<Record<string, string>> = Object.freeze({
  active: 'press',
})

export const modifierToPseudo: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    Object.entries(pseudoToModifier).map(([prop, modifier]) => [modifier, prop])
  )
)

export const defaultMediaKeys: readonly string[] = [
  'touchable',
  'hoverable',
  'max-xxl',
  'max-xl',
  'max-lg',
  'max-md',
  'max-sm',
  'max-xs',
  'max-xxs',
  'max-xxxs',
  'max-200',
  'max-100',
  'xxxs',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'max-height-lg',
  'max-height-md',
  'max-height-sm',
  'max-height-xs',
  'max-height-xxs',
  'max-height-xxxs',
  'max-height-200',
  'max-height-100',
  'height-sm',
  'height-md',
  'height-lg',
  'gtXs',
  'gtSm',
  'gtMd',
  'gtLg',
  'gtXl',
  'short',
  'tall',
  'hoverNone',
  'pointerCoarse',
]

export const borderSideSuffix: Readonly<Record<string, readonly string[]>> =
  Object.freeze({
    t: ['Top'],
    r: ['Right'],
    b: ['Bottom'],
    l: ['Left'],
    x: ['Left', 'Right'],
    y: ['Top', 'Bottom'],
  })

export const radiusCornerProps: Readonly<Record<string, readonly string[]>> =
  Object.freeze({
    tl: ['borderTopLeftRadius'],
    tr: ['borderTopRightRadius'],
    bl: ['borderBottomLeftRadius'],
    br: ['borderBottomRightRadius'],
    t: ['borderTopLeftRadius', 'borderTopRightRadius'],
    b: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    l: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    r: ['borderTopRightRadius', 'borderBottomRightRadius'],
  })

export const textAlignKeywords: ReadonlySet<string> = new Set([
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
])

export const percentUtilityProps: ReadonlySet<string> = new Set([
  'opacity',
  'scale',
  'scaleX',
  'scaleY',
])

export const grammarDecisions: readonly GrammarDecision[] = [
  {
    syntax: 'w-full and size keywords',
    decision: 'keep',
    reason: 'explicit size convenience',
  },
  {
    syntax: 'w-1/2 and fractions',
    decision: 'keep',
    reason: 'explicit size convenience',
  },
  {
    syntax: 'opacity-N percentages',
    decision: 'keep',
    reason: 'documented exact percentage',
  },
  {
    syntax: 'scale-N percentages',
    decision: 'keep',
    reason: 'documented exact percentage',
  },
  {
    syntax: 'unbracketed raw colors',
    decision: 'drop',
    reason: 'plain names are configured color tokens',
  },
  {
    syntax: 'font-sans/serif/mono',
    decision: 'keep',
    reason: 'documented generic-family aliases',
  },
  {
    syntax: 'configured tokens colliding with conveniences/enums',
    decision: 'keep',
    reason: 'the exact configured category token wins; otherwise the convenience wins',
  },
  {
    syntax: 'alignment aliases',
    decision: 'keep',
    reason: 'exact prop-specific enum aliases only',
  },
  { syntax: 'flex bundles', decision: 'keep', reason: 'documented multi-prop utilities' },
  {
    syntax: 'other unbracketed flex/grow/shrink numbers',
    decision: 'drop',
    reason: 'raw numbers use brackets',
  },
  { syntax: 'bare border', decision: 'keep', reason: 'documented 1px convenience' },
  { syntax: 'inset-0', decision: 'keep', reason: 'documented zero convenience' },
  {
    syntax: 'active: modifier',
    decision: 'keep',
    reason: 'documented alias of canonical press:',
  },
  {
    syntax: 'unregistered enum/keyword values',
    decision: 'drop',
    reason: 'raw values use brackets',
  },
  {
    syntax: 'leading-negative arbitrary/convenience/enum forms',
    decision: 'drop',
    reason: 'raw negative values put the sign inside brackets',
  },
  {
    syntax: 'ambiguous overloaded border arbitrary values',
    decision: 'drop',
    reason: 'width versus color must be type-provable',
  },
  {
    syntax: 'zero-denominator fractions',
    decision: 'drop',
    reason: 'fractions must resolve to a finite percentage',
  },
] as const
