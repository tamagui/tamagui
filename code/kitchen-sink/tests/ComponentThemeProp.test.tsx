import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ComponentThemeProp', type: 'useCase' })
})

test('default theme uses light_MyLabel (red)', async ({ page }) => {
  const label = page.locator(`#${TEST_IDS.componentThemeDefault}`)
  await expect(label).toBeVisible()

  const styles = await getStyles(label)
  // light_MyLabel defines color: 'red'
  expect(styles.color).toBe('rgb(255, 0, 0)')
})

test('theme="green" prop uses green_MyLabel (green)', async ({ page }) => {
  const label = page.locator(`#${TEST_IDS.componentThemeProp}`)
  await expect(label).toBeVisible()

  const styles = await getStyles(label)
  // green_MyLabel defines color: 'green' (Issue #2817 - without light_ prefix)
  // rgb(0, 128, 0) is green
  expect(styles.color).toBe('rgb(0, 128, 0)')
})

test('Theme wrapper uses green_MyLabel (green)', async ({ page }) => {
  const label = page.locator(`#${TEST_IDS.componentThemeWrapper}`)
  await expect(label).toBeVisible()

  const styles = await getStyles(label)
  // green_MyLabel defines color: 'green' (Issue #2817 - without light_ prefix)
  // rgb(0, 128, 0) is green
  expect(styles.color).toBe('rgb(0, 128, 0)')
})
