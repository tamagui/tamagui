import { HomeScreen } from 'app/features/home/screen'
import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from 'utils/userProtected'
import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <HomeScreen />
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
