import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyleCompatCase', type: 'useCase' })
})

test('web mode flex shorthand emits CSS flex shrink semantics', async ({ page }) => {
  const styles = await getStyles(page.getByTestId('style-compat-flex-child').first())

  expect(styles.flexGrow).toBe('1')
  expect(styles.flexShrink).toBe('1')
  expect(styles.flexBasis).toBe('0px')
})
