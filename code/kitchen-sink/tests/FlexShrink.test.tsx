import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FlexShrinkCase', type: 'useCase' })
})

test('flex: 1 in column layout does not collapse children', async ({ page }) => {
  const child = page.getByTestId('flex-child').first()
  const box = await child.boundingBox()
  // each child should take ~200px (400px container / 2 children), at minimum 100px
  expect(box!.height).toBeGreaterThan(100)
})

test('flex: 1 has computed flex-shrink: 0', async ({ page }) => {
  const child = page.getByTestId('flex-child').first()
  const styles = await getStyles(child)
  expect(styles.flexShrink).toBe('0')
})
