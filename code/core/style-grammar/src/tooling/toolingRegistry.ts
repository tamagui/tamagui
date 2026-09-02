import { grammarEntries } from './registry'

export const propToTailwindPrefix: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(grammarEntries.map(({ prop, prefix }) => [prop, prefix]))
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

export type GrammarDecision = {
  syntax: string
  decision: 'keep' | 'drop'
  reason: string
}

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
  { syntax: 'bare outline', decision: 'keep', reason: 'documented 1px convenience' },
  { syntax: 'inset-0', decision: 'keep', reason: 'documented zero convenience' },
  {
    syntax: 'inset-x / inset-y',
    decision: 'keep',
    reason: 'axis insets expand to left/right or top/bottom',
  },
  {
    syntax: 'size-*',
    decision: 'keep',
    reason: 'width and height from the size token scale',
  },
  {
    syntax: 'text-* color/size/align',
    decision: 'keep',
    reason: 'fontSize tokens, then alignment keywords, then color tokens',
  },
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
