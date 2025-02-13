import { useEffect, useState } from 'react'
import { loadStripe, type StripeError, type Appearance } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js'
import { Button, Paragraph, Spinner, YStack, Theme } from 'tamagui'
import { PurchaseButton } from './helpers'

const stripePromise = loadStripe(
  process.env.STRIPE_SECRET_KEY_LIVEY! ||
    'pk_test_51MlzkhAbFJBp9fF3vTNUO7QGC7hapWqnrcISDb5SPJa5I9VWVLIN2vamVCOsO4kkbHFm9mteyCS1qZjpHjcshRb100npI0m0cK'
)

type StripeElementsProps = {
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  autoRenew: boolean
  chatSupport: boolean
  supportTier: number
  priceId: string
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  buttonText: string
  onNext?: () => void
}

export const StripeElementsForm = (props: StripeElementsProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeElementsFormContent {...props} />
    </Elements>
  )
}

export const StripeElementsFormContent = ({
  onSuccess,
  onError,
  autoRenew,
  chatSupport,
  supportTier,
  priceId,
  isProcessing,
  setIsProcessing,
  buttonText,
  onNext,
}: StripeElementsProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async () => {
    if (buttonText === 'Next' && onNext) {
      onNext()
      return
    }

    setIsProcessing(true)

    try {
      // Create PaymentMethod first
      const cardElement = elements?.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: pmError, paymentMethod } = await stripe!.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })
      if (pmError) throw pmError

      // Create initial subscription with yearly plan
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId,
          disableAutoRenew: !autoRenew,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      setClientSecret(data.clientSecret)

      // If chat support or support tier is selected, upgrade the subscription
      if (chatSupport || supportTier > 0) {
        const upgradeRes = await fetch('/api/upgrade-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: data.subscriptionId,
            chatSupport,
            supportTier,
            disableAutoRenew: !autoRenew,
          }),
        })

        if (!upgradeRes.ok) {
          throw new Error('Failed to upgrade subscription')
        }
      }

      onSuccess(data.subscriptionId)
    } catch (err) {
      onError(err as Error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Theme name="accent">
      <CardElement />
      <PurchaseButton onPress={handleSubmit} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : buttonText}
      </PurchaseButton>
    </Theme>
  )
}
