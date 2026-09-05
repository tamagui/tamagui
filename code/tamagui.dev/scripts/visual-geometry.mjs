import { writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const baselineUrl = process.env.VISUAL_BASELINE_URL || 'http://127.0.0.1:8081'
const candidateUrl = process.env.VISUAL_CANDIDATE_URL || 'http://127.0.0.1:8082'
const route = process.env.VISUAL_PATH || '/'
const width = Number(process.env.VISUAL_WIDTH || 1440)
const height = Number(process.env.VISUAL_HEIGHT || 900)
const outputPath =
  process.env.VISUAL_GEOMETRY_OUTPUT || '/tmp/tamagui-visual-geometry.json'
const inspectClass = process.env.VISUAL_CLASS
const inspectText = process.env.VISUAL_TEXT
const inspectSource = process.env.VISUAL_SOURCE
const inspectTag = process.env.VISUAL_TAG || '*'
const inspectRulePattern = process.env.VISUAL_RULE_PATTERN || '(?:margin|font-weight)'
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)

const browser = await puppeteer.launch({ headless: true, executablePath })
const snapshots = {}

try {
  for (const target of [
    { name: 'v2', baseUrl: baselineUrl },
    { name: 'v3', baseUrl: candidateUrl },
  ]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
    await page.goto(new URL(route, target.baseUrl).href, {
      waitUntil: 'networkidle2',
      timeout: 120_000,
    })
    snapshots[target.name] = await page.evaluate(async () => {
      await document.fonts.ready
      return [
        ...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,pre,button,a,li,span'),
      ].map((element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return {
          tag: element.tagName.toLowerCase(),
          text: (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160),
          source: element.getAttribute('data-one-source'),
          className: element.getAttribute('class'),
          parentClasses: [
            ...(element.parentElement?.closest('[class*="t_"]')?.classList || []),
          ],
          inlineStyle: element.getAttribute('style'),
          variables: Object.fromEntries(
            ['--background', '--color', '--t-background', '--t-color'].map((name) => [
              name,
              style.getPropertyValue(name),
            ])
          ),
          rect: {
            x: rect.x,
            y: rect.y + scrollY,
            width: rect.width,
            height: rect.height,
          },
          style: Object.fromEntries(
            [
              'display',
              'position',
              'font-family',
              'font-size',
              'font-weight',
              'line-height',
              'letter-spacing',
              'color',
              'background-color',
              'margin-top',
              'margin-right',
              'margin-bottom',
              'margin-left',
              'padding-top',
              'padding-right',
              'padding-bottom',
              'padding-left',
              'gap',
              'transform',
            ].map((property) => [property, style.getPropertyValue(property)])
          ),
        }
      })
    })
    snapshots[`${target.name}RootVariables`] = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return Object.fromEntries(
        ['--c-space-8', '--t-space-8', '--c-color8', '--t-color8'].map((name) => [
          name,
          style.getPropertyValue(name),
        ])
      )
    })
    if (inspectSource) {
      snapshots[`${target.name}SourceMatches`] = await page.evaluate((sourceFragment) => {
        return [...document.querySelectorAll('[data-one-source]')]
          .filter((element) =>
            element.getAttribute('data-one-source')?.includes(sourceFragment)
          )
          .map((element) => {
            const style = getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return {
              tag: element.tagName.toLowerCase(),
              text: (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
              source: element.getAttribute('data-one-source'),
              className: element.getAttribute('class'),
              rect: {
                x: rect.x,
                y: rect.y + scrollY,
                width: rect.width,
                height: rect.height,
              },
              style: Object.fromEntries(
                [
                  'background-color',
                  'border-color',
                  'border-radius',
                  'box-shadow',
                  'font-family',
                  'font-size',
                  'font-weight',
                  'letter-spacing',
                  'line-height',
                  'padding-left',
                  'padding-right',
                ].map((property) => [property, style.getPropertyValue(property)])
              ),
            }
          })
      }, inspectSource)
    }
    if (inspectClass) {
      snapshots[`${target.name}Rules`] = await page.evaluate((className) => {
        const matches = []
        const visit = (rules) => {
          for (const rule of rules || []) {
            if (rule.cssText?.includes(`.${className}`)) matches.push(rule.cssText)
            if ('cssRules' in rule) visit(rule.cssRules)
          }
        }
        for (const sheet of document.styleSheets) {
          try {
            visit(sheet.cssRules)
          } catch {}
        }
        return matches
      }, inspectClass)
    }
    if (inspectText) {
      snapshots[`${target.name}MatchedRules`] = await page.evaluate(
        ({ tag, text, rulePattern }) => {
          const element = [...document.querySelectorAll(tag)].find(
            (candidate) =>
              (candidate.textContent || '').replace(/\s+/g, ' ').trim() === text
          )
          if (!element) return []
          const matches = []
          const pattern = new RegExp(rulePattern)
          const visit = (rules, parents = [], sheet = null) => {
            for (const rule of rules || []) {
              if ('selectorText' in rule) {
                try {
                  if (
                    element.matches(rule.selectorText) &&
                    pattern.test(rule.style?.cssText || '')
                  ) {
                    matches.push({ sheet, parents, cssText: rule.cssText })
                  }
                } catch {}
              }
              if ('cssRules' in rule) {
                visit(
                  rule.cssRules,
                  [...parents, rule.cssText.split('{', 1)[0].trim()],
                  sheet
                )
              }
            }
          }
          for (const sheet of document.styleSheets) {
            try {
              visit(
                sheet.cssRules,
                [],
                sheet.href ||
                  sheet.ownerNode?.getAttribute?.('data-vite-dev-id') ||
                  'inline'
              )
            } catch {}
          }
          return matches
        },
        { tag: inspectTag, text: inspectText, rulePattern: inspectRulePattern }
      )
    }
    await page.close()
  }
} finally {
  await browser.close()
}

