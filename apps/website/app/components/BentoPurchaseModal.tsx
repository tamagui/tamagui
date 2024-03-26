import { NextLink } from '@components/NextLink'
import { CheckCircle, XCircle } from '@tamagui/lucide-icons'
import { useBentoStore } from 'hooks/useBentoStore'
import { useState } from 'react'
import type Stripe from 'stripe'
import type { ButtonProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  H4,
  Input,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
// import * as S from '@tamagui/studio/components'
// console.log('SSSSSSSS', S)

import { PoweredByStripeIcon } from '@components/PoweredByStripeIcon'
import type { Database } from '@lib/supabase-types'
import { X } from '@tamagui/lucide-icons'
import type { ProComponentsProps } from '@interfaces/ProComponentsProps'
import { useMemo } from 'react'
import {
  Dialog,
  H3,
  Label,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Unspaced,
} from 'tamagui'

const checkCircle = <CheckCircle color="$green9" />
const xCircle = <XCircle size={28} color="$red9" />

export const BentoPurchaseModal = ({
  proComponents,
  defaultCoupon,
}: Omit<ProComponentsProps, 'takeoutPlusBentoCoupon'>) => {
  const products = [proComponents]
  const store = useBentoStore()
  const [selectedProductsIds, setSelectedProductsIds] = useState<string[]>(
    products.filter(Boolean).map((p) => p!.id)
  )
  const sortedPrices = (proComponents?.prices ?? []).sort(
    (a, b) => a.unit_amount! - b.unit_amount!
  )

  const [selectedPriceId, setPriceId] = useState(sortedPrices[0]?.id)

  const sum = useMemo(() => {
    if (!proComponents) {
      return 0
    }
    let final = 0
    if (selectedProductsIds.includes(proComponents.id)) {
      final += selectedPriceId
        ? proComponents.prices.find((p) => p.id === selectedPriceId)?.unit_amount ?? 0
        : 0
    }
    return final
  }, [selectedProductsIds, selectedPriceId, proComponents])

  const finalCoupon = store.appliedCoupon ?? defaultCoupon
  // with discount applied
  const finalPrice = useMemo(() => {
    if (finalCoupon) {
      if (finalCoupon.amount_off) return sum - finalCoupon.amount_off
      if (finalCoupon.percent_off) return (sum * (100 - finalCoupon.percent_off)) / 100
    }

    return sum
  }, [sum, finalCoupon])
  const hasDiscountApplied = finalPrice !== sum

  const noProductSelected = selectedProductsIds.length === 0
  const showTeamSelect = selectedProductsIds.includes(proComponents?.id || '')

  return (
    <Dialog
      modal
      open={store.showPurchase}
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame padding="$4" space>
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
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
          className="blur-medium"
          opacity={0.5}
          bg="$color1"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          bg="$color2"
          key="content"
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
          <ScrollView p="$6" $gtSm={{ maxHeight: '90vh' }}>
            <YStack space>
              <XStack ai="center" jc="center" gap="$6" mx="$8">
                <Dialog.Title
                  ff="$silkscreen"
                  size="$6"
                  ls={4}
                  $sm={{ size: '$7' }}
                  mb="$6"
                  als="center"
                >
                  Checkout
                </Dialog.Title>
              </XStack>

              <XStack
                f={1}
                space
                separator={<Separator vertical bc="$color5" />}
                $sm={{ fd: 'column-reverse' }}
              >
                <YStack f={1} maxWidth={450}>
                  <BentoTable selectedPriceId={selectedPriceId} product={proComponents} />
                </YStack>

                <YStack f={1} gap="$4">
                  <YStack
                    opacity={showTeamSelect ? 1 : 0.25}
                    pointerEvents={showTeamSelect ? 'auto' : 'none'}
                  >
                    <RadioGroup
                      gap="$2"
                      value={selectedPriceId}
                      onValueChange={(val) => setPriceId(val)}
                    >
                      {sortedPrices.map((price) => {
                        const active = selectedPriceId === price.id
                        const htmlId = `price-${price.id}`
                        return (
                          <Label
                            key={htmlId}
                            f={1}
                            htmlFor={htmlId}
                            p="$4"
                            height="unset"
                            display="flex"
                            borderWidth="$0.25"
                            borderColor={active ? '$color11' : '$color6'}
                            borderRadius="$4"
                            gap="$4"
                            ai="center"
                            hoverStyle={{
                              borderColor: active ? '$color10' : '$color9',
                            }}
                          >
                            <RadioGroup.Item id={htmlId} size="$6" value={price.id}>
                              <RadioGroup.Indicator />
                            </RadioGroup.Item>

                            <YStack gap="$0" f={1}>
                              <H4 mt="$-1">{price.description}</H4>

                              <Paragraph theme="alt1">
                                {formatPrice(price.unit_amount! / 100, 'usd')}{' '}
                                {(price.metadata as Record<any, any>).is_lifetime
                                  ? 'lifetime access'
                                  : `base`}
                              </Paragraph>
                            </YStack>
                          </Label>
                        )
                      })}
                    </RadioGroup>
                  </YStack>

                  <Spacer size="$1" />

                  <YStack gap>
                    <XStack ai="flex-end" jc="flex-end" gap="$2">
                      {hasDiscountApplied ? (
                        <>
                          <H3 textDecorationLine="line-through" size="$8" theme="alt2">
                            {formatPrice(sum! / 100, 'usd')}
                          </H3>
                          <H3 size="$10">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                        </>
                      ) : (
                        <H3 size="$10">{formatPrice(finalPrice! / 100, 'usd')}</H3>
                      )}
                    </XStack>
                    <Unspaced>
                      <YStack mt="$2" gap="$1">
                        {finalCoupon ? (
                          <SizableText textAlign="right" size="$3">
                            Coupon "{finalCoupon.name}" is applied.
                          </SizableText>
                        ) : null}
                        <PromotionInput />
                      </YStack>
                    </Unspaced>

                    {/* <Separator /> */}

                    <YStack py="$6" px="$4" space>
                      <NextLink
                        href={`api/checkout?${(() => {
                          const params = new URLSearchParams({
                            // product_id: products.id,
                            // price_id: selectedPriceId,
                            // quantity: seats.toString(),
                          })
                          for (const productId of selectedProductsIds) {
                            params.append('product_id', productId)
                          }
                          params.append(`price-${proComponents?.id}`, selectedPriceId)
                          if (store.appliedPromoCode) {
                            // the coupon user applied
                            params.append(`promotion_code`, store.appliedPromoCode)
                          } else if (defaultCoupon) {
                            // the coupon that's applied by default (special event, etc.)
                            params.append(`coupon_id`, defaultCoupon.id)
                          }

                          return params.toString()
                        })()}`}
                      >
                        <PurchaseButton
                          disabled={noProductSelected}
                          opacity={noProductSelected ? 0.5 : undefined}
                        >
                          Purchase
                        </PurchaseButton>
                      </NextLink>
                      <XStack jc="space-between" space="$2" ai="center">
                        <XStack
                          ai="center"
                          separator={<Separator vertical bg="$color8" my="$2" />}
                          space="$2"
                        >
                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showFaq = true
                            }}
                            style={{ textDecorationLine: 'underline' }}
                            hoverStyle={{
                              color: '$color11',
                            }}
                            size="$2"
                          >
                            FAQ
                          </SizableText>

                          <SizableText
                            theme="alt1"
                            cursor="pointer"
                            onPress={() => {
                              store.showAgreement = true
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
                              store.showPolicies = true
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
                          <PoweredByStripeIcon width={96} />
                        </Theme>
                      </XStack>
                    </YStack>
                  </YStack>
                </YStack>
              </XStack>
            </YStack>
          </ScrollView>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$4"
                right="$4"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const PromotionInput = () => {
  const store = useBentoStore()

  const [localCode, setLocalCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const applyCoupon = (promoCode: string, coupon: Stripe.Coupon) => {
    store.appliedCoupon = coupon
    store.appliedPromoCode = promoCode
  }

  const removeCoupon = () => {
    setLocalCode('')
    store.appliedCoupon = null
    store.appliedPromoCode = null
  }

  const closeField = () => {
    setLocalCode('')
    store.promoInputIsOpen = false
  }

  const checkPromotion = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/check-promo-code?${new URLSearchParams({ code: localCode })}`
      )
      if (res.status === 200) {
        const json = (await res.json()) as Stripe.Coupon
        applyCoupon(localCode, json)
      } else {
        const json = await res.json()
        if (json.message) {
          alert(json.message)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {store.promoInputIsOpen ? (
        <XStack
          key="is-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          gap="$2"
          jc="center"
          ai="center"
        >
          {store.appliedPromoCode ? (
            <>
              <Paragraph theme="green_alt2">
                Coupon {store.appliedPromoCode} applied.
              </Paragraph>
              <Button chromeless size="$2" onPress={removeCoupon}>
                Remove Coupon
              </Button>
            </>
          ) : (
            <>
              {!store.appliedPromoCode && (
                <Button disabled={isLoading} size="$2" chromeless onPress={closeField}>
                  Cancel
                </Button>
              )}
              <Input
                disabled={!!store.appliedPromoCode}
                value={store.appliedPromoCode ?? localCode}
                onChangeText={(text) => {
                  setLocalCode(text)
                }}
                placeholder="Enter the code"
                size="$2"
              />
              <Button
                disabled={isLoading}
                themeInverse
                size="$2"
                onPress={checkPromotion}
              >
                Submit
              </Button>
            </>
          )}
        </XStack>
      ) : (
        <Paragraph
          key="is-not-open"
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={1}
          ta="right"
          textDecorationLine="underline"
          cursor="pointer"
          theme="alt2"
          size="$2"
          onPress={() => {
            store.promoInputIsOpen = true
          }}
        >
          Coupon
        </Paragraph>
      )}
    </AnimatePresence>
  )
}

const defaults = {
  price_1OiqquFQGtHoG6xcZxZaVF2B: {
    seats: 1,
  },
  price_1OeBK5FQGtHoG6xcTB6URHYD: {
    seats: 20,
  },
}

export function BentoTable({
  product,
  selectedPriceId,
}: {
  product?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  selectedPriceId: string
}) {
  const priceInfo = defaults[selectedPriceId]

  return (
    <YStack
      separator={<Separator bc="$color5" />}
      borderWidth="$0.5"
      borderRadius="$4"
      bc="$color5"
    >
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Lifetime access
          </Paragraph>
          <Paragraph size="$3" theme="alt1">
            You own the code, get updates&nbsp;for&nbsp;life
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{checkCircle}</Paragraph>
        </XStack>
      </XStack>
      <XStack px="$4" py="$4" gap="$3">
        <YStack width="80%">
          <Paragraph size="$6" fow="bold">
            Seats
          </Paragraph>
          <Paragraph size="$3" theme="alt1" lh="$2">
            Accounts given access
          </Paragraph>
        </YStack>
        <XStack f={1} ai="center" gap="$2" jc="center">
          <Paragraph size="$8">{priceInfo.seats}</Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}

function PurchaseButton(props: ButtonProps) {
  return (
    <Theme name="green">
      <Button
        size="$5"
        br="$6"
        backgroundColor="$color8"
        borderWidth={0}
        borderColor="$color10"
        hoverStyle={{
          backgroundColor: '$color9',
        }}
        pressStyle={{
          backgroundColor: '$color8',
        }}
        {...props}
      >
        <Button.Text ff="$munro" size="$8" ls={2} fontWeight="700" color="#fff">
          {props.children}
        </Button.Text>
      </Button>
    </Theme>
  )
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}
