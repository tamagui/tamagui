#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { gzipSync } from 'node:zlib'

const args = new Map()
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i]
  const value = process.argv[i + 1]
  if (!key?.startsWith('--') || !value) {
    usage()
  }
  args.set(key.slice(2), value)
}

const baseStatsPath = requiredArg('base')
const headStatsPath = requiredArg('head')
const baseDist = args.get('base-dist')
const headDist = args.get('head-dist')
const outPath = args.get('out')
const baselinePath = args.get('baseline')
const updateBaselinePath = args.get('update-baseline')

if (baselinePath && updateBaselinePath) usage()

const base = summarizeStats(baseStatsPath, baseDist)
const head = summarizeStats(headStatsPath, headDist)
const markdown = renderMarkdown(base, head)

if (outPath) {
  writeFileSync(outPath, markdown)
} else {
  process.stdout.write(markdown)
}

const gzipDelta = head.totals.gzip - base.totals.gzip
if (gzipDelta > 0) {
  console.log(`::warning::Bundle gzip total increased by ${formatBytes(gzipDelta)}`)
}

if (updateBaselinePath) {
  const previous = existsSync(updateBaselinePath)
    ? JSON.parse(readFileSync(updateBaselinePath, 'utf8'))
    : {
        thresholds: {
          all: { raw: 0, gzip: 0 },
          js: { raw: 0, gzip: 0 },
          css: { raw: 0, gzip: 0 },
        },
      }
  writeFileSync(
    updateBaselinePath,
    `${JSON.stringify(
      {
        measuredAtCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
          encoding: 'utf8',
        }).trim(),
        thresholds: previous.thresholds,
        baseline: baselineValues(head),
      },
      null,
      2
    )}\n`
  )
  console.log(`Updated committed bundle baseline: ${updateBaselinePath}`)
} else if (baselinePath) {
  const expected = JSON.parse(readFileSync(baselinePath, 'utf8'))
  const actual = baselineValues(head)
  const failures = []
  if (head.totals.gzipAssetCount !== head.assetCount) {
    failures.push(
      `gzip assets: expected ${head.assetCount}, actual ${head.totals.gzipAssetCount}, threshold 0 missing files`
    )
  }
  for (const scope of ['all', 'js', 'css']) {
    for (const metric of ['raw', 'gzip']) {
      const baseline = expected.baseline?.[scope]?.[metric]
      const threshold = expected.thresholds?.[scope]?.[metric]
      const value = actual[scope][metric]
      if (!Number.isFinite(baseline) || !Number.isFinite(threshold)) {
        failures.push(`${scope} ${metric}: expected baseline and threshold are missing`)
      } else if (value > baseline + threshold) {
        failures.push(
          `${scope} ${metric}: expected ${baseline} bytes, actual ${value} bytes, threshold +${threshold} bytes (max ${baseline + threshold} bytes)`
        )
      }
    }
  }
  if (failures.length) {
    console.error(
      `Bundle size baseline exceeded:\n${failures.map((failure) => `- ${failure}`).join('\n')}\nIf the growth is intentional, rerun this command with --update-baseline ${baselinePath} instead of --baseline ${baselinePath}, then commit the baseline.`
    )
    process.exitCode = 1
  } else {
    console.log(
      `Bundle size baseline passed (${baselinePath}; all raw ${actual.all.raw} bytes, all gzip ${actual.all.gzip} bytes)`
    )
  }
}

function usage() {
  console.error(
    'Usage: compare-webpack-stats.mjs --base <stats.json> --head <stats.json> [--base-dist <dir>] [--head-dist <dir>] [--out <markdown>] [--baseline <baseline.json> | --update-baseline <baseline.json>]'
  )
  process.exit(1)
}

function baselineValues(summary) {
  return {
    all: { raw: summary.totals.raw, gzip: summary.totals.gzip },
    js: { raw: summary.byKind.js.raw, gzip: summary.byKind.js.gzip },
    css: { raw: summary.byKind.css.raw, gzip: summary.byKind.css.gzip },
  }
}

function requiredArg(name) {
  const value = args.get(name)
  if (!value) usage()
  return value
}

function summarizeStats(statsPath, distDir) {
  const stats = JSON.parse(readFileSync(statsPath, 'utf8'))
  const assets = Array.isArray(stats.assets) ? stats.assets : []
  const filtered = assets
    .filter((asset) => typeof asset.name === 'string')
    .filter((asset) => !asset.name.endsWith('.map'))
    .filter((asset) => asset.name.endsWith('.js') || asset.name.endsWith('.css'))
    .map((asset) => {
      const raw = Number(asset.size) || 0
      const gzip = gzipAsset(distDir, asset.name)
      return {
        name: asset.name,
        kind: asset.name.endsWith('.css') ? 'css' : 'js',
        raw,
        gzip: gzip ?? 0,
        hasGzip: gzip !== null,
      }
    })

  return {
    label: basename(statsPath),
    assetCount: filtered.length,
    totals: sumAssets(filtered),
    byKind: {
      js: sumAssets(filtered.filter((asset) => asset.kind === 'js')),
      css: sumAssets(filtered.filter((asset) => asset.kind === 'css')),
    },
    largest: [...filtered].sort((a, b) => b.raw - a.raw).slice(0, 10),
  }
}

function gzipAsset(distDir, assetName) {
  if (!distDir) return null

  const path = join(distDir, assetName)
  if (!existsSync(path) || !statSync(path).isFile()) return null

  return gzipSync(readFileSync(path)).byteLength
}

function sumAssets(assets) {
  return assets.reduce(
    (sum, asset) => {
      sum.raw += asset.raw
      sum.gzip += asset.gzip
      if (asset.hasGzip) sum.gzipAssetCount += 1
      return sum
    },
    { raw: 0, gzip: 0, gzipAssetCount: 0 }
  )
}

function renderMarkdown(base, head) {
  const lines = [
    '# Kitchen Sink Bundle Delta',
    '',
    '| Scope | Base Raw | Head Raw | Raw Delta | Base Gzip | Head Gzip | Gzip Delta |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    renderRow('All JS/CSS', base.totals, head.totals),
    renderRow('JS', base.byKind.js, head.byKind.js),
    renderRow('CSS', base.byKind.css, head.byKind.css),
    '',
    `Base assets: ${base.assetCount}; head assets: ${head.assetCount}.`,
    '',
    '## Largest Head Assets',
    '',
    '| Asset | Raw | Gzip |',
    '| --- | ---: | ---: |',
  ]

  for (const asset of head.largest) {
    lines.push(
      `| \`${asset.name}\` | ${formatBytes(asset.raw)} | ${
        asset.hasGzip ? formatBytes(asset.gzip) : 'n/a'
      } |`
    )
  }

  lines.push('')
  return `${lines.join('\n')}\n`
}

function renderRow(label, base, head) {
  return `| ${label} | ${formatBytes(base.raw)} | ${formatBytes(head.raw)} | ${formatDelta(
    head.raw - base.raw
  )} | ${formatMaybeGzip(base)} | ${formatMaybeGzip(head)} | ${formatDelta(
    head.gzip - base.gzip
  )} |`
}

function formatMaybeGzip(total) {
  return total.gzipAssetCount > 0 ? formatBytes(total.gzip) : 'n/a'
}

function formatDelta(bytes) {
  const sign = bytes > 0 ? '+' : ''
  return `${sign}${formatBytes(bytes)}`
}

function formatBytes(bytes) {
  const abs = Math.abs(bytes)
  if (abs >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  if (abs >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}
