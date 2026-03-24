import { expect, test, type CDPSession, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// helper: use CDP Input.dispatchMouseEvent to simulate rapid mouse movement
// this generates real browser-level input events at high frequency,
// unlike Playwright's mouse.move which uses a synthetic approach
async function cdpMouseMove(
  cdp: CDPSession,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  steps: number,
  delayMs = 2
) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = Math.round(fromX + (toX - fromX) * t)
    const y = Math.round(fromY + (toY - fromY) * t)
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x,
      y,
      button: 'none',
      modifiers: 0,
    })
    if (delayMs > 0 && i < steps) {
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
}

async function getTriggerCenter(page: Page, id: string) {
  const box = await page.locator(`#${id}`).boundingBox()
  if (!box) throw new Error(`trigger #${id} not found`)
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

test.describe('Tooltip rapid trigger switch bugs', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'TooltipMultiTriggerCase',
      type: 'useCase',
    })
    await page.waitForLoadState('networkidle')
  })

  test('enter animation completes to full opacity after rapid CDP trigger switch', async ({
    page,
  }) => {
    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // move into trigger A to start tooltip enter animation
    await cdpMouseMove(cdp, a.x - 50, a.y, a.x, a.y, 10, 2)

    // wait just enough for tooltip to mount and enter animation to start
    // but NOT enough for it to complete (~medium transition is 200-300ms)
    await page.waitForTimeout(60)

    // rapidly sweep to trigger C — this should NOT interrupt the enter animation
    // use many small steps to pass through the gap between triggers,
    // which may briefly trigger mouseleave on A before mouseenter on C
    await cdpMouseMove(cdp, a.x, a.y, c.x, c.y, 30, 1)

    // wait for all animations to settle
    await page.waitForTimeout(800)

    await expect(content).toBeVisible({ timeout: 3000 })

    const opacity = await content.evaluate((el) => {
      return parseFloat(getComputedStyle(el).opacity)
    })
    expect(
      opacity,
      `tooltip should be fully opaque after trigger switch, got ${opacity}`
    ).toBeGreaterThan(0.95)
  })

  test('enter animation completes when trigger switch happens during first 50ms', async ({
    page,
  }) => {
    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const b = await getTriggerCenter(page, 'tip-trigger-b')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // rapidly sweep across all three triggers without pausing
    // this creates the pattern: enter A → leave A → enter B → leave B → enter C
    // all within ~100ms total, well within the enter animation duration
    await cdpMouseMove(cdp, a.x - 30, a.y, a.x, a.y, 5, 1)
    await cdpMouseMove(cdp, a.x, a.y, b.x, b.y, 8, 1)
    await cdpMouseMove(cdp, b.x, b.y, c.x, c.y, 8, 1)

    // wait for animations to settle
    await page.waitForTimeout(800)

    await expect(content).toBeVisible({ timeout: 3000 })

    const opacity = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(
      opacity,
      `tooltip should be fully opaque after rapid 3-trigger sweep, got ${opacity}`
    ).toBeGreaterThan(0.95)

    // also check the y transform isn't stuck at an intermediate value
    const transform = await content.evaluate((el) => getComputedStyle(el).transform)
    if (transform && transform !== 'none') {
      // extract translateY from matrix — matrix(a,b,c,d,tx,ty)
      const match = transform.match(/matrix\(([^)]+)\)/)
      if (match) {
        const values = match[1].split(',').map(Number)
        const ty = values[5] // translateY component
        // the enter animation goes from y:-4 to y:0, so ty should be close
        // to the final popper-calculated position, not stuck at an offset
        // we can't know the exact value, but it should NOT be NaN
        expect(Number.isNaN(ty), 'transform should not be NaN').toBe(false)
      }
    }
  })

  test('enter animation completes after rapid back-and-forth CDP sweep', async ({
    page,
  }) => {
    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // move into trigger A
    await cdpMouseMove(cdp, a.x - 50, a.y, a.x, a.y, 8, 2)
    await page.waitForTimeout(40)

    // rapid sweep: A → C → A → C (mimics real fast back-and-forth)
    await cdpMouseMove(cdp, a.x, a.y, c.x, c.y, 12, 1)
    await page.waitForTimeout(20)
    await cdpMouseMove(cdp, c.x, c.y, a.x, a.y, 12, 1)
    await page.waitForTimeout(20)
    await cdpMouseMove(cdp, a.x, a.y, c.x, c.y, 12, 1)

    // wait for animations to settle
    await page.waitForTimeout(800)

    await expect(content).toBeVisible({ timeout: 3000 })

    const opacity = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(
      opacity,
      `tooltip should be fully opaque after rapid sweep, got ${opacity}`
    ).toBeGreaterThan(0.95)
  })

  test('enter animation completes after zero-delay CDP trigger switch', async ({
    page,
  }) => {
    // the stuck-opacity bug requires switching triggers during the very
    // first frames of the enter animation — use zero delay between events
    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const b = await getTriggerCenter(page, 'tip-trigger-b')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // move into trigger A with zero-delay CDP events (maximum speed)
    await cdpMouseMove(cdp, a.x - 30, a.y, a.x, a.y, 5, 0)

    // no wait at all — switch to C immediately while tooltip is still mounting
    await cdpMouseMove(cdp, a.x, a.y, c.x, c.y, 20, 0)

    // wait for enter animation to complete
    await page.waitForTimeout(800)

    // check content visibility and opacity
    const isVisible = await content.isVisible().catch(() => false)
    if (!isVisible) {
      // tooltip might have closed — re-hover trigger C to reopen
      await cdpMouseMove(cdp, c.x - 20, c.y, c.x, c.y, 5, 1)
      await page.waitForTimeout(800)
    }

    await expect(content).toBeVisible({ timeout: 3000 })
    const opacity = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(
      opacity,
      `tooltip should be fully opaque after zero-delay switch, got ${opacity}`
    ).toBeGreaterThan(0.95)
  })

  test('enter animation completes after immediate A→B→C sweep with no pauses', async ({
    page,
  }) => {
    // simulate "as fast as possible" trigger switching — all events
    // dispatched with 0ms delay between steps
    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const b = await getTriggerCenter(page, 'tip-trigger-b')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // blast through all triggers at maximum CDP speed
    await cdpMouseMove(cdp, a.x - 20, a.y, a.x, a.y, 3, 0)
    await cdpMouseMove(cdp, a.x, a.y, b.x, b.y, 5, 0)
    await cdpMouseMove(cdp, b.x, b.y, c.x, c.y, 5, 0)

    // wait for animations
    await page.waitForTimeout(800)

    await expect(content).toBeVisible({ timeout: 3000 })
    const opacity = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(
      opacity,
      `tooltip should be fully opaque after instant A→B→C sweep, got ${opacity}`
    ).toBeGreaterThan(0.95)
  })

  test('tooltip does not flash to position (0,0) during rapid trigger switching', async ({
    page,
  }) => {
    // capture motion driver debug logs
    const motionLogs: string[] = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('[motion-debug-popper]')) {
        motionLogs.push(text)
      }
    })

    const content = page.locator('#tip-content')
    const cdp = await page.context().newCDPSession(page)

    const a = await getTriggerCenter(page, 'tip-trigger-a')
    const c = await getTriggerCenter(page, 'tip-trigger-c')

    // start by hovering trigger A to open tooltip
    await cdpMouseMove(cdp, a.x - 50, a.y, a.x, a.y, 10, 2)
    await page.waitForTimeout(300) // let tooltip fully open and enter animation complete

    // enable animation driver debug logging
    await page.evaluate(() => {
      ;(window as any).__motionDebug = true
      ;(window as any).__motionDebugLog = []
    })

    // intercept style.transform writes on the outer position element
    await page.evaluate(() => {
      const inner = document.getElementById('tip-content')
      if (!inner) return
      const outer = (inner.closest('[data-popper-animate-position]') ||
        inner.parentElement) as HTMLElement | null
      if (!outer) return
      ;(window as any).__transformWriteLog = []
      const log = (window as any).__transformWriteLog
      const realDescriptor = Object.getOwnPropertyDescriptor(
        CSSStyleDeclaration.prototype,
        'transform'
      )
      if (!realDescriptor) return
      Object.defineProperty(outer.style, 'transform', {
        get() {
          return realDescriptor.get!.call(this)
        },
        set(value: string) {
          log.push({
            value: String(value).substring(0, 100),
            t: performance.now(),
            stack: new Error().stack?.split('\n').slice(1, 5).join(' | '),
          })
          return realDescriptor.set!.call(this, value)
        },
        configurable: true,
      })
    })

    // set up in-browser rAF monitoring for highest fidelity
    // monitor BOTH the inner content element AND the outer position wrapper
    await page.evaluate(() => {
      const inner = document.getElementById('tip-content')
      if (!inner) return
      // the outer position wrapper has data-popper-animate-position
      const outer = (inner.closest('[data-popper-animate-position]') ||
        inner.parentElement) as HTMLElement | null
      ;(window as any).__posLog = []
      ;(window as any).__transformLog = []
      ;(window as any).__outerLog = []
      const log = (window as any).__posLog
      const tLog = (window as any).__transformLog
      const oLog = (window as any).__outerLog
      function sample() {
        if (!inner || !inner.isConnected) return
        const rect = inner.getBoundingClientRect()
        log.push({ x: rect.x, y: rect.y, t: performance.now() })
        tLog.push({
          inline: inner.style.transform,
          computed: getComputedStyle(inner).transform,
          t: performance.now(),
        })
        if (outer && outer.isConnected) {
          const outerRect = outer.getBoundingClientRect()
          oLog.push({
            x: outerRect.x,
            y: outerRect.y,
            inlineTransform: outer.style.transform,
            computedTransform: getComputedStyle(outer).transform,
            popperX: outer.getAttribute('data-popper-x'),
            popperY: outer.getAttribute('data-popper-y'),
            effX: outer.getAttribute('data-popper-eff-x'),
            effY: outer.getAttribute('data-popper-eff-y'),
            positioned: outer.getAttribute('data-popper-positioned'),
            t: performance.now(),
          })
        }
        requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })

    // rapid back-and-forth sweeps
    for (let i = 0; i < 4; i++) {
      await cdpMouseMove(cdp, a.x, a.y, c.x, c.y, 10, 1)
      await page.waitForTimeout(10)
      await cdpMouseMove(cdp, c.x, c.y, a.x, a.y, 10, 1)
      await page.waitForTimeout(10)
    }

    // wait for animations to settle
    await page.waitForTimeout(500)

    // collect results
    const { posLog, transformLog, outerLog } = await page.evaluate(() => ({
      posLog: (window as any).__posLog as { x: number; y: number; t: number }[],
      transformLog: (window as any).__transformLog as {
        inline: string
        computed: string
        t: number
      }[],
      outerLog: (window as any).__outerLog as {
        x: number
        y: number
        inlineTransform: string
        computedTransform: string
        classList: string
        t: number
      }[],
    }))

    // check for (0,0) flashes — tooltip triggers are far from origin
    const flashToOrigin = posLog.filter(
      (p) => p.x >= 0 && p.x < 20 && p.y >= 0 && p.y < 20
    )

    // log diagnostic info for debugging
    if (flashToOrigin.length > 0) {
      const firstFlash = flashToOrigin[0]
      const flashIdx = posLog.indexOf(firstFlash)
      const context = posLog.slice(Math.max(0, flashIdx - 2), flashIdx + 3)
      const tContext = transformLog.slice(Math.max(0, flashIdx - 2), flashIdx + 3)
      console.log('flash context (positions):', JSON.stringify(context))
      console.log('flash context (transforms):', JSON.stringify(tContext))
      // show outer element state around the flash
      const oContext = outerLog.slice(Math.max(0, flashIdx - 2), flashIdx + 3)
      console.log('flash context (outer element):', JSON.stringify(oContext))
      // dump transform write logs — these show WHO writes to style.transform
      const writeLogs = await page.evaluate(
        () => (window as any).__transformWriteLog || []
      )
      // show writes around the flash time
      const flashT = firstFlash.t
      const nearFlash = writeLogs.filter((w: any) => Math.abs(w.t - flashT) < 50)
      console.log(
        `transform writes near flash (${nearFlash.length} of ${writeLogs.length}):`
      )
      for (const w of nearFlash.slice(0, 15)) {
        console.log(`  t=${w.t.toFixed(1)} val=${w.value}`)
        console.log(`    ${w.stack}`)
      }
    }

    expect(
      flashToOrigin.length,
      `tooltip should never flash to (0,0), found ${flashToOrigin.length} occurrences`
    ).toBe(0)
  })
})
