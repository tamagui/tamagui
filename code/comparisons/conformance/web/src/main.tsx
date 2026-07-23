import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { cases } from '../../cases'
// NOTE: real Tailwind v4 CSS (the oracle) is imported ONLY in the tailwind branch below, never
// globally. if it were global, the tamagui leg's UNconverted classes (e.g. bare `grow`, `inset-x-0`)
// would still be styled by tailwind's stylesheet → real conversion gaps would show as false passes.
// native has no CSS fallback, so scoping the CSS to the oracle keeps web honest and matching native.

const params = new URLSearchParams(location.search)
const caseName = params.get('case')
const target = (params.get('target') ?? 'tailwind') as 'tailwind' | 'tamagui'

// ad-hoc diagnostic: ?cls=<classes> renders a single box with that className (no registry entry)
const rawCls = params.get('cls')
const found = rawCls
  ? {
      name: 'raw',
      render: ({ Box }: { Box: any }) => <Box id="cfm-root" className={rawCls} />,
    }
  : cases.find((c) => c.name === caseName)
const rootEl = document.getElementById('root')!

declare global {
  interface Window {
    __conformanceReady?: boolean
  }
}

function signalReady() {
  // wait until #cfm-root is actually laid out (Tailwind v4's CSS is injected async, so the
  // box can be unsized for a few frames). fall back after ~0.7s for genuinely-empty cases
  // (hidden, unconverted) so the harness still captures (and flags) them.
  let tries = 0
  const check = () => {
    const r = document.getElementById('cfm-root')?.getBoundingClientRect()
    if ((r && r.width > 0 && r.height > 0) || tries++ > 42) {
      window.__conformanceReady = true
    } else {
      requestAnimationFrame(check)
    }
  }
  requestAnimationFrame(() => requestAnimationFrame(check))
}

function fail(msg: string) {
  rootEl.innerHTML = `<pre style="padding:16px;font-family:monospace;color:#b00">${msg}</pre>`
  signalReady()
}

if (!found) {
  fail(`unknown case: ${String(caseName)}`)
} else if (target === 'tailwind') {
  // real Tailwind v4 (oracle): plain DOM elements + the v4 CSS, imported HERE only (see top note).
  import('./tailwind.css').then(() => {
    createRoot(rootEl).render(
      <StrictMode>{found.render({ Box: 'div', Text: 'span' })}</StrictMode>
    )
    signalReady()
  })
} else {
  // tamagui tailwind mode: same className through tamagui's runtime conversion, with NO tailwind
  // CSS on the page — so only what tamagui actually converts can style the element.
  Promise.all([import('tamagui'), import('./tamagui.config')]).then(
    ([{ TamaguiProvider, View, Text }, { default: config }]) => {
      createRoot(rootEl).render(
        <StrictMode>
          <TamaguiProvider config={config} defaultTheme="light">
            {found.render({ Box: View, Text })}
          </TamaguiProvider>
        </StrictMode>
      )
      signalReady()
    }
  )
}
