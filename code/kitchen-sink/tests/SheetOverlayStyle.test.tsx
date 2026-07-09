import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'SheetOverlayStyleCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
})

async function overlayStyles(page: import('@playwright/test').Page) {
  return page.getByTestId('sheet-overlay-style-overlay').evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      backgroundColor: style.backgroundColor,
      opacity: Number(style.opacity),
    }
  })
}

test('Sheet.Overlay updates caller props while rendered in the sheet root', async ({
  page,
}) => {
  await page.getByTestId('sheet-overlay-style-open').click()
  await expect(page.getByTestId('sheet-overlay-style-frame')).toBeVisible({
    timeout: 5000,
  })
  await page.waitForTimeout(250)

  const initial = await overlayStyles(page)
  expect(initial.backgroundColor).toBe('rgba(210, 40, 40, 0.35)')
  expect(initial.opacity).toBeCloseTo(0.61, 1)
  await expect(page.getByTestId('sheet-overlay-style-overlay-copy')).toHaveText(
    'initial overlay props'
  )
  await expect(page.getByTestId('sheet-overlay-style-overlay')).toHaveAttribute(
    'data-overlay-state',
    'initial'
  )

  await page.getByTestId('sheet-overlay-style-toggle').click()

  // poll: the css driver transitions background-color, so a fixed wait can
  // sample an intermediate color mid-transition
  await expect
    .poll(async () => (await overlayStyles(page)).backgroundColor, { timeout: 5000 })
    .toBe('rgba(10, 120, 80, 0.35)')
  const updated = await overlayStyles(page)
  expect(updated.opacity).toBeCloseTo(0.61, 1)
  await expect(page.getByTestId('sheet-overlay-style-overlay-copy')).toHaveText(
    'alternate overlay props'
  )
  await expect(page.getByTestId('sheet-overlay-style-overlay')).toHaveAttribute(
    'data-overlay-state',
    'alternate'
  )
})

test('Escape closes modal sheets only by default', async ({ page }) => {
  await page.getByTestId('sheet-escape-modal-open').click()
  await expect(page.getByTestId('sheet-escape-modal-state')).toHaveText('modal-open')
  await expect(page.getByTestId('sheet-escape-modal-frame')).toBeVisible({
    timeout: 5000,
  })

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('sheet-escape-modal-state')).toHaveText('modal-closed')

  await page.getByTestId('sheet-escape-nonmodal-open').click()
  await expect(page.getByTestId('sheet-escape-nonmodal-state')).toHaveText(
    'nonmodal-open'
  )
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('sheet-escape-nonmodal-state')).toHaveText(
    'nonmodal-open'
  )
})

test('Escape closes only the top-most nested modal sheet', async ({ page }) => {
  await page.getByTestId('sheet-escape-nested-parent-open').click()
  await expect(page.getByTestId('sheet-escape-nested-parent-state')).toHaveText(
    'parent-open'
  )
  await expect(page.getByTestId('sheet-escape-nested-parent-frame')).toBeVisible({
    timeout: 5000,
  })

  await page.getByTestId('sheet-escape-nested-child-open').click()
  await expect(page.getByTestId('sheet-escape-nested-child-state')).toHaveText(
    'child-open'
  )
  await expect(page.getByTestId('sheet-escape-nested-child-frame')).toBeVisible({
    timeout: 5000,
  })

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('sheet-escape-nested-child-state')).toHaveText(
    'child-closed'
  )
  await expect(page.getByTestId('sheet-escape-nested-parent-state')).toHaveText(
    'parent-open'
  )

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('sheet-escape-nested-parent-state')).toHaveText(
    'parent-closed'
  )
})
