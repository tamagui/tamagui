/**
 * Per-element cost of the native DOM primitives.
 *
 *   cd code/core/dom && bun run bench:native
 *
 * The DOM lane's rule is that a native per-element change is approved by a
 * measurement, never by an argument, because this path runs once per element in
 * every list on screen. What this measures is the one decision the primitive
 * actually makes: how the React element gets built.
 *
 * - `jsx` pass-through is what ships. React's modern jsx runtime uses the props
 *   object it is handed, so a primitive with no handlers adds no object at all.
 * - `createElement` is the same call through the legacy entry point, which
 *   copies every prop into a fresh object for its defaultProps and children
 *   handling.
 * - `jsx` with a spread is what `<View {...props} />` compiles to, so it is
 *   what the primitive would cost written the obvious way.
 *
 * The handler rows measure the other half: an element that was passed an
 * onClick has to copy its props and allocate an adapter, so the point is that
 * an element without one does not.
 *
 * Read the heap columns, not the nanoseconds. The timing spread between samples
 * is larger than the gap between the cases, so the medians rank nothing; the
 * heap counters repeat to two decimal places across runs. Measured on
 * bun 1.3.14, darwin arm64, 2026-07-30:
 *
 *   DOMView, no handlers        4.03 objects   236 B
 *   DOMText, no handlers        4.03 objects   235 B
 *   jsx(View, props) direct     4.03 objects   235 B
 *   jsx(View, { ...props })     7.03 objects   347 B
 *   createElement(View, props)  7.03 objects   363 B
 *   DOMView, with onClick       9.04 objects   444 B
 *
 * So a primitive costs exactly what the bare react element costs — the wrapper
 * itself is free — and writing it the obvious way would add 3 objects and about
 * 112 B to every element on the screen.
 */

import { heapStats } from 'bun:jsc'
import { createElement } from 'react'
import { jsx } from 'react/jsx-runtime'
import { View } from 'react-native'

import { DOMText, DOMView } from '../../web/src/dom/primitives.native.tsx'

const ELEMENTS = 10_000
const SAMPLES = 15
const WARMUP = 5

// what the compiler emits for a <div> with a couple of styles and an id
const plain = () => ({
  style: { display: 'flex', flexDirection: 'column', flexShrink: 0, paddingTop: 8 },
  nativeID: 'node',
  children: null,
})
const clicking = () => ({ ...plain(), onClick: () => {} })

// props are built outside the timed region: a component is handed its props, it
// does not build them, and building this one nested style object costs several
// times what the element does, which would bury the whole comparison
const cases = {
  'DOMView, no handlers (ships)': [plain, DOMView],
  'DOMView, with onClick': [clicking, DOMView],
  'DOMText, no handlers (ships)': [plain, DOMText],
  'jsx(View, props) direct': [plain, (props) => jsx(View, props)],
  'jsx(View, { ...props })': [plain, (props) => jsx(View, { ...props })],
  'createElement(View, props)': [plain, (props) => createElement(View, props)],
}

const run = (fn, propsList) => {
  const started = Bun.nanoseconds()
  for (let i = 0; i < ELEMENTS; i++) fn(propsList[i])
  return (Bun.nanoseconds() - started) / ELEMENTS
}

const stats = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return { median: sorted[Math.floor(sorted.length / 2)], sd: Math.sqrt(variance) }
}

/**
 * Live objects and bytes per element, from JSC's own heap counters.
 *
 * Timing cannot separate these cases: at this granularity the spread between
 * samples is larger than the gap between the cases, so the nanosecond columns
 * are reported with their deviation and should not be read as a ranking. The
 * heap counters can separate them, and allocation is the actual claim — a
 * primitive that forwards its props keeps one object per element where a
 * primitive that copies keeps two.
 */
const heapPerElement = (fn, propsList) => {
  Bun.gc(true)
  const before = heapStats()
  const out = new Array(ELEMENTS)
  for (let i = 0; i < ELEMENTS; i++) out[i] = fn(propsList[i])
  Bun.gc(true)
  const after = heapStats()
  // the elements have to survive that collection for the counts to mean anything
  if (out.length !== ELEMENTS) throw new Error('unreachable')
  return {
    objects: (after.objectCount - before.objectCount) / ELEMENTS,
    bytes: (after.heapSize - before.heapSize) / ELEMENTS,
  }
}

console.info(
  `bun ${Bun.version} — ${ELEMENTS.toLocaleString()} elements per sample, ` +
    `${SAMPLES} timed samples after ${WARMUP} warmup\n`
)
console.info(
  'case'.padEnd(30),
  'median'.padStart(9),
  'sd'.padStart(8),
  'objects/el'.padStart(12),
  'bytes/el'.padStart(10)
)

for (const [name, [makeProps, fn]] of Object.entries(cases)) {
  const propsList = Array.from({ length: ELEMENTS }, makeProps)
  for (let i = 0; i < WARMUP; i++) run(fn, propsList)
  const { median, sd } = stats(Array.from({ length: SAMPLES }, () => run(fn, propsList)))
  const { objects, bytes } = heapPerElement(fn, propsList)
  console.info(
    name.padEnd(30),
    `${median.toFixed(0)}ns`.padStart(9),
    `${sd.toFixed(0)}ns`.padStart(8),
    objects.toFixed(2).padStart(12),
    `${bytes.toFixed(0)} B`.padStart(10)
  )
}
