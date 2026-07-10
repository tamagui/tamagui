import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'IconFontSizing', type: 'useCase' })
})

// width of a nested svg inside a component (e.g. Button)
async function nestedSvgWidth(page: any, testId: string) {
  const el = page.getByTestId(testId)
  await expect(el).toBeVisible()
  const svg = el.locator('svg').first()
  return Number(await svg.getAttribute('width'))
}

// width of a direct icon (testID lands on the svg itself)
async function directSvgWidth(page: any, testId: string) {
  const el = page.getByTestId(testId)
  await expect(el).toBeVisible()
  return Number(await el.getAttribute('width'))
}

// computed font-size (px) of the text inside a component
async function fontSizePx(page: any, testId: string) {
  return await page.getByTestId(testId).evaluate((el: HTMLElement) => {
    const spans = [...el.querySelectorAll('span')]
    const t = spans.find((s) => s.textContent && /\S/.test(s.textContent))
    return t ? parseFloat(getComputedStyle(t).fontSize) : NaN
  })
}

test('button icon size matches the button font size at each size', async ({ page }) => {
  // v3: icons resolve via the current font's size scale, so they line up with text
  expect(await nestedSvgWidth(page, 'btn-2')).toBe(await fontSizePx(page, 'btn-2'))
  expect(await nestedSvgWidth(page, 'btn-6')).toBe(await fontSizePx(page, 'btn-6'))
})

test('direct icon token size resolves via the font size scale, not size tokens', async ({
  page,
}) => {
  // font.body.size.$2 === 12 (size token $2 === 28)
  expect(await directSvgWidth(page, 'icon-2')).toBe(12)
  // font.body.size.$8 === 23 (size token $8 === 84)
  expect(await directSvgWidth(page, 'icon-8')).toBe(23)
})
