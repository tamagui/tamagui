// data for the /tailwind promo page.
//
// proof cases: each is ONE real Tailwind className rendered three ways by the conformance harness
// (code/comparisons/conformance) - real Tailwind v4, Tamagui web, Tamagui iOS - then pixel-diffed.
// the three PNGs (public/tailwind/proof/*) are the actual harness output, displayed at the same
// logical size so the match is visible directly. only cases that pass on BOTH web and native are
// shown here (all of these diff 0.0%). update via that harness; don't hand-edit the images.

export type ProofCase = {
  /** the literal Tailwind className authored in the case */
  className: string
  /** one-word category for the caption */
  kind: string
  /** public/ basename (e.g. 'size-fixed' → size-fixed.tailwind.png / .web.png / .native.png) */
  slug: string
  /** on-screen box size (px) shared by all three legs, at the case's logical aspect */
  w: number
  h: number
  /** measured pixel diff vs real Tailwind, web leg (%) */
  diff: number
  /** stage this one large as the section centerpiece */
  featured?: boolean
}

export const proofCases: ProofCase[] = [
  {
    slug: 'border-rounded',
    kind: 'border',
    className: 'w-20 h-20 bg-amber-100 border-4 border-rose-500 rounded-xl',
    w: 80,
    h: 80,
    diff: 0,
    featured: true,
  },
  {
    slug: 'gap-row',
    kind: 'flex + gap',
    className: 'flex flex-row gap-2 p-3 bg-slate-100',
    w: 192,
    h: 64,
    diff: 0,
  },
  {
    slug: 'items-justify-center',
    kind: 'alignment',
    className: 'flex items-center justify-center',
    w: 160,
    h: 80,
    diff: 0,
  },
  {
    slug: 'flex-col-3',
    kind: 'flex column',
    className: 'flex flex-col gap-2 p-2 bg-slate-200',
    w: 80,
    h: 78,
    diff: 0,
  },
  {
    slug: 'rounded-full',
    kind: 'radius',
    className: 'w-20 h-20 bg-indigo-500 rounded-full',
    w: 80,
    h: 80,
    diff: 0,
  },
  {
    slug: 'size-fixed',
    kind: 'sizing',
    className: 'w-24 h-24 bg-indigo-500',
    w: 80,
    h: 80,
    diff: 0,
  },
]

export const proofLegs = [
  { key: 'tailwind', label: 'Tailwind v4' },
  { key: 'web', label: 'Tamagui web' },
  { key: 'native', label: 'Tamagui iOS' },
] as const

// conformance pass rates from the harness (report/index.md, report-native/index.md).
export const conformance = {
  web: 94,
  native: 97,
  cases: 122,
  tolerance: 1, // per-pixel diff tolerance, web leg (%)
  // the cases that don't pass, named honestly (no vagueness)
  failing: [
    'margin-inner',
    'grow / shrink',
    'inset-x',
    'single-side borders',
    'text metrics',
  ],
}

// short, real className examples and their prop equivalents (same engine, gradual migration).
export const exampleGroups: { title: string; lines: string[] }[] = [
  {
    title: 'Layout',
    lines: [
      'flex flex-row items-center justify-between',
      'flex flex-col gap-3 p-4',
      'absolute inset-0',
    ],
  },
  {
    title: 'Spacing & sizing',
    lines: ['p-4 px-6 py-2', 'w-24 h-24 max-w-96', 'w-1/2  w-full'],
  },
  {
    title: 'Color & borders',
    lines: [
      'bg-indigo-500  bg-emerald-400',
      'border-2 border-rose-500',
      'rounded-lg rounded-full',
    ],
  },
]

// the same class, as a prop. shows the two are one system, migrate a line at a time.
export const classToProp: { cls: string; prop: string }[] = [
  { cls: 'className="p-4 rounded-xl"', prop: 'p="$4" rounded="$xl"' },
  { cls: 'className="bg-indigo-500"', prop: 'bg="$indigo-500"' },
  { cls: 'className="flex-row gap-3"', prop: 'flexDirection="row" gap="$3"' },
]

// honest cross-framework coverage, straight from code/comparisons/output/coverage.md.
export type Support = 'full' | 'partial' | 'web' | 'none'

export const coverageSummary: { name: string; pct: number; cross: boolean }[] = [
  { name: 'Tamagui', pct: 68.5, cross: true },
  { name: 'NativeWind', pct: 74.3, cross: true },
  { name: 'Tailwind', pct: 47.8, cross: false },
  { name: 'Uniwind', pct: 40.9, cross: true },
]

export type CoverageRow = {
  utility: string
  tamagui: Support
  tailwind: Support
  nativewind: Support
  uniwind: Support
}

export const coverageRows: CoverageRow[] = [
  {
    utility: 'display',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'partial',
    uniwind: 'partial',
  },
  {
    utility: 'position',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'partial',
    uniwind: 'partial',
  },
  {
    utility: 'flex-direction',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'gap',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'padding / margin',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'width / height',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'background-color',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'border-radius',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'logical props',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'partial',
    uniwind: 'none',
  },
  {
    utility: 'box-shadow',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'partial',
    uniwind: 'partial',
  },
]

// variants / states / responsive - the question a NativeWind user asks first.
// tamagui matches or beats on the common ones, loses on group/peer. shown honestly.
export const variantRows: CoverageRow[] = [
  {
    utility: 'hover',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'none',
  },
  {
    utility: 'focus / focus-visible',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'partial',
    uniwind: 'none',
  },
  {
    utility: 'focus-within',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'web',
    uniwind: 'none',
  },
  {
    utility: 'breakpoints (sm, md…)',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'dark mode',
    tamagui: 'full',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'full',
  },
  {
    utility: 'group hover / press',
    tamagui: 'none',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'none',
  },
  {
    utility: 'peer variants',
    tamagui: 'none',
    tailwind: 'web',
    nativewind: 'full',
    uniwind: 'none',
  },
]
