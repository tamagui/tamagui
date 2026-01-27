import { expect, test, type Page } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * COMPREHENSIVE TOAST ANIMATION ANALYSIS TEST
 *
 * This test records video and extracts frames to analyze:
 * 1. Toast enter animation (fade in + slide)
 * 2. Toast exit animation (when dismissed)
 * 3. Toast stacking animation (when multiple toasts)
 * 4. Hover expand animation
 * 5. Swipe dismiss animation
 *
 * Results are saved to /tmp/ for analysis.
 */

const OUTPUT_DIR = '/tmp/toast-animation-analysis'
const FRAME_CAPTURE_INTERVAL = 50 // ms between frame captures

interface AnimationAnalysis {
  name: string
  animates: boolean
  frameCount: number
  startOpacity: number
  endOpacity: number
  intermediateFrames: number
  startTransform: string
  endTransform: string
  issues: string[]
  frames: FrameData[]
}

interface FrameData {
  timestamp: number
  opacity: number
  transform: string
  y: number
  scale: number
  screenshot?: string
}

async function captureFrameData(page: Page, selector: string): Promise<FrameData | null> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement
    if (!el) return null

    const style = getComputedStyle(el)
    const transform = style.transform
    const opacity = Number.parseFloat(style.opacity)

    // parse transform matrix for y and scale
    let y = 0
    let scale = 1
    if (transform && transform !== 'none') {
      // matrix(a, b, c, d, tx, ty) or matrix3d(...)
      const match = transform.match(/matrix\(([^)]+)\)/)
      if (match) {
        const values = match[1].split(',').map(Number)
        if (values.length >= 6) {
          scale = values[0] // a = scaleX
          y = values[5] // ty = translateY
        }
      }
      // also check for translate3d
      const translate3d = transform.match(/translate3d\([^,]+,\s*([^,]+),/)
      if (translate3d) {
        y = Number.parseFloat(translate3d[1])
      }
    }

    return {
      timestamp: Date.now(),
      opacity,
      transform,
      y,
      scale,
    }
  }, selector)
}

