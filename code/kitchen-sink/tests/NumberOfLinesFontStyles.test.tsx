import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'NumberOfLinesFontStyles', type: 'useCase' })
})

test('numberOfLines=1 does not change fontWeight on SizableText', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('sized-no-lines').first())
  const oneLineStyles = await getStyles(page.getByTestId('sized-one-line').first())

  expect(oneLineStyles.fontWeight).toBe(refStyles.fontWeight)
})

test('numberOfLines=1 does not change lineHeight on SizableText', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('sized-no-lines').first())
  const oneLineStyles = await getStyles(page.getByTestId('sized-one-line').first())

  expect(oneLineStyles.lineHeight).toBe(refStyles.lineHeight)
})

test('numberOfLines=2 does not change fontWeight on SizableText', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('sized-no-lines').first())
  const twoLineStyles = await getStyles(page.getByTestId('sized-two-lines').first())

  expect(twoLineStyles.fontWeight).toBe(refStyles.fontWeight)
})

test('numberOfLines=2 does not change lineHeight on SizableText', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('sized-no-lines').first())
  const twoLineStyles = await getStyles(page.getByTestId('sized-two-lines').first())

  expect(twoLineStyles.lineHeight).toBe(refStyles.lineHeight)
})

test('numberOfLines=1 does not change fontWeight on Paragraph', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('para-no-lines').first())
  const oneLineStyles = await getStyles(page.getByTestId('para-one-line').first())

  expect(oneLineStyles.fontWeight).toBe(refStyles.fontWeight)
})

test('numberOfLines=1 does not change lineHeight on Paragraph', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('para-no-lines').first())
  const oneLineStyles = await getStyles(page.getByTestId('para-one-line').first())

  expect(oneLineStyles.lineHeight).toBe(refStyles.lineHeight)
})

test('numberOfLines=2 does not change fontWeight on Paragraph', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('para-no-lines').first())
  const twoLineStyles = await getStyles(page.getByTestId('para-two-lines').first())

  expect(twoLineStyles.fontWeight).toBe(refStyles.fontWeight)
})

test('numberOfLines=2 does not change lineHeight on Paragraph', async ({ page }) => {
  const refStyles = await getStyles(page.getByTestId('para-no-lines').first())
  const twoLineStyles = await getStyles(page.getByTestId('para-two-lines').first())

  expect(twoLineStyles.lineHeight).toBe(refStyles.lineHeight)
})
