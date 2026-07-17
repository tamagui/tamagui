import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// D2 regression guard: the popover trigger must expose aria-controls that points
// at the role="dialog" content element while open, and drop it while closed.
//
// note: aria-controls is wired at runtime by floating-ui's useRole (not by
// manual code in Popover.tsx). the review's "trigger omits aria-controls" was a
// static-analysis false positive - this test locks in the real, working
// behavior across generated / controlled / force-mounted / explicit-id popovers
// so a future change that drops floating-ui's role wiring is caught.
test('popover trigger aria-controls points at the dialog content', async ({ page }) => {
  await setupPage(page, { name: 'PopoverAriaControlsCase', type: 'useCase' })
  await page.waitForLoadState('networkidle')

  async function assertControls(triggerId: string, contentText: string, open: () => Promise<void>) {
    const trigger = page.locator(`#${triggerId}`)

    // closed: no dangling aria-controls
    await expect(trigger).not.toHaveAttribute('aria-controls', /.+/)

    await open()

    // open: aria-controls references a visible role=dialog element holding the content
    await expect(trigger).toHaveAttribute('aria-controls', /.+/)
    const controls = await trigger.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    const target = page.locator(`[id="${controls}"]`)
    await expect(target).toBeVisible()
    await expect(target).toHaveAttribute('role', 'dialog')
    await expect(target).toContainText(contentText)
  }

  await assertControls('generated-trigger', 'generated content', () =>
    page.locator('#generated-trigger').click()
  )
  await page.keyboard.press('Escape')

  await assertControls('controlled-trigger', 'controlled content', () =>
    page.locator('#controlled-external-toggle').click()
  )
  await page.keyboard.press('Escape')
  await expect(page.locator('#controlled-trigger')).not.toHaveAttribute('aria-controls', /.+/)

  await assertControls('forcemount-trigger', 'force mounted content', () =>
    page.locator('#forcemount-trigger').click()
  )
  await page.keyboard.press('Escape')

  await assertControls('explicit-trigger', 'explicit content', () =>
    page.locator('#explicit-trigger').click()
  )
})
