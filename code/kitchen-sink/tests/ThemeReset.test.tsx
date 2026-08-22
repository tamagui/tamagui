import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeReset', type: 'useCase' })
})

test('Reset from nested themes goes back to grandparent', async ({ page }) => {
  // Pink and blue are sibling sub-themes of dark. Blue replaces pink, then reset
  // moves from dark_blue back to dark.
  const resetButton1 = page.locator(`#${TEST_IDS.resetButton1}`)
  const reference = page.locator('#reset-case-1-reference')
  await expect(resetButton1).toBeVisible()
  await expect(reference).toBeVisible()

  expect((await getStyles(resetButton1)).backgroundColor).toBe(
    (await getStyles(reference)).backgroundColor
  )
})

test('Reset from dark → pink goes back to dark (documentation example)', async ({
  page,
}) => {
  const resetSquare1 = page.locator(`#${TEST_IDS.resetSquare1}`)
  const reference = page.locator('#reset-case-2-reference')
  await expect(resetSquare1).toBeVisible()
  await expect(reference).toBeVisible()

  expect((await getStyles(resetSquare1)).backgroundColor).toBe(
    (await getStyles(reference)).backgroundColor
  )
})

test('Reset from dark only goes to light', async ({ page }) => {
  const resetSquare2 = page.locator(`#${TEST_IDS.resetSquare2}`)
  const reference = page.locator('#reset-case-3-reference')
  await expect(resetSquare2).toBeVisible()
  await expect(reference).toBeVisible()

  expect((await getStyles(resetSquare2)).backgroundColor).toBe(
    (await getStyles(reference)).backgroundColor
  )
})

test('Reset from dark with button shows different themes', async ({ page }) => {
  const darkButton = page.locator(`#${TEST_IDS.darkButton}`)
  const resetButton2 = page.locator(`#${TEST_IDS.resetButton2}`)
  const reference = page.locator('#reset-case-4-reference')

  await expect(darkButton).toBeVisible()
  await expect(resetButton2).toBeVisible()
  await expect(reference).toBeVisible()

  const darkButtonStyles = await getStyles(darkButton)
  const resetButton2Styles = await getStyles(resetButton2)
  const referenceStyles = await getStyles(reference)

  expect(resetButton2Styles.backgroundColor).toBe(referenceStyles.backgroundColor)
  expect(darkButtonStyles.backgroundColor).not.toBe(resetButton2Styles.backgroundColor)
})

test('scheme themes resolve correctly beyond two alternations', async ({ page }) => {
  const target = page.locator('#reset-case-5-target')
  const reference = page.locator('#reset-case-5-reference')
  await expect(target).toBeVisible()
  await expect(reference).toBeVisible()

  expect((await getStyles(target)).backgroundColor).toBe(
    (await getStyles(reference)).backgroundColor
  )
})

test('full-name and relative selectors agree after a scheme round trip', async ({
  page,
}) => {
  const target = page.locator('#reset-case-6-target')
  const reference = page.locator('#reset-case-6-reference')
  await expect(target).toBeVisible()
  await expect(reference).toBeVisible()

  expect((await getStyles(target)).backgroundColor).toBe(
    (await getStyles(reference)).backgroundColor
  )
})
