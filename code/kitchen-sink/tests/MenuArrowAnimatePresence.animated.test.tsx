import { expect, test } from '@playwright/test'

/**
 * Test for Menu/Popover arrow visibility with AnimatePresence
 * Issue: When arrow is wrapped in AnimatePresence, Motion driver applies opacity: 0
 * that doesn't animate back to opacity: 1
 */
test.describe('Menu Arrow with AnimatePresence', () => {
  test('popover arrow is visible when wrapped in AnimatePresence', async ({ page }) => {
    await page.goto('http://localhost:9000/?test=MenuArrowAnimatePresenceCase')
    await page.waitForTimeout(500)

    // open the popover
    const trigger = page.getByTestId('popover-trigger')
    await trigger.click()
    await page.waitForTimeout(500)

    // find the arrow elements
    const arrowOuter = page.locator('[class*="PopperArrowOuter"]').first()
    const arrowInner = arrowOuter
      .locator('[class*="PopoverArrow"], [class*="PopperArrow"]')
      .first()

    // verify outer arrow exists and is visible
    await expect(arrowOuter).toBeVisible()

    // get inner arrow computed opacity - this is the critical check
    const innerOpacity = await arrowInner.evaluate((el) => {
      return getComputedStyle(el).opacity
    })

    // inner arrow should have opacity 1, not 0
    expect(Number.parseFloat(innerOpacity)).toBeGreaterThan(0.5)

    // check inline style doesn't have opacity: 0
    const inlineStyle = await arrowInner.getAttribute('style')
    console.log('Arrow inline style:', inlineStyle)

    // the bug causes inline style to contain "opacity: 0"
    if (inlineStyle) {
      expect(inlineStyle).not.toContain('opacity: 0')
    }

    // verify arrow is actually visible by checking bounding box
    const arrowBox = await arrowOuter.boundingBox()
    expect(arrowBox).not.toBeNull()
    expect(arrowBox!.width).toBeGreaterThan(0)
    expect(arrowBox!.height).toBeGreaterThan(0)
  })

  test('menu arrow is visible without AnimatePresence', async ({ page }) => {
    await page.goto('http://localhost:9000/?test=MenuArrowAnimatePresenceCase')
    await page.waitForTimeout(500)

    // open the menu
    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(500)

    // find the arrow
    const arrowOuter = page.locator('[class*="PopperArrowOuter"]').first()

    // verify arrow exists and is visible
    await expect(arrowOuter).toBeVisible()

    const arrowBox = await arrowOuter.boundingBox()
    expect(arrowBox).not.toBeNull()
    expect(arrowBox!.width).toBeGreaterThan(0)
    expect(arrowBox!.height).toBeGreaterThan(0)
  })
})
