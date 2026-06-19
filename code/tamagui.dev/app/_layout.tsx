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

// when chrome blocks cookies/storage (e.g. "block third-party cookies" in some
// embedded/partitioned contexts, or "block all cookies"), accessing
// window.localStorage throws a SecurityError synchronously. that throw happens
// inside a react layout effect during hydration (color scheme, supabase auth,
// etc) and unmounts the whole tree, leaving a blank page. install an in-memory
// shim before any module js runs so every consumer of localStorage/sessionStorage
// degrades gracefully instead of crashing. runs at parse time (classic inline
// script) which is before deferred module scripts.
const safeStorageScript = `(function(){
function makeSafe(){var m=Object.create(null);return{
getItem:function(k){k=String(k);return k in m?m[k]:null},
setItem:function(k,v){m[String(k)]=String(v)},
removeItem:function(k){delete m[String(k)]},
clear:function(){m=Object.create(null)},
key:function(i){return Object.keys(m)[i]||null},
get length(){return Object.keys(m).length}}}
['localStorage','sessionStorage'].forEach(function(key){
try{var s=window[key];var t='__probe'+Math.random();s.setItem(t,'1');s.removeItem(t)}
catch(e){try{Object.defineProperty(window,key,{configurable:true,value:makeSafe()})}catch(e2){}}})
})()`

// inlined @font-face (was 4 render-blocking /fonts/*.css links). font-display:swap
// (was block) so text paints with a fallback immediately instead of FOIT.
const fontFaceCss = `
@font-face{font-family:'Inter';src:url('/fonts/Inter-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Inter';src:url('/fonts/Inter-ExtraBold.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'Berkeley Mono';src:url('/fonts/berkeley.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Silkscreen';src:url('/fonts/slkscr.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}`

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: safeStorageScript }} />
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
          href="/fonts/berkeley.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/Inter-ExtraBold.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/slkscr.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        {/* inline @font-face instead of 4 render-blocking <link> stylesheets (each
            cost a round-trip ~500ms on slow connections and blocked first paint).
            font-display: swap (was block) lets text paint immediately with a
            fallback instead of staying invisible until the font loads (FOIT) —
            this was the LCP bottleneck (3.1s element render delay). fonts are
            preloaded above so the swap window is short. */}
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss }} />
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
