import { getTokenCategoryName, propToTokenCategoryCode } from '../runtime/tokenCategories'
import { modifierAliases } from '../runtime/stateModifiers'

export { modifierAliases }

export type TokenCategory =
  | 'space'
  | 'size'
  | 'radius'
  | 'zIndex'
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'

export type Convenience =
  | 'alignment-alias'
  | 'bare-border'
  | 'flex-bundle'
  | 'font-generic'
  | 'integer'
  | 'percentage'
  | 'sizing-keyword'

export interface GrammarEntry {
  prop: string
  prefix: string
  tokenCategory?: TokenCategory
  conveniences?: readonly Convenience[]
}

const grammarEntrySpecs = [
  { prop: 'backgroundColor', prefix: 'bg' },
  { prop: 'width', prefix: 'w', conveniences: ['sizing-keyword'] },
  {
    prop: 'height',
    prefix: 'h',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'minWidth',
    prefix: 'min-w',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'maxWidth',
    prefix: 'max-w',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'minHeight',
    prefix: 'min-h',
    conveniences: ['sizing-keyword'],
  },
  {
    prop: 'maxHeight',
    prefix: 'max-h',
    conveniences: ['sizing-keyword'],
  },
  { prop: 'padding', prefix: 'p' },
  { prop: 'paddingTop', prefix: 'pt' },
  { prop: 'paddingRight', prefix: 'pr' },
  { prop: 'paddingBottom', prefix: 'pb' },
  { prop: 'paddingLeft', prefix: 'pl' },
  { prop: 'paddingInlineStart', prefix: 'ps' },
  { prop: 'paddingInlineEnd', prefix: 'pe' },
  { prop: 'paddingBlockStart', prefix: 'pbs' },
  { prop: 'paddingBlockEnd', prefix: 'pbe' },
  { prop: 'paddingHorizontal', prefix: 'px' },
  { prop: 'paddingVertical', prefix: 'py' },
  { prop: 'margin', prefix: 'm' },
  { prop: 'marginTop', prefix: 'mt' },
  { prop: 'marginRight', prefix: 'mr' },
  { prop: 'marginBottom', prefix: 'mb' },
  { prop: 'marginLeft', prefix: 'ml' },
  { prop: 'marginInlineStart', prefix: 'ms' },
  { prop: 'marginInlineEnd', prefix: 'me' },
  { prop: 'marginBlockStart', prefix: 'mbs' },
  { prop: 'marginBlockEnd', prefix: 'mbe' },
  { prop: 'marginHorizontal', prefix: 'mx' },
  { prop: 'marginVertical', prefix: 'my' },
  { prop: 'gap', prefix: 'gap' },
  { prop: 'columnGap', prefix: 'gap-x' },
  { prop: 'rowGap', prefix: 'gap-y' },
  { prop: 'borderWidth', prefix: 'border' },
  { prop: 'borderTopWidth', prefix: 'border-t' },
  { prop: 'borderRightWidth', prefix: 'border-r' },
  { prop: 'borderBottomWidth', prefix: 'border-b' },
  { prop: 'borderLeftWidth', prefix: 'border-l' },
  { prop: 'borderInlineStartWidth', prefix: 'border-s' },
  { prop: 'borderInlineEndWidth', prefix: 'border-e' },
  { prop: 'borderBlockStartWidth', prefix: 'border-bs' },
  { prop: 'borderBlockEndWidth', prefix: 'border-be' },
  { prop: 'borderColor', prefix: 'border' },
  { prop: 'borderTopColor', prefix: 'border-t' },
  { prop: 'borderRightColor', prefix: 'border-r' },
  { prop: 'borderBottomColor', prefix: 'border-b' },
  { prop: 'borderLeftColor', prefix: 'border-l' },
  { prop: 'borderInlineStartColor', prefix: 'border-s' },
  { prop: 'borderInlineEndColor', prefix: 'border-e' },
  { prop: 'borderBlockStartColor', prefix: 'border-bs' },
  { prop: 'borderBlockEndColor', prefix: 'border-be' },
  { prop: 'borderRadius', prefix: 'rounded' },
  { prop: 'borderTopLeftRadius', prefix: 'rounded-tl' },
  { prop: 'borderTopRightRadius', prefix: 'rounded-tr' },
  { prop: 'borderBottomLeftRadius', prefix: 'rounded-bl' },
  { prop: 'borderBottomRightRadius', prefix: 'rounded-br' },
  { prop: 'borderStartStartRadius', prefix: 'rounded-ss' },
  { prop: 'borderStartEndRadius', prefix: 'rounded-se' },
  { prop: 'borderEndStartRadius', prefix: 'rounded-es' },
  { prop: 'borderEndEndRadius', prefix: 'rounded-ee' },
  { prop: 'borderStyle', prefix: 'border' },
  { prop: 'outlineWidth', prefix: 'outline' },
  { prop: 'outlineColor', prefix: 'outline' },
  { prop: 'outlineStyle', prefix: 'outline' },
  { prop: 'outlineOffset', prefix: 'outline-offset' },
  { prop: 'color', prefix: 'color' },
  { prop: 'fontSize', prefix: 'text' },
  // bound (2026-07-31 adjudication): the runtime resolves fontWeight through
  // the active family's weight sub-map and the codemod already emits flat
  // weight names, so an unbound registry row was an omission, not a decision
  { prop: 'fontWeight', prefix: 'font' },
  {
    prop: 'fontFamily',
    prefix: 'font',
    conveniences: ['font-generic'],
  },
  { prop: 'fontStyle', prefix: '' },
  { prop: 'lineHeight', prefix: 'leading' },
  { prop: 'letterSpacing', prefix: 'tracking' },
  { prop: 'textAlign', prefix: 'text' },
  { prop: 'textTransform', prefix: '' },
  { prop: 'textDecorationLine', prefix: '' },
  { prop: 'display', prefix: '' },
  { prop: 'position', prefix: '' },
  { prop: 'top', prefix: 'top' },
  { prop: 'right', prefix: 'right' },
  { prop: 'bottom', prefix: 'bottom' },
  { prop: 'left', prefix: 'left' },
  { prop: 'inset', prefix: 'inset' },
  { prop: 'insetInlineStart', prefix: 'start' },
  { prop: 'insetInlineEnd', prefix: 'end' },
  { prop: 'zIndex', prefix: 'z', conveniences: ['integer'] },
  { prop: 'overflow', prefix: '' },
  { prop: 'flex', prefix: 'flex', conveniences: ['flex-bundle'] },
  { prop: 'flexDirection', prefix: 'flex' },
  { prop: 'flexWrap', prefix: 'flex' },
  { prop: 'flexGrow', prefix: 'grow' },
  { prop: 'flexShrink', prefix: 'shrink' },
  { prop: 'flexBasis', prefix: 'basis' },
  { prop: 'alignItems', prefix: 'items', conveniences: ['alignment-alias'] },
  { prop: 'alignContent', prefix: 'content', conveniences: ['alignment-alias'] },
  { prop: 'alignSelf', prefix: 'self', conveniences: ['alignment-alias'] },
  { prop: 'justifyContent', prefix: 'justify', conveniences: ['alignment-alias'] },
  { prop: 'opacity', prefix: 'opacity', conveniences: ['percentage'] },
  { prop: 'boxShadow', prefix: 'shadow' },
  { prop: 'pointerEvents', prefix: 'pointer-events' },
  { prop: 'rotate', prefix: 'rotate' },
  { prop: 'scale', prefix: 'scale', conveniences: ['percentage'] },
  { prop: 'scaleX', prefix: 'scale-x', conveniences: ['percentage'] },
  { prop: 'scaleY', prefix: 'scale-y', conveniences: ['percentage'] },
  { prop: 'x', prefix: 'translate-x' },
  { prop: 'y', prefix: 'translate-y' },
  { prop: 'aspectRatio', prefix: 'aspect' },
  { prop: 'objectFit', prefix: 'object' },
] as const

