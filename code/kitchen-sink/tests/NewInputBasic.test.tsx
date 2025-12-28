import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'NewInputBasic', type: 'useCase' })
})

test('renders basic input', async ({ page }) => {
  const input = page.locator('[data-testid="basic-input"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('placeholder', 'Basic input')
})

test('renders password input with correct type', async ({ page }) => {
  const input = page.locator('[data-testid="password-input"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('type', 'password')
})

test('renders email input with correct type', async ({ page }) => {
  const input = page.locator('[data-testid="email-input"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('type', 'email')
})

test('renders number input with correct type', async ({ page }) => {
  const input = page.locator('[data-testid="number-input"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('type', 'number')
})

test('renders disabled input', async ({ page }) => {
  const input = page.locator('[data-testid="disabled-input"]')
  await expect(input).toBeVisible()
  await expect(input).toBeDisabled()
})

test('renders readonly input', async ({ page }) => {
  const input = page.locator('[data-testid="readonly-input"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('readonly', '')
  await expect(input).toHaveValue('Read only value')
})

test('renders textarea', async ({ page }) => {
  const textarea = page.locator('[data-testid="basic-textarea"]')
  await expect(textarea).toBeVisible()
  // Textarea should be rendered as textarea element
  await expect(textarea).toHaveAttribute('placeholder', 'Basic textarea')
})
