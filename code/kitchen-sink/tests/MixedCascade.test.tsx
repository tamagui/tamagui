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
  const text = page.getByTestId('mixed-decoration')

  await expect(text).toHaveCSS('text-decoration-line', 'underline')
  await text.hover()
  await page.waitForTimeout(100)
  await expect(text).toHaveCSS('text-decoration-line', 'none')
})
