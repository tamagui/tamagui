import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledVariantTextColor', type: 'useCase' })
})

test(`sets text colors with variants + theme`, async ({ page }) => {
  const defaultStyles = await getStyles(page.getByTestId('default').first())
  const defaultStylesFlat = await getStyles(page.getByTestId('default-flat').first())

  // $color - updated for Radix v3 blue12
  expect(defaultStyles.color).toBe('rgb(17, 50, 100)')
  expect(defaultStylesFlat.color).toBe(defaultStyles.color)

  const activeStyles = await getStyles(page.getByTestId('active').first())
  const activeStylesFlat = await getStyles(page.getByTestId('active-flat').first())

  // $color10 - updated for Radix v3 blue10
  expect(activeStyles.color).toBe('rgb(5, 134, 240)')
  expect(activeStylesFlat.color).toBe(activeStyles.color)
})
