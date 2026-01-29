import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'NewInputEvents', type: 'useCase' })
})

test('onChange updates value display', async ({ page }) => {
  const input = page.locator('[data-testid="event-input"]')
  const valueDisplay = page.locator('[data-testid="value-display"]')

  await input.fill('hello world')

  await expect(valueDisplay).toContainText('Value: hello world')
})

test('onChange increments change count', async ({ page }) => {
  const input = page.locator('[data-testid="event-input"]')
  const changeCount = page.locator('[data-testid="change-count"]')

  await expect(changeCount).toContainText('Changes: 0')

  await input.fill('a')
  await expect(changeCount).toContainText('Changes: 1')

  await input.fill('ab')
  await expect(changeCount).toContainText('Changes: 2')
})

test('onSubmitEditing fires on Enter', async ({ page }) => {
  const input = page.locator('[data-testid="event-input"]')
  const submitCount = page.locator('[data-testid="submit-count"]')

  await expect(submitCount).toContainText('Submits: 0')

  await input.focus()
  await input.press('Enter')

  await expect(submitCount).toContainText('Submits: 1')
})

test('typing and submitting works together', async ({ page }) => {
  const input = page.locator('[data-testid="event-input"]')
  const valueDisplay = page.locator('[data-testid="value-display"]')
  const submitCount = page.locator('[data-testid="submit-count"]')

  await input.fill('test value')
  await expect(valueDisplay).toContainText('Value: test value')

  await input.press('Enter')
  await expect(submitCount).toContainText('Submits: 1')

  // Value should still be there after submit
  await expect(valueDisplay).toContainText('Value: test value')
})
