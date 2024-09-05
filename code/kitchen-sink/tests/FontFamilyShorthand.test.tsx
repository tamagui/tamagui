import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FontFamilyShorthand', type: 'useCase' })
})

test(`using full form and shorthand for fontFamily both respect text-transform`, async ({
  page,
}) => {
  const fullform = page.getByTestId('fullform')
  const shorthand = page.getByTestId('shorthand')

  const fullformTT = await fullform.evaluate(
    (element) => window.getComputedStyle(element).textTransform
  )
  const shorthandTT = await shorthand.evaluate(
    (element) => window.getComputedStyle(element).textTransform
  )

  expect(fullformTT).toEqual('uppercase')
  expect(shorthandTT).toEqual('uppercase')
})