export const grammarEntries: readonly GrammarEntry[] = grammarEntrySpecs.map((entry) => {
  const tokenCategory = getTokenCategoryName(propToTokenCategoryCode[entry.prop])
  return tokenCategory ? { ...entry, tokenCategory } : entry
})

export const propToGrammarEntry: Readonly<Record<string, GrammarEntry>> = Object.freeze(
  Object.fromEntries(grammarEntries.map((entry) => [entry.prop, entry]))
)

export function getTokenCategory(prop: string): TokenCategory | null {
  return (getTokenCategoryName(propToTokenCategoryCode[prop]) as TokenCategory) || null
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
  outlineStyle: {
    solid: 'outline-solid',
    dashed: 'outline-dashed',
    dotted: 'outline-dotted',
    none: 'outline-none',
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
  grow: { flexGrow: 1 },
  'grow-0': { flexGrow: 0 },
  shrink: { flexShrink: 1 },
  'shrink-0': { flexShrink: 0 },
  'aspect-square': { aspectRatio: 1 },
  'aspect-video': { aspectRatio: 16 / 9 },
  'line-clamp-1': { numberOfLines: 1 },
  'line-clamp-2': { numberOfLines: 2 },
  'line-clamp-3': { numberOfLines: 3 },
  'line-clamp-4': { numberOfLines: 4 },
  'line-clamp-5': { numberOfLines: 5 },
  'line-clamp-6': { numberOfLines: 6 },
  contents: { display: 'contents' },
  border: { borderWidth: 1 },
  outline: { outlineWidth: 1 },
  'border-t': { borderTopWidth: 1 },
  'border-r': { borderRightWidth: 1 },
  'border-b': { borderBottomWidth: 1 },
  'border-l': { borderLeftWidth: 1 },
  'border-x': { borderLeftWidth: 1, borderRightWidth: 1 },
  'border-y': { borderTopWidth: 1, borderBottomWidth: 1 },
  'border-s': { borderInlineStartWidth: 1 },
  'border-e': { borderInlineEndWidth: 1 },
  'border-bs': { borderBlockStartWidth: 1 },
  'border-be': { borderBlockEndWidth: 1 },
  'inset-0': { top: 0, right: 0, bottom: 0, left: 0 },
  'inset-x-0': { left: 0, right: 0 },
  'inset-y-0': { top: 0, bottom: 0 },
})

