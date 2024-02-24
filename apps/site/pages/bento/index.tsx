import { NextLink } from '@components/NextLink'
import * as Sections from '@tamagui/bento'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import {
  Check,
  ChevronDown,
  Globe,
  Leaf,
  Puzzle,
  Search,
  ShoppingCart,
} from '@tamagui/lucide-icons'
import { useBentoStore } from 'hooks/useBentoStore'
import type Stripe from 'stripe'

import {
  Button,
  Checkbox,
  Circle,
  EnsureFlexed,
  H3,
  H4,
  H5,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Spacer,
  Stack,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { PurchaseModal } from '@components/BentoPurchaseModal'
import { stripe } from '@lib/stripe'
import type { Database } from '@lib/supabase-types'
import { getArray } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { useStore } from '@tamagui/use-store'
import { useUser } from 'hooks/useUser'
import type { GetStaticProps } from 'next'
import { useMemo, useRef, useState } from 'react'
import { BentoIcon } from '../../components/BentoIcon'
import { BentoLogo } from '../../components/BentoLogo'
import { BentoPageFrame } from '../../components/BentoPageFrame'
import { ContainerLarge } from '../../components/Container'
import { ThemeNameEffect } from '../../components/ThemeNameEffect'
import { getDefaultLayout } from '../../lib/getDefaultLayout'

export type ProComponentsProps = {
  proComponents?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  defaultCoupon?: Stripe.Coupon | null
  takeoutPlusBentoCoupon?: Stripe.Coupon | null
}

class BentoStore {
  heroVisible = true
  heroHeight = 800
}

export default function BentoPage(props: ProComponentsProps) {
  const store = useStore(BentoStore)

  const user = useUser()
  const coupon = user.data?.accessInfo.hasTakeoutAccess
    ? props.takeoutPlusBentoCoupon
    : props.defaultCoupon

  return (
    <Theme name="tan">
      <ThemeNameEffect colorKey="$color5" />
      <BentoPageFrame>
        <ThemeNameEffect colorKey="$color6" />
        <ContainerLarge zi={100000000} h={0}>
          <Button
            pos="absolute"
            t="$-10"
            r="$8"
            size="$2"
            circular
            icon={store.heroVisible ? Search : ChevronDown}
            onPress={() => {
              store.heroVisible = !store.heroVisible
            }}
            bg="$background025"
          ></Button>
        </ContainerLarge>
        <YStack
          onLayout={(e) => {
            store.heroHeight = e.nativeEvent.layout.height
          }}
        >
          <Hero mainProduct={props.proComponents} />
          <YStack pos="relative" zi={10000}>
            <ContainerLarge>
              <YStack pos="absolute" t={-30} r={80}>
                <BentoIcon scale={2} />
              </YStack>
            </ContainerLarge>
          </YStack>
          <Intermediate />
        </YStack>
        <Body />
        <Theme name="yellow">
          <PurchaseModal defaultCoupon={coupon} proComponents={props.proComponents} />
        </Theme>
      </BentoPageFrame>
    </Theme>
  )
}

BentoPage.getLayout = getDefaultLayout

const Intermediate = () => {
  return (
    <YStack className="blur-8" zi={1} w="100%">
      {/* <YStack fullscreen elevation="$4" o={0.15} /> */}
      <YStack pos="absolute" t={0} l={0} r={0} o={0.25} btw={0.5} bc="$color025" />
      <YStack pos="absolute" b={0} l={0} r={0} o={0.25} btw={0.5} bc="$color025" />
      <ThemeTintAlt offset={-1}>
        <YStack fullscreen bg="$color9" o={0.08} />
      </ThemeTintAlt>
      <ContainerLarge>
        <XStack
          gap="$4"
          py="$6"
          $sm={{
            fd: 'column',
          }}
        >
          <ThemeTintAlt offset={-1}>
            <IntermediateCard Icon={Globe} title="Universal">
              Components that adapt well to all screen sizes and platforms.
            </IntermediateCard>
          </ThemeTintAlt>
          <ThemeTintAlt offset={0}>
            <IntermediateCard Icon={Puzzle} title="Copy & Paste">
              Designed for easy adoption into your app and easy customization.
            </IntermediateCard>
          </ThemeTintAlt>
          <ThemeTintAlt offset={1}>
            <IntermediateCard Icon={Leaf} title="Always Growing">
              We continuously improve and add to the collection.
            </IntermediateCard>
          </ThemeTintAlt>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

const IntermediateCard = ({
  title,
  children,
  Icon,
}: { title?: any; children?: any; Icon?: any }) => {
  return (
    <XStack className="" ov="hidden" f={1} gap="$5" px="$5" py="$4">
      <YStack f={1} gap="$2">
        <H4 ff="$silkscreen" color="$color11" className="text-glow" size="$2">
          {title}
        </H4>
        <Paragraph mb={-5} size="$3" color="$color12">
          {children}
        </Paragraph>
        <EnsureFlexed />
      </YStack>
      <Circle
        outlineColor="$color025"
        outlineOffset={-4}
        outlineWidth={1}
        outlineStyle="solid"
        size="$5"
        elevation="$0.5"
        // bg="$color025"
      >
        <Icon color="$color11" o={0.85} />
      </Circle>
    </XStack>
  )
}

const Hero = ({ mainProduct }: { mainProduct: ProComponentsProps['proComponents'] }) => {
  const store = useBentoStore()

  return (
    <YStack pos="relative" zi={0}>
      <ContainerLarge>
        <XStack
          gap="$6"
          py="$3"
          bc="transparent"
          jc="space-between"
          w={'100%'}
          $sm={{
            fd: 'column',
          }}
        >
          <YStack
            mt={-20}
            mb={30}
            maw="55%"
            zi={100}
            jc="space-between"
            f={10}
            ai="flex-start"
            gap="$6"
            $sm={{
              maw: '100%',
            }}
          >
            <YStack
              className="ms200 ease-in all"
              $xxs={{
                scale: 0.4,
              }}
              $xs={{
                scale: 0.5,
              }}
              $sm={{
                als: 'center',
                scale: 0.6,
                mb: -100,
                transformOrigin: 'center top',
              }}
              $md={{ mb: -100, scale: 0.72, transformOrigin: 'left top' }}
              $lg={{ scale: 0.9, y: 10 }}
            >
              <BentoLogo />
            </YStack>
            <YStack
              // account for the left bar visual offset
              ml={-20}
              als="center"
              maw={550}
              gap="$6"
              $sm={{ px: '$4', maw: 400 }}
            >
              <XStack gap="$6">
                <Stack bg="$color7" w={8} br="$2" my={18} $sm={{ dsp: 'none' }} />
                <Paragraph
                  className="pixelate"
                  ff="$munro"
                  fos={28}
                  lh={50}
                  color="$color11"
                  ls={1}
                  $md={{
                    mt: '$6',
                    fos: 22,
                    lh: 38,
                  }}
                  $sm={{
                    ta: 'center',
                  }}
                >
                  Boost your React development with a suite of copy-paste primitives.
                </Paragraph>
              </XStack>
              <XStack
                jc="space-between"
                ai="center"
                ml="$8"
                mr="$4"
                $md={{ mx: 0, fd: 'column', gap: '$3' }}
              >
                <Paragraph color="$color10" size="$5" $md={{ size: '$3' }}>
                  One-time Purchase
                </Paragraph>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <XStack ai="center" jc="space-between">
                  <Spacer />
                  <Theme name="green">
                    <Button
                      iconAfter={ShoppingCart}
                      // iconAfter={
                      //   <YStack
                      //     zi={100}
                      //     bg="red"
                      //     style={{
                      //       background: `url(/bento/bentoicon.svg)`,
                      //       backgroundSize: 'contain',
                      //     }}
                      //     w={42}
                      //     h={42}
                      //     ml={-10}
                      //     mr={-15}
                      //   />
                      // }
                      className="box-3d all ease-in-out ms100"
                      size="$3"
                      scaleSpace={0.75}
                      als="flex-end"
                      mr="$4"
                      color="$color1"
                      bg="$color9"
                      outlineColor="$background025"
                      outlineOffset={2}
                      outlineWidth={3}
                      outlineStyle="solid"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$background05',
                        bc: '$color11',
                      }}
                      pressStyle={{
                        bg: '$color9',
                        outlineColor: '$background075',
                      }}
                      onPress={() => {
                        store.showPurchase = true
                      }}
                    >
                      <Button.Text fontFamily="$mono" size="$3" fow="bold">
                        $
                        {(mainProduct?.prices.sort(
                          (a, b) =>
                            (a.unit_amount || Infinity) - (b.unit_amount || Infinity)
                        )[0].unit_amount || 0) / 100}
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Circle size={4} bg="$color10" $md={{ dsp: 'none' }} />

                <Paragraph color="$color10" size="$5" $md={{ size: '$3' }}>
                  Lifetime rights
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          <YStack
            className="ms300 ease-in all"
            mr={-300}
            ml={-150}
            maw={1000}
            mt={-125}
            pl={100}
            pr={300}
            pt={100}
            x={20}
            mb={-500}
            y={-20}
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent 65%)`,
            }}
            $md={{
              mr: -400,
              mt: -150,
              scale: 0.9,
            }}
          >
            <Theme name="gray">
              <XStack
                pe="none"
                rotate="4deg"
                $sm={{
                  mt: -85,
                  mb: -60,
                }}
                scale={0.8}
              >
                <YStack br="$4" shac="rgba(0,0,0,0.2)" shar="$8">
                  <ThemeTintAlt>
                    <Theme name="surface4">
                      <Sections.Preferences.LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 105% 0%, 65% 100%, 0% 100%)`,
                  }}
                >
                  <ThemeTintAlt>
                    <Theme name="surface3">
                      <Sections.Preferences.LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 75% 0%, 30% 100%, 0% 100%)`,
                  }}
                >
                  <ThemeTintAlt>
                    <Theme name="surface2">
                      <Sections.Preferences.LocationNotification />
                    </Theme>
                  </ThemeTintAlt>
                </YStack>

                <YStack
                  pos="absolute"
                  zi={1}
                  l={0}
                  style={{
                    clipPath: `polygon(0% 0%, 45% 0%, 0% 100%, 0% 100%)`,
                  }}
                >
                  <Sections.Preferences.LocationNotification />
                </YStack>

                <YStack
                  pos="absolute"
                  zi={-1}
                  l="15%"
                  scale={0.9}
                  rotate="5deg"
                  br="$4"
                  shac="rgba(0,0,0,0.2)"
                  shar="$8"
                >
                  <ThemeTint>
                    <Theme name="surface3">
                      <Sections.Preferences.LocationNotification />
                    </Theme>
                  </ThemeTint>
                </YStack>
              </XStack>
            </Theme>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

const Body = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [filter, setFilter] = useState('')
  const store = useStore(BentoStore)

  const filteredSections = useMemo(() => {
    if (!filter) return Sections.listingData.sections
    return Sections.listingData.sections
      .map(({ sectionName, parts }) => {
        const filteredParts = parts.filter((part) => {
          return part.name.toLowerCase().includes(filter.toLowerCase())
        })
        return filteredParts.length
          ? {
              sectionName,
              parts: filteredParts,
            }
          : undefined
      })
      .filter(Boolean)
  }, [filter])

  return (
    <YStack
      pos="relative"
      className="all ease-in-out ms300"
      // @ts-ignore
      onTransitionEnd={() => {
        if (!store.heroVisible) {
          inputRef.current?.focus()
        }
      }}
      pb="$8"
      // bg="$background"
      style={{
        backdropFilter: `blur(${store.heroVisible ? 0 : 200}px)`,
        WebkitBackdropFilter: `blur(${store.heroVisible ? 0 : 200}px)`,
      }}
      y={0}
      minHeight={800}
      {...(!store.heroVisible && {
        y: -store.heroHeight,
        shadowColor: '$shadowColor',
        shadowRadius: 3,
      })}
      zi={10000}
    >
      {/* <Separator bc="$color" pos="absolute" t={0} l={0} r={0} o={0.05} /> */}

      <YStack>
        <ContainerLarge>
          <Input
            unstyled
            ref={inputRef as any}
            w="100%"
            size="$5"
            px="$3"
            fow="200"
            value={filter}
            onChangeText={setFilter}
            placeholder="Filter..."
            placeholderTextColor="rgba(0,0,0,0.3)"
            zi={100}
          />
        </ContainerLarge>

        {filteredSections.map(({ sectionName, parts }) => {
          return (
            <YStack id={sectionName} key={sectionName} jc={'space-between'}>
              <Theme name="tan">
                <YStack pos="relative">
                  <YStack fullscreen bg="$background025" o={0.24} />
                  <ContainerLarge>
                    <YStack py="$2" px="$3" pos="relative">
                      <H3
                        ff="$silkscreen"
                        size="$3"
                        fos={12}
                        ls={3}
                        tt="uppercase"
                        color="$color10"
                        f={2}
                      >
                        {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
                      </H3>
                    </YStack>
                  </ContainerLarge>
                </YStack>

                <Separator o={0.1} />
              </Theme>

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
                  <Theme name="tan">
                    <XStack
                      gap="$5"
                      f={4}
                      fs={1}
                      $gtLg={{
                        maw: '100%',
                        fw: store.heroVisible ? 'wrap' : 'nowrap',
                      }}
                    >
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
                      <Spacer width="calc(50vw - 300px)" />
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
        ov="hidden"
        // className="all ease-in ms100"
        // elevation="$6"
        // bg="$background025"
        w={220}
        h={125}
        // br="$9"
        cursor="pointer"
        pos="relative"
        hoverStyle={{
          bg: `rgba(255,255,255,0.05)`,
        }}
        pressStyle={{
          bg: 'rgba(255,255,255,0.075)',
          y: 1,
        }}
        $gtMd={{
          w: 'calc(25% - var(--space-12))',
        }}
      >
        <YStack p="$3">
          <Theme name="gray">
            <H4 ff="$body" size="$5" fow="600" color="$color12">
              {name}
            </H4>
          </Theme>
          <H5 theme="alt1" size="$1" ls={1}>
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
  const defaultPromoListPromise = stripe.promotionCodes.list({
    code: 'SITE-PRO-COMPONENTS', // ones with code SITE-PRO-COMPONENTS are considered public and will be shown here
    active: true,
    expand: ['data.coupon'],
  })
  const takeoutPlusBentoPromotionCodePromise = stripe.promotionCodes.list({
    code: 'TAKEOUTPLUSBENTO', // ones with code TAKEOUTPLUSBENTO are considered public and will be shown here
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
  const promises = [
    defaultPromoListPromise,
    takeoutPlusBentoPromotionCodePromise,
    ...productPromises,
  ]
  const queries = await Promise.all(promises)

  // slice(2) because the first two are coupon info
  const products = queries.slice(2) as Awaited<(typeof productPromises)[number]>[]
  const defaultCouponList = queries[0] as Awaited<typeof defaultPromoListPromise>
  const takeoutPlusBentoCouponList = queries[1] as Awaited<
    typeof takeoutPlusBentoPromotionCodePromise
  >
  let defaultCoupon: Stripe.Coupon | null = null

  if (defaultCouponList.data.length > 0) {
    defaultCoupon = defaultCouponList.data[0].coupon
  }

  let takeoutPlusBentoCoupon: Stripe.Coupon | null = null

  if (takeoutPlusBentoCouponList.data.length > 0) {
    takeoutPlusBentoCoupon = takeoutPlusBentoCouponList.data[0].coupon
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
    defaultCoupon,
    takeoutPlusBentoCoupon,
  }
}
