import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledStyleableInputVariant', type: 'useCase' })
})

test(`styled(styleable(styled(RNView))) applies proper variant overrides`, async ({
  page,
}) => {
  const styles = await getStyles(page.locator('#input').first())

  expect(styles.color).toBe('rgb(255, 0, 0)')
  expect(styles.borderTopLeftRadius).toBe('100px')
  expect(styles.borderColor).toBe('rgb(255, 0, 0)')

  await page.locator('#input').focus()
  const focusStyle = await getStyles(page.locator('#input').first())
  expect(focusStyle.borderColor).toBe('rgb(0, 128, 0)')
})
