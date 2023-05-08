import { access } from 'fs'

import { Container } from '@components/Container'
import { GithubIcon } from '@components/GithubIcon'
import { getUserLayout } from '@components/layouts/UserLayout'
import { Notice } from '@components/Notice'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { studioRootDir } from '@protected/studio/constants'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Provider } from '@supabase/supabase-js'
import { LogoIcon } from '@tamagui/logo'
import { CheckCircle, LogOut, Space, Star } from '@tamagui/lucide-icons'
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
  Spacer,
  Spinner,
  Theme,
  XStack,
  YStack,
  composeRefs,
} from 'tamagui'
import { UserAccessStatus } from 'types'

import { useHoverGlow } from '../../components/HoverGlow'

export default function Page() {
  return (
    <>
      <TitleAndMetaTags
        title="Account — Tamagui"
        description="A better universal UI system."
      />

      <Account />
    </>
  )
}
const Account = () => {
  const { isLoading, userDetails, accessStatus, signout } = useUser()

  if (isLoading) {
    return <Spinner my="$10" />
  }

  return (
    <Container f={1}>
      <XStack mt="$10" space>
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
          </XStack>
          <XStack space="$2">
            {accessStatus?.githubStatus.personalSponsorship.sponsoring && (
              <SponsorBadge />
            )}
            {accessStatus?.githubStatus.orgs.map((org) => (
              <TeamBadge key={org.id} org={org} />
            ))}

            <ProfileContent />
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
  const { signout } = useUser()

  return (
    <YStack space="$8" separator={<Separator />}>
      <YStack space="$6" id="profile"></YStack>

      <YStack space="$6" id="studio-queue">
        <QueueContent />
      </YStack>

      <YStack space="$6" id="sponsorship-status">
        <SizableText size="$8">Sponsorship Status</SizableText>
        <SponsorshipContent />
      </YStack>

      <YStack space="$6" id="connections">
        <SizableText size="$8">Connections</SizableText>
        <ConnectionsContent />
      </YStack>

      <Button
        f={1}
        onPress={() => {
          signout()
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
  const { user, userDetails } = useUser()

  return (
    <XStack space="$4" separator={<Separator vertical />}>
      <Paragraph theme="alt1">{userDetails?.full_name}</Paragraph>
      <Paragraph theme="alt1">{user?.email}</Paragraph>
    </XStack>
  )
}

const QueueCard = () => {
  const glow = useHoverGlow({
    resist: 65,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: -200,
      y: 200,
    },
  })

  const glow2 = useHoverGlow({
    resist: 80,
    inverse: true,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--blue10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: 200,
      y: -200,
    },
  })

  const glow3 = useHoverGlow({
    resist: 80,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--pink10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: -200,
      y: -200,
    },
  })

  return (
    <YStack
      ref={composeRefs(
        glow.parentRef as any,
        glow2.parentRef as any,
        glow3.parentRef as any
      )}
      p="$4"
      br="$4"
      bw={4}
      boc="$color2"
      w={480}
      h={280}
      als="center"
      ov="hidden"
      elevation="$4"
    >
      <YStack fullscreen br={7} bw={1} boc="$borderColor" />

      <YStack className="rotate-slow-right">{glow.Component()}</YStack>
      <YStack className="rotate-slow-left">{glow2.Component()}</YStack>
      <YStack className="rotate-slow-right">{glow3.Component()}</YStack>

      {[
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
      ].map((deg) => (
        <YStack
          key={deg}
          pos="absolute"
          rotate={`${deg}deg`}
          t="$5"
          l="$5"
          r="$5"
          b="$5"
          br="$3"
          boc="$color8"
          o={0.2}
          bw={1}
          scale={1.3}
        />
      ))}

      <YStack>
        <Paragraph size="$8">Studio</Paragraph>
        <Paragraph theme="alt2" size="$3">
          In queue for access around June
        </Paragraph>
      </YStack>

      <Spacer flex />

      <Paragraph pos="absolute" size="$12" b="$6" l="$15" scale={4} o={0.015} fow="900">
        100
      </Paragraph>

      <XStack pb="$1" ai="flex-end">
        <Paragraph als="flex-start" mr="$1" size="$6" o={0.35} ml="$-1">
          #
        </Paragraph>
        <Paragraph my="$-3" size="$12" fow="900">
          100
        </Paragraph>

        <Spacer flex />

        <YStack pb="$2">
          <LogoIcon />
        </YStack>
      </XStack>
    </YStack>
  )
}

const QueueContent = () => {
  const { accessStatus } = useUser()

  if (!accessStatus) {
    return <Spinner />
  }

  if (accessStatus.access.studio.access) {
    return (
      <YStack space ai="flex-start">
        <SizableText>You have access to studio!</SizableText>
        <ButtonLink themeInverse href={studioRootDir}>
          Enter Studio
        </ButtonLink>
      </YStack>
    )
  }

  return <QueueCard />

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
  const { accessStatus } = useUser()
  // {/* TODO: get info of sponsorship here... tier, etc. */}

  if (!accessStatus?.access.sponsoring) {
    return (
      <YStack space="$4" ai="flex-start">
        <SponsorButton />
        <YStack space>
          <Paragraph size="$6">
            You are not an sponsor. Become an sponsor to get early access to the studio
            and other upcoming features.
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
    <YStack>
      {accessStatus.githubStatus.personalSponsorship.sponsoring && (
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

const SponsorButton = () => {
  return (
    <ButtonLink
      href="https://github.com/sponsors/natew"
      theme="pink_alt1"
      icon={<Star />}
      size="$3"
    >
      Sponsor Tamagui
    </ButtonLink>
  )
}

Page.getLayout = getUserLayout
