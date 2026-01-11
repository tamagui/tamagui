import { expect, test, type Page, type ConsoleMessage } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ANIMATION DRIVER TEST SUITE
 *
 * Tests each animation scenario individually with specific assertions.
 * Each test captures frame-by-frame data and validates animation behavior.
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
  perfStart: number
}

function parseAnimationLogs(logs: string[]): AnimationResult | null {
  let startTime = 0
  let endTime = 0
  let perfStart = 0
  let scenario = ''
  const frames: AnimationFrame[] = []

  for (const log of logs) {
    if (log.includes('[ANIM_START]')) {
      const match = log.match(
        /\[ANIM_START\] scenario:(\S+) time:(\d+)(?: perfStart:(\d+))?/
      )
      if (match) {
        scenario = match[1]
        startTime = Number.parseInt(match[2], 10)
        perfStart = match[3] ? Number.parseInt(match[3], 10) : 0
      }
    } else if (log.includes('[ANIM_FRAME]')) {
      const match = log.match(
        /\[ANIM_FRAME\] scenario:(\S+) frame:(\d+) prop:(\S+) value:(.+?) time:(\d+) delta:(\d+)/
      )
      if (match) {
        frames.push({
          scenario: match[1],
          frame: Number.parseInt(match[2], 10),
          prop: match[3],
          value: match[4],
          time: Number.parseInt(match[5], 10),
          delta: Number.parseInt(match[6], 10),
        })
      }
    } else if (log.includes('[ANIM_END]')) {
      const match = log.match(/\[ANIM_END\] scenario:(\S+) totalFrames:(\d+) time:(\d+)/)
      if (match) {
        endTime = Number.parseInt(match[3], 10)
      }
    }
  }

  if (!scenario || frames.length === 0) return null

  return {
    scenario,
    startTime,
    endTime,
    totalFrames: frames.length,
    frames,
    duration: endTime - startTime,
    perfStart,
  }
}

async function runScenario(
  page: Page,
  scenarioId: string,
  waitTime: number
): Promise<AnimationResult | null> {
  const logs: string[] = []
  const listener = (msg: ConsoleMessage) => {
    const text = msg.text()
    if (text.includes('[ANIM_') && text.includes(scenarioId)) {
      logs.push(text)
    }
  }
  page.on('console', listener)

  try {
    const trigger = page.getByTestId(`scenario-${scenarioId}-trigger`)
    await trigger.click()
    await page.waitForTimeout(waitTime)
  } catch (e) {
    page.off('console', listener)
    return null
  }

  page.off('console', listener)
  return parseAnimationLogs(logs)
}

function getFrameDeltas(result: AnimationResult): number[] {
  return result.frames.map((f) => f.delta).filter((d) => d > 0)
}

function getAvgFrameRate(result: AnimationResult): number {
  const deltas = getFrameDeltas(result)
  if (deltas.length === 0) return 0
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length
  return 1000 / avgDelta
}

function getFirstFrameDelay(result: AnimationResult): number {
  const frame0 = result.frames.find((f) => f.frame === 0)
  const frame1 = result.frames.find((f) => f.frame === 1)
  if (frame0 && frame1) {
    return frame1.time - frame0.time
  }
  return frame0?.delta || 0
}

// All drivers to test
const DRIVERS = ['css', 'native', 'moti', 'reanimated'] as const
type Driver = (typeof DRIVERS)[number]

// Scenario definitions with expected behavior per driver
// minFrames is relaxed for dimension props which some drivers handle differently
const SCENARIOS = {
  '01': { name: 'opacity-basic', wait: 800, minFrames: 3, props: ['opacity'] },
  '02': { name: 'scale-basic', wait: 800, minFrames: 3, props: ['transform'] },
  '03': { name: 'translateX', wait: 800, minFrames: 3, props: ['transform'] },
  '04': { name: 'translateY', wait: 800, minFrames: 3, props: ['transform'] },
  '05': { name: 'rotate', wait: 800, minFrames: 3, props: ['transform'] },
  '06': {
    name: 'multi-transform',
    wait: 800,
    minFrames: 3,
    props: ['transform', 'opacity'],
  },
  '07': { name: 'width', wait: 1200, minFrames: 1, props: ['width'] }, // dimension - relaxed
  '08': { name: 'height', wait: 1200, minFrames: 1, props: ['height'] }, // dimension - relaxed
  '09': { name: 'width-height', wait: 1200, minFrames: 1, props: ['width', 'height'] }, // dimension - relaxed
  '10': { name: 'border-radius', wait: 800, minFrames: 2, props: ['borderRadius'] },
  '11': { name: 'bg-color', wait: 800, minFrames: 2, props: ['backgroundColor'] },
  '12': { name: 'text-color', wait: 800, minFrames: 2, props: ['color'] },
  '13': { name: 'border-color', wait: 800, minFrames: 2, props: ['borderColor'] },
  '14': { name: 'spring-bouncy', wait: 1200, minFrames: 5, props: ['transform'] },
  '15': { name: 'spring-lazy', wait: 1800, minFrames: 5, props: ['transform'] },
  '16': { name: 'spring-quick', wait: 600, minFrames: 3, props: ['transform'] },
  '17': { name: 'spring-custom', wait: 1200, minFrames: 3, props: ['transform'] },
  '18': { name: 'timing-100ms', wait: 400, minFrames: 2, props: ['opacity'] },
  '19': { name: 'timing-quick', wait: 500, minFrames: 2, props: ['opacity'] },
  '20': {
    name: 'timing-delay',
    wait: 1000,
    minFrames: 2,
    props: ['opacity'],
    expectDelay: 250,
  },
  '24': { name: 'rapid-toggle', wait: 1200, minFrames: 1, props: ['transform'] },
  '25': { name: 'interruption', wait: 1500, minFrames: 1, props: ['transform'] },
  '26': { name: 'animate-only', wait: 800, minFrames: 2, props: ['opacity'] },
  '27': { name: 'animation-config', wait: 1500, minFrames: 2, props: ['transform'] },
  '28': {
    name: 'multi-property',
    wait: 800,
    minFrames: 2,
    props: ['opacity', 'transform', 'borderRadius'],
  },
} as const

