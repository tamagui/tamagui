import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledAnchor', type: 'useCase' })
})

test(`styled anchor passes non-styled attributes through`, async ({ page }) => {
  const anchor = page.getByTestId('test-anchor')
  expect(await anchor.getAttribute('target')).toBe('_blank')
  expect(await anchor.getAttribute('href')).toBe('https://tamagui.dev/test-link')

  const anchor2 = page.getByTestId('test-anchor2')
  expect(await anchor2.getAttribute('target')).toBe('_blank')
  expect(await anchor2.getAttribute('href')).toBe('https://tamagui.dev/test-link')
})
