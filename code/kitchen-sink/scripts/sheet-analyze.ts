/**
 * Crunch the sheet telemetry JSONL into a readable per-episode report.
 *
 *   bun scripts/sheet-analyze.ts [/tmp/sheet-frames/frames.jsonl]
 *
 * Surfaces the three bugs precisely:
 *  - FLICKER: frame top/bottom reverses direction while NO finger is moving
 *    (idle jitter) or oscillates during a keyboard transition. Each run is
 *    listed with its peak amplitude.
 *  - KEYBOARD episodes: kb 0->open / open->0. Reports whether the frame stayed
 *    anchored (fB delta) and whether the focused input cleared the keyboard.
 *  - TOUCH episodes (start..end): frame-bottom travel, direction reversals
 *    (drag jitter), and where it settled vs where it began (scroll snap).
 */
import { readFileSync } from 'node:fs'

const path = process.argv[2] || '/tmp/sheet-frames/frames.jsonl'
const rows = readFileSync(path, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))

if (!rows.length) {
  console.info(
    'no samples — was the collector running and the page loaded with ?track=1 ?'
  )
  process.exit(0)
}

const t0 = rows[0].t
const rel = (t: number) => `${String(t - t0).padStart(6)}ms`
const pos = rows.filter((r) => r.k === 'pos')
const touches = rows.filter((r) => r.k === 'touch')

console.info(
  `\n=== sheet telemetry: ${rows.length} samples over ${rows[rows.length - 1].t - t0}ms ===`
)
const byKind: Record<string, number> = {}
for (const r of rows) byKind[r.k] = (byKind[r.k] || 0) + 1
console.info('kinds:', JSON.stringify(byKind))

// ---- marks / focus / keyboard timeline ----
console.info('\n--- events ---')
for (const r of rows) {
  if (r.k === 'mark') console.info(`${rel(r.t)}  MARK   ${r.m}`)
  else if (r.k === 'focus') console.info(`${rel(r.t)}  FOCUS  ${r.e} ${r.tg}`)
}

// nearest touchmove within window — used to tell idle flicker from drag motion
const touchTs = touches.filter((t) => t.e !== 'end').map((t) => t.t)
const movingAt = (t: number, win = 60) => touchTs.some((tt) => Math.abs(tt - t) <= win)

// ---- FLICKER: direction reversals of fB while NOT being dragged ----
console.info('\n--- FLICKER (frame reversals with no active finger) ---')
const flickRuns: { start: number; end: number; peak: number; n: number }[] = []
let prevDir = 0
let runStart = -1
let runPeak = 0
let runN = 0
let runEnd = 0
for (let i = 1; i < pos.length; i++) {
  const a = pos[i - 1]
  const b = pos[i]
  if (Number.isNaN(a.fB) || Number.isNaN(b.fB)) continue
  const d = b.fB - a.fB
  if (d === 0) continue
  const dir = Math.sign(d)
  const idle = !movingAt(b.t)
  const reversal = prevDir !== 0 && dir !== prevDir && idle
  if (reversal) {
    if (runStart < 0) {
      runStart = a.t
      runPeak = 0
      runN = 0
    }
    runPeak = Math.max(runPeak, Math.abs(d))
    runN++
    runEnd = b.t
  } else if (runStart >= 0 && b.t - runEnd > 150) {
    flickRuns.push({ start: runStart, end: runEnd, peak: runPeak, n: runN })
    runStart = -1
  }
  prevDir = dir
}
if (runStart >= 0)
  flickRuns.push({ start: runStart, end: runEnd, peak: runPeak, n: runN })
if (!flickRuns.length)
  console.info('  none — frame never reversed direction while idle ✓')
else
  for (const f of flickRuns)
    console.info(
      `  ${rel(f.start)}..${rel(f.end)}  reversals=${f.n}  peak=${f.peak}px  ${f.peak >= 2 ? '⚠️' : ''}`
    )

