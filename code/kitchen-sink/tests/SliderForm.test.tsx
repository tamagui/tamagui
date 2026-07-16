import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test('slider values participate in form submission', async ({ page }) => {
  await setupPage(page, { name: 'SliderFormCase', type: 'useCase' })

  const form = page.getByTestId('slider-form')
  const values = async () =>
    form.evaluate((element) => Array.from(new FormData(element as HTMLFormElement).getAll('range')))

  await expect(page.locator('input[type="hidden"][name="range"]')).toHaveCount(2)
  await expect.poll(values).toEqual(['10', '90'])

  await page.getByRole('slider').first().press('ArrowRight')
  await expect.poll(values).toEqual(['11', '90'])
})
