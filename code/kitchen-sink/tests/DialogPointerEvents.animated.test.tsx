import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Test for dialog pointer events unlock timing
 *
 * Verifies that when a dialog closes, the dialog content gets pointer-events: none
 * immediately, allowing clicks to pass through to elements behind during the
 * exit animation.
 *
 * This is an animated test because the bug only manifests with animations enabled.
 */
test.describe('Dialog Pointer Events Unlock', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogPointerEventsCase', type: 'useCase' })
  })

  test('dialog content allows click-through during exit animation', async ({ page }) => {
    // get initial click count
    const clickCountEl = page.getByTestId('click-count')
    await expect(clickCountEl).toHaveText('0')

    // open the dialog
    const triggerButton = page.getByTestId('dialog-trigger')
    await triggerButton.click()

    // wait for dialog to be visible
    const dialogClose = page.locator('[data-testid="dialog-close"]')
    await expect(dialogClose).toBeVisible({ timeout: 5000 })

    // wait for enter animation to settle
    await page.waitForTimeout(800)

    // set up monitoring to check dialog content pointer events after close
    const results = await page.evaluate(async () => {
      return new Promise<{
        contentPointerEvents: string[]
        buttonAccessible: boolean[]
        dialogStillAnimating: boolean
      }>((resolve) => {
        const contentPointerEvents: string[] = []
        const buttonAccessible: boolean[] = []
        const closeButton = document.querySelector('[data-testid="dialog-close"]') as HTMLElement
        const dialogContent = document.querySelector('[role="dialog"]') as HTMLElement
        const backgroundBtn = document.querySelector('[data-testid="background-button"]') as HTMLElement

        // start sampling immediately
        const interval = setInterval(() => {
          if (dialogContent) {
            contentPointerEvents.push(getComputedStyle(dialogContent).pointerEvents)
          }
          // check if the background button is accessible (not blocked by dialog)
          const btnRect = backgroundBtn?.getBoundingClientRect()
          if (btnRect) {
            const elementAtPoint = document.elementFromPoint(
              btnRect.left + btnRect.width / 2,
              btnRect.top + btnRect.height / 2
            )
            buttonAccessible.push(
              elementAtPoint === backgroundBtn || backgroundBtn.contains(elementAtPoint)
            )
          }
        }, 20)

        // click close button
        closeButton.click()

        // after 300ms, check state and stop sampling
        setTimeout(() => {
          clearInterval(interval)
          const stillAnimating = dialogContent
            ? getComputedStyle(dialogContent).opacity !== '0'
            : false
          resolve({
            contentPointerEvents,
            buttonAccessible,
            dialogStillAnimating: stillAnimating,
          })
        }, 300)
      })
    })

    console.log('Content pointer events during exit:', results.contentPointerEvents)
    console.log('Button accessible during exit:', results.buttonAccessible)
    console.log('Dialog still animating at end:', results.dialogStillAnimating)

    // the key assertion: dialog content should have pointer-events: none immediately after close
    // this allows clicks to pass through to elements behind while animating
    const contentHasNoneEarly = results.contentPointerEvents.some(
      (pe, i) => i < 5 && pe === 'none'
    )
    expect(contentHasNoneEarly).toBeTruthy()

    // the background button should become accessible quickly (within first few samples)
    const buttonAccessibleEarly = results.buttonAccessible.some((accessible, i) => i < 8 && accessible)
    expect(buttonAccessibleEarly).toBeTruthy()

    // wait for dialog to fully close
    await expect(dialogClose).not.toBeVisible({ timeout: 3000 })

    // verify background button is clickable
    const backgroundButton = page.getByTestId('background-button')
    await backgroundButton.click()
    await expect(clickCountEl).toHaveText('1')
  })
})
