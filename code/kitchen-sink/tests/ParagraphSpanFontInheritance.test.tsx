import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ParagraphSpanFontInheritance', type: 'useCase' })
})

test(`Span inherits $mono fontFamily from Paragraph`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-mono').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-span-mono').first())

  // parent should have mono font family
  expect(parentStyles.fontFamily).toContain('mono')

  // span should inherit the mono font family
  expect(nestedStyles.fontFamily).toBe(parentStyles.fontFamily)
})

test(`Span inherits $body fontFamily from Paragraph`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-body').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-span-body').first())

  // span should inherit the body font family
  expect(nestedStyles.fontFamily).toBe(parentStyles.fontFamily)
})

test(`nested Text inherits $mono fontFamily from Text (baseline)`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-text-mono').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-text-mono').first())

  // parent should have mono font family
  expect(parentStyles.fontFamily).toContain('mono')

  // nested text should inherit the mono font family
  expect(nestedStyles.fontFamily).toBe(parentStyles.fontFamily)
})

test(`Span explicit fontFamily override works`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-mono-override').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-span-override').first())

  // parent should have mono font family
  expect(parentStyles.fontFamily).toContain('mono')

  // span with explicit $body should NOT inherit mono
  expect(nestedStyles.fontFamily).not.toBe(parentStyles.fontFamily)
})

test(`SizableText keeps its explicit fontFamily (does not inherit)`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-mono-sizable').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-sizable-body').first())

  // parent should have mono font family
  expect(parentStyles.fontFamily).toContain('mono')

  // SizableText has explicit fontFamily: '$body' in its static config,
  // so it should NOT inherit mono but keep its body font
  expect(nestedStyles.fontFamily).not.toBe(parentStyles.fontFamily)
  expect(nestedStyles.fontFamily).toContain('Inter')
})

test(`Text (like Link) inside Paragraph inherits fontFamily`, async ({ page }) => {
  const parentStyles = await getStyles(page.getByTestId('parent-para-link').first())
  const nestedStyles = await getStyles(page.getByTestId('nested-link-text').first())

  // parent should have mono font family
  expect(parentStyles.fontFamily).toContain('mono')

  // nested Text should inherit the mono font family
  expect(nestedStyles.fontFamily).toBe(parentStyles.fontFamily)
})
