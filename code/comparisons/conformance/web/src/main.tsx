import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { cases } from '../../cases'

const params = new URLSearchParams(location.search)
const caseName = params.get('case')
const target = (params.get('target') ?? 'tailwind') as 'tailwind' | 'tamagui'

const found = cases.find((c) => c.name === caseName)
const rootEl = document.getElementById('root')!

declare global {
  interface Window {
    __conformanceReady?: boolean
  }
}

function signalReady() {
  // two frames so layout + any injected CSS settle before the harness screenshots
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      window.__conformanceReady = true
    })
  )
}

function fail(msg: string) {
  rootEl.innerHTML = `<pre style="padding:16px;font-family:monospace;color:#b00">${msg}</pre>`
  signalReady()
}

if (!found) {
  fail(`unknown case: ${String(caseName)}`)
} else if (target === 'tailwind') {
  // real Tailwind (oracle): plain DOM + local Tailwind v3 (postcss JIT, scans cases.tsx).
  // dynamic import so preflight/utilities load ONLY for this leg, never the tamagui leg.
  import('./tailwind.css').then(() => {
    createRoot(rootEl).render(
      <StrictMode>{found.render({ Box: 'div', Text: 'span' })}</StrictMode>
    )
    signalReady()
  })
} else {
  // tamagui tailwind mode: same className through tamagui's runtime conversion.
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
