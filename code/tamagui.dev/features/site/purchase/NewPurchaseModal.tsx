import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { startTransition, useEffect, useMemo, useState } from 'react'
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
import { Switch } from '../../../components/Switch'
import { sendEvent } from '../../analytics/sendEvent'
import { PromoCards } from '../header/PromoCards'
import { ProAgreementModal } from './AgreementModal'
import { BigP, P } from './BigP'
import { ProPoliciesModal } from './PoliciesModal'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { paymentModal, StripePaymentModal } from './StripePaymentModal'
import { PurchaseButton } from './helpers'
import { useTakeoutStore } from './useTakeoutStore'

class PurchaseModal {
  show = false
  yearlyTotal = 0
  monthlyTotal = 0
  disableAutoRenew = false
  chatSupport = false
  supportTier = 0
  teamSeats = 0
  selectedPrices = {
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 0,
    teamSeats: 0,
  }
}
export const purchaseModal = createStore(PurchaseModal)
export const usePurchaseModal = createUseStore(PurchaseModal)

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

  // Calculate prices
  const basePrice = 240 // yearly subscription price
  const chatSupportMonthly = chatSupport ? 200 : 0 // $200/month for chat support
  const supportTierMonthly = Number(supportTier) * 800 // $800/month per tier
  const teamSeatsPrice = teamSeats * 100 // $100 per seat

  // Keep yearly and monthly totals separate
  const yearlyTotal = basePrice + teamSeatsPrice
  const monthlyTotal = chatSupportMonthly + supportTierMonthly

  // Determine subscription message based on selected options
  const subscriptionMessage = useMemo(() => {
    const hasChat = chatSupport
    const hasSupportTier = Number(supportTier) > 0

    if (hasChat && hasSupportTier) {
      return 'Yearly base + monthly chat and support tier, easy 1-click cancel.'
    }
    if (hasChat) {
      return 'Yearly base + monthly chat support, easy 1-click cancel.'
    }
    if (hasSupportTier) {
      return 'Yearly base + monthly support tier, easy 1-click cancel.'
    }
    return 'Pay one year up-front, easy one-click cancel.'
  }, [chatSupport, supportTier])

  const tabContents = {
    purchase: () => {
      return (
        <YStack>
          <YStack $gtMd={{ gap: '$6' }} gap="$5">
            <BigP text="center">
              We've put together tools that make starting and building a universal app as
              good as it gets.
            </BigP>

            <XStack mx="$-4" flexWrap="wrap" gap="$3" items="center" justify="center">
              <PromoCards />
            </XStack>

            <YStack gap="$3">
              <P color="$color10" size="$4">
                For a one year term you get access to the private Takeout Github repo,
                Bento components, and the private community chat room. You get lifetime
                rights to all code and assets, even after subscription expires.
              </P>
            </YStack>
          </YStack>

          <Separator my="$10" />

          <H3 fontFamily="$mono">Team</H3>

          <TeamSeatsInput
            value={teamSeats}
            onChange={setTeamSeats}
            yearlyPrice={teamSeatsPrice}
          />
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
          <Sheet modal animation="medium">
            <Sheet.Frame bg="$color1" p={0} gap="$4">
              <Sheet.ScrollView>
                <Dialog.Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadow4"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Dialog.Adapt>

        <Dialog.Portal zIndex={1_000_000}>
          <Dialog.Overlay
            backdropFilter="blur(35px)"
            key="overlay"
            animation="medium"
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
            animation={[
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
                      minH={400}
                      $gtMd={{
                        height: 'calc(min(100vh - 280px, 620px))',
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
                      <H3 size="$11">
                        $
                        {Intl.NumberFormat('en-US').format(
                          monthlyTotal + Math.ceil(yearlyTotal / 12)
                        )}
                        <Paragraph self="flex-end" y={-5} opacity={0.5} x={4}>
                          /month
                        </Paragraph>
                      </H3>
                    </XStack>

                    <Paragraph theme="alt2" ellipsis size="$4" mb="$3">
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
                          theme="alt1"
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
                          theme="alt1"
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
                      <Theme name="alt1">
                        <PoweredByStripeIcon width={96} height={40} />
                      </Theme>
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
    </>
  )
}

const Question = styled(P, {
  fontWeight: 'bold',
  color: '$green9',
})

export const FaqTabContent = () => {
  return (
    <YStack gap="$6">
      <Question>Do I own the code? Can I publish it publicly?</Question>
      <P>
        For Bento - yes. For Takeout - no. Takeout is closed source, but the Bento license
        is liberal, you have all rights to the code. The only limit we have is that you
        don't directly list or sell the majority of Bento code in one place, but you can
        absolutely use it in public projects.
      </P>

      <Question>What is Theme AI?</Question>
      <P>
        If you go to the Theme page from the header, we have an input box to prompt. We've
        spent a lot of effort putting together a prompt and examples for LLMs to generate
        great looking themes based on your input. It's quite fun and generates some great
        themes.
      </P>

      {/* <Question>What is Chat?</Question>

      <P>
        We've spent a few months building a custom chatbot that's an expert at all things
        Tamagui. It's not just a simple prompt over a GPT model, it has multiple tools,
        often using a multi-stage LLM pipeline to find the best answers.
      </P>

      <P>
        We've given the chatbot a huge amount of context on Tamagui, Bento, Takeout, React
        Native, and the ecosystem of common libraries. It has access to our entire
        Discord, docs, and many examples of configurations and demos, vector search, and
        code generation tools.
      </P> */}

      <P>
        All that said, it's currently in beta and may experience outages or poor
        performance. We appreciate your feedback.
      </P>

      <Question>What support do I get in the base plan?</Question>
      <P>
        For subscribers, you get access to the private #takeout channel. We prioritize
        responses there over the public Discord, but we don't provide any SLA.
      </P>

      <Question>What support do I get with the Chat add-on?</Question>
      <P>
        You get a private Discord channel just for your team and a highlighted role in
        Discord chat. You can add up to 2 members to the private channel. We answer
        questions within 2 business days, and will prioritize bugs above our base
        subscribers. The Chat add-on costs $200/month.
      </P>

      <Question>What support do I get with Support tiers?</Question>
      <P>
        Each tier adds 4 hours of development per month, faster response times, and 4
        additional private chat invites.
      </P>

      <Question>How do I use a coupon?</Question>
      <P>
        When you checkout, you'll see an input box to enter a coupon. If you have a
        coupon, enter it and click apply. If it's valid, the price will update.
      </P>

      <Question>How do I get my invoice?</Question>
      <P>
        You can access all your invoices through our billing partner Zenvoice.{' '}
        <Link href="https://zenvoice.io/p/66c8a1357aed16c9b4a6dafb" target="_blank">
          Click here to view your invoices
        </Link>
        .
      </P>

      <Spacer height="$10" />
    </YStack>
  )
}

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

  // Handle chat support toggle - disable support tier when enabled
  const handleChatSupportChange = (checked: boolean) => {
    setChatSupport(checked)
    if (checked) {
      setSupportTier('0') // Reset support tier to none
    }
  }

  // Handle support tier change - disable chat support when tier is selected
  const handleSupportTierChange = (value: string) => {
    setSupportTier(value)
    if (value !== '0') {
      setChatSupport(false) // Disable chat support
    }
  }

  return (
    <>
      <BigP>
        Support is great way for teams using Tamagui to ensure bugs get fixed, questions
        are answered, and Tamagui stays healthy and up to date.
      </BigP>

      <YStack gap="$6">
        <YStack gap="$3">
          <XStack items="center">
            <Label flex={1} htmlFor="chat-support">
              <P>Chat Support ($200/month)</P>
            </Label>

            <XStack maxW={100}>
              <Switch
                checked={chatSupport}
                onCheckedChange={handleChatSupportChange}
                id="chat-support"
                disabled={supportTier !== '0'} // Disable if support tier is selected
              />
            </XStack>
          </XStack>

          <P maxW={500} size="$5" lineHeight="$6" opacity={chatSupport ? 1 : 0.5}>
            A private Discord room just for your team with 2 invites, with responses
            prioritized over our community chat.
          </P>
        </YStack>

        <YStack gap="$3">
          <XStack overflow="hidden" items="center">
            <Label flex={1} htmlFor="support-tier" rounded="$4">
              <P>Extra Support Level </P>
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

  animation: '100ms',
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
      disableActiveTheme
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
            const val = e.target.value
            onChange(Math.max(0, Number.parseInt(val) || 0))
          }}
          type="number-pad"
          width={100}
        />
      </XStack>
      {value > 0 && (
        <Text theme="alt2">
          +${yearlyPrice}/year for {value} additional {value === 1 ? 'seat' : 'seats'}
        </Text>
      )}
    </YStack>
  )
}
