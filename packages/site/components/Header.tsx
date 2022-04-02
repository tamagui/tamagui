import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import React from 'react'
import { Paragraph, Spacer, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { GithubIcon } from './GithubIcon'

export function Header() {
  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      py="$4"
      px="$4"
      jc="space-between"
      p="relative"
      zi={1}
    >
      <NextLink href="/" passHref>
        <YStack cursor="pointer" tag="a" my={-20}>
          <VisuallyHidden>
            <Text>Tamagui homepage</Text>
          </VisuallyHidden>

          <TamaguiLogo />
        </YStack>
      </NextLink>

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

          <AlphaButton />

          <NextLink href="https://github.com/tamagui/tamagui" passHref>
            <YStack px="$3" opacity={0.6} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
              <VisuallyHidden>
                <Text>Github</Text>
              </VisuallyHidden>
              <GithubIcon width={22} />
            </YStack>
          </NextLink>

          <Spacer size="$2" />

          <ThemeToggle />
        </XStack>
      </XStack>
    </XStack>
  )
}
