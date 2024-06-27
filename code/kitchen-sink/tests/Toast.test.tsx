import type { Page} from '@playwright/test';
import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastCase', type: 'useCase' })
})

async function buttonIsFocused(page: Page, identifier: number) {
  await expect(page.getByTestId(`toast-button-${identifier}`)).toBeFocused()
}

async function toastIsFocused(page: Page, identifier: number) {
  await expect(page.getByTestId(`toast-${identifier}`)).toBeFocused()
}

test.describe('given zero toasts', () => {
  test('should not interrupt natural tab order in the document', async ({ page }) => {
    await page.getByTestId('button-before').focus()

    await page.keyboard.press('Tab')

    await expect(page.getByTestId('button-after')).toBeFocused()

    await page.keyboard.press('Shift+Tab')

    await expect(page.getByTestId('button-before')).toBeFocused()
  })
})

test.describe('given multiple toasts', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTestId('button-add-toast').click()
    await page.getByTestId('button-add-toast').click()
    await new Promise((res) => setTimeout(res, 1000))
  })

  test('should reverse tab order from most recent to least', async ({ page }) => {
    await page.getByTestId('button-before').focus()

    await page.keyboard.press('Tab')
    await toastIsFocused(page, 2)

    // Forward tab
    await page.keyboard.press('Tab')
    await buttonIsFocused(page, 2.1)

    await page.keyboard.press('Tab')
    await buttonIsFocused(page, 2.2)

    await page.keyboard.press('Tab')
    await toastIsFocused(page, 1)

    await page.keyboard.press('Tab')
    await buttonIsFocused(page, 1.1)

    await page.keyboard.press('Tab')
    await buttonIsFocused(page, 1.2)

    // End of viewport
    await page.keyboard.press('Tab')
    await expect(page.getByTestId('button-after')).toBeFocused()

    // Backwards tab
    await page.keyboard.press('Shift+Tab')
    await buttonIsFocused(page, 1.2)

    await page.keyboard.press('Shift+Tab')
    await buttonIsFocused(page, 1.1)

    await page.keyboard.press('Shift+Tab')
    await toastIsFocused(page, 1)

    await page.keyboard.press('Shift+Tab')
    await buttonIsFocused(page, 2.2)

    await page.keyboard.press('Shift+Tab')
    await buttonIsFocused(page, 2.1)

    await page.keyboard.press('Shift+Tab')
    await toastIsFocused(page, 2)

    // Start of viewport
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByTestId('button-before')).toBeFocused()
  })

  test('should tab forwards from viewport to latest toast or backwards into the document', async ({
    page,
  }) => {
    // Tab forward from viewport
    await page.keyboard.press('F8')
    await page.keyboard.press('Tab')
    await toastIsFocused(page, 2)

    // Tab backward from viewport
    await page.keyboard.press('F8')
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByTestId('button-before')).toBeFocused()
  })
})
