import { createTamagui, createTokens, TamaguiProvider, html, View } from '@tamagui/web'
import { renderToString } from 'react-dom/server'
const tokens = createTokens({
  size: { 0: 0, 1: 4 },
  space: { 0: 0, 1: 4 },
  radius: { 0: 0 },
  zIndex: { 0: 0 },
  color: { white: '#fff' },
})
const config = createTamagui({
  tokens,
  themes: { light: { background: '#fff', color: '#000' } },
  fonts: {},
  media: {},
  shorthands: {},
  settings: {},
} as any)
const body = renderToString(
  <TamaguiProvider config={config} defaultTheme="light">
    <html.div id="d" hidden>
      hidden div
    </html.div>
    <html.h1 id="h1a">Heading A</html.h1>
    <html.h1 id="h1b">Heading B</html.h1>
    <html.p id="p1">para 1</html.p>
    <html.p id="p2">para 2</html.p>
    <html.div id="div" padding={10} width={100}>
      div
    </html.div>
    <html.button id="btn">btn</html.button>
  </TamaguiProvider>
)
const css = config.getCSS()
await Bun.write(
  process.argv[2],
  `<!doctype html><style>${css}</style><body>${body}</body>`
)
console.log(body.slice(0, 1200))
