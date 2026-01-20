import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { lazy, startTransition, Suspense, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  Button,
  Dialog,
  H3,
  Input,
  Label,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  Spacer,
  styled,
  Tabs,
  Text,
  Theme,
  Unspaced,
  useMedia,
  XStack,
  YStack,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { useParityDiscount } from '~/hooks/useParityDiscount'
import { ProductName } from '~/shared/types/subscription'
import { Link } from '../../../components/Link'
import { Select } from '../../../components/Select'
import { sendEvent } from '../../analytics/sendEvent'
import { PromoCards } from '../header/PromoCards'
import { ProAgreementModal } from './AgreementModal'
import { BigP, P } from './BigP'
import { ProPoliciesModal } from './PoliciesModal'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { paymentModal } from './paymentModalStore'
import { purchaseModal, usePurchaseModal } from './purchaseModalStore'

const StripePaymentModal = lazy(() =>
  import('./StripePaymentModal').then((mod) => ({ default: mod.StripePaymentModal }))
)
import { PurchaseButton } from './helpers'
import { useTakeoutStore } from './useTakeoutStore'

// re-export for backwards compat
export { purchaseModal, usePurchaseModal } from './purchaseModalStore'
export { FaqTabContent } from './FaqTabContent'

// import for internal use
import { FaqTabContent } from './FaqTabContent'

export const NewPurchaseModal = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
    })
  }, [])

  if (!mounted) {
    return null
  }

  return <PurchaseModalContents />
}

const tabOrder = ['purchase', 'support', 'faq'] as const

type Tab = (typeof tabOrder)[number]

export function PurchaseModalContents() {
  const store = usePurchaseModal()
  const takeoutStore = useTakeoutStore()
  const [lastTab, setLastTab] = useState<Tab>('purchase')
  const [currentTab, setCurrentTab] = useState<Tab>('purchase')
  const [chatSupport, setChatSupport] = useState(false)
  const [supportTier, setSupportTier] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | StripeError | null>(null)
  const { gtMd } = useMedia()

  const { data: userData, subscriptionStatus } = useUser()
  const { parityDeals } = useParityDiscount()
  const [teamSeats, setTeamSeats] = useState(0)

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
    if (next === 'purchase' || next === 'support' || next === 'faq') {
      if (currentTab === 'purchase' && next === 'support') {
        setLastTab(currentTab)
        setCurrentTab(next)
      } else if (!isProcessing) {
        setLastTab(currentTab)
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

    paymentModal.show = true
    paymentModal.yearlyTotal = yearlyTotal
    paymentModal.monthlyTotal = monthlyTotal
    paymentModal.disableAutoRenew = false
    paymentModal.chatSupport = chatSupport
    paymentModal.supportTier = Number(supportTier)
    paymentModal.teamSeats = teamSeats
    paymentModal.selectedPrices = {
      disableAutoRenew: false,
      chatSupport,
      supportTier: Number(supportTier),
      teamSeats,
    }
  }

  // Calculate direction for animation
  const direction = tabOrder.indexOf(currentTab) > tabOrder.indexOf(lastTab) ? 1 : -1

  // V2 Pricing: $999 one-time per project
  const V2_PRICE = 999

  // Legacy V1 prices (for existing subscribers adding support)
  const chatSupportMonthly = chatSupport ? 200 : 0
  const supportTierMonthly = Number(supportTier) * 800

  // For V2, yearly total is just the base price (no more per-seat)
  const yearlyTotal = V2_PRICE
  const monthlyTotal = supportTierMonthly // Chat support included in V2, only premium support extra

  // V2 subscription message
  const subscriptionMessage = useMemo(() => {
    const hasSupportTier = Number(supportTier) > 0
    if (hasSupportTier) {
      return `$${V2_PRICE.toLocaleString()} one-time + $${supportTierMonthly}/month premium support`
    }
    return `$${V2_PRICE.toLocaleString()} one-time. Includes 1 year of updates, then $300/year.`
  }, [supportTier, supportTierMonthly])

  const tabContents = {
    purchase: () => {
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
          </YStack>
        </YStack>
      )
    },

    support: () => (
      <SupportTabContent
        chatSupport={chatSupport}
        setChatSupport={setChatSupport}
        supportTier={supportTier}
        setSupportTier={setSupportTier}
      />
    ),

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
          <Sheet modal transition="medium">
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
            transition="medium"
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
                defaultValue="purchase"
                size="$6"
                value={currentTab}
                onValueChange={changeTab}
              >
                <Tabs.List disablePassBorderRadius>
                  <YStack width={'33.3333%'} flex={1}>
                    <Tab isActive={currentTab === 'purchase'} value="purchase">
                      Pro
                    </Tab>
                  </YStack>
                  <YStack width={'33.3333%'} flex={1}>
                    <Tab isActive={currentTab === 'support'} value="support">
                      Support
                    </Tab>
                  </YStack>
                  <YStack width={'33.3333%'} flex={1}>
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
                    <XStack>
                      <H3 size="$11">${Intl.NumberFormat('en-US').format(V2_PRICE)}</H3>
                    </XStack>

                    <Paragraph color="$color9" ellipsis size="$4" mb="$3">
                      {subscriptionMessage}
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

      <Suspense fallback={null}>
        <StripePaymentModal
          yearlyTotal={subscriptionStatus?.pro || hasSubscribedBefore ? 0 : yearlyTotal} // if they have a pro subscription or have subscribed before, the yearly total is 0
          monthlyTotal={monthlyTotal}
          disableAutoRenew={false}
          chatSupport={chatSupport}
          supportTier={Number(supportTier)}
          teamSeats={teamSeats}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Suspense>
    </>
  )
}

