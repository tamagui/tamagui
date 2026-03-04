import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Typeahead', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('typing a letter focuses matching item', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // type 'b' to jump to Banana
    await page.keyboard.press('b')
    await page.waitForTimeout(100)

    const banana = page.getByTestId('select-banana')
    await expect(banana).toBeFocused()
  })

  test('typing multiple letters narrows match', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // type 'br' to match Broccoli (not Banana)
    await page.keyboard.press('b')
    await page.keyboard.press('r')
    await page.waitForTimeout(100)

    const broccoli = page.getByTestId('select-broccoli')
    await expect(broccoli).toBeFocused()
  })

  test('typeahead resets after timeout', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // type 'b' → Banana
    await page.keyboard.press('b')
    await page.waitForTimeout(100)
    await expect(page.getByTestId('select-banana')).toBeFocused()

    // wait for typeahead buffer to reset (750ms default)
    await page.waitForTimeout(800)

    // type 'c' → Carrot (not 'bc' continuation)
    await page.keyboard.press('c')
    await page.waitForTimeout(100)
    await expect(page.getByTestId('select-carrot')).toBeFocused()
  })
})
