import type { ReactNode } from 'react'

// SINGLE SOURCE OF TRUTH for the tailwind visual-conformance harness.
//
// Each case is authored ONCE using real Tailwind utility classes and rendered three ways:
//   - real Tailwind (oracle): leaf = DOM 'div'/'span' + tailwind CDN JIT
//   - tamagui web:            leaf = tamagui View/Text, styleMode: 'tailwind'
//   - tamagui native:         leaf = tamagui View/Text on real iOS (same className)
//
// The harness screenshots each, crops to #cfm-root, and pixel-diffs tamagui-vs-tailwind.
// A passing case means tamagui's className → pixels matches real Tailwind's className → pixels.

export type Leaf = {
  // a box-like leaf: 'div' for real tailwind, tamagui View otherwise
  Box: any
  // a text leaf: 'span' for real tailwind, tamagui Text otherwise
  Text: any
}

export type ConformanceCase = {
  name: string
  // render the same UI via injected leaf components so one source emits all targets.
  // the case ROOT must carry id="cfm-root" (web) — the crop target.
  render: (leaf: Leaf) => ReactNode
  // per-case diff tolerances (override defaults)
  tol?: { threshold?: number; maxDiffPercent?: number }
  // legs to skip for this case (e.g. text on native, which never pixel-matches a browser)
  skip?: ('tailwind' | 'tamagui' | 'native')[]
}

export const cases: ConformanceCase[] = [
  {
    name: 'bg-size-rounded',
    render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 h-24 bg-indigo-500 rounded-lg" />
    ),
  },
  {
    name: 'padding-inner',
    render: ({ Box }) => (
      <Box id="cfm-root" className="w-40 bg-sky-400 p-4">
        <Box className="w-full h-8 bg-white" />
      </Box>
    ),
  },
  {
    name: 'flex-row-gap',
    render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row gap-2 p-3 bg-slate-100">
        <Box className="w-10 h-10 bg-red-500" />
        <Box className="w-10 h-10 bg-green-500" />
        <Box className="w-10 h-10 bg-blue-500" />
      </Box>
    ),
  },
]
