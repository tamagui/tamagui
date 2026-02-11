import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

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

async function setupToastPage(page: Page) {
  await setupPage(page, {
    name: 'ToastMultipleCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
  // remove react-refresh overlay iframe that intercepts pointer events in dev mode
  await page.evaluate(() => {
    document.getElementById('react-refresh-overlay')?.remove()
  })
}

// helper to get the drag transform on the toast's DragWrapper
// structure: ToastPositionWrapper > DragWrapper (cursor:grab) > ToastItemFrame (role=status)
async function getDragTransform(page: Page): Promise<{ x: number; y: number }> {
  return page.evaluate(() => {
    const toastFrame = document.querySelector('[role="status"]') as HTMLElement
    if (!toastFrame) return { x: 0, y: 0 }

    // dragWrapper is the parent of toastFrame
    const dragWrapper = toastFrame.parentElement as HTMLElement
    if (!dragWrapper) return { x: 0, y: 0 }

    const transform = dragWrapper.style.transform
    if (!transform) return { x: 0, y: 0 }

    // parse translate3d(Xpx, Ypx, 0)
    const match = transform.match(/translate3d\(([^,]+),\s*([^,]+)/)
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
    }
    return { x: 0, y: 0 }
  })
}

async function getDragTransformX(page: Page): Promise<number> {
  const { x } = await getDragTransform(page)
  return x
}

async function getToastCount(page: Page): Promise<number> {
  return page.$$eval('[role="status"]', (els) => els.length)
}

async function waitForToastCount(
  page: Page,
  count: number,
  timeout = 3000
): Promise<boolean> {
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
    await setupToastPage(page)
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
    await page.waitForTimeout(800) // wait for snap back animation

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
    await page.waitForTimeout(800)

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
    await page.waitForTimeout(800) // slow enough velocity
    await page.mouse.up()

    await page.waitForTimeout(800)
    expect(await getToastCount(page)).toBe(1)
  })
})

test.describe('Toast Stacking', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
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

    // check z-index ordering - z-index is on ToastPositionWrapper (grandparent of role=status)
    const zIndices = await page.$$eval('[role="status"]', (els) =>
      els.map((el) => {
        // ToastPositionWrapper > DragWrapper > ToastItemFrame (role=status)
        const positionWrapper = el.parentElement?.parentElement
        return positionWrapper ? getComputedStyle(positionWrapper).zIndex : '0'
      })
    )
    // front toast should have highest z-index
    const numericZIndices = zIndices.map((z) => parseInt(z) || 0)
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

  test('entering toast appears above exiting toast', async ({ page }) => {
    // create a toast
    await createToast(page)
    await page.waitForTimeout(200)

    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // start swipe to dismiss first toast
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2, {
      steps: 5,
    })
    await page.mouse.up()

    // immediately create a new toast while first is exiting
    await page.click('[data-testid="toast-success"]')
    await page.waitForTimeout(100)

    // check z-index: the new toast (data-removed=false) should have higher z-index
    // than the exiting toast (data-removed=true)
    const zIndices = await page.$$eval('[role="status"]', (els) => {
      return els.map((el) => ({
        zIndex: parseInt(getComputedStyle(el).zIndex) || 0,
        removed: el.getAttribute('data-removed'),
      }))
    })

    // find the non-removed toast (new one) and removed toast (exiting one)
    const newToast = zIndices.find((t) => t.removed === 'false')
    const exitingToast = zIndices.find((t) => t.removed === 'true')

    // new toast should have higher z-index than exiting toast
    if (newToast && exitingToast) {
      expect(newToast.zIndex).toBeGreaterThan(exitingToast.zIndex)
    }

    await page.waitForTimeout(800) // wait for exit animation
  })
})

