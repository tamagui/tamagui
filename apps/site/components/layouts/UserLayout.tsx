import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { withSupabase } from '@lib/withSupabase'
import { UserGuard } from 'hooks/useUser'

import { DefaultLayout } from './DefaultLayout'

export const getUserLayout: GetLayout = (page, pageProps) =>
  withSupabase(
    <DefaultLayout>
      <Header disableNew minimal />
      <UserGuard>{page}</UserGuard>
      <Footer />
    </DefaultLayout>,
    pageProps
  )
