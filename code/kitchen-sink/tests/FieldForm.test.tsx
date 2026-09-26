import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    type: 'useCase',
    name: 'FieldValidatedSignupCase',
  })
})

test('associates labels and descriptions without announcing pristine validity', async ({
  page,
}) => {
  const input = page.getByTestId('signup-first-name')
  const field = page.getByTestId('signup-first-name-field')
  const label = page.getByText('First name', { exact: true })
  const description = page.getByText('Shown on your profile', { exact: true })
  const portaledDescription = page.getByTestId('signup-first-name-portaled-description')
  const labelId = await label.getAttribute('id')

  expect(labelId).toBeTruthy()
  await expect(input).toHaveAttribute('aria-labelledby', labelId!)
  const describedBy = (await input.getAttribute('aria-describedby'))?.split(' ')
  expect(describedBy).toContain(await description.getAttribute('id'))
  expect(describedBy).toContain(await portaledDescription.getAttribute('id'))
  await expect(input).not.toHaveAttribute('aria-invalid')
  await expect(field).not.toHaveAttribute('data-valid')
  await expect(field).not.toHaveAttribute('data-invalid')

  await input.focus()
  await input.fill('Ada')
  await expect(field).toHaveAttribute('data-focused', '')
  await expect(field).toHaveAttribute('data-dirty', '')
  await expect(field).toHaveAttribute('data-filled', '')
  await expect(input).toHaveAttribute('data-dirty', '')
  await expect(label).toHaveAttribute('data-dirty', '')
  await expect(description).toHaveAttribute('data-dirty', '')
  await input.blur()
  await expect(field).toHaveAttribute('data-touched', '')
})

test('validates on blur and revalidates on change after submit', async ({ page }) => {
  const username = page.getByTestId('signup-username')
  await username.fill('ab')
  await username.blur()

  const error = page.getByText('Username must be at least 3 characters')
  await expect(error).toBeVisible()
  await expect(username).toHaveAttribute('aria-invalid', 'true')
  expect((await username.getAttribute('aria-describedby'))?.split(' ')).toContain(
    await error.getAttribute('id')
  )

  await page.getByTestId('signup-submit').click()

  const firstName = page.getByTestId('signup-first-name')
  await expect(firstName).toBeFocused()
  await expect(firstName).toHaveAttribute('aria-invalid', 'true')

  await firstName.fill('Ada')
  await expect(firstName).not.toHaveAttribute('aria-invalid')
  await expect(page.getByTestId('signup-first-name-field')).toHaveAttribute(
    'data-valid',
    ''
  )
})

test('does not wait for an async validator before submitting', async ({ page }) => {
  await page.getByTestId('signup-first-name').fill('Ada')
  await page.getByTestId('signup-last-name').fill('Lovelace')
  await page.getByTestId('signup-email').fill('ada@example.com')
  await page.getByTestId('signup-username').fill('reserved')

  await page.getByTestId('signup-submit').click()

  await expect(page.getByTestId('signup-status')).toHaveText('submitted: trigger-press', {
    timeout: 250,
  })
  await expect(page.getByText('Username is reserved')).not.toBeVisible()
  await expect(page.getByText('Username is reserved')).toBeVisible()
})

test('injects server errors, focuses the first invalid field, and clears on edit', async ({
  page,
}) => {
  await page.getByTestId('signup-first-name').fill('Ada')
  await page.getByTestId('signup-last-name').fill('Lovelace')
  await page.getByTestId('signup-email').fill('used@example.com')
  await page.getByTestId('signup-username').fill('available')

  await page.getByTestId('signup-submit').click()

  const email = page.getByTestId('signup-email')
  await expect(page.getByText('That email is already registered')).toBeVisible()
  await expect(email).toBeFocused()
  await expect(email).toHaveAttribute('aria-invalid', 'true')

  await email.fill('new@example.com')
  await expect(page.getByText('That email is already registered')).not.toBeVisible()
})
