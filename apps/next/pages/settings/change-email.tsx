import { HomeLayout } from 'app/features/home/layout.web'
import { ChangeEmailScreen } from 'app/features/settings/change-email-screen'
import { SettingsLayout } from 'app/features/settings/layout.web'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app'
import { userProtectedGetSSP } from 'utils/userProtected'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Change Email</title>
      </Head>
      <ChangeEmailScreen />
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
