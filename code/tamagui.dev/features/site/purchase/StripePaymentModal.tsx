import { Dialog, XStack, YStack, Paragraph, Separator, H3, Button, Theme } from 'tamagui'
import {
  CardElement,
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js'
import type { StripeError, PaymentRequest } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { loadStripe } from '@stripe/stripe-js'
import { StripeElementsForm } from './StripeElements'
import { useEffect, useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

class PaymentModal {
  show = false
}

export const paymentModal = createStore(PaymentModal)
export const usePaymentModal = createUseStore(PaymentModal)

type StripePaymentModalProps = {
  yearlyTotal: number
  monthlyTotal: number
  disableAutoRenew: boolean
  chatSupport: boolean
  supportTier: number
  priceId: string
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
}

const PaymentForm = ({
  onSuccess,
  onError,
  autoRenew,
  chatSupport,
  supportTier,
  priceId,
  isProcessing,
  setIsProcessing,
  yearlyTotal,
  monthlyTotal,
}: {
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  autoRenew: boolean
  chatSupport: boolean
  supportTier: number
  priceId: string
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  yearlyTotal: number
  monthlyTotal: number
}) => {
  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)

  useEffect(() => {
    if (!stripe) return

    const initializePaymentRequest = async () => {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Tamagui Pro Subscription',
          amount: Math.ceil((yearlyTotal / 12 + monthlyTotal) * 100), // Convert to monthly and cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      // Check if the browser can make the payment
      const result = await pr.canMakePayment()

      if (result) {
        setPaymentRequest(pr)
      }

      // Setup payment handler
      pr.on('paymentmethod', async (e) => {
        setIsProcessing(true)
        try {
          // Create subscription with the payment method from Apple Pay
          const response = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentMethodId: e.paymentMethod.id,
              priceId,
              disableAutoRenew: !autoRenew,
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || 'Failed to create subscription')
          }

          // Complete the payment
          await e.complete('success')

          // Handle additional subscriptions if needed
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
        } catch (error) {
          await e.complete('fail')
          onError(error as Error)
        } finally {
          setIsProcessing(false)
        }
      })
    }

    initializePaymentRequest().catch(console.error)
  }, [stripe]) // Only re-run when stripe instance changes

  return (
    <YStack gap="$4">
      {paymentRequest && (
        <>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'buy',
                  theme: 'dark',
                  height: '48px',
                },
              },
            }}
          />
          <Separator />
          <Paragraph size="$3" o={0.5} ta="center">
            Or pay with card
          </Paragraph>
        </>
      )}
      <StripeElementsForm
        onSuccess={onSuccess}
        onError={onError}
        autoRenew={autoRenew}
        chatSupport={chatSupport}
        supportTier={supportTier}
        priceId={priceId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        buttonText="Complete purchase"
      />
    </YStack>
  )
}

export const StripePaymentModal = ({
  yearlyTotal,
  monthlyTotal,
  disableAutoRenew,
  chatSupport,
  supportTier,
  priceId,
  onSuccess,
  onError,
}: StripePaymentModalProps) => {
  const store = usePaymentModal()
  const [isProcessing, setIsProcessing] = useState(false)

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
          maw={1000}
          p="$6"
        >
          <XStack gap="$6">
            {/* 左側: Stripe支払いフォーム */}
            <YStack f={1} gap="$4">
              <H3>Payment details</H3>
              <Separator />
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onSuccess={(subscriptionId) => {
                    store.show = false
                    onSuccess(subscriptionId)
                  }}
                  onError={onError}
                  autoRenew={!disableAutoRenew}
                  chatSupport={chatSupport}
                  supportTier={supportTier}
                  priceId={priceId}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  yearlyTotal={yearlyTotal}
                  monthlyTotal={monthlyTotal}
                />
              </Elements>
            </YStack>

            {/* 右側: 注文サマリー */}
            <YStack f={1} gap="$4" backgroundColor="$color2" p="$4" br="$4">
              <H3>Order summary</H3>
              <Separator />

              <XStack jc="space-between">
                <Paragraph>Monthly subscription</Paragraph>
                <Paragraph>${Math.ceil(yearlyTotal / 12)}/month</Paragraph>
              </XStack>

              {monthlyTotal > 0 && (
                <>
                  {chatSupport && (
                    <XStack jc="space-between">
                      <Paragraph>Chat support</Paragraph>
                      <Paragraph>$100/month</Paragraph>
                    </XStack>
                  )}

                  {supportTier > 0 && (
                    <XStack jc="space-between">
                      <Paragraph>Support tier ({supportTier})</Paragraph>
                      <Paragraph>${supportTier * 800}/month</Paragraph>
                    </XStack>
                  )}
                </>
              )}

              <Separator />

              <XStack jc="space-between">
                <H3>Total</H3>
                <YStack ai="flex-end">
                  <H3>${Math.ceil(yearlyTotal / 12) + monthlyTotal}/month</H3>
                  {!disableAutoRenew && (
                    <Paragraph size="$3" o={0.8}>
                      Billed monthly
                    </Paragraph>
                  )}
                </YStack>
              </XStack>
            </YStack>
          </XStack>

          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
