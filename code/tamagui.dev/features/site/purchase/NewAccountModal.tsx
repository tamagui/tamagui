import { LogOut } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  H3,
  Label,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Tabs,
  XStack,
  YStack,
} from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { createStore, createUseStore } from '@tamagui/use-store'
import { paymentModal } from './StripePaymentModal'
import { useProducts } from './useProducts'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'

class AccountModal {
  show = false
}

export const accountModal = createStore(AccountModal)
export const useAccountModal = createUseStore(AccountModal)

export const NewAccountModal = () => {
  const [mounted, setMounted] = useState(false)
  const store = useAccountModal()
  const { isLoading, data } = useUser()
  const [currentTab, setCurrentTab] = useState<'plan' | 'upgrade' | 'manage'>('plan')

  if (isLoading || !data) {
    return <Spinner my="$10" />
  }

  const { userDetails, user, subscriptions } = data
  const currentSubscription = subscriptions?.[0]

  return (
    <Dialog
      modal
      open={store.show}
      onOpenChange={(val) => {
        store.show = val
      }}
    >
      <Dialog.Adapt when="sm">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom animation="medium">
          <Sheet.Frame bg="$color3" padding={0} gap="$4">
            <Sheet.ScrollView>
              <Dialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Dialog.Adapt>

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
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          width="90%"
          maw={800}
          p="$8"
        >
          <YStack gap="$4" f={1}>
            <XStack gap="$4">
              <Avatar circular size="$10">
                <Avatar.Image
                  source={{
                    width: 104,
                    height: 104,
                    uri:
                      userDetails?.avatar_url ??
                      getDefaultAvatarImage(
                        userDetails?.full_name ?? user?.email ?? 'User'
                      ),
                  }}
                />
              </Avatar>

              <YStack gap="$3" ai="flex-start" jc="center" f={1}>
                <XStack jc="space-between" space ai="center">
                  <YStack f={1}>
                    <H3
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      {userDetails?.full_name}
                    </H3>
                    <Paragraph theme="alt1">{user?.email}</Paragraph>
                  </YStack>
                </XStack>
              </YStack>
            </XStack>

            <Separator />

            <Tabs
              value={currentTab}
              onValueChange={(val: any) => setCurrentTab(val)}
              orientation="horizontal"
              flexDirection="column"
              size="$6"
            >
              <Tabs.List disablePassBorderRadius>
                <YStack width={'33.3333%'} f={1}>
                  <Tab isActive={currentTab === 'plan'} value="plan">
                    Plan
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab isActive={currentTab === 'upgrade'} value="upgrade">
                    Upgrade
                  </Tab>
                </YStack>
                <YStack width={'33.3333%'} f={1}>
                  <Tab isActive={currentTab === 'manage'} value="manage">
                    Manage
                  </Tab>
                </YStack>
              </Tabs.List>

              <YStack f={1} p="$4">
                {currentTab === 'plan' && (
                  <PlanTab
                    subscription={currentSubscription}
                    setCurrentTab={setCurrentTab}
                  />
                )}
                {currentTab === 'upgrade' && (
                  <UpgradeTab subscription={currentSubscription} />
                )}
                {currentTab === 'manage' && (
                  <ManageTab subscription={currentSubscription} />
                )}
              </YStack>
            </Tabs>

            <Button
              onPress={() => {
                location.href = '/api/logout'
              }}
              icon={<LogOut />}
              size="$2"
              alignSelf="flex-end"
              accessibilityLabel="Logout"
            >
              Logout
            </Button>
          </YStack>

          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$3"
              circular
              icon={LogOut}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const Tab = ({
  children,
  isActive,
  ...props
}: {
  children: React.ReactNode
  isActive: boolean
  value: string
}) => {
  return (
    <Tabs.Tab
      unstyled
      ai="center"
      jc="center"
      ov="hidden"
      py="$1"
      bg="$color1"
      height={60}
      disableActiveTheme
      bbw={1}
      bbc="transparent"
      {...(!isActive && {
        bg: '$color2',
      })}
      {...props}
      value={props.value}
    >
      <YStack
        fullscreen
        pe="none"
        zi={-1}
        {...(isActive && {
          bg: '$color3',
        })}
        {...(!isActive && {
          bg: '$color1',
          o: 0.25,
          '$group-takeoutBody-hover': {
            o: 0.33,
          },
        })}
      />
      <Paragraph
        ff="$mono"
        size="$7"
        color={isActive ? '$color12' : '$color10'}
        fow={isActive ? 'bold' : 'normal'}
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  )
}

const ServiceCard = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) => {
  return (
    <YStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$4"
      p="$4"
      gap="$3"
      width={300}
    >
      <H3>{title}</H3>
      <Paragraph theme="alt1">{description}</Paragraph>
      <Button themeInverse onPress={onAction}>
        {actionLabel}
      </Button>
    </YStack>
  )
}

const PlanTab = ({
  subscription,
  setCurrentTab,
}: {
  subscription?: any
  setCurrentTab: (value: 'plan' | 'upgrade' | 'manage') => void
}) => {
  return (
    <YStack gap="$6">
      <YStack gap="$4">
        <H3>Current Access</H3>
        <XStack fw="wrap" gap="$4">
          <ServiceCard
            title="Tamagui Pro"
            description="Access to Takeout repository and updates"
            actionLabel={subscription ? 'View Repository' : 'Purchase'}
            onAction={() => {
              if (!subscription) {
                paymentModal.show = true
              } else {
                window.open('https://github.com/tamagui/tamagui-pro')
              }
            }}
          />
          <ServiceCard
            title="Bento UI"
            description="Download the Bento UI kit"
            actionLabel="Download"
            onAction={() => {
              // Add download logic
            }}
          />
        </XStack>
      </YStack>

      {subscription?.status === 'active' && (
        <YStack gap="$4">
          <H3>Support Services</H3>
          <XStack fw="wrap" gap="$4">
            <ServiceCard
              title="Discord Support"
              description="Access to private Discord support channels"
              actionLabel="Join Discord"
              onAction={() => {
                // Add Discord join logic
              }}
            />
            <ServiceCard
              title="Priority Support"
              description="Direct support and prioritized issue handling"
              actionLabel={subscription ? 'Contact Support' : 'Upgrade'}
              onAction={() => {
                setCurrentTab('upgrade')
              }}
            />
          </XStack>
        </YStack>
      )}
    </YStack>
  )
}

const UpgradeTab = ({ subscription }: { subscription?: any }) => {
  // Get current support tier from subscription if it exists
  const getCurrentSupportTier = () => {
    if (!subscription) return '0'
    const supportItem = subscription.subscription_items?.find(
      (item) => item.price?.product?.name === 'Tamagui Support'
    )
    if (!supportItem) return '0'
    const description = supportItem.price?.description
    if (!description) return '0'
    // Extract tier number from description like "Tier 1"
    const match = description.match(/Tier (\d)/)
    return match ? match[1] : '0'
  }

  const [supportTier, setSupportTier] = useState(getCurrentSupportTier())
  const currentTier = getCurrentSupportTier()

  const getActionLabel = () => {
    if (supportTier === currentTier) return 'Current Plan'
    return Number(supportTier) > Number(currentTier) ? 'Upgrade Plan' : 'Downgrade Plan'
  }

  return (
    <YStack gap="$6">
      <H3>Support Options</H3>
      <YStack gap="$4" p="$4">
        <SupportTabContent
          currentTier={currentTier}
          supportTier={supportTier}
          setSupportTier={setSupportTier}
        />

        <Button
          themeInverse
          onPress={() => {
            paymentModal.show = true
          }}
          disabled={supportTier === currentTier}
        >
          {getActionLabel()}
        </Button>
      </YStack>
    </YStack>
  )
}

const SupportTabContent = ({
  currentTier,
  supportTier,
  setSupportTier,
}: {
  currentTier: string
  supportTier: string
  setSupportTier: (value: string) => void
}) => {
  const tiers = [
    { value: '0', label: 'None', price: 0 },
    { value: '1', label: 'Tier 1', price: 800 },
    { value: '2', label: 'Tier 2', price: 1600 },
    { value: '3', label: 'Tier 3', price: 3000 },
  ]

  return (
    <YStack gap="$6">
      <Paragraph size="$5" lineHeight="$6" maw={500} o={0.8}>
        Each tier adds 2 hours of prioritized development each month, and puts your
        messages higher in our response queue.
      </Paragraph>

      <YStack gap="$4">
        {tiers.map((tier) => (
          <YStack
            key={tier.value}
            borderWidth={1}
            borderColor={supportTier === tier.value ? '$blue8' : '$color3'}
            backgroundColor={supportTier === tier.value ? '$blue2' : undefined}
            borderRadius="$4"
            p="$4"
            pressStyle={{
              scale: 0.98,
            }}
            cursor="pointer"
            opacity={currentTier === tier.value ? 1 : 0.8}
            onPress={() => setSupportTier(tier.value)}
          >
            <XStack jc="space-between" ai="center">
              <YStack gap="$2">
                <H3>{tier.label}</H3>
                <Paragraph theme="alt1">
                  {tier.price === 0 ? 'Basic Support' : `${tier.price}/month`}
                </Paragraph>
              </YStack>
              {currentTier === tier.value && (
                <Paragraph theme="blue">Current Plan</Paragraph>
              )}
            </XStack>
          </YStack>
        ))}
      </YStack>
    </YStack>
  )
}

const ManageTab = ({ subscription }: { subscription?: any }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { refresh } = useUser()
  const { data: products } = useProducts()

  if (!subscription) {
    return (
      <YStack gap="$4">
        <H3>No Active Subscription</H3>
        <Paragraph theme="alt1">
          You don't have an active subscription. Purchase a plan to get started.
        </Paragraph>
        <Button
          themeInverse
          onPress={() => {
            paymentModal.show = true
          }}
        >
          Purchase Plan
        </Button>
      </YStack>
    )
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
      })

      const data = await res.json()
      if (data.message) {
        alert(data.message)
        refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get subscription details
  const subscriptionItems = subscription.subscription_items || []
  const mainItem = subscriptionItems[0]
  const price = mainItem?.price
  const product = price?.product

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  return (
    <YStack gap="$6">
      <H3>Subscription Details</H3>
      <YStack gap="$4" p="$4" borderWidth={1} borderColor="$color3" borderRadius="$4">
        <XStack jc="space-between">
          <Paragraph>Plan</Paragraph>
          <Paragraph theme="blue">{product?.name}</Paragraph>
        </XStack>

        <XStack jc="space-between">
          <Paragraph>Status</Paragraph>
          <Paragraph
            textTransform="capitalize"
            color={
              subscription.status === 'active' || subscription.status === 'trialing'
                ? '$green9'
                : '$yellow9'
            }
          >
            {subscription.status === 'trialing' ? 'active' : subscription.status}
          </Paragraph>
        </XStack>

        <XStack jc="space-between">
          <Paragraph>Price</Paragraph>
          <Paragraph>
            {formatCurrency(price?.unit_amount || 0)}/{price?.interval}
          </Paragraph>
        </XStack>

        <XStack jc="space-between">
          <Paragraph>Billing Period</Paragraph>
          <YStack ai="flex-end">
            <Paragraph>
              {new Date(subscription.current_period_start).toLocaleDateString()} -
            </Paragraph>
            <Paragraph>
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </Paragraph>
          </YStack>
        </XStack>

        {subscription.cancel_at_period_end && (
          <YStack backgroundColor="$yellow2" p="$3" borderRadius="$4">
            <Paragraph theme="yellow">
              Your subscription will end on{' '}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </Paragraph>
          </YStack>
        )}

        {product?.description && (
          <YStack gap="$2" pt="$2">
            <Paragraph theme="alt1" size="$5">
              Includes:
            </Paragraph>
            <Paragraph theme="alt2" size="$4">
              {product.description}
            </Paragraph>
          </YStack>
        )}

        <Separator />

        <Button
          theme="red"
          disabled={isLoading || subscription.cancel_at_period_end}
          onPress={handleCancelSubscription}
        >
          {subscription.cancel_at_period_end
            ? 'Cancellation Scheduled'
            : 'Cancel Subscription'}
        </Button>
      </YStack>
    </YStack>
  )
}
