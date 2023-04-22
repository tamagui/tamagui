import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledButtonVariantPseudoMerge')
})

test(`pseudo + variant with pseudo should merge`, async ({ page }) => {
  const button = page.locator('button#test')

  const promise = button.click({
    delay: 1000,
    force: true,
  })

  await new Promise((res) => setTimeout(res, 300))

  const pressStyles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  expect(pressStyles.transform).toBe(`matrix(0.5, 0, 0, 0.5, 0, 0)`)

  await promise
})

test(`animation + pseudo + variant with pseudo should merge`, async ({ page }) => {
  const button = page.locator('#animated')

  const promise = button.click({
    delay: 2000,
    force: true,
  })

  await new Promise((res) => setTimeout(res, 1200))

  const pressStyles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  expect(pressStyles.transform).toBe(`matrix(0.5, 0, 0, 0.5, 0, 0)`)

  await promise
})