test.describe('Toast Complex Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
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
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, {
      steps: 10,
    })
    await page.mouse.up()

    // wait for spring exit animation to complete (animateOut uses spring physics)
    await page.waitForTimeout(800)

    // should have 2 toasts remaining
    expect(await getToastCount(page)).toBe(2)
  })

  test('close button dismisses toast', async ({ page }) => {
    await createToast(page)

    // find and click close button
    const closeButton = await page.$('[aria-label="Close toast"]')
    expect(closeButton).toBeTruthy()

    await closeButton!.click()
    await page.waitForTimeout(800)

    expect(await getToastCount(page)).toBe(0)
  })

  test('action button works and dismisses', async ({ page }) => {
    await page.click('[data-testid="toast-action"]')
    await page.waitForSelector('[role="status"]', { timeout: 5000 })

    // click the action button (View)
    const actionButton = await page.$('[role="status"] button:has-text("View")')
    expect(actionButton).toBeTruthy()

    await actionButton!.click()
    await page.waitForTimeout(800)

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
    await page.waitForTimeout(800)

    expect(await getToastCount(page)).toBe(0)
  })

  test('rapid creation and dismissal', async ({ page }) => {
    // rapidly create toasts
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="toast-default"]')
      await page.waitForTimeout(50)
    }

    await page.waitForTimeout(800)
    const count = await getToastCount(page)
    expect(count).toBeGreaterThanOrEqual(4)

    // dismiss all
    await dismissAllToasts(page)
    await page.waitForTimeout(800)

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
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, {
      steps: 10,
    })
    await page.mouse.up()

    // wait for spring exit animation to complete
    await page.waitForTimeout(800)

    // should have dismissed one toast
    expect(await getToastCount(page)).toBe(3)
  })
})

test.describe('Toast Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
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
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, {
      steps: 5,
    })
    await page.mouse.up()

    await page.waitForTimeout(800)

    // first toast dismissed, two new ones exist
    expect(await getToastCount(page)).toBe(2)
  })

  test('hover back while toast is closing does not break', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)

    // start swipe to dismiss
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 80, box!.y + box!.height / 2, {
      steps: 5,
    })
    await page.mouse.up()

    // immediately hover back over toast area during exit animation
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)

    await page.waitForTimeout(800)

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
    await page.waitForTimeout(800)

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
    await setupToastPage(page)
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

