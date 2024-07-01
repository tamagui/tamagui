import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import React, { Suspense } from 'react'

import { SearchProvider } from '../components/Search'

import { DocsPage } from '@components/DocsPage'

export type GetLayout<Props = any> = (
  page: React.ReactNode,
  pageProps: Props,
  path: string
) => React.ReactElement

export const getDefaultLayout: GetLayout = (page, pageProps, path) => {
  const isAuthPage = path.startsWith('/login')
  const isAccountPage = path.startsWith('/account')
  const isStudio = path.startsWith('/studio')
  const isTakeout = path.startsWith('/takeout')
  // const isBento = path.startsWith('/bento')
  const isProductLandingPage = isTakeout || isStudio
  const isBlog = path.startsWith('/blog')
  const isDocs = path.startsWith('/docs') || path.startsWith('/ui')
  const isBento = path.startsWith('/bento')

  const disableNew = isBlog || isAuthPage || isProductLandingPage || isAccountPage
  const showAuth = isAuthPage || isProductLandingPage || isAccountPage
  const hideFooter = isDocs || isTakeout || isBento

  return (
    <SearchProvider>
      <Suspense fallback={null}>
        <ToastProvider swipeDirection="horizontal">
          <Header showAuth={showAuth} disableNew={disableNew} />
          {isDocs ? <DocsPage>{page}</DocsPage> : page}

          {!hideFooter && <Footer />}
          <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
          <ToastViewport
            multipleToasts
            name="viewport-multiple"
            flexDirection="column-reverse"
            top="$2"
            left={0}
            right={0}
          />
        </ToastProvider>
      </Suspense>
    </SearchProvider>
  )
}
