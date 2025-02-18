import { LogOut, Search, X } from '@tamagui/lucide-icons'
import { createStore, createUseStore } from '@tamagui/use-store'
import { useState } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  Form,
  H3,
  H4,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  Spacer,
  Tabs,
  XStack,
  YStack,
  Fieldset,
} from 'tamagui'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'
import { paymentModal } from './StripePaymentModal'
import { useProducts } from './useProducts'
import { BigP } from './BigP'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import type {
  APIGuildMember,
  RESTGetAPIGuildMembersSearchResult,
} from 'discord-api-types/v10'
import { Link } from 'one'

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
    return null
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

              <YStack overflow="hidden" f={1}>
                <ScrollView>
                  <YStack p="$6">
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
                </ScrollView>
              </YStack>
            </Tabs>

            <Separator />

            <AccountHeader />
          </YStack>

          <Dialog.Close asChild>
            <Button position="absolute" top="$3" right="$3" size="$3" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const AccountHeader = () => {
  const { isLoading, data } = useUser()

  if (isLoading || !data) {
    return null
  }
  const { userDetails, user } = data

  return (
    <XStack pb="$4" gap="$4" p="$5">
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

      <Button br="$10" als="flex-end" mt="$4" size="$3" theme="accent" onPress={onAction}>
        {actionLabel}
      </Button>
    </YStack>
  )
}

