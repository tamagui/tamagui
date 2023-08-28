import { ProfileScreen } from 'app/features/profile/screen'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from '../_app'
import { HomeLayout } from 'app/features/home/layout.web'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <ProfileScreen />
    </>
  )
}

Page.getLayout = (page) => <HomeLayout fullPage>{page}</HomeLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
