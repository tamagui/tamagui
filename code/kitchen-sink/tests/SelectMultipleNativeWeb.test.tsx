import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.describe('Select multiple native web', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectMultipleCase', type: 'useCase' })
  })

  test('uses browser-native multiple selection and form semantics', async ({ page }) => {
    const select = page.getByTestId('multiple-native-control')
    await expect(select).toHaveJSProperty('multiple', true)
    await expect(select).toHaveAttribute('name', 'native-fruit')
    await expect(select).toHaveAttribute('form', 'multiple-native-form')
    await expect(select.locator('option')).toHaveCount(3)
    await expect(page.getByTestId('multiple-native-trigger')).toHaveCount(0)
    await expect(page.getByTestId('multiple-native-viewport')).toHaveCount(0)
    await expect(page.getByTestId('multiple-native-red-delicious-indicator')).toHaveCount(
      0
    )
    await expect(page.locator('input[type="hidden"][name="native-fruit"]')).toHaveCount(0)

    await select.selectOption(['green-pear', 'red-delicious'])
    await expect(page.getByTestId('multiple-native-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )
    await expect(page.getByTestId('multiple-native-value-reason')).toHaveText(
      'native-change'
    )
    expect(await select.evaluate((element: HTMLSelectElement) => element.form?.id)).toBe(
      'multiple-native-form'
    )
    expect(
      await select.evaluate((element: HTMLSelectElement) =>
        element.form ? new FormData(element.form).getAll(element.name).map(String) : []
      )
    ).toEqual(['red-delicious', 'green-pear'])

    await page.getByTestId('multiple-native-submit').click()
    await expect(page.getByTestId('multiple-native-form-data')).toHaveText(
      '["red-delicious","green-pear"]'
    )
  })
})
