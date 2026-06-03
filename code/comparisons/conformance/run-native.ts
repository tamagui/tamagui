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

function deepLink(name: string) {
  execFileSync('xcrun', ['simctl', 'openurl', UDID, `${METRO}/--/?case=${name}`])
}
function screenshot(): Buffer {
  execFileSync('xcrun', ['simctl', 'io', UDID, 'screenshot', SHOT])
  return readFileSync(SHOT)
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// paint the Expo Go dev-menu gear (top-right) white, then crop to the non-white content bbox
function maskGearAndCrop(buf: Buffer): { buf: Buffer; visible: boolean } {
  const png = PNG.sync.read(buf)
  const { width: W, height: H, data } = png
  // mask OS chrome: the top strip (status bar + dynamic island + Expo Go dev gear) and the
  // bottom strip (home indicator). the app renders case content between these (stage
  // paddingTop:220), so nothing real is lost.
  const topMask = Math.floor(H * 0.23)
  const bottomMask = Math.floor(H * 0.955)
  for (let y = 0; y < H; y++) {
    if (y >= topMask && y < bottomMask) continue
    for (let x = 0; x < W; x++) {
      const i = (W * y + x) << 2
      data[i] = data[i + 1] = data[i + 2] = 255
    }
  }
  // low tolerance so very light tailwind backgrounds (slate-100 #f1f5f9, etc.) are still
  // detected as content. native screenshots are lossless PNG so white is exactly 255 (no noise).
  const tol = 9
  let minX = W, minY = H, maxX = -1, maxY = -1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (W * y + x) << 2
      if (255 - data[i] > tol || 255 - data[i + 1] > tol || 255 - data[i + 2] > tol) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return { buf, visible: false }
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1
  const out = new PNG({ width: cw, height: ch })
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const si = (W * (minY + y) + (minX + x)) << 2
      const di = (cw * y + x) << 2
      out.data[di] = data[si]
      out.data[di + 1] = data[si + 1]
      out.data[di + 2] = data[si + 2]
      out.data[di + 3] = 255
    }
  }
  return { buf: PNG.sync.write(out), visible: true }
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
  const selected = grep ? cases.filter((c) => c.name.includes(grep)) : cases
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })
  console.log(`native conformance on ${UDID} via ${METRO}`)

  // warm up: load the app + first case (bundle may already be built)
  deepLink(selected[0].name)
  await sleep(4000)

  const results: { name: string; diffPercent: number; pass: boolean; visible: boolean }[] = []
  for (const c of selected) {
    const oraclePath = join(WEB_REPORT, c.name, 'tailwind.png')
    if (!existsSync(oraclePath)) {
      console.log(`● ${c.name}\n  SKIP  no web oracle (run the web suite first)`)
      continue
    }
    deepLink(c.name)
    await sleep(2200)
    const { buf: cropped, visible } = maskGearAndCrop(screenshot())
    const dir = join(OUT, c.name)
    mkdirSync(dir, { recursive: true })
    const oracle = readFileSync(oraclePath)

    if (!visible) {
      results.push({ name: c.name, diffPercent: 100, pass: false, visible })
      console.log(`● ${c.name}\n  FAIL  native rendered nothing visible`)
      continue
    }
    const { diffPercent, diffBuf, nativeResized } = await diffResized(oracle, cropped)
    writeFileSync(join(dir, 'native.png'), cropped)
    writeFileSync(join(dir, 'side-by-side.png'), await sideBySide(oracle, nativeResized, diffBuf))
    const pass = diffPercent <= MAX_DIFF_PERCENT
    results.push({ name: c.name, diffPercent: +diffPercent.toFixed(3), pass, visible })
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
