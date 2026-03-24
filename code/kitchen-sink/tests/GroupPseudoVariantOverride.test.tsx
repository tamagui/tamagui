import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, whileHovered, whilePressed } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'GroupPseudoVariantOverride', type: 'useCase' })
})

test(`base $group-press opacity applies without variant`, async ({ page }) => {
  const group = page.locator('#base-group')
  const overlay = page.locator('#base-overlay')

  const styles = await whilePressed(group, async () => {
    return await getStyles(overlay)
  })

  expect(styles.opacity).toBe('0.6')
  expect(styles.backgroundColor).toBe('rgb(0, 0, 255)')
})

test(`base $group-hover opacity applies without variant`, async ({ page }) => {
  const group = page.locator('#base-group')
  const overlay = page.locator('#base-overlay')

  const styles = await whileHovered(group, async () => {
    return await getStyles(overlay)
  })

  expect(styles.opacity).toBe('0.4')
})

test(`action variant $group-press opacity overrides base`, async ({ page }) => {
  const group = page.locator('#action-group')
  const overlay = page.locator('#action-overlay')

  const styles = await whilePressed(group, async () => {
    return await getStyles(overlay)
  })

  // variant's $group-button-press should override base opacity
  expect(styles.opacity).toBe('1')
  expect(styles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test(`action variant $group-hover opacity overrides base`, async ({ page }) => {
  const group = page.locator('#action-group')
  const overlay = page.locator('#action-overlay')

  const styles = await whileHovered(group, async () => {
    return await getStyles(overlay)
  })

  // variant's $group-button-hover should override base opacity
  expect(styles.opacity).toBe('1')
  expect(styles.backgroundColor).toBe('rgb(255, 255, 0)')
})
