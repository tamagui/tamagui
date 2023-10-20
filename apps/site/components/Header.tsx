import { ThemeToggle } from '@components/ThemeToggle'
import { getDefaultAvatarImage } from '@lib/avatar'
import { LogoWords, TamaguiLogo, ThemeTint, useTint } from '@tamagui/logo'
import { useUser } from 'hooks/useUser'
// import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
  Avatar,
  Text,
  TooltipGroup,
  TooltipSimple,
  VisuallyHidden,
  XGroup,
  XStack,
  YStack,
  isClient,
} from 'tamagui'

import { ColorToggleButton } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { GithubIcon } from './GithubIcon'
import { HeaderLinks } from './HeaderLinks'
import { HeaderMenu } from './HeaderMenu'
import { HeaderProps } from './HeaderProps'
import { NextLink } from './NextLink'
import { SearchButton } from './SearchButton'
import { SeasonToggleButton } from './SeasonToggleButton'
import { SponsorButton } from './SponsorButton'

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
        <XStack width="100%" maw={1120} pos="relative">
          <XStack
            className={`ease-out all ms200 ${
              isScrolled ? 'blur-medium hover-highlights ' : ''
            }`}
            bbc="$borderColor"
            py="$1"
            y={3}
            ov="hidden"
            contain="paint"
            width="100%"
            bw={1}
            boc="transparent"
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
                boc: '$borderColor',
              },
            })}
          >
            <YStack o={isScrolled ? 0.75 : 0} fullscreen bc="$background" />
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
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className={`ease-out all ms200`}
            zi={-1}
            br="$10"
            fullscreen
            {...(isScrolled && {
              $gtSm: {
                py: '$2',
                y: 5,
                elevation: '$3',
                boc: '$borderColor',
              },
            })}
          />
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
            <YStack tag="a" px="$3" cur="pointer" my={-20}>
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

        <YStack $md={{ display: 'none' }}>
          <SponsorButton tiny />
        </YStack>
      </XStack>

      <XStack
        position="absolute"
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
            tag="a"
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
                      width: 28,
                      height: 28,
                      uri:
                        userSwr.data.userDetails?.avatar_url ||
                        getDefaultAvatarImage(
                          userSwr.data?.userDetails?.full_name ||
                            userSwr.data?.session?.user?.email ||
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
                <YStack tag="a" p="$2" opacity={0.7} hoverStyle={{ opacity: 1 }}>
                  <VisuallyHidden>
                    <Text>Github</Text>
                  </VisuallyHidden>
                  <GithubIcon width={23} />
                </YStack>
              </TooltipSimple>
            </NextLink>
          )}

          <HeaderMenu />
        </XStack>
      </XStack>
    </XStack>
  )
})
