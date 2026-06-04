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
      <Box id="cfm-root" className="w-32 bg-violet-500 px-6 py-2"><Box className="w-12 h-6 bg-white" /></Box>) },
  { name: 'padding-t', render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 bg-emerald-500 pt-8"><Box className="w-full h-6 bg-white" /></Box>) },

  // ── gap (flex) ────────────────────────────────────────────────────────────
  { name: 'gap-row', render: ({ Box }) => (
      <Box id="cfm-root" className="w-48 flex flex-row gap-2 p-3 bg-slate-100">
        <Box className="w-10 h-10 bg-red-500" /><Box className="w-10 h-10 bg-green-500" /><Box className="w-10 h-10 bg-blue-500" />
      </Box>) },
  { name: 'gap-col', render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 flex flex-col gap-3 p-3 bg-slate-100">
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

  // ── more palette coverage (single boxes — pixel-match cleanly cross-platform) ───────
  { name: 'bg-slate-50', render: box('w-16 h-16 bg-slate-50') },
  { name: 'bg-slate-300', render: box('w-16 h-16 bg-slate-300') },
  { name: 'bg-slate-700', render: box('w-16 h-16 bg-slate-700') },
  { name: 'bg-blue-200', render: box('w-16 h-16 bg-blue-200') },
  { name: 'bg-blue-800', render: box('w-16 h-16 bg-blue-800') },
  { name: 'bg-green-300', render: box('w-16 h-16 bg-green-300') },
  { name: 'bg-orange-500', render: box('w-16 h-16 bg-orange-500') },
  { name: 'bg-purple-600', render: box('w-16 h-16 bg-purple-600') },
  { name: 'bg-pink-400', render: box('w-16 h-16 bg-pink-400') },
  { name: 'bg-yellow-300', render: box('w-16 h-16 bg-yellow-300') },
  { name: 'bg-lime-500', render: box('w-16 h-16 bg-lime-500') },
  { name: 'bg-teal-600', render: box('w-16 h-16 bg-teal-600') },

  // ── more radii ──────────────────────────────────────────────────────────────
  { name: 'rounded-sm', render: box('w-20 h-20 bg-indigo-500 rounded-sm') },
  { name: 'rounded-2xl', render: box('w-20 h-20 bg-indigo-500 rounded-2xl') },
  { name: 'rounded-3xl', render: box('w-24 h-24 bg-indigo-500 rounded-3xl') },

  // ── opacity levels ────────────────────────────────────────────────────────────
  { name: 'opacity-25', render: ({ Box }) => (
      <Box className="w-16 h-16 bg-white"><Box id="cfm-root" className="w-16 h-16 bg-blue-600 opacity-25" /></Box>) },
  { name: 'opacity-75', render: ({ Box }) => (
      <Box className="w-16 h-16 bg-white"><Box id="cfm-root" className="w-16 h-16 bg-blue-600 opacity-75" /></Box>) },

  // ── more sizing ───────────────────────────────────────────────────────────────
  { name: 'size-12', render: box('w-12 h-12 bg-cyan-500') },
  { name: 'size-28x14', render: box('w-28 h-14 bg-rose-500') },
  { name: 'size-tiny', render: box('w-4 h-4 bg-black') },

  // ── borders ───────────────────────────────────────────────────────────────────
  { name: 'border-bare', render: box('w-20 h-20 bg-white border border-black') },
  { name: 'border-8', render: box('w-24 h-24 bg-amber-200 border-8 border-emerald-600') },

  // ── single-side padding (colored box, dark inner for a clean diff) ──────────────
  { name: 'pad-left', render: ({ Box }) => (
      <Box id="cfm-root" className="w-32 bg-sky-500 pl-8"><Box className="w-8 h-12 bg-slate-900" /></Box>) },
  { name: 'pad-top', render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 bg-emerald-500 pt-8"><Box className="w-12 h-8 bg-slate-900" /></Box>) },

  // ── flex alignment variants ─────────────────────────────────────────────────────
  { name: 'items-end', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-end w-40 h-16 bg-slate-200">
        <Box className="w-8 h-8 bg-blue-600" />
      </Box>) },
  { name: 'justify-end', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-end w-40 h-10 bg-slate-200">
        <Box className="w-8 h-8 bg-blue-600" />
      </Box>) },
  { name: 'justify-around', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-around w-40 h-10 bg-slate-200">
        <Box className="w-6 h-8 bg-red-600" /><Box className="w-6 h-8 bg-green-600" />
      </Box>) },
  { name: 'self-end', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-start w-32 h-20 bg-slate-200">
        <Box className="w-8 h-8 bg-violet-600 self-end" />
      </Box>) },

  // ── position offsets ────────────────────────────────────────────────────────────
  { name: 'absolute-br', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200">
        <Box className="absolute bottom-2 right-2 w-8 h-8 bg-fuchsia-600" />
      </Box>) },
  { name: 'z-stack', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-16 bg-slate-200">
        <Box className="absolute top-0 left-0 w-16 h-16 bg-red-500 z-10" />
        <Box className="absolute top-2 left-2 w-16 h-16 bg-blue-500" />
      </Box>) },

  // ════════════ comprehensive expansion (toward full category coverage) ════════════

  // ── sizing breadth ──────────────────────────────────────────────────────────
  { name: 'w-8', render: box('w-8 h-16 bg-indigo-500') },
  { name: 'w-12', render: box('w-12 h-16 bg-indigo-500') },
  { name: 'w-32', render: box('w-32 h-8 bg-indigo-500') },
  { name: 'w-48', render: box('w-48 h-6 bg-indigo-500') },
  { name: 'h-4', render: box('w-16 h-4 bg-indigo-500') },
  { name: 'h-32', render: box('w-6 h-32 bg-indigo-500') },
  { name: 'w-third', render: ({ Box }) => (
      <Box className="w-48 h-8 bg-slate-200"><Box id="cfm-root" className="w-1/3 h-8 bg-sky-500" /></Box>) },
  { name: 'w-2-3', render: ({ Box }) => (
      <Box className="w-48 h-8 bg-slate-200"><Box id="cfm-root" className="w-2/3 h-8 bg-rose-500" /></Box>) },
  { name: 'w-quarter', render: ({ Box }) => (
      <Box className="w-48 h-8 bg-slate-200"><Box id="cfm-root" className="w-1/4 h-8 bg-teal-500" /></Box>) },
  { name: 'max-h', render: box('w-12 h-96 max-h-20 bg-amber-500') },
  { name: 'min-w', render: box('w-4 min-w-24 h-8 bg-lime-500') },

  // ── spacing breadth (padding visible inside; margin via wrapper) ─────────────
  { name: 'p-1', render: ({ Box }) => (<Box id="cfm-root" className="w-32 bg-sky-500 p-1"><Box className="w-12 h-12 bg-slate-900" /></Box>) },
  { name: 'p-2', render: ({ Box }) => (<Box id="cfm-root" className="w-32 bg-sky-500 p-2"><Box className="w-12 h-12 bg-slate-900" /></Box>) },
  { name: 'p-8', render: ({ Box }) => (<Box id="cfm-root" className="w-32 bg-sky-500 p-8"><Box className="w-8 h-8 bg-slate-900" /></Box>) },
  { name: 'px-only', render: ({ Box }) => (<Box id="cfm-root" className="w-32 bg-emerald-500 px-8"><Box className="w-8 h-12 bg-slate-900" /></Box>) },
  { name: 'py-only', render: ({ Box }) => (<Box id="cfm-root" className="w-24 bg-emerald-500 py-6"><Box className="w-12 h-8 bg-slate-900" /></Box>) },
  { name: 'pr-only', render: ({ Box }) => (<Box id="cfm-root" className="w-32 bg-violet-500 pr-10"><Box className="w-8 h-10 bg-slate-900" /></Box>) },
  { name: 'pb-only', render: ({ Box }) => (<Box id="cfm-root" className="w-24 bg-violet-500 pb-8"><Box className="w-10 h-8 bg-slate-900" /></Box>) },
  { name: 'margin-inner', render: ({ Box }) => (
      <Box id="cfm-root" className="w-32 h-16 bg-slate-200"><Box className="m-4 w-8 h-8 bg-blue-600" /></Box>) },
  { name: 'margin-top-inner', render: ({ Box }) => (
      <Box id="cfm-root" className="w-20 h-24 bg-slate-200"><Box className="mt-6 w-12 h-8 bg-blue-600" /></Box>) },

  // ── color breadth (more hues/shades) ────────────────────────────────────────
  { name: 'bg-red-700', render: box('w-16 h-16 bg-red-700') },
  { name: 'bg-orange-300', render: box('w-16 h-16 bg-orange-300') },
  { name: 'bg-yellow-500', render: box('w-16 h-16 bg-yellow-500') },
  { name: 'bg-lime-300', render: box('w-16 h-16 bg-lime-300') },
  { name: 'bg-green-600', render: box('w-16 h-16 bg-green-600') },
  { name: 'bg-teal-400', render: box('w-16 h-16 bg-teal-400') },
  { name: 'bg-sky-600', render: box('w-16 h-16 bg-sky-600') },
  { name: 'bg-indigo-300', render: box('w-16 h-16 bg-indigo-300') },
  { name: 'bg-violet-700', render: box('w-16 h-16 bg-violet-700') },
  { name: 'bg-purple-300', render: box('w-16 h-16 bg-purple-300') },
  { name: 'bg-pink-600', render: box('w-16 h-16 bg-pink-600') },
  { name: 'bg-stone-400', render: box('w-16 h-16 bg-stone-400') },
  { name: 'bg-neutral-500', render: box('w-16 h-16 bg-neutral-500') },
  { name: 'bg-gray-600', render: box('w-16 h-16 bg-gray-600') },

  // ── radius breadth ──────────────────────────────────────────────────────────
  { name: 'rounded-xs', render: box('w-20 h-20 bg-indigo-500 rounded-xs') },
  { name: 'rounded-4xl', render: box('w-28 h-28 bg-indigo-500 rounded-4xl') },
  { name: 'rounded-none', render: box('w-20 h-20 bg-indigo-500 rounded-none') },

  // ── borders breadth ─────────────────────────────────────────────────────────
  { name: 'border-2', render: box('w-20 h-20 bg-white border-2 border-slate-900') },
  { name: 'border-green', render: box('w-20 h-20 bg-white border-4 border-green-600') },
  { name: 'border-rounded', render: box('w-20 h-20 bg-amber-100 border-4 border-rose-500 rounded-xl') },

  // ── flex alignment breadth ──────────────────────────────────────────────────
  { name: 'items-start', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-start w-32 h-20 bg-slate-200"><Box className="w-8 h-8 bg-blue-600" /></Box>) },
  { name: 'items-stretch', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-stretch w-32 h-16 bg-slate-200"><Box className="w-8 bg-blue-600" /></Box>) },
  { name: 'justify-start', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-start w-32 h-10 bg-slate-200"><Box className="w-8 h-8 bg-blue-600" /></Box>) },
  { name: 'justify-evenly', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row justify-evenly w-40 h-10 bg-slate-200"><Box className="w-6 h-8 bg-red-600" /><Box className="w-6 h-8 bg-green-600" /></Box>) },
  { name: 'self-center', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-start w-32 h-20 bg-slate-200"><Box className="w-8 h-8 bg-violet-600 self-center" /></Box>) },
  { name: 'self-stretch', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row items-start w-32 h-16 bg-slate-200"><Box className="w-8 bg-violet-600 self-stretch" /></Box>) },
  { name: 'flex-col-3', render: ({ Box }) => (
      <Box id="cfm-root" className="w-24 flex flex-col gap-2 p-2 bg-slate-200"><Box className="w-10 h-5 bg-red-500" /><Box className="w-10 h-5 bg-green-500" /><Box className="w-10 h-5 bg-blue-500" /></Box>) },
  { name: 'flex-wrap-many', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row flex-wrap gap-1 w-24 bg-slate-200">{[0,1,2,3,4,5].map((i) => <Box key={i} className="w-10 h-10 bg-indigo-500" />)}</Box>) },
  { name: 'grow-shrink', render: ({ Box }) => (
      <Box id="cfm-root" className="flex flex-row w-40 h-8 bg-slate-200"><Box className="grow bg-red-500" /><Box className="w-12 bg-blue-500" /></Box>) },

  // ── position breadth ────────────────────────────────────────────────────────
  { name: 'pos-top-right', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200"><Box className="absolute top-1 right-1 w-8 h-8 bg-emerald-600" /></Box>) },
  { name: 'pos-bottom-left', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200"><Box className="absolute bottom-1 left-1 w-8 h-8 bg-amber-600" /></Box>) },
  { name: 'pos-center', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200"><Box className="absolute top-8 left-8 w-8 h-8 bg-fuchsia-600" /></Box>) },

  // ── typography (web-strong; native glyph rasterization differs → skip native) ─
  { name: 'text-align-center', skip: ['native'], render: ({ Box, Text }) => (
      <Box id="cfm-root" className="w-40 bg-slate-100"><Text className="text-center">hello world</Text></Box>) },
  { name: 'text-align-right', skip: ['native'], render: ({ Box, Text }) => (
      <Box id="cfm-root" className="w-40 bg-slate-100"><Text className="text-right">aligned</Text></Box>) },

  // ── honest gaps (utilities tamagui's tailwind mode doesn't convert yet) ───────
  { name: 'gap-rounded-t', render: box('w-20 h-20 bg-indigo-500 rounded-t-xl') }, // corner-specific radius
  { name: 'gap-border-t', render: box('w-20 h-20 bg-white border-t-4 border-blue-600') }, // single-side border
  { name: 'gap-inset-x', render: ({ Box }) => (
      <Box id="cfm-root" className="relative w-24 h-24 bg-slate-200"><Box className="absolute inset-x-0 top-2 h-8 bg-indigo-500" /></Box>) },
]
