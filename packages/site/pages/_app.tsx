import React from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SnackUIProvider, useTheme, VStack } from 'snackui'
import { Footer } from '@components/Footer'
import { DocsPage } from '@components/DocsPage'
import themes from '../constants/themes'

Error.stackTraceLimit = Infinity

export default function App(props: AppProps) {
  return (
    <SnackUIProvider themes={themes} defaultTheme="dark">
      <AppContent {...props} />
    </SnackUIProvider>
  )
}

const AppContent = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const isDocs = router.pathname.includes('/docs')
  const theme = useTheme()
  return (
    <VStack backgroundColor={theme.bg}>
      {isDocs ? (
        <DocsPage>
          <Component {...pageProps} />
        </DocsPage>
      ) : (
        <Component {...pageProps} />
      )}
      {!isDocs && <Footer />}
    </VStack>
  )
}
