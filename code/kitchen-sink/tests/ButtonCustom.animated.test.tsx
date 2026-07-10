import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

let pageErrors: Error[]

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
  await setupPage(page, { name: 'ButtonCustom', type: 'useCase' })
})

test('styled Button with an element render prop animates without errors', async ({
  page,
}) => {
  await expect(page.getByRole('button', { name: 'animated' })).toBeVisible()
  expect(pageErrors).toHaveLength(0)
})
