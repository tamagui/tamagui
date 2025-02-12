import { useEffect, useState } from 'react'
import { loadStripe, type StripeError, type Appearance } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button, Paragraph, Spinner, YStack } from 'tamagui'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CheckoutFormProps = {
  clientSecret: string
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
}

const CheckoutForm = ({
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
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
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message)
        onError(error)
      } else if (paymentIntent) {
        onSuccess(paymentIntent.id)
      }
    } catch (e) {
      setErrorMessage('An unexpected error occurred.')
      onError(e as Error)
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
        <PaymentElement />
        {errorMessage && <Paragraph color="$red10">{errorMessage}</Paragraph>}
        <Button themeInverse disabled={!stripe || isProcessing} onPress={handlePayment}>
          {isProcessing ? <Spinner /> : 'Pay now'}
        </Button>
      </YStack>
    </form>
  )
}

type StripeElementsProps = {
  clientSecret: string
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
}

export const StripeElementsForm = ({
  clientSecret,
  onSuccess,
  onError,
}: StripeElementsProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    } satisfies Appearance,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Elements>
  )
}
