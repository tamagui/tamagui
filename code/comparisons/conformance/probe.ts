// ad-hoc diagnostic: for each className, show what tamagui's tailwind mode actually computes
// (className after conversion + computed CSS) vs what real Tailwind produces. read-only / throwaway.
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const WEB_DIR = join(HERE, 'web')
const PORT = 9111

const CLASSES = [
  'w-24',
  'width-24',
  'h-24',
  'height-24',
  'bg-red',
  'bg-indigo-500',
  'rounded-lg',
  'rounded-8',
  'p-4',
  'p-16',
  'opacity-50',
]

async function waitForServer(url: string, timeoutMs = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`server did not start: ${url}`)
}

async function read(
  page: import('playwright').Page,
  base: string,
  target: string,
  cls: string
) {
  await page.goto(`${base}/?cls=${encodeURIComponent(cls)}&target=${target}`, {
    waitUntil: 'load',
  })
  await page.waitForFunction(() => (window as any).__conformanceReady === true, {
    timeout: 20_000,
  })
  return page.evaluate(() => {
    const el = document.getElementById('cfm-root')!
    const cs = getComputedStyle(el)
    return {
      className: el.className,
      width: cs.width,
      height: cs.height,
      backgroundColor: cs.backgroundColor,
      borderRadius: cs.borderTopLeftRadius,
      padding: cs.paddingTop,
      opacity: cs.opacity,
    }
  })
}

const vite = spawn('bun', ['x', 'vite', '--port', String(PORT), '--strictPort'], {
  cwd: WEB_DIR,
  stdio: ['ignore', 'ignore', 'inherit'],
})
const base = `http://localhost:${PORT}`
try {
  await waitForServer(base + '/')
  const browser = await chromium.launch()
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  for (const cls of CLASSES) {
    const tw = await read(page, base, 'tailwind', cls)
    const tg = await read(page, base, 'tamagui', cls)
    console.log(`\n"${cls}"`)
    console.log(
      `  tailwind:  w=${tw.width} h=${tw.height} bg=${tw.backgroundColor} radius=${tw.borderRadius} p=${tw.padding} op=${tw.opacity}`
    )
    console.log(
      `  tamagui :  w=${tg.width} h=${tg.height} bg=${tg.backgroundColor} radius=${tg.borderRadius} p=${tg.padding} op=${tg.opacity}`
    )
    console.log(`  tamagui className after convert: "${tg.className}"`)
  }
  await browser.close()
} finally {
  vite.kill('SIGTERM')
}
