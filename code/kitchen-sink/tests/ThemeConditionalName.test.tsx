import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeConditionalName', type: 'useCase' })
})

test('Theme reverts to parent when name changes from accent to undefined', async ({
  page,
}) => {
  const parent = page.locator('#theme-conditional-parent')
  const child = page.locator('#theme-conditional-child')
  const toggle = page.locator('#theme-conditional-toggle')

  // initially active=false, child should match parent (no theme override)
  const parentInitial = await getStyles(parent)
  const childInitial = await getStyles(child)
  expect(childInitial.backgroundColor).toBe(parentInitial.backgroundColor)

  // toggle active=true, child gets accent theme — should differ from parent
  await toggle.click()
  await page.waitForTimeout(100)
  const parentActive = await getStyles(parent)
  const childActive = await getStyles(child)
  expect(childActive.backgroundColor).not.toBe(parentActive.backgroundColor)

  // toggle active=false again, child should revert to parent theme
  await toggle.click()
  await page.waitForTimeout(100)
  const parentReverted = await getStyles(parent)
  const childReverted = await getStyles(child)
  expect(childReverted.backgroundColor).toBe(parentReverted.backgroundColor)
})
