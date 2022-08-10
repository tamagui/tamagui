import '@tamagui/core/reset.css'

import '../app.css'

import { Footer } from '@components/Footer'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { Suspense, useMemo } from 'react'

import { SearchProvider } from '../components/Search'
import Tamagui from '../tamagui.config'

Error.stackTraceLimit = Infinity

export default function App(props: AppProps) {
  const [theme, setTheme] = useRootTheme()

  // memo to avoid re-render on dark/light change
  const contents = useMemo(() => {
    return (
      <SearchProvider>
        <ContentInner {...props} />
      </SearchProvider>
    )
  }, [props])

  return (
    <>
      <NextThemeProvider
        onChangeTheme={(next) => {
          setTheme(next)
        }}
      >
        <Tamagui.Provider disableInjectCSS disableRootThemeClass defaultTheme={theme}>
          <Suspense fallback={null}>{contents}</Suspense>
        </Tamagui.Provider>
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
