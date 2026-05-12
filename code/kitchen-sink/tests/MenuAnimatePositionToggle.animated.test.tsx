import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// regression: toggling animatePosition between renders on a long-lived
// shared Menu.Content used to trip React's "Should have a queue" invariant
// because PopperContent only spread `transition` when animatePos was truthy.
// the inner View's hook count flipped (useAnimations not called -> called)
// when animatePosition went from undefined/false -> true.
test.describe('Menu animatePosition toggle (regression)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'MenuAnimatePositionToggleCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('toggling animatePosition mid-life does not throw a React invariant', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    // open via the non-animating trigger first (animatePosition stays undefined)
    const triggerNoAnim = page.getByTestId('trigger-no-anim')
    const triggerAnim = page.getByTestId('trigger-anim')

    await triggerNoAnim.hover()
    await triggerNoAnim.click()
    await page.waitForTimeout(300)

    // close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    // now open via the animating trigger - this used to flip 'transition'
    // presence on the same inner View instance and crash with
    // "Should have a queue. This is likely a bug in React. Please file an issue."
    await triggerAnim.hover()
    await triggerAnim.click()
    await page.waitForTimeout(300)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    // toggle back and forth a few times to be sure
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
    await triggerNoAnim.click()
    await page.waitForTimeout(200)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
    await triggerAnim.click()
    await page.waitForTimeout(300)

    const reactInvariantErrors = errors.filter(
      (e) =>
        e.includes('Should have a queue') ||
        e.includes('Rendered more hooks') ||
        e.includes('Rendered fewer hooks')
    )
    expect(reactInvariantErrors).toEqual([])
  })
})
