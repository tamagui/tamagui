import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  Button,
  Dialog,
  H3,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Span,
  styled,
  Tabs,
  Text,
  Theme,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { useParityDiscount } from '~/hooks/useParityDiscount'
import { ProductName } from '~/shared/types/subscription'
import { Link } from '../../../components/Link'
import { sendEvent } from '../../analytics/sendEvent'
import { PromoCards } from '../header/PromoCards'
import { ProAgreementModal } from './AgreementModal'
import { BigP, P } from './BigP'
import { ProPoliciesModal } from './PoliciesModal'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { PurchaseButton } from './helpers'
import { paymentModal, usePaymentModal } from './paymentModalStore'
import { usePurchaseModal } from './purchaseModalStore'
import { useTakeoutStore } from './useTakeoutStore'

const StripePaymentModal = lazy(() =>
  import('./StripePaymentModal').then((mod) => ({ default: mod.StripePaymentModal }))
)

// re-export for backwards compat
export { FaqTabContent } from './FaqTabContent'
export { purchaseModal, usePurchaseModal } from './purchaseModalStore'

// import for internal use
import { FaqTabContent } from './FaqTabContent'
import { SUPPORT_TIERS, type SupportTier } from './paymentModalStore'
import { calculatePromoPrice } from './promoConfig'

export const NewPurchaseModal = () => {
  return <PurchaseModalContents />
}

const tabOrder = ['pro', 'faq'] as const

type Tab = (typeof tabOrder)[number]

