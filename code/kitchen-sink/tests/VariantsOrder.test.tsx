import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'VariantsOrder', type: 'useCase' })
})

test(`variants apply below default props but above parent defaultvariants/props as you nest styled()`, async ({
  page,
}) => {
  expect(await getStyles(page.getByTestId('button').first())).toMatchObject({
    flexDirection: 'row',
  })

  expect(await getStyles(page.getByTestId('text1').first())).toMatchObject({
    fontSize: '16px',
  })

  expect(await getStyles(page.getByTestId('text2').first())).toMatchObject({
    fontSize: '15px',
  })

  expect(await getStyles(page.getByTestId('text3').first())).toMatchObject({
    fontSize: '30px',
  })

  expect(await getStyles(page.getByTestId('text4').first())).toMatchObject({
    fontSize: '40px',
  })
})

// Issue #3669: https://github.com/tamagui/tamagui/issues/3669
test(`variant chaining: child variant (test2) translates to parent variant (test) and propagates via context`, async ({
  page,
}) => {
  // Direct test=true on ButtonFrame
  const directFrame = await getStyles(page.getByTestId('frame-test-direct').first())
  expect(directFrame.backgroundColor).toBe('rgb(255, 0, 0)') // red

  // test2=true on ButtonFrame2 should translate to test=true
  const chainedFrame = await getStyles(page.getByTestId('frame-test2-chained').first())
  expect(chainedFrame.backgroundColor).toBe('rgb(255, 0, 0)') // same red

  // ButtonText inside direct test should get white color via context
  const directText = await getStyles(page.getByTestId('text-test-direct').first())
  expect(directText.color).toBe('rgb(255, 255, 255)') // white

  // ButtonText inside chained test2 should also get white via context
  const chainedText = await getStyles(page.getByTestId('text-test2-chained').first())
  expect(chainedText.color).toBe('rgb(255, 255, 255)') // white - this is the regression
})
