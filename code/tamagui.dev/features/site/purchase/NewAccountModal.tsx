import { LogOut, Search, X } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { createStore, createUseStore } from '@tamagui/use-store'
import { router } from 'one'
import { useState } from 'react'
import useSWR from 'swr'
import {
  Avatar,
  Button,
  Configuration,
  Dialog,
  H3,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  Tabs,
  XStack,
  YStack,
  View,
} from 'tamagui'
import { PRODUCT_NAME, type UserContextType } from '~/features/auth/types'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'
import { paymentModal } from './StripePaymentModal'
import { useProducts } from './useProducts'
import { AddTeamMemberModalComponent, addTeamMemberModal } from './AddTeamMemberModal'
import { useClipboard } from '~/hooks/useClipboard'
import { DiscordPanel } from './DiscordPanel'
import { TeamTab } from './TeamTab'
class AccountModal {
  show = false
}

type Subscription = NonNullable<UserContextType['subscriptions']>[number]

export const accountModal = createStore(AccountModal)
export const useAccountModal = createUseStore(AccountModal)

type TabName = 'plan' | 'upgrade' | 'manage' | 'team'

export const NewAccountModal = () => {
  const store = useAccountModal()

  return (
    <>
      <Dialog
        modal
        open={store.show}
        onOpenChange={(val) => {
          store.show = val
        }}
      >
        <Dialog.Adapt when="maxMd">
          <Sheet modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame bg="$background" padding={0} gap="$4">
              <Sheet.ScrollView>
                <Dialog.Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              bg="$shadow6"
              opacity={1}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Dialog.Adapt>

        <Dialog.Portal>
          <Configuration animationDriver={animationsCSS}>
            <Dialog.Overlay
              key="overlay"
              animation="medium"
              bg="$shadow3"
              backdropFilter="blur(20px)"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Configuration>

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
            enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.95 }}
            exitStyle={{ x: 0, y: 5, opacity: 0, scale: 0.95 }}
            width="90%"
            maw={800}
            p={0}
            br="$4"
            ov="hidden"
            height="85%"
            maxHeight="calc(min(85vh, 800px))"
            minHeight={500}
          >
            <AccountView />

            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$3"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      <AddTeamMemberModalComponent />
    </>
  )
}

export const AccountView = () => {
  const { isLoading, data } = useUser()

  const [currentTab, setCurrentTab] = useState<TabName>('plan')

  if (isLoading || !data) {
    return null
  }

  const { subscriptions } = data

  // Get active subscriptions
  const activeSubscriptions = subscriptions?.filter(
    (sub) => sub.status === 'active' || sub.status === 'trialing'
  )

  // Find Pro subscription
  const proSubscription = activeSubscriptions?.find((sub) =>
    sub.subscription_items?.some((item) => item.price?.product?.name === 'Tamagui Pro')
  ) as Subscription

  const user = data.user
  const isTeamMember = user?.id && user.id !== proSubscription?.user_id

  // Find Support subscription
  const supportSubscription = activeSubscriptions?.find((sub) =>
    sub.subscription_items?.some(
      (item) => item.price?.product?.name === PRODUCT_NAME.TAMAGUI_SUPPORT
    )
  )

  const isTeamAdmin = activeSubscriptions?.some((sub) =>
    sub.subscription_items?.some(
      (item) => item.price?.product?.name === 'Tamagui Pro Team Seats'
    )
  )

  const renderTabs = () => {
    switch (currentTab) {
      case 'plan':
        return (
          <PlanTab
            subscription={proSubscription!}
            supportSubscription={supportSubscription!}
            setCurrentTab={setCurrentTab}
            isTeamMember={!!isTeamMember}
          />
        )

      case 'upgrade':
        return <UpgradeTab />

      case 'manage':
        return <ManageTab subscription={proSubscription} isTeamMember={!!isTeamMember} />

      case 'team':
        return <TeamTab />

      default:
        return null
    }
  }

  return (
    <YStack f={1}>
      <Tabs
        flex={1}
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
          {!isTeamMember ? (
            <YStack width={'33.3333%'} f={1}>
              <Tab isActive={currentTab === 'upgrade'} value="upgrade">
                Upgrade
              </Tab>
            </YStack>
          ) : null}
          <YStack width={'33.3333%'} f={1}>
            <Tab isActive={currentTab === 'manage'} value="manage">
              Manage
            </Tab>
          </YStack>
          {isTeamAdmin && (
            <YStack width={'33.3333%'} f={1}>
              <Tab isActive={currentTab === 'team'} value="team">
                Team
              </Tab>
            </YStack>
          )}
        </Tabs.List>

        <YStack overflow="hidden" f={1}>
          <ScrollView>
            <YStack p="$6">{renderTabs()}</YStack>
          </ScrollView>
        </YStack>
      </Tabs>

      <Separator />

      <AccountHeader />
    </YStack>
  )
}

