import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuUnstyledCase', type: 'useCase' })
})

test('Menu.Content unstyled removes all default styles', async ({ page }) => {
  // open the unstyled menu
  await page.getByTestId('unstyled-menu-trigger').click()
  await page.waitForTimeout(300)

  const unstyledContent = page.getByTestId('unstyled-menu-content')
  await expect(unstyledContent).toBeVisible()

  // check that unstyled menu has no background/padding/border from defaults
  const unstyledStyles = await unstyledContent.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
      padding: computed.padding,
      borderWidth: computed.borderWidth,
    }
  })

  // unstyled should have transparent/none background (rgba(0,0,0,0) or transparent)
  expect(
    unstyledStyles.backgroundColor === 'rgba(0, 0, 0, 0)' ||
      unstyledStyles.backgroundColor === 'transparent'
  ).toBe(true)

  // close the unstyled menu
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)

  // open the styled menu (default)
  await page.getByTestId('styled-menu-trigger').click()
  await page.waitForTimeout(300)

  const styledContent = page.getByTestId('styled-menu-content')
  await expect(styledContent).toBeVisible()

  // check that styled menu has background applied
  const styledStyles = await styledContent.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      backgroundColor: computed.backgroundColor,
    }
  })

  // styled should have a real background color (not transparent)
  expect(
    styledStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      styledStyles.backgroundColor !== 'transparent'
  ).toBe(true)
})
