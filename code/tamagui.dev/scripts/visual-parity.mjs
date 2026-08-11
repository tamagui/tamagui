import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

const baselineUrl = process.env.VISUAL_BASELINE_URL || 'http://127.0.0.1:8081'
const candidateUrl = process.env.VISUAL_CANDIDATE_URL || 'http://127.0.0.1:8082'
const outputDirectory = resolve(
  process.env.VISUAL_OUTPUT_DIR || '/tmp/tamagui-site-visual-parity'
)
const routeFilter = process.env.VISUAL_ROUTE
const viewportFilter = process.env.VISUAL_VIEWPORT
const suite = process.env.VISUAL_SUITE || 'pages'
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)
const deterministicImage = await readFile(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../demos/public/photo1.jpg')
)

const pageCases = [
  { name: 'home', path: '/' },
  { name: 'docs', path: '/docs/intro/introduction' },
  { name: 'component', path: '/ui/button' },
  { name: 'blog-index', path: '/blog', comparable: false },
  { name: 'blog-post', path: '/blog/version-two' },
  { name: 'takeout', path: '/takeout' },
  { name: 'bento', path: '/bento', comparable: false },
  { name: 'theme', path: '/theme', comparable: false },
]

// keep this as the explicit intersection of v2 and v3 demo exports. the isolate route
// catches component regressions without page layout and content changes diluting them.
const componentNames = [
  'Accordion',
  'AddTheme',
  'AlertDialog',
  'Animations',
  'AnimationsEnter',
  'AnimationsHover',
  'AnimationsPresence',
  'Avatar',
  'BuildAButton',
  'Button',
  'Card',
  'Checkbox',
  'CheckboxHeadless',
  'Colors',
  'ContextMenu',
  'Dialog',
  'Forms',
  'Group',
  'Headings',
  'Image',
  'Inputs',
  'Label',
  'LinearGradient',
  'ListItem',
  'LucideIcons',
  'Menu',
  'NewInputs',
  'Popover',
  'Progress',
  'RadioGroup',
  'RadioGroupHeadless',
  'ReplaceTheme',
  'ScrollView',
  'Select',
  'Separator',
  'Shapes',
  'Sheet',
  'Slider',
  'Spinner',
  'Stacks',
  'Switch',
  'SwitchHeadless',
  'Tabs',
  'TabsAdvanced',
  'Text',
  'ThemeBuilder',
  'ThemeInverse',
  'Toast',
  'ToastDuplicate',
  'ToggleGroup',
  'Tokens',
  'Tooltip',
  'UpdateTheme',
  'WebNativeImage',
]

// these demos intentionally changed their visible content or component API in v3.
// keep capturing them, but do not mix those content differences into visual parity.
const contentDivergentComponents = new Set([
  'Forms',
  'Inputs',
  'NewInputs',
  'ReplaceTheme',
  'ThemeInverse',
  'Tokens',
])

const componentCases = componentNames.map((component) => ({
  name: `demo-${component.toLowerCase()}`,
  path: `/demo/${component.toLowerCase()}`,
  isolated: true,
  comparable: !contentDivergentComponents.has(component),
}))

