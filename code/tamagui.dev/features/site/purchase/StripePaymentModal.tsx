/**
 * @summary
 *
 * StripePaymentModal handles the payment flow for Pro plan, Team plan, and additional support options.
 *
 * Pro Plan Options:
 * - One-time payment: $400
 * - Yearly subscription: $240/year
 *    - This is processed as an invoice payment for one-time payment
 *    - For subscription, client-side confirmation is needed to verify card ownership
 *
 * Team Plan Options:
 * - Additional seats: $100/seat/year
 *    - Can be added to both one-time and subscription plans
 *    - Billed annually regardless of plan type
 *    - For one-time payment: processed with the base plan invoice
 *    - For subscription: added as an additional subscription item
 *
 * Additional monthly subscriptions:
 * - Chat Support: $200/month
 * - Support Tier: $800/month per tier
 *
 * The payment flow is split into two APIs because Pro/Team plans (yearly) and
 * additional options (monthly) have different billing cycles:
 * - create-subscription: Handles Pro plan and Team seats (one-time or yearly)
 * - upgrade-subscription: Handles monthly subscriptions
 *
 * Client-side payment confirmation is required for subscriptions due to
 * card ownership verification, but not for one-time payments which are
 * completed server-side.
 */
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Appearance, StripeError } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import {
  Button,
  Dialog,
  H3,
  Paragraph,
  Separator,
  Spinner,
  Theme,
  useTheme,
  useThemeName,
  XStack,
  YStack,
  SizableText,
  Input,
} from 'tamagui'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { useUser } from '~/features/user/useUser'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'
import { useLoginLink } from '../../auth/useLoginLink'
import { Sheet } from 'tamagui'
import { Unspaced } from 'tamagui'
import { sendEvent } from '../../analytics/sendEvent'

const couponSchema = z.object({
  id: z.string(),
  code: z.string(),
  percent_off: z.number().nullable(),
  amount_off: z.number().nullable(),
})

type Coupon = z.infer<typeof couponSchema>

const couponResponseSchema = z.discriminatedUnion('valid', [
  z.object({
    valid: z.literal(true),
    coupon: couponSchema,
  }),
  z.object({
    valid: z.literal(false),
    message: z.string(),
  }),
])

type CouponResponse = z.infer<typeof couponResponseSchema>

const stripeErrorSchema = z.object({
  code: z.string(),
  decline_code: z.string().optional(),
  doc_url: z.string(),
  message: z.string(),
  param: z.string(),
  request_log_url: z.string().optional(),
  type: z.string(),
})

const ErrorMessage = ({ error }: { error: Error | StripeError }) => {
  const errorMessage = useMemo(() => {
    if (typeof error === 'string') {
      return error
    }
    const parsed = stripeErrorSchema.safeParse(error)
    if (parsed.success) {
      return parsed.data.message
    }
    return 'An error occurred during payment processing'
  }, [error])

  return (
    <YStack mt="$2">
      <Paragraph color="$red10" size="$3">
        {errorMessage}
      </Paragraph>
    </YStack>
  )
}

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!key) {
  console.warn(`No stripe key!`)
}

const stripePromise = loadStripe(key || '')

class PaymentModal {
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

export const paymentModal = createStore(PaymentModal)
export const usePaymentModal = createUseStore(PaymentModal)

type StripePaymentModalProps = {
  yearlyTotal: number
  monthlyTotal: number
  disableAutoRenew: boolean
  chatSupport: boolean
  supportTier: number
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  teamSeats: number
}

const PaymentForm = ({
  onSuccess,
  onError,
  autoRenew,
  chatSupport,
  supportTier,
  teamSeats,
  selectedPrices,
  isProcessing,
  setIsProcessing,
  userData,
  finalCoupon,
}: {
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  autoRenew: boolean
  chatSupport: boolean
  supportTier: number
  teamSeats: number
  selectedPrices: {
    disableAutoRenew: boolean
    chatSupport: boolean
    supportTier: number
    teamSeats: number
  }
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  userData: any
  finalCoupon: Coupon | null
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<Error | StripeError | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    try {
      // Submit the form first
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError)
        onError(submitError)
        return
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          elements,
        })

      if (paymentMethodError) {
        setError(paymentMethodError)
        onError(paymentMethodError)
        return
      }

