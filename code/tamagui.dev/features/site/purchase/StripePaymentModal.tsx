import {
  Dialog,
  XStack,
  YStack,
  Paragraph,
  Separator,
  H3,
  Button,
  Theme,
  Spinner,
  useTheme,
  useThemeName,
} from 'tamagui'
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import type { StripeError, Appearance } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { useUser } from '~/features/user/useUser'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51MlzkhAbFJBp9fF3vTNUO7QGC7hapWqnrcISDb5SPJa5I9VWVLIN2vamVCOsO4kkbHFm9mteyCS1qZjpHjcshRb100npI0m0cK'
)

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
  selectedPrices: {
    proPriceId: string
    supportPriceIds: string[]
  }
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
}

const PaymentForm = ({
  onSuccess,
  onError,
  autoRenew,
  chatSupport,
  supportTier,
  selectedPrices,
  isProcessing,
  setIsProcessing,
  userData,
}: {
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  autoRenew: boolean
  chatSupport: boolean
  supportTier: number
  selectedPrices: {
    proPriceId: string
    supportPriceIds: string[]
  }
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  userData: any
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentMethod, setPaymentMethod] = useState<string>()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Submit the form first
      const { error: submitError } = await elements.submit()
      if (submitError) {
        onError(submitError)
        return
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          elements,
        })

      if (paymentMethodError) {
        onError(paymentMethodError)
        return
      }

      // Create subscription with the payment method
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          proPriceId: selectedPrices.proPriceId,
          supportPriceIds: selectedPrices.supportPriceIds,
          disableAutoRenew: !autoRenew,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // If we get here, the payment was successful
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
          <Button
            fontFamily="$mono"
            br="$10"
            als="flex-end"
            disabled={isProcessing || !stripe || !elements}
          >
            {isProcessing ? 'Processing...' : 'Complete purchase'}
          </Button>
        </Theme>
      </YStack>
    </form>
  )
}

export const StripePaymentModal = ({
  yearlyTotal,
  monthlyTotal,
  disableAutoRenew,
  chatSupport,
  supportTier,
  selectedPrices,
  onSuccess,
  onError,
}: StripePaymentModalProps) => {
  const store = usePaymentModal()
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: userData, isLoading, refresh } = useUser()
  const supabaseClient = useSupabaseClient()
  const [authInterval, setAuthInterval] = useState<NodeJS.Timeout | null>(null)

  const handleLogin = async () => {
    if (!supabaseClient) return

    // Open popup for GitHub auth
    const width = 600
    const height = 800
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    // Get the auth URL first
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      console.error('Login error:', error)
      return
    }

    // Open popup with the auth URL
    const popup = window.open(
      data.url,
      'Login with GitHub',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (popup) {
      // Poll for authentication status
      const interval = setInterval(async () => {
        if (popup.closed) {
          clearInterval(interval)
          return
        }

        const {
          data: { session },
        } = await supabaseClient.auth.getSession()
        if (session) {
          clearInterval(interval)
          popup.close()
          await refresh()
        }
      }, 1000)

      setAuthInterval(interval)
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (authInterval) {
        clearInterval(authInterval)
      }
    }
  }, [authInterval])

  const theme = useTheme()
  const themeName = useThemeName()

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

    return (
      <XStack gap="$6">
        <YStack f={1} gap="$4">
          <H3 ff="$mono">Payment details</H3>
          <Separator />
          <Elements
            stripe={stripePromise}
            options={{
              appearance,
              mode: 'payment',
              currency: 'usd',
              amount: Math.ceil((yearlyTotal / 12 + monthlyTotal) * 100),
              paymentMethodTypes: ['card', 'link'],
              payment_method_types: ['card', 'link'],
              paymentMethodCreation: 'manual',
            }}
          >
            <PaymentForm
              onSuccess={(subscriptionId) => {
                store.show = false
                onSuccess(subscriptionId)
              }}
              onError={onError}
              autoRenew={!disableAutoRenew}
              chatSupport={chatSupport}
              supportTier={supportTier}
              selectedPrices={selectedPrices}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              userData={userData}
            />
          </Elements>
        </YStack>

        <YStack f={1} gap="$4" backgroundColor="$color2" p="$4" br="$4">
          <H3 fontFamily="$mono">Order summary</H3>
          <Separator />

          <XStack jc="space-between">
            <Paragraph ff="$mono">Monthly subscription</Paragraph>
            <Paragraph ff="$mono">${Math.ceil(yearlyTotal / 12)}/month</Paragraph>
          </XStack>

          {monthlyTotal > 0 && (
            <>
              {chatSupport && (
                <XStack jc="space-between">
                  <Paragraph ff="$mono">Chat support</Paragraph>
                  <Paragraph ff="$mono">$100/month</Paragraph>
                </XStack>
              )}

              {supportTier > 0 && (
                <XStack jc="space-between">
                  <Paragraph ff="$mono">Support tier ({supportTier})</Paragraph>
                  <Paragraph ff="$mono">${supportTier * 800}/month</Paragraph>
                </XStack>
              )}
            </>
          )}

          <Separator />

          <XStack jc="space-between">
            <H3 ff="$mono">Total</H3>
            <YStack ai="flex-end">
              <H3 ff="$mono">${Math.ceil(yearlyTotal / 12) + monthlyTotal}/month</H3>
              {!disableAutoRenew && (
                <Paragraph ff="$mono" size="$3" o={0.8}>
                  Billed monthly
                </Paragraph>
              )}
            </YStack>
          </XStack>
        </YStack>
      </XStack>
    )
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
          maw={!userData?.user ? 500 : 1000}
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
