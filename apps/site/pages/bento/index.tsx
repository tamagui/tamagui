import { NextLink } from '@components/NextLink'
import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import { getTakeoutPriceInfo } from '@lib/getProductInfo'
import * as sections from '@tamagui/bento'
import { ButtonDemo, InputsDemo, SelectDemo } from '@tamagui/demos'
import { getSize } from '@tamagui/get-token'
import { ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import {
  Check,
  CheckCircle,
  ShoppingBag,
  ShoppingCart,
  X,
  XCircle,
} from '@tamagui/lucide-icons'
import { useBentoStore } from 'hooks/useBentoStore'
import React, { useMemo, useState } from 'react'
import Stripe from 'stripe'
import {
  Anchor,
  AnimatePresence,
  Button,
  ButtonProps,
  Card,
  Dialog,
  FontSizeTokens,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  Input,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Spacer,
  Text,
  Theme,
  Unspaced,
  XStack,
  XStackProps,
  YStack,
  useThemeName,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { ContainerLarge } from '../../components/Container'
import { getDefaultLayout } from '../../lib/getDefaultLayout'

const Point = ({
  size = '$4',
  children,
  subtitle,
  ...props
}: XStackProps & {
  children: any
  subtitle?: any
  size?: FontSizeTokens
}) => {
  return (
    <XStack tag="li" ai="flex-start" space f={1} ov="hidden" {...props}>
      <YStack py="$1.5">
        <Check size={16} color="$color10" />
      </YStack>
      <YStack f={1}>
        <Paragraph wordWrap="break-word" size={size}>
          {children}
        </Paragraph>
        {!!subtitle && (
          <Paragraph
            size={
              getSize(size, {
                shift: -2,
              }) as any
            }
            theme="alt2"
            o={0.5}
          >
            {subtitle}
          </Paragraph>
        )}
      </YStack>
    </XStack>
  )
}

const checkCircle = <CheckCircle color="$green9" />
const xCircle = <XCircle size={28} color="$red9" />

const points = {
  // this one's only shown on modal
  monorepo: [
    'Well-isolated configuration.',
    'Nearly all code shared between web and native.',
    'Guided setup script, easily generate common patterns.',
  ],
  design: [
    'Complete design system with the new ThemeBuilder for easy customization.',
    'Two brand new theme packs - Neon and Pastel.',
  ],
  deploy: [
    'Vercel + Preview Deploys.',
    'Expo EAS + Expo Router.',
    'Script that sets up both local and remote dev environments.',
  ],
  screens: [
    'Variety of screen types adapted to each platform.',
    'Onboarding, auth, account, settings, profile, feed, edit profile.',
    'Universal forms + zod validation.',
  ],
  assets: [
    '+150 icon packs, adapted to use themes, sizing, and tree shaking.',
    'All of Google fonts, over +1500 packs.',
  ],
  more: [
    'Image upload and Supabase utils.',
    'Reanimated, Solito, React Query, Zod & more',
    'TakeoutBot ongoing updates.',
    'Private Discord.',
  ],
}

const Points = () => (
  <YStack tag="ul" gap="$1.5" zi={2} ov="hidden">
    {/* <Point>React (web, native, ios) monorepo sharing a single codebase</Point>
    <Point>
      All the important screens: Onboard, Register, Login, Forgot Password, Account,
      Settings, Profile, Edit Profile, Feed
    </Point>
    <Point>SSR, RSC, choose from 3 animation drivers</Point> 
    <Point>Complete & fully typed design system</Point>
    <Point>+150 icon packs</Point>
    <Point>2 all new theme suites: Pastel & Neon</Point>
    <Point>All of Google fonts fonts</Point>
    <Point>Github template with PR bot for updates</Point>
    <Point>Fully tested CI/CD: unit, integration, web and native</Point>
    <Point>Preview deploys for web, app-store builds with EAS</Point> */}
    {Object.entries(points).map(([key, group]) => (
      <React.Fragment key={key}>
        {group.map((point) => (
          <Point key={point}>{point}</Point>
        ))}
      </React.Fragment>
    ))}
  </YStack>
)

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

const PromotionInput = () => {
  const store = useBentoStore()

  const [localCode, setLocalCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const applyCoupon = (promoCode: string, coupon: Stripe.Coupon) => {
    store.appliedCoupon = coupon
    store.appliedPromoCode = promoCode
  }

  const removeCoupon = () => {
    setLocalCode('')
    store.appliedCoupon = null
    store.appliedPromoCode = null
  }

  const closeField = () => {
    setLocalCode('')
    store.promoInputIsOpen = false
  }

  const checkPromotion = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/check-promo-code?${new URLSearchParams({ code: localCode })}`
      )
      if (res.status === 200) {
        const json = (await res.json()) as Stripe.Coupon
        applyCoupon(localCode, json)
      } else {
        const json = await res.json()
        if (json.message) {
          alert(json.message)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {store.promoInputIsOpen ? (
        <XStack
          key="is-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          gap="$2"
          jc="center"
          ai="center"
        >
          {store.appliedPromoCode ? (
            <>
              <Paragraph theme="green_alt2">
                Coupon {store.appliedPromoCode} applied.
              </Paragraph>
              <Button chromeless size="$2" onPress={removeCoupon}>
                Remove Coupon
              </Button>
            </>
          ) : (
            <>
              {!store.appliedPromoCode && (
                <Button disabled={isLoading} size="$2" chromeless onPress={closeField}>
                  Cancel
                </Button>
              )}
              <Input
                disabled={!!store.appliedPromoCode}
                value={store.appliedPromoCode ?? localCode}
                onChangeText={(text) => {
                  setLocalCode(text)
                }}
                placeholder="Enter the code"
                size="$2"
              />
              <Button
                disabled={isLoading}
                themeInverse
                size="$2"
                onPress={checkPromotion}
              >
                Submit
              </Button>
            </>
          )}
        </XStack>
      ) : (
        <Paragraph
          key="is-not-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          ta="right"
          textDecorationLine="underline"
          cursor="pointer"
          theme="alt2"
          size="$2"
          onPress={() => {
            store.promoInputIsOpen = true
          }}
        >
          Have a coupon code?
        </Paragraph>
      )}
    </AnimatePresence>
  )
}

function PurchaseButton(props: ButtonProps) {
  return (
    <ThemeTint>
      <Button
        size="$6"
        backgroundColor="$color8"
        borderWidth={2}
        borderColor="$color10"
        hoverStyle={{
          backgroundColor: '$color9',
        }}
        pressStyle={{
          backgroundColor: '$color8',
        }}
        {...props}
      >
        <Button.Text ff="$silkscreen" fontWeight="700">
          {props.children}
        </Button.Text>
      </Button>
    </ThemeTint>
  )
}

const PurchaseModal = ({ starter, coupon }) => {
  const products = [starter]
  const store = useBentoStore()
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>(
    products.filter(Boolean).map((p) => p!.id)
  )
  const sortedStarterPrices = (starter?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )

  const [starterPriceId, setStarterPriceId] = useState(sortedStarterPrices[0]?.id)

  const sum = useMemo(() => {
    if (!starter) {
      return 0
    }
    let final = 0
    return starter.prices[0].unit_amount
    // TODO: fix this part
    // if (selectedProductsIds.includes(starter.id)) {
    //   final += starterPriceId
    //     ? starter.prices.find((p) => p.id === starterPriceId)?.unit_amount ?? 0
    //     : 0
    // }
    // return final
  }, [selectedProductsIds, starterPriceId, starter])

  // with discount applied
  const finalPrice = useMemo(() => {
    const appliedCoupon = store.appliedCoupon ?? coupon
    if (appliedCoupon) {
      if (appliedCoupon.amount_off) return sum - appliedCoupon.amount_off
      if (appliedCoupon.percent_off)
        return (sum * (100 - appliedCoupon.percent_off)) / 100
    }

    return sum
  }, [sum, store.appliedCoupon, coupon])
  const hasDiscountApplied = finalPrice !== sum

  const noProductSelected = selectedProductsIds.length === 0
  const showTeamSelect = selectedProductsIds.includes(starter?.id || '')

  // TODO: get bento price info
  const takeoutPriceInfo = getTakeoutPriceInfo(
    starter?.prices.find((price) => price.id === starterPriceId)?.description ?? ''
  )
  return (
    <Dialog
      modal
      open={store.showPurchase}
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame padding="$4" space>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="medium"
          className="blur-medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          // animateOnly={['transform']}
          enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
          w="90%"
          maw={900}
          p={0}
        >
          <ScrollView p="$6" $gtSm={{ maxHeight: '90vh' }}>
            <YStack space>
              <XStack ai="center" jc="center" gap="$6" mx="$8">
                <Dialog.Title size="$9" $sm={{ size: '$7' }} my="$1" als="center">
                  Purchase
                </Dialog.Title>
              </XStack>

              <XStack
                f={1}
                space
                separator={<Separator vertical />}
                $sm={{ fd: 'column-reverse' }}
              >
                <YStack maxWidth={450}>
                  <YStack
                    separator={<Separator o={0.35} />}
                    borderWidth="$0.5"
                    borderRadius="$4"
                    borderColor="$borderColor"
                  >
                    <XStack px="$4" py="$4" gap="$3">
                      <YStack width="80%">
                        <Paragraph size="$6" fow="bold">
                          Lifetime access + 1 year of updates
                        </Paragraph>
                        <Paragraph size="$3" theme="alt1">
                          You own the code for life, with updates for a year
                        </Paragraph>
                      </YStack>
                      <XStack f={1} ai="center" gap="$2" jc="center">
                        <Paragraph size="$8">{checkCircle}</Paragraph>
                      </XStack>
                    </XStack>
                    <XStack px="$4" py="$4" gap="$3">
                      <YStack width="80%">
                        <Paragraph size="$6">License Seats</Paragraph>
                        <Paragraph size="$3" theme="alt1">
                          Number of people that are allowed to develop on it
                        </Paragraph>
                      </YStack>
                      <XStack f={1} ai="center" gap="$2" jc="center">
                        <Paragraph size="$8">{takeoutPriceInfo.licenseSeats}</Paragraph>
                      </XStack>
                    </XStack>

                    <XStack px="$4" py="$4" gap="$3">
                      <YStack width="80%">
                        <Paragraph size="$6">Discord Seats</Paragraph>
                        <Paragraph size="$3" theme="alt1">
                          Access to the Bento channel
                        </Paragraph>
                      </YStack>
                      <XStack f={1} ai="center" gap="$2" jc="center">
                        <Paragraph size="$8">{takeoutPriceInfo.discordSeats}</Paragraph>
                      </XStack>
                    </XStack>
                    <XStack px="$4" py="$4" gap="$3">
                      <YStack width="80%">
                        <Paragraph size="$6">Discord #bento-general channel</Paragraph>
                        <Paragraph size="$3" theme="alt1">
                          Private group chat for all Bento purchasers
                        </Paragraph>
                      </YStack>
                      <XStack f={1} ai="center" gap="$2" jc="center">
                        <Paragraph size="$8">{checkCircle}</Paragraph>
                      </XStack>
                    </XStack>
                    <XStack px="$4" py="$4" gap="$3">
                      <YStack width="80%">
                        <Paragraph size="$6">Discord Private Channel</Paragraph>
                        <Paragraph size="$3" theme="alt1">
                          Private chat for your team only
                        </Paragraph>
                      </YStack>
                      <XStack f={1} ai="center" gap="$2" jc="center">
                        <Paragraph size="$8">
                          {takeoutPriceInfo.hasDiscordPrivateChannels
                            ? checkCircle
                            : xCircle}
                        </Paragraph>
                      </XStack>
                    </XStack>
                  </YStack>

                  {/* TODO: fix this */}
                  {/* <YStack mt="$6" space="$4">
                    <H4>What you will get with this package?</H4>
                    <Points />
                  </YStack> */}
                </YStack>

                <YStack f={2} space="$4">
                  <YStack
                    opacity={showTeamSelect ? 1 : 0.25}
                    pointerEvents={showTeamSelect ? 'auto' : 'none'}
                  >
                    <RadioGroup
                      gap="$2"
                      value={starterPriceId}
                      onValueChange={(val) => setStarterPriceId(val)}
                    >
                      {sortedStarterPrices.map((price) => {
                        const active = starterPriceId === price.id
                        const htmlId = `price-${price.id}`
                        return (
                          <ThemeTint key={price.id} disable={!active}>
                            <Label
                              f={1}
                              htmlFor={htmlId}
                              p="$4"
                              height="unset"
                              display="flex"
                              borderWidth="$0.25"
                              borderColor={active ? '$color8' : '$color5'}
                              borderRadius="$4"
                              space="$4"
                              ai="center"
                              hoverStyle={{
                                borderColor: active ? '$color10' : '$color7',
                              }}
                            >
                              <RadioGroup.Item id={htmlId} size="$6" value={price.id}>
                                <RadioGroup.Indicator />
                              </RadioGroup.Item>

                              <YStack gap="$0" f={1}>
                                <H4 mt="$-1">{price.description}</H4>

                                <Paragraph theme="alt1">
                                  {formatPrice(price.unit_amount! / 100, 'usd')} base + 1
                                  year of updates
                                </Paragraph>
                                {/* <Paragraph theme="alt1" size="$2">
                                  {formatPrice(price.unit_amount! / (100 * 2), 'usd')}{' '}
                                  annual renewal (cancel anytime)
                                </Paragraph> */}
                              </YStack>
                            </Label>
                          </ThemeTint>
                        )
                      })}
                    </RadioGroup>
                  </YStack>

                  <Spacer size="$1" />

                  <YStack space>
                    <XStack ai="flex-end" jc="flex-end" gap="$2">
                      {hasDiscountApplied ? (
                        <>
                          <H3 textDecorationLine="line-through" size="$8" theme="alt2">
                            {formatPrice(sum! / 100, 'usd')}
                          </H3>
                          <H3 size="$10">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                        </>
                      ) : (
                        <H3 size="$10">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                      )}
                    </XStack>
                    <Unspaced>
                      <YStack mt="$2">
                        <PromotionInput />
                      </YStack>
                    </Unspaced>

                    {/* <Separator /> */}

                    <YStack pb="$8" px="$4" space>
                      <NextLink
                        href={`api/checkout?${(function () {
                          const params = new URLSearchParams({
                            // product_id: products.id,
                            // price_id: selectedPriceId,
                            // quantity: seats.toString(),
                          })
                          for (const productId of selectedProductsIds) {
                            params.append('product_id', productId)
                          }
                          params.append(`price-${starter?.id}`, starterPriceId)
                          if (store.appliedPromoCode) {
                            // the coupon user applied
                            params.append(`promotion_code`, store.appliedPromoCode)
                          } else if (coupon) {
                            // the coupon that's applied by default (special event, etc.)
                            params.append(`coupon_id`, coupon.id)
                          }

                          return params.toString()
                        })()}`}
                      >
                        <PurchaseButton
                          disabled={noProductSelected}
                          opacity={noProductSelected ? 0.5 : undefined}
                        >
                          Purchase
                        </PurchaseButton>
                      </NextLink>
                      <XStack jc="space-between" space="$2" ai="center">
                        <XStack
                          ai="center"
                          separator={<Separator vertical bc="$color8" my="$2" />}
                          space="$2"
                        >
                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showFaq = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            FAQ
                          </SizableText>

                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showAgreement = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            License Agreement
                          </SizableText>
                        </XStack>
                        <Theme name="alt1">
                          <PoweredByStripeIcon width={96} />
                        </Theme>
                      </XStack>
                    </YStack>
                  </YStack>
                </YStack>
              </XStack>
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$4"
                right="$4"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const Hero = () => {
  const store = useBentoStore()
  const { tint } = useTint()

  return (
    <YStack pos="relative" mt={-55} pt={55} zi={0}>
      <LinearGradient
        colors={[`$backgroundStrong`, `$${tint}5`]}
        start={[0, 1]}
        end={[0, 0]}
        fullscreen
      />
      <ContainerLarge>
        <XStack gap="$6" py="$12" bc="transparent" jc="space-between" w={'100%'}>
          <YStack
            maw="55%"
            ov="hidden"
            zi={100}
            jc="space-between"
            f={10}
            ai="flex-start"
            gap="$4"
          >
            <H1 maw="100%" f={1} size="$14" mb="$-2">
              Well crafted add-ons.
            </H1>

            <YStack gap="$4">
              <ThemeTintAlt>
                <Paragraph size="$9" color="$color10">
                  Screens, components, and early access to upcoming OSS features.
                </Paragraph>
              </ThemeTintAlt>

              <Paragraph color="$gray12" size="$6">
                For just $200/year get access to ongoing releases of well designed,
                responsive and accessible cross-platform components for React and React
                Native, ready to copy-paste into your app.
              </Paragraph>
            </YStack>

            <Separator />

            <XStack gap="$3">
              <ThemeTintAlt>
                <Button
                  theme="active"
                  iconAfter={ShoppingCart}
                  fontFamily="$mono"
                  onPress={() => {
                    store.showPurchase = true
                  }}
                >
                  Purchase — $200
                </Button>
              </ThemeTintAlt>
            </XStack>
          </YStack>

          <XStack zi={100} gap="$4" mr={-400} mah={300} als="center">
            <Card elevate>
              <ButtonDemo />
            </Card>
            <Card elevate>
              <InputsDemo />
            </Card>
            <Card p="$4" elevate>
              <SelectDemo />
            </Card>
          </XStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

const Body = () => {
  const store = useBentoStore()
  return (
    <ContainerLarge gap="$2">
      <H2>Sections</H2>
      <Paragraph size="$6" color={'$gray11'}>
        Components are divided into sections and each section has multiple groups of
        related components.
      </Paragraph>

      <Spacer size="$8" />

      <YStack gap="$12">
        {sections.listingData.sections.map(({ sectionName, parts }) => {
          return (
            <YStack gap="$4" jc={'space-between'}>
              <H2 fontSize={'$8'} f={2}>
                {`${sectionName[0].toUpperCase()}${sectionName.slice(1)}`}
              </H2>
              <Separator o={0.5} />
              <XStack gap={'$6'} f={4} fw="wrap" fs={1}>
                {parts.map(({ name: partsName, numberOfComponents, route }) => (
                  <ComponentGroupsBanner
                    path={route}
                    name={partsName}
                    numberOfComponents={numberOfComponents}
                  />
                ))}
              </XStack>
            </YStack>
          )
        })}
      </YStack>

      <Spacer size="$12" />
      <Separator />
      <Spacer size="$12" />
    </ContainerLarge>
  )
}

function ComponentGroupsBanner({
  name,
  numberOfComponents,
  path,
}: {
  name: string
  numberOfComponents: number
  path: string
}) {
  return (
    <Anchor
      hoverStyle={{
        borderColor: '$blue5',
      }}
      bw={1}
      boc="$gray2"
      br="$2"
      ov="hidden"
      accessible
      cursor="pointer"
      href={BASE_PATH + path}
    >
      <Image bc="$background" w={200} h={200} source={{ uri: '' }} />
      <YStack px="$4" py="$2">
        <H4 fontWeight={'normal'} fontSize="$4">
          {name}
        </H4>
        <H5 fontWeight={'normal'} fontSize={'$2'}>
          {numberOfComponents} components
        </H5>
      </YStack>
    </Anchor>
  )
}

const BASE_PATH = ' /bento'

export default () => null

// export default this component
export function ProPage() {
  const store = useBentoStore()
  return (
    <YStack>
      <Hero />
      <Spacer size={'$8'} />
      <Body />
      <PurchaseModal
        coupon={
          {
            // stripe coupon
          } as Stripe.Coupon
        }
        starter={{
          active: true,
          description: 'a collection of components',
          id: 'bento',
          image: '/img',
          name: 'Bento',
          prices: [
            {
              active: true,
              currency: 'usd',
              unit_amount: 20000,
            },
          ],
        }}
      />

      <Spacer size="$10" />
    </YStack>
  )
}

ProPage.getLayout = getDefaultLayout
