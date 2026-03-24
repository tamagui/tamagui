import { expect, test, type Page } from '@playwright/test'

async function getRect(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }, selector)
}

test.describe('Tooltip SSR hydration', () => {
  test('tooltip closes when useHover DOM listeners miss mouseleave', async ({ page }) => {
    // reproduces the stuck tooltip bug: when flushSync changes the reference
    // element, useEffect (which attaches useHover's DOM listeners) may be
    // delayed by heavy animation work. if cursor leaves before listeners
    // attach, the mouseleave is missed and tooltip stays stuck forever.
    //
    // we simulate this by blocking DOM-level mouseleave/mousemove events
    // with capture-phase listeners that call stopImmediatePropagation.
    // React's synthetic onMouseLeave still fires (it uses a different
    // mechanism), matching the real bug where onLeaveReference fires
    // but useHover's DOM close handler doesn't.
    await page.goto('/tooltip-ssr')
    await page.waitForSelector('#tooltip-ssr-root[data-hydrated="true"]', {
      timeout: 15000,
    })

    const triggerA = page.locator('#tip-trigger-a')
    const triggerC = page.locator('#tip-trigger-c')
    const aBox = await triggerA.boundingBox()
    const cBox = await triggerC.boundingBox()
    expect(aBox).toBeTruthy()
    expect(cBox).toBeTruthy()

    // hover trigger A to open tooltip
    await page.mouse.move(aBox!.x + aBox!.width / 2, aBox!.y + aBox!.height / 2)
    const content = page.locator('#tip-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // sweep to trigger C
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 1,
    })
    await page.waitForTimeout(100)

    // block DOM-level mouseleave and mousemove events from reaching
    // useHover's listeners. capture phase fires before bubble phase,
    // and stopImmediatePropagation prevents any later listeners.
    // this simulates useHover's listeners not being attached yet.
    await page.evaluate(() => {
      const block = (e: Event) => e.stopImmediatePropagation()
      document.addEventListener('mouseleave', block, true)
      document.addEventListener('mousemove', block, true)
      // auto-remove after 500ms so the page isn't permanently broken
      setTimeout(() => {
        document.removeEventListener('mouseleave', block, true)
        document.removeEventListener('mousemove', block, true)
      }, 500)
    })

    // leave all triggers — useHover's DOM handler won't fire, but
    // onLeaveReference already fired. without the fallback close in
    // the grace timer, tooltip stays stuck.
    await page.mouse.move(10, 10)
    await expect(content).not.toBeVisible({ timeout: 5000 })
  })

  test('arrow is centered and tooltip closes after leaving', async ({ page }) => {
    await page.goto('/tooltip-ssr')

    // wait for hydration to complete (event handlers attached)
    await page.waitForSelector('#tooltip-ssr-root[data-hydrated="true"]', {
      timeout: 15000,
    })

    const triggerA = page.locator('#tip-trigger-a')
    const box = await triggerA.boundingBox()
    expect(box).toBeTruthy()

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)

    const content = page.locator('#tip-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // arrow should not be stuck at far left
    const arrowRect = await getRect(page, '#tip-arrow')
    const contentRect = await getRect(page, '#tip-content')
    expect(arrowRect).toBeTruthy()
    expect(contentRect).toBeTruthy()

    if (arrowRect && contentRect && contentRect.width > 0) {
      const arrowCX = arrowRect.x + arrowRect.width / 2
      const contentCX = contentRect.x + contentRect.width / 2
      const displacement = Math.abs(arrowCX - contentCX)
      expect(
        displacement,
        `arrow displaced ${displacement.toFixed(0)}px from center`
      ).toBeLessThan(contentRect.width * 0.4)
    }

    // move cursor far away — tooltip MUST close (the "stuck" bug)
    await page.mouse.move(10, 10)
    await expect(content).not.toBeVisible({ timeout: 5000 })
  })

  test('rapid sweep: tooltip closes after leaving all triggers', async ({ page }) => {
    await page.goto('/tooltip-ssr')

    const triggerA = page.locator('#tip-trigger-a')
    await expect(triggerA).toBeVisible({ timeout: 15000 })

    const aBox = await triggerA.boundingBox()
    const bBox = await page.locator('#tip-trigger-b').boundingBox()
    const cBox = await page.locator('#tip-trigger-c').boundingBox()
    expect(aBox).toBeTruthy()
    expect(bBox).toBeTruthy()
    expect(cBox).toBeTruthy()

    // rapid sweep across all triggers
    await page.mouse.move(aBox!.x + aBox!.width / 2, aBox!.y + aBox!.height / 2, {
      steps: 1,
    })
    await page.mouse.move(bBox!.x + bBox!.width / 2, bBox!.y + bBox!.height / 2, {
      steps: 1,
    })
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 1,
    })

    await page.waitForTimeout(500)

    const content = page.locator('#tip-content')
    const isVisible = await content.isVisible().catch(() => false)

    if (isVisible) {
      // arrow must not be stuck at far left
      const arrowRect = await getRect(page, '#tip-arrow')
      const contentRect = await getRect(page, '#tip-content')

      if (arrowRect && contentRect && contentRect.width > 0) {
        const arrowCX = arrowRect.x + arrowRect.width / 2
        const contentCX = contentRect.x + contentRect.width / 2
        const displacement = Math.abs(arrowCX - contentCX)
        expect(displacement, `arrow displaced ${displacement.toFixed(0)}px`).toBeLessThan(
          contentRect.width * 0.4
        )
      }

      // must close when leaving
      await page.mouse.move(10, 10)
      await expect(content).not.toBeVisible({ timeout: 5000 })
    }
  })
})
