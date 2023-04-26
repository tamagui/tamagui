import { Container } from '@components/Container'
import { GithubIcon } from '@components/GithubIcon'
import { getUserLayout } from '@components/layouts/UserLayout'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Provider } from '@supabase/supabase-js'
import { LogOut, Star } from '@tamagui/lucide-icons'
import { ButtonLink } from 'app/Link'
import { useUser } from 'hooks/useUser'
import { useState } from 'react'
import {
  Avatar,
  Button,
  H3,
  Paragraph,
  SizableText,
  Tabs,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { UserAccessStatus } from 'types'

export default function Page() {
  const { userDetails, accessStatus } = useUser()

  return (
    <Container f={1}>
      <XStack my="$10" space>
        <Avatar circular size="$10">
          <Avatar.Image source={userDetails?.avatar_url} />
        </Avatar>
        <YStack space="$1" ai="flex-start" jc="center">
          <H3>{userDetails?.full_name}</H3>
          {accessStatus?.githubStatus.personal?.isSponsoring && <SponsorBadge />}
          {accessStatus?.githubStatus.orgs.map((org) => (
            <TeamBadge key={org.id} org={org} />
          ))}
        </YStack>
      </XStack>

      <YStack>
        <UserSettings />
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
  org: UserAccessStatus['githubStatus']['orgs'][number]
}) => {
  return (
    <Button
      theme="blue"
      disabled
      icon={
        <Avatar circular>
          <Avatar.Image source={{ uri: org.avatarUrl }} />
        </Avatar>
      }
      size="$2"
    >
      {org.name} Team (Sponsor)
    </Button>
  )
}

const UserSettings = () => {
  return (
    <Tabs
      size="$4"
      defaultValue="profile"
      orientation="horizontal"
      flexDirection="column"
    >
      <Tabs.List backgroundColor="transparent" scrollable>
        <Tabs.Tab value="profile">
          <SizableText size="$4">Profile</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="sponsorship">
          <SizableText size="$4">Sponsorship Status</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="connections">
          <SizableText size="$4">Connections</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="account">
          <SizableText size="$4">Account</SizableText>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Content p="$4" value="profile">
        <ProfileContent />
      </Tabs.Content>
      <Tabs.Content p="$4" value="sponsorship">
        <SponsorshipContent />
      </Tabs.Content>
      <Tabs.Content p="$4" value="connections">
        <ConnectionsContent />
      </Tabs.Content>
      <Tabs.Content p="$4" value="account">
        <AccountContent />
      </Tabs.Content>
    </Tabs>
  )
}

const ProfileContent = () => {
  const { user, userDetails } = useUser()

  return (
    <Table
      data={{
        Name: userDetails?.full_name,
        Email: user?.email,
        'Auth Provider': user?.app_metadata.provider,
      }}
    />
  )
}

const SponsorshipContent = () => {
  const { accessStatus } = useUser()
  // {/* TODO: get info of sponsorship here... tier, etc. */}

  if (!accessStatus?.isSponsor) {
    return (
      <YStack space="$2" ai="center">
        <Paragraph>
          You are not an sponsor. Become an sponsor to access exclusive features!
        </Paragraph>
        <ButtonLink
          href="https://github.com/sponsors/natew"
          theme="pink_alt1"
          icon={<Star />}
          size="$3"
        >
          Sponsor Tamagui
        </ButtonLink>
      </YStack>
    )
  }

  return (
    <YStack space>
      {accessStatus.githubStatus.personal?.isSponsoring && (
        <Paragraph>You are a personal sponsor.</Paragraph>
      )}
      {accessStatus.githubStatus.orgs.map((org) => (
        <Paragraph key={org.id}>
          You are a member of a sponsoring organization, {org.name}.
        </Paragraph>
      ))}
    </YStack>
  )
}

const ConnectionsContent = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    content: '',
    type: '',
  })
  const supabaseClient = useSupabaseClient()
  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/studio?test=true`,
        scopes: 'read:org',
      },
    })
    if (error) {
      setMessage({ type: 'error', content: error.message })
    }
    setLoading(false)
  }
  return (
    <Table
      data={{
        GitHub: (
          <Theme name="dark">
            <Button
              disabled={loading}
              onPress={() => handleOAuthSignIn('github')}
              size="$3"
              icon={GithubIcon}
            >
              {user?.app_metadata.provider === 'github'
                ? 'Reconnect GitHub'
                : 'Connect GitHub'}
            </Button>
          </Theme>
        ),
      }}
    />
  )
}

const AccountContent = () => {
  const supabaseClient = useSupabaseClient()
  return (
    <Button
      theme="red_alt1"
      onPress={() => {
        supabaseClient.auth.signOut()
      }}
      icon={<LogOut />}
      size="$3"
      mx="auto"
    >
      Logout
    </Button>
  )
}

const Table = ({ data }: { data: Record<string, any> }) => {
  return (
    <YStack space="$2">
      {Object.entries(data).map(([key, value]) => (
        <XStack key={key} space>
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

Page.getLayout = getUserLayout
