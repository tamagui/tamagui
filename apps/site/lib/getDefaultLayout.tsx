import { DefaultLayout } from '@components/DefaultLayout'
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
  const isDocs = path.startsWith('/docs')

  const layout = (
    <DefaultLayout
      headerProps={{
        disableNew: isBlog || isAuthPage || isProductLandingPage || isAccountPage,
        showAuth: isAuthPage || isProductLandingPage || isAccountPage,
      }}
      hideFooter={isDocs || isTakeout}
    >
      {isDocs ? <DocsPage>{page}</DocsPage> : page}
    </DefaultLayout>
  )

  return layout
}
