import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'NumberOfLinesMediaQuery', type: 'useCase' })
})

test('numberOfLines in $platform-web truncates to 1 line', async ({ page }) => {
  const el = page.getByTestId('platform-web-nol').first()
  const styles = await getStyles(el)
  // -webkit-line-clamp or text-overflow: ellipsis should be applied
  expect(styles.overflow).toBe('hidden')
})

test('numberOfLines=2 in $platform-web applies line clamping', async ({ page }) => {
  const el = page.getByTestId('platform-web-nol-2').first()
  const styles = await getStyles(el)
  expect(styles.overflow).toBe('hidden')
  expect(styles.webkitLineClamp).toBe('2')
})

test('numberOfLines in $platform-web matches top-level behavior', async ({ page }) => {
  const platformStyles = await getStyles(page.getByTestId('platform-web-nol').first())
  const topLevelStyles = await getStyles(page.getByTestId('top-level-nol').first())

  // both should have overflow hidden
  expect(platformStyles.overflow).toBe(topLevelStyles.overflow)
})

test('reference text without numberOfLines is not truncated', async ({ page }) => {
  const styles = await getStyles(page.getByTestId('no-nol').first())
  expect(styles.overflow).not.toBe('hidden')
})
