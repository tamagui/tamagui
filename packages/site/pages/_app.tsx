import '@docsearch/css'
import '@tamagui/core/reset.css'
import '@tamagui/font-silkscreen/css/400.css'

import '../app.css'

import { DocsPage } from '@components/DocsPage'
import { Footer } from '@components/Footer'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextProgress from 'nextjs-progressbar'
import { useMemo } from 'react'

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
      <NextProgress height={1} options={{ showSpinner: false }} />
      <NextThemeProvider onChangeTheme={setTheme}>
        <Tamagui.Provider disableInjectCSS disableRootThemeClass defaultTheme={theme}>
          {contents}
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
      {isDocs ? (
        <DocsPage>
          <Component {...pageProps} />
        </DocsPage>
      ) : (
        <Component {...pageProps} />
      )}
      {!isDocs && !isDemo && !isStudio && <Footer />}
    </>
  )
}
