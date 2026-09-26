import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test('separators expose their orientation on web', async ({ page }) => {
  await setupPage(page, { name: 'Tabs', type: 'demo' })

  const horizontal = page.getByRole('separator')
  await expect(horizontal).toHaveAttribute('aria-orientation', 'horizontal')
  await expect(horizontal).toHaveAttribute('data-orientation', 'horizontal')

  await page.getByRole('button', { name: 'Horizontal', exact: true }).click()

  const vertical = page.getByRole('separator')
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical')
  await expect(vertical).toHaveAttribute('data-orientation', 'vertical')
})
