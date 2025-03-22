import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { startTransition, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  Button,
  Dialog,
  H3,
  Label,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  Spacer,
  styled,
  Tabs,
  Theme,
  Unspaced,
  XStack,
  YStack,
  Text,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { Select } from '../../../components/Select'
import { Switch } from '../../../components/Switch'
import { PromoCards } from '../header/PromoCards'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { paymentModal, StripePaymentModal } from './StripePaymentModal'
import { PurchaseButton } from './helpers'
import { useProducts } from './useProducts'
import { BigP, P } from './BigP'
import { useTakeoutStore } from './useTakeoutStore'
import { ProPoliciesModal } from './PoliciesModal'
import { ProAgreementModal } from './AgreementModal'
import { useParityDiscount } from '~/hooks/useParityDiscount'

class PurchaseModal {
  show = false
  yearlyTotal = 0
  monthlyTotal = 0
  disableAutoRenew = false
  chatSupport = false
  supportTier = 0
  selectedPrices = {
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 0,
  }
}

type SelectedPrices = {
  disableAutoRenew: boolean
  chatSupport: boolean
  supportTier: number
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

const PurchaseModalContents = () => {
  const store = usePurchaseModal()
  const takeoutStore = useTakeoutStore()
  const [lastTab, setLastTab] = useState<Tab>('purchase')
  const [currentTab, setCurrentTab] = useState<Tab>('purchase')
  const [disableAutoRenew, setDisableAutoRenew] = useState(false)
  const [chatSupport, setChatSupport] = useState(false)
  const [supportTier, setSupportTier] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | StripeError | null>(null)
  const [selectedPrices, setSelectedPrices] = useState<SelectedPrices>({
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 0,
  })
  const { data: products } = useProducts()
  const { data: userData } = useUser()
  const { parityDeals } = useParityDiscount()

  useEffect(() => {
    if (window.opener && userData) {
      window.opener.postMessage({ type: 'login-success' }, window.location.origin)
      window.close()
    }
  }, [])

  function changeTab(next: string) {
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
    setError(error)
    setIsProcessing(false)
  }

  const handlePaymentSuccess = async () => {
    window.location.href = '/payment-finished'
  }

  const handleCheckout = () => {
    if (isProcessing) return

    // Show payment modal with current selections
    paymentModal.show = true
    paymentModal.yearlyTotal = yearlyTotal
    paymentModal.monthlyTotal = monthlyTotal
    paymentModal.disableAutoRenew = disableAutoRenew
    paymentModal.chatSupport = chatSupport
    paymentModal.supportTier = Number(supportTier)
    paymentModal.selectedPrices = {
      disableAutoRenew,
      chatSupport,
      supportTier: Number(supportTier),
    }
  }

  // Calculate direction for animation
  const direction = tabOrder.indexOf(currentTab) > tabOrder.indexOf(lastTab) ? 1 : -1

  // Calculate prices
  const basePrice = disableAutoRenew ? 400 : 240 // yearly base price
  const chatSupportMonthly = chatSupport ? 200 : 0 // $200/month for chat support
  const supportTierMonthly = Number(supportTier) * 800 // $800/month per tier

  // Keep yearly and monthly totals separate
  const yearlyTotal = basePrice
  const monthlyTotal = chatSupportMonthly + supportTierMonthly

  // Determine subscription message based on selected options
  const subscriptionMessage = useMemo(() => {
    const hasChat = chatSupport
    const hasSupportTier = Number(supportTier) > 0

    if (disableAutoRenew) {
      if (hasChat && hasSupportTier) {
        return 'One-time payment for yearly base, monthly billing for chat and support tier.'
      }
      if (hasChat) {
        return 'One-time payment for yearly base, monthly billing for chat support.'
      }
      if (hasSupportTier) {
        return 'One-time payment for yearly base, monthly billing for support tier.'
      }
      return 'One-time payment, no renewal'
    } else {
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
    }
  }, [chatSupport, supportTier, disableAutoRenew])

  const tabContents = {
    purchase: () => {
      return (
        <YStack gap="$4" pb="$4">
          <YStack $gtMd={{ gap: '$7' }} gap="$5">
            <BigP>
              We've put together tools that make starting and building a universal app as
              good as it gets.
            </BigP>

            <XStack mx="$-4" fw="wrap" gap="$3" ai="center" justifyContent="center">
              <PromoCards disableAutoRenew={disableAutoRenew} />
            </XStack>

            <YStack gap="$3">
              <P color="$color10" size="$4" $gtXs={{ size: '$8' }}>
                For a one year term you get access to the private Takeout Github repo,
                Bento components
                {disableAutoRenew ? `` : `, and the private community chat room`}. You get
                lifetime rights to all code and assets, even after subscription expires.
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
        <Dialog.Adapt when="sm">
          <Sheet modal animation="medium">
            <Sheet.Frame bg="$color1" padding={0} gap="$4">
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

        <Dialog.Portal>
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
            ov="hidden"
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
            // animateOnly={['transform']}
            enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
            exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}
            w="90%"
            maw={900}
            p={0}
          >
            <YStack h="100%">
              <Tabs
                orientation="horizontal"
                flexDirection="column"
                defaultValue="purchase"
                size="$6"
                value={currentTab}
                onValueChange={changeTab}
              >
                <Tabs.List disablePassBorderRadius>
                  <YStack width={'33.3333%'} f={1}>
                    <Tab isActive={currentTab === 'purchase'} value="purchase">
                      Pro
                    </Tab>
                  </YStack>
                  <YStack width={'33.3333%'} f={1}>
                    <Tab isActive={currentTab === 'support'} value="support">
                      Support
                    </Tab>
                  </YStack>
                  <YStack width={'33.3333%'} f={1}>
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
                      // flex={1}
                      minHeight={400}
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
                  jc="center"
                  ai="center"
                  gap="$4"
                  $gtXs={{
                    jc: 'space-between',
                    ai: 'flex-start',
                    flexDirection: 'row',
                    gap: '$6',
                  }}
                >
                  <YStack gap="$1" f={1} width="100%" $gtXs={{ width: '40%' }}>
                    <XStack>
                      <H3 size="$11">
                        $
                        {Intl.NumberFormat('en-US').format(
                          disableAutoRenew
                            ? yearlyTotal
                            : monthlyTotal + Math.ceil(yearlyTotal / 12)
                        )}
                        <Paragraph als="flex-end" y={-5} o={0.5} x={4}>
                          {disableAutoRenew ? ` once` : `/month`}
                        </Paragraph>
                        {disableAutoRenew && monthlyTotal > 0 && (
                          <>
                            <Paragraph> + </Paragraph>${monthlyTotal}
                            <Paragraph als="flex-end" y={-5} o={0.5} x={4}>
                              /month
                            </Paragraph>
                          </>
                        )}
                      </H3>
                    </XStack>

                    <Paragraph theme="alt2" ellipse size="$4" mb="$3">
                      {subscriptionMessage}
                    </Paragraph>

                    <XStack alignItems="center" gap="$4">
                      <Switch
                        onCheckedChange={(x) => setDisableAutoRenew(!disableAutoRenew)}
                        checked={!disableAutoRenew}
                        id="auto-renew"
                      />
                      <Label htmlFor="auto-renew">
                        <Paragraph theme="green" color="$color10" ff="$mono" size="$5">
                          {disableAutoRenew ? `One-time` : `Subscription`}
                        </Paragraph>
                      </Label>
                    </XStack>
                  </YStack>

                  <YStack gap="$2" width="100%" $gtXs={{ width: '42%' }}>
                    {parityDeals && (
                      <Theme name="yellow">
                        <XStack
                          mb="$2"
                          backgroundColor="$color3"
                          borderRadius="$4"
                          borderWidth={0.5}
                          borderColor="$color8"
                          p="$2"
                        >
                          <Paragraph size="$3" color="$color11" textWrap="balance">
                            You are from {parityDeals.country}.{`\n`} Use code{' '}
                            <Text fontWeight="bold" fontFamily="$mono" color="$color12">
                              {parityDeals.couponCode}
                            </Text>{' '}
                            at checkout for {parityDeals.discountPercentage}% off
                          </Paragraph>
                        </XStack>
                      </Theme>
                    )}

                    <Theme name="accent">
                      <PurchaseButton onPress={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Checkout'}
                      </PurchaseButton>
                    </Theme>
                    <XStack jc="space-between" gap="$4" ai="center" mb="$2">
                      <XStack ai="center" gap="$2">
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
                <Button
                  position="absolute"
                  top="$2"
                  right="$2"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <ProPoliciesModal />

      <ProAgreementModal />

      <StripePaymentModal
        yearlyTotal={yearlyTotal}
        monthlyTotal={monthlyTotal}
        disableAutoRenew={disableAutoRenew}
        chatSupport={chatSupport}
        supportTier={Number(supportTier)}
        selectedPrices={selectedPrices}
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

const FaqTabContent = () => {
  return (
    <>
      <Question>Do I have to subscribe?</Question>

      <P>
        Nope. There's a checkbox at the bottom to disable auto-renew. It raises the price
        a bit and you lose access to the private community Discord, but otherwise is
        identical.
      </P>

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

      <Spacer h="$10" />
    </>
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

  return (
    <>
      <BigP>
        Support is great way for teams using Tamagui to ensure bugs get fixed, questions
        are answered, and Tamagui stays healthy and up to date.
      </BigP>

      <YStack gap="$6" p="$4">
        <YStack gap="$3">
          <XStack alignItems="center">
            <Label f={1} htmlFor="chat-support">
              <P>Chat Support ($200/month)</P>
            </Label>

            <XStack maw={100}>
              <Switch
                checked={chatSupport}
                onCheckedChange={(checked) => setChatSupport(!!checked)}
                id="chat-support"
              />
            </XStack>
          </XStack>

          <P maw={500} size="$5" lineHeight="$6" o={0.5}>
            A private Discord room just for your team with 2 invites, with responses
            prioritized over our community chat.
          </P>
        </YStack>

        <YStack gap="$3">
          <XStack ov="hidden" alignItems="center">
            <Label f={1} htmlFor="support-tier">
              <P>Extra Support Level</P>
            </Label>

            <XStack f={1} maw={200}>
              <Select
                id="support-tier"
                size="$4"
                value={supportTier}
                onValueChange={setSupportTier}
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

          <P size="$5" lineHeight="$6" maw={500} o={0.5}>
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
      ai="center"
      jc="center"
      ov="hidden"
      py="$1"
      bg="$color1"
      height={60}
      value=""
      disableActiveTheme
      bbw={1}
      bbc="transparent"
      {...(!isActive && {
        bg: '$color2',
      })}
      {...props}
    >
      <YStack
        fullscreen
        pe="none"
        zi={-1}
        {...(isActive && {
          bg: '$color1',
        })}
        {...(!isActive && {
          bg: '$color1',
          o: 0.25,
          '$group-takeoutBody-hover': {
            o: 0.33,
          },
        })}
      />
      <Paragraph
        ff="$mono"
        size="$6"
        $gtMd={{ size: '$7' }}
        color={isActive ? '$color12' : '$color10'}
        fow={isActive ? 'bold' : 'normal'}
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
