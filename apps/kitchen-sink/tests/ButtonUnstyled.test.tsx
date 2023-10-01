import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, whilePressed } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonUnstyled', type: 'useCase' })
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

test(`unstyled prop works when used with styled() + merges when its own variant unstyled is also set`, async ({
  page,
}) => {
  const button = page.locator('#unstyled-merged')
  const styles = await getStyles(button)

  expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
  expect(styles.borderLeftWidth).toBe('2px')
  expect(styles.borderColor).toBe('rgb(0, 128, 0)')

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
    expect(pressStyles.borderLeftWidth).toBe('2px')
    expect(pressStyles.borderColor).toBe('rgb(0, 128, 0)')
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
