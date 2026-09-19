import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'TooltipCase', type: 'useCase' })
})

test('opens a focus-enabled tooltip when its trigger receives keyboard focus', async ({
  page,
}) => {
  const trigger = page.getByTestId('focus-tooltip-trigger').getByRole('button')

  for (let attempt = 0; attempt < 5; attempt++) {
    if (await trigger.evaluate((node) => node === document.activeElement)) break
    await page.keyboard.press('Tab')
  }

  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('focus-tooltip-content')).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(page.getByTestId('focus-tooltip-content')).not.toBeVisible()
})
