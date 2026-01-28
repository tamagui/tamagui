import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  Button,
  Dialog,
  H3,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  styled,
  Tabs,
  Text,
  Theme,
  ToggleGroup,
  Unspaced,
  useMedia,
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
import { paymentModal } from './paymentModalStore'
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
import { calculatePromoPrice } from './promoConfig'
import { SUPPORT_TIERS, type SupportTier } from './paymentModalStore'

export const NewPurchaseModal = () => {
  return <PurchaseModalContents />
}

const tabOrder = ['pro', 'faq'] as const

type Tab = (typeof tabOrder)[number]

export function PurchaseModalContents() {
  const store = usePurchaseModal()
  const takeoutStore = useTakeoutStore()
  const [currentTab, setCurrentTab] = useState<Tab>('pro')
  const [supportTier, setSupportTier] = useState<SupportTier>('chat')
  const [isProcessing, setIsProcessing] = useState(false)
  const [, setError] = useState<Error | StripeError | null>(null)
  const { gtMd } = useMedia()

  const { data: userData, subscriptionStatus } = useUser()
  const { parityDeals } = useParityDiscount()

  const hasSubscribedBefore = useMemo(() => {
    return (
      userData?.subscriptions?.some((sub) =>
        sub.subscription_items.some(
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
    // pass promo info from purchase modal
    paymentModal.activePromo = store.activePromo
    paymentModal.prefilledCouponCode = store.prefilledCouponCode
  }

  // V2 Pricing: $999 one-time per project
  const V2_PRICE = 999

  // Support tier monthly price
  const supportTierMonthly = SUPPORT_TIERS[supportTier].price

  // V2 subscription message
  const subscriptionMessage = useMemo(() => {
    if (supportTierMonthly > 0) {
      return `$${V2_PRICE.toLocaleString()} one-time + $${supportTierMonthly.toLocaleString()}/mo support`
    }
    return `$${V2_PRICE.toLocaleString()} one-time. Includes 1 year of updates, then $300/year.`
  }, [supportTierMonthly])

  const tabContents = {
    pro: () => {
      return (
        <YStack>
          <YStack $gtMd={{ gap: '$6' }} gap="$5">
            <BigP text="center">
              The best you can get for building a cross-platform React + React Native app.
            </BigP>

            <XStack mx="$-4" flexWrap="wrap" gap="$3" items="center" justify="center">
              <PromoCards />
            </XStack>

            <YStack gap="$3" p="$3" rounded="$4">
              <H3 fontFamily="$mono" size="$6">
                What's Included
              </H3>
              <YStack gap="$0.5">
                <P color="$color11" size="$4">
                  - 3 templates: Takeout v1, Takeout v2, Takeout Static
                </P>
                <P color="$color11" size="$4">
                  - Bento pro components
                </P>
                <P color="$color11" size="$4">
                  - 1 year of updates
                </P>
                <P color="$color11" size="$4">
                  - Unlimited team members (no extra cost)
                </P>
                <P color="$color11" size="$4">
                  - Private #takeout chat room in Discord
                </P>
                <P color="$color11" size="$4">
                  - Lifetime rights to all code
                </P>
              </YStack>
            </YStack>

            <YStack gap="$2">
              <P color="$color11" size="$4">
                License covers one project: your web domain + iOS app + Android app. After
                the first year, continue receiving updates for $300/year
                (auto-subscribed).
              </P>
            </YStack>

            <Separator />

            {/* Support Tier Selection */}
            <YStack gap="$3">
              <H3 fontFamily="$mono" size="$6">
                Support Level
              </H3>

              <ToggleGroup
                type="single"
                value={supportTier}
                onValueChange={(val) => val && setSupportTier(val as SupportTier)}
                orientation="horizontal"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$color4"
                overflow="hidden"
              >
                {(Object.keys(SUPPORT_TIERS) as SupportTier[]).map((tier) => (
                  <ToggleGroup.Item
                    key={tier}
                    value={tier}
                    flex={1}
                    bg={supportTier === tier ? '$color4' : '$color1'}
                    hoverStyle={{ bg: supportTier === tier ? '$color4' : '$color2' }}
                    pressStyle={{ bg: '$color3' }}
                    borderWidth={0}
                    borderRadius={0}
                  >
                    <YStack items="center" gap="$1" py="$2.5" px="$2">
                      <Paragraph fontWeight="600" size="$4">
                        {SUPPORT_TIERS[tier].label}
                      </Paragraph>
                      <Paragraph size="$2" color="$color9">
                        {SUPPORT_TIERS[tier].priceLabel}
                      </Paragraph>
                    </YStack>
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup>

              <YStack
                bg="$color2"
                p="$3"
                rounded="$3"
                borderWidth={1}
                borderColor="$color4"
              >
                <Paragraph size="$3" color="$color11">
                  {SUPPORT_TIERS[supportTier].description}
                </Paragraph>
              </YStack>
            </YStack>

            {/* Enterprise Notice */}
            <Theme name="yellow">
              <XStack
                bg="$color3"
                rounded="$4"
                borderWidth={0.5}
                borderColor="$color8"
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
            <Sheet.Frame bg="$color1" p={0} gap="$4">
              <Sheet.ScrollView>
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
            p={0}
          >
            <YStack height="100%">
              <Tabs
                orientation="horizontal"
                flexDirection="column"
                defaultValue="pro"
                size="$6"
                value={currentTab}
                onValueChange={changeTab}
              >
                <Tabs.List>
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

                <YStack group="takeoutBody">
                  <AnimatedYStack key={currentTab}>
                    <Tabs.Content
                      value={currentTab}
                      forceMount
                      flex={1}
                      minH={550}
                      $gtMd={{
                        height: 'calc(min(100vh - 200px, 900px))',
                      }}
                    >
                      <YStack
                        $gtMd={{
                          p: '$8',
                          gap: '$6',
                        }}
                        p="$4"
                        gap="$4"
                        height="100%"
                        {...(gtMd && {
                          style: {
                            overflowY: 'scroll',
                          },
                        })}
                      >
                        {tabContents[currentTab]()}
                      </YStack>
                    </Tabs.Content>
                  </AnimatedYStack>
                </YStack>

                <Separator />
              </Tabs>

              {/* Bottom */}
              <YStack p="$4" $gtXs={{ p: '$6' }} gap="$2" bg="$color1">
                <YStack
                  justify="center"
                  items="center"
                  gap="$4"
                  $gtXs={{
                    justify: 'space-between',
                    items: 'flex-start',
                    flexDirection: 'row',
                    gap: '$6',
                  }}
                >
                  <YStack gap="$1" flex={1} width="100%" $gtXs={{ width: '40%' }}>
                    <XStack items="baseline" gap="$2">
                      {store.activePromo && (
                        <H3
                          size="$10"
                          fontWeight="200"
                          opacity={0.5}
                          textDecorationLine="line-through"
                          color="$green10"
                          y={-3}
                          letterSpacing={-2}
                        >
                          ${Intl.NumberFormat('en-US').format(V2_PRICE)}
                        </H3>
                      )}
                      <H3 size="$11" letterSpacing={-2}>
                        $
                        {Intl.NumberFormat('en-US').format(
                          calculatePromoPrice(V2_PRICE, store.activePromo)
                        )}
                      </H3>
                    </XStack>

                    <Paragraph color="$color9" size="$3">
                      {store.activePromo
                        ? `${store.activePromo.label}! ${subscriptionMessage}`
                        : subscriptionMessage}
                    </Paragraph>
                  </YStack>

                  <YStack gap="$2" width="100%" $gtXs={{ width: '42%' }}>
                    {parityDeals && (
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
                            You are from {parityDeals.country}.{`\n`} Use code{' '}
                            <Text fontWeight="bold" fontFamily="$mono" color="$color12">
                              {parityDeals.couponCode}
                            </Text>{' '}
                            at checkout for {parityDeals.discountPercentage}% off
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

      {/* Lazy load Stripe when purchase modal opens - ready by checkout time */}
      {store.show && (
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
      value=""
      borderBottomWidth={1}
      borderBottomColor="transparent"
      {...(!isActive && {
        bg: '$color2',
      })}
      {...props}
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
        cursor="default"
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
