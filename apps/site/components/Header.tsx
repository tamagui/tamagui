import { LogoWords, TamaguiLogo, tints } from '@tamagui/logo'
import { Menu } from '@tamagui/lucide-icons'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
  Button,
  Paragraph,
  ParagraphProps,
  Popover,
  Separator,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
  useMedia,
} from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { DocsMenuContents } from './DocsMenuContents'
import { GithubIcon } from './GithubIcon'
import { HeaderProps } from './HeaderProps'
import { SearchButton } from './SearchButton'
import { ThemeSearchButtonGroup } from './ThemeSearchButtonGroup'
import { useDocsMenu } from './useDocsMenu'
import { useTint } from './useTint'

export function Header(props: HeaderProps) {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isInSubApp = router.pathname.startsWith('/takeout') || router.pathname.startsWith('/studio')
  const { setNextTint, setTint } = useTint()

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
          <NextLink legacyBehavior href="/" passHref>
            <YStack px="$3" cur="pointer" tag="a" my={-20}>
              <TamaguiLogo downscale={props.floating ? 2 : 1.5} />
            </YStack>
          </NextLink>
        )}

        <ThemeSearchButtonGroup />

        <AlphaButton />

        {isInSubApp && (
          <NextLink legacyBehavior href="/">
            <Button size="$2">Back to Tamagui</Button>
          </NextLink>
        )}
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
        <NextLink legacyBehavior href="/" passHref>
          <XStack cursor={isHome ? 'default' : 'pointer'} pointerEvents="auto" tag="a" als="center">
            <LogoWords
              animated
              onHoverLetter={(i) => {
                React.startTransition(() => {
                  setTint(tints[i])
                })
              }}
            />
          </XStack>
        </NextLink>
      </XStack>

      {/*  prevent layout shift */}
      <XStack h={40} jc="flex-end" miw={204} $xxs={{ miw: 150 }} pointerEvents="auto" tag="nav">
        {isInSubApp ? (
          <XStack ai="center" space="$2">
            <NextLink legacyBehavior href="/signin" passHref>
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                tag="a"
                $xxs={{
                  display: 'none',
                }}
              >
                Login
              </Paragraph>
            </NextLink>

            <NextLink legacyBehavior href="/takeout/purchase" passHref>
              <Button fontFamily="$silkscreen" size="$3" tag="a">
                Purchase
              </Button>
            </NextLink>
          </XStack>
        ) : (
          <XStack ai="center" space="$3">
            <HeaderLinks {...props} />

            <SearchButton size="$2" br="$10" elevation="$4" />

            <NextLink legacyBehavior href="https://github.com/tamagui/tamagui" passHref>
              <YStack p="$2" opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
                <VisuallyHidden>
                  <Text>Github</Text>
                </VisuallyHidden>
                <GithubIcon width={23} />
              </YStack>
            </NextLink>

            <SmallMenu />
          </XStack>
        )}
      </XStack>
    </XStack>
  )
}

const HeaderLinks = ({ showExtra, forceShowAllLinks }: HeaderProps) => {
  return (
    <>
      <NextLink legacyBehavior prefetch={false} href="/docs/intro/installation" passHref>
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      <NextLink legacyBehavior prefetch={false} href="/blog" passHref>
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Blog
        </HeadAnchor>
      </NextLink>

      <NextLink legacyBehavior prefetch={false} href="/community" passHref>
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          More
        </HeadAnchor>
      </NextLink>

      {showExtra && (
        <NextLink legacyBehavior prefetch={false} href="/studio" passHref>
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink legacyBehavior prefetch={false} href="/takeout" passHref>
          <HeadAnchor>Takeout</HeadAnchor>
        </NextLink>
      )}
    </>
  )
}

const SmallMenu = React.memo(() => {
  const { router, open, setOpen } = useDocsMenu()
  // const isDocs = router.pathname.startsWith('/docs')
  const media = useMedia()

  if (media.gtMd) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" stayInFrame={{ padding: 20 }}>
      <Popover.Trigger asChild>
        <YStack
          $gtMd={{
            display: 'none',
          }}
        >
          <Button
            size="$3"
            chromeless
            noTextWrap
            onPress={() => setOpen(!open)}
            theme={open ? 'alt1' : undefined}
          >
            <Menu size={16} color="var(--color)" />
          </Button>
        </YStack>
      </Popover.Trigger>

      <Popover.Adapt when="sm">
        <Popover.Sheet zIndex={100000000} modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView>
              <Popover.Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay zIndex={100} />
        </Popover.Sheet>
      </Popover.Adapt>

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
        <Popover.Arrow bw={1} boc="$borderColor" />

        <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <YStack
            miw={230}
            p="$3"
            ai="flex-end"
            // display={open ? 'flex' : 'none'}
          >
            <HeaderLinks forceShowAllLinks />
            <Separator my="$4" w="100%" />
            <DocsMenuContents />
            <YStack h={400} />
          </YStack>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  )
})

const HeadAnchor = React.forwardRef((props: ParagraphProps, ref) => (
  <Paragraph
    ref={ref as any}
    fontFamily="$silkscreen"
    px="$3"
    py="$2"
    cursor="pointer"
    size="$3"
    opacity={0.65}
    hoverStyle={{ opacity: 1 }}
    pressStyle={{ opacity: 0.25 }}
    tag="a"
    // @ts-ignore
    tabIndex={-1}
    {...props}
  />
))
