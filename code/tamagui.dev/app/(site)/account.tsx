import { LogOut } from '@tamagui/lucide-icons-2'
import { useRouter } from 'one'
import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import { Avatar, H1, H3, Paragraph, Separator, Spinner, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { HeadInfo } from '~/components/HeadInfo'
import { authFetch } from '~/features/api/authFetch'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { navigateToInternalPath } from '~/features/security/navigation'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'

export default function AccountPage() {
  const router = useRouter()
  const { data, isLoading } = useUser()

  useEffect(() => {
    if (isLoading) return
    if (!data?.user) {
      router.push('/login')
    }
  }, [data, isLoading, router])

  if (isLoading || !data?.user) {
    return (
      <>
        <HeadInfo title="Account" />
        <YStack items="center" flex={1} justify="center">
          <Spinner size="large" />
        </YStack>
      </>
    )
  }

  const { user, userDetails, githubUsername, subscriptions } = data
  const active = (subscriptions ?? []).filter(
    (sub) =>
      sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due'
  )

  return (
    <>
      <HeadInfo title="Account" />

      <YStack mx="auto" maxW={640} width="100%" px="4" py="10" gap="6">
        <H1 size="9">Account</H1>

        <XStack gap="4" items="center">
          <Avatar circular size="6">
            <Avatar.Image
              source={{
                width: 60,
                height: 60,
                uri:
                  userDetails?.avatar_url ??
                  getDefaultAvatarImage(userDetails?.full_name ?? user.email ?? 'User'),
              }}
            />
          </Avatar>

          <YStack flex={1} gap="1">
            {userDetails?.full_name && <H3 size="6">{userDetails.full_name}</H3>}
            <Paragraph color="color10">{user.email}</Paragraph>
            {githubUsername && (
              <Paragraph color="color9" size="2">
                GitHub: @{githubUsername}
              </Paragraph>
            )}
          </YStack>

          <LogoutButton />
        </XStack>

        {active.length > 0 && (
          <>
            <Separator />
            <YStack gap="4">
              <Paragraph color="color10" size="3">
                Tamagui is free — everything on this site is open to everyone. These are
                subscriptions from before that change, kept here so you can cancel them.
              </Paragraph>
              {active.map((sub) => (
                <SubscriptionRow key={sub.id} subscription={sub} />
              ))}
            </YStack>
          </>
        )}
      </YStack>
    </>
  )
}

const LogoutButton = () => {
  const supabase = useSupabaseClient()

  return (
    <Button
      size="3"
      icon={<LogOut />}
      aria-label="Logout"
      onPress={async () => {
        await supabase?.auth.signOut()
        await fetch('/api/logout', { method: 'POST' })
        await mutate('user', null)
        navigateToInternalPath('/')
      }}
    >
      <Button.Text>Logout</Button.Text>
    </Button>
  )
}

type Subscription = NonNullable<
  ReturnType<typeof useUser>['data']
>['subscriptions'] extends (infer T)[] | null | undefined
  ? T
  : never

const SubscriptionRow = ({ subscription }: { subscription: Subscription }) => {
  const { refresh } = useUser()
  const [isCancelling, setIsCancelling] = useState(false)

  const endsAt = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null

  return (
    <YStack
      gap="2"
      p="4"
      bg="color2"
      rounded="4"
      borderWidth={1}
      borderColor="border-color"
    >
      <XStack items="center" justify="space-between" gap="4">
        <Paragraph fontWeight="600">{subscription.status}</Paragraph>
        {endsAt && (
          <Paragraph color="color10" size="2">
            {subscription.cancel_at_period_end ? 'ends' : 'renews'} {endsAt}
          </Paragraph>
        )}
      </XStack>

      {!subscription.cancel_at_period_end && (
        <Button
          theme="red"
          size="3"
          self="flex-start"
          disabled={isCancelling}
          onPress={async () => {
            if (!window.confirm('Cancel this subscription?')) return
            setIsCancelling(true)
            try {
              const res = await authFetch('/api/cancel-subscription', {
                method: 'POST',
                body: JSON.stringify({ subscription_id: subscription.id }),
              })
              const body = await res.json().catch(() => ({}) as any)
              if (!res.ok) {
                alert(
                  `Couldn't cancel: ${body.error || body.message || res.status}. Email support@tamagui.dev and we'll cancel it for you.`
                )
                return
              }
              refresh()
            } finally {
              setIsCancelling(false)
            }
          }}
        >
          <Button.Text>Cancel subscription</Button.Text>
        </Button>
      )}
    </YStack>
  )
}
