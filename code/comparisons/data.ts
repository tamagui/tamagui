/**
 * CSS utility coverage comparison data
 *
 * each category has a list of utilities, and each utility tracks
 * which frameworks support it:
 *   - tamagui: flat-style prop syntax ($bg, $hover:bg, etc)
 *   - tailwind: tailwind CSS classes
 *   - nativewind: nativewind (tailwind for RN) support
 *   - uniwind: uniwind (unistyles-based) support
 *
 * support levels:
 *   'full'     - fully supported
 *   'partial'  - supported with limitations
 *   'web-only' - only works on web platform
 *   'none'     - not supported
 */

export type SupportLevel = 'full' | 'partial' | 'web-only' | 'none'

export interface UtilityEntry {
  name: string
  description: string
  /** example class/prop for each framework */
  examples: {
    tamagui?: string
    tailwind?: string
    nativewind?: string
    uniwind?: string
  }
  support: {
    tamagui: SupportLevel
    tailwind: SupportLevel
    nativewind: SupportLevel
    uniwind: SupportLevel
  }
  notes?: string
}

export interface Category {
  name: string
  utilities: UtilityEntry[]
}

export const categories: Category[] = [
  // ═══════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════
  {
    name: 'Layout',
    utilities: [
      {
        name: 'display',
        description: 'Set display type',
        examples: {
          tamagui: '$dsp="flex"',
          tailwind: 'flex / block / grid / hidden',
          nativewind: 'flex / hidden',
          uniwind: 'flex / block / hidden',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
        notes: 'RN only supports flex natively',
      },
      {
        name: 'position',
        description: 'Set positioning mode',
        examples: {
          tamagui: '$pos="absolute"',
          tailwind: 'absolute / relative / fixed / sticky',
          nativewind: 'absolute / relative',
          uniwind: 'absolute / relative',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
        notes: 'RN lacks fixed/sticky',
      },
      {
        name: 'top/right/bottom/left',
        description: 'Position offsets',
        examples: {
          tamagui: '$t={10} $r={10} $b={10} $l={10}',
          tailwind: 'top-4 right-4 bottom-4 left-4',
          nativewind: 'top-4 right-4 bottom-4 left-4',
          uniwind: 'top-4 right-4 bottom-4 left-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'inset',
        description: 'Shorthand for all position offsets',
        examples: {
          tamagui: '$inset={10}',
          tailwind: 'inset-4 inset-x-4 inset-y-4',
          nativewind: 'inset-4',
          uniwind: 'inset-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'z-index',
        description: 'Stack order',
        examples: {
          tamagui: '$zi={10}',
          tailwind: 'z-10',
          nativewind: 'z-10',
          uniwind: 'z-10',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'overflow',
        description: 'Overflow behavior',
        examples: {
          tamagui: '$ov="hidden"',
          tailwind: 'overflow-hidden / overflow-scroll',
          nativewind: 'overflow-hidden / overflow-scroll',
          uniwind: 'overflow-hidden',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'partial' },
      },
      {
        name: 'aspect-ratio',
        description: 'Aspect ratio',
        examples: {
          tamagui: '$aspectRatio={1}',
          tailwind: 'aspect-square / aspect-video',
          nativewind: 'aspect-square / aspect-video',
          uniwind: 'aspect-square',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'box-sizing',
        description: 'Box model sizing',
        examples: {
          tamagui: '$bxs="border-box"',
          tailwind: 'box-border / box-content',
          nativewind: 'box-border',
          uniwind: 'box-border',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
      },
      {
        name: 'isolation',
        description: 'Stacking context isolation',
        examples: {
          tamagui: '$isolation="isolate"',
          tailwind: 'isolate / isolation-auto',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'visibility',
        description: 'Element visibility',
        examples: {
          tailwind: 'visible / invisible / collapse',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
        notes: 'Tamagui uses opacity/display instead',
      },
      {
        name: 'float',
        description: 'Float positioning',
        examples: {
          tailwind: 'float-left / float-right',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
        notes: 'Not applicable to RN flexbox model',
      },
      {
        name: 'clear',
        description: 'Clear floats',
        examples: {
          tailwind: 'clear-left / clear-both',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'columns',
        description: 'Multi-column layout',
        examples: {
          tamagui: '$columnCount={3}',
          tailwind: 'columns-3',
        },
        support: { tamagui: 'partial', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'object-fit',
        description: 'Replaced element sizing',
        examples: {
          tailwind: 'object-cover / object-contain',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
        notes: 'Tamagui uses Image resizeMode',
      },
      {
        name: 'object-position',
        description: 'Replaced element position',
        examples: {
          tailwind: 'object-center / object-top',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // FLEXBOX
  // ═══════════════════════════════════════
  {
    name: 'Flexbox',
    utilities: [
      {
        name: 'flex-direction',
        description: 'Main axis direction',
        examples: {
          tamagui: '$fd="row"',
          tailwind: 'flex-row / flex-col',
          nativewind: 'flex-row / flex-col',
          uniwind: 'flex-row / flex-col',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'flex-wrap',
        description: 'Wrapping behavior',
        examples: {
          tamagui: '$fw="wrap"',
          tailwind: 'flex-wrap / flex-nowrap',
          nativewind: 'flex-wrap / flex-nowrap',
          uniwind: 'flex-wrap / flex-nowrap',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'flex',
        description: 'Flex shorthand',
        examples: {
          tamagui: '$f={1}',
          tailwind: 'flex-1 / flex-auto / flex-none',
          nativewind: 'flex-1',
          uniwind: 'flex-1',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
        notes: 'RN flex only takes a single number',
      },
      {
        name: 'flex-grow',
        description: 'Flex grow factor',
        examples: {
          tamagui: '$fg={1}',
          tailwind: 'grow / grow-0',
          nativewind: 'grow / grow-0',
          uniwind: 'grow / grow-0',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'flex-shrink',
        description: 'Flex shrink factor',
        examples: {
          tamagui: '$fs={0}',
          tailwind: 'shrink / shrink-0',
          nativewind: 'shrink / shrink-0',
          uniwind: 'shrink / shrink-0',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'flex-basis',
        description: 'Initial main size',
        examples: {
          tamagui: '$fb="auto"',
          tailwind: 'basis-1/2 / basis-auto',
          nativewind: 'basis-auto',
          uniwind: 'basis-auto',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'partial' },
      },
      {
        name: 'justify-content',
        description: 'Main axis alignment',
        examples: {
          tamagui: '$jc="center"',
          tailwind: 'justify-center / justify-between',
          nativewind: 'justify-center / justify-between',
          uniwind: 'justify-center / justify-between',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'align-items',
        description: 'Cross axis alignment',
        examples: {
          tamagui: '$ai="center"',
          tailwind: 'items-center / items-start',
          nativewind: 'items-center / items-start',
          uniwind: 'items-center / items-start',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'align-self',
        description: 'Individual cross axis alignment',
        examples: {
          tamagui: '$als="center"',
          tailwind: 'self-center / self-start',
          nativewind: 'self-center / self-start',
          uniwind: 'self-center / self-start',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'align-content',
        description: 'Multi-line cross axis alignment',
        examples: {
          tamagui: '$ac="center"',
          tailwind: 'content-center / content-between',
          nativewind: 'content-center',
          uniwind: 'content-center',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'gap',
        description: 'Gap between flex/grid items',
        examples: {
          tamagui: '$gap={10}',
          tailwind: 'gap-4 / gap-x-4 / gap-y-4',
          nativewind: 'gap-4',
          uniwind: 'gap-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'order',
        description: 'Flex item order',
        examples: {
          tamagui: '$order={1}',
          tailwind: 'order-1 / order-first / order-last',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // GRID
  // ═══════════════════════════════════════
  {
    name: 'Grid',
    utilities: [
      {
        name: 'grid-template-columns',
        description: 'Define grid columns',
        examples: {
          tamagui: '$gridTemplateColumns="repeat(3, 1fr)"',
          tailwind: 'grid-cols-3',
        },
        support: { tamagui: 'web-only', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'grid-column',
        description: 'Column span/placement',
        examples: {
          tamagui: '$gridColumn="span 2"',
          tailwind: 'col-span-2 / col-start-1',
        },
        support: { tamagui: 'web-only', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'grid-row',
        description: 'Row span/placement',
        examples: {
          tamagui: '$gridRow="span 2"',
          tailwind: 'row-span-2 / row-start-1',
        },
        support: { tamagui: 'web-only', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'grid-template-areas',
        description: 'Named grid areas',
        examples: {
          tamagui: '$gridTemplateAreas="..."',
          tailwind: 'grid-areas-[...]',
        },
        support: { tamagui: 'web-only', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'grid-auto-flow',
        description: 'Auto-placement algorithm',
        examples: {
          tailwind: 'grid-flow-row / grid-flow-col',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'place-content/items/self',
        description: 'Combined alignment shorthands',
        examples: {
          tailwind: 'place-content-center / place-items-center',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // SPACING
  // ═══════════════════════════════════════
  {
    name: 'Spacing',
    utilities: [
      {
        name: 'padding',
        description: 'Inner spacing',
        examples: {
          tamagui: '$p={16} $pt={8} $px={12}',
          tailwind: 'p-4 pt-2 px-3',
          nativewind: 'p-4 pt-2 px-3',
          uniwind: 'p-4 pt-2 px-3',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'margin',
        description: 'Outer spacing',
        examples: {
          tamagui: '$m={16} $mt={8} $mx={12}',
          tailwind: 'm-4 mt-2 mx-3',
          nativewind: 'm-4 mt-2 mx-3',
          uniwind: 'm-4 mt-2 mx-3',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'padding-block/inline (logical)',
        description: 'Logical spacing (writing-mode aware)',
        examples: {
          tamagui: '$paddingBlock={10} $paddingInline={10}',
          tailwind: 'ps-4 pe-4 / pb-4 pt-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'margin-block/inline (logical)',
        description: 'Logical margin (writing-mode aware)',
        examples: {
          tamagui: '$marginBlock={10} $marginInline={10}',
          tailwind: 'ms-4 me-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'space-between',
        description: 'Space between child elements',
        examples: {
          tailwind: 'space-x-4 / space-y-4',
          nativewind: 'space-x-4 / space-y-4',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
        notes: 'Tamagui uses gap instead',
      },
    ],
  },

  // ═══════════════════════════════════════
  // SIZING
  // ═══════════════════════════════════════
  {
    name: 'Sizing',
    utilities: [
      {
        name: 'width',
        description: 'Element width',
        examples: {
          tamagui: '$w={100} / $w="50%"',
          tailwind: 'w-24 / w-1/2 / w-full',
          nativewind: 'w-24 / w-1/2 / w-full',
          uniwind: 'w-24 / w-1/2 / w-full',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'height',
        description: 'Element height',
        examples: {
          tamagui: '$h={100} / $h="50%"',
          tailwind: 'h-24 / h-1/2 / h-full',
          nativewind: 'h-24 / h-full',
          uniwind: 'h-24 / h-full',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'min-width / max-width',
        description: 'Width constraints',
        examples: {
          tamagui: '$miw={100} $maw={500}',
          tailwind: 'min-w-0 max-w-lg',
          nativewind: 'min-w-0 max-w-lg',
          uniwind: 'min-w-0 max-w-lg',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'min-height / max-height',
        description: 'Height constraints',
        examples: {
          tamagui: '$mih={100} $mah={500}',
          tailwind: 'min-h-0 max-h-screen',
          nativewind: 'min-h-0 max-h-screen',
          uniwind: 'min-h-0 max-h-screen',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'inline-size / block-size',
        description: 'Logical sizing (writing-mode aware)',
        examples: {
          tamagui: '$inlineSize={100} $blockSize={100}',
          tailwind: 'inline-size-* / block-size-*',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'none', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // TYPOGRAPHY
  // ═══════════════════════════════════════
  {
    name: 'Typography',
    utilities: [
      {
        name: 'font-family',
        description: 'Font family',
        examples: {
          tamagui: '$ff="$body"',
          tailwind: 'font-sans / font-serif / font-mono',
          nativewind: 'font-sans',
          uniwind: 'font-sans',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'font-size',
        description: 'Font size',
        examples: {
          tamagui: '$fontSize={16}',
          tailwind: 'text-sm / text-lg / text-xl',
          nativewind: 'text-sm / text-lg',
          uniwind: 'text-sm / text-lg',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'font-weight',
        description: 'Font weight',
        examples: {
          tamagui: '$fontWeight="bold"',
          tailwind: 'font-bold / font-semibold / font-light',
          nativewind: 'font-bold / font-semibold',
          uniwind: 'font-bold / font-semibold',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'font-style',
        description: 'Italic/normal',
        examples: {
          tamagui: '$fst="italic"',
          tailwind: 'italic / not-italic',
          nativewind: 'italic',
          uniwind: 'italic',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'color',
        description: 'Text color',
        examples: {
          tamagui: '$col="$color"',
          tailwind: 'text-red-500 / text-blue-700',
          nativewind: 'text-red-500',
          uniwind: 'text-red-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'text-align',
        description: 'Text alignment',
        examples: {
          tamagui: '$ta="center"',
          tailwind: 'text-center / text-left / text-right',
          nativewind: 'text-center',
          uniwind: 'text-center',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'text-transform',
        description: 'Text case transformation',
        examples: {
          tamagui: '$tt="uppercase"',
          tailwind: 'uppercase / lowercase / capitalize',
          nativewind: 'uppercase / lowercase',
          uniwind: 'uppercase',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'text-decoration',
        description: 'Underline/strikethrough',
        examples: {
          tamagui: '$td="underline"',
          tailwind: 'underline / line-through / no-underline',
          nativewind: 'underline / line-through',
          uniwind: 'underline',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'partial' },
      },
      {
        name: 'letter-spacing',
        description: 'Letter spacing',
        examples: {
          tamagui: '$ls={1.5}',
          tailwind: 'tracking-tight / tracking-wide',
          nativewind: 'tracking-tight',
          uniwind: 'tracking-tight',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'line-height',
        description: 'Line height',
        examples: {
          tamagui: '$lh={24}',
          tailwind: 'leading-tight / leading-loose',
          nativewind: 'leading-tight',
          uniwind: 'leading-tight',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'line-clamp',
        description: 'Truncate text to N lines',
        examples: {
          tamagui: '$lineClamp={3}',
          tailwind: 'line-clamp-3',
          nativewind: 'line-clamp-3',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'white-space',
        description: 'Whitespace handling',
        examples: {
          tamagui: '$ws="nowrap"',
          tailwind: 'whitespace-nowrap / whitespace-pre',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'word-break',
        description: 'Word breaking behavior',
        examples: {
          tamagui: '$wb="break-all"',
          tailwind: 'break-words / break-all',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'text-overflow',
        description: 'Text overflow behavior',
        examples: {
          tailwind: 'truncate / text-ellipsis / text-clip',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
        notes: 'Tamagui uses numberOfLines prop',
      },
      {
        name: 'text-indent',
        description: 'First line indentation',
        examples: {
          tailwind: 'indent-4 / indent-8',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'vertical-align',
        description: 'Vertical alignment of inline elements',
        examples: {
          tamagui: '$va="middle"',
          tailwind: 'align-middle / align-top',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'font-variant-numeric',
        description: 'Numeric font features',
        examples: {
          tailwind: 'tabular-nums / oldstyle-nums',
        },
        support: { tamagui: 'partial', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'text-shadow',
        description: 'Text shadow',
        examples: {
          tamagui: '$textShadow="0px 1px 2px rgba(0,0,0,0.3)"',
          tailwind: 'text-shadow-sm / text-shadow-lg',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'none', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // BACKGROUNDS
  // ═══════════════════════════════════════
  {
    name: 'Backgrounds',
    utilities: [
      {
        name: 'background-color',
        description: 'Background color',
        examples: {
          tamagui: '$bg="$background"',
          tailwind: 'bg-red-500 / bg-blue-700',
          nativewind: 'bg-red-500',
          uniwind: 'bg-red-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'background-image',
        description: 'Background images and gradients',
        examples: {
          tamagui: '$backgroundImage="linear-gradient(...)"',
          tailwind: 'bg-gradient-to-r from-blue-500 to-purple-500',
          nativewind: 'bg-gradient-to-r',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'full',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'background-position',
        description: 'Background image position',
        examples: {
          tailwind: 'bg-center / bg-top / bg-bottom',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'background-size',
        description: 'Background image sizing',
        examples: {
          tailwind: 'bg-cover / bg-contain / bg-auto',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'background-repeat',
        description: 'Background tiling',
        examples: {
          tailwind: 'bg-repeat / bg-no-repeat',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'background-clip',
        description: 'Background painting area',
        examples: {
          tailwind: 'bg-clip-border / bg-clip-text',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // BORDERS
  // ═══════════════════════════════════════
  {
    name: 'Borders',
    utilities: [
      {
        name: 'border-width',
        description: 'Border width',
        examples: {
          tamagui: '$bw={1} $btw={2}',
          tailwind: 'border / border-2 / border-t-2',
          nativewind: 'border / border-2',
          uniwind: 'border / border-2',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'border-color',
        description: 'Border color',
        examples: {
          tamagui: '$bc="$borderColor"',
          tailwind: 'border-red-500 / border-blue-700',
          nativewind: 'border-red-500',
          uniwind: 'border-red-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'border-style',
        description: 'Border style',
        examples: {
          tamagui: '$bs="dashed"',
          tailwind: 'border-solid / border-dashed / border-dotted',
          nativewind: 'border-solid / border-dashed',
          uniwind: 'border-solid',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'partial' },
      },
      {
        name: 'border-radius',
        description: 'Corner rounding',
        examples: {
          tamagui: '$rounded={8} $btlr={4}',
          tailwind: 'rounded-lg / rounded-t-lg',
          nativewind: 'rounded-lg',
          uniwind: 'rounded-lg',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'border-width (logical)',
        description: 'Logical border widths (block/inline)',
        examples: {
          tamagui: '$borderBlockWidth={1} $borderInlineWidth={2}',
          tailwind: 'border-s / border-e',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'outline',
        description: 'Outline styling',
        examples: {
          tamagui: '$outlineWidth={2} $outlineColor="blue"',
          tailwind: 'outline / outline-2 / outline-blue-500',
          nativewind: 'outline / outline-2',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'ring',
        description: 'Box-shadow based ring',
        examples: {
          tailwind: 'ring / ring-2 / ring-blue-500',
          nativewind: 'ring / ring-2',
          uniwind: 'ring / ring-2',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
        notes: 'Tamagui can achieve this with boxShadow',
      },
      {
        name: 'divide',
        description: 'Borders between children',
        examples: {
          tailwind: 'divide-x / divide-y / divide-gray-200',
          nativewind: 'divide-x / divide-y',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════
  {
    name: 'Effects',
    utilities: [
      {
        name: 'opacity',
        description: 'Element opacity',
        examples: {
          tamagui: '$o={0.5}',
          tailwind: 'opacity-50',
          nativewind: 'opacity-50',
          uniwind: 'opacity-50',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'box-shadow',
        description: 'Box shadow',
        examples: {
          tamagui: '$bxsh="0 2px 4px rgba(0,0,0,0.1)"',
          tailwind: 'shadow-sm / shadow-lg / shadow-xl',
          nativewind: 'shadow-sm / shadow-lg',
          uniwind: 'shadow-sm / shadow-lg',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
        notes: 'RN shadow implementation differs from CSS',
      },
      {
        name: 'mix-blend-mode',
        description: 'Element blending mode',
        examples: {
          tamagui: '$mixBlendMode="multiply"',
          tailwind: 'mix-blend-multiply / mix-blend-screen',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'full',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'cursor',
        description: 'Mouse cursor style',
        examples: {
          tamagui: '$cur="pointer"',
          tailwind: 'cursor-pointer / cursor-default',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'pointer-events',
        description: 'Pointer event behavior',
        examples: {
          tamagui: '$pe="none"',
          tailwind: 'pointer-events-none / pointer-events-auto',
          nativewind: 'pointer-events-none',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'user-select',
        description: 'Text selection behavior',
        examples: {
          tamagui: '$ussel="none"',
          tailwind: 'select-none / select-text / select-all',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════
  {
    name: 'Filters',
    utilities: [
      {
        name: 'filter (blur, brightness, etc)',
        description: 'CSS filter effects',
        examples: {
          tamagui: '$filter="blur(4px)"',
          tailwind: 'blur-sm / brightness-150 / contrast-125',
        },
        support: { tamagui: 'web-only', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'backdrop-filter',
        description: 'Backdrop filter effects',
        examples: {
          tailwind: 'backdrop-blur-sm / backdrop-brightness-150',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // TRANSFORMS
  // ═══════════════════════════════════════
  {
    name: 'Transforms',
    utilities: [
      {
        name: 'transform',
        description: 'CSS transform',
        examples: {
          tamagui: '$tr="rotate(45deg) scale(1.1)"',
          tailwind: 'transform',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'translate',
        description: 'Translate position',
        examples: {
          tamagui: '$x={10} $y={20}',
          tailwind: 'translate-x-4 / translate-y-4',
          nativewind: 'translate-x-4',
          uniwind: 'translate-x-4',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'scale',
        description: 'Scale sizing',
        examples: {
          tamagui: '$scale={1.5} $scaleX={2}',
          tailwind: 'scale-150 / scale-x-150',
          nativewind: 'scale-150',
          uniwind: 'scale-150',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'rotate',
        description: 'Rotation',
        examples: {
          tamagui: '$rotate="45deg"',
          tailwind: 'rotate-45 / -rotate-45',
          nativewind: 'rotate-45',
          uniwind: 'rotate-45',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'skew',
        description: 'Skew distortion',
        examples: {
          tamagui: '$skewX="12deg" $skewY="6deg"',
          tailwind: 'skew-x-12 / skew-y-6',
          nativewind: 'skew-x-12',
          uniwind: 'skew-x-12',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'transform-origin',
        description: 'Transform origin point',
        examples: {
          tamagui: '$transformOrigin="center"',
          tailwind: 'origin-center / origin-top-left',
          nativewind: 'origin-center',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'perspective',
        description: '3D perspective depth',
        examples: {
          tamagui: '$perspective={500}',
          tailwind: 'perspective-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'backface-visibility',
        description: 'Backface visibility in 3D',
        examples: {
          tamagui: '$backfaceVisibility="hidden"',
          tailwind: 'backface-hidden / backface-visible',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // TRANSITIONS & ANIMATION
  // ═══════════════════════════════════════
  {
    name: 'Transitions & Animation',
    utilities: [
      {
        name: 'animation',
        description: 'Animation driver / keyframes',
        examples: {
          tamagui: 'animation="bouncy"',
          tailwind: 'animate-spin / animate-bounce / animate-pulse',
          nativewind: 'animate-spin',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'partial' },
        notes:
          'Tamagui uses pluggable animation drivers (CSS, reanimated, motion, native)',
      },
      {
        name: 'transition-property',
        description: 'Which properties to transition',
        examples: {
          tailwind: 'transition / transition-colors / transition-all',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
        notes: 'Tamagui animation driver handles this automatically',
      },
      {
        name: 'transition-duration',
        description: 'Transition timing',
        examples: {
          tailwind: 'duration-150 / duration-300 / duration-500',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'transition-timing-function',
        description: 'Easing function',
        examples: {
          tailwind: 'ease-in / ease-out / ease-in-out',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
        notes: 'Tamagui configures this per-animation driver',
      },
      {
        name: 'enter/exit styles',
        description: 'Mount/unmount animation styles',
        examples: {
          tamagui: '$enter:o={0} $exit:o={0}',
        },
        support: { tamagui: 'full', tailwind: 'none', nativewind: 'none', uniwind: 'none' },
        notes: 'Tamagui-specific: AnimatePresence + enterStyle/exitStyle',
      },
    ],
  },

  // ═══════════════════════════════════════
  // INTERACTIVE STATES
  // ═══════════════════════════════════════
  {
    name: 'Interactive States',
    utilities: [
      {
        name: 'hover',
        description: 'Hover state styling',
        examples: {
          tamagui: '$hover:bg="blue"',
          tailwind: 'hover:bg-blue-500',
          nativewind: 'hover:bg-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
        notes: 'Uniwind has no hover (mobile-focused)',
      },
      {
        name: 'press / active',
        description: 'Press/active state styling',
        examples: {
          tamagui: '$press:bg="blue"',
          tailwind: 'active:bg-blue-500',
          nativewind: 'active:bg-blue-500',
          uniwind: 'active:bg-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'focus',
        description: 'Focus state styling',
        examples: {
          tamagui: '$focus:borderColor="blue"',
          tailwind: 'focus:border-blue-500',
          nativewind: 'focus:border-blue-500',
          uniwind: 'focus:border-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'focus-visible',
        description: 'Keyboard focus state',
        examples: {
          tamagui: '$focus-visible:outlineColor="blue"',
          tailwind: 'focus-visible:outline-blue-500',
          nativewind: 'focus-visible:outline-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'focus-within',
        description: 'Focus within container',
        examples: {
          tamagui: '$focus-within:bg="blue"',
          tailwind: 'focus-within:bg-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'disabled',
        description: 'Disabled state styling',
        examples: {
          tamagui: '$disabled:o={0.5}',
          tailwind: 'disabled:opacity-50',
          nativewind: 'disabled:opacity-50',
          uniwind: 'disabled:opacity-50',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'group hover/press',
        description: 'Styling based on parent state',
        examples: {
          tailwind: 'group-hover:text-white',
          nativewind: 'group-hover:text-white',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
        notes: 'Tamagui uses group prop on parent + grouping',
      },
      {
        name: 'peer variants',
        description: 'Styling based on sibling state',
        examples: {
          tailwind: 'peer-focus:text-blue-500',
          nativewind: 'peer-focus:text-blue-500',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // RESPONSIVE / MEDIA
  // ═══════════════════════════════════════
  {
    name: 'Responsive & Media',
    utilities: [
      {
        name: 'breakpoints',
        description: 'Responsive breakpoint modifiers',
        examples: {
          tamagui: '$sm:bg="red" $md:p={20}',
          tailwind: 'sm:bg-red-500 md:p-5',
          nativewind: 'sm:bg-red-500 md:p-5',
          uniwind: 'sm:bg-red-500 md:p-5',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'dark mode',
        description: 'Dark theme modifier',
        examples: {
          tamagui: '$dark:bg="black"',
          tailwind: 'dark:bg-black',
          nativewind: 'dark:bg-black',
          uniwind: 'dark:bg-black',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'combined media + pseudo',
        description: 'Media query + interactive state',
        examples: {
          tamagui: '$sm:hover:bg="blue"',
          tailwind: 'sm:hover:bg-blue-500',
          nativewind: 'sm:hover:bg-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'container queries',
        description: 'Container-based responsive',
        examples: {
          tailwind: '@container / @lg:grid-cols-3',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'prefers-reduced-motion',
        description: 'Reduced motion preference',
        examples: {
          tailwind: 'motion-reduce:animate-none',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // PLATFORM
  // ═══════════════════════════════════════
  {
    name: 'Platform',
    utilities: [
      {
        name: 'web-specific styles',
        description: 'Web-only styling',
        examples: {
          tamagui: '$web:cursor="pointer"',
          nativewind: 'web:cursor-pointer',
          uniwind: 'web:cursor-pointer',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
        notes: 'Tailwind is web-only by default',
      },
      {
        name: 'native-specific styles',
        description: 'Native-only styling',
        examples: {
          tamagui: '$native:p={20}',
          nativewind: 'native:p-5',
          uniwind: 'native:p-5',
        },
        support: { tamagui: 'full', tailwind: 'none', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'ios-specific styles',
        description: 'iOS-only styling',
        examples: {
          tamagui: '$ios:p={20}',
          nativewind: 'ios:p-5',
          uniwind: 'ios:p-5',
        },
        support: { tamagui: 'full', tailwind: 'none', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'android-specific styles',
        description: 'Android-only styling',
        examples: {
          tamagui: '$android:p={20}',
          nativewind: 'android:p-5',
          uniwind: 'android:p-5',
        },
        support: { tamagui: 'full', tailwind: 'none', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'safe area insets',
        description: 'Safe area padding',
        examples: {
          nativewind: 'pt-safe',
          uniwind: 'pt-safe / pt-safe-or-4',
        },
        support: { tamagui: 'none', tailwind: 'none', nativewind: 'full', uniwind: 'full' },
        notes: 'Tamagui uses useSafeAreaInsets hook',
      },
    ],
  },

  // ═══════════════════════════════════════
  // PSEUDO ELEMENTS
  // ═══════════════════════════════════════
  {
    name: 'Pseudo Elements',
    utilities: [
      {
        name: '::before / ::after',
        description: 'Generated content pseudo-elements',
        examples: {
          tailwind: 'before:content-[""] after:block',
          nativewind: 'before:content-[""]',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: '::placeholder',
        description: 'Input placeholder styling',
        examples: {
          tailwind: 'placeholder:text-gray-400',
          nativewind: 'placeholder:text-gray-400',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: '::selection',
        description: 'Text selection styling',
        examples: {
          tailwind: 'selection:bg-blue-200',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'first-child / last-child',
        description: 'Positional child selectors',
        examples: {
          tailwind: 'first:pt-0 last:pb-0',
          nativewind: 'first:pt-0 last:pb-0',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // TABLES
  // ═══════════════════════════════════════
  {
    name: 'Tables',
    utilities: [
      {
        name: 'border-collapse',
        description: 'Table border collapsing',
        examples: {
          tailwind: 'border-collapse / border-separate',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'border-spacing',
        description: 'Table border spacing',
        examples: {
          tailwind: 'border-spacing-2',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'table-layout',
        description: 'Table layout algorithm',
        examples: {
          tailwind: 'table-auto / table-fixed',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // SVG
  // ═══════════════════════════════════════
  {
    name: 'SVG',
    utilities: [
      {
        name: 'fill',
        description: 'SVG fill color',
        examples: {
          tailwind: 'fill-red-500 / fill-current',
          nativewind: 'fill-red-500',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'stroke',
        description: 'SVG stroke color',
        examples: {
          tailwind: 'stroke-red-500 / stroke-current',
          nativewind: 'stroke-red-500',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'stroke-width',
        description: 'SVG stroke width',
        examples: {
          tailwind: 'stroke-1 / stroke-2',
          nativewind: 'stroke-1',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // INTERACTIVITY
  // ═══════════════════════════════════════
  {
    name: 'Interactivity',
    utilities: [
      {
        name: 'scroll-behavior',
        description: 'Smooth scrolling',
        examples: {
          tailwind: 'scroll-smooth / scroll-auto',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'scroll-snap',
        description: 'Scroll snapping',
        examples: {
          tailwind: 'snap-x / snap-mandatory / snap-start',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'touch-action',
        description: 'Touch interaction behavior',
        examples: {
          tailwind: 'touch-none / touch-pan-x',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'resize',
        description: 'Element resizability',
        examples: {
          tailwind: 'resize / resize-x / resize-y / resize-none',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'appearance',
        description: 'Native form control appearance',
        examples: {
          tailwind: 'appearance-none / appearance-auto',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'caret-color',
        description: 'Text input caret color',
        examples: {
          tamagui: '$caretColor="blue"',
          tailwind: 'caret-blue-500',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'partial', uniwind: 'none' },
      },
      {
        name: 'accent-color',
        description: 'Form control accent color',
        examples: {
          tailwind: 'accent-blue-500',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
      {
        name: 'will-change',
        description: 'GPU rendering hints',
        examples: {
          tailwind: 'will-change-transform / will-change-scroll',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // ACCESSIBILITY
  // ═══════════════════════════════════════
  {
    name: 'Accessibility',
    utilities: [
      {
        name: 'sr-only',
        description: 'Screen reader only visibility',
        examples: {
          tailwind: 'sr-only / not-sr-only',
          nativewind: 'sr-only',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
      {
        name: 'forced-color-adjust',
        description: 'Windows high contrast mode',
        examples: {
          tailwind: 'forced-color-adjust-auto / forced-color-adjust-none',
        },
        support: { tamagui: 'none', tailwind: 'full', nativewind: 'web-only', uniwind: 'none' },
      },
    ],
  },

  // ═══════════════════════════════════════
  // DESIGN TOKENS
  // ═══════════════════════════════════════
  {
    name: 'Design Tokens & Theming',
    utilities: [
      {
        name: 'design tokens',
        description: 'Configurable design tokens',
        examples: {
          tamagui: '$bg="$primary" $p="$4"',
          tailwind: 'theme() / extend config',
          nativewind: 'tailwind.config.js',
          uniwind: 'unistyles theme',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
      },
      {
        name: 'theme switching',
        description: 'Runtime theme switching',
        examples: {
          tamagui: '<Theme name="dark">',
          tailwind: 'dark: class toggle',
          nativewind: 'dark: variant',
          uniwind: 'useInitialTheme()',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'full' },
        notes: 'Tamagui has nested theme support with sub-themes',
      },
      {
        name: 'sub-themes / component themes',
        description: 'Scoped component-level theming',
        examples: {
          tamagui: '<Theme name="blue_Button">',
        },
        support: { tamagui: 'full', tailwind: 'none', nativewind: 'none', uniwind: 'partial' },
        notes: 'Tamagui unique: deeply nested component-aware themes',
      },
      {
        name: 'arbitrary values',
        description: 'One-off custom values',
        examples: {
          tamagui: '$bg="rgb(123,45,67)"',
          tailwind: 'bg-[rgb(123,45,67)]',
          nativewind: 'bg-[rgb(123,45,67)]',
        },
        support: { tamagui: 'full', tailwind: 'full', nativewind: 'full', uniwind: 'none' },
      },
    ],
  },
]

// helper to compute coverage stats
export function computeCoverage() {
  const frameworks = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
  const stats = Object.fromEntries(
    frameworks.map((fw) => [fw, { full: 0, partial: 0, webOnly: 0, none: 0, total: 0 }])
  ) as Record<(typeof frameworks)[number], { full: number; partial: number; webOnly: number; none: number; total: number }>

  for (const cat of categories) {
    for (const util of cat.utilities) {
      for (const fw of frameworks) {
        stats[fw].total++
        switch (util.support[fw]) {
          case 'full':
            stats[fw].full++
            break
          case 'partial':
            stats[fw].partial++
            break
          case 'web-only':
            stats[fw].webOnly++
            break
          case 'none':
            stats[fw].none++
            break
        }
      }
    }
  }

  return stats
}
