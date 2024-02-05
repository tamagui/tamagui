import { NextLink } from '@components/NextLink'
import * as Sections from '@tamagui/bento'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Check, ShoppingCart } from '@tamagui/lucide-icons'
import { useBentoStore } from 'hooks/useBentoStore'
import type Stripe from 'stripe'

import {
  Button,
  Checkbox,
  Circle,
  EnsureFlexed,
  H2,
  H4,
  H5,
  Paragraph,
  ScrollView,
  Separator,
  Spacer,
  Stack,
  Theme,
  ThemeableStack,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { PurchaseModal } from '@components/BentoPurchaseModal'
import { stripe } from '@lib/stripe'
import type { Database } from '@lib/supabase-types'
import { getArray } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import type { GetStaticProps } from 'next'
import { BentoLogo } from '../../components/BentoLogo'
import { BentoPageFrame } from '../../components/BentoPageFrame'
import { ContainerLarge } from '../../components/Container'
import { getDefaultLayout } from '../../lib/getDefaultLayout'
import { ThemeNameEffect } from '../../components/ThemeNameEffect'

export type ProComponentsProps = {
  proComponents?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  coupon?: Stripe.Coupon | null
}

export default function BentoPage(props: ProComponentsProps) {
  if (!process.env.NEXT_PUBLIC_IS_TAMAGUI_DEV) {
    return null
  }

  return (
    <BentoPageFrame>
      <Theme name="tan">
        <ThemeNameEffect colorKey="$color6" />
        <YStack pe="none" fullscreen zi={100} rotateZ="20deg">
          {/* <StudioPreviewComponents /> */}
        </YStack>

        <Hero />
        <Body />
        <PurchaseModal coupon={props.coupon} mainProduct={props.proComponents} />
        <Spacer size="$10" />
      </Theme>
    </BentoPageFrame>
  )
}

BentoPage.getLayout = getDefaultLayout

const Hero = () => {
  const store = useBentoStore()

  return (
    <YStack pos="relative" pb="$9" zi={0}>
      <ContainerLarge>
        <XStack gap="$6" py="$3" bc="transparent" jc="space-between" w={'100%'}>
          <YStack
            mt={-20}
            mb={30}
            maw="55%"
            zi={100}
            jc="space-between"
            f={10}
            ai="flex-start"
            gap="$6"
          >
            <BentoLogo />
            <YStack gap="$6">
              <XStack gap="$6">
                <Stack bg="$color7" w={10} br="$10" my={10} />

                <Paragraph ff="$munro" size="$9" fos={32} lh={50} color="$color11">
                  Boost your React Native development with a suite of copy-paste
                  primitives.
                </Paragraph>
              </XStack>
              <XStack jc="space-between" ai="center" ml="$8" mr="$4">
                <Paragraph color="$color10" size="$5">
                  $200 one-time Purchase
                </Paragraph>

                <Circle size={4} bg="$color10" />
                <Circle size={4} bg="$color10" />
                <Circle size={4} bg="$color10" />

                <Paragraph color="$color10" size="$5">
                  $10/mo for early releases
                </Paragraph>
              </XStack>
            </YStack>

            <Theme name="green">
              <Button
                iconAfter={ShoppingCart}
                fontFamily="$mono"
                size="$5"
                fontSize={22}
                fontWeight="600"
                scaleSpace={0.5}
                scaleIcon={1.6}
                als="flex-end"
                mr="$4"
                color="$color1"
                bg="$color11"
                hoverStyle={{
                  bg: '$color10',
                  bc: '$color10',
                }}
                pressStyle={{
                  bg: '$color6',
                }}
                onPress={() => {
                  store.showPurchase = true
                }}
              >
                $200
                <YStack
                  zi={100}
                  pos="absolute"
                  t={-13}
                  r={-13}
                  bg="red"
                  style={{
                    background: `url(/leaf.webp)`,
                    backgroundSize: 'contain',
                  }}
                  w={33}
                  h={33}
                />
              </Button>
            </Theme>
          </YStack>

          <YStack
            mr={-150}
            ml={-50}
            maw={1000}
            mt={0}
            pl="$4"
            x={20}
            mb={-300}
            y={-20}
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent)`,
            }}
            // mr={-600}
            // maw={1000}
            // mt={0}
            // pl="$4"
            // x={20}
            // mb={-300}
            // y={-20}
            // style={{
            //   maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent)`,
            // }}
          >
            <Theme name="gray">
              <Sections.Preferences.LocationNotification />
            </Theme>
            {/* <XStack
              fw="wrap"
              zi={1}
              gap="$6"
              mah={300}
              transformOrigin="left top"
              als="center"
              scale={0.6}
            >
              <ThemeTint>
                <BentoCard elevate>
                  <YStack transformOrigin="center" scale={0.7}>
                    <Sections.Preferences.LocationNotification />
                  </YStack>
                </BentoCard>
              </ThemeTint>
              <ThemeTintAlt>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Textareas.AvatarNameContentAction />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTintAlt offset={2}>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Radiogroups.VerticalWithDescription />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTintAlt offset={3}>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Checkboxes.CheckboxCards />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTintAlt offset={4}>
                <BentoCard elevate>
                  <YStack scale={0.5} w={900} mx={-220} my={-146}>
                    <Sections.Layouts.SignInRightImage />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTintAlt offset={5}>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Textareas.AvatarNameContentAction />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTint>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Checkboxes.CheckboxCards />
                  </YStack>
                </BentoCard>
              </ThemeTint>
              <ThemeTintAlt>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Textareas.AvatarNameContentAction />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
              <ThemeTintAlt>
                <BentoCard elevate>
                  <YStack scale={0.8} mx={-30}>
                    <Sections.Textareas.AvatarNameContentAction />
                  </YStack>
                </BentoCard>
              </ThemeTintAlt>
            </XStack> */}
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

const Body = () => {
  return (
    <YStack
      pos="relative"
      py="$8"
      mb="$-10"
      // bg="$background"
      // shadowColor="$shadowColor"
      // shadowRadius={20}
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        // boxShadow: `0 0 200px rgba(0,0,0,0.2), 0 0 100px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.125), 0 0 10px rgba(0,0,0,0.125)`,
      }}
      // py="$10"
    >
      <YStack fullscreen o={0.35} className="bento-fade" />

      <Separator
        bc="$color"
        pos="absolute"
        t={0}
        l={0}
        r={0}
        o={0.125}
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* <H2>Sections</H2>
      <Paragraph size="$6" color={'$gray11'}>
        Components are divided into sections and each section has multiple groups of
        related components.
      </Paragraph>

      <Spacer size="$8" /> */}

      <YStack gap="$12" px="$6">
        {Sections.listingData.sections.map(({ sectionName, parts }) => {
          return (
            <YStack key={sectionName} gap="$6" jc={'space-between'}>
              <ContainerLarge>
                <ThemeTintAlt>
                  <YStack pos="relative">
                    <H2 ff="$munro" color="$color12" fontSize="$12" f={2} my="$4">
                      {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
                    </H2>
                  </YStack>
                </ThemeTintAlt>
              </ContainerLarge>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                p="$10"
                m="$-10"
                contentContainerStyle={{
                  minWidth: '100%',
                }}
              >
                <ContainerLarge>
                  <Theme name="gray">
                    <XStack gap="$6" f={4} fs={1}>
                      {parts.map(
                        ({ name: partsName, numberOfComponents, route, preview }) => (
                          <SectionCard
                            key={route + partsName + numberOfComponents.toString()}
                            path={route}
                            name={partsName}
                            numberOfComponents={numberOfComponents}
                            preview={preview}
                          />
                        )
                      )}
                      {/* @ts-ignore */}
                      <Spacer width="calc(50vw - 400px)" />
                    </XStack>
                  </Theme>
                </ContainerLarge>
              </ScrollView>
            </YStack>
          )
        })}
      </YStack>

      <Spacer size="$12" />
    </YStack>
  )
}

