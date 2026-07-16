import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'VariablesCase', type: 'useCase' })
})

const CONFIG_LIGHT_ACCENT = 'rgb(0, 90, 200)'
const CONFIG_DARK_ACCENT = 'rgb(90, 90, 255)'
const PATCH_ACCENT = 'rgb(200, 0, 0)'
const PATCH_DARK_ACCENT = 'rgb(200, 100, 100)'
const NESTED_ACCENT = 'rgb(1, 2, 3)'

test('config variables resolve through themes, nested patch wins nearest', async ({
  page,
}) => {
  const square = await getStyles(page.getByTestId('vars-square'))
  expect(square.backgroundColor).toBe(CONFIG_LIGHT_ACCENT)

  const nested = await getStyles(page.getByTestId('vars-nested-square'))
  expect(nested.backgroundColor).toBe(NESTED_ACCENT)

  // a theme below resets keys it defines: inner dark background differs from
  // the inherited light background
  const inherit = await getStyles(page.getByTestId('vars-inherit-square'))
  const reset = await getStyles(page.getByTestId('vars-reset-square'))
  expect(reset.backgroundColor).not.toBe(inherit.backgroundColor)
})

test('patching values restyles with zero re-renders', async ({ page }) => {
  const initialCount = await page.getByTestId('vars-render-count').textContent()

  await page.getByTestId('vars-toggle-patch').click()
  await expect
    .poll(async () => (await getStyles(page.getByTestId('vars-square'))).backgroundColor)
    .toBe(PATCH_ACCENT)

  // memoized subtree must not have re-rendered
  expect(await page.getByTestId('vars-render-count').textContent()).toBe(initialCount)

  // un-patch returns to the config value
  await page.getByTestId('vars-toggle-patch').click()
  await expect
    .poll(async () => (await getStyles(page.getByTestId('vars-square'))).backgroundColor)
    .toBe(CONFIG_LIGHT_ACCENT)
  expect(await page.getByTestId('vars-render-count').textContent()).toBe(initialCount)
})

test('dark-scoped values apply per scheme with zero re-renders', async ({ page }) => {
  const initialCount = await page.getByTestId('vars-render-count').textContent()
  const inheritLight = await getStyles(page.getByTestId('vars-inherit-square'))

  // scheme flip without a patch: config dark value applies
  await page.getByTestId('vars-toggle-scheme').click()
  await expect
    .poll(async () => (await getStyles(page.getByTestId('vars-square'))).backgroundColor)
    .toBe(CONFIG_DARK_ACCENT)

  // unpatched keys follow the theme: inherit square now matches the inner
  // dark-theme reset square
  const inheritDark = await getStyles(page.getByTestId('vars-inherit-square'))
  const reset = await getStyles(page.getByTestId('vars-reset-square'))
  expect(inheritDark.backgroundColor).not.toBe(inheritLight.backgroundColor)
  expect(inheritDark.backgroundColor).toBe(reset.backgroundColor)

  // patch on while dark: the dark-scoped patch wins over the base patch
  await page.getByTestId('vars-toggle-patch').click()
  await expect
    .poll(async () => (await getStyles(page.getByTestId('vars-square'))).backgroundColor)
    .toBe(PATCH_DARK_ACCENT)

  // back to light with patch on: base patch value
  await page.getByTestId('vars-toggle-scheme').click()
  await expect
    .poll(async () => (await getStyles(page.getByTestId('vars-square'))).backgroundColor)
    .toBe(PATCH_ACCENT)

  expect(await page.getByTestId('vars-render-count').textContent()).toBe(initialCount)
})
