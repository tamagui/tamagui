import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test('tabs report layout without a render loop', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })

  await setupPage(page, { name: 'TabsOnInteraction', type: 'useCase' })

  await expect(page.getByTestId('tabs-layout-has-value')).toHaveText('hasLayout: true')
  expect(errors.filter((error) => error.includes('Maximum update depth'))).toEqual([])
})
