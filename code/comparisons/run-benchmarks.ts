#!/usr/bin/env bun
/**
 * runs all framework benchmarks and produces a comparison table.
 *
 * usage:
 *   bun code/comparisons/run-benchmarks.ts
 *   bun code/comparisons/run-benchmarks.ts --runs=3    # average over N runs
 *   bun code/comparisons/run-benchmarks.ts --html      # also output HTML
 */

import { execSync, spawn, type ChildProcess } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const args = process.argv.slice(2)
const numRuns = parseInt(args.find((a) => a.startsWith('--runs='))?.split('=')[1] ?? '3')
const outputHtml = args.includes('--html')

const SCENARIOS = ['simple', 'rich', 'animated']
const SCENARIO_LABELS: Record<string, string> = {
  simple: 'Simple (static props)',
  rich: 'Rich (pseudo states)',
  animated: 'Animated (spring)',
}

interface BenchConfig {
  name: string
  dir: string
  port: number
  startCmd: string
  env?: Record<string, string>
}

const benchmarks: BenchConfig[] = [
  {
    name: 'Tamagui (compiled)',
    dir: 'tamagui-bench',
    port: 9101,
    startCmd: 'npx vite --port 9101',
    env: { EXTRACT: '1' },
  },
  {
    name: 'Tailwind CSS',
    dir: 'tailwind-bench',
    port: 9102,
    startCmd: 'npx vite --port 9102',
  },
  {
    name: 'Inline (baseline)',
    dir: 'inline-bench',
    port: 9103,
    startCmd: 'npx vite --port 9103',
  },
  {
    name: 'NativeWind v4',
    dir: 'nativewind-bench',
    port: 9104,
    startCmd: 'npx vite --port 9104',
  },
  {
    name: 'Uniwind',
    dir: 'uniwind-bench',
    port: 9105,
    startCmd: 'npx vite --port 9105',
  },
]

type Results = Record<string, Record<string, { mount: number; rerender: number }>>

async function waitForServer(port: number, timeout = 30000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`http://localhost:${port}/`)
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

function killPort(port: number) {
  try {
    const pids = execSync(`lsof -ti:${port} 2>/dev/null`).toString().trim()
    if (pids) {
      for (const pid of pids.split('\n')) {
        try { process.kill(parseInt(pid)) } catch {}
      }
    }
  } catch {}
}

async function runBenchmark(port: number): Promise<Record<string, { mount: number; rerender: number }>> {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(`http://localhost:${port}`)
  await page.waitForSelector('#bench-start', { timeout: 10000 })
  await page.click('#bench-start')
  await page.waitForSelector('#bench-result-animated-rerender', { timeout: 60000 })

  const results: Record<string, { mount: number; rerender: number }> = {}
  for (const s of SCENARIOS) {
    const mount = await page.locator(`#bench-result-${s}-mount`).getAttribute('data-value')
    const rerender = await page.locator(`#bench-result-${s}-rerender`).getAttribute('data-value')
    results[s] = {
      mount: parseFloat(mount ?? '0'),
      rerender: parseFloat(rerender ?? '0'),
    }
  }

  await browser.close()
  return results
}

function averageResults(
  allRuns: Record<string, { mount: number; rerender: number }>[]
): Record<string, { mount: number; rerender: number }> {
  const avg: Record<string, { mount: number; rerender: number }> = {}
  for (const s of SCENARIOS) {
    const mounts = allRuns.map((r) => r[s].mount)
    const rerenders = allRuns.map((r) => r[s].rerender)
    // drop highest and lowest if >= 3 runs
    if (mounts.length >= 3) {
      mounts.sort((a, b) => a - b)
      rerenders.sort((a, b) => a - b)
      mounts.shift(); mounts.pop()
      rerenders.shift(); rerenders.pop()
    }
    avg[s] = {
      mount: mounts.reduce((a, b) => a + b, 0) / mounts.length,
      rerender: rerenders.reduce((a, b) => a + b, 0) / rerenders.length,
    }
  }
  return avg
}

function printTable(results: Results) {
  const frameworks = Object.keys(results)
  const colWidth = 16

  // header
  console.log('')
  console.log('╔' + '═'.repeat(22) + frameworks.map(() => '═'.repeat(colWidth + 1)).join('') + '╗')
  console.log(
    '║' +
      ' Mount (ms)'.padEnd(22) +
      frameworks.map((f) => f.padStart(colWidth) + ' ').join('') +
      '║'
  )
  console.log('╠' + '═'.repeat(22) + frameworks.map(() => '═'.repeat(colWidth + 1)).join('') + '╣')

  // find baseline (inline) for ratio
  const baseline = results['Inline (baseline)']

  for (const s of SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = frameworks.map((f) => {
      const v = results[f][s].mount
      const ratio = baseline ? (v / baseline[s].mount).toFixed(1) + 'x' : ''
      return `${v.toFixed(1)}${ratio ? ' (' + ratio + ')' : ''}`.padStart(colWidth)
    })
    console.log('║' + label + vals.join(' ') + ' ║')
  }

  console.log('╠' + '═'.repeat(22) + frameworks.map(() => '═'.repeat(colWidth + 1)).join('') + '╣')
  console.log(
    '║' +
      ' Re-render (ms)'.padEnd(22) +
      frameworks.map((f) => f.padStart(colWidth) + ' ').join('') +
      '║'
  )
  console.log('╠' + '═'.repeat(22) + frameworks.map(() => '═'.repeat(colWidth + 1)).join('') + '╣')

  for (const s of SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = frameworks.map((f) => {
      const v = results[f][s].rerender
      const ratio = baseline ? (v / baseline[s].rerender).toFixed(1) + 'x' : ''
      return `${v.toFixed(1)}${ratio ? ' (' + ratio + ')' : ''}`.padStart(colWidth)
    })
    console.log('║' + label + vals.join(' ') + ' ║')
  }

  console.log('╚' + '═'.repeat(22) + frameworks.map(() => '═'.repeat(colWidth + 1)).join('') + '╝')
  console.log('')
  console.log(`  ${numRuns} run(s), 500 components per scenario`)
  if (numRuns >= 3) console.log('  (min/max dropped)')
  console.log('')
}

