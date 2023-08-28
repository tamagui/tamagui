import { HomeLayout } from 'app/features/home/layout.web'
import { ChangePasswordScreen } from 'app/features/settings/change-password-screen'
import { SettingsLayout } from 'app/features/settings/layout.web'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Change Password</title>
      </Head>
      <ChangePasswordScreen />
    </>
  )
}

Page.getLayout = (page) => (
  <HomeLayout fullPage>
    <SettingsLayout>{page}</SettingsLayout>
  </HomeLayout>
)

export const getServerSideProps = userProtectedGetSSP()

export default Page
