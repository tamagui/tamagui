import { expect, test, type Page } from '@playwright/test'

/**
 * Toast Tests
 *
 * Tests the core toast functionality:
 * - Basic swipe to dismiss
 * - Resistance when dragging wrong direction
 * - Velocity-based dismissal
 * - Snap back behavior
 * - Stacking behavior
 * - Hover expansion
 * - Complex interactions (swipe one toast while others exist)
 */

const TEST_URL = '/?test=ToastMultipleCase&animationDriver=css'

// helper to get the drag transform on the toast's DragWrapper
async function getDragTransformX(page: Page): Promise<number> {
  return page.evaluate(() => {
    const toast = document.querySelector('[role="status"]') as HTMLElement
    if (!toast) return 0

    const dragWrapper = toast.querySelector('div[style*="cursor"]') as HTMLElement
    if (!dragWrapper) return 0

    const transform = dragWrapper.style.transform
    if (!transform) return 0

    // parse translate3d(Xpx, Ypx, 0)
    const match = transform.match(/translate3d\(([^,]+)/)
    if (match) {
      return parseFloat(match[1])
    }
    return 0
  })
}

async function getToastCount(page: Page): Promise<number> {
  return page.$$eval('[role="status"]', (els) => els.length)
}

async function waitForToastCount(page: Page, count: number, timeout = 3000): Promise<boolean> {
  try {
    await page.waitForFunction(
      (expected) => document.querySelectorAll('[role="status"]').length === expected,
      count,
      { timeout }
    )
    return true
  } catch {
    return false
  }
}

async function createToast(page: Page, type: string = 'default'): Promise<void> {
  await page.click(`[data-testid="toast-${type}"]`)
  await page.waitForSelector('[role="status"]', { timeout: 5000 })
  await page.waitForTimeout(300) // wait for enter animation
}

async function dismissAllToasts(page: Page): Promise<void> {
  await page.click('[data-testid="toast-dismiss-all"]')
  await page.waitForTimeout(300)
}

async function getToastBoundingBox(page: Page) {
  const toast = await page.$('[data-front="true"], [role="status"]')
  return toast?.boundingBox()
}

test.describe('Toast Gestures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('swipe right dismisses toast', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // swipe right 100px
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 100, startY, { steps: 10 })
    await page.mouse.up()

    // toast should be dismissed
    await waitForToastCount(page, 0, 2000)
    expect(await getToastCount(page)).toBe(0)
  })

  test('swipe left is resisted and snaps back', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // swipe left 50px (opposite of dismiss direction)
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - 50, startY, { steps: 10 })

    // check that the transform is resisted (should be much less than 50px)
    const dragX = await getDragTransformX(page)
    expect(Math.abs(dragX)).toBeLessThan(30) // sqrt(50) * 2 ≈ 14px max

    await page.mouse.up()
    await page.waitForTimeout(500) // wait for snap back animation

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })

  test('quick flick dismisses even with small distance', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // quick flick - 25px in ~30ms
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 25, startY, { steps: 2 })
    await page.mouse.up()

    // should dismiss due to velocity
    await waitForToastCount(page, 0, 2000)
    expect(await getToastCount(page)).toBe(0)
  })

  test('slow drag below threshold snaps back', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // slow drag - 30px over many steps
    await page.mouse.move(startX, startY)
    await page.mouse.down()

    for (let i = 0; i < 20; i++) {
      await page.mouse.move(startX + (i + 1) * 1.5, startY, { steps: 1 })
      await page.waitForTimeout(30)
    }

    await page.mouse.up()
    await page.waitForTimeout(500)

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })

  test('partial swipe and release snaps back', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // partial swipe right then release (not enough to dismiss)
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 20, startY, { steps: 15 }) // slow, small movement
    await page.waitForTimeout(500) // slow enough velocity
    await page.mouse.up()

    await page.waitForTimeout(500)
    expect(await getToastCount(page)).toBe(1)
  })
})

test.describe('Toast Stacking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('multiple toasts stack visually', async ({ page }) => {
    // create 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000) // wait for staggered creation

    const toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBe(4)

    // first toast should be front
    const frontToast = await page.$('[data-front="true"]')
    expect(frontToast).toBeTruthy()

    // check z-index ordering
    const zIndices = await page.$$eval('[role="status"]', (els) =>
      els.map(el => getComputedStyle(el).zIndex)
    )
    // front toast should have highest z-index
    const numericZIndices = zIndices.map(z => parseInt(z) || 0)
    expect(numericZIndices[0]).toBeGreaterThan(numericZIndices[1])
  })

  test('hover expands stacked toasts', async ({ page }) => {
    // create 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBe(4)

    // hover over toast area
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(200)

    // check expanded attribute
    const expandedToast = await page.$('[data-expanded="true"]')
    expect(expandedToast).toBeTruthy()
  })

  test('mouse leave collapses expanded toasts', async ({ page }) => {
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // hover to expand
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(200)

    // verify expanded
    let expandedToast = await page.$('[data-expanded="true"]')
    expect(expandedToast).toBeTruthy()

    // move mouse away
    await page.mouse.move(0, 0)
    await page.waitForTimeout(200)

    // should collapse
    expandedToast = await page.$('[data-expanded="true"]')
    expect(expandedToast).toBeFalsy()
  })
})

