import { Check, X } from '@tamagui/lucide-icons'
import type { Href } from 'one'
import { startTransition, useEffect, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
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

const PurchaseModalContents = () => {
  const store = useTakeoutStore()
  const [currentTab, setCurrentTab] = useState('purchase')

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
                    onPress={() => setCurrentTab('purchase')}
                    isActive={currentTab === 'purchase'}
                    value="purchase"
                  >
                    Start
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab
                    onPress={() => setCurrentTab('support')}
                    isActive={currentTab === 'support'}
                    value="support"
                  >
                    Support
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab
                    onPress={() => setCurrentTab('bento')}
                    isActive={currentTab === 'bento'}
                    value="bento"
                    end
                  >
                    FAQ
                  </Tab>
                </YStack>
              </Tabs.List>

              <ScrollView>
                <>
                  <YStack f={1} group="takeoutBody" p="$8">
                    <Tabs.Content value="purchase" gap="$4">
                      <Paragraph ff="$mono" size="$7" lh="$9">
                        Tamagui is over 300 OSS libraries developed by a small,
                        self-funded team, and Start is how we fund it all.
                      </Paragraph>

                      <Paragraph ff="$mono" size="$7" lh="$9">
                        Start is a single yearly subscription for:
                      </Paragraph>

                      <UL>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Takeout
                          </Paragraph>
                        </LI>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Bento
                          </Paragraph>
                        </LI>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Theme AI
                          </Paragraph>
                        </LI>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Chat AI
                          </Paragraph>
                        </LI>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Discord #support private channel
                          </Paragraph>
                        </LI>
                        <LI my={-3}>
                          <Paragraph ff="$mono" size="$7" lh="$9">
                            Early access to new features
                          </Paragraph>
                        </LI>
                      </UL>

                      <Paragraph ff="$mono" size="$7" lh="$9">
                        You own everything for life, only updates and private
                        Github/Discord access are gated by the subscription.
                      </Paragraph>
                    </Tabs.Content>

                    <Tabs.Content value="support" gap="$4">
                      <Paragraph ff="$mono" size="$7" lh="$9">
                        Support is great way for teams using Tamagui to ensure bugs get
                        fixed, questions are answered, and Tamagui stays healthy and up to
                        date.
                      </Paragraph>

                      <YStack gap="$3">
                        <XStack alignItems="center">
                          <Label f={1} htmlFor="chat-support">
                            <Paragraph ff="$mono" size="$7" lh="$9">
                              Chat ($200/mo)
                            </Paragraph>
                          </Label>

                          <XStack maw={100}>
                            <Checkbox size="$6" id="chat-support">
                              <Checkbox.Indicator>
                                <Check />
                              </Checkbox.Indicator>
                            </Checkbox>
                          </XStack>
                        </XStack>

                        <Paragraph maw={500} ff="$mono" size="$5" o={0.8}>
                          A private Discord room just for your team, with responses
                          prioritized over our community chat.
                        </Paragraph>
                      </YStack>

                      <YStack gap="$3">
                        <XStack alignItems="center">
                          <Label f={1} htmlFor="support-tier">
                            <Paragraph ff="$mono" size="$7" lh="$9">
                              Support ($1000/mo)
                            </Paragraph>
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

                        <Paragraph maw={500} ff="$mono" size="$5" o={0.8}>
                          Each tier adds 2 hours of prioritized development each month,
                          and puts your messages higher in our response queue.
                        </Paragraph>
                      </YStack>
                    </Tabs.Content>

                    <Tabs.Content value="faq" gap="$6"></Tabs.Content>
                  </YStack>
                </>
                <Spacer size="$1" />
              </ScrollView>

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
                        /year
                      </Paragraph>
                    </XStack>
                    <Paragraph theme="alt1" ellipse size="$4">
                      Yearly subscription, 1-click cancel anytime.
                    </Paragraph>
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
        bbc: '$color4',
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
      <Paragraph ff="$mono" size="$7" fow="bold">
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}
