import { Container } from '@components/Container'
import { getDefaultLayout } from '@lib/getLayout'
import { Database, Json } from '@lib/supabase-types'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { ButtonLink } from 'studio/Link'
import {
  Button,
  H2,
  H3,
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

      <Subscriptions />
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
      <H2>Subscriptions</H2>
      <YStack gap="$4" separator={<Separator />}>
        {subscriptions.length === 0 && (
          <Paragraph ta="center" theme="alt1">
            You don't have any subscription.
          </Paragraph>
        )}
        {subscriptions.map((sub) => {
          return <SubscriptionDetail key={sub.id} subscription={sub} />
        })}
      </YStack>
    </Container>
  )
}

const SubscriptionDetail = ({
  subscription,
}: {
  subscription: Exclude<
    Exclude<ReturnType<typeof useUser>['data'], undefined>['subscriptions'],
    null | undefined
  >[number]
}) => {
  const startDate = new Date(Number(subscription.created) * 1000)
  const canceledAt = subscription.canceled_at
    ? new Date(Number(subscription.canceled_at) * 1000)
    : null

  const price = Array.isArray(subscription.prices)
    ? subscription.prices[0]
    : subscription.prices
  if (!price) return null
  const products = Array.isArray(price?.products)
    ? price.products
    : price.products
    ? [price.products]
    : []

  return (
    <YStack key={subscription.id} gap="$2" id={subscription.id}>
      {products.map((product) => {
        return (
          <ProductDetail
            key={`${product.id}-${subscription.id}`}
            product={product}
            subscription={subscription}
          />
        )
      })}

      <XStack theme="alt2" gap="$2" separator={<Separator vertical />}>
        <SizableText>Started on {startDate.toDateString()}</SizableText>
        <SizableText>
          <SizableText>Status: </SizableText>
          <SizableText
            textTransform="capitalize"
            color={subscription.status === 'active' ? '$green9' : '$yellow9'}
          >
            {subscription.status}
          </SizableText>
        </SizableText>

        {canceledAt && <SizableText>Canceled at {canceledAt.toString()}</SizableText>}
      </XStack>
    </YStack>
  )
}

const ProductDetail = ({
  product,
  subscription,
}: {
  product: Database['public']['Tables']['products']['Row']
  subscription: Database['public']['Tables']['subscriptions']['Row']
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const metadata = product.metadata as { [key: string]: Json }
  const claimLabel = metadata.claim_label ?? 'Claim'

  async function handleGrantAccess() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/claim`, {
        body: JSON.stringify({
          subscription_id: subscription.id,
          product_id: product.id,
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
            uri: product.image ?? '',
          }}
          borderRadius="$4"
        />
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
          {!!productSlug && (
            <ButtonLink
              href={`/takeout/${productSlug}`}
              size="$2"
              iconAfter={ArrowUpRight}
            >
              View Page
            </ButtonLink>
          )}
        </YStack>
      </XStack>
      <YStack>
        <H3>{product.name}</H3>
        <Paragraph theme="alt1">{product.description}</Paragraph>
      </YStack>
    </YStack>
  )
}

Page.getLayout = getDefaultLayout
