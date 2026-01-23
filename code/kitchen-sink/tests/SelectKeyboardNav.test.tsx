import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('first item is focused on open', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // first item should be focused immediately on open
    const appleItem = page.getByTestId('select-apple')
    await expect(appleItem).toBeFocused()
  })

  test('arrow down moves to next item', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // first item focused on open
    const appleItem = page.getByTestId('select-apple')
    await expect(appleItem).toBeFocused()

    // arrow down should move to banana (second item)
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const bananaItem = page.getByTestId('select-banana')
    await expect(bananaItem).toBeFocused()
  })

  test('arrow up moves to previous item', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // navigate down first
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const bananaItem = page.getByTestId('select-banana')
    await expect(bananaItem).toBeFocused()

    // arrow up should go back to apple
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(100)

    const appleItem = page.getByTestId('select-apple')
    await expect(appleItem).toBeFocused()
  })

  test('selected item is focused on re-open', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // open and select banana (index 1)
    await trigger.click()
    await page.waitForTimeout(300)
    const bananaItem = page.getByTestId('select-banana')
    await bananaItem.click()
    await page.waitForTimeout(200)

    // re-open - banana should be focused
    await trigger.click()
    await page.waitForTimeout(300)

    await expect(bananaItem).toBeFocused()
  })

  test('arrow down from selected item goes to next', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // select banana
    await trigger.click()
    await page.waitForTimeout(300)
    const bananaItem = page.getByTestId('select-banana')
    await bananaItem.click()
    await page.waitForTimeout(200)

    // re-open
    await trigger.click()
    await page.waitForTimeout(300)

    // banana should be focused
    await expect(bananaItem).toBeFocused()

    // arrow down should go to orange (next after banana)
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const orangeItem = page.getByTestId('select-orange')
    await expect(orangeItem).toBeFocused()
  })

  test('arrow up from selected item goes to previous', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // select banana
    await trigger.click()
    await page.waitForTimeout(300)
    const bananaItem = page.getByTestId('select-banana')
    await bananaItem.click()
    await page.waitForTimeout(200)

    // re-open
    await trigger.click()
    await page.waitForTimeout(300)

    // banana should be focused
    await expect(bananaItem).toBeFocused()

    // arrow up should go to apple (before banana)
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(100)

    const appleItem = page.getByTestId('select-apple')
    await expect(appleItem).toBeFocused()
  })
})
