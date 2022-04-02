import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import React from 'react'
import { Paragraph, Spacer, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { useTint } from './ColorToggleButton'
import { GithubIcon } from './GithubIcon'

export function Header({ floating }: { floating?: boolean }) {
  const { setNextTint } = useTint()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      py={floating ? 0 : '$2'}
      px="$4"
      jc="space-between"
      p="relative"
      zi={1}
    >
      <XStack ai="center" space="$4">
        <YStack cursor="pointer" tag="a" my={-20}>
          <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 2} />
        </YStack>

        {!floating && <AlphaButton />}
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
            <LogoWords />
          </XStack>
        </NextLink>
      </XStack>

      <XStack pointerEvents="auto" tag="nav">
        <XStack ai="center">
          <NextLink href="/docs/intro/installation" passHref>
            <Paragraph
              p="$2"
              px="$3"
              cursor="pointer"
              size="$3"
              opacity={0.5}
              hoverStyle={{ opacity: 1 }}
              tag="a"
            >
              Docs
            </Paragraph>
          </NextLink>

          <NextLink href="/blog" passHref>
            <Paragraph
              p="$2"
              px="$3"
              cursor="pointer"
              size="$3"
              opacity={0.5}
              hoverStyle={{ opacity: 1 }}
              tag="a"
            >
              Blog
            </Paragraph>
          </NextLink>

          <Spacer size="$2" />

          <ThemeToggle />
        </XStack>
      </XStack>
    </XStack>
  )
}
