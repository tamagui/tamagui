/**
 * Debug test for Toast issues:
 * 1. X (close button) doesn't close
 * 2. Action/Cancel button issues - click cancel, check if other toasts get stranded
 * 3. Hover expansion glitches - open multiple toasts, hover to expand, move mouse off and back on
 * 4. Weird combos - open several toasts, open one with action+cancel, click cancel, see if rest get stranded
 */

import { expect, test } from '@playwright/test'

const TEST_URL = 'http://localhost:9000/?test=ToastMultipleCase&animationDriver=css'

// helper to get visible toast count
async function getVisibleToastCount(page: any): Promise<number> {
  return await page.$$eval('[role="status"]', (toasts: Element[]) => toasts.length)
}

// helper to wait and log toast state
async function logToastState(page: any, label: string): Promise<void> {
  const toasts = await page.$$('[role="status"]')
  const toastData = await Promise.all(
    toasts.map(async (t: any, i: number) => {
      const dataAttrs = await t.evaluate((el: HTMLElement) => ({
        index: el.getAttribute('data-index'),
        type: el.getAttribute('data-type'),
        front: el.getAttribute('data-front'),
        removed: el.getAttribute('data-removed'),
        expanded: el.getAttribute('data-expanded'),
        text: el.textContent?.slice(0, 50),
      }))
      return dataAttrs
    })
  )
  console.log(`\n[${label}] Toast state (${toasts.length} toasts):`)
  toastData.forEach((t, i) => {
    console.log(`  Toast ${i}: index=${t.index}, type=${t.type}, front=${t.front}, removed=${t.removed}, expanded=${t.expanded}`)
    console.log(`    text: "${t.text}"`)
  })
}

