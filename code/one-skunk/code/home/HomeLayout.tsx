import type { ReactNode } from 'react'
import {
  createStyledContext,
  isTouchable,
  ScrollView,
  SizableText,
  styled,
  View,
  type ViewProps,
  XStack,
  YStack,
} from 'tamagui'
import { type Href, Link, Slot, usePathname } from 'one'
import { Logo } from '../brand/Logo'
import { useToggleTheme } from '../theme/ToggleThemeButton'
import { HomeIcons } from './HomeIcons'

const Context = createStyledContext({
  isVertical: false,
})

export function HomeLayout() {
  return (
    <Context.Provider isVertical={isTouchable}>
      {isTouchable ? <HomeLayoutTouch /> : <HomeLayoutMouse />}
    </Context.Provider>
  )
}

function HomeLayoutTouch() {
  return (
    <YStack f={1}>
      <XStack ai="center" jc="space-between" py="$1" px="$4" bbc="$borderColor" bbw={1}>
        <Logo />
        <ToggleThemeLink f={0} />
      </XStack>

      <YStack f={1}>
        <ScrollView>
          <Slot />
        </ScrollView>
      </YStack>

      <XStack ai="center" jc="space-around" btw={1} btc="$borderColor" py="$1" gap="$1">
        <NavLinks />
      </XStack>
    </YStack>
  )
}

function HomeLayoutMouse() {
  return (
    <XStack f={1} mah="100vh">
      <YStack
        miw={220}
        ai="center"
        brw={1}
        brc="$borderColor"
        px="$2"
        py="$4"
        gap="$1"
        $xs={{
          miw: 'auto',
        }}
      >
        <XStack
          mb="$3"
          $xs={{
            w: '$5',
            h: '$5',
            ai: 'center',
            jc: 'center',
          }}
        >
          <Logo />
        </XStack>

        <NavLinks />

        <View flex={1} />

        <ToggleThemeLink />
      </YStack>

      <YStack f={1}>
        <ScrollView>
          <Slot />
        </ScrollView>
      </YStack>
    </XStack>
  )
}

function NavLinks() {
  return (
    <>
      <SideMenuLink href="/" subPaths={['/post/']} Icon={HomeIcons.Home}>
        Feed
      </SideMenuLink>

      <SideMenuLink href="/notifications" Icon={HomeIcons.Notifications}>
        Notifications
      </SideMenuLink>

      <SideMenuLink href="/profile" Icon={HomeIcons.User}>
        Profile
      </SideMenuLink>
    </>
  )
}

const IconFrame = styled(View, {
  $gtXs: {
    scale: 0.8,
    m: -5,
  },
})

const ToggleThemeLink = (props: ViewProps) => {
  const { onPress, Icon, setting } = useToggleTheme()
  return (
    <LinkContainer {...props} onPress={onPress}>
      <IconFrame>
        <Icon size={28} />
      </IconFrame>
      <LinkText>
        {setting[0].toUpperCase()}
        {setting.slice(1)}
      </LinkText>
    </LinkContainer>
  )
}

const SideMenuLink = ({
  href,
  subPaths,
  Icon,
  children,
}: {
  subPaths?: string[]
  href: Href
  Icon: (typeof HomeIcons)['Home']
  children: ReactNode
}) => {
  const pathname = usePathname()
  const isActive = pathname === href || subPaths?.some((p) => pathname.startsWith(p))

  return (
    <Link asChild href={href}>
      <LinkContainer isActive={isActive}>
        <IconFrame>
          <Icon size={28} />
        </IconFrame>
        <LinkText>{children}</LinkText>
      </LinkContainer>
    </Link>
  )
}

const LinkText = styled(SizableText, {
  context: Context,
  userSelect: 'none',
  dsp: 'flex',
  f: 10,
  size: '$5',
  cur: 'pointer',
  $xs: {
    display: 'none',
  },

  variants: {
    isVertical: {
      true: {},
    },
  } as const,
})

const LinkContainer = styled(XStack, {
  context: Context,
  tag: 'a',
  className: 'text-decoration-none',
  gap: '$4',
  br: '$6',
  cur: 'pointer',
  ai: 'center',
  hoverStyle: {
    bg: '$color3',
  },
  pressStyle: {
    bg: '$color3',
  },

  variants: {
    isActive: {
      true: {
        backgroundColor: '$color2',
      },
    },

    isVertical: {
      true: {
        f: 1,
        jc: 'center',
        px: '$2',
        py: '$2.5',
      },
      false: {
        w: '100%',
        px: '$4',
        py: '$2.5',

        $xs: {
          p: 0,
          w: '$6',
          h: '$6',
          ai: 'center',
          jc: 'center',
        },
      },
    },
  } as const,
})
