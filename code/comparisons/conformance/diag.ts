import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const PORT = 9112
const vite = spawn('bun', ['x', 'vite', '--port', String(PORT), '--strictPort'], {
  cwd: join(HERE, 'web'),
  stdio: ['ignore', 'ignore', 'inherit'],
})
const base = `http://localhost:${PORT}`
async function waitFor(url: string) {
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
}
try {
  await waitFor(base + '/')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${base}/?case=bg-emerald&target=tailwind`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const info = await page.evaluate(() => {
    const el = document.getElementById('cfm-root')!
    const cs = getComputedStyle(el)
    let ruleCount = 0
    let hasEmerald = false
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          ruleCount++
          if (rule.cssText.includes('emerald-400') || rule.cssText.includes('.w-16')) hasEmerald = true
        }
      } catch {}
    }
    return {
      className: el.className,
      width: cs.width, height: cs.height, bg: cs.backgroundColor,
      styleSheets: document.styleSheets.length, ruleCount, hasEmeraldOrW16: hasEmerald,
      ready: (window as any).__conformanceReady,
    }
  })
  console.log(JSON.stringify(info, null, 2))
  await browser.close()
} finally {
  vite.kill('SIGTERM')
}
