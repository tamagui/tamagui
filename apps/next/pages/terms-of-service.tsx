import { TermsOfServiceScreen } from 'app/features/legal/terms-of-service-screen'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'
import { LegalLayout } from 'app/features/legal/layout.web'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <TermsOfServiceScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
