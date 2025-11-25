import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToggleGroupActiveProps', type: 'useCase' })
})

test(`ToggleGroup.Item passes active prop to children - initially selected item`, async ({
  page,
}) => {
  // option1 is selected by default
  const activeItem = page.locator('#custom-item-option1')
  await expect(activeItem).toHaveAttribute('data-active', 'true')
})

test(`ToggleGroup.Item passes active prop to children - non-selected items`, async ({
  page,
}) => {
  // option2 and option3 are not selected
  const item2 = page.locator('#custom-item-option2')
  const item3 = page.locator('#custom-item-option3')

  await expect(item2).toHaveAttribute('data-active', 'false')
  await expect(item3).toHaveAttribute('data-active', 'false')
})

test(`ToggleGroup.Item updates active prop when selection changes`, async ({ page }) => {
  // Click on option2
  await page.click('#item-2')

  // option2 should now be active
  const item1 = page.locator('#custom-item-option1')
  const item2 = page.locator('#custom-item-option2')

  await expect(item1).toHaveAttribute('data-active', 'false')
  await expect(item2).toHaveAttribute('data-active', 'true')
})
