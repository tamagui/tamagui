import { expect, test } from '@playwright/test'

import { getStyles, whilePressed } from './utils'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=ButtonUnstyled')
})

function expectEmptyStyles(styles: any) {
  expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
  expect(styles.padding).toBe(`0px`)
  expect(styles.borderWidth).toBe(`0px`)
}

test(`unstyled prop works when used with styled()`, async ({ page }) => {
  const button = page.locator('#unstyled-inline')
  const styles = await getStyles(button)

  expectEmptyStyles(styles)

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expectEmptyStyles(pressStyles)
  })
})

test(`unstyled prop works when used inline`, async ({ page }) => {
  const button = page.locator('#unstyled-styled')
  const styles = await getStyles(button)

  expectEmptyStyles(styles)

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expectEmptyStyles(pressStyles)
  })
})
