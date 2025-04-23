import { LogOut, Search, X } from '@tamagui/lucide-icons'
import { animationsCSS } from '@tamagui/tamagui-dev-config'
import { createStore, createUseStore } from '@tamagui/use-store'
import type {
  APIGuildMember,
  RESTGetAPIGuildMembersSearchResult,
} from 'discord-api-types/v10'
import { render, router } from 'one'
import { useState, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  Avatar,
  Button,
  Configuration,
  Dialog,
  Fieldset,
  Form,
  H3,
  H4,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  Tabs,
  XStack,
  YStack,
  Spinner,
  View,
} from 'tamagui'
import type { UserContextType } from '~/features/auth/types'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'
import { Link } from '../../../components/Link'
import { paymentModal } from './StripePaymentModal'
import { useProducts } from './useProducts'
import {
  useInviteTeamMember,
  useRemoveTeamMember,
  useTeamSeats,
  type TeamMember,
} from './useTeamSeats'
import { debounce, has } from 'lodash'
import { AddTeamMemberModalComponent, addTeamMemberModal } from './AddTeamMemberModal'
import { useClipboard } from '~/hooks/useClipboard'

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
      (item) => item.price?.product?.name === 'Tamagui Support'
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
          <DiscordPanel subscription={subscription} apiType="channel" />
          <Dialog.Close asChild>
            <Button position="absolute" top="$2" right="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const DiscordPanel = ({
  subscription,
  apiType,
}: {
  subscription: any
  apiType: 'channel' | 'support'
}) => {
  const hasSupportTier = () => {
    const supportItem = subscription.subscription_items?.find((item) => {
      return item.price?.product?.name === 'Tamagui Support'
    })

    if (!supportItem) {
      return false
    }

    // Calculate tier from unit_amount (80000 cents = $800 = Tier 1)
    const unitAmount = supportItem.price?.unit_amount
    if (!unitAmount) {
      return false
    }

    // If unit_amount is at least 80000 (Tier 1 or higher)
    return unitAmount >= 80000
  }

  const [activeApi, setActiveApi] = useState<'channel' | 'support'>('channel')
  const groupInfoSwr = useSWR<any>(
    `/api/discord/${activeApi}?${new URLSearchParams({ subscription_id: subscription.id })}`,
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
    [`/api/discord/${activeApi}`, 'DELETE', subscription.id],
    (url) =>
      fetch(`/api/discord/${activeApi}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
      }).then((res) => res.json()),
    {
      onSuccess: async () => {
        await mutate(
          `/api/discord/${activeApi}?${new URLSearchParams({
            subscription_id: subscription.id,
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
    subscription.id ? `/api/products?subscription_id=${subscription.id}` : null,
    (url) => fetch(url).then((res) => res.json())
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
            subscriptionId={subscription.id}
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
        onValueChange={(val: string) => setActiveApi(val as 'channel' | 'support')}
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
            {hasSupportTier() ? (
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

type GitHubUser = {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

const TeamTab = () => {
  const { data: teamData, error, isLoading } = useTeamSeats()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<GitHubUser[]>([])

  const searchUsers = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setSearchResults([])
          return
        }
        setIsSearching(true)
        try {
          const response = await fetch(`/api/github/users?q=${query}`)
          const data = await response.json()
          if (response.ok) {
            setSearchResults(data.users)
          } else {
            console.error('Search failed:', data.error)
          }
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsSearching(false)
        }
      }, 300),
    []
  )

  useEffect(() => {
    searchUsers(searchQuery)
  }, [searchQuery, searchUsers])

  if (isLoading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error || !teamData) {
    return (
      <YStack gap="$4">
        <H3>No Team Subscription</H3>
        <Paragraph theme="alt1">
          Purchase team seats to invite team members to your Tamagui Pro subscription.
        </Paragraph>
        <Button
          theme="accent"
          onPress={() => {
            paymentModal.show = true
            paymentModal.teamSeats = 1
          }}
        >
          Purchase Team Seats
        </Button>
      </YStack>
    )
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        <H3>Team Management</H3>
        <XStack ai="center" jc="space-between">
          <Paragraph theme="alt1">
            {teamData.subscription.used_seats || 0} of {teamData.subscription.total_seats}{' '}
            seats used
          </Paragraph>
        </XStack>
      </YStack>

      {teamData.subscription.used_seats < teamData.subscription.total_seats && (
        <YStack gap="$4">
          <H4>Invite Team Member</H4>
          <Form gap="$2">
            <XStack gap="$2" ai="flex-end">
              <Fieldset f={1}>
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  placeholder="Search GitHub users by username, email, or id"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Fieldset>
            </XStack>
          </Form>

          <YStack gap="$2">
            {isSearching ? (
              <XStack p="$2" ai="center" jc="center">
                <Spinner size="small" />
              </XStack>
            ) : (
              searchResults.map((githubUser) => (
                <GitHubUserRow
                  key={githubUser.id}
                  user={githubUser}
                  subscriptionId={teamData.subscription.id}
                />
              ))
            )}
          </YStack>
        </YStack>
      )}

      <Separator />

      <YStack gap="$4">
        <H4>Team Members</H4>
        <YStack gap="$2">
          {teamData.members.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              subscriptionId={teamData.subscription.id}
            />
          ))}
        </YStack>
      </YStack>
    </YStack>
  )
}

const GitHubUserRow = ({
  user,
  subscriptionId,
}: {
  user: GitHubUser
  subscriptionId: string
}) => {
  const {
    trigger: inviteTeamMember,
    isMutating: isInviting,
    error: inviteError,
  } = useInviteTeamMember(subscriptionId)

  return (
    <XStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$4"
      p="$3"
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image source={{ uri: user.avatar_url ?? '' }} />
        </Avatar>
        <YStack>
          <Paragraph>{user.full_name ?? 'Unknown User'}</Paragraph>
          <Paragraph size="$2" theme="alt2">
            {user.email ?? 'Unknown Email'}
          </Paragraph>
          {inviteError && (
            <Paragraph size="$2" color="$red10">
              Error: {inviteError.message}
            </Paragraph>
          )}
        </YStack>
      </XStack>

      <Button
        theme="accent"
        size="$2"
        onPress={() => inviteTeamMember({ user_id: String(user.id) })}
        disabled={isInviting}
      >
        {isInviting ? 'Inviting...' : 'Invite'}
      </Button>
    </XStack>
  )
}

const TeamMemberRow = ({
  member,
  subscriptionId,
}: {
  member: TeamMember
  subscriptionId: string
}) => {
  const { trigger: removeTeamMember, isMutating: isRemoving } =
    useRemoveTeamMember(subscriptionId)

  return (
    <XStack
      borderWidth={1}
      borderColor="$color3"
      borderRadius="$4"
      p="$3"
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image
            source={{
              uri:
                member.user?.avatar_url ??
                getDefaultAvatarImage(member.user?.full_name ?? ''),
            }}
          />
        </Avatar>
        <YStack>
          <Paragraph>{member.user?.full_name ?? 'Unknown User'}</Paragraph>
          <Paragraph theme="alt2" size="$2">
            {member.user?.email}
          </Paragraph>
        </YStack>
      </XStack>

      <XStack ai="center" gap="$2">
        <Paragraph size="$2" theme="alt2">
          {member.role}
        </Paragraph>
        <Button
          theme="red"
          size="$2"
          onPress={() => removeTeamMember({ team_member_id: member.user?.id ?? '' })}
          disabled={isRemoving}
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      </XStack>
    </XStack>
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

  // const { onCopy } = useClipboard(token ?? '')

  const onCopyCode = async () => {
    if (hasCopied || isLoading) return

    const token = data?.accessToken
    if (token) {
      onCopy(token)
    } else {
      const res = await mutate()
      const token = res?.accessToken
      if (token) onCopy(token)
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
