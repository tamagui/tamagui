import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'Tabs', type: 'demo' })
})

test('tabs automatically activate when a tab receives focus', async ({ page }) => {
  const connections = page.getByRole('tab', { name: 'Connections' })

  await connections.focus()

  await expect(connections).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Connections', { exact: true }).last()).toBeVisible()
})
