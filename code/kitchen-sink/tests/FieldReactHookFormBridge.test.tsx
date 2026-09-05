import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test('react-hook-form errors render through Field and receive Form focus handling', async ({
  page,
}) => {
  await setupPage(page, {
    type: 'useCase',
    name: 'FieldReactHookFormBridgeCase',
  })

  await page.getByTestId('rhf-submit').click()

  const email = page.getByTestId('rhf-email')
  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(email).toBeFocused()
  await expect(email).toHaveAttribute('aria-invalid', 'true')

  await email.fill('rhf@example.com')
  await expect(page.getByText('Email is required')).not.toBeVisible()
  await page.getByTestId('rhf-submit').click()
  await expect(page.getByTestId('rhf-status')).toHaveText('submitted')
})
