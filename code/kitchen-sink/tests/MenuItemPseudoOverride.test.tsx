import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuItemPseudoOverrideCase', type: 'useCase' })
})

async function expectFocusedBackground(page: Page, triggerId: string, itemId: string) {
  await page.getByTestId(triggerId).click()
  await page.waitForTimeout(300)

  const item = page.getByTestId(itemId)
  await expect(item).toBeVisible()
  await item.focus()
  await page.waitForTimeout(100)
  await expect(item).toHaveCSS('background-color', 'rgb(255, 0, 0)')
}

test('spread style object pseudo styles override defaults', async ({ page }) => {
  await expectFocusedBackground(page, 'spread-trigger', 'spread-item')
})

test('direct pseudo style props override defaults', async ({ page }) => {
  await expectFocusedBackground(page, 'custom-trigger', 'custom-item')
})

test('behavior item has no default focus skin', async ({ page }) => {
  await page.getByTestId('custom-trigger').click()
  await page.waitForTimeout(300)

  const item = page.getByTestId('default-item')
  await expect(item).toBeVisible()
  await item.focus()
  await page.waitForTimeout(100)
  await expect(item).not.toHaveCSS('background-color', 'rgb(255, 0, 0)')
  await expect(item).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
})

test('shorthand pseudo styles override defaults', async ({ page }) => {
  await expectFocusedBackground(page, 'shorthand-trigger', 'shorthand-item')
})

test('styled component pseudo styles override defaults', async ({ page }) => {
  await expectFocusedBackground(page, 'styled-trigger', 'styled-item')
})
