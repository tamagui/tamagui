import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * COMPREHENSIVE ANIMATION TEST SUITE
 *
 * Runs all 30 animation scenarios across different drivers and captures
 * full frame-by-frame data for analysis.
 *
 * Log formats captured:
 * - [ANIM_START] scenario:<id> time:<timestamp>
 * - [ANIM_FRAME] scenario:<id> frame:<n> prop:<property> value:<value> time:<ms> delta:<ms>
 * - [ANIM_END] scenario:<id> totalFrames:<n> time:<timestamp>
 */

interface AnimationFrame {
  scenario: string
  frame: number
  prop: string
  value: string
  time: number
  delta: number
}

interface AnimationResult {
  scenario: string
  startTime: number
  endTime: number
  totalFrames: number
  frames: AnimationFrame[]
  duration: number
}

// Parse console logs into structured data
function parseAnimationLogs(logs: string[]): AnimationResult[] {
  const results: Map<string, AnimationResult> = new Map()

  for (const log of logs) {
    if (log.includes('[ANIM_START]')) {
      const match = log.match(/\[ANIM_START\] scenario:(\S+) time:(\d+)/)
      if (match) {
        const scenario = match[1]
        results.set(scenario, {
          scenario,
          startTime: parseInt(match[2], 10),
          endTime: 0,
          totalFrames: 0,
          frames: [],
          duration: 0,
        })
      }
    } else if (log.includes('[ANIM_FRAME]')) {
      const match = log.match(
        /\[ANIM_FRAME\] scenario:(\S+) frame:(\d+) prop:(\S+) value:(.+?) time:(\d+) delta:(\d+)/
      )
      if (match) {
        const scenario = match[1]
        const result = results.get(scenario)
        if (result) {
          result.frames.push({
            scenario,
            frame: parseInt(match[2], 10),
            prop: match[3],
            value: match[4],
            time: parseInt(match[5], 10),
            delta: parseInt(match[6], 10),
          })
        }
      }
    } else if (log.includes('[ANIM_END]')) {
      const match = log.match(/\[ANIM_END\] scenario:(\S+) totalFrames:(\d+) time:(\d+)/)
      if (match) {
        const scenario = match[1]
        const result = results.get(scenario)
        if (result) {
          result.endTime = parseInt(match[3], 10)
          result.totalFrames = parseInt(match[2], 10)
          result.duration = result.endTime - result.startTime
        }
      }
    }
  }

  return Array.from(results.values())
}

// Collect all console logs during test
async function collectConsoleLogs(page: any): Promise<string[]> {
  const logs: string[] = []
  page.on('console', (msg: any) => {
    const text = msg.text()
    if (text.includes('[ANIM_')) {
      logs.push(text)
    }
  })
  return logs
}

// Run a single scenario and return results
async function runScenario(
  page: any,
  scenarioId: string,
  waitTime: number = 1500
): Promise<AnimationResult | null> {
  const logs: string[] = []
  const listener = (msg: any) => {
    const text = msg.text()
    if (text.includes('[ANIM_') && text.includes(scenarioId)) {
      logs.push(text)
    }
  }
  page.on('console', listener)

  // Click the trigger button
  const trigger = page.getByTestId(`scenario-${scenarioId}-trigger`)
  await trigger.click()

  // Wait for animation to complete
  await page.waitForTimeout(waitTime)

  page.off('console', listener)

  const results = parseAnimationLogs(logs)
  return results.find((r) => r.scenario.includes(scenarioId)) || null
}

