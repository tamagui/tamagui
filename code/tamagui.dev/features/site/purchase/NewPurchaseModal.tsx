import { Check, X } from '@tamagui/lucide-icons'
import type { Href } from 'one'
import { startTransition, useEffect, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  Checkbox,
  Dialog,
  H3,
  Label,
  Paragraph,
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
import { Link } from '~/components/Link'
import { PurchaseButton } from './helpers'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { useTakeoutStore } from './useTakeoutStore'
import { UL } from '../../../components/UL'
import { LI } from '../../../components/LI'
import { Select } from '../../../components/Select'
import { styled } from 'tamagui'

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
  const store = useTakeoutStore()
  const [lastTab, setLastTab] = useState<Tab>('purchase')
  const [currentTab, setCurrentTab] = useState<Tab>('purchase')
  const [disableAutoRenew, setDisableAutoRenew] = useState(false)
  const direction = tabOrder.indexOf(currentTab) > tabOrder.indexOf(lastTab) ? 1 : -1

  function changeTab(next: Tab) {
    setCurrentTab(next)
    setLastTab(currentTab)
  }

  const tabContents = {
    purchase: PurchaseTabContent,
    support: SupportTabContent,
    faq: FaqTabContent,
  }

  const CurrentTabContents = tabContents[currentTab]

  return (
    <>
      <Dialog
        modal
        open={store.showPurchase}
        onOpenChange={(val) => {
          store.showPurchase = val
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
            key="overlay"
            animation="medium"
            bg="$shadowColor"
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
            >
              <Tabs.List disablePassBorderRadius>
                <YStack width={'33.3333%'} f={1}>
                  <Tab
                    onPress={() => changeTab('purchase')}
                    isActive={currentTab === 'purchase'}
                    value="purchase"
                  >
                    Start
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab
                    onPress={() => changeTab('support')}
                    isActive={currentTab === 'support'}
                    value="support"
                  >
                    Support
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab
                    onPress={() => changeTab('faq')}
                    isActive={currentTab === 'faq'}
                    value="bento"
                    end
                  >
                    FAQ
                  </Tab>
                </YStack>
              </Tabs.List>

              <YStack f={1} group="takeoutBody" p="$6">
                <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                  <AnimatedYStack key={currentTab}>
                    <Tabs.Content
                      value={currentTab}
                      forceMount
                      flex={1}
                      minHeight={400}
                      height="calc(100vh - 400px)"
                    >
                      <ScrollView>
                        <YStack gap="$5">
                          <CurrentTabContents />
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
                      <H3 size="$11">$200</H3>
                      <Paragraph als="flex-end" y={-5} o={0.5} x={4}>
                        {disableAutoRenew ? `total` : `/year`}
                      </Paragraph>
                    </XStack>

                    <Paragraph theme="alt1" ellipse size="$4" mb="$3">
                      {disableAutoRenew
                        ? `One-time payment, cancels after a year`
                        : `Yearly subscription, 1-click cancel anytime.`}
                    </Paragraph>

                    <XStack alignItems="center" gap="$4">
                      <Checkbox
                        onCheckedChange={(x) => setDisableAutoRenew(!!x)}
                        size="$4"
                        id="auto-renew"
                      >
                        <Checkbox.Indicator>
                          <Check />
                        </Checkbox.Indicator>
                      </Checkbox>
                      <Label htmlFor="auto-renew">
                        <Paragraph ff="$mono" size="$5">
                          Disable auto-renew
                        </Paragraph>
                      </Label>
                    </XStack>
                  </YStack>

                  <YStack gap="$2" width="100%" $gtXs={{ width: '40%' }}>
                    <Theme name="accent">
                      <Link
                        asChild
                        target="_blank"
                        href={
                          `api/checkout?${(() => {
                            return ''
                            // const params = new URLSearchParams()
                            // if (starterPriceId) {
                            //   params.append('product_id', starter.id)
                            //   params.append(`price-${starter?.id}`, starterPriceId)
                            // }
                            // if (bentoPriceId) {
                            //   params.append('product_id', bento.id)
                            //   params.append(`price-${bento?.id}`, bentoPriceId)
                            // }
                            // if (
                            //   isUserEligibleForBentoTakeoutDiscount &&
                            //   store.disableAutomaticDiscount
                            // ) {
                            //   params.append('disable_automatic_discount', '1')
                            // }

                            // return params.toString()
                          })()}` as Href
                        }
                      >
                        <PurchaseButton
                          onPress={(e) => {
                            if (currentTab === 'purchase') {
                              e.preventDefault()
                              e.stopPropagation()
                              setCurrentTab('support')
                            }
                          }}
                        >
                          {currentTab === 'purchase' ? 'Next' : 'Checkout'}
                        </PurchaseButton>
                      </Link>
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
  size: '$7',
  lh: '$9',
})

const Question = styled(P, {
  fontWeight: 'bold',
  color: '$yellow9',
})

const FaqTabContent = () => {
  return (
    <>
      <Question>Do I have to subscribe?</Question>

      <P>Nope. There's a checkbox at the bottom to disable auto-renew.</P>

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

const SupportTabContent = () => {
  return (
    <>
      <Paragraph theme="yellow" color="$color9" ff="$mono" size="$7" lh="$9">
        Support is great way for teams using Tamagui to ensure bugs get fixed, questions
        are answered, and Tamagui stays healthy and up to date.
      </Paragraph>

      <YStack gap="$6" p="$4">
        <YStack gap="$3">
          <XStack alignItems="center">
            <Label f={1} htmlFor="chat-support">
              <P>Chat ($100/mo)</P>
            </Label>

            <XStack maw={100}>
              <Checkbox size="$6" id="chat-support">
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </Checkbox>
            </XStack>
          </XStack>

          <P maw={500} size="$5" o={0.8}>
            A private Discord room just for your team, with responses prioritized over our
            community chat.
          </P>
        </YStack>

        <YStack gap="$3">
          <XStack alignItems="center">
            <Label f={1} htmlFor="support-tier">
              <P>Support ($1000/mo)</P>
            </Label>

            <XStack maw={150}>
              <Select
                id="support-tier"
                size="$4"
                defaultValue="0"
                onValueChange={(value) => {
                  // themeBuilder.setAccentSetting(value as any)
                }}
              >
                <Select.Item value="0" index={0}>
                  None
                </Select.Item>
                <Select.Item value="1" index={1}>
                  Tier 1
                </Select.Item>
                <Select.Item value="2" index={2}>
                  Tier 2
                </Select.Item>
                <Select.Item value="3" index={2}>
                  Tier 3
                </Select.Item>
                <Select.Item value="4" index={2}>
                  Tier 4
                </Select.Item>
                <Select.Item value="5" index={2}>
                  Tier 5
                </Select.Item>
              </Select>
            </XStack>
          </XStack>

          <P size="$5" maw={500} o={0.8}>
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
    <>
      <P theme="yellow" color="$color9" size="$7" lh="$9">
        Tamagui is over 300 OSS libraries developed by a small, self-funded team, and
        Start is how we keep the lights on.
      </P>

      <P>It's a single subscription for:</P>

      <UL>
        <LI my={-3}>
          <P>Takeout</P>
        </LI>
        <LI my={-3}>
          <P>Bento</P>
        </LI>
        <LI my={-3}>
          <P>Theme AI</P>
        </LI>
        <LI my={-3}>
          <P>Chat AI</P>
        </LI>
        <LI my={-3}>
          <P>Discord #support private channel</P>
        </LI>
        <LI my={-3}>
          <P>Early access to new features</P>
        </LI>
      </UL>

      <P>
        You own rights for life and can use it in as many commercial projects as you want.
        Only updates, APIs, and private Github/Discord are gated by the subscription.
      </P>
    </>
  )
}

const AnimatedYStack = styled(YStack, {
  flex: 1,
  x: 0,
  opacity: 1,

  animation: '100ms',
  variants: {
    // 1 = right, 0 = nowhere, -1 = left
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
      btrr={end ? '$3' : 0}
      btlr={!end ? '$3' : 0}
      height={70}
      value=""
      disableActiveTheme
      bbw={1}
      bbc="transparent"
      {...(!isActive && {
        bg: '$color3',
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
      <Paragraph ff="$mono" size="$7" fow="bold">
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