const interactionCases = [
  {
    name: 'demo-accordion-open',
    path: '/demo/accordion',
    action: { type: 'clickText', text: '1. Take a cold shower', expanded: true },
  },
  {
    name: 'docs-accordion-open',
    path: '/ui/accordion',
    action: { type: 'clickText', text: '1. Take a cold shower', expanded: true },
    captureSelector: '#tamagui-demos-container',
  },
  {
    name: 'demo-alertdialog-open',
    path: '/demo/alertdialog',
    action: { type: 'clickText', text: 'Show Alert', visibleText: 'Accept' },
  },
  {
    name: 'demo-contextmenu-open',
    path: '/demo/contextmenu',
    action: {
      type: 'rightClickText',
      text: 'Right Click or Long Press',
      visibleText: 'About Notes',
    },
  },
  {
    name: 'demo-dialog-open',
    path: '/demo/dialog',
    action: { type: 'clickText', text: 'Show Dialog', visibleText: 'Edit profile' },
  },
  {
    name: 'demo-menu-open',
    path: '/demo/menu',
    action: { type: 'clickText', text: 'Open', visibleText: 'About Notes' },
  },
  {
    name: 'demo-popover-open',
    path: '/demo/popover',
    action: { type: 'clickSelector', selector: 'button', visibleText: 'Submit' },
  },
  {
    name: 'demo-select-open',
    path: '/demo/select',
    action: { type: 'clickText', text: 'Apple', visibleText: 'Fruits' },
  },
  {
    name: 'demo-sheet-open',
    path: '/demo/sheet',
    action: { type: 'clickText', text: 'Open', visibleSelector: 'input' },
  },
  {
    name: 'demo-toast-open',
    path: '/demo/toast',
    action: {
      type: 'clickSelector',
      selector: '[data-testid="toast-top-right-button"]',
      visibleText: 'Toast #1',
    },
  },
  {
    name: 'demo-tooltip-open',
    path: '/demo/tooltip',
    action: { type: 'hoverSelector', selector: 'button', visibleText: 'Hello world' },
  },
]

// keep the homepage regressions as small element captures so details such as
// tooltip arrows and shadows contribute meaningfully to the comparison.
const homepageCases = [
  {
    name: 'home-start-button',
    path: '/',
    captureSelector: '[aria-label="Get started (docs)"]',
    capturePadding: 32,
  },
  {
    name: 'home-x-tooltip',
    path: '/',
    action: {
      type: 'hoverSelector',
      selector: '[aria-label="X"]',
      visibleSelector: '[role="tooltip"]',
    },
    captureSelector: '[role="tooltip"]',
    capturePadding: 16,
    captureBackdrop: '#f5f5f5',
  },
  {
    name: 'home-media-button',
    path: '/',
    captureSelector: '[aria-label="Pause"]',
    capturePadding: 32,
  },
  {
    name: 'home-social-card',
    path: '/',
    captureSelector:
      'a[href="https://x.com/tamagui_js"]:has(p), [role="link"][href="https://x.com/tamagui_js"]:has(p)',
    capturePadding: 24,
  },
  {
    name: 'home-code-arrow',
    path: '/',
    captureSelector: 'svg[stroke="var(--colorHover)"], svg[stroke="var(--color-hover)"]',
    viewports: ['desktop'],
  },
]

const casesBySuite = {
  pages: pageCases,
  components: componentCases,
  interactions: interactionCases,
  homepage: homepageCases,
  all: [...pageCases, ...componentCases, ...interactionCases, ...homepageCases],
}

const routes = casesBySuite[suite]

if (!routes) {
  throw new Error(`Unknown VISUAL_SUITE: ${suite}`)
}

const viewports = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 1 },
]

const routeNames = routeFilter ? new Set(routeFilter.split(',')) : null
const selectedRoutes = routeNames
  ? routes.filter(({ name }) => routeNames.has(name))
  : routes
const selectedViewports = viewportFilter
  ? viewports.filter(({ name }) => name === viewportFilter)
  : viewports

if (!selectedRoutes.length) {
  throw new Error(`Unknown VISUAL_ROUTE: ${routeFilter}`)
}
if (!selectedViewports.length) {
  throw new Error(`Unknown VISUAL_VIEWPORT: ${viewportFilter}`)
}

await mkdir(outputDirectory, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  executablePath,
  args: [
    '--disable-dev-shm-usage',
    '--font-render-hinting=none',
    '--force-color-profile=srgb',
  ],
})

const results = []
const failures = []

