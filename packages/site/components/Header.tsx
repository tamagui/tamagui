import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import { ExternalLink } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import React from 'react'
import { Button, Paragraph, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { DiscordIcon } from './DiscordIcon'
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
        <LogoWords />
      </XStack>

      <XStack pointerEvents="auto" tag="nav" ai="center" space="$6">
        <NextLink href="/docs/intro/installation" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Docs
          </Paragraph>
        </NextLink>

        <NextLink href="/blog" passHref>
          <Paragraph size="$3" opacity={0.5} hoverStyle={{ opacity: 1 }} tag="a">
            Blog
          </Paragraph>
        </NextLink>

        <NextLink href="/blog/introducing-tamagui" passHref>
          <YStack tag="a" mx={-5} $sm={{ display: 'none' }}>
            <Button theme="orange" br="$6">
              Alpha
            </Button>
          </YStack>
        </NextLink>

        <ThemeToggle />
      </XStack>
    </XStack>
  )
}
