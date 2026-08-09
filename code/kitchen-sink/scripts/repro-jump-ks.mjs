// fast-hop jump repro against kitchen-sink TooltipPositionJumpCase (motion
// driver). loops the jan-2026 protocol until a single-frame teleport is
// caught, then dumps the frames around it with inline vs computed transform.
import { chromium } from '@playwright/test'

const URL =
  process.env.URL ||
  'http://localhost:7979/?test=TooltipPositionJumpCase&animationDriver=motion'
const ROUNDS = Number(process.env.ROUNDS || 10)

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', (m) => {
  const t = m.text()
  if (t.includes('[jump]')) console.log(t)
})

await page.addInitScript(() => {
  window.__frames = []
  window.__mutations = []
  let nextId = 1
  // trap hoist-style static copying onto memo wrappers to find who creates
  // the memo(TooltipContent) wrapper (getters aren't invoked by that path,
  // but defineProperty is)
  const origDefine = Object.defineProperty
  Object.defineProperty = function (target, prop, desc) {
    try {
      if (
        (prop === 'staticConfig' || prop === '__dbgStamp' || prop === '__trapProp') &&
        target &&
        target.$$typeof &&
        String(target.$$typeof) === 'Symbol(react.memo)'
      ) {
        window.__mutations.push({
          t: performance.now(),
          type: 'define-on-memo',
          id: String(prop),
          stack: String(new Error().stack || '').slice(0, 2500),
        })
      }
    } catch {}
    return origDefine.call(Object, target, prop, desc)
  }
  const origDefines = Object.defineProperties
  Object.defineProperties = function (target, descs) {
    try {
      if (
        target &&
        target.$$typeof &&
        String(target.$$typeof) === 'Symbol(react.memo)' &&
        descs &&
        ('staticConfig' in descs || '__dbgStamp' in descs)
      ) {
        window.__mutations.push({
          t: performance.now(),
          type: 'defines-on-memo',
          id: Object.keys(descs).slice(0, 10).join(','),
          stack: String(new Error().stack || '').slice(0, 2500),
        })
      }
    } catch {}
    return origDefines.call(Object, target, descs)
  }
  // time exact add/remove of popper content nodes
  const mo = new MutationObserver((records) => {
    for (const rec of records) {
      // theme class changes on portal roots / theme wrappers near the tooltip
      if (rec.type === 'attributes') {
        const el = rec.target
        const cls = String(el.className || '')
        const oldCls = String(rec.oldValue || '')
        const themed = (s) => (s.match(/t_[\w-]+/g) || []).join(' ')
        if (themed(cls) !== themed(oldCls)) {
          window.__mutations.push({
            t: performance.now(),
            type: 'theme-class',
            tag: el.tagName,
            from: themed(oldCls),
            to: themed(cls),
            hasTooltip: !!el.querySelector?.('[data-popper-animate-position]'),
          })
        }
        continue
      }
      for (const n of rec.addedNodes) {
        if (n.nodeType !== 1) continue
        const trig = n.matches?.('a[href="/takeout"],a[href="/bento"]')
          ? [n]
          : Array.from(n.querySelectorAll?.('a[href="/takeout"],a[href="/bento"]') || [])
        for (const el of trig) {
          window.__mutations.push({
            t: performance.now(),
            type: 'trigger-add',
            id: el.getAttribute('href'),
          })
        }
        const els = n.matches?.('[data-popper-animate-position]')
          ? [n]
          : Array.from(n.querySelectorAll?.('[data-popper-animate-position]') || [])
        for (const el of els) {
          if (!el.__reproId) el.__reproId = 'm' + nextId++
          window.__mutations.push({
            t: performance.now(),
            type: 'add',
            id: el.__reproId,
            inline: el.style.transform,
          })
        }
      }
      for (const n of rec.removedNodes) {
        if (n.nodeType !== 1) continue
        const trigR = n.matches?.('a[href="/takeout"],a[href="/bento"]')
          ? [n]
          : Array.from(n.querySelectorAll?.('a[href="/takeout"],a[href="/bento"]') || [])
        for (const el of trigR) {
          window.__mutations.push({
            t: performance.now(),
            type: 'trigger-remove',
            id: el.getAttribute('href'),
          })
        }
        const els = n.matches?.('[data-popper-animate-position]')
          ? [n]
          : Array.from(n.querySelectorAll?.('[data-popper-animate-position]') || [])
        for (const el of els) {
          window.__mutations.push({
            t: performance.now(),
            type: 'remove',
            id: el.__reproId,
            inline: el.style.transform,
            text: (el.textContent || '').slice(0, 25),
          })
        }
      }
    }
  })
  const startMo = () => {
    if (document.body)
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
      })
    else requestAnimationFrame(startMo)
  }
  startMo()
  const sample = () => {
    const el = document.querySelector('[data-popper-animate-position]')
    if (el) {
      if (!el.__reproId) el.__reproId = nextId++
      const r = el.getBoundingClientRect()
      window.__frames.push({
        t: performance.now(),
        id: el.__reproId,
        x: r.left,
        y: r.top,
        inline: el.style.transform,
        computed: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
        anims: el.getAnimations().length,
        text: (el.textContent || '').slice(0, 40),
      })
    } else {
      window.__frames.push({ t: performance.now(), gone: true })
    }
    requestAnimationFrame(sample)
  }
  requestAnimationFrame(sample)
})