try {
  for (const viewport of selectedViewports) {
    for (const route of selectedRoutes) {
      if (route.viewports && !route.viewports.includes(viewport.name)) {
        continue
      }
      const pair = {}

      try {
        for (const target of [
          { name: 'v2', baseUrl: baselineUrl },
          { name: 'v3', baseUrl: candidateUrl },
        ]) {
          const page = await browser.newPage()
          await page.setViewport(viewport)
          await page.emulateMediaFeatures([
            { name: 'prefers-color-scheme', value: 'light' },
            { name: 'prefers-reduced-motion', value: 'reduce' },
          ])
          await page.setCacheEnabled(false)
          await page.setRequestInterception(true)
          page.on('request', (request) => {
            if (new URL(request.url()).hostname === 'picsum.photos') {
              request.respond({ contentType: 'image/jpeg', body: deterministicImage })
            } else {
              request.continue()
            }
          })

          const consoleErrors = []
          page.on('console', (message) => {
            if (message.type() === 'error') {
              consoleErrors.push(message.text())
            }
          })
          page.on('pageerror', (error) => consoleErrors.push(error.message))

          const url = new URL(route.path, target.baseUrl).href
          console.info(`Capturing ${target.name} ${route.name}/${viewport.name}`)
          for (let attempt = 1; attempt <= 5; attempt++) {
            try {
              const response = await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 120_000,
              })
              if (!response?.ok()) {
                throw new Error(`${target.name} ${url} returned ${response?.status()}`)
              }
              await page
                .waitForNetworkIdle({ idleTime: 500, timeout: 10_000 })
                .catch(() => {})

              await page.evaluate(async () => {
                await document.fonts.ready
                for (const media of document.querySelectorAll('video, audio')) {
                  media.pause()
                  media.currentTime = 0
                }
                const maxY = document.documentElement.scrollHeight
                for (let y = 0; y < maxY; y += window.innerHeight) {
                  window.scrollTo(0, y)
                  await new Promise((resolve) => setTimeout(resolve, 20))
                }
                window.scrollTo(0, 0)
              })
              await page
                .waitForFunction(
                  () =>
                    [...document.querySelectorAll('iframe')].every(
                      (frame) => frame.contentDocument?.readyState === 'complete'
                    ),
                  { timeout: 10_000 }
                )
                .catch(() => {})
              await page.evaluate(async () => {
                const documents = [
                  document,
                  ...[...document.querySelectorAll('iframe')]
                    .map((frame) => frame.contentDocument)
                    .filter(Boolean),
                ]
                await Promise.all(
                  documents.flatMap((currentDocument) => [
                    currentDocument.fonts?.ready,
                    ...[...currentDocument.images].map((image) =>
                      image.complete ? image.decode?.().catch(() => {}) : undefined
                    ),
                  ])
                )
              })
              // let intersection-driven demos and smooth-scrolling carousels reach
              // the same settled state after the full-page discovery scroll.
              await new Promise((resolve) =>
                setTimeout(
                  resolve,
                  route.isolated || route.path.startsWith('/demo/') ? 250 : 1_000
                )
              )
              await page
                .waitForNetworkIdle({ idleTime: 500, timeout: 10_000 })
                .catch(() => {})
              break
            } catch (error) {
              if (
                attempt === 5 ||
                !String(error).includes('Execution context was destroyed')
              ) {
                throw error
              }
              console.info(`Retrying ${target.name} after dependency optimization reload`)
              await new Promise((resolve) => setTimeout(resolve, 500))
            }
          }
          await page.addStyleTag({
            content: `
            *, *::before, *::after {
              animation-delay: 0s !important;
              animation-duration: 0s !important;
              caret-color: transparent !important;
              scroll-behavior: auto !important;
              transition-delay: 0s !important;
              transition-duration: 0s !important;
            }
          `,
          })
          if (route.action) {
            try {
              await runAction(page, route.action)
            } catch (error) {
              throw new Error(
                `${target.name} action failed: ${error instanceof Error ? error.message : error}`
              )
            }
          }
          await new Promise((resolve) => setTimeout(resolve, route.action ? 1_000 : 250))

          const screenshotPath = resolve(
            outputDirectory,
            `${route.name}-${viewport.name}-${target.name}.png`
          )
          if (route.captureSelector) {
            const element = await page.$(route.captureSelector)
            if (!element) {
              throw new Error(`Could not find capture element: ${route.captureSelector}`)
            }
            if (route.capturePadding) {
              await element.scrollIntoView()
              const crop = await element.evaluate((currentElement, padding) => {
                const rect = currentElement.getBoundingClientRect()
                const left = Math.floor(Math.max(0, rect.left - padding))
                const top = Math.floor(Math.max(0, rect.top - padding))
                const right = Math.ceil(Math.min(window.innerWidth, rect.right + padding))
                const bottom = Math.ceil(
                  Math.min(window.innerHeight, rect.bottom + padding)
                )
                return { left, top, width: right - left, height: bottom - top }
              }, route.capturePadding)
              if (route.captureBackdrop) {
                await page.evaluate(
                  ({ crop, backgroundColor }) => {
                    const backdrop = document.createElement('div')
                    Object.assign(backdrop.style, {
                      position: 'fixed',
                      left: `${crop.left}px`,
                      top: `${crop.top}px`,
                      width: `${crop.width}px`,
                      height: `${crop.height}px`,
                      backgroundColor,
                      zIndex: '999999',
                    })
                    document.body.appendChild(backdrop)
                  },
                  { crop, backgroundColor: route.captureBackdrop }
                )
              }
              const viewportScreenshot = await page.screenshot()
              await sharp(viewportScreenshot).extract(crop).png().toFile(screenshotPath)
            } else {
              await element.screenshot({ path: screenshotPath })
            }
          } else {
            const fullPage = route.isolated
              ? await page.evaluate(
                  () => document.documentElement.scrollHeight > window.innerHeight
                )
              : true
            await page.screenshot({ path: screenshotPath, fullPage })
          }
          const dimensions = await page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            title: document.title,
          }))
          pair[target.name] = { screenshotPath, dimensions, consoleErrors }
          await page.close()
        }
      } catch (error) {
        const failure = {
          route,
          viewport,
          error: error instanceof Error ? error.message : String(error),
        }
        failures.push(failure)
        console.error(`${route.name}/${viewport.name}: ${failure.error}`)
        continue
      }

      const comparison = await compareImages(
        pair.v2.screenshotPath,
        pair.v3.screenshotPath,
        resolve(outputDirectory, `${route.name}-${viewport.name}-diff.png`)
      )
      const result = {
        route,
        viewport,
        baseline: pair.v2,
        candidate: pair.v3,
        comparison,
      }
      results.push(result)
      console.info(
        `${route.name}/${viewport.name}: ${comparison.tolerantSimilarityPercent.toFixed(4)}% ` +
          `(${pair.v2.dimensions.width}x${pair.v2.dimensions.height} → ` +
          `${pair.v3.dimensions.width}x${pair.v3.dimensions.height})`
      )
    }
  }
} finally {
  await browser.close()
}

