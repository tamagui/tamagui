import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { startTransition, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  Dialog,
  H3,
  Label,
  Paragraph,
  ScrollView,
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

class PurchaseModal {
  show = false
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
  const [lastTab, setLastTab] = useState<Tab>('purchase')
  const [currentTab, setCurrentTab] = useState<Tab>('purchase')
  const [disableAutoRenew, setDisableAutoRenew] = useState(false)
  const [chatSupport, setChatSupport] = useState(false)
  const [supportTier, setSupportTier] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | StripeError | null>(null)
  const [selectedPrices, setSelectedPrices] = useState<{
    proPriceId: string
    supportPriceIds: string[]
  }>({
    proPriceId: '',
    supportPriceIds: [],
  })
  const { data: products } = useProducts()
  const { data: userData } = useUser()

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
    // Find the appropriate price IDs based on user selection
    const selectedPrices = {
      proPriceId: '',
      supportPriceIds: [] as string[],
    }

    // Add Pro price based on auto-renew setting
    const proPrice = disableAutoRenew
      ? products?.pro.prices.find((p) => p.type === 'one_time')
      : products?.pro.prices.find((p) => p.type === 'recurring')
    if (proPrice) {
      selectedPrices.proPriceId = proPrice.id
    }

    // Add support tier if selected
    if (supportTier !== '0') {
      const supportPrice = products?.support.prices.find(
        (p) => p.description === `Tier ${supportTier}`
      )
      if (supportPrice) {
        selectedPrices.supportPriceIds.push(supportPrice.id)
      }
    }

    // Add chat support if selected
    if (chatSupport) {
      const chatSupportPrice = products?.support.prices.find(
        (p) => p.description === 'Chat Support'
      )
      if (chatSupportPrice) {
        selectedPrices.supportPriceIds.push(chatSupportPrice.id)
      }
    }

    setSelectedPrices(selectedPrices)
    paymentModal.show = true
  }

  // Calculate direction for animation
  const direction = tabOrder.indexOf(currentTab) > tabOrder.indexOf(lastTab) ? 1 : -1

  // Calculate prices
  const basePrice = disableAutoRenew ? 400 : 240 // yearly base price
  const chatSupportMonthly = chatSupport ? 100 : 0 // $100/month for chat support
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
        return 'One-time payment for yearly base, monthly billing for chat and support tier'
      }
      if (hasChat) {
        return 'One-time payment for yearly base, monthly billing for chat support'
      }
      if (hasSupportTier) {
        return 'One-time payment for yearly base, monthly billing for support tier'
      }
      return 'One-time payment, no renewal'
    } else {
      if (hasChat && hasSupportTier) {
        return 'Yearly base + monthly chat and support tier, easy 1-click cancel'
      }
      if (hasChat) {
        return 'Yearly base + monthly chat support, easy 1-click cancel'
      }
      if (hasSupportTier) {
        return 'Yearly base + monthly support tier, easy 1-click cancel'
      }
      return 'Yearly subscription'
    }
  }, [chatSupport, supportTier, disableAutoRenew])

  const tabContents = {
    purchase: PurchaseTabContent,
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

  const currentTabContents = tabContents[currentTab]()

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
        {/* <BentoPoliciesModal />
        <BentoAgreementModal />

        <TakeoutPoliciesModal />
        <TakeoutAgreementModal />
        <TakeoutFaqModal /> */}

        <Dialog.Adapt when="sm">
          <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame bg="$color3" padding={0} gap="$4">
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

              <YStack f={1} group="takeoutBody">
                <AnimatePresence exitBeforeEnter initial={false} custom={{ direction }}>
                  <AnimatedYStack key={currentTab}>
                    <Tabs.Content
                      value={currentTab}
                      forceMount
                      flex={1}
                      minHeight={400}
                      height="calc(min(100vh - 400px, 580px))"
                    >
                      <ScrollView>
                        <YStack p="$8" gap="$6">
                          {currentTabContents}
                        </YStack>
                      </ScrollView>
                    </Tabs.Content>
                  </AnimatedYStack>
                </AnimatePresence>
              </YStack>

              <Separator />
              <YStack p="$6" gap="$2" bg="$color1">
                <YStack
                  jc="center"
                  ai="center"
                  gap="$6"
                  $gtXs={{
                    jc: 'space-between',
                    ai: 'flex-start',
                    flexDirection: 'row',
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

                    <Paragraph theme="alt1" ellipse size="$4" mb="$3">
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

                  <YStack gap="$2" width="100%" $gtXs={{ width: '40%' }}>
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
                            // todo
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
                            // todo
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
            </Tabs>
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
  color: '$orange9',
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

      <Question>Do I own the code? Can I publish it publically?</Question>

      <P>
        For Bento - yes. For Takeout - no. Takeout is closed source, but the Bento license
        is very liberal, you have all rights to the code even including re-selling. We'd
        like it if you didn't wholesale re-publish or sell Bento, but we don't put any
        limits on it.
      </P>

      <Question>What is Theme AI?</Question>

      <P>
        If you go to the Theme page from the header, we have an input box to prompt. We've
        spent a lot of effort putting together a prompt and examples for LLMs to generate
        great looking themes based on your input. It's quite fun and generates some great
        themes.
      </P>

      <Question>What is Chat AI?</Question>

      <P>
        We've built a custom chatbot that's an expert at all things Tamagui. It actually
        does a two step process: first, it uses a fast LLM to gather context and decide if
        needs to reason or not, then it either responds immediately or thinks more before
        responding.
      </P>

      <P>
        We've given the chatbot a huge amount of context on Tamagui, Bento, Takeout, React
        Native, and the ecosystem of common libraries. It has access to our entire
        Discord, docs, and many examples of configurations and demos.
      </P>

      <Question>What support do I get in the base plan?</Question>

      <P>
        You get access to the private #support channel. We prioritize responses there over
        the public Discord, but we don't provide any SLA.
      </P>

      <Question>What support do I get with the Chat add-on?</Question>

      <P>
        You get a private Discord channel just for your team and a highlighted role in
        Discord chat. You can add up to 5 members to the private channel. We answer
        questions within 2 business days, and will prioritize bugs above our base
        subscribers.
      </P>

      <Question>What support do I get with Support tiers?</Question>

      <P>
        Each tier gives you 2 hours of prioritized development per month. We will set up a
        call with your team on sign-up, and you get a private chat room to talk with us.
        We log the work we do for you each month, and prioritize chat responses above
        prior tiers of support.
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
        {/* <YStack gap="$3">
          <XStack alignItems="center">
            <Label f={1} htmlFor="chat-support">
              <P>Chat Support ($100/month)</P>
            </Label>

            <XStack maw={100}>
              <Switch
                checked={chatSupport}
                onCheckedChange={(checked) => setChatSupport(!!checked)}
                id="chat-support"
              />
            </XStack>
          </XStack>

          <P maw={500} size="$5" lineHeight="$6" o={0.8}>
            A private Discord room just for your team, with responses prioritized over our
            community chat.
          </P>
        </YStack> */}

        <YStack gap="$3">
          <XStack ov="hidden" alignItems="center">
            <Label f={1} htmlFor="support-tier">
              <P>Level</P>
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

          <P size="$5" lineHeight="$6" maw={500} o={0.8}>
            Each tier adds 2 hours of prioritized development each month, and puts your
            messages higher in our response queue.
          </P>
        </YStack>
      </YStack>
    </>
  )
}

const PurchaseTabContent = () => {
  return (
    <YStack gap="$4" pb="$4">
      <YStack gap="$7">
        <BigP>
          We've put together a few tools that make starting and building a universal app
          easier and better.
        </BigP>

        <XStack mx="$-4" fw="wrap" gap="$3" ai="center" justifyContent="center">
          <PromoCards />
        </XStack>

        <YStack gap="$3">
          <P color="$color10">
            For a one year term you get access to the private Takeout Github repo, Bento
            UI, and the private community chat room. You get lifetime rights to all code
            and assets, even after subscription expires.
          </P>
        </YStack>
      </YStack>
    </YStack>
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
          bg: '$color3',
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
        size="$7"
        color={isActive ? '$color12' : '$color10'}
        fow={isActive ? 'bold' : 'normal'}
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