const baselineByKey = indexSnapshot(snapshots.v2)
const candidateByKey = indexSnapshot(snapshots.v3)
const comparisons = []

for (const [key, baseline] of baselineByKey) {
  const candidate = candidateByKey.get(key)
  if (!candidate) continue
  const rectDelta = Object.fromEntries(
    Object.keys(baseline.rect).map((property) => [
      property,
      candidate.rect[property] - baseline.rect[property],
    ])
  )
  const styleDelta = Object.fromEntries(
    Object.keys(baseline.style)
      .filter((property) => baseline.style[property] !== candidate.style[property])
      .map((property) => [
        property,
        { baseline: baseline.style[property], candidate: candidate.style[property] },
      ])
  )
  comparisons.push({ key, baseline, candidate, rectDelta, styleDelta })
}

comparisons.sort((a, b) => score(b) - score(a))
const report = {
  route,
  viewport: { width, height },
  counts: {
    baseline: snapshots.v2.length,
    candidate: snapshots.v3.length,
    matched: comparisons.length,
  },
  inspectedRules: inspectClass
    ? { baseline: snapshots.v2Rules, candidate: snapshots.v3Rules }
    : undefined,
  rootVariables: {
    baseline: snapshots.v2RootVariables,
    candidate: snapshots.v3RootVariables,
  },
  matchedRules: inspectText
    ? { baseline: snapshots.v2MatchedRules, candidate: snapshots.v3MatchedRules }
    : undefined,
  sourceMatches: inspectSource
    ? { baseline: snapshots.v2SourceMatches, candidate: snapshots.v3SourceMatches }
    : undefined,
  comparisons,
}
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)

console.info(JSON.stringify({ ...report.counts, outputPath }, null, 2))
for (const comparison of comparisons.slice(0, 40)) {
  const { baseline, rectDelta, styleDelta } = comparison
  console.info(
    JSON.stringify({
      element: `${baseline.tag} ${baseline.text.slice(0, 70)}`,
      source: baseline.source,
      baselineRect: baseline.rect,
      rectDelta,
      styleDelta,
    })
  )
}

function indexSnapshot(entries) {
  const counts = new Map()
  return new Map(
    entries.map((entry) => {
      const signature = `${entry.tag}|${entry.text}`
      const count = counts.get(signature) || 0
      counts.set(signature, count + 1)
      return [`${signature}|${count}`, entry]
    })
  )
}

function score(comparison) {
  const { x, y, width, height } = comparison.rectDelta
  return (
    Math.abs(x) +
    Math.abs(y) +
    Math.abs(width) +
    Math.abs(height) +
    Object.keys(comparison.styleDelta).length * 20
  )
}
