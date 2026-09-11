import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const artifact = () => readFileSync(path.join(root, 'dist/tamagui-zero.css'), 'utf8')
const receipt = () =>
  JSON.parse(readFileSync(path.join(root, '.tamagui/zero/vite-dist.graph.json'), 'utf8'))

/**
 * The `--background` a nested chain of theme classes resolves to, read from the
 * loaded artifact by the browser's own cascade. It is the oracle for "which
 * theme is this subtree in", independent of what the compiled spans claim.
 */
const backgroundOfChain = (page: Page, chain: string[]) =>
  page.evaluate((classes: string[]) => {
    let host = document.body
    const created: HTMLElement[] = []
    for (const className of classes) {
      const node = document.createElement('div')
      node.className = className
      host.appendChild(node)
      created.push(node)
      host = node
    }
    const probe = document.createElement('div')
    probe.style.backgroundColor = 'var(--background)'
    host.appendChild(probe)
    const value = getComputedStyle(probe).backgroundColor
    created[0]?.remove()
    return value
  }, chain)

const backgroundOf = (page: Page, testId: string) =>
  page
    .locator(`[data-testid="${testId}"]`)
    .evaluate((node) => getComputedStyle(node).backgroundColor)

// The config emits a prefers-color-scheme fallback for scheme buckets, which is
// what an app with no explicit root theme class relies on. It sits at the base
// rule's specificity, so leaving the browser's scheme to the runner would decide
// these assertions instead of the theme classes under test.
test.use({ colorScheme: 'light' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="zero-root"]')
})

test('the zero page switches between static light and dark with no theme runtime', async ({
  page,
}) => {
  // there is no Tamagui module in this graph at all, so nothing here can be a
  // runtime theme subscription: the compiler enumerated both names
  expect(receipt().tamaguiModules).toEqual([])

  const light = await backgroundOf(page, 'switch-child')
  expect(light).toBe(await backgroundOfChain(page, ['t_light']))

  await page.click('[data-testid="theme-toggle"]')
  const dark = await backgroundOf(page, 'switch-child')
  expect(dark).toBe(await backgroundOfChain(page, ['t_dark']))
  expect(dark).not.toBe(light)

  await page.click('[data-testid="theme-toggle"]')
  expect(await backgroundOf(page, 'switch-child')).toBe(light)
})

test("every compiled Theme span carries the runtime span's own style", async ({
  page,
}) => {
  // the runtime renders `<span style={{color, display:'contents'}}>`, with the
  // color only when the node actually changed the theme. a compiled span without
  // that is a layout box the runtime's is not, and loses the currentColor
  // default. named by the content each span wraps, so the island's own runtime
  // spans cannot answer for the compiled ones.
  const spans = await page.evaluate(() =>
    ['switch-child', 'nested-inner', 'modifier-light', 'zero-theme-child'].map(
      (testId) => {
        const span = document.querySelector(`[data-testid="${testId}"]`)!
          .parentElement as HTMLElement
        return {
          testId,
          isThemeSpan: span.classList.contains('is_Theme'),
          changedTheme: [...span.classList].some((name) => name.startsWith('t_')),
          display: getComputedStyle(span).display,
          color: span.style.color,
        }
      }
    )
  )
  // both kinds are in this list: named themes and a value-only Theme
  expect(new Set(spans.map((span) => span.changedTheme))).toEqual(new Set([true, false]))
  for (const span of spans) {
    expect(span.isThemeSpan).toBe(true)
    expect(span.display).toBe('contents')
    expect(span.color).toBe(span.changedTheme ? 'var(--color)' : '')
  }
})

test('the island provider does not write a theme class onto the document', async ({
  page,
}) => {
  // the island's provider is a subtree root inside a page that already has its
  // own compiled theme spans. stamping html or body would re-theme the whole
  // zero page from an async chunk, which is how `<Theme name="light">` above
  // silently resolved to the island's dark theme.
  await page.waitForSelector('[data-testid="island-root"]')
  const stamped = await page.evaluate(() =>
    [document.documentElement.className, document.body.className]
      .join(' ')
      .split(/\s+/)
      .filter((name) => name.startsWith('t_'))
  )
  expect(stamped).toEqual([])
})

test('a nested static Theme composes against the scheme above it', async ({ page }) => {
  const outer = await backgroundOf(page, 'nested-outer')
  const inner = await backgroundOf(page, 'nested-inner')

  expect(outer).toBe(await backgroundOfChain(page, ['t_dark']))
  expect(inner).toBe(await backgroundOfChain(page, ['t_dark', 't_level2 t_dark_level2']))
  expect(inner).not.toBe(outer)

  // and it composed rather than resolving level2 against the root: the two
  // schemes' level2 themes are different values
  expect(inner).not.toBe(await backgroundOfChain(page, ['t_light', 't_light_level2']))
})

test('a direct theme value changes descendant computed styles', async ({ page }) => {
  const child = await page
    .locator('[data-testid="zero-theme-child"]')
    .evaluate((node) => getComputedStyle(node).getPropertyValue('--background').trim())
  expect(child).toBe('#0b2545')

  // the same value beats the named theme it sits inside, which is the whole
  // point of the anchored inline-value selector
  expect(child).not.toBe(
    await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.className = 't_dark'
      document.body.appendChild(probe)
      const value = getComputedStyle(probe).getPropertyValue('--background').trim()
      probe.remove()
      return value
    })
  )
})

test('a theme modifier selects its static rule under each scheme', async ({ page }) => {
  const underLight = await backgroundOf(page, 'modifier-light')
  const underDark = await backgroundOf(page, 'modifier-dark')

  expect(underLight).toBe('rgb(17, 34, 51)')
  expect(underDark).toBe('rgb(68, 85, 102)')

  // one authored value, one compiled class, two placements: the modifier is a
  // choice between static rules, not a second compiled value
  const classOf = (testId: string) =>
    page
      .locator(`[data-testid="${testId}"]`)
      .evaluate((node) =>
        (node.parentElement?.className ?? '')
          .split(/\s+/)
          .filter((name) => name.startsWith('tvar_'))
      )
  const lightClasses = await classOf('modifier-light')
  expect(lightClasses).toHaveLength(1)
  expect(await classOf('modifier-dark')).toEqual(lightClasses)

  // and the rule the dark placement picks is scoped by the theme class, so
  // nothing had to read the theme in JavaScript to choose it
  const selectors = await page.evaluate((identifier: string) => {
    const found: string[] = []
    for (const sheet of document.styleSheets) {
      for (const rule of sheet.cssRules) {
        if (rule.cssText.includes(identifier) && (rule as CSSStyleRule).selectorText) {
          found.push((rule as CSSStyleRule).selectorText)
        }
      }
    }
    return found
  }, lightClasses[0]!)
  expect(selectors).toHaveLength(2)
  expect(selectors.some((selector) => selector.includes('.t_dark'))).toBe(true)
})
