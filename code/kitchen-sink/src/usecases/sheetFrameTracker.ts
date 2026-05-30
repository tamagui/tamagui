/**
 * High-fidelity frame + gesture tracker for the Sheet web-keyboard fixture.
 *
 * Records, on ONE monotonic timeline, both the sheet's measured geometry (every
 * animation frame, via getBoundingClientRect — which reflects transforms) and
 * the raw touch / focus / onLayout input that drives it. Batches are POSTed to
 * the local collector (scripts/sheet-collector.ts) so a run on the real iOS sim
 * persists to disk and can be crunched out-of-browser — no video.
 *
 * Activated by ?track=1 on SheetWebKeyboardCase. onLayout is fed in from the
 * fixture's <Sheet.Frame>/<Sheet.ScrollView> via reportSheetLayout(); everything
 * else is wired here.
 *
 * Sample kinds (short keys keep the JSONL small):
 *   k:'pos'   measured geometry — fT/fB/fH frame top/bottom/height (visual),
 *             sT scrollTop, sH clientHeight, sC scrollHeight,
 *             iT/iB focused-input top/bottom, vv visualViewport.height,
 *             vo offsetTop, in innerHeight, kb (in-vv) keyboard height
 *   k:'touch' e:start|move|end, x, y, tg testid under the point
 *   k:'focus' e:in|out, tg testid
 *   k:'layout' who:frame|scroll, x,y,w,h  (Tamagui onLayout, layout box)
 *   k:'mark'  m: label  (host-driven phase marker via window.__mark)
 */

type Sample = Record<string, unknown> & { seq: number; t: number; k: string }

let started = false
let seq = 0
let buf: Sample[] = []
let raf = 0
let flushTimer: any = 0
const COLLECTOR =
  (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('collector')) ||
  'http://localhost:7980'

const now = () => Math.round(performance.now())
const ri = (n: number) => Math.round(n)

function push(s: Omit<Sample, 'seq' | 't'>) {
  buf.push({ seq: seq++, t: now(), ...s } as Sample)
}

function testidUnder(x: number, y: number): string {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  let n: HTMLElement | null = el
  while (n) {
    const id = n.getAttribute?.('data-testid')
    if (id) return id
    n = n.parentElement
  }
  return ''
}

function flush(beacon = false) {
  if (!buf.length) return
  const batch = buf
  buf = []
  const body = JSON.stringify(batch)
  try {
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(
        `${COLLECTOR}/collect`,
        new Blob([body], { type: 'text/plain' })
      )
    } else {
      // string body => text/plain;charset=UTF-8 => a "simple" request, no preflight
      fetch(`${COLLECTOR}/collect`, { method: 'POST', body, keepalive: true }).catch(
        () => {}
      )
    }
  } catch {}
}

// only emit a pos sample when something we track actually changed, so the log is
// a clean trajectory rather than a heartbeat. keyboard transitions always emit.
let last = {
  fT: NaN,
  fB: NaN,
  fH: NaN,
  sT: NaN,
  iB: NaN,
  pB: NaN,
  vv: NaN,
}

