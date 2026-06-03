import type { ReactNode } from 'react'

// SINGLE SOURCE OF TRUTH for the tailwind visual-conformance harness.
//
// Each case is authored ONCE using real Tailwind utility classes and rendered three ways:
//   - real Tailwind (oracle): leaf = DOM 'div'/'span' + tailwind CDN/local JIT
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
  // legs to skip (e.g. text on native, which never pixel-matches a browser)
  skip?: ('tailwind' | 'tamagui' | 'native')[]
}

// helper: a box with a fixed size so colour/border/radius cases have something to crop
const box = (cls: string) => ({ Box }: Leaf) => <Box id="cfm-root" className={cls} />

export const cases: ConformanceCase[] = [
  // ── sizing ────────────────────────────────────────────────────────────────
  { name: 'size-fixed', render: box('w-24 h-24 bg-indigo-500') },
  { name: 'size-wide', render: box('w-40 h-8 bg-red-500') },
  { name: 'size-tall', render: box('w-8 h-40 bg-green-500') },
  { name: 'size-min-h', render: box('w-16 min-h-24 bg-blue-500') },
  { name: 'size-max-w', render: box('w-96 max-w-24 h-8 bg-amber-500') },
  { name: 'size-full', render: ({ Box }) => (
      <Box className="w-64 h-16 bg-slate-200"><Box id="cfm-root" className="w-full h-8 bg-sky-500" /></Box>) },
  { name: 'size-half', render: ({ Box }) => (
      <Box className="w-64 h-16 bg-slate-200"><Box id="cfm-root" className="w-1/2 h-8 bg-rose-500" /></Box>) },
  { name: 'size-square', render: box('w-20 h-20 bg-teal-500') },

  // ── spacing ───────────────────────────────────────────────────────────────
  { name: 'padding-all', render: ({ Box }) => (
      <Box id="cfm-root" className="w-40 bg-sky-400 p-4"><Box className="w-full h-8 bg-white" /></Box>) },
  { name: 'padding-xy', render: ({ Box }) => (
      <Box id="cfm-root" className="bg-violet-500 px-6 py-2"><Box className="w-12 h-6 bg-white" /></Box>) },
  { name: 'padding-t', render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 bg-emerald-500 pt-8"><Box className="w-full h-6 bg-white" /></Box>) },

  // ── gap (flex) ────────────────────────────────────────────────────────────
  { name: 'gap-row', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row gap-2 p-3 bg-slate-100">
        <Box className="w-10 h-10 bg-red-500" /><Box className="w-10 h-10 bg-green-500" /><Box className="w-10 h-10 bg-blue-500" />
      </Box>) },
  { name: 'gap-col', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-col gap-3 p-3 bg-slate-100">
        <Box className="w-10 h-6 bg-red-500" /><Box className="w-10 h-6 bg-green-500" />
      </Box>) },

  // ── colors (palette) ──────────────────────────────────────────────────────
  { name: 'bg-emerald', render: box('w-16 h-16 bg-emerald-400') },
  { name: 'bg-rose', render: box('w-16 h-16 bg-rose-600') },
  { name: 'bg-zinc', render: box('w-16 h-16 bg-zinc-700') },
  { name: 'bg-amber', render: box('w-16 h-16 bg-amber-300') },
  { name: 'bg-cyan', render: box('w-16 h-16 bg-cyan-500') },
  { name: 'bg-fuchsia', render: box('w-16 h-16 bg-fuchsia-500') },
  { name: 'bg-black', render: box('w-16 h-16 bg-black') },

  // ── border radius ─────────────────────────────────────────────────────────
  { name: 'rounded-md', render: box('w-20 h-20 bg-indigo-500 rounded-md') },
  { name: 'rounded-lg', render: box('w-20 h-20 bg-indigo-500 rounded-lg') },
  { name: 'rounded-xl', render: box('w-20 h-20 bg-indigo-500 rounded-xl') },
  { name: 'rounded-full', render: box('w-20 h-20 bg-indigo-500 rounded-full') },

  // ── borders ───────────────────────────────────────────────────────────────
  { name: 'border-width', render: box('w-20 h-20 bg-white border-4 border-blue-500') },
  { name: 'border-color', render: box('w-20 h-20 bg-amber-100 border-2 border-red-500') },

  // ── flex / alignment ──────────────────────────────────────────────────────
  { name: 'items-center', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-center w-40 h-16 bg-slate-100">
        <Box className="w-8 h-8 bg-blue-500" />
      </Box>) },
  { name: 'justify-center', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-center w-40 h-16 bg-slate-100">
        <Box className="w-8 h-8 bg-blue-500" />
      </Box>) },
  { name: 'justify-between', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-between w-40 h-10 bg-slate-100">
        <Box className="w-8 h-8 bg-red-500" /><Box className="w-8 h-8 bg-green-500" />
      </Box>) },
  { name: 'items-justify-center', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-center justify-center w-40 h-20 bg-slate-100">
        <Box className="w-8 h-8 bg-violet-500" />
      </Box>) },
  { name: 'flex-1-fill', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row w-40 h-8 bg-slate-100">
        <Box className="flex-1 bg-red-500" /><Box className="w-8 bg-blue-500" />
      </Box>) },

  // ── position ──────────────────────────────────────────────────────────────
  { name: 'absolute-inset', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200">
        <Box className="absolute inset-0 bg-indigo-500" />
      </Box>) },
  { name: 'absolute-offset', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200">
        <Box className="absolute top-2 left-2 w-8 h-8 bg-red-500" />
      </Box>) },

  // ── opacity ───────────────────────────────────────────────────────────────
  { name: 'opacity-half', render: ({ Box }) => (
      <Box className="w-16 h-16 bg-white"><Box id="cfm-root" className="w-16 h-16 bg-black opacity-50" /></Box>) },

  // ── overflow ──────────────────────────────────────────────────────────────
  { name: 'overflow-hidden', render: ({ Box }) => (
      <Box id="cfm-root" className="w-16 h-16 overflow-hidden bg-slate-200">
        <Box className="w-32 h-32 bg-emerald-500" />
      </Box>) },
]
