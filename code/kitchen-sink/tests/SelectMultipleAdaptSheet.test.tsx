import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.describe('Select multiple Adapt-to-Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 800 })
    await setupPage(page, { name: 'SelectMultipleCase', type: 'useCase' })
  })

  test('keeps the Sheet and selected indicators visible across toggles', async ({
    page,
  }) => {
    await page.getByTestId('multiple-adapt-trigger').click()
    const sheet = page.getByTestId('multiple-adapt-sheet')
    const listbox = page.getByTestId('multiple-adapt-viewport')
    await expect(sheet).toBeVisible()
    await expect(listbox).toHaveAttribute('role', 'listbox')
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

    await page.getByTestId('multiple-adapt-red-delicious').click()
    await page.getByTestId('multiple-adapt-green-pear').click()
    await expect(sheet).toBeVisible()
    await expect(listbox).toBeVisible()
    await expect(page.getByTestId('multiple-adapt-red-delicious-indicator')).toBeVisible()
    await expect(page.getByTestId('multiple-adapt-green-pear-indicator')).toBeVisible()
    await expect(page.getByTestId('multiple-adapt-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )
  })

  test('supports hardware keyboard focus, typeahead, Space, and Enter', async ({
    page,
  }) => {
    await page.getByTestId('multiple-adapt-trigger').click()
    const red = page.getByTestId('multiple-adapt-red-delicious')
    const blueberry = page.getByTestId('multiple-adapt-blueberry')
    const pear = page.getByTestId('multiple-adapt-green-pear')
    await expect(red).toBeFocused()

    await page.keyboard.press('b')
    await page.keyboard.press('l')
    await expect(blueberry).toBeFocused()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowDown')
    await expect(pear).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(page.getByTestId('multiple-adapt-value')).toHaveText(
      '["blueberry","green-pear"]'
    )
    await expect(page.getByTestId('multiple-adapt-sheet')).toBeVisible()
  })

  test('overlay dismissal preserves values and repeated root form controls', async ({
    page,
  }) => {
    await page.getByTestId('multiple-adapt-trigger').click()
    await page.getByTestId('multiple-adapt-red-delicious').click()
    await page.getByTestId('multiple-adapt-green-pear').click()
    await page
      .getByTestId('multiple-adapt-form')
      .evaluate((form: HTMLFormElement) => form.requestSubmit())
    await expect(page.getByTestId('multiple-adapt-form-data')).toHaveText(
      '["red-delicious","green-pear"]'
    )

    await page.getByTestId('multiple-adapt-overlay').click({ position: { x: 5, y: 5 } })
    await expect(page.getByTestId('multiple-adapt-open')).toHaveText('false')
    await expect(page.getByTestId('multiple-adapt-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )
  })

  test('dismissOnSnapToBottom closes without rolling selection back', async ({
    page,
  }) => {
    await page.getByTestId('multiple-adapt-trigger').click()
    await page.getByTestId('multiple-adapt-blueberry').click()

    const handle = page.getByTestId('multiple-adapt-handle')
    const box = await handle.boundingBox()
    expect(box).toBeTruthy()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    for (let step = 1; step <= 20; step++) {
      await page.mouse.move(
        box!.x + box!.width / 2,
        box!.y + box!.height / 2 + (500 * step) / 20
      )
      await page.waitForTimeout(16)
    }
    await page.mouse.up()

    await expect(page.getByTestId('multiple-adapt-open')).toHaveText('false', {
      timeout: 5000,
    })
    await expect(page.getByTestId('multiple-adapt-value')).toHaveText('["blueberry"]')
  })
})
