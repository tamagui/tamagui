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
