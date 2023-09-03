import { FeedScreen } from 'app/features/feed/screen'
import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { userProtectedGetSSP } from '../utils/userProtected'
import { NextPageWithLayout } from './_app'
import { YStack } from 'tamagui'
import { Paragraph } from '@my/ui'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <FeedScreen />
      {/* <YStack flex={1} p={4}>
        <Paragraph fontFamily="$body">Welcome to the Tamagui Universal Startera</Paragraph>
      </YStack> */}
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export const getServerSideProps = userProtectedGetSSP()

export default Page
