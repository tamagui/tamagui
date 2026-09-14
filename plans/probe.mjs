import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const root = new URL('.', import.meta.url).pathname
const html = await fs.readFile(`${root}index.html`, 'utf8')
const cssByStrategy = {
  default: `${await fs.readFile(`${root}output-default.css`, 'utf8')}\n:root { --color-red-500: rgb(255, 0, 0); --color-blue-500: rgb(0, 0, 255); --color-green-500: rgb(0, 128, 0); }`,
  class: `${await fs.readFile(`${root}output-class.css`, 'utf8')}\n:root { --color-red-500: rgb(255, 0, 0); --color-blue-500: rgb(0, 0, 255); --color-green-500: rgb(0, 128, 0); }`,
}

const cases = [
  { id: '1', classes: ['bg-red-500', 'hover:bg-blue-500'], setup: 'hover' },
  { id: '2', classes: ['hover:bg-blue-500', 'focus:bg-green-500'], setup: 'hover-focus' },
  { id: '3', classes: ['hover:bg-blue-500', 'active:bg-green-500'], setup: 'active' },
  {
    id: '4-default',
    classes: ['sm:bg-blue-500', 'dark:bg-green-500'],
    setup: 'dark',
    strategy: 'default',
    width: 800,
  },
  {
    id: '4-class',
    classes: ['sm:bg-blue-500', 'dark:bg-green-500'],
    setup: 'dark',
    strategy: 'class',
    width: 800,
  },
  {
    id: '5',
    classes: ['sm:hover:bg-blue-500', 'md:bg-green-500'],
    setup: 'hover',
    width: 900,
  },
  {
    id: '6-default',
    classes: ['sm:dark:bg-blue-500', 'md:bg-green-500'],
    setup: 'dark',
    strategy: 'default',
    width: 900,
  },
  {
    id: '6-class',
    classes: ['sm:dark:bg-blue-500', 'md:bg-green-500'],
    setup: 'dark',
    strategy: 'class',
    width: 900,
  },
  { id: '7', classes: ['sm:bg-blue-500', 'md:bg-green-500'], setup: 'none', width: 900 },
  {
    id: '8a-default',
    classes: ['dark:sm:bg-blue-500'],
    setup: 'dark',
    strategy: 'default',
    width: 800,
  },
  {
    id: '8b-default',
    classes: ['sm:dark:bg-blue-500'],
    setup: 'dark',
    strategy: 'default',
    width: 800,
  },
  {
    id: '8a-class',
    classes: ['dark:sm:bg-blue-500'],
    setup: 'dark',
    strategy: 'class',
    width: 800,
  },
  {
    id: '8b-class',
    classes: ['sm:dark:bg-blue-500'],
    setup: 'dark',
    strategy: 'class',
    width: 800,
  },
]

const browser = await chromium.launch({ headless: true })
const results = []
const rulesByStrategy = {}

for (const strategy of ['default', 'class']) {
  const page = await browser.newPage({
    viewport: { width: 900, height: 600 },
    colorScheme: 'dark',
  })
  await page.setContent(html)
  await page.locator('#probe-css').evaluate((node, css) => {
    node.textContent = css
  }, cssByStrategy[strategy])
  rulesByStrategy[strategy] = await page.evaluate(() => {
    const found = []
    let order = 0
    const walk = (rules, wrappers = []) => {
      for (const rule of rules) {
        if (rule.type === CSSRule.STYLE_RULE) {
          order += 1
          if (/background-color/.test(rule.style.cssText)) {
            found.push({
              order,
              selector: rule.selectorText,
              wrappers,
              declarations: rule.style.cssText,
            })
          }
        } else if (rule.cssRules) {
          const label =
            rule.conditionText ??
            rule.name ??
            rule.cssText.slice(0, rule.cssText.indexOf('{')).trim()
          walk(rule.cssRules, [...wrappers, label])
        }
      }
    }
    walk(document.styleSheets[0].cssRules)
    return found
  })
  await page.close()
}

for (const test of cases) {
  const strategy = test.strategy ?? 'default'
  for (const classes of [test.classes, [...test.classes].reverse()]) {
    const page = await browser.newPage({
      viewport: { width: test.width ?? 900, height: 600 },
      colorScheme: test.setup === 'dark' ? 'dark' : 'light',
    })
    await page.setContent(html)
    await page.locator('#probe-css').evaluate((node, css) => {
      node.textContent = css
    }, cssByStrategy[strategy])
    await page.locator('#target').evaluate((node, value) => {
      node.className = value
    }, classes.join(' '))
    if (strategy === 'class' && test.setup === 'dark')
      await page.locator('html').evaluate((node) => node.classList.add('dark'))
    const target = page.locator('#target')
    if (test.setup === 'hover' || test.setup === 'hover-focus' || test.setup === 'active')
      await target.hover()
    if (test.setup === 'hover-focus') await target.focus()
    if (test.setup === 'active') {
      const box = await target.boundingBox()
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
    }
    const color = await target.evaluate((node) => getComputedStyle(node).backgroundColor)
    results.push({
      id: test.id,
      strategy,
      classes: classes.join(' '),
      setup: test.setup,
      width: test.width ?? 900,
      color,
    })
    if (test.setup === 'active') await page.mouse.up()
    await page.close()
  }
}

await browser.close()
await fs.writeFile(`${root}runtime-results.json`, `${JSON.stringify(results, null, 2)}\n`)
await fs.writeFile(
  `${root}css-rules.json`,
  `${JSON.stringify(rulesByStrategy, null, 2)}\n`
)
console.log(JSON.stringify(results, null, 2))
