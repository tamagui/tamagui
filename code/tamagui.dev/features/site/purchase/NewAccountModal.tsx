import {
  Check,
  Edit3,
  Gift,
  LogOut,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from '@tamagui/lucide-icons'
import type {
  APIGuildMember,
  RESTGetAPIGuildMembersSearchResult,
} from 'discord-api-types/v10'
import { router } from 'one'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  Avatar,
  Button,
  debounce,
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
  Spinner,
  Tabs,
  View,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'
import { authFetch } from '~/features/api/authFetch'
import { ADMIN_EMAILS } from '~/features/api/isAdmin'
import type { UserContextType } from '~/features/auth/types'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { CURRENT_PRODUCTS, V1_PRODUCTS } from '~/features/stripe/products'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'
import { useClipboard } from '~/hooks/useClipboard'
import { Pricing, ProductName, SubscriptionStatus } from '~/shared/types/subscription'
import { Link } from '../../../components/Link'
import { accountModal, useAccountModal } from './accountModalStore'
import { addTeamMemberModal } from './addTeamMemberModalStore'
import { FaqTabContent } from './FaqTabContent'
import { paymentModal, SUPPORT_TIERS, type SupportTier } from './paymentModalStore'
import { useProjects, createProject, updateProject, type Project } from './useProjects'
import {
  useInviteTeamMember,
  useRemoveTeamMember,
  useTeamSeats,
  type TeamMember,
  type TeamSubscription,
} from './useTeamSeats'
import {
  getParityCountryOverride,
  setParityCountryOverride,
  useParityDiscount,
} from '~/hooks/useParityDiscount'
import {
  COUNTRY_NAMES,
  getParityDiscount as getParityDiscountForCountry,
} from '~/features/geo-pricing/parityConfig'

const AddTeamMemberModalComponent = lazy(() =>
  import('./AddTeamMemberModal').then((mod) => ({
    default: mod.AddTeamMemberModalComponent,
  }))
)

// re-export for backwards compat
export { accountModal, useAccountModal } from './accountModalStore'

type Subscription = NonNullable<UserContextType['subscriptions']>[number]

type TabName = 'plan' | 'manage' | 'team' | 'faq' | 'admin'

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
          <Sheet modal dismissOnSnapToBottom transition="medium">
            <Sheet.Frame bg="$background" p={0} gap="$4">
              <Sheet.ScrollView>
                <Dialog.Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              transition="lazy"
              bg="$shadow6"
              opacity={1}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Dialog.Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            transition="medium"
            bg="$shadow3"
            backdropFilter="blur(20px)"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            transition={[
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
            maxW={800}
            p={0}
            rounded="$4"
            overflow="hidden"
            height="85%"
            maxH="calc(min(85vh, 800px))"
            minH={500}
          >
            <AccountView />
            <VisuallyHidden>
              <Dialog.Title>Account</Dialog.Title>
            </VisuallyHidden>

            <Dialog.Close asChild>
              <Button position="absolute" t="$3" r="$3" size="$3" circular icon={X} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      <Suspense fallback={null}>
        <AddTeamMemberModalComponent />
      </Suspense>
    </>
  )
}

export const AccountView = () => {
  const { isLoading, data } = useUser()

  const [currentTab, setCurrentTab] = useState<TabName>('plan')

  // Calculate values needed for hooks, but use safe defaults when data isn't ready
  const subscriptions = data?.subscriptions

  const filteredSubscriptions = subscriptions?.filter(
    (sub) =>
      (sub.status === SubscriptionStatus.Active ||
        sub.status === SubscriptionStatus.Trialing) &&
      sub.subscription_items?.some(
        (item) =>
          item.price?.product?.id &&
          CURRENT_PRODUCTS.includes(item.price.product.id as any)
      )
  )

  // Deduplicate by product ID, keeping the one with latest current_period_end
  const activeSubscriptions = filteredSubscriptions?.reduce((acc, sub) => {
    const productIds =
      sub.subscription_items?.map((item) => item.price?.product?.id).filter(Boolean) || []

    productIds.forEach((productId) => {
      const existing = acc.find((existingSub) =>
        existingSub.subscription_items?.some(
          (item) => item.price?.product?.id === productId
        )
      )

      if (!existing) {
        acc.push(sub)
      } else {
        // Replace with the one that has later current_period_end
        if (new Date(sub.current_period_end) > new Date(existing.current_period_end)) {
          const index = acc.indexOf(existing)
          acc[index] = sub
        }
      }
    })

    return acc
  }, [] as Subscription[])

  // check for expired/canceled subscriptions (for renewal prompts)
  const expiredSubscriptions = subscriptions?.filter(
    (sub) =>
      (sub.status === SubscriptionStatus.Canceled ||
        sub.status === SubscriptionStatus.PastDue ||
        sub.status === SubscriptionStatus.IncompleteExpired) &&
      sub.subscription_items?.some(
        (item) =>
          item.price?.product?.id &&
          [...CURRENT_PRODUCTS, ...V1_PRODUCTS].includes(item.price.product.id as any)
      )
  )

  const hasExpiredSubscription = (expiredSubscriptions?.length ?? 0) > 0
  const hasNoActiveSubscription = (activeSubscriptions?.length ?? 0) === 0

  const proTeamSubscription = activeSubscriptions?.find((sub) =>
    sub.subscription_items?.some(
      (item) => item.price?.product?.name === ProductName.TamaguiProTeamSeats
    )
  ) as Subscription

  const haveTeamSeats = !!proTeamSubscription?.id

  // Conditionally fetch team data only when team seats are available
  const {
    data: teamData,
    error: teamError,
    isLoading: isTeamLoading,
  } = useTeamSeats(haveTeamSeats)

  // Find Pro subscription (V1 or V2)
  const proSubscription = haveTeamSeats
    ? proTeamSubscription
    : (activeSubscriptions?.find((sub) =>
        sub.subscription_items?.some(
          (item) =>
            item.price?.product?.name === ProductName.TamaguiPro ||
            item.price?.product?.name === ProductName.TamaguiProV2 ||
            item.price?.product?.name === ProductName.TamaguiProV2Upgrade ||
            // V2 support tiers also imply Pro access
            item.price?.product?.name === ProductName.TamaguiSupportDirect ||
            item.price?.product?.name === ProductName.TamaguiSupportSponsor
        )
      ) as Subscription)

  // Find ALL support-related subscriptions (Chat and/or Support tiers - V1 and V2)
  const supportSubscriptions = activeSubscriptions
    ?.filter((sub) =>
      sub.subscription_items?.some(
        (item) =>
          // V1 support products
          item.price?.product?.name === ProductName.TamaguiSupport ||
          item.price?.product?.name === ProductName.TamaguiChat ||
          // V2 support products
          item.price?.product?.name === ProductName.TamaguiSupportDirect ||
          item.price?.product?.name === ProductName.TamaguiSupportSponsor
      )
    )
    .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())

  // Early return AFTER all hooks have been called
  if (isLoading || !data) {
    return null
  }

  // Use the first support subscription for Discord operations (oldest first)
  // But will calculate total seats from ALL user support subscriptions
  // TODO: Consolidate Chat + Support tier into single subscription to avoid complexity
  // - When user has Chat subscription and purchases Support tier, upgrade the existing Chat subscription instead of creating new one
  // - This eliminates multiple subscriptions with same functionality and simplifies seat calculation
  // - Update upgrade-subscription API to check for existing support subscriptions and modify them instead of creating new ones
  // - Benefits: Single Discord channel, unified billing, easier management, no need for complex multi-subscription logic
  // WARNING: This is a temporary solution to avoid the complexity of having multiple subscriptions with the same functionality.
  const supportSubscription = supportSubscriptions?.[0]

  const user = data.user
  const isTeamAdmin = haveTeamSeats && user?.id === proTeamSubscription?.user_id
  const isTeamMember = haveTeamSeats && !isTeamAdmin
  const isAdmin = (ADMIN_EMAILS as readonly string[]).includes(
    user?.email?.toLowerCase() || ''
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
            hasBento={data?.accessInfo?.hasBento ?? false}
            hasExpiredSubscription={hasExpiredSubscription}
            hasNoActiveSubscription={hasNoActiveSubscription}
          />
        )

      case 'manage':
        return (
          <ManageTab
            subscriptions={activeSubscriptions!}
            isTeamMember={!!isTeamMember}
            teamData={teamData}
            isTeamLoading={isTeamLoading}
          />
        )

      case 'team':
        return (
          <TeamTab
            teamData={teamData}
            isTeamLoading={isTeamLoading}
            teamError={teamError}
          />
        )

      case 'faq':
        return <FaqTabContent />

      case 'admin':
        return <AdminTab />

      default:
        return null
    }
  }

  return (
    <YStack flex={1} flexBasis="auto">
      <Tabs
        flex={1}
        flexBasis="auto"
        value={currentTab}
        onValueChange={(val: any) => setCurrentTab(val)}
        orientation="horizontal"
        flexDirection="column"
        size="$6"
      >
        <Tabs.List>
          <YStack width={'33.3333%'} flex={1}>
            <Tab isActive={currentTab === 'plan'} value="plan">
              Plan
            </Tab>
          </YStack>
          <YStack width={'33.3333%'} flex={1}>
            <Tab isActive={currentTab === 'manage'} value="manage">
              Manage
            </Tab>
          </YStack>
          {isTeamAdmin && (
            <YStack width={'33.3333%'} flex={1}>
              <Tab isActive={currentTab === 'team'} value="team">
                Team
              </Tab>
            </YStack>
          )}
          <YStack width={'33.3333%'} flex={1}>
            <Tab isActive={currentTab === 'faq'} value="faq">
              FAQ
            </Tab>
          </YStack>
          {isAdmin && (
            <YStack width={'33.3333%'} flex={1}>
              <Tab isActive={currentTab === 'admin'} value="admin">
                Admin
              </Tab>
            </YStack>
          )}
        </Tabs.List>

        <YStack overflow="hidden" flex={1} flexBasis="auto">
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
  const { userDetails, user, githubUsername } = data

  const supabase = useSupabaseClient()

  const handleLogout = async () => {
    try {
      // Sign out on client side first - this clears localStorage and triggers auth state change
      if (supabase) {
        await supabase.auth.signOut()
      }

      // Also call server to clear any server-side session
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Clear SWR cache and redirect
      await mutate('user', null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

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

      <YStack gap="$3" items="flex-start" justify="center" flex={1}>
        <XStack justify="space-between" gap="$4" items="center">
          <YStack flex={1}>
            <H3
              mt={-5}
              style={{
                wordBreak: 'break-word',
              }}
            >
              {userDetails?.full_name}
            </H3>
            <Paragraph color="$color10">{user?.email}</Paragraph>
            {githubUsername && (
              <Paragraph color="$color9" size="$2">
                GitHub: @{githubUsername}
              </Paragraph>
            )}
          </YStack>
        </XStack>
      </YStack>

      <Button
        onPress={handleLogout}
        icon={<LogOut />}
        size="$2"
        self="flex-end"
        aria-label="Logout"
      >
        <Button.Text>Logout</Button.Text>
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
      items="center"
      justify="center"
      overflow="hidden"
      py="$1"
      bg="$color1"
      height={60}
      borderBottomWidth={1}
      cursor="pointer"
      borderBottomColor="transparent"
      {...(!isActive && {
        bg: '$color2',
      })}
      {...props}
      value={props.value}
    >
      <YStack
        fullscreen
        pointerEvents="none"
        z={-1}
        {...(isActive && {
          bg: '$color3',
        })}
        {...(!isActive && {
          bg: '$color1',
          opacity: 0.25,
          '$group-takeoutBody-hover': {
            opacity: 0.33,
          },
        })}
      />
      <Paragraph
        fontFamily="$mono"
        size="$7"
        color={isActive ? '$color12' : '$color10'}
        fontWeight={isActive ? 'bold' : 'normal'}
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
  thirdAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  secondAction?: null | {
    label: string
    onPress: () => void
  }
  thirdAction?: null | {
    label: string
    onPress: () => void
  }
}) => {
  return (
    <YStack
      borderWidth={1}
      borderColor="$color3"
      rounded="$6"
      p="$4"
      gap="$2"
      width={300}
      flex={1}
      flexBasis="auto"
    >
      <H3 fontFamily="$mono" size="$6">
        {title}
      </H3>
      <Paragraph color="$color10">{description}</Paragraph>

      <XStack gap="$3">
        <Button
          rounded="$10"
          self="flex-end"
          mt="$4"
          size="$3"
          theme="accent"
          onPress={onAction}
        >
          <Button.Text>{actionLabel}</Button.Text>
        </Button>

        {!!secondAction && (
          <Button
            rounded="$10"
            self="flex-end"
            mt="$4"
            size="$3"
            theme="accent"
            onPress={secondAction.onPress}
          >
            <Button.Text>{secondAction.label}</Button.Text>
          </Button>
        )}

        {!!thirdAction && (
          <Button
            rounded="$10"
            self="flex-end"
            mt="$4"
            size="$3"
            theme="accent"
            onPress={thirdAction.onPress}
          >
            {thirdAction.label}
          </Button>
        )}
      </XStack>
    </YStack>
  )
}

const DiscordAccessDialog = ({
  subscription,
  onClose,
  isTeamMember,
  apiType,
}: {
  subscription: Subscription
  onClose: () => void
  isTeamMember: boolean
  apiType: 'channel' | 'support'
}) => {
  return (
    <Dialog modal open onOpenChange={onClose}>
      <Dialog.Portal zIndex={999999}>
        <Dialog.Overlay
          key="overlay"
          transition="medium"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          transition="quick"
          width="90%"
          maxW={600}
          p="$6"
        >
          <DiscordPanel
            subscription={subscription}
            apiType={apiType}
            isTeamMember={isTeamMember}
          />
          <Dialog.Close asChild>
            <Button position="absolute" t="$2" r="$2" size="$2" circular icon={X} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const DiscordPanel = ({
  subscription,
  apiType,
  isTeamMember,
}: {
  subscription?: Subscription
  apiType: 'channel' | 'support'
  isTeamMember: boolean
}) => {
  const hasSupportAccess = () => {
    const supportItems = subscription?.subscription_items?.filter((item) => {
      return (
        // V1 support products
        item.price?.product?.name === ProductName.TamaguiSupport ||
        item.price?.product?.name === ProductName.TamaguiChat ||
        // V2 support products
        item.price?.product?.name === ProductName.TamaguiSupportDirect ||
        item.price?.product?.name === ProductName.TamaguiSupportSponsor
      )
    })

    if (!supportItems || supportItems.length === 0) {
      return { hasAccess: false, hasChat: false, hasTier: false }
    }

    // Check for chat support (V1 only - V2 Pro includes chat by default)
    const chatItem = supportItems.find(
      (item) => item.price?.product?.name === ProductName.TamaguiChat
    )
    const hasChat = !!chatItem

    // Check for support tier (V1 or V2)
    const tierItem = supportItems.find(
      (item) =>
        item.price?.product?.name === ProductName.TamaguiSupport ||
        item.price?.product?.name === ProductName.TamaguiSupportDirect ||
        item.price?.product?.name === ProductName.TamaguiSupportSponsor
    )

    let hasTier = false

    if (tierItem) {
      hasTier = true
    }

    return {
      hasAccess: hasChat || hasTier,
      hasChat,
      hasTier,
    }
  }

  const {
    data: groupInfoData,
    error: groupInfoError,
    isLoading,
  } = useSWR<any>(
    subscription?.id
      ? `/api/discord/${apiType}?${new URLSearchParams({ subscription_id: subscription.id })}`
      : null,
    (url) => authFetch(url).then((res) => res.json()),
    { revalidateOnFocus: false, revalidateOnReconnect: false, errorRetryCount: 0 }
  )
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState(draftQuery)
  const searchSwr = useSWR<RESTGetAPIGuildMembersSearchResult>(
    query
      ? `/api/discord/search-member?${new URLSearchParams({ query }).toString()}`
      : null,
    (url) => authFetch(url).then((res) => res.json())
  )

  const resetChannelMutation = useSWRMutation(
    subscription?.id ? [`/api/discord/${apiType}`, 'DELETE', subscription.id] : null,
    () =>
      authFetch(`/api/discord/${apiType}`, {
        method: 'DELETE',
        body: JSON.stringify({
          subscription_id: subscription?.id,
        }),
      }).then((res) => res.json()),
    {
      onSuccess: async () => {
        if (subscription?.id) {
          await mutate(
            `/api/discord/${apiType}?${new URLSearchParams({
              subscription_id: subscription.id,
            })}`
          )
        }
        setDraftQuery('')
        setQuery('')
      },
    }
  )

  const handleSearch = async () => {
    setQuery(draftQuery)
  }

  const SearchForm = () => (
    <>
      <Form onSubmit={handleSearch} gap="$2" flexDirection="row" items="flex-end">
        <Fieldset>
          <Label size="$3" color="$color10" htmlFor="discord-username">
            Username / Nickname
          </Label>
          <Input
            minW={200}
            placeholder="Your username..."
            id="discord-username"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
          />
        </Fieldset>

        <Form.Trigger>
          <Button icon={Search}>
            <Button.Text>Search</Button.Text>
          </Button>
        </Form.Trigger>
      </Form>

      <XStack render="article">
        <Paragraph size="$3" color="$color10">
          Note: You must{' '}
          <Link target="_blank" href="https://discord.gg/4qh6tdcVDa">
            join the Discord server
          </Link>{' '}
          first so we can find your username.
        </Paragraph>
      </XStack>

      {Array.isArray(searchSwr.data) && searchSwr.data.length === 0 ? (
        <Paragraph size="$3" color="$color10">
          No users found
        </Paragraph>
      ) : (
        searchSwr.data?.map((member) => (
          <DiscordMember
            key={member.user?.id}
            member={member}
            subscriptionId={subscription?.id || ''}
            apiType={apiType}
          />
        ))
      )}
    </>
  )

  const DiscordAccessHeader = () => {
    // Show seats count when:
    // - User is in General Channel (always show)
    // - User is in Support Channel AND has any support access
    const supportAccess = hasSupportAccess()
    const showSeats =
      apiType === 'channel' || (apiType === 'support' && supportAccess.hasAccess)

    // Show reset button when:
    // - User is not a team member (only team owner or normal PRO user can reset)
    // - There are occupied seats to reset
    // - The seats are visible (using same logic as showSeats)
    const showResetButton =
      !isTeamMember && groupInfoData?.currentlyOccupiedSeats > 0 && showSeats

    const title = apiType === 'channel' ? 'Discord Access' : 'Private Support Access'

    return (
      <XStack justify="space-between" gap="$2" items="center">
        <H4>
          {title}{' '}
          {showSeats &&
            !!groupInfoData &&
            `(${groupInfoData?.currentlyOccupiedSeats}/${groupInfoData?.discordSeats})`}
        </H4>

        {showResetButton && (
          <Button
            size="$2"
            onPress={() => resetChannelMutation.trigger()}
            disabled={resetChannelMutation.isMutating}
          >
            <Button.Text>
              {resetChannelMutation.isMutating ? 'Resetting...' : 'Reset'}
            </Button.Text>
          </Button>
        )}
      </XStack>
    )
  }

  const renderDiscordAccessContent = () => {
    if (isLoading) {
      return (
        <XStack items="center" justify="center" p="$4">
          <Spinner size="small" />
        </XStack>
      )
    }

    if (isTeamMember) {
      return (
        <Paragraph size="$3" color="$color10">
          Only the team owner can manage Discord access.
        </Paragraph>
      )
    }

    // For support channels, check if user has any support access
    if (apiType === 'support') {
      const supportAccess = hasSupportAccess()
      if (!supportAccess.hasAccess) {
        return (
          <YStack gap="$4" p="$4" bg="$color2" rounded="$4">
            <Paragraph color="$color9" text="center">
              You need a Chat Support or Support tier subscription to access private
              support channels.
            </Paragraph>
          </YStack>
        )
      }
    }

    if (groupInfoData.currentlyOccupiedSeats < groupInfoData.discordSeats) {
      return <SearchForm />
    }

    return (
      <Paragraph size="$3" color="$color10">
        You've reached the maximum number of Discord members for your plan. Please reset
        if you want to add new members.
      </Paragraph>
    )
  }

  return (
    <YStack gap="$3">
      <DiscordAccessHeader />

      {apiType === 'channel' ? (
        <Paragraph color="$color9">
          Join the #takeout-general channel to discuss Tamagui with other Pro users.
        </Paragraph>
      ) : (
        <Paragraph color="$color9">
          Get access to your private support channel where you can directly communicate
          with the Tamagui team.
        </Paragraph>
      )}

      {renderDiscordAccessContent()}
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
      const res = await authFetch(`/api/discord/${apiType}`, {
        method: 'POST',
        body: JSON.stringify({
          subscription_id: subscriptionId,
          discord_id: member.user?.id,
        }),
      })

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status} ${res.statusText}`

        try {
          const errorData = await res.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = 'An unknown error occurred'
        }
        throw new Error(errorMessage)
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
    <XStack gap="$2" items="center" flexWrap="wrap">
      <Button minW={70} size="$2" disabled={isMutating} onPress={() => trigger()}>
        <Button.Text>{isMutating ? 'Inviting...' : 'Add'}</Button.Text>
      </Button>
      <Avatar circular size="$2">
        <Avatar.Image aria-label={`avatar for ${username}`} src={avatarSrc!} />
        <Avatar.Fallback bg="$blue10" />
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
// Project setup form shown when user has Pro but no project configured
const ProjectSetupForm = ({ onComplete }: { onComplete: () => void }) => {
  const [projectName, setProjectName] = useState('')
  const [projectDomain, setProjectDomain] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)

    if (!projectName || projectName.length <= 2) {
      setError('Project name must be more than 2 characters')
      return
    }
    if (!projectDomain || projectDomain.length <= 2) {
      setError('Domain must be more than 2 characters')
      return
    }

    setIsSubmitting(true)
    try {
      await createProject({ name: projectName, domain: projectDomain })
      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <YStack gap="$6" p="$4" maxWidth={500}>
      <YStack gap="$2">
        <H3 fontFamily="$mono">Set Up Your Project</H3>
        <Paragraph size="$4" color="$color10">
          Enter your project name and domain to activate your license. You can change this
          later.
        </Paragraph>
      </YStack>

      <YStack gap="$4">
        <Fieldset gap="$2">
          <Label fontFamily="$mono" size="$3">
            Project Name
          </Label>
          <Input
            placeholder="My Awesome App"
            value={projectName}
            onChangeText={setProjectName}
            fontFamily="$mono"
          />
        </Fieldset>

        <Fieldset gap="$2">
          <Label fontFamily="$mono" size="$3">
            Domain
          </Label>
          <Input
            placeholder="myapp.com"
            value={projectDomain}
            onChangeText={setProjectDomain}
            fontFamily="$mono"
          />
          <Paragraph size="$2" color="$color9">
            Primary web domain for your project. Your license covers this domain plus
            iOS/Android apps.
          </Paragraph>
        </Fieldset>

        {error && (
          <Paragraph size="$3" color="$red10">
            {error}
          </Paragraph>
        )}

        <Button theme="accent" onPress={handleSubmit} disabled={isSubmitting}>
          <Button.Text fontFamily="$mono">
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button.Text>
        </Button>
      </YStack>
    </YStack>
  )
}

const PlanTab = ({
  subscription,
  supportSubscription,
  setCurrentTab,
  isTeamMember,
  hasBento,
  hasExpiredSubscription,
  hasNoActiveSubscription,
}: {
  subscription?: Subscription
  supportSubscription?: Subscription
  setCurrentTab: (value: 'plan' | 'manage' | 'team') => void
  isTeamMember: boolean
  hasBento: boolean
  hasExpiredSubscription: boolean
  hasNoActiveSubscription: boolean
}) => {
  const [showDiscordAccess, setShowDiscordAccess] = useState(false)
  const [showSupportAccess, setShowSupportAccess] = useState(false)

  // Check for projects
  const {
    projects,
    isLoading: projectsLoading,
    refresh: refreshProjects,
  } = useProjects(!!subscription)

  // Check if this is a one-time payment plan
  const isOneTimePlan =
    subscription?.subscription_items?.[0]?.price?.type === Pricing.OneTime

  // Check if this is a V2 Pro subscription (V2 no need for team seats)
  const isV2Pro = subscription?.subscription_items?.some(
    (item) =>
      item.price?.product?.name === ProductName.TamaguiProV2 ||
      item.price?.product?.name === ProductName.TamaguiProV2Upgrade ||
      item.price?.product?.name === ProductName.TamaguiSupportDirect ||
      item.price?.product?.name === ProductName.TamaguiSupportSponsor
  )

  // V2 users need to set up a project after purchase
  // Show loading while we check if they have projects
  if (isV2Pro && projectsLoading) {
    return (
      <YStack flex={1} items="center" justify="center" p="$6">
        <Spinner size="large" />
      </YStack>
    )
  }

  const needsProjectSetup = isV2Pro && projects.length === 0

  // Show project setup form if needed
  if (needsProjectSetup) {
    return <ProjectSetupForm onComplete={() => refreshProjects()} />
  }

  const handleTakeoutAccess = (repoUrl = 'https://github.com/tamagui/takeout') => {
    // Just open the repo URL directly - invite handling is done via "Resend Invite" button
    window.open(repoUrl, '_blank', 'noopener,noreferrer')
  }

  const handleResendInvite = () => {
    if (!subscription) return

    // get product ID from the user's actual subscription items (works for both V1 and V2)
    const subscriptionProduct = subscription.subscription_items?.find(
      (item) => item.price?.product?.id
    )?.price?.product

    if (!subscriptionProduct?.id) {
      alert('Product information not found in subscription')
      return
    }

    const url = `${window.location.origin}/pop/accept-invite?subscription_id=${encodeURIComponent(subscription.id)}&product_id=${encodeURIComponent(subscriptionProduct.id)}`
    const width = 500
    const height = 500
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    window.open(
      url,
      'GitHub Invite',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    )
  }

  return (
    <YStack gap="$6">
      {/* expired subscription banner */}
      {hasExpiredSubscription && hasNoActiveSubscription && (
        <YStack
          bg="$yellow3"
          borderColor="$yellow8"
          borderWidth={1}
          borderRadius="$4"
          p="$4"
          gap="$3"
        >
          <H4 color="$yellow11">Your subscription has expired</H4>
          <Paragraph color="$yellow11">
            Renew now to regain access to Takeout, Bento, and all Pro features. Use code{' '}
            <Paragraph fontFamily="$mono" fontWeight="bold" color="$yellow12">
              WELCOMEBACK30
            </Paragraph>{' '}
            for 30% off!
          </Paragraph>
          <XStack gap="$3">
            <Button
              size="$3"
              theme="yellow"
              onPress={() => {
                paymentModal.show = true
              }}
            >
              Renew Now
            </Button>
            <Button
              size="$3"
              chromeless
              onPress={() => {
                window.open('https://tamagui.dev/pro', '_blank')
              }}
            >
              Learn More
            </Button>
          </XStack>
        </YStack>
      )}

      <YStack gap="$4">
        <XStack flexWrap="wrap" gap="$3">
          <ServiceCard
            title="Takeout"
            description="Access to repository and updates."
            actionLabel={subscription ? 'Pro' : 'Purchase'}
            onAction={() => {
              if (!subscription) {
                paymentModal.show = true
              } else {
                handleTakeoutAccess('https://github.com/tamagui/takeout2')
              }
            }}
            secondAction={
              subscription
                ? {
                    label: 'Pro Classic',
                    onPress: () =>
                      handleTakeoutAccess('https://github.com/tamagui/takeout'),
                  }
                : null
            }
            thirdAction={
              subscription
                ? {
                    label: 'Resend Invite',
                    onPress: handleResendInvite,
                  }
                : null
            }
          />

          <BentoCard subscription={subscription as Subscription} hasBento={hasBento} />

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

          {/* Private Support Channels for Chat/Support users */}
          {supportSubscription && (
            <ServiceCard
              title="Private Support"
              description="Access your private Discord support channel with priority responses from the Tamagui team."
              actionLabel="Manage Support"
              onAction={() => {
                setShowSupportAccess(true)
              }}
            />
          )}

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

          {/* <ChatAccessCard /> */}
          {/* Add Members card - V1 only (V2 has unlimited team included in license) */}
          {!isTeamMember && !isOneTimePlan && !isV2Pro ? (
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
            <View flex={1} width={300} />
          )}
        </XStack>
      </YStack>

      {subscription?.status === 'active' && (
        <YStack gap="$4">
          <H3>Support Services</H3>
          <XStack flexWrap="wrap" gap="$4">
            <ServiceCard
              title="Discord Support"
              description="Access to private Discord support channels"
              actionLabel="Join Discord"
              onAction={() => {
                router.navigate('https://discord.gg/4qh6tdcVDa')
                // Add Discord join logic
              }}
            />
            <ServiceCard
              title="Priority Support"
              description="Direct support and prioritized issue handling"
              actionLabel={subscription ? 'Contact Support' : 'Upgrade'}
              onAction={() => {
                setCurrentTab('manage')
              }}
            />
          </XStack>
        </YStack>
      )}

      {/* General Discord Access Dialog for PRO users */}
      {showDiscordAccess && subscription && (
        <DiscordAccessDialog
          subscription={subscription}
          onClose={() => setShowDiscordAccess(false)}
          isTeamMember={isTeamMember}
          apiType="channel"
        />
      )}

      {/* Private Support Access Dialog for Chat/Support users */}
      {showSupportAccess && supportSubscription && (
        <DiscordAccessDialog
          subscription={supportSubscription}
          onClose={() => setShowSupportAccess(false)}
          isTeamMember={isTeamMember}
          apiType="support"
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

const SupportTabContent = ({
  currentTier,
  supportTier,
  setSupportTier,
}: {
  currentTier: SupportTier
  supportTier: SupportTier
  setSupportTier: (value: SupportTier) => void
}) => {
  const tiers: {
    value: SupportTier
    label: string
    price: number
    description: string
  }[] = [
    {
      value: 'chat',
      label: 'Chat',
      price: 0,
      description: 'Community Discord access, no SLA',
    },
    {
      value: 'direct',
      label: 'Direct',
      price: 500,
      description: '5 bug fixes/year, 2 day response',
    },
    {
      value: 'sponsor',
      label: 'Sponsor',
      price: 2000,
      description: 'Unlimited priority fixes, 1 day response',
    },
  ]

  const formatCurrency = (price: number) => {
    if (price === 0) return 'Included'
    return (
      price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }) + '/mo'
    )
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        {tiers.map((tier) => (
          <YStack
            key={tier.value}
            borderWidth={1}
            theme={supportTier === tier.value ? 'accent' : null}
            rounded="$4"
            borderColor="$color4"
            p="$4"
            bg="$color1"
            cursor="pointer"
            onPress={() => setSupportTier(tier.value)}
          >
            <XStack justify="space-between" items="center">
              <YStack gap="$1">
                <H3 fontFamily="$mono" size="$6">
                  {tier.label}
                </H3>
                <Paragraph color="$color10" size="$3">
                  {tier.description}
                </Paragraph>
                <Paragraph color="$color10">
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

// card for V1 users to enable automatic V2 renewal
const V2RenewalCard = ({ subscription }: { subscription: Subscription }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  // check if already enabled from metadata
  const metadata = subscription.metadata as Record<string, any> | null
  const isEnabled = metadata?.v2_renewal_enabled === 'true'

  if (isEnabled) {
    return (
      <YStack
        gap="$3"
        p="$4"
        borderWidth={1}
        borderColor="$green6"
        bg="$green2"
        rounded="$4"
      >
        <XStack gap="$3" alignItems="center">
          <Gift y={5} size={24} color="$green10" />
          <YStack flex={1}>
            <H4 fontFamily="$mono" color="$green11">
              New Pro Plan Enabled ✓
            </H4>
            <Paragraph color="$green10">
              When your subscription renews, you'll automatically get the new Pro plan
              with 35% off.
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>
    )
  }

  const handleEnable = async () => {
    setStatus('loading')
    setError(null)

    try {
      const response = await authFetch('/api/enable-v2-renewal', {
        method: 'POST',
        body: JSON.stringify({ subscription_id: subscription.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setError(data.error || 'Failed to enable V2 renewal')
        return
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    }
  }

  if (status === 'success') {
    return (
      <YStack
        gap="$3"
        p="$4"
        borderWidth={1}
        borderColor="$green6"
        bg="$green2"
        rounded="$4"
      >
        <XStack gap="$3" alignItems="center">
          <Gift size={24} color="$green10" />
          <YStack flex={1}>
            <H4 fontFamily="$mono" color="$green11">
              New Pro Plan Enabled! 🎉
            </H4>
            <Paragraph color="$green10">
              When your subscription renews, you'll automatically get the new Pro plan
              with 35% off.
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>
    )
  }

  return (
    <YStack
      gap="$4"
      p="$4"
      borderWidth={1}
      borderColor="$purple6"
      bg="$purple2"
      rounded="$4"
    >
      <XStack gap="$3" alignItems="flex-start">
        <Gift y={5} size={24} color="$purple10" />
        <YStack flex={1} gap="$1">
          <H4 fontFamily="$mono" color="$purple11">
            Upgrade to New Pro Plan
          </H4>
          <Paragraph color="$purple10">
            Enable automatic upgrade and get <strong>35% off</strong> when your
            subscription renews. You'll get access to:
          </Paragraph>
          <YStack gap="$1" pl="$2">
            <Paragraph color="$purple10">
              • Takeout 2 - Tamagui 2, One 1, and Zero stack
            </Paragraph>
            <Paragraph color="$purple10">
              • Takeout Static - Web-only starter with 100 Lighthouse
            </Paragraph>
            <Paragraph color="$purple10">
              • Unlimited team members - No per-seat pricing
            </Paragraph>
          </YStack>
        </YStack>
      </XStack>

      {error && <Paragraph color="$red10">{error}</Paragraph>}

      <Button
        theme="purple"
        disabled={status === 'loading'}
        onPress={handleEnable}
        alignSelf="flex-start"
      >
        <Button.Text>
          {status === 'loading' ? 'Enabling...' : 'Enable New Pro Plan (35% off)'}
        </Button.Text>
      </Button>
    </YStack>
  )
}

const ManageTab = ({
  subscriptions,
  isTeamMember,
  teamData,
  isTeamLoading,
}: {
  subscriptions: Subscription[]
  isTeamMember: boolean
  teamData: TeamSubscription | undefined
  isTeamLoading: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { refresh, subscriptionStatus } = useUser()
  const {
    projects,
    isLoading: isProjectsLoading,
    refresh: refreshProjects,
  } = useProjects()

  // support tier state
  const mapNumericToStringTier = (tier: number): SupportTier => {
    if (tier >= 2) return 'sponsor'
    if (tier >= 1) return 'direct'
    return 'chat'
  }
  const currentTierString = mapNumericToStringTier(subscriptionStatus.supportTier)
  const [supportTier, setSupportTier] = useState<SupportTier>(currentTierString)
  const tierOrder: SupportTier[] = ['chat', 'direct', 'sponsor']

  const getActionLabel = () => {
    if (supportTier === currentTierString) return 'Current Plan'
    const currentIndex = tierOrder.indexOf(currentTierString)
    const selectedIndex = tierOrder.indexOf(supportTier)
    return selectedIndex > currentIndex ? 'Upgrade Plan' : 'Downgrade Plan'
  }

  const handleUpgrade = () => {
    const monthlyTotal = SUPPORT_TIERS[supportTier].price
    paymentModal.show = true
    paymentModal.yearlyTotal = 0
    paymentModal.monthlyTotal = monthlyTotal
    paymentModal.disableAutoRenew = false
    paymentModal.chatSupport = false
    paymentModal.supportTier = supportTier
    paymentModal.isSupportUpgradeOnly = true
  }

  if (isTeamLoading || isProjectsLoading) {
    return (
      <YStack flex={1} items="center" justify="center" p="$6">
        <Spinner size="large" />
      </YStack>
    )
  }

  // Sort subscriptions by creation date (oldest first)
  const sortedSubscriptions = [...(subscriptions || [])].sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
  )

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  // Cancel handler for a specific subscription
  const handleCancelSubscription = async (subscriptionId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this subscription? This action cannot be undone.'
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await authFetch('/api/cancel-subscription', {
        method: 'POST',
        body: JSON.stringify({
          subscription_id: subscriptionId,
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

  const hasProjects = projects.length > 0
  const hasSubscriptions = subscriptions && subscriptions.length > 0

  // no subscription and no projects
  if (!hasSubscriptions && !hasProjects) {
    return (
      <YStack gap="$4">
        <H3>No Active Subscription</H3>
        <Paragraph color="$color10">
          You don't have an active subscription. Purchase a plan to get started.
        </Paragraph>

        <Button
          theme="accent"
          onPress={() => {
            paymentModal.show = true
          }}
        >
          <Button.Text>Purchase Plan</Button.Text>
        </Button>
      </YStack>
    )
  }

  return (
    <YStack gap="$8">
      {/* V2 Renewal Section for V1 Subscriptions */}
      {!isTeamMember &&
        sortedSubscriptions
          .filter((sub) => {
            // check if this is a V1 subscription (not a one-time invoice)
            // one-time purchases have invoice IDs (in_...) not subscription IDs (sub_...)
            // they don't renew, so V2 renewal doesn't apply
            if (!sub.id.startsWith('sub_')) return false
            return sub.subscription_items?.some((item) => {
              const productId = item.price?.product?.id
              return productId && V1_PRODUCTS.includes(productId as any)
            })
          })
          .map((v1Sub) => (
            <YStack key={`v2-renewal-${v1Sub.id}`} gap="$4">
              <V2RenewalCard subscription={v1Sub} />
            </YStack>
          ))}

      {/* Projects Section (V2) */}
      {hasProjects && (
        <YStack gap="$4">
          <XStack justify="space-between" items="center">
            <H3>Projects</H3>
            <Button
              size="$3"
              theme="accent"
              onPress={() => {
                paymentModal.show = true
                paymentModal.isV2 = true
              }}
            >
              <Plus size={16} />
              <Button.Text>Add Project</Button.Text>
            </Button>
          </XStack>

          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onUpdate={refreshProjects} />
          ))}
        </YStack>
      )}

      {hasProjects && hasSubscriptions && <Separator />}

      {/* Subscriptions Section */}
      {hasSubscriptions && (
        <YStack gap="$4">
          <XStack justify="space-between" items="center">
            <View>
              <H3>Subscriptions</H3>
              {isTeamMember && <Paragraph color="$green9">You are a member</Paragraph>}
            </View>
            <Link href="https://zenvoice.io/p/66c8a1357aed16c9b4a6dafb" target="_blank">
              <Button size="$3">View Invoices</Button>
            </Link>
          </XStack>
          {sortedSubscriptions.map((subscription) => {
            const subscriptionItems = subscription?.subscription_items || []
            return (
              <YStack
                key={subscription.id}
                gap="$4"
                p="$4"
                borderWidth={1}
                borderColor="$color3"
                rounded="$4"
              >
                <YStack
                  p="$4"
                  borderWidth={1}
                  borderColor="$color3"
                  rounded="$4"
                  width="100%"
                  style={{
                    overflowX: 'auto',
                  }}
                >
                  <YStack minW={500} width="100%">
                    {/* Table Header */}
                    <XStack items="center" mb="$2" width="100%">
                      <Paragraph fontWeight="bold" width="60%">
                        Product
                      </Paragraph>
                      <Paragraph fontWeight="bold" width="20%" text="center">
                        Qty
                      </Paragraph>
                      <Paragraph fontWeight="bold" width="20%" text="right">
                        Total
                      </Paragraph>
                    </XStack>
                    {/* Table Rows */}
                    {subscriptionItems.map((item, idx) => {
                      const price = item.price
                      const product = price?.product
                      const qty =
                        product?.name === ProductName.TamaguiProTeamSeats
                          ? (teamData?.subscription.total_seats ?? 1)
                          : (subscription.quantity ?? 1)
                      const total = (price?.unit_amount || 0) * qty
                      return (
                        <XStack key={item.id || idx} items="center" mb="$2" width="100%">
                          <YStack width="60%">
                            <Paragraph fontWeight="bold">{product?.name}</Paragraph>
                            {product?.description && (
                              <Paragraph color="$color9" size="$3">
                                {product.description}
                              </Paragraph>
                            )}
                            <Paragraph>
                              {formatCurrency(price?.unit_amount || 0)}
                              {price?.type !== Pricing.OneTime && price?.interval
                                ? `/${price.interval}`
                                : ''}
                            </Paragraph>
                          </YStack>
                          <Paragraph width="20%" text="center">
                            {qty}
                          </Paragraph>
                          <Paragraph width="20%" text="right">
                            {formatCurrency(total)}
                            {price?.type !== Pricing.OneTime && price?.interval
                              ? `/${price.interval}`
                              : ''}
                          </Paragraph>
                        </XStack>
                      )
                    })}
                  </YStack>
                </YStack>
                {/* Billing Period, Status, Cancel Button */}
                <XStack justify="space-between">
                  <Paragraph flex={1}>Status</Paragraph>
                  <Paragraph
                    textTransform="capitalize"
                    flex={1}
                    text="right"
                    color={
                      subscription.status === SubscriptionStatus.Active
                        ? '$green9'
                        : '$yellow9'
                    }
                  >
                    {subscription.status === SubscriptionStatus.Trialing
                      ? SubscriptionStatus.Active
                      : subscription.status}
                  </Paragraph>
                </XStack>
                <XStack justify="space-between">
                  <Paragraph flex={1}>Billing Period</Paragraph>
                  <YStack self="flex-end">
                    <Paragraph>
                      {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </Paragraph>
                  </YStack>
                </XStack>
                {subscription.cancel_at_period_end && (
                  <YStack bg="$yellow2" p="$3" rounded="$4">
                    <Paragraph theme="yellow">
                      Your subscription will end on{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </Paragraph>
                  </YStack>
                )}
                {/* Cancel button logic here */}
                {!isTeamMember ? (
                  <>
                    <Separator />
                    <Button
                      theme="red"
                      disabled={isLoading || !!subscription.cancel_at_period_end}
                      onPress={() => handleCancelSubscription(subscription.id)}
                    >
                      <Button.Text>
                        {subscription.cancel_at_period_end
                          ? 'Cancellation Scheduled'
                          : 'Cancel Subscription'}
                      </Button.Text>
                    </Button>
                  </>
                ) : null}
              </YStack>
            )
          })}
        </YStack>
      )}

      {/* Support Tier Section */}
      {!isTeamMember && (hasProjects || hasSubscriptions) && (
        <>
          <Separator />
          <YStack gap="$4">
            <H3>Support Tier</H3>
            <SupportTabContent
              currentTier={currentTierString}
              supportTier={supportTier}
              setSupportTier={setSupportTier}
            />
            <Button
              theme="accent"
              rounded="$10"
              self="flex-end"
              onPress={handleUpgrade}
              disabled={supportTier === currentTierString}
            >
              <Button.Text fontFamily="$mono">{getActionLabel()}</Button.Text>
            </Button>
          </YStack>
        </>
      )}
    </YStack>
  )
}

// project card with inline editing
const ProjectCard = ({
  project,
  onUpdate,
}: {
  project: Project
  onUpdate: () => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const [domain, setDomain] = useState(project.domain)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatesExpired = new Date(project.updates_expire_at) < new Date()
  const daysUntilExpiry = Math.ceil(
    (new Date(project.updates_expire_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const handleSave = async () => {
    if (name === project.name && domain === project.domain) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await updateProject(project.id, { name, domain })
      onUpdate()
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(project.name)
    setDomain(project.domain)
    setError(null)
    setIsEditing(false)
  }

  return (
    <YStack
      gap="$3"
      p="$4"
      borderWidth={1}
      borderColor="$color4"
      rounded="$4"
      bg="$color2"
    >
      {isEditing ? (
        <>
          <YStack gap="$2">
            <Label size="$2" htmlFor={`name-${project.id}`}>
              Project Name
            </Label>
            <Input
              id={`name-${project.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
            />
          </YStack>
          <YStack gap="$2">
            <Label size="$2" htmlFor={`domain-${project.id}`}>
              Domain
            </Label>
            <Input
              id={`domain-${project.id}`}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
            />
          </YStack>
          {error && (
            <Paragraph size="$2" color="$red10">
              {error}
            </Paragraph>
          )}
          <XStack gap="$2" justify="flex-end">
            <Button size="$3" onPress={handleCancel} disabled={isLoading}>
              <Button.Text>Cancel</Button.Text>
            </Button>
            <Button size="$3" theme="accent" onPress={handleSave} disabled={isLoading}>
              {isLoading ? <Spinner size="small" /> : <Check size={16} />}
              <Button.Text>Save</Button.Text>
            </Button>
          </XStack>
        </>
      ) : (
        <>
          <XStack justify="space-between" items="flex-start">
            <YStack gap="$1" flex={1}>
              <H4 fontFamily="$mono">{project.name}</H4>
              <Paragraph size="$3" color="$color10">
                {project.domain}
              </Paragraph>
            </YStack>
            <Button size="$2" chromeless onPress={() => setIsEditing(true)}>
              <Edit3 size={16} />
            </Button>
          </XStack>

          <XStack justify="space-between" items="center">
            <Paragraph size="$2" color="$color9">
              Updates {updatesExpired ? 'expired' : 'expire'}:
            </Paragraph>
            <Paragraph
              size="$2"
              color={
                updatesExpired
                  ? '$red10'
                  : daysUntilExpiry < 30
                    ? '$yellow10'
                    : '$color10'
              }
            >
              {new Date(project.updates_expire_at).toLocaleDateString()}
              {!updatesExpired && daysUntilExpiry <= 90 && ` (${daysUntilExpiry} days)`}
            </Paragraph>
          </XStack>
        </>
      )}
    </YStack>
  )
}

type GitHubUser = {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

const TeamTab = ({
  teamData,
  isTeamLoading,
  teamError,
}: {
  teamData: TeamSubscription | undefined
  isTeamLoading: boolean
  teamError: any
}) => {
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
          const response = await authFetch(`/api/github/users?q=${query}`)
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

  if (isTeamLoading) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (teamError || !teamData) {
    return (
      <YStack gap="$4">
        <H3>No Team Subscription</H3>
        <Paragraph color="$color10">
          Purchase team seats to invite team members to your Tamagui Pro subscription.
        </Paragraph>
        <Button
          theme="accent"
          onPress={() => {
            paymentModal.show = true
            paymentModal.teamSeats = 1
          }}
        >
          <Button.Text>Purchase Team Seats</Button.Text>
        </Button>
      </YStack>
    )
  }

  return (
    <YStack gap="$6">
      <YStack gap="$4">
        <H3>Team Management</H3>
        <XStack items="center" justify="space-between">
          <Paragraph color="$color10">
            {teamData.subscription.used_seats || 0} of {teamData.subscription.total_seats}{' '}
            seats used
          </Paragraph>
        </XStack>
      </YStack>

      {teamData.subscription.used_seats < teamData.subscription.total_seats && (
        <YStack gap="$4">
          <H4>Invite Team Member</H4>
          <Form gap="$2">
            <XStack gap="$2" items="flex-end">
              <Fieldset flex={1}>
                <Label htmlFor="github-username">Name / Email / Id</Label>
                <Input
                  id="github-username"
                  placeholder="Search GitHub users by name, email, or id"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Fieldset>
            </XStack>
          </Form>

          <YStack gap="$2">
            {isSearching ? (
              <XStack p="$2" items="center" justify="center">
                <Spinner size="small" />
              </XStack>
            ) : searchResults.length > 0 ? (
              searchResults.map((githubUser) => (
                <GitHubUserRow
                  key={githubUser.id}
                  user={githubUser}
                  subscriptionId={teamData.subscription.id}
                />
              ))
            ) : searchQuery.length > 0 ? (
              <YStack gap={0}>
                <Paragraph color="$color10">No results found</Paragraph>
                <Paragraph color="$color10">User is not a member of Tamagui</Paragraph>
              </YStack>
            ) : null}
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
      rounded="$4"
      p="$3"
      items="center"
      justify="space-between"
    >
      <XStack items="center" gap="$3">
        <Avatar circular size="$3">
          <Avatar.Image source={{ uri: user.avatar_url ?? '' }} />
        </Avatar>
        <YStack>
          <Paragraph>{user.full_name ?? 'Unknown User'}</Paragraph>
          <Paragraph size="$2" color="$color9">
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
        <Button.Text>{isInviting ? 'Inviting...' : 'Invite'}</Button.Text>
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
      rounded="$4"
      p="$3"
      items="center"
      justify="space-between"
    >
      <XStack items="center" gap="$3">
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
          <Paragraph color="$color9" size="$2">
            {member.user?.email}
          </Paragraph>
        </YStack>
      </XStack>

      <XStack items="center" gap="$2">
        <Paragraph size="$2" color="$color9">
          {member.role}
        </Paragraph>
        <Button
          theme="red"
          size="$2"
          onPress={() => removeTeamMember({ team_member_id: member.user?.id ?? '' })}
          disabled={isRemoving}
        >
          <Button.Text>{isRemoving ? 'Removing...' : 'Remove'}</Button.Text>
        </Button>
      </XStack>
    </XStack>
  )
}

const BentoCard = ({
  subscription,
  hasBento,
}: {
  subscription?: Subscription
  hasBento: boolean
}) => {
  const supabase = useSupabaseClient()
  const { onCopy, hasCopied } = useClipboard()

  // user has access if they have active subscription OR lifetime bento
  const hasAccess = !!subscription || hasBento

  const { data, isLoading, mutate } = useSWR(
    hasAccess ? '/api/bento/cli/login' : null,
    async (url) => {
      const response = await authFetch(url)
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

      // create a blob from the response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bento-bundle.zip'
      document.body.appendChild(a)
      a.click()

      // cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to download Bento components. Please try again later.')
    }
  }

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
      actionLabel={hasAccess ? 'Download' : 'Purchase'}
      onAction={
        hasAccess
          ? handleBentoDownload
          : () => {
              paymentModal.show = true
            }
      }
      secondAction={
        hasAccess
          ? {
              label: hasCopied ? 'Copied' : isLoading ? 'Loading...' : `Copy Code`,
              onPress: onCopyCode,
            }
          : null
      }
    />
  )
}

// admin-only tab with sub-tabs for purchases and whitelist management
type Purchase = {
  id: string
  amount: number
  currency: string
  created: number
  description: string | null
  customerEmail: string | null
  customerId: string | null
  supabaseUserId: string | null
  userName: string | null
  githubUsername: string | null
}

type WhitelistEntry = {
  id: number
  github_username: string
  note: string | null
  created_at: string
  created_by: string | null
}

type AdminSubTab = 'purchases' | 'whitelist' | 'parity'

const AdminTab = () => {
  const [subTab, setSubTab] = useState<AdminSubTab>('purchases')

  return (
    <YStack gap="$4">
      <XStack gap="$2" flexWrap="wrap">
        <Button
          size="$3"
          theme={subTab === 'purchases' ? 'accent' : undefined}
          onPress={() => setSubTab('purchases')}
          chromeless={subTab !== 'purchases'}
        >
          <Button.Text>Purchases</Button.Text>
        </Button>
        <Button
          size="$3"
          theme={subTab === 'whitelist' ? 'accent' : undefined}
          onPress={() => setSubTab('whitelist')}
          chromeless={subTab !== 'whitelist'}
        >
          <Button.Text>Whitelist</Button.Text>
        </Button>
        <Button
          size="$3"
          theme={subTab === 'parity' ? 'accent' : undefined}
          onPress={() => setSubTab('parity')}
          chromeless={subTab !== 'parity'}
        >
          <Button.Text>Parity</Button.Text>
        </Button>
      </XStack>

      <Separator />

      {subTab === 'purchases' && <AdminPurchasesSubTab />}
      {subTab === 'whitelist' && <AdminWhitelistSubTab />}
      {subTab === 'parity' && <AdminParitySubTab />}
    </YStack>
  )
}

const AdminPurchasesSubTab = () => {
  const [isImpersonating, setIsImpersonating] = useState<string | null>(null)

  const {
    data: purchasesData,
    isLoading,
    error,
  } = useSWR<{ purchases: Purchase[] }>(
    '/api/admin/recent-purchases?limit=30',
    (url: string) => authFetch(url).then((res) => res.json())
  )

  const handleImpersonate = async (userId: string | null, email: string | null) => {
    if (!userId && !email) {
      alert('Cannot impersonate: no user ID or email found')
      return
    }

    setIsImpersonating(userId || email)

    try {
      const response = await authFetch('/api/admin/impersonate', {
        method: 'POST',
        body: JSON.stringify(userId ? { userId } : { email }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(`Impersonation failed: ${data.error}`)
        setIsImpersonating(null)
        return
      }

      const html = await response.text()
      document.open()
      document.write(html)
      document.close()
    } catch (err) {
      console.error('Impersonation error:', err)
      alert('Failed to impersonate user')
      setIsImpersonating(null)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" p="$6">
        <Spinner size="large" />
        <Paragraph color="$color10" mt="$4">
          Loading recent purchases...
        </Paragraph>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack gap="$4" p="$4">
        <Paragraph color="$red10">Error loading purchases: {error.message}</Paragraph>
      </YStack>
    )
  }

  const purchases = purchasesData?.purchases || []

  return (
    <YStack gap="$6">
      <YStack gap="$2">
        <XStack items="center" gap="$2">
          <Users size={20} />
          <H3>Recent Purchases</H3>
        </XStack>
        <Paragraph color="$color10">
          View recent purchases and impersonate users to debug issues.
        </Paragraph>
      </YStack>

      <YStack gap="$3">
        {purchases.length === 0 ? (
          <Paragraph color="$color10">No recent purchases found.</Paragraph>
        ) : (
          purchases.map((purchase) => (
            <YStack
              key={purchase.id}
              p="$4"
              borderWidth={1}
              borderColor="$color4"
              rounded="$4"
              gap="$2"
            >
              <XStack justify="space-between" items="flex-start">
                <YStack flex={1} gap="$1">
                  <Paragraph fontWeight="bold">
                    {formatCurrency(purchase.amount, purchase.currency)}
                  </Paragraph>
                  <Paragraph size="$2" color="$color10">
                    {formatDate(purchase.created)}
                  </Paragraph>
                  {purchase.description && (
                    <Paragraph size="$2" color="$color9">
                      {purchase.description}
                    </Paragraph>
                  )}
                </YStack>

                <YStack items="flex-end" gap="$1">
                  {purchase.customerEmail && (
                    <Paragraph size="$2">{purchase.customerEmail}</Paragraph>
                  )}
                  {purchase.userName && (
                    <Paragraph size="$2" color="$color10">
                      {purchase.userName}
                    </Paragraph>
                  )}
                  {purchase.githubUsername && (
                    <Paragraph size="$2" color="$color9">
                      @{purchase.githubUsername}
                    </Paragraph>
                  )}
                </YStack>
              </XStack>

              <XStack justify="flex-end" gap="$2">
                <Button
                  size="$2"
                  theme="blue"
                  disabled={!!isImpersonating}
                  onPress={() =>
                    handleImpersonate(purchase.supabaseUserId, purchase.customerEmail)
                  }
                >
                  <Button.Text>
                    {isImpersonating ===
                    (purchase.supabaseUserId || purchase.customerEmail)
                      ? 'Impersonating...'
                      : 'Impersonate'}
                  </Button.Text>
                </Button>
              </XStack>
            </YStack>
          ))
        )}
      </YStack>
    </YStack>
  )
}

const AdminWhitelistSubTab = () => {
  const [newUsername, setNewUsername] = useState('')
  const [newNote, setNewNote] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const {
    data: whitelistData,
    isLoading,
    error,
    mutate: mutateWhitelist,
  } = useSWR<{ whitelist: WhitelistEntry[] }>('/api/admin/whitelist', (url: string) =>
    authFetch(url).then((res) => res.json())
  )

  const handleAdd = async () => {
    if (!newUsername.trim()) return

    setIsAdding(true)
    try {
      const response = await authFetch('/api/admin/whitelist', {
        method: 'POST',
        body: JSON.stringify({
          github_username: newUsername.trim(),
          note: newNote.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(`Failed to add: ${data.error}`)
        return
      }

      setNewUsername('')
      setNewNote('')
      mutateWhitelist()
    } catch (err) {
      console.error('Error adding to whitelist:', err)
      alert('Failed to add to whitelist')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (entry: WhitelistEntry) => {
    if (!confirm(`Remove @${entry.github_username} from whitelist?`)) return

    setDeletingId(entry.id)
    try {
      const response = await authFetch('/api/admin/whitelist', {
        method: 'DELETE',
        body: JSON.stringify({ id: entry.id }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(`Failed to remove: ${data.error}`)
        return
      }

      mutateWhitelist()
    } catch (err) {
      console.error('Error removing from whitelist:', err)
      alert('Failed to remove from whitelist')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" p="$6">
        <Spinner size="large" />
        <Paragraph color="$color10" mt="$4">
          Loading whitelist...
        </Paragraph>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack gap="$4" p="$4">
        <Paragraph color="$red10">Error loading whitelist: {error.message}</Paragraph>
      </YStack>
    )
  }

  const whitelist = whitelistData?.whitelist || []

  return (
    <YStack gap="$6">
      <YStack gap="$2">
        <XStack items="center" gap="$2">
          <Gift size={20} />
          <H3>Pro Whitelist</H3>
        </XStack>
        <Paragraph color="$color10">
          Grant pro access to GitHub users (contributors, partners, etc).
        </Paragraph>
      </YStack>

      <YStack gap="$3" p="$4" borderWidth={1} borderColor="$color4" rounded="$4">
        <Paragraph fontWeight="bold" size="$3">
          Add to whitelist
        </Paragraph>
        <XStack gap="$3" flexWrap="wrap">
          <Input
            flex={1}
            minWidth={150}
            placeholder="GitHub username"
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <Input
            flex={1}
            minWidth={150}
            placeholder="Note (optional)"
            value={newNote}
            onChangeText={setNewNote}
          />
          <Button
            theme="green"
            disabled={!newUsername.trim() || isAdding}
            onPress={handleAdd}
            icon={isAdding ? <Spinner size="small" /> : <Plus size={16} />}
          >
            <Button.Text>Add</Button.Text>
          </Button>
        </XStack>
      </YStack>

      <YStack gap="$3">
        {whitelist.length === 0 ? (
          <Paragraph color="$color10">No whitelisted users.</Paragraph>
        ) : (
          whitelist.map((entry) => (
            <XStack
              key={entry.id}
              p="$3"
              borderWidth={1}
              borderColor="$color4"
              rounded="$4"
              items="center"
              justify="space-between"
              gap="$3"
            >
              <YStack flex={1} gap="$1">
                <Paragraph fontWeight="bold">@{entry.github_username}</Paragraph>
                {entry.note && (
                  <Paragraph size="$2" color="$color10">
                    {entry.note}
                  </Paragraph>
                )}
                <Paragraph size="$1" color="$color9">
                  Added {new Date(entry.created_at).toLocaleDateString()}
                </Paragraph>
              </YStack>

              <Button
                size="$2"
                theme="red"
                disabled={deletingId === entry.id}
                onPress={() => handleDelete(entry)}
                icon={
                  deletingId === entry.id ? (
                    <Spinner size="small" />
                  ) : (
                    <Trash2 size={14} />
                  )
                }
              >
                <Button.Text>Remove</Button.Text>
              </Button>
            </XStack>
          ))
        )}
      </YStack>
    </YStack>
  )
}

// sample countries from each parity tier for quick testing
const PARITY_SAMPLE_COUNTRIES = {
  '40% off': ['IN', 'PK', 'UA', 'VN', 'PH'],
  '30% off': ['BR', 'MX', 'AR', 'TR', 'ZA'],
  '25% off': ['CN', 'TW', 'KR', 'IT', 'ES'],
  '15% off': ['DE', 'FR', 'JP', 'SE', 'NL'],
  '0% (no discount)': ['US', 'GB', 'AU', 'CA', 'CH'],
}

function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const code = countryCode.toUpperCase()
  const offset = 127397
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset)
}

const AdminParitySubTab = () => {
  const { parityDeals } = useParityDiscount()
  const [currentOverride, setCurrentOverride] = useState<string | null>(null)

  useEffect(() => {
    setCurrentOverride(getParityCountryOverride())
  }, [])

  const handleSetCountry = (countryCode: string) => {
    setParityCountryOverride(countryCode)
    setCurrentOverride(countryCode)
  }

  const handleClearOverride = () => {
    setParityCountryOverride(null)
    setCurrentOverride(null)
  }

  return (
    <YStack gap="$6">
      <YStack gap="$2">
        <H3>Parity Pricing Preview</H3>
        <Paragraph color="$color10">
          Test how the site appears to users from different countries. This only affects
          the UI preview — actual payments still use real geo-detection.
        </Paragraph>
      </YStack>

      {/* current status */}
      <YStack
        bg={currentOverride ? '$yellow3' : '$green3'}
        rounded="$4"
        borderWidth={0.5}
        borderColor={currentOverride ? '$yellow8' : '$green8'}
        p="$3"
        gap="$3"
      >
        <XStack gap="$3" items="center" flexWrap="wrap">
          <Paragraph
            size="$4"
            color={currentOverride ? '$yellow11' : '$green11'}
            flex={1}
          >
            {currentOverride ? (
              <>
                Viewing as:{' '}
                <Paragraph fontWeight="bold">
                  {countryCodeToFlag(currentOverride)}{' '}
                  {COUNTRY_NAMES[currentOverride] || currentOverride} (
                  {getParityDiscountForCountry(currentOverride)}% off)
                </Paragraph>
              </>
            ) : (
              'No override active — using real location'
            )}
          </Paragraph>
          {currentOverride && (
            <Button size="$2" theme="red" onPress={handleClearOverride}>
              <Button.Text>Clear Override</Button.Text>
            </Button>
          )}
        </XStack>
      </YStack>

      {/* current parity deals display */}
      {parityDeals && (
        <XStack bg="$color2" rounded="$4" borderWidth={0.5} borderColor="$color5" p="$3">
          <Paragraph size="$3" color="$color11">
            Current parity: {parityDeals.flag} {parityDeals.country} —{' '}
            {parityDeals.discountPercentage}% discount
          </Paragraph>
        </XStack>
      )}

      {/* quick select by tier */}
      <YStack gap="$4">
        {Object.entries(PARITY_SAMPLE_COUNTRIES).map(([tierLabel, countries]) => (
          <YStack key={tierLabel} gap="$2">
            <Paragraph fontWeight="600" size="$3" color="$color10">
              {tierLabel}
            </Paragraph>
            <XStack gap="$2" flexWrap="wrap">
              {countries.map((code) => {
                const isActive = currentOverride === code
                return (
                  <Button
                    key={code}
                    size="$3"
                    bg={isActive ? '$color8' : '$color3'}
                    onPress={() => handleSetCountry(code)}
                  >
                    <Button.Text>
                      {countryCodeToFlag(code)} {COUNTRY_NAMES[code] || code}
                    </Button.Text>
                  </Button>
                )
              })}
            </XStack>
          </YStack>
        ))}
      </YStack>
    </YStack>
  )
}
