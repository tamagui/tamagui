import { ThemeToggle } from '@components/ThemeToggle'
import { getDefaultAvatarImage } from '@lib/avatar'
import { LogoWords, TamaguiLogo, ThemeTint, useTint } from '@tamagui/logo'
import { Menu, User } from '@tamagui/lucide-icons'
import { useUser } from 'hooks/useUser'
// import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
  Adapt,
  Avatar,
  Button,
  Paragraph,
  Popover,
  Separator,
  Text,
  TooltipGroup,
  TooltipSimple,
  VisuallyHidden,
  XGroup,
  XStack,
  YStack,
  isClient,
  styled,
} from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { DocsMenuContents } from './DocsMenuContents'
import { GithubIcon } from './GithubIcon'
import { HeaderProps } from './HeaderProps'
import { NextLink } from './NextLink'
import { SearchButton } from './SearchButton'
import { SeasonToggleButton } from './SeasonToggleButton'
import { SponsorButton } from './SponsorButton'
import { useDocsMenu } from './useDocsMenu'

export function Header(props: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  if (isClient) {
    React.useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 30)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <>
      <XStack
        // @ts-ignore
        pos="fixed"
        top={0}
        left={0}
        right={0}
        ai="center"
        jc="center"
        zi={50000}
        $gtSm={{
          px: '$4',
        }}
      >
        <XStack
          className={`ease-out all ms200 ${
            isScrolled ? 'blur-medium hover-highlights ' : ''
          }`}
          bbc="$borderColor"
          py="$1"
          y={3}
          ov="hidden"
          width="100%"
          bw={1}
          boc="transparent"
          maw={1120}
          br="$10"
          $sm={{
            br: 0,
            y: 0,
            py: '$2',
          }}
          {...(isScrolled && {
            $gtSm: {
              py: '$2',
              y: 5,
              elevation: '$3',
              boc: '$borderColor',
            },
          })}
        >
          <YStack o={isScrolled ? 0.5 : 0} fullscreen bc="$background" />
          <ContainerLarge>
            <ThemeTint>
              {React.useMemo(
                () => (
                  <HeaderContents floating {...props} />
                ),
                [props]
              )}
            </ThemeTint>
          </ContainerLarge>
        </XStack>
      </XStack>
      <YStack height={54} w="100%" />
    </>
  )
}

const tooltipDelay = { open: 500, close: 150 }

export const HeaderContents = React.memo((props: HeaderProps) => {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isTakeout = router.pathname === '/takeout'
  const { setNextTint } = useTint()
  const userSwr = useUser()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      jc="space-between"
      pos="relative"
      py={props.floating ? 0 : '$2'}
      zi={50000}
    >
      <XStack ai="center" space="$4">
        {isHome ? (
          <YStack my={-20} onPress={setNextTint} px="$3">
            <TamaguiLogo downscale={props.floating ? 2 : 1.5} />
          </YStack>
        ) : (
          <NextLink href="/">
            <YStack px="$3" cur="pointer" my={-20}>
              <TamaguiLogo downscale={props.floating ? 2 : 1.5} />
            </YStack>
          </NextLink>
        )}

        <TooltipGroup delay={tooltipDelay}>
          <XGroup boc="$color2" bw={1} mah={32} bc="transparent" ai="center" size="$3">
            {!isTakeout && (
              <XGroup.Item>
                <ThemeToggle borderWidth={0} chromeless />
              </XGroup.Item>
            )}
            <XGroup.Item>
              <ColorToggleButton borderWidth={0} chromeless />
            </XGroup.Item>
            <XGroup.Item>
              <SeasonToggleButton $xs={{ display: 'none' }} borderWidth={0} chromeless />
            </XGroup.Item>
          </XGroup>
        </TooltipGroup>

        <SearchButton
          size="$2"
          br="$10"
          elevation="$1"
          shadowRadius={6}
          shadowOpacity={0.0025}
        />

        <YStack $xs={{ display: 'none' }}>
          <SponsorButton tiny />
        </YStack>
      </XStack>

      <XStack
        position="absolute"
        className="all ease-in ms150"
        $sm={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <NextLink href="/" aria-label="Homepage">
          <XStack
            cursor={isHome ? 'default' : 'pointer'}
            pointerEvents="auto"
            als="center"
          >
            <LogoWords animated />
          </XStack>
        </NextLink>
      </XStack>

      {/*  prevent layout shift */}
      <XStack
        h={40}
        jc="flex-end"
        miw={160}
        $xs={{ miw: 130 }}
        pointerEvents="auto"
        tag="nav"
      >
        <XStack ai="center" space="$3">
          <HeaderLinks {...props} />

          {userSwr.data?.userDetails && props.showAuth ? (
            <XStack ai="center" space="$2">
              <NextLink href="/account">
                <Avatar circular size="$2">
                  <Avatar.Image
                    source={{
                      uri:
                        userSwr.data.userDetails?.avatar_url ??
                        getDefaultAvatarImage(
                          userSwr.data?.userDetails?.full_name ??
                            userSwr.data?.session?.user?.email ??
                            'User'
                        ),
                    }}
                  />
                </Avatar>
              </NextLink>
            </XStack>
          ) : (
            <NextLink target="_blank" href="https://github.com/tamagui/tamagui">
              <TooltipSimple delay={0} restMs={25} label="Star on Github">
                <YStack p="$2" opacity={0.7} hoverStyle={{ opacity: 1 }}>
                  <VisuallyHidden>
                    <Text>Github</Text>
                  </VisuallyHidden>
                  <GithubIcon width={23} />
                </YStack>
              </TooltipSimple>
            </NextLink>
          )}

          <SmallMenu />
        </XStack>
      </XStack>
    </XStack>
  )
})