const comparableResults = results.filter(({ route }) => route.comparable !== false)
const report = {
  generatedAt: new Date().toISOString(),
  baselineUrl,
  candidateUrl,
  outputDirectory,
  suite,
  threshold: 16,
  aggregate: aggregateResults(results),
  comparableAggregate: aggregateResults(comparableResults),
  failures,
  results,
}

async function runAction(page, action) {
  if (action.type === 'clickText') {
    const target = await page.evaluateHandle((text) => {
      return [...document.querySelectorAll('button, [role="button"]')].find((element) =>
        element.textContent?.trim().includes(text)
      )
    }, action.text)
    const element = target.asElement()
    if (!element) {
      await target.dispose()
      throw new Error(`Could not find button containing: ${action.text}`)
    }
    await element.click()
    await target.dispose()
  } else if (action.type === 'clickSelector') {
    await page.click(action.selector)
  } else if (action.type === 'hoverSelector') {
    await page.hover(action.selector)
  } else if (action.type === 'rightClickText') {
    const point = await page.evaluate((text) => {
      const target = [...document.querySelectorAll('*')]
        .filter((element) => element.textContent?.trim() === text)
        .at(-1)
      if (!(target instanceof HTMLElement)) {
        throw new Error(`Could not find element with text: ${text}`)
      }
      const rect = target.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }, action.text)
    await page.mouse.click(point.x, point.y, { button: 'right' })
  } else {
    throw new Error(`Unknown action type: ${action.type}`)
  }

  if (action.expanded) {
    await page.waitForFunction(
      (text) =>
        [...document.querySelectorAll('button, [role="button"]')].some(
          (element) =>
            element.textContent?.trim().includes(text) &&
            element.getAttribute('aria-expanded') === 'true'
        ),
      { timeout: 10_000 },
      action.text
    )
  }

  if (action.visibleText) {
    await page.waitForFunction(
      (text) =>
        [...document.querySelectorAll('body *')].some((element) => {
          if (element.textContent?.trim() !== text) return false
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          return (
            style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0
          )
        }),
      { timeout: 10_000 },
      action.visibleText
    )
  }

  if (action.visibleSelector) {
    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector)
        if (!(element instanceof HTMLElement)) return false
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return (
          style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0
        )
      },
      { timeout: 10_000 },
      action.visibleSelector
    )
  }
}

