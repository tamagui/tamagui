import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'TextNestedInheritance', type: 'useCase' })
})

test(`nested tamagui Text does NOT inherit color (sets own theme color)`, async ({
  page,
}) => {
  const parentStyles = await getStyles(page.getByTestId('parent-color').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-color').first())

  // parent should have blue color
  expect(parentStyles.color).toBe('rgb(0, 0, 255)')

  // nested tamagui Text sets color: '$color' so should NOT be blue
  expect(nestedStyles.color).not.toBe(parentStyles.color)
})

test(`nested core Text inherits color from parent via CSS`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-core-color').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-core-color').first())

  // parent should have blue
  expect(parentStyles.color).toBe('rgb(0, 0, 255)')

  // core Text does not set color, so it inherits blue via CSS
  expect(nestedStyles.color).toBe(parentStyles.color)
})

test(`nested text inherits whiteSpace from parent (for numberOfLines)`, async ({
  page,
}) => {
  const parentStyles = await getStyles(page.getByTestId('parent-number-of-lines').first())
  const nestedStyles = await getStyles(
    page.getByTestId('nested-in-number-of-lines').first()
  )

  // parent with numberOfLines=1 should have nowrap
  expect(parentStyles.whiteSpace).toBe('nowrap')

  // nested text should inherit nowrap via CSS
  expect(nestedStyles.whiteSpace).toBe('nowrap')
})

test(`nested text inherits explicit whiteSpace from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-whitespace').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-whitespace').first())

  // parent should have nowrap
  expect(parentStyles.whiteSpace).toBe('nowrap')

  // nested text should inherit nowrap
  expect(nestedStyles.whiteSpace).toBe('nowrap')
})

test(`nested text inherits letterSpacing from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-letter-spacing').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-letter-spacing').first())

  // parent should have letter-spacing of 5px
  expect(parentStyles.letterSpacing).toBe('5px')

  // nested text should inherit letter-spacing
  expect(nestedStyles.letterSpacing).toBe('5px')
})

test(`styled nested text does NOT inherit color (sets own theme color)`, async ({
  page,
}) => {
  const parentStyles = await getStyles(page.getByTestId('parent-styled').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-styled').first())

  // parent should have green color
  expect(parentStyles.color).toBe('rgb(0, 128, 0)')

  // styled Text (BoldText) also sets color: '$color', should NOT be green
  expect(nestedStyles.color).not.toBe(parentStyles.color)
})

test(`explicit color override on nested text still works`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-override').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-override').first())

  // parent should have purple color
  expect(parentStyles.color).toBe('rgb(128, 0, 128)')

  // nested text with explicit color should be orange
  expect(nestedStyles.color).toBe('rgb(255, 165, 0)')
})
