import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// layout poll interval is ~233ms (14 frames)
const POLL_WAIT = 350
const INITIAL_SETTLE_TIME = 1000

// gating thresholds - fail if exceeded
const MAX_IO_DELAY_MS = 100 // fail if IO callback takes > 100ms
const MAX_WARNINGS_PER_TEST = 3 // fail if too many warnings

async function collectConsoleWarnings(page: Page): Promise<{ count: number; avgDelay: number; maxDelay: number }> {
  const result = await page.evaluate(() => {
    const warnings = (window as any).__ioDelayWarnings || []
    if (warnings.length === 0) return { count: 0, avgDelay: 0, maxDelay: 0 }
    const sum = warnings.reduce((a: number, b: number) => a + b, 0)
    const max = Math.max(...warnings)
    return { count: warnings.length, avgDelay: Math.round(sum / warnings.length), maxDelay: max }
  })
  return result
}

async function getStats(page: Page): Promise<{ total: number; lastBatch: number; lastTime: number; max: number }> {
  const total = await page.getByTestId('stat-total').innerText()
  const lastBatch = await page.getByTestId('stat-last-batch').innerText()
  const lastTime = await page.getByTestId('stat-last-time').innerText()
  const max = await page.getByTestId('stat-max').innerText()

  return {
    total: parseInt(total.replace('total: ', ''), 10) || 0,
    lastBatch: parseInt(lastBatch.replace('lastBatch: ', ''), 10) || 0,
    lastTime: parseInt(lastTime.replace('lastTime: ', ''), 10) || 0,
    max: parseInt(max.replace('max: ', '').replace('ms', ''), 10) || 0,
  }
}