const EmptyFn = () => (
  <Checkbox size="$4" checked>
    <Checkbox.Indicator>
      <Check />
    </Checkbox.Indicator>
  </Checkbox>
)

function SectionCard({
  name,
  numberOfComponents,
  path,
  preview,
}: {
  name: string
  numberOfComponents: number
  path: string
  preview?: () => JSX.Element
}) {
  const Preview = preview || EmptyFn

  return (
    <NextLink href={BASE_PATH + path} passHref>
      <YStack
        tag="a"
        maw="calc(50% - 16px)"
        ov="hidden"
        elevation="$6"
        bg="#fff"
        mih={300}
        br="$9"
        cursor="pointer"
        pos="relative"
        hoverStyle={{
          // y: -2,
          // bg: '$color3',
          outlineWidth: 10,
          outlineStyle: 'solid',
          outlineColor: '$color05',
        }}
        pressStyle={{
          bg: '$color1',
          y: 3,
        }}
      >
        <EnsureFlexed />
        <YStack
          fullscreen
          className="bg-grid mask-gradient-down"
          style={{ backgroundPosition: 'top left' }}
          o={0.085}
          y={-1}
        />
        <YStack
          fullscreen
          ai="center"
          jc="center"
          y="20%"
          x="30%"
          scale={6}
          o={0.5}
          rotateY="10deg"
          rotateX="-20deg"
          rotateZ="-10deg"
        >
          <Theme name="tan">
            <Preview />
          </Theme>
        </YStack>
        <YStack p="$5">
          <H4 fontSize="$7" color="#000">
            {name}
          </H4>
          <H5 theme="alt1" fontWeight={'normal'} fontSize={'$2'}>
            {numberOfComponents} components
          </H5>
        </YStack>
      </YStack>
    </NextLink>
  )
}