// ---- KEYBOARD episodes ----
console.info('\n--- KEYBOARD episodes (anchor + input visibility) ---')
let kbState = pos.find((p) => !Number.isNaN(p.kb))?.kb || 0
let lastFbBefore = NaN
let printedKb = false
for (let i = 1; i < pos.length; i++) {
  const p = pos[i]
  const prev = pos[i - 1]
  const opening = prev.kb <= 4 && p.kb > 40
  const closing = prev.kb > 40 && p.kb <= 4
  if (opening || closing) {
    printedKb = true
    // sample the frame bottom in a window after the transition settles
    const after = pos.filter((q) => q.t >= p.t && q.t <= p.t + 600 && !Number.isNaN(q.fB))
    const fbs = after.map((q) => q.fB)
    const minB = Math.min(...fbs, prev.fB)
    const maxB = Math.max(...fbs, prev.fB)
    const tops = after.map((q) => q.fT)
    const minT = Math.min(...tops, prev.fT)
    const maxT = Math.max(...tops, prev.fT)
    // focused input visibility: is iB above the visible viewport bottom (vv)?
    const inputs = after.filter((q) => !Number.isNaN(q.iB))
    const lastInput = inputs[inputs.length - 1]
    const clearMsg = lastInput
      ? `input bottom=${lastInput.iB} vs vv=${lastInput.vv} -> ${lastInput.iB <= lastInput.vv + 2 ? 'VISIBLE ✓' : 'OCCLUDED ⚠️'}`
      : 'no focused input measured'
    console.info(
      `${rel(p.t)}  KB ${opening ? 'OPEN ' : 'CLOSE'} (kb ${prev.kb}->${p.kb})  frame.bottom span=${maxB - minB}px  top span=${maxT - minT}px  ${clearMsg}`
    )
  }
}
if (!printedKb) console.info('  no keyboard transition captured')

// ---- TOUCH episodes ----
console.info('\n--- TOUCH episodes (drag jitter + scroll snap) ---')
let ep: any[] = []
const episodes: any[][] = []
for (const r of rows) {
  if (r.k === 'touch' && r.e === 'start') ep = [r]
  else if (ep.length && (r.k === 'touch' || r.k === 'pos')) {
    ep.push(r)
    if (r.k === 'touch' && r.e === 'end') {
      episodes.push(ep)
      ep = []
    }
  }
}
if (!episodes.length) console.info('  no touch gestures captured')
for (const e of episodes) {
  const ps = e.filter((r) => r.k === 'pos' && !Number.isNaN(r.fB))
  const start = e[0]
  const end = e[e.length - 1]
  const fbs = ps.map((p) => p.fB)
  const sTs = ps.map((p) => p.sT).filter((n) => !Number.isNaN(n))
  const dyFinger = end.y - start.y
  // direction reversals in frame bottom during the gesture (= drag flicker)
  let reversals = 0
  let maxRev = 0
  let dir = 0
  for (let i = 1; i < fbs.length; i++) {
    const d = fbs[i] - fbs[i - 1]
    if (d === 0) continue
    const nd = Math.sign(d)
    if (dir !== 0 && nd !== dir) {
      reversals++
      maxRev = Math.max(maxRev, Math.abs(d))
    }
    dir = nd
  }
  const fbTravel = fbs.length ? Math.max(...fbs) - Math.min(...fbs) : 0
  const scrollTravel = sTs.length ? Math.max(...sTs) - Math.min(...sTs) : 0
  const settle = ps.length ? ps[ps.length - 1].fB - ps[0].fB : 0
  console.info(
    `${rel(start.t)}  TOUCH on ${start.tg}  finger.dy=${dyFinger}px  frame.bottom travel=${fbTravel}px reversals=${reversals} maxRev=${maxRev}px  scrollTop travel=${scrollTravel}px  net frame settle=${settle}px`
  )
}

console.info('')
