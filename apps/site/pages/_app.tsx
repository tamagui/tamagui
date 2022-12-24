import '@tamagui/core/reset.css'

import '../app.css'
import '../public/fonts/fonts.css'

import { Footer } from '@components/Footer'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Suspense, startTransition, useMemo } from 'react'
import { TamaguiProvider } from 'tamagui'

import { Header } from '../components/Header'
import { SearchProvider } from '../components/Search'
import config from '../tamagui.config'

Error.stackTraceLimit = Infinity

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
