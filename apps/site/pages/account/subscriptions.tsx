import { Container } from '@components/Container'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { Json } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import { ButtonLink } from 'components/Link'
import { UserGuard, useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  Button,
  H2,
  H3,
  H5,
  H6,
  Image,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from 'tamagui'

export default function Page() {
  return (
    <>
      <NextSeo
        title="Subscriptions — Tamagui"
        description="A better universal UI system."
      />

      <UserGuard>
        <Subscriptions />
      </UserGuard>
    </>
  )
}

const Subscriptions = () => {
  const { data, isLoading } = useUser()

  if (isLoading || !data) {
    return <Spinner my="$10" />
  }

  const { subscriptions } = data
  if (!subscriptions) return null
  return (
    <Container f={1} py="$8" gap="$8">
      <GithubAppMessage />
      <H2>Subscriptions</H2>
      <YStack gap="$8">
        {subscriptions.length === 0 && (
          <Paragraph ta="center" theme="alt1">
            You don't have any subscriptions.
          </Paragraph>
        )}
        {subscriptions.map((sub) => {
          return <SubscriptionDetail key={sub.id} subscription={sub} />
        })}
      </YStack>
    </Container>
  )
}

type SubscriptionDetailProps = {
  subscription: Exclude<
    Exclude<ReturnType<typeof useUser>['data'], undefined>['subscriptions'],
    null | undefined
  >[number]
}

const dateFormatter = Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
})

