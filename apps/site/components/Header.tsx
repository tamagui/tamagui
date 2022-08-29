import { LogoWords, tints } from '@tamagui/logo'
import { TamaguiLogo } from '@tamagui/logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Button, Paragraph, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { GithubIcon } from './GithubIcon'
import { HeaderFloating } from './HeaderFloating'
import { ThemeSearchButtonGroup } from './ThemeSearchButtonGroup'

export const HeaderIndependent = ({ disableNew }: { disableNew?: boolean }) => {
  return (
    <>
      <ContainerLarge>
        <Header disableNew={disableNew} />
      </ContainerLarge>
      <HeaderFloating disableNew={disableNew} />
    </>
  )
}

export function Header({ floating, disableNew }: { floating?: boolean; disableNew?: boolean }) {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isTakeout = router.pathname.startsWith('/takeout')
  const { setNextTint, setTint } = useTint()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      jc="space-between"
      pos="relative"
      py={floating ? 0 : '$2'}
      zi={1}
    >
      <XStack ai="center" space="$6">
        {isHome ? (
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 1.5} />
          </YStack>
        ) : (
          <NextLink href="/" passHref>
            <YStack cursor="pointer" tag="a" my={-20}>
              <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 1.5} />
            </YStack>
          </NextLink>
        )}

        <ThemeSearchButtonGroup />

        {/* {isTakeout && (
          <Link href="/takeout">
            <Button size="$2">Back to takeout</Button>
          </Link>
        )} */}
      </XStack>

      <XStack
        position="absolute"
        $sm={{
          display: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <NextLink href="/" passHref>
          <XStack pointerEvents="auto" tag="a" als="center">
            <LogoWords onHoverLetter={(i) => setTint(tints[i])} />
          </XStack>
        </NextLink>
      </XStack>

      {/*  prevent layout shift */}
      <XStack h={40} jc="flex-end" miw={204} $xxs={{ miw: 150 }} pointerEvents="auto" tag="nav">
        {isTakeout ? (
          <XStack ai="center" space="$2">
            <NextLink href="/signin" passHref>
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
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
            <NextLink prefetch={false} href="/docs/intro/installation" passHref>
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                pressStyle={{ opacity: 0.5 }}
                tag="a"
              >
                Docs
              </Paragraph>
            </NextLink>

            <NextLink prefetch={false} href="/community" passHref>
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                pressStyle={{ opacity: 0.5 }}
                tag="a"
                $xxs={{
                  display: 'none',
                }}
              >
                Community
              </Paragraph>
            </NextLink>

            {!disableNew && <AlphaButton />}

            <NextLink href="https://github.com/tamagui/tamagui" passHref>
              <YStack p="$2" opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
                <VisuallyHidden>
                  <Text>Github</Text>
                </VisuallyHidden>
                <GithubIcon width={23} />
              </YStack>
            </NextLink>
          </XStack>
        )}
      </XStack>
    </XStack>
  )
}
