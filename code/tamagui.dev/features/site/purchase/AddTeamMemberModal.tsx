import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Appearance, StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useState } from 'react'
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
  Select,
  Adapt,
  Sheet,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(key || '')

class AddTeamMemberModal {
  show = false
  subscriptionId = ''
}

export const addTeamMemberModal = createStore(AddTeamMemberModal)
export const useAddTeamMemberModal = createUseStore(AddTeamMemberModal)

const PaymentForm = ({
  onSuccess,
  onError,
  subscriptionId,
  additionalSeats,
  isProcessing,
  setIsProcessing,
}: {
  onSuccess: () => void
  onError: (error: Error | StripeError) => void
  subscriptionId: string
  additionalSeats: number
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
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

      const response = await fetch('/api/add-team-seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          subscriptionId,
          additionalSeats,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error)
      }

      if (data.type === 'subscription' && data.clientSecret) {
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
            fontFamily="$mono"
            br="$10"
            als="flex-end"
            disabled={isProcessing || !stripe || !elements}
          >
            {isProcessing ? 'Processing...' : 'Add Seats'}
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
  const { data: userData, isLoading, refresh } = useUser()
  const theme = useTheme()
  const themeName = useThemeName()

  const appearance: Appearance = {
    theme: themeName.startsWith('dark') ? 'night' : 'stripe',
    variables: {
      colorPrimary: theme.blue9.val,
      colorBackground: theme.background.val,
      colorText: theme.color.val,
      colorDanger: theme.red9.val,
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
          animation="medium"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation="quick"
          w="90%"
          maw={600}
          p="$6"
        >
          {isLoading ? (
            <YStack f={1} ai="center" jc="center">
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
                  onChangeText={(text) => {
                    const num = Number(text.replace(/^0+/, '')) || 1
                    setAdditionalSeats(num)
                  }}
                  keyboardType="numeric"
                  width={200}
                />
                <Paragraph theme="alt2">
                  Cost: ${additionalSeats * 100}/year per seat
                </Paragraph>
              </YStack>

              <Elements
                stripe={stripePromise}
                options={{
                  appearance,
                  mode: 'payment',
                  currency: 'usd',
                  amount: Math.max(1, additionalSeats) * 10000,
                }}
              >
                <PaymentForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                  subscriptionId={store.subscriptionId}
                  additionalSeats={Math.max(1, additionalSeats)}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </Elements>
            </YStack>
          )}
          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
