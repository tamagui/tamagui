// import '@takeout/font-noto-emoji/css/400.css'
// import '@tamagui/font-inter/css/200.css'
// import '@tamagui/font-inter/css/900.css'

import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { CheckCircle, XCircle } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { GetStaticPropsResult } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import {
  Button,
  H1,
  H2,
  H3,
  H4,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  ThemeName,
  XStack,
  YStack,
  useIsomorphicLayoutEffect,
} from 'tamagui'

import { ContainerLarge } from '../../components/Container'
import { FlatBubbleCard } from '../../components/FlatBubbleCard'
import { useUser } from '../../hooks/useUser'
import { getUserLayout } from '../../lib/getUserLayout'
import { postData } from '../../lib/helpers'
import { getStripe } from '../../lib/stripeClient'
import { getActiveProductsWithPrices } from '../../lib/supabaseClient'
import { Price, Product } from '../../types'

interface Props {
  products: Product[]
}

export default function TakeoutPurchasePage({ products }: Props) {
  const { resolvedTheme } = useThemeSetting()
  const [themeName, setThemeName] = useState<ThemeName>(resolvedTheme as any)
  const containerRef = useRef(null)
  const router = useRouter()
  const [priceIdLoading, setPriceIdLoading] = useState<string>()
  const { user, isLoading, subscription } = useUser()

  useIsomorphicLayoutEffect(() => {
    setThemeName(resolvedTheme as any)
  }, [resolvedTheme])

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)
    if (!user) {
      return router.push('/signin')
    }
    if (subscription) {
      return router.push('/account')
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      return alert((error as Error)?.message)
    } finally {
      setPriceIdLoading(undefined)
    }
  }

  return (
    <Theme name={themeName}>
      <TitleAndMetaTags title="Tamagui TAKEOUT" description="What's up with Tamagui." />

      <YStack bc="$backgroundStrong">
        <HeaderIndependent />
        <Spacer size="$7" />

        <H1
          zi={0}
          o={1}
          position="absolute"
          mt="$10"
          color="$yellow10"
          fos={400}
          als="center"
          fow="900"
          fontFamily="$inter"
          ls={-44}
          x={300}
          pos="relative"
        >
          purchase
        </H1>

        <ContainerLarge pos="relative" space="$7">
          <YStack space="$3" maw={680} als="center">
            <H2 theme="light_alt2" size="$10" mx="$0" ta="center" ls={-0.25}>
              An ever-growing suite of design system tools.
            </H2>

            <Paragraph mx="$6" fow="500" ta="center" size="$5" theme="alt2">
              One license per-seat. Lifetime, unlimited use on unlimited projects. Access&nbsp;to
              updates and Tamagui Studio for 1 year.
            </Paragraph>
          </YStack>

          <XStack space="$4">
            {levels.map((level) => {
              return (
                <FlatBubbleCard highlight={level.highlight} w="33.333%" key={level.name}>
                  <XStack pos="relative">
                    <H4 fontFamily="$heading" fow="900" size="$12">
                      {level.name}
                    </H4>
                    <Spacer flex />
                    <H4
                      pos="absolute"
                      b="$-6"
                      als="flex-end"
                      color="$colorPress"
                      fontFamily="$silkscreen"
                      size="$9"
                      r="0"
                    >
                      ${level.price}
                    </H4>
                  </XStack>
                  <Spacer />
                  <Separator />
                  <Spacer />
                  <YStack>
                    {allFeatures.map((feature, index) => {
                      if (feature.title.startsWith('--')) {
                        return null
                      }
                      return (
                        <Item
                          included={index <= level.numFeatures}
                          key={feature.title}
                          // subtitle={feature.subtitle}
                        >
                          {feature.title}
                        </Item>
                      )
                    })}
                  </YStack>
                  <Spacer />
                  <Separator />
                  <Spacer />
                  <NextLink legacyBehavior href="/signin" passHref>
                    <Button
                      theme={level.highlight ? 'blue' : null}
                      br="$10"
                      bw={2}
                      fontFamily="$silkscreen"
                      size="$6"
                      tag="a"
                      textAlign="center"
                    >
                      Purchase
                    </Button>
                  </NextLink>
                </FlatBubbleCard>
              )
            })}
          </XStack>

          <Separator />

          <H3 size="$10" f={1} ta="center" fontFamily="$silkscreen">
            FAQ
          </H3>

          <XStack w="100%">
            <FlatBubbleCard>
              <H4>Something?</H4>
              <Paragraph>lorem</Paragraph>
            </FlatBubbleCard>

            <FlatBubbleCard>
              <H4>Something?</H4>
              <Paragraph>lorem</Paragraph>
            </FlatBubbleCard>

            <FlatBubbleCard>
              <H4>Something?</H4>
              <Paragraph>lorem</Paragraph>
            </FlatBubbleCard>

            <FlatBubbleCard>
              <H4>Something?</H4>
              <Paragraph>lorem</Paragraph>
            </FlatBubbleCard>
          </XStack>
        </ContainerLarge>
      </YStack>
    </Theme>
  )
}

TakeoutPurchasePage.getLayout = getUserLayout

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      products: [],
    },
  }
  const products = await getActiveProductsWithPrices()
  return {
    props: {
      products,
    },
    revalidate: 60,
  }
}

const allFeatures = [
  { title: '20 screens' },
  { title: '4 new color packs' },
  { title: '3 new theme packs' },
  { title: '6 new font bundles' },
  { title: '4 new icon packs' },
  { title: '--entry--' },
  { title: 'Studio' },
  { title: 'Site source' },
  { title: '--pro--' },
  { title: 'Sponsor logo' },
  { title: 'Roadmap voting' },
  { title: 'Private Slack' },
  { title: 'Priority Support' },
]

const levels = [
  {
    name: 'Sponsor',
    highlight: '$yellow10',
    price: '499',
    numFeatures: allFeatures.length,
  },
  {
    name: 'Studio',
    highlight: '$blue10',
    price: '299',
    numFeatures: allFeatures.findIndex((x) => x.title === '--pro--'),
  },
  {
    name: 'Bundle',
    highlight: false,
    price: '199',
    numFeatures: allFeatures.findIndex((x) => x.title === '--entry--'),
  },
]

const faqs = {
  Studio: {
    title: 'What is Studio?',
    body: [``],
  },
}

const Item = ({
  subtitle,
  children,
  included,
}: {
  subtitle?: string
  children?: any
  included: boolean
}) => {
  const iconColor = included ? '$green8' : '$red8'
  return (
    <XStack
      py="$1.5"
      mx="$-6"
      px="$6"
      tag="li"
      // ai="center"
      hoverStyle={{
        bc: '$backgroundHover',
      }}
    >
      <Text mt={5.5} color={iconColor}>
        {included ? (
          <CheckCircle color="currentColor" size={10} />
        ) : (
          <XCircle color="currentColor" size={10} />
        )}
      </Text>
      <Spacer />
      <YStack opacity={included ? 1 : 0.4}>
        <Paragraph size="$7" cursor="default" color="$gray11" fow="500">
          {children}
        </Paragraph>
        {!!subtitle && (
          <Paragraph mt="$-1" size="$2" cur="default" color="$gray9" o={0.7} fow="500">
            {subtitle}
          </Paragraph>
        )}
      </YStack>
    </XStack>
  )
}
