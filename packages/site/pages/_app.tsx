import '../app.css'

import { DocsPage } from '@components/DocsPage'
import { Footer } from '@components/Footer'
import * as NextThemes from '@components/NextTheme'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { PopoverProvider, YStack } from 'tamagui'

import Tamagui from '../tamagui.config'

Error.stackTraceLimit = Infinity

export default function App(props: AppProps) {
  const classes = typeof document !== 'undefined' ? [...document.documentElement.classList] : []
  const isDark = classes.includes('theme--dark')
  const [theme, setTheme] = useState(isDark ? 'dark' : 'light')

  // cant do system them because next SSR
  return (
    <NextThemes.ThemeProvider
      enableSystem
      disableTransitionOnChange
      attribute="class"
      defaultTheme="system"
      value={{
        dark: 'theme--dark',
        light: 'theme--light',
      }}
      onChangeTheme={(x) => setTheme(x)}
    >
      <Tamagui.Provider defaultTheme={theme}>
        <PopoverProvider>
          <ContentInner {...props} />
        </PopoverProvider>
      </Tamagui.Provider>
    </NextThemes.ThemeProvider>
  )
}

function ContentInner({ Component, pageProps }: AppProps) {
  // test stuff here
  // return <Button>hi</Button>

  const router = useRouter()
  const isDocs = router.pathname.includes('/docs')
  return (
    <YStack>
      {isDocs ? (
        <DocsPage>
          <Component {...pageProps} />
        </DocsPage>
      ) : (
        <Component {...pageProps} />
      )}
      {!isDocs && <Footer />}
    </YStack>
  )
}
