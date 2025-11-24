import { expect, test } from '@playwright/test'

test.describe('DialogDemo Nested Stacking', () => {
  test.beforeEach(async ({ page }) => {
    const params = new URLSearchParams({
      theme: 'light',
      demo: 'Dialog',
      animationDriver: process.env.TAMAGUI_TEST_ANIMATION_DRIVER ?? 'native',
    })
    const url = `/?${params.toString()}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await new Promise((res) => setTimeout(res, 300))
  })

  test('nested dialog in DialogDemo appears above parent', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // DialogDemo has two buttons: "Show Dialog" and "Show Dialog (No Sheet)"
    // Click the first one
    const firstTrigger = page.getByRole('button', { name: 'Show Dialog', exact: true }).first()
    await firstTrigger.click()

    // Wait for dialog to appear
    await page.waitForTimeout(500)

    // The dialog should be visible
    const dialogTitle = page.getByText('Edit profile')
    await expect(dialogTitle).toBeVisible({ timeout: 5000 })

    // Now find and click the nested "Show Dialog" button inside the dialog
    // It's part of the DialogInstance component rendered inside the dialog content
    const nestedTrigger = page.getByRole('button', { name: 'Show Dialog', exact: true }).last()
    await nestedTrigger.click()

    // Wait for nested dialog to appear
    await page.waitForTimeout(500)

    // Get z-index information
    const zIndexInfo = await page.evaluate(() => {
      const portals = document.querySelectorAll('body > span[style*="z-index"]')
      const info: { zIndex: number; hasDialog: boolean }[] = []

      portals.forEach(portal => {
        const style = window.getComputedStyle(portal)
        const zIndex = parseInt(style.zIndex, 10)
        if (!isNaN(zIndex)) {
          const hasDialog = portal.querySelector('dialog') !== null
          info.push({ zIndex, hasDialog })
        }
      })

      return info.sort((a, b) => a.zIndex - b.zIndex)
    })

    console.log('Portal z-indices:', zIndexInfo)

    // Should have at least 2 portals with dialogs
    const dialogPortals = zIndexInfo.filter(p => p.hasDialog)
    expect(dialogPortals.length).toBeGreaterThanOrEqual(2)

    // Check that the second dialog title ("Edit profile") appears twice
    // The nested dialog should be on top
    const editProfileTexts = await page.getByText('Edit profile').all()
    expect(editProfileTexts.length).toBe(2)

    // Get positions of both dialogs' content
    const dialogPositions = await page.evaluate(() => {
      const titles = document.querySelectorAll('h2')
      const positions: { text: string; rect: DOMRect | null }[] = []

      titles.forEach(title => {
        if (title.textContent?.includes('Edit profile')) {
          const dialog = title.closest('[data-state="open"]')
          if (dialog) {
            positions.push({
              text: title.textContent || '',
              rect: dialog.getBoundingClientRect()
            })
          }
        }
      })

      return positions
    })

    console.log('Dialog positions:', dialogPositions)

    // The nested dialog should be visually on top
    // We can check by seeing what element is at the center of the viewport
    const viewportSize = await page.viewportSize()
    if (viewportSize) {
      const centerX = viewportSize.width / 2
      const centerY = viewportSize.height / 2

      const elementAtCenter = await page.evaluate(({ x, y }) => {
        const el = document.elementFromPoint(x, y)
        // Find the closest dialog content
        const dialog = el?.closest('dialog')
        if (!dialog) return 'no-dialog'

        // Check if it's the nested (second) dialog by looking at portal z-index
        const portal = dialog.closest('span[style*="z-index"]')
        if (portal) {
          const style = window.getComputedStyle(portal)
          return `dialog-zindex-${style.zIndex}`
        }
        return 'dialog-no-portal'
      }, { x: centerX, y: centerY })

      console.log('Element at center:', elementAtCenter)

      // The element at center should be from the higher z-index dialog
      if (dialogPortals.length >= 2) {
        const higherZIndex = Math.max(...dialogPortals.map(p => p.zIndex))
        expect(elementAtCenter).toContain(higherZIndex.toString())
      }
    }
  })
})
