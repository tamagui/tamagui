#!/usr/bin/env node
/**
 * size gate for the v3 runtime styled-view fixture.
 *
 * `baseline-styled-view` in code/comparisons/tamagui-bench is the smallest
 * honest picture of what a styled component drags into an app bundle: one
 * styled View, React externalized, nothing else. plans/v3-beta/bundle-size-ledger.md
 * records how the v3 engine rewrite got it back to size. this is what keeps it
 * there.
 *
 * the gate is a CEILING, not an equality. improvements pass silently, so a perf
 * or engine change that makes the bundle smaller never has to touch this file.
 * only growth past the recorded slack fails.
 *
 * gzip-9 bytes depend on the zlib the measuring runtime was linked against, so
 * this refuses to compare across runtimes rather than reporting a difference
 * that is really just a zlib upgrade. node 24.16.0 (zlib 1.3.1-e00f703) and
 * node 25.9.0 (zlib 1.2.12) disagree by 37 bytes on this exact artifact.
 *
 *   node code/comparisons/check-styled-view-size.mts
 *   node code/comparisons/check-styled-view-size.mts --update-baseline
 *
 * the fixture links @tamagui/* from workspace dist, so the WHOLE workspace has
 * to be built first (`bun run build:js` at the repo root). rebuilding only
 * style-grammar and web leaves a stale ui/tamagui dist behind, which breaks the
 * fixture build.
 */
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const comparisons = dirname(fileURLToPath(import.meta.url))
const repoRoot = dirname(dirname(comparisons))
const benchDir = join(comparisons, 'tamagui-bench')
const baselinePath = join(comparisons, 'styled-view-size-baseline.json')
const viteBin = join(repoRoot, 'node_modules/.bin/vite')

const updateBaseline = process.argv.includes('--update-baseline')

// slack for minifier jitter between identical sources. anything larger stops
// being a gate and starts being a budget nobody notices drifting.
const SLACK = 150

if (process.argv.length > (updateBaseline ? 3 : 2)) {
  console.error('Usage: check-styled-view-size.mts [--update-baseline]')
  process.exit(1)
}

const workspaceBuildHint =
  'The fixture resolves @tamagui/* from workspace dist, so the WHOLE workspace has to be built, not just style-grammar and web. Run `bun run build:js` at the repo root and try again.'

type Baseline = {
  fixture: string
  raw: number
  gzip: number
  ceiling: number
  node: string
  zlib: string
  recorded: string
  notes: string
}

const pinnedNode = readFileSync(join(repoRoot, '.node-version'), 'utf8').trim()
const currentNode = process.version.replace(/^v/, '')

if (currentNode !== pinnedNode) {
  console.error(
    `Node version mismatch: .node-version pins ${pinnedNode}, this process is ${currentNode}. Gzip bytes depend on the runtime's bundled zlib, so run this on the pinned Node (CI uses .node-version) instead of comparing against a baseline recorded elsewhere.`
  )
  process.exit(1)
}

const baseline: Baseline = JSON.parse(readFileSync(baselinePath, 'utf8'))

if (!updateBaseline && baseline.zlib !== process.versions.zlib) {
  console.error(
    `zlib mismatch: ${baselinePath} was recorded on zlib ${baseline.zlib}, this Node ${currentNode} bundles zlib ${process.versions.zlib}. Re-record with --update-baseline on the pinned Node rather than reading the difference as a size change.`
  )
  process.exit(1)
}

if (!existsSync(viteBin)) {
  console.error(`${viteBin} is missing. Run \`bun install\` at the repo root.`)
  process.exit(1)
}

const outDir = mkdtempSync(join(tmpdir(), 'tamagui-styled-view-'))

// same recipe the ledger measured with: sourcemaps ON, because the emitted
// sourceMappingURL comment is part of the bytes the baseline recorded.
try {
  execFileSync(
    process.execPath,
    [
      viteBin,
      'build',
      '--mode',
      'baseline-styled-view',
      '--sourcemap',
      '--outDir',
      outDir,
      '--emptyOutDir',
    ],
    { cwd: benchDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  )
} catch (error: any) {
  rmSync(outDir, { recursive: true, force: true })
  console.error(`${error.stdout ?? ''}${error.stderr ?? ''}`)
  console.error(
    `\nThe ${baseline.fixture} fixture failed to build. ${workspaceBuildHint}`
  )
  process.exit(1)
}

const assets = join(outDir, 'assets')
const chunks = readdirSync(assets)
  .filter((file) => file.endsWith('.js'))
  .sort()

if (chunks.length === 0) {
  rmSync(outDir, { recursive: true, force: true })
  console.error(`No JavaScript emitted into ${assets}. ${workspaceBuildHint}`)
  process.exit(1)
}

let raw = 0
let gzip = 0
for (const chunk of chunks) {
  if (!existsSync(join(assets, `${chunk}.map`))) {
    rmSync(outDir, { recursive: true, force: true })
    console.error(
      `${chunk} has no sourcemap. The baseline includes the sourceMappingURL comment, so a build without --sourcemap measures a different artifact.`
    )
    process.exit(1)
  }
  const code = readFileSync(join(assets, chunk))
  raw += code.byteLength
  gzip += gzipSync(code, { level: 9 }).byteLength
}

const bytes = (value: number) => value.toLocaleString('en-US')
const signed = (value: number) => `${value > 0 ? '+' : ''}${bytes(value)}`

if (updateBaseline) {
  const recorded: Baseline = {
    ...baseline,
    raw,
    gzip,
    ceiling: gzip + SLACK,
    node: currentNode,
    zlib: process.versions.zlib,
    recorded: new Date().toISOString().slice(0, 10),
  }
  writeFileSync(baselinePath, `${JSON.stringify(recorded, null, 2)}\n`)
  rmSync(outDir, { recursive: true, force: true })
  console.info(
    `Recorded ${baseline.fixture}: raw ${bytes(raw)}, gzip-9 ${bytes(gzip)}, ceiling ${bytes(recorded.ceiling)} (node ${currentNode}, zlib ${process.versions.zlib})`
  )
  process.exit(0)
}

const delta = gzip - baseline.gzip
const percent = ((delta / baseline.gzip) * 100).toFixed(2)

console.info(
  [
    `${baseline.fixture}  raw ${bytes(raw)}  gzip-9 ${bytes(gzip)}`,
    `baseline            gzip-9 ${bytes(baseline.gzip)}  (recorded ${baseline.recorded} on node ${baseline.node}, zlib ${baseline.zlib})`,
    `ceiling             gzip-9 ${bytes(baseline.ceiling)}`,
    `delta               ${signed(delta)} bytes (${delta > 0 ? '+' : ''}${percent}%)`,
  ].join('\n')
)

if (gzip > baseline.ceiling) {
  console.error(
    `\nThe styled-view runtime bundle grew past its ceiling by ${bytes(gzip - baseline.ceiling)} bytes.\n\nThis is runtime code every styled component pulls in. Find what moved before raising the number:\n\n  node ${viteBin} build --mode baseline-styled-view --sourcemap --outDir /tmp/v3bench --emptyOutDir   # from ${benchDir}\n  bun code/comparisons/attribute-bundle-gzip.ts /tmp/v3bench --filter=@tamagui/\n\nThe build measured above is kept at ${outDir}.\nIf the growth is understood and accepted, re-record with --update-baseline and say why in plans/v3-beta/bundle-size-ledger.md.\n\nIf the number looks wildly off instead: ${workspaceBuildHint}`
  )
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
