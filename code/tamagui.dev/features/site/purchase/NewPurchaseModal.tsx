import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import type { Href } from 'one'
import { startTransition, use, useCallback, useEffect, useMemo, useState } from 'react'
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
  Spinner,
} from 'tamagui'
import { Select } from '../../../components/Select'
import { Switch } from '../../../components/Switch'
import { PromoCards } from '../header/UpgradePopover'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { StripeElementsForm } from './StripeElements'
import { useSubscription } from './useSubscription'
import { useProducts } from './useProducts'

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
  const { data: products } = useProducts()

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

  // Calculate direction for animation
  const direction = tabOrder.indexOf(currentTab) > tabOrder.indexOf(lastTab) ? 1 : -1

  // Calculate prices
  const basePrice = disableAutoRenew ? 400 : 240 // yearly base price
  const chatSupportMonthly = chatSupport ? 100 : 0 // $100/month for chat support
  const supportTierMonthly = Number(supportTier) * 1000 // $1000/month per tier

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
      return 'Paid by year, easy 1-click cancel'
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
            backdropFilter="blur(15px)"
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
                        ${disableAutoRenew ? yearlyTotal : Math.ceil(yearlyTotal / 12)}
                        <Paragraph als="flex-end" y={-5} o={0.5} x={4}>
                          {disableAutoRenew ? ` once` : `/month`}
                        </Paragraph>
                        {monthlyTotal > 0 && (
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
                      <StripeElementsForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        autoRenew={!disableAutoRenew}
                        chatSupport={chatSupport}
                        supportTier={Number(supportTier)}
                        priceId={products?.starter.prices[0].id || ''}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        buttonText={currentTab === 'purchase' ? 'Next' : 'Checkout'}
                        onNext={() => changeTab('support')}
                      />
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
    </>
  )
}

const P = styled(Paragraph, {
  ff: '$mono',
  size: '$6',
  lh: '$7',
})

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
  return (
    <>
      <BigP theme="alt2">
        Support is great way for teams using Tamagui to ensure bugs get fixed, questions
        are answered, and Tamagui stays healthy and up to date.
      </BigP>

      <YStack gap="$6" p="$4">
        <YStack gap="$3">
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
        </YStack>

        <YStack gap="$3">
          <XStack alignItems="center">
            <Label f={1} htmlFor="support-tier">
              <P>Support Tier ($800/month per tier)</P>
            </Label>

            <XStack maw={150}>
              <Select
                id="support-tier"
                size="$4"
                value={supportTier}
                onValueChange={setSupportTier}
              >
                <Select.Item value="0" index={0}>
                  None
                </Select.Item>
                <Select.Item value="1" index={1}>
                  Tier 1 - $800/mo
                </Select.Item>
                <Select.Item value="2" index={2}>
                  Tier 2 - $1,600/mo
                </Select.Item>
                <Select.Item value="3" index={3}>
                  Tier 3 - $3,000/mo
                </Select.Item>
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

const BigP = styled(P, {
  theme: 'green',
  px: '$8',
  size: '$8',
  lh: '$9',
  color: '$color11',
})

const PurchaseTabContent = () => {
  return (
    <YStack gap="$4" pb="$4">
      <YStack gap="$4">
        <BigP mb="$3">
          Tamagui Pro is a bundle that helps you launch your next idea much faster. You
          get:
        </BigP>

        <XStack fw="wrap" gap="$3" ai="center" justifyContent="center">
          <PromoCards />
        </XStack>

        <Separator o={0.25} />

        <YStack gap="$3">
          <P color="$color10">
            You get updates across all products and access to Github and Discord for a
            year.
          </P>

          <P color="$color10">
            You get lifetime rights to all code and assets, even after subscription
            expires.
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
