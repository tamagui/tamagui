import { Menu } from '@tamagui/feather-icons'
import { LogoWords, TamaguiLogo, tints } from '@tamagui/logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  Paragraph,
  ParagraphProps,
  Popover,
  Text,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'

import { ContainerLarge } from './Container'
import { DocsMenuContents } from './DocsMenuContents'
import { GithubIcon } from './GithubIcon'
import { HeaderFloating } from './HeaderFloating'
import { HeaderProps } from './HeaderProps'
import { SearchButton } from './SearchButton'
import { ThemeSearchButtonGroup } from './ThemeSearchButtonGroup'
import { useDocsMenu } from './useDocsMenu'
import { useTint } from './useTint'

export const HeaderIndependent = ({
  alwaysFloating = true,
  ...props
}: Omit<HeaderProps, 'floating'> & {
  alwaysFloating?: boolean
}) => {
  return (
    <>
      <ContainerLarge o={alwaysFloating ? 0 : 1} pe={alwaysFloating ? 'none' : 'auto'}>
        <Header {...props} />
      </ContainerLarge>
      <HeaderFloating alwaysFloating={alwaysFloating} {...props} />
    </>
  )
}

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
      zi={1}
    >
      <XStack ai="center" space="$6">
        {isHome ? (
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo onPress={setNextTint} downscale={props.floating ? 2 : 1.5} />
          </YStack>
        ) : (
          <NextLink href="/" passHref>
            <YStack cursor="pointer" tag="a" my={-20}>
              <TamaguiLogo onPress={setNextTint} downscale={props.floating ? 2 : 1.5} />
            </YStack>
          </NextLink>
        )}

        <ThemeSearchButtonGroup />

        {isInSubApp && (
          <NextLink href="/">
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
        <NextLink href="/" passHref>
          <XStack pointerEvents="auto" tag="a" als="center">
            <LogoWords animated onHoverLetter={(i) => setTint(tints[i])} />
          </XStack>
        </NextLink>
      </XStack>

      {/*  prevent layout shift */}
      <XStack h={40} jc="flex-end" miw={204} $xxs={{ miw: 150 }} pointerEvents="auto" tag="nav">
        {isInSubApp ? (
          <XStack ai="center" space="$2">
            <NextLink href="/signin" passHref>
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

            <NextLink href="/takeout/purchase" passHref>
              <Button fontFamily="$silkscreen" size="$3" tag="a">
                Purchase
              </Button>
            </NextLink>
          </XStack>
        ) : (
          <XStack ai="center" space="$2">
            <HeaderLinks {...props} />

            <SearchButton size="$2" br="$10" elevation="$4" />

            <NextLink href="https://github.com/tamagui/tamagui" passHref>
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

const HeaderLinks = ({ showExtra }: HeaderProps) => {
  return (
    <>
      <NextLink prefetch={false} href="/docs/intro/installation" passHref>
        <HeadAnchor
          $sm={{
            display: 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      <NextLink prefetch={false} href="/community" passHref>
        <HeadAnchor
          $md={{
            display: 'none',
          }}
        >
          Community
        </HeadAnchor>
      </NextLink>

      {showExtra && (
        <NextLink prefetch={false} href="/studio" passHref>
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink prefetch={false} href="/takeout" passHref>
          <HeadAnchor>Takeout</HeadAnchor>
        </NextLink>
      )}
    </>
  )
}

const SmallMenu = React.memo(() => {
  const { router, open, setOpen } = useDocsMenu()
  const isDocs = router.pathname.startsWith('/docs')

  return (
    <Popover sheetBreakpoint="sm" size="$5">
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

      <Popover.Sheet modal dismissOnSnapToBottom>
        <Popover.Sheet.Frame padding="$4">
          <Popover.Sheet.ScrollView>
            <Popover.SheetContents />
          </Popover.Sheet.ScrollView>
        </Popover.Sheet.Frame>
        <Popover.Sheet.Overlay />
      </Popover.Sheet>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
        animation="bouncy"
        elevate
      >
        <Popover.Arrow bw={1} boc="$borderColor" />

        {isDocs && (
          <YStack
            miw={280}
            // display={open ? 'flex' : 'none'}
          >
            <HeaderLinks />
            <DocsMenuContents />
          </YStack>
        )}
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
    o={0.7}
    hoverStyle={{ opacity: 1 }}
    pressStyle={{ opacity: 0.5 }}
    tag="a"
    {...props}
  />
))
