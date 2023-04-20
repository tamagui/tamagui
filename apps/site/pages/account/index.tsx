import { Container } from '@components/Container'
import { getAuthLayout } from '@components/layouts/AuthLayout'
import { getUserLayout } from '@components/layouts/UserLayout'
import { Star } from '@tamagui/lucide-icons'
import { ButtonLink } from 'app/Link'
import { useUser } from 'hooks/useUser'
import { Spinner } from 'tamagui'
import {
  Avatar,
  Button,
  H3,
  Paragraph,
  Separator,
  SizableStack,
  SizableText,
  Tabs,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

export default function Page() {
  const { isLoading, userDetails, accessStatus } = useUser()
  if (isLoading) return <Spinner my="$10" />

  return (
    <Container>
      <XStack my="$10" space>
        <Avatar circular size="$10">
          <Avatar.Image source={userDetails?.avatar_url} />
        </Avatar>
        <YStack space="$1" ai="flex-start" jc="center">
          <H3>{userDetails?.full_name}</H3>
          {accessStatus?.isSponsor && <SponsorBadge />}
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
      Sponsor
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
        {/* <Tabs.Tab value="connections">
          <SizableText size="$4">Connections</SizableText>
        </Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Content p="$4" value="profile">
        <ProfileContent />
      </Tabs.Content>
      <Tabs.Content p="$4" value="sponsorship">
        <SponsorshipContent />
      </Tabs.Content>
      {/* <Tabs.Content p="$4" value="connections">
        <ConnectionsContent />
      </Tabs.Content> */}
    </Tabs>
  )
}

const ProfileContent = () => {
  const { user, userDetails } = useUser()
  const info = {
    Name: userDetails?.full_name,
    Email: user?.email,
  }

  return (
    <YStack space="$2">
      {Object.entries(info).map(([key, value]) => (
        <XStack key={key} space>
          <SizableText fontWeight="900">{key}</SizableText>
          <SizableText>{value}</SizableText>
        </XStack>
      ))}
    </YStack>
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
        <Theme inverse>
          <ButtonLink href="https://github.com/sponsors/natew" mx="auto">
            Sponsor Tamagui
          </ButtonLink>
        </Theme>
      </YStack>
    )
  }

  return (
    <YStack>
      <Paragraph>You are an sponsor</Paragraph>
    </YStack>
  )
}

const ConnectionsContent = () => {
  return (
    <YStack>
      <SizableText>WIP</SizableText>
    </YStack>
  )
}

Page.getLayout = getUserLayout
