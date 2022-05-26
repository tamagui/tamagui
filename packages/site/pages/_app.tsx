import '@docsearch/css'
import '@tamagui/core/reset.css'
import '@tamagui/font-fira-mono/css/400.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import '@tamagui/font-silkscreen/css/400.css'

import '../app.css'

import { DocsPage } from '@components/DocsPage'
import { Footer } from '@components/Footer'
import { gtagUrl, renderSnippet } from '@lib/analytics'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import NextProgress from 'nextjs-progressbar'
import React, { useMemo } from 'react'

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
      <Head>
        {/* TODO bye google */}
        <Script async src={gtagUrl} />
        <Script dangerouslySetInnerHTML={{ __html: renderSnippet() || '' }} />
      </Head>
      <NextProgress height={1} options={{ showSpinner: false }} />
      <NextThemeProvider onChangeTheme={setTheme}>
        <Tamagui.Provider disableRootThemeClass defaultTheme={theme}>
          {contents}
        </Tamagui.Provider>
      </NextThemeProvider>
    </>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isDocs = router.pathname.includes('/docs')
  const isDemo = router.pathname.includes('/responsive-demo')
  return (
    <>
      {isDocs ? (
        <DocsPage>
          <Component {...pageProps} />
        </DocsPage>
      ) : (
        <Component {...pageProps} />
      )}
      {!isDocs && !isDemo && <Footer />}
    </>
  )
}
