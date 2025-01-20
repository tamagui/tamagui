import { Check, X } from '@tamagui/lucide-icons'
import type { Href } from 'one'
import { startTransition, useEffect, useMemo, useState } from 'react'
import type { TabsProps } from 'tamagui'
import {
  AnimatePresence,
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
import type { TakeoutPageProps } from '~/app/(site)/takeout'
import { Link } from '~/components/Link'
import { useUser } from '~/features/user/useUser'
import { BentoLogo } from '../../bento/BentoLogo'
import { TakeoutLogo } from '../../takeout/TakeoutLogo'
import { BentoAgreementModal, TakeoutAgreementModal } from './AgreementModal'
import { checkDiscountEligibility } from './checkDiscountEligibility'
import { TakeoutFaqModal } from './FAQModal'
import {
  BentoTable,
  MunroP,
  PurchaseButton,
  RadioGroupItem,
  TakeoutTable,
  formatPrice,
} from './helpers'
import { BentoPoliciesModal, TakeoutPoliciesModal } from './PoliciesModal'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { useTakeoutStore } from './useTakeoutStore'

function getPriceDescription(price: TakeoutPageProps['starter']['prices'][number]) {
  return (
    formatPrice(price.unit_amount! / 100, 'usd') +
    ((price.metadata as Object)['is_lifetime']
      ? ' lifetime access'
      : `/${price.interval || 'year (cancel anytime)'}`)
  )
}

type PurchaseModalProps = Omit<TakeoutPageProps, 'takeoutPlusBentoCoupon'> & {
  defaultValue: 'takeout' | 'bento'
}

export const PurchaseModal = (props: PurchaseModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
    })
  }, [])

  if (!mounted) {
    return null
  }

  return <PurchaseModalContents {...props} />
}

