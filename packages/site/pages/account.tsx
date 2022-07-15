import { User, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import React from 'react'
import { useState } from 'react'
import { Button, H1, Paragraph, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '../components/Container'
import { Link } from '../components/Link'
import { TamaCard } from '../components/TamaCard'
import { useUser } from '../hooks/useUser'
import { getUserLayout } from '../lib/getUserLayout'
import { postData } from '../lib/helpers'

// export const getServerSideProps = withPageAuth({ redirectTo: '/signin' })

export default function AccountPage({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)
  const { isLoading, subscription, userDetails, signout } = useUser()

  const redirectToCustomerPortal = async () => {
    setLoading(true)
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      })
      window.location.assign(url)
    } catch (error) {
      if (error) return alert((error as Error).message)
    }
    setLoading(false)
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100)

  return (
    <ContainerLarge py="$6">
      <H1>Account</H1>

      <XStack flexWrap="wrap" mb="$-4">
        <TamaCard
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
        >
          {isLoading ? (
            <div className="h-12 mb-6">{/* <LoadingDots /> */}</div>
          ) : subscription ? (
            `${subscriptionPrice}/${subscription?.prices?.interval}`
          ) : (
            <Link href="/takeout/purchase">Choose your plan</Link>
          )}
          <YStack space>
            <Paragraph size="$2">Manage your subscription on Stripe.</Paragraph>
            <Button
              // loading={loading}
              disabled={loading || !subscription}
              onPress={redirectToCustomerPortal}
            >
              Open customer portal
            </Button>
          </YStack>
        </TamaCard>
        <TamaCard
          title="Your Email"
          description="Please enter the email address you want to use to login."
        >
          <Paragraph>{user ? user.email : undefined}</Paragraph>
        </TamaCard>

        <Link w="100%" href="/studio">
          <TamaCard title="Studio"></TamaCard>
        </Link>

        <Button onPress={() => signout()}>Logout</Button>
      </XStack>
    </ContainerLarge>
  )
}

AccountPage.getLayout = getUserLayout
