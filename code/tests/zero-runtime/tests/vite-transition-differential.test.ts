import { expect, test, type Page } from '@playwright/test'

/**
 * The browser differential runtime-versus-compiled oracle.
 *
 * Both routes import one generated authored tree. Its curated corpus varies
 * where a payload is written (styled definition, call site, style bailout, or
 * Tailwind candidate) separately from the payload itself. That leaves a clean
 * seam for style-grammar's value corpus to supply payloads in a later slice.
 *
 * The oracle compares CSS LONGHANDS from getComputedStyle. It never compares
 * class names or emitted CSS. The browser expands shorthands, resolves
 * variables, and settles the cascade before either tier is observed.
 */
const RUNTIME_URL = 'http://localhost:7887/.tamagui/rules/differential.runtime.html'
const COMPILED_URL = 'http://localhost:7888/.tamagui/rules/differential.html'

const TRANSITION_PROBES = ['transition-box', 'definition-box', 'call-site-box'] as const

const LONGHANDS = [
  'backgroundColor',
  'color',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'opacity',
  'display',
  'flexDirection',
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
] as const

type Longhand = (typeof LONGHANDS)[number]
type Values = Record<Longhand, string>
type Expected = Record<string, Partial<Values>>
type Probe = {
  action?: string
  expected: Expected
  expectedFailure?: string
  values: Values
}
type Snapshot = Record<string, Probe>

const normalize = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(^|[, (])0ms(?=$|[, )])/g, '$10s')
    .replace('cubic-bezier(0.25, 0.1, 0.25, 1)', 'ease')

async function open(page: Page, url: string, width: number) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(url)
  await page.waitForSelector('[data-differential-probe]')
  await expect
    .poll(
      async () =>
        page.evaluate(
          () =>
            getComputedStyle(document.querySelector('[data-testid="call-site-box"]')!)
              .transitionDuration
        ),
      { timeout: 5000 }
    )
    .not.toBe('0s')
}

async function sampleAll(page: Page): Promise<Snapshot> {
  return page.evaluate(
    ({ longhands }) => {
      const normalizeValue = (value: string) =>
        value
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/(^|[, (])0ms(?=$|[, )])/g, '$10s')
          .replace('cubic-bezier(0.25, 0.1, 0.25, 1)', 'ease')
      const out: Record<string, Probe> = {}
      for (const node of document.querySelectorAll<HTMLElement>(
        '[data-differential-probe]'
      )) {
        const id = node.dataset.differentialId
        const serializedExpected = node.dataset.differentialExpected
        if (!id || !serializedExpected) throw new Error('incomplete differential probe')
        const computed = getComputedStyle(node)
        const values = {} as Values
        for (const name of longhands) values[name] = normalizeValue(computed[name])
        out[id] = {
          action: node.dataset.differentialAction,
          expected: JSON.parse(serializedExpected),
          expectedFailure: node.dataset.differentialExpectedFailure,
          values,
        }
      }
      return out
    },
    { longhands: [...LONGHANDS] }
  )
}

async function sampleTransitions(page: Page) {
  return page.evaluate(
    ({ probes, longhands }) => {
      const out: Record<string, Record<string, string>> = {}
      for (const probe of probes) {
        const node = document.querySelector(`[data-testid="${probe}"]`)
        if (!node) throw new Error(`missing transition probe ${probe}`)
        const computed = getComputedStyle(node)
        out[probe] = Object.fromEntries(
          longhands.map((name) => [
            name,
            computed[name]
              .trim()
              .replace(/\s+/g, ' ')
              .replace('cubic-bezier(0.25, 0.1, 0.25, 1)', 'ease'),
          ])
        )
      }
      return out
    },
    { probes: [...TRANSITION_PROBES], longhands: [...LONGHANDS] }
  )
}