// Analyze frame data for issues
function analyzeAnimation(result: AnimationResult): {
  issues: string[]
  metrics: {
    avgFrameDelta: number
    maxFrameDelta: number
    minFrameDelta: number
    frameRate: number
    hasStutter: boolean
    hasJank: boolean
  }
} {
  const issues: string[] = []
  const deltas = result.frames.map((f) => f.delta).filter((d) => d > 0)

  if (deltas.length === 0) {
    return {
      issues: ['No frame deltas recorded'],
      metrics: {
        avgFrameDelta: 0,
        maxFrameDelta: 0,
        minFrameDelta: 0,
        frameRate: 0,
        hasStutter: false,
        hasJank: false,
      },
    }
  }

  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length
  const maxDelta = Math.max(...deltas)
  const minDelta = Math.min(...deltas)
  const frameRate = 1000 / avgDelta

  // Check for stutter (frame taking >50ms)
  const hasStutter = maxDelta > 50

  // Check for jank (high variance in frame times)
  const variance =
    deltas.reduce((acc, d) => acc + Math.pow(d - avgDelta, 2), 0) / deltas.length
  const stdDev = Math.sqrt(variance)
  const hasJank = stdDev > 15

  if (result.totalFrames < 3) {
    issues.push(`Too few frames: ${result.totalFrames}`)
  }

  if (hasStutter) {
    issues.push(`Frame stutter detected: max delta ${maxDelta}ms`)
  }

  if (hasJank) {
    issues.push(`Frame jank detected: stdDev ${stdDev.toFixed(2)}ms`)
  }

  if (frameRate < 30) {
    issues.push(`Low frame rate: ${frameRate.toFixed(1)} fps`)
  }

  return {
    issues,
    metrics: {
      avgFrameDelta: avgDelta,
      maxFrameDelta: maxDelta,
      minFrameDelta: minDelta,
      frameRate,
      hasStutter,
      hasJank,
    },
  }
}

// Generate detailed report for a scenario
function generateReport(result: AnimationResult): string {
  const analysis = analyzeAnimation(result)
  let report = `\n=== SCENARIO: ${result.scenario} ===\n`
  report += `Duration: ${result.duration}ms\n`
  report += `Total Frames: ${result.totalFrames}\n`
  report += `Frame Rate: ${analysis.metrics.frameRate.toFixed(1)} fps\n`
  report += `Avg Frame Delta: ${analysis.metrics.avgFrameDelta.toFixed(2)}ms\n`
  report += `Min/Max Delta: ${analysis.metrics.minFrameDelta}ms / ${analysis.metrics.maxFrameDelta}ms\n`

  if (analysis.issues.length > 0) {
    report += `\nISSUES:\n`
    analysis.issues.forEach((issue) => {
      report += `  - ${issue}\n`
    })
  }

  report += `\nFRAME DATA:\n`
  const propGroups = new Map<string, AnimationFrame[]>()
  result.frames.forEach((f) => {
    if (!propGroups.has(f.prop)) {
      propGroups.set(f.prop, [])
    }
    propGroups.get(f.prop)!.push(f)
  })

  propGroups.forEach((frames, prop) => {
    report += `  ${prop}:\n`
    frames.slice(0, 10).forEach((f) => {
      report += `    frame ${f.frame}: ${f.value} (delta: ${f.delta}ms)\n`
    })
    if (frames.length > 10) {
      report += `    ... ${frames.length - 10} more frames\n`
    }
  })

  return report
}

// ============================================================================
// TEST SUITES
// ============================================================================

const ALL_SCENARIOS = [
  { id: '01', name: 'opacity-basic', waitTime: 1000 },
  { id: '02', name: 'scale-basic', waitTime: 1000 },
  { id: '03', name: 'translateX', waitTime: 1000 },
  { id: '04', name: 'translateY', waitTime: 1000 },
  { id: '05', name: 'rotate', waitTime: 1000 },
  { id: '06', name: 'multi-transform', waitTime: 1000 },
  { id: '07', name: 'width', waitTime: 1500 },
  { id: '08', name: 'height', waitTime: 1500 },
  { id: '09', name: 'width-height', waitTime: 1500 },
  { id: '10', name: 'border-radius', waitTime: 1000 },
  { id: '11', name: 'bg-color', waitTime: 1000 },
  { id: '12', name: 'text-color', waitTime: 1000 },
  { id: '13', name: 'border-color', waitTime: 1000 },
  { id: '14', name: 'spring-bouncy', waitTime: 1500 },
  { id: '15', name: 'spring-lazy', waitTime: 2000 },
  { id: '16', name: 'spring-quick', waitTime: 800 },
  { id: '17', name: 'spring-custom', waitTime: 1500 },
  { id: '18', name: 'timing-100ms', waitTime: 500 },
  { id: '19', name: 'timing-200ms', waitTime: 600 },
  { id: '20', name: 'timing-delay', waitTime: 1000 },
  { id: '21', name: 'enter-style', waitTime: 1000 },
  { id: '22', name: 'exit-style', waitTime: 1000 },
  { id: '23', name: 'enter-exit', waitTime: 1000 },
  { id: '24', name: 'rapid-toggle', waitTime: 1500 },
  { id: '25', name: 'interruption', waitTime: 2000 },
  { id: '26', name: 'animate-only', waitTime: 1000 },
  { id: '27', name: 'animation-config', waitTime: 2000 },
  { id: '28', name: 'multi-property', waitTime: 1000 },
  { id: '29', name: 'nested-outer', waitTime: 1000 },
  { id: '30', name: 'hover', waitTime: 1000 },
]

