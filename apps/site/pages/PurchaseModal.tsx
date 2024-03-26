import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import {
  BentoTable,
  MunroP,
  PurchaseButton,
  RadioGroupItem,
  TakeoutTable,
  formatPrice,
} from '@lib/products-utils'
import { useTint } from '@tamagui/logo'
import { Check, X } from '@tamagui/lucide-icons'
import { useUser } from 'hooks/useUser'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import type { ThemeName } from 'tamagui'
import {
  Button,
  Dialog,
  H3,
  H4,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Spacer,
  Tabs,
  Theme,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'
import { BentoLogo } from '../components/BentoLogo'
import { NextLink } from '../components/NextLink'
import { useTakeoutStore } from '../hooks/useTakeoutStore'
import type { TakeoutPageProps } from './takeout'
import { BentoPoliciesModal, TakeoutPoliciesModal } from './PoliciesModal'
import { BentoAgreementModal, TakeoutAgreementModal } from './AgreementModal'
import { TakeoutFaqModal } from '@components/FaqModal'

export const PurchaseModal = ({
  starter,
  iconsPack,
  fontsPack,
  bento,
  defaultValue,
  defaultCoupon,
}: Omit<TakeoutPageProps, 'takeoutPlusBentoCoupon'> & {
  defaultValue: 'takeout' | 'bento'
}) => {
  const store = useTakeoutStore()

  // const prices = products.prices
  // const [selectedPriceId, setSelectedPriceId] = useState(prices[prices.length - 1].id)

  const sortedStarterPrices = (starter?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )
  const sortedBentoPrices = (bento?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )
  const [starterPriceId, setStarterPriceId] = useState<null | string>(
    defaultValue === 'takeout' ? sortedStarterPrices[0]?.id || null : null
  )
  const [bentoPriceId, setBentoPriceId] = useState<null | string>(
    defaultValue === 'bento' ? sortedBentoPrices[0]?.id || null : null
  )
  const { data } = useUser()
  // const subscriptions = data?.subscriptions
  // const subscription = subscriptions?.find((sub) => {
  //   if (sub.status !== 'active') return false
  //   const price = sub.prices
  //     ? Array.isArray(sub.prices)
  //       ? sub.prices[0]
  //       : sub.prices
  //     : null
  //   if (!price) return false
  //   return price.product_id === products.id
  // })
  // const sortedPrices = prices.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0))
  const sum = useMemo(() => {
    if (!starter || !iconsPack || !fontsPack) {
      return 0
    }
    let final = 0
    if (starterPriceId) {
      final += starterPriceId
        ? starter.prices.find((p) => p.id === starterPriceId)?.unit_amount ?? 0
        : 0
    }
    if (starterPriceId) {
      final += iconsPack.prices[0].unit_amount ?? 0
    }
    if (starterPriceId) {
      final += fontsPack.prices[0].unit_amount ?? 0
    }
    if (bentoPriceId) {
      final += bentoPriceId
        ? bento.prices.find((p) => p.id === bentoPriceId)?.unit_amount ?? 0
        : 0
    }
    return final
  }, [starterPriceId, bentoPriceId, starter, iconsPack, fontsPack])

  const finalCoupon = store.appliedCoupon || defaultCoupon
  // with discount applied
  const finalPrice = useMemo(() => {
    if (finalCoupon) {
      if (finalCoupon.amount_off) return sum - finalCoupon.amount_off
      if (finalCoupon.percent_off) return (sum * (100 - finalCoupon.percent_off)) / 100
    }

    return sum
  }, [sum, finalCoupon])
  // const hasDiscountApplied = finalPrice !== sum

  const noProductSelected = !bentoPriceId && !starterPriceId

  // const enable3d = useClientValue(
  //   () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  // )

  const [currentTab, setCurrentTab] = useState(defaultValue)

  return (
    <Dialog
      modal
      open={store.showPurchase}
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <BentoPoliciesModal />
      <BentoAgreementModal />

      <TakeoutPoliciesModal />
      <TakeoutAgreementModal />
      <TakeoutFaqModal />

      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame padding={0} gap>
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
          theme="surface1"
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
          <Tabs
            orientation="horizontal"
            flexDirection="column"
            defaultValue={defaultValue}
            size="$6"
            value={currentTab}
          >
            <Tabs.List>
              <YStack width={'50%'} f={1}>
                <Tabs.Tab
                  onPress={() => setCurrentTab('takeout')}
                  disableActiveTheme
                  value="takeout"
                  backgroundColor={
                    currentTab === 'takeout' ? '$background' : '$background075'
                  }
                >
                  <H4 fontFamily="$cherryBomb">
                    <ThemedTakeoutLogo />
                  </H4>
                </Tabs.Tab>
              </YStack>
              <YStack width={'50%'} f={1}>
                <Tabs.Tab
                  onPress={() => setCurrentTab('bento')}
                  disableActiveTheme
                  value="bento"
                  backgroundColor={
                    currentTab === 'bento' ? '$background' : '$background075'
                  }
                >
                  <BentoLogo noShadow scale={0.2} />
                </Tabs.Tab>
              </YStack>
            </Tabs.List>
            <ScrollView $gtSm={{ height: '60vh' }}>
              <YStack f={1} group="takeoutBody" px="$4" pb="$4">
                <Tabs.Content f={1} value="takeout">
                  <XStack jc="flex-end" my="$2">
                    <Button
                      onPress={() => setStarterPriceId(null)}
                      o={starterPriceId ? 1 : 0}
                      size="$1"
                      chromeless
                    >
                      Clear
                    </Button>
                  </XStack>
                  <XStack f={1} gap="$4" $group-takeoutBody-sm={{ fd: 'column-reverse' }}>
                    <YStack
                      f={1}
                      maw="50%"
                      $group-takeoutBody-sm={{
                        maw: '100%',
                      }}
                    >
                      <YStack gap="$4">
                        <YStack gap="$2">
                          <TakeoutTable
                            product={starter}
                            selectedPriceId={starterPriceId || ''}
                          />
                          <XStack
                            mt="$2"
                            theme="green"
                            bg="$color3"
                            p="$4"
                            bw={1}
                            bc="$color5"
                            br="$4"
                            gap="$3"
                          >
                            <Check size={24} mt={2} color="$color9" />
                            <MunroP size="$7" color="$color11">
                              Every plan includes the starter, icons & fonts
                            </MunroP>
                          </XStack>
                        </YStack>
                      </YStack>

                      <YStack mt="$6" gap="$4" ai="center">
                        <Paragraph size="$3" theme="alt1">
                          Instant one-click cancel your subscription from{' '}
                          <Link href="/account/items">Subscriptions</Link>
                        </Paragraph>
                      </YStack>
                    </YStack>

                    <Separator vertical />

                    <YStack f={2} gap="$4">
                      <YStack gap="$4">
                        <YStack gap="$2">
                          <RadioGroup
                            gap="$2"
                            value={starterPriceId || ''}
                            onValueChange={(val) => setStarterPriceId(val)}
                          >
                            {sortedStarterPrices.map((price) => {
                              const active = starterPriceId === price.id
                              const htmlId = `price-${price.id}`
                              return (
                                <RadioGroupItem
                                  key={htmlId}
                                  active={active}
                                  value={price.id}
                                  id={htmlId}
                                >
                                  <H4 mt="$-1">
                                    {price.description === 'Unlimited (+9 seats)'
                                      ? 'Pro'
                                      : price.description === 'Hobby (3-8 seats)'
                                        ? 'Team'
                                        : 'Personal'}
                                  </H4>

                                  <Paragraph theme="alt2">
                                    {formatPrice(price.unit_amount! / 100, 'usd')} base +
                                    1 year of updates
                                  </Paragraph>
                                  {/* <Paragraph theme="alt1" size="$2">
                            {formatPrice(price.unit_amount! / (100 * 2), 'usd')}{' '}
                            annual renewal (cancel anytime)
                          </Paragraph> */}
                                </RadioGroupItem>
                              )
                            })}
                          </RadioGroup>
                        </YStack>
                      </YStack>
                    </YStack>
                  </XStack>
                </Tabs.Content>

                <Tabs.Content value="bento">
                  <XStack jc="flex-end" my="$2">
                    <Button
                      onPress={() => setBentoPriceId(null)}
                      o={bentoPriceId ? 1 : 0}
                      size="$1"
                      chromeless
                    >
                      Clear
                    </Button>
                  </XStack>
                  <XStack f={1} gap="$4" $group-takeoutBody-sm={{ fd: 'column-reverse' }}>
                    <YStack
                      f={1}
                      maw="50%"
                      $group-takeoutBody-sm={{
                        maw: '100%',
                      }}
                    >
                      <YStack gap="$4">
                        <YStack gap="$2">
                          <BentoTable
                            product={bento}
                            selectedPriceId={bentoPriceId || ''}
                          />
                        </YStack>
                      </YStack>

                      <YStack mt="$6" gap="$4" ai="center">
                        <Paragraph size="$3" theme="alt1">
                          Instant one-click cancel your subscription from{' '}
                          <Link href="/account/items">Subscriptions</Link>
                        </Paragraph>
                      </YStack>
                    </YStack>

                    <Separator vertical />

                    <YStack f={2} gap="$4">
                      <YStack gap="$4">
                        <YStack gap="$2">
                          <RadioGroup
                            gap="$2"
                            value={bentoPriceId || ''}
                            onValueChange={(val) => setBentoPriceId(val)}
                          >
                            {sortedBentoPrices.map((price) => {
                              const active = bentoPriceId === price.id
                              const htmlId = `price-${price.id}`
                              return (
                                <RadioGroupItem
                                  key={price.id}
                                  active={active}
                                  value={price.id}
                                  id={htmlId}
                                >
                                  <H4 mt="$-1">{price.description}</H4>

                                  <Paragraph theme="alt2">
                                    {formatPrice(price.unit_amount! / 100, 'usd')} base +
                                    1 year of updates
                                  </Paragraph>
                                  {/* <Paragraph theme="alt1" size="$2">
                                {formatPrice(price.unit_amount! / (100 * 2), 'usd')}{' '}
                                annual renewal (cancel anytime)
                              </Paragraph> */}
                                </RadioGroupItem>
                              )
                            })}
                          </RadioGroup>
                        </YStack>
                      </YStack>
                    </YStack>
                  </XStack>
                </Tabs.Content>
              </YStack>
              <Spacer size="$1" />
            </ScrollView>
            <Separator />
            <YStack p="$6" gap="$2">
              <XStack jc="space-between" ai="flex-start" gap="$6">
                <YStack width="40%">
                  <XStack>
                    <H3 size="$11">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                  </XStack>
                  <Paragraph size="$2">
                    {(() => {
                      const items: string[] = []
                      const starterPrice = starterPriceId
                        ? starter.prices.find((price) => price.id === starterPriceId)
                        : null
                      const bentoPrice = bentoPriceId
                        ? bento.prices.find((price) => price.id === bentoPriceId)
                        : null

                      if (starterPrice) {
                        items.push(`Takeout ${starterPrice?.description}`)
                      }
                      if (bentoPrice) {
                        items.push(`Bento ${bentoPrice?.description}`)
                      }
                      if (items.length === 0) return null
                      return (
                        <Paragraph theme="alt2">
                          {items
                            .map<React.ReactNode>((item) => (
                              <Paragraph theme="alt1">{item}</Paragraph>
                            ))
                            .reduce((prev, curr) => [prev, ' + ', curr])}
                        </Paragraph>
                      )
                    })()}
                  </Paragraph>
                  <Paragraph size="$1" theme="alt2">
                    You can apply promo codes on the checkout page
                  </Paragraph>
                </YStack>
                {/* <Unspaced>
                <YStack mt="$2" gap="$1">
                  {finalCoupon ? (
                    <SizableText textAlign="right" size="$3">
                      Coupon "{finalCoupon.name}" is applied.
                    </SizableText>
                  ) : null}
                  <PromotionInput />
                </YStack>
              </Unspaced> */}

                <YStack gap="$2" width="40%">
                  <NextLink
                    href={`api/checkout?${(() => {
                      const params = new URLSearchParams({
                        // product_id: products.id,
                        // price_id: selectedPriceId,
                        // quantity: seats.toString(),
                      })
                      if (starterPriceId) {
                        params.append('product_id', starter.id)
                        params.append(`price-${starter?.id}`, starterPriceId)
                      }
                      if (bentoPriceId) {
                        params.append('product_id', bento.id)
                        params.append(`price-${bento?.id}`, bentoPriceId)
                      }

                      if (store.appliedPromoCode) {
                        // the coupon user applied
                        params.append(`promotion_code`, store.appliedPromoCode)
                      } else if (defaultCoupon) {
                        // the coupon that's applied by default (special event, etc.)
                        params.append(`coupon_id`, defaultCoupon.id)
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
                  <XStack jc="space-between" gap="$10" ai="center" mb="$2">
                    <XStack
                      ai="center"
                      separator={<Separator vertical bg="$color8" my="$2" />}
                      gap="$2"
                    >
                      {/* currently no FAQ for bento - to add, just remove the condition and add the FAQ modal like the takeout one. */}
                      {currentTab === 'takeout' && (
                        <SizableText
                          theme="alt1"
                          cursor="pointer"
                          onPress={() => {
                            if (currentTab === 'takeout') {
                              store.showTakeoutFaq = true
                            } else if (currentTab === 'bento') {
                              store.showBentoFaq = true
                            }
                          }}
                          style={{ textDecorationLine: 'underline' }}
                          hoverStyle={{
                            color: '$color11',
                          }}
                          size="$2"
                        >
                          FAQ
                        </SizableText>
                      )}

                      <SizableText
                        theme="alt1"
                        cursor="pointer"
                        onPress={() => {
                          if (currentTab === 'takeout') {
                            store.showTakeoutAgreement = true
                          } else if (currentTab === 'bento') {
                            store.showBentoAgreement = true
                          }
                        }}
                        style={{ textDecorationLine: 'underline' }}
                        hoverStyle={{
                          color: '$color11',
                        }}
                        size="$2"
                      >
                        License
                      </SizableText>

                      <SizableText
                        theme="alt1"
                        cursor="pointer"
                        onPress={() => {
                          if (currentTab === 'takeout') {
                            store.showTakeoutPolicies = true
                          } else if (currentTab === 'bento') {
                            store.showBentoPolicies = true
                          }
                        }}
                        style={{ textDecorationLine: 'underline' }}
                        hoverStyle={{
                          color: '$color11',
                        }}
                        size="$2"
                      >
                        Policies
                      </SizableText>
                    </XStack>
                    <Theme name="alt1">
                      <PoweredByStripeIcon width={96} height={40} />
                    </Theme>
                  </XStack>
                </YStack>
              </XStack>
            </YStack>
          </Tabs>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$-4"
                right="$-4"
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

const ThemedTakeoutLogo = () => {
  const { tints } = useTint()
  return (
    <>
      <Theme name={tints[0] as ThemeName}>T</Theme>
      <Theme name={tints[1] as ThemeName}>a</Theme>
      <Theme name={tints[2] as ThemeName}>k</Theme>
      <Theme name={tints[3] as ThemeName}>e</Theme>
      <Theme name={tints[4] as ThemeName}>o</Theme>
      <Theme name={tints[5] as ThemeName}>u</Theme>
      <Theme name={tints[6] as ThemeName}>t</Theme>
    </>
  )
}
