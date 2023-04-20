import { Footer } from '@components/Footer'
import { Header } from '@components/Header'

import { DefaultLayout } from './DefaultLayout'

export const getBlogLayout: GetLayout = (page) => (
  <DefaultLayout>
    <Header disableNew />
    {page}
    <Footer />
  </DefaultLayout>
)
