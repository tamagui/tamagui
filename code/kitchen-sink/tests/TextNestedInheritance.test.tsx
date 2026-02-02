import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'TextNestedInheritance', type: 'useCase' })
})

test(`nested text inherits color from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-color').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-color').first())

  // Parent should have blue color
  expect(parentStyles.color).toBe('rgb(0, 0, 255)')

  // Nested text should inherit the blue color
  expect(nestedStyles.color).toBe(parentStyles.color)
})

test(`nested text inherits whiteSpace from parent (for numberOfLines)`, async ({
  page,
}) => {
  const parentStyles = await getStyles(page.getByTestId('parent-number-of-lines').first())
  const nestedStyles = await getStyles(
    page.getByTestId('nested-in-number-of-lines').first()
  )

  // Parent with numberOfLines=1 should have nowrap
  expect(parentStyles.whiteSpace).toBe('nowrap')

  // Nested text should inherit nowrap (not override with pre-wrap)
  expect(nestedStyles.whiteSpace).toBe('nowrap')

  // Nested text should also inherit color
  expect(nestedStyles.color).toBe(parentStyles.color)
})

test(`nested text inherits explicit whiteSpace from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-whitespace').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-whitespace').first())

  // Parent should have nowrap
  expect(parentStyles.whiteSpace).toBe('nowrap')

  // Nested text should inherit nowrap
  expect(nestedStyles.whiteSpace).toBe('nowrap')
})

test(`nested text inherits letterSpacing from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-letter-spacing').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-letter-spacing').first())

  // Parent should have letter-spacing of 5px
  expect(parentStyles.letterSpacing).toBe('5px')

  // Nested text should inherit letter-spacing
  expect(nestedStyles.letterSpacing).toBe('5px')
})

test(`styled nested text inherits color from parent`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-styled').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-styled').first())

  // Parent should have green color
  expect(parentStyles.color).toBe('rgb(0, 128, 0)')

  // Styled nested text should inherit the green color
  expect(nestedStyles.color).toBe(parentStyles.color)
})

test(`explicit color override on nested text still works`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-override').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-override').first())

  // Parent should have purple color
  expect(parentStyles.color).toBe('rgb(128, 0, 128)')

  // Nested text with explicit color should NOT inherit - should be orange
  expect(nestedStyles.color).toBe('rgb(255, 165, 0)')
})
