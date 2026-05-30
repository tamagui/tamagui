#!/usr/bin/env node
// crunch the sheet telemetry (frames.jsonl) into the few derived numbers that
// actually decide pass/fail — so the keyboard-avoidance loop reads geometry from
// disk instead of eyeballing slow simulator screenshots.
//
// usage: node sheet-analyze.mjs [path-to-frames.jsonl]
//
// metrics (all in CSS px, screen-relative):
//   keyboardTop = vo + vv          top edge of the soft keyboard / accessory bar
//   input clear = keyboardTop - iB focused input bottom vs keyboard (+ = visible)
//   post  clear = keyboardTop - pB submit button bottom vs keyboard  (+ = reachable)
//   maxScroll   = sC - sH          how far the content can scroll
// the success bar: at full scroll the post button clears the keyboard by a margin,
// and the frame does NOT move when the keyboard toggles (no resize/jank).

import { readFileSync } from 'node:fs'

const path = process.argv[2] || '/tmp/sheet-frames/frames.jsonl'
const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean)
const samples = []
for (const l of lines) {
  try {
    const s = JSON.parse(l)
    if (s.k === 'pos') samples.push(s)
  } catch {}
}
if (!samples.length) {
  console.log('no pos samples in', path)
  process.exit(0)
}

const kbTop = (s) => (s.vo || 0) + s.vv
const fin = (n) => typeof n === 'number' && !Number.isNaN(n)
const clr = (top, bottom) => (fin(bottom) ? top - bottom : null) // + = above kb

// a sheet is OPEN only when its frame is on-screen. closed/hidden sheets sit at
// or below the layout viewport (fT >= de, or the 10000 hidden sentinel) — exclude
// them so the jank check compares open-vs-open, not open-vs-closed.
const isOpen = (s) => fin(s.fT) && s.fT < (s.de || 1e9) - 20
const kbUp = samples.filter((s) => s.kb >= 80 && isOpen(s))
const kbDown = samples.filter((s) => s.kb < 80 && isOpen(s))

// pick the settled keyboard-up sample with the DEEPEST scroll — that's the worst
// case for the post button (furthest the user can push the content up).
const deepest = kbUp.length
  ? kbUp.reduce((a, b) => (b.sT > a.sT ? b : a))
  : samples[samples.length - 1]

// best post-button clearance achieved across all kb-up samples (did it ever clear?)
let bestPost = null
for (const s of kbUp) {
  const c = clr(kbTop(s), s.pB)
  if (c !== null && (bestPost === null || c > bestPost.c)) bestPost = { c, s }
}

const fmt = (s) => {
  const kt = kbTop(s)
  const max = s.sC - s.sH
  return [
    `  frame   fT=${s.fT} fB=${s.fB} fH=${s.fH}`,
    `  scroll  sT=${s.sT}/${max} (${max > 0 ? Math.round((s.sT / max) * 100) : 0}%)  sH=${s.sH} sC=${s.sC}`,
    `  kb      vv=${s.vv} vo=${s.vo} kb=${s.kb}  -> keyboardTop=${kt}  layoutVP=${s.de}`,
    `  input   iT=${s.iT} iB=${s.iB}  clearance=${clr(kt, s.iB)}`,
    `  post    pT=${s.pT} pB=${s.pB}  clearance=${clr(kt, s.pB)}`,
  ].join('\n')
}

console.log(
  `== ${samples.length} pos samples (${kbUp.length} kb-up, ${kbDown.length} kb-down) ==\n`
)

console.log('LAST kb-up @ deepest scroll:')
console.log(fmt(deepest))

if (bestPost) {
  console.log(
    `\nbest post clearance across kb-up: ${bestPost.c}px  (at sT=${bestPost.s.sT}/${bestPost.s.sC - bestPost.s.sH})`
  )
}

// jank check: frame top/bottom should be IDENTICAL between a kb-down and a kb-up
// settled sample (the frame must not resize/move when the keyboard toggles).
if (kbDown.length && kbUp.length) {
  const d = kbDown[kbDown.length - 1]
  const u = kbUp[kbUp.length - 1]
  const moved = d.fT !== u.fT || d.fB !== u.fB || d.fH !== u.fH
  console.log(
    `\njank check  kb-down(fT=${d.fT} fB=${d.fB} fH=${d.fH})  vs  kb-up(fT=${u.fT} fB=${u.fB} fH=${u.fH})  -> ${moved ? 'FRAME MOVED (jank!)' : 'stable (no jank)'}`
  )
} else {
  console.log(
    '\njank check: need both kb-down and kb-up samples (capture an open before focusing)'
  )
}

// verdict
if (bestPost) {
  const ok = bestPost.c >= 12
  console.log(
    `\nVERDICT post-reachable: ${ok ? 'PASS' : 'FAIL'} (best clearance ${bestPost.c}px, want >= 12)`
  )
}
