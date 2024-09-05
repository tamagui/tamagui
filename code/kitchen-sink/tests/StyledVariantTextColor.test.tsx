import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledVariantTextColor', type: 'useCase' })
})

test(`sets text colors with variants + theme`, async ({ page }) => {
  const defaultStyles = await getStyles(page.getByTestId('default').first())
  const defaultStylesFlat = await getStyles(page.getByTestId('default-flat').first())

  // $color
  expect(defaultStyles.color).toBe('rgb(0, 37, 77)')
  expect(defaultStylesFlat.color).toBe(defaultStyles.color)

  const activeStyles = await getStyles(page.getByTestId('active').first())
  const activeStylesFlat = await getStyles(page.getByTestId('active-flat').first())

  // $color10
  expect(activeStyles.color).toBe('rgb(0, 129, 241)')
  expect(activeStylesFlat.color).toBe(activeStyles.color)
})
