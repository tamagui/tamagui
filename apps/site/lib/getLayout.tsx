import { DefaultLayout } from '@components/DefaultLayout'
import { DocsPage } from '@components/DocsPage'
import { StudioLayout } from '@components/StudioLayout'
import { withSupabase } from '@lib/withSupabase'
import { useRouter } from 'next/router'

type GetLayout<Props = any> = (page: React.ReactNode, pageProps: Props) => React.ReactNode

export const getDefaultLayout: GetLayout = (page, pageProps) => {
  const router = useRouter()
  const path = router.asPath
  const isAuthPage = path.startsWith('/login')
  const isAccountPage = path.startsWith('/account')
  const isProductLandingPage = path.startsWith('/takeout') || path.startsWith('/studio')
  const isBlog = path.startsWith('/blog')
  const isDocs = path.startsWith('/docs')

  return withSupabase(
    <DefaultLayout
      headerProps={{
        disableNew: isBlog || isAuthPage || isProductLandingPage || isAccountPage,
        minimal: isAuthPage || isProductLandingPage || isAccountPage,
        showAuth: isAuthPage || isProductLandingPage || isAccountPage,
      }}
      hideFooter={isDocs}
    >
      {isDocs ? <DocsPage>{page}</DocsPage> : page}
    </DefaultLayout>,
    pageProps
  )
}

export const getStudioLayout: GetLayout = (page, pageProps) => {
  return withSupabase(<StudioLayout>{page}</StudioLayout>, pageProps, true)
}
