import { expect, test, type Page } from '@playwright/test'

/**
 * The differential runtime-versus-compiled oracle, first slice.
 *
 * `src/rules/transition-tree.tsx` is one authored tree. `transition.tsx`
 * compiles it; `transition.runtime.tsx` mounts the same component through the
 * ordinary runtime with the compiler off. Nothing else in the repository
 * renders one tree both ways and compares the result, which is why a
 * `styled()` definition could drop `transition` for years while every compiler
 * test stayed green.
 *
 * It compares CSS LONGHANDS from `getComputedStyle`, never class names and
 * never emitted CSS text. The browser expands the shorthand, resolves the
 * variables, and settles the cascade, so a hash difference, a rule-order
 * difference, or a different-but-equivalent spelling is not a failure and a
 * genuinely different resulting style is.
 */
const RUNTIME_URL = 'http://localhost:7887/.tamagui/rules/transition.runtime.html'
const COMPILED_URL = '/.tamagui/rules/transition.html'

// where the transition is written, which is the whole variable in this slice
const PROBES = ['transition-box', 'definition-box', 'call-site-box'] as const

const LONGHANDS = [
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'backgroundColor',
  'width',
  'height',
] as const

async function sample(page: Page, url: string) {
  await page.goto(url)
  await page.waitForSelector('[data-testid="call-site-box"]')
  // the runtime tier inserts its rules from JS, so the first paint can precede
  // the stylesheet by a frame
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

  return page.evaluate(
    ({ probes, longhands }) => {
      const out: Record<string, Record<string, string>> = {}
      for (const probe of probes) {
        const node = document.querySelector(`[data-testid="${probe}"]`)
        if (!node) throw new Error(`missing probe ${probe}`)
        const computed = getComputedStyle(node)
        const values: Record<string, string> = {}
        for (const name of longhands) values[name] = computed[name]
        out[probe] = values
      }
      return out
    },
    { probes: [...PROBES], longhands: [...LONGHANDS] }
  )
}

test('the compiled tree and the runtime tree compute the same longhands', async ({
  page,
}) => {
  const compiled = await sample(page, COMPILED_URL)
  const runtime = await sample(page, RUNTIME_URL)

  // Absolute expectations first, so equality can never pass by both tiers
  // dropping the same thing. Each box carries a different configured preset, so
  // the duration names which of the three places was lowered: `medium` at the
  // call site of a plain View, `lazy` in a styled() definition, `quick` at the
  // call site of a styled component. The definition case is the regression
  // detector; the other two prove the harness can observe the property at all.
  for (const observed of [compiled, runtime]) {
    expect(observed['transition-box'].transitionDuration).toBe('0.3s')
    expect(observed['definition-box'].transitionDuration).toBe('0.5s')
    expect(observed['call-site-box'].transitionDuration).toBe('0.15s')
  }

  expect(runtime).toEqual(compiled)
})