const SubscriptionDetail = ({ subscription }: SubscriptionDetailProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const startDate = new Date(subscription.created)
  const periodEnd = new Date(subscription.current_period_end)
  const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at) : null
  const items = getArray(subscription.subscription_items)
  const { mutate } = useSWRConfig()

  if (!items) return null

  async function handleCancelSubscription() {
    mutate(['user'])
    setIsLoading(true)
    try {
      const res = await fetch(`/api/cancel-subscription`, {
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await res.json()

      // delay so stripe calls us first
      await new Promise((res) => setTimeout(() => res(true), 1000))

      await mutate('user')

      if (data.message) {
        alert(data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleActivateSubscription() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/activate-subscription`, {
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const data = await res.json()

      // delay so stripe calls us first
      await new Promise((res) => setTimeout(() => res(true), 1000))

      await mutate('user')

      if (data.message) {
        alert(data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <YStack
      borderColor="$color2"
      borderWidth="$1"
      borderRadius="$4"
      key={subscription.id}
      id={subscription.id}
      separator={<Separator />}
    >
      <YStack
        p="$4"
        theme="alt2"
        gap="$2"
        // separator={<Separator />}
        flexWrap="wrap"
      >
        <XStack gap="$2" separator={<Separator vertical my="$1" />} flexWrap="wrap">
          <SizableText>Started at {dateFormatter.format(startDate)}</SizableText>
          <SizableText>
            Current period ends at {dateFormatter.format(periodEnd)}
          </SizableText>
          {canceledAt ? (
            <SizableText>
              Canceled at {dateFormatter.format(canceledAt)} -{' '}
              <SizableText
                theme="blue_alt2"
                textDecorationLine="underline"
                cursor="pointer"
                userSelect="none"
                {...(isLoading && { opacity: 0.5 })}
                onPress={() => !isLoading && handleActivateSubscription()}
              >
                Re-Activate
              </SizableText>
            </SizableText>
          ) : (
            <SizableText
              cursor="pointer"
              userSelect="none"
              textDecorationLine="underline"
              {...(isLoading && { opacity: 0.5 })}
              onPress={() => !isLoading && handleCancelSubscription()}
            >
              Cancel Subscription
            </SizableText>
          )}
        </XStack>
        <XStack gap="$4" separator={<Separator vertical my="$1" />} flexWrap="wrap">
          <SizableText>Sub ID: {subscription.id}</SizableText>
          <SizableText>
            <SizableText>Status: </SizableText>
            <SizableText
              textTransform="capitalize"
              color={subscription.status === 'active' ? '$green9' : '$yellow9'}
            >
              {subscription.status}
            </SizableText>
          </SizableText>
        </XStack>
      </YStack>
      <YStack p="$4" gap="$4" separator={<Separator />}>
        {items.map((item) => {
          const price = getSingle(item?.prices)
          const product = getSingle(price?.products)
          if (!price || !product) return null
          // const product = item?.prices
          return (
            <SubscriptionItem
              key={`${price.id}-${subscription.id}`}
              item={item}
              subscription={subscription}
            />
          )
        })}
      </YStack>
    </YStack>
  )
}

const SubscriptionItem = ({
  item,
  subscription,
}: {
  item: Exclude<
    SubscriptionDetailProps['subscription']['subscription_items'],
    undefined | null
  >[number]
  subscription: SubscriptionDetailProps['subscription']
}) => {
  // const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)
  const product = item.price.product
  const metadata = product?.metadata as { [key: string]: Json }
  const claimLabel = metadata.claim_label ?? 'Claim'

  if (!product) {
    return null
  }
  const installInstructions = (product.metadata as any).install_instructions
  const hasGithubApp = (product.metadata as any).has_github_app

  // async function handleRemoveFormSub() {
  //   setIsLoading(true)
  //   try {
  //     const res = await fetch(`/api/remove-subscription-item`, {
  //       body: JSON.stringify({
  //         subscription_item_id: item.id,
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //     })

  //     const data = await res.json()

  //     // delay so stripe calls us first
  //     await new Promise((res) => setTimeout(() => res(true), 1000))

  //     await mutate('user')

  //     if (data.message) {
  //       alert(data.message)
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  async function handleGrantAccess() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/claim`, {
        body: JSON.stringify({
          subscription_id: subscription.id,
          product_id: product!.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const data = await res.json()

      if (data.message) {
        alert(data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const productSlug =
    typeof product.metadata === 'object' &&
    !Array.isArray(product.metadata) &&
    product.metadata
      ? product.metadata.slug
      : null

  return (
    <YStack key={product.id} gap="$2">
      <XStack gap="$2" jc="space-between">
        <Image
          source={{
            width: 100,
            height: 100,
            uri: product.image ?? '/guy.png',
          }}
          borderRadius="$4"
        />
        <YStack />
        <YStack gap="$2">
          <Button
            size="$2"
            themeInverse
            onPress={() => handleGrantAccess()}
            disabled={isLoading}
            {...(isLoading && { opacity: 0.5 })}
          >
            {claimLabel}
          </Button>
          {hasGithubApp && item.id && (
            <ButtonLink
              href={`/api/github/install-bot?${new URLSearchParams({
                subscription_item_id: item.id.toString(),
              })}`}
              size="$2"
              themeInverse
            >
              Install GitHub App
            </ButtonLink>
          )}
          {/* {!!productSlug && ( */}
          <ButtonLink href={`/takeout`} size="$2" iconAfter={ArrowUpRight}>
            View Page
          </ButtonLink>
          {/* )} */}
          {/* <Button
            disabled={isLoading}
            {...(isLoading && { opacity: 0.5 })}
            theme="red"
            onPress={() => handleRemoveFormSub()}
            size="$2"
          >
            Remove From Sub
          </Button> */}
        </YStack>
      </XStack>
      <YStack>
        <H3>{product.name}</H3>
        <Paragraph theme="alt1">{product.description}</Paragraph>
        {installInstructions && (
          <YStack mt="$3">
            <H5>How to use</H5>
            <Paragraph mt="$2">{installInstructions}</Paragraph>
          </YStack>
        )}
      </YStack>
    </YStack>
  )
}

const GithubAppMessage = () => {
  const router = useRouter()
  const githubAppInstalled = !!router.query.github_app_installed
  if (!githubAppInstalled) return null
  return (
    <Paragraph theme="green_alt2">
      GitHub App installed successfully. We will create PRs to your fork as we ship new
      updates.
    </Paragraph>
  )
}

Page.getLayout = getDefaultLayout
