import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test('scoped popovers work', async ({ page }) => {
  await setupPage(page, { name: 'PopoverScopedCase', type: 'useCase' })

  // Wait for page to load
  await page.waitForLoadState('networkidle')

  async function testPopoverScoped(name: string) {
    const trigger = page.getByTestId(name + '-trigger')
    const content = page.getByTestId(name + '-popover-content')
    const closeButton = page.getByTestId('popover-close')

    // Check initial state
    await expect(trigger).toBeVisible()
    await expect(content).not.toBeVisible()

    // Click trigger to open popover
    await trigger.click()

    // Wait for content to be visible
    await expect(content).toBeVisible({ timeout: 5000 })

    // Click close button
    await closeButton.click()

    // Verify popover is closed
    await expect(content).not.toBeVisible()
  }

  await testPopoverScoped('plain')
  await testPopoverScoped('a')
  await testPopoverScoped('b')
})

test('popover scopes are isolated', async ({ page }) => {
  await setupPage(page, { name: 'PopoverScopedCase', type: 'useCase' })

  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const plainTrigger = page.getByTestId('plain-trigger')
  const aTrigger = page.getByTestId('a-trigger')
  const bTrigger = page.getByTestId('b-trigger')

  const plainContent = page.getByTestId('plain-popover-content')
  const aContent = page.getByTestId('a-popover-content')
  const bContent = page.getByTestId('b-popover-content')

  // Open popover A
  await aTrigger.click()
  await expect(aContent).toBeVisible({ timeout: 5000 })

  // Verify other popovers are not visible
  await expect(plainContent).not.toBeVisible()
  await expect(bContent).not.toBeVisible()

  // Close popover A
  await aContent.getByTestId('popover-close').click()
  await expect(aContent).not.toBeVisible()

  // Open popover B
  await bTrigger.click()
  await expect(bContent).toBeVisible({ timeout: 5000 })

  // Verify other popovers are not visible
  await expect(plainContent).not.toBeVisible()
  await expect(aContent).not.toBeVisible()

  // Close popover B
  await bContent.getByTestId('popover-close').click()
  await expect(bContent).not.toBeVisible()

  // Open plain popover
  await plainTrigger.click()
  await expect(plainContent).toBeVisible({ timeout: 5000 })

  // Verify other popovers are not visible
  await expect(aContent).not.toBeVisible()
  await expect(bContent).not.toBeVisible()

  // Close plain popover
  await plainContent.getByTestId('popover-close').click()
  await expect(plainContent).not.toBeVisible()
})

test('scoped popovers adapt to sheets', async ({ page }) => {
  await setupPage(page, {
    name: 'PopoverScopedCase',
    type: 'useCase',
    adapt: true,
  })

  // Wait for page to load
  await page.waitForLoadState('networkidle')

  async function testPopoverAdapted(name: string) {
    const trigger = page.getByTestId(`${name}-trigger`)
    const popoverContent = page.getByTestId(`${name}-popover-content`)

    // Click trigger to open sheet
    await trigger.click()

    const sheetContents = page.getByTestId(`${name}-sheet-contents`).first()

    // Wait for sheet to be visible
    await expect(sheetContents).toBeVisible({ timeout: 5000 })

    // Check that popover content is inside sheet
    await expect(sheetContents.locator(popoverContent)).toBeVisible()

    const closeButton = sheetContents.getByTestId('popover-close')
    // Click close button
    await closeButton.click()

    // await animation
    await new Promise((res) => setTimeout(res, 1000))

    // Verify sheet is closed
    await expect(sheetContents).not.toBeInViewport()
  }

  await testPopoverAdapted('plain')
  await testPopoverAdapted('a')
  await testPopoverAdapted('b')
})
