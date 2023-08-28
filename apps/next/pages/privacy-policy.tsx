import { PrivacyPolicyScreen } from 'app/features/legal/privacy-policy-screen'
import { LegalLayout } from 'app/features/legal/layout.web'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <PrivacyPolicyScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
