import { expect, test, type Page, type BrowserContext } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Toast Gesture Dampening Test
 *
 * Tests the Sonner-style gesture dampening implementation:
 * - Dampening formula: 1 / (1.5 + Math.abs(delta) / 20)
 * - Full 1:1 movement in dismiss direction (right)
 * - Dampened movement against dismiss direction (left)
 * - Velocity-based dismiss (quick flick should dismiss even with small distance)
 * - Smooth animation (no jumps between frames)
 *
 * Uses CSS animation driver.
 */

const VIDEO_DIR = '/tmp/toast-gesture-test'
const REPORT_PATH = '/tmp/toast-gesture-report.md'

// sonner dampening formula for verification
function getDampening(delta: number): number {
  const factor = Math.abs(delta) / 20
  return 1 / (1.5 + factor)
}

interface FrameData {
  timestamp: number
  fingerX: number // where the finger is
  toastTranslateX: number // where the toast is (from transform)
  rawDelta: number // finger movement from start
  expectedOffset: number // what we expect based on dampening
  actualOffset: number // actual toast offset
  ratio: number // actual/raw - should be ~1.0 for dismiss dir, <1.0 for opposite
}

interface SwipeAnalysis {
  name: string
  direction: 'dismiss' | 'opposite'
  frames: FrameData[]
  averageRatio: number
  maxDelta: number
  dismissed: boolean
  smooth: boolean
  jumpCount: number
  status: 'PASS' | 'FAIL' | 'WARN'
  details: string[]
}

const reportSections: SwipeAnalysis[] = []

async function getToastTransformX(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const toast = document.querySelector('[role="status"]') as HTMLElement
    if (!toast) return null

    // the drag transform is on the DragWrapper (first child of toast)
    // not on the toast itself (which handles stacking animations)
    const dragWrapper = toast.firstElementChild as HTMLElement
    const targetElement = dragWrapper || toast

    const style = getComputedStyle(targetElement)
    const transform = style.transform

    if (!transform || transform === 'none') return 0

    // parse matrix(a, b, c, d, tx, ty)
    const match = transform.match(/matrix\(([^)]+)\)/)
    if (match) {
      const values = match[1].split(',').map(Number)
      if (values.length >= 6) {
        return values[4] // tx = translateX
      }
    }

    // try matrix3d
    const match3d = transform.match(/matrix3d\(([^)]+)\)/)
    if (match3d) {
      const values = match3d[1].split(',').map(Number)
      if (values.length >= 16) {
        return values[12] // translateX in matrix3d
      }
    }

    return 0
  })
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
  let report = `# Toast Gesture Dampening Test Report

Generated: ${new Date().toISOString()}
Video Location: ${VIDEO_DIR}

## Sonner Dampening Formula

\`dampening = 1 / (1.5 + Math.abs(delta) / 20)\`

- At delta=0: dampening = 0.667 (66.7%)
- At delta=20: dampening = 0.4 (40%)
- At delta=50: dampening = 0.27 (27%)
- At delta=100: dampening = 0.17 (17%)

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

    report += `### ${statusIcon} ${section.name}

**Direction:** ${section.direction}
**Average Ratio:** ${section.averageRatio.toFixed(3)} (${section.direction === 'dismiss' ? 'expected ~1.0' : 'expected < 0.67'})
**Max Delta:** ${section.maxDelta.toFixed(1)}px
**Dismissed:** ${section.dismissed ? 'YES' : 'NO'}
**Smooth Animation:** ${section.smooth ? 'YES' : 'NO'}
**Jump Count:** ${section.jumpCount}

**Details:**
`
    for (const detail of section.details) {
      report += `- ${detail}
`
    }

    if (section.frames.length > 0) {
      report += `
