import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Appearance, StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useState } from 'react'
import { z } from 'zod'
import {
  Button,
  Dialog,
  H3,
  Paragraph,
  Separator,
  Spinner,
  XStack,
  YStack,
  Input,
  Label,
  Theme,
  useTheme,
  useThemeName,
  SizableText,
} from 'tamagui'
import { authFetch } from '~/features/api/authFetch'
import { useUser } from '~/features/user/useUser'

const isTestMode =
  process.env.STRIPE_TEST_MODE === 'true' || process.env.NODE_ENV === 'development'

const key = isTestMode
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
  : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// lazy load stripe only when needed
let stripePromise: ReturnType<typeof loadStripe> | null = null
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(key || '')
  }
  return stripePromise
}

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

// re-export from separate file to allow code splitting
export { addTeamMemberModal, useAddTeamMemberModal } from './addTeamMemberModalStore'

// also import for internal use
import { useAddTeamMemberModal } from './addTeamMemberModalStore'

const PaymentForm = ({
  onSuccess,
  onError,
  subscriptionId,
  additionalSeats,
  isProcessing,
  setIsProcessing,
  couponId,
}: {
  onSuccess: () => void
  onError: (error: Error | StripeError) => void
  subscriptionId: string
  additionalSeats: number
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  couponId: string
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
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          elements,
        })

      if (paymentMethodError) {
        throw paymentMethodError
      }

      const response = await authFetch('/api/add-team-seats', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          subscriptionId,
          additionalSeats,
          couponId: couponId || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error)
      }

      if (data.type === 'subscription' && data.clientSecret) {
        const paymentIntent = await stripe.retrievePaymentIntent(data.clientSecret)
        if (paymentIntent.paymentIntent?.status === 'succeeded') {
          onSuccess()
          return
        }

        const result = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            payment_method: paymentMethod.id,
          },
          clientSecret: data.clientSecret,
        })

        if (result.error) {
          throw result.error
        }
      }

      onSuccess()
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
        <PaymentElement />
        <Theme name="accent">
          <Button
            rounded="$10"
            self="flex-end"
            disabled={isProcessing || !stripe || !elements}
          >
            <Button.Text fontFamily="$mono">
              {isProcessing ? 'Processing...' : 'Add Seats'}
            </Button.Text>
          </Button>
        </Theme>
        {error && (
          <Paragraph color="$red10" size="$3">
            {error.message}
          </Paragraph>
        )}
      </YStack>
    </form>
  )
}

export const AddTeamMemberModalComponent = () => {
  const store = useAddTeamMemberModal()
  const [isProcessing, setIsProcessing] = useState(false)
  const [additionalSeats, setAdditionalSeats] = useState(1)
  const { isLoading, refresh } = useUser()
  const theme = useTheme()
  const themeName = useThemeName()
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [finalCoupon, setFinalCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

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

  const appearance: Appearance = {
    theme: themeName.startsWith('dark') ? 'night' : 'stripe',
    variables: {
      colorPrimary: theme.blue9?.val,
      colorBackground: theme.background?.val,
      colorText: theme.color?.val,
      colorDanger: theme.red9?.val,
      fontFamily: '"Berkeley Mono", system-ui, -apple-system, sans-serif',
    },
  }

  const handleSuccess = () => {
    store.show = false
    refresh()
  }

  const handleError = (error: Error | StripeError) => {
    console.error('Payment error:', error)
  }

  const baseAmount = additionalSeats * 100
  const amount = Math.ceil(calculateDiscountedAmount(baseAmount, finalCoupon))

  return (
    <Dialog
      modal
      open={store.show}
      onOpenChange={(val) => {
        store.show = val
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          transition="medium"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          transition="quick"
          width="90%"
          maxW={600}
          p="$6"
        >
          {isLoading ? (
            <YStack flex={1} items="center" justify="center">
              <Spinner size="large" />
            </YStack>
          ) : (
            <YStack gap="$4">
              <H3>Add Team Seats</H3>
              <Separator />

              <YStack gap="$2">
                <Label htmlFor="seats">Number of Additional Seats</Label>
                <Input
                  id="seats"
                  value={String(additionalSeats)}
                  onChange={(e) => {
                    const text = e.target?.value ?? ''
                    const num = Number(text.replace(/^0+/, '')) || 1
                    setAdditionalSeats(num)
                  }}
                  type="number-pad"
                  width={200}
                />
                <YStack items="flex-end">
                  {finalCoupon && (
                    <Paragraph
                      fontFamily="$mono"
                      size="$3"
                      opacity={0.5}
                      textDecorationLine="line-through"
                    >
                      Cost: ${baseAmount}/year per seat
                    </Paragraph>
                  )}
                  <Paragraph color="$color9">Cost: ${amount}/year per seat</Paragraph>
                </YStack>
              </YStack>

              <YStack gap="$2">
                <SizableText
                  color="$color10"
                  opacity={0.3}
                  cursor="pointer"
                  hoverStyle={{ opacity: 0.8 }}
                  onPress={() => setShowCoupon((x) => !x)}
                >
                  {finalCoupon ? `Applied: ${finalCoupon.code}` : 'Have a coupon code?'}
                </SizableText>
                {showCoupon && (
                  <XStack gap="$2" items="center">
                    <Input
                      flex={1}
                      size="$3"
                      borderWidth={1}
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button size="$3" theme="accent" onPress={handleApplyCoupon}>
                      <Button.Text>Apply</Button.Text>
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

              <Elements
                stripe={getStripe()}
                options={{
                  appearance,
                  mode: 'payment',
                  currency: 'usd',
                  amount: Math.max(1, additionalSeats) * 10000,
                  paymentMethodCreation: 'manual',
                  paymentMethodTypes: ['card', 'link'],
                }}
              >
                <PaymentForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                  subscriptionId={store.subscriptionId}
                  additionalSeats={Math.max(1, additionalSeats)}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  couponId={finalCoupon?.id || ''}
                />
              </Elements>
            </YStack>
          )}
          <Dialog.Close asChild>
            <Button position="absolute" t="$2" r="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
