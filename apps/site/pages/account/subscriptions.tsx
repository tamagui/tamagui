import { Container } from '@components/Container'
import { getUserLayout } from '@components/layouts/UserLayout'
import { getProductSlug } from '@lib/products'
import { ArrowUpRight } from '@tamagui/lucide-icons'
import { ButtonLink } from 'app/Link'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import {
  Button,
  H1,
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
  const { subscriptions, isLoading } = useUser()

  if (isLoading || !subscriptions) {
    return <Spinner my="$10" />
  }

  return (
    <Container f={1} py="$4" gap="$8">
      <H2>Subscriptions</H2>
      <YStack gap="$4" separator={<Separator />}>
        {subscriptions.map((sub) => {
          const startDate = new Date(sub.start_date * 1000)
          const canceledAt = sub.canceled_at ? new Date(sub.canceled_at * 1000) : null
          return (
            <YStack key={sub.id} gap="$2" id={sub.id}>
              <XStack gap="$2" jc="space-between">
                <Image
                  source={{ width: 100, height: 100, uri: sub.product.images[0] ?? '' }}
                  borderRadius="$4"
                />
                <YStack gap="$2">
                  <Button size="$2" themeInverse>
                    Access Files
                  </Button>
                  <ButtonLink
                    href={`/takeout/${getProductSlug(sub.product.id)}`}
                    size="$2"
                    iconAfter={ArrowUpRight}
                  >
                    View Page
                  </ButtonLink>
                </YStack>
              </XStack>
              <YStack>
                <H3>{sub.product.name}</H3>
                <Paragraph theme="alt1">{sub.product.description}</Paragraph>
              </YStack>
              <XStack theme="alt2" gap="$2" separator={<Separator vertical />}>
                <SizableText>Started on {startDate.toDateString()}</SizableText>
                <SizableText>
                  <SizableText>Status: </SizableText>
                  <SizableText
                    textTransform="capitalize"
                    color={sub.status === 'active' ? '$green9' : '$yellow9'}
                  >
                    {sub.status}
                  </SizableText>
                </SizableText>

                {canceledAt && (
                  <SizableText>Canceled at {canceledAt.toString()}</SizableText>
                )}
              </XStack>
            </YStack>
          )
        })}
      </YStack>
    </Container>
  )
}

Page.getLayout = getUserLayout
