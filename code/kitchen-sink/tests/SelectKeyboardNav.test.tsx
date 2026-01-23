import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('first arrow down focuses first item when no selection', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // open fresh select (no selection)
    await trigger.click()
    await page.waitForTimeout(300)

    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).toBeVisible()

    // first arrow down should go to apple (first item)
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const appleItem = page.getByTestId('select-apple')
    const isAppleFocused = await appleItem.evaluate((el) => el === document.activeElement)
    expect(isAppleFocused).toBe(true)
  })

  test('selection persists after close and reopen', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // open and select banana
    await trigger.click()
    await page.waitForTimeout(300)
    const bananaItem = page.getByTestId('select-banana')
    await bananaItem.click()
    await page.waitForTimeout(200)

    // verify selection in trigger
    const triggerText = await trigger.textContent()
    expect(triggerText).toContain('Banana')

    // re-open - banana should still be the selected value
    await trigger.click()
    await page.waitForTimeout(300)

    // select with enter should select banana (the focused/selected item)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)

    // should still be banana
    const newTriggerText = await trigger.textContent()
    expect(newTriggerText).toContain('Banana')
  })

  test('can navigate and select different item after reopen', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // select banana first
    await trigger.click()
    await page.waitForTimeout(300)
    const bananaItem = page.getByTestId('select-banana')
    await bananaItem.click()
    await page.waitForTimeout(200)

    // re-open
    await trigger.click()
    await page.waitForTimeout(300)

    // navigate down multiple times and select
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(50)
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(50)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)

    // should have selected a different item (not banana)
    const triggerText = await trigger.textContent()
    expect(triggerText).not.toContain('Banana')
  })
})
