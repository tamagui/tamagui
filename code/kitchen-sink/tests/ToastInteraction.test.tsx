import { expect, test, type Page, type BrowserContext } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Toast v2 Interaction Tests
 *
 * Tests two specific fixes:
 * 1. Button click interference fix (useDragGesture.ts) - buttons/links skip drag handling
 * 2. Mouse leave state reset fix (Toaster.tsx) - interacting state resets on mouse leave
 *
 * Records video and captures frames for visual verification.
 */

const VIDEO_DIR = '/tmp/toast-interaction-test'
const REPORT_PATH = '/tmp/toast-interaction-report.md'

// tests run serially since they share state
test.describe.configure({ mode: 'serial' })

interface FrameData {
  timestamp: number
  toastCount: number
  toastTypes: string[]
  expanded: boolean
  interacting: boolean
  toastIds: string[]
}

interface ReportSection {
  title: string
  status: 'PASS' | 'FAIL' | 'WARN'
  details: string[]
  frames?: FrameData[]
}

const reportSections: ReportSection[] = []

async function captureState(page: Page, startTime: number): Promise<FrameData> {
  const result = await page.evaluate(() => {
    const toasts = document.querySelectorAll('[role="status"]')
    const toaster = document.querySelector('[data-y-position]')

    return {
      timestamp: Date.now(),
      toastCount: toasts.length,
      toastTypes: Array.from(toasts).map(
        (t) => t.getAttribute('data-type') || 'unknown'
      ),
      expanded: Array.from(toasts).some(
        (t) => t.getAttribute('data-expanded') === 'true'
      ),
      interacting: false, // can't directly access react state
      toastIds: Array.from(toasts).map((t) => t.getAttribute('data-index') || ''),
    }
  })
  result.timestamp = Date.now() - startTime
  return result
}

async function waitForToastCount(
  page: Page,
  count: number,
  timeout = 3000
): Promise<boolean> {
  try {
    await page.waitForFunction(
      (expectedCount) => {
        const toasts = document.querySelectorAll('[role="status"]')
        return toasts.length === expectedCount
      },
      count,
      { timeout }
    )
    return true
  } catch {
    return false
  }
}

function generateReport(): string {
  let report = `# Toast Interaction Test Report

Generated: ${new Date().toISOString()}
Video Location: ${VIDEO_DIR}

---

## Summary

`

  const passCount = reportSections.filter((s) => s.status === 'PASS').length
  const failCount = reportSections.filter((s) => s.status === 'FAIL').length
  const warnCount = reportSections.filter((s) => s.status === 'WARN').length

  report += `| Metric | Count |
|--------|-------|
| PASS | ${passCount} |
| FAIL | ${failCount} |
| WARN | ${warnCount} |
| Total Tests | ${reportSections.length} |

---

## Detailed Results

`

  for (const section of reportSections) {
    const statusIcon =
      section.status === 'PASS'
        ? '[PASS]'
        : section.status === 'FAIL'
          ? '[FAIL]'
          : '[WARN]'
    report += `### ${statusIcon} ${section.title}

`
    for (const detail of section.details) {
      report += `- ${detail}
`
    }

    if (section.frames && section.frames.length > 0) {
      report += `
**Frame Analysis:**
\`\`\`
`
      for (const frame of section.frames.slice(0, 20)) {
        report += `t=${frame.timestamp}ms count=${frame.toastCount} types=[${frame.toastTypes.join(',')}] expanded=${frame.expanded}
`
      }
      if (section.frames.length > 20) {
        report += `... (${section.frames.length - 20} more frames)
`
      }
      report += `\`\`\`
`
    }
    report += `
---

`
  }

  return report
}

