import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyleProp', type: 'useCase' })
})

test(`style prop flattens`, async ({ page }) => {
  // var(--color-9) resolves to v6 light `color-9` = mauve-800 #54515a
  expect((await getStyles(page.getByTestId('style-prop').first())).background).toBe(
    `rgba(0, 0, 0, 0) radial-gradient(rgb(84, 81, 90), rgba(0, 0, 0, 0) 70%) repeat scroll 0% 0% / auto padding-box border-box`
  )
})

test(`className prop flattens`, async ({ page }) => {
  expect((await getStyles(page.getByTestId('class-name').first())).backgroundColor).toBe(
    `rgb(255, 0, 0)`
  )
})
