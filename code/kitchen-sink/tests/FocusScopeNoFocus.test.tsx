import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// returns a stable identifier for the currently focused element
async function getActiveElement(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return 'body'
    return el.getAttribute('data-testid') || el.tagName.toLowerCase()
  })
}

test.describe('FocusScope noFocus (zero focus mode)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'FocusScopeNoFocusCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('inside-input')).toBeVisible({ timeout: 5000 })
  })

  test('tab never lands focus anywhere while noFocus is active', async ({ page }) => {
    // tab through more slots than the page has tabbables - every focusin
    // should be immediately blurred so activeElement always settles on body
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(50)
      expect(await getActiveElement(page)).toBe('body')
    }
  })

  test('clicking an input inside the scope does not focus it', async ({ page }) => {
    const insideInput = page.getByTestId('inside-input')
    await insideInput.click()
    await page.waitForTimeout(100)
    await expect(insideInput).not.toBeFocused()
    expect(await getActiveElement(page)).toBe('body')
  })

  test('focus cannot land outside the scope either', async ({ page }) => {
    const outsideInput = page.getByTestId('outside-input')
    await outsideInput.click()
    await page.waitForTimeout(100)
    await expect(outsideInput).not.toBeFocused()
    expect(await getActiveElement(page)).toBe('body')
  })

  test('programmatic focus inside the scope is blurred', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector(
        '[data-testid="inside-input"]'
      ) as HTMLElement | null
      el?.focus()
    })
    await page.waitForTimeout(100)
    expect(await getActiveElement(page)).toBe('body')
  })

  test('toggling noFocus off restores normal focus behavior', async ({ page }) => {
    // while active, nothing focuses
    const insideInput = page.getByTestId('inside-input')
    await insideInput.click()
    await page.waitForTimeout(100)
    await expect(insideInput).not.toBeFocused()

    // toggle the mode off
    await page.getByTestId('toggle-no-focus').click()
    await expect(page.getByTestId('toggle-no-focus')).toContainText('noFocus: off')
    await page.waitForTimeout(100)

    // inside elements focus normally again
    await insideInput.click()
    await expect(insideInput).toBeFocused()

    // outside elements focus normally again
    const outsideInput = page.getByTestId('outside-input')
    await outsideInput.click()
    await expect(outsideInput).toBeFocused()

    // toggle back on - focus is cleared immediately
    await page.getByTestId('toggle-no-focus').click()
    await expect(page.getByTestId('toggle-no-focus')).toContainText('noFocus: on')
    await page.waitForTimeout(100)
    expect(await getActiveElement(page)).toBe('body')

    await insideInput.click()
    await page.waitForTimeout(100)
    await expect(insideInput).not.toBeFocused()
  })
})
