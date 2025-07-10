import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'DialogScopedCase', type: 'useCase' })
})

test('scoped dialogs work', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  async function testDialogScoped(name: string) {
    const triggerTestId = `${name}-trigger`
    const contentTestId = `${name}-dialog-content`
    const trigger = page.getByTestId(triggerTestId)
    const content = page.getByTestId(contentTestId)
    const closeButton = content.getByTestId(`${name}-dialog-close`)

    // Check initial state
    await expect(trigger).toBeVisible()
    await expect(content).not.toBeVisible()

    // Click trigger to open dialog
    await trigger.click()

    // Wait for content to be visible
    await expect(content).toBeVisible({ timeout: 5000 })

    // Click close button
    await closeButton.click()

    // Verify dialog is closed
    await expect(content).not.toBeVisible()
  }

  // Test each scoped dialog
  await testDialogScoped('plain')
  await testDialogScoped('a')
  await testDialogScoped('b')
})

test('dialog scopes are isolated', async ({ page }) => {
  // Wait for page to load
  await page.waitForLoadState('networkidle')

  const plainTrigger = page.getByTestId('plain-trigger')
  const aTrigger = page.getByTestId('a-trigger')
  const bTrigger = page.getByTestId('b-trigger')

  const plainContent = page.getByTestId('plain-dialog-content')
  const aContent = page.getByTestId('a-dialog-content')
  const bContent = page.getByTestId('b-dialog-content')

  // Open dialog A
  await aTrigger.click()
  await expect(aContent).toBeVisible({ timeout: 5000 })

  // Verify other dialogs are not visible
  await expect(plainContent).not.toBeVisible()
  await expect(bContent).not.toBeVisible()

  // Close dialog A
  await aContent.getByTestId('a-dialog-close').click()
  await expect(aContent).not.toBeVisible()

  // Open dialog B
  await bTrigger.click()
  await expect(bContent).toBeVisible({ timeout: 5000 })

  // Verify other dialogs are not visible
  await expect(plainContent).not.toBeVisible()
  await expect(aContent).not.toBeVisible()

  // Close dialog B
  await bContent.getByTestId('b-dialog-close').click()
  await expect(bContent).not.toBeVisible()

  // Open plain dialog
  await plainTrigger.click()
  await expect(plainContent).toBeVisible({ timeout: 5000 })

  // Verify other dialogs are not visible
  await expect(aContent).not.toBeVisible()
  await expect(bContent).not.toBeVisible()

  // Close plain dialog
  await plainContent.getByTestId('plain-dialog-close').click()
  await expect(plainContent).not.toBeVisible()
})

test('scoped dialogs adapt to sheets', async ({ page: pageIn }) => {
  const page = await setupPage(pageIn, {
    name: 'DialogScopedCase',
    type: 'useCase',
    adapt: true,
  })

  // Wait for page to load
  await page.waitForLoadState('networkidle')

  async function testDialogAdapted(name: string) {
    const trigger = page.getByTestId(`${name}-trigger`)
    const sheetContents = page.getByTestId(`${name}-sheet-contents`)
    const dialogContent = page.getByTestId(`${name}-dialog-content`)

    // Click trigger to open sheet
    await trigger.click()

    // Wait for sheet to be visible
    await expect(sheetContents).toBeVisible({ timeout: 5000 })

    // Check that dialog content is inside sheet
    await expect(sheetContents.locator(dialogContent)).toBeVisible()

    // Dialog.Close hides in sheet mode
    const closeButton = sheetContents.getByTestId('dialog-close')
    await expect(closeButton).not.toBeVisible()

    // Click sheet backdrop
    const overlay = page.locator(`#${name}-sheet-overlay`)
    await expect(overlay).toBeVisible()
    await overlay.click()

    // await animation
    await new Promise((res) => setTimeout(res, 1000))

    // Verify sheet is closed
    await expect(sheetContents).not.toBeInViewport()
  }

  await testDialogAdapted('plain')
  await testDialogAdapted('a')
  await testDialogAdapted('b')
})
