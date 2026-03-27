import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'BenchmarkComparison', type: 'useCase' })
})

test('auto benchmark - all scenarios complete', async ({ page }) => {
  const startBtn = page.locator('#bench-auto-start')
  await startBtn.click()

  const resultsTable = page.locator('#bench-results-table')
  await resultsTable.waitFor({ state: 'visible', timeout: 60000 })

  const scenarios = ['simple', 'rich', 'animated']
  const renderers = {
    simple: ['classname', 'regular', 'styled', 'inline'],
    rich: ['classname', 'regular', 'styled', 'inline'],
    animated: ['classname', 'regular', 'styled', 'inline'],
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

  console.log('\n══════════════════════════════════════════════════════════')
  console.log('  BENCHMARK RESULTS (500 components)')
  console.log('══════════════════════════════════════════════════════════\n')

  for (const scenario of scenarios) {
    console.log(`  ${scenario.toUpperCase()}:`)
    for (const [renderer, data] of Object.entries(results[scenario])) {
      console.log(`    ${renderer.padEnd(12)} mount: ${data.mount.padStart(8)}ms  rerender: ${data.rerender.padStart(8)}ms`)
    }
    console.log('')
  }

  for (const scenario of scenarios) {
    for (const [renderer, data] of Object.entries(results[scenario])) {
      const mount = parseFloat(data.mount)
      const rerender = parseFloat(data.rerender)
      expect(mount, `${scenario}/${renderer} mount should be > 0`).toBeGreaterThan(0)
      expect(rerender, `${scenario}/${renderer} rerender should be > 0`).toBeGreaterThan(0)
    }
  }

  await expect(resultsTable).toHaveScreenshot('benchmark-results.png', {
    maxDiffPixelRatio: 0.3,
  })
})
