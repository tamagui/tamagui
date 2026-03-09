import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests the disableClick prop on Popover.Trigger.
 *
 * Bug: when a hoverable popover is open and the user clicks the trigger,
 * the browser fires pointerdown then click. If onPressIn calls setOpen(false),
 * React re-renders between the two events. The built-in onPress handler then
 * reads the updated open=false and toggles it back to true, causing a
 * close → re-open → close oscillation (visible as a flash/glitch).
 *
 * Fix: disableClick prop suppresses the built-in click toggle on the trigger,
 * allowing the user to control open/close entirely through their own handlers.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'PopoverHoverableDisableClickCase',
    type: 'useCase',
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
})

test('disableClick: hover opens, click dismisses without re-open oscillation', async ({
  page,
}) => {
  const trigger = page.locator('#disableclick-trigger')
  const content = page.locator('#disableclick-content')

  await expect(content).not.toBeVisible()

  // hover to open
  await trigger.hover()
  await page.waitForTimeout(300)
  await expect(content).toBeVisible({ timeout: 2000 })

  // click to dismiss (onPressIn sets open=false)
  await trigger.click()
  await page.waitForTimeout(500)

  // popover should be closed — NOT re-opened by the built-in onPress toggle
  await expect(content).not.toBeVisible({ timeout: 2000 })

  // check the log for oscillation: if we see onOpenChange: true AFTER
  // onPressIn: dismissing, that's the bug
  const logEntries = await page.evaluate(() => {
    const logEl = document.getElementById('open-state-log')
    if (!logEl) return []
    return Array.from(logEl.querySelectorAll('span')).map((el) => el.textContent || '')
  })

  console.log('State log:', logEntries)

  // after the dismiss, there should be no onOpenChange: true
  const dismissIdx = logEntries.findIndex((e) => e.includes('dismissing'))
  if (dismissIdx >= 0) {
    const afterDismiss = logEntries.slice(dismissIdx + 1)
    const reOpened = afterDismiss.some((e) => e.includes('onOpenChange: true'))
    expect(reOpened, 'Popover re-opened after dismiss (state oscillation bug)').toBe(
      false
    )
  }
})

test('disableClick: hover opens, move away closes, re-hover re-opens', async ({
  page,
}) => {
  const trigger = page.locator('#disableclick-trigger')
  const content = page.locator('#disableclick-content')

  await expect(content).not.toBeVisible()

  // hover to open
  await trigger.hover()
  await page.waitForTimeout(300)
  await expect(content).toBeVisible({ timeout: 2000 })

  // move away to close
  await page.mouse.move(10, 10)
  await page.waitForTimeout(800)
  await expect(content).not.toBeVisible({ timeout: 2000 })

  // hover again should re-open (hover still works with disableClick)
  await trigger.hover()
  await page.waitForTimeout(300)
  await expect(content).toBeVisible({ timeout: 2000 })
})

test('normal trigger: click toggles popover open and closed', async ({ page }) => {
  const trigger = page.locator('#withclick-trigger')
  const content = page.locator('#withclick-content')

  await expect(content).not.toBeVisible()

  // click should open (normal trigger without disableClick)
  await trigger.click()
  await page.waitForTimeout(500)
  await expect(content).toBeVisible({ timeout: 2000 })

  // click again should close
  await trigger.click()
  await page.waitForTimeout(500)
  await expect(content).not.toBeVisible({ timeout: 2000 })
})
