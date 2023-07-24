import { expect, test } from '@playwright/test'

import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledHOCNamed')
})

test(`styled() name works on HOC`, async ({ page }) => {
  const textStyles = await getStyles(page.getByTestId('text-named').first())
  expect(textStyles.color).toBe(`rgb(255, 0, 0)`)

  const labelStyles = await getStyles(page.getByTestId('label-named').first())
  expect(labelStyles.color).toBe(`rgb(255, 0, 0)`)
})
