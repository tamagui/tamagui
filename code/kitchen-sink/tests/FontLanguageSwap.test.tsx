import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Swapping a font face by language, end to end.
 *
 * A `body_ja` font key emits its own rules behind `.t_lang-body-ja`, and
 * `<FontLanguage body="ja">` puts that class on a wrapper. The claim being
 * tested is not that the family name changes — that would be true of a swap
 * that carried none of the face with it. It is that `3` means the ja face's
 * size and line height inside the wrapper. Those resolve through CSS variables,
 * so this needs a real browser.
 *
 * Note the fixture asks for `lineHeight="3"` explicitly. Setting `fontSize`
 * alone does not derive a line height from the face's mapping, so a fixture
 * that omitted it would read the same line height for both faces and look like
 * a swap bug when nothing is wrong.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FontLanguageSwapCase', type: 'useCase' })
})

test('the default face resolves its own family and metrics', async ({ page }) => {
  const face = page.getByTestId('default-face')
  await expect(face).toHaveCSS('font-size', '14px')
  await expect(face).toHaveCSS('line-height', '21px')
  expect(await face.evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
    'system-ui'
  )
})

test('a language face brings its own metrics, not just its own name', async ({
  page,
}) => {
  const face = page.getByTestId('ja-face')
  expect(await face.evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
    'KitchenSinkJA'
  )
  // the ja face maps token 3 to 20/30 where the v5 default maps it to 14/21, so
  // these prove the size scale swapped with the family rather than surviving it
  await expect(face).toHaveCSS('font-size', '20px')
  await expect(face).toHaveCSS('line-height', '30px')
})

test('swapping the language at runtime swaps the face and its metrics', async ({
  page,
}) => {
  const face = page.getByTestId('swapped-face')
  await expect(face).toHaveCSS('font-size', '14px')
  await expect(face).toHaveCSS('line-height', '21px')

  await page.getByTestId('toggle-language').click()
  await expect(face).toHaveCSS('font-size', '20px')
  await expect(face).toHaveCSS('line-height', '30px')
  expect(await face.evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
    'KitchenSinkJA'
  )

  await page.getByTestId('toggle-language').click()
  await expect(face).toHaveCSS('font-size', '14px')
  await expect(face).toHaveCSS('line-height', '21px')
})

test('the swap is scoped to the wrapper and leaves the rest of the page alone', async ({
  page,
}) => {
  await page.getByTestId('toggle-language').click()
  await expect(page.getByTestId('swapped-face')).toHaveCSS('font-size', '20px')

  // the default face is outside the wrapper, so a language swap must not reach it
  const untouched = page.getByTestId('default-face')
  await expect(untouched).toHaveCSS('font-size', '14px')
  await expect(untouched).toHaveCSS('line-height', '21px')
  expect(await untouched.evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
    'system-ui'
  )
})
