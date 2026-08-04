import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledVariantTextColor', type: 'useCase' })
})

test(`sets text colors with variants + theme`, async ({ page }) => {
  const defaultStyles = await getStyles(page.getByTestId('default').first())
  const defaultStylesFlat = await getStyles(page.getByTestId('default-flat').first())

  // Tag's base `color` = v6 light_blue `color` (#1447e6)
  expect(defaultStyles.color).toBe('rgb(20, 71, 230)')
  expect(defaultStylesFlat.color).toBe(defaultStyles.color)

  const activeStyles = await getStyles(page.getByTestId('active').first())
  const activeStylesFlat = await getStyles(page.getByTestId('active-flat').first())

  // the active variant's `color10` = v6 light_blue `color10` (#1c398e)
  expect(activeStyles.color).toBe('rgb(28, 57, 142)')
  expect(activeStylesFlat.color).toBe(activeStyles.color)
})