type ScenarioId = keyof typeof SCENARIOS

// Test each driver with each scenario
// NOTE: These tests are skipped because they rely on capturing intermediate animation
// frames by polling getComputedStyle, which is unreliable across all drivers:
// - CSS driver: CSS transitions happen on compositor thread
// - JS drivers: Animated API updates internal state, not immediately visible in computed styles
// TODO: Re-enable when we have a more reliable frame capture mechanism
test.describe.skip('Animation frame capture tests', () => {
for (const driver of DRIVERS) {
  test.describe(`${driver} driver`, () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, {
        name: 'AnimationComprehensiveCase',
        type: 'useCase',
        searchParams: { animationDriver: driver },
      })
      await page.waitForTimeout(300)
    })

    // Basic transform/opacity scenarios
    for (const [id, config] of Object.entries(SCENARIOS) as [
      ScenarioId,
      (typeof SCENARIOS)[ScenarioId],
    ][]) {
      test(`${id}: ${config.name}`, async ({ page }) => {
        const result = await runScenario(page, id, config.wait)

        // Must capture animation data
        expect(result, `No animation data captured for ${config.name}`).not.toBeNull()

        // Must have minimum frames
        expect(
          result!.totalFrames,
          `${config.name}: expected >= ${config.minFrames} frames, got ${result!.totalFrames}`
        ).toBeGreaterThanOrEqual(config.minFrames)

        // Check frame rate (except for very short animations)
        if (result!.totalFrames > 5) {
          const fps = getAvgFrameRate(result!)
          expect(
            fps,
            `${config.name}: frame rate ${fps.toFixed(1)} fps too low`
          ).toBeGreaterThan(15)
        }

        // Check delay if expected
        if ('expectDelay' in config && config.expectDelay) {
          const delay = getFirstFrameDelay(result!)
          expect(
            delay,
            `${config.name}: expected delay ~${config.expectDelay}ms, got ${delay}ms`
          ).toBeGreaterThanOrEqual(config.expectDelay)
        }

        // Log results for debugging
        const fps = getAvgFrameRate(result!)
        const deltas = getFrameDeltas(result!)
        const maxDelta = deltas.length > 0 ? Math.max(...deltas) : 0
        // biome-ignore lint/suspicious/noConsoleLog: intentional test output
        console.log(
          `[${driver}] ${config.name}: ${result!.totalFrames} frames, ` +
            `${fps.toFixed(0)} fps, max delta ${maxDelta}ms`
        )
      })
    }
  })
}
}) // end test.describe.skip('Animation frame capture tests')

// Cross-driver comparison for key scenarios
// Only JS-based drivers are tested - CSS driver uses browser-native transitions
test.describe.skip('Cross-driver comparison', () => {
  const keyScenarios: ScenarioId[] = ['01', '14', '20']
  // Exclude CSS driver - it uses browser-native CSS transitions which complete
  // too fast to capture multiple intermediate frames via RAF polling
  const JS_DRIVERS = ['native', 'moti', 'reanimated'] as const

  for (const scenarioId of keyScenarios) {
    test(`${SCENARIOS[scenarioId].name} behavior across drivers`, async ({ page }) => {
      const results: Record<string, AnimationResult | null> = {}

      for (const driver of JS_DRIVERS) {
        await setupPage(page, {
          name: 'AnimationComprehensiveCase',
          type: 'useCase',
          searchParams: { animationDriver: driver },
        })
        await page.waitForTimeout(300)
        results[driver] = await runScenario(page, scenarioId, SCENARIOS[scenarioId].wait)
      }

      // All JS drivers should produce results
      for (const driver of JS_DRIVERS) {
        expect(
          results[driver],
          `${driver} failed to animate ${SCENARIOS[scenarioId].name}`
        ).not.toBeNull()
      }

      // Compare frame counts
      // biome-ignore lint/suspicious/noConsoleLog: intentional test output
      console.log(
        `${SCENARIOS[scenarioId].name} frame counts:`,
        JS_DRIVERS.map((d) => `${d}=${results[d]?.totalFrames || 0}`).join(', ')
      )

      // JS-based drivers should produce similar frame counts
      const jsFrameCounts = JS_DRIVERS
        .map((d) => results[d]?.totalFrames || 0)
        .filter((f) => f > 0)

      if (jsFrameCounts.length >= 2) {
        const maxJsFrames = Math.max(...jsFrameCounts)
        const minJsFrames = Math.min(...jsFrameCounts)
        const jsVariance = maxJsFrames / minJsFrames

        // JS drivers should be within 2x of each other
        expect(
          jsVariance,
          `JS driver frame variance too high: ${jsVariance.toFixed(2)}x (${JS_DRIVERS.map((d) => `${d}=${results[d]?.totalFrames}`).join(', ')})`
        ).toBeLessThan(2)
      }
    })
  }
})