      // Create Pro subscription/payment first
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          disableAutoRenew: selectedPrices.disableAutoRenew,
          couponId: finalCoupon?.id,
          teamSeats: selectedPrices.teamSeats,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const error = new Error(JSON.stringify(data))
        setError(error)
        onError(error)
        return
      }

      // Confirm payment only for subscription (not one-time payment)
      if (!selectedPrices.disableAutoRenew) {
        const result = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            payment_method: paymentMethod.id,
          },
          clientSecret: data.clientSecret,
        })

        if (result.error) {
          setError(result.error)
          onError(result.error)
          return
        }
      }

      // If Chat or Support is selected, create additional subscription
      if (selectedPrices.chatSupport || selectedPrices.supportTier > 0) {
        // Submit the form first
        const { error: submitError } = await elements.submit()
        if (submitError) {
          setError(submitError)
          onError(submitError)
          return
        }
        if (submitError) {
          setError(submitError)
          onError(submitError)
          return
        }
        const upgradeResponse = await fetch('/api/upgrade-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: data.id,
            paymentMethodId: paymentMethod.id,
            chatSupport: selectedPrices.chatSupport,
            supportTier: selectedPrices.supportTier,
            couponId: finalCoupon?.id,
          }),
        })

        const upgradeData = await upgradeResponse.json()
        if (!upgradeResponse.ok) {
          // If upgrade fails and Pro is a subscription, cancel it
          if (!selectedPrices.disableAutoRenew) {
            await fetch('/api/handle-failed-payment-subscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subscriptionId: data.id,
              }),
            })
          }

          const error = new Error(JSON.stringify(upgradeData))
          setError(error)
          onError(error)
          return
        }

        // Confirm monthly subscription payment
        const monthlyResult = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            payment_method: paymentMethod.id,
          },
          clientSecret: upgradeData.clientSecret,
        })

        if (monthlyResult.error) {
          // If monthly payment fails and Pro is a subscription, cancel it
          if (!selectedPrices.disableAutoRenew) {
            await fetch('/api/handle-failed-payment-subscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subscriptionId: data.id,
              }),
            })
          }

          setError(monthlyResult.error)
          onError(monthlyResult.error)
          return
        }
      }

      onSuccess(data.id)
    } catch (error) {
      setError(error as Error)
      onError(error as Error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <YStack gap="$4">
        <PaymentElement
          options={{
            layout: 'accordion',
            defaultValues: {
              billingDetails: {
                name: userData?.userDetails?.full_name || '',
                email: userData?.user?.email || '',
              },
            },
          }}
        />

        <XStack h={23} als="flex-end">
          <PoweredByStripeIcon />
        </XStack>

        <Theme name="accent">
          <YStack
            alignItems="flex-end"
            gap="$2"
            onPressOut={() => {
              sendEvent(`Pro: Complete Purchase`)
            }}
          >
            <Button
              fontFamily="$mono"
              br="$10"
              als="flex-end"
              disabled={isProcessing || !stripe || !elements}
            >
              {isProcessing ? 'Processing...' : 'Complete purchase'}
            </Button>
            {error && <ErrorMessage error={error} />}
          </YStack>
        </Theme>
      </YStack>
    </form>
  )
}