export const wholeClassConveniences: Readonly<Record<string, Convenience>> =
  Object.freeze({
    'flex-1': 'flex-bundle',
    'flex-auto': 'flex-bundle',
    'flex-initial': 'flex-bundle',
    'flex-none': 'flex-bundle',
    border: 'bare-border',
    outline: 'bare-border',
    'border-t': 'bare-border',
    'border-r': 'bare-border',
    'border-b': 'bare-border',
    'border-l': 'bare-border',
    'border-x': 'bare-border',
    'border-y': 'bare-border',
    'border-s': 'bare-border',
    'border-e': 'bare-border',
    'border-bs': 'bare-border',
    'border-be': 'bare-border',
    'inset-0': 'sizing-keyword',
    'inset-x-0': 'sizing-keyword',
    'inset-y-0': 'sizing-keyword',
  })

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
    ss: ['borderStartStartRadius'],
    se: ['borderStartEndRadius'],
    es: ['borderEndStartRadius'],
    ee: ['borderEndEndRadius'],
    s: ['borderStartStartRadius', 'borderEndStartRadius'],
    e: ['borderStartEndRadius', 'borderEndEndRadius'],
  })

export const sizeUtilityProps: readonly string[] = ['width', 'height']

export const insetAxisProps: Readonly<Record<string, readonly string[]>> = Object.freeze({
  x: ['left', 'right'],
  y: ['top', 'bottom'],
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