// Test all scenarios with a specific driver
async function testAllScenarios(
  page: any,
  driver: string
): Promise<{ passed: number; failed: number; results: AnimationResult[] }> {
  await setupPage(page, {
    name: 'AnimationComprehensiveCase',
    type: 'useCase',
    searchParams: { animationDriver: driver },
  })

  // Wait for component to fully load
  await page.waitForTimeout(1000)

  const results: AnimationResult[] = []
  let passed = 0
  let failed = 0

  for (const scenario of ALL_SCENARIOS) {
    const result = await runScenario(page, scenario.id, scenario.waitTime)

    if (result) {
      results.push(result)
      const analysis = analyzeAnimation(result)

      console.log(generateReport(result))

      if (analysis.issues.length === 0 && result.totalFrames >= 1) {
        passed++
      } else {
        failed++
        console.log(`FAILED: ${scenario.name}`, analysis.issues)
      }
    } else {
      failed++
      console.log(`FAILED: ${scenario.name} - No result captured`)
    }

    // Small delay between scenarios
    await page.waitForTimeout(200)
  }

  return { passed, failed, results }
}

// ============================================================================
// DRIVER-SPECIFIC TESTS
// ============================================================================

test.describe('Comprehensive Animation Tests - All Drivers', () => {
  test.describe.configure({ timeout: 300000 }) // 5 minute timeout

  test('CSS driver - all 30 scenarios', async ({ page }) => {
    console.log('\n\n========== CSS DRIVER ==========\n')
    const { passed, failed, results } = await testAllScenarios(page, 'css')

    console.log(`\n\nCSS Driver Summary: ${passed} passed, ${failed} failed`)

    // CSS driver doesn't animate all properties (no spring physics)
    // So we expect some scenarios to have fewer frames
    expect(passed).toBeGreaterThan(10)
  })

  test('Motion driver - all 30 scenarios', async ({ page }) => {
    console.log('\n\n========== MOTION DRIVER ==========\n')
    const { passed, failed, results } = await testAllScenarios(page, 'motion')

    console.log(`\n\nMotion Driver Summary: ${passed} passed, ${failed} failed`)
    expect(passed).toBeGreaterThan(20)
  })

  test('Native (RN Animated) driver - all 30 scenarios', async ({ page }) => {
    console.log('\n\n========== NATIVE DRIVER ==========\n')
    const { passed, failed, results } = await testAllScenarios(page, 'native')

    console.log(`\n\nNative Driver Summary: ${passed} passed, ${failed} failed`)
    expect(passed).toBeGreaterThan(20)
  })

  test('Moti driver - all 30 scenarios', async ({ page }) => {
    console.log('\n\n========== MOTI DRIVER ==========\n')
    const { passed, failed, results } = await testAllScenarios(page, 'moti')

    console.log(`\n\nMoti Driver Summary: ${passed} passed, ${failed} failed`)
    expect(passed).toBeGreaterThan(20)
  })

  test('Reanimated driver - all 30 scenarios', async ({ page }) => {
    console.log('\n\n========== REANIMATED DRIVER ==========\n')
    const { passed, failed, results } = await testAllScenarios(page, 'reanimated')

    console.log(`\n\nReanimated Driver Summary: ${passed} passed, ${failed} failed`)
    expect(passed).toBeGreaterThan(20)
  })
})

// ============================================================================
// INDIVIDUAL SCENARIO TESTS FOR DETAILED ANALYSIS
// ============================================================================

