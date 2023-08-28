import {
  Adapt,
  Avatar,
  Button,
  ButtonProps,
  Popover,
  Separator,
  SizableText,
  StackProps,
  Theme,
  XStack,
  YStack,
  getTokens,
  useThemeName,
} from '@my/ui'
import { Menu, Plus } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'
import { useRouter as useNextRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SolitoImage } from 'solito/image'
import { Link, useLink } from 'solito/link'
import { NavTabs } from './components/nav-tabs.web'

export type HomeLayoutProps = {
  children?: React.ReactNode
  padded?: boolean
  fullPage?: boolean
}

export const HomeLayout = ({ children, fullPage = false, padded = false }: HomeLayoutProps) => {
  return (
    <YStack f={1}>
      <YStack
        gap="$4"
        borderWidth="$0"
        borderBottomColor="$borderColor"
        borderStyle="solid"
        borderBottomWidth="$0.5"
        jc="center"
        px="$4"
        backgroundColor="$color1"
      >
        <XStack jc="space-between" $sm={{ ai: 'center' }} ai="flex-end">
          <YStack $sm={{ display: 'none' }}>
            <NavTabs orientation="horizontal" size="$4" />
          </YStack>
          <YStack $gtSm={{ display: 'none' }}>
            <MobileNavbar>
              <YStack gap="$5" width="100%" alignItems="flex-end">
                <NavTabs orientation="vertical" f={1} width="100%" size="$3" />
                <Separator width="100%" />
                <CtaButton width="100%" />
                <Separator width="100%" />
                <WithUserDetail ai="center" gap="$4">
                  <ProfileButton />
                </WithUserDetail>
              </YStack>
            </MobileNavbar>
          </YStack>
          <XStack ai="center" gap="$4" py="$3">
            <CtaButton />
            <ProfileButton />
          </XStack>
        </XStack>
      </YStack>

      <YStack
        {...(fullPage && { flex: 1 })}
        {...(padded && {
          maxWidth: 800,
          mx: 'auto',
          px: '$2',
          width: '100%',
        })}
      >
        {children}
      </YStack>
    </YStack>
  )
}

const UserAvatar = () => {
  const { avatarUrl } = useUser()

  return (
    <Avatar size="$2" circular>
      <SolitoImage
        src={avatarUrl}
        alt="your avatar"
        width={getTokens().size['2'].val}
        height={getTokens().size['2'].val}
      />
    </Avatar>
  )
}

export const MobileNavbar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const router = useNextRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])
  const themeName = useThemeName()
  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" stayInFrame={{ padding: 20 }}>
      <Popover.Trigger asChild>
        <Button
          chromeless
          p="$2"
          onPress={() => setOpen(!open)}
          theme={open ? 'alt1' : themeName}
          icon={<Menu size={32} />}
        />
      </Popover.Trigger>

      <Adapt platform="web" when="sm">
        <Popover.Sheet zIndex={100000000} modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView>
              <Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay zIndex={100} />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        p={0}
        maxHeight="80vh"
        elevate
        zIndex={100000000}
      >
        <Popover.Arrow borderWidth={1} boc="$borderColor" />

        <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <YStack
            miw={230}
            p="$3"
            ai="flex-end"
            // display={open ? 'flex' : 'none'}
          >
            {children}
          </YStack>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  )
}

const CtaButton = (props: ButtonProps) => (
  <Theme inverse>
    <Button
      {...useLink({ href: '/create' })}
      size="$3"
      space="$1.5"
      my="$-1"
      icon={Plus}
      br="$10"
      {...props}
    >
      Create
    </Button>
  </Theme>
)

const ProfileButton = () => (
  <Link href="/profile">
    <UserAvatar />
  </Link>
)

const WithUserDetail = ({ children, ...props }: StackProps) => {
  const { user, profile } = useUser()

  return (
    <XStack gap="$2" {...props}>
      <YStack ai="flex-end">
        <SizableText size="$5">{profile?.name}</SizableText>
        <SizableText theme="alt1">{user?.email}</SizableText>
      </YStack>
      {children}
    </XStack>
  )
}