const DiscordAccessDialog = ({
  subscription,
  onClose,
}: { subscription: any; onClose: () => void }) => {
  return (
    <Dialog modal open onOpenChange={onClose}>
      <Dialog.Portal zIndex={100_000}>
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
          <DiscordPanel subscriptionId={subscription.id} />
          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const DiscordPanel = ({ subscriptionId }: { subscriptionId: string }) => {
  const [activeApi, setActiveApi] = useState<'channel' | 'support'>('channel')
  const groupInfoSwr = useSWR<any>(
    `/api/discord/${activeApi}?${new URLSearchParams({ subscription_id: subscriptionId })}`,
    (url) =>
      fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
        res.json()
      ),
    { revalidateOnFocus: false, revalidateOnReconnect: false, errorRetryCount: 0 }
  )
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState(draftQuery)
  const searchSwr = useSWR<RESTGetAPIGuildMembersSearchResult>(
    query
      ? `/api/discord/search-member?${new URLSearchParams({ query }).toString()}`
      : null,
    (url) =>
      fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
        res.json()
      )
  )

  const resetChannelMutation = useSWRMutation(
    [`/api/discord/${activeApi}`, 'DELETE', subscriptionId],
    (url) =>
      fetch(`/api/discord/${activeApi}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
        }),
      }).then((res) => res.json()),
    {
      onSuccess: async () => {
        await mutate(
          `/api/discord/${activeApi}?${new URLSearchParams({
            subscription_id: subscriptionId,
          })}`
        )
        setDraftQuery('')
        setQuery('')
      },
    }
  )

  const handleSearch = async () => {
    setQuery(draftQuery)
  }

  // Get subscription details to determine available access types
  const { data: subscriptionData } = useSWR<any>(
    subscriptionId ? `/api/products?subscription_id=${subscriptionId}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  const hasSupportTier = subscriptionData?.subscription?.subscription_items?.some(
    (item: any) => item.prices?.[0]?.products?.[0]?.name === 'Tamagui Support'
  )

  const SearchForm = () => (
    <>
      <Form onSubmit={handleSearch} gap="$2" flexDirection="row" ai="flex-end">
        <Fieldset>
          <Label size="$3" theme="alt1" htmlFor="discord-username">
            Username / Nickname
          </Label>
          <Input
            miw={200}
            placeholder="Your username..."
            id="discord-username"
            value={draftQuery}
            onChangeText={setDraftQuery}
          />
        </Fieldset>

        <Form.Trigger>
          <Button icon={Search}>Search</Button>
        </Form.Trigger>
      </Form>

      <XStack tag="article">
        <Paragraph size="$3" theme="alt1">
          Note: You must{' '}
          <Link target="_blank" href="https://discord.gg/4qh6tdcVDa">
            join the Discord server
          </Link>{' '}
          first so we can find your username.
        </Paragraph>
      </XStack>

      <YStack gap="$2">
        {searchSwr.data?.map((member) => (
          <DiscordMember
            key={member.user?.id}
            member={member}
            subscriptionId={subscriptionId}
            apiType={activeApi}
          />
        ))}
      </YStack>
    </>
  )

  return (
    <YStack gap="$3">
      <XStack jc="space-between" gap="$2" ai="center">
        <H4>
          Discord Access{' '}
          {!!groupInfoSwr.data &&
            `(${groupInfoSwr.data?.currentlyOccupiedSeats}/${groupInfoSwr.data?.discordSeats})`}
        </H4>

        <Button
          size="$2"
          onPress={() => resetChannelMutation.trigger()}
          disabled={resetChannelMutation.isMutating}
        >
          {resetChannelMutation.isMutating ? 'Resetting...' : 'Reset'}
        </Button>
      </XStack>

      <Tabs
        value={activeApi}
        onValueChange={(val: 'channel' | 'support') => setActiveApi(val)}
        orientation="horizontal"
        flexDirection="column"
        size="$4"
      >
        <Tabs.List mb="$4">
          <Tabs.Tab value="channel" f={1}>
            <Paragraph>General Channel</Paragraph>
          </Tabs.Tab>
          <Tabs.Tab value="support" f={1}>
            <Paragraph>Support Channel</Paragraph>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Content value="channel">
          <YStack gap="$4">
            <Paragraph theme="alt2">
              Join the #takeout-general channel to discuss Tamagui with other Pro users.
            </Paragraph>
            <SearchForm />
          </YStack>
        </Tabs.Content>

        <Tabs.Content value="support">
          <YStack gap="$4">
            {hasSupportTier ? (
              <>
                <Paragraph theme="alt2">
                  Get access to your private support channel where you can directly
                  communicate with the Tamagui team.
                </Paragraph>
                <SearchForm />
              </>
            ) : (
              <YStack gap="$4" p="$4" backgroundColor="$color2" br="$4">
                <Paragraph theme="alt2" ta="center">
                  You need a Support tier subscription to access private support channels.
                </Paragraph>
              </YStack>
            )}
          </YStack>
        </Tabs.Content>
      </Tabs>
    </YStack>
  )
}

const DiscordMember = ({
  member,
  subscriptionId,
  apiType,
}: {
  member: APIGuildMember
  subscriptionId: string
  apiType: 'channel' | 'support'
}) => {
  const { data, error, isMutating, trigger } = useSWRMutation(
    [`/api/discord/${apiType}`, 'POST', member.user?.id],
    async () => {
      const res = await fetch(`/api/discord/${apiType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          discord_id: member.user?.id,
        }),
      })

      if (res.status < 200 || res.status > 299) {
        throw await res.json()
      }
      return await res.json()
    },
    {
      onSuccess: async () => {
        await mutate(
          `/api/discord/${apiType}?${new URLSearchParams({
            subscription_id: subscriptionId,
          })}`
        )
      },
    }
  )

  const name = member.nick || member.user?.global_name
  const username = `${member.user?.username}${
    member.user?.discriminator !== '0' ? `#${member.user?.discriminator}` : ''
  }`
  const avatarSrc = member.user?.avatar
    ? `https://cdn.discordapp.com/avatars/${member.user?.id}/${member.user?.avatar}.png`
    : null

  return (
    <XStack gap="$2" ai="center" flexWrap="wrap">
      <Button minWidth={70} size="$2" disabled={isMutating} onPress={() => trigger()}>
        {isMutating ? 'Inviting...' : 'Add'}
      </Button>
      <Avatar circular size="$2">
        <Avatar.Image accessibilityLabel={`avatar for ${username}`} src={avatarSrc!} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
      <Paragraph>{`${username}${name ? ` (${name})` : ''}`}</Paragraph>
      {data && (
        <Paragraph size="$1" theme="green">
          {data.message}
        </Paragraph>
      )}
      {error && (
        <Paragraph size="$1" theme="red">
          {error.message}
        </Paragraph>
      )}
    </XStack>
  )
}

const PlanTab = ({
  subscription,
  setCurrentTab,
}: {
  subscription?: any
  setCurrentTab: (value: 'plan' | 'upgrade' | 'manage') => void
}) => {
  const supabase = useSupabaseClient()
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

          <ServiceCard
            title="Bento"
            description="Download the entire suite of Bento components."
            actionLabel="Download"
            onAction={handleBentoDownload}
          />

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
              // Add download logic
            }}
          />

          <ServiceCard
            title="start.chat"
            description="Talk to a chatbot that's an expert in Tamagui."
            actionLabel="Go"
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

      {showDiscordAccess && subscription && (
        <DiscordAccessDialog
          subscription={subscription}
          onClose={() => setShowDiscordAccess(false)}
        />
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
      <SupportTabContent
        currentTier={currentTier}
        supportTier={supportTier}
        setSupportTier={setSupportTier}
      />

      <Button
        fontFamily="$mono"
        theme="accent"
        br="$10"
        als="flex-end"
        onPress={() => {
          paymentModal.show = true
        }}
        disabled={supportTier === currentTier}
      >
        {getActionLabel()}
      </Button>

      <Separator />

      <Paragraph ff="$mono" size="$5" lineHeight="$6" o={0.8}>
        Each tier adds 2 hours of prioritized development each month, and puts your
        messages higher in our response queue.
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

  return (
    <YStack gap="$6">
      <YStack gap="$2">
        {tiers.map((tier) => (
          <YStack
            key={tier.value}
            borderWidth={1}
            borderColor={supportTier === tier.value ? '$blue3' : '$color3'}
            backgroundColor={supportTier === tier.value ? '$blue1' : undefined}
            borderRadius="$4"
            p="$4"
            cursor="pointer"
            opacity={currentTier === tier.value ? 1 : 0.8}
            onPress={() => setSupportTier(tier.value)}
          >
            <XStack jc="space-between" ai="center">
              <YStack gap="$1">
                <H3 fontFamily="$mono" size="$6">
                  {tier.label}
                </H3>
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
