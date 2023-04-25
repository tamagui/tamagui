import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { withSupabase } from '@lib/withSupabase'

import { DefaultLayout } from './DefaultLayout'

export const getPurchaseLayout: GetLayout = (page, pageProps) =>
  withSupabase(
    <DefaultLayout>
      <Header disableNew minimal />
      {page}
      <Footer />
    </DefaultLayout>,
    pageProps
  )