async function captureFrames(
  page: Page,
  selector: string,
  durationMs: number,
  screenshotDir: string,
  prefix: string
): Promise<FrameData[]> {
  const frames: FrameData[] = []
  const startTime = Date.now()
  let frameIndex = 0

  while (Date.now() - startTime < durationMs) {
    const frameData = await captureFrameData(page, selector)
    if (frameData) {
      // take screenshot every 100ms
      if (frameIndex % 2 === 0) {
        const screenshotPath = path.join(screenshotDir, `${prefix}-frame-${frameIndex.toString().padStart(3, '0')}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: false })
        frameData.screenshot = screenshotPath
      }
      frames.push(frameData)
    }
    frameIndex++
    await page.waitForTimeout(FRAME_CAPTURE_INTERVAL)
  }

  return frames
}

function analyzeFrames(frames: FrameData[], name: string): AnimationAnalysis {
  if (frames.length === 0) {
    return {
      name,
      animates: false,
      frameCount: 0,
      startOpacity: -1,
      endOpacity: -1,
      intermediateFrames: 0,
      startTransform: '',
      endTransform: '',
      issues: ['No frames captured - element not found'],
      frames: [],
    }
  }

  const startOpacity = frames[0].opacity
  const endOpacity = frames[frames.length - 1].opacity
  const startTransform = frames[0].transform
  const endTransform = frames[frames.length - 1].transform

  // count intermediate frames (not at start or end state)
  const tolerance = 0.05
  const intermediateFrames = frames.filter((f) => {
    const notAtStart = Math.abs(f.opacity - startOpacity) > tolerance
    const notAtEnd = Math.abs(f.opacity - endOpacity) > tolerance
    return notAtStart && notAtEnd
  }).length

  // check if there's actual animation (more than just 2 states)
  const uniqueOpacities = new Set(frames.map((f) => f.opacity.toFixed(2)))
  const uniqueYValues = new Set(frames.map((f) => f.y.toFixed(1)))
  const uniqueScales = new Set(frames.map((f) => f.scale.toFixed(3)))

  const animates =
    uniqueOpacities.size > 2 || uniqueYValues.size > 2 || uniqueScales.size > 2

  const issues: string[] = []

  // detect issues
  if (!animates) {
    issues.push('NO ANIMATION: Values snap between states instead of transitioning')
  }

  if (intermediateFrames < 3 && frames.length > 5) {
    issues.push(`LOW FRAME COUNT: Only ${intermediateFrames} intermediate frames detected`)
  }

  // check for jank (sudden jumps)
  for (let i = 1; i < frames.length; i++) {
    const opacityDelta = Math.abs(frames[i].opacity - frames[i - 1].opacity)
    if (opacityDelta > 0.3) {
      issues.push(`JANK at frame ${i}: Opacity jumped by ${opacityDelta.toFixed(2)}`)
    }
  }

  return {
    name,
    animates,
    frameCount: frames.length,
    startOpacity,
    endOpacity,
    intermediateFrames,
    startTransform,
    endTransform,
    issues,
    frames,
  }
}

test.describe('Toast Animation Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    await page.goto('http://localhost:9000/?test=ToastMultipleCase&animationDriver=css')
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
    // wait for initial render
    await page.waitForTimeout(500)
  })

  test('ANALYSIS: toast enter animation', async ({ page }) => {
    const screenshotDir = path.join(OUTPUT_DIR, 'enter')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    // take before screenshot
    await page.screenshot({ path: path.join(screenshotDir, '00-before-click.png') })

    // click to show toast
    const clickPromise = page.click('[data-testid="toast-default"]')

    // start capturing frames immediately after click
    const frames: FrameData[] = []
    const startTime = Date.now()
    let frameIndex = 0

    // capture for 1000ms to catch the enter animation
    while (Date.now() - startTime < 1000) {
      const frameData = await captureFrameData(page, '[data-type="default"]')
      if (frameData) {
        if (frameIndex % 2 === 0) {
          const screenshotPath = path.join(screenshotDir, `enter-frame-${frameIndex.toString().padStart(3, '0')}.png`)
          await page.screenshot({ path: screenshotPath })
          frameData.screenshot = screenshotPath
        }
        frames.push(frameData)
      }
      frameIndex++
      await page.waitForTimeout(FRAME_CAPTURE_INTERVAL)
    }

    await clickPromise

    // take after screenshot
    await page.screenshot({ path: path.join(screenshotDir, '99-after-animation.png') })

    const analysis = analyzeFrames(frames, 'Enter Animation')

    // write analysis to file
    fs.writeFileSync(
      path.join(screenshotDir, 'analysis.json'),
      JSON.stringify(analysis, null, 2)
    )

    console.log('\n=== ENTER ANIMATION ANALYSIS ===')
    console.log(`Animates: ${analysis.animates ? 'YES' : 'NO'}`)
    console.log(`Frame count: ${analysis.frameCount}`)
    console.log(`Intermediate frames: ${analysis.intermediateFrames}`)
    console.log(`Start opacity: ${analysis.startOpacity}`)
    console.log(`End opacity: ${analysis.endOpacity}`)
    console.log(`Issues: ${analysis.issues.length > 0 ? analysis.issues.join(', ') : 'None'}`)
    console.log(`Screenshots saved to: ${screenshotDir}`)

    // test assertion - should have animation
    expect(analysis.frameCount, 'Should capture frames').toBeGreaterThan(0)
  })

  test('ANALYSIS: toast exit animation (close button)', async ({ page }) => {
    const screenshotDir = path.join(OUTPUT_DIR, 'exit-close')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    // first add a toast
    await page.click('[data-testid="toast-success"]')
    await page.waitForSelector('[data-type="success"]', { timeout: 5000 })
    await page.waitForTimeout(300) // wait for enter animation

    // take before screenshot
    await page.screenshot({ path: path.join(screenshotDir, '00-before-close.png') })

    // get toast data before closing
    const beforeData = await captureFrameData(page, '[data-type="success"]')
    console.log('Before close:', beforeData)

    // click close button
    const closeButton = await page.$('[aria-label="Close toast"]')
    expect(closeButton).toBeTruthy()

    const clickPromise = closeButton!.click()

    // capture frames during exit
    const frames: FrameData[] = []
    const startTime = Date.now()
    let frameIndex = 0

    while (Date.now() - startTime < 800) {
      const frameData = await captureFrameData(page, '[data-type="success"]')
      if (frameData) {
        if (frameIndex % 2 === 0) {
          const screenshotPath = path.join(screenshotDir, `exit-frame-${frameIndex.toString().padStart(3, '0')}.png`)
          await page.screenshot({ path: screenshotPath })
          frameData.screenshot = screenshotPath
        }
        frames.push(frameData)
      } else {
        // element gone
        break
      }
      frameIndex++
      await page.waitForTimeout(FRAME_CAPTURE_INTERVAL)
    }

    await clickPromise

    await page.screenshot({ path: path.join(screenshotDir, '99-after-close.png') })

    const analysis = analyzeFrames(frames, 'Exit Animation (Close Button)')

    fs.writeFileSync(
      path.join(screenshotDir, 'analysis.json'),
      JSON.stringify(analysis, null, 2)
    )

    console.log('\n=== EXIT ANIMATION (CLOSE) ANALYSIS ===')
    console.log(`Animates: ${analysis.animates ? 'YES' : 'NO'}`)
    console.log(`Frame count: ${analysis.frameCount}`)
    console.log(`Intermediate frames: ${analysis.intermediateFrames}`)
    console.log(`Start opacity: ${analysis.startOpacity}`)
    console.log(`End opacity: ${analysis.endOpacity}`)
    console.log(`Issues: ${analysis.issues.length > 0 ? analysis.issues.join(', ') : 'None'}`)
    console.log(`Screenshots saved to: ${screenshotDir}`)
  })

  test('ANALYSIS: multiple toasts stacking', async ({ page }) => {
    const screenshotDir = path.join(OUTPUT_DIR, 'stacking')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    // take before screenshot
    await page.screenshot({ path: path.join(screenshotDir, '00-before-multiple.png') })

    // click multiple toasts button
    await page.click('[data-testid="toast-multiple"]')

    // capture frames as toasts appear (staggered 200ms each)
    const frames: { timestamp: number; toastCount: number; screenshot: string }[] = []
    const startTime = Date.now()

    for (let i = 0; i < 20; i++) {
      const toasts = await page.$$('[data-type]')
      const screenshotPath = path.join(screenshotDir, `stack-frame-${i.toString().padStart(3, '0')}.png`)
      await page.screenshot({ path: screenshotPath })

      frames.push({
        timestamp: Date.now() - startTime,
        toastCount: toasts.length,
        screenshot: screenshotPath,
      })

      await page.waitForTimeout(100)
    }

    // capture toast positions and transforms
    const toastData = await page.$$eval('[data-type]', (els) =>
      els.map((el, i) => {
        const style = getComputedStyle(el)
        return {
          index: i,
          dataIndex: el.getAttribute('data-index'),
          dataFront: el.getAttribute('data-front'),
          dataExpanded: el.getAttribute('data-expanded'),
          opacity: style.opacity,
          transform: style.transform,
          zIndex: style.zIndex,
        }
      })
    )

    console.log('\n=== STACKING ANALYSIS ===')
    console.log('Toast count progression:', frames.map((f) => f.toastCount).join(' -> '))
    console.log('Final toast states:')
    toastData.forEach((t) => {
      console.log(`  Toast ${t.dataIndex}: front=${t.dataFront}, expanded=${t.dataExpanded}, opacity=${t.opacity}, zIndex=${t.zIndex}`)
    })

    // take final screenshot
    await page.screenshot({ path: path.join(screenshotDir, '99-final-stack.png') })

    fs.writeFileSync(
      path.join(screenshotDir, 'analysis.json'),
      JSON.stringify({ frames, toastData }, null, 2)
    )

    expect(toastData.length).toBeGreaterThanOrEqual(4)
  })

  test('ANALYSIS: hover expand animation', async ({ page }) => {
    const screenshotDir = path.join(OUTPUT_DIR, 'hover-expand')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    // add multiple toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000) // wait for all toasts

    // take before screenshot (collapsed state)
    await page.screenshot({ path: path.join(screenshotDir, '00-collapsed.png') })

    // get collapsed state
    const collapsedState = await page.$$eval('[data-type]', (els) =>
      els.map((el) => {
        const style = getComputedStyle(el)
        return {
          index: el.getAttribute('data-index'),
          expanded: el.getAttribute('data-expanded'),
          transform: style.transform,
          opacity: style.opacity,
        }
      })
    )
    console.log('Collapsed state:', collapsedState)

    // hover over the toaster
    const toaster = await page.$('[data-y-position="bottom"]')
    expect(toaster).toBeTruthy()

    // capture frames during hover expansion
    const frames: { timestamp: number; screenshot: string; states: any[] }[] = []
    const startTime = Date.now()

    // start hover
    await toaster!.hover()

    for (let i = 0; i < 15; i++) {
      const states = await page.$$eval('[data-type]', (els) =>
        els.map((el) => {
          const style = getComputedStyle(el)
          return {
            index: el.getAttribute('data-index'),
            expanded: el.getAttribute('data-expanded'),
            transform: style.transform,
            opacity: style.opacity,
          }
        })
      )

      const screenshotPath = path.join(screenshotDir, `expand-frame-${i.toString().padStart(3, '0')}.png`)
      await page.screenshot({ path: screenshotPath })

      frames.push({
        timestamp: Date.now() - startTime,
        screenshot: screenshotPath,
        states,
      })

      await page.waitForTimeout(50)
    }

    // take expanded screenshot
    await page.screenshot({ path: path.join(screenshotDir, '99-expanded.png') })

    // get expanded state
    const expandedState = await page.$$eval('[data-type]', (els) =>
      els.map((el) => {
        const style = getComputedStyle(el)
        return {
          index: el.getAttribute('data-index'),
          expanded: el.getAttribute('data-expanded'),
          transform: style.transform,
          opacity: style.opacity,
        }
      })
    )

    console.log('\n=== HOVER EXPAND ANALYSIS ===')
    console.log('Collapsed transforms:', collapsedState.map((t) => t.transform).join(', '))
    console.log('Expanded transforms:', expandedState.map((t) => t.transform).join(', '))

    // check if transforms actually changed (animation happened)
    const transformsChanged = collapsedState.some((c, i) => {
      const e = expandedState[i]
      return e && c.transform !== e.transform
    })
    console.log(`Transforms changed: ${transformsChanged ? 'YES' : 'NO'}`)

    // check if data-expanded changed
    const expandedChanged = expandedState.every((t) => t.expanded === 'true')
    console.log(`All expanded: ${expandedChanged ? 'YES' : 'NO'}`)

    fs.writeFileSync(
      path.join(screenshotDir, 'analysis.json'),
      JSON.stringify({ collapsedState, expandedState, frames }, null, 2)
    )
  })

  test('ANALYSIS: swipe dismiss animation', async ({ page }) => {
    const screenshotDir = path.join(OUTPUT_DIR, 'swipe-dismiss')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    // add a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })
    await page.waitForTimeout(500) // wait for enter animation

    // get toast bounding box
    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box).toBeTruthy()

    // take before screenshot
    await page.screenshot({ path: path.join(screenshotDir, '00-before-swipe.png') })

    // capture frames during swipe
    const frames: { timestamp: number; screenshot: string; frameData: FrameData | null }[] = []
    const startTime = Date.now()

    // start swipe
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()

    // swipe right in steps, capturing frames
    const steps = 20
    const totalDistance = box!.width + 100
    const stepDistance = totalDistance / steps

    for (let i = 0; i < steps; i++) {
      const currentX = box!.x + box!.width / 2 + stepDistance * (i + 1)
      await page.mouse.move(currentX, box!.y + box!.height / 2, { steps: 1 })

      const frameData = await captureFrameData(page, '[data-type="default"]')
      const screenshotPath = path.join(screenshotDir, `swipe-frame-${i.toString().padStart(3, '0')}.png`)
      await page.screenshot({ path: screenshotPath })

      frames.push({
        timestamp: Date.now() - startTime,
        screenshot: screenshotPath,
        frameData,
      })

      await page.waitForTimeout(30)
    }

    await page.mouse.up()

    // capture exit animation after swipe
    for (let i = 0; i < 10; i++) {
      const frameData = await captureFrameData(page, '[data-type="default"]')
      const screenshotPath = path.join(screenshotDir, `exit-frame-${i.toString().padStart(3, '0')}.png`)
      await page.screenshot({ path: screenshotPath })

      frames.push({
        timestamp: Date.now() - startTime,
        screenshot: screenshotPath,
        frameData,
      })

      if (!frameData) break // element gone

      await page.waitForTimeout(50)
    }

    await page.screenshot({ path: path.join(screenshotDir, '99-after-swipe.png') })

    console.log('\n=== SWIPE DISMISS ANALYSIS ===')
    console.log(`Total frames captured: ${frames.length}`)

    const validFrames = frames.filter((f) => f.frameData !== null)
    if (validFrames.length > 0) {
      console.log(`Drag transforms:`)
      validFrames.slice(0, 5).forEach((f, i) => {
        console.log(`  Frame ${i}: transform=${f.frameData?.transform}, opacity=${f.frameData?.opacity}`)
      })
    }

    // verify toast is gone
    const toastsAfter = await page.$$('[data-type="default"]')
    console.log(`Toast removed: ${toastsAfter.length === 0 ? 'YES' : 'NO'}`)

    fs.writeFileSync(
      path.join(screenshotDir, 'analysis.json'),
      JSON.stringify({ frames }, null, 2)
    )

    expect(toastsAfter.length).toBe(0)
  })

  test('ANALYSIS: comprehensive summary', async ({ page }) => {
    // run all animation checks and produce a summary report
    const report: { animation: string; status: string; details: string }[] = []

    // 1. enter animation check
    await page.click('[data-testid="toast-default"]')
    await page.waitForTimeout(50)

    const enterFrames: number[] = []
    for (let i = 0; i < 15; i++) {
      const data = await captureFrameData(page, '[data-type="default"]')
      if (data) enterFrames.push(data.opacity)
      await page.waitForTimeout(50)
    }

    const enterUnique = new Set(enterFrames.map((o) => o.toFixed(2)))
    const enterAnimates = enterUnique.size > 2
    report.push({
      animation: 'Enter Animation',
      status: enterAnimates ? 'ANIMATES' : 'NO ANIMATION',
      details: `${enterFrames.length} frames, ${enterUnique.size} unique opacity values: [${[...enterUnique].join(', ')}]`,
    })

    // dismiss and check exit
    await page.click('[data-testid="toast-dismiss-all"]')
    await page.waitForTimeout(500)

    // 2. multiple toasts stacking
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    const stackedToasts = await page.$$eval('[data-type]', (els) =>
      els.map((el) => ({
        index: el.getAttribute('data-index'),
        transform: getComputedStyle(el).transform,
        scale: el.getAttribute('data-front') === 'true' ? 1 : undefined,
      }))
    )

    const hasStacking = stackedToasts.length >= 4
    const hasScaleVariation = stackedToasts.some((t) => t.transform && t.transform !== 'none')
    report.push({
      animation: 'Toast Stacking',
      status: hasStacking ? (hasScaleVariation ? 'WORKING' : 'NO SCALE') : 'NO STACKING',
      details: `${stackedToasts.length} toasts, transforms: ${stackedToasts.map((t) => t.transform).join(' | ')}`,
    })

    // 3. hover expand
    const toaster = await page.$('[data-y-position="bottom"]')
    if (toaster) {
      const beforeExpand = await page.$$eval('[data-type]', (els) =>
        els.map((el) => el.getAttribute('data-expanded'))
      )

      await toaster.hover()
      await page.waitForTimeout(300)

      const afterExpand = await page.$$eval('[data-type]', (els) =>
        els.map((el) => el.getAttribute('data-expanded'))
      )

      const expandChanged = beforeExpand.some((b, i) => b !== afterExpand[i])
      report.push({
        animation: 'Hover Expand',
        status: expandChanged ? 'WORKING' : 'NO CHANGE',
        details: `Before: [${beforeExpand.join(', ')}], After: [${afterExpand.join(', ')}]`,
      })
    }

    // 4. exit animation via dismiss all
    await page.mouse.move(0, 0) // move mouse away
    await page.waitForTimeout(100)

    const exitFrames: number[] = []
    const dismissPromise = page.click('[data-testid="toast-dismiss-all"]')

    for (let i = 0; i < 15; i++) {
      const els = await page.$$('[data-type]')
      if (els.length === 0) break

      const data = await captureFrameData(page, '[data-type]')
      if (data) exitFrames.push(data.opacity)
      await page.waitForTimeout(50)
    }

    await dismissPromise

    const exitUnique = new Set(exitFrames.map((o) => o.toFixed(2)))
    const exitAnimates = exitUnique.size > 2
    report.push({
      animation: 'Exit Animation',
      status: exitAnimates ? 'ANIMATES' : 'NO ANIMATION',
      details: `${exitFrames.length} frames, ${exitUnique.size} unique opacity values: [${[...exitUnique].join(', ')}]`,
    })

    // print summary
    console.log('\n' + '='.repeat(60))
    console.log('TOAST ANIMATION ANALYSIS SUMMARY')
    console.log('='.repeat(60))
    report.forEach((r) => {
      const icon = r.status.includes('ANIMATES') || r.status.includes('WORKING') ? '[OK]' : '[!!]'
      console.log(`${icon} ${r.animation}: ${r.status}`)
      console.log(`    ${r.details}`)
    })
    console.log('='.repeat(60))
    console.log(`\nScreenshots and detailed analysis saved to: ${OUTPUT_DIR}`)

    // save report
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'summary-report.json'),
      JSON.stringify(report, null, 2)
    )

    // the test passes but logs the analysis
    // if there are animation issues, they'll be visible in the output
    const failingAnimations = report.filter(
      (r) => r.status.includes('NO ANIMATION') || r.status.includes('NO CHANGE')
    )

    if (failingAnimations.length > 0) {
      console.log('\nWARNING: Some animations may not be working:')
      failingAnimations.forEach((r) => console.log(`  - ${r.animation}: ${r.status}`))
    }
  })
})
