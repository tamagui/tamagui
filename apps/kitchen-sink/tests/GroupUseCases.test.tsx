import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=GroupUseCases', { waitUntil: 'networkidle' })
  await new Promise((res) => setTimeout(res, 3000))
})

test(`simple api passes border radius`, async ({ page }) => {
  const buttons = await page.getByTestId('simple-api-group').locator('button').all()

  const buttonFirstStyles = await buttons[0].evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(buttonFirstStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderTopRightRadius).toBe('0px')
  expect(buttonFirstStyles.borderBottomRightRadius).toBe('0px')

  const buttonMidStyles = await buttons[1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonMidStyles.borderTopLeftRadius).toBe('0px')
  expect(buttonMidStyles.borderBottomLeftRadius).toBe('0px')
  expect(buttonMidStyles.borderTopRightRadius).toBe('0px')
  expect(buttonMidStyles.borderBottomRightRadius).toBe('0px')

  const buttonLastStyles = await buttons[buttons.length - 1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonLastStyles.borderTopLeftRadius).toBe('0px')
  expect(buttonLastStyles.borderBottomLeftRadius).toBe('0px')
  expect(buttonLastStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomRightRadius).not.toBe('0px')
})

test(`composite api passes border radius`, async ({ page }) => {
  const buttons = await page.getByTestId('composite-api-group').locator('button').all()
  const buttonFirstStyles = await buttons[0].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonFirstStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderTopRightRadius).toBe('0px')
  expect(buttonFirstStyles.borderBottomRightRadius).toBe('0px')

  const buttonMidStyles = await buttons[1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonMidStyles.borderTopLeftRadius).toBe('0px')
  expect(buttonMidStyles.borderBottomLeftRadius).toBe('0px')
  expect(buttonMidStyles.borderTopRightRadius).toBe('0px')
  expect(buttonMidStyles.borderBottomRightRadius).toBe('0px')

  const buttonLastStyles = await buttons[buttons.length - 1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonLastStyles.borderTopLeftRadius).toBe('0px')
  expect(buttonLastStyles.borderBottomLeftRadius).toBe('0px')
  expect(buttonLastStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomRightRadius).not.toBe('0px')
})

test(`composite api group item not using Group.Item will break`, async ({ page }) => {
  const brokenButtonStyles = await page
    .getByTestId('composite-api-group')
    .getByTestId('not-using-item')
    .first()
    .evaluate((el) => {
      return window.getComputedStyle(el)
    })
  expect(brokenButtonStyles.borderTopLeftRadius).not.toBe('0px')
  expect(brokenButtonStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(brokenButtonStyles.borderTopRightRadius).not.toBe('0px')
  expect(brokenButtonStyles.borderBottomRightRadius).not.toBe('0px')
})

test(`simple api with disabled, disables the children`, async ({ page }) => {
  const buttons = await page
    .getByTestId('simple-api-disabled-group')
    .locator('button')
    .all()
  const buttonFirst = buttons[0]
  expect(await buttonFirst.isDisabled()).toBe(true)

  const buttonMid = buttons[1]
  expect(await buttonMid.isDisabled()).toBe(true)

  const buttonLast = buttons[buttons.length - 1]
  expect(await buttonLast.isDisabled()).toBe(true)

  const buttonActive = page
    .getByTestId('simple-api-disabled-group')
    .getByTestId('not-disabled')
    .first()
  expect(await buttonActive.isDisabled()).toBe(false)
})

test(`composite api with disabled, disables the children`, async ({ page }) => {
  const buttons = await page
    .getByTestId('composite-api-disabled-group')
    .locator('button')
    .all()
  const buttonFirst = buttons[0]
  expect(await buttonFirst.isDisabled()).toBe(true)

  const buttonMid = buttons[1]
  expect(await buttonMid.isDisabled()).toBe(true)

  const buttonLast = buttons[buttons.length - 1]
  expect(await buttonLast.isDisabled()).toBe(true)

  const buttonActive = page
    .getByTestId('composite-api-disabled-group')
    .getByTestId('not-disabled')
    .first()
  expect(await buttonActive.isDisabled()).toBe(false)
})

test(`simple api with disablePassBorderRadius, disables passing border radius`, async ({
  page,
}) => {
  const buttons = await page
    .getByTestId('simple-api-disabled-border-radius-pass-group')
    .locator('button')
    .all()
  const buttonFirstStyles = await buttons[0].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonFirstStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomRightRadius).not.toBe('0px')

  const buttonMidStyles = await buttons[1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonMidStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonMidStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonMidStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonMidStyles.borderBottomRightRadius).not.toBe('0px')

  const buttonLastStyles = await buttons[buttons.length - 1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonLastStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonLastStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomRightRadius).not.toBe('0px')
})

test(`composite api with disablePassBorderRadius, disables passing border radius`, async ({
  page,
}) => {
  const buttons = await page
    .getByTestId('composite-api-disabled-border-radius-group')
    .locator('button')
    .all()
  const buttonFirstStyles = await buttons[0].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonFirstStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonFirstStyles.borderBottomRightRadius).not.toBe('0px')

  const buttonMidStyles = await buttons[1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonMidStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonMidStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonMidStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonMidStyles.borderBottomRightRadius).not.toBe('0px')

  const buttonLastStyles = await buttons[buttons.length - 1].evaluate((el) => {
    return window.getComputedStyle(el)
  })
  expect(buttonLastStyles.borderTopLeftRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomLeftRadius).not.toBe('0px')
  expect(buttonLastStyles.borderTopRightRadius).not.toBe('0px')
  expect(buttonLastStyles.borderBottomRightRadius).not.toBe('0px')
})

/*

await page.getByTestId('composite-api-group').getByTestId('simple-api-not-using-item')
await page
  .getByTestId('composite-api-group-disabled-group')
  .getByTestId('simple-api-not-using-item')
await page.getByTestId('composite-api-group-disabled-group')
await page.getByTestId('composite-api-group-disabled-border-radius-group')

*/
