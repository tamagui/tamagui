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

test('tab sizing applies to text labels without sending text styles to the frame', async ({
  page,
}) => {
  const styleWarnings: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().includes('is a text style prop')) {
      styleWarnings.push(message.text())
    }
  })
  await setupPage(page, { name: 'TabsOnInteraction', type: 'useCase' })
  const first = page.getByTestId('tabs-tab1')
  const second = page.getByTestId('tabs-tab2')
  await expect(first).toHaveText('Tab 1')
  await expect(first.locator('span')).toHaveCount(1)
  await expect(second).toHaveText('Tab 2')
  await second.click()
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('tabs-content-tab2')).toBeVisible()
  expect(styleWarnings).toEqual([])
})
