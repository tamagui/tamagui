import '@tamagui/core/reset.css'

import '../app.css'
import '../public/fonts/fonts.css'

import { Footer } from '@components/Footer'
import { setTintFamily } from '@tamagui/logo'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { Suspense, startTransition, useMemo } from 'react'
import { TamaguiProvider, isClient } from 'tamagui'

import { Header } from '../components/Header'
import { SearchProvider } from '../components/Search'
import config from '../tamagui.config'

Error.stackTraceLimit = Infinity

// santa mode
if (isClient) {
  const goXmas = setTimeout(() => {
    setTintFamily('xmas')
    window.removeEventListener('scroll', onScroll)
  }, 2500)

  // dont activate santa mode if they scroll down, a bit confusing right?
  const onScroll = (e: Event) => {
    if ((document.scrollingElement?.scrollTop || 0) > 100) {
      clearTimeout(goXmas)
      window.removeEventListener('scroll', onScroll)
    }
  }

  window.addEventListener('scroll', onScroll)
}

// prevent next.js from prefetching stuff
if (typeof navigator !== 'undefined') {
  try {
    // @ts-ignore
    navigator.connection = navigator.connection || {}
    // @ts-ignore
    navigator.connection['saveData'] = true
  } catch {
    // ignore err
  }
}

export default function App(props: AppProps) {
  const [theme, setTheme] = useRootTheme()
  const router = useRouter()
  const isResponsiveDemo = router.pathname.startsWith('/responsive-demo')

  // useMemo below to avoid re-render on dark/light change
  return (
    <>
      <NextHead>
        <script
          key="tamagui-animations-mount"
          dangerouslySetInnerHTML={{
            // avoid flash of animated things on enter
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
      </NextHead>

      <NextThemeProvider
        onChangeTheme={(next) => {
          startTransition(() => {
            setTheme(next)
          })
        }}
      >
        <TamaguiProvider
          config={config}
          disableInjectCSS
          disableRootThemeClass
          defaultTheme={theme}
        >
          <SearchProvider>
            {!isResponsiveDemo && <Header />}
            <Suspense fallback={null}>
              {useMemo(() => {
                return <ContentInner {...props} />
              }, [props])}
            </Suspense>
          </SearchProvider>
        </TamaguiProvider>
      </NextThemeProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isDocs = router.pathname.startsWith('/docs')
  const isStudio = router.pathname.startsWith('/studio')
  const isDemo = router.pathname.startsWith('/responsive-demo')
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(
    <>
      <Component {...pageProps} />
      {!isDocs && !isDemo && !isStudio && <Footer />}
    </>
  )
}
