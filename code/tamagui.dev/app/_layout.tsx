import '@tamagui/core/reset.css'
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

// body and headings use the OS UI font, so the only webfont the site loads is
// the mono face for code. it's a subset variable font (~19kb, latin + punctuation,
// weights 100-800 from one file) and it's inlined here rather than linked so it
// costs no extra round-trip before first paint.
const fontFaceCss = `
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
