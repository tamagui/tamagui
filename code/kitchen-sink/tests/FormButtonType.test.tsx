import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { type: 'useCase', name: 'FormButtonTypeCase' })
})

test('Button renders with type="button" by default', async ({ page }) => {
  const button = page.getByTestId('regular-button')
  await expect(button).toBeVisible()

  const type = await button.getAttribute('type')
  expect(type).toBe('button')
})

test('Form.Trigger submits the form when clicked', async ({ page }) => {
  const submitButton = page.getByTestId('submit-button')
  const submitStatus = page.getByTestId('submit-status')

  await expect(submitButton).toBeVisible()
  await expect(submitStatus).toHaveText('not-submitted')

  await submitButton.click()

  await expect(submitStatus).toHaveText('submitted')
})

test('pressing Enter in input submits form, not regular button click', async ({
  page,
}) => {
  const input = page.getByTestId('form-input')
  const submitStatus = page.getByTestId('submit-status')
  const buttonStatus = page.getByTestId('button-status')

  await input.focus()
  await input.press('Enter')

  // form should be submitted
  await expect(submitStatus).toHaveText('submitted')
  // regular button should NOT have been clicked
  await expect(buttonStatus).toHaveText('button-not-clicked')
})
