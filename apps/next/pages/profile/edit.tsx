import { EditProfileScreen } from 'app/features/profile/edit-screen'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from '../_app'
import { HomeLayout } from 'app/features/home/layout.web'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <EditProfileScreen />
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
