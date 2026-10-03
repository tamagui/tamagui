import { chromium } from '@playwright/test'
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = import.meta.dirname
const excludeReact = process.env.BUNDLE_EXCLUDE_REACT === '1'
const baseline = join(root, 'results', 'react-baseline')
const imports: Record<string, string> = {}
if (excludeReact) {
  const entries = {
    react: 'react',
    'react-dom': 'react-dom',
    client: 'react-dom/client',
    'jsx-runtime': 'react/jsx-runtime',
    scheduler: 'scheduler',
  }
  const entrypoints = []
  for (const [file, pkg] of Object.entries(entries)) {
    const input = join(root, 'results', 'react-inputs', `${file}.ts`)
    mkdirSync(join(root, 'results', 'react-inputs'), { recursive: true })
    writeFileSync(input, `export * from '${pkg}'; export { default } from '${pkg}';`)
    entrypoints.push(input)
    imports[pkg] = `/react-baseline/${file}.js`
  }
  const built = await Bun.build({
    entrypoints,
    outdir: baseline,
    target: 'browser',
    splitting: true,
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
  })
  if (!built.success) throw new Error(built.logs.join('\n'))
}
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const arm of process.argv.length > 2
    ? process.argv.slice(2)
    : ['tamagui', 'nativewind', 'uniwind']) {
    const dist = join(root, arm, excludeReact ? 'dist-no-react' : 'dist')
    const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8')
    const server = Bun.serve({
      port: 0,
      fetch(request) {
        const pathname = new URL(request.url).pathname
        if (excludeReact && pathname.startsWith('/react-baseline/'))
          return new Response(
            Bun.file(join(baseline, pathname.slice('/react-baseline/'.length)))
          )
        if (excludeReact && pathname === '/')
          return new Response(
            indexHtml.replace(
              '</head>',
              `<script type="importmap">${JSON.stringify({ imports })}</script></head>`
            ),
            { headers: { 'content-type': 'text/html' } }
          )
        const path = join(dist, pathname)
        const file = path.endsWith('/') ? join(path, 'index.html') : path
        return existsSync(file)
          ? new Response(Bun.file(file))
          : new Response('missing', { status: 404 })
      },
    })
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(String(error)))
    try {
      await page.goto(`http://localhost:${server.port}/`, { waitUntil: 'networkidle' })
      await page.getByText('Small app', { exact: true }).waitFor()
      await page.getByRole('button', { name: 'Increment' }).click()
      await page.getByText('Count: 1', { exact: true }).waitFor()
      const styles = await page
        .getByText('Small app', { exact: true })
        .evaluate((element) => {
          const text = getComputedStyle(element)
          const card = getComputedStyle(element.parentElement!)
          return {
            fontSize: text.fontSize,
            fontWeight: text.fontWeight,
            color: text.color,
            padding: card.padding,
            gap: card.gap,
            borderRadius: card.borderRadius,
            background: card.backgroundColor,
          }
        })
      const expected = {
        fontSize: '20px',
        fontWeight: '700',
        color: 'rgb(0, 0, 0)',
        padding: '16px',
        gap: '16px',
        borderRadius: '8px',
        background: 'rgb(255, 255, 255)',
      }
      for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
        const value = expected[key]
        if (styles[key] !== value)
          throw new Error(`${arm}: ${key} ${styles[key]} != ${value}`)
      }
      if (errors.length) throw new Error(errors.join('\n'))
      mkdirSync(join(root, 'results'), { recursive: true })
      await page.screenshot({
        path: join(root, 'results', `${arm}${excludeReact ? '-no-react' : ''}.png`),
      })
      let themeCSS: string | undefined
      if (arm === 'tamagui') {
        themeCSS = await page.evaluate(() => {
          const node = document.createElement('div')
          node.style.backgroundColor = 'var(--background)'
          node.className = 't_light'
          document.body.append(node)
          const light = getComputedStyle(node).backgroundColor
          node.className = 't_dark'
          const dark = getComputedStyle(node).backgroundColor
          node.remove()
          return `${light}/${dark}`
        })
        if (themeCSS !== 'rgb(255, 255, 255)/rgb(17, 17, 17)')
          throw new Error(`theme CSS: ${themeCSS}`)
      }
      results.push({
        arm,
        status: 'RAN',
        command: `${excludeReact ? 'BUNDLE_EXCLUDE_REACT=1 ' : ''}bun code/comparisons/tailwind-bundle/probe.ts`,
        count: 1,
        styles,
        themeCSS,
        errors,
      })
    } finally {
      await page.close()
      server.stop()
    }
  }
} finally {
  await browser.close()
}
writeFileSync(
  join(root, 'results', excludeReact ? 'probe-no-react.json' : 'probe.json'),
  JSON.stringify(results, null, 2) + '\n'
)
console.log(JSON.stringify(results, null, 2))