function measure() {
  // match either the tap-to-focus fixture (sheet-web-kb-*) or the
  // autofocus-on-open fixture (sheet-web-kb-af-*); only one is mounted at a time.
  const frame = (document.querySelector('[data-testid="sheet-web-kb-frame"]') ||
    document.querySelector('[data-testid="sheet-web-kb-af-frame"]')) as HTMLElement | null
  // nothing to track until the sheet's frame is mounted (avoids a NaN flood
  // while the sheet is closed)
  if (!frame) return
  const scroll = (document.querySelector('[data-testid="sheet-web-kb-scrollview"]') ||
    document.querySelector(
      '[data-testid="sheet-web-kb-af-scrollview"]'
    )) as HTMLElement | null
  const vvObj = window.visualViewport
  const inn = ri(window.innerHeight)
  const vv = vvObj ? ri(vvObj.height) : inn
  const vo = vvObj ? ri(vvObj.offsetTop) : 0
  const kb = Math.max(0, inn - vv)

  const fr = frame.getBoundingClientRect()
  const fT = ri(fr.top)
  const fB = ri(fr.bottom)
  const fH = ri(fr.height)
  let sT = NaN,
    sH = NaN,
    sC = NaN
  if (scroll) {
    sT = ri(scroll.scrollTop)
    sH = ri(scroll.clientHeight)
    sC = ri(scroll.scrollHeight)
  }
  // focused input inside the sheet
  let iT = NaN,
    iB = NaN
  const a = document.activeElement as HTMLElement | null
  if (
    a &&
    frame &&
    frame.contains(a) &&
    (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')
  ) {
    const r = a.getBoundingClientRect()
    iT = ri(r.top)
    iB = ri(r.bottom)
  }

  // the submit/post button (fixed testid). its clearance above the keyboard is
  // the real success metric — the primary action must be reachable, not occluded.
  // tracked independent of focus so we can read it straight from the telemetry.
  let pT = NaN,
    pB = NaN
  const post = (document.querySelector('[data-testid="sheet-web-kb-post"]') ||
    document.querySelector('[data-testid="sheet-web-kb-af-post"]')) as HTMLElement | null
  if (post) {
    const pr = post.getBoundingClientRect()
    pT = ri(pr.top)
    pB = ri(pr.bottom)
  }

  // NaN-safe inequality: NaN vs NaN counts as equal (no spurious change)
  const ne = (a: number, b: number) =>
    Number.isNaN(a) && Number.isNaN(b) ? false : a !== b
  const changed =
    ne(fT, last.fT) ||
    ne(fB, last.fB) ||
    ne(fH, last.fH) ||
    ne(sT, last.sT) ||
    ne(iB, last.iB) ||
    ne(pB, last.pB) ||
    ne(vv, last.vv)
  if (changed) {
    last = { fT, fB, fH, sT, iB, pB, vv }
    const ae = document.activeElement
    const aeTag = ae ? ae.tagName : ''
    const de = document.documentElement.clientHeight
    push({
      k: 'pos',
      fT,
      fB,
      fH,
      sT,
      sH,
      sC,
      iT,
      iB,
      pT,
      pB,
      vv,
      vo,
      in: inn,
      kb,
      ae: aeTag,
      de,
    })
  }
}

function loop() {
  measure()
  raf = requestAnimationFrame(loop)
}

export function reportSheetLayout(who: 'frame' | 'scroll', e: any) {
  if (!started) return
  const l = e?.nativeEvent?.layout
  if (!l) return
  push({ k: 'layout', who, x: ri(l.x), y: ri(l.y), w: ri(l.width), h: ri(l.height) })
}

export function startSheetTracker() {
  if (started || typeof window === 'undefined') return
  started = true

  const onTouch = (type: 'start' | 'move' | 'end') => (ev: TouchEvent) => {
    const t = ev.changedTouches?.[0] || ev.touches?.[0]
    const x = t ? ri(t.clientX) : NaN
    const y = t ? ri(t.clientY) : NaN
    push({ k: 'touch', e: type, x, y, tg: Number.isNaN(x) ? '' : testidUnder(x, y) })
    // capture the resulting geometry on the same frame as the input
    measure()
  }
  document.addEventListener('touchstart', onTouch('start'), {
    capture: true,
    passive: true,
  })
  document.addEventListener('touchmove', onTouch('move'), {
    capture: true,
    passive: true,
  })
  document.addEventListener('touchend', onTouch('end'), { capture: true, passive: true })

  document.addEventListener(
    'focusin',
    (e) => {
      const tg = (e.target as HTMLElement)?.getAttribute?.('data-testid') || ''
      push({ k: 'focus', e: 'in', tg })
    },
    true
  )
  document.addEventListener(
    'focusout',
    (e) => {
      const tg = (e.target as HTMLElement)?.getAttribute?.('data-testid') || ''
      push({ k: 'focus', e: 'out', tg })
    },
    true
  )

  // host-driven phase markers: window.__mark('open') from idb-driven runs
  ;(window as any).__mark = (m: string) => push({ k: 'mark', m })

  window.visualViewport?.addEventListener('resize', () => measure())
  window.addEventListener('pagehide', () => flush(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })

  flushTimer = setInterval(() => flush(false), 100)
  raf = requestAnimationFrame(loop)
  push({ k: 'mark', m: 'tracker-start' })
}

export function stopSheetTracker() {
  if (!started) return
  started = false
  cancelAnimationFrame(raf)
  clearInterval(flushTimer)
  flush(true)
}