test.describe('Toast Gesture Physics', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('collapsed mode allows all-direction drag with resistance except exit direction', async ({
    page,
  }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // in collapsed mode, dragging vertically should have resisted movement
    // (swipeDirection is 'right' by default, so vertical gets resistance)
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX, startY + 50, { steps: 5 }) // drag down 50px

    // vertical movement should be resisted (sqrt curve caps at ~25px)
    const { x, y } = await getDragTransform(page)
    // x should be near 0 since we only moved vertically
    expect(Math.abs(x)).toBeLessThan(5)
    // y should show resistance - less than 50px input, capped around 15px for sqrt(50)*2
    expect(Math.abs(y)).toBeLessThan(20)
    expect(Math.abs(y)).toBeGreaterThan(5) // but there should be SOME movement

    await page.mouse.up()
    await page.waitForTimeout(500)

    // toast should NOT be dismissed (vertical drag doesn't trigger horizontal dismiss)
    expect(await getToastCount(page)).toBe(1)
  })

  test('resistance caps at max ~25px when dragging far in wrong direction', async ({
    page,
  }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // drag very far left (200px in wrong direction for right-swipe toast)
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - 200, startY, { steps: 20 })

    // resistance should cap the offset around 25px
    const dragX = await getDragTransformX(page)
    expect(Math.abs(dragX)).toBeLessThan(30) // max should be ~25px

    await page.mouse.up()
    await page.waitForTimeout(800)

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })

  test('fast flick in wrong direction does NOT dismiss', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // fast flick LEFT (wrong direction - swipe direction is right)
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - 50, startY, { steps: 2 }) // very fast
    await page.mouse.up()

    await page.waitForTimeout(800)

    // toast should NOT be dismissed despite high velocity
    expect(await getToastCount(page)).toBe(1)
  })

  test('transform follows sqrt resistance curve during wrong-direction drag', async ({
    page,
  }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // drag in wrong direction and sample transform at different distances
    await page.mouse.move(startX, startY)
    await page.mouse.down()

    const transforms: number[] = []

    // sample at 25px, 50px, 100px wrong direction drags
    for (const dist of [25, 50, 100]) {
      await page.mouse.move(startX - dist, startY, { steps: 5 })
      await page.waitForTimeout(50)
      transforms.push(await getDragTransformX(page))
    }

    await page.mouse.up()

    // sqrt resistance: offset should be sqrt(dist) * 2, capped at 25
    // 25px drag -> sqrt(25)*2 = 10px
    // 50px drag -> sqrt(50)*2 = 14.14px
    // 100px drag -> sqrt(100)*2 = 20px (still under cap)
    // all should be negative and much less than raw distance
    expect(Math.abs(transforms[0])).toBeLessThan(15) // ~10px expected
    expect(Math.abs(transforms[1])).toBeLessThan(18) // ~14px expected
    expect(Math.abs(transforms[2])).toBeLessThan(25) // ~20px expected

    // verify it's following sqrt curve (each subsequent should be less than linear)
    // ratio test: offset at 100px should NOT be 4x offset at 25px
    const ratio = Math.abs(transforms[2]) / Math.abs(transforms[0])
    expect(ratio).toBeLessThan(3) // sqrt(100/25) = 2, so should be ~2
  })

  test('orphaned pointer move without pointer down is ignored', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // move mouse over toast without pressing down
    await page.mouse.move(startX, startY)
    await page.mouse.move(startX + 100, startY, { steps: 10 })

    // no transform should be applied
    const dragX = await getDragTransformX(page)
    expect(dragX).toBe(0)

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)
  })

  test('right-click during drag triggers cancel and snaps back', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // start drag
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 40, startY, { steps: 5 })

    // right-click should trigger pointer cancel
    await page.mouse.click(startX + 40, startY, { button: 'right' })

    await page.waitForTimeout(800)

    // toast should still exist (drag was cancelled)
    expect(await getToastCount(page)).toBe(1)
  })
})

test.describe('Toast Stacking Drag Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('dragging stacked (non-front) toast works correctly', async ({ page }) => {
    // create multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBe(4)

    // expand by hovering
    const frontBox = await getToastBoundingBox(page)
    expect(frontBox).toBeTruthy()
    await page.mouse.move(
      frontBox!.x + frontBox!.width / 2,
      frontBox!.y + frontBox!.height / 2
    )
    await page.waitForTimeout(200)

    // get the second toast (non-front)
    const secondToast = await page.$('[data-index="1"]')
    expect(secondToast).toBeTruthy()
    const secondBox = await secondToast!.boundingBox()
    expect(secondBox).toBeTruthy()

    // swipe the second toast
    await page.mouse.move(
      secondBox!.x + secondBox!.width / 2,
      secondBox!.y + secondBox!.height / 2
    )
    await page.mouse.down()
    await page.mouse.move(
      secondBox!.x + secondBox!.width / 2 + 100,
      secondBox!.y + secondBox!.height / 2,
      { steps: 10 }
    )
    await page.mouse.up()

    await page.waitForTimeout(800)

    // should have dismissed one toast
    expect(await getToastCount(page)).toBe(3)
  })

  test('drag one toast while another is entering does not cause glitches', async ({
    page,
  }) => {
    // create first toast
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // start dragging the first toast
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 30, box!.y + box!.height / 2, {
      steps: 5,
    })

    // while dragging, create more toasts
    await page.click('[data-testid="toast-success"]')
    await page.click('[data-testid="toast-error"]')

    // continue and complete the drag
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, {
      steps: 5,
    })
    await page.mouse.up()

    await page.waitForTimeout(800)

    // first toast dismissed, two new ones should exist
    expect(await getToastCount(page)).toBe(2)
  })

  test('escape key during drag cancels drag and dismisses toast', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // start drag
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 30, box!.y + box!.height / 2, {
      steps: 5,
    })

    // press escape mid-drag
    await page.keyboard.press('Escape')

    await page.waitForTimeout(800)

    // toast should be dismissed by escape
    expect(await getToastCount(page)).toBe(0)
  })
})

