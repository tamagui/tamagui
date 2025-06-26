import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'PopoverCase', type: 'useCase' })
})

// Test simple popover functionality
test('simple popover opens and closes', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const trigger = page.getByTestId('simple-popover-trigger')
  const content = page.getByTestId('simple-popover-content')
  const closeButton = page.getByTestId('simple-popover-close')

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
})

// Test basic popover with icon trigger
test('basic popover with icon trigger', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const trigger = page.getByTestId('popover-bottom-trigger')
  const content = page.getByTestId('popover-bottom-content')
  const input = page.getByTestId('popover-bottom-input')
  const closeButton = page.getByTestId('popover-bottom-close')

  // Check initial state
  await expect(trigger).toBeVisible()
  await expect(content).not.toBeVisible()

  // Click trigger to open popover
  await trigger.click()

  // Wait for content to be visible
  await expect(content).toBeVisible({ timeout: 5000 })

  // Test interaction with content
  await expect(input).toBeVisible()
  await input.fill('Test input')
  await expect(input).toHaveValue('Test input')

  // Click close button
  await closeButton.click()

  // Verify popover is closed
  await expect(content).not.toBeVisible()
})

// Test popover placement variations
test('popover placement variations', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const placements = ['left', 'top', 'right']

  for (const placement of placements) {
    const trigger = page.getByTestId(`popover-${placement}-trigger`)
    const content = page.getByTestId(`popover-${placement}-content`)

    // Check initial state
    await expect(trigger).toBeVisible()
    await expect(content).not.toBeVisible()

    // Click trigger to open popover
    await trigger.click()

    // Wait for content to be visible
    await expect(content).toBeVisible({ timeout: 5000 })

    // Close by clicking outside (ESC key)
    await page.keyboard.press('Escape')

    // Verify popover is closed
    await expect(content).not.toBeVisible()
  }
})

// Test popover with keyboard navigation
test('popover keyboard navigation', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const trigger = page.getByTestId('simple-popover-trigger')
  const content = page.getByTestId('simple-popover-content')

  // Focus trigger and open with Enter key
  await trigger.focus()
  await page.keyboard.press('Enter')

  // Wait for content to be visible
  await expect(content).toBeVisible({ timeout: 5000 })

  // Close with Escape key
  await page.keyboard.press('Escape')

  // Verify popover is closed
  await expect(content).not.toBeVisible()
})

// Test popover accessibility
test('popover accessibility attributes', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const trigger = page.getByTestId('simple-popover-trigger')
  const content = page.getByTestId('simple-popover-content')

  // Check initial state
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  // Open popover
  await trigger.click()
  await expect(content).toBeVisible({ timeout: 5000 })

  // Check expanded state
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  // Close popover
  await page.keyboard.press('Escape')
  await expect(content).not.toBeVisible()

  // Check collapsed state
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

// Test multiple popovers behavior
test('multiple popovers - opening one closes others', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const leftTrigger = page.getByTestId('popover-left-trigger')
  const leftContent = page.getByTestId('popover-left-content')
  const rightTrigger = page.getByTestId('popover-right-trigger')
  const rightContent = page.getByTestId('popover-right-content')
  const topTrigger = page.getByTestId('popover-top-trigger')
  const topContent = page.getByTestId('popover-top-content')

  // Check initial state - all popovers should be closed
  await expect(leftContent).not.toBeVisible()
  await expect(rightContent).not.toBeVisible()
  await expect(topContent).not.toBeVisible()

  // Open first popover (left)
  await leftTrigger.click()
  await expect(leftContent).toBeVisible({ timeout: 5000 })
  await expect(rightContent).not.toBeVisible()
  await expect(topContent).not.toBeVisible()

  // Open second popover (right) - should close the first one
  await rightTrigger.click()
  await expect(leftContent).not.toBeVisible()
  await expect(rightContent).toBeVisible({ timeout: 5000 })
  await expect(topContent).not.toBeVisible()

  // Open third popover (top) - should close the second one
  await topTrigger.click()
  await expect(leftContent).not.toBeVisible()
  await expect(rightContent).not.toBeVisible()
  await expect(topContent).toBeVisible({ timeout: 5000 })

  // Close the top popover
  await page.keyboard.press('Escape')
  await expect(leftContent).not.toBeVisible()
  await expect(rightContent).not.toBeVisible()
  await expect(topContent).not.toBeVisible()
})

// Test multiple popovers with simple popover
test('multiple popovers - simple popover with others', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const simpleTrigger = page.getByTestId('simple-popover-trigger')
  const simpleContent = page.getByTestId('simple-popover-content')
  const leftTrigger = page.getByTestId('popover-left-trigger')
  const leftContent = page.getByTestId('popover-left-content')

  // Check initial state
  await expect(simpleContent).not.toBeVisible()
  await expect(leftContent).not.toBeVisible()

  // Open simple popover
  await simpleTrigger.click()
  await expect(simpleContent).toBeVisible({ timeout: 5000 })
  await expect(leftContent).not.toBeVisible()

  // Open left popover - should close simple popover
  await leftTrigger.click()
  await expect(simpleContent).not.toBeVisible()
  await expect(leftContent).toBeVisible({ timeout: 5000 })

  // Open simple popover again - should close left popover
  await simpleTrigger.click()
  await expect(simpleContent).toBeVisible({ timeout: 5000 })
  await expect(leftContent).not.toBeVisible()

  // Close simple popover
  await page.keyboard.press('Escape')
  await expect(simpleContent).not.toBeVisible()
  await expect(leftContent).not.toBeVisible()
})
