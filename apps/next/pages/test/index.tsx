import { AuthLayout } from 'app/features/auth/layout.web'
import { SignInScreen } from 'app/features/auth/sign-in-screen'
import Head from 'next/head'
import { guestOnlyGetSSP } from '../../utils/guestOnly'
import { NextPageWithLayout } from '../_app'
import { AddToCalendarButton } from 'add-to-calendar-button-react'
import { YStack } from 'tamagui'
import { H3, Paragraph, Spacer } from '@my/ui'
import { createParam } from 'solito'
import { GetServerSideProps } from 'next'

const Page: NextPageWithLayout = () => {
  const { useParams, useUpdateParams } = createParam<{
    name?: string
    options?: string[]
    location?: string
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    timeZone?: string
  }>()

  // name="Title"
  // options={['Apple', 'Google', 'Outlook.com', 'Yahoo']}
  // location="World Wide Web"
  // startDate="2023-09-21"
  // endDate="2023-09-21"
  // startTime="10:15"
  // endTime="23:30"
  // timeZone="America/Los_Angeles"
  const { params } = useParams()
  console.log(params, 'the parm xxxx')
  const options = ['Google', 'Apple', 'Outlook.com', 'Yahoo'] as (
    | 'Apple'
    | 'Google'
    | 'iCal'
    | 'Microsoft365'
    | 'MicrosoftTeams'
    | 'Outlook.com'
    | 'Yahoo'
  )[]

  return (
    <>
      <Head>
        <title>test screen</title>
      </Head>
      <YStack f={1} paddingTop="$4" paddingHorizontal="$2">
        <H3>Add to Calendar</H3>
        <Spacer />
        <AddToCalendarButton
          options={options as unknown as any}
          buttonStyle="round"
          buttonsList
          {...params}
        />
      </YStack>
    </>
  )
}

Page.getLayout = (children) => <>{children}</>

export const getServerSideProps = (async (context) => {
  const params = context.params
  return { props: { ...params } }
}) satisfies GetServerSideProps<{
  name?: string
  location?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  timeZone?: string
}>

export default Page
