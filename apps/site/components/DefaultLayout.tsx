import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { HeaderProps } from '@components/HeaderProps'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { NextSeo } from 'next-seo'
import React, { Suspense } from 'react'

import { SearchProvider } from './Search'

export const DefaultLayout = ({
  children,
  headerProps,
  hideFooter,
}: {
  children: React.ReactNode
  headerProps?: HeaderProps
  hideFooter?: boolean
}) => {
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
          <Header {...headerProps} />
          {children}

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