test.describe('onLayout stress test', () => {
  test.beforeEach(async ({ page }) => {
    // set up console warning tracking
    // BUG FIX: console.warn('[onLayout-io-delay]', delay + 'ms', ...) puts delay in args[1]
    await page.addInitScript(() => {
      ;(window as any).__ioDelayWarnings = []
      const originalWarn = console.warn
      console.warn = (...args: any[]) => {
        const prefix = args[0]
        const delayArg = args[1] // delay is in second argument
        if (typeof prefix === 'string' && prefix.includes('[onLayout-io-delay]')) {
          if (typeof delayArg === 'string') {
            const match = delayArg.match(/(\d+)ms/)
            if (match) {
              ;(window as any).__ioDelayWarnings.push(parseInt(match[1], 10))
            }
          }
        }
        originalWarn.apply(console, args)
      }
    })

    await setupPage(page, { name: 'OnLayoutStressCase', type: 'useCase' })
  })

  test('initial render should not exceed threshold', async ({ page }) => {
    // wait for initial layout callbacks to settle
    await page.waitForTimeout(INITIAL_SETTLE_TIME)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== INITIAL RENDER BENCHMARK ===')
    console.log(`total callbacks: ${stats.total}`)
    console.log(`last batch size: ${stats.lastBatch}`)
    console.log(`max batch time: ${stats.max}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)
    if (warnings.count > 0) {
      console.log(`avg IO delay: ${warnings.avgDelay}ms`)
      console.log(`max IO delay: ${warnings.maxDelay}ms`)
    }

    // gating assertions
    expect(stats.total, 'should have onLayout callbacks').toBeGreaterThan(50)
    expect(warnings.maxDelay, `IO delay should be < ${MAX_IO_DELAY_MS}ms`).toBeLessThan(MAX_IO_DELAY_MS)
  })

  test('resize should trigger batch updates efficiently', async ({ page }) => {
    await page.waitForTimeout(INITIAL_SETTLE_TIME)

    // reset stats after initial render
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)

    // trigger width resize
    await page.getByTestId('btn-resize-width').click()
    await page.waitForTimeout(POLL_WAIT * 2)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== WIDTH RESIZE BENCHMARK ===')
    console.log(`callbacks after resize: ${stats.total}`)
    console.log(`last batch size: ${stats.lastBatch}`)
    console.log(`last batch time: ${stats.lastTime}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)

    // gating assertions
    expect(stats.total, 'resize should trigger callbacks').toBeGreaterThan(0)
    expect(warnings.count, `should have fewer than ${MAX_WARNINGS_PER_TEST} warnings`).toBeLessThan(MAX_WARNINGS_PER_TEST)
  })

  test('grid resize should trigger efficient updates', async ({ page }) => {
    await page.waitForTimeout(INITIAL_SETTLE_TIME)
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)

    await page.getByTestId('btn-resize-grid').click()
    await page.waitForTimeout(POLL_WAIT * 2)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== GRID RESIZE BENCHMARK ===')
    console.log(`callbacks: ${stats.total}`)
    console.log(`batch time: ${stats.lastTime}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)

    // gating assertions - 40 grid items should trigger ~40 callbacks
    expect(stats.total, 'grid resize should trigger callbacks').toBeGreaterThan(20)
    expect(warnings.maxDelay, `IO delay should be < ${MAX_IO_DELAY_MS}ms`).toBeLessThan(MAX_IO_DELAY_MS)
  })

  test('list expand should trigger efficient updates', async ({ page }) => {
    await page.waitForTimeout(INITIAL_SETTLE_TIME)
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)

    await page.getByTestId('btn-toggle-expand').click()
    await page.waitForTimeout(POLL_WAIT * 2)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== LIST EXPAND BENCHMARK ===')
    console.log(`callbacks: ${stats.total}`)
    console.log(`batch time: ${stats.lastTime}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)

    // gating assertions - 20 list items should trigger ~20 callbacks
    expect(stats.total, 'list expand should trigger callbacks').toBeGreaterThan(10)
    expect(warnings.maxDelay, `IO delay should be < ${MAX_IO_DELAY_MS}ms`).toBeLessThan(MAX_IO_DELAY_MS)
  })

  test('container resize affects all children', async ({ page }) => {
    await page.waitForTimeout(INITIAL_SETTLE_TIME)
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)

    await page.getByTestId('btn-resize-container').click()
    await page.waitForTimeout(POLL_WAIT * 2)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== CONTAINER RESIZE BENCHMARK ===')
    console.log(`callbacks: ${stats.total}`)
    console.log(`batch time: ${stats.lastTime}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)

    // gating assertion
    expect(warnings.maxDelay, `IO delay should be < ${MAX_IO_DELAY_MS}ms`).toBeLessThan(MAX_IO_DELAY_MS)
  })

  test('rapid successive resizes', async ({ page }) => {
    await page.waitForTimeout(INITIAL_SETTLE_TIME)
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)

    // rapid fire multiple resize operations
    for (let i = 0; i < 5; i++) {
      await page.getByTestId('btn-resize-width').click()
      await page.waitForTimeout(50)
      await page.getByTestId('btn-resize-grid').click()
      await page.waitForTimeout(50)
    }

    await page.waitForTimeout(POLL_WAIT * 3)

    const stats = await getStats(page)
    const warnings = await collectConsoleWarnings(page)

    console.log('=== RAPID RESIZE BENCHMARK ===')
    console.log(`total callbacks: ${stats.total}`)
    console.log(`max batch time: ${stats.max}ms`)
    console.log(`IO delay warnings: ${warnings.count}`)
    if (warnings.count > 0) {
      console.log(`avg IO delay: ${warnings.avgDelay}ms`)
      console.log(`max IO delay: ${warnings.maxDelay}ms`)
    }

    // gating assertion - rapid resize is stressful but shouldn't explode
    expect(warnings.maxDelay, `IO delay should be < ${MAX_IO_DELAY_MS}ms even under stress`).toBeLessThan(MAX_IO_DELAY_MS)
  })

  test('full benchmark suite', async ({ page }) => {
    const results: Record<string, any> = {}

    // initial render
    await page.waitForTimeout(INITIAL_SETTLE_TIME)
    results.initial = {
      ...(await getStats(page)),
      warnings: await collectConsoleWarnings(page),
    }

    // width resize
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)
    await page.getByTestId('btn-resize-width').click()
    await page.waitForTimeout(POLL_WAIT * 2)
    results.widthResize = {
      ...(await getStats(page)),
      warnings: await collectConsoleWarnings(page),
    }

    // grid resize
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)
    await page.getByTestId('btn-resize-grid').click()
    await page.waitForTimeout(POLL_WAIT * 2)
    results.gridResize = {
      ...(await getStats(page)),
      warnings: await collectConsoleWarnings(page),
    }

    // expand list
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)
    await page.getByTestId('btn-toggle-expand').click()
    await page.waitForTimeout(POLL_WAIT * 2)
    results.listExpand = {
      ...(await getStats(page)),
      warnings: await collectConsoleWarnings(page),
    }

    // container resize
    await page.getByTestId('btn-reset-stats').click()
    await page.waitForTimeout(100)
    await page.getByTestId('btn-resize-container').click()
    await page.waitForTimeout(POLL_WAIT * 2)
    results.containerResize = {
      ...(await getStats(page)),
      warnings: await collectConsoleWarnings(page),
    }

    console.log('\n========== FULL BENCHMARK RESULTS ==========')
    console.log(JSON.stringify(results, null, 2))
    console.log('=============================================\n')

    // calculate aggregate metrics
    const allMaxDelays = Object.values(results).map((r: any) => r.warnings?.maxDelay || 0)
    const overallMaxDelay = Math.max(...allMaxDelays)
    const totalWarnings = Object.values(results).reduce(
      (sum: number, r: any) => sum + (r.warnings?.count || 0),
      0
    )

    console.log(`AGGREGATE: ${totalWarnings} total warnings, ${overallMaxDelay}ms max IO delay`)

    // gating assertions for the full suite
    expect(overallMaxDelay, `max IO delay across all tests should be < ${MAX_IO_DELAY_MS}ms`).toBeLessThan(MAX_IO_DELAY_MS)
  })
})
