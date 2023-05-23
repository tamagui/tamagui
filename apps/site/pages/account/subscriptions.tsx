import { Container } from '@components/Container'
import { getUserLayout } from '@components/layouts/UserLayout'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import { Spinner, YStack } from 'tamagui'

export default function Page() {
  return (
    <>
      <NextSeo title="Account — Tamagui" description="A better universal UI system." />

      <Subscriptions />
    </>
  )
}

const Subscriptions = () => {
  const { subscriptions, isLoading } = useUser()

  if (isLoading || !subscriptions) {
    return <Spinner my="$10" />
  }

  return (
    <Container f={1}>
      {subscriptions.map((sub) => {
        return <YStack key={sub.id}>{sub.plan?.product}</YStack>
      })}
    </Container>
  )
}

Page.getLayout = getUserLayout
