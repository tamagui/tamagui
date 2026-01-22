import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('keyboard nav starts from selected item on re-open', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // open and select banana (index 1)
    await trigger.click()
    await page.waitForTimeout(300)

    const bananaItem = page.getByTestId('select-banana')
    await expect(bananaItem).toBeVisible()
    await bananaItem.click()
    await page.waitForTimeout(200)

    // verify selection
    const triggerText = await trigger.textContent()
    expect(triggerText).toContain('Banana')

    // re-open
    await trigger.click()
    await page.waitForTimeout(300)
    await expect(bananaItem).toBeVisible()

    // press down - should go to orange (next after banana), not apple
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const orangeItem = page.getByTestId('select-orange')
    const isOrangeFocused = await orangeItem.evaluate((el) => el === document.activeElement)
    expect(isOrangeFocused).toBe(true)
  })

  test('keyboard nav starts from selected item after multiple selections', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // select carrot (index 3)
    await trigger.click()
    await page.waitForTimeout(300)
    const carrotItem = page.getByTestId('select-carrot')
    await carrotItem.click()
    await page.waitForTimeout(200)

    // re-open and press up - should go to orange (before carrot)
    await trigger.click()
    await page.waitForTimeout(300)
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(100)

    const orangeItem = page.getByTestId('select-orange')
    const isOrangeFocused = await orangeItem.evaluate((el) => el === document.activeElement)
    expect(isOrangeFocused).toBe(true)
  })
})