const PurchaseModalContents = ({ starter, bento, defaultValue }: PurchaseModalProps) => {
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
  const { data: user } = useUser()

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
    if (!starter) {
      return 0
    }
    let final = 0
    if (starterPriceId) {
      final += starterPriceId
        ? (starter.prices.find((p) => p.id === starterPriceId)?.unit_amount ?? 0)
        : 0
    }
    if (bentoPriceId) {
      final += bentoPriceId
        ? (bento.prices.find((p) => p.id === bentoPriceId)?.unit_amount ?? 0)
        : 0
    }
    return final
  }, [starterPriceId, bentoPriceId, starter])

  const noProductSelected = !bentoPriceId && !starterPriceId

  const isUserEligibleForBentoTakeoutDiscount = user
    ? checkDiscountEligibility({
        accessInfo: user?.accessInfo,
        purchaseContainsBento: !!bentoPriceId,
        purchaseContainsTakeout: !!starterPriceId,
      })
    : false

  // const enable3d = useClientValue(
  //   () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  // )

  const [currentTab, setCurrentTab] = useState(defaultValue)

  return (
    <Theme name="black">
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
            bg="$color3"
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
              <Tabs.List disablePassBorderRadius>
                <YStack width={'50%'} f={1}>
                  <Tab
                    py={12}
                    onPress={() => setCurrentTab('takeout')}
                    isActive={currentTab === 'takeout'}
                    value="takeout"
                  >
                    <TakeoutLogo scale={0.15} />
                  </Tab>
                </YStack>
                <Separator vertical bc="$color4" mb={2} mx={-1} />
                <YStack width={'50%'} f={1}>
                  <Tab
                    onPress={() => setCurrentTab('bento')}
                    isActive={currentTab === 'bento'}
                    value="bento"
                    end
                  >
                    <BentoLogo noShadow scale={0.26} />
                  </Tab>
                </YStack>
              </Tabs.List>
              <ScrollView $gtSm={{ height: '60vh' }}>
                <PageTheme>
                  <YStack f={1} group="takeoutBody" px="$4" pb="$4">
                    <Tabs.Content f={1} value="takeout">
                      <XStack
                        f={1}
                        gap="$4"
                        py="$4"
                        $group-takeoutBody-sm={{ fd: 'column-reverse' }}
                      >
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
                                p="$2"
                                bw={1}
                                bc="$color5"
                                br="$4"
                                gap="$3"
                              >
                                <Check size={24} mt={2} color="$color9" />
                                <MunroP size="$5" color="$color11" ls={1.5}>
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

                        <YStack f={2} gap="$2">
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
                                    {getPriceDescription(price)}
                                  </Paragraph>
                                </RadioGroupItem>
                              )
                            })}
                          </RadioGroup>

                          <XStack jc="flex-end" my="$2">
                            <Button
                              onPress={() => setStarterPriceId(null)}
                              o={starterPriceId ? 1 : 0}
                              size="$2"
                              color="$color10"
                              chromeless
                            >
                              Clear
                            </Button>
                          </XStack>
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
                      <XStack
                        f={1}
                        gap="$4"
                        $group-takeoutBody-sm={{ fd: 'column-reverse' }}
                      >
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

                        <YStack f={1} gap="$4">
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
                                      <H4 mt="$-1">
                                        {price.description === 'Team (Unlimited)'
                                          ? 'Pro'
                                          : price.description === 'Team (8-10 Users)'
                                            ? 'Team'
                                            : 'Personal'}
                                      </H4>

                                      <Paragraph theme="alt2">
                                        {getPriceDescription(price)}
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
                </PageTheme>
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
                  <YStack f={1} width="100%" $gtXs={{ width: '40%' }}>
                    <XStack>
                      <H3 size="$11">{formatPrice(sum! / 100, 'usd')}</H3>
                    </XStack>
                    <Paragraph theme="alt1" ellipse size="$4">
                      {(() => {
                        const items: string[] = []
                        const starterPrice = starterPriceId
                          ? starter.prices.find((price) => price.id === starterPriceId)
                          : null
                        const bentoPrice = bentoPriceId
                          ? bento.prices.find((price) => price.id === bentoPriceId)
                          : null

                        if (starterPrice) {
                          items.push(`Takeout ${starterPrice?.description || ''}`)
                        }
                        if (bentoPrice) {
                          items.push(`Bento ${bentoPrice?.description || ''}`)
                        }

                        return items.join(' + ')
                      })()}
                    </Paragraph>
                    <AnimatePresence>
                      {isUserEligibleForBentoTakeoutDiscount ? (
                        <YStack
                          jc="flex-start"
                          ai="flex-start"
                          o={1}
                          enterStyle={{ o: 0 }}
                          exitStyle={{ o: 0 }}
                          animation="quick"
                        >
                          {store.disableAutomaticDiscount ? (
                            <>
                              <Paragraph size="$1" theme="alt2">
                                You can apply a promo code on the next page.
                              </Paragraph>
                              <SizableText
                                cursor="pointer"
                                style={{ textDecorationLine: 'underline' }}
                                hoverStyle={{
                                  color: '$color11',
                                }}
                                size="$1"
                                onPress={() => (store.disableAutomaticDiscount = false)}
                              >
                                Use my automatic discount
                              </SizableText>
                            </>
                          ) : (
                            <>
                              <Paragraph size="$2" theme="green">
                                A $50 discount applies if you add both Bento and Takeout.
                              </Paragraph>
                              <SizableText
                                cursor="pointer"
                                style={{ textDecorationLine: 'underline' }}
                                hoverStyle={{
                                  color: '$color11',
                                }}
                                size="$1"
                                onPress={() => (store.disableAutomaticDiscount = true)}
                              >
                                Disable and use my own promo
                              </SizableText>
                            </>
                          )}
                        </YStack>
                      ) : (
                        <Paragraph
                          size="$1"
                          theme="alt2"
                          o={1}
                          enterStyle={{ o: 0 }}
                          exitStyle={{ o: 0 }}
                          animation="quick"
                        >
                          You can apply your promo code on the next page.
                        </Paragraph>
                      )}
                    </AnimatePresence>
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

                  <YStack gap="$2" width="100%" $gtXs={{ width: '40%' }}>
                    <Theme name="white">
                      <Link
                        asChild
                        target="_blank"
                        href={
                          `api/checkout?${(() => {
                            const params = new URLSearchParams()
                            if (starterPriceId) {
                              params.append('product_id', starter.id)
                              params.append(`price-${starter?.id}`, starterPriceId)
                            }
                            if (bentoPriceId) {
                              params.append('product_id', bento.id)
                              params.append(`price-${bento?.id}`, bentoPriceId)
                            }
                            if (
                              isUserEligibleForBentoTakeoutDiscount &&
                              store.disableAutomaticDiscount
                            ) {
                              params.append('disable_automatic_discount', '1')
                            }

                            return params.toString()
                          })()}` as Href
                        }
                      >
                        <PurchaseButton
                          disabled={noProductSelected}
                          opacity={noProductSelected ? 0.5 : undefined}
                        >
                          Checkout
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
    </Theme>
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
      py="$4"
      btrr={end ? '$3' : 0}
      btlr={!end ? '$3' : 0}
      height={90}
      value=""
      disableActiveTheme
      bbw={1}
      bbc="transparent"
      {...(!isActive && {
        bbc: '$color4',
        bg: '$color1',
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
      {children}
    </Tabs.Tab>
  )
}

const PageTheme = (props: { children: any }) => {
  return props.children
  // disabling theme for now looks not great
  // const isBento = usePathname().startsWith('/bento')
  // return <ThemeTintAlt offset={isBento ? -1 : 1}>{props.children}</ThemeTintAlt>
}
