import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { NextSeo } from 'next-seo'
import type React from 'react'
import { Suspense } from 'react'

import { SearchProvider } from '../features/site/search/Search'

import { DocsPage } from '@components/DocsPage'
import { XStack, Paragraph } from 'tamagui'
import { ContainerLarge } from '../components/Container'

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
      <NextSeo
        title="Tamagui"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://tamagui.dev',
          siteName: 'Tamagui',
          images: [
            {
              url: 'https://tamagui.dev/social.png',
            },
          ],
        }}
        twitter={{
          handle: '@natebirdman',
          site: '@tamagui_js',
          cardType: 'summary_large_image',
        }}
      />

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
