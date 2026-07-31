import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MixedCascadeCase', type: 'useCase' })
})

// pins the specificity ruling: a legacy pseudo rule (priority selector +
// !important) still overrides a flat (0,1,0) program base for the same
// computed property, so mixing the two engines on one element cannot flip
// the cascade
test('a legacy pseudo rule still beats a program base rule', async ({ page }) => {
  const text = page.getByTestId('mixed-legacy')

  await expect(text).toHaveCSS('background-color', 'rgb(0, 0, 255)')
  await text.hover()
  await page.waitForTimeout(100)
  await expect(text).toHaveCSS('background-color', 'rgb(255, 0, 0)')
})

// the text-decoration family converts the condition object into a program
// clause; the converted clause overrides the base program
test('a converted condition object overrides the program base', async ({ page }) => {
  const text = page.getByTestId('mixed-decoration')

  await expect(text).toHaveCSS('text-decoration-line', 'underline')
  await text.hover()
  await page.waitForTimeout(100)
  await expect(text).toHaveCSS('text-decoration-line', 'none')
})