**Frame Analysis (first 15):**
\`\`\`
`
      const framesToShow = section.frames.slice(0, 15)
      for (const frame of framesToShow) {
        report += `t=${frame.timestamp.toString().padStart(4)}ms | finger=${frame.fingerX.toFixed(0).padStart(4)} | rawDelta=${frame.rawDelta.toFixed(1).padStart(6)} | actual=${frame.actualOffset.toFixed(1).padStart(6)} | ratio=${frame.ratio.toFixed(3)}
`
      }
      if (section.frames.length > 15) {
        report += `... (${section.frames.length - 15} more frames)
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

test.describe('Toast Gesture Dampening Tests', () => {
  test.describe.configure({ mode: 'serial' })

  let context: BrowserContext
  let page: Page

  test.beforeAll(async ({ browser }) => {
    // create output directory
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

  test('1. Swipe in dismiss direction (right) - should be 1:1 movement', async () => {
    await page.goto('http://localhost:9000/?test=ToastMultipleCase&animationDriver=css')
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
    await page.waitForTimeout(500)

    // create a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(400) // wait for enter animation

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'dismiss-01-before.png') })

    const frames: FrameData[] = []
    const startTime = Date.now()
    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // start drag
    await page.mouse.move(startX, startY)
    await page.mouse.down()

    // get initial transform
    const initialTransformX = (await getToastTransformX(page)) ?? 0

    // swipe RIGHT (dismiss direction) in small increments
    // capture at least 20 frames
    const totalDistance = 150 // enough to trigger dismiss
    const steps = 25
    const stepSize = totalDistance / steps

    for (let i = 0; i < steps; i++) {
      const currentX = startX + (i + 1) * stepSize
      await page.mouse.move(currentX, startY, { steps: 1 })

      const transformX = (await getToastTransformX(page)) ?? 0
      const rawDelta = currentX - startX
      const actualOffset = transformX - initialTransformX

      // for dismiss direction, expected is 1:1
      const expectedOffset = rawDelta
      const ratio = rawDelta !== 0 ? actualOffset / rawDelta : 1

      frames.push({
        timestamp: Date.now() - startTime,
        fingerX: currentX,
        toastTranslateX: transformX,
        rawDelta,
        expectedOffset,
        actualOffset,
        ratio,
      })

      await page.waitForTimeout(20)
    }

    await page.mouse.up()
    await page.screenshot({ path: path.join(VIDEO_DIR, 'dismiss-02-after-swipe.png') })

    // check if toast was dismissed
    await page.waitForTimeout(500)
    const dismissed = await waitForToastCount(page, 0, 2000)

    await page.screenshot({ path: path.join(VIDEO_DIR, 'dismiss-03-final.png') })

    // analyze frames
    const validFrames = frames.filter((f) => Math.abs(f.rawDelta) > 5) // ignore tiny movements
    const avgRatio =
      validFrames.length > 0
        ? validFrames.reduce((sum, f) => sum + f.ratio, 0) / validFrames.length
        : 0
    const maxDelta = Math.max(...frames.map((f) => Math.abs(f.rawDelta)))

    // check for jumps (smoothness)
    let jumpCount = 0
    for (let i = 1; i < frames.length; i++) {
      const delta = Math.abs(frames[i].actualOffset - frames[i - 1].actualOffset)
      // a jump is when movement is > 30px in one frame (should be gradual)
      if (delta > 30 && Math.abs(frames[i].rawDelta - frames[i - 1].rawDelta) < 20) {
        jumpCount++
      }
    }

    const smooth = jumpCount === 0
    // for dismiss direction, ratio should be close to 1.0 (allow 0.85-1.15)
    const ratioOk = avgRatio >= 0.85 && avgRatio <= 1.15

    const analysis: SwipeAnalysis = {
      name: 'Swipe Right (Dismiss Direction)',
      direction: 'dismiss',
      frames,
      averageRatio: avgRatio,
      maxDelta,
      dismissed,
      smooth,
      jumpCount,
      status: ratioOk && smooth && dismissed ? 'PASS' : ratioOk && smooth ? 'WARN' : 'FAIL',
      details: [
        `Average movement ratio: ${avgRatio.toFixed(3)} (expected ~1.0 for 1:1 movement)`,
        `Frame count: ${frames.length}`,
        `Valid frames (>5px movement): ${validFrames.length}`,
        `Ratio range: ${Math.min(...validFrames.map((f) => f.ratio)).toFixed(3)} - ${Math.max(...validFrames.map((f) => f.ratio)).toFixed(3)}`,
        `Toast dismissed: ${dismissed ? 'YES' : 'NO'}`,
        `Smooth (no jumps): ${smooth ? 'YES' : 'NO'}`,
        ratioOk ? '1:1 movement verified' : 'ISSUE: Movement not 1:1 as expected',
      ],
    }
    reportSections.push(analysis)

    // save frame data
    fs.writeFileSync(
      path.join(VIDEO_DIR, 'dismiss-frames.json'),
      JSON.stringify(frames, null, 2)
    )

    expect(ratioOk, 'Movement should be ~1:1 in dismiss direction').toBe(true)
    expect(smooth, 'Animation should be smooth (no jumps)').toBe(true)
  })

  test('2. Swipe against dismiss direction (left) - should be dampened', async () => {
    // dismiss any existing and create fresh toast
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(400)

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'opposite-01-before.png') })

    const frames: FrameData[] = []
    const startTime = Date.now()
    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    // start drag
    await page.mouse.move(startX, startY)
    await page.mouse.down()

    const initialTransformX = (await getToastTransformX(page)) ?? 0

    // swipe LEFT (opposite direction) - should be dampened
    const totalDistance = -100 // negative = left
    const steps = 25
    const stepSize = totalDistance / steps

    for (let i = 0; i < steps; i++) {
      const currentX = startX + (i + 1) * stepSize
      await page.mouse.move(currentX, startY, { steps: 1 })

      const transformX = (await getToastTransformX(page)) ?? 0
      const rawDelta = currentX - startX
      const actualOffset = transformX - initialTransformX

      // for opposite direction, expected is dampened
      // dampening = 1 / (1.5 + |delta| / 20)
      const dampening = getDampening(rawDelta)
      const expectedOffset = rawDelta * dampening
      const ratio = rawDelta !== 0 ? actualOffset / rawDelta : 0

      frames.push({
        timestamp: Date.now() - startTime,
        fingerX: currentX,
        toastTranslateX: transformX,
        rawDelta,
        expectedOffset,
        actualOffset,
        ratio,
      })

      await page.waitForTimeout(20)
    }

    await page.mouse.up()
    await page.screenshot({ path: path.join(VIDEO_DIR, 'opposite-02-after-swipe.png') })

    // toast should snap back (not dismiss)
    await page.waitForTimeout(500)
    const stillExists = (await page.$$('[role="status"]')).length > 0

    await page.screenshot({ path: path.join(VIDEO_DIR, 'opposite-03-snapback.png') })

    // analyze frames
    const validFrames = frames.filter((f) => Math.abs(f.rawDelta) > 5)
    const avgRatio =
      validFrames.length > 0
        ? validFrames.reduce((sum, f) => sum + Math.abs(f.ratio), 0) / validFrames.length
        : 0
    const maxDelta = Math.max(...frames.map((f) => Math.abs(f.rawDelta)))

    // check smoothness
    let jumpCount = 0
    for (let i = 1; i < frames.length; i++) {
      const delta = Math.abs(frames[i].actualOffset - frames[i - 1].actualOffset)
      if (delta > 20 && Math.abs(frames[i].rawDelta - frames[i - 1].rawDelta) < 15) {
        jumpCount++
      }
    }

    const smooth = jumpCount <= 1 // allow 1 jump for snap-back initiation

    // for opposite direction, ratio should be < 0.67 (initial dampening)
    // and decrease as delta increases
    const ratioOk = avgRatio < 0.67

    // verify dampening increases with distance
    const earlyFrames = validFrames.slice(0, 5)
    const lateFrames = validFrames.slice(-5)
    const earlyAvgRatio =
      earlyFrames.length > 0
        ? earlyFrames.reduce((sum, f) => sum + Math.abs(f.ratio), 0) / earlyFrames.length
        : 0
    const lateAvgRatio =
      lateFrames.length > 0
        ? lateFrames.reduce((sum, f) => sum + Math.abs(f.ratio), 0) / lateFrames.length
        : 0
    const dampeningIncreases = lateAvgRatio < earlyAvgRatio

    const analysis: SwipeAnalysis = {
      name: 'Swipe Left (Opposite Direction)',
      direction: 'opposite',
      frames,
      averageRatio: avgRatio,
      maxDelta,
      dismissed: !stillExists,
      smooth,
      jumpCount,
      status:
        ratioOk && smooth && stillExists && dampeningIncreases
          ? 'PASS'
          : ratioOk && stillExists
            ? 'WARN'
            : 'FAIL',
      details: [
        `Average movement ratio: ${avgRatio.toFixed(3)} (expected < 0.67 for dampened)`,
        `Early frames avg ratio: ${earlyAvgRatio.toFixed(3)}`,
        `Late frames avg ratio: ${lateAvgRatio.toFixed(3)}`,
        `Dampening increases with distance: ${dampeningIncreases ? 'YES' : 'NO'}`,
        `Toast snapped back: ${stillExists ? 'YES' : 'NO'}`,
        `Smooth animation: ${smooth ? 'YES' : 'NO (jumps: ' + jumpCount + ')'}`,
        ratioOk ? 'Dampening verified' : 'ISSUE: Movement not dampened as expected',
        dampeningIncreases
          ? 'Progressive dampening verified'
          : 'ISSUE: Dampening should increase with distance',
      ],
    }
    reportSections.push(analysis)

    fs.writeFileSync(
      path.join(VIDEO_DIR, 'opposite-frames.json'),
      JSON.stringify(frames, null, 2)
    )

    expect(ratioOk, 'Movement should be dampened in opposite direction').toBe(true)
    expect(stillExists, 'Toast should snap back, not dismiss').toBe(true)
    expect(smooth, 'Animation should be smooth').toBe(true)
  })

  test('3. Velocity-based dismiss - quick flick should dismiss', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(400)

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'velocity-01-before.png') })

    const frames: FrameData[] = []
    const startTime = Date.now()
    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    const initialTransformX = (await getToastTransformX(page)) ?? 0

    // quick flick - small distance but fast
    // threshold is 45px, velocity threshold is 0.11 px/ms
    // we do 30px in ~50ms = 0.6 px/ms velocity (well above threshold)
    const flickDistance = 30
    const flickSteps = 3

    for (let i = 0; i < flickSteps; i++) {
      const currentX = startX + ((i + 1) / flickSteps) * flickDistance
      await page.mouse.move(currentX, startY, { steps: 1 })

      const transformX = (await getToastTransformX(page)) ?? 0
      const rawDelta = currentX - startX
      const actualOffset = transformX - initialTransformX

      frames.push({
        timestamp: Date.now() - startTime,
        fingerX: currentX,
        toastTranslateX: transformX,
        rawDelta,
        expectedOffset: rawDelta,
        actualOffset,
        ratio: rawDelta !== 0 ? actualOffset / rawDelta : 1,
      })

      await page.waitForTimeout(15) // very fast movement
    }

    await page.mouse.up()
    await page.screenshot({ path: path.join(VIDEO_DIR, 'velocity-02-after-flick.png') })

    // should dismiss despite small distance
    await page.waitForTimeout(800)
    const dismissed = await waitForToastCount(page, 0, 2000)

    await page.screenshot({ path: path.join(VIDEO_DIR, 'velocity-03-final.png') })

    const totalTime = frames.length > 0 ? frames[frames.length - 1].timestamp : 0
    const velocity = totalTime > 0 ? flickDistance / totalTime : 0

    const analysis: SwipeAnalysis = {
      name: 'Velocity-based Dismiss (Quick Flick)',
      direction: 'dismiss',
      frames,
      averageRatio: 1.0, // not relevant for this test
      maxDelta: flickDistance,
      dismissed,
      smooth: true,
      jumpCount: 0,
      status: dismissed ? 'PASS' : 'FAIL',
      details: [
        `Flick distance: ${flickDistance}px (below 45px threshold)`,
        `Flick time: ${totalTime}ms`,
        `Velocity: ${velocity.toFixed(3)} px/ms (threshold: 0.11)`,
        `Toast dismissed: ${dismissed ? 'YES' : 'NO'}`,
        dismissed
          ? 'Velocity-based dismiss working'
          : 'ISSUE: Quick flick should dismiss even with small distance',
      ],
    }
    reportSections.push(analysis)

    expect(dismissed, 'Quick flick should dismiss toast via velocity').toBe(true)
  })

  test('4. Slow drag below threshold - should snap back', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(400)

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    await page.screenshot({ path: path.join(VIDEO_DIR, 'snapback-01-before.png') })

    const frames: FrameData[] = []
    const startTime = Date.now()
    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    const initialTransformX = (await getToastTransformX(page)) ?? 0

    // slow drag - distance < threshold and low velocity
    const dragDistance = 30 // below 45px threshold
    const steps = 20 // many steps = slow

    for (let i = 0; i < steps; i++) {
      const currentX = startX + ((i + 1) / steps) * dragDistance
      await page.mouse.move(currentX, startY, { steps: 1 })

      const transformX = (await getToastTransformX(page)) ?? 0
      const rawDelta = currentX - startX
      const actualOffset = transformX - initialTransformX

      frames.push({
        timestamp: Date.now() - startTime,
        fingerX: currentX,
        toastTranslateX: transformX,
        rawDelta,
        expectedOffset: rawDelta,
        actualOffset,
        ratio: rawDelta !== 0 ? actualOffset / rawDelta : 1,
      })

      await page.waitForTimeout(50) // slow movement
    }

    await page.mouse.up()
    await page.screenshot({ path: path.join(VIDEO_DIR, 'snapback-02-released.png') })

    // should snap back
    await page.waitForTimeout(500)

    // check if toast snapped back to original position
    const finalTransformX = (await getToastTransformX(page)) ?? 0
    const snappedBack = Math.abs(finalTransformX - initialTransformX) < 5
    const stillExists = (await page.$$('[role="status"]')).length > 0

    await page.screenshot({ path: path.join(VIDEO_DIR, 'snapback-03-final.png') })

    const totalTime = frames.length > 0 ? frames[frames.length - 1].timestamp : 0
    const velocity = totalTime > 0 ? dragDistance / totalTime : 0

    const analysis: SwipeAnalysis = {
      name: 'Slow Drag Below Threshold (Snap Back)',
      direction: 'dismiss',
      frames,
      averageRatio: 1.0,
      maxDelta: dragDistance,
      dismissed: !stillExists,
      smooth: true,
      jumpCount: 0,
      status: snappedBack && stillExists ? 'PASS' : 'FAIL',
      details: [
        `Drag distance: ${dragDistance}px (below 45px threshold)`,
        `Drag time: ${totalTime}ms`,
        `Velocity: ${velocity.toFixed(3)} px/ms (below 0.11 threshold)`,
        `Toast snapped back: ${snappedBack ? 'YES' : 'NO'}`,
        `Toast still exists: ${stillExists ? 'YES' : 'NO'}`,
        snappedBack && stillExists
          ? 'Correct: slow drag below threshold snaps back'
          : 'ISSUE: Should snap back when below both thresholds',
      ],
    }
    reportSections.push(analysis)

    expect(stillExists, 'Toast should still exist').toBe(true)
    expect(snappedBack, 'Toast should snap back to original position').toBe(true)
  })

  test('5. Frame-by-frame smoothness analysis', async () => {
    // dismiss any existing
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(400)

    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box, 'Toast bounding box').toBeTruthy()

    // high-frequency frame capture during swipe
    const frames: FrameData[] = []
    const startTime = Date.now()
    const startX = box!.x + box!.width / 2
    const startY = box!.y + box!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    const initialTransformX = (await getToastTransformX(page)) ?? 0

    // capture many frames for smoothness analysis
    const totalDistance = 100
    const steps = 50 // more frames for better analysis

    for (let i = 0; i < steps; i++) {
      const currentX = startX + ((i + 1) / steps) * totalDistance
      await page.mouse.move(currentX, startY, { steps: 1 })

      const transformX = (await getToastTransformX(page)) ?? 0
      const rawDelta = currentX - startX
      const actualOffset = transformX - initialTransformX

      frames.push({
        timestamp: Date.now() - startTime,
        fingerX: currentX,
        toastTranslateX: transformX,
        rawDelta,
        expectedOffset: rawDelta,
        actualOffset,
        ratio: rawDelta !== 0 ? actualOffset / rawDelta : 1,
      })

      await page.waitForTimeout(10) // high frequency
    }

    await page.mouse.up()

    // analyze smoothness
    const deltas: number[] = []
    for (let i = 1; i < frames.length; i++) {
      const frameDelta = Math.abs(frames[i].actualOffset - frames[i - 1].actualOffset)
      deltas.push(frameDelta)
    }

    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length
    const maxDelta = Math.max(...deltas)
    const minDelta = Math.min(...deltas)
    const stdDev = Math.sqrt(
      deltas.reduce((sum, d) => sum + (d - avgDelta) ** 2, 0) / deltas.length
    )

    // count large jumps (>3x average)
    const largeJumps = deltas.filter((d) => d > avgDelta * 3).length

    // smoothness score: lower std dev and fewer jumps = smoother
    const smooth = largeJumps <= 2 && stdDev < avgDelta * 2

    const analysis: SwipeAnalysis = {
      name: 'Frame-by-Frame Smoothness Analysis',
      direction: 'dismiss',
      frames,
      averageRatio: 1.0,
      maxDelta: totalDistance,
      dismissed: false,
      smooth,
      jumpCount: largeJumps,
      status: smooth ? 'PASS' : 'WARN',
      details: [
        `Total frames captured: ${frames.length}`,
        `Average frame delta: ${avgDelta.toFixed(2)}px`,
        `Max frame delta: ${maxDelta.toFixed(2)}px`,
        `Min frame delta: ${minDelta.toFixed(2)}px`,
        `Std deviation: ${stdDev.toFixed(2)}px`,
        `Large jumps (>3x avg): ${largeJumps}`,
        smooth
          ? 'Animation is smooth'
          : `WARN: Animation may have ${largeJumps} noticeable jumps`,
      ],
    }
    reportSections.push(analysis)

    fs.writeFileSync(
      path.join(VIDEO_DIR, 'smoothness-frames.json'),
      JSON.stringify({ frames, deltas }, null, 2)
    )

    // warn but don't fail on smoothness issues
    expect(largeJumps, 'Should have minimal large jumps').toBeLessThanOrEqual(5)
  })

  test('6. Generate final report and summary', async () => {
    // print summary to console
    console.log('\n' + '='.repeat(70))
    console.log('TOAST GESTURE DAMPENING TEST RESULTS')
    console.log('='.repeat(70))

    const passCount = reportSections.filter((s) => s.status === 'PASS').length
    const failCount = reportSections.filter((s) => s.status === 'FAIL').length
    const warnCount = reportSections.filter((s) => s.status === 'WARN').length

    console.log(`PASS: ${passCount}  |  WARN: ${warnCount}  |  FAIL: ${failCount}`)
    console.log('-'.repeat(70))

    for (const s of reportSections) {
      const icon =
        s.status === 'PASS' ? '[PASS]' : s.status === 'FAIL' ? '[FAIL]' : '[WARN]'
      console.log(`${icon} ${s.name}`)
      console.log(`      Direction: ${s.direction}, Avg Ratio: ${s.averageRatio.toFixed(3)}, Dismissed: ${s.dismissed}`)
    }

    console.log('-'.repeat(70))
    console.log(`Video: ${VIDEO_DIR}`)
    console.log(`Report: ${REPORT_PATH}`)
    console.log('='.repeat(70))

    // overall pass if no failures
    expect(failCount, 'Should have no failures').toBe(0)
  })
})
