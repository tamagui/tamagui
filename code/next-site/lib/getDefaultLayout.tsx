import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { Suspense } from 'react'

export type GetLayout<Props = any> = (
  page: React.ReactNode,
  pageProps: Props,
  path: string
) => React.ReactElement

export const getDefaultLayout: GetLayout = (page, pageProps, path) => {
  return (
    <>
      <Suspense fallback={null}>
        <ToastProvider swipeDirection="horizontal">
          <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
          <ToastViewport
            multipleToasts
            name="viewport-multiple"
            flexDirection="column-reverse"
            top="$2"
            left={0}
            right={0}
          />

          {page}
        </ToastProvider>
      </Suspense>
    </>
  )
}