test.describe('Toast Complex Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('dismiss front toast while others stacked', async ({ page }) => {
    // create 3 toasts
    await createToast(page, 'success')
    await createToast(page, 'error')
    await createToast(page, 'warning')

    expect(await getToastCount(page)).toBe(3)

    // swipe dismiss front toast
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(500)

    // should have 2 toasts remaining
    expect(await getToastCount(page)).toBe(2)
  })

  test('close button dismisses toast', async ({ page }) => {
    await createToast(page)

    // find and click close button
    const closeButton = await page.$('[aria-label="Close toast"]')
    expect(closeButton).toBeTruthy()

    await closeButton!.click()
    await page.waitForTimeout(500)

    expect(await getToastCount(page)).toBe(0)
  })

  test('action button works and dismisses', async ({ page }) => {
    await page.click('[data-testid="toast-action"]')
    await page.waitForSelector('[role="status"]', { timeout: 5000 })

    // click the action button (View)
    const actionButton = await page.$('[role="status"] button:has-text("View")')
    expect(actionButton).toBeTruthy()

    await actionButton!.click()
    await page.waitForTimeout(500)

    // toast should be dismissed after action
    expect(await getToastCount(page)).toBe(0)
  })

  test('escape key dismisses focused toast', async ({ page }) => {
    await createToast(page)

    // focus the toast
    const toast = await page.$('[role="status"]')
    await toast!.focus()

    // press escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    expect(await getToastCount(page)).toBe(0)
  })

  test('rapid creation and dismissal', async ({ page }) => {
    // rapidly create toasts
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="toast-default"]')
      await page.waitForTimeout(50)
    }

    await page.waitForTimeout(500)
    const count = await getToastCount(page)
    expect(count).toBeGreaterThanOrEqual(4)

    // dismiss all
    await dismissAllToasts(page)
    await page.waitForTimeout(500)

    expect(await getToastCount(page)).toBe(0)
  })

  test('swipe during hover expansion', async ({ page }) => {
    // create multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    // hover to expand
    const box = await getToastBoundingBox(page)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(200)

    // swipe while expanded
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(500)

    // should have dismissed one toast
    expect(await getToastCount(page)).toBe(3)
  })
})

test.describe('Toast Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('mouse move between toasts does not cause stuttering', async ({ page }) => {
    // create multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBe(4)

    // hover over first toast
    const box = await getToastBoundingBox(page)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(200)

    // rapidly move mouse between toasts
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(box!.x + box!.width / 2, box!.y - 50)
      await page.waitForTimeout(50)
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
      await page.waitForTimeout(50)
    }

    // all toasts should still exist
    expect(await getToastCount(page)).toBe(4)
  })

  test('swipe one toast while others animating entry', async ({ page }) => {
    // create a toast
    await createToast(page)

    // immediately create more while swiping first
    const box = await getToastBoundingBox(page)

    // start swipe
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()

    // trigger more toasts mid-swipe
    await page.click('[data-testid="toast-success"]')
    await page.click('[data-testid="toast-error"]')

    // complete swipe
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, { steps: 5 })
    await page.mouse.up()

    await page.waitForTimeout(500)

    // first toast dismissed, two new ones exist
    expect(await getToastCount(page)).toBe(2)
  })

  test('hover back while toast is closing does not break', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)

    // start swipe to dismiss
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 80, box!.y + box!.height / 2, { steps: 5 })
    await page.mouse.up()

    // immediately hover back over toast area during exit animation
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)

    await page.waitForTimeout(500)

    // toast should be dismissed despite hover
    expect(await getToastCount(page)).toBe(0)
  })

  test('double click does not cause issues', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)

    // double click on toast
    await page.mouse.dblclick(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(300)

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })

  test('cancel button on action toast dismisses properly', async ({ page }) => {
    // click to show toast with action+cancel
    await page.click('button:has-text("With Action + Cancel")')
    await page.waitForSelector('[role="status"]', { timeout: 5000 })

    // find and click cancel button
    const cancelButton = await page.$('[role="status"] button:has-text("Cancel")')
    expect(cancelButton).toBeTruthy()

    await cancelButton!.click()
    await page.waitForTimeout(500)

    expect(await getToastCount(page)).toBe(0)
  })

  test('multiple position changes do not break toasts', async ({ page }) => {
    // create a toast
    await createToast(page)

    // change position while toast is visible
    await page.click('button:has-text("top-left")')
    await page.waitForTimeout(100)
    await page.click('button:has-text("bottom-center")')
    await page.waitForTimeout(100)
    await page.click('button:has-text("top-right")')
    await page.waitForTimeout(100)

    // toast should still exist and be visible
    expect(await getToastCount(page)).toBeGreaterThanOrEqual(1)
  })

  test('back-to-back dismiss and create', async ({ page }) => {
    // create, dismiss, create rapidly
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="toast-default"]')
      await page.waitForTimeout(100)
      await page.click('[data-testid="toast-dismiss-all"]')
      await page.waitForTimeout(100)
    }

    // create one final toast
    await createToast(page)
    expect(await getToastCount(page)).toBe(1)
  })

})

test.describe('Toast Auto-dismiss', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('toast auto-dismisses after duration', async ({ page }) => {
    await createToast(page)
    expect(await getToastCount(page)).toBe(1)

    // default duration is 4s, wait a bit longer
    await page.waitForTimeout(5000)

    expect(await getToastCount(page)).toBe(0)
  })

  test('hover pauses auto-dismiss timer', async ({ page }) => {
    await createToast(page)

    const box = await getToastBoundingBox(page)

    // hover over toast for 3s (timer should pause)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(3000)

    // toast should still exist because timer was paused
    expect(await getToastCount(page)).toBe(1)

    // move mouse away
    await page.mouse.move(0, 0)

    // wait for remaining time + buffer
    await page.waitForTimeout(5000)

    // now it should be gone
    expect(await getToastCount(page)).toBe(0)
  })

  test('loading toast does not auto-dismiss', async ({ page }) => {
    await createToast(page, 'loading')
    expect(await getToastCount(page)).toBe(1)

    // wait longer than default duration
    await page.waitForTimeout(5000)

    // loading toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })
})
