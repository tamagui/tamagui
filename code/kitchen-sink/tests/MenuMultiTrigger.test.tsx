import { expect, test } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

test.describe('Menu Multi-Trigger', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'MenuMultiTriggerCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('clicking trigger A opens content near trigger A', async ({ page }) => {
    const triggerA = page.getByTestId('trigger-a')
    await triggerA.click()
    await page.waitForTimeout(300)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    const triggerBox = await getBoundingRect(page, '[data-testid="trigger-a"]')
    const contentBox = await getBoundingRect(page, '[data-testid="menu-content"]')
    expect(triggerBox).not.toBeNull()
    expect(contentBox).not.toBeNull()

    // content should be horizontally near trigger A
    expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThan(50)
  })

  test('clicking trigger B re-anchors content to trigger B', async ({ page }) => {
    // open via A first
    const triggerA = page.getByTestId('trigger-a')
    await triggerA.click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    // close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // open via B
    const triggerB = page.getByTestId('trigger-b')
    await triggerB.click()
    await page.waitForTimeout(300)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    const triggerBBox = await getBoundingRect(page, '[data-testid="trigger-b"]')
    const contentBox = await getBoundingRect(page, '[data-testid="menu-content"]')
    expect(triggerBBox).not.toBeNull()
    expect(contentBox).not.toBeNull()

    // content should be near trigger B, not trigger A
    expect(Math.abs(contentBox!.x - triggerBBox!.x)).toBeLessThan(50)
  })

  test('only the active trigger has data-state=open', async ({ page }) => {
    const triggerA = page.getByTestId('trigger-a')
    const triggerB = page.getByTestId('trigger-b')
    const triggerC = page.getByTestId('trigger-c')

    await triggerB.click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    await expect(triggerA).toHaveAttribute('data-state', 'closed')
    await expect(triggerB).toHaveAttribute('data-state', 'open')
    await expect(triggerC).toHaveAttribute('data-state', 'closed')
  })

  test('keyboard open via Enter re-anchors to focused trigger', async ({ page }) => {
    const triggerC = page.getByTestId('trigger-c')
    await triggerC.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    const triggerCBox = await getBoundingRect(page, '[data-testid="trigger-c"]')
    const contentBox = await getBoundingRect(page, '[data-testid="menu-content"]')
    expect(triggerCBox).not.toBeNull()
    expect(contentBox).not.toBeNull()

    // content should be near trigger C
    expect(Math.abs(contentBox!.x - triggerCBox!.x)).toBeLessThan(50)
  })

  test('close returns focus to the trigger that opened the menu', async ({ page }) => {
    const triggerB = page.getByTestId('trigger-b')
    await triggerB.click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(triggerB).toBeFocused()
  })
})
