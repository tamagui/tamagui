import { expect, test, type Page } from '@playwright/test'

async function getCenter(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox()
  if (!box) throw new Error(`element ${selector} not found`)
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

test.describe('Tooltip repositioning during heavy SSR hydration', () => {
  // the core bug: on tamagui.dev, refreshing the page and hovering the
  // PromoLinksRow triggers during the ~300ms hydration/animation window
  // causes the tooltip to get stuck on one trigger position. it stays
  // open but never repositions when switching between triggers.

  test('tooltip repositions when switching triggers after hydration', async ({
    page,
  }) => {
    // baseline: verify repositioning works at all after full hydration
    await page.goto('/tooltip-heavy-ssr')
    await page.waitForSelector('#tooltip-heavy-ssr-root[data-hydrated="true"]', {
      timeout: 15000,
    })
    // extra wait for all enter animations to complete
    await page.waitForTimeout(500)

    const a = await getCenter(page, '#tip-trigger-a')
    const c = await getCenter(page, '#tip-trigger-c')

    // hover trigger A to open tooltip
    await page.mouse.move(a.x, a.y)
    const content = page.locator('#tip-content')
    await expect(content).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400) // let enter + position animation finish

    // record position at trigger A
    const posA = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y }
    })

    // switch to trigger C
    await page.mouse.move(c.x, c.y, { steps: 2 })
    await page.waitForTimeout(500) // let position animation complete

    await expect(content).toBeVisible({ timeout: 3000 })

    const posC = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y }
    })

    // triggers are far apart — tooltip center x should shift significantly
    const xDiff = Math.abs(posC.x - posA.x)
    expect(
      xDiff,
      `tooltip should reposition when switching triggers. ` +
        `posA.x=${posA.x.toFixed(1)}, posC.x=${posC.x.toFixed(1)}, diff=${xDiff.toFixed(1)}`
    ).toBeGreaterThan(30)

    // verify it closes
    await page.mouse.move(10, 10)
    await expect(content).not.toBeVisible({ timeout: 5000 })
  })

  test('tooltip repositions when switching triggers during enter animations', async ({
    page,
  }) => {
    // this test interacts RIGHT as hydration completes but while enter
    // animations are still running (the ~300ms window on tamagui.dev).
    // we wait for data-hydrated but NOT for animations to finish.
    await page.goto('/tooltip-heavy-ssr')
    await page.waitForSelector('#tooltip-heavy-ssr-root[data-hydrated="true"]', {
      timeout: 15000,
    })
    // don't wait — interact immediately while enter animations run

    const a = await getCenter(page, '#tip-trigger-a')
    const c = await getCenter(page, '#tip-trigger-c')

    // hover trigger A to open tooltip
    await page.mouse.move(a.x, a.y)
    const content = page.locator('#tip-content')
    await expect(content).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(200) // brief wait, animations still in flight

    // record position at trigger A
    const posA = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y }
    })

    // switch to trigger C while animations are still running
    await page.mouse.move(c.x, c.y, { steps: 2 })
    await page.waitForTimeout(500)

    await expect(content).toBeVisible({ timeout: 3000 })

    const posC = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y }
    })

    // tooltip must have repositioned
    const xDiff = Math.abs(posC.x - posA.x)
    expect(
      xDiff,
      `tooltip should reposition during enter animations. ` +
        `posA.x=${posA.x.toFixed(1)}, posC.x=${posC.x.toFixed(1)}, diff=${xDiff.toFixed(1)}`
    ).toBeGreaterThan(30)

    await page.mouse.move(10, 10)
    await expect(content).not.toBeVisible({ timeout: 5000 })
  })

  test('rapid sweep repositions tooltip to last hovered trigger', async ({ page }) => {
    await page.goto('/tooltip-heavy-ssr')
    await page.waitForSelector('#tooltip-heavy-ssr-root[data-hydrated="true"]', {
      timeout: 15000,
    })

    const a = await getCenter(page, '#tip-trigger-a')
    const b = await getCenter(page, '#tip-trigger-b')
    const c = await getCenter(page, '#tip-trigger-c')

    // rapid sweep: A → B → C → B → A → C
    await page.mouse.move(a.x, a.y)
    await page.waitForTimeout(60)
    await page.mouse.move(b.x, b.y, { steps: 1 })
    await page.waitForTimeout(30)
    await page.mouse.move(c.x, c.y, { steps: 1 })
    await page.waitForTimeout(30)
    await page.mouse.move(b.x, b.y, { steps: 1 })
    await page.waitForTimeout(30)
    await page.mouse.move(a.x, a.y, { steps: 1 })
    await page.waitForTimeout(30)
    await page.mouse.move(c.x, c.y, { steps: 1 })

    // wait for everything to settle
    await page.waitForTimeout(800)

    const content = page.locator('#tip-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // should be positioned near trigger C (the last one hovered)
    const contentRect = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x, width: r.width }
    })
    const contentCenter = contentRect.x + contentRect.width / 2
    const distToC = Math.abs(contentCenter - c.x)

    expect(
      distToC,
      `after rapid sweep, tooltip should be near trigger C ` +
        `(dist=${distToC.toFixed(0)}, contentCenter=${contentCenter.toFixed(0)}, ` +
        `triggerC.x=${c.x.toFixed(0)})`
    ).toBeLessThan(100)

    // must still close
    await page.mouse.move(10, 10)
    await expect(content).not.toBeVisible({ timeout: 5000 })
  })
})