function generateHtml(results: Results): string {
  const frameworks = Object.keys(results)
  const baseline = results['Inline (baseline)']

  const colorForRatio = (ratio: number) => {
    if (ratio <= 1.2) return '#22c55e'
    if (ratio <= 2.0) return '#f59e0b'
    return '#ef4444'
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Benchmark Comparison</title>
<style>
  body { font-family: system-ui; background: #0a0a0a; color: #eee; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .sub { color: #888; font-size: 14px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 10px 14px; text-align: right; border-bottom: 1px solid #222; }
  th:first-child, td:first-child { text-align: left; }
  th { background: #141414; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  tr:hover td { background: #141414; }
  .section-header td { font-weight: 600; background: #1a1a1a; border-top: 2px solid #333; }
  .ratio { font-size: 11px; color: #888; }
  .value { font-weight: 600; font-family: monospace; }
</style>
</head>
<body>
<h1>Benchmark Comparison</h1>
<p class="sub">500 components · ${numRuns} run(s)${numRuns >= 3 ? ' (min/max dropped)' : ''}</p>
<table>
<thead>
<tr><th>Scenario</th>${frameworks.map((f) => `<th>${f}</th>`).join('')}</tr>
</thead>
<tbody>
<tr class="section-header"><td colspan="${frameworks.length + 1}">Mount (ms)</td></tr>
${SCENARIOS.map((s) => {
    return `<tr><td>${SCENARIO_LABELS[s]}</td>${frameworks
      .map((f) => {
        const v = results[f][s].mount
        const ratio = baseline ? v / baseline[s].mount : 1
        const color = colorForRatio(ratio)
        return `<td><span class="value" style="color:${color}">${v.toFixed(1)}</span> <span class="ratio">${ratio.toFixed(1)}x</span></td>`
      })
      .join('')}</tr>`
  }).join('\n')}
<tr class="section-header"><td colspan="${frameworks.length + 1}">Re-render (ms)</td></tr>
${SCENARIOS.map((s) => {
    return `<tr><td>${SCENARIO_LABELS[s]}</td>${frameworks
      .map((f) => {
        const v = results[f][s].rerender
        const ratio = baseline ? v / baseline[s].rerender : 1
        const color = colorForRatio(ratio)
        return `<td><span class="value" style="color:${color}">${v.toFixed(1)}</span> <span class="ratio">${ratio.toFixed(1)}x</span></td>`
      })
      .join('')}</tr>`
  }).join('\n')}
</tbody>
</table>
</body>
</html>`
}

// ── main ─────────────────────────────────────────────

async function main() {
  console.log(`\n🏁 Running benchmarks (${numRuns} run(s) per framework)...\n`)

  const processes: ChildProcess[] = []
  const allResults: Results = {}

  try {
    // start all servers
    for (const bench of benchmarks) {
      killPort(bench.port)
      console.log(`  Starting ${bench.name} on :${bench.port}...`)
      const proc = spawn('sh', ['-c', bench.startCmd], {
        cwd: join(import.meta.dir, bench.dir),
        env: { ...process.env, ...bench.env },
        stdio: 'pipe',
      })
      processes.push(proc)
    }

    // wait for all servers, track which ones are ready
    const readyBenchmarks: BenchConfig[] = []
    for (const bench of benchmarks) {
      const ok = await waitForServer(bench.port)
      if (!ok) {
        console.log(`  ⚠ ${bench.name} failed to start on :${bench.port} — skipping`)
      } else {
        console.log(`  ✓ ${bench.name} ready`)
        readyBenchmarks.push(bench)
      }
    }

    console.log('')

    // run benchmarks
    for (const bench of readyBenchmarks) {
      process.stdout.write(`  Running ${bench.name}...`)
      try {
        const runs: Record<string, { mount: number; rerender: number }>[] = []
        for (let i = 0; i < numRuns; i++) {
          const result = await runBenchmark(bench.port)
          runs.push(result)
          process.stdout.write(` #${i + 1}`)
        }
        allResults[bench.name] = numRuns >= 3 ? averageResults(runs) : runs[runs.length - 1]
        console.log(' ✓')
      } catch (err: any) {
        console.log(` ❌ ${err.message}`)
      }
    }

    // output
    printTable(allResults)

    if (outputHtml) {
      const outDir = join(import.meta.dir, 'output')
      mkdirSync(outDir, { recursive: true })
      const html = generateHtml(allResults)
      const outPath = join(outDir, 'benchmarks.html')
      writeFileSync(outPath, html)
      console.log(`  HTML report: ${outPath}\n`)
    }
  } finally {
    // kill all servers
    for (const proc of processes) {
      proc.kill()
    }
    for (const bench of benchmarks) {
      killPort(bench.port)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
