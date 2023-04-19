import { DocsPage } from '@components/DocsPage'
import { Header } from '@components/Header'

import { DefaultLayout } from './DefaultLayout'

export const getDocLayout: GetLayout = (page) => (
  <DefaultLayout>
    <Header />
    <DocsPage>{page}</DocsPage>
  </DefaultLayout>
)