const BASE_PATH = ' /bento'

BentoPage.getLayout = getDefaultLayout

export const getStaticProps: GetStaticProps<ProComponentsProps | any> = async () => {
  try {
    const props = await getTakeoutProducts()
    return {
      props,
    }
  } catch (err) {
    console.error(`Error getting props`, err)
    return {
      props: {},
    }
  }
}

const getTakeoutProducts = async (): Promise<ProComponentsProps> => {
  const promoListPromise = stripe.promotionCodes.list({
    code: 'SITE-PRO-COMPONENTS', // ones with code SITE-PRO-COMPONENTS are considered public and will be shown here
    active: true,
    expand: ['data.coupon'],
  })
  const productPromises = [
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'bento')
      .single(),
  ]
  const promises = [promoListPromise, ...productPromises]
  const queries = await Promise.all(promises)

  const products = queries.slice(1) as Awaited<(typeof productPromises)[number]>[]
  const couponsList = queries[0] as Awaited<typeof promoListPromise>

  let coupon: Stripe.Coupon | null = null

  if (couponsList.data.length > 0) {
    coupon = couponsList.data[0].coupon
  }

  if (!products.length) {
    throw new Error(`No products found`)
  }

  for (const product of products) {
    if (product.error) throw product.error
    if (
      !product.data.prices ||
      !Array.isArray(product.data.prices) ||
      product.data.prices.length === 0
    ) {
      throw new Error('No prices are attached to the product.')
    }
  }

  return {
    proComponents: {
      ...products[0].data!,
      prices: getArray(products[0].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    coupon,
  }
}

const BentoCard = styled(ThemeableStack, {
  elevation: '$4',
  bg: '$background',
  ai: 'center',
  jc: 'center',
  maw: 'calc(50% - 40px)',
  w: '100%',
  h: 500,
  ov: 'hidden',
  br: '$4',
})
