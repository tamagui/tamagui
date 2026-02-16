import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuItemPseudoOverrideCase', type: 'useCase' })
})

test('spread style object: pseudo styles should override variant defaults', async ({
  page,
}) => {
  // open the menu with spread style object (no unstyled)
  await page.getByTestId('spread-trigger').click()
  await page.waitForTimeout(300)

  const spreadItem = page.getByTestId('spread-item')
  await expect(spreadItem).toBeVisible()

  // focus the item to trigger focusStyle
  await spreadItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied (red), not the default variant
  const focusedStyles = await spreadItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified rgb(255, 0, 0) which should override the default $backgroundHover
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('spread style with unstyled: works correctly', async ({ page }) => {
  // open the menu with spread style + unstyled
  await page.getByTestId('spread-unstyled-trigger').click()
  await page.waitForTimeout(300)

  const unstyledItem = page.getByTestId('spread-unstyled-item')
  await expect(unstyledItem).toBeVisible()

  // focus the item to trigger focusStyle
  await unstyledItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied
  const focusedStyles = await unstyledItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified rgb(255, 0, 0)
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('direct props: user-provided pseudo styles override variant defaults', async ({
  page,
}) => {
  // open the menu with custom pseudo styles
  await page.getByTestId('custom-trigger').click()
  await page.waitForTimeout(300)

  const customItem = page.getByTestId('custom-item')
  await expect(customItem).toBeVisible()

  // focus the item to trigger focusStyle
  await customItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied (red), not the default variant
  const focusedStyles = await customItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified rgb(255, 0, 0) which should override the default $backgroundHover
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('unstyled item with custom pseudo styles works correctly', async ({ page }) => {
  // open the unstyled menu
  await page.getByTestId('unstyled-trigger').click()
  await page.waitForTimeout(300)

  const unstyledItem = page.getByTestId('unstyled-item')
  await expect(unstyledItem).toBeVisible()

  // focus the item to trigger focusStyle
  await unstyledItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied
  const focusedStyles = await unstyledItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified rgb(255, 0, 0)
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('default item uses variant default pseudo styles', async ({ page }) => {
  // open the menu
  await page.getByTestId('custom-trigger').click()
  await page.waitForTimeout(300)

  const defaultItem = page.getByTestId('default-item')
  await expect(defaultItem).toBeVisible()

  // focus the item to trigger focusStyle
  await defaultItem.focus()
  await page.waitForTimeout(100)

  // check that the default focusStyle is applied (not red, but the theme's $backgroundHover)
  const focusedStyles = await defaultItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // should NOT be red (255, 0, 0) - should be the default variant's $backgroundHover
  expect(focusedStyles.backgroundColor).not.toBe('rgb(255, 0, 0)')
  // should have some background color applied
  expect(focusedStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
})

test('shorthands: pseudo styles should override variant defaults', async ({ page }) => {
  // open the menu with shorthand styles (no unstyled)
  await page.getByTestId('shorthand-trigger').click()
  await page.waitForTimeout(300)

  const shorthandItem = page.getByTestId('shorthand-item')
  await expect(shorthandItem).toBeVisible()

  // focus the item to trigger focusStyle
  await shorthandItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied (red)
  const focusedStyles = await shorthandItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified bg: 'rgb(255, 0, 0)' (shorthand) which should override default
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('shorthands with unstyled: works correctly', async ({ page }) => {
  // open the menu with shorthand styles + unstyled
  await page.getByTestId('shorthand-unstyled-trigger').click()
  await page.waitForTimeout(300)

  const shorthandUnstyledItem = page.getByTestId('shorthand-unstyled-item')
  await expect(shorthandUnstyledItem).toBeVisible()

  // focus the item to trigger focusStyle
  await shorthandUnstyledItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied
  const focusedStyles = await shorthandUnstyledItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // user specified bg: 'rgb(255, 0, 0)' (shorthand)
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('styled() component: pseudo styles should override variant defaults', async ({
  page,
}) => {
  // open the menu with styled() component (no unstyled)
  await page.getByTestId('styled-trigger').click()
  await page.waitForTimeout(300)

  const styledItem = page.getByTestId('styled-item')
  await expect(styledItem).toBeVisible()

  // focus the item to trigger focusStyle
  await styledItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied (red)
  const focusedStyles = await styledItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // styled component specified backgroundColor: 'rgb(255, 0, 0)' in focusStyle
  // this should override the variant's default $backgroundHover
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('styled() component with unstyled: works correctly', async ({ page }) => {
  // open the menu with styled() component + unstyled
  await page.getByTestId('styled-unstyled-trigger').click()
  await page.waitForTimeout(300)

  const styledUnstyledItem = page.getByTestId('styled-unstyled-item')
  await expect(styledUnstyledItem).toBeVisible()

  // focus the item to trigger focusStyle
  await styledUnstyledItem.focus()
  await page.waitForTimeout(100)

  // check that the custom focusStyle is applied
  const focusedStyles = await styledUnstyledItem.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // styled component specified backgroundColor: 'rgb(255, 0, 0)' in focusStyle
  expect(focusedStyles.backgroundColor).toBe('rgb(255, 0, 0)')
})
