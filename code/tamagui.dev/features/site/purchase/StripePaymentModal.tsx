/**
 * @summary
 *
 * StripePaymentModal handles the payment flow for Pro plan, Team plan, and additional support options.
 *
 * Pro Plan Options:
 * - One-time payment: $400 - Currently disabled
 * - Yearly subscription: $240/year
 *    - This is processed as an invoice payment for one-time payment
 *    - For subscription, client-side confirmation is needed to verify card ownership
 *
 * Team Plan Options:
 * - Additional seats: $100/seat/year
 *    - Can only be added to subscription plans (No one-time payment for team seats)
 *    - Billed annually regardless of plan type
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
 *
 * Error Handling:
 * - If Pro plan succeeds but Support/Chat fails, the Pro plan is still activated
 * - This prevents customers from losing access to products they successfully paid for
 * - Failed add-ons can be purchased separately later from the account page
 */
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Appearance, StripeError } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Info, X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  H3,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Theme,
  Unspaced,
  useMedia,
  useTheme,
  useThemeName,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { z } from 'zod'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { useUser } from '~/features/user/useUser'
import type { UserSubscriptionStatus } from '~/shared/types/subscription'
import { sendEvent } from '../../analytics/sendEvent'
import { useLoginLink } from '../../auth/useLoginLink'
import { PoweredByStripeIcon } from './PoweredByStripeIcon'

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

// lazy load stripe only when needed
let stripePromise: ReturnType<typeof loadStripe> | null = null
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(key || '')
  }
  return stripePromise
}

// re-export from separate file to allow code splitting
export {
  paymentModal,
  usePaymentModal,
  V2_LICENSE_PRICE,
  V2_UPGRADE_PRICE,
  SUPPORT_TIERS,
  type SupportTier,
} from './paymentModalStore'

// also import for internal use
import {
  usePaymentModal,
  V2_LICENSE_PRICE,
  SUPPORT_TIERS,
  type SupportTier,
} from './paymentModalStore'
import { calculatePromoPrice } from './promoConfig'