const HeaderLinks = ({ showExtra, forceShowAllLinks, showAuth }: HeaderProps) => {
  const userSwr = useUser()
  // there is user context and supabase setup in the current page
  return (
    <>
      <NextLink prefetch={false} href="/docs/intro/installation">
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      <NextLink prefetch={false} href="/studio">
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Studio
        </HeadAnchor>
      </NextLink>

      {showAuth && !userSwr.data?.session?.user && (
        <NextLink prefetch={false} href="/login">
          <HeadAnchor
            $md={{
              display: forceShowAllLinks ? 'flex' : 'none',
            }}
          >
            Login
          </HeadAnchor>
        </NextLink>
      )}

      {process.env.NODE_ENV === 'development' && (
        <NextLink prefetch={false} href="/takeout">
          <TooltipSimple delay={0} restMs={25} label="Takeout">
            <HeadAnchor
              size="$8"
              $sm={{
                display: forceShowAllLinks ? 'flex' : 'none',
              }}
            >
              🥡
            </HeadAnchor>
          </TooltipSimple>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink prefetch={false} href="/blog">
          <HeadAnchor>Blog</HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink prefetch={false} href="/community">
          <HeadAnchor>Community</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink prefetch={false} href="/studio">
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}
    </>
  )
}

const SmallMenu = React.memo(() => {
  const { open, setOpen } = useDocsMenu()

  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" stayInFrame={{ padding: 20 }}>
      <Popover.Trigger asChild>
        <Button
          size="$3"
          chromeless
          circular
          hoverStyle={{
            bc: 'transparent',
          }}
          noTextWrap
          onPress={() => setOpen(!open)}
          theme={open ? 'alt1' : undefined}
        >
          <Menu size={16} color="var(--color)" />
        </Button>
      </Popover.Trigger>

      <Adapt platform="touch" when="sm">
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
        animateOnly={['transform', 'opacity']}
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
            <HeaderLinks forceShowAllLinks />
            <Separator my="$4" w="100%" />
            <SponsorButton />
            <Separator my="$4" w="100%" />
            <DocsMenuContents />
          </YStack>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  )
})

const HeadAnchor = styled(Paragraph, {
  fontFamily: '$silkscreen',
  px: '$3',
  py: '$2',
  cursor: 'pointer',
  size: '$3',
  color: '$color10',
  hoverStyle: { opacity: 1, color: '$color' },
  pressStyle: { opacity: 0.25 },
  tabIndex: -1,
  w: '100%',
})
