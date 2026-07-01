/**
 * Tailwind visual-conformance runner.
 *
 * For each case in cases.tsx, renders it via the Vite host as real Tailwind (oracle) and as
 * tamagui tailwind-mode, screenshots the #cfm-root element, and pixel-diffs tamagui vs tailwind.
 * Writes per-case images + a 3-up side-by-side + summary.json + index.md under ./report.
 *
 * Usage:
 *   bun code/comparisons/conformance/run.ts                # all cases (web legs)
 *   bun code/comparisons/conformance/run.ts --grep flex    # only cases whose name includes "flex"
 *   bun code/comparisons/conformance/run.ts --port 9110
 *
 * Native leg (Phase 2) plugs into the same diff/report loop.
 */
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'
import { chromium } from 'playwright'
import { cases } from './cases'

const HERE = dirname(fileURLToPath(import.meta.url))
const WEB_DIR = join(HERE, 'web')
const REPORT_DIR = join(HERE, 'report')

// defaults (overridable per-case via case.tol)
const DEFAULT_THRESHOLD = 0.1 // pixelmatch per-pixel sensitivity (soot uses 0.1)
const DEFAULT_MAX_DIFF_PERCENT = 1 // % of pixels allowed to differ before "fail"

type Args = { grep?: string; port: number }
function parseArgs(): Args {
  const a = process.argv.slice(2)
  const out: Args = { port: 9110 }
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--grep') out.grep = a[++i]
    else if (a[i] === '--port') out.port = Number(a[++i])
  }
  return out
}

async function waitForServer(url: string, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`server did not start: ${url}`)
}

// pad a decoded PNG onto a WxH white canvas (top-left), so different-sized captures are diffable
function padToCanvas(png: PNG, W: number, H: number): PNG {
  const out = new PNG({ width: W, height: H })
  out.data.fill(255) // opaque white
  for (let y = 0; y < png.height && y < H; y++) {
    for (let x = 0; x < png.width && x < W; x++) {
      const si = (png.width * y + x) << 2
      const di = (W * y + x) << 2
      out.data[di] = png.data[si]
      out.data[di + 1] = png.data[si + 1]
      out.data[di + 2] = png.data[si + 2]
      out.data[di + 3] = png.data[si + 3]
    }
  }
  return out
}

// crop a full-frame PNG to the bounding box of its non-background (non-white) content.
// used for the native leg: capture the whole device frame, then crop to the rendered case
// (soot's post-hoc approach — avoids needing the element rect from the device).
function lumaCropToContent(
  buf: Buffer,
  opts: { tol?: number; pad?: number } = {}
): Buffer {
  const png = PNG.sync.read(buf)
  const { width: W, height: H, data } = png
  const tol = opts.tol ?? 14
  let minX = W,
    minY = H,
    maxX = -1,
    maxY = -1
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
  if (maxX < 0) return buf // all white
  const pad = opts.pad ?? 0
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(W - 1, maxX + pad)
  maxY = Math.min(H - 1, maxY + pad)
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
      out.data[di + 3] = data[si + 3]
    }
  }
  return PNG.sync.write(out)
}

type DiffResult = {
  diffPixels: number
  totalPixels: number
  diffPercent: number
  dimsMatch: boolean
  aDims: [number, number]
  bDims: [number, number]
  diffBuf: Buffer
}

// a = oracle (tailwind), b = candidate (tamagui)
function diff(aBuf: Buffer, bBuf: Buffer, threshold: number): DiffResult {
  const a = PNG.sync.read(aBuf)
  const b = PNG.sync.read(bBuf)
  const dimsMatch = a.width === b.width && a.height === b.height
  const W = Math.max(a.width, b.width)
  const H = Math.max(a.height, b.height)
  const ap = dimsMatch ? a : padToCanvas(a, W, H)
  const bp = dimsMatch ? b : padToCanvas(b, W, H)
  const diffPng = new PNG({ width: W, height: H })
  const diffPixels = pixelmatch(ap.data, bp.data, diffPng.data, W, H, {
    threshold,
    diffMask: false,
  })
  const totalPixels = W * H
  return {
    diffPixels,
    totalPixels,
    diffPercent: (diffPixels / totalPixels) * 100,
    dimsMatch,
    aDims: [a.width, a.height],
    bDims: [b.width, b.height],
    diffBuf: PNG.sync.write(diffPng),
  }
}

