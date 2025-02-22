import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getPressStyle, getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'GetParentStaticConfigOfStyledComponentWrappedByMemo',
    type: 'useCase',
  })
})

test(`should get parent static config properly and not clobber parent transform styles`, async ({
  page,
}) => {
  const locator = page.locator('#styled-view-wrapped-by-memo')

  const pressStyle = await getPressStyle(locator, { delay: 3000 })

  const transform = pressStyle?.transform || pressStyle?.webkitTransform

  const values = transform?.match(/-?[\d.]+/g) ?? []

  const [scaleX, skewX, skewY, scaleY, translateX, translateY] = values.map(String) as [
    string,
    string,
    string,
    string,
    string,
    string,
  ]

  expect(scaleX).toBe('1.2')
  expect(scaleY).toBe('1.2')
  expect(translateX).toBe('15')
  expect(translateY).toBe('15')
})
