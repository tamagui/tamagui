import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'BenchmarkComparison', type: 'useCase' })
})

// run all benchmarks automatically and collect results
test('auto benchmark - all scenarios complete', async ({ page }) => {
  // click the auto-run button
  const startBtn = page.locator('#bench-auto-start')
  await startBtn.click()

  // wait for results table to appear (all benchmarks done)
  const resultsTable = page.locator('#bench-results-table')
  await resultsTable.waitFor({ state: 'visible', timeout: 60000 })

  // collect all results
  const scenarios = ['simple', 'rich', 'animated']
  const renderers = {
    simple: ['flat', 'regular', 'inline'],
    rich: ['flat', 'styled', 'inline'],
    animated: ['flat', 'styled', 'inline'],
  }

  const results: Record<string, Record<string, { mount: string; rerender: string }>> = {}

  for (const scenario of scenarios) {
    results[scenario] = {}
    const rendererIds = renderers[scenario as keyof typeof renderers]
    for (const renderer of rendererIds) {
      const mountEl = page.locator(`#bench-result-${scenario}-${renderer}-mount`)
      const rerenderEl = page.locator(`#bench-result-${scenario}-${renderer}-rerender`)

      const mountVal = await mountEl.getAttribute('data-value')
      const rerenderVal = await rerenderEl.getAttribute('data-value')

      results[scenario][renderer] = {
        mount: mountVal ?? 'N/A',
        rerender: rerenderVal ?? 'N/A',
      }
    }
  }

  // log results in a readable table
  console.log('\n══════════════════════════════════════════════')
  console.log('  BENCHMARK RESULTS (500 components)')
  console.log('══════════════════════════════════════════════\n')

  for (const scenario of scenarios) {
    console.log(`  ${scenario.toUpperCase()}:`)
    for (const [renderer, data] of Object.entries(results[scenario])) {
      console.log(`    ${renderer.padEnd(10)} mount: ${data.mount.padStart(8)}ms  rerender: ${data.rerender.padStart(8)}ms`)
    }
    console.log('')
  }

  // basic sanity: all results should be numeric and > 0
  for (const scenario of scenarios) {
    for (const [renderer, data] of Object.entries(results[scenario])) {
      const mount = parseFloat(data.mount)
      const rerender = parseFloat(data.rerender)
      expect(mount, `${scenario}/${renderer} mount should be > 0`).toBeGreaterThan(0)
      expect(rerender, `${scenario}/${renderer} rerender should be > 0`).toBeGreaterThan(0)
    }
  }

  // screenshot the results
  await expect(resultsTable).toHaveScreenshot('benchmark-results.png', {
    maxDiffPixelRatio: 0.3, // numbers will vary between runs
  })
})