// [tailwind | tamagui | diff] side by side on white with thin gaps
async function sideBySide(
  tailwind: Buffer,
  tamagui: Buffer,
  diffBuf: Buffer
): Promise<Buffer> {
  const metas = await Promise.all(
    [tailwind, tamagui, diffBuf].map((b) => sharp(b).metadata())
  )
  const gap = 12
  const H = Math.max(...metas.map((m) => m.height ?? 0))
  const widths = metas.map((m) => m.width ?? 0)
  const W = widths.reduce((s, w) => s + w, 0) + gap * 2
  let x = 0
  const composites: sharp.OverlayOptions[] = []
  for (let i = 0; i < 3; i++) {
    composites.push({ input: [tailwind, tamagui, diffBuf][i], left: x, top: 0 })
    x += widths[i] + gap
  }
  return sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 245, g: 245, b: 245, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer()
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout: ${label}`)), ms)),
  ])
}

type Capture = { buf: Buffer; visible: boolean }

// a 2x2 white tile stands in for "rendered nothing visible" so the diff still runs and flags it
function blankTile(): Buffer {
  const p = new PNG({ width: 2, height: 2 })
  p.data.fill(255)
  return PNG.sync.write(p)
}

// read #cfm-root's rect via getBoundingClientRect (robust — playwright's locator.boundingBox()
// can spuriously return null for some laid-out elements).
function rectOf(page: import('playwright').Page) {
  return page.evaluate(() => {
    const el = document.getElementById('cfm-root')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  })
}

async function captureOnce(
  page: import('playwright').Page,
  url: string
): Promise<Capture> {
  // networkidle (not just load) so Tailwind v4's async-generated CSS module is fetched+applied
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('#cfm-root').waitFor({ state: 'attached', timeout: 10_000 })
  await page.waitForTimeout(300)
  // poll for layout (generous): on a cold vite the first request compiles the huge tamagui graph
  // + generates Tailwind v4 CSS, which can take many seconds. subsequent cases resolve instantly.
  let rect = await rectOf(page)
  for (let i = 0; i < 80 && (!rect || rect.width < 1 || rect.height < 1); i++) {
    await page.waitForTimeout(500)
    rect = await rectOf(page)
  }
  if (!rect || rect.width < 1 || rect.height < 1) {
    return { buf: blankTile(), visible: false }
  }
  // screenshot the element region via clip (bypasses locator visibility heuristics)
  const clip = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  let prev: Buffer | null = null
  for (let i = 0; i < 12; i++) {
    const shot = await page.screenshot({ clip, type: 'png' })
    if (prev && Buffer.compare(prev, shot) === 0) return { buf: shot, visible: true }
    prev = shot
    await page.waitForTimeout(100)
  }
  return { buf: prev!, visible: true }
}

async function capture(page: import('playwright').Page, url: string): Promise<Capture> {
  let res = await captureOnce(page, url)
  // a blank result can be a genuine failure (hidden/unconverted) OR a cold-vite flake on the
  // very first measured case — reload once to disambiguate.
  if (!res.visible) {
    await page.waitForTimeout(800)
    res = await captureOnce(page, url)
  }
  return res
}

type CaseSummary = {
  name: string
  webVsTailwind: {
    diffPercent: number
    diffPixels: number
    totalPixels: number
    dimsMatch: boolean
    tamaguiVisible: boolean
    tailwindDims: [number, number]
    tamaguiDims: [number, number]
    maxDiffPercent: number
    pass: boolean
  }
}

async function main() {
  const args = parseArgs()
  const selected = (args.grep ? cases.filter((c) => c.name.includes(args.grep!)) : cases)
    // web measures both DOM (tailwind) and tamagui legs — skip cases opting out of either
    .filter((c) => !c.skip?.includes('tamagui') && !c.skip?.includes('tailwind'))
  if (!selected.length) {
    console.error(`no cases match --grep ${args.grep}`)
    process.exit(1)
  }

  rmSync(REPORT_DIR, { recursive: true, force: true })
  mkdirSync(REPORT_DIR, { recursive: true })

  console.log(`starting vite host on :${args.port} ...`)
  const vite = spawn('bun', ['x', 'vite', '--port', String(args.port), '--strictPort'], {
    cwd: WEB_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  vite.stderr.on('data', (d) => {
    const s = String(d)
    if (s.toLowerCase().includes('error')) process.stderr.write(`[vite] ${s}`)
  })

  const base = `http://localhost:${args.port}`
  const summaries: CaseSummary[] = []
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null
  try {
    await waitForServer(base + '/')
    browser = await chromium.launch()

    // warm up: a cold vite compiles tamagui + generates Tailwind v4 CSS lazily. prime BOTH legs
    // and wait until the box is actually laid out, so the measured loop starts fully warm.
    for (const target of ['tamagui', 'tailwind']) {
      const warm = await browser.newPage()
      await warm
        .goto(`${base}/?case=${selected[0].name}&target=${target}`, {
          waitUntil: 'networkidle',
        })
        .catch(() => {})
      for (let i = 0; i < 120; i++) {
        const b = await rectOf(warm).catch(() => null)
        if (b && b.width > 0 && b.height > 0) break
        await warm.waitForTimeout(500)
      }
      await warm.close()
    }

    for (const c of selected) {
      const dir = join(REPORT_DIR, c.name)
      mkdirSync(dir, { recursive: true })
      const threshold = c.tol?.threshold ?? DEFAULT_THRESHOLD
      const maxDiffPercent = c.tol?.maxDiffPercent ?? DEFAULT_MAX_DIFF_PERCENT

      console.log(`\n● ${c.name}`)
      // fresh page per case so a hung/broken page can't poison the rest of the run
      const page = await browser.newPage({ deviceScaleFactor: 2 })
      let tailwind: Capture, tamagui: Capture
      try {
        tailwind = await withTimeout(
          capture(page, `${base}/?case=${c.name}&target=tailwind`),
          70_000,
          `tailwind ${c.name}`
        )
        tamagui = await withTimeout(
          capture(page, `${base}/?case=${c.name}&target=tamagui`),
          70_000,
          `tamagui ${c.name}`
        )
      } catch (e) {
        console.log(`  ERROR  ${(e as Error).message?.split('\n')[0]}`)
        summaries.push({
          name: c.name,
          webVsTailwind: {
            diffPercent: 100,
            diffPixels: 0,
            totalPixels: 0,
            dimsMatch: false,
            tamaguiVisible: false,
            tailwindDims: [0, 0],
            tamaguiDims: [0, 0],
            maxDiffPercent,
            pass: false,
          },
        })
        await page.close().catch(() => {})
        continue
      }
      await page.close().catch(() => {})
      writeFileSync(join(dir, 'tailwind.png'), tailwind.buf)
      writeFileSync(join(dir, 'tamagui.png'), tamagui.buf)

      const d = diff(tailwind.buf, tamagui.buf, threshold)
      writeFileSync(join(dir, 'diff.png'), d.diffBuf)
      writeFileSync(
        join(dir, 'side-by-side.png'),
        await sideBySide(tailwind.buf, tamagui.buf, d.diffBuf)
      )

      const pass = tamagui.visible && d.dimsMatch && d.diffPercent <= maxDiffPercent
      summaries.push({
        name: c.name,
        webVsTailwind: {
          diffPercent: +d.diffPercent.toFixed(3),
          diffPixels: d.diffPixels,
          totalPixels: d.totalPixels,
          dimsMatch: d.dimsMatch,
          tamaguiVisible: tamagui.visible,
          tailwindDims: d.aDims,
          tamaguiDims: d.bDims,
          maxDiffPercent,
          pass,
        },
      })
      const note = !tamagui.visible
        ? ' (tamagui rendered nothing visible)'
        : d.dimsMatch
          ? ''
          : ` (DIM MISMATCH tailwind ${d.aDims.join('x')} vs tamagui ${d.bDims.join('x')})`
      console.log(
        `  ${pass ? 'PASS' : 'FAIL'}  web-vs-tailwind diff ${d.diffPercent.toFixed(2)}%${note}`
      )
    }
  } finally {
    await browser?.close()
    vite.kill('SIGTERM')
  }

  writeFileSync(join(REPORT_DIR, 'summary.json'), JSON.stringify(summaries, null, 2))
  writeReportMd(summaries)
  const passed = summaries.filter((s) => s.webVsTailwind.pass).length
  console.log(
    `\n${passed}/${summaries.length} cases pass (web-vs-tailwind). report: ${REPORT_DIR}/index.md`
  )
  if (passed < summaries.length) process.exitCode = 1
}

function writeReportMd(summaries: CaseSummary[]) {
  const lines: string[] = []
  lines.push('# Tailwind conformance — tamagui web vs real Tailwind\n')
  lines.push('| case | result | diff % | dims (tailwind → tamagui) |')
  lines.push('| --- | --- | --- | --- |')
  for (const s of summaries) {
    const w = s.webVsTailwind
    const result = w.pass ? '✅ pass' : w.tamaguiVisible ? '❌ fail' : '❌ blank'
    lines.push(
      `| [${s.name}](./${s.name}/side-by-side.png) | ${result} | ${w.diffPercent}% | ${w.tailwindDims.join('×')} → ${w.tamaguiDims.join('×')}${w.dimsMatch ? '' : ' ⚠️'} |`
    )
  }
  lines.push('\nEach row links to a `[tailwind | tamagui | diff]` side-by-side image.\n')
  writeFileSync(join(REPORT_DIR, 'index.md'), lines.join('\n'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
