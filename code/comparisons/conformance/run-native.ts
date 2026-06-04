/**
 * Native tailwind conformance: renders each case in the Expo Go app on a booted iOS sim (via
 * deep-link remount), screenshots, masks the Expo Go dev-menu gear, luma-crops to the case
 * content, and diffs against the REAL-TAILWIND oracle captured by the web run (report/<case>/
 * tailwind.png). Reports native pass-rate.
 *
 * Prereqs (the harness does NOT start these):
 *   1. a booted iOS sim with Expo Go installed
 *   2. metro running for the native app:  (cd native && bun run start)   # port 8099
 *   3. a prior web run so report/<case>/tailwind.png exist:  bun run.ts
 *
 * Usage: bun code/comparisons/conformance/run-native.ts [--grep x] [--udid X] [--metro exp://...]
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, existsSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'
import { cases } from './cases'

const HERE = dirname(fileURLToPath(import.meta.url))
const WEB_REPORT = join(HERE, 'report') // tailwind oracle pngs live here
const OUT = join(HERE, 'report-native')

// native rendering ≠ browser rasterization (AA, subpixel) → looser tolerance than web
const THRESHOLD = 0.15
const MAX_DIFF_PERCENT = 6

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name)
  return i >= 0 ? process.argv[i + 1] : undefined
}

function bootedUdid(): string {
  const explicit = arg('--udid')
  if (explicit) return explicit
  const json = JSON.parse(
    execFileSync('xcrun', ['simctl', 'list', 'devices', 'booted', '-j']).toString()
  )
  for (const runtime of Object.values(json.devices) as any[]) {
    for (const d of runtime) if (d.state === 'Booted') return d.udid
  }
  throw new Error('no booted iOS simulator')
}

const UDID = bootedUdid()
const METRO = arg('--metro') ?? 'exp://127.0.0.1:8099'
const grep = arg('--grep')
const SHOT = join(HERE, '.native-shot.png')

let linkCounter = 0
function deepLink(name: string) {
  // unique counter param forces Expo Go to re-deliver the link (same-URL links are ignored),
  // which (with the App's url-keyed remount) re-fires onLayout → a fresh rect POST.
  execFileSync('xcrun', ['simctl', 'openurl', UDID, `${METRO}/--/?case=${name}&n=${linkCounter++}`])
}
function screenshot(): Buffer {
  execFileSync('xcrun', ['simctl', 'io', UDID, 'screenshot', SHOT])
  return readFileSync(SHOT)
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// the native #cfm-root self-measures (measureInWindow) and POSTs its on-screen rect here on each
// render, so we crop the screenshot to the EXACT element (matching the web #cfm-root crop) instead
// of guessing with luma + chrome masks.
type Rect = { x: number; y: number; width: number; height: number; scale: number }
let lastRect: Rect | null = null
Bun.serve({
  port: 8090,
  async fetch(req) {
    if (req.method === 'POST') {
      try {
        lastRect = (await req.json()) as Rect
      } catch {}
    }
    return new Response('ok', { headers: { 'access-control-allow-origin': '*' } })
  },
})

// crop the full-frame screenshot to the element rect (points × device scale → physical px)
async function rectCrop(shot: Buffer, r: Rect): Promise<Buffer> {
  const png = PNG.sync.read(shot)
  const left = Math.max(0, Math.round(r.x * r.scale))
  const top = Math.max(0, Math.round(r.y * r.scale))
  const width = Math.max(1, Math.min(png.width - left, Math.round(r.width * r.scale)))
  const height = Math.max(1, Math.min(png.height - top, Math.round(r.height * r.scale)))
  return sharp(shot).extract({ left, top, width, height }).png().toBuffer()
}

async function diffResized(oracle: Buffer, native: Buffer) {
  // resize native crop to the oracle's dimensions, then pixel-diff
  const o = PNG.sync.read(oracle)
  const nResized = await sharp(native)
    .resize(o.width, o.height, { fit: 'fill' })
    .png()
    .toBuffer()
  const n = PNG.sync.read(nResized)
  const diff = new PNG({ width: o.width, height: o.height })
  const px = pixelmatch(o.data, n.data, diff.data, o.width, o.height, { threshold: THRESHOLD })
  return {
    diffPercent: (px / (o.width * o.height)) * 100,
    diffBuf: PNG.sync.write(diff),
    nativeResized: nResized,
  }
}

async function sideBySide(oracle: Buffer, native: Buffer, diff: Buffer): Promise<Buffer> {
  const metas = await Promise.all([oracle, native, diff].map((b) => sharp(b).metadata()))
  const gap = 12
  const H = Math.max(...metas.map((m) => m.height ?? 0))
  const widths = metas.map((m) => m.width ?? 0)
  const W = widths.reduce((s, w) => s + w, 0) + gap * 2
  let x = 0
  const composites: sharp.OverlayOptions[] = []
  for (let i = 0; i < 3; i++) {
    composites.push({ input: [oracle, native, diff][i], left: x, top: 0 })
    x += widths[i] + gap
  }
  return sharp({
    create: { width: W, height: H, channels: 4, background: { r: 245, g: 245, b: 245, alpha: 1 } },
  })
    .composite(composites)
    .png()
    .toBuffer()
}

async function main() {
  // skip cases that opt out of native (e.g. text glyphs / blur shadows never pixel-match a browser)
  const selected = (grep ? cases.filter((c) => c.name.includes(grep)) : cases).filter(
    (c) => !c.skip?.includes('native')
  )
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })
  console.log(`native conformance on ${UDID} via ${METRO}`)

  // warm up: load the app + first case (bundle may already be built)
  lastRect = null
  deepLink(selected[0].name)
  for (let i = 0; i < 60 && !lastRect; i++) await sleep(250)

  const results: { name: string; diffPercent: number; pass: boolean; visible: boolean }[] = []
  for (const c of selected) {
    const oraclePath = join(WEB_REPORT, c.name, 'tailwind.png')
    if (!existsSync(oraclePath)) {
      console.log(`● ${c.name}\n  SKIP  no web oracle (run the web suite first)`)
      continue
    }
    // remount the case and wait for the app to report #cfm-root's exact rect
    lastRect = null
    deepLink(c.name)
    for (let i = 0; i < 40 && !lastRect; i++) await sleep(150)
    const dir = join(OUT, c.name)
    mkdirSync(dir, { recursive: true })
    const oracle = readFileSync(oraclePath)

    if (!lastRect) {
      results.push({ name: c.name, diffPercent: 100, pass: false, visible: false })
      console.log(`● ${c.name}\n  FAIL  no rect reported (render failed?)`)
      continue
    }
    await sleep(350) // small settle so paint matches the measured layout
    const cropped = await rectCrop(screenshot(), lastRect)
    const { diffPercent, diffBuf, nativeResized } = await diffResized(oracle, cropped)
    writeFileSync(join(dir, 'native.png'), cropped)
    writeFileSync(join(dir, 'side-by-side.png'), await sideBySide(oracle, nativeResized, diffBuf))
    const pass = diffPercent <= MAX_DIFF_PERCENT
    results.push({ name: c.name, diffPercent: +diffPercent.toFixed(3), pass, visible: true })
    console.log(`● ${c.name}\n  ${pass ? 'PASS' : 'FAIL'}  native-vs-tailwind diff ${diffPercent.toFixed(2)}%`)
  }

  const lines = ['# Native tailwind conformance — tamagui iOS vs real Tailwind\n', '| case | result | diff % |', '| --- | --- | --- |']
  for (const r of results) {
    lines.push(`| [${r.name}](./${r.name}/side-by-side.png) | ${r.pass ? '✅ pass' : '❌ fail'} | ${r.diffPercent}% |`)
  }
  writeFileSync(join(OUT, 'index.md'), lines.join('\n'))
  writeFileSync(join(OUT, 'summary.json'), JSON.stringify(results, null, 2))
  const passed = results.filter((r) => r.pass).length
  console.log(`\nNATIVE: ${passed}/${results.length} pass = ${Math.round((passed / results.length) * 100)}%  → ${OUT}/index.md`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
