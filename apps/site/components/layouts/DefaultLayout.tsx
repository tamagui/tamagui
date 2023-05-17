import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import React, { Suspense } from 'react'

import { SearchProvider } from '../Search'

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchProvider>
      <Suspense fallback={null}>
        <ToastProvider swipeDirection="horizontal">
          {children}

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
export const getDefaultLayout: GetLayout = (page) => (
  <DefaultLayout>
    <Header />
    {page}
    <Footer />
  </DefaultLayout>
)
