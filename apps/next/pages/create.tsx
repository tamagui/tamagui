import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from '../utils/userProtected'
import { NextPageWithLayout } from './_app'
import { CreateScreen } from 'app/features/create/climb-screen'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Create</title>
      </Head>
      <CreateScreen />
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