const PROMO = process.env.PROMO === '1'
await page.goto(URL, { waitUntil: 'domcontentloaded' })
const sels = PROMO
  ? ['a[href="/takeout"]', 'a[href="/bento"]', 'a[href="https://addeven.com"]']
  : [
      '[data-testid="tooltip-trigger-takeout"]',
      '[data-testid="tooltip-trigger-bento"]',
      '[data-testid="tooltip-trigger-hire"]',
    ]
await page.waitForSelector(sels[0], { timeout: 20000 })
await page.waitForTimeout(PROMO ? 6000 : 1000)

const box = async (sel) => await page.locator(sel).first().boundingBox()
const tb = await box(sels[0])
const bb = await box(sels[1])
const hb = await box(sels[2])
const y = tb.y + tb.height / 2
const L = tb.x + tb.width / 2
const M = bb.x + bb.width / 2
const R = hb.x + hb.width / 2

let found = 0
for (let round = 1; round <= ROUNDS; round++) {
  const midMs = 24 + (round % 6) * 8
  await page.mouse.move(200, 600)
  await page.waitForTimeout(600)
  const [start, end] = round % 2 === 1 ? [R, L] : [L, R]
  await page.mouse.move(start, y - 80, { steps: 2 })
  await page.mouse.move(start, y, { steps: 3 })
  await page.waitForTimeout(1200)
  await page.mouse.move((start + M) / 2, y)
  await page.waitForTimeout(8)
  await page.mouse.move(M, y)
  await page.waitForTimeout(midMs)
  await page.mouse.move((M + end) / 2, y)
  await page.waitForTimeout(8)
  await page.mouse.move(end, y)
  await page.waitForTimeout(700)

  const { frames, mutations, pplog } = await page.evaluate(() => {
    const out = {
      frames: window.__frames,
      mutations: window.__mutations,
      pplog: window.__pplog || [],
    }
    window.__frames = []
    window.__mutations = []
    window.__pplog = []
    return out
  })
  for (const m of pplog) {
    if (String(m.ev).includes('promo-tooltip')) {
      console.log(
        `  [round ${round}] t=${Math.round(m.t)} ${m.ev} ${JSON.stringify(m).slice(0, 2600)}`
      )
    }
  }
  let prev = null
  let prevIdx = -1
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    if (f.gone) {
      prev = null
      continue
    }
    if (prev) {
      const d = Math.hypot(f.x - prev.x, f.y - prev.y)
      if (d > 100) {
        found++
        console.log(
          `\n=== round ${round} dir=${start === R ? 'R->L' : 'L->R'} midMs=${midMs} JUMP d=${Math.round(d)} ===`
        )
        console.log('  mutations near jump:')
        for (const m of mutations) {
          if (Math.abs(m.t - f.t) < 400) {
            console.log(
              `    t=${Math.round(m.t)} ${m.type} id=${m.id} inline="${m.inline || ''}" ${m.text ? `text="${m.text}"` : ''}`
            )
            if (m.stack)
              console.log(`      stack: ${m.stack.split('\n').slice(0, 12).join(' <- ')}`)
          }
        }
        console.log('  pplog near jump:')
        for (const m of pplog) {
          if (Math.abs(m.t - f.t) < 500) {
            const { t, ev, ...restEv } = m
            console.log(`    t=${Math.round(t)} ${ev} ${JSON.stringify(restEv)}`)
          }
        }
        for (
          let k = Math.max(0, prevIdx - 4);
          k <= Math.min(frames.length - 1, i + 4);
          k++
        ) {
          const g = frames[k]
          if (g.gone) {
            console.log(`  [${k}] t=${Math.round(g.t)} GONE`)
          } else {
            console.log(
              `  [${k}] t=${Math.round(g.t)} id=${g.id} x=${Math.round(g.x)} y=${Math.round(g.y)} o=${g.opacity} anims=${g.anims} text="${g.text.slice(0, 20)}" inline="${g.inline}" computed="${g.computed}"`
            )
          }
        }
      }
    }
    prev = f
    prevIdx = i
  }
}
console.log(`\ntotal jumps found: ${found}`)
await browser.close()
