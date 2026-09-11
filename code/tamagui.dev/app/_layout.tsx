import '@tamagui/style/reset.css'
import '~/app.css'
import '~/tamagui.generated.css'

import { LoadProgressBar, Slot } from 'one'
import { setupPopper } from 'tamagui'
import { Providers } from '../components/Providers'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'

setupPopper({
  // prevents a reflow on mount
  disableRTL: true,
})

// two webfonts, both subset variable files that cover every weight the site
// asks for from a single request: Contrast for text and JetBrains Mono for code.
// inlined here rather than linked so they cost no extra round-trip before first
// paint, and swapped so text renders in the OS UI face until they land.
const fontFaceCss = `
@font-face{font-family:'Contrast';src:url('/fonts/contrast-wght-normal.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Contrast';src:url('/fonts/inter-latin-ext-wght-italic.woff2') format('woff2');font-weight:100 900;font-style:italic;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:'Contrast';src:url('/fonts/inter-latin-wght-italic.woff2') format('woff2');font-weight:100 900;font-style:italic;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'JetBrains Mono';src:url('/fonts/jetbrains-mono.woff2') format('woff2-variations');font-weight:100 800;font-style:normal;font-display:swap}`

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="docsearch:language" content="en" />
        <meta name="docsearch:version" content="1.0.0,latest" />
        <meta id="theme-color" name="theme-color" />
        <meta name="color-scheme" content="light dark" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tamagui_js" />
        <meta name="twitter:creator" content="@natebirdman" />
        <meta name="robots" content="index,follow" />

        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/contrast-wght-normal.woff2"
          crossOrigin="anonymous"
          // @ts-ignore
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <style>{fontFaceCss}</style>
      </head>

      <body>
        <LoadProgressBar />

        {/* warm cherry-bomb on first interaction so it's ready when navigating
            to pages that use it (home, takeout), no eager preload */}
        <LoadCherryBomb prefetch />

        <Providers>
          <Slot />
        </Providers>
      </body>
    </html>
  )
}
