import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=FontFamilyShorthand', { waitUntil: 'networkidle' })
})

test(`using full form and shorthand for fontFamily both respect text-transform`, async ({ page }) => {
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
