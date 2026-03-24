import { expect, test, type Page } from '@playwright/test'

// test against the real tamagui.dev local server (port 5556)
// to reproduce the stuck tooltip repositioning bug

test.describe('Tooltip repositioning on tamagui.dev', () => {
  test.skip(
    !process.env.TEST_PROD_SITE,
    'set TEST_PROD_SITE=1 to run against local tamagui.dev on port 5556'
  )

  const baseURL = 'http://localhost:5556'

  test('tooltip repositions between PromoLinksRow triggers', async ({ page }) => {
    await page.goto(baseURL + '/')
    // wait for page to hydrate
    await page.waitForTimeout(2000)

    // find the promo buttons by text
    const takeout = page.getByText('Starter Kit').first()
    const hireUs = page.getByText('Hire Us').first()

    // fallback: look for buttons that match PromoLinksRow
    const takeoutBtn = (await takeout.isVisible())
      ? takeout
      : page.getByText('Takeout').first()
    const hireUsBtn = (await hireUs.isVisible())
      ? hireUs
      : page.getByText('Consulting').first()

    await expect(takeoutBtn).toBeVisible({ timeout: 10000 })

    const aBox = await takeoutBtn.boundingBox()
    expect(aBox).toBeTruthy()

    // hover first button
    await page.mouse.move(aBox!.x + aBox!.width / 2, aBox!.y + aBox!.height / 2)
    await page.waitForTimeout(500)

    // check if tooltip opened
    const tooltip = page.locator('[data-floating-ui-portal]').first()
    const isOpen = await tooltip.isVisible().catch(() => false)
    console.log(`tooltip visible after hover: ${isOpen}`)

    if (isOpen) {
      const posA = await tooltip.evaluate((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y }
      })
      console.log(`position at first trigger: x=${posA.x.toFixed(1)}`)

      // find and hover the last button
      const cBox = await hireUsBtn.boundingBox()
      if (cBox) {
        await page.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2, {
          steps: 2,
        })
        await page.waitForTimeout(500)

        const posC = await tooltip.evaluate((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.x + r.width / 2, y: r.y }
        })
        console.log(`position at last trigger: x=${posC.x.toFixed(1)}`)

        const xDiff = Math.abs(posC.x - posA.x)
        console.log(`position difference: ${xDiff.toFixed(1)}`)

        expect(
          xDiff,
          `tooltip should reposition between triggers (diff=${xDiff.toFixed(1)})`
        ).toBeGreaterThan(20)
      }
    }
  })

  test('tooltip repositions during hydration window', async ({ page }) => {
    // navigate and interact DURING hydration
    await page.goto(baseURL + '/')

    // wait for the buttons to appear in DOM but NOT for full hydration
    await page.waitForSelector('text=Starter Kit', { timeout: 15000 })
    // brief wait for React to hydrate (attach handlers)
    await page.waitForTimeout(200)

    const takeout = page.getByText('Starter Kit').first()
    const hireUs = page.getByText('Hire Us').first()

    const aBox = await takeout.boundingBox()
    if (!aBox) {
      test.skip(true, 'PromoLinksRow buttons not found on page')
      return
    }

    // hover first trigger immediately
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2)
    await page.waitForTimeout(300)

    // quickly switch to last trigger
    const cBox = await hireUs.boundingBox()
    if (!cBox) {
      test.skip(true, 'Hire Us button not found')
      return
    }

    await page.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2, { steps: 2 })
    await page.waitForTimeout(500)

    // check tooltip position
    const tooltipContent = page.locator('[data-floating-ui-portal]').first()
    const isVisible = await tooltipContent.isVisible().catch(() => false)

    if (isVisible) {
      const rect = await tooltipContent.evaluate((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y }
      })

      // tooltip should be near the last hovered trigger (hireUs), not stuck at first
      const distToFirst = Math.abs(rect.x - (aBox.x + aBox.width / 2))
      const distToLast = Math.abs(rect.x - (cBox.x + cBox.width / 2))

      console.log(
        `tooltip at x=${rect.x.toFixed(0)}, ` +
          `distToFirst=${distToFirst.toFixed(0)}, distToLast=${distToLast.toFixed(0)}`
      )

      expect(
        distToLast,
        `tooltip should be near last trigger, not stuck at first. ` +
          `distToFirst=${distToFirst.toFixed(0)}, distToLast=${distToLast.toFixed(0)}`
      ).toBeLessThan(distToFirst)
    }
  })
})
