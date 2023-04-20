import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledButtonVariantPseudo')
})

test(`hover HOC + variant + pseudos work`, async ({ page }) => {
  const button = page.locator('button#test')

  await button.hover({
    force: true,
  })

  const hoverStyles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(hoverStyles.backgroundColor).toBe(`rgb(0, 128, 0)`)
})

test(`press HOC + variant + pseudos work`, async ({ page }) => {
  const button = page.locator('button#test')

  button.click({
    delay: 1000,
    force: true,
  })

  await new Promise((res) => setTimeout(res, 300))

  const pressStyles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})
