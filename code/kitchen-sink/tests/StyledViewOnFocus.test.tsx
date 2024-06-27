import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledViewOnFocus', type: 'useCase' })
})

test(`styled view + onFocus`, async ({ page }) => {
  const view = page.locator('#onFocus')

  await view.focus()

  await page.waitForFunction(
    async () => {
      const element = document.querySelector('#onFocus')
      return element?.getAttribute('data-onfocus') === 'true'
    },
    { timeout: 2000 }
  )

  const styles = await view.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.borderColor).toBe(`rgb(0, 0, 255)`)
  expect(styles.borderWidth).toBe(`10px`)
})
