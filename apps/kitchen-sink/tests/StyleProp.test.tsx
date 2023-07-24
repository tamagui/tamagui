import { expect, test } from '@playwright/test'

import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyleProp', { waitUntil: 'networkidle' })
})

test(`style prop flattens`, async ({ page }) => {
  expect((await getStyles(page.getByTestId('style-prop').first())).background).toBe(
    `rgba(0, 0, 0, 0) radial-gradient(rgb(143, 143, 143), rgba(0, 0, 0, 0) 70%) repeat scroll 0% 0% / auto padding-box border-box`
  )
})

test(`className prop flattens`, async ({ page }) => {
  expect((await getStyles(page.getByTestId('class-name').first())).backgroundColor).toBe(
    `rgb(255, 0, 0)`
  )
})