function expectPhase(snapshot: Snapshot, phase: string) {
  let assertions = 0
  for (const [id, probe] of Object.entries(snapshot)) {
    const expected = probe.expected[phase]
    if (!expected) continue
    for (const [longhand, value] of Object.entries(expected)) {
      expect(probe.values[longhand as Longhand], `${id} ${phase} ${longhand}`).toBe(
        normalize(value)
      )
      assertions++
    }
  }
  expect(assertions, `${phase} must carry absolute expectations`).toBeGreaterThan(0)
}

async function sampleActions(page: Page, baseline: Snapshot) {
  const out: Record<string, Values> = {}
  for (const [id, probe] of Object.entries(baseline)) {
    if (!probe.action || probe.expectedFailure) continue
    const target = page.getByTestId(`differential-${id}`)
    if (probe.action === 'wide-hover') {
      await page.setViewportSize({ width: 900, height: 900 })
      await target.hover()
    } else if (probe.action === 'group-hover') {
      await target.locator('xpath=..').hover()
    } else if (probe.action === 'hover') {
      await target.hover()
    } else if (probe.action === 'focus') {
      await target.focus()
    } else {
      throw new Error(`unknown differential action ${probe.action}`)
    }

    const values = await target.evaluate(
      (node, longhands) => {
        const computed = getComputedStyle(node)
        return Object.fromEntries(
          longhands.map((name) => [
            name,
            computed[name]
              .trim()
              .replace(/\s+/g, ' ')
              .replace(/(^|[, (])0ms(?=$|[, )])/g, '$10s')
              .replace('cubic-bezier(0.25, 0.1, 0.25, 1)', 'ease'),
          ])
        ) as Values
      },
      [...LONGHANDS]
    )
    out[id] = values

    const expected = probe.expected[probe.action]
    expect(expected, `${id} needs an absolute ${probe.action} expectation`).toBeTruthy()
    for (const [longhand, value] of Object.entries(expected ?? {})) {
      expect(values[longhand as Longhand], `${id} ${probe.action} ${longhand}`).toBe(
        normalize(value)
      )
    }

    await page.mouse.move(1, 1)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    if (probe.action === 'wide-hover') {
      await page.setViewportSize({ width: 500, height: 900 })
    }
  }
  return out
}

async function observeTier(page: Page, url: string) {
  await open(page, url, 500)
  const base = await sampleAll(page)
  expect(Object.keys(base)).toHaveLength(32)
  expectPhase(base, 'base')
  const transitions = await sampleTransitions(page)
  // item 4's first slice stays explicit: plain View call-site prop, styled()
  // definition, and styled component call-site prop respectively.
  expect(transitions['transition-box'].transitionDuration).toBe('0.3s')
  expect(transitions['definition-box'].transitionDuration).toBe('0.5s')
  expect(transitions['call-site-box'].transitionDuration).toBe('0.15s')
  const actions = await sampleActions(page, base)

  await open(page, url, 900)
  const wide = await sampleAll(page)
  expectPhase(wide, 'wide')
  return { actions, base, transitions, wide }
}

test('the compiled and runtime trees compute the same longhands for the curated corpus', async ({
  page,
}) => {
  const compiled = await observeTier(page, COMPILED_URL)
  const runtime = await observeTier(page, RUNTIME_URL)
  expect(runtime).toEqual(compiled)
})

async function hoverTailwindCandidate(page: Page, url: string) {
  await open(page, url, 500)
  const target = page.getByTestId('differential-tailwind-hover')
  await target.hover()
  return target.evaluate((node) => getComputedStyle(node).backgroundColor)
}

test('the runtime tier applies the Tailwind hover candidate', async ({ page }) => {
  expect(await hoverTailwindCandidate(page, RUNTIME_URL)).toBe('rgb(37, 99, 235)')
})

// known divergence: the ordinary compiled tier retains the base candidate on
// hover while the compiler-disabled runtime applies the authored hover color.
// this must invert when compilation reaches runtime parity.
test.fail('the compiled tier applies the Tailwind hover candidate', async ({ page }) => {
  const compiled = await hoverTailwindCandidate(page, COMPILED_URL)
  const runtime = await hoverTailwindCandidate(page, RUNTIME_URL)
  expect(compiled).toBe(runtime)
})
