import { AuthLayout } from 'app/features/auth/layout.web'
import { ResetPasswordScreen } from 'app/features/auth/reset-password-screen'
import Head from 'next/head'
import { guestOnlyGetSSP } from 'utils/guestOnly'
import { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Reset Password</title>
    </Head>
    <ResetPasswordScreen />
  </>
)

Page.getLayout = (children) => <AuthLayout>{children}</AuthLayout>

export const getServerSideProps = guestOnlyGetSSP()

export default Page
