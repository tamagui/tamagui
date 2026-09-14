import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, whilePressed } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonUnstyled', type: 'useCase' })
})

function expectPlainStyles(styles: any) {
  expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
  expect(styles.padding).toBe(`0px`)
  expect(styles.borderWidth).toBe(`0px`)
}

test(`parent variants work inline`, async ({ page }) => {
  const button = page.locator('#plain-inline')
  const styles = await getStyles(button)

  expectPlainStyles(styles)

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expectPlainStyles(pressStyles)
  })
})

test(`a styled child merges its own definition of a parent variant`, async ({ page }) => {
  const button = page.locator('#plain-merged')
  const styles = await getStyles(button)

  expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
  expect(styles.borderLeftWidth).toBe('2px')
  expect(styles.borderColor).toBe('rgb(0, 128, 0)')

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
    expect(pressStyles.borderLeftWidth).toBe('2px')
    expect(pressStyles.borderColor).toBe('rgba(0, 0, 0, 0)')
  })
})

test(`styled options accept an inherited variant default`, async ({ page }) => {
  const button = page.locator('#plain-styled')
  const styles = await getStyles(button)

  expectPlainStyles(styles)

  await whilePressed(button, async () => {
    const pressStyles = await getStyles(button)
    expectPlainStyles(pressStyles)
  })
})