// FaqTabContent moved to FaqTabContent.tsx

const SupportTabContent = ({
  chatSupport,
  setChatSupport,
  supportTier,
  setSupportTier,
}: {
  chatSupport: boolean
  setChatSupport: (value: boolean) => void
  supportTier: string
  setSupportTier: (value: string) => void
}) => {
  const tiers = [
    { value: '0', label: 'None', price: 0 },
    { value: '1', label: 'Tier 1', price: 800 },
    { value: '2', label: 'Tier 2', price: 1600 },
    { value: '3', label: 'Tier 3', price: 2400 },
  ]

  // Handle support tier change
  const handleSupportTierChange = (value: string) => {
    setSupportTier(value)
  }

  return (
    <>
      <BigP>
        Premium support helps teams using Tamagui ensure bugs get fixed quickly and
        questions are answered promptly.
      </BigP>

      <YStack gap="$6">
        <YStack gap="$3" p="$4" rounded="$4">
          <XStack items="center">
            <Text fontSize="$5" color="$green10" width={0}>
              ✓
            </Text>
            <P fontWeight="600">Basic Chat Support - Included</P>
          </XStack>
          <P maxW={500} size="$4" lineHeight="$6" color="$color9">
            Access to the private #takeout Discord channel. We prioritize responses there
            over public Discord. No SLA, but we typically respond within 1-2 business
            days.
          </P>
        </YStack>

        <YStack gap="$3">
          <XStack overflow="hidden" items="center">
            <Label flex={1} htmlFor="support-tier" rounded="$4">
              <P>Premium Support </P>
            </Label>

            <XStack flex={1} maxW={200}>
              <Select
                id="support-tier"
                size="$4"
                rounded="$4"
                value={supportTier}
                onValueChange={handleSupportTierChange}
                disabled={chatSupport} // Disable if chat support is enabled
              >
                {tiers.map((tier) => (
                  <Select.Item
                    key={tier.value}
                    value={tier.value}
                    index={Number(tier.value)}
                  >
                    {tier.value === '0'
                      ? tier.label
                      : `${tier.label} · $${tier.price}/mo`}
                  </Select.Item>
                ))}
              </Select>
            </XStack>
          </XStack>

          <P size="$5" lineHeight="$6" maxW={500} opacity={supportTier !== '0' ? 1 : 0.5}>
            Each tier adds 4 hours of development a month, faster response times, and 4
            additional private chat invites.
          </P>
        </YStack>
      </YStack>
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
      bg="$color1"
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
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}

const TeamSeatsInput = ({
  value,
  onChange,
  yearlyPrice,
}: {
  value: number
  onChange: (seats: number) => void
  yearlyPrice: number
}) => {
  return (
    <YStack gap="$3">
      <XStack items="center">
        <Label flex={1} htmlFor="team-seats">
          <Text>Additional Team Seats</Text>
        </Label>
        <Input
          id="team-seats"
          value={value.toString()}
          onChange={(e) => {
            const val = e.target?.value
            onChange(Math.max(0, Number.parseInt(val) || 0))
          }}
          type="number-pad"
          width={100}
        />
      </XStack>
      {value > 0 && (
        <Text color="$color9">
          +${yearlyPrice}/year for {value} additional {value === 1 ? 'seat' : 'seats'}
        </Text>
      )}
    </YStack>
  )
}
