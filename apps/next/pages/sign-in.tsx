import { AuthLayout } from 'app/features/auth/layout.web'
import { SignInScreen } from 'app/features/auth/sign-in-screen'
import Head from 'next/head'
import { guestOnlyGetSSP } from 'utils/guestOnly'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Sign in</title>
    </Head>
    <SignInScreen />
  </>
)

Page.getLayout = (children) => <AuthLayout>{children}</AuthLayout>

export const getServerSideProps = guestOnlyGetSSP()

export default Page
