import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledInputOnFocus', type: 'useCase' })
})

test(`styled input + onFocus`, async ({ page }) => {
  const input = page.locator('#onFocus')

  await input.focus()

  await page.waitForFunction(
    async () => {
      const inputElement = document.querySelector('#onFocus')
      return inputElement?.getAttribute('data-onfocus') === 'true'
    },
    { timeout: 2000 }
  )

  const styles = await input.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.borderColor).toBe(`rgb(0, 0, 255)`)
  expect(styles.borderWidth).toBe(`10px`)
})