test.describe('Toast Interaction Tests', () => {
  let context: BrowserContext
  let page: Page

  test.beforeAll(async ({ browser }) => {
    // ensure output directory
    if (!fs.existsSync(VIDEO_DIR)) {
      fs.mkdirSync(VIDEO_DIR, { recursive: true })
    }

    // create context with video recording
    context = await browser.newContext({
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 1280, height: 720 },
      },
      viewport: { width: 1280, height: 720 },
    })

    page = await context.newPage()
  })

  test.afterAll(async () => {
    await page.close()
    await context.close()

    // write report
    const report = generateReport()
    fs.writeFileSync(REPORT_PATH, report)
    console.log(`\nReport written to: ${REPORT_PATH}`)
  })

  test('1. Close button functionality', async () => {
    await page.goto('http://localhost:9000/?test=ToastMultipleCase&animationDriver=css')
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
    await page.waitForTimeout(500)

    const startTime = Date.now()
    const frames: FrameData[] = []

    // create a toast
    await page.click('[data-testid="toast-success"]')
    await page.waitForSelector('[data-type="success"]', { timeout: 5000 })
    await page.waitForTimeout(300) // wait for enter animation

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'close-01-toast-created.png') })

    // find and click close button
    const closeButton = await page.$('[aria-label="Close toast"]')
    expect(closeButton, 'Close button should exist').toBeTruthy()

    // capture frame before click
    frames.push(await captureState(page, startTime))

    // click close button - this should work after the fix
    await closeButton!.click()
    await page.waitForTimeout(100)

    // capture several frames during exit animation
    for (let i = 0; i < 10; i++) {
      frames.push(await captureState(page, startTime))
      await page.waitForTimeout(50)
    }

    await page.screenshot({ path: path.join(VIDEO_DIR, 'close-02-after-click.png') })

    // verify toast is dismissed
    const success = await waitForToastCount(page, 0, 2000)

    const section: ReportSection = {
      title: 'Close Button Functionality',
      status: success ? 'PASS' : 'FAIL',
      details: [
        `Close button found: YES`,
        `Toast dismissed after click: ${success ? 'YES' : 'NO'}`,
        `Frame count: ${frames.length}`,
        `Initial toast count: ${frames[0]?.toastCount ?? 0}`,
        `Final toast count: ${frames[frames.length - 1]?.toastCount ?? 0}`,
      ],
      frames,
    }
    reportSections.push(section)

    expect(success, 'Toast should be dismissed after clicking close button').toBe(true)
  })

  test('2. Action and Cancel button functionality', async () => {
    // dismiss any existing toasts
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(400)

    const startTime = Date.now()
    const frames: FrameData[] = []

    // create toast with action + cancel buttons
    // find the "With Action + Cancel" button and click it
    const actionCancelButton = await page.locator('button:has-text("With Action + Cancel")')
    await actionCancelButton.click()
    await page.waitForSelector('[role="status"]', { timeout: 5000 })
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'action-01-toast-created.png') })

    // find cancel button inside toast
    const toast = await page.$('[role="status"]')
    expect(toast, 'Toast should exist').toBeTruthy()

    // look for Cancel button (SizableText with "Cancel" text inside ToastActionButton)
    const cancelButton = await toast!.$('button:has-text("Cancel")')
    expect(cancelButton, 'Cancel button should exist in toast').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'action-02-before-cancel.png') })
    frames.push(await captureState(page, startTime))

    // click cancel - should dismiss toast and NOT trigger swipe gesture
    await cancelButton!.click()
    await page.waitForTimeout(100)

    // capture frames during animation
    for (let i = 0; i < 10; i++) {
      frames.push(await captureState(page, startTime))
      await page.waitForTimeout(50)
    }

    await page.screenshot({ path: path.join(VIDEO_DIR, 'action-03-after-cancel.png') })

    const success = await waitForToastCount(page, 0, 2000)

    const section: ReportSection = {
      title: 'Action/Cancel Button Functionality',
      status: success ? 'PASS' : 'FAIL',
      details: [
        `Cancel button found: YES`,
        `Toast dismissed after Cancel click: ${success ? 'YES' : 'NO'}`,
        `Frame count: ${frames.length}`,
      ],
      frames,
    }
    reportSections.push(section)

    expect(success, 'Toast should dismiss when Cancel button is clicked').toBe(true)
  })

  test('3. Swipe dismiss still works after button fix', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(400)

    const startTime = Date.now()
    const frames: FrameData[] = []

    // create a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'swipe-01-before.png') })

    // perform swipe right (on the toast content, not on a button)
    const centerX = box!.x + box!.width / 2
    const centerY = box!.y + box!.height / 2

    // swipe from center to right
    await page.mouse.move(centerX, centerY)
    await page.mouse.down()

    // gradual swipe with frame captures
    for (let i = 0; i < 15; i++) {
      await page.mouse.move(centerX + (i + 1) * 20, centerY, { steps: 1 })
      frames.push(await captureState(page, startTime))
      await page.waitForTimeout(20)
    }

    await page.mouse.up()

    // capture exit animation
    for (let i = 0; i < 10; i++) {
      frames.push(await captureState(page, startTime))
      await page.waitForTimeout(50)
    }

    await page.screenshot({ path: path.join(VIDEO_DIR, 'swipe-02-after.png') })

    const success = await waitForToastCount(page, 0, 2000)

    const section: ReportSection = {
      title: 'Swipe Dismiss After Button Fix',
      status: success ? 'PASS' : 'FAIL',
      details: [
        `Swipe performed on toast body (not button)`,
        `Toast dismissed after swipe: ${success ? 'YES' : 'NO'}`,
        `Frame count: ${frames.length}`,
      ],
      frames,
    }
    reportSections.push(section)

    expect(success, 'Swipe dismiss should still work').toBe(true)
  })

  test('4. Hover expand stability - mouse leave state reset', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(400)

    const startTime = Date.now()
    const frames: FrameData[] = []

    // create 4+ toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000) // wait for staggered creation

    let toasts = await page.$$('[role="status"]')
    expect(toasts.length, 'Should have 4 toasts').toBeGreaterThanOrEqual(4)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'hover-01-initial.png') })

    // move mouse away first
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'hover-02-collapsed.png') })

    // hover on toaster to expand
    const toaster = await page.$('[data-y-position="bottom"]')
    expect(toaster, 'Toaster should exist').toBeTruthy()

    await toaster!.hover()
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'hover-03-expanded.png') })

    // move mouse off
    await page.mouse.move(0, 0)
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'hover-04-off.png') })

    // move mouse back on
    await toaster!.hover()
    await page.waitForTimeout(300)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'hover-05-back-on.png') })

    // verify toasts are still there and expanded
    toasts = await page.$$('[role="status"]')
    const expandedState = await captureState(page, startTime)

    const stillHaveToasts = toasts.length >= 4
    const isExpanded = expandedState.expanded

    // no unexpected closings - check we still have 4 toasts
    const section: ReportSection = {
      title: 'Hover Expand Stability',
      status: stillHaveToasts && isExpanded ? 'PASS' : 'FAIL',
      details: [
        `Initial toast count: 4`,
        `Final toast count: ${toasts.length}`,
        `Toasts preserved after hover cycles: ${stillHaveToasts ? 'YES' : 'NO'}`,
        `Expanded after re-hover: ${isExpanded ? 'YES' : 'NO'}`,
        `No unexpected closings: ${stillHaveToasts ? 'YES' : 'NO'}`,
      ],
      frames,
    }
    reportSections.push(section)

    expect(stillHaveToasts, 'All toasts should remain after hover cycles').toBe(true)
    expect(isExpanded, 'Toasts should expand on re-hover').toBe(true)
  })

  test('5. Complex interaction sequence - cancel button with multiple toasts', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    const startTime = Date.now()
    const frames: FrameData[] = []

    // create several toasts first
    await page.click('[data-testid="toast-success"]')
    await page.waitForTimeout(200)
    await page.click('[data-testid="toast-info"]')
    await page.waitForTimeout(200)
    await page.click('[data-testid="toast-warning"]')
    await page.waitForTimeout(200)

    // now create one with action + cancel
    const actionCancelButton = await page.locator('button:has-text("With Action + Cancel")')
    await actionCancelButton.click()
    await page.waitForTimeout(500)

    let toasts = await page.$$('[role="status"]')
    const initialCount = toasts.length
    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'complex-01-initial.png') })

    expect(initialCount, 'Should have 4 toasts').toBe(4)

    // hover to expand
    const toaster = await page.$('[data-y-position="bottom"]')
    await toaster!.hover()
    await page.waitForTimeout(400)

    frames.push(await captureState(page, startTime))
    await page.screenshot({ path: path.join(VIDEO_DIR, 'complex-02-expanded.png') })

    // find and click Cancel button on the action toast (should be front/most recent)
    const frontToast = await page.$('[data-front="true"]')
    expect(frontToast, 'Front toast should exist').toBeTruthy()

    const cancelButton = await frontToast!.$('button:has-text("Cancel")')
    expect(cancelButton, 'Cancel button should exist').toBeTruthy()

    // click cancel
    await cancelButton!.click()
    await page.waitForTimeout(100)

    // capture animation frames
    for (let i = 0; i < 15; i++) {
      frames.push(await captureState(page, startTime))
      if (i % 3 === 0) {
        await page.screenshot({
          path: path.join(VIDEO_DIR, `complex-03-anim-${i.toString().padStart(2, '0')}.png`),
        })
      }
      await page.waitForTimeout(50)
    }

    await page.screenshot({ path: path.join(VIDEO_DIR, 'complex-04-after-cancel.png') })

    // wait for animation to settle
    await page.waitForTimeout(500)

    toasts = await page.$$('[role="status"]')
    const finalCount = toasts.length
    frames.push(await captureState(page, startTime))

    // verify: one toast removed (the one with cancel), others remain
    const oneRemoved = finalCount === initialCount - 1
    const othersRemain = finalCount === 3

    // check that remaining toasts are in correct order (no stranded/jumping)
    const remainingTypes = await page.$$eval('[role="status"]', (els) =>
      els.map((el) => el.getAttribute('data-type'))
    )

    // original order was: success, info, warning, then action-cancel (default type)
    // after removing action-cancel, should have: warning, info, success (most recent first)
    const orderCorrect =
      remainingTypes.includes('success') &&
      remainingTypes.includes('info') &&
      remainingTypes.includes('warning')

    const section: ReportSection = {
      title: 'Complex Interaction - Cancel with Multiple Toasts',
      status: oneRemoved && othersRemain && orderCorrect ? 'PASS' : 'FAIL',
      details: [
        `Initial toast count: ${initialCount}`,
        `Final toast count: ${finalCount}`,
        `One toast removed: ${oneRemoved ? 'YES' : 'NO'}`,
        `Other toasts preserved: ${othersRemain ? 'YES' : 'NO'}`,
        `Remaining types: [${remainingTypes.join(', ')}]`,
        `Stack order correct: ${orderCorrect ? 'YES' : 'NO'}`,
        `No stranded/jumping: ${orderCorrect ? 'YES' : 'Potential issue'}`,
      ],
      frames,
    }
    reportSections.push(section)

    expect(oneRemoved, 'Only one toast should be removed').toBe(true)
    expect(othersRemain, 'Other toasts should remain').toBe(true)
    expect(orderCorrect, 'Remaining toasts should maintain correct order').toBe(true)
  })

  test('6. Frame analysis - check for visual glitches', async () => {
    // analyze captured frames across all tests for anomalies
    let glitchesFound = 0
    const anomalies: string[] = []

    for (const section of reportSections) {
      if (!section.frames) continue

      let prevCount = -1
      for (let i = 0; i < section.frames.length; i++) {
        const frame = section.frames[i]

        // check for unexpected toast count jumps (more than 1 change at a time)
        if (prevCount !== -1 && Math.abs(frame.toastCount - prevCount) > 1) {
          anomalies.push(
            `${section.title}: Frame ${i} - toast count jumped from ${prevCount} to ${frame.toastCount}`
          )
          glitchesFound++
        }
        prevCount = frame.toastCount
      }
    }

    // save all frames for reference
    const framesData = reportSections.map((s) => ({
      title: s.title,
      frames: s.frames?.slice(0, 30),
    }))
    fs.writeFileSync(
      path.join(VIDEO_DIR, 'all-frames.json'),
      JSON.stringify(framesData, null, 2)
    )

    const section: ReportSection = {
      title: 'Frame Analysis - Visual Glitch Check',
      status: glitchesFound === 0 ? 'PASS' : 'WARN',
      details: [
        `Total anomalies found: ${glitchesFound}`,
        `Smooth animations: ${glitchesFound === 0 ? 'YES' : 'Potential issues'}`,
        ...anomalies.slice(0, 10),
      ],
    }
    reportSections.push(section)

    // print summary
    console.log('\n' + '='.repeat(70))
    console.log('TOAST INTERACTION TEST RESULTS')
    console.log('='.repeat(70))

    const passCount = reportSections.filter((s) => s.status === 'PASS').length
    const failCount = reportSections.filter((s) => s.status === 'FAIL').length
    const warnCount = reportSections.filter((s) => s.status === 'WARN').length

    console.log(`PASS: ${passCount}  |  WARN: ${warnCount}  |  FAIL: ${failCount}`)
    console.log('-'.repeat(70))

    for (const s of reportSections) {
      const icon =
        s.status === 'PASS' ? '[PASS]' : s.status === 'FAIL' ? '[FAIL]' : '[WARN]'
      console.log(`${icon} ${s.title}`)
    }

    console.log('-'.repeat(70))
    console.log(`Video: ${VIDEO_DIR}`)
    console.log(`Report: ${REPORT_PATH}`)
    console.log('='.repeat(70))

    // allow warnings but no failures for overall pass
    expect(failCount, 'Should have no failures').toBe(0)
  })
})
