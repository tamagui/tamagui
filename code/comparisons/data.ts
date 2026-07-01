/**
 * CSS utility coverage comparison data
 *
 * each category has a list of utilities, and each utility tracks
 * which frameworks support it:
 *   - tamagui: flat-style prop syntax ($bg, $hover:bg, etc)
 *   - tailwind: tailwind CSS classes
 *   - nativewind: nativewind v5 (tailwind v4 for RN) support
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$dsp` is a named prop; `flex`/`none` work cross-platform, other values (block/grid/contents) web-only. RN natively only has flex + none, so NativeWind/Uniwind map flex/hidden and ignore the rest on native.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$pos` named prop; absolute/relative/static cross-platform, fixed/sticky web-only (RN has no fixed/sticky positioning). NativeWind/Uniwind map absolute/relative on native and drop fixed/sticky.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$ov` named prop, cross-platform (visible/hidden/scroll). RN ignores overflow:scroll on Android for clipping. Uniwind: only overflow-hidden documented.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$aspectRatio` cross-platform. Uniwind docs note aspect-ratio has "limited support".',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$bxs` named prop, maps to RN 0.77+ boxSizing (New Architecture) so border-box/content-box both work cross-platform. RN defaults to and only supports border-box, so NativeWind/Uniwind box-border is a no-op and box-content is unsupported on native.',
      },
      {
        name: 'isolation',
        description: 'Stacking context isolation',
        examples: {
          tamagui: '$isolation="isolate"',
          tailwind: 'isolate / isolation-auto',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$isolation` maps to RN 0.77+ isolation (New Architecture) for native stacking contexts; NativeWind `isolate` is web-only.',
      },
      {
        name: 'visibility',
        description: 'Element visibility',
        examples: {
          tamagui: 'visibility="hidden"',
          tailwind: 'visible / invisible / collapse',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `visibility="hidden"` is cross-platform - native CSS visibility on web, expands to `opacity:0 + pointerEvents:none` on native. `visibility="collapse"` stays web-only (no RN equivalent). NativeWind `invisible` maps to opacity:0 on native (collapse is web-only).',
      },
      {
        name: 'float',
        description: 'Float positioning',
        examples: {
          tailwind: 'float-left / float-right',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes: 'Not applicable to RN flexbox model',
      },
      {
        name: 'clear',
        description: 'Clear floats',
        examples: {
          tailwind: 'clear-left / clear-both',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'columns',
        description: 'Multi-column layout',
        examples: {
          tamagui: '$columnCount={3}',
          tailwind: 'columns-3',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$columnCount` is a typed prop but CSS multi-column only renders on web; RN has no multi-column layout. Uniwind explicitly lists `columns-*` as unsupported.',
      },
      {
        name: 'object-fit',
        description: 'Replaced element sizing',
        examples: {
          tamagui: '$objectFit="cover"',
          tailwind: 'object-cover / object-contain',
          nativewind: 'object-cover / object-contain',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `objectFit` is auto-mapped on native — Tamagui core expands `objectFit` to RN `resizeMode`, and the Image component also writes `style.objectFit` (RN 0.76+ reads it natively). Works with the default Image and expo-image (via `contentFit`).',
      },
      {
        name: 'object-position',
        description: 'Replaced element position',
        examples: {
          tamagui: '$objectPosition="center"',
          tailwind: 'object-center / object-top',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `objectPosition` is forwarded into the Image `style` on native and to `contentPosition` when using expo-image (full support there). Default RN Image currently ignores it — limited to keyword values like center/top/bottom/left/right via expo-image.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `$f` plus separate `$fg`/`$fs`/`$fb` give full control cross-platform. On native, RN flex is a single number, so the CSS `flex: grow shrink basis` shorthand (e.g. flex-auto/flex-initial) does not map cleanly; NativeWind/Uniwind support flex-1 but the multi-value shorthands are web-leaning.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'gap',
        description: 'Gap between flex/grid items',
        examples: {
          tamagui: '$gap={10} $columnGap={8} $rowGap={8}',
          tailwind: 'gap-4 / gap-x-4 / gap-y-4',
          nativewind: 'gap-4 / gap-x-4 / gap-y-4',
          uniwind: 'gap-4',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes:
          'Tamagui: `$gap`/`$columnGap`/`$rowGap` are named props, cross-platform via RN 0.71+ flexbox gap. All four support it natively now (RN 0.71+ added row/column gap to flexbox); pre-0.71 needed a margin workaround.',
      },
      {
        name: 'order',
        description: 'Flex item order',
        examples: {
          tamagui: '$order={1}',
          tailwind: 'order-1 / order-first / order-last',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$order` is a typed prop but flex `order` only affects web layout; RN flexbox ignores order (paint order = child order). Web-only for everyone.',
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
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'CSS grid only exists on web; RN has no grid layout engine. Tamagui exposes `$gridTemplate*` as typed props but they no-op on native. All RN approaches require manual flex layout or a list component instead.',
      },
      {
        name: 'grid-column',
        description: 'Column span/placement',
        examples: {
          tamagui: '$gridColumn="span 2"',
          tailwind: 'col-span-2 / col-start-1',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'grid-row',
        description: 'Row span/placement',
        examples: {
          tamagui: '$gridRow="span 2"',
          tailwind: 'row-span-2 / row-start-1',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'grid-template-areas',
        description: 'Named grid areas',
        examples: {
          tamagui: '$gridTemplateAreas="..."',
          tailwind: 'grid-areas-[...]',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'grid-auto-flow',
        description: 'Auto-placement algorithm',
        examples: {
          tamagui: '$gridAutoFlow="row"',
          tailwind: 'grid-flow-row / grid-flow-col',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$gridAutoFlow` is a typed prop but renders web-only (RN has no grid).',
      },
      {
        name: 'place-content/items/self',
        description: 'Combined alignment shorthands',
        examples: {
          tailwind: 'place-content-center / place-items-center',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'padding-block/inline (logical)',
        description: 'Logical spacing (writing-mode aware)',
        examples: {
          tamagui: '$paddingBlock={10} $paddingInline={10}',
          tailwind: 'ps-4 pe-4 / pb-4 pt-4',
          nativewind: 'ps-4 pe-4',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes: 'NativeWind v5 maps ps/pe to RN paddingStart/End (RTL aware)',
      },
      {
        name: 'margin-block/inline (logical)',
        description: 'Logical margin (writing-mode aware)',
        examples: {
          tamagui: '$marginBlock={10} $marginInline={10}',
          tailwind: 'ms-4 me-4',
          nativewind: 'ms-4 me-4',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes: 'NativeWind v5 maps ms/me to RN marginStart/End (RTL aware)',
      },
      {
        name: 'space-between',
        description: 'Space between child elements',
        examples: {
          tailwind: 'space-x-4 / space-y-4',
          uniwind: 'space-x-4 / space-y-4',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'full',
        },
        notes:
          'Tamagui has no `space-*` className; the idiomatic equivalent is `$gap` (cross-platform). NativeWind v5 marks space-x/space-y as web-only (it injects a `> * + *` sibling selector that has no native equivalent) and recommends gap on native. Uniwind lists space-x/y as supported.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'size (width + height)',
        description: 'Combined width and height shorthand',
        examples: {
          tamagui: '$w={16} $h={16}',
          tailwind: 'size-4 / size-full',
          nativewind: 'size-4 / size-full',
          uniwind: 'size-4',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'The `size-*` shorthand (sets width+height together) shipped in Tailwind v3.4. Tamagui has no single shorthand: use `$w`/`$h` (both cross-platform, so the capability exists, just two props). NativeWind v5 docs only enumerate `w-*`/`h-*` as Full on native; `size-*` native support is undocumented/unconfirmed.',
      },
      {
        name: 'inline-size / block-size',
        description: 'Logical sizing (writing-mode aware)',
        examples: {
          tamagui: '$inlineSize={100} $blockSize={100}',
          tailwind: 'w-* / h-* (logical via writing-mode)',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'none',
          uniwind: 'none',
        },
        notes:
          'Tamagui types `$inlineSize`/`$blockSize` as size-token props but they only resolve on web (RN has no inlineSize/blockSize style props; use `$w`/`$h`). On native, writing-mode is effectively LTR/TTB so logical == physical anyway.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'line-clamp',
        description: 'Truncate text to N lines',
        examples: {
          tamagui: '$lineClamp={3}',
          tailwind: 'line-clamp-3',
          nativewind: 'line-clamp-3',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
      },
      {
        name: 'white-space',
        description: 'Whitespace handling',
        examples: {
          tamagui: '$whiteSpace="nowrap"',
          tailwind: 'whitespace-nowrap / whitespace-pre',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$whiteSpace` is a web-only text prop (tree-shaken on native). On native, text wrapping is controlled by `numberOfLines` and container width, not white-space.',
      },
      {
        name: 'word-break',
        description: 'Word breaking behavior',
        examples: {
          tamagui: '$wordWrap="break-word"',
          tailwind: 'break-words / break-all',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$wordWrap` (`ww` shorthand) is web-only. RN has no word-break control; it breaks at whitespace or character based on platform text engine.',
      },
      {
        name: 'text-overflow',
        description: 'Text overflow behavior',
        examples: {
          tamagui: '$textOverflow="ellipsis"',
          tailwind: 'truncate / text-ellipsis / text-clip',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$textOverflow="ellipsis"` works cross-platform on Text - web uses CSS text-overflow, native maps to numberOfLines={1} + ellipsizeMode="tail". Other values (clip) are web-only.',
      },
      {
        name: 'text-indent',
        description: 'First line indentation',
        examples: {
          tailwind: 'indent-4 / indent-8',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'vertical-align',
        description: 'Vertical alignment of inline elements',
        examples: {
          tamagui: '$verticalAlign="middle"',
          tailwind: 'align-middle / align-top',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$verticalAlign` maps to RN 0.71+ verticalAlign on Text (auto/top/bottom/middle), so it works cross-platform. NativeWind `align-*` is largely a web inline-element concept; RN only honors a subset on Text.',
      },
      {
        name: 'font-variant-numeric',
        description: 'Numeric font features',
        examples: {
          tamagui: '$fontVariant={["tabular-nums"]}',
          tailwind: 'tabular-nums / oldstyle-nums',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$fontVariant` maps to RN fontVariant array; RN supports a subset (tabular-nums, oldstyle-nums, lining-nums, etc.) cross-platform but not the full CSS font-variant-numeric grammar. NativeWind maps the common numeric variants to RN fontVariant, same subset limitation.',
      },
      {
        name: 'text-shadow',
        description: 'Text shadow',
        examples: {
          tamagui: '$textShadow="0px 1px 2px rgba(0,0,0,0.3)"',
          tailwind: 'text-shadow-sm / text-shadow-lg',
          nativewind: 'text-shadow-sm / text-shadow-lg',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tailwind text-shadow utilities are new in v4.1; NativeWind v5 maps to RN textShadow* (single shadow only). Tamagui `$textShadow` + offset/radius/color are cross-platform via RN textShadow* props.',
      },
      {
        name: 'text-wrap (balance / pretty)',
        description: 'Better line-break distribution for headings/paragraphs',
        examples: {
          tamagui: '$textWrap="balance"',
          tailwind: 'text-balance / text-pretty',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tailwind `text-balance` (text-wrap: balance) and `text-pretty` shipped in v3.4. Tamagui `$textWrap` is a web-only prop. RN text layout has no balance/pretty algorithm, so all are web-only (NativeWind passes them through on web only).',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'background-image',
        description: 'Background images and gradients',
        examples: {
          tamagui: '$backgroundImage="linear-gradient(...)"',
          tailwind: 'bg-linear-to-r from-blue-500 to-purple-500',
          nativewind: 'bg-linear-to-r',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$backgroundImage` maps to RN 0.76+ experimental_backgroundImage, so CSS gradients (linear/radial) render on native; raster url() background images stay web-only (use the Image component on native). NativeWind v5 similarly maps gradient utilities to RN 0.76+ backgroundImage; url() backgrounds remain web-only.',
      },
      {
        name: 'background-position',
        description: 'Background image position',
        examples: {
          tailwind: 'bg-center / bg-top / bg-bottom',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'background-size',
        description: 'Background image sizing',
        examples: {
          tailwind: 'bg-cover / bg-contain / bg-auto',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'background-repeat',
        description: 'Background tiling',
        examples: {
          tailwind: 'bg-repeat / bg-no-repeat',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'background-clip',
        description: 'Background painting area',
        examples: {
          tailwind: 'bg-clip-border / bg-clip-text',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'border-width (logical)',
        description: 'Logical border widths (block/inline)',
        examples: {
          tamagui: '$borderBlockWidth={1} $borderInlineWidth={2}',
          tailwind: 'border-s / border-e',
          nativewind: 'border-s / border-e',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'NativeWind v5 maps border-s/border-e to RN borderStartWidth/borderEndWidth',
      },
      {
        name: 'outline',
        description: 'Outline styling',
        examples: {
          tamagui: '$outlineWidth={2} $outlineColor="blue"',
          tailwind: 'outline / outline-2 / outline-blue-500',
          nativewind: 'outline / outline-2',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$outline*` named props map to RN 0.77+ outline / outlineColor / outlineWidth / outlineOffset (New Architecture), so outlines render cross-platform. NativeWind v5 maps outline-* to the same RN props.',
      },
      {
        name: 'ring',
        description: 'Box-shadow based ring',
        examples: {
          tamagui: '$bxsh="0 0 0 2px blue" (ring via box-shadow)',
          tailwind: 'ring / ring-2 / ring-blue-500',
          nativewind: 'ring / ring-2',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui has no `ring` shorthand but the same effect is a one-liner via `$bxsh` (box-shadow), which works cross-platform on RN 0.76+. NativeWind ring is box-shadow-based, so on native it inherits the RN boxShadow limitations (no inset). Uniwind: ring not documented.',
      },
      {
        name: 'divide',
        description: 'Borders between children',
        examples: {
          tailwind: 'divide-x / divide-y / divide-gray-200',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'divide-* injects a `> * + *` sibling border. NativeWind v5 lists divide-width as web-only (no native sibling selector). Tamagui has no divide equivalent; idiomatic approach is a `<Separator>` component between children.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'NativeWind v5 maps shadow-* to RN 0.76+ boxShadow; still differs from CSS spread/inset',
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
          tailwind: 'web-only',
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
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$cur` (cursor) is accepted as a prop on native without error but only renders on web/web-of-RN; touch platforms have no cursor. Effectively web-only for everyone.',
      },
      {
        name: 'pointer-events',
        description: 'Pointer event behavior',
        examples: {
          tamagui: '$pe="none"',
          tailwind: 'pointer-events-none / pointer-events-auto',
          nativewind: 'pointer-events-none / pointer-events-auto',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$pe` maps to the core RN View pointerEvents prop (cross-platform). NativeWind maps pointer-events-* to the same RN prop. Uniwind: not documented.',
      },
      {
        name: 'user-select',
        description: 'Text selection behavior',
        examples: {
          tamagui: '$ussel="none"',
          tailwind: 'select-none / select-text / select-all',
          nativewind: 'select-none / select-text',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$ussel` (userSelect) maps to RN 0.71+ userSelect on Text/View, so none/text/auto work cross-platform. NativeWind select-* maps to the same RN prop; select-all is web-only.',
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
          nativewind: 'blur-sm / brightness-150',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$filter` maps to RN 0.76+ filter, so blur/brightness/contrast/etc. render on native — but some filters (e.g. drop-shadow) are Android 12+ only and behavior differs from CSS. NativeWind v5 maps filter utilities to the same RN 0.76+ prop with the same platform caveats.',
      },
      {
        name: 'backdrop-filter',
        description: 'Backdrop filter effects',
        examples: {
          tamagui: '$backdropFilter="blur(8px)"',
          tailwind: 'backdrop-blur-sm / backdrop-brightness-150',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$backdropFilter` is web-only. RN has no backdrop-filter; native blur-behind effects need a dedicated component (e.g. expo-blur / @react-native-community/blur).',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'transform-origin',
        description: 'Transform origin point',
        examples: {
          tamagui: '$transformOrigin="center"',
          tailwind: 'origin-center / origin-top-left',
          nativewind: 'origin-center',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
      },
      {
        name: 'perspective',
        description: '3D perspective depth',
        examples: {
          tamagui: '$perspective={500}',
          tailwind: 'perspective-500',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
      },
      {
        name: 'backface-visibility',
        description: 'Backface visibility in 3D',
        examples: {
          tamagui: '$backfaceVisibility="hidden"',
          tailwind: 'backface-hidden / backface-visible',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
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
          nativewind: 'animate-spin / animate-bounce',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: `animation="..."` plus enter/exit styles, cross-platform via pluggable drivers (CSS on web; Reanimated/Moti/RN-Animated on native). NativeWind v5 `animate-*` is marked experimental on native (it now delegates to Reanimated CSS animations, RN 0.81+ / New Arch only). Uniwind animations are Pro-tier (paid) and Reanimated-backed.',
      },
      {
        name: 'transition-property',
        description: 'Which properties to transition',
        examples: {
          tamagui: 'animation="quick" (driver animates prop changes)',
          tailwind: 'transition / transition-colors / transition-all',
          nativewind: 'transition / transition-colors / transition-all',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui has no `transition-*` class; instead any prop change on a component with an `animation` driver animates automatically (cross-platform). NativeWind v5 transition-* is experimental on native (Reanimated-backed, RN 0.81+ / New Arch). Uniwind transitions are Pro-tier.',
      },
      {
        name: 'transition-duration',
        description: 'Transition timing',
        examples: {
          tamagui: 'animation={[{ duration: 300 }]} (per-driver config)',
          tailwind: 'duration-150 / duration-300 / duration-500',
          nativewind: 'duration-150 / duration-300',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui sets duration through the animation driver config (e.g. spring/timing presets) rather than a `duration-*` class. NativeWind v5 duration-* is part of its experimental native transition support.',
      },
      {
        name: 'transition-timing-function',
        description: 'Easing function',
        examples: {
          tamagui: 'animation config (easing per driver)',
          tailwind: 'ease-in / ease-out / ease-in-out',
          nativewind: 'ease-in / ease-out / ease-in-out',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'partial',
        },
        notes:
          'Tamagui configures easing per-animation driver (e.g. cubic-bezier on CSS, spring on Reanimated) rather than an `ease-*` class. NativeWind v5 ease-* is part of its experimental native transition support.',
      },
      {
        name: 'enter/exit styles',
        description: 'Mount/unmount animation styles',
        examples: {
          tamagui: '$enter:o={0} $exit:o={0}',
        },
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'none',
          uniwind: 'none',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui `hoverStyle` / `$hover:` fires wherever a pointer exists (web + RN desktop/trackpad via onHoverIn); inert on touch like everywhere. NativeWind hover behaves the same. Uniwind explicitly lists `hover:` as unsupported (no RN equivalent in its model).',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'focus-visible',
        description: 'Keyboard focus state',
        examples: {
          tamagui: '$focusVisible:outlineColor="blue"',
          tailwind: 'focus-visible:outline-blue-500',
          nativewind: 'focus-visible:outline-blue-500',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `focusVisibleStyle` / `$focusVisible:` is registered only on web (it depends on the `:focus-visible` pseudo). NativeWind focus-visible is likewise web-only. No framework has a native equivalent (RN has no keyboard-vs-pointer focus distinction).',
      },
      {
        name: 'focus-within',
        description: 'Focus within container',
        examples: {
          tamagui: '$focusWithin:bg="blue"',
          tailwind: 'focus-within:bg-blue-500',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui exposes `focusWithinStyle` but it relies on the `:focus-within` pseudo, so it only takes effect on web; RN has no focus-within. Use a named `group` + focus state for a native equivalent.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'group hover/press/focus',
        description: 'Styling a child based on a named parent state',
        examples: {
          tamagui: 'group on parent + $group-name-hover:bg="..." on child',
          tailwind: 'group-hover:text-white',
          nativewind: 'group-hover:text-white',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: mark the parent `group` (or `group="card"`) and style children with `$group-hover:`, `$group-card-hover:`, `$group-press:`, `$group-focus:` — implemented via a JS state emitter so it works cross-platform (web + native). NativeWind v5 group-* tracks parent state on native. Uniwind: group-active/focus is Pro-tier (free no-ops); group-hover never (no native hover).',
      },
      {
        name: 'peer variants',
        description: 'Styling based on a sibling element state',
        examples: {
          tailwind: 'peer-focus:text-blue-500',
          nativewind: 'peer-focus:text-blue-500 (web only)',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'peer-* needs a CSS sibling selector. NativeWind v5 supports peer-* on web only — there is no native sibling-tracking model. Tamagui has no peer concept; the closest pattern is lifting shared state to a parent `group` or to React state. Uniwind: not supported.',
      },
      {
        name: 'has variant',
        description: 'Style based on descendant matching (:has())',
        examples: {
          tailwind: 'has-[:checked]:bg-blue-500',
          nativewind: 'has-[:checked]:bg-blue-500',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'has-* (`:has()` parent-selector) shipped in Tailwind v3.4. NativeWind v5 supports has-* on web only (no native `:has()`); Tamagui and Uniwind have no equivalent — track the condition in JS/state instead.',
      },
      {
        name: 'not variant',
        description: 'Negate a variant / pseudo-class (:not())',
        examples: {
          tailwind: 'not-hover:opacity-75 not-first:mt-2',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'The `not-*` variant is new in Tailwind v4.0 and relies on the CSS `:not()` selector — web only. NativeWind has no native `:not()` model; Tamagui/Uniwind have no equivalent (invert the condition in JS).',
      },
      {
        name: 'nth variant',
        description: 'Index-based selection (:nth-child)',
        examples: {
          tailwind: 'nth-3:bg-gray-100 nth-[3n+1]:font-bold',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'The `nth-*` variant is new in Tailwind v4.0 (CSS `:nth-child()`) — web only. RN has no structural pseudo-classes, so NativeWind is web-only here and Tamagui/Uniwind have no equivalent; compute from the list index in JS.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes: 'NativeWind v5 dark: uses native @media (prefers-color-scheme: dark)',
      },
      {
        name: 'combined media + pseudo',
        description: 'Media query + interactive state',
        examples: {
          tamagui: '$sm:hover:bg="blue"',
          tailwind: 'sm:hover:bg-blue-500',
          nativewind: 'sm:hover:bg-blue-500',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
      },
      {
        name: 'container queries',
        description: 'Style a child based on the size/state of a named parent container',
        examples: {
          tamagui: 'group="card" on parent + $group-card-sm:fd="row" on child',
          tailwind: '@container / @lg:grid-cols-3',
          nativewind: '@container / @lg:flex-row',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui: container queries are the `group` system combined with media keys — mark a parent `group="card"` and use `$group-card-$sm:` style keys. On web this uses real CSS container queries (containerType); on native it measures the parent and applies styles via the group emitter, so it works cross-platform (the `untilMeasured` prop exists to avoid flashes before first measure). NativeWind v5 also supports `@container` on native, implemented via onLayout measurement (size-based only, not CSS containment). Tailwind is web-only; Uniwind: not documented.',
      },
      {
        name: 'container query units (cqw/cqh)',
        description: 'Sizing relative to the query container (cqw, cqh, cqi, cqb)',
        examples: {
          tailwind: 'w-[50cqw] / text-[5cqi]',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'none',
          uniwind: 'none',
        },
        notes:
          'cqw/cqh/cqi/cqb are CSS length units tied to a real CSS containment context (Tailwind v4 via arbitrary values). Tamagui and NativeWind implement container *queries* differently (JS measurement / group emitter) and do not expose container-relative length units; use a measured value or a breakpoint instead.',
      },
      {
        name: 'prefers-reduced-motion',
        description: 'Reduced motion preference',
        examples: {
          tamagui:
            '$motionReduce={{ animation: null }} / $motionSafe={{ animation: "bouncy" }}',
          tailwind: 'motion-reduce:animate-none / motion-safe:...',
          nativewind: 'motion-reduce:animate-none',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          '`$motionReduce` and `$motionSafe` are built-in media keys in @tamagui/config. Web subscribes to `(prefers-reduced-motion: reduce | no-preference)` via `window.matchMedia`; native subscribes to `AccessibilityInfo.isReduceMotionEnabled` + the `reduceMotionChanged` event through `@tamagui/react-native-media-driver`. NativeWind v5 maps the same two states.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'full',
          uniwind: 'none',
        },
      },
      {
        name: 'ios-specific styles',
        description: 'iOS-only styling',
        examples: {
          tamagui: '$ios:p={20}',
          nativewind: 'ios:p-5',
          uniwind: 'ios:p-5',
        },
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'android-specific styles',
        description: 'Android-only styling',
        examples: {
          tamagui: '$android:p={20}',
          nativewind: 'android:p-5',
          uniwind: 'android:p-5',
        },
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'full',
          uniwind: 'full',
        },
      },
      {
        name: 'safe area insets',
        description: 'Safe area padding',
        examples: {
          tamagui: 'pt="safe" / padding="safe" / inset="safe"',
          nativewind: 'pt-safe / p-safe',
          uniwind: 'pt-safe / inset-safe / pt-safe-or-4',
        },
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes:
          'Tamagui accepts `"safe"` as a first-class value on any inset/padding/margin prop (pt/pb/px/py/inset/top/...). On web it emits `env(safe-area-inset-*)`; on native it reads insets from `@tamagui/native/setup-safe-area`. NativeWind and Uniwind ship the same as utilities; Uniwind also has `-safe-or-*` / `-safe-offset-*` variants for fallbacks.',
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
          nativewind: 'before:content-[""] (web only)',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Generated content has no RN equivalent (no pseudo-element box). NativeWind v5 only ships `content-none` and it is web-only. Tamagui has no before/after; render an extra element instead. Uniwind lists before:/after: as unsupported.',
      },
      {
        name: '::placeholder',
        description: 'Input placeholder styling',
        examples: {
          tamagui: 'placeholderTextColor prop on Input',
          tailwind: 'placeholder:text-gray-400',
          nativewind: 'placeholder:text-gray-400',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui Input/TextArea expose `placeholderTextColor` (the one RN-supported placeholder style) cross-platform, but not arbitrary placeholder typography. NativeWind v5 rewrites `placeholder:` to the RN placeholderTextColor prop. Uniwind lists placeholder: as unsupported.',
      },
      {
        name: '::selection',
        description: 'Text selection styling',
        examples: {
          tailwind: 'selection:bg-blue-200',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'first / last / odd / even child',
        description: 'Positional child selectors',
        examples: {
          tailwind: 'first:pt-0 last:pb-0 odd:bg-gray-50',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Index-based child selectors need a CSS structural pseudo (:first-child / :nth-child). NativeWind v5 removed native support ("future version") — web-only. Tamagui has none; pass the index in JS (`index === 0 && {...}`). Uniwind: not supported.',
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
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'border-spacing',
        description: 'Table border spacing',
        examples: {
          tailwind: 'border-spacing-2',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'table-layout',
        description: 'Table layout algorithm',
        examples: {
          tailwind: 'table-auto / table-fixed',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
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
          tamagui: 'fill="$color10" / fill="red"',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          '@tamagui/lucide-icons accepts `fill` as a style prop on both web and native, resolving theme tokens (e.g. `fill="$color10"`) via the icon `themed()` wrapper. Plain colors (e.g. `fill="red"`) pass through unchanged.',
      },
      {
        name: 'stroke',
        description: 'SVG stroke color',
        examples: {
          tailwind: 'stroke-red-500 / stroke-current',
          nativewind: 'stroke-red-500',
          tamagui: 'stroke="$accent10" / stroke="red"',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          '@tamagui/lucide-icons accepts `stroke` as a style prop on both web and native with theme-token resolution; when provided it also feeds the icon paths so the visible stroke color updates (not just the root <Svg>).',
      },
      {
        name: 'stroke-width',
        description: 'SVG stroke width',
        examples: {
          tailwind: 'stroke-1 / stroke-2',
          nativewind: 'stroke-1',
          tamagui: 'strokeWidth={2} / strokeWidth="$1"',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'none',
        },
        notes:
          'Tamagui icons accept numeric `strokeWidth` directly and resolve size tokens (e.g. `strokeWidth="$1"`) on both web and native.',
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
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'scroll-snap',
        description: 'Scroll snapping',
        examples: {
          tailwind: 'snap-x / snap-mandatory / snap-start',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'touch-action',
        description: 'Touch interaction behavior',
        examples: {
          tamagui: '$touchAction="none"',
          tailwind: 'touch-none / touch-pan-x',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$touchAction` is a web-only prop. On native, gesture handling is done with the gesture system (PanResponder / react-native-gesture-handler), not a style.',
      },
      {
        name: 'resize',
        description: 'Element resizability',
        examples: {
          tailwind: 'resize / resize-x / resize-y / resize-none',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'appearance',
        description: 'Native form control appearance reset',
        examples: {
          tailwind: 'appearance-none / appearance-auto',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'appearance-none resets browser-native control chrome — a web-only concept. RN controls are already custom-rendered, so there is nothing to reset. Tamagui: none.',
      },
      {
        name: 'field-sizing',
        description: 'Auto-resize form fields to their content',
        examples: {
          tailwind: 'field-sizing-content / field-sizing-fixed',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'none',
          uniwind: 'none',
        },
        notes:
          'field-sizing-content/fixed is new in Tailwind v4.0 and maps to the CSS `field-sizing` property (web only). RN auto-grows a TextInput via the `multiline` + onContentSizeChange pattern instead. Tamagui/NativeWind/Uniwind have no field-sizing utility.',
      },
      {
        name: 'scroll-timeline / scroll-driven animation',
        description: 'Animations driven by scroll position',
        examples: {
          tailwind: '[animation-timeline:scroll()] (arbitrary)',
        },
        support: {
          tamagui: 'none',
          tailwind: 'none',
          nativewind: 'none',
          uniwind: 'none',
        },
        notes:
          'Tailwind v4 has no built-in scroll-timeline utility (only arbitrary `[animation-timeline:...]` or a community plugin). On native, scroll-driven effects use Animated.event / Reanimated useAnimatedScrollHandler. No framework here ships a first-class scroll-timeline utility.',
      },
      {
        name: 'caret-color',
        description: 'Text input caret color',
        examples: {
          tamagui: '$caretColor="blue"',
          tailwind: 'caret-blue-500',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui: on web, `$caretColor` is the CSS caret-color property. On native, `@tamagui/input` Input forwards `caretColor` to RN TextInput `cursorColor` (Android) + `selectionColor` (iOS+Android caret) — explicit `cursorColor`/`selectionColor` props still win. Cross-platform but only applies to the Input/TextArea components (not a generic style prop).',
      },
      {
        name: 'accent-color',
        description: 'Form control accent color',
        examples: {
          tailwind: 'accent-blue-500',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
      },
      {
        name: 'will-change',
        description: 'GPU rendering hints',
        examples: {
          tamagui: '$willChange="transform"',
          tailwind: 'will-change-transform / will-change-scroll',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Tamagui: `$willChange` is a web-only GPU hint. RN has no will-change; native rasterization hints are platform-specific (e.g. shouldRasterizeIOS / renderToHardwareTextureAndroid).',
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
        description: 'Visually hide an element but keep it for screen readers',
        examples: {
          tailwind: 'sr-only / not-sr-only',
          nativewind: 'sr-only',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'partial',
          uniwind: 'none',
        },
        notes:
          'Tamagui ships `<VisuallyHidden>` (from `@tamagui/visually-hidden`) as a primitive that emits the standard sr-only style block on web (1x1, absolute, clip-path, no display:none) AND wires the matching a11y semantics on both platforms: `aria-hidden=false` on web, `accessible={true}` on native, plus `importantForAccessibility="yes"` on Android so ancestors with hide-descendants don\'t silence it. `visible` prop flips it back to fully visible (the `not-sr-only` escape hatch). NativeWind v5 `sr-only` only emits the visual-hide style on native — it does NOT wire accessibilityElementsHidden / importantForAccessibility / aria-hidden, so SR semantics differ from web. `not-sr-only` is web-only. Marked partial (not full) because it\'s a primitive component, not a class utility.',
      },
      {
        name: 'forced-colors / forced-color-adjust',
        description: 'Windows high-contrast / forced-colors mode',
        examples: {
          tailwind: 'forced-colors:... / forced-color-adjust-auto',
        },
        support: {
          tamagui: 'none',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'none',
        },
        notes:
          'Forced-colors is a web/OS high-contrast feature. Tailwind v4 ships the `forced-colors:` variant + `forced-color-adjust-*` (both since v3.4); NativeWind exposes them web-only. RN has its own high-contrast handling, so no native style mapping. Tamagui: none.',
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
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
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes: 'Tamagui has nested theme support with sub-themes',
      },
      {
        name: 'color-scheme',
        description: 'Declare light/dark for native form controls & scrollbars',
        examples: {
          tamagui: '<Theme name="dark"> sets the scheme on web',
          tailwind: 'scheme-light / scheme-dark / scheme-light-dark',
        },
        support: {
          tamagui: 'web-only',
          tailwind: 'web-only',
          nativewind: 'web-only',
          uniwind: 'partial',
        },
        notes:
          'The CSS `color-scheme` property (Tailwind v4 `scheme-*` utilities, new in v4.0) tells the browser to theme built-in UI (form controls, scrollbars). Tamagui sets color-scheme on web automatically when you switch to a dark `<Theme>`; on native there is no equivalent property (RN controls follow the app theme directly). Uniwind exposes light/dark theming but `scheme-*` breadth is undocumented.',
      },
      {
        name: 'sub-themes / component themes',
        description: 'Scoped component-level theming',
        examples: {
          tamagui: '<Theme name="blue_Button">',
        },
        support: {
          tamagui: 'full',
          tailwind: 'none',
          nativewind: 'none',
          uniwind: 'partial',
        },
        notes: 'Tamagui unique: deeply nested component-aware themes',
      },
      {
        name: 'arbitrary values',
        description: 'One-off custom values',
        examples: {
          tamagui: '$bg="rgb(123,45,67)" $w="calc(100% - 2rem)"',
          tailwind: 'bg-[rgb(123,45,67)]',
          nativewind: 'bg-[rgb(123,45,67)] / w-[calc(100%-2rem)]',
          uniwind: 'bg-[rgb(123,45,67)]',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes:
          'Tamagui takes any raw value directly as a prop ($bg="rgb(...)") — no bracket escape hatch needed. NativeWind v5 improved arbitrary calc()/clamp() handling. Uniwind bundles the real Tailwind v4 oxide compiler, so bracket arbitrary values parse; calc() resolves on web, limited on native.',
      },
      {
        name: 'CSS variables / custom properties',
        description: 'CSS custom properties and var() references',
        examples: {
          tamagui: '$bg="$color" (tokens) / $bg="var(--my-color)" (web)',
          tailwind: '@theme { --color-brand } / bg-(--my-var)',
          nativewind: '@theme { --color-brand } / bg-(--my-var)',
        },
        support: {
          tamagui: 'partial',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'partial',
        },
        notes:
          'Tamagui: the design-token system ($color, $4, theme values) IS the cross-platform var() equivalent — on web tokens compile to real CSS custom properties (`var(--...)`), on native they resolve to JS values. Raw `var(--x)` string literals only work on web. NativeWind v5 implements Tailwind v4 `@theme` + `var()` resolution on web AND native (its runtime resolves custom properties). Uniwind theming exists but var()/@theme breadth is less documented.',
      },
      {
        name: 'color opacity modifier',
        description: 'Inline color alpha via /N syntax',
        examples: {
          tamagui: '$bg="$blue10/50" (props) / className="bg-blue-500/50" (tw mode)',
          tailwind: 'bg-blue-500/50 text-black/75',
          nativewind: 'bg-blue-500/50 text-black/75',
          uniwind: 'bg-black/50',
        },
        support: {
          tamagui: 'full',
          tailwind: 'web-only',
          nativewind: 'full',
          uniwind: 'full',
        },
        notes:
          'Tamagui supports inline `/N` cross-platform on any color prop (`$bg="$blue10/50"`) and in tw-mode classNames (`bg-blue-500/50`); the runtime applies it via color-mix() on web and rgba() multiply on native, matching NativeWind v5 behavior. NativeWind v5 fully supports `/N` cross-platform (Tailwind v4 compiles it to color-mix(); v5 ships a runtime color-mix resolver). Uniwind supports `/N` in its examples.',
      },
    ],
  },
]

// helper to compute coverage stats
export function computeCoverage() {
  const frameworks = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
  const stats = Object.fromEntries(
    frameworks.map((fw) => [fw, { full: 0, partial: 0, webOnly: 0, none: 0, total: 0 }])
  ) as Record<
    (typeof frameworks)[number],
    { full: number; partial: number; webOnly: number; none: number; total: number }
  >

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
