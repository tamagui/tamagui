import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Performance profiling test for the StressPage.
 *
 * Drives RERENDER_RUNS deterministic full-tree remounts of a diverse page with
 * ~200 Tamagui components and measures:
 *   1. wall-clock render time (performance.mark/measure) for mount + each remount,
 *   2. per-render heap ALLOCATION via the CDP HeapProfiler sampling profiler,
 *      reported as total bytes and, for human review, bytes attributed to the
 *      @tamagui/web render-path functions (function-name based, since webpack
 *      bundles everything into one file).
 *
 * The assertion is a GROSS-regression guard on total per-render allocation — it
 * catches a hot-path blowup (e.g. deep-cloning props, per-render JSON work) with
 * wide margin for sampling/GC variance. The finer per-frame numbers are logged
 * for before/after comparison but are too noisy to gate on. This replaces the
 * old `median > 0` check, which caught nothing.
 *
 * Run:
 *   npx playwright test tests/StressPagePerf.test.tsx --project=default
 */

const RERENDER_RUNS = 25

// gross-regression ceiling on TOTAL sampled allocation per render. observed ~237
// KB/render post-fix; this ~1.8x headroom never flakes on variance but trips on a
// hot-path allocation blowup.
const TOTAL_ALLOC_PER_RENDER_CEILING = 420_000

// @tamagui/web render-path functions, used only to LOG focused allocation for
// before/after review (not asserted — coupled to internal names and sampling-noisy).
const TAMAGUI_RENDER_FRAMES = new Set([
  'component', // createComponent inner render fn (where the removed ref-clone lived)
  'getSplitStyles',
  'useSplitStyles',
  'getStyleObject',
  'useComponentState',
  'objectIdentityKey',
  'useMedia',
  'useThemeState',
  'useThemeWithState',
  'setElementProps',
  'getThemedChildren',
  'preprocessFlatProps',
  'mergeComponentProps',
  'mergeProps',
  'getDefaultProps',
  'getWebEvents',
  'composeRefs',
  // babel-lowered object rest/spread helpers (a re-introduced props clone lands here)
  '_objectWithoutProperties',
  '_objectWithoutPropertiesLoose',
  '_objectSpread',
  '_objectSpread2',
  '_extends',
])

type SamplingNode = {
  callFrame: { functionName: string; url: string }
  selfSize: number
  children?: SamplingNode[]
}

// sum selfSize across the sampling tree, optionally only for frames matching `pred`
function sumSelfSize(
  head: SamplingNode,
  pred?: (cf: SamplingNode['callFrame']) => boolean
) {
  let total = 0
  const stack: SamplingNode[] = [head]
  while (stack.length) {
    const node = stack.pop()!
    if (!pred || pred(node.callFrame)) total += node.selfSize
    if (node.children) for (const c of node.children) stack.push(c)
  }
  return total
}

test('StressPage render + allocation profiling', async ({ page }) => {
  // heavy: drives RERENDER_RUNS full-tree remounts of ~200 components in dev webpack
  test.setTimeout(150_000)

  await setupPage(page, {
    name: 'StressPage',
    type: 'useCase',
    searchParams: { profile: 'true' },
    waitExtra: true,
  })

  // wait until the initial mount finished and the remount trigger is exposed
  await page.waitForFunction(() => (window as any).__STRESS_READY__, { timeout: 20_000 })

  // sample allocations only across the forced remount batch (module eval and
  // first-mount fiber creation already happened, so this isolates render work)
  const client = await page.context().newCDPSession(page)
  await client.send('HeapProfiler.enable')
  await client.send('HeapProfiler.startSampling', { samplingInterval: 2048 })

  await page.evaluate((runs) => (window as any).__STRESS_RERENDER__(runs), RERENDER_RUNS)
  await page.waitForFunction(() => (window as any).__PERF_RESULT__, { timeout: 60_000 })

  const { profile } = (await client.send('HeapProfiler.stopSampling')) as {
    profile: { head: SamplingNode }
  }
  await client.send('HeapProfiler.disable')
  await client.detach()

  const result = await page.evaluate(() => (window as any).__PERF_RESULT__)
  const runs: number = result.rerenderRuns || RERENDER_RUNS

  const totalBytes = sumSelfSize(profile.head)
  const tamaguiBytes = sumSelfSize(profile.head, (cf) =>
    TAMAGUI_RENDER_FRAMES.has(cf.functionName)
  )
  const componentBytes = sumSelfSize(profile.head, (cf) => cf.functionName === 'component')
  const totalPerRender = Math.round(totalBytes / runs)
  const tamaguiPerRender = Math.round(tamaguiBytes / runs)
  const componentPerRender = Math.round(componentBytes / runs)

  console.log(`\n=== StressPage Profile (${runs} forced full-tree remounts) ===`)
  console.log(`  Mount: ${result.renderMs}ms`)
  console.log(
    `  Re-render ms: median ${result.rerenderMedianMs} | mean ${result.rerenderMeanMs} | ` +
      `min ${Math.min(...result.rerenderMs)} | max ${Math.max(...result.rerenderMs)}`
  )
  console.log(`  --- Allocation (CDP heap sampling, interval 2048B) ---`)
  console.log(
    `  total:               ${(totalPerRender / 1024).toFixed(1)}KB/render ` +
      `(${(totalBytes / 1e6).toFixed(2)}MB / ${runs}, ceiling ` +
      `${(TOTAL_ALLOC_PER_RENDER_CEILING / 1024).toFixed(0)}KB)`
  )
  console.log(
    `  @tamagui/web frames: ${(tamaguiPerRender / 1024).toFixed(1)}KB/render (info)`
  )
  console.log(
    `  createComponent fn:  ${(componentPerRender / 1024).toFixed(1)}KB/render ` +
      `(info — direct site of the removed per-render props clone)`
  )

  if (result.breakdown) {
    console.log(`  --- Internal timer breakdown (cumulative across all renders) ---`)
    let propTotal = 0
    const phases: [string, number][] = []
    for (const [label, totalMs] of Object.entries(result.breakdown) as [
      string,
      number,
    ][]) {
      if (label.endsWith('(ignore)')) continue
      if (label.startsWith('before-prop-')) propTotal += totalMs
      else phases.push([label, totalMs])
    }
    phases.push(['before-prop-* (all props)', propTotal])
    phases.sort((a, b) => b[1] - a[1])
    for (const [label, totalMs] of phases) {
      if (totalMs < 0.05) continue
      console.log(`  ${label.padStart(35)} | ${totalMs.toFixed(1)}ms`)
    }
  }
  console.log(`================================================\n`)

  // sanity: profiling produced real work + the remount batch completed
  expect(result.renderMs).toBeGreaterThan(0)
  expect(runs).toBe(RERENDER_RUNS)
  expect(totalPerRender).toBeGreaterThan(0)
  // gross hot-path allocation-regression guard (see ceiling note above)
  expect(totalPerRender).toBeLessThan(TOTAL_ALLOC_PER_RENDER_CEILING)
})