const AccountHeader = () => {
  const { isLoading, data } = useUser()

  if (isLoading || !data) {
    return null
  }
  const { userDetails, user } = data

  return (
    <XStack gap="$4" p="$5" pb="$8">
      <Avatar circular size="$5">
        <Avatar.Image
          source={{
            width: 50,
            height: 50,
            uri:
              userDetails?.avatar_url ??
              getDefaultAvatarImage(userDetails?.full_name ?? user?.email ?? 'User'),
          }}
        />
      </Avatar>

      <YStack gap="$3" ai="flex-start" jc="center" f={1}>
        <XStack jc="space-between" space ai="center">
          <YStack f={1}>
            <H3
              mt={-5}
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
    </XStack>
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
  secondAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  secondAction?: null | {
    label: string
    onPress: () => void
  }
}) => {
  return (
    <YStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$6"
      p="$4"
      gap="$2"
      width={300}
      flex={1}
    >
      <H3 fontFamily="$mono" size="$6">
        {title}
      </H3>
      <Paragraph theme="alt1">{description}</Paragraph>

      <XStack gap="$3">
        <Button
          br="$10"
          als="flex-end"
          mt="$4"
          size="$3"
          theme="accent"
          onPress={onAction}
        >
          {actionLabel}
        </Button>

        {!!secondAction && (
          <Button
            br="$10"
            als="flex-end"
            mt="$4"
            size="$3"
            theme="accent"
            onPress={secondAction.onPress}
          >
            {secondAction.label}
          </Button>
        )}
      </XStack>
    </YStack>
  )
}