type StripePaymentModalProps = {
  yearlyTotal: number
  monthlyTotal: number
  disableAutoRenew: boolean
  chatSupport: boolean
  supportTier: SupportTier
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
  subscriptionStatus,
  children,
  // V2 fields
  isV2,
  projectName,
  projectDomain,
  onProjectNameChange,
  onProjectDomainChange,
}: {
  onSuccess: (subscriptionId: string) => void
  onError: (error: Error | StripeError) => void
  autoRenew: boolean
  chatSupport: boolean
  supportTier: SupportTier
  teamSeats: number
  selectedPrices: {
    disableAutoRenew: boolean
    chatSupport: boolean
    supportTier: SupportTier
    teamSeats: number
  }
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  userData: any
  finalCoupon: Coupon | null
  subscriptionStatus: UserSubscriptionStatus
  children: React.ReactNode
  // V2 fields
  isV2: boolean
  projectName: string
  projectDomain: string
  onProjectNameChange: (value: string) => void
  onProjectDomainChange: (value: string) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<Error | StripeError | null>(null)

  // V2 validation - per-field errors
  const [showValidation, setShowValidation] = useState(false)

  const projectNameError = useMemo(() => {
    if (!isV2) return null
    if (!projectName || projectName.length <= 2)
      return 'Project name must be more than 2 characters'
    return null
  }, [isV2, projectName])

  const projectDomainError = useMemo(() => {
    if (!isV2) return null
    if (!projectDomain || projectDomain.length <= 2)
      return 'Domain must be more than 2 characters'
    return null
  }, [isV2, projectDomain])

  const v2ValidationError = projectNameError || projectDomainError

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    // V2 validation
    if (isV2 && v2ValidationError) {
      setShowValidation(true)
      const validationErr = new Error(v2ValidationError)
      setError(validationErr)
      onError(validationErr)
      return
    }

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

      let data: any = null

      // Only create Pro subscription if user doesn't already have PRO
      if (!subscriptionStatus.pro) {
        // V2 purchase flow
        if (isV2) {
          const response = await fetch('/api/create-v2-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentMethodId: paymentMethod.id,
              projectName,
              projectDomain,
              couponId: finalCoupon?.id,
              supportTier: selectedPrices.supportTier,
            }),
          })

          data = await response.json()

          if (!response.ok) {
            const error = new Error(data.error || JSON.stringify(data))
            setError(error)
            onError(error)
            return
          }

          // V2 purchase successful
          onSuccess(data.invoiceId)
          return
        }

        // Legacy V1 subscription/payment flow
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

        data = await response.json()

        if (!response.ok) {
          const error = new Error(JSON.stringify(data))
          setError(error)
          onError(error)
          return
        }

        // Confirm payment if needed for subscriptions
        // Payment confirmation is required when amount_due > 0 and clientSecret exists
        if (data.amount_due && data.amount_due > 0 && data.clientSecret) {
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
      }

      // If Chat or Support is selected, create additional subscription
      if (selectedPrices.chatSupport || selectedPrices.supportTier !== 'chat') {
        const upgradeResponse = await fetch('/api/upgrade-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            chatSupport: selectedPrices.chatSupport,
            supportTier: selectedPrices.supportTier,
            couponId: finalCoupon?.id,
          }),
        })

        const upgradeData = await upgradeResponse.json()
        if (!upgradeResponse.ok) {
          // Pro plan was created successfully, but additional options failed
          // Still give them access to Pro since they paid for it
          const upgradeError = upgradeData.error || 'Failed to add Support/Chat'
          const addonType = selectedPrices.chatSupport ? 'Chat Support' : 'Support Tier'

          console.error('Upgrade failed but Pro succeeded:', upgradeError)

          // Track this as a partial success
          sendEvent('purchase_partial_success', {
            pro_subscription: data?.id,
            failed_addon: selectedPrices.chatSupport ? 'chat' : 'support',
            error: upgradeError,
          })

          // Show a warning but still proceed with Pro subscription success
          // Note: Not setting error state here because we want to proceed to success
          console.warn(
            `Pro plan activated successfully, but couldn't add ${addonType}: ${upgradeError}`
          )

          // Continue to success with just the Pro subscription
          if (data?.id) {
            onSuccess(data.id)
          } else {
            onSuccess('upgraded a tier or chat support')
          }
          return
        }

        // Confirm monthly subscription payment if needed
        if (
          upgradeData.amount_due &&
          upgradeData.amount_due > 0 &&
          upgradeData.clientSecret
        ) {
          const monthlyResult = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
              payment_method: paymentMethod.id,
            },
            clientSecret: upgradeData.clientSecret,
          })

          if (monthlyResult.error) {
            // Monthly payment confirmation failed, but Pro is already active
            const addonType = selectedPrices.chatSupport ? 'Chat Support' : 'Support Tier'

            console.error(
              'Monthly payment confirmation failed but Pro succeeded:',
              monthlyResult.error
            )

            // Track this as a partial success
            sendEvent('purchase_partial_success', {
              pro_subscription: data?.id,
              failed_addon: selectedPrices.chatSupport ? 'chat' : 'support',
              error: monthlyResult.error.message,
            })

            // Show a warning but still proceed with Pro subscription success
            console.warn(
              `Pro plan activated successfully, but payment confirmation failed for ${addonType}`
            )

            // Continue to success with just the Pro subscription
            if (data?.id) {
              onSuccess(data.id)
            } else {
              onSuccess('upgraded a tier or chat support')
            }
            return
          }
        }
      }

      if (data?.id) {
        // if we actually created a Pro subscription
        onSuccess(data.id)
      } else {
        // if we didn't create a Pro subscription, we must have upgraded a tier
        onSuccess('upgraded a tier or chat support')
      }
    } catch (error) {
      setError(error as Error)
      onError(error as Error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          maxH="70vh"
          $maxMd={{
            maxH: '100%',
          }}
          py="$4"
        >
          {/* V2 Project Information Fields */}
          {isV2 && (
            <YStack gap="$4" mb="$4">
              <YStack gap="$2">
                <Paragraph fontFamily="$mono" fontWeight="600" size="$4">
                  Project Information
                </Paragraph>
                <Paragraph size="$3" color="$color9">
                  Enter your project name and primary domain. Your license covers this
                  domain plus iOS/Android apps.
                </Paragraph>
              </YStack>

              <YStack gap="$2">
                <Paragraph fontFamily="$mono" size="$3">
                  Project Name
                </Paragraph>
                <Input
                  placeholder="My Awesome App"
                  value={projectName}
                  onChangeText={onProjectNameChange}
                  fontFamily="$mono"
                  {...(showValidation &&
                    projectNameError && {
                      borderColor: '$red9',
                      borderWidth: 2,
                    })}
                />
                {showValidation && projectNameError && (
                  <Paragraph size="$2" color="$red10">
                    {projectNameError}
                  </Paragraph>
                )}
              </YStack>

              <YStack gap="$2">
                <Paragraph fontFamily="$mono" size="$3">
                  Domain
                </Paragraph>
                <Input
                  placeholder="myapp.com"
                  value={projectDomain}
                  onChangeText={onProjectDomainChange}
                  fontFamily="$mono"
                  {...(showValidation &&
                    projectDomainError && {
                      borderColor: '$red9',
                      borderWidth: 2,
                    })}
                />
                {showValidation && projectDomainError ? (
                  <Paragraph size="$2" color="$red10">
                    {projectDomainError}
                  </Paragraph>
                ) : (
                  <Paragraph size="$2" color="$color9">
                    Primary web domain for your project
                  </Paragraph>
                )}
              </YStack>

              <Separator my="$2" />
            </YStack>
          )}

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
        </View>
      </ScrollView>
      {children}
      <YStack
        gap="$2"
        $maxMd={{
          items: 'flex-end',
        }}
      >
        <XStack
          $maxMd={{
            flexDirection: 'column',
            items: 'flex-end',
            pt: '$4',
          }}
          justify="space-between"
          items="flex-start"
          gap="$2"
        >
          <PoweredByStripeIcon height={23} />

          <Theme name="accent">
            <YStack
              onPressOut={() => {
                sendEvent(`Pro: Complete Purchase`)
              }}
            >
              <Button
                render={<button type="submit" />}
                rounded="$10"
                self="flex-end"
                $maxMd={{
                  width: '100%',
                }}
                disabled={isProcessing || !stripe || !elements}
              >
                <Button.Text fontFamily="$mono">
                  {isProcessing ? 'Processing...' : 'Complete purchase'}
                </Button.Text>
              </Button>
            </YStack>
          </Theme>
        </XStack>

        {error && <ErrorMessage error={error} />}
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
  const { data: userData, isLoading, subscriptionStatus } = useUser()
  const supabaseClient = useSupabaseClient()
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [finalCoupon, setFinalCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const { handleLogin } = useLoginLink()

  // V2 project fields
  const [projectName, setProjectName] = useState(store.projectName || '')
  const [projectDomain, setProjectDomain] = useState(store.projectDomain || '')
  const isV2 = store.isV2 ?? true // Default to V2 for new purchases

  const theme = useTheme()
  const themeName = useThemeName()
  const { maxMd } = useMedia()

  // Use store values if available, otherwise use props
  const yearlyTotal = store.yearlyTotal || propYearlyTotal
  const monthlyTotal = store.monthlyTotal || propMonthlyTotal
  const disableAutoRenew = store.disableAutoRenew || propDisableAutoRenew
  const chatSupport = store.chatSupport || propChatSupport
  const supportTier = store.supportTier || propSupportTier
  const teamSeats = store.teamSeats || propTeamSeats

  // auto-apply prefilled coupon when modal opens
  useEffect(() => {
    if (store.show && store.prefilledCouponCode && !finalCoupon) {
      setCouponCode(store.prefilledCouponCode)
      // auto-validate the coupon
      const validateCoupon = async () => {
        try {
          const response = await fetch('/api/validate-coupon', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: store.prefilledCouponCode }),
          })

          const result = await response.json()
          const data = couponResponseSchema.parse(result)

          if (data.valid) {
            setFinalCoupon(data.coupon)
          }
        } catch (error) {
          // silently fail - user can still manually enter coupon
          console.error('Failed to auto-apply coupon:', error)
        }
      }
      validateCoupon()
    }
  }, [store.show, store.prefilledCouponCode])

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
        <YStack flex={1} items="center" justify="center" p="$4">
          <Spinner size="large" />
        </YStack>
      )
    }

    if (!userData?.user) {
      return (
        <YStack gap="$4" items="center" p="$4">
          <H3>Sign in to continue</H3>
          <Paragraph text="center">
            Please sign in with GitHub to continue your purchase.
          </Paragraph>

          <Button
            size="$4"
            theme="accent"
            onPress={handleLogin}
            icon={GithubIcon}
            disabled={!supabaseClient}
          >
            <Button.Text>Continue with GitHub</Button.Text>
          </Button>
        </YStack>
      )
    }

    const appearance: Appearance = {
      theme: themeName.startsWith('dark') ? 'night' : 'stripe',
      variables: {
        colorPrimary: theme.blue9?.val,
        colorBackground: theme.background?.val,
        colorText: theme.color?.val,
        colorDanger: theme.red9?.val,
        fontFamily: '"Berkeley Mono", system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        gridRowSpacing: '20px',
        gridColumnSpacing: '15px',
        borderRadius: '8px',
      },
    }

    // V2: $999 one-time, V1: legacy monthly + yearly
    const baseAmount = isV2
      ? V2_LICENSE_PRICE * 100
      : monthlyTotal * 100 + yearlyTotal * 100
    const amount = Math.ceil(
      calculateDiscountedAmount(baseAmount / 100, finalCoupon) * 100
    )

    const renderTotalView = () => {
      // V2 Order Summary
      if (isV2) {
        const discountedPrice = calculateDiscountedAmount(V2_LICENSE_PRICE, finalCoupon)
        return (
          <YStack flex={1} gap="$4" bg="$color2" p="$4" rounded="$4">
            <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
              Order summary
            </H3>
            <Separator />

            <XStack justify="space-between">
              <Paragraph fontFamily="$mono" lineHeight="$6">
                Tamagui Pro V2 License
              </Paragraph>
              <YStack items="flex-end">
                {finalCoupon && (
                  <Paragraph
                    fontFamily="$mono"
                    size="$3"
                    opacity={0.5}
                    textDecorationLine="line-through"
                  >
                    ${V2_LICENSE_PRICE.toLocaleString()}
                  </Paragraph>
                )}
                <Paragraph fontFamily="$mono">
                  ${Math.ceil(discountedPrice).toLocaleString()}
                </Paragraph>
              </YStack>
            </XStack>

            {supportTier !== 'chat' && (
              <XStack justify="space-between">
                <Paragraph fontFamily="$mono">
                  {SUPPORT_TIERS[supportTier].label} Support
                </Paragraph>
                <YStack items="flex-end">
                  {finalCoupon && (
                    <Paragraph
                      fontFamily="$mono"
                      size="$3"
                      opacity={0.5}
                      textDecorationLine="line-through"
                    >
                      ${SUPPORT_TIERS[supportTier].price.toLocaleString()}/mo
                    </Paragraph>
                  )}
                  <Paragraph fontFamily="$mono">
                    $
                    {Math.ceil(
                      calculateDiscountedAmount(
                        SUPPORT_TIERS[supportTier].price,
                        finalCoupon
                      )
                    ).toLocaleString()}
                    /mo
                  </Paragraph>
                </YStack>
              </XStack>
            )}

            <YStack gap="$2" bg="$color3" p="$3" rounded="$3">
              <Paragraph size="$3" fontFamily="$mono" fontWeight="600">
                What's included:
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                - All templates (v1 Takeout, v2 Takeout, Takeout Static)
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                - 1 year of updates included
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                - Unlimited team members
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                - Basic chat support included
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                - Lifetime rights to code
              </Paragraph>
            </YStack>

            <XStack justify="space-between" items="center">
              <Paragraph size="$3" color="$color9">
                After 1 year: $300/year for updates
              </Paragraph>
              <Paragraph size="$2" color="$color9">
                (auto-subscribed)
              </Paragraph>
            </XStack>

            <Separator />

            <XStack justify="space-between">
              <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
                Total
              </H3>
              <YStack items="flex-end">
                {finalCoupon && (
                  <Paragraph
                    fontFamily="$mono"
                    size="$3"
                    opacity={0.5}
                    textDecorationLine="line-through"
                  >
                    ${V2_LICENSE_PRICE.toLocaleString()}
                    {supportTier !== 'chat' &&
                      ` + $${SUPPORT_TIERS[supportTier].price.toLocaleString()}/mo`}
                  </Paragraph>
                )}
                <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
                  ${Math.ceil(discountedPrice).toLocaleString()}
                  {supportTier !== 'chat' &&
                    ` + $${Math.ceil(
                      calculateDiscountedAmount(
                        SUPPORT_TIERS[supportTier].price,
                        finalCoupon
                      )
                    ).toLocaleString()}/mo`}
                </H3>
              </YStack>
            </XStack>

            <YStack gap="$2">
              <SizableText
                color="$color10"
                opacity={0.3}
                cursor="pointer"
                hoverStyle={{ opacity: 0.8 }}
                $maxMd={{
                  fontSize: '$3',
                }}
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
                    onChange={(e) => {
                      const text = e.target?.value
                      setCouponCode(text)
                    }}
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

            <Theme name="red">
              <YStack
                bg="$color3"
                p="$3"
                rounded="$3"
                borderWidth={1}
                borderColor="$color6"
              >
                <Paragraph size="$2" fontWeight="600" color="$color11">
                  Sales are final. No refunds.
                </Paragraph>
              </YStack>
            </Theme>
          </YStack>
        )
      }

      // Legacy V1 Order Summary
      return (
        <YStack flex={1} gap="$4" bg="$color2" p="$4" rounded="$4">
          <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
            Order summary
          </H3>
          <Separator />

          {yearlyTotal > 0 && (
            <XStack justify="space-between">
              <Paragraph fontFamily="$mono" lineHeight="$6">
                Pro subscription
              </Paragraph>
              <YStack items="flex-end">
                {finalCoupon && (
                  <Paragraph
                    fontFamily="$mono"
                    size="$3"
                    opacity={0.5}
                    textDecorationLine="line-through"
                  >
                    ${Math.ceil(yearlyTotal / 12)}/month
                  </Paragraph>
                )}
                <Paragraph fontFamily="$mono">
                  ${Math.ceil(calculateDiscountedAmount(yearlyTotal / 12, finalCoupon))}
                  /month
                </Paragraph>
              </YStack>
            </XStack>
          )}

          {monthlyTotal > 0 && (
            <>
              {chatSupport && (
                <XStack justify="space-between">
                  <Paragraph fontFamily="$mono">Chat Support</Paragraph>
                  <YStack items="flex-end">
                    {finalCoupon && (
                      <Paragraph
                        fontFamily="$mono"
                        size="$3"
                        opacity={0.5}
                        textDecorationLine="line-through"
                      >
                        $200/month
                      </Paragraph>
                    )}
                    <Paragraph fontFamily="$mono">
                      ${Math.ceil(calculateDiscountedAmount(200, finalCoupon))}/month
                    </Paragraph>
                  </YStack>
                </XStack>
              )}
              {supportTier !== 'chat' && (
                <XStack justify="space-between">
                  <Paragraph fontFamily="$mono">
                    {SUPPORT_TIERS[supportTier].label} Support
                  </Paragraph>
                  <YStack items="flex-end">
                    {finalCoupon && (
                      <Paragraph
                        fontFamily="$mono"
                        size="$3"
                        opacity={0.5}
                        textDecorationLine="line-through"
                      >
                        ${SUPPORT_TIERS[supportTier].price}/month
                      </Paragraph>
                    )}
                    <Paragraph fontFamily="$mono">
                      $
                      {Math.ceil(
                        calculateDiscountedAmount(
                          SUPPORT_TIERS[supportTier].price,
                          finalCoupon
                        )
                      )}
                      /month
                    </Paragraph>
                  </YStack>
                </XStack>
              )}
            </>
          )}

          {teamSeats > 0 && (
            <XStack justify="space-between">
              <Paragraph fontFamily="$mono">
                Team Seats ({teamSeats} {teamSeats === 1 ? 'seat' : 'seats'})
              </Paragraph>
              <YStack items="flex-end">
                {finalCoupon && (
                  <Paragraph
                    fontFamily="$mono"
                    size="$3"
                    opacity={0.5}
                    textDecorationLine="line-through"
                  >
                    ${teamSeats * 100}/year
                  </Paragraph>
                )}
                <Paragraph fontFamily="$mono">
                  ${Math.ceil(calculateDiscountedAmount(teamSeats * 100, finalCoupon))}
                  /year
                </Paragraph>
              </YStack>
            </XStack>
          )}

          <Separator />

          <XStack justify="space-between">
            <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
              Total
            </H3>
            <YStack items="flex-end">
              {finalCoupon && (
                <Paragraph
                  $maxMd={{ fontSize: '$6' }}
                  fontFamily="$mono"
                  size="$3"
                  opacity={0.5}
                  textDecorationLine="line-through"
                >
                  ${yearlyTotal}
                  {monthlyTotal > 0 && ` + $${monthlyTotal}/month`}
                </Paragraph>
              )}

              <H3 $maxMd={{ fontSize: '$6' }} fontFamily="$mono">
                {yearlyTotal
                  ? `$${Math.ceil(calculateDiscountedAmount(yearlyTotal, finalCoupon))}`
                  : ''}
                {yearlyTotal && monthlyTotal ? ' + ' : ''}
                {monthlyTotal > 0 &&
                  `$${Math.ceil(calculateDiscountedAmount(monthlyTotal, finalCoupon))}/month`}
              </H3>
            </YStack>
          </XStack>
          <XStack gap="$2" items="center">
            <Info size={16} color="$color11" />
            <YStack flex={1}>
              <Paragraph py="$2" color="$color10" fontSize="$2">
                Pro subscription is billed yearly for the full amount up front.
              </Paragraph>
            </YStack>
          </XStack>
          <YStack gap="$2">
            <SizableText
              color="$color10"
              opacity={0.3}
              cursor="pointer"
              hoverStyle={{ opacity: 0.8 }}
              $maxMd={{
                fontSize: '$3',
              }}
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
                  onChange={(e) => {
                    const text = e.target?.value
                    setCouponCode(text)
                  }}
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
        </YStack>
      )
    }

    return (
      <View
        flexDirection="row"
        $maxMd={{
          flexDirection: 'column-reverse',
          p: '$6',
        }}
        flex={1}
        flexBasis="auto"
        gap="$6"
      >
        <YStack flex={1}>
          <View gap="$4">
            <H3 fontFamily="$mono">Payment details</H3>
            <Separator />
          </View>

          {amount > 0 && (
            <Elements
              stripe={getStripe()}
              options={{
                appearance,
                mode: 'payment',
                currency: 'usd',
                amount,
                paymentMethodTypes: ['card', 'link'],
                payment_method_types: ['card', 'link'],
                paymentMethodCreation: 'manual',
                ...(monthlyTotal > 0 && {
                  setup_future_usage: 'off_session',
                }),
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
                  supportTier,
                  teamSeats: Number(teamSeats),
                }}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                userData={userData}
                finalCoupon={finalCoupon}
                subscriptionStatus={subscriptionStatus}
                // V2 fields
                isV2={isV2}
                projectName={projectName}
                projectDomain={projectDomain}
                onProjectNameChange={setProjectName}
                onProjectDomainChange={setProjectDomain}
              >
                {maxMd && renderTotalView()}
              </PaymentForm>
            </Elements>
          )}
        </YStack>

        {!maxMd && renderTotalView()}
      </View>
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
      <Dialog.Adapt when="maxMd">
        <Sheet zIndex={1_000_001} modal dismissOnSnapToBottom transition="medium">
          <Sheet.Frame bg="$color1" p={0} gap="$4">
            <Sheet.ScrollView showsVerticalScrollIndicator={false}>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            bg="$shadow4"
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal zIndex={1_000_001}>
        <Dialog.Overlay
          key="overlay"
          transition="medium"
          bg="$shadow3"
          opacity={0.95}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          transition="quick"
          width="90%"
          maxW={1000}
          $maxMd={{
            maxW: '100%',
          }}
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

          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" t="$2" r="$2" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