export function PurchaseModalContents() {
  const store = usePurchaseModal()
  const paymentStore = usePaymentModal()
  const takeoutStore = useTakeoutStore()
  const [currentTab, setCurrentTab] = useState<Tab>('pro')
  const [supportTier, setSupportTier] = useState<SupportTier>('chat')
  const [isProcessing, setIsProcessing] = useState(false)
  const [, setError] = useState<Error | StripeError | null>(null)

  const { data: userData, subscriptionStatus } = useUser()
  const { parityDeals } = useParityDiscount()

  const hasSubscribedBefore = useMemo(() => {
    return (
      userData?.subscriptions?.some((sub) =>
        sub.subscription_items?.some(
          (item) =>
            (item.price?.product?.name === ProductName.TamaguiBento ||
              item.price?.product?.name === ProductName.TamaguiTakeoutStack) &&
            sub.ended_at &&
            new Date(sub.ended_at) < new Date()
        )
      ) ?? false
    )
  }, [userData])

  useEffect(() => {
    if (parityDeals) {
      sendEvent(`Pro: Show Parity Deals`)
    }
  }, [parityDeals])

  useEffect(() => {
    if (window.opener && userData) {
      window.opener.postMessage({ type: 'login-success' }, window.location.origin)
      window.close()
    }
  }, [])

  function changeTab(next: string) {
    sendEvent(`Pro: Change Tab`, { tab: next })
    if (next === 'pro' || next === 'faq') {
      if (!isProcessing) {
        setCurrentTab(next)
      }
    }
  }

  const handlePaymentError = (error: Error | StripeError) => {
    sendEvent('Pro: Payment Error', {
      error: `${error}`,
    })
    setError(error)
    setIsProcessing(false)
  }

  const handlePaymentSuccess = async () => {
    sendEvent('Pro: Payment Success')
    // Allow analytics beacon time to flush before navigation.
    await new Promise((resolve) => setTimeout(resolve, 1000))
    window.location.href = '/payment-finished'
  }

  const handleCheckout = () => {
    sendEvent('Pro: Purchase Button')

    if (isProcessing) return

    const supportTierPrice = SUPPORT_TIERS[supportTier].price

    paymentModal.show = true
    paymentModal.yearlyTotal = V2_PRICE
    paymentModal.monthlyTotal = supportTierPrice
    paymentModal.disableAutoRenew = false
    paymentModal.chatSupport = false
    paymentModal.supportTier = supportTier
    paymentModal.teamSeats = 0
    paymentModal.selectedPrices = {
      disableAutoRenew: false,
      chatSupport: false,
      supportTier: supportTier,
      teamSeats: 0,
    }
    // V2 purchase - not a support upgrade only
    paymentModal.isV2 = true
    paymentModal.isSupportUpgradeOnly = false
    // pass promo info from purchase modal
    paymentModal.activePromo = store.activePromo
    paymentModal.prefilledCouponCode = store.prefilledCouponCode
    // pass parity discount (fetched via API, validated server-side)
    if (parityDeals) {
      paymentModal.parityDiscount = Number(parityDeals.discountPercentage)
      paymentModal.parityCountry = parityDeals.country
    }
  }

  // V2 Pricing: $350 one-time per project
  const V2_PRICE = 350

  // Support tier monthly price
  const supportTierMonthly = SUPPORT_TIERS[supportTier].price

  const tabContents = {
    pro: () => {
      return (
        <YStack>
          <YStack $gtMd={{ gap: '$6' }} gap="$5">
            <BigP mt={-10} text="center">
              We've put together tools that make starting and building a universal app as
              good as it gets.
            </BigP>

            <XStack
              px="$4"
              mx="$-4"
              gap="$3"
              items="center"
              justify="center"
              flexWrap="wrap"
              $gtMd={{ px: 0 }}
            >
              <PromoCards />
            </XStack>

            <Theme name="green">
              <P size="$3" color="$color11" text="center" px="$8">
                <Span fontFamily="$mono" color="$color8">
                  1&nbsp;year&nbsp;of&nbsp;updates
                </Span>
                {' · '}
                <Span fontFamily="$mono">Unlimited&nbsp;team&nbsp;members</Span>
                <br />
                <Span fontFamily="$mono" color="$color8">
                  Private&nbsp;#takeout&nbsp;Discord
                </Span>
                {' · '}
                <Span fontFamily="$mono">Lifetime&nbsp;code&nbsp;rights</Span>
              </P>
            </Theme>

            <Separator />

            {/* Support Tier Selection */}
            <YStack
              gap="$4"
              $gtMd={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <YStack gap="$1" flexShrink={1} $gtMd={{ flex: 1 }}>
                <Paragraph fontFamily="$mono" fontWeight="600" size="$5">
                  Support Level
                </Paragraph>
                <Paragraph size="$4" color="$color8">
                  {SUPPORT_TIERS[supportTier].description}
                </Paragraph>
              </YStack>

              <XStack
                borderRadius="$4"
                borderWidth={1}
                borderColor="$color4"
                overflow="hidden"
                flexShrink={0}
                alignSelf="flex-start"
                $gtMd={{ alignSelf: 'auto' }}
              >
                {(Object.keys(SUPPORT_TIERS) as SupportTier[]).map((tier) => (
                  <YStack
                    key={tier}
                    items="center"
                    py="$2"
                    px="$4"
                    bg={supportTier === tier ? '$color3' : '$color1'}
                    hoverStyle={{ bg: supportTier === tier ? '$color4' : '$color2' }}
                    pressStyle={{ bg: '$color3' }}
                    cursor="pointer"
                    onPress={() => setSupportTier(tier)}
                  >
                    <Paragraph fontWeight="600" size="$3" mb={-3}>
                      {SUPPORT_TIERS[tier].label}
                    </Paragraph>
                    <Paragraph size="$2" color="$color9">
                      {SUPPORT_TIERS[tier].priceLabel}
                    </Paragraph>
                  </YStack>
                ))}
              </XStack>
            </YStack>

            <Separator />

            <Paragraph size="$5" color="$color9">
              License covers one project: your web domain + iOS app + Android app. After
              the first year, continue receiving updates for $100/year (auto-subscribed).
            </Paragraph>

            {/* Enterprise Notice */}
            <Theme name="yellow">
              <XStack
                bg="$color2"
                rounded="$4"
                borderWidth={0.5}
                borderColor="$color5"
                p="$3"
              >
                <Paragraph size="$3" color="$color11">
                  For companies with over $1M in annual revenue,{' '}
                  <Link href="mailto:support@tamagui.dev">contact us</Link> for enterprise
                  pricing.
                </Paragraph>
              </XStack>
            </Theme>
          </YStack>
        </YStack>
      )
    },

    faq: FaqTabContent,
  }

  return (
    <>
      <Dialog
        modal
        open={store.show}
        onOpenChange={(val) => {
          store.show = val
          if (!val) {
            setIsProcessing(false)
            setError(null)
          }
        }}
      >
        <Dialog.Adapt when="maxMd">
          <Sheet modal transition="quick">
            <Sheet.Frame bg="$color1" p={0} flex={1}>
              <Sheet.ScrollView flex={1}>
                <Dialog.Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadow4"
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Dialog.Adapt>

        <Dialog.Portal zIndex={1_000_000}>
          <Dialog.Overlay
            backdropFilter="blur(35px)"
            key="overlay"
            transition="quick"
            bg="$shadow2"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            overflow="hidden"
            elevate
            key="content"
            bg="$color1"
            transition={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
            exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
            width="90%"
            maxW={900}
            height="85%"
            maxH="calc(min(85vh, 800px))"
            minH={500}
            p={0}
          >
            <YStack flex={1} flexBasis="auto" overflow="hidden">
              <Tabs
                orientation="horizontal"
                flexDirection="column"
                flex={1}
                flexBasis="auto"
                overflow="hidden"
                defaultValue="pro"
                size="$6"
                value={currentTab}
                onValueChange={changeTab}
              >
                <Tabs.List flexShrink={0}>
                  <YStack width={'50%'} flex={1}>
                    <Tab isActive={currentTab === 'pro'} value="pro">
                      Pro
                    </Tab>
                  </YStack>
                  <YStack width={'50%'} flex={1}>
                    <Tab isActive={currentTab === 'faq'} value="faq" end>
                      FAQ
                    </Tab>
                  </YStack>
                </Tabs.List>

                <YStack group="takeoutBody" flex={1} flexBasis="auto" overflow="hidden">
                  <AnimatedYStack key={currentTab} overflow="hidden">
                    <Tabs.Content
                      value={currentTab}
                      forceMount
                      flex={1}
                      flexBasis="auto"
                      overflow="hidden"
                    >
                      <ScrollView flex={1} flexBasis="auto">
                        <YStack p="$4" gap="$4" $gtMd={{ p: '$8', gap: '$6' }}>
                          {tabContents[currentTab]()}
                        </YStack>
                      </ScrollView>
                    </Tabs.Content>
                  </AnimatedYStack>
                </YStack>
              </Tabs>

              {/* Bottom */}
              <YStack
                flexShrink={0}
                p="$4"
                gap="$2"
                borderTopWidth={0.5}
                borderTopColor={'$color5'}
              >
                <YStack
                  justify="center"
                  items="center"
                  gap="$4"
                  $gtSm={{
                    flexDirection: 'row',
                  }}
                >
                  <YStack
                    gap="$2"
                    width="100%"
                    $gtXs={{ flex: 1, flexBasis: 'auto', width: '40%' }}
                  >
                    {/* price breakdown */}
                    <YStack>
                      {/* original price - only show if there's any discount */}
                      {(store.activePromo || parityDeals) && (
                        <XStack items="center" gap="$2" mb={-5}>
                          <Paragraph
                            size="$3"
                            color="$color8"
                            textDecorationLine="line-through"
                          >
                            ${Intl.NumberFormat('en-US').format(V2_PRICE)}
                          </Paragraph>
                          <Paragraph size="$2" color="$color8">
                            original
                          </Paragraph>
                        </XStack>
                      )}

                      {/* after beta discount */}
                      {store.activePromo && parityDeals && (
                        <XStack items="center" gap="$2" mb={-5}>
                          <Paragraph
                            size="$3"
                            color={parityDeals ? '$color8' : '$color11'}
                            textDecorationLine={parityDeals ? 'line-through' : 'none'}
                          >
                            $
                            {Intl.NumberFormat('en-US').format(
                              calculatePromoPrice(V2_PRICE, store.activePromo)
                            )}
                          </Paragraph>
                          <Paragraph size="$2" color="$color9">
                            {store.activePromo.description}
                          </Paragraph>
                        </XStack>
                      )}

                      {/* after parity discount (final price) */}
                      {parityDeals && (
                        <XStack items="center" gap="$2">
                          <Paragraph size="$3" color="$green10">
                            $
                            {Intl.NumberFormat('en-US').format(
                              Math.round(
                                calculatePromoPrice(V2_PRICE, store.activePromo) *
                                  (1 - Number(parityDeals.discountPercentage) / 100)
                              )
                            )}
                          </Paragraph>
                          <Paragraph size="$2" color="$green9">
                            {parityDeals.flag} {parityDeals.discountPercentage}% parity
                          </Paragraph>
                        </XStack>
                      )}
                    </YStack>

                    {/* final price display */}
                    <H3 size="$9" $gtXs={{ size: '$11' }} letterSpacing={-2}>
                      $
                      {Intl.NumberFormat('en-US').format(
                        parityDeals
                          ? Math.round(
                              calculatePromoPrice(V2_PRICE, store.activePromo) *
                                (1 - Number(parityDeals.discountPercentage) / 100)
                            )
                          : calculatePromoPrice(V2_PRICE, store.activePromo)
                      )}
                    </H3>

                    <Paragraph color="$color9" size="$3">
                      One payment, one year updates, $100/year subscription
                    </Paragraph>
                  </YStack>

                  <YStack gap="$2" width="100%" pt="$2" $gtXs={{ width: '42%', pt: 0 }}>
                    {parityDeals && (
                      <Theme name="green">
                        <XStack
                          mb="$2"
                          bg="$color3"
                          rounded="$4"
                          borderWidth={0.5}
                          borderColor="$color8"
                          p="$2"
                        >
                          <Paragraph
                            size="$3"
                            color="$color11"
                            style={{ textWrap: 'balance' }}
                          >
                            {parityDeals.flag} {parityDeals.discountPercentage}% parity
                            discount for {parityDeals.country}
                          </Paragraph>
                        </XStack>
                      </Theme>
                    )}
                    {hasSubscribedBefore && (
                      <Theme name="yellow">
                        <XStack
                          mb="$2"
                          bg="$color3"
                          rounded="$4"
                          borderWidth={0.5}
                          borderColor="$color8"
                          p="$2"
                        >
                          <Paragraph
                            size="$3"
                            color="$color11"
                            style={{ textWrap: 'balance' }}
                          >
                            You have subscribed before so you are eligible for a 25%
                            discount.
                            <br />
                            Use code{' '}
                            <Text fontWeight="bold" fontFamily="$mono" color="$color12">
                              {subscriptionStatus.couponCodes.previouslySubscribed}
                            </Text>{' '}
                            at checkout for 25% off
                          </Paragraph>
                        </XStack>
                      </Theme>
                    )}

                    <Theme name="accent">
                      <PurchaseButton onPress={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Checkout'}
                      </PurchaseButton>
                    </Theme>
                    <XStack justify="space-between" gap="$4" items="center" mb="$2">
                      <XStack items="center" gap="$2">
                        <SizableText
                          color="$color10"
                          cursor="pointer"
                          onPress={() => {
                            takeoutStore.showProAgreement = true
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
                          color="$color10"
                          cursor="pointer"
                          onPress={() => {
                            takeoutStore.showProPolicies = true
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
                      <PoweredByStripeIcon width={96} height={40} />
                    </XStack>
                  </YStack>
                </YStack>
              </YStack>
            </YStack>
            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" t="$2" r="$2" size="$2" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <ProPoliciesModal />

      <ProAgreementModal />

      {/* Lazy load Stripe when purchase modal opens OR payment modal is requested from elsewhere */}
      {(store.show || paymentStore.show) && (
        <Suspense fallback={null}>
          <StripePaymentModal
            yearlyTotal={subscriptionStatus?.pro || hasSubscribedBefore ? 0 : V2_PRICE}
            monthlyTotal={supportTierMonthly}
            disableAutoRenew={false}
            chatSupport={false}
            supportTier={supportTier}
            teamSeats={0}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Suspense>
      )}
    </>
  )
}

const AnimatedYStack = styled(YStack, {
  flex: 1,
  flexBasis: 'auto',
  x: 0,
  opacity: 1,

  transition: '100ms',
  variants: {
    direction: {
      ':number': (direction) => ({
        enterStyle: {
          x: direction > 0 ? -10 : 10,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? -10 : 10,
          opacity: 0,
        },
      }),
    },
  } as const,
})

function Tab({
  children,
  isActive,
  end,
  ...props
}: Omit<TabsProps, 'end'> & { isActive: boolean; end?: boolean }) {
  return (
    <Tabs.Tab
      group="takeoutBody"
      unstyled
      items="center"
      justify="center"
      overflow="hidden"
      py="$1"
      height={60}
      cursor="pointer"
      borderBottomWidth={1}
      borderBottomColor="transparent"
      {...(!isActive && {
        bg: '$color2',
      })}
      {...props}
      value={props.value as string}
    >
      <YStack
        fullscreen
        pointerEvents="none"
        z={-1}
        {...(isActive && {
          bg: '$color1',
        })}
        {...(!isActive && {
          bg: '$color1',
          opacity: 0.25,
          '$group-takeoutBody-hover': {
            opacity: 0.33,
          },
        })}
      />
      <Paragraph
        fontFamily="$mono"
        size="$6"
        $gtMd={{ size: '$7' }}
        color={isActive ? '$color12' : '$color10'}
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