test.describe('Toast Debug Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
    console.log('\n========================================')
    console.log('Test page loaded')
  })

  test('ISSUE 1: Close button (X) should dismiss toast', async ({ page }) => {
    console.log('\n--- ISSUE 1: Testing close button ---')

    // create a toast (close button is enabled by default in ToastMultipleCase)
    await page.click('[data-testid="toast-default"]')
    console.log('Clicked: Default toast button')

    await page.waitForSelector('[role="status"]', { timeout: 5000 })
    await logToastState(page, 'After creating toast')

    // take screenshot of initial state
    await page.screenshot({ path: 'toast-debug-1-initial.png', fullPage: true })
    console.log('Screenshot: toast-debug-1-initial.png')

    // find and click the close button
    const closeButton = await page.$('[role="status"] button[aria-label="Close toast"]')
    if (!closeButton) {
      // try finding any button inside toast that looks like close
      const anyButton = await page.$('[role="status"] button')
      console.log('Close button with aria-label not found, looking for any button...')
      if (anyButton) {
        const buttonText = await anyButton.textContent()
        console.log(`Found button with text: "${buttonText}"`)
      }
    }

    // try different selectors for close button
    const closeSelectors = [
      '[role="status"] button[aria-label="Close toast"]',
      '[role="status"] [data-close]',
      '[role="status"] button:has-text("")', // X symbol button
    ]

    let closeClicked = false
    for (const selector of closeSelectors) {
      const btn = await page.$(selector)
      if (btn) {
        console.log(`Found close button with selector: ${selector}`)
        await btn.click()
        closeClicked = true
        break
      }
    }

    if (!closeClicked) {
      // look for any button in the toast
      const buttons = await page.$$('[role="status"] button')
      console.log(`Found ${buttons.length} buttons in toast`)
      if (buttons.length > 0) {
        console.log('Clicking first button found...')
        await buttons[0].click()
        closeClicked = true
      }
    }

    // wait for animation
    await page.waitForTimeout(600)
    await logToastState(page, 'After clicking close')

    // take screenshot after close attempt
    await page.screenshot({ path: 'toast-debug-1-after-close.png', fullPage: true })
    console.log('Screenshot: toast-debug-1-after-close.png')

    // check if toast is gone
    const toastCount = await getVisibleToastCount(page)
    console.log(`Result: ${toastCount} toasts remaining`)

    if (toastCount > 0) {
      console.log('ISSUE FOUND: Toast not dismissed after clicking close button!')
    } else {
      console.log('SUCCESS: Toast dismissed correctly')
    }

    expect(toastCount).toBe(0)
  })

  test('ISSUE 2: Cancel button on action+cancel toast should not strand other toasts', async ({ page }) => {
    console.log('\n--- ISSUE 2: Testing cancel button with multiple toasts ---')

    // first, create some regular toasts
    await page.click('[data-testid="toast-success"]')
    await page.waitForTimeout(100)
    await page.click('[data-testid="toast-info"]')
    await page.waitForTimeout(100)
    await page.click('[data-testid="toast-warning"]')
    await page.waitForTimeout(300)

    console.log('Created 3 regular toasts')
    await logToastState(page, 'After creating regular toasts')

    // take screenshot
    await page.screenshot({ path: 'toast-debug-2-initial.png', fullPage: true })

    // now create action+cancel toast using the "With Action + Cancel" button
    // find the button by text since it doesn't have a testID
    const actionCancelBtn = await page.locator('button:has-text("With Action + Cancel")')
    await actionCancelBtn.click()
    console.log('Created action+cancel toast')

    await page.waitForTimeout(300)
    await logToastState(page, 'After creating action+cancel toast')

    // take screenshot
    await page.screenshot({ path: 'toast-debug-2-with-action-toast.png', fullPage: true })

    const toastCountBefore = await getVisibleToastCount(page)
    console.log(`Toast count before cancel: ${toastCountBefore}`)

    // find and click the Cancel button in the action toast
    // the cancel button should be inside a toast with "Are you sure?" text
    const cancelBtn = await page.locator('[role="status"]:has-text("Are you sure?") button:has-text("Cancel")')

    if (await cancelBtn.count() > 0) {
      console.log('Found Cancel button, clicking...')
      await cancelBtn.click()
    } else {
      console.log('Cancel button not found! Checking toast content...')
      const toasts = await page.$$('[role="status"]')
      for (const toast of toasts) {
        const text = await toast.textContent()
        console.log(`Toast content: "${text?.slice(0, 80)}"`)
      }
    }

    // wait for animations
    await page.waitForTimeout(800)
    await logToastState(page, 'After clicking cancel')

    // take screenshot
    await page.screenshot({ path: 'toast-debug-2-after-cancel.png', fullPage: true })

    const toastCountAfter = await getVisibleToastCount(page)
    console.log(`Toast count after cancel: ${toastCountAfter}`)
    console.log(`Expected: ${toastCountBefore - 1} (action toast should be gone, others should remain)`)

    if (toastCountAfter === 0 && toastCountBefore > 1) {
      console.log('ISSUE FOUND: All toasts disappeared when only one should have!')
    } else if (toastCountAfter === toastCountBefore) {
      console.log('ISSUE FOUND: Cancel button did not dismiss the toast!')
    } else if (toastCountAfter === toastCountBefore - 1) {
      console.log('SUCCESS: Only the action toast was dismissed')
    }

    // wait longer and check if remaining toasts still work
    await page.waitForTimeout(1000)
    await logToastState(page, 'After waiting 1s')

    // check for "stranded" toasts - toasts that appear stuck or frozen
    const finalCount = await getVisibleToastCount(page)
    console.log(`Final toast count: ${finalCount}`)

    // remaining toasts should still be interactable
    if (finalCount > 0) {
      const remainingToasts = await page.$$('[role="status"]')
      for (const toast of remainingToasts) {
        const style = await toast.evaluate((el: HTMLElement) => ({
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
          pointerEvents: getComputedStyle(el).pointerEvents,
        }))
        console.log(`Remaining toast style: opacity=${style.opacity}, pointerEvents=${style.pointerEvents}`)
        if (style.pointerEvents === 'none' || parseFloat(style.opacity) === 0) {
          console.log('ISSUE FOUND: Remaining toast appears stranded (not interactive)!')
        }
      }
    }

    expect(toastCountAfter).toBe(toastCountBefore - 1)
  })

  test('ISSUE 3: Hover expansion glitches - mouse movement should not cause visual artifacts', async ({ page }) => {
    console.log('\n--- ISSUE 3: Testing hover expansion glitches ---')

    // create multiple toasts to get the stacking behavior
    await page.click('[data-testid="toast-multiple"]')
    console.log('Clicked: Show 4 Toasts button')

    // wait for all 4 toasts to appear
    await page.waitForTimeout(1000)
    await logToastState(page, 'After creating 4 toasts')

    // screenshot of initial stacked state
    await page.screenshot({ path: 'toast-debug-3-initial-stack.png', fullPage: true })

    // find the actual toast element to hover over (not the container)
    const frontToast = await page.$('[data-front="true"]')
    if (!frontToast) {
      console.log('ERROR: Could not find front toast')
      return
    }

    const toastBox = await frontToast.boundingBox()
    if (!toastBox) {
      console.log('ERROR: Could not get toast bounding box')
      return
    }

    console.log(`Front toast position: x=${toastBox.x}, y=${toastBox.y}, w=${toastBox.width}, h=${toastBox.height}`)

    // hover over the toast to expand
    console.log('Moving mouse to toast to expand...')
    await page.mouse.move(toastBox.x + toastBox.width / 2, toastBox.y + toastBox.height / 2)
    await page.waitForTimeout(500)

    await logToastState(page, 'After initial hover (should be expanded)')
    await page.screenshot({ path: 'toast-debug-3-expanded.png', fullPage: true })

    // check if expanded by looking at toast positions
    const toastsAfterHover = await page.$$('[role="status"]')
    const positionsExpanded = await Promise.all(
      toastsAfterHover.map(async (t: any) => {
        const rect = await t.boundingBox()
        const expanded = await t.evaluate((el: HTMLElement) => el.getAttribute('data-expanded'))
        return { y: rect?.y, expanded }
      })
    )
    console.log('Toast positions after hover:', positionsExpanded)

    // check if expanded - toasts should have different y positions when expanded
    const uniqueYPositions = new Set(positionsExpanded.map(p => Math.round(p.y || 0)))
    const isExpanded = uniqueYPositions.size > 1 || positionsExpanded.some(p => p.expanded === 'true')
    if (isExpanded) {
      console.log('Toasts appear expanded (different y positions or data-expanded=true)')
    } else {
      console.log('WARNING: Toasts may NOT be expanding on hover!')
      console.log('POTENTIAL ISSUE: Hover expansion not working')
    }

    // move mouse away
    console.log('Moving mouse away from toasts...')
    await page.mouse.move(100, 100)
    await page.waitForTimeout(500)

    await logToastState(page, 'After mouse away (should collapse)')
    await page.screenshot({ path: 'toast-debug-3-collapsed.png', fullPage: true })

    // check positions after collapse
    const toastsAfterLeave = await page.$$('[role="status"]')
    const positionsCollapsed = await Promise.all(
      toastsAfterLeave.map(async (t: any) => {
        const rect = await t.boundingBox()
        return { y: rect?.y }
      })
    )
    console.log('Toast positions after mouse leave:', positionsCollapsed)

    // move mouse back
    console.log('Moving mouse back to toasts...')
    // re-get the toast position as it might have moved
    const frontToast2 = await page.$('[data-front="true"]')
    const toastBox2 = await frontToast2?.boundingBox()
    if (toastBox2) {
      await page.mouse.move(toastBox2.x + toastBox2.width / 2, toastBox2.y + toastBox2.height / 2)
    }
    await page.waitForTimeout(500)

    await logToastState(page, 'After mouse back (should expand again)')
    await page.screenshot({ path: 'toast-debug-3-re-expanded.png', fullPage: true })

    // rapid mouse movements to detect glitches
    console.log('Performing rapid mouse movements...')
    for (let i = 0; i < 5; i++) {
      const ft = await page.$('[data-front="true"]')
      const ftBox = await ft?.boundingBox()
      if (ftBox) {
        await page.mouse.move(ftBox.x + ftBox.width / 2, ftBox.y + ftBox.height / 2)
      }
      await page.waitForTimeout(100)
      await page.mouse.move(100, 100)
      await page.waitForTimeout(100)
    }

    // final state
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'toast-debug-3-after-rapid.png', fullPage: true })
    await logToastState(page, 'After rapid movements')

    // check for visual issues - toasts should all be in valid positions
    const toasts = await page.$$('[role="status"]')
    let hasGlitch = false

    for (const toast of toasts) {
      const style = await toast.evaluate((el: HTMLElement) => {
        const computed = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        return {
          opacity: computed.opacity,
          transform: computed.transform,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        }
      })

      // check for obviously wrong values
      if (style.width === 0 || style.height === 0) {
        console.log('GLITCH: Toast has zero dimensions!')
        hasGlitch = true
      }
      if (style.x < -1000 || style.y < -1000) {
        console.log('GLITCH: Toast is positioned off-screen!')
        hasGlitch = true
      }
    }

    if (!hasGlitch) {
      console.log('SUCCESS: No obvious visual glitches detected')
    }

    expect(hasGlitch).toBe(false)
  })

  test('ISSUE 4: Complex scenario - action toast cancel should not strand other toasts', async ({ page }) => {
    console.log('\n--- ISSUE 4: Complex scenario with multiple toasts and action+cancel ---')

    // create several regular toasts first
    console.log('Step 1: Creating initial toasts...')
    await page.click('[data-testid="toast-success"]')
    await page.waitForTimeout(150)
    await page.click('[data-testid="toast-error"]')
    await page.waitForTimeout(150)
    await page.click('[data-testid="toast-warning"]')
    await page.waitForTimeout(150)

    const initialCount = await getVisibleToastCount(page)
    console.log(`Created ${initialCount} initial toasts`)
    await logToastState(page, 'Initial state')
    await page.screenshot({ path: 'toast-debug-4-step1.png', fullPage: true })

    // create action+cancel toast
    console.log('Step 2: Creating action+cancel toast...')
    const actionCancelBtn = await page.locator('button:has-text("With Action + Cancel")')
    await actionCancelBtn.click()
    await page.waitForTimeout(300)

    const afterActionCount = await getVisibleToastCount(page)
    console.log(`After action toast: ${afterActionCount} toasts`)
    await logToastState(page, 'After action toast')
    await page.screenshot({ path: 'toast-debug-4-step2.png', fullPage: true })

    // hover to expand (so we can see all toasts)
    const toaster = await page.$('[aria-label*="Notifications"]')
    if (toaster) {
      const box = await toaster.boundingBox()
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + 50)
        await page.waitForTimeout(300)
      }
    }

    await page.screenshot({ path: 'toast-debug-4-expanded.png', fullPage: true })
    await logToastState(page, 'Expanded view')

    // click cancel on the action toast
    console.log('Step 3: Clicking Cancel button...')
    const cancelBtn = await page.locator('[role="status"]:has-text("Are you sure?") button:has-text("Cancel")')

    if (await cancelBtn.count() > 0) {
      await cancelBtn.click()
      console.log('Clicked Cancel button')
    } else {
      console.log('ERROR: Cancel button not found!')
      // debug: show all buttons in toasts
      const allButtons = await page.$$('[role="status"] button')
      for (const btn of allButtons) {
        const text = await btn.textContent()
        console.log(`Found button: "${text}"`)
      }
    }

    // wait for animation
    await page.waitForTimeout(600)

    const afterCancelCount = await getVisibleToastCount(page)
    console.log(`After cancel: ${afterCancelCount} toasts`)
    await logToastState(page, 'After cancel')
    await page.screenshot({ path: 'toast-debug-4-step3.png', fullPage: true })

    // check for stranded toasts
    console.log('Step 4: Checking for stranded toasts...')

    let strandedCount = 0
    const remainingToasts = await page.$$('[role="status"]')

    for (let i = 0; i < remainingToasts.length; i++) {
      const toast = remainingToasts[i]
      const state = await toast.evaluate((el: HTMLElement) => {
        const computed = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        return {
          opacity: computed.opacity,
          pointerEvents: computed.pointerEvents,
          transform: computed.transform,
          y: rect.y,
          removed: el.getAttribute('data-removed'),
          index: el.getAttribute('data-index'),
        }
      })

      console.log(`Toast ${i}: opacity=${state.opacity}, pointerEvents=${state.pointerEvents}, removed=${state.removed}, index=${state.index}`)

      // a "stranded" toast would be one that:
      // - has removed="true" but is still visible
      // - has opacity 0 but is still in DOM
      // - has pointerEvents none unexpectedly
      if (state.removed === 'true' && parseFloat(state.opacity) > 0) {
        console.log('STRANDED: Toast marked as removed but still visible!')
        strandedCount++
      }
    }

    // check if toasts have "jumped" - look for unusual position changes
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'toast-debug-4-final.png', fullPage: true })

    const finalCount = await getVisibleToastCount(page)
    console.log(`Final toast count: ${finalCount}`)
    await logToastState(page, 'Final state')

    // expected: we should have (initial count) toasts remaining (action toast should be gone)
    const expectedCount = initialCount

    if (finalCount === 0) {
      console.log('ISSUE: All toasts disappeared!')
    } else if (finalCount < expectedCount) {
      console.log(`ISSUE: Some toasts are missing (expected ${expectedCount}, got ${finalCount})`)
    } else if (strandedCount > 0) {
      console.log(`ISSUE: ${strandedCount} stranded toasts detected`)
    } else {
      console.log('SUCCESS: Toasts behaved correctly')
    }

    // verify the action toast is gone and others remain
    expect(afterCancelCount).toBe(afterActionCount - 1)
    expect(strandedCount).toBe(0)
  })

  test('ISSUE 5: Dismiss All button functionality', async ({ page }) => {
    console.log('\n--- ISSUE 5: Testing Dismiss All button ---')

    // create multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const beforeCount = await getVisibleToastCount(page)
    console.log(`Created ${beforeCount} toasts`)
    await logToastState(page, 'Before dismiss all')
    await page.screenshot({ path: 'toast-debug-5-before.png', fullPage: true })

    // click dismiss all
    await page.click('[data-testid="toast-dismiss-all"]')
    console.log('Clicked Dismiss All')

    // wait for animations
    await page.waitForTimeout(800)

    const afterCount = await getVisibleToastCount(page)
    console.log(`After dismiss all: ${afterCount} toasts`)
    await logToastState(page, 'After dismiss all')
    await page.screenshot({ path: 'toast-debug-5-after.png', fullPage: true })

    if (afterCount > 0) {
      console.log('ISSUE: Some toasts were not dismissed!')
    } else {
      console.log('SUCCESS: All toasts dismissed')
    }

    expect(afterCount).toBe(0)
  })

  test('ISSUE 6: Action button (Confirm) should also dismiss', async ({ page }) => {
    console.log('\n--- ISSUE 6: Testing action button (Confirm) ---')

    // create action+cancel toast
    const actionCancelBtn = await page.locator('button:has-text("With Action + Cancel")')
    await actionCancelBtn.click()
    await page.waitForTimeout(300)

    await logToastState(page, 'After creating action toast')
    await page.screenshot({ path: 'toast-debug-6-initial.png', fullPage: true })

    // click the Confirm (action) button
    const confirmBtn = await page.locator('[role="status"]:has-text("Are you sure?") button:has-text("Confirm")')

    if (await confirmBtn.count() > 0) {
      await confirmBtn.click()
      console.log('Clicked Confirm button')
    } else {
      console.log('ERROR: Confirm button not found!')
    }

    await page.waitForTimeout(600)

    const afterCount = await getVisibleToastCount(page)
    console.log(`After confirm: ${afterCount} toasts`)
    await logToastState(page, 'After confirm')
    await page.screenshot({ path: 'toast-debug-6-after.png', fullPage: true })

    if (afterCount > 0) {
      console.log('ISSUE: Toast not dismissed after clicking Confirm!')
    } else {
      console.log('SUCCESS: Toast dismissed after Confirm')
    }

    expect(afterCount).toBe(0)
  })

  test('ISSUE 7: Always Expand toggle should show all toasts expanded', async ({ page }) => {
    console.log('\n--- ISSUE 7: Testing Always Expand toggle ---')

    // first enable "Always Expand"
    const alwaysExpandBtn = await page.locator('button:has-text("Always Expand")')
    await alwaysExpandBtn.click()
    console.log('Enabled Always Expand mode')
    await page.waitForTimeout(200)

    // create multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    console.log('Created 4 toasts')

    await page.waitForTimeout(1000)
    await logToastState(page, 'With Always Expand enabled')
    await page.screenshot({ path: 'toast-debug-7-always-expand.png', fullPage: true })

    // check if all toasts are visible and at different y positions
    const toasts = await page.$$('[role="status"]')
    const positions = await Promise.all(
      toasts.map(async (t: any) => {
        const rect = await t.boundingBox()
        const expanded = await t.evaluate((el: HTMLElement) => el.getAttribute('data-expanded'))
        return { y: rect?.y, expanded }
      })
    )
    console.log('Toast positions with Always Expand:', positions)

    // all should be expanded
    const allExpanded = positions.every(p => p.expanded === 'true')
    if (allExpanded) {
      console.log('SUCCESS: All toasts marked as expanded')
    } else {
      console.log('WARNING: Not all toasts are marked as expanded')
    }

    // should have different y positions (not stacked)
    const uniqueYPositions = new Set(positions.map(p => Math.round(p.y || 0)))
    if (uniqueYPositions.size > 1) {
      console.log(`SUCCESS: Toasts at ${uniqueYPositions.size} different y positions`)
    } else {
      console.log('ISSUE: All toasts at same y position - not visually expanded!')
    }

    expect(allExpanded).toBe(true)
  })

  test('ISSUE 8: Swipe to dismiss should work', async ({ page }) => {
    console.log('\n--- ISSUE 8: Testing swipe to dismiss ---')

    // create a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForTimeout(300)

    const toast = await page.$('[role="status"]')
    if (!toast) {
      console.log('ERROR: No toast found')
      return
    }

    const toastBox = await toast.boundingBox()
    if (!toastBox) {
      console.log('ERROR: Could not get toast bounding box')
      return
    }

    console.log(`Toast position: x=${toastBox.x}, y=${toastBox.y}`)
    await page.screenshot({ path: 'toast-debug-8-before-swipe.png', fullPage: true })

    // simulate swipe right
    console.log('Performing swipe right gesture...')
    await page.mouse.move(toastBox.x + 50, toastBox.y + toastBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(toastBox.x + 200, toastBox.y + toastBox.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(600)
    await page.screenshot({ path: 'toast-debug-8-after-swipe.png', fullPage: true })

    const toastCount = await getVisibleToastCount(page)
    console.log(`Toast count after swipe: ${toastCount}`)

    if (toastCount === 0) {
      console.log('SUCCESS: Toast dismissed via swipe')
    } else {
      console.log('ISSUE: Toast not dismissed after swipe')
    }

    expect(toastCount).toBe(0)
  })

  test('ISSUE 9: Toast auto-dismiss timing after interactions', async ({ page }) => {
    console.log('\n--- ISSUE 9: Testing auto-dismiss timing ---')

    // create a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForTimeout(200)

    console.log('Toast created, checking initial state')
    await logToastState(page, 'Initial')

    // hover to pause timer
    const toast = await page.$('[role="status"]')
    const toastBox = await toast?.boundingBox()
    if (toastBox) {
      console.log('Hovering over toast to pause timer...')
      await page.mouse.move(toastBox.x + toastBox.width / 2, toastBox.y + toastBox.height / 2)
      await page.waitForTimeout(1000) // pause for 1 second

      // move away to resume timer
      console.log('Moving away to resume timer...')
      await page.mouse.move(100, 100)
    }

    // wait for auto-dismiss (default is 4 seconds, but we paused for 1)
    // so should take ~3+ more seconds
    console.log('Waiting for auto-dismiss...')
    await page.waitForTimeout(5000)

    const toastCount = await getVisibleToastCount(page)
    console.log(`Toast count after waiting: ${toastCount}`)

    if (toastCount === 0) {
      console.log('SUCCESS: Toast auto-dismissed after timer expired')
    } else {
      console.log('ISSUE: Toast still visible - auto-dismiss may be broken')
    }

    expect(toastCount).toBe(0)
  })
})
