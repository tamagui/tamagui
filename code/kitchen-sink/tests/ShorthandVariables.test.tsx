import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ShorthandVariables', type: 'useCase' })
})

test(`boxShadow with $variable resolves correctly`, async ({ page }) => {
  const element = page.locator('#boxshadow-var')
  const styles = await getStyles(element)

  // Should have boxShadow with resolved color (not containing $)
  expect(styles.boxShadow).toBeDefined()
  expect(styles.boxShadow).not.toContain('$')
  expect(styles.boxShadow).toContain('0px 0px 10px')
})

test(`boxShadow with multiple $variables resolves correctly`, async ({ page }) => {
  const element = page.locator('#boxshadow-multi')
  const styles = await getStyles(element)

  // Should have boxShadow with multiple shadows, both colors resolved
  expect(styles.boxShadow).toBeDefined()
  expect(styles.boxShadow).not.toContain('$')
  expect(styles.boxShadow).toContain(',') // Multiple shadows separated by comma
})

test(`border with $variable resolves correctly`, async ({ page }) => {
  const element = page.locator('#border-var')
  const styles = await getStyles(element)

  // border expands to individual props, check one of them
  expect(styles.borderTopColor || styles.borderColor).toBeDefined()
  expect(styles.borderTopWidth || styles.borderWidth).toBeDefined()
})

test(`boxShadow without variables passes through unchanged`, async ({ page }) => {
  const element = page.locator('#boxshadow-plain')
  const styles = await getStyles(element)

  expect(styles.boxShadow).toBe('rgba(0, 0, 0, 0.2) 0px 0px 10px 0px')
})
