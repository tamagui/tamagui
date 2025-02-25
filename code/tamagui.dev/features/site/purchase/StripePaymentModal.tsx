import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Appearance, StripeError } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useEffect, useMemo, useState } from 'react'
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
} from 'tamagui'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { useUser } from '~/features/user/useUser'
import { z } from 'zod'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'

const stripeErrorSchema = z.object({
  code: z.string(),
  decline_code: z.string().optional(),
  doc_url: z.string(),
  message: z.string(),
  param: z.string(),
  request_log_url: z.string().optional(),
  type: z.string(),
})

type StripeErrorResponse = z.infer<typeof stripeErrorSchema>

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
  selectedPrices = {
    proPriceId: '',
    supportPriceIds: [] as string[],
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

      // Determine which API to call based on the selected prices
      let response
      if (selectedPrices.proPriceId) {
        // Creating new Pro subscription
        response = await fetch('/api/create-subscription', {
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
      } else {
        // Upgrading existing subscription with Support tier
        response = await fetch('/api/upgrade-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: userData.subscriptions[0].id, // Get current subscription ID
            chatSupport,
            supportTier,
            disableAutoRenew: !autoRenew,
          }),
        })
      }

      const data = await response.json()
      if (!response.ok) {
        const error = new Error(JSON.stringify(data))
        setError(error)
        onError(error)
        return
      }

      onSuccess(data.subscriptionId)
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
          <YStack alignItems="flex-end" gap="$2">
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
    selectedPrices: propSelectedPrices,
    onSuccess,
    onError,
  } = props
  const store = usePaymentModal()
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: userData, isLoading, refresh } = useUser()
  const supabaseClient = useSupabaseClient()
  const [authInterval, setAuthInterval] = useState<NodeJS.Timeout | null>(null)
  const [authURL, setAuthURL] = useState('')

  useEffect(() => {
    if (!supabaseClient) return
    if (isLoading) return
    if (!userData?.user) {
      supabaseClient.auth
        .signInWithOAuth({
          provider: 'github',
          options: {
            skipBrowserRedirect: true,
            redirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('supabase err:', error)
            return
          }
          if (data.url) {
            setAuthURL(data.url)
          }
        })
    }
  }, [supabaseClient, userData?.user])

  const handleLogin = async () => {
    if (!supabaseClient) return

    // Open popup for GitHub auth
    const width = 600
    const height = 800
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    // Open popup with the auth URL
    const popup = window.open(
      authURL,
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
          refresh()
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

  // Use store values if available, otherwise use props
  const yearlyTotal = store.yearlyTotal || propYearlyTotal
  const monthlyTotal = store.monthlyTotal || propMonthlyTotal
  const disableAutoRenew = store.disableAutoRenew || propDisableAutoRenew
  const chatSupport = store.chatSupport || propChatSupport
  const supportTier = store.supportTier || propSupportTier
  const selectedPrices = store.selectedPrices.proPriceId
    ? store.selectedPrices
    : propSelectedPrices

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

    const amount = Math.ceil(monthlyTotal * 100 + yearlyTotal * 100)

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
                selectedPrices={selectedPrices}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                userData={userData}
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
              <Paragraph textAlign="right" ff="$mono">
                {disableAutoRenew ? (
                  `$${Math.ceil(yearlyTotal)}`
                ) : (
                  <>
                    ${Math.ceil(yearlyTotal / 12)}/month
                    <br />
                    paid yearly
                  </>
                )}
              </Paragraph>
            </XStack>
          )}

          {monthlyTotal > 0 && (
            <>
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
              <H3 ff="$mono">${yearlyTotal}</H3>
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