const reportPath = resolve(outputDirectory, 'report.json')
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.info(`Report: ${reportPath}`)
if (failures.length) {
  process.exitCode = 1
}

async function compareImages(baselinePath, candidatePath, diffPath) {
  const [baselineMetadata, candidateMetadata] = await Promise.all([
    sharp(baselinePath).metadata(),
    sharp(candidatePath).metadata(),
  ])
  const width = Math.max(baselineMetadata.width, candidateMetadata.width)
  const height = Math.max(baselineMetadata.height, candidateMetadata.height)
  const [baseline, candidate] = await Promise.all([
    normalizeImage(baselinePath, width, height),
    normalizeImage(candidatePath, width, height),
  ])

  const diff = Buffer.alloc(width * height * 4)
  let exactMismatchPixels = 0
  let tolerantMismatchPixels = 0
  let absoluteError = 0

  for (let offset = 0; offset < baseline.length; offset += 4) {
    let maxDifference = 0
    let pixelError = 0
    for (let channel = 0; channel < 3; channel++) {
      const difference = Math.abs(
        baseline[offset + channel] - candidate[offset + channel]
      )
      maxDifference = Math.max(maxDifference, difference)
      pixelError += difference
    }
    absoluteError += pixelError
    if (maxDifference > 0) exactMismatchPixels++
    if (maxDifference > 16) tolerantMismatchPixels++

    if (maxDifference > 16) {
      diff[offset] = 255
      diff[offset + 1] = Math.min(255, pixelError / 2)
      diff[offset + 2] = 0
    } else {
      const gray = Math.round(
        (baseline[offset] + baseline[offset + 1] + baseline[offset + 2]) / 12
      )
      diff[offset] = gray
      diff[offset + 1] = gray
      diff[offset + 2] = gray
    }
    diff[offset + 3] = 255
  }

  await mkdir(dirname(diffPath), { recursive: true })
  await sharp(diff, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(diffPath)

  const totalPixels = width * height
  return {
    width,
    height,
    totalPixels,
    exactMismatchPixels,
    tolerantMismatchPixels,
    exactSimilarityPercent:
      totalPixels === 0
        ? null
        : ((totalPixels - exactMismatchPixels) / totalPixels) * 100,
    tolerantSimilarityPercent:
      totalPixels === 0
        ? null
        : ((totalPixels - tolerantMismatchPixels) / totalPixels) * 100,
    meanChannelSimilarityPercent: (1 - absoluteError / (totalPixels * 3 * 255)) * 100,
    diffPath,
  }
}

async function normalizeImage(path, width, height) {
  const metadata = await sharp(path).metadata()
  return sharp(path)
    .ensureAlpha()
    .extend({
      top: 0,
      left: 0,
      right: width - metadata.width,
      bottom: height - metadata.height,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .raw()
    .toBuffer()
}

function aggregateResults(entries) {
  const totalPixels = entries.reduce(
    (sum, entry) => sum + entry.comparison.totalPixels,
    0
  )
  const tolerantMismatchPixels = entries.reduce(
    (sum, entry) => sum + entry.comparison.tolerantMismatchPixels,
    0
  )
  const exactMismatchPixels = entries.reduce(
    (sum, entry) => sum + entry.comparison.exactMismatchPixels,
    0
  )
  return {
    cases: entries.length,
    totalPixels,
    exactSimilarityPercent: ((totalPixels - exactMismatchPixels) / totalPixels) * 100,
    tolerantSimilarityPercent:
      ((totalPixels - tolerantMismatchPixels) / totalPixels) * 100,
  }
}