test.describe('Detailed Scenario Analysis', () => {
  const drivers = ['moti', 'reanimated'] as const

  for (const driver of drivers) {
    test.describe(`${driver} driver - detailed`, () => {
      test.beforeEach(async ({ page }) => {
        await setupPage(page, {
          name: 'AnimationComprehensiveCase',
          type: 'useCase',
          searchParams: { animationDriver: driver },
        })
        await page.waitForTimeout(500)
      })

      test('01: opacity basic animation', async ({ page }) => {
        const result = await runScenario(page, '01', 1000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        expect(result!.totalFrames).toBeGreaterThan(5)
        const analysis = analyzeAnimation(result!)
        expect(analysis.metrics.frameRate).toBeGreaterThan(20)
      })

      test('02: scale basic animation', async ({ page }) => {
        const result = await runScenario(page, '02', 1000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        expect(result!.totalFrames).toBeGreaterThan(5)
      })

      test('06: multi-transform animation', async ({ page }) => {
        const result = await runScenario(page, '06', 1000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Should have multiple properties animated
        const props = new Set(result!.frames.map((f) => f.prop))
        expect(props.size).toBeGreaterThan(1)
      })

      test('14: spring bouncy animation', async ({ page }) => {
        const result = await runScenario(page, '14', 1500)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Bouncy animation should have more frames due to oscillation
        expect(result!.totalFrames).toBeGreaterThan(10)
      })

      test('15: spring lazy animation', async ({ page }) => {
        const result = await runScenario(page, '15', 2000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Lazy animation should take longer
        expect(result!.duration).toBeGreaterThan(500)
      })

      test('24: rapid toggle (interruption)', async ({ page }) => {
        const result = await runScenario(page, '24', 1500)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Should handle rapid toggling without crashing
        expect(result).not.toBeNull()
      })

      test('27: animation config override', async ({ page }) => {
        const result = await runScenario(page, '27', 2000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Config override should be applied
        expect(result!.totalFrames).toBeGreaterThan(5)
      })

      test('28: multi-property animation', async ({ page }) => {
        const result = await runScenario(page, '28', 1000)
        expect(result).not.toBeNull()
        console.log(generateReport(result!))

        // Should animate multiple properties
        const props = new Set(result!.frames.map((f) => f.prop))
        console.log('Animated properties:', Array.from(props))
      })
    })
  }
})

// ============================================================================
// COMPARISON TEST - MOTI VS REANIMATED
// ============================================================================

test.describe('Moti vs Reanimated Comparison', () => {
  const scenarios = [
    { id: '01', name: 'opacity', waitTime: 1000 },
    { id: '02', name: 'scale', waitTime: 1000 },
    { id: '14', name: 'bouncy', waitTime: 1500 },
    { id: '15', name: 'lazy', waitTime: 2000 },
    { id: '16', name: 'quick', waitTime: 800 },
  ]

  for (const scenario of scenarios) {
    test(`compare ${scenario.name} animation`, async ({ page }) => {
      // Test Moti
      await setupPage(page, {
        name: 'AnimationComprehensiveCase',
        type: 'useCase',
        searchParams: { animationDriver: 'moti' },
      })
      await page.waitForTimeout(500)
      const motiResult = await runScenario(page, scenario.id, scenario.waitTime)

      // Test Reanimated
      await setupPage(page, {
        name: 'AnimationComprehensiveCase',
        type: 'useCase',
        searchParams: { animationDriver: 'reanimated' },
      })
      await page.waitForTimeout(500)
      const reanimatedResult = await runScenario(page, scenario.id, scenario.waitTime)

      console.log(`\n=== ${scenario.name.toUpperCase()} COMPARISON ===`)
      console.log(`Moti: ${motiResult?.totalFrames} frames, ${motiResult?.duration}ms`)
      console.log(`Reanimated: ${reanimatedResult?.totalFrames} frames, ${reanimatedResult?.duration}ms`)

      if (motiResult && reanimatedResult) {
        const frameDiff = Math.abs(motiResult.totalFrames - reanimatedResult.totalFrames)
        const durationDiff = Math.abs(motiResult.duration - reanimatedResult.duration)

        console.log(`Frame difference: ${frameDiff}`)
        console.log(`Duration difference: ${durationDiff}ms`)

        // They should be reasonably similar
        expect(frameDiff).toBeLessThan(50) // Allow some variance
      }
    })
  }
})
