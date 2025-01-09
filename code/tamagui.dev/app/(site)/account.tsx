import type { Provider } from '@supabase/supabase-js'
import { ThemeTint } from '@tamagui/logo'
import { CheckCircle, LogOut, Star } from '@tamagui/lucide-icons'
import { useRouter } from 'one'
import { useState } from 'react'
import {
  Avatar,
  Button,
  H3,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  XStack,
  YStack,
} from 'tamagui'
import { Container } from '~/components/Containers'
import { ButtonLink, Link } from '~/components/Link'
import { Notice } from '~/components/Notice'
import { useSupabaseClient } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { StudioQueueCard } from '~/features/studio/StudioQueueCard'
import type { Database } from '~/features/supabase/types'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { UserGuard, useUser } from '~/features/user/useUser'

export default function AccountPage() {
  return (
    <>
      <UserGuard>
        <Account />
      </UserGuard>
    </>
  )
}

const Account = () => {
  const { isLoading, data } = useUser()

  if (isLoading || !data) {
    return <Spinner my="$10" />
  }

  const { userDetails, user, teams } = data

  return (
    <Container gap="$4" f={1}>
      <XStack mt="$10" gap="$4">
        <Avatar circular size="$10">
          <Avatar.Image
            source={{
              width: 104,
              height: 104,
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
                style={{
                  // @ts-ignore
                  wordBreak: 'break-word',
                }}
              >
                {userDetails?.full_name}
              </H3>
            </YStack>
          </XStack>

          <YStack gap="$2">
            {teams.personal?.is_active && <SponsorBadge />}
            {teams.orgs
              ?.filter((team) => team.is_active)
              .map((org) => (
                <TeamBadge key={org.id} org={org} />
              ))}
          </YStack>
          <XStack>
            <ProfileContent />
          </XStack>
        </YStack>
      </XStack>

      <Separator />

      <XStack mt="$4" gap="$4" ai="flex-start">
        <ThemeTint>
          <ButtonLink href="/account/items" size="$5">
            Items & Subscriptions
          </ButtonLink>
        </ThemeTint>
      </XStack>

      <YStack>
        <UserSettings />
      </YStack>

      <YStack separator={<Separator />} gap="$5">
        <Paragraph ff="$mono">User ID: {userDetails?.id}</Paragraph>
      </YStack>
    </Container>
  )
}

const SponsorBadge = () => {
  return (
    <Button theme="yellow" disabled icon={Star} size="$2">
      Personal Sponsor
    </Button>
  )
}

const TeamBadge = ({
  org,
}: {
  org: Pick<Database['public']['Tables']['teams']['Row'], 'name'>
}) => {
  return (
    <Button
      theme="blue"
      disabled
      // icon={
      //   <Avatar circular>
      //     <Avatar.Image source={{ uri: org.avatarUrl }} />
      //   </Avatar>
      // }
      size="$2"
    >
      <Button.Text size="$2">{org.name} Team (Sponsor)</Button.Text>
    </Button>
  )
}

const UserSettings = () => {
  return (
    <YStack gap="$8" separator={<Separator />}>
      <YStack gap="$6" id="profile"></YStack>

      {/* <YStack gap="$6" id="studio-queue">
        <QueueContent />
      </YStack> */}

      <YStack gap="$6" id="sponsorship-status">
        <SizableText size="$8">Sponsorship Status</SizableText>
        <SponsorshipContent />
      </YStack>

      <YStack gap="$6" id="connections">
        <SizableText size="$8">Connections</SizableText>
        <ConnectionsContent />
      </YStack>

      <Button
        f={1}
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
  )
}

const ProfileContent = () => {
  const { data } = useUser()

  if (!data) return null
  const { user, userDetails } = data

  return (
    <XStack gap="$4" separator={<Separator vertical />}>
      {!!userDetails?.full_name && (
        <Paragraph theme="alt1">{userDetails?.full_name}</Paragraph>
      )}
      <Paragraph theme="alt1">{user?.email}</Paragraph>
    </XStack>
  )
}

const QueueContent = () => {
  const { data } = useUser()
  if (!data) return null

  const { teams } = data

  // if (accessStatus.access.studio.access) {
  //   return (
  //     <YStack space ai="flex-start">
  //       <SizableText>You have access to studio!</SizableText>
  //       <ButtonLink themeInverse href={studioRootDir}>
  //         Enter Studio
  //       </ButtonLink>
  //     </YStack>
  //   )
  // }

  if (!teams.main) return null

  return (
    <YStack gap="$4">
      <StudioQueueCard key={teams.main.id} teamId={teams.main.id} />
    </YStack>
  )

  // return (
  //   <YStack ai="flex-start" space>
  //     <SizableText>
  //       {accessStatus.access.studio.message} - You will get access{' '}
  //       {Intl.DateTimeFormat('en-US', {
  //         month: 'short',
  //         year: 'numeric',
  //         day: 'numeric',
  //       }).format(new Date(accessStatus.access.studio.accessDate))}
  //     </SizableText>
  //     <SponsorButton />
  //   </YStack>
  // )
}

const SponsorshipContent = () => {
  const { data } = useUser()
  if (!data) return null
  const { teams } = data
  // {/* TODO: get info of sponsorship here... tier, etc. */}

  if (!teams.main?.is_active) {
    return (
      <YStack gap="$4" ai="flex-start">
        <SponsorButton />
        <YStack space>
          <Paragraph size="$6">
            You are not a sponsor. Become a sponsor to get early access to the studio and
            other upcoming features.
          </Paragraph>
          <Paragraph size="$5" theme="alt1">
            If you're a member of an organization that is sponsoring Tamagui, make sure
            tamagui has access to that org{' '}
            <Link
              style={{ color: 'var(--color12)' }}
              href={`https://github.com/settings/connections/applications/${process.env.NEXT_PUBLIC_GITHUB_AUTH_CLIENT_ID}`}
            >
              here
            </Link>
            .
          </Paragraph>
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <YStack>
        {teams.personal?.is_active && (
          <Paragraph>You are a personal sponsor. Thank you!</Paragraph>
        )}
        {teams.orgs?.map((org) => (
          <Paragraph key={org.id}>
            You are a member of a sponsoring organization, {org.name}.
          </Paragraph>
        ))}
      </YStack>
    </YStack>
  )
}

const SyncSponsorshipButton = () => {
  const [loading, setLoading] = useState(false)
  const syncWithGithub = async () => {
    setLoading(true)
    await fetch('/api/account-sync', { method: 'POST' })
      .then(() => {
        location.reload()
      })
      .finally(() => setLoading(false))
  }
  return (
    <Button
      theme="dark"
      size="$3"
      disabled={loading}
      onPress={syncWithGithub}
      iconAfter={loading ? <Spinner /> : null}
      {...(loading ? { opacity: 0.5 } : {})}
    >
      Sync With GitHub Sponsors
    </Button>
  )
}

const ConnectionsContent = () => {
  return (
    <YStack>
      <Table
        data={{
          GitHub: <GithubConnection />,
        }}
      />
    </YStack>
  )
}

const GithubConnection = () => {
  const { data } = useUser()
  if (!data) return null
  const connectedGithub = data.connections.github
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    content: '',
    type: '',
  })
  const supabaseClient = useSupabaseClient()

  const handleOAuthSignIn = async (provider: Provider) => {
    if (connectedGithub) {
      router.push(
        `https://github.com/settings/connections/applications/${process.env.NEXT_PUBLIC_GITHUB_AUTH_CLIENT_ID}`
      )
      return
    }
    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/account`,
        scopes: 'read:org',
      },
    })
    if (error) {
      setMessage({ type: 'error', content: error.message })
    }
    setLoading(false)
  }

  if (message.content) {
    return (
      <Notice>
        <Paragraph>{message.content}</Paragraph>
      </Notice>
    )
  }

  return (
    <XStack gap="$2">
      <Button
        theme="dark"
        disabled={loading}
        onPress={() => handleOAuthSignIn('github')}
        size="$3"
        icon={GithubIcon}
        iconAfter={connectedGithub ? CheckCircle : null}
      >
        {connectedGithub ? 'Connected' : 'Connect GitHub'}
      </Button>

      <SyncSponsorshipButton />
    </XStack>
  )
}

const Table = ({ data }: { data: Record<string, any> }) => {
  return (
    <YStack gap="$2">
      {Object.entries(data).map(([key, value]) => (
        <XStack key={key} gap="$4">
          <SizableText f={1} fb={0}>
            {key}
          </SizableText>
          <XStack f={3} fb={0}>
            {typeof value === 'string' ? (
              <SizableText fontWeight="$10">{value}</SizableText>
            ) : (
              value
            )}
          </XStack>
        </XStack>
      ))}
    </YStack>
  )
}

const SponsorButton = () => {
  return (
    <ButtonLink
      href="https://github.com/sponsors/natew"
      theme="pink"
      icon={<Star />}
      size="$3"
    >
      Sponsor Tamagui
    </ButtonLink>
  )
}