export const StripePaymentModal = (props: StripePaymentModalProps) => {
  const {
    yearlyTotal: propYearlyTotal,
    monthlyTotal: propMonthlyTotal,
    disableAutoRenew: propDisableAutoRenew,
    chatSupport: propChatSupport,
    supportTier: propSupportTier,
    onSuccess,
    onError,
    teamSeats: propTeamSeats,
  } = props
  const store = usePaymentModal()
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: userData, isLoading, refresh } = useUser()
  const supabaseClient = useSupabaseClient()
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [finalCoupon, setFinalCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const { handleLogin } = useLoginLink()

  const theme = useTheme()
  const themeName = useThemeName()

  // Use store values if available, otherwise use props
  const yearlyTotal = store.yearlyTotal || propYearlyTotal
  const monthlyTotal = store.monthlyTotal || propMonthlyTotal
  const disableAutoRenew = store.disableAutoRenew || propDisableAutoRenew
  const chatSupport = store.chatSupport || propChatSupport
  const supportTier = store.supportTier || propSupportTier
  const teamSeats = store.teamSeats || propTeamSeats

  const handleApplyCoupon = async () => {
    try {
      setIsProcessing(true)
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      })

      const result = await response.json()
      const data = couponResponseSchema.parse(result)

      if (data.valid) {
        setFinalCoupon(data.coupon)
        setShowCoupon(false)
      } else {
        setCouponError(data.message)
      }
    } catch (error) {
      setCouponError('Failed to apply coupon')
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateDiscountedAmount = (amount: number, coupon: Coupon | null): number => {
    if (!coupon) return amount

    if (coupon.percent_off) {
      return amount * (1 - coupon.percent_off / 100)
    }

    if (coupon.amount_off) {
      return Math.max(0, amount - coupon.amount_off / 100)
    }

    return amount
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <YStack f={1} ai="center" jc="center" p="$4">
          <Spinner size="large" />
        </YStack>
      )
    }

    if (!userData?.user) {
      return (
        <YStack gap="$4" ai="center" p="$4">
          <H3>Sign in to continue</H3>
          <Paragraph ta="center">
            Please sign in with GitHub to continue your purchase.
          </Paragraph>
          <Button
            size="$4"
            theme="accent"
            onPress={handleLogin}
            icon={GithubIcon}
            disabled={!supabaseClient}
          >
            Continue with GitHub
          </Button>
        </YStack>
      )
    }

    const appearance: Appearance = {
      theme: themeName.startsWith('dark') ? 'night' : 'stripe',
      variables: {
        colorPrimary: theme.blue9.val,
        colorBackground: theme.background.val,
        colorText: theme.color.val,
        colorDanger: theme.red9.val,
        fontFamily: '"Berkeley Mono", system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        gridRowSpacing: '20px',
        gridColumnSpacing: '15px',
        borderRadius: '8px',
      },
    }

    const baseAmount = monthlyTotal * 100 + yearlyTotal * 100
    const amount = Math.ceil(
      calculateDiscountedAmount(baseAmount / 100, finalCoupon) * 100
    )

    return (
      <XStack gap="$6">
        <YStack f={1} gap="$4">
          <H3 ff="$mono">Payment details</H3>
          <Separator />
          {amount > 0 && (
            <Elements
              stripe={stripePromise}
              options={{
                appearance,
                mode: 'payment',
                currency: 'usd',
                amount,
                paymentMethodTypes: ['card', 'link'],
                payment_method_types: ['card', 'link'],
                paymentMethodCreation: 'manual',
              }}
            >
              <PaymentForm
                onSuccess={onSuccess}
                onError={onError}
                autoRenew={!disableAutoRenew}
                chatSupport={chatSupport}
                supportTier={supportTier}
                teamSeats={teamSeats}
                selectedPrices={{
                  disableAutoRenew,
                  chatSupport,
                  supportTier: Number(supportTier),
                  teamSeats: Number(teamSeats),
                }}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                userData={userData}
                finalCoupon={finalCoupon}
              />
            </Elements>
          )}
        </YStack>

        <YStack f={1} gap="$4" backgroundColor="$color2" p="$4" br="$4">
          <H3 fontFamily="$mono">Order summary</H3>
          <Separator />

          {yearlyTotal > 0 && (
            <XStack jc="space-between">
              <Paragraph ff="$mono" lineHeight={24}>
                {disableAutoRenew ? (
                  <>
                    Pro - One year
                    <br />
                    One-time payment
                  </>
                ) : (
                  'Pro subscription'
                )}
              </Paragraph>
              <YStack ai="flex-end">
                {finalCoupon && (
                  <Paragraph
                    ff="$mono"
                    size="$3"
                    o={0.5}
                    textDecorationLine="line-through"
                  >
                    ${disableAutoRenew ? yearlyTotal : Math.ceil(yearlyTotal / 12)}
                    {!disableAutoRenew && '/month'}
                  </Paragraph>
                )}
                <Paragraph ff="$mono">
                  $
                  {Math.ceil(
                    calculateDiscountedAmount(
                      disableAutoRenew ? yearlyTotal : yearlyTotal / 12,
                      finalCoupon
                    )
                  )}
                  {!disableAutoRenew && '/month'}
                </Paragraph>
              </YStack>
            </XStack>
          )}

          {monthlyTotal > 0 && (
            <>
              {chatSupport && (
                <XStack jc="space-between">
                  <Paragraph ff="$mono">Chat Support</Paragraph>
                  <YStack ai="flex-end">
                    {finalCoupon && (
                      <Paragraph
                        ff="$mono"
                        size="$3"
                        o={0.5}
                        textDecorationLine="line-through"
                      >
                        $200/month
                      </Paragraph>
                    )}
                    <Paragraph ff="$mono">
                      ${Math.ceil(calculateDiscountedAmount(200, finalCoupon))}/month
                    </Paragraph>
                  </YStack>
                </XStack>
              )}
              {supportTier > 0 && (
                <XStack jc="space-between">
                  <Paragraph ff="$mono">Support tier ({supportTier})</Paragraph>
                  <YStack ai="flex-end">
                    {finalCoupon && (
                      <Paragraph
                        ff="$mono"
                        size="$3"
                        o={0.5}
                        textDecorationLine="line-through"
                      >
                        ${supportTier * 800}/month
                      </Paragraph>
                    )}
                    <Paragraph ff="$mono">
                      $
                      {Math.ceil(
                        calculateDiscountedAmount(supportTier * 800, finalCoupon)
                      )}
                      /month
                    </Paragraph>
                  </YStack>
                </XStack>
              )}
            </>
          )}

          {teamSeats > 0 && (
            <XStack jc="space-between">
              <Paragraph ff="$mono">
                Team Seats ({teamSeats} {teamSeats === 1 ? 'seat' : 'seats'})
              </Paragraph>
              <YStack ai="flex-end">
                {finalCoupon && (
                  <Paragraph
                    ff="$mono"
                    size="$3"
                    o={0.5}
                    textDecorationLine="line-through"
                  >
                    ${teamSeats * 100}/year
                  </Paragraph>
                )}
                <Paragraph ff="$mono">
                  ${Math.ceil(calculateDiscountedAmount(teamSeats * 100, finalCoupon))}
                  /year
                </Paragraph>
              </YStack>
            </XStack>
          )}

          <Separator />

          <XStack jc="space-between">
            <H3 ff="$mono">Total</H3>
            <YStack ai="flex-end">
              {finalCoupon && (
                <Paragraph ff="$mono" size="$3" o={0.5} textDecorationLine="line-through">
                  ${yearlyTotal}
                  {monthlyTotal > 0 && ` + $${monthlyTotal}/month`}
                </Paragraph>
              )}
              <H3 ff="$mono">
                ${Math.ceil(calculateDiscountedAmount(yearlyTotal, finalCoupon))}
                {monthlyTotal > 0 &&
                  ` + $${Math.ceil(calculateDiscountedAmount(monthlyTotal, finalCoupon))}/month`}
              </H3>
            </YStack>
          </XStack>

          <YStack gap="$2">
            <SizableText
              theme="alt1"
              o={0.3}
              cursor="pointer"
              hoverStyle={{ opacity: 0.8 }}
              onPress={() => setShowCoupon((x) => !x)}
            >
              {finalCoupon ? `Applied: ${finalCoupon.code}` : 'Have a coupon code?'}
            </SizableText>
            {showCoupon && (
              <XStack gap="$2" ai="center">
                <Input
                  f={1}
                  size="$3"
                  borderWidth={1}
                  placeholder="Enter code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <Button size="$3" theme="accent" onPress={handleApplyCoupon}>
                  Apply
                </Button>
              </XStack>
            )}
            {couponError && (
              <Paragraph size="$2" color="$red10">
                {couponError}
              </Paragraph>
            )}
            {finalCoupon && (
              <Paragraph size="$2" color="$green10">
                Coupon applied:{' '}
                {finalCoupon.percent_off
                  ? `${finalCoupon.percent_off}% off`
                  : `$${finalCoupon?.amount_off ? finalCoupon.amount_off / 100 : 0} off`}
              </Paragraph>
            )}
          </YStack>
        </YStack>
      </XStack>
    )
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
    paymentModal.teamSeats = Number(teamSeats)
    paymentModal.selectedPrices = {
      disableAutoRenew,
      chatSupport,
      supportTier: Number(supportTier),
      teamSeats: Number(teamSeats),
    }
  }

  return (
    <Dialog
      modal
      open={store.show}
      onOpenChange={(val) => {
        store.show = val
      }}
    >
      <Dialog.Adapt when="maxMd">
        <Sheet modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame bg="$color1" jc="center" ai="center" padding={0} gap="$4">
            <Dialog.Adapt.Contents />
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
          opacity={0.95}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation="quick"
          w="90%"
          maw={1000}
          p="$6"
          enterStyle={{
            opacity: 0,
            y: -5,
          }}
          exitStyle={{
            opacity: 0,
            y: 5,
          }}
        >
          {renderContent()}
          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
