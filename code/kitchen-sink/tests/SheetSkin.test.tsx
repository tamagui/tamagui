import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetSkin', type: 'useCase' })
})

test('uses the copied skin with the public Sheet root and parts', async ({ page }) => {
  await page.getByTestId('sheet-skin-open').click()

  await expect(page.getByTestId('sheet-skin-overlay')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-handle')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-container')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-background')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-scroll-view')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-title')).toHaveText(
    'Public behavior, copied aesthetics'
  )
})

test('applies app-owned surface, handle, overlay, and spacing aesthetics', async ({
  page,
}) => {
  await page.getByTestId('sheet-skin-open').click()

  await expect(page.getByTestId('sheet-skin-overlay')).toHaveCSS('opacity', '0.45')
  await expect(page.getByTestId('sheet-skin-handle')).toHaveCSS('height', '10px')
  // content spacing lives on the ScrollView (paddingHorizontal $2), not the
  // Container frame — Container frame padding inflates the fit-mode height and
  // breaks keyboard-lift geometry (see SheetWebKeyboard), so the skin keeps the
  // frame padding-free and insets content via the ScrollView + consumer content.
  await expect(page.getByTestId('sheet-skin-container')).toHaveCSS('padding-top', '0px')
  await expect(page.getByTestId('sheet-skin-scroll-view')).toHaveCSS(
    'padding-left',
    '7px'
  )
  await expect(page.getByTestId('sheet-skin-background')).toHaveCSS(
    'border-top-left-radius',
    '16px'
  )
})

test('preserves close behavior through the copied parts', async ({ page }) => {
  const container = page.getByTestId('sheet-skin-container')

  await page.getByTestId('sheet-skin-open').click()
  await expect(container).toHaveAttribute('data-state', 'open')
  await page.getByTestId('sheet-skin-close').click()

  await expect(container).toHaveAttribute('data-state', 'closed')
  await expect(page.getByTestId('sheet-skin-overlay')).toHaveCount(0)
})

// A1 component-state, end to end on web: the copied Sheet skin, driven only by
// the public behavior, emits the canonical `open` web attribute the vocabulary
// maps that state to (stateToSelector.open === '[data-state="open"]', and the
// registry's meta.states=['open'] for sheet). resolving the container BY that
// attribute selector — the exact form a shadcn/Tailwind consumer's
// `data-[state=open]:` class uses — proves the state resolves through one
// data-state vocabulary, not a per-component spelling.
test('the copied skin resolves the canonical open-state web selector', async ({
  page,
}) => {
  const openContainer = `[data-testid="sheet-skin-container"][data-state="open"]`

  await page.getByTestId('sheet-skin-open').click()
  await expect(page.locator(openContainer)).toBeVisible()

  await page.getByTestId('sheet-skin-close').click()
  await expect(page.locator(openContainer)).toHaveCount(0)
})
