import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FormButtonType', type: 'useCase' })
})

test(`regular Button should have type="button" and pressing Enter submits via Form.Trigger`, async ({ page }) => {
  const input = page.locator('#test-input')
  const regularButton = page.locator('#regular-button')
  const submitButton = page.locator('#submit-button')
  const formStatus = page.locator('#form-status')
  const buttonStatus = page.locator('#button-status')

  // Wait for elements to be visible
  await input.waitFor({ state: 'visible' })
  await regularButton.waitFor({ state: 'visible' })
  await submitButton.waitFor({ state: 'visible' })

  // Check that the regular button has type="button" (not type="submit")
  const regularButtonType = await regularButton.getAttribute('type')
  expect(regularButtonType).toBe('button')

  // Check that the Form.Trigger button has type="submit"
  const submitButtonType = await submitButton.getAttribute('type')
  expect(submitButtonType).toBe('submit')

  // Verify initial state
  await expect(formStatus).toContainText('Form submitted: no')
  await expect(buttonStatus).toContainText('Button clicked: no')

  // Focus the input and press Enter
  await input.focus()
  await page.keyboard.press('Enter')

  // Wait a moment for any state changes
  await page.waitForTimeout(100)

  // The form SHOULD have been submitted via the Form.Trigger (type="submit")
  // The regular Button (type="button") should NOT have been triggered
  await expect(formStatus).toContainText('Form submitted: yes')
  await expect(buttonStatus).toContainText('Button clicked: no')
})

test(`Form.Trigger button should submit form when clicked`, async ({ page }) => {
  const submitButton = page.locator('#submit-button')
  const formStatus = page.locator('#form-status')

  await submitButton.waitFor({ state: 'visible' })
  await expect(formStatus).toContainText('Form submitted: no')

  // Click the submit button
  await submitButton.click()

  await page.waitForTimeout(100)
  await expect(formStatus).toContainText('Form submitted: yes')
})

test(`clicking regular Button should trigger its onPress`, async ({ page }) => {
  const regularButton = page.locator('#regular-button')
  const buttonStatus = page.locator('#button-status')
  const formStatus = page.locator('#form-status')

  await regularButton.waitFor({ state: 'visible' })

  await expect(buttonStatus).toContainText('Button clicked: no')
  await expect(formStatus).toContainText('Form submitted: no')

  // Click the regular button
  await regularButton.click()

  await page.waitForTimeout(100)

  // Button should be clicked, form should NOT be submitted
  await expect(buttonStatus).toContainText('Button clicked: yes')
  await expect(formStatus).toContainText('Form submitted: no')
})
