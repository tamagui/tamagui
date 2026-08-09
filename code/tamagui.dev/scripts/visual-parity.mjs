import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

const baselineUrl = process.env.VISUAL_BASELINE_URL || 'http://127.0.0.1:8081'
const candidateUrl = process.env.VISUAL_CANDIDATE_URL || 'http://127.0.0.1:8082'
const outputDirectory = resolve(
  process.env.VISUAL_OUTPUT_DIR || '/tmp/tamagui-site-visual-parity'
)
const routeFilter = process.env.VISUAL_ROUTE
const viewportFilter = process.env.VISUAL_VIEWPORT
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)

const routes = [
  { name: 'home', path: '/' },
  { name: 'docs', path: '/docs/intro/introduction' },
  { name: 'component', path: '/ui/button' },
  { name: 'blog-index', path: '/blog' },
  { name: 'blog-post', path: '/blog/version-two' },
  { name: 'takeout', path: '/takeout' },
  { name: 'bento', path: '/bento' },
  { name: 'theme', path: '/theme' },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 1 },
]

const selectedRoutes = routeFilter
  ? routes.filter(({ name }) => name === routeFilter)
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

try {
  for (const viewport of selectedViewports) {
    for (const route of selectedRoutes) {
      const pair = {}

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
              waitUntil: 'networkidle2',
              timeout: 120_000,
            })
            if (!response?.ok()) {
              throw new Error(`${target.name} ${url} returned ${response?.status()}`)
            }

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
            // Let intersection-driven demos and smooth-scrolling carousels reach
            // the same settled state after the full-page discovery scroll.
            await new Promise((resolve) => setTimeout(resolve, 1_000))
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
        await new Promise((resolve) => setTimeout(resolve, 250))

        const screenshotPath = resolve(
          outputDirectory,
          `${route.name}-${viewport.name}-${target.name}.png`
        )
        await page.screenshot({ path: screenshotPath, fullPage: true })
        const dimensions = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          title: document.title,
        }))
        pair[target.name] = { screenshotPath, dimensions, consoleErrors }
        await page.close()
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

const report = {
  generatedAt: new Date().toISOString(),
  baselineUrl,
  candidateUrl,
  outputDirectory,
  threshold: 16,
  aggregate: aggregateResults(results),
  results,
}

const reportPath = resolve(outputDirectory, 'report.json')
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.info(`Report: ${reportPath}`)

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
    exactSimilarityPercent: ((totalPixels - exactMismatchPixels) / totalPixels) * 100,
    tolerantSimilarityPercent:
      ((totalPixels - tolerantMismatchPixels) / totalPixels) * 100,
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
