import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'SheetRestructureCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
})

async function overlayStyles(page: import('@playwright/test').Page) {
  return page.getByTestId('sheet-restructure-modal-overlay').evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      backgroundColor: style.backgroundColor,
      opacity: Number(style.opacity),
    }
  })
}

test('renders direct child overlay live after container and closes modal sheet on Escape', async ({
  page,
}) => {
  await page.getByTestId('sheet-restructure-modal-open').click()
  await expect(page.getByTestId('sheet-restructure-modal-container')).toBeVisible({
    timeout: 5000,
  })
  await expect(page.getByTestId('sheet-restructure-modal-overlay')).toBeVisible()

  const initial = await overlayStyles(page)
  expect(initial.backgroundColor).toBe('rgba(210, 40, 40, 0.35)')
  expect(initial.opacity).toBeCloseTo(0.61, 1)

  await page.getByTestId('sheet-restructure-overlay-toggle').click()
  await page.waitForTimeout(100)

  const updated = await overlayStyles(page)
  expect(updated.backgroundColor).toBe('rgba(10, 120, 80, 0.35)')
  expect(updated.opacity).toBeCloseTo(0.61, 1)

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('sheet-restructure-modal-state')).toHaveText(
    'modal closed'
  )
})

test('Escape does not close non-modal sheet', async ({ page }) => {
  await page.getByTestId('sheet-restructure-nonmodal-open').click()
  await expect(page.getByTestId('sheet-restructure-nonmodal-container')).toBeVisible({
    timeout: 5000,
  })

  await page.keyboard.press('Escape')
  await page.waitForTimeout(100)

  await expect(page.getByTestId('sheet-restructure-nonmodal-state')).toHaveText(
    'non-modal open'
  )
})
