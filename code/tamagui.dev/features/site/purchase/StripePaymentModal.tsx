import { Dialog, XStack, YStack, Paragraph, Separator, H3, Button, Theme } from 'tamagui'
import { CardElement, Elements } from '@stripe/react-stripe-js'
import type { StripeError } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { loadStripe } from '@stripe/stripe-js'
import { StripeElementsForm } from './StripeElements'
import { useState } from 'react'

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
                <StripeElementsForm
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
                  buttonText="Complete purchase"
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
