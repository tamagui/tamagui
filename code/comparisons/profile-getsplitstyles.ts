#!/usr/bin/env bun
/**
 * profiles getSplitStyles for the group + heavy scenarios in the runtime
 * (non-extracted) tamagui-bench app on :9106.
 *
 * how it works:
 *   1. injects globalThis.time = timer.start({quiet:true}) BEFORE the React
 *      tree mounts (init script on page navigation).
 *   2. createComponent.tsx + getSplitStyles.tsx use the bare `time\`label\``
 *      tagged-template call, which resolves to globalThis.time. they only fire
 *      when (globalThis as any).time is truthy.
 *   3. createComponent's render closure auto-calls time.print() ~50ms after
 *      the last render, dumping per-label totals to console.info as a single
 *      string. we hook page.on('console') and capture it.
 *
 * usage:
 *   bun code/comparisons/profile-getsplitstyles.ts             # group + heavy
 *   bun code/comparisons/profile-getsplitstyles.ts simple      # just one
 *
 * prerequisite: the runtime tamagui-bench dev server on :9106 (EXTRACT=0).
 *   cd code/comparisons/tamagui-bench && EXTRACT=0 npx vite --port 9106
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const ALL_SCENARIOS = ['simple', 'rich', 'group', 'heavy', 'animated'] as const
type Scenario = (typeof ALL_SCENARIOS)[number]

const targets =
  (process.argv.slice(2).filter((a) => !a.startsWith('--')) as Scenario[]) ?? []
const scenarios: Scenario[] = targets.length > 0 ? targets : ['group', 'heavy']

// keep the dataset small so we capture HOT-FRAME breakdown, not throughput.
// per-render getSplitStyles cost is the same; we just want enough renders to
// average noise out without blowing past playwright's 60s ceiling.
const SCALE = 50
const PORT = 9106

// the timer's print() is auto-fired by createComponent.tsx 50ms after the last
// render, via globalThis.willPrint. we listen for the console.info payload.
async function profileScenario(scenario: Scenario) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  let printed = ''
  page.on('console', (msg) => {
    if (msg.type() !== 'info') return
    const txt = msg.text()
    if (txt.includes('per-type') && txt.includes('total')) {
      printed = txt
    }
  })

  // skip every scenario EXCEPT the target. the bench app reads ?skip= from the
  // URL and filters allScenarios down — only the target runs, so the auto-print
  // happens with timings attributable to ONE scenario.
  const skip = ALL_SCENARIOS.filter((s) => s !== scenario).join(',')
  const url = `http://localhost:${PORT}/?scale=${SCALE}&skip=${skip}`

  // inject the timer onto window BEFORE any module evaluates. we inline the
  // timer impl (copied from @tamagui/timer's dist/esm/index.mjs) so we don't
  // need to fetch it through vite. quiet:true so individual time`...` calls
  // don't spam — only the final print() output is emitted.
  await page.addInitScript(() => {
    const timings: Record<string, number> = {}
    const typesOfRuns = new Set<string>()
    let runs = 0
    let start = performance.now()
    function time(strings: TemplateStringsArray, ...vars: any[]) {
      const elapsed = performance.now() - start
      let tag = ''
      strings.forEach((str, i) => {
        tag += str + (vars[i] !== undefined ? vars[i] : '')
      })
      // collapse before-prop-${keyInit} into a single bucket per prop key
      // so the printout isn't one row per key. keyInit is already the bucket.
      typesOfRuns.add(tag)
      runs++
      timings[tag] ??= 0
      timings[tag] += elapsed
      start = performance.now()
    }
    ;(time as any).print = function () {
      const typeRuns = runs / typesOfRuns.size
      let totalTime = 0
      const out = [
        `Ran ${typeRuns} per-type, ${runs} total`,
        ...[...typesOfRuns].map((name) => {
          if (name.endsWith('(ignore)')) return
          const avg = `avg ${`${timings[name] / typeRuns}`.slice(0, 9).padEnd(9)}ms`
          const total = timings[name]
          totalTime += total
          return `${name.slice(0, 40).padStart(41)} | ${avg} | total ${total}ms`
        }),
        `                                              total ${totalTime}ms`,
      ].join('\n')
      console.info(out)
      // also stash on window so we can read it deterministically
      ;(globalThis as any).__timerOutput = out
      return out
    }
    ;(globalThis as any).time = time
  })

  console.log(`  → profiling ${scenario} @ scale=${SCALE} ...`)
  await page.goto(url)
  await page.waitForSelector('#bench-start', { timeout: 30_000 })
  await page.click('#bench-start')

  // wait for the bench-results to show up. that's the marker that mount+rerender
  // both completed. then wait a bit more for the 50ms auto-print + flush.
  await page.waitForSelector(`#bench-result-${scenario}-rerender`, { timeout: 120_000 })
  await page.waitForFunction(() => (globalThis as any).__timerOutput, { timeout: 5_000 })

  const fromWindow: string = await page.evaluate(() => (globalThis as any).__timerOutput)
  printed = printed || fromWindow

  await browser.close()
  return printed
}

async function main() {
  // confirm server is up
  try {
    const r = await fetch(`http://localhost:${PORT}/`)
    if (!r.ok) throw new Error('not ok')
  } catch {
    console.error(`✗ runtime tamagui-bench dev server not running on :${PORT}`)
    console.error(`  start it with:`)
    console.error(
      `    cd code/comparisons/tamagui-bench && EXTRACT=0 npx vite --port ${PORT}`
    )
    process.exit(1)
  }

  const outDir = join(import.meta.dir, 'output', 'profile')
  mkdirSync(outDir, { recursive: true })

  for (const s of scenarios) {
    const out = await profileScenario(s)
    console.log('')
    console.log(`════ ${s} ════`)
    console.log(out)
    const path = join(outDir, `${s}.txt`)
    writeFileSync(path, out)
    console.log(`(written to ${path})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
