import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from '@tamagui/core'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server.browser'
import { TamaguiProvider, useTheme } from 'tamagui'
import { SPELLINGS, config as serverConfig } from '../tamagui.hydration.config'

/**
 * The hydration premise, in a real browser.
 *
 * `normalizeThemeValue` used to rewrite every theme color into one `rgba()`
 * form, which collapsed equivalent spellings onto one variable AND made an
 * SSR-hydrated theme value compare equal to a client-computed one. `359e29cc83`
 * removed it. The collapse is restored at CSS-generation time; this is the
 * other half, the part that says a server render and a client hydrate still
 * agree about the value.
 *
 * jsdom cannot host it. It returns "" from
 * `getComputedStyle(body).getPropertyValue('--x')` and reformats a rule's
 * cssText, and both are load bearing for the path that reads theme values back
 * out of the document.
 *
 * One scenario per page load, selected by `?case=`, because `scanAllSheets`
 * caches per stylesheet. Sharing a document between scenarios would let a
 * cached scan answer for a document it never read.
 *
 * The page parses exactly one config for rendering. A second `createTamagui`
 * call does not take over the global theme state, so a "client config" built
 * in the same page renders the first config's values and every render
 * assertion would be vacuous. The mismatched server payload is produced by
 * changing the server's own markup instead, which is what a divergence looks
 * like from the client's side anyway.
 */

const THEME_KEYS = Object.keys(SPELLINGS) as (keyof typeof SPELLINGS)[]

/**
 * The browser is the oracle for "same color". Two spellings are equal when the
 * engine computes the same used value, which is the only definition that
 * matters for what a user sees, and it needs no color parser in the fixture.
 */
const probeEl = document.createElement('span')
document.body.appendChild(probeEl)
const asColor = (value: string) => {
  probeEl.style.color = ''
  probeEl.style.color = value
  return getComputedStyle(probeEl).color
}

function Probe() {
  const theme = useTheme()
  // the raw theme value reaches both the inline style and the text, so a
  // server/client divergence in the spelling is a hydration mismatch React has
  // to report, not something a class name can hide
  return (
    <div
      data-testid="probe"
      style={{ background: `${theme.background?.val}`, color: `${theme.color?.val}` }}
    >
      {THEME_KEYS.map((key) => (
        <span key={key} data-key={key}>
          {`${theme[key]?.val}`}
        </span>
      ))}
    </div>
  )
}

const tree = (
  <TamaguiProvider config={serverConfig} defaultTheme="light">
    <Probe />
  </TamaguiProvider>
)

/** the names-only client projection: every theme key present, no values */
const namesOnly = () =>
  Object.fromEntries(
    Object.keys(serverConfig.themes).map((name) => [
      name,
      Object.fromEntries(
        Object.keys(serverConfig.themes[name]).map((key) => [key, undefined])
      ),
    ])
  )

const themeValues = (config: any, themeName: string) =>
  Object.fromEntries(
    THEME_KEYS.map((key) => [key, `${config.themes[themeName]?.[key]?.val}`])
  )

const probeMarkup = (html: string) => {
  const host = document.createElement('div')
  host.innerHTML = html
  return host.querySelector('[data-testid="probe"]')?.outerHTML ?? ''
}

async function run() {
  const scenario = new URLSearchParams(location.search).get('case') || 'same-config'

  // the server: its markup, and its theme CSS in the document
  const rendered = renderToString(tree)
  const style = document.createElement('style')
  style.id = 'server-theme-css'
  style.textContent = serverConfig.getCSS()
  document.head.appendChild(style)

  const serverValues = themeValues(serverConfig, 'light')

  // the control for the render pass: a server payload that carries a
  // genuinely different color, which is what a spelling divergence would
  // deliver to this client
  const serverHTML =
    scenario === 'render-mismatch'
      ? rendered.replaceAll(SPELLINGS.background, '#ff0000')
      : rendered

  let clientConfig: any = serverConfig
  let clientLabel = 'the same config the server parsed'

  if (scenario.startsWith('css-roundtrip')) {
    if (scenario === 'css-roundtrip-mismatch') {
      // the control for the round-trip pass: the document the client reads no
      // longer says what the server rendered. It has to be a different sheet
      // with a different rule count, because scanAllSheets caches per sheet on
      // rule count plus first and last selector, so an edited declaration in
      // place would be answered from the cache and this control could not fail.
      style.remove()
      const perturbed = document.createElement('style')
      perturbed.id = 'server-theme-css'
      perturbed.textContent = `${serverConfig
        .getCSS()
        .replaceAll(SPELLINGS.background, '#ff0000')}\n.tm_never{--x:0}`
      document.head.appendChild(perturbed)
    }
    clientConfig = createTamagui({
      ...defaultConfig,
      tokens: serverConfig.tokens as any,
      themes: namesOnly() as any,
    })
    clientLabel = 'a names-only projection, rebuilt from the document CSS'
  }

  const container = document.createElement('div')
  container.innerHTML = serverHTML
  document.body.appendChild(container)

  const recoverable: string[] = []
  const errors: string[] = []
  const originalError = console.error
  console.error = (...args: any[]) => errors.push(args.map(String).join(' '))
  hydrateRoot(container, tree, {
    onRecoverableError: (error: any) => recoverable.push(String(error?.message ?? error)),
  })
  // a hydration mismatch surfaces after the recovery render
  await new Promise((resolve) => setTimeout(resolve, 100))
  console.error = originalError

  const clientValues = themeValues(clientConfig, 'light')

  ;(window as any).__hydration = {
    scenario,
    clientLabel,
    serverProbe: probeMarkup(serverHTML),
    clientProbe: document.querySelector('[data-testid="probe"]')?.outerHTML ?? '',
    recoverable,
    errors,
    serverValues,
    clientValues,
    colorDiffs: THEME_KEYS.filter(
      (key) => asColor(serverValues[key]) !== asColor(clientValues[key])
    ),
    spellingDiffs: THEME_KEYS.filter((key) => serverValues[key] !== clientValues[key]),
  }
  document.title = `hydration ${scenario} done`
}

run()