const DiscordAccessDialog = ({
  subscription,
  onClose,
}: {
  subscription: Subscription
  onClose: () => void
}) => {
  return (
    <Dialog modal open onOpenChange={onClose}>
      <Dialog.Portal zIndex={999999}>
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
          <DiscordPanel subscription={subscription} />
          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const PlanTab = ({
  subscription,
  supportSubscription,
  setCurrentTab,
  isTeamMember,
}: {
  subscription?: Subscription
  supportSubscription?: Subscription
  setCurrentTab: (value: 'plan' | 'upgrade' | 'manage' | 'team') => void
  isTeamMember: boolean
}) => {
  const [showDiscordAccess, setShowDiscordAccess] = useState(false)
  const { data: products } = useProducts()
  const [isGrantingAccess, setIsGrantingAccess] = useState(false)

  const handleTakeoutAccess = async () => {
    if (!subscription || !products) return

    const takeoutProduct = products.pro
    if (!takeoutProduct) {
      alert('Product information not found')
      return
    }

    setIsGrantingAccess(true)

    try {
      const res = await fetch(`/api/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
          product_id: takeoutProduct.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || `Error: ${res.status} ${res.statusText}`)
      } else {
        if (data.url) {
          window.location.href = data.url
        } else if (data.message) {
          alert(data.message)
        }
      }
    } finally {
      setIsGrantingAccess(false)
    }
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        <XStack fw="wrap" gap="$3">
          <ServiceCard
            title="Takeout"
            description="Access to repository and updates."
            actionLabel={
              subscription
                ? isGrantingAccess
                  ? 'Granting Access...'
                  : 'View Repository'
                : 'Purchase'
            }
            onAction={() => {
              if (!subscription) {
                paymentModal.show = true
              } else {
                handleTakeoutAccess()
              }
            }}
          />

          <BentoCard subscription={subscription as Subscription} />

          <ServiceCard
            title="Discord Access"
            description="Manage your Discord server access and invites."
            actionLabel={subscription ? 'Manage Access' : 'Purchase'}
            onAction={() => {
              if (!subscription) {
                // Unreachable but just in case
                paymentModal.show = true
              } else {
                setShowDiscordAccess(true)
              }
            }}
          />

          <ServiceCard
            title="Theme AI"
            description="Prompt an LLM to generate themes."
            actionLabel="Go"
            onAction={() => {
              accountModal.show = false
              setTimeout(() => {
                router.navigate('/theme')
              })
            }}
          />

          <ChatAccessCard />
          {!isTeamMember ? (
            <ServiceCard
              title="Add Members"
              description="Add members to your Pro plan."
              actionLabel="Add Seats"
              onAction={() => {
                if (!subscription) {
                  paymentModal.show = true
                  paymentModal.teamSeats = 1
                } else {
                  addTeamMemberModal.subscriptionId = subscription.id
                  addTeamMemberModal.show = true
                }
              }}
            />
          ) : (
            <View flex={1} w={300} />
          )}
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
                setShowDiscordAccess(true)
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

      {showDiscordAccess && subscription && (
        <DiscordAccessDialog
          subscription={supportSubscription || subscription}
          onClose={() => setShowDiscordAccess(false)}
        />
      )}
    </YStack>
  )
}

const ChatAccessCard = () => {
  const chatAccess = useSWR<any>(
    `/api/start-chat`,
    (url) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json()),
    { revalidateOnFocus: false, revalidateOnReconnect: false, errorRetryCount: 0 }
  )

  return (
    <ServiceCard
      title="Chat"
      description={
        chatAccess.data?.success
          ? `You're signed up! Go chat!`
          : 'First, register. Click the user icon, signup with Github, then come back here and authorize.'
      }
      actionLabel={
        chatAccess.isLoading
          ? 'Checking access...'
          : chatAccess.data?.success
            ? 'Open ➤'
            : 'First: Register ➤'
      }
      onAction={() => {
        if (chatAccess.isLoading) {
          alert(`Still loading chat access...`)
          return
        }
        if (chatAccess.data?.success) {
          window.open(`https://start.chat/tamagui/q0upl90r4xd`)
          return
        }
        window.open(`https://start.chat/tamagui`)
      }}
      secondAction={
        chatAccess.isLoading || chatAccess.data?.success
          ? null
          : {
              label: `Second: Authorize`,
              onPress() {
                chatAccess.mutate()
              },
            }
      }
    />
  )
}

const UpgradeTab = () => {
  const { subscriptionStatus } = useUser()

  const [supportTier, setSupportTier] = useState(subscriptionStatus.supportTier)
  const currentTier = subscriptionStatus.supportTier

  const getActionLabel = () => {
    if (supportTier === currentTier) return 'Current Plan'
    return Number(supportTier) > Number(currentTier) ? 'Upgrade Plan' : 'Downgrade Plan'
  }

  const handleUpgrade = () => {
    // Calculate the monthly total based on support tier
    const monthlyTotal = Number(supportTier) * 800

    // Set payment modal properties
    paymentModal.show = true
    paymentModal.yearlyTotal = 0 // No yearly component for support upgrade
    paymentModal.monthlyTotal = monthlyTotal
    paymentModal.disableAutoRenew = false // Support is always monthly
    paymentModal.chatSupport = false
    paymentModal.supportTier = Number(supportTier)
  }

  return (
    <YStack gap="$6">
      <SupportTabContent
        currentTier={currentTier.toString()}
        supportTier={supportTier.toString()}
        setSupportTier={(value) => setSupportTier(Number(value))}
      />

      <Button
        fontFamily="$mono"
        theme="accent"
        br="$10"
        als="flex-end"
        onPress={handleUpgrade}
        disabled={supportTier === currentTier}
      >
        {getActionLabel()}
      </Button>

      <Separator />

      <Paragraph ff="$mono" size="$5" lineHeight="$6" o={0.8}>
        Each tier adds 4 hours of development a month, faster response times, and 4
        additional private chat invites.
      </Paragraph>
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

  const formatCurrency = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        {tiers.map((tier) => (
          <YStack
            key={tier.value}
            borderWidth={1}
            theme={supportTier === tier.value ? 'accent' : null}
            borderRadius="$4"
            borderColor="$color4"
            p="$4"
            bg="$color1"
            cursor="pointer"
            onPress={() => setSupportTier(tier.value)}
          >
            <XStack jc="space-between" ai="center">
              <YStack gap="$1">
                <H3 fontFamily="$mono" size="$6">
                  {tier.label}
                </H3>
                <Paragraph theme="alt1">
                  {tier.price === 0
                    ? 'Basic Support'
                    : `${formatCurrency(tier.price)}/month`}
                </Paragraph>
              </YStack>
              {currentTier === tier.value && <Paragraph>Current Plan</Paragraph>}
            </XStack>
          </YStack>
        ))}
      </YStack>
    </YStack>
  )
}

const ManageTab = ({
  subscription,
  isTeamMember,
}: {
  subscription?: Subscription
  isTeamMember: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { refresh, data } = useUser()

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

  // Get subscription details
  const subscriptionItems = subscription?.subscription_items || []
  const mainItem = subscriptionItems[0]
  const price = mainItem?.price
  const product = price?.product

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  return (
    <YStack gap="$6">
      <View>
        <H3>Subscription Details</H3>
        {isTeamMember && <Paragraph color="$green9">You are a member</Paragraph>}
      </View>
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
          <Paragraph flex={1}>Billing Period</Paragraph>
          <YStack ai="flex-end">
            <Paragraph>
              {new Date(subscription.current_period_start).toLocaleDateString()} -
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
            <Paragraph>Includes:</Paragraph>
            <Paragraph theme="alt2" size="$4">
              {product.description}
            </Paragraph>
          </YStack>
        )}

        {!isTeamMember ? (
          <>
            <Separator />

            <Button
              theme="red"
              disabled={isLoading || !!subscription.cancel_at_period_end}
              onPress={handleCancelSubscription}
            >
              {subscription.cancel_at_period_end
                ? 'Cancellation Scheduled'
                : 'Cancel Subscription'}
            </Button>
          </>
        ) : null}
      </YStack>
    </YStack>
  )
}

const BentoCard = ({ subscription }: { subscription?: Subscription }) => {
  const supabase = useSupabaseClient()
  const { onCopy, hasCopied } = useClipboard()

  const { data, isLoading, mutate } = useSWR(
    '/api/bento/cli/login',
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch access token')
      }
      return response.json()
    },
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  // console.log('data', isLoading, data)

  const handleBentoDownload = async () => {
    if (!supabase) {
      alert('Authentication required')
      return
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to download Bento components')
        return
      }

      const response = await fetch('/api/bento/zip-download', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to download Bento components')
      }

      // Create a blob from the response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bento-bundle.zip'
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to download Bento components. Please try again later.')
    }
  }

  const onCopyCode = async () => {
    if (hasCopied || isLoading) return

    const token = data?.accessToken
    if (typeof token === 'string') {
      onCopy(token)
    } else {
      const res = await mutate()
      const token = res?.accessToken
      if (typeof token === 'string') onCopy(token)
    }
  }

  return (
    <ServiceCard
      title="Bento"
      description="Download the entire suite of Bento components."
      actionLabel="Download"
      onAction={handleBentoDownload}
      secondAction={
        subscription
          ? {
              label: hasCopied ? 'Copied' : isLoading ? 'Loading...' : `Copy Code`,
              onPress: onCopyCode,
            }
          : null
      }
    />
  )
}
