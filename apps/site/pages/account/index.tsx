import { Container } from '@components/Container'
import { GithubIcon } from '@components/GithubIcon'
import { getUserLayout } from '@components/layouts/UserLayout'
import { Notice } from '@components/Notice'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Provider } from '@supabase/supabase-js'
import { Check, CheckCircle, LogOut, Star } from '@tamagui/lucide-icons'
import { ButtonLink } from 'app/Link'
import { useUser } from 'hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Avatar,
  Button,
  H3,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { UserAccessStatus } from 'types'

export default function Page() {
  const { isLoading, userDetails, accessStatus, signout } = useUser()

  if (isLoading) {
    return <Spinner my="$10" />
  }

  return (
    <Container f={1}>
      <XStack my="$10" space>
        <Avatar circular size="$10">
          <Avatar.Image source={userDetails?.avatar_url} />
        </Avatar>

        <YStack space="$3" ai="flex-start" jc="center" f={1}>
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
            <Button
              f={1}
              onPress={() => {
                signout()
              }}
              icon={<LogOut />}
              size="$2"
              accessibilityLabel="Logout"
              circular
            />
          </XStack>
          <XStack space="$2">
            {accessStatus?.githubStatus.personal?.isSponsoring && <SponsorBadge />}
            {accessStatus?.githubStatus.orgs.map((org) => (
              <TeamBadge key={org.id} org={org} />
            ))}
          </XStack>
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
    <YStack space="$8" separator={<Separator />}>
      <YStack space="$6" id="profile">
        <SizableText size="$8">Profile</SizableText>
        <ProfileContent />
      </YStack>

      <YStack space="$6" id="sponsorship-status">
        <SizableText size="$8">Sponsorship Status</SizableText>
        <SponsorshipContent />
      </YStack>

      <YStack space="$6" id="connections">
        <SizableText size="$8">Connections</SizableText>
        <ConnectionsContent />
      </YStack>
    </YStack>
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
      <YStack space="$4" ai="flex-start">
        <ButtonLink
          href="https://github.com/sponsors/natew"
          theme="pink_alt1"
          icon={<Star />}
          size="$3"
        >
          Sponsor Tamagui
        </ButtonLink>
        <YStack>
          <Paragraph>
            You are not an sponsor. Become an sponsor to access exclusive features!
          </Paragraph>
          <Paragraph color="$color11">
            If you're a member of an organization that is sponsoring Tamagui, make sure
            tamagui has access to that org{' '}
            <Link
              style={{ color: 'var(--color)' }}
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
    <YStack>
      {accessStatus.githubStatus.personal?.isSponsoring && (
        <Paragraph>You are a personal sponsor.</Paragraph>
      )}
      {accessStatus.githubStatus.orgs.map((org) => (
        <Paragraph key={org.id}>
          You are a member of a sponsoring organization,{' '}
          <Link
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            {org.name}
          </Link>
          .
        </Paragraph>
      ))}
    </YStack>
  )
}

const ConnectionsContent = () => {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    content: '',
    type: '',
  })
  const supabaseClient = useSupabaseClient()

  const handleOAuthSignIn = async (provider: Provider) => {
    if (user?.app_metadata.provider === 'github') {
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
  return (
    <YStack>
      {message.content && (
        <Notice>
          <Paragraph>{message.content}</Paragraph>
        </Notice>
      )}
      <Table
        data={{
          GitHub: (
            <Theme name="dark">
              <Button
                disabled={loading}
                onPress={() => handleOAuthSignIn('github')}
                size="$3"
                icon={GithubIcon}
                iconAfter={CheckCircle}
              >
                {user?.app_metadata.provider === 'github'
                  ? 'Connected'
                  : 'Connect GitHub'}
              </Button>
            </Theme>
          ),
        }}
      />
    </YStack>
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
