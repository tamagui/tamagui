import '@tamagui/core/reset.css'

import '../app.css'
import '../public/fonts/fonts.css'

import { Footer } from '@components/Footer'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Suspense, useMemo } from 'react'
import { TamaguiProvider } from 'tamagui'

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
  const [theme_, setTheme] = useRootTheme()
  const [mounted, setmounted] = useState(false)
  const theme = mounted ? theme_ : 'light'

  useEffect(() => {
    setmounted(true)
  }, [])

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
        <TamaguiProvider
          config={config}
          disableInjectCSS
          disableRootThemeClass
          defaultTheme={theme}
        >
          <Suspense fallback={null}>{contents}</Suspense>
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