test.describe('Toast Timer Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await setupToastPage(page)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('drag pauses auto-dismiss timer and resumes on cancel', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // wait 2 seconds (half the 4s duration)
    await page.waitForTimeout(2000)

    // start drag (should pause timer)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 20, box!.y + box!.height / 2, {
      steps: 5,
    })

    // wait another 2 seconds while dragging (timer should be paused)
    await page.waitForTimeout(2000)

    // cancel the drag (release without enough distance/velocity)
    await page.waitForTimeout(300) // slow velocity
    await page.mouse.up()

    // toast should still exist (timer was paused during drag)
    expect(await getToastCount(page)).toBe(1)

    // now wait for remaining time + buffer (about 2s remaining + animation time)
    await page.waitForTimeout(3000)

    // toast should be gone now
    expect(await getToastCount(page)).toBe(0)
  })

  test('multiple rapid hovers do not corrupt timer state', async ({ page }) => {
    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // rapidly hover in and out multiple times
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
      await page.waitForTimeout(100)
      await page.mouse.move(0, 0)
      await page.waitForTimeout(100)
    }

    // toast should still exist
    expect(await getToastCount(page)).toBe(1)

    // wait for full duration + buffer
    await page.waitForTimeout(5000)

    // toast should be gone
    expect(await getToastCount(page)).toBe(0)
  })
})

test.describe('Toast Position Swipe Directions', () => {
  test('bottom-right position allows right swipe dismissal', async ({ page }) => {
    // default position is bottom-right
    await setupToastPage(page)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })

    await createToast(page)
    const box = await getToastBoundingBox(page)
    expect(box).toBeTruthy()

    // swipe right
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2 + 100, box!.y + box!.height / 2, {
      steps: 10,
    })
    await page.mouse.up()

    await waitForToastCount(page, 0, 2000)
    expect(await getToastCount(page)).toBe(0)
  })

  test('auto swipe direction works for all positions', async ({ page }) => {
    // auto swipe direction: swipe toward nearest edge to dismiss
    // bottom-right/top-right -> swipe right
    // bottom-left/top-left -> swipe left
    // bottom-center/top-center -> swipe horizontal (left or right)
    await setupToastPage(page)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })

    const testCases = [
      { position: 'bottom-left', swipeX: -100, swipeY: 0 },
      { position: 'top-left', swipeX: -100, swipeY: 0 },
      { position: 'top-right', swipeX: 100, swipeY: 0 },
      { position: 'bottom-center', swipeX: 100, swipeY: 0 },
      { position: 'top-center', swipeX: -100, swipeY: 0 },
    ]

    for (const { position, swipeX, swipeY } of testCases) {
      // dismiss any existing toasts
      await page.click('[data-testid="toast-dismiss-all"]')
      await page.waitForTimeout(200)

      // change position
      const posButton = page.locator(`button:has-text("${position}")`)
      await posButton.click()
      await page.waitForTimeout(200)

      // create toast
      await page.click('[data-testid="toast-default"]')
      await page.waitForSelector('[role="status"]')
      await page.waitForTimeout(300)

      // swipe in the auto-detected direction
      const box = await getToastBoundingBox(page)
      expect(box).toBeTruthy()

      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
      await page.mouse.down()
      await page.mouse.move(
        box!.x + box!.width / 2 + swipeX,
        box!.y + box!.height / 2 + swipeY,
        { steps: 10 }
      )
      await page.mouse.up()

      // toast should dismiss
      await waitForToastCount(page, 0, 2000)
      const count = await getToastCount(page)
      expect(count).toBe(0)
    }
  })
})
