import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: "StyledHOCNamed", type: "useCase" })
})

test(`styled() name works on HOC`, async ({ page }) => {
  const textStyles = await getStyles(page.getByTestId('text-named').first())
  expect(textStyles.color).toBe(`rgb(255, 0, 0)`)

  const labelStyles = await getStyles(page.getByTestId('label-named').first())
  expect(labelStyles.color).toBe(`rgb(255, 0, 0)`)
})
