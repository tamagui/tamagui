import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: "StyledRNW", type: "useCase" })
})

test(`RNW + styled() + styleable() twice`, async ({ page }) => {
  const inputStyles = await getStyles(page.locator('#styled-rnw-input'))
  expect(inputStyles.fontFamily).toBe(
    `Silkscreen, "Fira Code", Monaco, Consolas, "Ubuntu Mono", monospace`
  )
  expect(inputStyles.paddingLeft).toBe(`14px`)
  expect(inputStyles.paddingTop).toBe(`12px`)
})
