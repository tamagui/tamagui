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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CheckoutFormProps = {
  clientSecret: string
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  autoRenew?: boolean
  chatSupport?: boolean
  supportTier?: number
  priceId: string
}

const CheckoutForm = ({
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  autoRenew = true,
  chatSupport = false,
  supportTier = 0,
  priceId,
}: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create PaymentMethod
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })
      if (pmError) throw pmError

      // 2. Create annual subscription
      const annualRes = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId,
          disableAutoRenew: !autoRenew,
        }),
      })
      const annualData = await annualRes.json()
      if (!annualRes.ok) throw new Error(annualData.error)

      // 3. Create monthly subscription if needed
      if (chatSupport || supportTier > 0) {
        const upgradeRes = await fetch('/api/upgrade-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscriptionId: annualData.subscriptionId,
            chatSupport,
            supportTier,
            disableAutoRenew: !autoRenew,
          }),
        })
        const upgradeData = await upgradeRes.json()
        if (!upgradeRes.ok) throw new Error(upgradeData.error)
      }

      // Success - pass back the annual subscription ID
      onSuccess(annualData.subscriptionId)
    } catch (e) {
      const error = e as Error | StripeError
      setErrorMessage(error.message)
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlePayment()
  }

  return (
    <form onSubmit={handleSubmit}>
      <YStack gap="$4">
        <CardElement />
        {errorMessage && <Paragraph color="$red10">{errorMessage}</Paragraph>}
        <Button themeInverse disabled={!stripe || isProcessing} onPress={handlePayment}>
          {isProcessing ? <Spinner /> : 'Pay now'}
        </Button>
      </YStack>
    </form>
  )
}

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

export const StripeElementsForm = ({
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

  const handleSubmit = async () => {
    if (buttonText === 'Next' && onNext) {
      onNext()
      return
    }

    setIsProcessing(true)

    try {
      // Create initial subscription with yearly plan
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
      <PurchaseButton onPress={handleSubmit} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : buttonText}
      </PurchaseButton>
    </Theme>
  )
}
