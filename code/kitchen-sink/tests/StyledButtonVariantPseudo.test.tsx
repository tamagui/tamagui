import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getHoverStyle, getPressStyle } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledButtonVariantPseudo', type: 'useCase' })
})

test(`hover HOC + variant + pseudos work`, async ({ page }) => {
  const button = page.locator('button#test')
  const hoverStyles = await getHoverStyle(button)
  expect(hoverStyles.backgroundColor).toBe(`rgb(0, 128, 0)`)
})

test(`press HOC + variant + pseudos work`, async ({ page }) => {
  const button = page.locator('button')
  const pressStyles = await getPressStyle(button, { delay: 3000 })
  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})
